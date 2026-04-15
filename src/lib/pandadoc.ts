import crypto from 'crypto';

const PANDADOC_BASE = 'https://api.pandadoc.com/public/v1';

export type PandaDocRecipient = {
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
};

export type CreateDocumentInput = {
  name: string;
  template_uuid: string;
  recipients: PandaDocRecipient[];
  tokens?: Record<string, string | number | null | undefined>;
};

export type PandaDocDocument = {
  id: string;
  name: string;
  status: string;
  date_created?: string;
  date_modified?: string;
  recipients?: Array<{ email: string; first_name?: string; last_name?: string; has_completed?: boolean }>;
  [k: string]: unknown;
};

function apiKey(): string {
  const key = process.env.PANDADOC_API_KEY;
  if (!key) throw new Error('PANDADOC_API_KEY is not set');
  return key;
}

async function pandaFetch<T>(
  path: string,
  init: RequestInit & { expectJson?: boolean } = {}
): Promise<{ ok: true; status: number; data: T } | { ok: false; status: number; error: string; body?: unknown }> {
  const res = await fetch(`${PANDADOC_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `API-Key ${apiKey()}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let parsed: unknown = undefined;
  if (text) {
    try { parsed = JSON.parse(text); } catch { parsed = text; }
  }
  if (!res.ok) {
    const message =
      (parsed && typeof parsed === 'object' && 'detail' in parsed && typeof (parsed as { detail: unknown }).detail === 'string'
        ? (parsed as { detail: string }).detail
        : undefined) ||
      (parsed && typeof parsed === 'object' && 'message' in parsed && typeof (parsed as { message: unknown }).message === 'string'
        ? (parsed as { message: string }).message
        : undefined) ||
      `PandaDoc ${res.status}`;
    return { ok: false, status: res.status, error: message, body: parsed };
  }
  return { ok: true, status: res.status, data: (parsed as T) ?? (undefined as unknown as T) };
}

export async function createDocumentFromTemplate(input: CreateDocumentInput) {
  const tokens = input.tokens
    ? Object.entries(input.tokens)
        .filter(([, v]) => v !== undefined && v !== null)
        .map(([name, value]) => ({ name, value: String(value) }))
    : [];

  return pandaFetch<PandaDocDocument>('/documents', {
    method: 'POST',
    body: JSON.stringify({
      name: input.name,
      template_uuid: input.template_uuid,
      recipients: input.recipients,
      tokens,
    }),
  });
}

export async function getDocument(id: string) {
  return pandaFetch<PandaDocDocument>(`/documents/${id}`, { method: 'GET' });
}

export async function sendDocument(id: string, message?: string) {
  return pandaFetch<PandaDocDocument>(`/documents/${id}/send`, {
    method: 'POST',
    body: JSON.stringify({ message: message ?? '', silent: false }),
  });
}

export async function getTemplateDetails(id: string) {
  return pandaFetch<{ id: string; name: string; tokens?: Array<{ name: string }>; fields?: Array<{ name: string }> }>(
    `/templates/${id}/details`,
    { method: 'GET' }
  );
}

export async function waitForDraft(id: string, timeoutMs = 6000, intervalMs = 600): Promise<PandaDocDocument | null> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const res = await getDocument(id);
    if (res.ok && res.data.status === 'document.draft') return res.data;
    if (res.ok && res.data.status && res.data.status !== 'document.uploaded') return res.data;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return null;
}

export function verifyWebhookSignature(rawBody: string, signature: string | null | undefined): boolean {
  const secret = process.env.PANDADOC_WEBHOOK_SHARED_KEY;
  if (!secret) return false;
  if (!signature) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  try {
    const a = Buffer.from(signature, 'hex');
    const b = Buffer.from(expected, 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
