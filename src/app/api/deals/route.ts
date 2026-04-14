import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiSuccess, apiError, parsePagination, validateRequired, emitEvent, syncToGoldenDoorApp } from '@/lib/api-helpers';

// GET /api/deals — List deals with pipeline filtering
export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const params = req.nextUrl.searchParams;
    const { page, limit, offset } = parsePagination(params);
    const pipeline = params.get('pipeline_id');
    const stage = params.get('stage_id');
    const owner = params.get('owner_id');

    let query = supabase
      .from('deals')
      .select('*, contacts(first_name, last_name, email), companies(name)', { count: 'exact' })
      .is('deleted_at', null)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (pipeline) query = query.eq('pipeline_id', pipeline);
    if (stage) query = query.eq('stage_id', stage);
    if (owner) query = query.eq('owner_id', owner);

    const { data, error, count } = await query;
    if (error) return apiError(error.message, 500);

    return apiSuccess(data, { total: count || 0, page, limit });
  } catch {
    return apiError('Internal server error', 500);
  }
}

// POST /api/deals — Create deal + sync to goldendoorapp.com + n8n
export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();

    const missing = validateRequired(body, ['name', 'pipeline_id', 'stage_id']);
    if (missing) return apiError(missing);

    const { data, error } = await supabase
      .from('deals')
      .insert({
        name: body.name,
        amount: body.amount || 0,
        pipeline_id: body.pipeline_id,
        stage_id: body.stage_id,
        contact_id: body.contact_id,
        company_id: body.company_id,
        owner_id: body.owner_id,
        close_date: body.close_date,
        priority: body.priority || 'medium',
        deal_type: body.deal_type,
        forecast_category: body.forecast_category || 'pipeline',
        tags: body.tags || [],
        custom_properties: body.custom_properties || {},
        organization_id: body.organization_id,
        created_by: body.created_by,
      })
      .select()
      .single();

    if (error) return apiError(error.message, 500);

    // Sync to goldendoorapp.com
    await syncToGoldenDoorApp('/deals/sync', {
      crm_deal_id: data.id,
      name: data.name,
      amount: data.amount,
      stage_id: data.stage_id,
      contact_id: data.contact_id,
      owner_id: data.owner_id,
    });

    // Emit event for automation (Asana task, Slack notification, etc.)
    await emitEvent('deal.created', {
      dealId: data.id,
      name: data.name,
      amount: data.amount,
      ownerId: data.owner_id,
    });

    return apiSuccess(data);
  } catch {
    return apiError('Internal server error', 500);
  }
}

// PATCH /api/deals — Update deal (stage change triggers sync)
export async function PATCH(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();

    if (!body.id) return apiError('Missing deal id');

    // Get current deal for comparison
    const { data: current } = await supabase.from('deals').select('*').eq('id', body.id).single();

    const updates: Record<string, unknown> = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.amount !== undefined) updates.amount = body.amount;
    if (body.stage_id !== undefined) {
      updates.stage_id = body.stage_id;
      updates.last_stage_change_at = new Date().toISOString();
    }
    if (body.owner_id !== undefined) updates.owner_id = body.owner_id;
    if (body.close_date !== undefined) updates.close_date = body.close_date;
    if (body.priority !== undefined) updates.priority = body.priority;
    if (body.forecast_category !== undefined) updates.forecast_category = body.forecast_category;

    const { data, error } = await supabase
      .from('deals')
      .update(updates)
      .eq('id', body.id)
      .select()
      .single();

    if (error) return apiError(error.message, 500);

    // If stage changed, emit event and sync
    if (body.stage_id && current && body.stage_id !== current.stage_id) {
      await syncToGoldenDoorApp('/deals/stage-change', {
        crm_deal_id: data.id,
        old_stage: current.stage_id,
        new_stage: data.stage_id,
        amount: data.amount,
      });

      await emitEvent('deal.stage_changed', {
        dealId: data.id,
        oldStage: current.stage_id,
        newStage: data.stage_id,
        amount: data.amount,
        ownerId: data.owner_id,
      });
    }

    return apiSuccess(data);
  } catch {
    return apiError('Internal server error', 500);
  }
}
