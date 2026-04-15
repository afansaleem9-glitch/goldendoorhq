'use client';

import { useEffect, useState } from 'react';
import { supabase, ORG_ID } from '@/lib/supabase';
import { SOLAR_STAGES } from '@/lib/types';
import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp, Users, Zap, DollarSign, Activity, Plus, Send, Settings,
  Calendar, ArrowUp, ArrowDown, FileText, Ticket, Sun, ClipboardList,
  Award, Target, MapPin, Clock, CheckCircle
} from 'lucide-react';

function fmt(n: number) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n); }

const COLORS = ['#F0A500', '#007A67', '#7C5CBF', '#0B1F3A', '#E8A838', '#2DA87E', '#9B7DD4', '#3D5A80'];

const MOCK_REPS = [
  { name: 'Marcus Johnson', projects: 12, ntps: 8, installs: 5, pipeline: 287400, rate: 62 },
  { name: 'Sarah Chen', projects: 15, ntps: 11, installs: 7, pipeline: 342800, rate: 73 },
  { name: 'David Park', projects: 9, ntps: 6, installs: 4, pipeline: 198500, rate: 67 },
  { name: 'James Wright', projects: 7, ntps: 4, installs: 3, pipeline: 156200, rate: 57 },
  { name: 'Emily Rodriguez', projects: 11, ntps: 9, installs: 6, pipeline: 276300, rate: 81 },
  { name: 'Tyler Brooks', projects: 8, ntps: 5, installs: 3, pipeline: 189700, rate: 63 },
];

const MOCK_ACTIVITY = [
  { id: '1', project: 'Garcia — 4521 Maple Creek', action: 'Stage moved to Permit Approval', rep: 'Marcus Johnson', time: '12 min ago' },
  { id: '2', project: 'Williams — 9102 Sunset Ridge', action: 'Site survey completed', rep: 'Sarah Chen', time: '34 min ago' },
  { id: '3', project: 'Thompson — 305 Birchwood', action: 'CAD design uploaded', rep: 'David Park', time: '1h ago' },
  { id: '4', project: 'Martinez — 7788 Willow Bend', action: 'Welcome call completed', rep: 'Marcus Johnson', time: '2h ago' },
  { id: '5', project: 'Henderson — 1400 Pine Valley', action: 'NTP received from lender', rep: 'James Wright', time: '2h ago' },
  { id: '6', project: 'Baker — 2233 Oakmont Blvd', action: 'Install scheduled for 04/22', rep: 'Sarah Chen', time: '3h ago' },
  { id: '7', project: 'Nguyen — 890 Elmhurst Rd', action: 'Permit submitted to AHJ', rep: 'David Park', time: '4h ago' },
  { id: '8', project: 'Davis — 5544 River Oaks', action: 'Interconnection PTO approved', rep: 'Marcus Johnson', time: '5h ago' },
];

const MOCK_FINANCE = [
  { company: 'GoodLeap', count: 24, value: 892000 },
  { company: 'Mosaic', count: 14, value: 518000 },
  { company: 'Cash', count: 8, value: 412000 },
  { company: 'Sunrun PPA', count: 6, value: 198000 },
  { company: 'Enfin', count: 4, value: 152000 },
  { company: 'Credit Human', count: 3, value: 118000 },
];

