import { NextRequest } from 'next/server';
import { requireAuth, UnauthorizedError } from '@/lib/require-auth';
import { createServerClient } from '@/lib/supabase';
import { apiSuccess, apiError } from '@/lib/api-helpers';

function isUuid(v: string | null): v is string {
  return !!v && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
}

export async function GET(req: NextRequest) {
  try {
    await requireAuth();
  } catch (err) {
    if (err instanceof UnauthorizedError) return err.response;
    throw err;
  }

  const projectId = req.nextUrl.searchParams.get('project_id');
  if (!isUuid(projectId)) return apiError('project_id must be a uuid', 400);

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('documents')
    .select('id, doc_type, title, status, signature_request_id, created_at, signed_at, metadata')
    .eq('project_id', projectId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('[documents/list] lookup failed', error);
    return apiError('Lookup failed', 500);
  }

  const rows = (data ?? []).map((r) => {
    const meta = (r.metadata && typeof r.metadata === 'object') ? (r.metadata as Record<string, unknown>) : null;
    const recipient_email = meta && typeof meta.recipient_email === 'string' ? meta.recipient_email : null;
    return {
      id: r.id,
      doc_type: r.doc_type,
      title: r.title,
      status: r.status,
      signature_request_id: r.signature_request_id,
      recipient_email,
      created_at: r.created_at,
      signed_at: r.signed_at,
    };
  });

  return apiSuccess(rows);
}
