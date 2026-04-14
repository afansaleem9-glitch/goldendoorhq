'use client';

import { useState } from 'react';
import { useApi } from '@/lib/hooks/useApi';
import { ScheduleEntry } from '@/lib/types';
import { Calendar, Plus, Search, MapPin, Clock, Loader, ChevronLeft, ChevronRight } from 'lucide-react';

const typeBadge: Record<string, string> = { install: 'bg-green-100 text-green-700', survey: 'bg-blue-100 text-blue-700', inspection: 'bg-purple-100 text-purple-700', delivery: 'bg-yellow-100 text-yellow-700', maintenance: 'bg-orange-100 text-orange-700', consultation: 'bg-pink-100 text-pink-700' };
const statusBadge: Record<string, string> = { scheduled: 'bg-blue-100 text-blue-700', in_progress: 'bg-yellow-100 text-yellow-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700', rescheduled: 'bg-orange-100 text-orange-700' };

export default function SchedulingPage() {
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', entry_type: 'install', scheduled_date: '', start_time: '08:00', end_time: '17:00', address: '', city: '', state: 'TX' });

  const { data: entries, loading, error, total, create } = useApi<ScheduleEntry>('/api/scheduling', { limit: 100, search });

  const handleCreate = async () => {
    try { await create(form); setShowCreate(false); } catch (e) { alert(e instanceof Error ? e.message : 'Error'); }
  };

  const upcoming = entries.filter(e => e.status === 'scheduled' || e.status === 'in_progress').sort((a, b) => a.scheduled_date?.localeCompare(b.scheduled_date || '') || 0);

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-[#0B1F3A] flex items-center gap-2"><Calendar className="text-[#F0A500]" /> Scheduling</h1><p className="text-sm text-[#9CA3AF]">{total} entries · {upcoming.length} upcoming</p></div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Schedule</button>
      </div>
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search schedule..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#F0A500]/30 focus:border-[#F0A500] outline-none" />
      </div>
      {loading ? <div className="flex items-center justify-center py-20"><Loader className="animate-spin text-gray-400" size={32} /></div>
      : error ? <div className="text-red-500 text-sm">{error}</div>
      : entries.length === 0 ? (
        <div className="card text-center py-20 text-gray-400"><Calendar size={48} className="mx-auto mb-3 opacity-40" /><p className="font-medium">No scheduled entries</p></div>
      ) : (
        <div className="space-y-2">
          {entries.map(e => (
            <div key={e.id} className="card flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-center shrink-0 w-14">
                <p className="text-xs text-[#9CA3AF] uppercase">{e.scheduled_date ? new Date(e.scheduled_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' }) : '—'}</p>
                <p className="text-2xl font-bold text-[#0B1F3A]">{e.scheduled_date ? new Date(e.scheduled_date + 'T00:00:00').getDate() : '—'}</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0B1F3A]">{e.title}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-[#9CA3AF]">
                  {e.start_time && <span className="flex items-center gap-1"><Clock size={10} />{e.start_time}–{e.end_time}</span>}
                  {e.address && <span className="flex items-center gap-1"><MapPin size={10} />{[e.address, e.city, e.state].filter(Boolean).join(', ')}</span>}
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeBadge[e.entry_type] || 'bg-gray-100'}`}>{e.entry_type}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[e.status] || 'bg-gray-100'}`}>{e.status}</span>
            </div>
          ))}
        </div>
      )}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">New Schedule Entry</h2>
            <div className="space-y-3">
              <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <select value={form.entry_type} onChange={e => setForm({...form, entry_type: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm">
                {['install','survey','inspection','delivery','maintenance','consultation'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <input type="date" value={form.scheduled_date} onChange={e => setForm({...form, scheduled_date: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <div className="grid grid-cols-2 gap-2">
                <input type="time" value={form.start_time} onChange={e => setForm({...form, start_time: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" />
                <input type="time" value={form.end_time} onChange={e => setForm({...form, end_time: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" />
              </div>
              <input placeholder="Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
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
