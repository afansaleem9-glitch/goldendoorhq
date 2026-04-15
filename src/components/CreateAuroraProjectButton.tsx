'use client';

import { useState } from 'react';
import { Sun, ExternalLink, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface Props {
  dealId?: string;
  contactId?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export default function CreateAuroraProjectButton({ dealId, contactId, className = '', size = 'sm' }: Props) {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [auroraProjectId, setAuroraProjectId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleClick() {
    if (state === 'loading') return;
    if (!dealId && !contactId) {
      setErrorMsg('No deal or contact ID provided');
      setState('error');
      return;
    }

    setState('loading');
    setErrorMsg(null);

    try {
      const res = await fetch('/api/aurora/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deal_id: dealId, contact_id: contactId }),
      });
      const json = await res.json();

      if (json.success && json.data?.aurora_project) {
        setAuroraProjectId(json.data.aurora_project.id);
        setState('success');
      } else {
        setErrorMsg(json.error || 'Failed to create Aurora project');
        setState('error');
      }
    } catch {
      setErrorMsg('Network error — could not reach API');
      setState('error');
    }
  }

  const isSm = size === 'sm';

  if (state === 'success' && auroraProjectId) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <span className={`inline-flex items-center gap-1.5 ${isSm ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'} bg-[#007A67]/10 text-[#007A67] rounded-lg font-semibold`}>
          <CheckCircle size={isSm ? 12 : 14} />
          Aurora Project Created
        </span>
        <a
          href={`https://v2.aurorasolar.com/projects/${auroraProjectId}/overview/dashboard`}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1 ${isSm ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'} bg-[#F0A500] hover:bg-[#d4920a] text-[#0B1F3A] rounded-lg font-semibold transition-colors`}
        >
          <ExternalLink size={isSm ? 11 : 13} />
          Open in Aurora
        </a>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <span className={`inline-flex items-center gap-1.5 ${isSm ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'} bg-red-50 text-red-600 rounded-lg font-medium`}>
          <AlertCircle size={isSm ? 12 : 14} />
          {errorMsg}
        </span>
        <button
          onClick={handleClick}
          className={`inline-flex items-center gap-1 ${isSm ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'} bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors`}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={state === 'loading'}
      className={`inline-flex items-center gap-1.5 ${isSm ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'} bg-[#F0A500] hover:bg-[#d4920a] text-[#0B1F3A] rounded-lg font-semibold transition-all disabled:opacity-60 ${className}`}
    >
      {state === 'loading' ? (
        <RefreshCw size={isSm ? 11 : 13} className="animate-spin" />
      ) : (
        <Sun size={isSm ? 11 : 13} />
      )}
      {state === 'loading' ? 'Creating...' : 'Create Aurora Project'}
    </button>
  );
}
