'use client';

import { useState } from 'react';
import { useApi } from '@/lib/hooks/useApi';
import { Contact } from '@/lib/types';
import Link from 'next/link';
import { Search, Plus, ChevronLeft, ChevronRight, Loader, User } from 'lucide-react';

const stageBadge: Record<string, string> = {
  subscriber: 'bg-gray-100 text-gray-700', lead: 'bg-blue-100 text-blue-700', mql: 'bg-purple-100 text-purple-700',
  sql: 'bg-indigo-100 text-indigo-700', opportunity: 'bg-yellow-100 text-yellow-700', customer: 'bg-green-100 text-green-700',
  evangelist: 'bg-pink-100 text-pink-700',
};

export default function ContactsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [stageFilter, setStageFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', lifecycle_stage: 'lead' });

  const { data: contacts, loading, error, total, create } = useApi<Contact>('/api/contacts', {
    page, limit: 25, search, filters: stageFilter ? { lifecycle_stage: stageFilter } : {},
  });

  const handleCreate = async () => {
    try { await create(form); setShowCreate(false); setForm({ first_name: '', last_name: '', email: '', phone: '', lifecycle_stage: 'lead' }); }
    catch (e) { alert(e instanceof Error ? e.message : 'Error'); }
  };

  const totalPages = Math.ceil(total / 25) || 1;

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-[#0B1F3A]">Contacts</h1><p className="text-sm text-[#9CA3AF]">{total} total</p></div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Contact</button>
      </div>
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search contacts..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#F0A500]/30 focus:border-[#F0A500] outline-none" />
        </div>
        <select value={stageFilter} onChange={e => { setStageFilter(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none">
          <option value="">All Stages</option>
          {['lead','mql','sql','opportunity','customer','subscriber','evangelist'].map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
        </select>
      </div>
      <div className="card overflow-hidden p-0">
        {loading ? <div className="flex items-center justify-center py-20"><Loader className="animate-spin text-gray-400" size={32} /></div>
        : error ? <div className="text-red-500 text-sm p-6">{error}</div>
        : contacts.length === 0 ? (
          <div className="text-center py-20 text-gray-400"><User size={48} className="mx-auto mb-3 opacity-40" /><p className="font-medium">No contacts found</p><p className="text-sm mt-1">Add your first contact to get started</p></div>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-left text-[#9CA3AF] text-xs uppercase tracking-wider">
              <th className="px-4 py-3 font-medium">Name</th><th className="px-4 py-3 font-medium">Email</th><th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Stage</th><th className="px-4 py-3 font-medium">Location</th><th className="px-4 py-3 font-medium">Added</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {contacts.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => window.location.href = `/contacts/${c.id}`}>
                  <td className="px-4 py-3 font-medium text-[#0B1F3A]"><Link href={`/contacts/${c.id}`} className="hover:text-[#007A67] hover:underline">{c.full_name || `${c.first_name || ''} ${c.last_name || ''}`.trim() || '—'}</Link></td>
                  <td className="px-4 py-3 text-[#6B7280]">{c.email || '—'}</td>
                  <td className="px-4 py-3 text-[#6B7280]">{c.phone || c.mobile || '—'}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${stageBadge[c.lifecycle_stage] || 'bg-gray-100 text-gray-700'}`}>{c.lifecycle_stage || 'lead'}</span></td>
                  <td className="px-4 py-3 text-[#6B7280]">{[c.city, c.state].filter(Boolean).join(', ') || '—'}</td>
                  <td className="px-4 py-3 text-[#9CA3AF]">{c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'}</td>
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
            <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">New Contact</h2>
            <div className="space-y-3">
              <input placeholder="First Name" value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Last Name" value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <select value={form.lifecycle_stage} onChange={e => setForm({...form, lifecycle_stage: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm">
                {['lead','mql','sql','opportunity','customer','subscriber'].map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
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
