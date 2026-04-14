import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiSuccess, apiError, parsePagination, validateRequired, emitEvent, syncToGoldenDoorApp } from '@/lib/api-helpers';

// GET /api/contacts — List contacts with filtering, search, pagination
export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const params = req.nextUrl.searchParams;
    const { page, limit, offset } = parsePagination(params);
    const search = params.get('search');
    const lifecycle = params.get('lifecycle_stage');
    const owner = params.get('owner_id');
    const sort = params.get('sort') || 'created_at';
    const order = params.get('order') === 'asc' ? true : false;

    let query = supabase
      .from('contacts')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .range(offset, offset + limit - 1)
      .order(sort, { ascending: order });

    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }
    if (lifecycle) query = query.eq('lifecycle_stage', lifecycle);
    if (owner) query = query.eq('owner_id', owner);

    const { data, error, count } = await query;
    if (error) return apiError(error.message, 500);

    return apiSuccess(data, { total: count || 0, page, limit });
  } catch (err) {
    return apiError('Internal server error', 500);
  }
}

// POST /api/contacts — Create a new contact + sync to goldendoorapp.com
export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();

    const missing = validateRequired(body, ['first_name', 'last_name']);
    if (missing) return apiError(missing);

    const { data, error } = await supabase
      .from('contacts')
      .insert({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        phone: body.phone,
        mobile_phone: body.mobile_phone,
        company_id: body.company_id,
        job_title: body.job_title,
        lifecycle_stage: body.lifecycle_stage || 'subscriber',
        lead_status: body.lead_status || 'new',
        lead_source: body.lead_source,
        owner_id: body.owner_id,
        address_line1: body.address_line1,
        city: body.city,
        state: body.state,
        zip: body.zip,
        tags: body.tags || [],
        custom_properties: body.custom_properties || {},
        organization_id: body.organization_id,
        created_by: body.created_by,
      })
      .select()
      .single();

    if (error) return apiError(error.message, 500);

    // Sync to goldendoorapp.com (for rep mobile app)
    await syncToGoldenDoorApp('/contacts/sync', {
      crm_contact_id: data.id,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      address: `${data.address_line1 || ''}, ${data.city || ''}, ${data.state || ''} ${data.zip || ''}`,
      lifecycle_stage: data.lifecycle_stage,
      owner_id: data.owner_id,
    });

    // Emit event for n8n automation
    await emitEvent('contact.created', {
      contactId: data.id,
      email: data.email,
      name: `${data.first_name} ${data.last_name}`,
    });

    return apiSuccess(data);
  } catch (err) {
    return apiError('Internal server error', 500);
  }
}
