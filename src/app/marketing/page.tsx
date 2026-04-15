"use client";
import { useState } from "react";
import {
  Mail, Search, Plus, BarChart3, Eye, MousePointer,
  Send, Clock, CheckCircle2, AlertCircle, Users, TrendingUp,
  ChevronRight, Edit2, Copy, Trash2, Play, Pause
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: "draft" | "scheduled" | "sending" | "sent" | "paused";
  type: string;
  audience: string;
  audience_count: number;
  stats: { sent: number; delivered: number; opened: number; clicked: number; bounced: number; unsubscribed: number };
  send_at: string;
  created_at: string;
}

const MOCK_CAMPAIGNS: Campaign[] = [
  { id: "cm1", name: "Spring Solar Savings Blast", subject: "Save $5,000+ on Solar This Spring", status: "sent", type: "Promotional", audience: "All Leads — TX", audience_count: 2847, stats: { sent: 2847, delivered: 2791, opened: 1284, clicked: 342, bounced: 56, unsubscribed: 12 }, send_at: "Apr 1, 2026", created_at: "Mar 28, 2026" },
  { id: "cm2", name: "Smart Home Bundle Intro", subject: "Protect Your Home — Smart Security + Solar", status: "sent", type: "Promotional", audience: "Solar Customers", audience_count: 1203, stats: { sent: 1203, delivered: 1189, opened: 687, clicked: 198, bounced: 14, unsubscribed: 3 }, send_at: "Mar 15, 2026", created_at: "Mar 12, 2026" },
  { id: "cm3", name: "Welcome Sequence — Day 1", subject: "Welcome to Delta Power Group!", status: "sent", type: "Automated", audience: "New Contacts", audience_count: 456, stats: { sent: 456, delivered: 452, opened: 389, clicked: 145, bounced: 4, unsubscribed: 0 }, send_at: "Automated", created_at: "Jan 1, 2026" },
  { id: "cm4", name: "April Referral Program", subject: "Earn $500 for Every Referral", status: "scheduled", type: "Promotional", audience: "Active Customers", audience_count: 892, stats: { sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0, unsubscribed: 0 }, send_at: "Apr 15, 2026", created_at: "Apr 10, 2026" },
  { id: "cm5", name: "Roofing Season Kickoff", subject: "Free Roof Inspection — Limited Time", status: "draft", type: "Promotional", audience: "OH + MI Leads", audience_count: 1547, stats: { sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0, unsubscribed: 0 }, send_at: "—", created_at: "Apr 13, 2026" },
  { id: "cm6", name: "Monthly Monitoring Report", subject: "Your Solar System Performance — March 2026", status: "sent", type: "Informational", audience: "Monitored Systems", audience_count: 634, stats: { sent: 634, delivered: 628, opened: 412, clicked: 89, bounced: 6, unsubscribed: 1 }, send_at: "Apr 3, 2026", created_at: "Apr 1, 2026" },
  { id: "cm7", name: "AT&T Fiber Upsell", subject: "Upgrade to AT&T Fiber — Exclusive Delta Pricing", status: "paused", type: "Promotional", audience: "Smart Home Customers", audience_count: 378, stats: { sent: 189, delivered: 186, opened: 72, clicked: 18, bounced: 3, unsubscribed: 2 }, send_at: "Apr 8, 2026", created_at: "Apr 5, 2026" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Send }> = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-600", icon: Edit2 },
  scheduled: { label: "Scheduled", color: "bg-blue-50 text-blue-700", icon: Clock },
  sending: { label: "Sending", color: "bg-amber-50 text-amber-700", icon: Send },
  sent: { label: "Sent", color: "bg-green-50 text-green-700", icon: CheckCircle2 },
  paused: { label: "Paused", color: "bg-orange-50 text-orange-700", icon: Pause },
};

export default function MarketingPage() {
  const [campaigns] = useState(MOCK_CAMPAIGNS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = campaigns.filter(c => {
    const matchSearch = search === "" || c.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalSent = campaigns.reduce((s, c) => s + c.stats.sent, 0);
  const totalOpened = campaigns.reduce((s, c) => s + c.stats.opened, 0);
  const totalClicked = campaigns.reduce((s, c) => s + c.stats.clicked, 0);
  const avgOpenRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : "0";
  const avgClickRate = totalSent > 0 ? ((totalClicked / totalSent) * 100).toFixed(1) : "0";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black flex items-center gap-2"><Mail size={24} /> Marketing</h1>
            <p className="text-sm text-gray-500 mt-1">Email campaigns & automation</p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">
            <Plus size={14} /> Create Campaign
          </button>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {[
            { label: "Campaigns", value: campaigns.length, sub: "" },
            { label: "Emails Sent", value: totalSent.toLocaleString(), sub: "" },
            { label: "Total Opens", value: totalOpened.toLocaleString(), sub: `${avgOpenRate}% rate` },
            { label: "Total Clicks", value: totalClicked.toLocaleString(), sub: `${avgClickRate}% rate` },
            { label: "Unsubscribes", value: campaigns.reduce((s, c) => s + c.stats.unsubscribed, 0), sub: "" },
          ].map(kpi => (
            <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-2xl font-bold text-black">{kpi.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
              {kpi.sub && <p className="text-[11px] text-green-600 font-semibold mt-0.5">{kpi.sub}</p>}
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 max-w-md focus-within:border-black transition-all">
            <Search size={14} className="text-gray-500 mr-2" />
            <input type="text" placeholder="Search campaigns..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 text-sm outline-none bg-transparent text-black placeholder-gray-400" aria-label="Search campaigns" />
          </div>
          {["all", "sent", "scheduled", "draft", "paused"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${statusFilter === s ? "bg-black text-white" : "bg-white border border-gray-200 text-gray-600 hover:text-black"}`}>
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Campaign Cards */}
        <div className="space-y-3">
          {filtered.map(campaign => {
            const sc = STATUS_CONFIG[campaign.status];
            const Icon = sc.icon;
            const openRate = campaign.stats.sent > 0 ? ((campaign.stats.opened / campaign.stats.sent) * 100).toFixed(1) : "—";
            const clickRate = campaign.stats.sent > 0 ? ((campaign.stats.clicked / campaign.stats.sent) * 100).toFixed(1) : "—";
            return (
              <div key={campaign.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-black">{campaign.name}</h3>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${sc.color}`}>{sc.label}</span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-500">{campaign.type}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{campaign.subject}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Users size={11} /> {campaign.audience} ({campaign.audience_count.toLocaleString()})</span>
                      <span className="flex items-center gap-1"><Clock size={11} /> {campaign.send_at}</span>
                    </div>
                  </div>
                  {campaign.stats.sent > 0 && (
                    <div className="flex items-center gap-6 ml-6">
                      <div className="text-center">
                        <p className="text-lg font-bold text-black">{openRate}%</p>
                        <p className="text-[11px] text-gray-500">Open Rate</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-black">{clickRate}%</p>
                        <p className="text-[11px] text-gray-500">Click Rate</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-black">{campaign.stats.delivered.toLocaleString()}</p>
                        <p className="text-[11px] text-gray-500">Delivered</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
