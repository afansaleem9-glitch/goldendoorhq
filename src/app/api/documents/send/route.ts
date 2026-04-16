import { NextRequest, NextResponse } from 'next/server';
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
import {
  resolveTemplate,
  slugForTemplateId,
  MissingMappingError,
  DOC_TYPES,
  type DealContext,
  type DocType,
  type CameraCount,
  type TemplateEntry,
} from '@/lib/pandadoc-templates';

type SendBody = {
  project_id?: string;
  template_id?: string;
  doc_type?: string;
  title?: string;
  recipient?: { email?: string; first_name?: string; last_name?: string };
  tokens?: Record<string, string | number | null | undefined>;
  tokens_override?: Record<string, string | number | null | undefined>;
  message?: string;
  deal_context?: DealContext;
};

// doc_type values that get routed through resolveTemplate. Must stay in sync
// with DOC_TYPES in pandadoc-templates.ts.
const ROUTABLE_DOC_TYPES = new Set<string>(DOC_TYPES);

// documents.doc_type CHECK constraint only allows these values today.
// See status-2026-04-15.md §2.
const DB_DOC_TYPE_BY_ROUTABLE: Record<DocType, 'contract' | 'permit' | 'other'> = {
  psa: 'contract',
  solar_bundle_psa: 'contract',
  smart_home_agreement: 'contract',
  sales_commission_agreement: 'contract',
  nda: 'other',
  certificate_of_completion: 'other',
};

function isCameraCount(n: unknown): n is CameraCount {
  return typeof n === 'number' && Number.isInteger(n) && n >= 3 && n <= 8;
}

function normalizeDealContext(raw: unknown): DealContext {
  if (!raw || typeof raw !== 'object') return {};
  const r = raw as Record<string, unknown>;
  const out: DealContext = {};
  if (r.vertical === 'alarm' || r.vertical === 'solar' || r.vertical === 'roofing') out.vertical = r.vertical;
  if (typeof r.state === 'string' && r.state.length >= 2 && r.state.length <= 3) out.state = r.state.toUpperCase();
  if (r.financing === 'wells_fargo' || r.financing === 'cash' || r.financing === 'other') out.financing = r.financing;
  if (r.language === 'en' || r.language === 'es') out.language = r.language;
  if (isCameraCount(r.camera_count)) out.camera_count = r.camera_count;
  return out;
}

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
  if (!body.doc_type || typeof body.doc_type !== 'string') return apiError('doc_type is required', 400);
  if (!body.recipient || !isEmail(body.recipient.email)) return apiError('recipient.email is required', 400);

  // Two paths supported:
  //   A) `template_id` (legacy / mobile back-compat): caller picks the template.
  //   B) `deal_context` + routable doc_type: server picks via resolveTemplate.
  // Either can supply `template_id` to force-override even on routable types.
  let resolvedTemplate: TemplateEntry | null = null;
  let templateId: string | null = typeof body.template_id === 'string' && body.template_id ? body.template_id : null;
  const dealContext = normalizeDealContext(body.deal_context);
  const isRoutable = ROUTABLE_DOC_TYPES.has(body.doc_type);

  if (!templateId) {
    if (!isRoutable) {
      return apiError('template_id is required for non-routable doc_types', 400);
    }
    try {
      resolvedTemplate = resolveTemplate(body.doc_type as DocType, dealContext);
      templateId = resolvedTemplate.id;
    } catch (err) {
      if (err instanceof MissingMappingError) {
        console.warn('[documents/send] template_mapping_missing', {
          doc_type: body.doc_type,
          deal_context: dealContext,
          detail: err.detail,
        });
        return NextResponse.json(
          { success: false, error: err.detail, code: err.code },
          { status: 422 }
        );
      }
      throw err;
    }
  }

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
  // tokens_override is the new name; `tokens` is kept for back-compat with the
  // mobile caller. Override wins on conflict.
  const callerTokens = { ...(body.tokens || {}), ...(body.tokens_override || {}) };
  const tokens = { ...projectDefaults, ...callerTokens };

  const docTitle =
    body.title?.trim() ||
    `${body.doc_type} — ${project.customer_first_name ?? ''} ${project.customer_last_name ?? ''}`.trim();

  const createRes = await createDocumentFromTemplate({
    name: docTitle,
    template_uuid: templateId,
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

  // The DB's doc_type CHECK constraint only accepts contract/permit/other.
  // For routable doc_types we map to the DB value; legacy callers still pass
  // the raw string (backwards compat).
  const dbDocType = isRoutable
    ? DB_DOC_TYPE_BY_ROUTABLE[body.doc_type as DocType]
    : body.doc_type;

  const { data: inserted, error: insertErr } = await supabase
    .from('documents')
    .insert({
      project_id: project.id,
      organization_id: project.organization_id ?? ORG_ID,
      doc_type: dbDocType,
      title: docTitle,
      status: 'sent',
      signature_request_id: pandadocId,
      metadata: {
        provider: 'pandadoc',
        template_id: templateId,
        template_slug: slugForTemplateId(templateId),
        requested_doc_type: body.doc_type,
        deal_context: isRoutable ? dealContext : null,
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

  return apiSuccess({
    document_id: inserted.id,
    pandadoc_id: pandadocId,
    status: 'sent',
    template_id: templateId,
    template_slug: slugForTemplateId(templateId),
  });
}
