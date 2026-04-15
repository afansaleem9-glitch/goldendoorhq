'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Sun, ArrowLeft, Zap, DollarSign, Battery, Ruler,
  FileText, ExternalLink, RefreshCw, CheckCircle, Clock,
  MapPin, User, Home, Settings, Download
} from 'lucide-react';

/*
 * AURORA → GOLDENDOOR CRM "EXIT TO CRM" LANDING PAGE
 *
 * This page is the target for Aurora Solar's "Exit to CRM" button.
 * URL pattern configured in Aurora: https://goldendoorhq.com/solar/projects/{projectid}/designs/{designid}
 *
 * When a rep clicks "Exit → CRM" in Aurora Sales Mode, they land here
 * with the Aurora project ID and design ID in the URL. This page:
 * 1. Fetches the full project bundle from Aurora API
 * 2. Shows design details, pricing, BOM, and proposal info
 * 3. Provides actions: sync to CRM, generate contract, create proposal
 */

interface AuroraBundle {
  aurora_project_id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  system_size_kw: number | null;
  panel_count: number | null;
  panel_type: string | null;
  inverter_type: string | null;
  annual_production_kwh: number | null;
  offset_percentage: number | null;
  contract_amount: number | null;
  net_cost: number | null;
  price_per_watt: number | null;
  monthly_payment: number | null;
  year1_savings: number | null;
  lifetime_savings: number | null;
  proposal_url: string | null;
  proposal_status: string | null;
  annual_usage_kwh: number | null;
  avg_monthly_bill: number | null;
  utility_company: string | null;
  aurora_synced_at: string;
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export default function AuroraDesignPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const designId = params.designId as string;

