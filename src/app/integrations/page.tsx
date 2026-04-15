'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, ORG_ID } from '@/lib/supabase';
import {
  Plug, Search, CheckCircle, XCircle, RefreshCw, Settings,
  ExternalLink, ChevronRight, Zap, Database, Activity,
  Loader2, AlertTriangle, Plus, X, Wifi, WifiOff, Clock,
  ArrowUpDown, BarChart3
} from 'lucide-react';

// ============================================================
// Types
// ============================================================
interface Integration {
  id: string;
  organization_id: string;
  integration_name: string;
  category: string;
  status: string;
  api_key_encrypted: string | null;
  oauth_token_encrypted: string | null;
  config: Record<string, unknown> | null;
  sync_frequency: string | null;
  last_sync_at: string | null;
  last_sync_status: string | null;
  records_synced: number | null;
  error_count: number | null;
  health_score: number | null;
  webhook_url: string | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

// ============================================================
// Category metadata
// ============================================================
const CATEGORY_META: Record<string, { label: string; color: string }> = {
  crm: { label: 'CRM', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  communication: { label: 'Communications', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  field_ops: { label: 'Field Operations', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  smarthome: { label: 'Smart Home', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  solar: { label: 'Solar', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  roofing: { label: 'Roofing', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  finance: { label: 'Finance', color: 'bg-green-50 text-green-700 border-green-200' },
  automation: { label: 'Automation', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  project_mgmt: { label: 'Project Mgmt', color: 'bg-pink-50 text-pink-700 border-pink-200' },
  workforce: { label: 'Workforce', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  hr_payroll: { label: 'HR & Payroll', color: 'bg-violet-50 text-violet-700 border-violet-200' },
  supply_chain: { label: 'Supply Chain', color: 'bg-lime-50 text-lime-700 border-lime-200' },
  credit: { label: 'Credit', color: 'bg-red-50 text-red-700 border-red-200' },
  training: { label: 'Training', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  design: { label: 'Design', color: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200' },
};

const ICON_MAP: Record<string, string> = {
  'HubSpot CRM': 'H', 'RingCentral': 'R', 'SiteCapture': 'SC', 'CompanyCam': 'CC',
  'SubcontractorHub': 'SH', 'SecurityTrax': 'ST', 'Alarm.com': 'AD', 'Zapier': 'Z',
  'QuickBooks': 'QB', 'Asana': 'A', 'Rippling': 'RP', 'Hubstaff': 'HS',
  'Enphase': 'EN', 'SolarEdge': 'SE', 'GAF': 'G', 'TransUnion': 'TU',
  'Wave Electronics': 'WE', 'ABC Supply': 'AB', 'ADI Global': 'AG',
  'EMA Manager': 'EM', 'SunHub': 'SU', 'Tesla One': 'T', 'Audible': 'Au',
  'Virtual Home Remodeler': 'VR',
};

function getCatMeta(cat: string) {
  return CATEGORY_META[cat] || { label: cat, color: 'bg-gray-50 text-gray-600 border-gray-200' };
}

function timeAgo(date: string | null): string {
  if (!date) return 'Never';
  const diff = Date.now() - new Date(date).getTime();
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} hr ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

function freqLabel(f: string | null): string {
  if (!f) return '—';
  const m: Record<string, string> = { realtime: 'Real-time', hourly: 'Every hour', daily: 'Daily', weekly: 'Weekly', on_demand: 'On demand', manual: 'Manual' };
  return m[f] || f;
}

// ============================================================
// Main Page Component
// ============================================================
export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'records' | 'health'>('name');

  // --- Connect New modal ---
  const [showConnect, setShowConnect] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('other');
  const [newFreq, setNewFreq] = useState('manual');
  const [newWebhook, setNewWebhook] = useState('');
  const [saving, setSaving] = useState(false);

  // --- Configure modal ---
  const [configuring, setConfiguring] = useState<Integration | null>(null);
  const [cfgFreq, setCfgFreq] = useState('');
  const [cfgWebhook, setCfgWebhook] = useState('');

  // --- Logs modal ---
  const [logsFor, setLogsFor] = useState<Integration | null>(null);
  const [logs, setLogs] = useState<Array<{ id: string; action: string; status: string; request_payload: Record<string, unknown> | null; created_at: string; created_by: string | null }>>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  // ============================================================
  // Fetch integrations from Supabase
  // ============================================================
  const fetchIntegrations = useCallback(async () => {
    const { data, error } = await supabase
      .from('integration_connections')
      .select('*')
      .eq('organization_id', ORG_ID)
      .is('deleted_at', null)
      .order('integration_name');
    if (!error && data) setIntegrations(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchIntegrations(); }, [fetchIntegrations]);

  // ============================================================
  // Actions
  // ============================================================
  async function handleSync(integ: Integration) {
    setSyncing(integ.id);
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('integration_connections')
      .update({ last_sync_at: now, last_sync_status: 'success', updated_at: now })
      .eq('id', integ.id);
    if (!error) {
      // Log the sync
      await supabase.from('integration_logs').insert({
        integration: integ.integration_name,
        action: 'sync',
        direction: 'inbound',
        status: 'success',
        request_payload: { triggered_by: 'manual', records: integ.records_synced },
        created_by: 'system',
      });
      setIntegrations(prev => prev.map(i => i.id === integ.id ? { ...i, last_sync_at: now, last_sync_status: 'success', updated_at: now } : i));
    }
    setSyncing(null);
  }

  async function handleDisconnect(integ: Integration) {
    if (!confirm(`Disconnect ${integ.integration_name}? This will clear stored credentials.`)) return;
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('integration_connections')
      .update({ status: 'disconnected', api_key_encrypted: null, oauth_token_encrypted: null, updated_at: now })
      .eq('id', integ.id);
    if (!error) {
      await supabase.from('integration_logs').insert({
        integration: integ.integration_name,
        action: 'disconnect', direction: 'outbound', status: 'success',
        request_payload: {}, created_by: 'system',
      });
      setIntegrations(prev => prev.map(i => i.id === integ.id ? { ...i, status: 'disconnected', api_key_encrypted: null, oauth_token_encrypted: null } : i));
    }
  }

  async function handleReconnect(integ: Integration) {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('integration_connections')
      .update({ status: 'connected', health_score: 100, error_count: 0, updated_at: now })
      .eq('id', integ.id);
    if (!error) {
      await supabase.from('integration_logs').insert({
        integration: integ.integration_name,
        action: 'reconnect', direction: 'outbound', status: 'success',
        request_payload: {}, created_by: 'system',
      });
      setIntegrations(prev => prev.map(i => i.id === integ.id ? { ...i, status: 'connected', health_score: 100, error_count: 0 } : i));
    }
  }

  async function handleDelete(integ: Integration) {
    if (!confirm(`Permanently remove ${integ.integration_name} from integrations?`)) return;
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('integration_connections')
      .update({ deleted_at: now, status: 'disconnected' })
      .eq('id', integ.id);
    if (!error) {
      setIntegrations(prev => prev.filter(i => i.id !== integ.id));
    }
  }

  async function handleConnectNew() {
    if (!newName.trim()) return;
    setSaving(true);
    const { data, error } = await supabase
      .from('integration_connections')
      .insert({
        organization_id: ORG_ID,
        integration_name: newName.trim(),
        category: newCategory,
        status: 'connected',
        sync_frequency: newFreq,
        webhook_url: newWebhook || null,
        config: {},
        health_score: 100,
        records_synced: 0,
        error_count: 0,
      })
      .select()
      .single();
    if (!error && data) {
      setIntegrations(prev => [...prev, data].sort((a, b) => a.integration_name.localeCompare(b.integration_name)));
      setShowConnect(false);
      setNewName(''); setNewCategory('other'); setNewFreq('manual'); setNewWebhook('');
    }
    setSaving(false);
  }

  async function handleViewLogs(integ: Integration) {
    setLogsFor(integ);
    setLogsLoading(true);
    const { data, error } = await supabase
      .from('integration_logs')
      .select('id, action, status, request_payload, created_at, created_by')
      .eq('integration', integ.integration_name)
      .order('created_at', { ascending: false })
      .limit(20);
    if (!error && data) setLogs(data);
    else setLogs([]);
    setLogsLoading(false);
  }

  async function handleSaveConfig() {
    if (!configuring) return;
    setSaving(true);
    const now = new Date().toISOString();
    const updates: Record<string, unknown> = { updated_at: now };
    if (cfgFreq) updates.sync_frequency = cfgFreq;
    if (cfgWebhook !== configuring.webhook_url) updates.webhook_url = cfgWebhook || null;
    const { error } = await supabase
      .from('integration_connections')
      .update(updates)
      .eq('id', configuring.id);
    if (!error) {
      setIntegrations(prev => prev.map(i => i.id === configuring.id ? { ...i, ...updates } as Integration : i));
      setConfiguring(null);
    }
    setSaving(false);
  }

  // ============================================================
  // Filtering & Sorting
  // ============================================================
  const categories = Array.from(new Set(integrations.map(i => i.category))).sort();

  const filtered = integrations.filter(i => {
    const q = search.toLowerCase();
    const matchSearch = !q || i.integration_name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q);
    const matchCat = category === 'all' || i.category === category;
    const matchStatus = statusFilter === 'all' || i.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  }).sort((a, b) => {
    if (sortBy === 'records') return (b.records_synced || 0) - (a.records_synced || 0);
    if (sortBy === 'health') return (b.health_score || 0) - (a.health_score || 0);
    return a.integration_name.localeCompare(b.integration_name);
  });

  // KPIs
  const connected = integrations.filter(i => i.status === 'connected').length;
  const totalRecords = integrations.reduce((s, i) => s + (i.records_synced || 0), 0);
  const avgHealth = integrations.filter(i => i.status === 'connected' && i.health_score).length > 0
    ? Math.round(integrations.filter(i => i.status === 'connected' && (i.health_score || 0) > 0).reduce((s, i) => s + (i.health_score || 0), 0) / integrations.filter(i => i.status === 'connected' && (i.health_score || 0) > 0).length)
    : 0;
  const errorTotal = integrations.reduce((s, i) => s + (i.error_count || 0), 0);

  // ============================================================
  // Render
  // ============================================================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 size={28} className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-5 max-w-[1400px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-extrabold text-black tracking-tight flex items-center gap-2">
            <Plug size={22} strokeWidth={2.5} /> API Integrations
          </h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Manage connected services, API keys, webhooks, and data sync</p>
        </div>
        <button onClick={() => setShowConnect(true)} className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold text-white bg-black rounded-lg hover:bg-gray-900 transition-colors">
          <Plus size={14} /> Connect New
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'CONNECTED', value: `${connected}/${integrations.length}`, sub: 'integrations active', icon: CheckCircle, color: 'text-emerald-500' },
          { label: 'RECORDS SYNCED', value: totalRecords.toLocaleString(), sub: 'across all platforms', icon: Database, color: 'text-blue-500' },
          { label: 'AVG HEALTH', value: `${avgHealth}%`, sub: 'connected integrations', icon: Activity, color: avgHealth >= 90 ? 'text-emerald-500' : 'text-amber-500' },
          { label: 'ERRORS', value: String(errorTotal), sub: 'total error count', icon: AlertTriangle, color: errorTotal === 0 ? 'text-emerald-500' : 'text-red-500' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-200/60 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{kpi.label}</span>
              <kpi.icon size={14} className={kpi.color} />
            </div>
            <p className="text-2xl font-extrabold text-black">{kpi.value}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Search / Filter / Sort Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
          <input type="text" placeholder="Search integrations..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-[13px] focus:ring-1 focus:ring-black/10 focus:border-black outline-none" />
        </div>
        <div className="flex items-center gap-1">
          {['all', 'connected', 'disconnected', 'planned'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all ${
                statusFilter === s ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}>
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
        <button onClick={() => setSortBy(sortBy === 'name' ? 'records' : sortBy === 'records' ? 'health' : 'name')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-gray-500 hover:bg-gray-100 border border-gray-200 transition-all">
          <ArrowUpDown size={12} /> {sortBy === 'name' ? 'A-Z' : sortBy === 'records' ? 'Records' : 'Health'}
        </button>
      </div>

      {/* Category pills */}
      <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar pb-1">
        <button onClick={() => setCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
            category === 'all' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'
          }`}>All</button>
        {categories.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
              category === c ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'
            }`}>
            {getCatMeta(c).label}
          </button>
        ))}
      </div>

      {/* Integration Cards */}
      <div className="space-y-3">
        {filtered.map(integ => {
          const isExpanded = expanded === integ.id;
          const isConnected = integ.status === 'connected';
          const isPlanned = integ.status === 'planned';
          const isSyncing = syncing === integ.id;
          const catMeta = getCatMeta(integ.category);
          const icon = ICON_MAP[integ.integration_name] || integ.integration_name.charAt(0).toUpperCase();
          const healthColor = (integ.health_score || 0) >= 90 ? 'text-emerald-600' : (integ.health_score || 0) >= 70 ? 'text-amber-600' : 'text-red-600';

          return (
            <div key={integ.id} className={`bg-white rounded-xl border transition-all ${
              isExpanded ? 'border-black shadow-lg' : 'border-gray-200/60 hover:border-gray-300'
            }`}>
              {/* Card header */}
              <div className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => setExpanded(isExpanded ? null : integ.id)}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-[13px] font-extrabold shrink-0 ${
                  isConnected ? 'bg-black text-white' : isPlanned ? 'bg-gray-50 text-gray-400 border border-dashed border-gray-300' : 'bg-gray-100 text-gray-500'
                }`}>
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-black">{integ.integration_name}</span>
                    <span className={`text-[10px] font-semibold border rounded px-1.5 py-0.5 ${catMeta.color}`}>{catMeta.label}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[12px] text-gray-500">{freqLabel(integ.sync_frequency)}</span>
                    {isConnected && integ.health_score ? (
                      <span className={`text-[11px] font-semibold ${healthColor}`}>{integ.health_score}% health</span>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  {isConnected && integ.records_synced ? (
                    <div className="text-right hidden lg:block">
                      <p className="text-[13px] font-bold text-black">{integ.records_synced.toLocaleString()}</p>
                      <p className="text-[11px] text-gray-500">records</p>
                    </div>
                  ) : null}
                  {integ.last_sync_at ? (
                    <div className="text-right hidden md:block">
                      <p className="text-[11px] text-gray-500">Last sync</p>
                      <p className="text-[12px] font-medium text-black">{timeAgo(integ.last_sync_at)}</p>
                    </div>
                  ) : null}
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                    isConnected ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    isPlanned ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                    'bg-gray-100 text-gray-500 border border-gray-200'
                  }`}>
                    {isConnected ? <Wifi size={11} /> : isPlanned ? <Clock size={11} /> : <WifiOff size={11} />}
                    {isConnected ? 'Connected' : isPlanned ? 'Planned' : 'Disconnected'}
                  </span>
                  <ChevronRight size={16} className={`text-gray-300 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="border-t border-gray-200/60 p-5 space-y-4">
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</p>
                      <p className={`text-[13px] font-semibold capitalize ${isConnected ? 'text-emerald-600' : isPlanned ? 'text-blue-600' : 'text-gray-500'}`}>{integ.status}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Sync Frequency</p>
                      <p className="text-[13px] font-semibold text-black">{freqLabel(integ.sync_frequency)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Health Score</p>
                      <p className={`text-[13px] font-semibold ${healthColor}`}>{integ.health_score || 0}%</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Error Count</p>
                      <p className={`text-[13px] font-semibold ${(integ.error_count || 0) > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{integ.error_count || 0}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Last Sync</p>
                      <p className="text-[13px] font-semibold text-black">{integ.last_sync_at ? timeAgo(integ.last_sync_at) : 'Never'}</p>
                    </div>
                  </div>

                  {integ.webhook_url && (
                    <div>
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Webhook URL</p>
                      <code className="text-[11px] font-mono bg-gray-50 border border-gray-200 rounded px-2 py-1 text-gray-600 block truncate">{integ.webhook_url}</code>
                    </div>
                  )}

                  {integ.config && Object.keys(integ.config).length > 0 && (
                    <div>
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Config</p>
                      <code className="text-[11px] font-mono bg-gray-50 border border-gray-200 rounded px-2 py-1 text-gray-600 block max-h-24 overflow-auto">{JSON.stringify(integ.config, null, 2)}</code>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 pt-2 flex-wrap">
                    {isConnected ? (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); handleSync(integ); }} disabled={isSyncing}
                          className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-white bg-black rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50">
                          {isSyncing ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                          {isSyncing ? 'Syncing...' : 'Sync Now'}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setConfiguring(integ); setCfgFreq(integ.sync_frequency || 'manual'); setCfgWebhook(integ.webhook_url || ''); }}
                          className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <Settings size={12} /> Configure
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleViewLogs(integ); }}
                          className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <BarChart3 size={12} /> Logs
                        </button>
                        <div className="flex-1" />
                        <button onClick={(e) => { e.stopPropagation(); handleDisconnect(integ); }}
                          className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                          <XCircle size={12} /> Disconnect
                        </button>
                      </>
                    ) : isPlanned ? (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); handleReconnect(integ); }}
                          className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold text-white bg-black rounded-lg hover:bg-gray-900 transition-colors">
                          <Plug size={12} /> Activate {integ.integration_name}
                        </button>
                        <div className="flex-1" />
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(integ); }}
                          className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-red-400 hover:text-red-600 transition-colors">
                          <X size={12} /> Remove
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); handleReconnect(integ); }}
                          className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold text-white bg-black rounded-lg hover:bg-gray-900 transition-colors">
                          <Plug size={12} /> Reconnect
                        </button>
                        <div className="flex-1" />
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(integ); }}
                          className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-red-400 hover:text-red-600 transition-colors">
                          <X size={12} /> Remove
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && !loading && (
        <div className="text-center py-20">
          <Plug size={40} className="mx-auto mb-3 text-gray-200" />
          <p className="text-[14px] font-semibold text-gray-500">No integrations match your search</p>
        </div>
      )}

