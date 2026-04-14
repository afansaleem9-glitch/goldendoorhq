'use client';

import { useState } from 'react';
import { useApi } from '@/lib/hooks/useApi';
import {
  DollarSign, Target, CheckCircle2, Sun, Calendar, Loader,
  TrendingUp, Zap, BarChart3, Clock,
} from 'lucide-react';

interface Deal { id: string; name: string; stage_name: string; amount: number; deal_type: string; close_date: string; is_won: boolean; is_lost: boolean; created_at: string; }
interface Task { id: string; title: string; status: string; priority: string; due_date: string; created_at: string; }
interface Solar { id: string; address: string; city: string; state: string; current_stage: string; system_size_kw: number; panel_count: number; contract_amount: number; }
interface Sched { id: string; title: string; start_time: string; end_time: string; location: string; entry_type: string; status: string; }

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—';

export default function RepPortalPage() {
  const [tab, setTab] = useState('pipeline');
  const { data: deals, loading: dL } = useApi<Deal>('/api/deals', { limit: 50 });
  const { data: tasks, loading: tL } = useApi<Task>('/api/tasks', { limit: 50 });
  const { data: solar, loading: sL } = useApi<Solar>('/api/solar', { limit: 20 });
  const { data: schedule, loading: scL } = useApi<Sched>('/api/scheduling', { limit: 20 });

  const loading = dL || tL || sL || scL;
  const openDeals = deals.filter(d => !d.is_won && !d.is_lost);
  const wonDeals = deals.filter(d => d.is_won);
  const pipelineVal = openDeals.reduce((s, d) => s + (Number(d.amount) || 0), 0);
  const wonRev = wonDeals.reduce((s, d) => s + (Number(d.amount) || 0), 0);
  const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress');

  const tabs = [
    { key: 'pipeline', label: 'My Pipeline', icon: Target },
    { key: 'tasks', label: 'My Tasks', icon: CheckCircle2 },
    { key: 'solar', label: 'Solar Projects', icon: Sun },
    { key: 'schedule', label: 'Schedule', icon: Calendar },
    { key: 'commissions', label: 'Commissions', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#0B1F3A] text-white px-6 py-5">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><Zap className="text-[#F0A500]" /> Sales Rep Portal</h1>
            <p className="text-sm text-gray-300 mt-1">Pipeline, tasks, and performance</p>
          </div>
          <button className="px-3 py-1.5 bg-[#F0A500] text-[#0B1F3A] rounded-lg text-sm font-bold">+ New Deal</button>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
        {loading ? <div className="flex justify-center py-20"><Loader className="animate-spin text-gray-400" size={32} /></div> : (<>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <KPI icon={Target} color="text-[#F0A500]" bg="bg-[#F0A500]/10" label="Pipeline" value={fmt(pipelineVal)} />
            <KPI icon={TrendingUp} color="text-emerald-500" bg="bg-emerald-50" label="Won Revenue" value={fmt(wonRev)} />
            <KPI icon={DollarSign} color="text-[#7C5CBF]" bg="bg-purple-50" label="Open Deals" value={String(openDeals.length)} />
            <KPI icon={CheckCircle2} color="text-blue-500" bg="bg-blue-50" label="Pending Tasks" value={String(pendingTasks.length)} />
            <KPI icon={Sun} color="text-amber-500" bg="bg-amber-50" label="Solar" value={String(solar.length)} />
          </div>
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${tab === t.key ? 'bg-[#0B1F3A] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
                <t.icon size={14} /> {t.label}
              </button>
            ))}
          </div>
          {tab === 'pipeline' && (<div className="space-y-3">
            {openDeals.length === 0 ? <Empty text="No open deals" /> : openDeals.map(d => (
              <div key={d.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-bold text-[#0B1F3A]">{d.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">{d.stage_name}</span>
                      <span className="text-xs text-gray-400">{d.deal_type}</span>
                    </div></div>
                  <div className="text-right"><p className="text-lg font-bold text-[#F0A500]">{fmt(Number(d.amount))}</p>
                    {d.close_date && <p className="text-xs text-gray-400">Close: {fmtDate(d.close_date)}</p>}</div>
                </div></div>))}
            {wonDeals.length > 0 && (<>
              <h3 className="text-sm font-bold text-emerald-600 mt-6">Won ({wonDeals.length})</h3>
              {wonDeals.slice(0, 5).map(d => (
                <div key={d.id} className="card border-l-4 border-emerald-500 opacity-80">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#0B1F3A]">{d.name}</p>
                    <p className="font-bold text-emerald-600">{fmt(Number(d.amount))}</p></div></div>))}
            </>)}
          </div>)}
          {tab === 'tasks' && (<div className="space-y-2">
            {tasks.length === 0 ? <Empty text="No tasks" /> : tasks.map(t => {
              const overdue = t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed';
              return (<div key={t.id} className={`card hover:shadow-md transition ${overdue ? 'border-l-4 border-red-400' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${t.status === 'completed' ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'}`}>
                      {t.status === 'completed' ? <CheckCircle2 size={14} className="text-white" /> : null}</div>
                    <div><p className={`text-sm font-medium ${t.status === 'completed' ? 'line-through text-gray-400' : 'text-[#0B1F3A]'}`}>{t.title}</p>
                      <p className="text-xs text-gray-400">{t.priority} priority</p></div></div>
                  <span className={`text-xs ${overdue ? 'text-red-500 font-bold' : 'text-gray-400'}`}>{t.due_date ? fmtDate(t.due_date) : 'No date'}</span>
                </div></div>);})}
          </div>)}
          {tab === 'solar' && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {solar.length === 0 ? <Empty text="No solar projects" /> : solar.map(p => (
              <div key={p.id} className="card hover:shadow-md transition">
                <div className="flex items-center justify-between mb-2">
                  <div><p className="text-sm font-bold text-[#0B1F3A]">{p.address || 'Solar Project'}</p><p className="text-xs text-gray-400">{[p.city, p.state].filter(Boolean).join(', ')}</p></div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">{(p.current_stage || '').replace(/_/g, ' ')}</span></div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs mt-3">
                  <div><p className="text-gray-400">System</p><p className="font-bold">{p.system_size_kw || 0} kW</p></div>
                  <div><p className="text-gray-400">Panels</p><p className="font-bold">{p.panel_count || 0}</p></div>
                  <div><p className="text-gray-400">Value</p><p className="font-bold text-[#F0A500]">{fmt(Number(p.contract_amount) || 0)}</p></div>
                </div></div>))}
          </div>)}
          {tab === 'schedule' && (<div className="space-y-2">
            {schedule.length === 0 ? <Empty text="No upcoming appointments" /> : schedule.map(s => (
              <div key={s.id} className="card hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-bold text-[#0B1F3A]">{s.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.location || 'No location'} · {s.entry_type}</p></div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-[#007A67]">{s.start_time ? new Date(s.start_time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—'}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${s.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>{s.status}</span>
                  </div></div></div>))}
          </div>)}
          {tab === 'commissions' && (
            <div className="card border-l-4 border-[#F0A500] text-center py-12">
              <BarChart3 size={48} className="mx-auto text-[#F0A500] mb-3" />
              <h3 className="text-lg font-bold text-[#0B1F3A]">Commission Tracking</h3>
              <p className="text-sm text-gray-400 mt-2">Real-time commission calculations coming soon</p>
            </div>)}
        </>)}
      </div>
    </div>
  );
}

function KPI({ icon: Icon, color, bg, label, value }: { icon: typeof DollarSign; color: string; bg: string; label: string; value: string }) {
  return (<div className="card flex items-center gap-3">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bg}`}><Icon className={`w-5 h-5 ${color}`} /></div>
    <div><p className="text-xs text-gray-400">{label}</p><p className="text-lg font-bold text-[#0B1F3A]">{value}</p></div>
  </div>);
}

function Empty({ text }: { text: string }) {
  return <div className="card text-center py-12 text-gray-400"><p>{text}</p></div>;
}
