import { NextRequest } from 'next/server';
import { createServerClient, ORG_ID } from '@/lib/supabase';
import { apiSuccess, apiError, parsePagination, emitEvent } from '@/lib/api-helpers';

// ============================================================
// GET /api/integrations — List connections, single connection, or logs
// ============================================================
export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const params = req.nextUrl.searchParams;
    const { page, limit, offset } = parsePagination(params);
    const type = params.get('type') || 'connections';

    // --- Integration logs ---
    if (type === 'logs') {
      const connectionId = params.get('connection_id');
      if (!connectionId) return apiError('connection_id required for logs');
      let query = supabase
        .from('integration_logs')
        .select('*', { count: 'exact' })
        .eq('connection_id', connectionId)
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });
      const dateFrom = params.get('date_from');
      if (dateFrom) query = query.gte('created_at', dateFrom);
      const { data, error, count } = await query;
      if (error) return apiError(error.message, 500);
      return apiSuccess(data, { total: count || 0, page, limit });
    }

    // --- Single connection by ID ---
    const id = params.get('id');
    if (id) {
      const { data, error } = await supabase
        .from('integration_connections')
        .select('*')
        .eq('id', id)
        .single();
      if (error) return apiError(error.message, 500);
      return apiSuccess(data);
    }

    // --- All connections (default) ---
    let query = supabase
      .from('integration_connections')
      .select('*', { count: 'exact' })
      .eq('organization_id', ORG_ID)
      .is('deleted_at', null)
      .range(offset, offset + limit - 1)
      .order('integration_name');

    const category = params.get('category');
    const status = params.get('status');
    const search = params.get('search');
    if (category && category !== 'all') query = query.eq('category', category);
    if (status && status !== 'all') query = query.eq('status', status);
    if (search) query = query.ilike('integration_name', `%${search}%`);

    const { data, error, count } = await query;
    if (error) return apiError(error.message, 500);
    return apiSuccess(data, { total: count || 0, page, limit });
  } catch {
    return apiError('Internal server error', 500);
  }
}

// ============================================================
// POST /api/integrations — Connect, test, sync, or log
// ============================================================
export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();
    const action = body.action || 'connect';

    // --- Test connection ---
    if (action === 'test') {
      // In production, this would hit the provider's API with stored creds
      return apiSuccess({ tested: true, integration_name: body.integration_name, status: 'ok', latency_ms: Math.floor(Math.random() * 200 + 50) });
    }

    // --- Trigger sync ---
    if (action === 'sync') {
      if (!body.id) return apiError('id required');
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('integration_connections')
        .update({ last_sync_at: now, last_sync_status: 'success', updated_at: now })
        .eq('id', body.id)
        .select()
        .single();
      if (error) return apiError(error.message, 500);

      // Write to integration_logs
      await supabase.from('integration_logs').insert({
        organization_id: ORG_ID,
        integration_name: data.integration_name,
        action: 'sync',
        status: 'success',
        details: { triggered_by: 'manual', records: data.records_synced },
      });

      await emitEvent('integration.sync_triggered', { id: body.id, integration_name: data.integration_name });
      return apiSuccess(data);
    }

    // --- Connect new integration ---
    if (!body.integration_name) return apiError('Missing integration_name');
    const { data, error } = await supabase
      .from('integration_connections')
      .insert({
        organization_id: ORG_ID,
        integration_name: body.integration_name,
        category: body.category || 'other',
        status: 'connected',
        sync_frequency: body.sync_frequency || 'manual',
        config: body.config || {},
        api_key_encrypted: body.api_key || null,
        webhook_url: body.webhook_url || null,
        health_score: 100,
        records_synced: 0,
        error_count: 0,
      })
      .select()
      .single();
    if (error) return apiError(error.message, 500);
    await emitEvent('integration.connected', { id: data.id, integration_name: data.integration_name });
    return apiSuccess(data);
  } catch {
    return apiError('Internal server error', 500);
  }
}

// ============================================================
// PATCH /api/integrations — Update, disconnect, reconnect
// ============================================================
export async function PATCH(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();
    if (!body.id) return apiError('Missing id');
    const action = body.action;
    const now = new Date().toISOString();

    // --- Disconnect ---
    if (action === 'disconnect') {
      const { data, error } = await supabase
        .from('integration_connections')
        .update({ status: 'disconnected', api_key_encrypted: null, oauth_token_encrypted: null, updated_at: now })
        .eq('id', body.id)
        .select()
        .single();
      if (error) return apiError(error.message, 500);
      await supabase.from('integration_logs').insert({
        organization_id: ORG_ID, integration_name: data.integration_name,
        action: 'disconnect', status: 'success', details: {},
      });
      await emitEvent('integration.disconnected', { id: data.id, integration_name: data.integration_name });
      return apiSuccess(data);
    }

    // --- Reconnect ---
    if (action === 'reconnect') {
      const { data, error } = await supabase
        .from('integration_connections')
        .update({ status: 'connected', health_score: 100, error_count: 0, last_sync_status: null, updated_at: now })
        .eq('id', body.id)
        .select()
        .single();
      if (error) return apiError(error.message, 500);
      await supabase.from('integration_logs').insert({
        organization_id: ORG_ID, integration_name: data.integration_name,
        action: 'reconnect', status: 'success', details: {},
      });
      return apiSuccess(data);
    }

    // --- Generic update (config, sync_frequency, webhook_url, etc.) ---
    const updates: Record<string, unknown> = { updated_at: now };
    const allowedFields = ['integration_name', 'category', 'sync_frequency', 'config', 'status', 'webhook_url', 'health_score'];
    for (const f of allowedFields) {
      if (body[f] !== undefined) updates[f] = body[f];
    }
    const { data, error } = await supabase
      .from('integration_connections')
      .update(updates)
      .eq('id', body.id)
      .select()
      .single();
    if (error) return apiError(error.message, 500);
    return apiSuccess(data);
  } catch {
    return apiError('Internal server error', 500);
  }
}

// ============================================================
// DELETE /api/integrations — Soft-delete connection
// ============================================================
export async function DELETE(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const { id } = await req.json();
    if (!id) return apiError('Missing id');
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('integration_connections')
      .update({ deleted_at: now, status: 'disconnected' })
      .eq('id', id)
      .select()
      .single();
    if (error) return apiError(error.message, 500);
    return apiSuccess({ deleted: true, id: data.id });
  } catch {
    return apiError('Internal server error', 500);
  }
}
