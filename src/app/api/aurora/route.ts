import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-helpers';
import { AuroraSolarAPI } from '@/lib/integrations/aurora-solar';
import { TeslaSolarAPI } from '@/lib/integrations/tesla-solar';

/*
 * AURORA SOLAR API PROXY
 * Exposes Aurora endpoints to the CRM frontend.
 *
 * GET /api/aurora?action=projects              — List all Aurora projects
 * GET /api/aurora?action=project&id=X          — Get project details
 * GET /api/aurora?action=designs&project_id=X  — List designs for a project
 * GET /api/aurora?action=proposals&project_id=X — List proposals
 * GET /api/aurora?action=components&type=modules — List available components
 * GET /api/aurora?action=webhooks              — List registered webhooks
 * GET /api/aurora?action=consumption&project_id=X — Get consumption profile
 * GET /api/aurora?action=tesla_bom&project_id=X&design_id=Y — Tesla BOM
 * GET /api/aurora?action=search&q=term         — Search projects
 */

function getAurora() {
  return new AuroraSolarAPI(process.env.AURORA_SOLAR_API_KEY, process.env.AURORA_SOLAR_TENANT_ID);
}

function getTesla() {
  return new TeslaSolarAPI(process.env.AURORA_SOLAR_API_KEY, process.env.AURORA_SOLAR_TENANT_ID);
}

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const action = params.get('action') || 'projects';
    const aurora = getAurora();

    switch (action) {
      case 'projects': {
        const limit = parseInt(params.get('limit') || '50');
        const cursor = params.get('cursor') || undefined;
        const res = await aurora.listProjects(limit, cursor);
        if (!res.success) return apiError(res.error || 'Failed', 502);
        return apiSuccess(res.data);
      }

      case 'project': {
        const id = params.get('id');
        if (!id) return apiError('Missing id', 400);
        const res = await aurora.getProject(id);
        if (!res.success) return apiError(res.error || 'Failed', 502);
        return apiSuccess(res.data);
      }

      case 'bundle': {
        const id = params.get('project_id');
        if (!id) return apiError('Missing project_id', 400);
        const res = await aurora.fetchFullProjectBundle(id);
        if (!res.success) return apiError(res.error || 'Failed', 502);
        return apiSuccess(res.data);
      }

      case 'designs': {
        const pid = params.get('project_id');
        if (!pid) return apiError('Missing project_id', 400);
        const res = await aurora.listDesigns(pid);
        if (!res.success) return apiError(res.error || 'Failed', 502);
        return apiSuccess(res.data);
      }

      case 'design': {
        const pid = params.get('project_id');
        const did = params.get('design_id');
        if (!pid || !did) return apiError('Missing project_id or design_id', 400);
        const res = await aurora.getDesign(pid, did);
        if (!res.success) return apiError(res.error || 'Failed', 502);
        return apiSuccess(res.data);
      }

      case 'design_assets': {
        const pid = params.get('project_id');
        const did = params.get('design_id');
        if (!pid || !did) return apiError('Missing project_id or design_id', 400);
        const res = await aurora.listDesignAssets(pid, did);
        if (!res.success) return apiError(res.error || 'Failed', 502);
        return apiSuccess(res.data);
      }

      case 'bom': {
        const pid = params.get('project_id');
        const did = params.get('design_id');
        if (!pid || !did) return apiError('Missing project_id or design_id', 400);
        const res = await aurora.getDesignBOM(pid, did);
        if (!res.success) return apiError(res.error || 'Failed', 502);
        return apiSuccess(res.data);
      }

      case 'proposals': {
        const pid = params.get('project_id');
        if (!pid) return apiError('Missing project_id', 400);
        const res = await aurora.listProposals(pid);
        if (!res.success) return apiError(res.error || 'Failed', 502);
        return apiSuccess(res.data);
      }

      case 'consumption': {
        const pid = params.get('project_id');
        if (!pid) return apiError('Missing project_id', 400);
        const res = await aurora.getConsumptionProfile(pid);
        if (!res.success) return apiError(res.error || 'Failed', 502);
        return apiSuccess(res.data);
      }

      case 'components': {
        const type = (params.get('type') || 'modules') as 'modules' | 'inverters' | 'batteries';
        const res = await aurora.listComponents(type);
        if (!res.success) return apiError(res.error || 'Failed', 502);
        return apiSuccess(res.data);
      }

      case 'webhooks': {
        const res = await aurora.listWebhooks();
        if (!res.success) return apiError(res.error || 'Failed', 502);
        return apiSuccess(res.data);
      }

      case 'search': {
        const q = params.get('q');
        if (!q) return apiError('Missing q parameter', 400);
        const res = await aurora.searchProjects(q);
        if (!res.success) return apiError(res.error || 'Failed', 502);
        return apiSuccess(res.data);
      }

      case 'tesla_bom': {
        const pid = params.get('project_id');
        const did = params.get('design_id');
        if (!pid || !did) return apiError('Missing project_id or design_id', 400);
        const tesla = getTesla();
        const res = await tesla.syncDesignToGoldenDoor(pid, did);
        if (!res.success) return apiError(res.error || 'Failed', 502);
        return apiSuccess(res.data);
      }

      case 'tesla_battery': {
        const pid = params.get('project_id');
        const did = params.get('design_id');
        if (!pid || !did) return apiError('Missing project_id or design_id', 400);
        const tesla = getTesla();
        const res = await tesla.getBatteryConfig(pid, did);
        if (!res.success) return apiError(res.error || 'Failed', 502);
        return apiSuccess(res.data);
      }

      default:
        return apiError(`Unknown action: ${action}`, 400);
    }
  } catch (err) {
    return apiError(`Aurora API error: ${err instanceof Error ? err.message : String(err)}`, 500);
  }
}