export default function SolarDashboard() {
  const [loading, setLoading] = useState(true);
  const [projectCount, setProjectCount] = useState(0);
  const [pipelineValue, setPipelineValue] = useState(0);
  const [stageCounts, setStageCounts] = useState<{stage: string; count: number; color: string}[]>([]);
  const [sortKey, setSortKey] = useState<string>('pipeline');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from('solar_projects')
          .select('id, current_stage, contract_amount')
          .eq('organization_id', ORG_ID);
        if (!error && data) {
          setProjectCount(data.length);
          setPipelineValue(data.reduce((s, p) => s + (p.contract_amount || 0), 0));
          const counts: Record<string, number> = {};
          data.forEach(p => { counts[p.current_stage] = (counts[p.current_stage] || 0) + 1; });
          setStageCounts(SOLAR_STAGES.map(s => ({ stage: s.label, count: counts[s.key] || 0, color: s.color })));
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    load();
  }, []);

  const sortedReps = [...MOCK_REPS].sort((a, b) => {
    const av = sortKey === 'name' ? a.name : sortKey === 'projects' ? a.projects : sortKey === 'ntps' ? a.ntps : sortKey === 'installs' ? a.installs : sortKey === 'rate' ? a.rate : a.pipeline;
    const bv = sortKey === 'name' ? b.name : sortKey === 'projects' ? b.projects : sortKey === 'ntps' ? b.ntps : sortKey === 'installs' ? b.installs : sortKey === 'rate' ? b.rate : b.pipeline;
    if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
    return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
  });

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const ntpThisMonth = 14;
  const installsComplete = 8;
  const docsPending = 6;
  const ticketsOpen = 3;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B1F3A] via-[#132d4f] to-[#0B1F3A]">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Sun className="text-[#F0A500]" size={28} />
                <h1 className="text-3xl font-bold text-white">Solar Pipeline Dashboard</h1>
              </div>
              <p className="text-blue-200/70 text-sm">Real-time overview of your solar project pipeline and team performance</p>
            </div>
            <div className="flex gap-3">
              <Link href="/solar/contracts/generate" className="bg-[#F0A500] hover:bg-[#d4920a] text-[#0B1F3A] font-semibold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-colors">
                <FileText size={16} /> Generate Contract
              </Link>
              <Link href="/solar/work-queue" className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-colors border border-white/20">
                <ClipboardList size={16} /> Work Queue
              </Link>
              <Link href="/solar" className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-colors border border-white/20">
                <Target size={16} /> Projects
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {[
            { label: 'Total Projects', value: loading ? '...' : projectCount.toString(), icon: Target, change: 12, color: '#0B1F3A' },
            { label: 'Pipeline Value', value: loading ? '...' : fmt(pipelineValue), icon: DollarSign, change: 18, color: '#F0A500' },
            { label: 'NTP This Month', value: ntpThisMonth.toString(), icon: Zap, change: 24, color: '#007A67' },
            { label: 'Installs Complete', value: installsComplete.toString(), icon: CheckCircle, change: 8, color: '#7C5CBF' },
            { label: 'Docs Pending', value: docsPending.toString(), icon: FileText, change: -15, color: '#E8A838' },
            { label: 'Tickets Open', value: ticketsOpen.toString(), icon: Ticket, change: -33, color: '#DC2626' },
          ].map(kpi => (
            <div key={kpi.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: kpi.color + '12' }}>
                  <kpi.icon size={18} style={{ color: kpi.color }} />
                </div>
                <div className={`flex items-center gap-0.5 text-xs font-semibold ${kpi.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {kpi.change >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                  {Math.abs(kpi.change)}%
                </div>
              </div>
              <p className="text-xl font-bold text-[#0B1F3A]">{kpi.value}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Stage Pipeline Bar */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6 shadow-sm">
          <h2 className="text-sm font-bold text-[#0B1F3A] mb-4 uppercase tracking-wider">Pipeline by Stage</h2>
          {loading ? (
            <div className="h-10 bg-gray-100 rounded-full animate-pulse" />
          ) : (
            <>
              <div className="flex rounded-full overflow-hidden h-8 mb-3">
                {stageCounts.filter(s => s.count > 0).map((s, i) => (
                  <div key={s.stage} className="relative group flex items-center justify-center text-[10px] font-bold text-white transition-all hover:opacity-90"
                    style={{ width: `${Math.max((s.count / Math.max(projectCount, 1)) * 100, 3)}%`, backgroundColor: SOLAR_STAGES[i]?.color || '#666' }}>
                    {s.count}
                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-[#0B1F3A] text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                      {s.stage}: {s.count} projects
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {stageCounts.filter(s => s.count > 0).map((s, i) => (
                  <div key={s.stage} className="flex items-center gap-1.5 text-[11px] text-gray-600">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SOLAR_STAGES[i]?.color || '#666' }} />
                    {s.stage} ({s.count})
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <Activity size={18} className="text-[#007A67]" />
              <h2 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider">Recent Activity</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {MOCK_ACTIVITY.map(a => (
                <div key={a.id} className="px-5 py-3 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#0B1F3A]">{a.project}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{a.action}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-[11px] text-gray-400">{a.time}</p>
                      <p className="text-[11px] text-[#007A67] font-medium">{a.rep}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Finance Company Breakdown */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider">Finance Companies</h2>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={MOCK_FINANCE} dataKey="count" nameKey="company" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3}>
                    {MOCK_FINANCE.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any, name: any) => [`${v} projects`, name]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {MOCK_FINANCE.map((f, i) => (
                  <div key={f.company} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      <span className="text-gray-700 font-medium">{f.company}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500">{f.count} deals</span>
                      <span className="font-semibold text-[#0B1F3A]">{fmt(f.value)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rep Performance Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Award size={18} className="text-[#F0A500]" />
            <h2 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider">Rep Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {[
                    { key: 'name', label: 'Rep Name' },
                    { key: 'projects', label: 'Projects' },
                    { key: 'ntps', label: 'NTPs' },
                    { key: 'installs', label: 'Installs' },
                    { key: 'pipeline', label: 'Pipeline Value' },
                    { key: 'rate', label: 'Conversion' },
                  ].map(col => (
                    <th key={col.key} onClick={() => handleSort(col.key)}
                      className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-[#0B1F3A] transition-colors">
                      {col.label} {sortKey === col.key && (sortDir === 'asc' ? '↑' : '↓')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sortedReps.map((rep, i) => (
                  <tr key={rep.name} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0B1F3A] to-[#007A67] flex items-center justify-center text-white text-xs font-bold">
                          {rep.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-semibold text-[#0B1F3A]">{rep.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-700">{rep.projects}</td>
                    <td className="px-5 py-3 text-gray-700">{rep.ntps}</td>
                    <td className="px-5 py-3 text-gray-700">{rep.installs}</td>
                    <td className="px-5 py-3 font-semibold text-[#0B1F3A]">{fmt(rep.pipeline)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${rep.rate}%`, backgroundColor: rep.rate >= 70 ? '#007A67' : rep.rate >= 50 ? '#F0A500' : '#DC2626' }} />
                        </div>
                        <span className="text-xs font-semibold" style={{ color: rep.rate >= 70 ? '#007A67' : rep.rate >= 50 ? '#F0A500' : '#DC2626' }}>{rep.rate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { href: '/solar', label: 'Add New Project', icon: Plus, color: '#007A67' },
            { href: '/solar/contracts/generate', label: 'Generate Contract', icon: FileText, color: '#F0A500' },
            { href: '/solar/work-queue', label: 'View Work Queue', icon: ClipboardList, color: '#7C5CBF' },
            { href: '/solar/leads', label: 'Import Leads', icon: Users, color: '#0B1F3A' },
          ].map(a => (
            <Link key={a.label} href={a.href} className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center transition-colors" style={{ backgroundColor: a.color + '12' }}>
                <a.icon size={20} style={{ color: a.color }} className="group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-sm font-semibold text-[#0B1F3A]">{a.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
