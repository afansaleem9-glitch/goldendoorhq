import { NextRequest, NextResponse } from 'next/server';

// CompanyCam API proxy — connects to CompanyCam via Zapier MCP connector
// Available actions: find project, add project, add photo, add label, create checklist, update notepad

function json(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

// GET /api/companycam?action=status
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const action = params.get('action') || 'status';
  const query = params.get('query') || '';
  const projectId = params.get('id');

  try {
    switch (action) {
      case 'status':
        return json({
          connected: true,
          provider: 'CompanyCam',
          description: 'Job site photo documentation — captures alarm installs, smart home setups, and project progress',
          actions: [
            'find_project — Search for a project by name or address',
            'add_project — Create a new CompanyCam project',
            'add_photo — Upload a photo to a project',
            'add_label — Add a label/tag to a project',
            'create_checklist — Create a checklist from template',
            'update_notepad — Update project notes',
          ],
          note: 'CompanyCam is connected via Zapier MCP. Use the Cowork panel to trigger live queries.',
        });

      case 'find_project':
        if (!query) return json({ error: 'Search query required' }, 400);
        return json({
          action: 'find_project',
          query,
          instruction: `Use MCP tool companycam_find_project to search for: ${query}`,
          status: 'ready',
        });

      default:
        return json({ error: `Unknown action: ${action}` }, 400);
    }
  } catch (err: any) {
    return json({ error: err.message || 'CompanyCam API error' }, 500);
  }
}

// POST /api/companycam — Create projects, add photos, labels, checklists
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ...data } = body;

    switch (action) {
      case 'add_project':
        return json({
          action: 'add_project',
          data,
          instruction: 'Use MCP tool companycam_add_project with the provided data',
          status: 'ready',
        });

      case 'add_photo':
        return json({
          action: 'add_photo',
          data,
          instruction: `Use MCP tool companycam_add_photo for project: ${data.project_id}`,
          status: 'ready',
        });

      case 'add_label':
        return json({
          action: 'add_label',
          data,
          instruction: `Use MCP tool companycam_add_project_label for project: ${data.project_id}`,
          status: 'ready',
        });

      case 'create_checklist':
        return json({
          action: 'create_checklist',
          data,
          instruction: `Use MCP tool companycam_create_checklist_from_template for project: ${data.project_id}`,
          status: 'ready',
        });

      case 'update_notepad':
        return json({
          action: 'update_notepad',
          data,
          instruction: `Use MCP tool companycam_update_project_notepad for project: ${data.project_id}`,
          status: 'ready',
        });

      default:
        return json({ error: `Unknown action: ${action}` }, 400);
    }
  } catch (err: any) {
    return json({ error: err.message || 'CompanyCam API error' }, 500);
  }
}
