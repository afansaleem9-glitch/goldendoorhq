import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiSuccess, apiError, parsePagination, validateRequired, emitEvent } from '@/lib/api-helpers';

// GET /api/scheduling — List schedule entries or crew members
export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const params = req.nextUrl.searchParams;
    const { page, limit, offset } = parsePagination(params);
    const type = params.get('type') || 'entries';

    if (type === 'crew') {
      let query = supabase.from('crew_members').select('*', { count: 'exact' }).is('deleted_at', null).range(offset, offset + limit - 1).order('name');
      const status = params.get('status');
      if (status) query = query.eq('availability_status', status);
      const active = params.get('active');
      if (active === 'true') query = query.eq('is_active', true);
      const { data, error, count } = await query;
      if (error) return apiError(error.message, 500);
      return apiSuccess(data, { total: count || 0, page, limit });
    }

    // Default: schedule entries
    let query = supabase.from('schedule_entries').select('*', { count: 'exact' }).is('deleted_at', null).range(offset, offset + limit - 1).order('scheduled_date', { ascending: true });
    const dateFrom = params.get('date_from');
    const dateTo = params.get('date_to');
    const entryType = params.get('entry_type');
    const status = params.get('status');
    if (dateFrom) query = query.gte('scheduled_date', dateFrom);
    if (dateTo) query = query.lte('scheduled_date', dateTo);
    if (entryType) query = query.eq('entry_type', entryType);
    if (status) query = query.eq('status', status);
    const { data, error, count } = await query;
    if (error) return apiError(error.message, 500);
    return apiSuccess(data, { total: count || 0, page, limit });
  } catch {
    return apiError('Internal server error', 500);
  }
}

// POST /api/scheduling — Create schedule entry with crew assignments
export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();
    const missing = validateRequired(body, ['title', 'entry_type', 'scheduled_date']);
    if (missing) return apiError(missing);

    const { data, error } = await supabase.from('schedule_entries').insert({
      organization_id: body.organization_id, project_id: body.project_id,
      entry_type: body.entry_type, title: body.title, description: body.description,
      scheduled_date: body.scheduled_date, start_time: body.start_time, end_time: body.end_time,
      duration_hours: body.duration_hours, lead_installer_id: body.lead_installer_id,
      status: 'scheduled', address: body.address, city: body.city, state: body.state,
      zip: body.zip, latitude: body.latitude, longitude: body.longitude,
      notes: body.notes, created_by: body.created_by,
    }).select().single();
    if (error) return apiError(error.message, 500);

    // Create crew assignments
    if (body.crew_ids && Array.isArray(body.crew_ids)) {
      const assignments = (body.crew_ids as string[]).map(crewId => ({
        organization_id: body.organization_id,
        schedule_entry_id: data.id,
        crew_member_id: crewId,
        role_on_job: body.role_on_job,
      }));
      await supabase.from('crew_assignments').insert(assignments);
    }

    await emitEvent('scheduling.entry_created', { entryId: data.id, type: data.entry_type, date: data.scheduled_date });
    return apiSuccess(data);
  } catch {
    return apiError('Internal server error', 500);
  }
}

// PATCH /api/scheduling — Update entry, complete, cancel, check in/out
export async function PATCH(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();
    if (!body.id) return apiError('Missing id');
    const action = body.action;

    if (action === 'complete') {
      const { data, error } = await supabase.from('schedule_entries')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', body.id).select().single();
      if (error) return apiError(error.message, 500);
      await emitEvent('scheduling.entry_completed', { entryId: data.id });
      return apiSuccess(data);
    }

    if (action === 'cancel') {
      const { data, error } = await supabase.from('schedule_entries')
        .update({ status: 'cancelled', cancelled_reason: body.reason })
        .eq('id', body.id).select().single();
      if (error) return apiError(error.message, 500);
      return apiSuccess(data);
    }

    if (action === 'check_in' && body.crew_member_id) {
      const { data, error } = await supabase.from('crew_assignments')
        .update({ check_in_at: new Date().toISOString() })
        .eq('schedule_entry_id', body.id).eq('crew_member_id', body.crew_member_id)
        .select().single();
      if (error) return apiError(error.message, 500);
      return apiSuccess(data);
    }

    if (action === 'check_out' && body.crew_member_id) {
      const now = new Date();
      const { data: assignment } = await supabase.from('crew_assignments')
        .select('check_in_at').eq('schedule_entry_id', body.id).eq('crew_member_id', body.crew_member_id).single();
      const hoursWorked = assignment?.check_in_at ? (now.getTime() - new Date(assignment.check_in_at as string).getTime()) / 3600000 : 0;
      const { data, error } = await supabase.from('crew_assignments')
        .update({ check_out_at: now.toISOString(), hours_worked: Math.round(hoursWorked * 100) / 100 })
        .eq('schedule_entry_id', body.id).eq('crew_member_id', body.crew_member_id)
        .select().single();
      if (error) return apiError(error.message, 500);
      return apiSuccess(data);
    }

    // Generic update
    const updates: Record<string, unknown> = {};
    const fields = ['title', 'description', 'scheduled_date', 'start_time', 'end_time', 'duration_hours', 'lead_installer_id', 'status', 'address', 'notes'];
    for (const f of fields) { if (body[f] !== undefined) updates[f] = body[f]; }
    const { data, error } = await supabase.from('schedule_entries').update(updates).eq('id', body.id).select().single();
    if (error) return apiError(error.message, 500);
    return apiSuccess(data);
  } catch {
    return apiError('Internal server error', 500);
  }
}

// DELETE /api/scheduling — Soft delete
export async function DELETE(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const { id } = await req.json();
    if (!id) return apiError('Missing id');
    const { error } = await supabase.from('schedule_entries').update({ deleted_at: new Date().toISOString() }).eq('id', id);
    if (error) return apiError(error.message, 500);
    return apiSuccess({ deleted: true });
  } catch {
    return apiError('Internal server error', 500);
  }
}
