import { NextRequest } from 'next/server';
import { requireAuth, UnauthorizedError } from '@/lib/require-auth';
import { createServerClient, ORG_ID } from '@/lib/supabase';
import { apiSuccess, apiError } from '@/lib/api-helpers';
import {
  createDocumentFromTemplate,
  sendDocument,
  waitForDraft,
  getDocument,
  type PandaDocRecipient,
} from '@/lib/pandadoc';

type SendBody = {
  project_id?: string;
  template_id?: string;
  doc_type?: string;
  title?: string;
  recipient?: { email?: string; first_name?: string; last_name?: string };
  tokens?: Record<string, string | number | null | undefined>;
  message?: string;
};

function isUuid(v: unknown): v is string {
  return typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
}

function isEmail(v: unknown): v is string {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth();
  } catch (err) {
    if (err instanceof UnauthorizedError) return err.response;
    throw err;
  }

  let body: SendBody;
  try {
    body = (await req.json()) as SendBody;
  } catch {
    return apiError('Invalid JSON body', 400);
  }

  if (!isUuid(body.project_id)) return apiError('project_id must be a uuid', 400);
  if (!body.template_id || typeof body.template_id !== 'string') return apiError('template_id is required', 400);
  if (!body.doc_type || typeof body.doc_type !== 'string') return apiError('doc_type is required', 400);
  if (!body.recipient || !isEmail(body.recipient.email)) return apiError('recipient.email is required', 400);

  const supabase = createServerClient();
  const { data: project, error: projectErr } = await supabase
    .from('projects')
    .select('id, organization_id, customer_first_name, customer_last_name, customer_email, customer_phone, address, city, state, zip, package_name, package_price, monthly_rate, contract_term_months')
    .eq('id', body.project_id)
    .is('deleted_at', null)
    .maybeSingle();

  if (projectErr) {
    console.error('[documents/send] project lookup failed', projectErr);
    return apiError('Project lookup failed', 500);
  }
  if (!project) return apiError('Project not found', 404);
  if (project.organization_id && project.organization_id !== ORG_ID) return apiError('Project not in this organization', 403);

  const recipient: PandaDocRecipient = {
    email: body.recipient.email!,
    first_name: body.recipient.first_name || project.customer_first_name || undefined,
    last_name: body.recipient.last_name || project.customer_last_name || undefined,
  };

  const projectDefaults: Record<string, string | number | null | undefined> = {
    'Client.FirstName': project.customer_first_name ?? undefined,
    'Client.LastName': project.customer_last_name ?? undefined,
    'Client.Email': project.customer_email ?? undefined,
    'Client.Phone': project.customer_phone ?? undefined,
    'Client.Address': project.address ?? undefined,
    'Client.City': project.city ?? undefined,
    'Client.State': project.state ?? undefined,
    'Client.Zip': project.zip ?? undefined,
    'Package.Name': project.package_name ?? undefined,
    'Package.Price': project.package_price ?? undefined,
    'Package.MonthlyRate': project.monthly_rate ?? undefined,
    'Package.ContractMonths': project.contract_term_months ?? undefined,
  };
  const tokens = { ...projectDefaults, ...(body.tokens || {}) };

  const docTitle =
    body.title?.trim() ||
    `${body.doc_type} — ${project.customer_first_name ?? ''} ${project.customer_last_name ?? ''}`.trim();

  const createRes = await createDocumentFromTemplate({
    name: docTitle,
    template_uuid: body.template_id,
    recipients: [recipient],
    tokens,
  });

  if (!createRes.ok) {
    console.error('[documents/send] PandaDoc create failed', createRes.status, createRes.error, createRes.body);
    if (createRes.status >= 500) return apiError('Document provider unavailable', 502);
    return apiError(`Failed to create document: ${createRes.error}`, 400);
  }

  const pandadocId = createRes.data.id;

  const ready = await waitForDraft(pandadocId);
  if (!ready) {
    const last = await getDocument(pandadocId);
    console.error('[documents/send] PandaDoc draft not ready', last.ok ? last.data.status : last.error);
    return apiError('Document not ready for send', 502);
  }

  const sendRes = await sendDocument(pandadocId, body.message);
  if (!sendRes.ok) {
    console.error('[documents/send] PandaDoc send failed', sendRes.status, sendRes.error, sendRes.body);
    if (sendRes.status >= 500) return apiError('Document provider unavailable', 502);
    return apiError(`Failed to send document: ${sendRes.error}`, 400);
  }

  const { data: inserted, error: insertErr } = await supabase
    .from('documents')
    .insert({
      project_id: project.id,
      organization_id: project.organization_id ?? ORG_ID,
      doc_type: body.doc_type,
      title: docTitle,
      status: 'sent',
      signature_request_id: pandadocId,
      metadata: {
        provider: 'pandadoc',
        template_id: body.template_id,
        recipient_email: recipient.email,
        pandadoc_create: createRes.data,
        pandadoc_send: sendRes.data,
      },
    })
    .select('id')
    .single();

  if (insertErr || !inserted) {
    console.error('[documents/send] documents insert failed', insertErr);
    return apiError('Document sent but failed to record locally', 500);
  }

  return apiSuccess({ document_id: inserted.id, pandadoc_id: pandadocId, status: 'sent' });
}
