import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiSuccess, apiError, parsePagination, emitEvent, syncToGoldenDoorApp } from '@/lib/api-helpers';

/*
 * SOLAR PIPELINE API
 * Tracks the full solar project lifecycle:
 * Contract Signed → Site Survey → CADs → Permits → Install → Inspection → PTO → Final Completion
 *
 * Each stage transition is tracked, timestamped, and synced to:
 * - goldendoorapp.com (rep/customer visibility)
 * - n8n (automation triggers)
 * - HubSpot (via webhook)
 */

const SOLAR_STAGES = [
  'contract_signed',
  'site_survey_scheduled',
  'site_survey_completed',
  'cads_in_progress',
  'cads_completed',
  'permits_submitted',
  'permits_approved',
  'install_scheduled',
  'install_in_progress',
  'install_completed',
  'inspection_scheduled',
  'inspection_passed',
  'pto_submitted',
  'pto_approved',
  'final_completion',
] as const;

// GET /api/solar — List solar projects with status
export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const params = req.nextUrl.searchParams;
    const { page, limit, offset } = parsePagination(params);
    const stage = params.get('stage');
    const rep = params.get('rep_id');
    const customer = params.get('customer_id');

    let query = supabase
      .from('solar_projects')
      .select(`
        *,
        contacts(first_name, last_name, email, phone, address, city, state, zip),
        companies(name),
        deals(name, amount)
      `, { count: 'exact' })
      .is('deleted_at', null)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (stage) query = query.eq('current_stage', stage);
    if (rep) query = query.eq('rep_id', rep);
    if (customer) query = query.eq('contact_id', customer);

    const { data, error, count } = await query;
    if (error) return apiError(error.message, 500);

    return apiSuccess(data, { total: count || 0, page, limit });
  } catch {
    return apiError('Internal server error', 500);
  }
}

// POST /api/solar — Create new solar project from a signed deal
export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();

    if (!body.deal_id) return apiError('Missing deal_id');

    const { data, error } = await supabase
      .from('solar_projects')
      .insert({
        organization_id: body.organization_id,
        deal_id: body.deal_id,
        contact_id: body.contact_id,
        company_id: body.company_id,
        rep_id: body.rep_id,
        current_stage: 'contract_signed',
        contract_signed_at: new Date().toISOString(),
        system_size_kw: body.system_size_kw,
        panel_count: body.panel_count,
        panel_type: body.panel_type,
        inverter_type: body.inverter_type,
        financing_type: body.financing_type,
        contract_amount: body.contract_amount,
        address: body.address,
        city: body.city,
        state: body.state,
        zip: body.zip,
        utility_company: body.utility_company,
        ahj: body.ahj, // Authority Having Jurisdiction
        notes: body.notes,
      })
      .select()
      .single();

    if (error) return apiError(error.message, 500);

    // Sync to goldendoorapp.com (reps see this in their app)
    await syncToGoldenDoorApp('/solar/create', {
      crm_project_id: data.id,
      deal_id: data.deal_id,
      contact_id: data.contact_id,
      rep_id: data.rep_id,
      stage: 'contract_signed',
      system_size_kw: data.system_size_kw,
      address: `${data.address}, ${data.city}, ${data.state} ${data.zip}`,
    });

    // Emit event — triggers SiteCapture job creation, Asana task, Slack notification
    await emitEvent('solar.project_created', {
      projectId: data.id,
      dealId: data.deal_id,
      contactId: data.contact_id,
      repId: data.rep_id,
      stage: 'contract_signed',
    });

    return apiSuccess(data);
  } catch {
    return apiError('Internal server error', 500);
  }
}

// PATCH /api/solar — Advance solar project to next stage
export async function PATCH(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();

    if (!body.id || !body.new_stage) return apiError('Missing id or new_stage');

    // Validate stage is valid
    if (!SOLAR_STAGES.includes(body.new_stage)) {
      return apiError(`Invalid stage: ${body.new_stage}. Valid stages: ${SOLAR_STAGES.join(', ')}`);
    }

    // Get current project
    const { data: current } = await supabase
      .from('solar_projects')
      .select('*')
      .eq('id', body.id)
      .single();

    if (!current) return apiError('Solar project not found', 404);

    // Build update object with stage-specific timestamps
    const updates: Record<string, unknown> = {
      current_stage: body.new_stage,
      [`${body.new_stage}_at`]: new Date().toISOString(),
    };

    // Add stage-specific data
    if (body.new_stage === 'site_survey_completed' && body.survey_notes) {
      updates.survey_notes = body.survey_notes;
      updates.survey_photos_url = body.survey_photos_url;
    }
    if (body.new_stage === 'cads_completed' && body.cad_file_url) {
      updates.cad_file_url = body.cad_file_url;
    }
    if (body.new_stage === 'permits_submitted') {
      updates.permit_number = body.permit_number;
      updates.permit_submitted_to = body.permit_submitted_to;
    }
    if (body.new_stage === 'permits_approved') {
      updates.permit_approved_number = body.permit_approved_number;
    }
    if (body.new_stage === 'install_completed') {
      updates.install_completed_by = body.installer_id;
      updates.install_photos_url = body.install_photos_url;
    }
    if (body.new_stage === 'inspection_passed') {
      updates.inspection_result = 'passed';
      updates.inspector_name = body.inspector_name;
    }
    if (body.new_stage === 'pto_approved') {
      updates.pto_approval_number = body.pto_approval_number;
    }
    if (body.new_stage === 'final_completion') {
      updates.completed_at = new Date().toISOString();
    }

    // Add notes if provided
    if (body.notes) updates.notes = body.notes;
    if (body.assigned_to) updates.assigned_to = body.assigned_to;

    const { data, error } = await supabase
      .from('solar_projects')
      .update(updates)
      .eq('id', body.id)
      .select()
      .single();

    if (error) return apiError(error.message, 500);

    // Log stage transition in timeline
    await supabase.from('solar_project_timeline').insert({
      organization_id: current.organization_id,
      project_id: body.id,
      old_stage: current.current_stage,
      new_stage: body.new_stage,
      actor_id: body.actor_id,
      notes: body.notes,
      metadata: body.metadata || {},
    });

    // Sync to goldendoorapp.com (reps + customers see live status)
    await syncToGoldenDoorApp('/solar/stage-update', {
      crm_project_id: data.id,
      old_stage: current.current_stage,
      new_stage: body.new_stage,
      contact_id: data.contact_id,
      rep_id: data.rep_id,
    });

    // Emit event for automation
    await emitEvent('solar.stage_changed', {
      projectId: data.id,
      oldStage: current.current_stage,
      newStage: body.new_stage,
      contactId: data.contact_id,
      repId: data.rep_id,
    });

    return apiSuccess(data);
  } catch {
    return apiError('Internal server error', 500);
  }
}
