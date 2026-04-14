"use client";
import { useState } from "react";
import { companies } from "@/lib/mock-data";
import { Search, Plus, Building2, Globe, Users, Handshake } from "lucide-react";

const typeColors: Record<string, string> = {
  customer: "bg-green-100 text-green-700",
  prospect: "bg-blue-100 text-blue-700",
  partner: "bg-purple-100 text-purple-700",
  vendor: "bg-yellow-100 text-yellow-700",
};

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export default function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [view, setView] = useState<"grid" | "table">("grid");

  const filtered = companies.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !q || `${c.name} ${c.domain} ${c.industry}`.toLowerCase().includes(q);
    const matchType = typeFilter === "all" || c.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F3A]">Companies</h1>
          <p className="text-sm text-[#9CA3AF]">{filtered.length} companies</p>
        </div>
        <button className="btn-primary"><Plus size={16} /> Add company</button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center bg-white rounded-lg border border-[#E5E7EB] px-3 py-2 flex-1 max-w-md">
          <Search size={16} className="text-[#9CA3AF] mr-2" />
          <input type="text" placeholder="Search companies..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none w-full text-[#0B1F3A] placeholder-[#9CA3AF]" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="text-sm border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white text-[#0B1F3A] outline-none">
          <option value="all">All types</option>
          <option value="customer">Customer</option>
          <option value="prospect">Prospect</option>
          <option value="partner">Partner</option>
          <option value="vendor">Vendor</option>
        </select>
        <div className="flex items-center border border-[#E5E7EB] rounded-lg overflow-hidden">
          <button onClick={() => setView("grid")} className={`px-3 py-2 text-sm ${view === "grid" ? "bg-[#0B1F3A] text-white" : "bg-white text-[#0B1F3A]"}`}>Grid</button>
          <button onClick={() => setView("table")} className={`px-3 py-2 text-sm ${view === "table" ? "bg-[#0B1F3A] text-white" : "bg-white text-[#0B1F3A]"}`}>Table</button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <div key={c.id} className="card cursor-pointer hover:border-[#F0A500]/50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0B1F3A] flex items-center justify-center">
                    <Building2 size={18} className="text-[#F0A500]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0B1F3A]">{c.name}</h3>
                    <p className="text-xs text-[#9CA3AF] flex items-center gap-1"><Globe size={10} /> {c.domain}</p>
                  </div>
                </div>
                <span className={`badge text-xs ${typeColors[c.type] || "bg-gray-100 text-gray-700"}`}>{c.type}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#9CA3AF]">Industry</span><span className="text-[#0B1F3A] font-medium">{c.industry}</span></div>
                <div className="flex justify-between"><span className="text-[#9CA3AF]">Revenue</span><span className="text-[#0B1F3A] font-medium">{fmt(c.annual_revenue)}</span></div>
                <div className="flex justify-between"><span className="text-[#9CA3AF]">Size</span><span className="text-[#0B1F3A] font-medium">{c.company_size}</span></div>
                <div className="flex justify-between"><span className="text-[#9CA3AF]">Location</span><span className="text-[#0B1F3A] font-medium">{c.city}, {c.state}</span></div>
              </div>
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]"><Users size={12} /> {c.contacts_count} contacts</div>
                <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]"><Handshake size={12} /> {c.deals_count} deals</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-gray-50/50">
                  {["Company", "Industry", "Type", "Revenue", "Size", "Location", "Contacts", "Deals", "Owner"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="table-row border-b border-gray-50 cursor-pointer">
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded bg-[#0B1F3A] flex items-center justify-center"><Building2 size={14} className="text-[#F0A500]" /></div><div><p className="font-medium text-[#0B1F3A]">{c.name}</p><p className="text-xs text-[#9CA3AF]">{c.domain}</p></div></div></td>
                    <td className="px-4 py-3 text-[#0B1F3A]">{c.industry}</td>
                    <td className="px-4 py-3"><span className={`badge text-xs ${typeColors[c.type] || "bg-gray-100 text-gray-700"}`}>{c.type}</span></td>
                    <td className="px-4 py-3 text-[#0B1F3A] font-medium">{fmt(c.annual_revenue)}</td>
                    <td className="px-4 py-3 text-[#0B1F3A]">{c.company_size}</td>
                    <td className="px-4 py-3 text-[#0B1F3A] whitespace-nowrap">{c.city}, {c.state}</td>
                    <td className="px-4 py-3 text-center text-[#0B1F3A]">{c.contacts_count}</td>
                    <td className="px-4 py-3 text-center text-[#0B1F3A]">{c.deals_count}</td>
                    <td className="px-4 py-3 text-[#0B1F3A]">{c.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
