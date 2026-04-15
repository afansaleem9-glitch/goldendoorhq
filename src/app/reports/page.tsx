"use client";
import { useState } from "react";
import {
  BarChart3, TrendingUp, DollarSign, Users, Sun,
  Home, Shield, Phone, Calendar, Download, Filter,
  ChevronDown, ArrowUp, ArrowDown
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend
} from "recharts";

const REVENUE_DATA = [
  { month: "Nov", solar: 284000, smart_home: 89000, roofing: 156000, att: 42000 },
  { month: "Dec", solar: 312000, smart_home: 102000, roofing: 134000, att: 51000 },
  { month: "Jan", solar: 267000, smart_home: 95000, roofing: 178000, att: 38000 },
  { month: "Feb", solar: 341000, smart_home: 118000, roofing: 201000, att: 62000 },
  { month: "Mar", solar: 398000, smart_home: 134000, roofing: 189000, att: 71000 },
  { month: "Apr", solar: 425000, smart_home: 156000, roofing: 224000, att: 84000 },
];

const PIPELINE_DATA = [
  { stage: "New Lead", count: 47, value: 412000 },
  { stage: "Qualified", count: 31, value: 289000 },
  { stage: "Proposal", count: 22, value: 347000 },
  { stage: "Negotiation", count: 14, value: 264000 },
  { stage: "Contract", count: 8, value: 198000 },
  { stage: "Won", count: 34, value: 847000 },
];

const PIE_DATA = [
  { name: "Solar", value: 2027000, color: "#000000" },
  { name: "Roofing", value: 1082000, color: "#555555" },
  { name: "Smart Home", value: 694000, color: "#999999" },
  { name: "AT&T", value: 348000, color: "#cccccc" },
];

const REP_PERFORMANCE = [
  { name: "Marcus Johnson", deals: 28, revenue: 847200, conversion: 38, avg_deal: 30257 },
  { name: "Lisa Rodriguez", deals: 24, revenue: 712400, conversion: 35, avg_deal: 29683 },
  { name: "David Park", deals: 21, revenue: 634800, conversion: 32, avg_deal: 30228 },
  { name: "Sarah Chen", deals: 18, revenue: 548100, conversion: 41, avg_deal: 30450 },
];

