import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { verifyWebhookSignature } from '@/lib/pandadoc';

type PandaDocEvent = {
  event: string;
  event_id?: string;
  data?: {
    id?: string;
    status?: string;
    name?: string;
    date_completed?: string;
    date_modified?: string;
    recipients?: Array<{ email?: string; has_completed?: boolean; first_name?: string; last_name?: string }>;
    metadata?: Record<string, unknown>;
  };
};

// documents.status CHECK constraint allows: pending, sent, viewed, signed, expired, rejected
const STATUS_MAP: Record<string, string> = {
  'document.sent': 'sent',
  'document.viewed': 'viewed',
  'document.completed': 'signed',
  'document.declined': 'rejected',
  'document.expired': 'expired',
};

function pickSigner(recipients?: PandaDocEvent['data'] extends infer D ? (D extends { recipients?: infer R } ? R : undefined) : undefined): string | null {
  if (!recipients || !Array.isArray(recipients)) return null;
  const signed = recipients.find((r) => r && r.has_completed);
  return signed?.email || recipients[0]?.email || null;
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  const headerSig = req.headers.get('signature') || req.headers.get('x-pandadoc-signature');
  const querySig = req.nextUrl.searchParams.get('signature');
  const sig = headerSig || querySig;

  if (!verifyWebhookSignature(rawBody, sig)) {
    return Response.json({ error: 'invalid signature' }, { status: 401 });
  }

  let events: PandaDocEvent[];
  try {
    const parsed = JSON.parse(rawBody);
    events = Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return Response.json({ error: 'invalid json' }, { status: 400 });
  }

  const supabase = createServerClient();
  const results: Array<{ pandadoc_id?: string; event: string; action: string }> = [];

  for (const evt of events) {
    if (evt.event !== 'document_state_changed') {
      results.push({ event: evt.event, action: 'ignored' });
      continue;
    }

    const pandadocId = evt.data?.id;
    const rawStatus = evt.data?.status;
    if (!pandadocId || !rawStatus) {
      results.push({ event: evt.event, action: 'missing_fields' });
      continue;
    }

    const mapped = STATUS_MAP[rawStatus];
    if (!mapped) {
      results.push({ pandadoc_id: pandadocId, event: evt.event, action: `unmapped:${rawStatus}` });
      continue;
    }

    const { data: existing, error: selectErr } = await supabase
      .from('documents')
      .select('id, metadata, status')
      .eq('signature_request_id', pandadocId)
      .is('deleted_at', null)
      .maybeSingle();

    if (selectErr) {
      console.error('[pandadoc-webhook] select failed', selectErr);
      results.push({ pandadoc_id: pandadocId, event: evt.event, action: 'db_error' });
      continue;
    }

    if (!existing) {
      console.warn('[pandadoc-webhook] orphan event, no matching document', pandadocId);
      results.push({ pandadoc_id: pandadocId, event: evt.event, action: 'orphan' });
      continue;
    }

    const update: Record<string, unknown> = { status: mapped };
    if (mapped === 'signed') {
      update.signed_at = evt.data?.date_completed || new Date().toISOString();
      update.signed_by = pickSigner(evt.data?.recipients);
    }

    const prevMeta = (existing.metadata && typeof existing.metadata === 'object') ? existing.metadata as Record<string, unknown> : {};
    const history = Array.isArray(prevMeta.events) ? [...(prevMeta.events as unknown[])] : [];
    history.push({ at: new Date().toISOString(), event: evt.event, status: rawStatus, data: evt.data });
    update.metadata = { ...prevMeta, events: history };

    const { error: updateErr } = await supabase
      .from('documents')
      .update(update)
      .eq('id', existing.id);

    if (updateErr) {
      console.error('[pandadoc-webhook] update failed', updateErr);
      results.push({ pandadoc_id: pandadocId, event: evt.event, action: 'update_failed' });
      continue;
    }

    results.push({ pandadoc_id: pandadocId, event: evt.event, action: `updated:${mapped}` });
  }

  return Response.json({ received: events.length, results }, { status: 200 });
}

export async function GET() {
  return Response.json({ status: 'PandaDoc webhook endpoint active' });
}
