import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiSuccess, apiError, parsePagination, validateRequired, emitEvent, syncToGoldenDoorApp } from '@/lib/api-helpers';

// GET /api/tasks — List tasks with filtering
export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const params = req.nextUrl.searchParams;
    const { page, limit, offset } = parsePagination(params);
    const status = params.get('status');
    const priority = params.get('priority');
    const type = params.get('type');
    const assignee = params.get('assigned_to');
    const contact = params.get('contact_id');
    const deal = params.get('deal_id');
    const overdue = params.get('overdue');

    let query = supabase
      .from('tasks')
      .select(`
        *,
        contacts(first_name, last_name, email),
        deals(name, amount),
        companies(name)
      `, { count: 'exact' })
      .is('deleted_at', null)
      .range(offset, offset + limit - 1)
      .order('due_date', { ascending: true });

    if (status) query = query.eq('status', status);
    if (priority) query = query.eq('priority', priority);
    if (type) query = query.eq('type', type);
    if (assignee) query = query.eq('assigned_to', assignee);
    if (contact) query = query.eq('contact_id', contact);
    if (deal) query = query.eq('deal_id', deal);
    if (overdue === 'true') {
      query = query.lt('due_date', new Date().toISOString()).neq('status', 'completed');
    }

    const { data, error, count } = await query;
    if (error) return apiError(error.message, 500);

    return apiSuccess(data, { total: count || 0, page, limit });
  } catch {
    return apiError('Internal server error', 500);
  }
}

// POST /api/tasks — Create task
export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();

    const missing = validateRequired(body, ['title']);
    if (missing) return apiError(missing);

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: body.title,
        description: body.description,
        type: body.type || 'to_do',
        priority: body.priority || 'medium',
        status: body.status || 'not_started',
        due_date: body.due_date,
        assigned_to: body.assigned_to,
        contact_id: body.contact_id,
        company_id: body.company_id,
        deal_id: body.deal_id,
        ticket_id: body.ticket_id,
        reminder_at: body.reminder_at,
        queue_id: body.queue_id,
        tags: body.tags || [],
        organization_id: body.organization_id,
        created_by: body.created_by,
      })
      .select()
      .single();

    if (error) return apiError(error.message, 500);

    await syncToGoldenDoorApp('/tasks/sync', {
      crm_task_id: data.id,
      title: data.title,
      type: data.type,
      priority: data.priority,
      due_date: data.due_date,
      assigned_to: data.assigned_to,
      contact_id: data.contact_id,
      deal_id: data.deal_id,
    });

    await emitEvent('task.created', {
      taskId: data.id,
      title: data.title,
      assignedTo: data.assigned_to,
      dueDate: data.due_date,
    });

    return apiSuccess(data);
  } catch {
    return apiError('Internal server error', 500);
  }
}

// PATCH /api/tasks — Update task (complete, reassign, reschedule)
export async function PATCH(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();

    if (!body.id) return apiError('Missing task id');

    const { data: current } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', body.id)
      .single();

    const updates: Record<string, unknown> = {};
    const fields = ['title', 'description', 'type', 'priority', 'status',
      'due_date', 'assigned_to', 'contact_id', 'company_id', 'deal_id',
      'ticket_id', 'reminder_at', 'tags'];

    for (const field of fields) {
      if (body[field] !== undefined) updates[field] = body[field];
    }

    // Track completion
    if (body.status === 'completed' && current?.status !== 'completed') {
      updates.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', body.id)
      .select()
      .single();

    if (error) return apiError(error.message, 500);

    // Emit completion event for automation
    if (body.status === 'completed' && current?.status !== 'completed') {
      await emitEvent('task.completed', {
        taskId: data.id,
        title: data.title,
        assignedTo: data.assigned_to,
        contactId: data.contact_id,
        dealId: data.deal_id,
      });

      await syncToGoldenDoorApp('/tasks/completed', {
        crm_task_id: data.id,
        title: data.title,
        assigned_to: data.assigned_to,
      });
    }

    return apiSuccess(data);
  } catch {
    return apiError('Internal server error', 500);
  }
}

// DELETE /api/tasks — Soft delete
export async function DELETE(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();

    if (!body.id) return apiError('Missing task id');

    const { error } = await supabase
      .from('tasks')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', body.id);

    if (error) return apiError(error.message, 500);

    return apiSuccess({ deleted: true, id: body.id });
  } catch {
    return apiError('Internal server error', 500);
  }
}
