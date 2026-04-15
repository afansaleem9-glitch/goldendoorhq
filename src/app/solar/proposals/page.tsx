"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { FileText, TrendingUp, Sun, DollarSign, Plus, Search, Eye } from "lucide-react";

const mockProposals = [
  { id: 1, customer: "Garcia Residence", systemSize: 9.6, panels: "REC Alpha Pure-R 400W", inverter: "Enphase IQ8+", totalCost: 28400, monthly: 189, status: "signed", created: "2024-04-10" },
  { id: 2, customer: "Williams Home", systemSize: 7.2, panels: "Qcells Q.Peak DUO 380W", inverter: "SolarEdge SE7600H", totalCost: 21600, monthly: 142, status: "sent", created: "2024-04-12" },
  { id: 3, customer: "Johnson Family", systemSize: 12.0, panels: "SunPower Maxeon 6 420W", inverter: "Enphase IQ8M", totalCost: 38400, monthly: 256, status: "draft", created: "2024-04-14" },
  { id: 4, customer: "Martinez Home", systemSize: 8.4, panels: "Canadian Solar HiKu6 405W", inverter: "Enphase IQ8+", totalCost: 24360, monthly: 163, status: "sent", created: "2024-04-11" },
  { id: 5, customer: "Thompson Residence", systemSize: 10.8, panels: "REC Alpha Pure-R 400W", inverter: "SolarEdge SE10000H", totalCost: 32400, monthly: 215, status: "expired", created: "2024-03-15" },
  { id: 6, customer: "Anderson Home", systemSize: 6.0, panels: "Qcells Q.Peak DUO 380W", inverter: "Enphase IQ8+", totalCost: 18000, monthly: 119, status: "signed", created: "2024-04-08" },
];

export default function SolarProposalsPage() {
  const [proposals, setProposals] = useState(mockProposals);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    (async () => { const { data } = await supabase.from("solar_proposals").select("*").eq("org_id", ORG_ID); if (data && data.length > 0) setProposals(data); })();
  }, []);
  const filtered = proposals.filter(p => (filter === "all" || p.status === filter) && p.customer.toLowerCase().includes(search.toLowerCase()));
  const statusColors: Record<string,string> = { draft: "bg-gray-100 text-gray-700", sent: "bg-blue-100 text-blue-700", signed: "bg-green-100 text-green-700", expired: "bg-red-100 text-red-700" };
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-3xl font-bold text-[#0B1F3A]">Solar Proposals</h1><p className="text-gray-500 mt-1">Create, track, and manage solar system proposals</p></div>
        <button onClick={()=>setShowModal(true)} className="bg-[#F0A500] text-[#0B1F3A] font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-500"><Plus size={18} /> New Proposal</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{label:"Proposals Sent",value:proposals.filter(p=>p.status!=="draft").length.toString(),icon:FileText},{label:"Close Rate",value:`${Math.round(proposals.filter(p=>p.status==="signed").length/Math.max(proposals.length,1)*100)}%`,icon:TrendingUp},{label:"Avg System Size",value:`${(proposals.reduce((a,p)=>a+p.systemSize,0)/Math.max(proposals.length,1)).toFixed(1)}kW`,icon:Sun},{label:"Avg Deal Value",value:`$${Math.round(proposals.reduce((a,p)=>a+p.totalCost,0)/Math.max(proposals.length,1)/1000)}K`,icon:DollarSign}].map((s,i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-1"><s.icon size={16} className="text-[#F0A500]" /><span className="text-xs text-gray-500">{s.label}</span></div><div className="text-2xl font-bold text-[#0B1F3A]">{s.value}</div></div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Search proposals..." /></div>
          <div className="flex gap-2">{["all","draft","sent","signed","expired"].map(f => <button key={f} onClick={()=>setFilter(f)} className={`px-3 py-2 rounded-lg text-xs font-medium capitalize ${filter===f?"bg-[#0B1F3A] text-white":"bg-gray-100 text-gray-600"}`}>{f}</button>)}</div>
        </div>
        <table className="w-full text-sm"><thead><tr className="border-b border-gray-100">{["Customer","System Size","Panels","Inverter","Total Cost","Monthly","Status","Created"].map(h=><th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead><tbody>{filtered.map(p => (
          <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50"><td className="py-3 px-3 font-medium text-[#0B1F3A]">{p.customer}</td><td className="py-3 px-3">{p.systemSize}kW</td><td className="py-3 px-3 text-gray-600 text-xs">{p.panels}</td><td className="py-3 px-3 text-gray-600 text-xs">{p.inverter}</td><td className="py-3 px-3 font-semibold">${p.totalCost.toLocaleString()}</td><td className="py-3 px-3">${p.monthly}/mo</td><td className="py-3 px-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[p.status]}`}>{p.status}</span></td><td className="py-3 px-3 text-gray-500">{p.created}</td></tr>
        ))}</tbody></table>
      </div>
      {showModal && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={()=>setShowModal(false)}><div className="bg-white rounded-2xl p-6 w-full max-w-lg" onClick={e=>e.stopPropagation()}><h2 className="text-xl font-bold text-[#0B1F3A] mb-4">New Solar Proposal</h2><div className="space-y-3">{[{l:"Customer Name"},{l:"System Size (kW)"},{l:"Panel Brand",type:"select",opts:["REC Alpha Pure-R 400W","Qcells Q.Peak DUO 380W","Canadian Solar HiKu6 405W","SunPower Maxeon 6 420W"]},{l:"Inverter",type:"select",opts:["Enphase IQ8+","Enphase IQ8M","SolarEdge SE7600H","SolarEdge SE10000H","Tesla Inverter"]}].map((f,i) => <div key={i}><label className="text-xs text-gray-500 block mb-1">{f.l}</label>{f.type==="select"?<select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"><option>Select...</option>{f.opts?.map((o,j)=><option key={j}>{o}</option>)}</select>:<input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />}</div>)}</div><div className="flex gap-3 mt-4"><button onClick={()=>setShowModal(false)} className="flex-1 border border-gray-200 py-2 rounded-lg text-sm font-medium">Cancel</button><button onClick={()=>setShowModal(false)} className="flex-1 bg-[#F0A500] text-[#0B1F3A] py-2 rounded-lg text-sm font-semibold">Create Proposal</button></div></div></div>}
    </div>
  );
}
