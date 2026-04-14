"use client";
import { useState } from "react";
import { tickets } from "@/lib/mock-data";
import { Plus, Search, AlertTriangle, Clock, CheckCircle, MessageSquare } from "lucide-react";

const statusColors: Record<string, string> = {
  "New": "bg-blue-100 text-blue-700",
  "Waiting on Contact": "bg-yellow-100 text-yellow-700",
  "Waiting on Us": "bg-purple-100 text-purple-700",
  "Closed": "bg-green-100 text-green-700",
};

const priorityColors: Record<string, string> = {
  urgent: "bg-red-500 text-white",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-blue-100 text-blue-700",
  low: "bg-gray-100 text-gray-600",
};

const sourceIcons: Record<string, typeof MessageSquare> = {
  email: MessageSquare, phone: MessageSquare, chat: MessageSquare, form: MessageSquare, manual: MessageSquare,
};

export default function TicketsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = tickets.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch = !q || `${t.subject} ${t.contact} ${t.category}`.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openCount = tickets.filter(t => t.status !== "Closed").length;
  const urgentCount = tickets.filter(t => t.priority === "urgent" && t.status !== "Closed").length;

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F3A]">Tickets</h1>
          <p className="text-sm text-[#9CA3AF]">{openCount} open tickets{urgentCount > 0 && <span className="text-red-500 font-medium"> &middot; {urgentCount} urgent</span>}</p>
        </div>
        <button className="btn-primary"><Plus size={16} /> Create ticket</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {["New", "Waiting on Contact", "Waiting on Us", "Closed"].map(status => {
          const count = tickets.filter(t => t.status === status).length;
          return (
            <div key={status} className="card text-center cursor-pointer hover:border-[#F0A500]/50" onClick={() => setStatusFilter(status === statusFilter ? "all" : status)}>
              <p className="text-2xl font-bold text-[#0B1F3A]">{count}</p>
              <p className="text-sm text-[#9CA3AF]">{status}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-white rounded-lg border border-[#E5E7EB] px-3 py-2 flex-1 max-w-md">
          <Search size={16} className="text-[#9CA3AF] mr-2" />
          <input type="text" placeholder="Search tickets..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none w-full text-[#0B1F3A] placeholder-[#9CA3AF]" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white text-[#0B1F3A] outline-none">
          <option value="all">All statuses</option>
          <option value="New">New</option>
          <option value="Waiting on Contact">Waiting on Contact</option>
          <option value="Waiting on Us">Waiting on Us</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Tickets List */}
      <div className="space-y-2">
        {filtered.map((t) => {
          const isBreached = t.status !== "Closed" && new Date(t.sla_due) < new Date();
          return (
            <div key={t.id} className="card flex items-start gap-4 py-4 cursor-pointer">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${t.priority === "urgent" ? "bg-red-100" : "bg-[#0B1F3A]/10"}`}>
                {t.priority === "urgent" ? <AlertTriangle size={18} className="text-red-500" /> : <MessageSquare size={18} className="text-[#0B1F3A]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-[#0B1F3A]">{t.subject}</h3>
                  <span className={`badge text-xs ${priorityColors[t.priority]}`}>{t.priority}</span>
                  <span className={`badge text-xs ${statusColors[t.status]}`}>{t.status}</span>
                </div>
                <p className="text-sm text-[#9CA3AF] mb-2 line-clamp-1">{t.description}</p>
                <div className="flex items-center gap-4 text-xs text-[#9CA3AF]">
                  <span>Contact: {t.contact}</span>
                  <span>Owner: {t.owner}</span>
                  <span>Category: {t.category}</span>
                  <span>Source: {t.source}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className={`flex items-center gap-1 text-sm font-medium ${isBreached ? "text-red-500" : "text-[#0B1F3A]"}`}>
                  {isBreached ? <AlertTriangle size={14} /> : <Clock size={14} />}
                  <span>{new Date(t.sla_due).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                </div>
                <p className="text-xs text-[#9CA3AF] mt-0.5">{isBreached ? "SLA Breached" : "SLA Due"}</p>
                <p className="text-xs text-[#9CA3AF] mt-1">
                  Created {new Date(t.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
