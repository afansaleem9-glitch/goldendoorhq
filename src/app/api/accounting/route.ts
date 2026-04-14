import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiSuccess, apiError, parsePagination, validateRequired, emitEvent } from '@/lib/api-helpers';

// GET /api/accounting — Invoices, payments, job costing, profitability
export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const params = req.nextUrl.searchParams;
    const { page, limit, offset } = parsePagination(params);
    const type = params.get('type') || 'invoices';
    const status = params.get('status');
    const projectId = params.get('project_id');

    if (type === 'invoices') {
      let query = supabase
        .from('invoices')
        .select('*, invoice_line_items(*)', { count: 'exact' })
        .is('deleted_at', null)
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });
      if (status) query = query.eq('status', status);
      if (projectId) query = query.eq('project_id', projectId);
      const { data, error, count } = await query;
      if (error) return apiError(error.message, 500);
      return apiSuccess(data, { total: count || 0, page, limit });
    }

    if (type === 'payments') {
      let query = supabase
        .from('payments')
        .select('*', { count: 'exact' })
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });
      if (projectId) query = query.eq('project_id', projectId);
      const { data, error, count } = await query;
      if (error) return apiError(error.message, 500);
      return apiSuccess(data, { total: count || 0, page, limit });
    }

    if (type === 'job_costing') {
      if (!projectId) return apiError('project_id required for job_costing');
      const { data, error } = await supabase
        .from('job_costing')
        .select('*')
        .eq('project_id', projectId)
        .order('cost_date', { ascending: false });
      if (error) return apiError(error.message, 500);

      const totals = (data || []).reduce(
        (acc: Record<string, number>, row: Record<string, unknown>) => {
          acc.total_cost = (acc.total_cost || 0) + Number(row.amount || 0);
          acc.total_budgeted = (acc.total_budgeted || 0) + Number(row.budgeted_amount || 0);
          return acc;
        },
        { total_cost: 0, total_budgeted: 0 }
      );

      return apiSuccess({ items: data, totals });
    }

    if (type === 'profitability') {
      if (!projectId) return apiError('project_id required for profitability');
      const { data, error } = await supabase.rpc('calculate_job_profit', { p_project_id: projectId });
      if (error) return apiError(error.message, 500);
      return apiSuccess(data);
    }

    return apiError('Invalid type. Must be invoices, payments, job_costing, or profitability');
  } catch {
    return apiError('Internal server error', 500);
  }
}

