"use client";
import { dashboardMetrics } from "@/lib/mock-data";
import {
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  type PieLabelRenderProps
} from "recharts";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

const COLORS = ["#0B1F3A", "#F0A500", "#007A67", "#7C5CBF", "#3B82F6", "#EF4444"];

export default function ReportsPage() {
  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0B1F3A]">Reports</h1>
        <p className="text-sm text-[#9CA3AF]">Sales analytics and performance metrics</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-sm text-[#9CA3AF]">Total Revenue</p>
          <p className="text-3xl font-bold text-[#0B1F3A] mt-1">{fmt(dashboardMetrics.total_revenue)}</p>
          <p className="text-sm text-green-600 font-medium mt-1">+{dashboardMetrics.revenue_change}%</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-[#9CA3AF]">Avg Deal Size</p>
          <p className="text-3xl font-bold text-[#0B1F3A] mt-1">{fmt(dashboardMetrics.avg_deal_size)}</p>
          <p className={`text-sm font-medium mt-1 ${dashboardMetrics.avg_deal_change >= 0 ? "text-green-600" : "text-red-500"}`}>{dashboardMetrics.avg_deal_change}%</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-[#9CA3AF]">Pipeline Deals</p>
          <p className="text-3xl font-bold text-[#0B1F3A] mt-1">{dashboardMetrics.deals_in_pipeline}</p>
          <p className="text-sm text-green-600 font-medium mt-1">+{dashboardMetrics.pipeline_change}%</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-[#9CA3AF]">Win Rate</p>
          <p className="text-3xl font-bold text-[#0B1F3A] mt-1">{dashboardMetrics.conversion_rate}%</p>
          <p className="text-sm text-green-600 font-medium mt-1">+{dashboardMetrics.conversion_change}%</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Trend */}
        <div className="card">
          <h3 className="text-lg font-bold text-[#0B1F3A] mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dashboardMetrics.monthly_revenue}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F0A500" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F0A500" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip formatter={(v) => fmt(Number(v))} />
              <Area type="monotone" dataKey="revenue" stroke="#F0A500" strokeWidth={2} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Sources */}
        <div className="card">
          <h3 className="text-lg font-bold text-[#0B1F3A] mb-4">Lead Sources</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={dashboardMetrics.lead_sources} dataKey="count" nameKey="source" cx="50%" cy="50%" outerRadius={100} label={(props: PieLabelRenderProps) => `${props.name || ''} ${((Number(props.percent) || 0) * 100).toFixed(0)}%`}>
                {dashboardMetrics.lead_sources.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pipeline by Stage */}
        <div className="card">
          <h3 className="text-lg font-bold text-[#0B1F3A] mb-4">Pipeline by Stage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardMetrics.deals_by_stage}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="stage" tick={{ fill: "#6B7280", fontSize: 11 }} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip formatter={(v) => fmt(Number(v))} />
              <Legend />
              <Bar dataKey="value" name="Value" fill="#0B1F3A" radius={[4, 4, 0, 0]} barSize={32} />
              <Bar dataKey="count" name="Count" fill="#F0A500" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Team Leaderboard */}
        <div className="card">
          <h3 className="text-lg font-bold text-[#0B1F3A] mb-4">Team Leaderboard</h3>
          <div className="space-y-4">
            {dashboardMetrics.team_performance
              .sort((a, b) => b.revenue - a.revenue)
              .map((rep, i) => (
                <div key={rep.rep} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${i === 0 ? "bg-[#F0A500]" : "bg-[#0B1F3A]"}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-[#0B1F3A]">{rep.rep}</span>
                      <span className="font-bold text-[#0B1F3A]">{fmt(rep.revenue)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="h-2 rounded-full" style={{ width: `${rep.quota_pct}%`, background: rep.quota_pct >= 100 ? "#22C55E" : rep.quota_pct >= 70 ? "#F0A500" : "#EF4444" }} />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-[#9CA3AF]">
                      <span>{rep.deals_closed} deals closed</span>
                      <span>{rep.quota_pct}% of quota</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