  const [bundle, setBundle] = useState<AuroraBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/aurora?action=bundle&project_id=${projectId}`);
        const json = await res.json();
        if (json.success) {
          setBundle(json.data);
        } else {
          setError(json.error || 'Failed to load Aurora project');
        }
      } catch (err) {
        setError('Failed to connect to Aurora Solar API');
      }
      setLoading(false);
    }
    load();
  }, [projectId]);

  async function syncToCRM() {
    setSyncing(true);
    try {
      const res = await fetch(`/api/aurora/sync?project=${projectId}`);
      const json = await res.json();
      if (json.success) {
        setSynced(true);
      } else {
        setError(json.error || 'Sync failed');
      }
    } catch {
      setError('Sync request failed');
    }
    setSyncing(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B1F3A] via-[#132d4f] to-[#0B1F3A]">
        <div className="max-w-[1200px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/solar/dashboard" className="text-white/60 hover:text-white transition-colors">
                <ArrowLeft size={20} />
              </Link>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sun className="text-[#F0A500]" size={22} />
                  <h1 className="text-xl font-bold text-white">Aurora Solar Project</h1>
                  <span className="bg-[#F0A500]/20 text-[#F0A500] text-xs px-2 py-0.5 rounded-full font-medium">Live Sync</span>
                </div>
                <p className="text-blue-200/60 text-xs font-mono">Project: {projectId} &bull; Design: {designId}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={syncToCRM}
                disabled={syncing}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  synced
                    ? 'bg-green-500 text-white'
                    : 'bg-[#F0A500] hover:bg-[#d4920a] text-[#0B1F3A]'
                }`}
              >
                {syncing ? <RefreshCw size={16} className="animate-spin" /> : synced ? <CheckCircle size={16} /> : <RefreshCw size={16} />}
                {synced ? 'Synced to CRM' : syncing ? 'Syncing...' : 'Sync to CRM'}
              </button>
              <a
                href={`https://v2.aurorasolar.com/projects/${projectId}/overview/dashboard`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm border border-white/20 transition-colors"
              >
                <ExternalLink size={16} /> Open in Aurora
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="h-8 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : error && !bundle ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <p className="text-red-600 font-semibold mb-2">Unable to load Aurora project</p>
            <p className="text-red-500 text-sm">{error}</p>
            <p className="text-gray-500 text-xs mt-4">Project ID: {projectId} &bull; Design ID: {designId}</p>
            <p className="text-gray-400 text-xs mt-1">Make sure your Aurora API key is configured in Vercel env vars.</p>
          </div>
        ) : bundle ? (
          <>
            {/* Customer & Address Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <User size={18} className="text-[#007A67]" />
                  <h2 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider">Customer</h2>
                </div>
                <p className="text-lg font-bold text-[#0B1F3A]">{bundle.customer_first_name} {bundle.customer_last_name}</p>
                {bundle.customer_email && <p className="text-sm text-gray-600">{bundle.customer_email}</p>}
                {bundle.customer_phone && <p className="text-sm text-gray-600">{bundle.customer_phone}</p>}
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={18} className="text-[#7C5CBF]" />
                  <h2 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider">Property</h2>
                </div>
                <p className="text-lg font-bold text-[#0B1F3A]">{bundle.address}</p>
                <p className="text-sm text-gray-600">{bundle.city}, {bundle.state} {bundle.zip}</p>
                {bundle.utility_company && <p className="text-xs text-gray-500 mt-1">Utility: {bundle.utility_company}</p>}
              </div>
            </div>

            {/* Design KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
              {[
                { label: 'System Size', value: bundle.system_size_kw ? `${bundle.system_size_kw.toFixed(1)} kW` : '—', icon: Zap, color: '#F0A500' },
                { label: 'Panels', value: bundle.panel_count?.toString() || '—', icon: Sun, color: '#007A67' },
                { label: 'Annual Production', value: bundle.annual_production_kwh ? `${(bundle.annual_production_kwh/1000).toFixed(1)} MWh` : '—', icon: Battery, color: '#7C5CBF' },
                { label: 'Offset', value: bundle.offset_percentage ? `${bundle.offset_percentage.toFixed(0)}%` : '—', icon: Ruler, color: '#0B1F3A' },
                { label: 'System Cost', value: bundle.contract_amount ? fmt(bundle.contract_amount) : '—', icon: DollarSign, color: '#E8A838' },
                { label: 'Price/Watt', value: bundle.price_per_watt ? `$${bundle.price_per_watt.toFixed(2)}` : '—', icon: Settings, color: '#DC2626' },
              ].map(kpi => (
                <div key={kpi.label} className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: kpi.color + '15' }}>
                    <kpi.icon size={16} style={{ color: kpi.color }} />
                  </div>
                  <p className="text-lg font-bold text-[#0B1F3A]">{kpi.value}</p>
                  <p className="text-[11px] text-gray-500">{kpi.label}</p>
                </div>
              ))}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Equipment */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h2 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider mb-4">Equipment</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Solar Panels</p>
                    <p className="text-sm font-semibold text-[#0B1F3A]">{bundle.panel_type || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Inverter</p>
                    <p className="text-sm font-semibold text-[#0B1F3A]">{bundle.inverter_type || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Financials */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h2 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider mb-4">Financials</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Net Cost</span>
                    <span className="text-sm font-semibold text-[#0B1F3A]">{bundle.net_cost ? fmt(bundle.net_cost) : '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Monthly Payment</span>
                    <span className="text-sm font-semibold text-[#0B1F3A]">{bundle.monthly_payment ? fmt(bundle.monthly_payment) : '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Year 1 Savings</span>
                    <span className="text-sm font-semibold text-green-600">{bundle.year1_savings ? fmt(bundle.year1_savings) : '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">25-Year Savings</span>
                    <span className="text-sm font-semibold text-green-600">{bundle.lifetime_savings ? fmt(bundle.lifetime_savings) : '—'}</span>
                  </div>
                </div>
              </div>

              {/* Consumption */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h2 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider mb-4">Consumption</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Annual Usage</span>
                    <span className="text-sm font-semibold text-[#0B1F3A]">{bundle.annual_usage_kwh ? `${(bundle.annual_usage_kwh/1000).toFixed(1)} MWh` : '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Avg Monthly Bill</span>
                    <span className="text-sm font-semibold text-[#0B1F3A]">{bundle.avg_monthly_bill ? fmt(bundle.avg_monthly_bill) : '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Proposal Status</span>
                    <span className={`text-sm font-semibold ${bundle.proposal_status === 'signed' ? 'text-green-600' : 'text-[#F0A500]'}`}>
                      {bundle.proposal_status || '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/solar/contracts/generate" className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-md transition-all group">
                <FileText size={20} className="mx-auto mb-2 text-[#F0A500] group-hover:scale-110 transition-transform" />
                <p className="text-sm font-semibold text-[#0B1F3A]">Generate Contract</p>
              </Link>
              {bundle.proposal_url && (
                <a href={bundle.proposal_url} target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-md transition-all group">
                  <ExternalLink size={20} className="mx-auto mb-2 text-[#007A67] group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-semibold text-[#0B1F3A]">View Proposal</p>
                </a>
              )}
              <Link href={`/deals?aurora=${projectId}`} className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-md transition-all group">
                <Home size={20} className="mx-auto mb-2 text-[#7C5CBF] group-hover:scale-110 transition-transform" />
                <p className="text-sm font-semibold text-[#0B1F3A]">View Deal</p>
              </Link>
              <Link href="/solar/dashboard" className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-md transition-all group">
                <Sun size={20} className="mx-auto mb-2 text-[#0B1F3A] group-hover:scale-110 transition-transform" />
                <p className="text-sm font-semibold text-[#0B1F3A]">Solar Dashboard</p>
              </Link>
            </div>

            <p className="text-xs text-gray-400 text-center mt-6">
              Last synced: {new Date(bundle.aurora_synced_at).toLocaleString()} &bull; Aurora Project ID: {projectId}
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}
