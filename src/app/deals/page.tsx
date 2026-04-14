'use client';

import { useState } from 'react';
import { useApi } from '@/lib/hooks/useApi';
import { Deal } from '@/lib/types';
import { Plus, Search, DollarSign, Loader, ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';

function fmt(n: number) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n); }

const priorityColors: Record<string, string> = { urgent: 'bg-red-100 text-red-700', high: 'bg-orange-100 text-orange-700', medium: 'bg-blue-100 text-blue-700', low: 'bg-gray-100 text-gray-700' };

export default function DealsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [view, setView] = useState<'table' | 'board'>('table');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', amount: '', deal_type: 'solar', priority: 'medium', stage_name: 'Qualification' });

  const { data: deals, loading, error, total, create } = useApi<Deal>('/api/deals', { page, limit: 50, search });

  const handleCreate = async () => {
    try { await create({ ...form, amount: parseFloat(form.amount) || 0 }); setShowCreate(false); }
    catch (e) { alert(e instanceof Error ? e.message : 'Error'); }
  };

  const totalPages = Math.ceil(total / 50) || 1;
  const pipelineValue = deals.filter(d => !d.is_won && !d.is_lost).reduce((s, d) => s + (Number(d.amount) || 0), 0);

  // Board view grouping
  const stageNames = ['Qualification', 'Needs Analysis', 'Proposal', 'Negotiation', 'Contract Sent', 'Closed Won', 'Closed Lost'];
  const grouped = stageNames.map(stage => ({ stage, deals: deals.filter(d => d.stage_name === stage) }));

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F3A]">Deals</h1>
          <p className="text-sm text-[#9CA3AF]">{total} deals · Pipeline: {fmt(pipelineValue)}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-lg overflow-hidden">
            <button onClick={() => setView('table')} className={`px-3 py-1.5 text-sm ${view === 'table' ? 'bg-[#0B1F3A] text-white' : 'text-gray-500'}`}><List size={16} /></button>
            <button onClick={() => setView('board')} className={`px-3 py-1.5 text-sm ${view === 'board' ? 'bg-[#0B1F3A] text-white' : 'text-gray-500'}`}><LayoutGrid size={16} /></button>
          </div>
          <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Deal</button>
        </div>
      </div>
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search deals..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#F0A500]/30 focus:border-[#F0A500] outline-none" />
      </div>

      {loading ? <div className="flex items-center justify-center py-20"><Loader className="animate-spin text-gray-400" size={32} /></div>
      : error ? <div className="text-red-500 text-sm">{error}</div>
      : deals.length === 0 ? (
        <div className="card text-center py-20 text-gray-400"><DollarSign size={48} className="mx-auto mb-3 opacity-40" /><p className="font-medium">No deals yet</p><p className="text-sm mt-1">Create your first deal to build your pipeline</p></div>
      ) : view === 'table' ? (
        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-left text-[#9CA3AF] text-xs uppercase tracking-wider">
              <th className="px-4 py-3 font-medium">Deal Name</th><th className="px-4 py-3 font-medium">Amount</th><th className="px-4 py-3 font-medium">Stage</th>
              <th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">Priority</th><th className="px-4 py-3 font-medium">Close Date</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {deals.map(d => (
                <tr key={d.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="px-4 py-3 font-medium text-[#0B1F3A]">{d.name}</td>
                  <td className="px-4 py-3 font-semibold text-[#F0A500]">{fmt(Number(d.amount) || 0)}</td>
                  <td className="px-4 py-3 text-[#6B7280]">{d.stage_name || '—'}</td>
                  <td className="px-4 py-3 text-[#6B7280]">{d.deal_type || '—'}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[d.priority] || 'bg-gray-100'}`}>{d.priority}</span></td>
                  <td className="px-4 py-3 text-[#9CA3AF]">{d.close_date ? new Date(d.close_date).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {grouped.map(g => (
            <div key={g.stage} className="min-w-[260px] w-[260px] shrink-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#6B7280] uppercase">{g.stage}</span>
                <span className="text-xs text-[#9CA3AF]">{g.deals.length}</span>
              </div>
              <div className="space-y-2">
                {g.deals.map(d => (
                  <div key={d.id} className="card p-3 cursor-pointer hover:shadow-md transition-shadow">
                    <p className="text-sm font-medium text-[#0B1F3A] truncate">{d.name}</p>
                    <p className="text-sm font-bold text-[#F0A500] mt-1">{fmt(Number(d.amount) || 0)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[d.priority] || 'bg-gray-100'}`}>{d.priority}</span>
                      {d.deal_type && <span className="text-xs text-[#9CA3AF]">{d.deal_type}</span>}
                    </div>
                  </div>
                ))}
                {g.deals.length === 0 && <div className="text-center py-8 text-xs text-gray-300">No deals</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'table' && totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#9CA3AF]">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 border rounded-lg disabled:opacity-40"><ChevronLeft size={16} /></button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 border rounded-lg disabled:opacity-40"><ChevronRight size={16} /></button>
          </div>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">New Deal</h2>
            <div className="space-y-3">
              <input placeholder="Deal Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Amount" type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <select value={form.deal_type} onChange={e => setForm({...form, deal_type: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm">
                {['solar','smart_home','roofing','monitoring','bundle','other'].map(t => <option key={t} value={t}>{t.replace('_', ' ').toUpperCase()}</option>)}
              </select>
              <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm">
                {['low','medium','high','urgent'].map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
              </select>
              <select value={form.stage_name} onChange={e => setForm({...form, stage_name: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm">
                {stageNames.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreate} className="btn-primary text-sm">Create Deal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
