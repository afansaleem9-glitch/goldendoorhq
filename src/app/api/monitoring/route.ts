import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiSuccess, apiError, parsePagination, validateRequired, emitEvent } from '@/lib/api-helpers';

// GET /api/monitoring — List systems, alerts, or readings
export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const params = req.nextUrl.searchParams;
    const { page, limit, offset } = parsePagination(params);
    const type = params.get('type') || 'systems';

    if (type === 'systems') {
      let query = supabase.from('monitored_systems').select('*', { count: 'exact' })
        .is('deleted_at', null).range(offset, offset + limit - 1).order('created_at', { ascending: false });
      const status = params.get('status');
      const provider = params.get('provider');
      if (status) query = query.eq('status', status);
      if (provider) query = query.eq('monitoring_provider', provider);
      const { data, error, count } = await query;
      if (error) return apiError(error.message, 500);
      return apiSuccess(data, { total: count || 0, page, limit });
    }

    if (type === 'alerts') {
      let query = supabase.from('system_alerts').select('*', { count: 'exact' })
        .range(offset, offset + limit - 1).order('created_at', { ascending: false });
      const severity = params.get('severity');
      const isResolved = params.get('is_resolved');
      const systemId = params.get('system_id');
      if (severity) query = query.eq('severity', severity);
      if (isResolved !== null) query = query.eq('is_resolved', isResolved === 'true');
      if (systemId) query = query.eq('system_id', systemId);
      const { data, error, count } = await query;
      if (error) return apiError(error.message, 500);
      return apiSuccess(data, { total: count || 0, page, limit });
    }

    if (type === 'readings') {
      let query = supabase.from('system_readings').select('*', { count: 'exact' })
        .range(offset, offset + limit - 1).order('recorded_at', { ascending: false });
      const systemId = params.get('system_id');
      const readingType = params.get('reading_type');
      const startDate = params.get('start_date');
      const endDate = params.get('end_date');
      if (systemId) query = query.eq('system_id', systemId);
      if (readingType) query = query.eq('reading_type', readingType);
      if (startDate) query = query.gte('recorded_at', startDate);
      if (endDate) query = query.lte('recorded_at', endDate);
      const { data, error, count } = await query;
      if (error) return apiError(error.message, 500);
      return apiSuccess(data, { total: count || 0, page, limit });
    }

    return apiError('Invalid type parameter');
  } catch {
    return apiError('Internal server error', 500);
  }
}

// POST /api/monitoring — Create system, alert, or bulk readings
export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();
    const type = body.type;

    if (type === 'system') {
      const missing = validateRequired(body, ['system_name', 'monitoring_provider', 'system_size_kw']);
      if (missing) return apiError(missing);

      const { data, error } = await supabase.from('monitored_systems').insert({
        organization_id: body.organization_id, project_id: body.project_id,
        contact_id: body.contact_id, system_name: body.system_name,
        monitoring_provider: body.monitoring_provider,
        monitoring_system_id: body.monitoring_system_id,
        system_size_kw: body.system_size_kw, status: 'active', alerts_enabled: true,
      }).select().single();
      if (error) return apiError(error.message, 500);

      await emitEvent('monitoring.system_created', { systemId: data.id, name: data.system_name });
      return apiSuccess(data);
    }

    if (type === 'alert') {
      const missing = validateRequired(body, ['system_id', 'alert_type', 'severity', 'title']);
      if (missing) return apiError(missing);

      const { data, error } = await supabase.from('system_alerts').insert({
        organization_id: body.organization_id, system_id: body.system_id,
        alert_type: body.alert_type, severity: body.severity,
        title: body.title, description: body.description, is_resolved: false,
      }).select().single();
      if (error) return apiError(error.message, 500);

      await emitEvent('monitoring.alert_created', { alertId: data.id, severity: data.severity });
      return apiSuccess(data);
    }

    if (type === 'readings') {
      const missing = validateRequired(body, ['readings']);
      if (missing) return apiError(missing);

      const readings = body.readings;
      if (!Array.isArray(readings) || readings.length === 0) {
        return apiError('readings must be a non-empty array');
      }

      const { data, error } = await supabase.from('system_readings').insert(readings).select();
      if (error) return apiError(error.message, 500);

      await emitEvent('monitoring.readings_created', { count: data.length });
      return apiSuccess(data);
    }

    return apiError('Invalid type parameter');
  } catch {
    return apiError('Internal server error', 500);
  }
}

// PATCH /api/monitoring — Update system, acknowledge/resolve alerts, update readings
export async function PATCH(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();
    if (!body.id) return apiError('Missing id');
    const action = body.action;

    // Update live readings on a system
    if (action === 'update_readings') {
      const updates: Record<string, unknown> = { last_reading_at: new Date().toISOString() };
      const readingFields = ['current_power_w', 'today_production_kwh', 'month_production_kwh', 'year_production_kwh', 'lifetime_production_kwh', 'performance_ratio'];
      for (const f of readingFields) { if (body[f] !== undefined) updates[f] = body[f]; }

      const { data, error } = await supabase.from('monitored_systems')
        .update(updates).eq('id', body.id).select().single();
      if (error) return apiError(error.message, 500);

      await emitEvent('monitoring.readings_updated', { systemId: data.id });
      return apiSuccess(data);
    }

    // Acknowledge an alert
    if (action === 'acknowledge_alert') {
      if (!body.acknowledged_by) return apiError('acknowledged_by is required');
      const { data, error } = await supabase.from('system_alerts')
        .update({ acknowledged_at: new Date().toISOString(), acknowledged_by: body.acknowledged_by })
        .eq('id', body.id).select().single();
      if (error) return apiError(error.message, 500);

      await emitEvent('monitoring.alert_acknowledged', { alertId: data.id });
      return apiSuccess(data);
    }

    // Resolve an alert
    if (action === 'resolve_alert') {
      if (!body.resolved_by) return apiError('resolved_by is required');
      const { data, error } = await supabase.from('system_alerts')
        .update({ is_resolved: true, resolved_at: new Date().toISOString(), resolved_by: body.resolved_by })
        .eq('id', body.id).select().single();
      if (error) return apiError(error.message, 500);

      await emitEvent('monitoring.alert_resolved', { alertId: data.id });
      return apiSuccess(data);
    }

    // Generic system update
    const updates: Record<string, unknown> = {};
    const fields = ['system_name', 'monitoring_provider', 'monitoring_system_id', 'system_size_kw', 'status', 'alerts_enabled'];
    for (const f of fields) { if (body[f] !== undefined) updates[f] = body[f]; }

    if (Object.keys(updates).length === 0) return apiError('No valid fields to update');

    const { data, error } = await supabase.from('monitored_systems')
      .update(updates).eq('id', body.id).select().single();
    if (error) return apiError(error.message, 500);

    await emitEvent('monitoring.system_updated', { systemId: data.id });
    return apiSuccess(data);
  } catch {
    return apiError('Internal server error', 500);
  }
}

// DELETE /api/monitoring — Soft delete system
export async function DELETE(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const { id } = await req.json();
    if (!id) return apiError('Missing id');
    const { error } = await supabase.from('monitored_systems')
      .update({ deleted_at: new Date().toISOString() }).eq('id', id);
    if (error) return apiError(error.message, 500);
    return apiSuccess({ deleted: true });
  } catch {
    return apiError('Internal server error', 500);
  }
}