// POST /api/accounting — Create invoice, payment, or job cost entry
export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();
    const type = body.type || 'invoice';

    if (type === 'invoice') {
      const missing = validateRequired(body, ['project_id', 'total']);
      if (missing) return apiError(missing);

      const now = new Date();
      const prefix = `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
      const { count } = await supabase.from('invoices').select('*', { count: 'exact', head: true }).like('invoice_number', `${prefix}%`);
      const invoiceNumber = `${prefix}-${String((count || 0) + 1).padStart(3, '0')}`;

      const { data, error } = await supabase
        .from('invoices')
        .insert({
          organization_id: body.organization_id, project_id: body.project_id, contact_id: body.contact_id,
          invoice_number: invoiceNumber, status: 'draft', milestone: body.milestone,
          subtotal: body.subtotal || body.total, tax_rate: body.tax_rate || 0,
          tax_amount: body.tax_amount || 0, discount_amount: body.discount_amount || 0,
          total: body.total, amount_due: body.total,
          due_date: body.due_date, payment_terms: body.payment_terms || 'Net 30',
          notes: body.notes, created_by: body.created_by,
        })
        .select().single();
      if (error) return apiError(error.message, 500);

      // Insert line items
      if (body.line_items && Array.isArray(body.line_items)) {
        const items = (body.line_items as Record<string, unknown>[]).map((li, i) => ({
          organization_id: body.organization_id, invoice_id: data.id,
          description: li.description, quantity: li.quantity || 1,
          unit_price: li.unit_price, discount_pct: li.discount_pct || 0,
          amount: li.amount, catalog_item_id: li.catalog_item_id, sort_order: i,
        }));
        await supabase.from('invoice_line_items').insert(items);
      }

      await emitEvent('accounting.invoice_created', { invoiceId: data.id, invoiceNumber, total: data.total });
      return apiSuccess(data);
    }

    if (type === 'payment') {
      const missing = validateRequired(body, ['amount', 'payment_method']);
      if (missing) return apiError(missing);

      const { data, error } = await supabase
        .from('payments')
        .insert({
          organization_id: body.organization_id, invoice_id: body.invoice_id, project_id: body.project_id,
          contact_id: body.contact_id, amount: body.amount, payment_method: body.payment_method,
          status: 'completed', reference_number: body.reference_number,
          stripe_payment_id: body.stripe_payment_id, check_number: body.check_number,
          notes: body.notes, processed_at: new Date().toISOString(), created_by: body.created_by,
        })
        .select().single();
      if (error) return apiError(error.message, 500);

      // Update invoice if linked
      if (body.invoice_id) {
        const { data: inv } = await supabase.from('invoices').select('amount_paid, total').eq('id', body.invoice_id).single();
        if (inv) {
          const newPaid = Number(inv.amount_paid || 0) + Number(body.amount);
          const newDue = Number(inv.total) - newPaid;
          const newStatus = newDue <= 0 ? 'paid' : 'partial';
          await supabase.from('invoices').update({ amount_paid: newPaid, amount_due: Math.max(0, newDue), status: newStatus, paid_at: newDue <= 0 ? new Date().toISOString() : null }).eq('id', body.invoice_id);
        }
      }

      await emitEvent('accounting.payment_received', { paymentId: data.id, amount: data.amount });
      return apiSuccess(data);
    }

    if (type === 'job_cost') {
      const missing = validateRequired(body, ['project_id', 'category', 'description', 'amount']);
      if (missing) return apiError(missing);

      const { data, error } = await supabase
        .from('job_costing')
        .insert({
          organization_id: body.organization_id, project_id: body.project_id,
          category: body.category, description: body.description, vendor: body.vendor,
          amount: body.amount, is_budgeted: body.is_budgeted || false,
          budgeted_amount: body.budgeted_amount,
          variance: body.budgeted_amount ? Number(body.budgeted_amount) - Number(body.amount) : null,
          receipt_url: body.receipt_url, cost_date: body.cost_date || new Date().toISOString().split('T')[0],
          created_by: body.created_by,
        })
        .select().single();
      if (error) return apiError(error.message, 500);
      return apiSuccess(data);
    }

    return apiError('Invalid type');
  } catch {
    return apiError('Internal server error', 500);
  }
}

// PATCH /api/accounting — Update invoices, void, mark overdue
export async function PATCH(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();
    const action = body.action;

    if (action === 'send' && body.id) {
      const { data, error } = await supabase.from('invoices').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', body.id).select().single();
      if (error) return apiError(error.message, 500);
      await emitEvent('accounting.invoice_sent', { invoiceId: data.id });
      return apiSuccess(data);
    }

    if (action === 'void' && body.id) {
      const { data, error } = await supabase.from('invoices').update({ status: 'void' }).eq('id', body.id).select().single();
      if (error) return apiError(error.message, 500);
      return apiSuccess(data);
    }

    if (action === 'mark_overdue') {
      const { data, error } = await supabase
        .from('invoices')
        .update({ status: 'overdue', overdue_at: new Date().toISOString() })
        .in('status', ['sent', 'viewed'])
        .lt('due_date', new Date().toISOString().split('T')[0])
        .select();
      if (error) return apiError(error.message, 500);
      return apiSuccess(data);
    }

    if (body.id) {
      const updates: Record<string, unknown> = {};
      const fields = ['status', 'due_date', 'payment_terms', 'notes', 'milestone'];
      for (const f of fields) { if (body[f] !== undefined) updates[f] = body[f]; }
      const { data, error } = await supabase.from('invoices').update(updates).eq('id', body.id).select().single();
      if (error) return apiError(error.message, 500);
      return apiSuccess(data);
    }

    return apiError('Missing id');
  } catch {
    return apiError('Internal server error', 500);
  }
}

// DELETE /api/accounting — Soft delete invoice
export async function DELETE(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const { id } = await req.json();
    if (!id) return apiError('Missing id');
    const { error } = await supabase.from('invoices').update({ deleted_at: new Date().toISOString() }).eq('id', id);
    if (error) return apiError(error.message, 500);
    return apiSuccess({ deleted: true });
  } catch {
    return apiError('Internal server error', 500);
  }
}
