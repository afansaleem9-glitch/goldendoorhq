'use client';

import { useState } from 'react';
import { useApi } from '@/lib/hooks/useApi';
import { EmailCampaign } from '@/lib/types';
import { Mail, Plus, Search, Send, Eye, Loader, BarChart3 } from 'lucide-react';

const statusBadge: Record<string, string> = { draft: 'bg-gray-100 text-gray-700', scheduled: 'bg-blue-100 text-blue-700', sending: 'bg-yellow-100 text-yellow-700', sent: 'bg-green-100 text-green-700', paused: 'bg-orange-100 text-orange-700' };

export default function MarketingPage() {
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', subject: '', from_name: 'Delta Power Group', from_email: 'info@deltapowergroup.com' });

  const { data: campaigns, loading, error, total, create } = useApi<EmailCampaign>('/api/marketing', { limit: 50, search });

  const handleCreate = async () => {
    try { await create(form); setShowCreate(false); setForm({ name: '', subject: '', from_name: 'Delta Power Group', from_email: 'info@deltapowergroup.com' }); }
    catch (e) { alert(e instanceof Error ? e.message : 'Error'); }
  };

  const totalSent = campaigns.reduce((s, c) => s + (c.stats?.sent || 0), 0);
  const totalOpened = campaigns.reduce((s, c) => s + (c.stats?.opened || 0), 0);

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-[#0B1F3A]">Marketing</h1><p className="text-sm text-[#9CA3AF]">{total} campaigns</p></div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> New Campaign</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card"><p className="text-sm text-[#9CA3AF]">Total Sent</p><p className="text-2xl font-bold text-[#0B1F3A]">{totalSent.toLocaleString()}</p></div>
        <div className="card"><p className="text-sm text-[#9CA3AF]">Total Opened</p><p className="text-2xl font-bold text-[#0B1F3A]">{totalOpened.toLocaleString()}</p></div>
        <div className="card"><p className="text-sm text-[#9CA3AF]">Open Rate</p><p className="text-2xl font-bold text-[#0B1F3A]">{totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : 0}%</p></div>
      </div>
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search campaigns..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#F0A500]/30 focus:border-[#F0A500] outline-none" />
      </div>
      <div className="card overflow-hidden p-0">
        {loading ? <div className="flex items-center justify-center py-20"><Loader className="animate-spin text-gray-400" size={32} /></div>
        : error ? <div className="text-red-500 text-sm p-6">{error}</div>
        : campaigns.length === 0 ? (
          <div className="text-center py-20 text-gray-400"><Mail size={48} className="mx-auto mb-3 opacity-40" /><p className="font-medium">No campaigns yet</p></div>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-left text-[#9CA3AF] text-xs uppercase tracking-wider">
              <th className="px-4 py-3 font-medium">Campaign</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Sent</th>
              <th className="px-4 py-3 font-medium">Opened</th><th className="px-4 py-3 font-medium">Clicked</th><th className="px-4 py-3 font-medium">Created</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {campaigns.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-4 py-3"><p className="font-medium text-[#0B1F3A]">{c.name}</p><p className="text-xs text-[#9CA3AF]">{c.subject}</p></td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[c.status] || 'bg-gray-100'}`}>{c.status}</span></td>
                  <td className="px-4 py-3 text-[#6B7280]">{c.stats?.sent || 0}</td>
                  <td className="px-4 py-3 text-[#6B7280]">{c.stats?.opened || 0}</td>
                  <td className="px-4 py-3 text-[#6B7280]">{c.stats?.clicked || 0}</td>
                  <td className="px-4 py-3 text-[#9CA3AF]">{c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">New Campaign</h2>
            <div className="space-y-3">
              <input placeholder="Campaign Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Subject Line" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <input placeholder="From Name" value={form.from_name} onChange={e => setForm({...form, from_name: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <input placeholder="From Email" value={form.from_email} onChange={e => setForm({...form, from_email: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
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
