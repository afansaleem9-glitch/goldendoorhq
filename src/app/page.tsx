'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign, TrendingUp, Users, Target, Phone, Mail,
  Calendar, FileText, ArrowRight, CheckCircle, Clock,
  Zap, Plus, MessageSquare, ArrowUpRight, ArrowDownRight, Star
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase, ORG_ID } from '@/lib/supabase';

function fmt(n: number) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n); }

interface DashStats {
  totalDeals: number;
  pipelineValue: number;
  wonValue: number;
  contactCount: number;
  callsToday: number;
  conversionRate: number;
}

interface PipelineStage {
  name: string;
  count: number;
  value: number;
}

interface RecentDeal {
  id: string;
  deal_name: string;
  amount: number;
  stage_name: string;
  deal_type: string;
  created_at: string;
  contact_name: string;
}

interface RecentCall {
  id: string;
  customer_name: string;
  phone_number: string;
  call_type: string;
  duration_seconds: number;
  created_at: string;
  customers?: { first_name: string; last_name: string } | null;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashStats>({ totalDeals: 0, pipelineValue: 0, wonValue: 0, contactCount: 0, callsToday: 0, conversionRate: 0 });
  const [pipeline, setPipeline] = useState<PipelineStage[]>([]);
  const [recentDeals, setRecentDeals] = useState<RecentDeal[]>([]);
  const [recentCalls, setRecentCalls] = useState<RecentCall[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboard(); }, []);

  async function fetchDashboard() {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [dealsRes, contactsRes, stagesRes, callsRes] = await Promise.all([
        supabase.from('deals').select('id, name, amount, stage_id, deal_type, pipeline_id, created_at, probability, contacts ( first_name, last_name )').eq('organization_id', ORG_ID).is('deleted_at', null).order('created_at', { ascending: false }),
        supabase.from('contacts').select('id').eq('organization_id', ORG_ID).is('deleted_at', null),
        supabase.from('deal_stages').select('*').eq('organization_id', ORG_ID).order('position', { ascending: true }),
        supabase.from('call_log').select('id, customer_id, phone_number, call_type, duration_seconds, created_at, customers ( first_name, last_name )').eq('organization_id', ORG_ID).order('created_at', { ascending: false }).limit(10),
      ]);

      const deals = dealsRes.data || [];
      const contacts = contactsRes.data || [];
      const stages = stagesRes.data || [];
      const calls = callsRes.data || [];

      // Calculate stats
      const wonStages = stages.filter((s: any) => s.is_won === true);
      const lostStages = stages.filter((s: any) => s.is_lost === true);
      const wonIds = new Set(wonStages.map((s: any) => s.id));
      const lostIds = new Set(lostStages.map((s: any) => s.id));

      const wonDeals = deals.filter((d: any) => wonIds.has(d.stage_id));
      const pipelineDeals = deals.filter((d: any) => !wonIds.has(d.stage_id) && !lostIds.has(d.stage_id));

      const pipelineValue = pipelineDeals.reduce((s: number, d: any) => s + (d.amount || 0), 0);
      const wonValue = wonDeals.reduce((s: number, d: any) => s + (d.amount || 0), 0);

      const today = new Date().toISOString().split('T')[0];
      const callsToday = calls.filter((c: any) => c.created_at?.split('T')[0] === today).length;

      const closedDeals = wonDeals.length + deals.filter((d: any) => lostIds.has(d.stage_id)).length;
      const conversionRate = closedDeals > 0 ? Math.round((wonDeals.length / closedDeals) * 100) : 0;

      setStats({
        totalDeals: deals.length,
        pipelineValue,
        wonValue,
        contactCount: contacts.length,
        callsToday,
        conversionRate,
      });

      // Pipeline by stage
      const pipelineData: PipelineStage[] = stages
        .filter((s: any) => !s.name?.toLowerCase().includes('lost'))
        .map((s: any) => {
          const stageDeals = deals.filter((d: any) => d.stage_id === s.id);
          return {
            name: s.name,
            count: stageDeals.length,
            value: stageDeals.reduce((sum: number, d: any) => sum + (d.amount || 0), 0),
          };
        })
        .filter((p: PipelineStage) => p.count > 0);
      setPipeline(pipelineData);

      // Recent deals
      const recentDealData: RecentDeal[] = deals.slice(0, 8).map((d: any) => {
        const c = d.contacts;
        const stageName = stages.find((s: any) => s.id === d.stage_id)?.name || 'Unknown';
        return {
          id: d.id,
          deal_name: d.name,
          amount: d.amount || 0,
          stage_name: stageName,
          deal_type: d.deal_type || 'solar',
          created_at: d.created_at,
          contact_name: c ? `${c.first_name} ${c.last_name}` : 'Unknown',
        };
      });
      setRecentDeals(recentDealData);
      setRecentCalls(calls.slice(0, 6).map((c: any) => ({
        ...c,
        customer_name: c.customers ? `${c.customers.first_name} ${c.customers.last_name}` : c.phone_number,
      })));
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }

  const maxPipelineValue = Math.max(...pipeline.map(p => p.value), 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-56px)]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-[1600px] mx-auto space-y-5">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-extrabold text-black tracking-tight">Welcome back, Afan</h1>
          <p className="text-[13px] text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/contacts" className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Users size={13} /> Contacts
          </Link>
          <Link href="/solar" className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-semibold text-white bg-black rounded-lg hover:bg-gray-900">
            <Zap size={13} /> Solar Pipeline
          </Link>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'PIPELINE VALUE', value: fmt(stats.pipelineValue), sub: `${stats.totalDeals} total deals`, icon: Target },
          { label: 'DEALS WON', value: fmt(stats.wonValue), sub: 'Closed revenue', icon: DollarSign },
          { label: 'CONTACTS', value: stats.contactCount.toString(), sub: 'Active in CRM', icon: Users },
          { label: 'CONVERSION RATE', value: `${stats.conversionRate}%`, sub: 'Won vs closed', icon: TrendingUp },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-200/60 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{kpi.label}</span>
              <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center">
                <kpi.icon size={16} className="text-gray-500" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-black">{kpi.value}</p>
            <p className="text-[11px] text-gray-500 mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="flex gap-5">
        {/* LEFT */}
        <div className="flex-1 space-y-5">
          {/* Pipeline Summary */}
          <div className="bg-white rounded-xl border border-gray-200/60 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-extrabold text-black">Pipeline Summary</h2>
              <Link href="/deals" className="text-[11px] font-semibold text-gray-500 hover:text-black flex items-center gap-1">View Deals <ArrowRight size={12} /></Link>
            </div>
            {pipeline.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">No pipeline data yet</p>
            ) : (
              <div className="space-y-3">
                {pipeline.map(p => (
                  <div key={p.name} className="flex items-center gap-3">
                    <span className="text-[11px] font-medium text-gray-500 w-28 shrink-0 truncate">{p.name}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 relative overflow-hidden">
                      <div className="h-5 bg-black rounded-full flex items-center justify-end pr-2 transition-all" style={{ width: `${Math.max((p.value / maxPipelineValue) * 100, 15)}%` }}>
                        <span className="text-[10px] font-bold text-white">{p.count}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-black w-16 text-right">{fmt(p.value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Deals */}
          <div className="bg-white rounded-xl border border-gray-200/60 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-extrabold text-black">Recent Deals</h2>
              <Link href="/deals" className="text-[11px] font-semibold text-gray-500 hover:text-black flex items-center gap-1">View All <ArrowRight size={12} /></Link>
            </div>
            {recentDeals.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">No deals yet</p>
            ) : (
              <div className="space-y-0">
                {recentDeals.map((d, i) => (
                  <div key={d.id} className={`flex items-center gap-3 py-3 ${i < recentDeals.length - 1 ? 'border-b border-gray-50' : ''}`}>
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                      <DollarSign size={14} className={d.stage_name.toLowerCase().includes('won') ? 'text-emerald-600' : 'text-gray-500'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold text-black truncate">{d.deal_name}</p>
                      <p className="text-[11px] text-gray-500">{d.contact_name} · {d.deal_type}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[13px] font-extrabold text-black">{fmt(d.amount)}</p>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${d.stage_name.toLowerCase().includes('won') ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>{d.stage_name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-[340px] shrink-0 space-y-5">
          {/* Recent Calls */}
          <div className="bg-white rounded-xl border border-gray-200/60 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-extrabold text-black">Recent Calls</h2>
              <Link href="/calling" className="text-[11px] font-semibold text-gray-500 hover:text-black">View All</Link>
            </div>
            {recentCalls.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">No calls logged yet</p>
            ) : (
              <div className="space-y-2">
                {recentCalls.map(c => (
                  <div key={c.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <Phone size={13} className={c.call_type === 'inbound' ? 'text-blue-500' : 'text-green-500'} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-black truncate">{c.customer_name}</p>
                      <p className="text-[11px] text-gray-500">{c.phone_number}</p>
                    </div>
                    <span className="text-[11px] text-gray-400">{c.duration_seconds ? `${Math.floor(c.duration_seconds / 60)}m` : '0m'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl border border-gray-200/60 p-5">
            <h2 className="text-[15px] font-extrabold text-black mb-3">Quick Stats</h2>
            {[
              { label: 'Total Deals', value: stats.totalDeals },
              { label: 'Pipeline Value', value: fmt(stats.pipelineValue) },
              { label: 'Won Revenue', value: fmt(stats.wonValue) },
              { label: 'Contacts', value: stats.contactCount },
              { label: 'Calls Today', value: stats.callsToday },
            ].map(s => (
              <div key={s.label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-[12px] text-gray-500">{s.label}</span>
                <span className="text-[12px] font-bold text-black">{s.value}</span>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-black rounded-xl p-5">
            <h2 className="text-[13px] font-extrabold text-white mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'New Deal', icon: DollarSign, href: '/deals' },
                { label: 'New Contact', icon: Users, href: '/contacts' },
                { label: 'Solar Pipeline', icon: Zap, href: '/solar' },
                { label: 'Call Center', icon: Phone, href: '/calling' },
              ].map(a => (
                <Link key={a.label} href={a.href} className="flex items-center gap-2 px-3 py-2.5 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors">
                  <a.icon size={14} />
                  <span className="text-[11px] font-semibold">{a.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
