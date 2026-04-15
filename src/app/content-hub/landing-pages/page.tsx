"use client";
import { useState } from "react";
import { Eye, Users, Target, Globe, ExternalLink } from "lucide-react";

const PAGES = [
  { id: "1", name: "Solar Installation - Texas", slug: "/solar-texas", status: "Published", views: 12400, submissions: 456, conversion: 3.7, color: "bg-amber-400" },
  { id: "2", name: "Smart Home Security", slug: "/home-security", status: "Published", views: 8900, submissions: 312, conversion: 3.5, color: "bg-purple-400" },
  { id: "3", name: "Free Roof Inspection", slug: "/roof-inspection", status: "Published", views: 6700, submissions: 567, conversion: 8.5, color: "bg-orange-400" },
  { id: "4", name: "AT&T Bundle Deals", slug: "/att-bundle", status: "Published", views: 4200, submissions: 189, conversion: 4.5, color: "bg-blue-400" },
  { id: "5", name: "Solar + Battery Package", slug: "/solar-battery", status: "Published", views: 5600, submissions: 234, conversion: 4.2, color: "bg-yellow-400" },
  { id: "6", name: "Referral Program", slug: "/refer", status: "Published", views: 3800, submissions: 298, conversion: 7.8, color: "bg-green-400" },
  { id: "7", name: "Holiday Promo 2025", slug: "/holiday-promo", status: "Draft", views: 0, submissions: 0, conversion: 0, color: "bg-red-400" },
  { id: "8", name: "Commercial Solar", slug: "/commercial-solar", status: "Draft", views: 0, submissions: 0, conversion: 0, color: "bg-teal-400" },
];

export default function LandingPagesPage() {
  const [pages] = useState(PAGES);
  const published = pages.filter(p => p.status === "Published");
  const totalViews = published.reduce((s, p) => s + p.views, 0);
  const totalSubs = published.reduce((s, p) => s + p.submissions, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-teal-800 to-emerald-700 text-white px-8 py-8">
        <h1 className="text-2xl font-bold">Landing Pages</h1>
        <p className="text-teal-200 text-sm mt-1">Manage and track landing page performance</p>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-4"><div className="flex items-center gap-2 mb-1"><Globe size={16} className="text-teal-600" /><span className="text-xs text-gray-500">Total Pages</span></div><div className="text-xl font-bold">{pages.length}</div></div>
          <div className="bg-white rounded-xl border p-4"><div className="flex items-center gap-2 mb-1"><Eye size={16} className="text-blue-600" /><span className="text-xs text-gray-500">Total Views</span></div><div className="text-xl font-bold">{totalViews.toLocaleString()}</div></div>
          <div className="bg-white rounded-xl border p-4"><div className="flex items-center gap-2 mb-1"><Users size={16} className="text-green-600" /><span className="text-xs text-gray-500">Submissions</span></div><div className="text-xl font-bold">{totalSubs.toLocaleString()}</div></div>
          <div className="bg-white rounded-xl border p-4"><div className="flex items-center gap-2 mb-1"><Target size={16} className="text-purple-600" /><span className="text-xs text-gray-500">Avg Conversion</span></div><div className="text-xl font-bold">{published.length ? (published.reduce((s, p) => s + p.conversion, 0) / published.length).toFixed(1) : 0}%</div></div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pages.map(p => (
            <div key={p.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow">
              <div className={`h-32 ${p.color} flex items-center justify-center`}><Globe size={32} className="text-white/60" /></div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-1"><h3 className="font-semibold text-sm">{p.name}</h3><span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${p.status === "Published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{p.status}</span></div>
                <p className="text-xs text-gray-400 flex items-center gap-1"><ExternalLink size={11} />{p.slug}</p>
                {p.status === "Published" && (
                  <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                    <div><div className="text-sm font-bold">{(p.views / 1000).toFixed(1)}k</div><div className="text-[10px] text-gray-400">Views</div></div>
                    <div><div className="text-sm font-bold">{p.submissions}</div><div className="text-[10px] text-gray-400">Leads</div></div>
                    <div><div className="text-sm font-bold text-green-600">{p.conversion}%</div><div className="text-[10px] text-gray-400">Conv</div></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
