'use client';

import { useState } from 'react';
import { useApi } from '@/lib/hooks/useApi';
import { SolarProject, SOLAR_STAGES } from '@/lib/types';
import { Sun, Search, Plus, Loader, MapPin, DollarSign, Zap, ChevronRight } from 'lucide-react';

function fmt(n: number) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n); }

export default function SolarPage() {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ address: '', city: '', state: 'TX', zip: '', system_size_kw: '', panel_count: '', contract_amount: '', financing_type: 'loan', current_stage: 'ntp' });

  const { data: projects, loading, error, total, create } = useApi<SolarProject>('/api/solar', {
    limit: 100, search, filters: stageFilter ? { current_stage: stageFilter } : {},
  });

  const handleCreate = async () => {
    try {
      await create({ ...form, system_size_kw: parseFloat(form.system_size_kw) || 0, panel_count: parseInt(form.panel_count) || 0, contract_amount: parseFloat(form.contract_amount) || 0 });
      setShowCreate(false);
    } catch (e) { alert(e instanceof Error ? e.message : 'Error'); }
  };

  // Stage summary
  const stageCounts: Record<string, number> = {};
  projects.forEach(p => { stageCounts[p.current_stage] = (stageCounts[p.current_stage] || 0) + 1; });

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F3A] flex items-center gap-2"><Sun className="text-[#F0A500]" size={28} /> Solar Pipeline</h1>
          <p className="text-sm text-[#9CA3AF]">{total} projects · {fmt(projects.reduce((s, p) => s + (Number(p.contract_amount) || 0), 0))} total value</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> New Project</button>
      </div>

      {/* Stage Pipeline Bar */}
      <div className="card overflow-x-auto">
        <div className="flex gap-1 min-w-[900px]">
          {SOLAR_STAGES.map(s => {
            const count = stageCounts[s.key] || 0;
            const isActive = stageFilter === s.key;
            return (
              <button key={s.key} onClick={() => setStageFilter(isActive ? '' : s.key)}
                className={`flex-1 py-2 px-1 rounded-lg text-center transition-all ${isActive ? 'ring-2 ring-offset-1' : 'hover:opacity-80'}`}
                style={{ background: s.color + '20', color: s.color, '--tw-ring-color': s.color } as React.CSSProperties}>
                <p className="text-lg font-bold">{count}</p>
                <p className="text-[10px] font-medium truncate">{s.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#F0A500]/30 focus:border-[#F0A500] outline-none" />
      </div>

      {/* Projects Grid */}
      {loading ? <div className="flex items-center justify-center py-20"><Loader className="animate-spin text-gray-400" size={32} /></div>
      : error ? <div className="text-red-500 text-sm">{error}</div>
      : projects.length === 0 ? (
        <div className="card text-center py-20 text-gray-400"><Sun size={48} className="mx-auto mb-3 opacity-40" /><p className="font-medium">No solar projects yet</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map(p => {
            const stage = SOLAR_STAGES.find(s => s.key === p.current_stage);
            const stageIdx = SOLAR_STAGES.findIndex(s => s.key === p.current_stage);
            const progress = ((stageIdx + 1) / SOLAR_STAGES.length) * 100;
            return (
              <div key={p.id} className="card hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-[#0B1F3A]">{p.address || 'No address'}</p>
                    <p className="text-xs text-[#9CA3AF] flex items-center gap-1"><MapPin size={10} />{[p.city, p.state].filter(Boolean).join(', ') || '—'}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: (stage?.color || '#666') + '20', color: stage?.color || '#666' }}>
                    {stage?.label || p.current_stage}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                  <div className="h-1.5 rounded-full transition-all" style={{ width: `${progress}%`, background: stage?.color || '#666' }} />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div><p className="text-xs text-[#9CA3AF]">System</p><p className="text-sm font-semibold text-[#0B1F3A]">{p.system_size_kw ? `${p.system_size_kw} kW` : '—'}</p></div>
                  <div><p className="text-xs text-[#9CA3AF]">Panels</p><p className="text-sm font-semibold text-[#0B1F3A]">{p.panel_count || '—'}</p></div>
                  <div><p className="text-xs text-[#9CA3AF]">Value</p><p className="text-sm font-semibold text-[#F0A500]">{p.contract_amount ? fmt(Number(p.contract_amount)) : '—'}</p></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">New Solar Project</h2>
            <div className="space-y-3">
              <input placeholder="Street Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <div className="grid grid-cols-3 gap-2">
                <input placeholder="City" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" />
                <select value={form.state} onChange={e => setForm({...form, state: e.target.value})} className="border rounded-lg px-3 py-2 text-sm">
                  {['TX','OH','MI','CA','FL','AZ','NV','CO','NC','GA'].map(s => <option key={s}>{s}</option>)}
                </select>
                <input placeholder="ZIP" value={form.zip} onChange={e => setForm({...form, zip: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="System Size (kW)" type="number" value={form.system_size_kw} onChange={e => setForm({...form, system_size_kw: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" />
                <input placeholder="Panel Count" type="number" value={form.panel_count} onChange={e => setForm({...form, panel_count: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" />
              </div>
              <input placeholder="Contract Amount" type="number" value={form.contract_amount} onChange={e => setForm({...form, contract_amount: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <select value={form.financing_type} onChange={e => setForm({...form, financing_type: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm">
                {['cash','loan','lease','ppa'].map(f => <option key={f} value={f}>{f.toUpperCase()}</option>)}
              </select>
              <select value={form.current_stage} onChange={e => setForm({...form, current_stage: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm">
                {SOLAR_STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreate} className="btn-primary text-sm">Create Project</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
