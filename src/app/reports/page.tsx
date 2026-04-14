'use client';

import { useApi } from '@/lib/hooks/useApi';
import { Deal, Contact, Task, Ticket } from '@/lib/types';
import { BarChart3, Users, DollarSign, TrendingUp, Loader } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function fmt(n: number) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n); }
const COLORS = ['#0B1F3A', '#F0A500', '#007A67', '#7C5CBF', '#3B82F6', '#EF4444', '#10B981'];

export default function ReportsPage() {
  const { data: contacts, loading: cL } = useApi<Contact>('/api/contacts', { limit: 500 });
  const { data: deals, loading: dL } = useApi<Deal>('/api/deals', { limit: 500 });
  const { data: tasks, loading: tL } = useApi<Task>('/api/tasks', { limit: 500 });
  const { data: tickets, loading: tkL } = useApi<Ticket>('/api/tickets', { limit: 500 });

  const loading = cL || dL || tL || tkL;

  // Deal type breakdown
  const dealTypes: Record<string, number> = {};
  deals.forEach(d => { const t = d.deal_type || 'other'; dealTypes[t] = (dealTypes[t] || 0) + (Number(d.amount) || 0); });
  const dealTypeData = Object.entries(dealTypes).map(([name, value]) => ({ name, value }));

  // Stage breakdown
  const stageMap: Record<string, number> = {};
  deals.filter(d => !d.is_won && !d.is_lost).forEach(d => { const s = d.stage_name || 'Unknown'; stageMap[s] = (stageMap[s] || 0) + 1; });
  const stageData = Object.entries(stageMap).map(([stage, count]) => ({ stage, count }));

  // Lifecycle stages
  const lcMap: Record<string, number> = {};
  contacts.forEach(c => { const s = c.lifecycle_stage || 'lead'; lcMap[s] = (lcMap[s] || 0) + 1; });
  const lifecycleData = Object.entries(lcMap).map(([name, value]) => ({ name, value }));

  const wonRevenue = deals.filter(d => d.is_won).reduce((s, d) => s + (Number(d.amount) || 0), 0);
  const pipelineValue = deals.filter(d => !d.is_won && !d.is_lost).reduce((s, d) => s + (Number(d.amount) || 0), 0);

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#0B1F3A]">Reports & Analytics</h1>
      {loading ? <div className="flex items-center justify-center py-20"><Loader className="animate-spin text-gray-400" size={32} /></div> : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card"><p className="text-sm text-[#9CA3AF]">Total Contacts</p><p className="text-2xl font-bold text-[#0B1F3A]">{contacts.length}</p></div>
            <div className="card"><p className="text-sm text-[#9CA3AF]">Pipeline Value</p><p className="text-2xl font-bold text-[#F0A500]">{fmt(pipelineValue)}</p></div>
            <div className="card"><p className="text-sm text-[#9CA3AF]">Won Revenue</p><p className="text-2xl font-bold text-green-600">{fmt(wonRevenue)}</p></div>
            <div className="card"><p className="text-sm text-[#9CA3AF]">Open Tickets</p><p className="text-2xl font-bold text-[#0B1F3A]">{tickets.filter(t => t.status === 'open').length}</p></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="card">
              <h3 className="text-lg font-bold text-[#0B1F3A] mb-4">Deals by Stage</h3>
              {stageData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={stageData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="stage" tick={{ fontSize: 11 }} /><YAxis /><Tooltip /><Bar dataKey="count" fill="#0B1F3A" radius={[4,4,0,0]} /></BarChart>
                </ResponsiveContainer>
              ) : <p className="text-gray-400 text-sm text-center py-10">No deal data yet</p>}
            </div>
            <div className="card">
              <h3 className="text-lg font-bold text-[#0B1F3A] mb-4">Revenue by Deal Type</h3>
              {dealTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart><Pie data={dealTypeData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                    {dealTypeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie><Tooltip formatter={(v) => fmt(Number(v))} /></PieChart>
                </ResponsiveContainer>
              ) : <p className="text-gray-400 text-sm text-center py-10">No revenue data yet</p>}
            </div>
            <div className="card">
              <h3 className="text-lg font-bold text-[#0B1F3A] mb-4">Contact Lifecycle</h3>
              {lifecycleData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart><Pie data={lifecycleData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {lifecycleData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie><Tooltip /></PieChart>
                </ResponsiveContainer>
              ) : <p className="text-gray-400 text-sm text-center py-10">No contact data yet</p>}
            </div>
            <div className="card">
              <h3 className="text-lg font-bold text-[#0B1F3A] mb-4">Task Summary</h3>
              <div className="space-y-3">
                {['pending', 'in_progress', 'completed', 'cancelled'].map(s => {
                  const count = tasks.filter(t => t.status === s).length;
                  const pct = tasks.length > 0 ? (count / tasks.length) * 100 : 0;
                  return (
                    <div key={s}>
                      <div className="flex justify-between text-sm mb-1"><span className="text-[#6B7280]">{s.replace('_', ' ')}</span><span className="font-medium">{count}</span></div>
                      <div className="w-full bg-gray-100 rounded-full h-2"><div className="h-2 rounded-full bg-[#0B1F3A]" style={{ width: `${pct}%` }} /></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
