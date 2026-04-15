"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import Link from "next/link";
import { Shield, Lock, Eye, Camera, Radio, Users, FileText, Wrench, DollarSign, Activity, CheckCircle, AlertTriangle, ArrowRight, TrendingUp, Monitor, Wifi, ClipboardCheck, BarChart3, Target } from "lucide-react";

export default function SecurityHubPage() {
  const [stats, setStats] = useState({ accounts: 1247, activeMonitoring: 1189, rmr: 47560, avgValue: 39.99, activations: 34, churnRate: 2.1 });
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("monitoring_contracts").select("id, status, monthly_rate").eq("org_id", ORG_ID);
      if (data && data.length > 0) {
        const active = data.filter((c: any) => c.status === "active");
        setStats({ accounts: data.length, activeMonitoring: active.length, rmr: active.reduce((a: number, c: any) => a + (c.monthly_rate || 0), 0), avgValue: Math.round((active.reduce((a: number, c: any) => a + (c.monthly_rate || 0), 0) / Math.max(active.length, 1)) * 100) / 100, activations: 34, churnRate: 2.1 });
      }
    })();
  }, []);
  const modules = [
    { title: "System Designer", desc: "Interactive equipment selection, package builder, and quote generation", icon: Monitor, href: "/security/system-designer", stat: "3 packages", color: "from-blue-600 to-blue-800" },
    { title: "Monitoring Contracts", desc: "Contract lifecycle management, RMR tracking, renewals and terms", icon: FileText, href: "/security/monitoring-contracts", stat: "$47.5K RMR", color: "from-green-600 to-green-800" },
    { title: "Video Verification", desc: "Camera feeds, alarm event verification, false alarm reduction", icon: Eye, href: "/security/video-verification", stat: "98.2% verified", color: "from-purple-600 to-purple-800" },
    { title: "Competitor Takeover", desc: "ADT, Vivint, SimpliSafe account analysis and takeover tools", icon: Target, href: "/security/competitor-takeover", stat: "47 prospects", color: "from-red-600 to-red-800" },
    { title: "Customer Portal", desc: "Self-service portal for system status, billing, and service requests", icon: Users, href: "/security/customer-portal", stat: "892 active", color: "from-teal-600 to-teal-800" },
    { title: "Alarm.com", desc: "Device sync, remote commands, automation rules, event streaming", icon: Wifi, href: "/security/alarm-com", stat: "3,420 devices", color: "from-orange-600 to-orange-800" },
    { title: "Site Surveys", desc: "Pre-installation surveys, property assessment, equipment recommendations", icon: ClipboardCheck, href: "/security/site-surveys", stat: "12 this week", color: "from-cyan-600 to-cyan-800" },
    { title: "Activation Tracker", desc: "Pipeline from sale to monitoring-live with stage tracking", icon: Activity, href: "/security/activation-tracker", stat: "34 this month", color: "from-indigo-600 to-indigo-800" },
    { title: "Warranty Claims", desc: "Equipment warranty tracking, service tickets, parts ordering", icon: Wrench, href: "/security/warranty-claims", stat: "8 open", color: "from-pink-600 to-pink-800" },
    { title: "Recurring Revenue", desc: "RMR analytics, churn analysis, cohort tracking, revenue forecasting", icon: BarChart3, href: "/security/recurring-revenue", stat: "2.1% churn", color: "from-emerald-600 to-emerald-800" },
  ];
  const recentActivity = [
    { msg: "Alarm signal verified — 4521 Oak Lane (motion sensor, Zone 3)", time: "3 min ago", type: "alert" },
    { msg: "New activation: Martinez residence — Qolsys IQ4 + 12 sensors", time: "15 min ago", type: "success" },
    { msg: "Contract renewal signed — Thompson ($44.99/mo, 48 months)", time: "30 min ago", type: "success" },
    { msg: "ADT takeover completed — Williams family (saved $22/mo)", time: "1 hr ago", type: "success" },
    { msg: "Warranty claim #WC-089 resolved — replaced smoke detector", time: "2 hrs ago", type: "success" },
    { msg: "Site survey scheduled — 7891 Elm St (Friday 10am)", time: "3 hrs ago", type: "info" },
  ];
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8"><h1 className="text-3xl font-bold text-[#0B1F3A]">Security Command Center</h1><p className="text-gray-500 mt-1">Alarm monitoring, installation tracking, and account management</p></div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[{ label: "Total Accounts", value: stats.accounts.toLocaleString(), icon: Shield, change: "+12" },{ label: "Active Monitoring", value: stats.activeMonitoring.toLocaleString(), icon: Radio, change: "+8" },{ label: "Monthly RMR", value: `$${stats.rmr.toLocaleString()}`, icon: DollarSign, change: "+$1,240" },{ label: "Avg Account Value", value: `$${stats.avgValue}/mo`, icon: TrendingUp, change: "+$2.50" },{ label: "Activations (Mo)", value: stats.activations.toString(), icon: CheckCircle, change: "+6" },{ label: "Churn Rate", value: `${stats.churnRate}%`, icon: AlertTriangle, change: "-0.3%" }].map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-2"><s.icon size={16} className="text-[#F0A500]" /><span className="text-xs text-gray-500 font-medium">{s.label}</span></div><div className="text-xl font-bold text-[#0B1F3A]">{s.value}</div><div className="text-xs text-green-600 font-medium mt-1">{s.change}</div></div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {modules.map((m, i) => (
          <Link key={i} href={m.href} className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${m.color}`} />
            <div className="p-4"><div className="flex items-center gap-3 mb-2"><div className={`p-2 rounded-lg bg-gradient-to-r ${m.color} text-white`}><m.icon size={18} /></div><div><h3 className="font-semibold text-[#0B1F3A] group-hover:text-[#F0A500] transition-colors">{m.title}</h3><span className="text-xs text-gray-400">{m.stat}</span></div></div><p className="text-xs text-gray-500 mb-3">{m.desc}</p><div className="flex items-center text-xs text-[#F0A500] font-medium">Open Module <ArrowRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform" /></div></div>
          </Link>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"><h2 className="text-lg font-bold text-[#0B1F3A] mb-4">Recent Activity</h2><div className="space-y-3">{recentActivity.map((a, i) => (<div key={i} className="flex items-start gap-3 text-sm"><div className={`w-2 h-2 rounded-full mt-1.5 ${a.type === "success" ? "bg-green-500" : a.type === "alert" ? "bg-red-500" : "bg-blue-500"}`} /><span className="flex-1 text-gray-700">{a.msg}</span><span className="text-xs text-gray-400 whitespace-nowrap">{a.time}</span></div>))}</div></div>
    </div>
  );
}
