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

const STATUS_STYLE: Record<string, { className: string; label: string }> = {
  pending: { className: 'bg-gray-100 text-gray-700 border-gray-200', label: 'Pending' },
  sent: { className: 'bg-gray-100 text-gray-700 border-gray-200', label: 'Sent' },
  viewed: { className: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Viewed' },
  signed: { className: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Signed' },
  completed: { className: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Completed' },
  rejected: { className: 'bg-red-50 text-red-700 border-red-200', label: 'Rejected' },
  declined: { className: 'bg-red-50 text-red-700 border-red-200', label: 'Declined' },
  expired: { className: 'bg-red-50 text-red-700 border-red-200', label: 'Expired' },
};

function StatusPill({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.pending;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${s.className}`}>
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
    <div className="p-5 max-w-[1400px] mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center">
          <FileText size={18} className="text-gray-600" />
        </div>
        <div className="flex-1">
          <h1 className="text-[20px] font-extrabold text-black tracking-tight">Documents</h1>
          <p className="text-[12px] text-gray-500">
            Latest {rows.length} documents · updates arrive via PandaDoc webhook
          </p>
        </div>
        <button
          onClick={() => router.refresh()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
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
        <span className="text-[11px] text-gray-400">
          Showing {filtered.length} of {rows.length}
        </span>
      </div>

      {loadError && (
        <div className="px-4 py-3 rounded-lg text-[13px] bg-red-50 border border-red-200 text-red-700">
          Failed to load documents: {loadError}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left bg-gray-50/60 border-b border-gray-200/60">
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
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                    No documents match the current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((r, i) => (
                  <tr
                    key={r.id}
                    className={`hover:bg-gray-50/50 ${i === filtered.length - 1 ? '' : 'border-b border-gray-100'}`}
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
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50"
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
  );
}

function Th({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'right' }) {
  return (
    <th
      className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500"
      style={{ textAlign: align }}
    >
      {children}
    </th>
  );
}

function Td({ children, muted, align = 'left' }: { children: React.ReactNode; muted?: boolean; align?: 'left' | 'right' }) {
  return (
    <td
      className={`px-4 py-2.5 align-middle whitespace-nowrap ${muted ? 'text-gray-500' : 'text-black'}`}
      style={{ textAlign: align }}
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
      <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-200 rounded-lg px-3 py-1.5 text-[12px] focus:border-black outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
