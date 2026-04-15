'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, RefreshCw, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export type DocumentRow = {
  id: string;
  doc_type: string;
  title: string;
  status: string;
  signature_request_id: string | null;
  signed_at: string | null;
  signed_by: string | null;
  created_at: string | null;
  recipient_email: string | null;
  project: {
    project_number: string | null;
    customer_first_name: string | null;
    customer_last_name: string | null;
  } | null;
};

const STATUS_STYLE: Record<string, { bg: string; border: string; text: string; label: string }> = {
  pending: { bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.18)', text: 'rgba(255,255,255,0.75)', label: 'Pending' },
  sent: { bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.18)', text: 'rgba(255,255,255,0.75)', label: 'Sent' },
  viewed: { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.45)', text: '#93C5FD', label: 'Viewed' },
  signed: { bg: 'rgba(212,175,55,0.14)', border: 'rgba(212,175,55,0.55)', text: '#FFD700', label: 'Signed' },
  completed: { bg: 'rgba(212,175,55,0.14)', border: 'rgba(212,175,55,0.55)', text: '#FFD700', label: 'Completed' },
  rejected: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.45)', text: '#FCA5A5', label: 'Rejected' },
  declined: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.45)', text: '#FCA5A5', label: 'Declined' },
  expired: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.45)', text: '#FCA5A5', label: 'Expired' },
};

function StatusPill({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.pending;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}
    >
      {s.label}
    </span>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function projectLabel(p: DocumentRow['project']): string {
  if (!p) return '—';
  const name = [p.customer_first_name, p.customer_last_name].filter(Boolean).join(' ').trim();
  const num = p.project_number ? `#${p.project_number}` : '';
  return [num, name].filter(Boolean).join(' · ') || '—';
}

export function DocumentsTable({ rows, loadError }: { rows: DocumentRow[]; loadError: string | null }) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const statuses = useMemo(() => Array.from(new Set(rows.map((r) => r.status).filter(Boolean))).sort(), [rows]);
  const types = useMemo(() => Array.from(new Set(rows.map((r) => r.doc_type).filter(Boolean))).sort(), [rows]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (typeFilter !== 'all' && r.doc_type !== typeFilter) return false;
      return true;
    });
  }, [rows, statusFilter, typeFilter]);

  return (
    <div className="min-h-screen" style={{ background: '#0A0A0A', color: '#F5F5F5' }}>
      <div
        className="border-b"
        style={{
          borderColor: 'rgba(212,175,55,0.15)',
          background: 'linear-gradient(180deg, rgba(212,175,55,0.05) 0%, transparent 100%)',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 py-6 flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(184,134,11,0.15))',
              border: '1px solid rgba(212,175,55,0.35)',
            }}
          >
            <FileText size={18} style={{ color: '#FFD700' }} />
          </div>
          <div className="flex-1">
            <h1 className="text-[20px] font-bold tracking-tight">Documents</h1>
            <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Latest {rows.length} documents · updates arrive via PandaDoc webhook
            </p>
          </div>
          <button
            onClick={() => router.refresh()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            <RefreshCw size={13} />
            Refresh
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <FilterSelect
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[{ value: 'all', label: 'All statuses' }, ...statuses.map((s) => ({ value: s, label: STATUS_STYLE[s]?.label ?? s }))]}
          />
          <FilterSelect
            label="Type"
            value={typeFilter}
            onChange={setTypeFilter}
            options={[{ value: 'all', label: 'All types' }, ...types.map((t) => ({ value: t, label: t }))]}
          />
          <div className="flex-1" />
          <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Showing {filtered.length} of {rows.length}
          </span>
        </div>

        {loadError && (
          <div
            className="px-4 py-3 rounded-md mb-4 text-[13px]"
            style={{ color: '#FCA5A5', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}
          >
            Failed to load documents: {loadError}
          </div>
        )}

        <div
          className="rounded-lg overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr
                  className="text-left"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <Th>Project</Th>
                  <Th>Doc Type</Th>
                  <Th>Title</Th>
                  <Th>Recipient</Th>
                  <Th>Status</Th>
                  <Th>Sent At</Th>
                  <Th>Signed At</Th>
                  <Th align="right">Details</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      No documents match the current filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r, i) => (
                    <tr
                      key={r.id}
                      style={{
                        borderBottom: i === filtered.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      <Td>{projectLabel(r.project)}</Td>
                      <Td muted>{r.doc_type || '—'}</Td>
                      <Td>{r.title || '—'}</Td>
                      <Td muted>{r.recipient_email || '—'}</Td>
                      <Td><StatusPill status={r.status} /></Td>
                      <Td muted>{formatDate(r.created_at)}</Td>
                      <Td muted>{formatDate(r.signed_at)}</Td>
                      <Td align="right">
                        <Link
                          href={`/documents/${r.id}`}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md transition-all"
                          style={{
                            color: '#FFD700',
                            background: 'rgba(212,175,55,0.08)',
                            border: '1px solid rgba(212,175,55,0.3)',
                          }}
                        >
                          Open
                          <ArrowRight size={11} />
                        </Link>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Th({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'right' }) {
  return (
    <th
      className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider"
      style={{ color: 'rgba(255,255,255,0.5)', textAlign: align }}
    >
      {children}
    </th>
  );
}

function Td({ children, muted, align = 'left' }: { children: React.ReactNode; muted?: boolean; align?: 'left' | 'right' }) {
  return (
    <td
      className="px-4 py-2.5 align-middle"
      style={{ color: muted ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.92)', textAlign: align, whiteSpace: 'nowrap' }}
    >
      {children}
    </td>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.45)' }}>
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md px-2.5 py-1.5 text-[12px] outline-none"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: '#F5F5F5',
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ background: '#0A0A0A' }}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
