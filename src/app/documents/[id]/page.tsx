import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, ExternalLink, Mail, CheckCircle2, Clock, FileText, User as UserIcon } from 'lucide-react';
import { createServerClient } from '@/lib/supabase-server';
import { getDocumentDetails, type PandaDocDocumentDetails } from '@/lib/pandadoc';

export const dynamic = 'force-dynamic';

type DocRow = {
  id: string;
  doc_type: string | null;
  title: string | null;
  status: string | null;
  signature_request_id: string | null;
  signed_at: string | null;
  signed_by: string | null;
  created_at: string | null;
  updated_at: string | null;
  metadata: Record<string, unknown> | null;
  project: { project_number: string | null; customer_first_name: string | null; customer_last_name: string | null } | null;
};

const STATUS_STYLE: Record<string, { className: string; label: string }> = {
  pending: { className: 'bg-gray-100 text-gray-700 border-gray-200', label: 'Pending' },
  sent: { className: 'bg-gray-100 text-gray-700 border-gray-200', label: 'Sent' },
  viewed: { className: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Viewed' },
  signed: { className: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Signed' },
  rejected: { className: 'bg-red-50 text-red-700 border-red-200', label: 'Rejected' },
  expired: { className: 'bg-red-50 text-red-700 border-red-200', label: 'Expired' },
};

function StatusPill({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${s.className}`}>
      {s.label}
    </span>
  );
}

function fmt(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function projectLabel(p: DocRow['project']): string {
  if (!p) return '—';
  const name = [p.customer_first_name, p.customer_last_name].filter(Boolean).join(' ').trim();
  const num = p.project_number ? `#${p.project_number}` : '';
  return [num, name].filter(Boolean).join(' · ') || '—';
}

type TimelineEntry = { at: string; label: string; detail?: string; tone: 'neutral' | 'success' | 'info' | 'danger' };

function buildTimeline(row: DocRow, details: PandaDocDocumentDetails | null): TimelineEntry[] {
  const out: TimelineEntry[] = [];
  if (row.created_at) out.push({ at: row.created_at, label: 'Created in CRM', tone: 'neutral' });
  if (details?.date_created && details.date_created !== row.created_at) {
    out.push({ at: details.date_created, label: 'PandaDoc document created', tone: 'neutral' });
  }
  if (details?.date_modified && details.date_modified !== details.date_created) {
    out.push({ at: details.date_modified, label: 'PandaDoc document modified', tone: 'neutral' });
  }

  const events = Array.isArray(row.metadata?.events) ? (row.metadata!.events as Array<Record<string, unknown>>) : [];
  for (const e of events) {
    const at = typeof e.at === 'string' ? e.at : null;
    const status = typeof e.status === 'string' ? e.status : '';
    if (!at) continue;
    const label = status === 'document.completed' ? 'Signed' : status === 'document.viewed' ? 'Viewed' : status === 'document.sent' ? 'Sent' : status === 'document.declined' ? 'Declined' : status === 'document.expired' ? 'Expired' : status || 'Webhook';
    const tone: TimelineEntry['tone'] = status === 'document.completed' ? 'success' : status === 'document.viewed' ? 'info' : status === 'document.declined' || status === 'document.expired' ? 'danger' : 'neutral';
    out.push({ at, label, tone });
  }

  if (row.signed_at) {
    out.push({ at: row.signed_at, label: 'Signed', detail: row.signed_by ?? undefined, tone: 'success' });
  }
  if (details?.date_completed && details.date_completed !== row.signed_at) {
    out.push({ at: details.date_completed, label: 'PandaDoc: completed', tone: 'success' });
  }

  const seen = new Set<string>();
  const unique = out.filter((e) => {
    const k = `${e.at}|${e.label}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  return unique.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
}

const TONE_DOT: Record<TimelineEntry['tone'], string> = {
  neutral: 'bg-gray-300',
  success: 'bg-emerald-500',
  info: 'bg-blue-500',
  danger: 'bg-red-500',
};

const TONE_TEXT: Record<TimelineEntry['tone'], string> = {
  neutral: 'text-gray-700',
  success: 'text-emerald-700',
  info: 'text-blue-700',
  danger: 'text-red-700',
};

export default async function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();
  const { data } = await supabase
    .from('documents')
    .select(
      'id, doc_type, title, status, signature_request_id, signed_at, signed_by, created_at, updated_at, metadata, projects(customer_first_name, customer_last_name, project_number)'
    )
    .eq('id', id)
    .is('deleted_at', null)
    .maybeSingle();

  if (!data) notFound();

  const p = Array.isArray(data.projects) ? data.projects[0] : data.projects;
  const row: DocRow = {
    id: data.id as string,
    doc_type: (data.doc_type as string | null) ?? null,
    title: (data.title as string | null) ?? null,
    status: (data.status as string | null) ?? 'pending',
    signature_request_id: (data.signature_request_id as string | null) ?? null,
    signed_at: (data.signed_at as string | null) ?? null,
    signed_by: (data.signed_by as string | null) ?? null,
    created_at: (data.created_at as string | null) ?? null,
    updated_at: (data.updated_at as string | null) ?? null,
    metadata: (data.metadata && typeof data.metadata === 'object') ? (data.metadata as Record<string, unknown>) : null,
    project: p
      ? {
          project_number: (p.project_number as string | null) ?? null,
          customer_first_name: (p.customer_first_name as string | null) ?? null,
          customer_last_name: (p.customer_last_name as string | null) ?? null,
        }
      : null,
  };

  let details: PandaDocDocumentDetails | null = null;
  let providerError: string | null = null;
  if (row.signature_request_id) {
    const res = await getDocumentDetails(row.signature_request_id);
    if (res.ok) details = res.data;
    else providerError = res.error;
  }

  const timeline = buildTimeline(row, details);
  const recipients = details?.recipients ?? [];

  return (
    <div className="p-5 max-w-[1100px] mx-auto space-y-5">
      <div>
        <Link href="/documents" className="inline-flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-black mb-4 transition-colors">
          <ArrowLeft size={13} />
          Back to Documents
        </Link>
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0 mt-1">
            <FileText size={18} className="text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-[22px] font-extrabold text-black tracking-tight truncate">{row.title || 'Untitled document'}</h1>
              <StatusPill status={row.status ?? 'pending'} />
            </div>
            <p className="text-[12px] text-gray-500 mt-1">
              {row.doc_type ?? '—'} · {projectLabel(row.project)}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {row.signature_request_id && (
              <a
                href={`/api/documents/${row.id}/download`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white bg-black hover:bg-gray-900 transition-all"
              >
                <Download size={13} />
                Download PDF
              </a>
            )}
            {row.signature_request_id && (
              <a
                href={`https://app.pandadoc.com/a/#/documents/${row.signature_request_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all"
              >
                PandaDoc
                <ExternalLink size={11} />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <section className="lg:col-span-2 space-y-5">
          <Panel title="Overview">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-[13px]">
              <Field label="Doc type" value={row.doc_type} />
              <Field label="Status" value={STATUS_STYLE[row.status ?? 'pending']?.label ?? row.status} />
              <Field label="Created in CRM" value={fmt(row.created_at)} />
              <Field label="Sent (PandaDoc)" value={fmt(details?.date_created)} />
              <Field label="Signed" value={fmt(row.signed_at ?? details?.date_completed)} />
              <Field label="Signed by" value={row.signed_by} />
              <Field label="Expires" value={fmt(details?.expiration_date)} />
              <Field label="PandaDoc ID" value={row.signature_request_id} mono />
            </dl>
            {providerError && (
              <p className="mt-4 text-[12px] text-red-600">
                Couldn&apos;t load PandaDoc details: {providerError}
              </p>
            )}
          </Panel>

          <Panel title="Activity">
            {timeline.length === 0 ? (
              <p className="text-[13px] text-gray-400">No activity yet.</p>
            ) : (
              <ol className="relative pl-5">
                <span className="absolute left-[7px] top-1 bottom-1 w-px bg-gray-200" />
                {timeline.map((e, i) => (
                  <li key={i} className="relative pb-3 last:pb-0">
                    <span
                      className={`absolute -left-[13px] top-1.5 w-2.5 h-2.5 rounded-full ring-2 ring-white ${TONE_DOT[e.tone]}`}
                    />
                    <div className="flex items-center gap-2 text-[13px]">
                      <span className={`font-semibold ${TONE_TEXT[e.tone]}`}>{e.label}</span>
                      {e.detail && <span className="text-gray-500">· {e.detail}</span>}
                    </div>
                    <p className="text-[11px] mt-0.5 text-gray-400">{fmt(e.at)}</p>
                  </li>
                ))}
              </ol>
            )}
          </Panel>
        </section>

        <aside className="space-y-5">
          <Panel title="Recipients">
            {recipients.length === 0 ? (
              <p className="text-[13px] text-gray-400">
                {row.signature_request_id ? 'No recipients reported.' : 'PandaDoc not linked.'}
              </p>
            ) : (
              <ul className="space-y-3">
                {recipients.map((r, i) => {
                  const name = [r.first_name, r.last_name].filter(Boolean).join(' ').trim() || r.email;
                  return (
                    <li key={r.id ?? `${r.email}-${i}`} className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                          r.has_completed
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-gray-50 border-gray-200 text-gray-500'
                        }`}
                      >
                        {r.has_completed ? <CheckCircle2 size={15} /> : <UserIcon size={14} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium text-black truncate">{name}</p>
                        <p className="text-[11px] flex items-center gap-1 truncate text-gray-500">
                          <Mail size={10} /> {r.email}
                        </p>
                        <p className={`text-[11px] mt-0.5 flex items-center gap-1 ${r.has_completed ? 'text-emerald-700' : 'text-gray-400'}`}>
                          {r.has_completed ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                          {r.has_completed ? 'Completed' : 'Awaiting action'}
                          {r.role ? ` · ${r.role}` : ''}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200/60 p-5">
      <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string | null | undefined; mono?: boolean }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wider text-gray-400">{label}</dt>
      <dd className={`${mono ? 'font-mono text-[12px]' : 'text-[13px]'} mt-0.5 break-words ${value ? 'text-black' : 'text-gray-300'}`}>
        {value || '—'}
      </dd>
    </div>
  );
}
