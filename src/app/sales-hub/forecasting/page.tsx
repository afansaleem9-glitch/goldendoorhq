"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { DollarSign, TrendingUp, Target, AlertTriangle } from "lucide-react";

const MONTHLY = [
  { month: "Jan", projected: 185000, actual: 192000 }, { month: "Feb", projected: 210000, actual: 198000 },
  { month: "Mar", projected: 240000, actual: 256000 }, { month: "Apr", projected: 280000, actual: 145000 },
  { month: "May", projected: 320000, actual: 0 }, { month: "Jun", projected: 350000, actual: 0 },
];

const BY_VERTICAL = [
  { name: "Solar", value: 580000, color: "#F0A500" }, { name: "Security", value: 145000, color: "#7C5CBF" },
  { name: "Roofing", value: 210000, color: "#D97706" }, { name: "AT&T", value: 65000, color: "#2563EB" },
];

const SCENARIOS = [
  { label: "Best Case", amount: 1420000, color: "text-green-600", bg: "bg-green-50" },
  { label: "Likely", amount: 1150000, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Worst Case", amount: 820000, color: "text-red-600", bg: "bg-red-50" },
];

const QUARTERLY = [
  { quarter: "Q1 2025", target: 600000, actual: 646000, pct: 107.7 },
  { quarter: "Q2 2025", target: 900000, actual: 145000, pct: 16.1 },
  { quarter: "Q3 2025", target: 1100000, actual: 0, pct: 0 },
  { quarter: "Q4 2025", target: 1400000, actual: 0, pct: 0 },
];

export default function ForecastingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#0B1F3A] to-[#1a3a5c] text-white px-8 py-8">
        <h1 className="text-2xl font-bold">Revenue Forecasting</h1>
        <p className="text-blue-200 text-sm mt-1">Pipeline projections and revenue targets</p>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {SCENARIOS.map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl border p-5`}>
              <div className="text-xs text-gray-500 mb-1">{s.label}</div>
              <div className={`text-2xl font-bold ${s.color}`}>${(s.amount / 1000000).toFixed(2)}M</div>
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold mb-4">Monthly Forecast vs Actual</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={MONTHLY}><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} tickFormatter={(v: any) => `$${(v/1000).toFixed(0)}k`} /><Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} /><Bar dataKey="projected" fill="#0B1F3A" radius={[4,4,0,0]} name="Projected" /><Bar dataKey="actual" fill="#F0A500" radius={[4,4,0,0]} name="Actual" /><Legend /></BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold mb-4">Revenue by Vertical</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart><Pie data={BY_VERTICAL} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }: any) => `${name} $${(value/1000).toFixed(0)}k`}>{BY_VERTICAL.map((v, i) => <Cell key={i} fill={v.color} />)}</Pie><Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} /></PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <h3 className="font-semibold mb-4">Quarterly Targets</h3>
          <div className="space-y-4">
            {QUARTERLY.map(q => (
              <div key={q.quarter}>
                <div className="flex justify-between text-sm mb-1"><span className="font-medium">{q.quarter}</span><span className="text-gray-500">${q.actual.toLocaleString()} / ${q.target.toLocaleString()} ({q.pct}%)</span></div>
                <div className="w-full bg-gray-100 rounded-full h-3 relative"><div className={`h-3 rounded-full transition-all ${q.pct >= 100 ? "bg-green-500" : q.pct > 50 ? "bg-blue-500" : q.pct > 0 ? "bg-amber-500" : "bg-gray-200"}`} style={{ width: `${Math.min(q.pct, 100)}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
