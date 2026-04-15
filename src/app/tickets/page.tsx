"use client";
import { useState } from "react";
import {
  Ticket, Search, Plus, Filter, Clock, User, AlertTriangle,
  CheckCircle2, Circle, MessageSquare, X, ChevronDown
} from "lucide-react";

interface TicketItem {
  id: string;
  number: number;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "waiting" | "resolved";
  priority: "critical" | "high" | "medium" | "low";
  category: string;
  contact_name: string;
  assigned_to: string;
  assigned_avatar: string;
  created_at: string;
  updated_at: string;
  sla_remaining: string;
  messages: number;
}

const MOCK_TICKETS: TicketItem[] = [
  { id: "tk1", number: 1001, subject: "Monitoring system offline — Garcia residence", description: "ADC panel showing offline since yesterday. Customer called in.", status: "open", priority: "critical", category: "Monitoring", contact_name: "Carlos Garcia", assigned_to: "David Park", assigned_avatar: "DP", created_at: "Apr 13, 2026", updated_at: "2 hours ago", sla_remaining: "4h", messages: 3 },
  { id: "tk2", number: 1002, subject: "Solar production lower than expected — Johnson", description: "System producing 30% below estimate. May be shading issue.", status: "in_progress", priority: "high", category: "Solar Performance", contact_name: "Sarah Johnson", assigned_to: "Sarah Chen", assigned_avatar: "SC", created_at: "Apr 11, 2026", updated_at: "5 hours ago", sla_remaining: "12h", messages: 7 },
  { id: "tk3", number: 1003, subject: "Billing discrepancy — Davis account", description: "Customer billed for equipment monitoring twice in March.", status: "in_progress", priority: "medium", category: "Billing", contact_name: "Amanda Davis", assigned_to: "Marcus Johnson", assigned_avatar: "MJ", created_at: "Apr 10, 2026", updated_at: "1 day ago", sla_remaining: "24h", messages: 4 },
  { id: "tk4", number: 1004, subject: "Request for additional cameras — Martinez", description: "Wants 2 more outdoor cameras added to existing smart home.", status: "open", priority: "medium", category: "Smart Home", contact_name: "Robert Martinez", assigned_to: "David Park", assigned_avatar: "DP", created_at: "Apr 12, 2026", updated_at: "6 hours ago", sla_remaining: "36h", messages: 2 },
  { id: "tk5", number: 1005, subject: "Permit delay — Williams solar install", description: "City of Plano requesting additional structural calculations.", status: "waiting", priority: "high", category: "Permitting", contact_name: "Jennifer Williams", assigned_to: "Sarah Chen", assigned_avatar: "SC", created_at: "Apr 9, 2026", updated_at: "3 hours ago", sla_remaining: "—", messages: 9 },
  { id: "tk6", number: 1006, subject: "Roof warranty question — Brown", description: "Customer asking about GAF warranty transfer if they sell home.", status: "resolved", priority: "low", category: "Warranty", contact_name: "James Brown", assigned_to: "Lisa Rodriguez", assigned_avatar: "LR", created_at: "Apr 7, 2026", updated_at: "2 days ago", sla_remaining: "—", messages: 5 },
  { id: "tk7", number: 1007, subject: "AT&T service activation delay", description: "Fiber install completed but service not provisioned after 48hrs.", status: "open", priority: "high", category: "AT&T", contact_name: "Emily Wilson", assigned_to: "Marcus Johnson", assigned_avatar: "MJ", created_at: "Apr 13, 2026", updated_at: "1 hour ago", sla_remaining: "8h", messages: 2 },
  { id: "tk8", number: 1008, subject: "Inverter replacement needed — Moore", description: "Enphase IQ7+ microinverter #3 showing fault code.", status: "open", priority: "medium", category: "Equipment", contact_name: "Patricia Moore", assigned_to: "Sarah Chen", assigned_avatar: "SC", created_at: "Apr 14, 2026", updated_at: "30 min ago", sla_remaining: "48h", messages: 1 },
];