// POST /api/aurora — Create projects, proposals, webhooks
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action;
    const aurora = getAurora();

    switch (action) {
      case 'create_project': {
        const res = await aurora.createProject(body.data);
        if (!res.success) return apiError(res.error || 'Failed', 502);
        return apiSuccess(res.data);
      }

      case 'create_proposal': {
        if (!body.project_id) return apiError('Missing project_id', 400);
        const res = await aurora.createProposal(body.project_id, body.data);
        if (!res.success) return apiError(res.error || 'Failed', 502);
        return apiSuccess(res.data);
      }

      case 'create_webhook': {
        const res = await aurora.createWebhook({
          url: body.url || `${process.env.NEXT_PUBLIC_APP_URL || 'https://goldendoorhq.com'}/api/aurora/webhooks`,
          events: body.events || [
            'project.created', 'project.updated',
            'design.created', 'design.updated', 'design.completed',
            'proposal.created', 'proposal.sent', 'proposal.signed', 'proposal.declined',
            'esignature.completed',
          ],
          secret: body.secret || process.env.AURORA_WEBHOOK_SECRET,
        });
        if (!res.success) return apiError(res.error || 'Failed', 502);
        return apiSuccess(res.data);
      }

      case 'set_consumption': {
        if (!body.project_id) return apiError('Missing project_id', 400);
        const res = await aurora.setConsumptionProfile(body.project_id, body.data);
        if (!res.success) return apiError(res.error || 'Failed', 502);
        return apiSuccess(res.data);
      }

      case 'tesla_configure_battery': {
        if (!body.project_id || !body.design_id) return apiError('Missing IDs', 400);
        const tesla = getTesla();
        const res = await tesla.configureBattery(body.project_id, body.design_id, body.data);
        if (!res.success) return apiError(res.error || 'Failed', 502);
        return apiSuccess(res.data);
      }

      default:
        return apiError(`Unknown action: ${action}`, 400);
    }
  } catch (err) {
    return apiError(`Aurora API error: ${err instanceof Error ? err.message : String(err)}`, 500);
  }
}
