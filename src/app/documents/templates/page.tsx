import { ExternalLink, ClipboardCheck, AlertCircle, CircleDashed, FileText } from 'lucide-react';
import { TEMPLATE_CATALOG, type CatalogEntry, type TemplateCategory, type TemplateCatalogStatus } from '@/lib/pandadoc-templates';

export const dynamic = 'force-static';

const STATUS_STYLE: Record<TemplateCatalogStatus, { className: string; label: string }> = {
  wired: {
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    label: 'Wired',
  },
  need_input: {
    className: 'bg-amber-50 text-amber-800 border-amber-200',
    label: 'Need Afan input',
  },
  not_mapped: {
    className: 'bg-gray-100 text-gray-600 border-gray-200',
    label: 'Not mapped',
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
    <div className="p-5 max-w-[1400px] mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center">
          <ClipboardCheck size={18} className="text-gray-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-[20px] font-extrabold text-black tracking-tight">Template Catalog</h1>
          <p className="text-[12px] text-gray-500">
            {TEMPLATE_CATALOG.length} PandaDoc templates ·{' '}
            <span className="text-emerald-700 font-semibold">{totals.wired} wired</span>,{' '}
            <span className="text-amber-700 font-semibold">{totals.need_input} need input</span>,{' '}
            <span className="text-gray-600">{totals.not_mapped} not mapped</span>
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {CATEGORY_ORDER.filter((c) => grouped.has(c)).map((cat) => {
          const items = grouped.get(cat)!;
          return (
            <section key={cat}>
              <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {cat} <span className="text-gray-300 font-normal">· {items.length}</span>
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
    <div className="bg-white rounded-xl border border-gray-200/60 p-4 flex flex-col gap-3 h-full">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-md bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
          <FileText size={15} className="text-gray-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[14px] font-semibold text-black leading-snug break-words">{entry.name}</h3>
          <p className="text-[10px] mt-1 font-mono break-all text-gray-400">{entry.id}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-gray-100 text-gray-700 border border-gray-200">
          {entry.category}
        </span>
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${s.className}`}>
          <StatusIcon size={10} />
          {s.label}
        </span>
      </div>

      {entry.needFromAfan && (
        <div className="text-[12px] leading-snug rounded-md px-3 py-2 bg-amber-50 border border-amber-200 text-amber-900">
          <span className="font-semibold uppercase tracking-wider text-[10px] block mb-1 text-amber-700">Need from Afan</span>
          {entry.needFromAfan}
        </div>
      )}

      <div className="mt-auto pt-1">
        <a
          href={`https://app.pandadoc.com/a/#/templates/${entry.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all"
        >
          View in PandaDoc
          <ExternalLink size={10} />
        </a>
      </div>
    </div>
  );
}
