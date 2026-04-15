"use client";
import { useState } from "react";
import {
  FileSignature, Search, Plus, Filter, Download, Eye,
  Clock, CheckCircle2, AlertCircle, XCircle, Send,
  Edit2, Copy, DollarSign
} from "lucide-react";

interface ContractItem {
  id: string;
  contract_number: string;
  title: string;
  contract_type: string;
  status: "draft" | "sent" | "signed" | "active" | "expired" | "cancelled";
  contact_name: string;
  project_name: string;
  amount: number;
  start_date: string;
  end_date: string;
  created_at: string;
  vertical: string;
}

const MOCK_CONTRACTS: ContractItem[] = [
  { id: "ct1", contract_number: "DPG-2026-001", title: "Solar Installation Agreement — Martinez", contract_type: "Solar HIC", status: "active", contact_name: "Robert Martinez", project_name: "Martinez Solar 12kW", amount: 42800, start_date: "Feb 1, 2026", end_date: "Feb 1, 2027", created_at: "Jan 15, 2026", vertical: "Solar" },
  { id: "ct2", contract_number: "DPG-2026-002", title: "Smart Home Monitoring — Garcia", contract_type: "Monitoring Agreement", status: "active", contact_name: "Carlos Garcia", project_name: "Garcia Smart Home", amount: 49.99, start_date: "Jan 30, 2026", end_date: "Jan 30, 2029", created_at: "Jan 28, 2026", vertical: "Smart Home" },
  { id: "ct3", contract_number: "DPG-2026-003", title: "Solar PPA — Williams", contract_type: "Solar PPA", status: "sent", contact_name: "Jennifer Williams", project_name: "Williams Solar 9.6kW", amount: 38400, start_date: "—", end_date: "—", created_at: "Mar 2, 2026", vertical: "Solar" },
  { id: "ct4", contract_number: "DPG-2026-004", title: "Roof Replacement — Brown", contract_type: "Roofing HIC", status: "signed", contact_name: "James Brown", project_name: "Brown Roof Replacement", amount: 18900, start_date: "Apr 14, 2026", end_date: "Apr 30, 2026", created_at: "Mar 15, 2026", vertical: "Roofing" },
  { id: "ct5", contract_number: "DPG-2026-005", title: "Solar Installation — Johnson", contract_type: "Solar HIC", status: "active", contact_name: "Sarah Johnson", project_name: "Johnson Solar 8.5kW", amount: 34200, start_date: "Nov 10, 2025", end_date: "Nov 10, 2026", created_at: "Nov 5, 2025", vertical: "Solar" },
  { id: "ct6", contract_number: "DPG-2026-006", title: "Smart Home + Monitoring — Davis", contract_type: "Equipment + Monitoring", status: "active", contact_name: "Amanda Davis", project_name: "Davis Smart Home", amount: 4200, start_date: "Dec 10, 2025", end_date: "Dec 10, 2028", created_at: "Dec 8, 2025", vertical: "Smart Home" },
  { id: "ct7", contract_number: "DPG-2026-007", title: "Solar Bundle Proposal — Wilson", contract_type: "Solar + AT&T Bundle", status: "draft", contact_name: "Emily Wilson", project_name: "Wilson Bundle", amount: 47600, start_date: "—", end_date: "—", created_at: "Apr 10, 2026", vertical: "Solar" },
  { id: "ct8", contract_number: "DPG-2026-008", title: "Solar Installation — Thompson", contract_type: "Solar HIC", status: "draft", contact_name: "Michael Thompson", project_name: "Thompson Roof + Solar", amount: 52100, start_date: "—", end_date: "—", created_at: "Apr 12, 2026", vertical: "Solar" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-600" },
  sent: { label: "Sent", color: "bg-blue-50 text-blue-700" },
  signed: { label: "Signed", color: "bg-amber-50 text-amber-700" },
  active: { label: "Active", color: "bg-green-50 text-green-700" },
  expired: { label: "Expired", color: "bg-red-50 text-red-600" },
  cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-500" },
};

export default function ContractsPage() {
  const [contracts] = useState(MOCK_CONTRACTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = contracts.filter(c => {
    const matchSearch = search === "" || c.title.toLowerCase().includes(search.toLowerCase()) || c.contact_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalActive = contracts.filter(c => c.status === "active").length;
  const totalValue = contracts.reduce((s, c) => s + c.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black flex items-center gap-2"><FileSignature size={24} /> Contracts</h1>
            <p className="text-sm text-gray-500 mt-1">{totalActive} active · ${totalValue > 1000 ? `${(totalValue / 1000).toFixed(1)}K` : totalValue.toFixed(2)} total value</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"><Download size={14} /> Export</button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800"><Plus size={14} /> New Contract</button>
          </div>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Contracts", value: contracts.length },
            { label: "Active", value: totalActive },
            { label: "Pending Signature", value: contracts.filter(c => c.status === "sent").length },
            { label: "Drafts", value: contracts.filter(c => c.status === "draft").length },
          ].map(k => (
            <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-3xl font-bold text-black">{k.value}</p>
              <p className="text-xs text-gray-500 mt-1">{k.label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 max-w-md focus-within:border-black transition-all">
            <Search size={14} className="text-gray-500 mr-2" />
            <input type="text" placeholder="Search contracts..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 text-sm outline-none bg-transparent text-black placeholder-gray-400" aria-label="Search contracts" />
          </div>
          {["all", "active", "signed", "sent", "draft"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${statusFilter === s ? "bg-black text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-gray-200/60 bg-gray-50/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Contract #</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Title</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Dates</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(contract => {
                const sc = STATUS_CONFIG[contract.status];
                return (
                  <tr key={contract.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-gray-500">{contract.contract_number}</td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-black">{contract.title}</p>
                      <p className="text-xs text-gray-500">{contract.project_name}</p>
                    </td>
                    <td className="py-3 px-4"><span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">{contract.contract_type}</span></td>
                    <td className="py-3 px-4 text-gray-600">{contract.contact_name}</td>
                    <td className="py-3 px-4 text-right font-semibold text-black">${contract.amount >= 1000 ? `${(contract.amount / 1000).toFixed(1)}K` : contract.amount.toFixed(2)}</td>
                    <td className="py-3 px-4"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sc.color}`}>{sc.label}</span></td>
                    <td className="py-3 px-4 text-xs text-gray-500">{contract.start_date} — {contract.end_date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
