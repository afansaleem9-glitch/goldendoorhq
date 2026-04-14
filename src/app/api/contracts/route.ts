import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiSuccess, apiError, parsePagination, validateRequired, emitEvent } from '@/lib/api-helpers';

// GET /api/contracts — List contracts, templates, or proposals
export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const params = req.nextUrl.searchParams;
    const { page, limit, offset } = parsePagination(params);
    const type = params.get('type') || 'contracts';
    const status = params.get('status');
    const contractType = params.get('contract_type');

    if (type === 'templates') {
      const { data, error, count } = await supabase
        .from('contract_templates')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });
      if (error) return apiError(error.message, 500);
      return apiSuccess(data, { total: count || 0, page, limit });
    }

    if (type === 'proposals') {
      let query = supabase
        .from('proposals')
        .select('*', { count: 'exact' })
        .is('deleted_at', null)
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });
      if (status) query = query.eq('status', status);
      const { data, error, count } = await query;
      if (error) return apiError(error.message, 500);
      return apiSuccess(data, { total: count || 0, page, limit });
    }

    // Default: contracts
    let query = supabase
      .from('contracts')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);
    if (contractType) query = query.eq('contract_type', contractType);
    const { data, error, count } = await query;
    if (error) return apiError(error.message, 500);
    return apiSuccess(data, { total: count || 0, page, limit });
  } catch {
    return apiError('Internal server error', 500);
  }
}

// POST /api/contracts — Create contract, template, or proposal
export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();
    const type = body.type || 'contract';

    if (type === 'contract') {
      const missing = validateRequired(body, ['title', 'contract_type', 'contract_amount']);
      if (missing) return apiError(missing);

      const now = new Date();
      const prefix = `GD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
      const { count } = await supabase.from('contracts').select('*', { count: 'exact', head: true }).like('contract_number', `${prefix}%`);
      const contractNumber = `${prefix}-${String((count || 0) + 1).padStart(3, '0')}`;

      const { data, error } = await supabase
        .from('contracts')
        .insert({
          organization_id: body.organization_id,
          project_id: body.project_id,
          contact_id: body.contact_id,
          contract_number: contractNumber,
          contract_type: body.contract_type,
          status: 'draft',
          template_id: body.template_id,
          title: body.title,
          terms_text: body.terms_text,
          contract_amount: body.contract_amount,
          monthly_amount: body.monthly_amount,
          term_months: body.term_months,
          start_date: body.start_date,
          end_date: body.end_date,
          notes: body.notes,
          created_by: body.created_by,
        })
        .select()
        .single();
      if (error) return apiError(error.message, 500);
      await emitEvent('contracts.created', { contractId: data.id, contractNumber });
      return apiSuccess(data);
    }

    if (type === 'template') {
      const missing = validateRequired(body, ['name', 'contract_type']);
      if (missing) return apiError(missing);
      const { data, error } = await supabase
        .from('contract_templates')
        .insert({ name: body.name, contract_type: body.contract_type, description: body.description, body_html: body.body_html, variables: body.variables || [], organization_id: body.organization_id, created_by: body.created_by })
        .select().single();
      if (error) return apiError(error.message, 500);
      return apiSuccess(data);
    }

    if (type === 'proposal') {
      const missing = validateRequired(body, ['title', 'system_size_kw']);
      if (missing) return apiError(missing);
      const now = new Date();
      const prefix = `PROP-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
      const { count } = await supabase.from('proposals').select('*', { count: 'exact', head: true }).like('proposal_number', `${prefix}%`);
      const proposalNumber = `${prefix}-${String((count || 0) + 1).padStart(3, '0')}`;

      const { data, error } = await supabase
        .from('proposals')
        .insert({
          organization_id: body.organization_id, deal_id: body.deal_id, contact_id: body.contact_id, project_id: body.project_id,
          proposal_number: proposalNumber, status: 'draft', title: body.title,
          system_size_kw: body.system_size_kw, panel_count: body.panel_count, panel_type: body.panel_type,
          inverter_type: body.inverter_type, battery_included: body.battery_included || false,
          cash_price: body.cash_price, financed_price: body.financed_price, monthly_payment: body.monthly_payment,
          loan_term_months: body.loan_term_months, lender: body.lender, net_cost: body.net_cost,
          federal_itc: body.federal_itc, state_incentives: body.state_incentives, utility_rebate: body.utility_rebate,
          notes: body.notes, created_by: body.created_by,
        })
        .select().single();
      if (error) return apiError(error.message, 500);
      await emitEvent('proposals.created', { proposalId: data.id, proposalNumber });
      return apiSuccess(data);
    }

    return apiError('Invalid type');
  } catch {
    return apiError('Internal server error', 500);
  }
}

// PATCH /api/contracts — Update, send, sign, countersign
export async function PATCH(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();
    const action = body.action;

    if (!body.id) return apiError('Missing id');

    const table = body.entity === 'proposal' ? 'proposals' : 'contracts';

    if (action === 'send') {
      const { data, error } = await supabase.from(table).update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', body.id).select().single();
      if (error) return apiError(error.message, 500);
      await emitEvent(`${table}.sent`, { id: data.id });
      return apiSuccess(data);
    }

    if (action === 'sign') {
      const { data, error } = await supabase.from('contracts')
        .update({ customer_signature_url: body.signature_url, customer_signed_at: new Date().toISOString(), status: 'signed' })
        .eq('id', body.id).select().single();
      if (error) return apiError(error.message, 500);
      await emitEvent('contracts.signed', { contractId: data.id });
      return apiSuccess(data);
    }

    if (action === 'countersign') {
      const { data, error } = await supabase.from('contracts')
        .update({ company_signature_url: body.signature_url, company_signed_at: new Date().toISOString(), status: 'active' })
        .eq('id', body.id).select().single();
      if (error) return apiError(error.message, 500);
      await emitEvent('contracts.active', { contractId: data.id });
      return apiSuccess(data);
    }

    // Generic update
    const updates: Record<string, unknown> = {};
    const fields = ['title', 'terms_text', 'contract_amount', 'monthly_amount', 'term_months', 'start_date', 'end_date', 'notes', 'status', 'pdf_url'];
    for (const f of fields) { if (body[f] !== undefined) updates[f] = body[f]; }
    const { data, error } = await supabase.from(table).update(updates).eq('id', body.id).select().single();
    if (error) return apiError(error.message, 500);
    return apiSuccess(data);
  } catch {
    return apiError('Internal server error', 500);
  }
}

// DELETE /api/contracts — Soft delete
export async function DELETE(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const { id } = await req.json();
    if (!id) return apiError('Missing id');
    const { error } = await supabase.from('contracts').update({ deleted_at: new Date().toISOString() }).eq('id', id);
    if (error) return apiError(error.message, 500);
    return apiSuccess({ deleted: true });
  } catch {
    return apiError('Internal server error', 500);
  }
}
