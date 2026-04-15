"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import Link from "next/link";
import { Sun, Zap, Battery, DollarSign, FileText, Wrench, Users, BarChart3, ClipboardCheck, TrendingUp, ArrowRight, CheckCircle, Package, Plug } from "lucide-react";

export default function SolarHubPage() {
  const [stats, setStats] = useState({ installs: 423, activeProjects: 28, revenue: 8200000, avgSize: 8.4, closeRate: 34, kwhProduced: 2100000 });
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("solar_installations").select("id, status, system_size_kw, total_cost").eq("org_id", ORG_ID);
      if (data && data.length > 0) {
        setStats({ installs: data.length, activeProjects: data.filter((d: any) => !["completed","cancelled"].includes(d.status)).length, revenue: data.reduce((a: number, d: any) => a + (d.total_cost || 0), 0), avgSize: Math.round((data.reduce((a: number, d: any) => a + (d.system_size_kw || 0), 0) / Math.max(data.length, 1)) * 10) / 10, closeRate: 34, kwhProduced: 2100000 });
      }
    })();
  }, []);
  const modules = [
    { title: "Proposals", desc: "Solar proposal builder with equipment selection and pricing", icon: FileText, href: "/solar/proposals", stat: "89 sent", color: "from-amber-600 to-amber-800" },
    { title: "System Design", desc: "Roof layout, panel placement, string sizing, production estimates", icon: Sun, href: "/solar/system-design", stat: "8.4kW avg", color: "from-yellow-500 to-yellow-700" },
    { title: "Financing", desc: "Sunlight, GoodLeap, Mosaic — loan, lease, and PPA options", icon: DollarSign, href: "/solar/financing", stat: "5 lenders", color: "from-green-600 to-green-800" },
    { title: "Utility Rates", desc: "Rate schedules, net metering, savings calculator by utility", icon: Zap, href: "/solar/utility-rates", stat: "6 utilities", color: "from-blue-600 to-blue-800" },
    { title: "Interconnection", desc: "Utility applications, engineering review, PTO tracking", icon: Plug, href: "/solar/interconnection", stat: "18 pending", color: "from-purple-600 to-purple-800" },
    { title: "Production Monitoring", desc: "Fleet monitoring, performance ratios, underperformance alerts", icon: BarChart3, href: "/solar/production-monitoring", stat: "2.1M kWh", color: "from-orange-600 to-orange-800" },
    { title: "Battery Storage", desc: "Powerwall, Enphase, Franklin — storage add-on sales", icon: Battery, href: "/solar/battery-storage", stat: "34% attach", color: "from-teal-600 to-teal-800" },
    { title: "Incentives", desc: "ITC, state credits, utility rebates, SREC tracking", icon: TrendingUp, href: "/solar/incentives", stat: "30% ITC", color: "from-emerald-600 to-emerald-800" },
    { title: "Installer Portal", desc: "Subcontractor management, certifications, job assignment", icon: Wrench, href: "/solar/installer-portal", stat: "12 crews", color: "from-red-600 to-red-800" },
    { title: "Customer Portal", desc: "Production dashboard, savings tracker, documents, referrals", icon: Users, href: "/solar/customer-portal", stat: "312 active", color: "from-cyan-600 to-cyan-800" },
    { title: "Inventory", desc: "Panels, inverters, racking, BOS — stock levels and POs", icon: Package, href: "/solar/inventory", stat: "847 SKUs", color: "from-indigo-600 to-indigo-800" },
    { title: "Permits", desc: "Building/electrical permits, jurisdiction tracking, inspections", icon: ClipboardCheck, href: "/solar/permits", stat: "14 pending", color: "from-pink-600 to-pink-800" },
  ];
  const recentActivity = [
    { msg: "Proposal signed — Garcia residence (9.6kW, $28,400)", time: "8 min ago", type: "success" },
    { msg: "PTO granted — Johnson solar (Oncor, 7.2kW)", time: "25 min ago", type: "success" },
    { msg: "GoodLeap financing approved — Williams ($32,000, 2.99%)", time: "45 min ago", type: "success" },
    { msg: "Production alert: Martinez system underperforming 15%", time: "1 hr ago", type: "alert" },
    { msg: "Install completed — 4521 Birch Lane (8.4kW + Powerwall)", time: "2 hrs ago", type: "success" },
    { msg: "Permit approved — City of Plano (building + electrical)", time: "3 hrs ago", type: "success" },
  ];
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8"><h1 className="text-3xl font-bold text-[#0B1F3A]">Solar Command Center</h1><p className="text-gray-500 mt-1">System design, installation tracking, and production monitoring</p></div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[{ label: "Total Installs", value: stats.installs.toLocaleString(), icon: Sun, change: "+18" },{ label: "Active Projects", value: stats.activeProjects.toString(), icon: Wrench, change: "+5" },{ label: "Revenue", value: `$${(stats.revenue/1000000).toFixed(1)}M`, icon: DollarSign, change: "+$420K" },{ label: "Avg System Size", value: `${stats.avgSize}kW`, icon: Zap, change: "+0.3kW" },{ label: "Close Rate", value: `${stats.closeRate}%`, icon: TrendingUp, change: "+2%" },{ label: "kWh Produced", value: `${(stats.kwhProduced/1000000).toFixed(1)}M`, icon: Battery, change: "+180K" }].map((s, i) => (
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
