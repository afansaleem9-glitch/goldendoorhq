import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiSuccess, apiError } from '@/lib/api-helpers';

// GET /api/contacts/[id] — Full Customer 360 / DNA view
// Returns contact + all related records across the entire system
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerClient();

    // Parallel fetch all related data
    const [
      contactRes,
      dealsRes,
      ticketsRes,
      tasksRes,
      activitiesRes,
      notesRes,
      contractsRes,
      solarRes,
      invoicesRes,
      paymentsRes,
    ] = await Promise.all([
      // Core contact with company
      supabase
        .from('contacts')
        .select('*, companies(name, industry, website, phone)')
        .eq('id', id)
        .is('deleted_at', null)
        .single(),

      // All deals for this contact
      supabase
        .from('deals')
        .select('*')
        .eq('contact_id', id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false }),

      // All tickets
      supabase
        .from('tickets')
        .select('*')
        .eq('contact_id', id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false }),

      // All tasks
      supabase
        .from('tasks')
        .select('*')
        .eq('contact_id', id)
        .is('deleted_at', null)
        .order('due_date', { ascending: false }),

      // Activity timeline
      supabase
        .from('activities')
        .select('*')
        .eq('contact_id', id)
        .order('created_at', { ascending: false })
        .limit(100),

      // Notes
      supabase
        .from('notes')
        .select('*')
        .eq('contact_id', id)
        .order('created_at', { ascending: false }),

      // Contracts
      supabase
        .from('contracts')
        .select('*')
        .eq('contact_id', id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false }),

      // Solar projects (via deals -> solar_projects, or direct if contact_id exists)
      supabase
        .from('solar_projects')
        .select('*, solar_documents(*), solar_project_timeline(*)')
        .eq('contact_id', id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false }),

      // Invoices
      supabase
        .from('invoices')
        .select('*, invoice_line_items(*)')
        .eq('contact_id', id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false }),

      // Payments
      supabase
        .from('payments')
        .select('*')
        .eq('contact_id', id)
        .order('created_at', { ascending: false }),
    ]);

    if (contactRes.error) return apiError('Contact not found', 404);

    return apiSuccess({
      contact: contactRes.data,
      deals: dealsRes.data || [],
      tickets: ticketsRes.data || [],
      tasks: tasksRes.data || [],
      activities: activitiesRes.data || [],
      notes: notesRes.data || [],
      contracts: contractsRes.data || [],
      solar_projects: solarRes.data || [],
      invoices: invoicesRes.data || [],
      payments: paymentsRes.data || [],
    });
  } catch {
    return apiError('Internal server error', 500);
  }
}

// PATCH /api/contacts/[id] — Update contact
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerClient();
    const body = await req.json();

    const { data, error } = await supabase
      .from('contacts')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return apiError(error.message, 500);
    return apiSuccess(data);
  } catch {
    return apiError('Internal server error', 500);
  }
}
