'use client';

import { useState } from 'react';
import { useApi } from '@/lib/hooks/useApi';
import { Contract } from '@/lib/types';
import { FileText, Plus, Search, Loader } from 'lucide-react';

function fmt(n: number) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n); }
const statusBadge: Record<string, string> = { draft: 'bg-gray-100 text-gray-700', sent: 'bg-blue-100 text-blue-700', signed: 'bg-green-100 text-green-700', active: 'bg-emerald-100 text-emerald-700', completed: 'bg-teal-100 text-teal-700', cancelled: 'bg-red-100 text-red-700', voided: 'bg-gray-100 text-gray-500' };

export default function ContractsPage() {
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', contract_type: 'solar_install', contract_amount: '' });

  const { data: contracts, loading, error, total, create } = useApi<Contract>('/api/contracts', { limit: 50, search });

  const handleCreate = async () => {
    try { await create({ ...form, contract_amount: parseFloat(form.contract_amount) || 0 }); setShowCreate(false); }
    catch (e) { alert(e instanceof Error ? e.message : 'Error'); }
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-[#0B1F3A]">Contracts</h1><p className="text-sm text-[#9CA3AF]">{total} contracts</p></div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> New Contract</button>
      </div>
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search contracts..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#F0A500]/30 focus:border-[#F0A500] outline-none" />
      </div>
      <div className="card overflow-hidden p-0">
        {loading ? <div className="flex items-center justify-center py-20"><Loader className="animate-spin text-gray-400" size={32} /></div>
        : error ? <div className="text-red-500 text-sm p-6">{error}</div>
        : contracts.length === 0 ? (
          <div className="text-center py-20 text-gray-400"><FileText size={48} className="mx-auto mb-3 opacity-40" /><p className="font-medium">No contracts yet</p></div>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-left text-[#9CA3AF] text-xs uppercase tracking-wider">
              <th className="px-4 py-3 font-medium">Contract</th><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Amount</th><th className="px-4 py-3 font-medium">Start</th><th className="px-4 py-3 font-medium">End</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {contracts.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-4 py-3"><p className="font-medium text-[#0B1F3A]">{c.title || c.contract_number || '—'}</p></td>
                  <td className="px-4 py-3 text-[#6B7280]">{c.contract_type?.replace('_',' ')}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[c.status] || 'bg-gray-100'}`}>{c.status}</span></td>
                  <td className="px-4 py-3 font-semibold text-[#F0A500]">{c.contract_amount ? fmt(Number(c.contract_amount)) : '—'}</td>
                  <td className="px-4 py-3 text-[#9CA3AF]">{c.start_date ? new Date(c.start_date).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3 text-[#9CA3AF]">{c.end_date ? new Date(c.end_date).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">New Contract</h2>
            <div className="space-y-3">
              <input placeholder="Contract Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <select value={form.contract_type} onChange={e => setForm({...form, contract_type: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm">
                {['solar_install','smart_home','roofing','monitoring','maintenance'].map(t => <option key={t} value={t}>{t.replace('_',' ')}</option>)}
              </select>
              <input placeholder="Amount" type="number" value={form.contract_amount} onChange={e => setForm({...form, contract_amount: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
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
