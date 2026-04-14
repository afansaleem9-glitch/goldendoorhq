import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiSuccess, apiError, parsePagination, validateRequired, emitEvent, syncToGoldenDoorApp } from '@/lib/api-helpers';

// GET /api/tickets — List tickets with filtering
export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const params = req.nextUrl.searchParams;
    const { page, limit, offset } = parsePagination(params);
    const status = params.get('status_id');
    const priority = params.get('priority');
    const pipeline = params.get('pipeline_id');
    const assignee = params.get('assigned_to');
    const contact = params.get('contact_id');
    const source = params.get('source');

    let query = supabase
      .from('tickets')
      .select(`
        *,
        contacts(first_name, last_name, email, phone),
        companies(name),
        ticket_statuses(name, pipeline_id)
      `, { count: 'exact' })
      .is('deleted_at', null)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status_id', status);
    if (priority) query = query.eq('priority', priority);
    if (pipeline) query = query.eq('pipeline_id', pipeline);
    if (assignee) query = query.eq('assigned_to', assignee);
    if (contact) query = query.eq('contact_id', contact);
    if (source) query = query.eq('source', source);

    const { data, error, count } = await query;
    if (error) return apiError(error.message, 500);

    return apiSuccess(data, { total: count || 0, page, limit });
  } catch {
    return apiError('Internal server error', 500);
  }
}

// POST /api/tickets — Create support ticket
export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();

    const missing = validateRequired(body, ['subject', 'pipeline_id', 'status_id']);
    if (missing) return apiError(missing);

    const { data, error } = await supabase
      .from('tickets')
      .insert({
        subject: body.subject,
        description: body.description,
        pipeline_id: body.pipeline_id,
        status_id: body.status_id,
        priority: body.priority || 'medium',
        source: body.source || 'web',
        contact_id: body.contact_id,
        company_id: body.company_id,
        assigned_to: body.assigned_to,
        category: body.category,
        sla_due_date: body.sla_due_date,
        tags: body.tags || [],
        custom_properties: body.custom_properties || {},
        organization_id: body.organization_id,
        created_by: body.created_by,
      })
      .select()
      .single();

    if (error) return apiError(error.message, 500);

    await syncToGoldenDoorApp('/tickets/sync', {
      crm_ticket_id: data.id,
      subject: data.subject,
      priority: data.priority,
      source: data.source,
      contact_id: data.contact_id,
      assigned_to: data.assigned_to,
    });

    await emitEvent('ticket.created', {
      ticketId: data.id,
      subject: data.subject,
      priority: data.priority,
      source: data.source,
      contactId: data.contact_id,
    });

    return apiSuccess(data);
  } catch {
    return apiError('Internal server error', 500);
  }
}

// PATCH /api/tickets — Update ticket (status change, reassign, resolve)
export async function PATCH(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();

    if (!body.id) return apiError('Missing ticket id');

    const { data: current } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', body.id)
      .single();

    const updates: Record<string, unknown> = {};
    const fields = ['subject', 'description', 'status_id', 'priority', 'source',
      'contact_id', 'company_id', 'assigned_to', 'category', 'sla_due_date',
      'tags', 'custom_properties'];

    for (const field of fields) {
      if (body[field] !== undefined) updates[field] = body[field];
    }

    // Track resolution
    if (body.resolved) {
      updates.resolved_at = new Date().toISOString();
      updates.resolution_notes = body.resolution_notes;
    }

    // Track first response
    if (body.first_response && !current?.first_response_at) {
      updates.first_response_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('tickets')
      .update(updates)
      .eq('id', body.id)
      .select()
      .single();

    if (error) return apiError(error.message, 500);

    // Status change events
    if (body.status_id && current && body.status_id !== current.status_id) {
      await syncToGoldenDoorApp('/tickets/status-change', {
        crm_ticket_id: data.id,
        old_status: current.status_id,
        new_status: data.status_id,
        contact_id: data.contact_id,
      });

      await emitEvent('ticket.status_changed', {
        ticketId: data.id,
        oldStatus: current.status_id,
        newStatus: data.status_id,
        contactId: data.contact_id,
      });
    }

    // Resolution event
    if (body.resolved) {
      await emitEvent('ticket.resolved', {
        ticketId: data.id,
        subject: data.subject,
        contactId: data.contact_id,
        resolvedAt: data.resolved_at,
      });
    }

    return apiSuccess(data);
  } catch {
    return apiError('Internal server error', 500);
  }
}
