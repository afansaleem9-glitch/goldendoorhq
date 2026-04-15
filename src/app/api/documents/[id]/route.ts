import { NextRequest } from 'next/server';
import { requireAuth, UnauthorizedError } from '@/lib/require-auth';
import { createServerClient } from '@/lib/supabase';
import { apiSuccess, apiError } from '@/lib/api-helpers';
import { getDocumentDetails, type PandaDocDocumentDetails } from '@/lib/pandadoc';

function isUuid(v: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
}

type RecipientOut = { name: string; email: string; status: 'completed' | 'pending'; signed_at: string | null };
type ActivityOut = { type: string; timestamp: string; actor: string | null };

function buildRecipients(details: PandaDocDocumentDetails | null): RecipientOut[] {
  if (!details?.recipients) return [];
  return details.recipients.map((r) => {
    const name = [r.first_name, r.last_name].filter(Boolean).join(' ').trim() || r.email;
    return {
      name,
      email: r.email,
      status: r.has_completed ? 'completed' : 'pending',
      signed_at: r.has_completed ? (details.date_completed ?? null) : null,
    };
  });
}

function buildActivity(
  row: { created_at: string | null; signed_at: string | null; signed_by: string | null; metadata: Record<string, unknown> | null },
  details: PandaDocDocumentDetails | null
): ActivityOut[] {
  const out: ActivityOut[] = [];
  if (row.created_at) out.push({ type: 'created', timestamp: row.created_at, actor: null });
  if (details?.date_created && details.date_created !== row.created_at) {
    out.push({ type: 'pandadoc_created', timestamp: details.date_created, actor: null });
  }

  const events = Array.isArray(row.metadata?.events) ? (row.metadata!.events as Array<Record<string, unknown>>) : [];
  for (const e of events) {
    const at = typeof e.at === 'string' ? e.at : null;
    const status = typeof e.status === 'string' ? e.status : '';
    const actor = typeof e.actor === 'string' ? e.actor : null;
    if (!at) continue;
    const type =
      status === 'document.completed' ? 'signed' :
      status === 'document.viewed' ? 'viewed' :
      status === 'document.sent' ? 'sent' :
      status === 'document.declined' ? 'declined' :
      status === 'document.expired' ? 'expired' :
      status || 'webhook';
    out.push({ type, timestamp: at, actor });
  }

  if (row.signed_at) out.push({ type: 'signed', timestamp: row.signed_at, actor: row.signed_by });

  const seen = new Set<string>();
  return out
    .filter((e) => {
      const k = `${e.timestamp}|${e.type}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
  } catch (err) {
    if (err instanceof UnauthorizedError) return err.response;
    throw err;
  }

  const { id } = await ctx.params;
  if (!isUuid(id)) return apiError('Invalid document id', 400);

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('documents')
    .select('id, doc_type, title, status, signature_request_id, signed_at, signed_by, created_at, metadata')
    .eq('id', id)
    .is('deleted_at', null)
    .maybeSingle();

  if (error) {
    console.error('[documents/detail] lookup failed', error);
    return apiError('Lookup failed', 500);
  }
  if (!data) return apiError('Document not found', 404);

  const metadata = (data.metadata && typeof data.metadata === 'object') ? (data.metadata as Record<string, unknown>) : null;

  let details: PandaDocDocumentDetails | null = null;
  if (data.signature_request_id) {
    const res = await getDocumentDetails(data.signature_request_id);
    if (res.ok) details = res.data;
    else console.error('[documents/detail] PandaDoc details failed', res.status, res.error);
  }

  return apiSuccess({
    id: data.id,
    title: data.title,
    doc_type: data.doc_type,
    status: data.status,
    created_at: data.created_at,
    signed_at: data.signed_at ?? details?.date_completed ?? null,
    expires_at: details?.expiration_date ?? null,
    pandadoc_id: data.signature_request_id,
    recipients: buildRecipients(details),
    activity: buildActivity(
      { created_at: data.created_at, signed_at: data.signed_at, signed_by: data.signed_by, metadata },
      details
    ),
    download_available: !!data.signature_request_id,
  });
}
