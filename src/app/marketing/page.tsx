'use client';

import { useState } from 'react';
import {
  Mail, Send, FileText, BarChart3, Plus, Search, Eye, Copy,
  ArrowUpRight, Clock, CheckCircle2, Pause, AlertCircle,
  MousePointerClick, Users, TrendingUp, Inbox, PenTool,
} from 'lucide-react';
import { emailCampaigns, emailTemplates } from '@/lib/mock-data';

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n);
const pct = (n: number, d: number) => d > 0 ? `${((n / d) * 100).toFixed(1)}%` : '0%';

const statusConfig: Record<string, { color: string; bg: string; icon: typeof Send }> = {
  draft: { color: 'text-gray-600', bg: 'bg-gray-100', icon: PenTool },
  scheduled: { color: 'text-blue-600', bg: 'bg-blue-50', icon: Clock },
  sending: { color: 'text-amber-600', bg: 'bg-amber-50', icon: Send },
  sent: { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 },
  paused: { color: 'text-orange-600', bg: 'bg-orange-50', icon: Pause },
};

export default function MarketingPage() {
  const [tab, setTab] = useState<'campaigns' | 'templates' | 'analytics'>('campaigns');
  const [search, setSearch] = useState('');

  // Aggregate stats
  const totalSent = emailCampaigns.reduce((s, c) => s + c.sent, 0);
  const totalOpened = emailCampaigns.reduce((s, c) => s + c.opened, 0);
  const totalClicked = emailCampaigns.reduce((s, c) => s + c.clicked, 0);
  const totalBounced = emailCampaigns.reduce((s, c) => s + c.bounced, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#0B1F3A]">Marketing Hub</h1>
              <p className="text-sm text-gray-500">Email campaigns, templates, and performance analytics</p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-[#0B1F3A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0B1F3A]/90 transition">
            <Plus className="w-4 h-4" /> Create Campaign
          </button>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Send className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Sent</p>
                <p className="text-xl font-bold text-[#0B1F3A]">{fmt(totalSent)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <Eye className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Open Rate</p>
                <p className="text-xl font-bold text-[#0B1F3A]">{pct(totalOpened, totalSent)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center">
                <MousePointerClick className="w-4 h-4 text-violet-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Click Rate</p>
                <p className="text-xl font-bold text-[#0B1F3A]">{pct(totalClicked, totalSent)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Bounce Rate</p>
                <p className="text-xl font-bold text-[#0B1F3A]">{pct(totalBounced, totalSent)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-gray-200 -mx-6 px-6">
          {[
            { key: 'campaigns' as const, label: 'Campaigns', icon: Send },
            { key: 'templates' as const, label: 'Templates', icon: FileText },
            { key: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition ${
                tab === t.key ? 'border-[#0B1F3A] text-[#0B1F3A]' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {tab === 'campaigns' && <CampaignsTab search={search} setSearch={setSearch} />}
        {tab === 'templates' && <TemplatesTab />}
        {tab === 'analytics' && <AnalyticsTab />}
      </div>
    </div>
  );
}

function CampaignsTab({ search, setSearch }: { search: string; setSearch: (s: string) => void }) {
  const filtered = emailCampaigns.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search campaigns..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F0A500] focus:border-transparent outline-none" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Campaign</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">List</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Sent</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Open Rate</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Click Rate</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Bounced</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(campaign => {
              const sc = statusConfig[campaign.status] || statusConfig.draft;
              const StatusIcon = sc.icon;
              return (
                <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-[#0B1F3A]">{campaign.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{campaign.subject}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${sc.color} ${sc.bg}`}>
                      <StatusIcon className="w-3 h-3" /> {campaign.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{campaign.list_name}</td>
                  <td className="px-4 py-3 text-sm text-right font-medium">{fmt(campaign.sent)}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={campaign.sent > 0 && (campaign.opened / campaign.sent) > 0.3 ? 'text-emerald-600 font-medium' : 'text-gray-600'}>
                      {pct(campaign.opened, campaign.sent)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={campaign.sent > 0 && (campaign.clicked / campaign.sent) > 0.08 ? 'text-violet-600 font-medium' : 'text-gray-600'}>
                      {pct(campaign.clicked, campaign.sent)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-500">{fmt(campaign.bounced)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {campaign.sent_at ? new Date(campaign.sent_at).toLocaleDateString() :
                     campaign.send_at ? `Sched: ${new Date(campaign.send_at).toLocaleDateString()}` : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TemplatesTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#0B1F3A]">Email Templates</h2>
        <button className="flex items-center gap-2 bg-[#0B1F3A] text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#0B1F3A]/90 transition">
          <Plus className="w-4 h-4" /> New Template
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {emailTemplates.map(template => (
          <div key={template.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition cursor-pointer">
            {/* Template preview placeholder */}
            <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-3 flex items-center justify-center border border-gray-200">
              <Mail className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-sm font-medium text-[#0B1F3A]">{template.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{template.subject}</p>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{template.category}</span>
              <span className="text-xs text-gray-400">Used {template.usage_count}×</span>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="flex-1 text-xs py-1.5 bg-[#0B1F3A] text-white rounded-lg font-medium hover:bg-[#0B1F3A]/90 transition flex items-center justify-center gap-1">
                <Send className="w-3 h-3" /> Use
              </button>
              <button className="flex-1 text-xs py-1.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center gap-1">
                <Copy className="w-3 h-3" /> Clone
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsTab() {
  const totalSent = emailCampaigns.reduce((s, c) => s + c.sent, 0);
  const totalDelivered = emailCampaigns.reduce((s, c) => s + c.delivered, 0);
  const totalOpened = emailCampaigns.reduce((s, c) => s + c.opened, 0);
  const totalClicked = emailCampaigns.reduce((s, c) => s + c.clicked, 0);

  const funnel = [
    { label: 'Sent', value: totalSent, color: '#3B82F6' },
    { label: 'Delivered', value: totalDelivered, color: '#6366F1' },
    { label: 'Opened', value: totalOpened, color: '#10B981' },
    { label: 'Clicked', value: totalClicked, color: '#F0A500' },
  ];

  return (
    <div className="space-y-6">
      {/* Funnel */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-[#0B1F3A] mb-4">Email Engagement Funnel</h3>
        <div className="space-y-3">
          {funnel.map((step, i) => {
            const widthPct = totalSent > 0 ? (step.value / totalSent) * 100 : 0;
            return (
              <div key={step.label} className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600 w-20">{step.label}</span>
                <div className="flex-1 h-8 bg-gray-50 rounded-lg overflow-hidden">
                  <div
                    className="h-full rounded-lg flex items-center px-3 transition-all duration-500"
                    style={{ width: `${Math.max(widthPct, 5)}%`, backgroundColor: step.color }}
                  >
                    <span className="text-xs font-bold text-white">{fmt(step.value)}</span>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-500 w-16 text-right">
                  {i === 0 ? '100%' : pct(step.value, totalSent)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Campaign Performance Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-[#0B1F3A] mb-4">Campaign Performance Comparison</h3>
        <div className="space-y-3">
          {emailCampaigns.filter(c => c.sent > 0).map(campaign => {
            const openRate = campaign.sent > 0 ? (campaign.opened / campaign.sent) * 100 : 0;
            const clickRate = campaign.sent > 0 ? (campaign.clicked / campaign.sent) * 100 : 0;
            return (
              <div key={campaign.id} className="flex items-center gap-4">
                <span className="text-sm text-gray-700 w-48 truncate font-medium">{campaign.name}</span>
                <div className="flex-1 flex gap-2">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="text-gray-500">Opens</span>
                      <span className="font-medium">{openRate.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${openRate}%` }} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="text-gray-500">Clicks</span>
                      <span className="font-medium">{clickRate.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-400 rounded-full" style={{ width: `${clickRate * 3}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
