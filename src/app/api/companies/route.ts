import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiSuccess, apiError, parsePagination, validateRequired, emitEvent, syncToGoldenDoorApp } from '@/lib/api-helpers';

// GET /api/companies — List companies with filtering + pagination
export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const params = req.nextUrl.searchParams;
    const { page, limit, offset } = parsePagination(params);
    const search = params.get('search');
    const industry = params.get('industry');
    const type = params.get('type');
    const owner = params.get('owner_id');

    let query = supabase
      .from('companies')
      .select(`
        *,
        contacts(id, first_name, last_name, email),
        deals(id, name, amount, stage_id)
      `, { count: 'exact' })
      .is('deleted_at', null)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`name.ilike.%${search}%,domain.ilike.%${search}%`);
    }
    if (industry) query = query.eq('industry', industry);
    if (type) query = query.eq('type', type);
    if (owner) query = query.eq('owner_id', owner);

    const { data, error, count } = await query;
    if (error) return apiError(error.message, 500);

    return apiSuccess(data, { total: count || 0, page, limit });
  } catch {
    return apiError('Internal server error', 500);
  }
}

// POST /api/companies — Create company + sync
export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();

    const missing = validateRequired(body, ['name']);
    if (missing) return apiError(missing);

    const { data, error } = await supabase
      .from('companies')
      .insert({
        name: body.name,
        domain: body.domain,
        industry: body.industry,
        type: body.type || 'prospect',
        phone: body.phone,
        address_line1: body.address_line1,
        city: body.city,
        state: body.state,
        zip: body.zip,
        website: body.website,
        annual_revenue: body.annual_revenue,
        employee_count: body.employee_count,
        description: body.description,
        owner_id: body.owner_id,
        tags: body.tags || [],
        custom_properties: body.custom_properties || {},
        organization_id: body.organization_id,
        created_by: body.created_by,
      })
      .select()
      .single();

    if (error) return apiError(error.message, 500);

    await syncToGoldenDoorApp('/companies/sync', {
      crm_company_id: data.id,
      name: data.name,
      domain: data.domain,
      industry: data.industry,
      type: data.type,
      owner_id: data.owner_id,
    });

    await emitEvent('company.created', {
      companyId: data.id,
      name: data.name,
      industry: data.industry,
    });

    return apiSuccess(data);
  } catch {
    return apiError('Internal server error', 500);
  }
}

// PATCH /api/companies — Update company
export async function PATCH(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();

    if (!body.id) return apiError('Missing company id');

    const updates: Record<string, unknown> = {};
    const fields = ['name', 'domain', 'industry', 'type', 'phone', 'address_line1',
      'city', 'state', 'zip', 'website', 'annual_revenue', 'employee_count',
      'description', 'owner_id', 'tags', 'custom_properties'];

    for (const field of fields) {
      if (body[field] !== undefined) updates[field] = body[field];
    }

    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', body.id)
      .select()
      .single();

    if (error) return apiError(error.message, 500);

    await syncToGoldenDoorApp('/companies/update', {
      crm_company_id: data.id,
      name: data.name,
      type: data.type,
      owner_id: data.owner_id,
    });

    return apiSuccess(data);
  } catch {
    return apiError('Internal server error', 500);
  }
}

// DELETE /api/companies — Soft delete
export async function DELETE(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();

    if (!body.id) return apiError('Missing company id');

    const { data, error } = await supabase
      .from('companies')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', body.id)
      .select()
      .single();

    if (error) return apiError(error.message, 500);

    await emitEvent('company.deleted', { companyId: data.id, name: data.name });

    return apiSuccess({ deleted: true, id: data.id });
  } catch {
    return apiError('Internal server error', 500);
  }
}
