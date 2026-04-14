'use client';

import { useState } from 'react';
import { useApi } from '@/lib/hooks/useApi';
import { Invoice } from '@/lib/types';
import { DollarSign, Plus, Search, Loader, TrendingUp, AlertCircle } from 'lucide-react';

function fmt(n: number) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n); }
const statusBadge: Record<string, string> = { draft: 'bg-gray-100 text-gray-700', sent: 'bg-blue-100 text-blue-700', viewed: 'bg-purple-100 text-purple-700', partial: 'bg-yellow-100 text-yellow-700', paid: 'bg-green-100 text-green-700', overdue: 'bg-red-100 text-red-700', void: 'bg-gray-100 text-gray-500' };

export default function AccountingPage() {
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ total: '', due_date: '', payment_terms: 'Net 30' });

  const { data: invoices, loading, error, total: count, create } = useApi<Invoice>('/api/accounting', { limit: 100, search });

  const handleCreate = async () => {
    try { await create({ ...form, total: parseFloat(form.total) || 0, amount_due: parseFloat(form.total) || 0 }); setShowCreate(false); }
    catch (e) { alert(e instanceof Error ? e.message : 'Error'); }
  };

  const totalRevenue = invoices.reduce((s, i) => s + (Number(i.amount_paid) || 0), 0);
  const totalOutstanding = invoices.reduce((s, i) => s + (Number(i.amount_due) || 0), 0);
  const overdue = invoices.filter(i => i.status === 'overdue').length;

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-[#0B1F3A]">Accounting</h1><p className="text-sm text-[#9CA3AF]">{count} invoices</p></div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> New Invoice</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card"><p className="text-sm text-[#9CA3AF] flex items-center gap-1"><TrendingUp size={14} /> Collected</p><p className="text-2xl font-bold text-green-600">{fmt(totalRevenue)}</p></div>
        <div className="card"><p className="text-sm text-[#9CA3AF] flex items-center gap-1"><DollarSign size={14} /> Outstanding</p><p className="text-2xl font-bold text-[#F0A500]">{fmt(totalOutstanding)}</p></div>
        <div className="card"><p className="text-sm text-[#9CA3AF] flex items-center gap-1"><AlertCircle size={14} /> Overdue</p><p className="text-2xl font-bold text-red-500">{overdue}</p></div>
      </div>
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#F0A500]/30 focus:border-[#F0A500] outline-none" />
      </div>
      <div className="card overflow-hidden p-0">
        {loading ? <div className="flex items-center justify-center py-20"><Loader className="animate-spin text-gray-400" size={32} /></div>
        : error ? <div className="text-red-500 text-sm p-6">{error}</div>
        : invoices.length === 0 ? (
          <div className="text-center py-20 text-gray-400"><DollarSign size={48} className="mx-auto mb-3 opacity-40" /><p className="font-medium">No invoices yet</p></div>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-left text-[#9CA3AF] text-xs uppercase tracking-wider">
              <th className="px-4 py-3 font-medium">Invoice #</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Paid</th><th className="px-4 py-3 font-medium">Due</th><th className="px-4 py-3 font-medium">Due Date</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-4 py-3 font-medium text-[#0B1F3A]">{inv.invoice_number || '—'}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[inv.status] || 'bg-gray-100'}`}>{inv.status}</span></td>
                  <td className="px-4 py-3 font-semibold">{fmt(Number(inv.total) || 0)}</td>
                  <td className="px-4 py-3 text-green-600">{fmt(Number(inv.amount_paid) || 0)}</td>
                  <td className="px-4 py-3 text-[#F0A500] font-semibold">{fmt(Number(inv.amount_due) || 0)}</td>
                  <td className="px-4 py-3 text-[#9CA3AF]">{inv.due_date ? new Date(inv.due_date).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">New Invoice</h2>
            <div className="space-y-3">
              <input placeholder="Total Amount" type="number" value={form.total} onChange={e => setForm({...form, total: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <input type="date" value={form.due_date} onChange={e => setForm({...form, due_date: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <select value={form.payment_terms} onChange={e => setForm({...form, payment_terms: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option>Net 15</option><option>Net 30</option><option>Net 45</option><option>Net 60</option><option>Due on Receipt</option>
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
