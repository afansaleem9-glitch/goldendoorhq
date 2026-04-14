import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiSuccess, apiError } from '@/lib/api-helpers';

/*
 * BIDIRECTIONAL SYNC API
 * Handles data sync between goldendoorhq.com (CRM) and goldendoorapp.com (sales app)
 *
 * POST /api/sync — Push batch data from CRM to goldendoorapp.com
 * PUT /api/sync — Receive batch updates from goldendoorapp.com into CRM
 *
 * Sync protocol:
 * 1. Each record has a `last_synced_at` timestamp
 * 2. Conflict resolution: last_write_wins (most recent updated_at)
 * 3. Sync log tracks every operation for debugging
 */

const SYNCABLE_TABLES = ['contacts', 'companies', 'deals', 'tasks', 'tickets', 'solar_projects'] as const;
type SyncableTable = typeof SYNCABLE_TABLES[number];

// POST /api/sync — Push CRM data to goldendoorapp.com (outbound sync)
export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();

    const { table, since, organization_id } = body;

    if (!table || !SYNCABLE_TABLES.includes(table as SyncableTable)) {
      return apiError(`Invalid table. Must be one of: ${SYNCABLE_TABLES.join(', ')}`);
    }
    if (!organization_id) return apiError('Missing organization_id');

    // Get records modified since last sync
    let query = supabase
      .from(table)
      .select('*')
      .eq('organization_id', organization_id)
      .order('updated_at', { ascending: true })
      .limit(500);

    if (since) {
      query = query.gt('updated_at', since);
    }

    const { data, error } = await query;
    if (error) return apiError(error.message, 500);

    // Log the sync operation
    await supabase.from('audit_log').insert({
      organization_id,
      entity_type: 'sync',
      entity_id: null,
      action: 'outbound_sync',
      changes: { table, record_count: data?.length || 0, since },
    });

    return apiSuccess({
      table,
      records: data || [],
      count: data?.length || 0,
      synced_at: new Date().toISOString(),
    });
  } catch {
    return apiError('Internal server error', 500);
  }
}

// PUT /api/sync — Receive data from goldendoorapp.com (inbound sync)
export async function PUT(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();

    // Validate API key from goldendoorapp.com
    const authHeader = req.headers.get('authorization');
    const expectedKey = process.env.GOLDENDOORAPP_SYNC_KEY;
    if (expectedKey && authHeader !== `Bearer ${expectedKey}`) {
      return apiError('Unauthorized', 401);
    }

    const { table, records, organization_id } = body;

    if (!table || !SYNCABLE_TABLES.includes(table as SyncableTable)) {
      return apiError(`Invalid table. Must be one of: ${SYNCABLE_TABLES.join(', ')}`);
    }
    if (!records || !Array.isArray(records)) return apiError('Missing records array');
    if (!organization_id) return apiError('Missing organization_id');

    const results: { id: string; status: 'created' | 'updated' | 'skipped' | 'error'; error?: string }[] = [];

    for (const record of records) {
      try {
        // Check if record already exists (by external_id or crm_id mapping)
        const externalId = record.external_id || record.app_id;

        if (externalId) {
          // Try to find existing record by external mapping
          const { data: existing } = await supabase
            .from(table)
            .select('id, updated_at')
            .eq('organization_id', organization_id)
            .eq('external_id', externalId)
            .single();

          if (existing) {
            // Conflict resolution: last_write_wins
            const existingUpdated = new Date(existing.updated_at).getTime();
            const incomingUpdated = new Date(record.updated_at || 0).getTime();

            if (incomingUpdated > existingUpdated) {
              const { error } = await supabase
                .from(table)
                .update({ ...record, organization_id, last_synced_at: new Date().toISOString() })
                .eq('id', existing.id);

              results.push({ id: existing.id, status: error ? 'error' : 'updated', error: error?.message });
            } else {
              results.push({ id: existing.id, status: 'skipped' });
            }
          } else {
            // Create new record
            const { data: created, error } = await supabase
              .from(table)
              .insert({ ...record, organization_id, external_id: externalId, last_synced_at: new Date().toISOString() })
              .select('id')
              .single();

            results.push({
              id: created?.id || externalId,
              status: error ? 'error' : 'created',
              error: error?.message,
            });
          }
        } else {
          results.push({ id: 'unknown', status: 'error', error: 'Missing external_id or app_id' });
        }
      } catch (err) {
        results.push({ id: record.id || 'unknown', status: 'error', error: String(err) });
      }
    }

    // Log inbound sync
    await supabase.from('audit_log').insert({
      organization_id,
      entity_type: 'sync',
      entity_id: null,
      action: 'inbound_sync',
      changes: {
        table,
        total: records.length,
        created: results.filter(r => r.status === 'created').length,
        updated: results.filter(r => r.status === 'updated').length,
        skipped: results.filter(r => r.status === 'skipped').length,
        errors: results.filter(r => r.status === 'error').length,
      },
    });

    return apiSuccess({
      table,
      results,
      synced_at: new Date().toISOString(),
    });
  } catch {
    return apiError('Internal server error', 500);
  }
}

// GET /api/sync — Get sync status
export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const params = req.nextUrl.searchParams;
    const orgId = params.get('organization_id');

    if (!orgId) return apiError('Missing organization_id');

    // Get last sync times for each table
    const syncStatus: Record<string, unknown> = {};

    for (const table of SYNCABLE_TABLES) {
      const { data } = await supabase
        .from('audit_log')
        .select('created_at, changes')
        .eq('organization_id', orgId)
        .eq('entity_type', 'sync')
        .eq('action', 'outbound_sync')
        .contains('changes', { table })
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      syncStatus[table] = {
        last_synced_at: data?.created_at || null,
        details: data?.changes || null,
      };
    }

    return apiSuccess(syncStatus);
  } catch {
    return apiError('Internal server error', 500);
  }
}
