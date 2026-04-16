'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Beaker, Eye, Send, AlertTriangle, CheckCircle2, ExternalLink, Info } from 'lucide-react';

const DOC_TYPES = [
  { value: 'psa', label: 'PSA' },
  { value: 'certificate_of_completion', label: 'Certificate of Completion' },
  { value: 'smart_home_agreement', label: 'Smart Home Agreement' },
  { value: 'solar_bundle_psa', label: 'Solar Bundle PSA' },
  { value: 'nda', label: 'NDA' },
  { value: 'sales_commission_agreement', label: 'Sales Commission Agreement' },
] as const;

const VERTICALS = [
  { value: '', label: '— none —' },
  { value: 'alarm', label: 'Alarm' },
  { value: 'solar', label: 'Solar' },
  { value: 'roofing', label: 'Roofing' },
] as const;

const FINANCING = [
  { value: '', label: '— none —' },
  { value: 'cash', label: 'Cash' },
  { value: 'wells_fargo', label: 'Wells Fargo' },
  { value: 'other', label: 'Other' },
] as const;

const LANGUAGES = [
  { value: '', label: '— none —' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
] as const;

const CAMERA_COUNTS = [3, 4, 5, 6, 7, 8] as const;

const US_STATES = [
  '', 'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
];

const FALLBACK_PROJECT_ID = '00000000-0000-0000-0000-000000000000';
const FALLBACK_RECIPIENT = 'afan@goldendoorhq.com';

type PreviewResult = {
  kind: 'preview';
  template_id?: string;
  template_slug?: string | null;
  template_name?: string | null;
  title?: string;
  recipient?: { email: string; first_name?: string; last_name?: string };
  tokens?: Record<string, unknown>;
  deal_context?: unknown;
};

type SentResult = {
  kind: 'sent';
  document_id: string;
  pandadoc_id: string;
  template_id?: string;
  template_slug?: string | null;
};

type ErrorResult = {
  kind: 'error';
  status: number;
  error: string;
  code?: string;
};

type ResultState = PreviewResult | SentResult | ErrorResult | null;

export function SendTestForm() {
  const [docType, setDocType] = useState<(typeof DOC_TYPES)[number]['value']>('psa');
  const [vertical, setVertical] = useState<string>('alarm');
  const [stateCode, setStateCode] = useState<string>('');
  const [financing, setFinancing] = useState<string>('cash');
  const [language, setLanguage] = useState<string>('en');
  const [cameraCount, setCameraCount] = useState<number>(5);
  const [recipientEmail, setRecipientEmail] = useState<string>(FALLBACK_RECIPIENT);
  const [projectId, setProjectId] = useState<string>(FALLBACK_PROJECT_ID);
  const [busy, setBusy] = useState<'preview' | 'send' | null>(null);
  const [result, setResult] = useState<ResultState>(null);

  const showCameraInput = docType === 'psa' && vertical === 'alarm';

  const requestBody = useMemo(() => {
    const dealContext: Record<string, unknown> = {};
    if (vertical) dealContext.vertical = vertical;
    if (stateCode) dealContext.state = stateCode;
    if (financing) dealContext.financing = financing;
    if (language) dealContext.language = language;
    if (showCameraInput) dealContext.camera_count = cameraCount;
    return {
      project_id: projectId,
      doc_type: docType,
      deal_context: dealContext,
      recipient: { email: recipientEmail },
    };
  }, [docType, vertical, stateCode, financing, language, cameraCount, recipientEmail, projectId, showCameraInput]);

  async function fire(mode: 'preview' | 'send') {
    setBusy(mode);
    setResult(null);
    try {
      const url = mode === 'preview' ? '/api/documents/send?dry_run=true' : '/api/documents/send';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setResult({ kind: 'error', status: res.status, error: json.error ?? `HTTP ${res.status}`, code: json.code });
        return;
      }
      const data = json.data ?? {};
      if (mode === 'preview') {
        setResult({
          kind: 'preview',
          template_id: data.template_id,
          template_slug: data.template_slug ?? null,
          template_name: data.template_name ?? null,
          title: data.title,
          recipient: data.recipient,
          tokens: data.tokens,
          deal_context: data.deal_context,
        });
      } else {
        setResult({
          kind: 'sent',
          document_id: data.document_id,
          pandadoc_id: data.pandadoc_id,
          template_id: data.template_id,
          template_slug: data.template_slug ?? null,
        });
      }
    } catch (err) {
      setResult({ kind: 'error', status: 0, error: err instanceof Error ? err.message : 'Network error' });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="p-5 max-w-[1100px] mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center">
          <Beaker size={18} className="text-gray-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-[20px] font-extrabold text-black tracking-tight">Send Test</h1>
          <p className="text-[12px] text-gray-500">
            Template-routing playground · Preview is safe · Send for real goes to the recipient email
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="space-y-4">
          <NoticeBanner />
          <div className="bg-white rounded-xl border border-gray-200/60 p-5">
            <Field label="Doc type">
              <Select value={docType} onChange={(v) => setDocType(v as typeof docType)}>
                {DOC_TYPES.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </Select>
            </Field>
            <Field label="Vertical">
              <Select value={vertical} onChange={setVertical}>
                {VERTICALS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </Select>
            </Field>
            <Field label="State">
              <Select value={stateCode} onChange={setStateCode}>
                {US_STATES.map((s) => (
                  <option key={s || 'none'} value={s}>{s || '— none —'}</option>
                ))}
              </Select>
            </Field>
            <Field label="Financing">
              <Select value={financing} onChange={setFinancing}>
                {FINANCING.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </Select>
            </Field>
            <Field label="Language">
              <Select value={language} onChange={setLanguage}>
                {LANGUAGES.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </Select>
            </Field>
            {showCameraInput && (
              <Field label="Camera count">
                <Select value={String(cameraCount)} onChange={(v) => setCameraCount(parseInt(v, 10))}>
                  {CAMERA_COUNTS.map((n) => (
                    <option key={n} value={String(n)}>{n}</option>
                  ))}
                </Select>
              </Field>
            )}
            <Field label="Recipient email">
              <Input value={recipientEmail} onChange={setRecipientEmail} type="email" />
            </Field>
            <Field label="Project ID (uuid)">
              <Input value={projectId} onChange={setProjectId} mono />
            </Field>

            <div className="flex items-center gap-2 mt-5">
              <button
                onClick={() => fire('preview')}
                disabled={busy !== null}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-all"
              >
                <Eye size={13} />
                {busy === 'preview' ? 'Previewing…' : 'Preview template selection'}
              </button>
              <button
                onClick={() => fire('send')}
                disabled={busy !== null}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-semibold text-white bg-black hover:bg-gray-900 disabled:opacity-50 transition-all"
              >
                <Send size={13} />
                {busy === 'send' ? 'Sending…' : 'Send for real'}
              </button>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Result</h2>
          <div className="bg-white rounded-xl border border-gray-200/60 p-5 min-h-[300px]">
            <ResultPanel result={result} />
          </div>

          <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-2">Request body</h2>
          <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-[11px] font-mono text-gray-700 overflow-x-auto">
            {JSON.stringify(requestBody, null, 2)}
          </pre>
        </section>
      </div>
    </div>
  );
}

function NoticeBanner() {
  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-900">
      <Info size={15} className="shrink-0 mt-0.5 text-blue-600" />
      <p className="text-[12px] leading-snug">
        Test playground — safe to click around. <strong>Preview</strong> only resolves the routing rules and
        echoes the tokens. <strong>Send for real</strong> creates a PandaDoc document and emails it to the
        recipient address you enter.
      </p>
    </div>
  );
}

function ResultPanel({ result }: { result: ResultState }) {
  if (!result) {
    return (
      <p className="text-[13px] text-gray-400">
        Hit <em>Preview</em> to resolve the template, or <em>Send for real</em> to create the PandaDoc
        document.
      </p>
    );
  }

  if (result.kind === 'error') {
    const isMappingGap = result.code === 'template_mapping_missing';
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className={isMappingGap ? 'text-amber-600' : 'text-red-600'} />
          <span className={`text-[13px] font-semibold ${isMappingGap ? 'text-amber-800' : 'text-red-700'}`}>
            {isMappingGap ? `Routing gap (HTTP ${result.status})` : `Error (HTTP ${result.status})`}
          </span>
        </div>
        <p className="text-[13px] text-gray-700">{result.error}</p>
        {isMappingGap && (
          <p className="text-[11px] text-gray-500">
            Code: <code className="font-mono">{result.code}</code>
          </p>
        )}
      </div>
    );
  }

  if (result.kind === 'preview') {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Eye size={16} className="text-black" />
          <span className="text-[13px] font-semibold text-black">Preview only — nothing was sent</span>
        </div>
        <div className="text-[13px] space-y-1">
          <KV label="Template" value={result.template_name ?? result.template_slug ?? '—'} />
          <KV label="ID" value={result.template_id ?? '—'} mono />
          <KV label="Slug" value={result.template_slug ?? '—'} mono />
          <KV label="Title" value={result.title ?? '—'} />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-3 mb-1">Tokens</p>
          <pre className="bg-gray-50 border border-gray-200 rounded-md p-3 text-[11px] font-mono text-gray-700 overflow-x-auto">
            {JSON.stringify(result.tokens ?? {}, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <CheckCircle2 size={16} className="text-emerald-600" />
        <span className="text-[13px] font-semibold text-emerald-700">Sent successfully</span>
      </div>
      <div className="text-[13px] space-y-1">
        <KV label="Document ID" value={result.document_id} mono />
        <KV label="PandaDoc ID" value={result.pandadoc_id} mono />
        <KV label="Template" value={result.template_slug ?? result.template_id ?? '—'} />
      </div>
      <div className="flex items-center gap-2 pt-2">
        <Link
          href={`/documents/${result.document_id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white bg-black hover:bg-gray-900 transition-all"
        >
          Open document
          <ExternalLink size={11} />
        </Link>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block mb-3">
      <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">{label}</span>
      {children}
    </label>
  );
}

function Select({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:border-black outline-none"
    >
      {children}
    </select>
  );
}

function Input({
  value,
  onChange,
  type,
  mono,
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  mono?: boolean;
}) {
  return (
    <input
      type={type ?? 'text'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:border-black outline-none ${mono ? 'font-mono' : ''}`}
    />
  );
}

function KV({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex gap-2">
      <span className="text-gray-500" style={{ minWidth: 110 }}>{label}</span>
      <span className={`text-black ${mono ? 'font-mono break-all' : ''}`}>{value}</span>
    </div>
  );
}
