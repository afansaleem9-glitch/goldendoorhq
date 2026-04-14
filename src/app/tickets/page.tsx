'use client';

import { useState } from 'react';
import { useApi } from '@/lib/hooks/useApi';
import { Ticket } from '@/lib/types';
import { Plus, Search, AlertTriangle, Clock, CheckCircle, Loader } from 'lucide-react';

const statusBadge: Record<string, string> = { open: 'bg-red-100 text-red-700', in_progress: 'bg-yellow-100 text-yellow-700', waiting: 'bg-purple-100 text-purple-700', resolved: 'bg-green-100 text-green-700', closed: 'bg-gray-100 text-gray-700' };
const priorityBadge: Record<string, string> = { urgent: 'bg-red-100 text-red-700', high: 'bg-orange-100 text-orange-700', medium: 'bg-blue-100 text-blue-700', low: 'bg-gray-100 text-gray-600' };

export default function TicketsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ subject: '', description: '', priority: 'medium', category: 'general' });

  const { data: tickets, loading, error, total, create } = useApi<Ticket>('/api/tickets', {
    limit: 50, search, filters: statusFilter ? { status: statusFilter } : {},
  });

  const handleCreate = async () => {
    try { await create(form); setShowCreate(false); setForm({ subject: '', description: '', priority: 'medium', category: 'general' }); }
    catch (e) { alert(e instanceof Error ? e.message : 'Error'); }
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-[#0B1F3A]">Tickets</h1><p className="text-sm text-[#9CA3AF]">{total} total · {tickets.filter(t => t.status === 'open').length} open</p></div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> New Ticket</button>
      </div>
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search tickets..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#F0A500]/30 focus:border-[#F0A500] outline-none" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none">
          <option value="">All Status</option><option value="open">Open</option><option value="in_progress">In Progress</option><option value="waiting">Waiting</option><option value="resolved">Resolved</option><option value="closed">Closed</option>
        </select>
      </div>
      <div className="card overflow-hidden p-0">
        {loading ? <div className="flex items-center justify-center py-20"><Loader className="animate-spin text-gray-400" size={32} /></div>
        : error ? <div className="text-red-500 text-sm p-6">{error}</div>
        : tickets.length === 0 ? (
          <div className="text-center py-20 text-gray-400"><AlertTriangle size={48} className="mx-auto mb-3 opacity-40" /><p className="font-medium">No tickets found</p></div>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-left text-[#9CA3AF] text-xs uppercase tracking-wider">
              <th className="px-4 py-3 font-medium">#</th><th className="px-4 py-3 font-medium">Subject</th><th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Priority</th><th className="px-4 py-3 font-medium">Category</th><th className="px-4 py-3 font-medium">Created</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {tickets.map(t => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="px-4 py-3 text-[#9CA3AF]">#{t.ticket_number}</td>
                  <td className="px-4 py-3 font-medium text-[#0B1F3A]">{t.subject}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[t.status] || 'bg-gray-100'}`}>{t.status?.replace('_',' ')}</span></td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityBadge[t.priority] || 'bg-gray-100'}`}>{t.priority}</span></td>
                  <td className="px-4 py-3 text-[#6B7280]">{t.category || '—'}</td>
                  <td className="px-4 py-3 text-[#9CA3AF]">{t.created_at ? new Date(t.created_at).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">New Ticket</h2>
            <div className="space-y-3">
              <input placeholder="Subject" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" rows={3} />
              <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm">
                {['low','medium','high','urgent'].map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
              </select>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm">
                {['general','billing','technical','installation','monitoring','warranty','complaint'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreate} className="btn-primary text-sm">Create Ticket</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
