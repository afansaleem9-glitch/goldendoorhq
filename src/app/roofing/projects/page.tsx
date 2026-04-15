"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { Search, Plus, X, DollarSign, Home, Shield, Hammer } from "lucide-react";

const STATUS_COLORS: Record<string, string> = { Estimate: "bg-yellow-100 text-yellow-800", Approved: "bg-blue-100 text-blue-800", "In Progress": "bg-purple-100 text-purple-800", Complete: "bg-green-100 text-green-800" };

const MOCK = [
  { id: "1", address: "1420 Oak Hill Dr", city: "Austin", state: "TX", project_type: "Full Replacement", roof_material: "Architectural Shingle", roof_area_sqft: 2400, estimate_amount: 18500, insurance_claim: true, insurance_company: "State Farm", claim_number: "CLM-2025-4421", status: "In Progress", created_at: "2025-03-15" },
  { id: "2", address: "890 Maple Ave", city: "Columbus", state: "OH", project_type: "Repair", roof_material: "Metal", roof_area_sqft: 800, estimate_amount: 4200, insurance_claim: false, insurance_company: null, claim_number: null, status: "Complete", created_at: "2025-02-20" },
  { id: "3", address: "2100 Elm St", city: "Detroit", state: "MI", project_type: "Full Replacement", roof_material: "TPO", roof_area_sqft: 3200, estimate_amount: 28000, insurance_claim: true, insurance_company: "Allstate", claim_number: "CLM-2025-7789", status: "Approved", created_at: "2025-04-01" },
  { id: "4", address: "456 Cedar Ln", city: "San Antonio", state: "TX", project_type: "Inspection", roof_material: "Tile", roof_area_sqft: 1800, estimate_amount: 350, insurance_claim: false, insurance_company: null, claim_number: null, status: "Estimate", created_at: "2025-04-05" },
  { id: "5", address: "789 Pine Rd", city: "Cleveland", state: "OH", project_type: "Repair", roof_material: "Architectural Shingle", roof_area_sqft: 600, estimate_amount: 3100, insurance_claim: true, insurance_company: "Progressive", claim_number: "CLM-2025-1123", status: "In Progress", created_at: "2025-03-28" },
  { id: "6", address: "321 Birch Ct", city: "Ann Arbor", state: "MI", project_type: "Full Replacement", roof_material: "Standing Seam Metal", roof_area_sqft: 2800, estimate_amount: 34000, insurance_claim: false, insurance_company: null, claim_number: null, status: "Estimate", created_at: "2025-04-08" },
];

