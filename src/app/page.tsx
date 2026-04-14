'use client';

import { useApi } from '@/lib/hooks/useApi';
import {
  DollarSign, TrendingUp, Users, Target, Phone, Mail,
  Calendar, FileText, ArrowRight, CheckCircle, Clock, Loader
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

interface Contact { id: string; first_name: string; last_name: string; full_name: string; email: string; phone?: string; lifecycle_stage: string; }
interface Deal { id: string; name: string; amount: number; stage_name: string; is_won: boolean; is_lost: boolean; close_date?: string; }
interface Task { id: string; title: string; status: string; priority: string; due_date?: string; }
interface Ticket { id: string; subject: string; status: string; priority: string; created_at: string; }
interface Activity { id: string; activity_type: string; subject: string; body: string; created_at: string; }

const SkeletonCard = () => (
  <div className="card animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="h-4 w-24 bg-gray-200 rounded" />
      <div className="w-9 h-9 bg-gray-200 rounded-lg" />
    </div>
    <div className="h-8 w-32 bg-gray-200 rounded mb-2" />
    <div className="h-4 w-20 bg-gray-100 rounded" />
  </div>
);

export default function DashboardPage() {
  const { data: contacts, loading: cLoad } = useApi<Contact>('/api/contacts', { limit: 500 });
  const { data: deals, loading: dLoad } = useApi<Deal>('/api/deals', { limit: 500 });
  const { data: tasks, loading: tLoad } = useApi<Task>('/api/tasks', { limit: 100 });
  const { data: tickets, loading: tkLoad } = useApi<Ticket>('/api/tickets', { limit: 100 });
  const { data: activities, loading: aLoad } = useApi<Activity>('/api/contacts', { limit: 10 }); // activities table via contacts for now

  const loading = cLoad || dLoad || tLoad;

  // Compute KPIs from real data
  const openDeals = deals.filter(d => !d.is_won && !d.is_lost);
  const pipelineValue = openDeals.reduce((s, d) => s + (Number(d.amount) || 0), 0);
  const openTasks = tasks.filter(t => t.status !== 'completed' && t.status !== 'cancelled');
  const openTickets = tickets.filter(t => t.status !== 'resolved' && t.status !== 'closed');

  // Compute deals by stage for chart
  const stageMap: Record<string, number> = {};
  openDeals.forEach(d => {
    const stage = d.stage_name || 'Unknown';
    stageMap[stage] = (stageMap[stage] || 0) + (Number(d.amount) || 0);
  });
  const dealsByStage = Object.entries(stageMap).map(([stage, value]) => ({ stage, value }));

  const metricCards = [
    { label: 'Total Contacts', value: contacts.length.toString(), icon: Users, color: '#8B5CF6' },
    { label: 'Open Deals', value: openDeals.length.toString(), icon: TrendingUp, color: '#3B82F6' },
    { label: 'Pipeline Value', value: fmt(pipelineValue), icon: DollarSign, color: '#22C55E' },
    { label: 'Open Tasks', value: openTasks.length.toString(), icon: Target, color: '#F0A500' },
  ];

  const activityIcons: Record<string, typeof Phone> = {
    call: Phone, email: Mail, meeting: Calendar, note: FileText,
    deal_stage_change: ArrowRight, task_completed: CheckCircle,
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0B1F3A]">Good morning, James</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
        ) : (
          metricCards.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="card">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-[#9CA3AF]">{m.label}</span>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: m.color + '18' }}>
                    <Icon size={18} style={{ color: m.color }} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-[#0B1F3A]">{m.value}</p>
              </div>
            );
          })
        )}
      </div>

      {/* Charts + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-2">
          <h3 className="text-lg font-bold text-[#0B1F3A] mb-4">Deals by Stage</h3>
          {dLoad ? (
            <div className="h-[280px] flex items-center justify-center"><Loader className="animate-spin text-gray-400" size={32} /></div>
          ) : dealsByStage.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dealsByStage} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" tick={{ fill: '#6B7280', fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
                <YAxis type="category" dataKey="stage" tick={{ fill: '#6B7280', fontSize: 11 }} width={100} />
                <Tooltip formatter={(v) => fmt(Number(v))} />
                <Bar dataKey="value" fill="#0B1F3A" radius={[0, 4, 4, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-gray-400">No deal data yet — add your first deal to see the pipeline chart</div>
          )}
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-[#0B1F3A] mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-[#9CA3AF]">Open Tickets</span>
              <span className="text-lg font-bold text-[#0B1F3A]">{openTickets.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-[#9CA3AF]">Won Deals</span>
              <span className="text-lg font-bold text-green-600">{deals.filter(d => d.is_won).length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-[#9CA3AF]">Won Revenue</span>
              <span className="text-lg font-bold text-green-600">{fmt(deals.filter(d => d.is_won).reduce((s, d) => s + (Number(d.amount) || 0), 0))}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-[#9CA3AF]">Customers</span>
              <span className="text-lg font-bold text-[#0B1F3A]">{contacts.filter(c => c.lifecycle_stage === 'customer').length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks + Top Deals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-lg font-bold text-[#0B1F3A] mb-3">Upcoming Tasks</h3>
          <div className="space-y-2">
            {tLoad ? (
              <>{[1,2,3].map(i => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}</>
            ) : openTasks.length === 0 ? (
              <p className="text-gray-400 text-sm">No upcoming tasks</p>
            ) : (
              openTasks.slice(0, 6).map((t) => (
                <div key={t.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    t.priority === 'urgent' ? 'bg-red-500' : t.priority === 'high' ? 'bg-orange-500' : t.priority === 'medium' ? 'bg-blue-500' : 'bg-gray-400'
                  }`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#0B1F3A] truncate">{t.title}</p>
                    <p className="text-xs text-[#9CA3AF]">Due {t.due_date ? new Date(t.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}</p>
                  </div>
                  <Clock size={14} className="text-[#9CA3AF] shrink-0" />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-[#0B1F3A] mb-3">Top Deals</h3>
          <div className="space-y-3">
            {dLoad ? (
              <>{[1,2,3].map(i => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}</>
            ) : deals.length === 0 ? (
              <p className="text-gray-400 text-sm">No deals found</p>
            ) : (
              [...deals].sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0)).slice(0, 6).map((deal) => (
                <div key={deal.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#0B1F3A] truncate">{deal.name}</p>
                    <p className="text-xs text-[#9CA3AF]">{deal.stage_name}</p>
                  </div>
                  <p className="text-sm font-semibold text-[#F0A500] whitespace-nowrap ml-2">{fmt(Number(deal.amount) || 0)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