const STATUS_CONFIG = {
  open: { label: "Open", color: "bg-red-50 text-red-700", dot: "bg-red-500" },
  in_progress: { label: "In Progress", color: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  waiting: { label: "Waiting", color: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
  resolved: { label: "Resolved", color: "bg-green-50 text-green-700", dot: "bg-green-500" },
};

const PRIORITY_CONFIG = {
  critical: { label: "Critical", color: "bg-red-100 text-red-800" },
  high: { label: "High", color: "bg-orange-50 text-orange-700" },
  medium: { label: "Medium", color: "bg-gray-100 text-gray-700" },
  low: { label: "Low", color: "bg-gray-50 text-gray-500" },
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<TicketItem | null>(null);

  const filtered = tickets.filter(t => {
    const matchSearch = search === "" || t.subject.toLowerCase().includes(search.toLowerCase()) || t.contact_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: tickets.length,
    open: tickets.filter(t => t.status === "open").length,
    in_progress: tickets.filter(t => t.status === "in_progress").length,
    waiting: tickets.filter(t => t.status === "waiting").length,
    resolved: tickets.filter(t => t.status === "resolved").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black flex items-center gap-2"><Ticket size={24} /> Support Tickets</h1>
            <p className="text-sm text-gray-500 mt-1">{counts.open + counts.in_progress} open tickets</p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">
            <Plus size={14} /> New Ticket
          </button>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Open", value: counts.open, color: "text-red-600" },
            { label: "In Progress", value: counts.in_progress, color: "text-amber-600" },
            { label: "Waiting", value: counts.waiting, color: "text-blue-600" },
            { label: "Resolved", value: counts.resolved, color: "text-green-600" },
          ].map(kpi => (
            <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</p>
              <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 max-w-md focus-within:border-black transition-all">
            <Search size={14} className="text-gray-500 mr-2" />
            <input type="text" placeholder="Search tickets..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 text-sm outline-none bg-transparent text-black placeholder-gray-400" aria-label="Search tickets" />
          </div>
          {(["all", "open", "in_progress", "waiting", "resolved"] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${statusFilter === s ? "bg-black text-white" : "bg-white border border-gray-200 text-gray-600 hover:text-black"}`}>
              {s === "all" ? "All" : STATUS_CONFIG[s].label} ({counts[s]})
            </button>
          ))}
        </div>

        {/* Ticket Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-gray-200/60 bg-gray-50/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">#</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Subject</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Category</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Priority</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Assigned</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">SLA</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(ticket => {
                const sc = STATUS_CONFIG[ticket.status];
                const pc = PRIORITY_CONFIG[ticket.priority];
                return (
                  <tr key={ticket.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSelected(ticket)}>
                    <td className="py-3 px-4 font-mono text-gray-500 text-xs">#{ticket.number}</td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-black">{ticket.subject}</p>
                      <p className="text-xs text-gray-500">{ticket.contact_name}</p>
                    </td>
                    <td className="py-3 px-4"><span className="text-xs font-medium text-gray-600">{ticket.category}</span></td>
                    <td className="py-3 px-4"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${pc.color}`}>{pc.label}</span></td>
                    <td className="py-3 px-4"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sc.color}`}>{sc.label}</span></td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[11px] font-bold">{ticket.assigned_avatar}</div>
                        <span className="text-xs text-gray-600">{ticket.assigned_to.split(" ")[0]}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-mono ${ticket.sla_remaining !== "—" && parseInt(ticket.sla_remaining) <= 8 ? "text-red-600 font-bold" : "text-gray-500"}`}>
                        {ticket.sla_remaining}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500">{ticket.updated_at}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Detail Slide-over */}
        {selected && (
          <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-label="Ticket details">
            <div className="absolute inset-0 bg-black/20" onClick={() => setSelected(null)} />
            <div className="relative w-[480px] bg-white shadow-2xl h-full overflow-y-auto">
              <div className="p-6 border-b border-gray-200/60">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-gray-500">#{selected.number}</span>
                  <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-black" aria-label="Close"><X size={18} /></button>
                </div>
                <h2 className="text-lg font-bold text-black mb-2">{selected.subject}</h2>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_CONFIG[selected.status].color}`}>{STATUS_CONFIG[selected.status].label}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${PRIORITY_CONFIG[selected.priority].color}`}>{PRIORITY_CONFIG[selected.priority].label}</span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Description</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{selected.description}</p>
                </div>
                {[
                  { label: "Contact", value: selected.contact_name },
                  { label: "Category", value: selected.category },
                  { label: "Assigned To", value: selected.assigned_to },
                  { label: "Created", value: selected.created_at },
                  { label: "SLA Remaining", value: selected.sla_remaining },
                  { label: "Messages", value: String(selected.messages) },
                ].map(f => (
                  <div key={f.label} className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-xs font-semibold text-gray-500 uppercase">{f.label}</span>
                    <span className="text-sm text-black font-medium">{f.value}</span>
                  </div>
                ))}
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">Reply</button>
                  <button className="flex-1 py-2 border border-gray-200 text-black rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">Escalate</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