export default function RoofingProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ address: "", city: "", state: "TX", project_type: "Full Replacement", roof_material: "Architectural Shingle", roof_area_sqft: "", estimate_amount: "", insurance_claim: false, insurance_company: "", claim_number: "" });

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("roofing_projects").select("*").eq("organization_id", ORG_ID).order("created_at", { ascending: false });
      setProjects(data && data.length > 0 ? data : MOCK);
    }
    load();
  }, []);

  const filtered = projects.filter(p => {
    const ms = search === "" || p.address?.toLowerCase().includes(search.toLowerCase());
    const mst = statusFilter === "All" || p.status === statusFilter;
    return ms && mst;
  });

  const stats = [
    { label: "Total Projects", value: projects.length, icon: Home, color: "text-amber-600" },
    { label: "Active", value: projects.filter(p => p.status === "In Progress").length, icon: Hammer, color: "text-blue-600" },
    { label: "Insurance Claims", value: projects.filter(p => p.insurance_claim).length, icon: Shield, color: "text-purple-600" },
    { label: "Total Revenue", value: "$" + projects.reduce((s, p) => s + (p.estimate_amount || 0), 0).toLocaleString(), icon: DollarSign, color: "text-green-600" },
  ];

  async function handleAdd() {
    await supabase.from("roofing_projects").insert({ organization_id: ORG_ID, ...form, roof_area_sqft: Number(form.roof_area_sqft), estimate_amount: Number(form.estimate_amount), status: "Estimate" });
    setShowModal(false);
    const { data } = await supabase.from("roofing_projects").select("*").eq("organization_id", ORG_ID).order("created_at", { ascending: false });
    if (data && data.length) setProjects(data);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-amber-900 to-amber-700 text-white px-8 py-8">
        <h1 className="text-2xl font-bold">Roofing Projects</h1>
        <p className="text-amber-200 text-sm mt-1">Track jobs from estimate to completion</p>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">{stats.map(s => { const Icon = s.icon; return (
          <div key={s.label} className="bg-white rounded-xl border p-4"><div className="flex items-center gap-2 mb-1"><Icon size={16} className={s.color} /><span className="text-xs text-gray-500">{s.label}</span></div><div className="text-xl font-bold">{s.value}</div></div>
        );})}</div>
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center bg-white rounded-lg border px-3 py-2 flex-1 min-w-[200px]"><Search size={16} className="text-gray-400 mr-2" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..." className="outline-none text-sm flex-1" /></div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-white border rounded-lg px-3 py-2 text-sm"><option>All</option><option>Estimate</option><option>Approved</option><option>In Progress</option><option>Complete</option></select>
          <button onClick={() => setShowModal(true)} className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"><Plus size={16} />New Project</button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[p.status] || "bg-gray-100"}`}>{p.status}</span><span className="text-lg font-bold text-amber-600">${(p.estimate_amount || 0).toLocaleString()}</span></div>
              <p className="font-semibold text-sm">{p.address}</p>
              <p className="text-xs text-gray-500">{p.city}, {p.state}</p>
              <div className="mt-3 space-y-1 text-xs text-gray-600">
                <p><span className="font-medium">Type:</span> {p.project_type}</p>
                <p><span className="font-medium">Material:</span> {p.roof_material}</p>
                <p><span className="font-medium">Area:</span> {(p.roof_area_sqft || 0).toLocaleString()} sqft</p>
              </div>
              {p.insurance_claim && <div className="mt-3 bg-blue-50 rounded-lg px-3 py-2 text-xs"><Shield size={12} className="inline mr-1 text-blue-600" /><span className="font-medium">{p.insurance_company}</span> — {p.claim_number}</div>}
            </div>
          ))}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">New Roofing Project</h2><button onClick={() => setShowModal(false)}><X size={20} /></button></div>
            <div className="space-y-3">
              <input placeholder="Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <div className="grid grid-cols-2 gap-3"><input placeholder="City" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" /><select value={form.state} onChange={e => setForm({...form, state: e.target.value})} className="border rounded-lg px-3 py-2 text-sm"><option>TX</option><option>OH</option><option>MI</option></select></div>
              <select value={form.project_type} onChange={e => setForm({...form, project_type: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"><option>Full Replacement</option><option>Repair</option><option>Inspection</option><option>Maintenance</option></select>
              <select value={form.roof_material} onChange={e => setForm({...form, roof_material: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"><option>Architectural Shingle</option><option>Metal</option><option>TPO</option><option>Tile</option><option>Standing Seam Metal</option><option>EPDM</option></select>
              <div className="grid grid-cols-2 gap-3"><input type="number" placeholder="Sq Ft" value={form.roof_area_sqft} onChange={e => setForm({...form, roof_area_sqft: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" /><input type="number" placeholder="Estimate $" value={form.estimate_amount} onChange={e => setForm({...form, estimate_amount: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" /></div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.insurance_claim} onChange={e => setForm({...form, insurance_claim: e.target.checked})} />Insurance Claim</label>
              {form.insurance_claim && <><input placeholder="Insurance Company" value={form.insurance_company} onChange={e => setForm({...form, insurance_company: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" /><input placeholder="Claim Number" value={form.claim_number} onChange={e => setForm({...form, claim_number: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" /></>}
            </div>
            <button onClick={handleAdd} className="w-full mt-4 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg font-medium">Create Project</button>
          </div>
        </div>
      )}
    </div>
  );
}
