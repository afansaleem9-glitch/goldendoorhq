"use client";
import { useState } from "react";
import { Wrench, AlertTriangle, Package, Clock, Plus, Search } from "lucide-react";

const claims = [
  { id: "WC-001", customer: "Johnson Family", equipment: "Motion Detector", issue: "False triggers in cold weather", status: "open", created: "2024-04-12", tech: "Unassigned", serial: "MD-2024-4521" },
  { id: "WC-002", customer: "Williams Home", equipment: "Doorbell Camera", issue: "Night vision not working", status: "in_progress", created: "2024-04-10", tech: "Mike Torres", serial: "DC-2024-1234" },
  { id: "WC-003", customer: "Garcia Family", equipment: "Door/Window Sensor", issue: "Intermittent offline", status: "parts_ordered", created: "2024-04-08", tech: "Sarah Kim", serial: "DW-2024-5678" },
  { id: "WC-004", customer: "Thompson LLC", equipment: "Smoke Detector", issue: "Chirping after battery replacement", status: "resolved", created: "2024-04-05", tech: "James Reid", serial: "SD-2024-9012" },
  { id: "WC-005", customer: "Anderson Home", equipment: "Qolsys IQ4 Panel", issue: "Touchscreen unresponsive zone", status: "open", created: "2024-04-13", tech: "Unassigned", serial: "QP-2024-3456" },
  { id: "WC-006", customer: "Martinez Residence", equipment: "Outdoor Camera", issue: "WiFi disconnects frequently", status: "in_progress", created: "2024-04-09", tech: "Mike Torres", serial: "OC-2024-7890" },
  { id: "WC-007", customer: "Brown Family", equipment: "Glass Break Sensor", issue: "Not detecting test signals", status: "resolved", created: "2024-04-03", tech: "Sarah Kim", serial: "GB-2024-2345" },
  { id: "WC-008", customer: "Davis Residence", equipment: "Smart Lock", issue: "Auto-lock feature failing", status: "parts_ordered", created: "2024-04-11", tech: "James Reid", serial: "SL-2024-6789" },
];

export default function WarrantyClaimsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const filtered = claims.filter(c => (filter === "all" || c.status === filter) && (c.customer.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase())));
  const statusColors: Record<string,string> = { open: "bg-blue-100 text-blue-700", in_progress: "bg-yellow-100 text-yellow-700", parts_ordered: "bg-purple-100 text-purple-700", resolved: "bg-green-100 text-green-700" };
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-3xl font-bold text-[#0B1F3A]">Warranty Claims</h1><p className="text-gray-500 mt-1">Equipment warranty tracking and service management</p></div>
        <button onClick={()=>setShowModal(true)} className="bg-[#F0A500] text-[#0B1F3A] font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-500"><Plus size={18} /> New Claim</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{label:"Open Claims",value:claims.filter(c=>c.status!=="resolved").length.toString(),icon:Wrench},{label:"Avg Resolution",value:"4.2 days",icon:Clock},{label:"Parts on Order",value:claims.filter(c=>c.status==="parts_ordered").length.toString(),icon:Package},{label:"Expiring Soon",value:"12",icon:AlertTriangle}].map((s,i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-1"><s.icon size={16} className="text-[#F0A500]" /><span className="text-xs text-gray-500">{s.label}</span></div><div className="text-2xl font-bold text-[#0B1F3A]">{s.value}</div></div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Search claims..." /></div>
          <div className="flex gap-2">{["all","open","in_progress","parts_ordered","resolved"].map(f => <button key={f} onClick={()=>setFilter(f)} className={`px-3 py-2 rounded-lg text-xs font-medium capitalize ${filter===f?"bg-[#0B1F3A] text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{f.replace("_"," ")}</button>)}</div>
        </div>
        <table className="w-full text-sm"><thead><tr className="border-b border-gray-100">{["Ticket","Customer","Equipment","Issue","Status","Technician","Created"].map(h=><th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead><tbody>{filtered.map(c => (
          <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50"><td className="py-3 px-3 font-mono text-[#F0A500] font-medium">{c.id}</td><td className="py-3 px-3 font-medium text-[#0B1F3A]">{c.customer}</td><td className="py-3 px-3 text-gray-600">{c.equipment}</td><td className="py-3 px-3 text-gray-600 max-w-48 truncate">{c.issue}</td><td className="py-3 px-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[c.status]}`}>{c.status.replace("_"," ")}</span></td><td className="py-3 px-3 text-gray-500">{c.tech}</td><td className="py-3 px-3 text-gray-500">{c.created}</td></tr>
        ))}</tbody></table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={()=>setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg" onClick={e=>e.stopPropagation()}>
            <h2 className="text-xl font-bold text-[#0B1F3A] mb-4">New Warranty Claim</h2>
            <div className="space-y-3">{[{label:"Customer",ph:"Select customer"},{label:"Equipment",ph:"Select equipment"},{label:"Serial Number",ph:"Enter serial number"},{label:"Issue Description",ph:"Describe the issue"}].map((f,i) => (
              <div key={i}><label className="text-xs text-gray-500 block mb-1">{f.label}</label>{i===3?<textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" rows={3} placeholder={f.ph} />:<input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder={f.ph} />}</div>
            ))}</div>
            <div className="flex gap-3 mt-4"><button onClick={()=>setShowModal(false)} className="flex-1 border border-gray-200 py-2 rounded-lg text-sm font-medium">Cancel</button><button onClick={()=>setShowModal(false)} className="flex-1 bg-[#F0A500] text-[#0B1F3A] py-2 rounded-lg text-sm font-semibold">Create Claim</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
