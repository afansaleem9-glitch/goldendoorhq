"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import Link from "next/link";
import { Wifi, Phone, Signal, Users, DollarSign, MapPin, BarChart3, ClipboardCheck, Shield, TrendingUp, ArrowRight, CheckCircle, BookOpen, Target, Headphones, FileText } from "lucide-react";

export default function ATTHubPage() {
  const [stats, setStats] = useState({ subscribers: 3847, ordersMonth: 156, revenue: 289000, arpu: 75.12, activationRate: 94, fiberPenetration: 42 });
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("att_orders").select("id, status, monthly_total").eq("org_id", ORG_ID);
      if (data && data.length > 0) {
        setStats({ subscribers: data.filter((d: any) => d.status === "active").length, ordersMonth: data.length, revenue: data.reduce((a: number, d: any) => a + (d.monthly_total || 0), 0), arpu: Math.round((data.reduce((a: number, d: any) => a + (d.monthly_total || 0), 0) / Math.max(data.length, 1)) * 100) / 100, activationRate: 94, fiberPenetration: 42 });
      }
    })();
  }, []);
  const modules = [
    { title: "Orders", desc: "Internet, TV, Phone, Wireless bundle order management", icon: FileText, href: "/att/orders", stat: "156 this month", color: "from-blue-600 to-blue-800" },
    { title: "Commissions", desc: "Sales rep commission tracking, tiers, and payout management", icon: DollarSign, href: "/att/commissions", stat: "$34K paid", color: "from-green-600 to-green-800" },
    { title: "Territories", desc: "Territory mapping, zip code assignment, penetration analysis", icon: MapPin, href: "/att/territories", stat: "18 territories", color: "from-purple-600 to-purple-800" },
    { title: "Activations", desc: "Service activation pipeline from order to live connection", icon: CheckCircle, href: "/att/activations", stat: "94% rate", color: "from-teal-600 to-teal-800" },
    { title: "Availability", desc: "Fiber, DSL, Fixed Wireless coverage lookup by address", icon: Signal, href: "/att/availability", stat: "42% fiber", color: "from-cyan-600 to-cyan-800" },
    { title: "Quality", desc: "QA scorecards, call reviews, rep performance grading", icon: Target, href: "/att/quality", stat: "92 avg score", color: "from-orange-600 to-orange-800" },
    { title: "Compliance", desc: "CPNI verification, regulatory tracking, audit readiness", icon: Shield, href: "/att/compliance", stat: "98% compliant", color: "from-red-600 to-red-800" },
    { title: "Retention", desc: "At-risk customers, save offers, win-back campaigns", icon: Headphones, href: "/att/retention", stat: "87% save rate", color: "from-pink-600 to-pink-800" },
    { title: "Training", desc: "Product training, certifications, compliance modules", icon: BookOpen, href: "/att/training", stat: "24 courses", color: "from-indigo-600 to-indigo-800" },
    { title: "Reporting", desc: "Sales, operations, and financial performance reports", icon: BarChart3, href: "/att/reporting", stat: "Live data", color: "from-amber-600 to-amber-800" },
  ];
  const recentActivity = [
    { msg: "New order: Rodriguez — AT&T Fiber 1000 + TV Choice ($124.99/mo)", time: "5 min ago", type: "success" },
    { msg: "Commission approved: Sarah Chen — $2,340 (15 orders)", time: "20 min ago", type: "success" },
    { msg: "Activation complete: 4521 Pine Dr — Fiber 500Mbps", time: "35 min ago", type: "success" },
    { msg: "QA review flagged: Rep #247 — compliance issue on call #89012", time: "1 hr ago", type: "alert" },
    { msg: "Retention save: Williams family upgraded to bundle ($45/mo savings)", time: "2 hrs ago", type: "success" },
    { msg: "Territory 14 (Frisco) hit 50% fiber penetration", time: "3 hrs ago", type: "success" },
  ];
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8"><h1 className="text-3xl font-bold text-[#0B1F3A]">AT&T Command Center</h1><p className="text-gray-500 mt-1">Authorized dealer operations, order management, and territory performance</p></div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[{ label: "Active Subscribers", value: stats.subscribers.toLocaleString(), icon: Users, change: "+42" },{ label: "Orders (Month)", value: stats.ordersMonth.toString(), icon: FileText, change: "+23" },{ label: "Monthly Revenue", value: `$${(stats.revenue/1000).toFixed(0)}K`, icon: DollarSign, change: "+$18K" },{ label: "ARPU", value: `$${stats.arpu}`, icon: TrendingUp, change: "+$3.20" },{ label: "Activation Rate", value: `${stats.activationRate}%`, icon: CheckCircle, change: "+1%" },{ label: "Fiber Penetration", value: `${stats.fiberPenetration}%`, icon: Wifi, change: "+3%" }].map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-2"><s.icon size={16} className="text-[#F0A500]" /><span className="text-xs text-gray-500 font-medium">{s.label}</span></div><div className="text-xl font-bold text-[#0B1F3A]">{s.value}</div><div className="text-xs text-green-600 font-medium mt-1">{s.change}</div></div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {modules.map((m, i) => (
          <Link key={i} href={m.href} className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${m.color}`} /><div className="p-4"><div className="flex items-center gap-3 mb-2"><div className={`p-2 rounded-lg bg-gradient-to-r ${m.color} text-white`}><m.icon size={18} /></div><div><h3 className="font-semibold text-[#0B1F3A] group-hover:text-[#F0A500] transition-colors">{m.title}</h3><span className="text-xs text-gray-400">{m.stat}</span></div></div><p className="text-xs text-gray-500 mb-3">{m.desc}</p><div className="flex items-center text-xs text-[#F0A500] font-medium">Open Module <ArrowRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform" /></div></div>
          </Link>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"><h2 className="text-lg font-bold text-[#0B1F3A] mb-4">Recent Activity</h2><div className="space-y-3">{recentActivity.map((a, i) => (<div key={i} className="flex items-start gap-3 text-sm"><div className={`w-2 h-2 rounded-full mt-1.5 ${a.type === "success" ? "bg-green-500" : "bg-red-500"}`} /><span className="flex-1 text-gray-700">{a.msg}</span><span className="text-xs text-gray-400 whitespace-nowrap">{a.time}</span></div>))}</div></div>
    </div>
  );
}
