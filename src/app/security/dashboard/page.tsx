"use client";
import { useState } from "react";
import { Shield, CheckCircle2, AlertCircle, Clock, DollarSign, Zap, TrendingUp, Eye, Plus, Settings } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const KPIS = [
  { label: "Total Systems", value: "847", sub: "+12 this month", icon: Shield },
  { label: "Active Monitoring", value: "812", sub: "95.9% online", icon: CheckCircle2 },
  { label: "Monthly Recurring", value: "$38,420", sub: "+$2,100 MoM", icon: DollarSign },
  { label: "Installs This Month", value: "24", sub: "vs 18 last month", icon: Zap },
  { label: "Pending Activations", value: "9", sub: "3 scheduled today", icon: Clock },
  { label: "Open Tickets", value: "7", sub: "2 high priority", icon: AlertCircle },
];
const STATUS = [{ name: "Online", value: 812, color: "#22c55e" }, { name: "Offline", value: 18, color: "#ef4444" }, { name: "Pending", value: 17, color: "#f59e0b" }];
const INSTALLS = [{ month: "Nov", v: 14 }, { month: "Dec", v: 18 }, { month: "Jan", v: 22 }, { month: "Feb", v: 19 }, { month: "Mar", v: 18 }, { month: "Apr", v: 24 }];
const EQUIP = [
  { type: "ADC Smart Hub Pro", count: 340 }, { type: "ADC Smart Hub", count: 280 }, { type: "Ring Cameras", count: 1420 },
  { type: "Door/Window Sensors", count: 4800 }, { type: "Motion Detectors", count: 1200 }, { type: "Smart Locks", count: 380 },
];
const ACTS = [
  { id: 1, text: "ADC system installed — 4 cameras + 12 sensors at 4521 Oak Lawn Ave, Dallas TX", time: "2h ago", user: "David Park" },
  { id: 2, text: "Offline alert — System at 891 High St, Columbus OH lost signal", time: "3h ago", user: "System" },
  { id: 3, text: "System activated — Interactive Gold plan for Robert Martinez", time: "5h ago", user: "System" },
  { id: 4, text: "Ticket #1045 resolved — Camera reconnected at 2847 Lakeshore Blvd", time: "6h ago", user: "Sarah Chen" },
  { id: 5, text: "Pre-wire complete — 3367 Camp Bowie Blvd, Fort Worth TX", time: "8h ago", user: "Install Crew C" },
  { id: 6, text: "New security sale — Interactive Silver, 3 cameras + 8 sensors", time: "1d ago", user: "Marcus Johnson" },
  { id: 7, text: "Monthly monitoring batch — 812 accounts, $38,420", time: "1d ago", user: "System" },
  { id: 8, text: "Plan upgrade — Silver to Gold for Amanda Davis", time: "2d ago", user: "David Park" },
];

export default function SecurityDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-purple-900 to-purple-700 px-6 py-8">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div><h1 className="text-2xl font-bold text-white flex items-center gap-2"><Shield size={24} /> Smart Home & Security</h1><p className="text-purple-200 text-sm mt-1">Alarm.com monitoring, equipment, and system management</p></div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm font-semibold hover:bg-white/30 flex items-center gap-1"><Plus size={14} /> New Install</button>
              <button className="px-4 py-2 bg-white text-purple-900 rounded-lg text-sm font-semibold flex items-center gap-1"><Eye size={14} /> Monitor All</button>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-3">
            {KPIS.map(k => { const I = k.icon; return (
              <div key={k.label} className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1"><I size={14} className="text-purple-200" /><span className="text-[10px] font-semibold text-purple-200 uppercase">{k.label}</span></div>
                <p className="text-xl font-bold text-white">{k.value}</p><p className="text-[11px] text-purple-300">{k.sub}</p>
              </div>
            ); })}
          </div>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-6 py-6">
        <div className="grid grid-cols-3 gap-5 mb-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-bold text-black mb-4">System Status</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart><Pie data={STATUS} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} label={({ name, value }: any) => `${name}: ${value}`}>{STATUS.map((d, i) => <Cell key={i} fill={d.color} />)}</Pie><Tooltip formatter={(value: any) => value} /></PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-bold text-black mb-4">Monthly Installs</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={INSTALLS}><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip formatter={(value: any) => value} /><Bar dataKey="v" fill="#7c3aed" radius={[4, 4, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-bold text-black mb-4">Equipment Deployed</h3>
            <div className="space-y-3">{EQUIP.map(e => (
              <div key={e.type}><div className="flex justify-between text-xs mb-1"><span className="text-gray-600">{e.type}</span><span className="font-bold text-black">{e.count.toLocaleString()}</span></div>
              <div className="h-1.5 bg-gray-100 rounded-full"><div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.min(100, (e.count / 4800) * 100)}%` }} /></div></div>
            ))}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-black mb-4">Recent Activity</h3>
          <div className="space-y-3">{ACTS.map(a => (
            <div key={a.id} className="flex gap-3 items-start"><div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" /><div><p className="text-sm text-black">{a.text}</p><p className="text-[11px] text-gray-500">{a.time} · {a.user}</p></div></div>
          ))}</div>
        </div>
      </div>
    </div>
  );
}
