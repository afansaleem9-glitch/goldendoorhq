"use client";
import { useState } from "react";
import { Search, BookOpen, Eye, ThumbsUp, ChevronDown } from "lucide-react";

const CATEGORIES = [
  { name: "Getting Started", count: 5, color: "bg-blue-100 text-blue-700" },
  { name: "Solar", count: 8, color: "bg-amber-100 text-amber-700" },
  { name: "Security", count: 6, color: "bg-purple-100 text-purple-700" },
  { name: "Roofing", count: 4, color: "bg-orange-100 text-orange-700" },
  { name: "AT&T", count: 3, color: "bg-sky-100 text-sky-700" },
  { name: "Billing", count: 4, color: "bg-green-100 text-green-700" },
  { name: "Technical", count: 5, color: "bg-red-100 text-red-700" },
];

const ARTICLES = [
  { id: "1", title: "Welcome to Delta Power Group", category: "Getting Started", views: 3240, helpful: 89, updated: "2025-04-01" },
  { id: "2", title: "How Solar Net Metering Works", category: "Solar", views: 2890, helpful: 156, updated: "2025-03-28" },
  { id: "3", title: "Understanding Your Solar Production", category: "Solar", views: 2340, helpful: 132, updated: "2025-03-25" },
  { id: "4", title: "Setting Up Your Security Panel", category: "Security", views: 1890, helpful: 98, updated: "2025-04-05" },
  { id: "5", title: "Monitoring Your Security System", category: "Security", views: 1567, helpful: 76, updated: "2025-03-20" },
  { id: "6", title: "Roof Maintenance Tips", category: "Roofing", views: 1234, helpful: 67, updated: "2025-03-15" },
  { id: "7", title: "Filing an Insurance Claim", category: "Roofing", views: 2100, helpful: 145, updated: "2025-04-02" },
  { id: "8", title: "AT&T Plan Comparison Guide", category: "AT&T", views: 987, helpful: 54, updated: "2025-03-18" },
  { id: "9", title: "Understanding Your Bill", category: "Billing", views: 3450, helpful: 201, updated: "2025-04-03" },
  { id: "10", title: "Payment Options and AutoPay", category: "Billing", views: 2670, helpful: 178, updated: "2025-03-30" },
  { id: "11", title: "Solar Inverter Troubleshooting", category: "Technical", views: 1780, helpful: 112, updated: "2025-04-04" },
  { id: "12", title: "WiFi Camera Setup Guide", category: "Technical", views: 1450, helpful: 89, updated: "2025-03-22" },
  { id: "13", title: "Referral Program FAQ", category: "Getting Started", views: 2100, helpful: 156, updated: "2025-04-01" },
  { id: "14", title: "Solar Tax Credits Explained", category: "Solar", views: 4200, helpful: 298, updated: "2025-04-06" },
  { id: "15", title: "Smart Home Integration Guide", category: "Security", views: 1340, helpful: 72, updated: "2025-03-19" },
];

export default function KnowledgeBasePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = ARTICLES.filter(a => {
    const ms = search === "" || a.title.toLowerCase().includes(search.toLowerCase());
    const mc = selectedCategory === "All" || a.category === selectedCategory;
    return ms && mc;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 text-white px-8 py-8">
        <h1 className="text-2xl font-bold">Knowledge Base</h1>
        <p className="text-indigo-200 text-sm mt-1">Help articles and documentation</p>
        <div className="mt-4 flex items-center bg-white/10 rounded-lg px-4 py-2 max-w-lg">
          <Search size={18} className="text-white/60 mr-3" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles..." className="bg-transparent outline-none text-white placeholder-white/40 flex-1" />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setSelectedCategory("All")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedCategory === "All" ? "bg-indigo-600 text-white" : "bg-white border text-gray-600 hover:bg-gray-50"}`}>All ({ARTICLES.length})</button>
          {CATEGORIES.map(c => <button key={c.name} onClick={() => setSelectedCategory(c.name)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedCategory === c.name ? "bg-indigo-600 text-white" : "bg-white border text-gray-600 hover:bg-gray-50"}`}>{c.name} ({c.count})</button>)}
        </div>
        <div className="space-y-2">
          {filtered.map(a => (
            <div key={a.id} className="bg-white rounded-lg border p-4 hover:shadow-sm transition-shadow flex items-center gap-4 cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0"><BookOpen size={18} className="text-indigo-600" /></div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm">{a.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${CATEGORIES.find(c => c.name === a.category)?.color || "bg-gray-100"}`}>{a.category}</span>
                  <span className="flex items-center gap-1"><Eye size={11} />{a.views.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><ThumbsUp size={11} />{a.helpful}</span>
                  <span>Updated {new Date(a.updated).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No articles found</div>}
        </div>
      </div>
    </div>
  );
}
