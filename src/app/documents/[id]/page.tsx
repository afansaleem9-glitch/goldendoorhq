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

const STATUS_STYLE: Record<string, { bg: string; border: string; text: string; label: string }> = {
  pending: { bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.18)', text: 'rgba(255,255,255,0.75)', label: 'Pending' },
  sent: { bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.18)', text: 'rgba(255,255,255,0.75)', label: 'Sent' },
  viewed: { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.45)', text: '#93C5FD', label: 'Viewed' },
  signed: { bg: 'rgba(212,175,55,0.14)', border: 'rgba(212,175,55,0.55)', text: '#FFD700', label: 'Signed' },
  rejected: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.45)', text: '#FCA5A5', label: 'Rejected' },
  expired: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.45)', text: '#FCA5A5', label: 'Expired' },
};

function StatusPill({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.pending;
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}
    >
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

type TimelineEntry = { at: string; label: string; detail?: string; tone: 'neutral' | 'gold' | 'blue' | 'red' };

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
    const tone: TimelineEntry['tone'] = status === 'document.completed' ? 'gold' : status === 'document.viewed' ? 'blue' : status === 'document.declined' || status === 'document.expired' ? 'red' : 'neutral';
    out.push({ at, label, tone });
  }

  if (row.signed_at) {
    out.push({ at: row.signed_at, label: 'Signed', detail: row.signed_by ?? undefined, tone: 'gold' });
  }
  if (details?.date_completed && details.date_completed !== row.signed_at) {
    out.push({ at: details.date_completed, label: 'PandaDoc: completed', tone: 'gold' });
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

function toneColor(tone: TimelineEntry['tone']): string {
  return tone === 'gold' ? '#FFD700' : tone === 'blue' ? '#93C5FD' : tone === 'red' ? '#FCA5A5' : 'rgba(255,255,255,0.55)';
}

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
    <div className="min-h-screen" style={{ background: '#0A0A0A', color: '#F5F5F5' }}>
      <div
        className="border-b"
        style={{ borderColor: 'rgba(212,175,55,0.15)', background: 'linear-gradient(180deg, rgba(212,175,55,0.05) 0%, transparent 100%)' }}
      >
        <div className="max-w-[1100px] mx-auto px-6 py-6">
          <Link
            href="/documents"
            className="inline-flex items-center gap-1.5 text-[12px] mb-4 transition-colors"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            <ArrowLeft size={13} />
            Back to Documents
          </Link>
          <div className="flex items-start gap-4">
            <div
              className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 mt-1"
              style={{
                background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(184,134,11,0.15))',
                border: '1px solid rgba(212,175,55,0.35)',
              }}
            >
              <FileText size={18} style={{ color: '#FFD700' }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-[22px] font-bold tracking-tight truncate">{row.title || 'Untitled document'}</h1>
                <StatusPill status={row.status ?? 'pending'} />
              </div>
              <p className="text-[12px] mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {row.doc_type ?? '—'} · {projectLabel(row.project)}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {row.signature_request_id && (
                <a
                  href={`/api/documents/${row.id}/download`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #B8860B 100%)',
                    color: '#1a1208',
                    boxShadow: '0 4px 18px rgba(212,175,55,0.25)',
                  }}
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.85)',
                  }}
                >
                  PandaDoc
                  <ExternalLink size={11} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
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
              <p className="mt-4 text-[12px]" style={{ color: '#FCA5A5' }}>
                Couldn&apos;t load PandaDoc details: {providerError}
              </p>
            )}
          </Panel>

          <Panel title="Activity">
            {timeline.length === 0 ? (
              <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.4)' }}>No activity yet.</p>
            ) : (
              <ol className="relative pl-5">
                <span
                  className="absolute left-[7px] top-1 bottom-1 w-px"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                />
                {timeline.map((e, i) => (
                  <li key={i} className="relative pb-3 last:pb-0">
                    <span
                      className="absolute -left-[13px] top-1.5 w-2.5 h-2.5 rounded-full"
                      style={{ background: toneColor(e.tone), boxShadow: `0 0 0 3px rgba(10,10,10,1)` }}
                    />
                    <div className="flex items-center gap-2 text-[13px]">
                      <span className="font-semibold" style={{ color: toneColor(e.tone) }}>{e.label}</span>
                      {e.detail && <span style={{ color: 'rgba(255,255,255,0.55)' }}>· {e.detail}</span>}
                    </div>
                    <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{fmt(e.at)}</p>
                  </li>
                ))}
              </ol>
            )}
          </Panel>
        </section>

        <aside className="space-y-5">
          <Panel title="Recipients">
            {recipients.length === 0 ? (
              <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {row.signature_request_id ? 'No recipients reported.' : 'PandaDoc not linked.'}
              </p>
            ) : (
              <ul className="space-y-3">
                {recipients.map((r, i) => {
                  const name = [r.first_name, r.last_name].filter(Boolean).join(' ').trim() || r.email;
                  return (
                    <li key={r.id ?? `${r.email}-${i}`} className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background: r.has_completed ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${r.has_completed ? 'rgba(212,175,55,0.45)' : 'rgba(255,255,255,0.12)'}`,
                          color: r.has_completed ? '#FFD700' : 'rgba(255,255,255,0.6)',
                        }}
                      >
                        {r.has_completed ? <CheckCircle2 size={15} /> : <UserIcon size={14} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium truncate">{name}</p>
                        <p className="text-[11px] flex items-center gap-1 truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>
                          <Mail size={10} /> {r.email}
                        </p>
                        <p className="text-[11px] mt-0.5 flex items-center gap-1" style={{ color: r.has_completed ? '#FFD700' : 'rgba(255,255,255,0.45)' }}>
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
    <div
      className="rounded-lg p-5"
      style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}
    >
      <h2
        className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-3"
        style={{ color: 'rgba(255,255,255,0.5)' }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string | null | undefined; mono?: boolean }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</dt>
      <dd
        className={`${mono ? 'font-mono text-[12px]' : 'text-[13px]'} mt-0.5 break-words`}
        style={{ color: value ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.35)' }}
      >
        {value || '—'}
      </dd>
    </div>
  );
}
