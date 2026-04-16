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
    <div className="min-h-screen" style={{ background: '#0A0A0A', color: '#F5F5F5' }}>
      <div
        className="border-b"
        style={{
          borderColor: 'rgba(212,175,55,0.15)',
          background: 'linear-gradient(180deg, rgba(212,175,55,0.05) 0%, transparent 100%)',
        }}
      >
        <div className="max-w-[1100px] mx-auto px-6 py-6 flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(184,134,11,0.15))',
              border: '1px solid rgba(212,175,55,0.35)',
            }}
          >
            <Beaker size={18} style={{ color: '#FFD700' }} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-[20px] font-bold tracking-tight">Send Test</h1>
            <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Template-routing playground · Preview is safe · Send for real goes to the recipient email
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section>
          <NoticeBanner />
          <div
            className="rounded-lg p-5 mt-4"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <Field label="Doc type">
              <Select value={docType} onChange={(v) => setDocType(v as typeof docType)}>
                {DOC_TYPES.map((d) => (
                  <option key={d.value} value={d.value} style={{ background: '#0A0A0A' }}>
                    {d.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Vertical">
              <Select value={vertical} onChange={setVertical}>
                {VERTICALS.map((d) => (
                  <option key={d.value} value={d.value} style={{ background: '#0A0A0A' }}>
                    {d.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="State">
              <Select value={stateCode} onChange={setStateCode}>
                {US_STATES.map((s) => (
                  <option key={s || 'none'} value={s} style={{ background: '#0A0A0A' }}>
                    {s || '— none —'}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Financing">
              <Select value={financing} onChange={setFinancing}>
                {FINANCING.map((d) => (
                  <option key={d.value} value={d.value} style={{ background: '#0A0A0A' }}>
                    {d.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Language">
              <Select value={language} onChange={setLanguage}>
                {LANGUAGES.map((d) => (
                  <option key={d.value} value={d.value} style={{ background: '#0A0A0A' }}>
                    {d.label}
                  </option>
                ))}
              </Select>
            </Field>
            {showCameraInput && (
              <Field label="Camera count">
                <Select value={String(cameraCount)} onChange={(v) => setCameraCount(parseInt(v, 10))}>
                  {CAMERA_COUNTS.map((n) => (
                    <option key={n} value={String(n)} style={{ background: '#0A0A0A' }}>
                      {n}
                    </option>
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

            <div className="flex items-center gap-3 mt-5">
              <button
                onClick={() => fire('preview')}
                disabled={busy !== null}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-[13px] font-semibold transition-all disabled:opacity-50"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(212,175,55,0.55)',
                  color: '#FFD700',
                }}
              >
                <Eye size={13} />
                {busy === 'preview' ? 'Previewing…' : 'Preview template selection'}
              </button>
              <button
                onClick={() => fire('send')}
                disabled={busy !== null}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-[13px] font-semibold transition-all disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #B8860B 100%)',
                  color: '#1a1208',
                  boxShadow: '0 4px 18px rgba(212,175,55,0.25)',
                }}
              >
                <Send size={13} />
                {busy === 'send' ? 'Sending…' : 'Send for real'}
              </button>
            </div>
          </div>
        </section>

        <section>
          <h2
            className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-3"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            Result
          </h2>
          <div
            className="rounded-lg p-5"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', minHeight: '300px' }}
          >
            <ResultPanel result={result} />
          </div>

          <h2
            className="text-[10px] font-semibold uppercase tracking-[0.18em] mt-6 mb-2"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            Request body
          </h2>
          <pre
            className="rounded-lg p-4 text-[11px] font-mono overflow-x-auto"
            style={{
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.75)',
            }}
          >
            {JSON.stringify(requestBody, null, 2)}
          </pre>
        </section>
      </div>
    </div>
  );
}

function NoticeBanner() {
  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-lg"
      style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.30)', color: '#BFDBFE' }}
    >
      <Info size={15} className="shrink-0 mt-0.5" />
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
      <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
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
          <AlertTriangle size={16} style={{ color: isMappingGap ? '#FDE68A' : '#FCA5A5' }} />
          <span className="text-[13px] font-semibold" style={{ color: isMappingGap ? '#FDE68A' : '#FCA5A5' }}>
            {isMappingGap ? `Routing gap (HTTP ${result.status})` : `Error (HTTP ${result.status})`}
          </span>
        </div>
        <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.85)' }}>{result.error}</p>
        {isMappingGap && (
          <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Code: <code>{result.code}</code>
          </p>
        )}
      </div>
    );
  }

  if (result.kind === 'preview') {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Eye size={16} style={{ color: '#FFD700' }} />
          <span className="text-[13px] font-semibold" style={{ color: '#FFD700' }}>
            Preview only — nothing was sent
          </span>
        </div>
        <div className="text-[13px] space-y-1">
          <KV label="Template" value={result.template_name ?? result.template_slug ?? '—'} />
          <KV label="ID" value={result.template_id ?? '—'} mono />
          <KV label="Slug" value={result.template_slug ?? '—'} mono />
          <KV label="Title" value={result.title ?? '—'} />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider mt-3 mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Tokens
          </p>
          <pre
            className="rounded-md p-3 text-[11px] font-mono overflow-x-auto"
            style={{
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.75)',
            }}
          >
            {JSON.stringify(result.tokens ?? {}, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <CheckCircle2 size={16} style={{ color: '#86efac' }} />
        <span className="text-[13px] font-semibold" style={{ color: '#86efac' }}>
          Sent successfully
        </span>
      </div>
      <div className="text-[13px] space-y-1">
        <KV label="Document ID" value={result.document_id} mono />
        <KV label="PandaDoc ID" value={result.pandadoc_id} mono />
        <KV label="Template" value={result.template_slug ?? result.template_id ?? '—'} />
      </div>
      <div className="flex items-center gap-2 pt-2">
        <Link
          href={`/documents/${result.document_id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold transition-all"
          style={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #B8860B 100%)',
            color: '#1a1208',
          }}
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
      <span
        className="text-[10px] font-semibold uppercase tracking-wider block mb-1"
        style={{ color: 'rgba(255,255,255,0.45)' }}
      >
        {label}
      </span>
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
      className="w-full rounded-md px-2.5 py-1.5 text-[13px] outline-none"
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.12)',
        color: '#F5F5F5',
      }}
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
      className={`w-full rounded-md px-2.5 py-1.5 text-[13px] outline-none ${mono ? 'font-mono' : ''}`}
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.12)',
        color: '#F5F5F5',
      }}
    />
  );
}

function KV({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex gap-2">
      <span style={{ color: 'rgba(255,255,255,0.45)', minWidth: 110 }}>{label}</span>
      <span className={mono ? 'font-mono break-all' : ''} style={{ color: 'rgba(255,255,255,0.92)' }}>
        {value}
      </span>
    </div>
  );
}
