"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const MONTHLY = [
  { month: "Oct", visitors: 12400, leads: 340 }, { month: "Nov", visitors: 14200, leads: 410 },
  { month: "Dec", visitors: 11800, leads: 295 }, { month: "Jan", visitors: 15600, leads: 480 },
  { month: "Feb", visitors: 17200, leads: 520 }, { month: "Mar", visitors: 19800, leads: 610 },
];

const SOURCES = [
  { name: "Organic Search", value: 42, color: "#0B1F3A" }, { name: "Paid Ads", value: 28, color: "#F0A500" },
  { name: "Referral", value: 15, color: "#007A67" }, { name: "Social Media", value: 10, color: "#7C5CBF" },
  { name: "Direct", value: 5, color: "#64748b" },
];

const FUNNEL = [
  { stage: "Visitors", count: 19800, pct: 100 }, { stage: "Leads", count: 610, pct: 3.1 },
  { stage: "MQLs", count: 244, pct: 1.2 }, { stage: "SQLs", count: 98, pct: 0.5 },
  { stage: "Customers", count: 34, pct: 0.17 },
];

const CAMPAIGNS = [
  { name: "Spring Solar Promo", sent: 4250, opened: 1672, clicked: 389, converted: 45 },
  { name: "Security Launch", sent: 2800, opened: 1240, clicked: 298, converted: 32 },
  { name: "Referral Program", sent: 3100, opened: 1523, clicked: 456, converted: 67 },
  { name: "Roofing Kickoff", sent: 1800, opened: 756, clicked: 189, converted: 21 },
];

export default function MarketingAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-teal-900 to-teal-700 text-white px-8 py-8">
        <h1 className="text-2xl font-bold">Marketing Analytics</h1>
        <p className="text-teal-200 text-sm mt-1">Performance metrics and insights</p>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold mb-4">Monthly Traffic & Leads</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={MONTHLY}><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip formatter={(value: any) => value.toLocaleString()} /><Bar dataKey="visitors" fill="#0B1F3A" radius={[4, 4, 0, 0]} /><Bar dataKey="leads" fill="#F0A500" radius={[4, 4, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold mb-4">Lead Sources</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart><Pie data={SOURCES} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }: any) => `${name} ${value}%`}>{SOURCES.map((s, i) => <Cell key={i} fill={s.color} />)}</Pie><Tooltip formatter={(value: any) => `${value}%`} /></PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold mb-4">Conversion Funnel</h3>
            <div className="space-y-3">
              {FUNNEL.map((f, i) => (
                <div key={f.stage}>
                  <div className="flex justify-between text-sm mb-1"><span className="font-medium">{f.stage}</span><span className="text-gray-500">{f.count.toLocaleString()} ({f.pct}%)</span></div>
                  <div className="w-full bg-gray-100 rounded-full h-3"><div className="bg-gradient-to-r from-teal-600 to-teal-400 h-3 rounded-full transition-all" style={{ width: `${Math.max(f.pct, 2)}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold mb-4">Campaign Performance</h3>
            <table className="w-full text-sm">
              <thead className="border-b"><tr>{["Campaign", "Sent", "Open %", "Click %", "Conv"].map(h => <th key={h} className="text-left py-2 text-gray-500 font-medium">{h}</th>)}</tr></thead>
              <tbody>{CAMPAIGNS.map(c => (
                <tr key={c.name} className="border-b last:border-0">
                  <td className="py-2 font-medium">{c.name}</td>
                  <td className="py-2 text-gray-600">{c.sent.toLocaleString()}</td>
                  <td className="py-2 text-green-600 font-medium">{((c.opened / c.sent) * 100).toFixed(1)}%</td>
                  <td className="py-2 text-blue-600 font-medium">{((c.clicked / c.sent) * 100).toFixed(1)}%</td>
                  <td className="py-2 font-semibold">{c.converted}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
