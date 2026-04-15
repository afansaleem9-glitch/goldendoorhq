import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiSuccess, apiError, emitEvent } from '@/lib/api-helpers';
import crypto from 'crypto';

/*
 * AURORA SOLAR WEBHOOK RECEIVER
 * Endpoint: POST /api/aurora/webhooks
 *
 * Receives real-time events from Aurora Solar when:
 * - Projects are created/updated
 * - Designs are completed/modified
 * - Proposals are sent/signed/declined
 * - E-signatures are completed
 *
 * Webhook URL to register in Aurora:
 *   https://goldendoorhq.com/api/aurora/webhooks
 *
 * Events we handle:
 *   project.created, project.updated
 *   design.created, design.updated, design.completed
 *   proposal.created, proposal.sent, proposal.signed, proposal.declined, proposal.expired
 *   esignature.completed
 */

const ORG_ID = 'a97d1a8b-3691-42a3-b116-d131e085b00f';

function verifyAuroraSignature(payload: string, signature: string): boolean {
  const secret = process.env.AURORA_WEBHOOK_SECRET;
  if (!secret) return true; // Skip verification if no secret configured
  try {
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-aurora-signature') || req.headers.get('x-webhook-signature') || '';

    // Verify signature
    if (process.env.AURORA_WEBHOOK_SECRET && !verifyAuroraSignature(rawBody, signature.replace('sha256=', ''))) {
      return apiError('Invalid webhook signature', 401);
    }

    const body = JSON.parse(rawBody);
    const event = body.event || body.type || 'unknown';
    const projectId = body.project_id || body.data?.project_id;
    const designId = body.design_id || body.data?.design_id;
    const proposalId = body.proposal_id || body.data?.proposal_id;

    const supabase = createServerClient();

    // Log the webhook in audit_log
    await supabase.from('audit_log').insert({
      entity_type: 'webhook',
      entity_id: projectId || null,
      action: `webhook.aurora.${event}`,
      changes: { source: 'aurora_solar', event, payload: body },
      organization_id: ORG_ID,
    });

    let result: Record<string, unknown> = {};

    switch (event) {
      // ----- PROJECT EVENTS -----
      case 'project.created':
      case 'project.updated': {
        const projectData = body.data || body;
        // Upsert contact if customer info is present
        if (projectData.customer) {
          const { data: existingContact } = await supabase
            .from('contacts')
            .select('id')
            .eq('email', projectData.customer.email)
            .eq('organization_id', ORG_ID)
            .maybeSingle();

          if (!existingContact && projectData.customer.email) {
            await supabase.from('contacts').insert({
              organization_id: ORG_ID,
              first_name: projectData.customer.first_name,
              last_name: projectData.customer.last_name,
              email: projectData.customer.email,
              phone: projectData.customer.phone || null,
              address_line1: projectData.address?.street,
              city: projectData.address?.city,
              state: projectData.address?.state,
              zip: projectData.address?.zip_code,
              lifecycle_stage: 'lead',
              lead_status: 'new',
              lead_source: 'aurora_solar',
              external_id: `aurora_${projectId}`,
            });
          }
        }
        result = { action: 'project_synced', aurora_project_id: projectId };
        break;
      }

      // ----- DESIGN EVENTS -----
      case 'design.created':
      case 'design.updated':
      case 'design.completed': {
        const designData = body.data || body;
        // Update solar_projects if we have a linked project
        if (projectId) {
          const { data: solarProject } = await supabase
            .from('solar_projects')
            .select('id')
            .or(`aurora_project_id.eq.${projectId},external_id.eq.aurora_${projectId}`)
            .eq('organization_id', ORG_ID)
            .maybeSingle();

          if (solarProject) {
            await supabase.from('solar_projects').update({
              system_size_kw: designData.system_size_stc,
              panel_count: designData.module_count,
              panel_type: designData.module ? `${designData.module.manufacturer} ${designData.module.model}` : undefined,
              inverter_type: designData.inverter ? `${designData.inverter.manufacturer} ${designData.inverter.model}` : undefined,
              aurora_design_id: designId,
              aurora_synced_at: new Date().toISOString(),
            }).eq('id', solarProject.id);
          }
        }

        // If design is completed, advance to CADs completed stage
        if (event === 'design.completed' && projectId) {
          const { data: sp } = await supabase
            .from('solar_projects')
            .select('id, current_stage')
            .or(`aurora_project_id.eq.${projectId},external_id.eq.aurora_${projectId}`)
            .eq('organization_id', ORG_ID)
            .maybeSingle();

          if (sp && ['site_survey_completed', 'cads_in_progress'].includes(sp.current_stage)) {
            await supabase.from('solar_projects').update({
              current_stage: 'cads_completed',
              cads_completed_at: new Date().toISOString(),
            }).eq('id', sp.id);

            // Log timeline
            await supabase.from('solar_project_timeline').insert({
              organization_id: ORG_ID,
              project_id: sp.id,
              old_stage: sp.current_stage,
              new_stage: 'cads_completed',
              notes: `Aurora design ${designId} completed — auto-advanced`,
            });
          }
        }

        result = { action: 'design_synced', aurora_design_id: designId };
        break;
      }

      // ----- PROPOSAL EVENTS -----
      case 'proposal.created':
      case 'proposal.sent':
      case 'proposal.signed':
      case 'proposal.declined':
      case 'proposal.expired': {
        const proposalData = body.data || body;

        // If proposal is signed, advance deal & solar project
        if (event === 'proposal.signed' && projectId) {
          // Find linked deal
          const { data: deal } = await supabase
            .from('deals')
            .select('id, pipeline_id')
            .or(`aurora_project_id.eq.${projectId},external_id.eq.aurora_${projectId}`)
            .eq('organization_id', ORG_ID)
            .maybeSingle();

          if (deal) {
            // Find the "Contract Signed" stage for this pipeline
            const { data: contractStage } = await supabase
              .from('deal_stages')
              .select('id')
              .eq('pipeline_id', deal.pipeline_id)
              .ilike('name', '%contract%signed%')
              .maybeSingle();

            if (contractStage) {
              await supabase.from('deals').update({
                stage_id: contractStage.id,
                last_stage_change_at: new Date().toISOString(),
                aurora_proposal_url: proposalData.url,
              }).eq('id', deal.id);
            }
          }
        }

        // Log activity
        await supabase.from('activities').insert({
          type: 'note',
          subject: `Aurora proposal ${event.split('.')[1]}: ${proposalData.name || proposalId}`,
          body: `Proposal ${proposalId} — System: ${proposalData.pricing?.system_cost ? `$${proposalData.pricing.system_cost}` : 'N/A'}, PPW: $${proposalData.pricing?.ppw || 'N/A'}`,
          organization_id: ORG_ID,
        });

        result = { action: `proposal_${event.split('.')[1]}`, aurora_proposal_id: proposalId };
        break;
      }

      // ----- E-SIGNATURE EVENTS -----
      case 'esignature.completed': {
        // Same handling as proposal.signed essentially
        result = { action: 'esignature_completed', aurora_project_id: projectId };
        break;
      }

      default:
        result = { action: 'unhandled', event };
    }

    // Re-emit for n8n / automation chains
    await emitEvent(`aurora.${event}`, {
      source: 'aurora_solar',
      event,
      projectId,
      designId,
      proposalId,
      result,
      payload: body,
    });

    return apiSuccess({ received: true, event, processed: true, result });
  } catch (err) {
    console.error('Aurora webhook error:', err);
    return apiError('Internal server error', 500);
  }
}

// GET endpoint for webhook verification (Aurora may send a challenge)
export async function GET(req: NextRequest) {
  const challenge = req.nextUrl.searchParams.get('challenge');
  if (challenge) {
    return NextResponse.json({ challenge });
  }
  return apiSuccess({ status: 'Aurora Solar webhook endpoint active', version: 'v2' });
}