      {/* ============================================================ */}
      {/* Connect New Modal */}
      {/* ============================================================ */}
      {showConnect && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowConnect(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-extrabold text-black">Connect New Integration</h2>
              <button onClick={() => setShowConnect(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-gray-600 mb-1">Integration Name *</label>
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Stripe, Twilio, PandaDoc..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-[13px] focus:ring-1 focus:ring-black/10 focus:border-black outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-semibold text-gray-600 mb-1">Category</label>
                <select value={newCategory} onChange={e => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-[13px] focus:ring-1 focus:ring-black/10 focus:border-black outline-none bg-white">
                  {Object.entries(CATEGORY_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-600 mb-1">Sync Frequency</label>
                <select value={newFreq} onChange={e => setNewFreq(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-[13px] focus:ring-1 focus:ring-black/10 focus:border-black outline-none bg-white">
                  <option value="realtime">Real-time</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="on_demand">On demand</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-gray-600 mb-1">Webhook URL <span className="text-gray-400">(optional)</span></label>
              <input value={newWebhook} onChange={e => setNewWebhook(e.target.value)} placeholder="https://..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-[13px] focus:ring-1 focus:ring-black/10 focus:border-black outline-none" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowConnect(false)} className="px-4 py-2 text-[12px] font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleConnectNew} disabled={!newName.trim() || saving}
                className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold text-white bg-black rounded-lg hover:bg-gray-900 disabled:opacity-50">
                {saving ? <Loader2 size={12} className="animate-spin" /> : <Plug size={12} />}
                {saving ? 'Connecting...' : 'Connect'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* Configure Modal */}
      {/* ============================================================ */}
      {configuring && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setConfiguring(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-extrabold text-black">Configure {configuring.integration_name}</h2>
              <button onClick={() => setConfiguring(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-gray-600 mb-1">Sync Frequency</label>
              <select value={cfgFreq} onChange={e => setCfgFreq(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-[13px] focus:ring-1 focus:ring-black/10 focus:border-black outline-none bg-white">
                <option value="realtime">Real-time</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="on_demand">On demand</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-gray-600 mb-1">Webhook URL</label>
              <input value={cfgWebhook} onChange={e => setCfgWebhook(e.target.value)} placeholder="https://..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-[13px] focus:ring-1 focus:ring-black/10 focus:border-black outline-none" />
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-[11px] font-semibold text-gray-500 mb-1">Integration ID</p>
              <code className="text-[11px] font-mono text-gray-600">{configuring.id}</code>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setConfiguring(null)} className="px-4 py-2 text-[12px] font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleSaveConfig} disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold text-white bg-black rounded-lg hover:bg-gray-900 disabled:opacity-50">
                {saving ? <Loader2 size={12} className="animate-spin" /> : <Settings size={12} />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logs Modal */}
      {logsFor && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setLogsFor(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 space-y-4 max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-extrabold text-black">Activity Logs — {logsFor.integration_name}</h2>
              <button onClick={() => setLogsFor(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {logsLoading ? (
                <div className="flex items-center justify-center py-12"><Loader2 size={20} className="animate-spin text-gray-400" /></div>
              ) : logs.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-[13px]">No activity logs found for this integration.</div>
              ) : (
                <div className="space-y-2">
                  {logs.map(log => (
                    <div key={log.id} className="flex items-start gap-3 px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-100">
                      <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${log.status === 'success' ? 'bg-green-500' : log.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] font-semibold text-gray-800 capitalize">{log.action}</span>
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${log.status === 'success' ? 'bg-green-100 text-green-700' : log.status === 'error' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{log.status}</span>
                        </div>
                        {log.request_payload && Object.keys(log.request_payload).length > 0 && (
                          <p className="text-[11px] text-gray-500 mt-0.5">{JSON.stringify(log.request_payload)}</p>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 flex-shrink-0 whitespace-nowrap">{timeAgo(log.created_at)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button onClick={() => setLogsFor(null)} className="px-4 py-2 text-[12px] font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
