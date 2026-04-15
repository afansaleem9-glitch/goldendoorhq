"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { DollarSign, Users, TrendingUp, Target } from "lucide-react";

const STAGES = ["Prospect", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"];
const STAGE_COLORS: Record<string, string> = { Prospect: "border-t-gray-400", Qualified: "border-t-blue-500", Proposal: "border-t-purple-500", Negotiation: "border-t-amber-500", "Closed Won": "border-t-green-500", "Closed Lost": "border-t-red-400" };

const MOCK = [
  { id: "1", name: "Johnson Solar Install", stage_name: "Negotiation", amount: 42000, contact_name: "Marcus Johnson", close_date: "2025-04-30", priority: "High" },
  { id: "2", name: "Williams Security System", stage_name: "Proposal", amount: 8500, contact_name: "Patricia Williams", close_date: "2025-05-15", priority: "Medium" },
  { id: "3", name: "Chen Roof Replacement", stage_name: "Qualified", amount: 28000, contact_name: "Robert Chen", close_date: "2025-05-01", priority: "High" },
  { id: "4", name: "Davis AT&T Bundle", stage_name: "Prospect", amount: 3600, contact_name: "Sandra Davis", close_date: "2025-05-30", priority: "Low" },
  { id: "5", name: "Wilson Solar + Battery", stage_name: "Closed Won", amount: 56000, contact_name: "James Wilson", close_date: "2025-03-20", priority: "High" },
  { id: "6", name: "Martinez Security Upgrade", stage_name: "Closed Lost", amount: 5200, contact_name: "Angela Martinez", close_date: "2025-03-15", priority: "Medium" },
  { id: "7", name: "Thompson Full Home", stage_name: "Negotiation", amount: 78000, contact_name: "David Thompson", close_date: "2025-04-25", priority: "High" },
  { id: "8", name: "Anderson Solar Panels", stage_name: "Proposal", amount: 35000, contact_name: "Lisa Anderson", close_date: "2025-05-10", priority: "Medium" },
  { id: "9", name: "Garcia Roof Repair", stage_name: "Qualified", amount: 4500, contact_name: "Maria Garcia", close_date: "2025-04-28", priority: "Low" },
  { id: "10", name: "Lee Smart Home", stage_name: "Prospect", amount: 12000, contact_name: "Kevin Lee", close_date: "2025-06-01", priority: "Medium" },
];

export default function PipelinePage() {
  const [deals, setDeals] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("deals").select("*").eq("organization_id", ORG_ID).order("created_at", { ascending: false });
      setDeals(data && data.length > 0 ? data : MOCK);
    }
    load();
  }, []);

  const totalValue = deals.filter(d => !["Closed Won", "Closed Lost"].includes(d.stage_name)).reduce((s, d) => s + (d.amount || 0), 0);
  const wonValue = deals.filter(d => d.stage_name === "Closed Won").reduce((s, d) => s + (d.amount || 0), 0);
  const stats = [
    { label: "Pipeline Value", value: "$" + totalValue.toLocaleString(), icon: DollarSign, color: "text-blue-600" },
    { label: "Active Deals", value: deals.filter(d => !["Closed Won", "Closed Lost"].includes(d.stage_name)).length, icon: Target, color: "text-purple-600" },
    { label: "Won Revenue", value: "$" + wonValue.toLocaleString(), icon: TrendingUp, color: "text-green-600" },
    { label: "Win Rate", value: deals.length ? Math.round((deals.filter(d => d.stage_name === "Closed Won").length / deals.filter(d => d.stage_name === "Closed Won" || d.stage_name === "Closed Lost").length) * 100) + "%" : "0%", icon: Users, color: "text-amber-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#0B1F3A] to-[#1a3a5c] text-white px-8 py-8">
        <h1 className="text-2xl font-bold">Deal Pipeline</h1>
        <p className="text-blue-200 text-sm mt-1">Visual pipeline management</p>
      </div>
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">{stats.map(s => { const Icon = s.icon; return (<div key={s.label} className="bg-white rounded-xl border p-4"><div className="flex items-center gap-2 mb-1"><Icon size={16} className={s.color} /><span className="text-xs text-gray-500">{s.label}</span></div><div className="text-xl font-bold">{s.value}</div></div>);})}</div>
        <div className="flex gap-3 overflow-x-auto pb-4">
          {STAGES.map(stage => {
            const stageDeals = deals.filter(d => d.stage_name === stage);
            const stageTotal = stageDeals.reduce((s, d) => s + (d.amount || 0), 0);
            return (
              <div key={stage} className="min-w-[240px] flex-1">
                <div className="flex justify-between items-center mb-2 px-1"><h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">{stage}</h3><span className="text-xs text-gray-400">{stageDeals.length} · ${(stageTotal / 1000).toFixed(0)}k</span></div>
                <div className="space-y-2">
                  {stageDeals.map(d => (
                    <div key={d.id} className={`bg-white rounded-lg border-t-2 ${STAGE_COLORS[stage]} p-3 shadow-sm hover:shadow-md transition-shadow`}>
                      <p className="font-semibold text-sm truncate">{d.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{d.contact_name}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm font-bold text-green-600">${(d.amount || 0).toLocaleString()}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${d.priority === "High" ? "bg-red-50 text-red-600" : d.priority === "Medium" ? "bg-amber-50 text-amber-600" : "bg-gray-50 text-gray-500"}`}>{d.priority}</span>
                      </div>
                      {d.close_date && <p className="text-[10px] text-gray-400 mt-1">Close: {new Date(d.close_date).toLocaleDateString()}</p>}
                    </div>
                  ))}
                  {stageDeals.length === 0 && <div className="text-center py-8 text-xs text-gray-300 border border-dashed rounded-lg">No deals</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
