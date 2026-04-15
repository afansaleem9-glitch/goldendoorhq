'use client';

import { useState } from 'react';
import { useApi } from '@/lib/hooks/useApi';
import {
  Wrench, MapPin, Calendar, Clock, CheckCircle2, AlertTriangle,
  Sun, Loader, Camera, FileText, Upload, ClipboardCheck, Truck,
} from 'lucide-react';

interface Solar { id: string; address: string; city: string; state: string; current_stage: string; system_size_kw: number; panel_count: number; contract_amount: number; created_at: string; }
interface Sched { id: string; title: string; start_time: string; end_time: string; location: string; entry_type: string; status: string; }

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const CHECKLIST = [
  { section: 'Pre-Install', items: ['Verify permit approval', 'Confirm equipment delivery', 'Review engineering plans', 'Confirm homeowner availability', 'Safety equipment check'] },
  { section: 'Installation', items: ['Roof condition assessment', 'Mounting rail installation', 'Panel placement & wiring', 'Inverter installation', 'Grounding & bonding'] },
  { section: 'Post-Install', items: ['System power-on test', 'Production verification', 'Clean up work area', 'Customer walkthrough', 'Upload completion photos'] },
];

export default function TechPortalPage() {
  const [tab, setTab] = useState('schedule');
  const { data: solar, loading: sL } = useApi<Solar>('/api/solar', { limit: 30 });
  const { data: schedule, loading: scL } = useApi<Sched>('/api/scheduling', { limit: 20 });

  const loading = sL || scL;

  const tabs = [
    { key: 'schedule', label: "Today's Jobs", icon: Calendar },
    { key: 'jobs', label: 'My Projects', icon: Wrench },
    { key: 'checklist', label: 'Inspection', icon: ClipboardCheck },
    { key: 'photos', label: 'Photos', icon: Camera },
    { key: 'docs', label: 'Documents', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#0B1F3A] text-white px-6 py-5">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><Wrench className="text-[#F0A500]" /> Tech Portal</h1>
            <p className="text-sm text-gray-300 mt-1">Jobs, inspections, and field operations</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-[#F0A500] text-[#0B1F3A] rounded-lg text-sm font-bold flex items-center gap-1"><Camera size={14} /> Upload Photos</button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
        {loading ? <div className="flex justify-center py-20"><Loader className="animate-spin text-gray-500" size={32} /></div> : (<>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <KPI icon={Calendar} color="text-blue-500" bg="bg-blue-50" label="Today's Jobs" value={String(schedule.length)} />
            <KPI icon={Wrench} color="text-[#F0A500]" bg="bg-[#F0A500]/10" label="Active Projects" value={String(solar.length)} />
            <KPI icon={CheckCircle2} color="text-emerald-500" bg="bg-emerald-50" label="Completed" value={String(solar.filter(s => s.current_stage === 'final_complete').length)} />
            <KPI icon={AlertTriangle} color="text-red-400" bg="bg-red-50" label="Inspections" value={String(solar.filter(s => s.current_stage === 'inspection').length)} />
          </div>

          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${tab === t.key ? 'bg-[#0B1F3A] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
                <t.icon size={14} /> {t.label}
              </button>
            ))}
          </div>

          {tab === 'schedule' && (<div className="space-y-3">
            <h2 className="text-lg font-bold text-[#0B1F3A]">Today&apos;s Schedule</h2>
            {schedule.length === 0 ? <Empty text="No jobs scheduled today" /> : schedule.map(s => (
              <div key={s.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#0B1F3A]">{s.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><MapPin size={11} />{s.location || 'TBD'}</span>
                      <span className="flex items-center gap-1"><Clock size={11} />{s.start_time ? new Date(s.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '—'}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${s.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : s.status === 'in_progress' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>{s.status}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 py-2 bg-[#007A67] text-white text-xs rounded-lg font-medium hover:bg-[#007A67]/90">Start Job</button>
                  <button className="flex-1 py-2 bg-gray-100 text-gray-600 text-xs rounded-lg font-medium hover:bg-gray-200">Navigate</button>
                </div>
              </div>
            ))}
          </div>)}

          {tab === 'jobs' && (<div className="space-y-3">
            <h2 className="text-lg font-bold text-[#0B1F3A]">Assigned Projects</h2>
            {solar.length === 0 ? <Empty text="No assigned projects" /> : solar.map(p => {
              const STAGES = ['ntp','site_survey','cad','permit_sub','permit_approval','install_schedule','inspection','final_complete'];
              const idx = STAGES.indexOf(p.current_stage);
              const pct = idx >= 0 ? ((idx + 1) / STAGES.length) * 100 : 10;
              return (<div key={p.id} className="card hover:shadow-md transition">
                <div className="flex items-center justify-between mb-2">
                  <div><p className="text-sm font-bold text-[#0B1F3A]">{p.address || 'Project'}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={10} />{[p.city, p.state].filter(Boolean).join(', ')}</p></div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">{(p.current_stage || '').replace(/_/g, ' ')}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-2"><div className="h-2 rounded-full bg-[#F0A500] transition-all" style={{ width: `${pct}%` }} /></div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div><p className="text-gray-500">System</p><p className="font-bold">{p.system_size_kw || 0} kW</p></div>
                  <div><p className="text-gray-500">Panels</p><p className="font-bold">{p.panel_count || 0}</p></div>
                  <div><p className="text-gray-500">Value</p><p className="font-bold text-[#F0A500]">{fmt(Number(p.contract_amount) || 0)}</p></div>
                </div>
              </div>);})}
          </div>)}

          {tab === 'checklist' && (<div className="space-y-4">
            <h2 className="text-lg font-bold text-[#0B1F3A]">Inspection Checklist</h2>
            {CHECKLIST.map(section => (
              <div key={section.section} className="card">
                <h3 className="text-sm font-bold text-[#0B1F3A] mb-3">{section.section}</h3>
                <div className="space-y-2">
                  {section.items.map(item => (
                    <label key={item} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-[#007A67] focus:ring-[#007A67]" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>)}

          {tab === 'photos' && (
            <div className="card border-l-4 border-amber-500 text-center py-12">
              <Camera size={48} className="mx-auto text-amber-400 mb-3" />
              <h3 className="text-lg font-bold text-[#0B1F3A]">CompanyCam Integration</h3>
              <p className="text-sm text-gray-500 mt-2">Install photos with timestamps from CompanyCam</p>
              <button className="mt-4 px-4 py-2 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600 flex items-center gap-1 mx-auto"><Upload size={14} /> Upload Photos</button>
            </div>
          )}

          {tab === 'docs' && (
            <div className="card border-l-4 border-blue-500 text-center py-12">
              <FileText size={48} className="mx-auto text-blue-400 mb-3" />
              <h3 className="text-lg font-bold text-[#0B1F3A]">Job Documents</h3>
              <p className="text-sm text-gray-500 mt-2">Work orders, permits, engineering docs, and inspection forms</p>
              <p className="text-xs text-gray-300 mt-1">Documents will appear here when linked to your assigned projects</p>
            </div>
          )}
        </>)}
      </div>
    </div>
  );
}

function KPI({ icon: Icon, color, bg, label, value }: { icon: typeof Wrench; color: string; bg: string; label: string; value: string }) {
  return (<div className="card flex items-center gap-3">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bg}`}><Icon className={`w-5 h-5 ${color}`} /></div>
    <div><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-bold text-[#0B1F3A]">{value}</p></div>
  </div>);
}

function Empty({ text }: { text: string }) {
  return <div className="card text-center py-12 text-gray-500"><p>{text}</p></div>;
}
