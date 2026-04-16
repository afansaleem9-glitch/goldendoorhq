import { ExternalLink, ClipboardCheck, AlertCircle, CircleDashed, FileText } from 'lucide-react';
import { TEMPLATE_CATALOG, type CatalogEntry, type TemplateCategory, type TemplateCatalogStatus } from '@/lib/pandadoc-templates';

export const dynamic = 'force-static';

const STATUS_STYLE: Record<TemplateCatalogStatus, { bg: string; border: string; text: string; label: string; dot: string }> = {
  wired: {
    bg: 'rgba(212,175,55,0.14)',
    border: 'rgba(212,175,55,0.55)',
    text: '#FFD700',
    label: 'Wired',
    dot: '#22c55e',
  },
  need_input: {
    bg: 'rgba(234,179,8,0.10)',
    border: 'rgba(234,179,8,0.45)',
    text: '#FDE68A',
    label: 'Need Afan input',
    dot: '#eab308',
  },
  not_mapped: {
    bg: 'rgba(255,255,255,0.04)',
    border: 'rgba(255,255,255,0.18)',
    text: 'rgba(255,255,255,0.65)',
    label: 'Not mapped',
    dot: 'rgba(255,255,255,0.55)',
  },
};

const CATEGORY_ORDER: TemplateCategory[] = ['PSA', 'Solar', 'Smart Home', 'Certificate', 'NDA', 'Commission', 'Pre-PTO', 'Employment', 'Invoice', 'Survey', 'Other'];

function groupByCategory(entries: CatalogEntry[]): Map<TemplateCategory, CatalogEntry[]> {
  const map = new Map<TemplateCategory, CatalogEntry[]>();
  for (const e of entries) {
    if (!map.has(e.category)) map.set(e.category, []);
    map.get(e.category)!.push(e);
  }
  return map;
}

export default function TemplatesCatalogPage() {
  const totals = TEMPLATE_CATALOG.reduce(
    (acc, e) => {
      acc[e.status] += 1;
      return acc;
    },
    { wired: 0, need_input: 0, not_mapped: 0 } as Record<TemplateCatalogStatus, number>
  );
  const grouped = groupByCategory(TEMPLATE_CATALOG);

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
            <ClipboardCheck size={18} style={{ color: '#FFD700' }} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-[20px] font-bold tracking-tight">Template Catalog</h1>
            <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {TEMPLATE_CATALOG.length} PandaDoc templates ·{' '}
              <span style={{ color: '#86efac' }}>{totals.wired} wired</span>,{' '}
              <span style={{ color: '#FDE68A' }}>{totals.need_input} need input</span>,{' '}
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>{totals.not_mapped} not mapped</span>
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-8">
        {CATEGORY_ORDER.filter((c) => grouped.has(c)).map((cat) => {
          const items = grouped.get(cat)!;
          return (
            <section key={cat}>
              <h2
                className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-3"
                style={{ color: 'rgba(255,215,0,0.85)' }}
              >
                {cat} <span style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>· {items.length}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((entry) => (
                  <TemplateCard key={entry.id} entry={entry} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function TemplateCard({ entry }: { entry: CatalogEntry }) {
  const s = STATUS_STYLE[entry.status];
  const StatusIcon = entry.status === 'wired' ? FileText : entry.status === 'need_input' ? AlertCircle : CircleDashed;
  return (
    <div
      className="rounded-lg p-4 flex flex-col gap-3 h-full"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-md flex items-center justify-center shrink-0 mt-0.5"
          style={{
            background: 'rgba(212,175,55,0.10)',
            border: '1px solid rgba(212,175,55,0.25)',
          }}
        >
          <FileText size={15} style={{ color: '#FFD700' }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[14px] font-semibold leading-snug break-words" style={{ color: 'rgba(255,255,255,0.95)' }}>
            {entry.name}
          </h3>
          <p className="text-[10px] mt-1 font-mono break-all" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {entry.id}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.75)',
          }}
        >
          {entry.category}
        </span>
        <span
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold"
          style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}
        >
          <StatusIcon size={10} />
          {s.label}
        </span>
      </div>

      {entry.needFromAfan && (
        <div
          className="text-[12px] leading-snug rounded-md px-3 py-2"
          style={{
            background: 'rgba(234,179,8,0.06)',
            border: '1px solid rgba(234,179,8,0.25)',
            color: '#FDE68A',
          }}
        >
          <span className="font-semibold uppercase tracking-wider text-[10px] block mb-1">Need from Afan</span>
          {entry.needFromAfan}
        </div>
      )}

      <div className="mt-auto pt-1">
        <a
          href={`https://app.pandadoc.com/a/#/templates/${entry.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.85)',
          }}
        >
          View in PandaDoc
          <ExternalLink size={10} />
        </a>
      </div>
    </div>
  );
}
