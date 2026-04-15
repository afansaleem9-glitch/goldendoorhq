'use client';

import { useState } from 'react';
import { useApi } from '@/lib/hooks/useApi';
import { Company } from '@/lib/types';
import { Search, Plus, Building2, Globe, Loader, ChevronLeft, ChevronRight } from 'lucide-react';

const typeBadge: Record<string, string> = {
  prospect: 'bg-blue-100 text-blue-700', customer: 'bg-green-100 text-green-700', partner: 'bg-purple-100 text-purple-700',
  vendor: 'bg-yellow-100 text-yellow-700', competitor: 'bg-red-100 text-red-700',
};

function fmt(n: number) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n); }

export default function CompaniesPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', domain: '', industry: '', type: 'prospect', phone: '' });

  const { data: companies, loading, error, total, create } = useApi<Company>('/api/companies', { page, limit: 25, search });

  const handleCreate = async () => {
    try { await create(form); setShowCreate(false); setForm({ name: '', domain: '', industry: '', type: 'prospect', phone: '' }); }
    catch (e) { alert(e instanceof Error ? e.message : 'Error'); }
  };

  const totalPages = Math.ceil(total / 25) || 1;

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-[#0B1F3A]">Companies</h1><p className="text-sm text-[#9CA3AF]">{total} total</p></div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Company</button>
      </div>
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input type="text" placeholder="Search companies..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#F0A500]/30 focus:border-[#F0A500] outline-none" />
      </div>
      <div className="card overflow-hidden p-0">
        {loading ? <div className="flex items-center justify-center py-20"><Loader className="animate-spin text-gray-500" size={32} /></div>
        : error ? <div className="text-red-500 text-sm p-6">{error}</div>
        : companies.length === 0 ? (
          <div className="text-center py-20 text-gray-500"><Building2 size={48} className="mx-auto mb-3 opacity-40" /><p className="font-medium">No companies found</p></div>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-left text-[#9CA3AF] text-xs uppercase tracking-wider">
              <th className="px-4 py-3 font-medium">Name</th><th className="px-4 py-3 font-medium">Industry</th><th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Revenue</th><th className="px-4 py-3 font-medium">Location</th><th className="px-4 py-3 font-medium">Website</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {companies.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="px-4 py-3 font-medium text-[#0B1F3A]">{c.name}</td>
                  <td className="px-4 py-3 text-[#6B7280]">{c.industry || '—'}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeBadge[c.type] || 'bg-gray-100 text-gray-700'}`}>{c.type}</span></td>
                  <td className="px-4 py-3 text-[#6B7280]">{c.annual_revenue ? fmt(c.annual_revenue) : '—'}</td>
                  <td className="px-4 py-3 text-[#6B7280]">{[c.city, c.state].filter(Boolean).join(', ') || '—'}</td>
                  <td className="px-4 py-3">{c.domain ? <span className="text-blue-600 flex items-center gap-1"><Globe size={12} />{c.domain}</span> : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {totalPages > 1 && (
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
            <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">New Company</h2>
            <div className="space-y-3">
              <input placeholder="Company Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Domain (e.g. acme.com)" value={form.domain} onChange={e => setForm({...form, domain: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Industry" value={form.industry} onChange={e => setForm({...form, industry: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm">
                {['prospect','customer','partner','vendor','competitor','other'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
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
