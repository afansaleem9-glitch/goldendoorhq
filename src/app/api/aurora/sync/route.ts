import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiSuccess, apiError, emitEvent } from '@/lib/api-helpers';
import { AuroraSolarAPI } from '@/lib/integrations/aurora-solar';

/*
 * AURORA SOLAR SYNC API
 * Endpoints for syncing Aurora Solar data into GoldenDoor CRM.
 *
 * GET  /api/aurora/sync              — Sync all Aurora projects to CRM
 * GET  /api/aurora/sync?project=ID   — Sync a single Aurora project
 * POST /api/aurora/sync              — Push a CRM deal to Aurora as a project
 *
 * Available Scopes (from Aurora Settings > Apps):
 *   read_tenants, read_versions, write_versions, read_users, list_users,
 *   write_users, read_sso_providers, write_sso_providers, read_teams,
 *   read_partners, read_projects, list_projects, write_projects,
 *   read_consumption_profiles, write_consumption_profiles,
 *   read_design_requests, write_design_requests, read_designs, write_designs,
 *   read_design_assets, write_design_assets, read_components,
 *   read_pricing, write_pricing, read_financings, read_proposals,
 *   write_proposals, read_agreements, read_site_surveys, write_site_surveys,
 *   read_plan_sets, write_plan_sets, read_webhooks, write_webhooks
 */

const ORG_ID = 'a97d1a8b-3691-42a3-b116-d131e085b00f';

function getAuroraClient() {
  return new AuroraSolarAPI(
    process.env.AURORA_SOLAR_API_KEY,
    process.env.AURORA_SOLAR_TENANT_ID
  );
}

// GET /api/aurora/sync — Pull Aurora projects into CRM
export async function GET(req: NextRequest) {
  try {
    const aurora = getAuroraClient();
    const supabase = createServerClient();
    const singleProjectId = req.nextUrl.searchParams.get('project');

    // Single project sync
    if (singleProjectId) {
      const bundle = await aurora.fetchFullProjectBundle(singleProjectId);
      if (!bundle.success || !bundle.data) {
        return apiError(bundle.error || 'Failed to fetch Aurora project', 502);
      }

      // Upsert into solar_projects
      const { data, error } = await supabase
        .from('solar_projects')
        .upsert({
          organization_id: ORG_ID,
          aurora_project_id: singleProjectId,
          ...bundle.data,
        }, { onConflict: 'aurora_project_id' })
        .select()
        .single();

      if (error) return apiError(error.message, 500);
      return apiSuccess({ synced: 1, project: data });
    }

    // Full sync — paginate through all Aurora projects
    let cursor: string | undefined;
    let totalSynced = 0;
    const errors: string[] = [];

    do {
      const projectsRes = await aurora.listProjects(50, cursor);
      if (!projectsRes.success || !projectsRes.data) break;

      const projects = projectsRes.data;
      if (projects.length === 0) break;

      for (const project of projects) {
        try {
          const bundle = await aurora.fetchFullProjectBundle(project.id);
          if (bundle.success && bundle.data) {
            await supabase
              .from('solar_projects')
              .upsert({
                organization_id: ORG_ID,
                aurora_project_id: project.id,
                ...bundle.data,
              }, { onConflict: 'aurora_project_id' });
            totalSynced++;
          }
        } catch (err) {
          errors.push(`Project ${project.id}: ${err instanceof Error ? err.message : String(err)}`);
        }
      }

      // Get cursor for next page
      cursor = projects.length >= 50 ? projects[projects.length - 1].id : undefined;
    } while (cursor);

    await emitEvent('aurora.sync_completed', {
      totalSynced,
      errors: errors.length,
      timestamp: new Date().toISOString(),
    });

    return apiSuccess({ synced: totalSynced, errors });
  } catch (err) {
    return apiError(`Sync failed: ${err instanceof Error ? err.message : String(err)}`, 500);
  }
}

// POST /api/aurora/sync — Push a CRM deal/contact to Aurora as a new project
export async function POST(req: NextRequest) {
  try {
    const aurora = getAuroraClient();
    const supabase = createServerClient();
    const body = await req.json();

    const { deal_id, contact_id } = body;
    if (!deal_id && !contact_id) {
      return apiError('Provide deal_id or contact_id to create an Aurora project', 400);
    }

    // Load deal + contact from CRM
    let deal: Record<string, unknown> | null = null;
    let contact: Record<string, unknown> | null = null;

    if (deal_id) {
      const { data } = await supabase
        .from('deals')
        .select('*, contacts(*)')
        .eq('id', deal_id)
        .single();
      deal = data;
      contact = data?.contacts as Record<string, unknown> || null;
    }

    if (contact_id && !contact) {
      const { data } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', contact_id)
        .single();
      contact = data;
    }

    if (!contact) return apiError('Contact not found', 404);

    // Create Aurora project
    const auroraRes = await aurora.createProject({
      name: deal
        ? `${contact.first_name} ${contact.last_name} — ${contact.address_line1 || 'Solar Project'}`
        : `${contact.first_name} ${contact.last_name} — Solar`,
      address: {
        street: (contact.address_line1 as string) || '',
        city: (contact.city as string) || '',
        state: (contact.state as string) || '',
        zip_code: (contact.zip as string) || '',
        country: 'US',
      },
      customer: {
        first_name: contact.first_name as string,
        last_name: contact.last_name as string,
        email: (contact.email as string) || undefined,
        phone: (contact.phone as string) || undefined,
      },
      external_provider_id: deal_id || contact_id,
    });

    if (!auroraRes.success || !auroraRes.data) {
      return apiError(auroraRes.error || 'Failed to create Aurora project', 502);
    }

    const auroraProject = auroraRes.data;

    // Update deal with Aurora project link
    if (deal_id) {
      await supabase.from('deals').update({
        aurora_project_id: auroraProject.id,
        aurora_synced_at: new Date().toISOString(),
      }).eq('id', deal_id);
    }

    // Log activity
    await supabase.from('activities').insert({
      type: 'note',
      subject: `Aurora project created: ${auroraProject.name}`,
      body: `Aurora project ${auroraProject.id} created and linked to CRM`,
      deal_id: deal_id || null,
      contact_id: contact_id || (contact?.id as string),
      organization_id: ORG_ID,
    });

    await emitEvent('aurora.project_pushed', {
      auroraProjectId: auroraProject.id,
      dealId: deal_id,
      contactId: contact_id || contact?.id,
    });

    return apiSuccess({
      aurora_project: auroraProject,
      crm_deal_id: deal_id,
      crm_contact_id: contact_id || contact?.id,
    });
  } catch (err) {
    return apiError(`Push failed: ${err instanceof Error ? err.message : String(err)}`, 500);
  }
}
