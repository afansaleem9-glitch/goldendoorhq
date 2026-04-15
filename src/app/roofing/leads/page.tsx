"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { Search, Filter, Plus, Phone, MapPin, X } from "lucide-react";

const STATUS_COLORS: Record<string, string> = { New: "bg-green-100 text-green-800", Contacted: "bg-blue-100 text-blue-800", Qualified: "bg-amber-100 text-amber-800", Lost: "bg-red-100 text-red-800" };

const MOCK_LEADS = [
  { id: "1", full_name: "Marcus Johnson", phone: "512-555-0101", address: "1420 Oak Hill Dr", city: "Austin", state: "TX", lead_status: "New", lead_source: "Storm Damage", created_at: "2025-04-01" },
  { id: "2", full_name: "Patricia Williams", phone: "614-555-0202", address: "890 Maple Ave", city: "Columbus", state: "OH", lead_status: "Contacted", lead_source: "Referral", created_at: "2025-03-28" },
  { id: "3", full_name: "Robert Chen", phone: "313-555-0303", address: "2100 Elm St", city: "Detroit", state: "MI", lead_status: "Qualified", lead_source: "Door Knock", created_at: "2025-03-25" },
  { id: "4", full_name: "Sandra Davis", phone: "512-555-0404", address: "456 Cedar Ln", city: "San Antonio", state: "TX", lead_status: "New", lead_source: "Insurance Claim", created_at: "2025-04-03" },
  { id: "5", full_name: "James Wilson", phone: "614-555-0505", address: "789 Pine Rd", city: "Cleveland", state: "OH", lead_status: "Contacted", lead_source: "Website", created_at: "2025-03-20" },
  { id: "6", full_name: "Angela Martinez", phone: "313-555-0606", address: "321 Birch Ct", city: "Ann Arbor", state: "MI", lead_status: "Lost", lead_source: "Storm Damage", created_at: "2025-03-15" },
];

export default function RoofingLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "", address: "", city: "", state: "TX", lead_source: "Storm Damage" });

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("contacts").select("*").eq("organization_id", ORG_ID).ilike("lead_source", "%roofing%").order("created_at", { ascending: false });
      setLeads(data && data.length > 0 ? data : MOCK_LEADS);
    }
    load();
  }, []);

  const filtered = leads.filter(l => {
    const matchSearch = l.full_name?.toLowerCase().includes(search.toLowerCase()) || l.address?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || l.lead_status === statusFilter;
    return matchSearch && matchStatus;
  });

  async function handleAdd() {
    const { error } = await supabase.from("contacts").insert({ organization_id: ORG_ID, first_name: form.full_name.split(" ")[0], last_name: form.full_name.split(" ").slice(1).join(" "), full_name: form.full_name, phone: form.phone, address: form.address, city: form.city, state: form.state, lead_source: "roofing - " + form.lead_source, lead_status: "New", lifecycle_stage: "lead", tags: ["roofing"] });
    if (!error) { setShowModal(false); setForm({ full_name: "", phone: "", address: "", city: "", state: "TX", lead_source: "Storm Damage" }); const { data } = await supabase.from("contacts").select("*").eq("organization_id", ORG_ID).ilike("lead_source", "%roofing%"); if (data && data.length) setLeads(data); }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-amber-900 to-amber-700 text-white px-8 py-8">
        <h1 className="text-2xl font-bold">Roofing Leads</h1>
        <p className="text-amber-200 text-sm mt-1">Track and convert roofing prospects</p>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center bg-white rounded-lg border px-3 py-2 flex-1 min-w-[200px]">
            <Search size={16} className="text-gray-400 mr-2" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads..." className="outline-none text-sm flex-1" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-white border rounded-lg px-3 py-2 text-sm">
            <option>All</option><option>New</option><option>Contacted</option><option>Qualified</option><option>Lost</option>
          </select>
          <button onClick={() => setShowModal(true)} className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"><Plus size={16} />Add Lead</button>
        </div>
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b"><tr>{["Name","Address","Phone","Source","Status","Created"].map(h => <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>)}</tr></thead>
            <tbody>{filtered.map(l => (
              <tr key={l.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium">{l.full_name}</td>
                <td className="px-4 py-3 text-gray-600"><MapPin size={13} className="inline mr-1" />{l.address}, {l.city}, {l.state}</td>
                <td className="px-4 py-3 text-gray-600"><Phone size={13} className="inline mr-1" />{l.phone}</td>
                <td className="px-4 py-3 text-gray-500">{l.lead_source}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[l.lead_status] || "bg-gray-100"}`}>{l.lead_status}</span></td>
                <td className="px-4 py-3 text-gray-400">{new Date(l.created_at).toLocaleDateString()}</td>
              </tr>
            ))}</tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No leads found</div>}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">Add Roofing Lead</h2><button onClick={() => setShowModal(false)}><X size={20} /></button></div>
            <div className="space-y-3">
              <input placeholder="Full Name" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="City" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" />
                <select value={form.state} onChange={e => setForm({...form, state: e.target.value})} className="border rounded-lg px-3 py-2 text-sm"><option>TX</option><option>OH</option><option>MI</option></select>
              </div>
              <select value={form.lead_source} onChange={e => setForm({...form, lead_source: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"><option>Storm Damage</option><option>Insurance Claim</option><option>Referral</option><option>Door Knock</option><option>Website</option></select>
            </div>
            <button onClick={handleAdd} className="w-full mt-4 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg font-medium">Add Lead</button>
          </div>
        </div>
      )}
    </div>
  );
}
