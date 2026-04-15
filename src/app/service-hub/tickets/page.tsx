"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { Search, Plus, X, Flag, Clock, CheckCircle } from "lucide-react";

const STATUS_COLORS: Record<string, string> = { Open: "bg-blue-100 text-blue-800", "In Progress": "bg-purple-100 text-purple-800", Waiting: "bg-yellow-100 text-yellow-800", Resolved: "bg-green-100 text-green-800", Closed: "bg-gray-100 text-gray-600" };
const PRIORITY_COLORS: Record<string, string> = { Urgent: "bg-red-100 text-red-800", High: "bg-orange-100 text-orange-800", Medium: "bg-yellow-100 text-yellow-800", Low: "bg-green-100 text-green-800" };

const MOCK = [
  { id: "1", ticket_number: 1001, subject: "Solar panel not producing expected output", status: "Open", priority: "High", category: "Solar", assigned_to: "Mike Torres", created_at: "2025-04-12" },
  { id: "2", ticket_number: 1002, subject: "Security alarm false trigger", status: "In Progress", priority: "Urgent", category: "Security", assigned_to: "Sarah Kim", created_at: "2025-04-11" },
  { id: "3", ticket_number: 1003, subject: "Billing discrepancy on invoice #4421", status: "Waiting", priority: "Medium", category: "Billing", assigned_to: "James Reed", created_at: "2025-04-10" },
  { id: "4", ticket_number: 1004, subject: "Roof leak after repair", status: "Open", priority: "Urgent", category: "Roofing", assigned_to: "Mike Torres", created_at: "2025-04-13" },
  { id: "5", ticket_number: 1005, subject: "AT&T internet speed issues", status: "In Progress", priority: "Medium", category: "AT&T", assigned_to: "Sarah Kim", created_at: "2025-04-09" },
  { id: "6", ticket_number: 1006, subject: "Request for monitoring report", status: "Resolved", priority: "Low", category: "Security", assigned_to: "James Reed", created_at: "2025-04-08" },
  { id: "7", ticket_number: 1007, subject: "Solar inverter error code E-301", status: "Open", priority: "High", category: "Solar", assigned_to: "Mike Torres", created_at: "2025-04-13" },
  { id: "8", ticket_number: 1008, subject: "Appointment reschedule request", status: "Closed", priority: "Low", category: "General", assigned_to: "Sarah Kim", created_at: "2025-04-07" },
];

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ subject: "", description: "", priority: "Medium", category: "General" });

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("tickets").select("*").eq("organization_id", ORG_ID).order("created_at", { ascending: false });
      setTickets(data && data.length > 0 ? data : MOCK);
    }
    load();
  }, []);

  const filtered = tickets.filter(t => {
    const ms = search === "" || t.subject.toLowerCase().includes(search.toLowerCase()) || String(t.ticket_number).includes(search);
    const mst = statusFilter === "All" || t.status === statusFilter;
    const mp = priorityFilter === "All" || t.priority === priorityFilter;
    return ms && mst && mp;
  });

  const stats = [
    { label: "Open", value: tickets.filter(t => t.status === "Open").length, color: "text-blue-600" },
    { label: "In Progress", value: tickets.filter(t => t.status === "In Progress").length, color: "text-purple-600" },
    { label: "Resolved", value: tickets.filter(t => t.status === "Resolved" || t.status === "Closed").length, color: "text-green-600" },
  ];

  async function handleCreate() {
    const maxNum = tickets.reduce((m, t) => Math.max(m, t.ticket_number || 0), 1000);
    await supabase.from("tickets").insert({ organization_id: ORG_ID, ticket_number: maxNum + 1, subject: form.subject, description: form.description, priority: form.priority, category: form.category, status: "Open" });
    setShowModal(false);
    const { data } = await supabase.from("tickets").select("*").eq("organization_id", ORG_ID).order("created_at", { ascending: false });
    if (data && data.length) setTickets(data);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 text-white px-8 py-8">
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        <p className="text-indigo-200 text-sm mt-1">Manage customer support requests</p>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center gap-4 mb-6">
          {stats.map(s => <div key={s.label} className="bg-white rounded-xl border px-5 py-3 flex-1 text-center"><div className={`text-2xl font-bold ${s.color}`}>{s.value}</div><div className="text-xs text-gray-500">{s.label}</div></div>)}
        </div>
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center bg-white rounded-lg border px-3 py-2 flex-1 min-w-[200px]"><Search size={16} className="text-gray-400 mr-2" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickets..." className="outline-none text-sm flex-1" /></div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-white border rounded-lg px-3 py-2 text-sm"><option>All</option><option>Open</option><option>In Progress</option><option>Waiting</option><option>Resolved</option><option>Closed</option></select>
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="bg-white border rounded-lg px-3 py-2 text-sm"><option>All</option><option>Urgent</option><option>High</option><option>Medium</option><option>Low</option></select>
          <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"><Plus size={16} />Create Ticket</button>
        </div>
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b"><tr>{["#","Subject","Priority","Status","Category","Assigned","Created"].map(h => <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>)}</tr></thead>
            <tbody>{filtered.map(t => (
              <tr key={t.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs font-medium">#{t.ticket_number}</td>
                <td className="px-4 py-3 font-medium max-w-[300px] truncate">{t.subject}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${PRIORITY_COLORS[t.priority] || "bg-gray-100"}`}>{t.priority}</span></td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[t.status] || "bg-gray-100"}`}>{t.status}</span></td>
                <td className="px-4 py-3 text-gray-500">{t.category}</td>
                <td className="px-4 py-3 text-gray-500">{t.assigned_to || "Unassigned"}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{new Date(t.created_at).toLocaleDateString()}</td>
              </tr>
            ))}</tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No tickets found</div>}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">Create Ticket</h2><button onClick={() => setShowModal(false)}><X size={20} /></button></div>
            <div className="space-y-3">
              <input placeholder="Subject" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" rows={3} />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="border rounded-lg px-3 py-2 text-sm"><option>Low</option><option>Medium</option><option>High</option><option>Urgent</option></select>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="border rounded-lg px-3 py-2 text-sm"><option>General</option><option>Solar</option><option>Security</option><option>Roofing</option><option>AT&T</option><option>Billing</option></select>
              </div>
            </div>
            <button onClick={handleCreate} className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium">Create Ticket</button>
          </div>
        </div>
      )}
    </div>
  );
}
