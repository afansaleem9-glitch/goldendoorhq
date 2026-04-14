"use client";
import { dashboardMetrics, activities, tasks } from "@/lib/mock-data";
import {
  DollarSign, TrendingUp, Users, Target, Phone, Mail,
  Calendar, FileText, ArrowRight, CheckCircle, Clock
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

const metricCards = [
  { label: "Total Revenue", value: fmt(dashboardMetrics.total_revenue), change: dashboardMetrics.revenue_change, icon: DollarSign, color: "#22C55E" },
  { label: "Pipeline Value", value: fmt(dashboardMetrics.pipeline_value), change: dashboardMetrics.pipeline_change, icon: TrendingUp, color: "#3B82F6" },
  { label: "New Contacts", value: dashboardMetrics.contacts_created.toString(), change: dashboardMetrics.contacts_change, icon: Users, color: "#8B5CF6" },
  { label: "Conversion Rate", value: `${dashboardMetrics.conversion_rate}%`, change: dashboardMetrics.conversion_change, icon: Target, color: "#F0A500" },
];

const activityIcons: Record<string, typeof Phone> = {
  call: Phone, email: Mail, meeting: Calendar, note: FileText,
  deal_stage_change: ArrowRight, task_completed: CheckCircle,
};

export default function DashboardPage() {
  const pendingTasks = tasks.filter(t => t.status !== "completed").slice(0, 5);

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0B1F3A]">Good morning, James</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-[#9CA3AF]">{m.label}</span>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: m.color + "18" }}>
                  <Icon size={18} style={{ color: m.color }} />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#0B1F3A]">{m.value}</p>
              <p className={`text-sm mt-1 font-medium ${m.change >= 0 ? "text-green-600" : "text-red-500"}`}>
                {m.change >= 0 ? "+" : ""}{m.change}% <span className="text-[#9CA3AF] font-normal">vs last month</span>
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-2">
          <h3 className="text-lg font-bold text-[#0B1F3A] mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={dashboardMetrics.monthly_revenue}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F0A500" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F0A500" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip formatter={(v) => fmt(Number(v))} />
              <Area type="monotone" dataKey="revenue" stroke="#F0A500" strokeWidth={2} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-[#0B1F3A] mb-4">Deals by Stage</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dashboardMetrics.deals_by_stage} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" tick={{ fill: "#6B7280", fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
              <YAxis type="category" dataKey="stage" tick={{ fill: "#6B7280", fontSize: 11 }} width={90} />
              <Tooltip formatter={(v) => fmt(Number(v))} />
              <Bar dataKey="value" fill="#0B1F3A" radius={[0, 4, 4, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-lg font-bold text-[#0B1F3A] mb-4">Recent Activity</h3>
          <div className="space-y-4 max-h-[380px] overflow-y-auto">
            {activities.map((a) => {
              const Icon = activityIcons[a.type] || FileText;
              return (
                <div key={a.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-[#0B1F3A]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={14} className="text-[#0B1F3A]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#0B1F3A] truncate">{a.subject}</p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5 line-clamp-2">{a.body}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-[#9CA3AF]">{a.performed_by}</span>
                      <span className="text-xs text-gray-300">&middot;</span>
                      <span className="text-xs text-[#9CA3AF]">
                        {new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <h3 className="text-lg font-bold text-[#0B1F3A] mb-3">Upcoming Tasks</h3>
            <div className="space-y-2">
              {pendingTasks.map((t) => (
                <div key={t.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    t.priority === "urgent" ? "bg-red-500" : t.priority === "high" ? "bg-orange-500" : t.priority === "medium" ? "bg-blue-500" : "bg-gray-400"
                  }`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#0B1F3A] truncate">{t.title}</p>
                    <p className="text-xs text-[#9CA3AF]">{t.owner} &middot; Due {new Date(t.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                  </div>
                  <Clock size={14} className="text-[#9CA3AF] shrink-0" />
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-[#0B1F3A] mb-3">Team Performance</h3>
            <div className="space-y-3">
              {dashboardMetrics.team_performance.map((rep) => (
                <div key={rep.rep} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0B1F3A] flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">{rep.rep.split(" ").map(n => n[0]).join("")}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-[#0B1F3A] truncate">{rep.rep}</span>
                      <span className="text-xs font-semibold text-gray-600">{rep.quota_pct}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{
                          width: `${Math.min(rep.quota_pct, 100)}%`,
                          background: rep.quota_pct >= 100 ? "#22C55E" : rep.quota_pct >= 70 ? "#F0A500" : "#EF4444",
                        }}
                      />
                    </div>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">{rep.deals_closed} deals &middot; {fmt(rep.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
