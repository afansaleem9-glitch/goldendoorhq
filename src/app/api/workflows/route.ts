import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiSuccess, apiError, parsePagination, validateRequired, emitEvent } from '@/lib/api-helpers';

// GET /api/workflows — List automation workflows
export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const params = req.nextUrl.searchParams;
    const { page, limit, offset } = parsePagination(params);
    const search = params.get('search');
    const status = params.get('status');
    const wfType = params.get('workflow_type');

    let query = supabase
      .from('workflows')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    if (status) query = query.eq('status', status);
    if (wfType) query = query.eq('workflow_type', wfType);

    const { data, error, count } = await query;
    if (error) return apiError(error.message, 500);

    return apiSuccess(data, { total: count || 0, page, limit });
  } catch (err) {
    return apiError('Internal server error', 500);
  }
}

// POST /api/workflows — Create a new workflow
export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();

    const missing = validateRequired(body, ['name']);
    if (missing) return apiError(missing);

    const { data, error } = await supabase
      .from('workflows')
      .insert({
        name: body.name,
        description: body.description || '',
        workflow_type: body.workflow_type || 'contact',
        trigger_type: body.trigger_type || 'event',
        trigger_config: body.trigger_config || {},
        status: body.status || 'draft',
        actions_count: body.actions_count || 0,
        enrolled_count: 0,
        completed_count: 0,
        error_count: 0,
      })
      .select()
      .single();

    if (error) return apiError(error.message, 500);

    emitEvent('workflow.created', data);
    return apiSuccess(data);
  } catch (err) {
    return apiError('Internal server error', 500);
  }
}