const MONTHLY_TREND = [
  { month: "Nov", leads: 89, deals: 24, revenue: 571000 },
  { month: "Dec", leads: 102, deals: 28, revenue: 599000 },
  { month: "Jan", leads: 78, deals: 22, revenue: 578000 },
  { month: "Feb", leads: 124, deals: 34, revenue: 722000 },
  { month: "Mar", leads: 138, deals: 37, revenue: 792000 },
  { month: "Apr", leads: 156, deals: 42, revenue: 889000 },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState("6m");

  const totalRevenue = REVENUE_DATA.reduce((s, m) => s + m.solar + m.smart_home + m.roofing + m.att, 0);
  const totalDeals = REP_PERFORMANCE.reduce((s, r) => s + r.deals, 0);
  const avgConversion = (REP_PERFORMANCE.reduce((s, r) => s + r.conversion, 0) / REP_PERFORMANCE.length).toFixed(0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black flex items-center gap-2"><BarChart3 size={24} /> Reports</h1>
            <p className="text-sm text-gray-500 mt-1">Performance analytics & business intelligence</p>
          </div>
          <div className="flex items-center gap-3">
            <select value={period} onChange={(e) => setPeriod(e.target.value)} className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-black outline-none focus:border-black" aria-label="Time period">
              <option value="30d">Last 30 Days</option>
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last Year</option>
            </select>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Revenue", value: `$${(totalRevenue / 1000000).toFixed(2)}M`, change: "+18.2%", up: true, icon: DollarSign },
            { label: "Total Deals", value: totalDeals, change: "+12 this month", up: true, icon: TrendingUp },
            { label: "Avg Conversion", value: `${avgConversion}%`, change: "+3.1%", up: true, icon: Users },
            { label: "Avg Deal Size", value: `$${(REP_PERFORMANCE.reduce((s, r) => s + r.avg_deal, 0) / REP_PERFORMANCE.length / 1000).toFixed(1)}K`, change: "+$1.2K", up: true, icon: BarChart3 },
          ].map(kpi => {
            const KIcon = kpi.icon;
            return (
              <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-2">
                  <KIcon size={18} className="text-gray-500" />
                  <span className={`text-xs font-semibold flex items-center gap-0.5 ${kpi.up ? "text-green-600" : "text-red-600"}`}>
                    {kpi.up ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
                    {kpi.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-black">{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-bold text-black mb-4">Revenue by Vertical</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} tickFormatter={(v) => `$${v / 1000}K`} axisLine={false} tickLine={false} width={55} />
                <Tooltip formatter={(v) => `$${(Number(v) / 1000).toFixed(0)}K`} contentStyle={{ borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 13, padding: '8px 12px' }} />
                <Bar dataKey="solar" name="Solar" fill="#000000" radius={[2, 2, 0, 0]} />
                <Bar dataKey="roofing" name="Roofing" fill="#555555" radius={[2, 2, 0, 0]} />
                <Bar dataKey="smart_home" name="Smart Home" fill="#999999" radius={[2, 2, 0, 0]} />
                <Bar dataKey="att" name="AT&T" fill="#cccccc" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-bold text-black mb-4">Revenue Mix</h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                  {PIE_DATA.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `$${(Number(v) / 1000).toFixed(0)}K`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-bold text-black mb-4">Monthly Trends</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={MONTHLY_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#6B7280" }} tickFormatter={(v) => `$${v / 1000}K`} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 13 }} />
                <Line yAxisId="left" dataKey="leads" name="Leads" stroke="#000000" strokeWidth={2} dot={{ r: 3 }} />
                <Line yAxisId="left" dataKey="deals" name="Deals" stroke="#666666" strokeWidth={2} dot={{ r: 3 }} />
                <Line yAxisId="right" dataKey="revenue" name="Revenue" stroke="#999999" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-bold text-black mb-4">Pipeline Funnel</h2>
            <div className="space-y-2">
              {PIPELINE_DATA.map((stage, i) => {
                const maxVal = Math.max(...PIPELINE_DATA.map(s => s.value));
                const pct = (stage.value / maxVal) * 100;
                return (
                  <div key={stage.stage} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-gray-600 w-24 shrink-0">{stage.stage}</span>
                    <div className="flex-1 h-7 bg-gray-50 rounded overflow-hidden relative">
                      <div className="h-full rounded transition-all" style={{ width: `${pct}%`, backgroundColor: `rgba(0,0,0,${0.3 + (i * 0.12)})` }} />
                      <div className="absolute inset-0 flex items-center justify-between px-2">
                        <span className="text-[11px] font-bold text-white mix-blend-difference">{stage.count} deals</span>
                        <span className="text-[11px] font-semibold text-gray-500">${(stage.value / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rep Performance */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-bold text-black mb-4">Rep Performance</h2>
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-gray-200/60">
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">Rep</th>
                <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 uppercase">Deals Closed</th>
                <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 uppercase">Revenue</th>
                <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 uppercase">Conversion %</th>
                <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 uppercase">Avg Deal Size</th>
              </tr>
            </thead>
            <tbody>
              {REP_PERFORMANCE.map((rep, i) => (
                <tr key={rep.name} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-3 font-semibold text-black flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-black text-white text-[11px] font-bold flex items-center justify-center">{i + 1}</span>
                    {rep.name}
                  </td>
                  <td className="py-3 px-3 text-right text-black font-semibold">{rep.deals}</td>
                  <td className="py-3 px-3 text-right text-black font-semibold">${(rep.revenue / 1000).toFixed(1)}K</td>
                  <td className="py-3 px-3 text-right"><span className="text-green-600 font-semibold">{rep.conversion}%</span></td>
                  <td className="py-3 px-3 text-right text-gray-600">${(rep.avg_deal / 1000).toFixed(1)}K</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
