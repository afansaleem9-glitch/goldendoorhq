"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import Link from "next/link";
import { Database, RefreshCw, Shield, Zap, ArrowRight, CheckCircle, AlertTriangle, Clock } from "lucide-react";

export default function DataHubPage() {
  const [syncStats, setSyncStats] = useState({ total: 0, active: 0, errors: 0 });
  const [qualityScore, setQualityScore] = useState(87);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("data_sync_connections").select("id, status").eq("org_id", ORG_ID);
      if (data && data.length > 0) {
        setSyncStats({
          total: data.length,
          active: data.filter((d: any) => d.status === "active").length,
          errors: data.filter((d: any) => d.status === "error").length,
        });
      } else {
        setSyncStats({ total: 12, active: 10, errors: 2 });
      }
    })();
  }, []);

  const hubs = [
    { title: "Data Sync", desc: "Sync data across all your tools in real-time. Two-way sync keeps everything up to date.", icon: RefreshCw, href: "/data-hub/data-sync", stat: `${syncStats.active} active syncs`, color: "from-blue-600 to-blue-800" },
    { title: "Data Quality", desc: "Automatically find and fix data issues. Dedup contacts, format properties, validate entries.", icon: Shield, href: "/data-hub/data-quality", stat: `${qualityScore}% quality score`, color: "from-emerald-600 to-emerald-800" },
    { title: "Programmable Automation", desc: "Build custom automations with JavaScript. Webhooks, data transforms, conditional logic.", icon: Zap, href: "/data-hub/automation", stat: "24 active workflows", color: "from-purple-600 to-purple-800" },
  ];

  const recentActivity = [
    { type: "sync", msg: "HubSpot → GoldenDoor contacts synced", time: "2 min ago", status: "success" },
    { type: "quality", msg: "Removed 47 duplicate contacts", time: "15 min ago", status: "success" },
    { type: "automation", msg: "Lead scoring workflow triggered", time: "32 min ago", status: "success" },
    { type: "sync", msg: "Stripe payments sync failed", time: "1 hr ago", status: "error" },
    { type: "quality", msg: "Phone number formatting completed", time: "2 hrs ago", status: "success" },
    { type: "automation", msg: "Deal stage automation ran for 12 deals", time: "3 hrs ago", status: "success" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-700 to-blue-900 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Database className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Data Hub</h1>
        </div>
        <p className="text-indigo-200 text-lg">Sync, clean, and automate your data across every tool in your stack.</p>
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[
            { label: "Total Syncs", val: syncStats.total, icon: RefreshCw },
            { label: "Active", val: syncStats.active, icon: CheckCircle },
            { label: "Errors", val: syncStats.errors, icon: AlertTriangle },
            { label: "Quality Score", val: `${qualityScore}%`, icon: Shield },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 rounded-xl p-4">
              <s.icon className="w-5 h-5 mb-1 text-indigo-200" />
              <div className="text-2xl font-bold">{s.val}</div>
              <div className="text-indigo-200 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {hubs.map((h) => (
          <Link key={h.title} href={h.href} className="group bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all overflow-hidden">
            <div className={`bg-gradient-to-r ${h.color} p-6 text-white`}>
              <h.icon className="w-8 h-8 mb-3" />
              <h2 className="text-xl font-bold">{h.title}</h2>
              <p className="text-white/80 text-sm mt-1">{h.stat}</p>
            </div>
            <div className="p-5">
              <p className="text-gray-600 text-sm">{h.desc}</p>
              <div className="flex items-center gap-1 mt-3 text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
                Open <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.map((a, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                {a.status === "success" ? <CheckCircle className="w-5 h-5 text-green-500" /> : <AlertTriangle className="w-5 h-5 text-red-500" />}
                <span className="text-sm text-gray-800">{a.msg}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" /> {a.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
