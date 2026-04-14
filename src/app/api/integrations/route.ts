import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiSuccess, apiError, parsePagination, emitEvent } from '@/lib/api-helpers';

// GET /api/integrations — List connections or logs
export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const params = req.nextUrl.searchParams;
    const { page, limit, offset } = parsePagination(params);
    const type = params.get('type') || 'connections';

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

    // Default: connections
    let query = supabase
      .from('integration_connections')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('provider');
    const provider = params.get('provider');
    const status = params.get('status');
    if (provider) query = query.eq('provider', provider);
    if (status) query = query.eq('status', status);
    const { data, error, count } = await query;
    if (error) return apiError(error.message, 500);
    return apiSuccess(data, { total: count || 0, page, limit });
  } catch {
    return apiError('Internal server error', 500);
  }
}

// POST /api/integrations — Connect or test integration
export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();
    const action = body.action || 'connect';

    if (action === 'test') {
      // Placeholder: test connection without saving
      return apiSuccess({ tested: true, provider: body.provider, status: 'ok' });
    }

    if (action === 'sync') {
      if (!body.connection_id) return apiError('connection_id required');
      await emitEvent('integration.sync_triggered', { connectionId: body.connection_id, provider: body.provider });
      await supabase.from('integration_connections').update({ last_sync_at: new Date().toISOString() }).eq('id', body.connection_id);
      return apiSuccess({ synced: true });
    }

    // Connect
    if (!body.provider) return apiError('Missing provider');
    const { data, error } = await supabase
      .from('integration_connections')
      .insert({
        organization_id: body.organization_id, provider: body.provider,
        status: 'active', display_name: body.display_name || body.provider,
        credentials_encrypted: body.credentials, scopes: body.scopes || [],
        webhook_url: body.webhook_url, sync_frequency: body.sync_frequency || 'manual',
        config: body.config || {}, connected_by: body.connected_by,
        connected_at: new Date().toISOString(),
      })
      .select().single();
    if (error) return apiError(error.message, 500);
    await emitEvent('integration.connected', { connectionId: data.id, provider: data.provider });
    return apiSuccess(data);
  } catch {
    return apiError('Internal server error', 500);
  }
}

// PATCH /api/integrations — Update, disconnect, refresh
export async function PATCH(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();
    if (!body.id) return apiError('Missing id');
    const action = body.action;

    if (action === 'disconnect') {
      const { data, error } = await supabase.from('integration_connections')
        .update({ status: 'inactive', credentials_encrypted: null, refresh_token_encrypted: null })
        .eq('id', body.id).select().single();
      if (error) return apiError(error.message, 500);
      await emitEvent('integration.disconnected', { connectionId: data.id, provider: data.provider });
      return apiSuccess(data);
    }

    if (action === 'refresh_token') {
      // Placeholder for OAuth token refresh
      const { data, error } = await supabase.from('integration_connections')
        .update({ token_expires_at: new Date(Date.now() + 3600000).toISOString(), last_error: null, status: 'active' })
        .eq('id', body.id).select().single();
      if (error) return apiError(error.message, 500);
      return apiSuccess(data);
    }

    // Generic update
    const updates: Record<string, unknown> = {};
    const fields = ['display_name', 'webhook_url', 'sync_frequency', 'config', 'status', 'last_error', 'credentials_encrypted'];
    for (const f of fields) { if (body[f] !== undefined) updates[f] = body[f]; }
    const { data, error } = await supabase.from('integration_connections').update(updates).eq('id', body.id).select().single();
    if (error) return apiError(error.message, 500);
    return apiSuccess(data);
  } catch {
    return apiError('Internal server error', 500);
  }
}

// DELETE /api/integrations — Hard delete connection + logs
export async function DELETE(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const { id } = await req.json();
    if (!id) return apiError('Missing id');
    // Logs cascade via FK ON DELETE CASCADE
    const { error } = await supabase.from('integration_connections').delete().eq('id', id);
    if (error) return apiError(error.message, 500);
    return apiSuccess({ deleted: true });
  } catch {
    return apiError('Internal server error', 500);
  }
}
