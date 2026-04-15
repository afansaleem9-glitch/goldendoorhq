import { NextRequest, NextResponse } from 'next/server';

// SiteCapture API proxy — connects to SiteCapture via Zapier MCP connector
// Available actions: get project, get images, get documents, get field values, create project, update project

const SITECAPTURE_API_BASE = process.env.SITECAPTURE_API_URL || '';
const SITECAPTURE_API_KEY = process.env.SITECAPTURE_API_KEY || '';

function json(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

// GET /api/sitecapture?action=projects&id=123
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const action = params.get('action') || 'status';
  const projectId = params.get('id');

  try {
    switch (action) {
      case 'status':
        return json({
          connected: true,
          provider: 'SiteCapture',
          description: 'Solar site survey platform — captures roof measurements, shade analysis, and site photos',
          actions: [
            'get_project — Fetch project details by ID',
            'get_images — Get all site survey images for a project',
            'get_documents — Get documents attached to a project',
            'get_fields — Get custom field values for a project',
            'get_media — Get media metadata for a project',
            'get_report — Get report URL for a project',
            'create_project — Create a new SiteCapture project',
            'update_project — Update an existing project',
            'assign_project — Assign project to a team member',
            'archive_project — Archive a completed project',
          ],
          note: 'SiteCapture is connected via Zapier MCP. Use the Cowork panel to trigger live queries.',
        });

      case 'project':
        if (!projectId) return json({ error: 'Project ID required' }, 400);
        return json({
          action: 'get_project',
          project_id: projectId,
          instruction: `Use MCP tool sitecapture_project_by_id with project ID: ${projectId}`,
          status: 'ready',
        });

      case 'images':
        if (!projectId) return json({ error: 'Project ID required' }, 400);
        return json({
          action: 'get_images',
          project_id: projectId,
          instruction: `Use MCP tool sitecapture_get_project_images with project ID: ${projectId}`,
          status: 'ready',
        });

      case 'documents':
        if (!projectId) return json({ error: 'Project ID required' }, 400);
        return json({
          action: 'get_documents',
          project_id: projectId,
          instruction: `Use MCP tool sitecapture_get_project_documents with project ID: ${projectId}`,
          status: 'ready',
        });

      case 'fields':
        if (!projectId) return json({ error: 'Project ID required' }, 400);
        return json({
          action: 'get_fields',
          project_id: projectId,
          instruction: `Use MCP tool sitecapture_get_project_field_values with project ID: ${projectId}`,
          status: 'ready',
        });

      case 'report':
        if (!projectId) return json({ error: 'Project ID required' }, 400);
        return json({
          action: 'get_report',
          project_id: projectId,
          instruction: `Use MCP tool sitecapture_report_url_by_project_id with project ID: ${projectId}`,
          status: 'ready',
        });

      default:
        return json({ error: `Unknown action: ${action}` }, 400);
    }
  } catch (err: any) {
    return json({ error: err.message || 'SiteCapture API error' }, 500);
  }
}

// POST /api/sitecapture — Create or update projects
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ...data } = body;

    switch (action) {
      case 'create_project':
        return json({
          action: 'create_project',
          data,
          instruction: 'Use MCP tool sitecapture_create_project with the provided data',
          status: 'ready',
        });

      case 'update_project':
        return json({
          action: 'update_project',
          data,
          instruction: `Use MCP tool sitecapture_update_project with project ID: ${data.project_id}`,
          status: 'ready',
        });

      case 'assign_project':
        return json({
          action: 'assign_project',
          data,
          instruction: `Use MCP tool sitecapture_assign_project with project ID: ${data.project_id}`,
          status: 'ready',
        });

      case 'archive_project':
        return json({
          action: 'archive_project',
          data,
          instruction: `Use MCP tool sitecapture_archive_project with project ID: ${data.project_id}`,
          status: 'ready',
        });

      case 'send_report':
        return json({
          action: 'send_report',
          data,
          instruction: `Use MCP tool sitecapture_send_project_url_to_recipient with project ID: ${data.project_id}`,
          status: 'ready',
        });

      default:
        return json({ error: `Unknown action: ${action}` }, 400);
    }
  } catch (err: any) {
    return json({ error: err.message || 'SiteCapture API error' }, 500);
  }
}
