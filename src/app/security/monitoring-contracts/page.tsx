"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { FileText, DollarSign, Users, RefreshCw, Search, Plus, Filter } from "lucide-react";

const mockContracts = [
  { id: 1, customer: "Johnson Family", address: "4521 Oak Lane, Dallas TX", plan: "Premium", monthly: 59.99, start: "2023-01-15", term: 48, autoRenew: true, status: "active" },
  { id: 2, customer: "Martinez Residence", address: "7892 Elm St, Plano TX", plan: "Standard", monthly: 39.99, start: "2023-06-01", term: 36, autoRenew: true, status: "active" },
  { id: 3, customer: "Williams Home", address: "1234 Birch Ave, Frisco TX", plan: "Premium", monthly: 54.99, start: "2022-03-10", term: 60, autoRenew: false, status: "active" },
  { id: 4, customer: "Garcia Family", address: "5678 Pine Ct, McKinney TX", plan: "Basic", monthly: 29.99, start: "2024-01-20", term: 36, autoRenew: true, status: "active" },
  { id: 5, customer: "Thompson LLC", address: "9012 Cedar Blvd, Allen TX", plan: "Standard", monthly: 44.99, start: "2021-11-15", term: 48, autoRenew: true, status: "expiring" },
  { id: 6, customer: "Davis Residence", address: "3456 Maple Dr, Richardson TX", plan: "Basic", monthly: 29.99, start: "2022-08-01", term: 36, autoRenew: false, status: "expired" },
  { id: 7, customer: "Anderson Home", address: "7890 Walnut Way, Garland TX", plan: "Premium", monthly: 64.99, start: "2023-09-01", term: 48, autoRenew: true, status: "active" },
  { id: 8, customer: "Brown Family", address: "2345 Spruce Ln, Carrollton TX", plan: "Standard", monthly: 39.99, start: "2024-02-15", term: 36, autoRenew: true, status: "pending" },
];

export default function MonitoringContractsPage() {
  const [contracts, setContracts] = useState(mockContracts);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("monitoring_contracts").select("*").eq("org_id", ORG_ID);
      if (data && data.length > 0) setContracts(data);
    })();
  }, []);
  const filtered = contracts.filter(c => (filter === "all" || c.status === filter) && (c.customer.toLowerCase().includes(search.toLowerCase()) || c.address.toLowerCase().includes(search.toLowerCase())));
  const totalRMR = contracts.filter(c => c.status === "active").reduce((a, c) => a + c.monthly, 0);
  const statusColors: Record<string, string> = { active: "bg-green-100 text-green-700", pending: "bg-blue-100 text-blue-700", expiring: "bg-yellow-100 text-yellow-700", expired: "bg-red-100 text-red-700", cancelled: "bg-gray-100 text-gray-700" };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-3xl font-bold text-[#0B1F3A]">Monitoring Contracts</h1><p className="text-gray-500 mt-1">Contract lifecycle management and RMR tracking</p></div>
        <button className="bg-[#F0A500] text-[#0B1F3A] font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-500"><Plus size={18} /> New Contract</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{ label: "Total RMR", value: `$${totalRMR.toFixed(2)}`, icon: DollarSign }, { label: "Active Contracts", value: contracts.filter(c=>c.status==="active").length.toString(), icon: FileText }, { label: "Avg Contract Value", value: `$${(totalRMR / Math.max(contracts.filter(c=>c.status==="active").length,1)).toFixed(2)}/mo`, icon: Users }, { label: "Renewal Rate", value: "94%", icon: RefreshCw }].map((s,i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-1"><s.icon size={16} className="text-[#F0A500]" /><span className="text-xs text-gray-500">{s.label}</span></div><div className="text-2xl font-bold text-[#0B1F3A]">{s.value}</div></div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Search contracts..." /></div>
          <div className="flex gap-2">{["all","active","pending","expiring","expired"].map(f => <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-lg text-xs font-medium capitalize ${filter===f ? "bg-[#0B1F3A] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{f}</button>)}</div>
        </div>
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-gray-100">{["Customer","Address","Plan","Monthly","Term","Start Date","Auto-Renew","Status"].map(h => <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead><tbody>{filtered.map(c => (
          <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50"><td className="py-3 px-3 font-medium text-[#0B1F3A]">{c.customer}</td><td className="py-3 px-3 text-gray-600">{c.address}</td><td className="py-3 px-3"><span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">{c.plan}</span></td><td className="py-3 px-3 font-semibold">${c.monthly}</td><td className="py-3 px-3">{c.term} mo</td><td className="py-3 px-3 text-gray-500">{c.start}</td><td className="py-3 px-3">{c.autoRenew ? <span className="text-green-600 font-medium">Yes</span> : <span className="text-gray-400">No</span>}</td><td className="py-3 px-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[c.status] || ""}`}>{c.status}</span></td></tr>
        ))}</tbody></table></div>
      </div>
    </div>
  );
}
