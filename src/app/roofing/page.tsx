"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import Link from "next/link";
import { Home, Users, Calculator, Wrench, ClipboardCheck, DollarSign, FileText, Camera, MapPin, Cloud, CreditCard, Phone, MessageSquare, BarChart3, Database, Plug, Truck, Shield, UserCheck, ArrowRight, TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react";

export default function RoofingHubPage() {
  const [stats, setStats] = useState({ jobs: 247, activeJobs: 34, revenue: 2840000, avgTicket: 11497, closeRate: 68, pendingClaims: 18 });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("roofing_jobs").select("id, status, estimate_amount").eq("org_id", ORG_ID);
      if (data && data.length > 0) {
        setStats({
          jobs: data.length,
          activeJobs: data.filter((j: any) => ["in_progress", "scheduled", "material_ordered"].includes(j.status)).length,
          revenue: data.filter((j: any) => j.status === "completed").reduce((a: number, j: any) => a + (j.estimate_amount || 0), 0),
          avgTicket: Math.round(data.reduce((a: number, j: any) => a + (j.estimate_amount || 0), 0) / Math.max(data.length, 1)),
          closeRate: 68,
          pendingClaims: data.filter((j: any) => j.insurance_claim && j.status !== "completed").length,
        });
      }
    })();
  }, []);

  const modules = [
    { title: "Leads & CRM", desc: "Lead intelligence, activity tracking, Lead API auto-import, pipeline management", icon: Users, href: "/roofing/leads", stat: `${stats.jobs} total leads`, color: "from-amber-600 to-amber-800" },
    { title: "Estimates", desc: "Template library, measurement auto-populate, profit margins, material integration", icon: Calculator, href: "/roofing/estimates", stat: `$${stats.avgTicket.toLocaleString()} avg ticket`, color: "from-blue-600 to-blue-800" },
    { title: "Production", desc: "Job tracking through milestones, live activity feed, crew scheduling, material ordering", icon: Wrench, href: "/roofing/production", stat: `${stats.activeJobs} active jobs`, color: "from-green-600 to-green-800" },
    { title: "Insurance Claims", desc: "Claims management, Xactimate integration, supplement tracking, adjuster coordination", icon: Shield, href: "/roofing/insurance-claims", stat: `${stats.pendingClaims} pending`, color: "from-red-600 to-red-800" },
    { title: "Scheduling", desc: "Shared calendar for crews, deliveries, inspections. Drag-and-drop scheduling", icon: ClipboardCheck, href: "/roofing/scheduling", stat: "12 this week", color: "from-purple-600 to-purple-800" },
    { title: "Job Costing", desc: "Revenue vs expenditures per job, profit/loss forecasting, margin tracking", icon: DollarSign, href: "/roofing/job-costing", stat: `$${(stats.revenue / 1000000).toFixed(1)}M revenue`, color: "from-emerald-600 to-emerald-800" },
    { title: "Aerial Measurements", desc: "EagleView, GAF QuickMeasure, Hover, Geospan, RoofScope integration", icon: MapPin, href: "/roofing/aerial-measurements", stat: "6 providers", color: "from-cyan-600 to-cyan-800" },
    { title: "Material Ordering", desc: "ABC Supply, SRS, QXO real-time catalogs with preferred pricing", icon: Truck, href: "/roofing/material-ordering", stat: "3 suppliers", color: "from-orange-600 to-orange-800" },
    { title: "SmartDocs", desc: "Document automation — contracts, proposals, change orders built in seconds", icon: FileText, href: "/roofing/smart-docs", stat: "24 templates", color: "from-indigo-600 to-indigo-800" },
    { title: "Photos", desc: "Photo capture, annotation, markup, before/after, crew sharing, CompanyCam sync", icon: Camera, href: "/roofing/photos", stat: "4,521 photos", color: "from-pink-600 to-pink-800" },
    { title: "Customer Portal", desc: "Self-service project view, payment processing, document sharing, messaging", icon: UserCheck, href: "/roofing/customer-portal", stat: "189 active", color: "from-teal-600 to-teal-800" },
    { title: "Text Messaging", desc: "Automated SMS, two-way texting, templates, appointment reminders", icon: MessageSquare, href: "/roofing/text-messaging", stat: "2,341 sent", color: "from-violet-600 to-violet-800" },
    { title: "Crew App", desc: "Mobile field access, job details, photo upload, time tracking, GPS", icon: Phone, href: "/roofing/crew-app", stat: "8 crews", color: "from-lime-600 to-lime-800" },
    { title: "AccuPay Payments", desc: "Stripe + PureFinance processing, financing options, payment links", icon: CreditCard, href: "/roofing/accupay", stat: "$342K collected", color: "from-rose-600 to-rose-800" },
    { title: "Weather Alerts", desc: "HailWatch, CoreLogic integration, storm mapping, affected property identification", icon: Cloud, href: "/roofing/weather-alerts", stat: "3 active alerts", color: "from-gray-600 to-gray-800" },
    { title: "Permits", desc: "Municipal permit tracking, inspection scheduling, compliance management", icon: ClipboardCheck, href: "/roofing/permits", stat: "8 pending", color: "from-sky-600 to-sky-800" },
    { title: "ReportsPlus", desc: "Sales, production, financial reports. Custom dashboards, KPI tracking", icon: BarChart3, href: "/roofing/reports-plus", stat: "Live data", color: "from-fuchsia-600 to-fuchsia-800" },
    { title: "DataMart", desc: "Complex dataset access, advanced analysis, data export, BI integration", icon: Database, href: "/roofing/datamart", stat: "247 records", color: "from-slate-600 to-slate-800" },
    { title: "Commissions", desc: "Sales rep commission calculation, payout approvals, tiered structures", icon: DollarSign, href: "/roofing/commissions", stat: "$89K paid", color: "from-yellow-600 to-yellow-800" },
    { title: "Financing", desc: "GreenSky, AccuFi, PureFinance — instant customer loan eligibility", icon: TrendingUp, href: "/roofing/financing", stat: "4 providers", color: "from-emerald-700 to-emerald-900" },
    { title: "Integrations", desc: "ABC Supply, GAF, Stripe, Tesla, RingCentral, Slack, PandaDoc, CompanyCam + 20 more", icon: Plug, href: "/roofing/integrations", stat: "28 connected", color: "from-violet-700 to-violet-900" },
  ];

  const recentActivity = [
    { msg: "Estimate #E-2024-089 signed — Williams Home ($18,750)", time: "5 min ago", type: "success" },
    { msg: "Hail alert: 2\" hail reported in Collin County, TX — 342 properties affected", time: "12 min ago", type: "alert" },
    { msg: "ABC Supply order delivered — Johnson Roof job", time: "30 min ago", type: "success" },
    { msg: "Insurance supplement approved — Garcia claim (+$4,200)", time: "1 hr ago", type: "success" },
    { msg: "Crew Alpha completed install at 8901 Walnut Ct", time: "2 hrs ago", type: "success" },
    { msg: "Weather hold: Rain forecast for Dallas jobs tomorrow", time: "3 hrs ago", type: "alert" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-amber-700 to-amber-950 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center gap-3 mb-2"><Home className="w-8 h-8 text-amber-300" /><h1 className="text-3xl font-bold">Roofing Command Center</h1></div>
        <p className="text-amber-200 text-lg">The world&apos;s most powerful roofing CRM. AccuLynx + JobNimbus + Roofr — all in one.</p>
        <div className="grid grid-cols-6 gap-4 mt-6">
          {[
            { label: "Total Jobs", val: stats.jobs.toLocaleString(), icon: Home },
            { label: "Active Jobs", val: stats.activeJobs, icon: Wrench },
            { label: "Revenue", val: `$${(stats.revenue / 1000000).toFixed(1)}M`, icon: DollarSign },
            { label: "Avg Ticket", val: `$${stats.avgTicket.toLocaleString()}`, icon: TrendingUp },
            { label: "Close Rate", val: `${stats.closeRate}%`, icon: CheckCircle },
            { label: "Pending Claims", val: stats.pendingClaims, icon: Shield },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <s.icon className="w-5 h-5 mb-1 text-amber-300" />
              <div className="text-2xl font-bold">{s.val}</div>
              <div className="text-amber-300/70 text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {modules.map((m) => (
          <Link key={m.title} href={m.href} className="group bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all overflow-hidden">
            <div className={`bg-gradient-to-r ${m.color} p-4 text-white`}>
              <m.icon className="w-6 h-6 mb-2" />
              <h2 className="text-lg font-bold">{m.title}</h2>
              <p className="text-white/70 text-xs">{m.stat}</p>
            </div>
            <div className="p-4">
              <p className="text-gray-600 text-xs">{m.desc}</p>
              <div className="flex items-center gap-1 mt-2 text-amber-600 text-xs font-medium group-hover:gap-2 transition-all">Open <ArrowRight className="w-3 h-3" /></div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Live Activity Feed</h2>
        <div className="space-y-3">
          {recentActivity.map((a, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                {a.type === "success" ? <CheckCircle className="w-5 h-5 text-green-500" /> : <AlertTriangle className="w-5 h-5 text-amber-500" />}
                <span className="text-sm text-gray-800">{a.msg}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500"><Clock className="w-3 h-3" /> {a.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
