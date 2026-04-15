"use client";
import { useState } from "react";
import { Shield, Search, Plus, Filter, ChevronDown, Phone, Mail, MapPin, Star, Eye } from "lucide-react";

const LEADS = [
  { id: 1, name: "Carlos Rivera", email: "carlos.r@gmail.com", phone: "(214) 555-1001", address: "3421 Elm St, Dallas, TX 75201", score: 85, source: "Door-to-Door", status: "Qualified", rep: "Marcus Johnson", created: "Apr 10, 2026" },
  { id: 2, name: "Patricia Young", email: "pyoung@yahoo.com", phone: "(817) 555-2002", address: "1890 University Dr, Fort Worth, TX 76107", score: 72, source: "Referral", status: "Contacted", rep: "David Park", created: "Apr 9, 2026" },
  { id: 3, name: "Steven Clark", email: "sclark@gmail.com", phone: "(440) 555-3003", address: "5670 Pearl Rd, Cleveland, OH 44129", score: 90, source: "Website", status: "New", rep: "Sarah Chen", created: "Apr 12, 2026" },
  { id: 4, name: "Maria Gonzalez", email: "mgonzalez@outlook.com", phone: "(313) 555-4004", address: "2340 Michigan Ave, Detroit, MI 48216", score: 68, source: "Canvassing", status: "Contacted", rep: "Lisa Rodriguez", created: "Apr 8, 2026" },
  { id: 5, name: "David Lee", email: "dlee88@gmail.com", phone: "(972) 555-5005", address: "7890 Preston Rd, Plano, TX 75024", score: 95, source: "Solar Cross-Sell", status: "Qualified", rep: "Marcus Johnson", created: "Apr 11, 2026" },
  { id: 6, name: "Ashley White", email: "awhite@gmail.com", phone: "(614) 555-6006", address: "4560 Broad St, Columbus, OH 43215", score: 60, source: "Door-to-Door", status: "New", rep: "Sarah Chen", created: "Apr 13, 2026" },
  { id: 7, name: "Ryan Thompson", email: "rthompson@yahoo.com", phone: "(214) 555-7007", address: "9012 Mockingbird Ln, Dallas, TX 75214", score: 78, source: "AT&T Bundle", status: "Proposal Sent", rep: "David Park", created: "Apr 7, 2026" },
  { id: 8, name: "Nicole Harris", email: "nharris@outlook.com", phone: "(734) 555-8008", address: "3456 Washtenaw, Ann Arbor, MI 48104", score: 55, source: "Canvassing", status: "New", rep: "Lisa Rodriguez", created: "Apr 14, 2026" },
  { id: 9, name: "Brandon Moore", email: "bmoore@gmail.com", phone: "(216) 555-9009", address: "7890 Euclid Ave, Cleveland, OH 44106", score: 82, source: "Referral", status: "Contacted", rep: "Sarah Chen", created: "Apr 6, 2026" },
  { id: 10, name: "Stephanie King", email: "sking@gmail.com", phone: "(469) 555-1010", address: "2345 Legacy Dr, Frisco, TX 75034", score: 88, source: "Website", status: "Qualified", rep: "Marcus Johnson", created: "Apr 5, 2026" },
];

const STATUS_COLORS: Record<string, string> = {
  New: "bg-blue-50 text-blue-700", Contacted: "bg-amber-50 text-amber-700", Qualified: "bg-green-50 text-green-700",
  "Proposal Sent": "bg-purple-50 text-purple-700", Won: "bg-green-100 text-green-800", Lost: "bg-red-50 text-red-700",
};

export default function SecurityLeads() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const filtered = LEADS.filter(l => {
    const matchSearch = search === "" || `${l.name} ${l.email} ${l.address}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-purple-900 to-purple-700 px-6 py-6">
        <div className="max-w-[1440px] mx-auto">
          <h1 className="text-xl font-bold text-white flex items-center gap-2"><Shield size={20} /> Security Leads</h1>
          <p className="text-purple-200 text-sm mt-1">{LEADS.length} leads in pipeline</p>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-6 py-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 max-w-md focus-within:border-purple-500">
            <Search size={14} className="text-gray-400 mr-2" />
            <input type="text" placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 text-sm outline-none bg-transparent text-black" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none bg-white text-black">
            <option value="all">All Status</option><option value="New">New</option><option value="Contacted">Contacted</option><option value="Qualified">Qualified</option><option value="Proposal Sent">Proposal Sent</option>
          </select>
          <button className="ml-auto px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 flex items-center gap-1"><Plus size={14} /> Add Lead</button>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Name</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Address</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500">Score</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Source</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Status</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Rep</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Created</th>
            </tr></thead>
            <tbody>{filtered.map(l => (
              <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 px-4"><p className="font-semibold text-black">{l.name}</p><p className="text-[11px] text-gray-500">{l.email}</p></td>
                <td className="py-3 px-4 text-xs text-gray-600">{l.address}</td>
                <td className="py-3 px-4 text-center"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${l.score >= 80 ? "bg-green-50 text-green-700" : l.score >= 60 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}>{l.score}</span></td>
                <td className="py-3 px-4 text-xs text-gray-600">{l.source}</td>
                <td className="py-3 px-4"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[l.status] || ""}`}>{l.status}</span></td>
                <td className="py-3 px-4 text-xs text-gray-600">{l.rep}</td>
                <td className="py-3 px-4 text-xs text-gray-500">{l.created}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
