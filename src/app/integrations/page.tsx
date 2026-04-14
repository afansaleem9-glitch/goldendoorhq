'use client';

import { useState } from 'react';
import { useApi } from '@/lib/hooks/useApi';
import { IntegrationConnection } from '@/lib/types';
import { Plug, Plus, Search, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Settings, Clock, Loader } from 'lucide-react';

const statusBadge: Record<string, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
  connected: { bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle2 },
  disconnected: { bg: 'bg-gray-100', text: 'text-gray-500', icon: XCircle },
  error: { bg: 'bg-red-50', text: 'text-red-700', icon: AlertTriangle },
  pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: Clock },
};

const providerColors: Record<string, string> = {
  hubspot: '#FF7A59', enphase: '#FF6B35', solaredge: '#4CAF50', quickbooks: '#4F8C5F',
  stripe: '#635BFF', slack: '#4A154B', zapier: '#FF4A00', twilio: '#F22F46',
  mailchimp: '#FFE01B', supabase: '#3ECF8E', google: '#4285F4', companycam: '#00A3E0',
};

export default function IntegrationsPage() {
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ provider: '', display_name: '', sync_frequency: 'hourly' });

  const { data: integrations, loading, error, total, create } = useApi<IntegrationConnection>('/api/integrations', { limit: 100, search });

  const handleCreate = async () => {
    try { await create(form); setShowCreate(false); setForm({ provider: '', display_name: '', sync_frequency: 'hourly' }); }
    catch (e) { alert(e instanceof Error ? e.message : 'Error'); }
  };

  const connected = integrations.filter(i => i.status === 'connected').length;
  const errors = integrations.filter(i => i.status === 'error').length;

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-[#0B1F3A] flex items-center gap-2"><Plug className="text-[#F0A500]" /> Integrations</h1><p className="text-sm text-[#9CA3AF]">{total} connections</p></div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Integration</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card"><p className="text-sm text-[#9CA3AF] flex items-center gap-1"><CheckCircle2 size={14} className="text-green-500" /> Connected</p><p className="text-2xl font-bold text-green-600">{connected}</p></div>
        <div className="card"><p className="text-sm text-[#9CA3AF] flex items-center gap-1"><Clock size={14} /> Total</p><p className="text-2xl font-bold text-[#0B1F3A]">{total}</p></div>
        <div className="card"><p className="text-sm text-[#9CA3AF] flex items-center gap-1"><AlertTriangle size={14} className="text-red-500" /> Errors</p><p className="text-2xl font-bold text-red-500">{errors}</p></div>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search integrations..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#F0A500]/30 focus:border-[#F0A500] outline-none" />
      </div>

      {loading ? <div className="flex items-center justify-center py-20"><Loader className="animate-spin text-gray-400" size={32} /></div>
      : error ? <div className="text-red-500 text-sm">{error}</div>
      : integrations.length === 0 ? (
        <div className="card text-center py-20 text-gray-400"><Plug size={48} className="mx-auto mb-3 opacity-40" /><p className="font-medium">No integrations yet</p><p className="text-sm mt-1">Connect your tools to sync data automatically</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {integrations.map(integ => {
            const sb = statusBadge[integ.status] || statusBadge.disconnected;
            const StatusIcon = sb.icon;
            const color = providerColors[integ.provider?.toLowerCase()] || '#6B7280';

            return (
              <div key={integ.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: color }}>
                    {(integ.display_name || integ.provider || '?').charAt(0).toUpperCase()}
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${sb.bg} ${sb.text}`}>
                    <StatusIcon size={12} /> {integ.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#0B1F3A]">{integ.display_name || integ.provider}</h3>
                <p className="text-xs text-[#9CA3AF] mt-0.5">Provider: {integ.provider}</p>
                {integ.sync_frequency && <p className="text-xs text-[#9CA3AF]">Sync: {integ.sync_frequency}</p>}

                {integ.last_sync_at && (
                  <p className="text-xs text-[#9CA3AF] mt-2">Last sync: {new Date(integ.last_sync_at).toLocaleString()}</p>
                )}

                <div className="flex gap-2 mt-4">
                  {integ.status === 'connected' ? (
                    <>
                      <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-xs font-medium">
                        <RefreshCw size={14} /> Sync
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-xs font-medium">
                        <Settings size={14} /> Configure
                      </button>
                    </>
                  ) : integ.status === 'error' ? (
                    <button className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-xs font-medium">
                      <AlertTriangle size={14} /> Fix Connection
                    </button>
                  ) : (
                    <button className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-[#0B1F3A] text-white rounded-lg hover:bg-[#0B1F3A]/90 text-xs font-medium">
                      <Plug size={14} /> Connect
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">Add Integration</h2>
            <div className="space-y-3">
              <input placeholder="Provider (e.g. HubSpot, Enphase)" value={form.provider} onChange={e => setForm({...form, provider: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Display Name" value={form.display_name} onChange={e => setForm({...form, display_name: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <select value={form.sync_frequency} onChange={e => setForm({...form, sync_frequency: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="realtime">Real-time</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreate} className="btn-primary text-sm">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
