"use client";
import { useState } from "react";
import { Users, Shield, Activity, CreditCard, Wrench, Eye, Clock, Search } from "lucide-react";

const customers = [
  { id: 1, name: "Johnson Family", system: "Qolsys IQ4", status: "Armed-Away", portalActive: true, lastLogin: "2 hrs ago", sensors: 12, cameras: 3 },
  { id: 2, name: "Martinez Residence", system: "2GIG Edge", status: "Disarmed", portalActive: true, lastLogin: "1 day ago", sensors: 8, cameras: 1 },
  { id: 3, name: "Williams Home", system: "Qolsys IQ4", status: "Armed-Stay", portalActive: true, lastLogin: "3 hrs ago", sensors: 15, cameras: 4 },
  { id: 4, name: "Garcia Family", system: "DSC PowerSeries", status: "Armed-Away", portalActive: false, lastLogin: "Never", sensors: 6, cameras: 0 },
  { id: 5, name: "Thompson LLC", system: "Qolsys IQ4", status: "Disarmed", portalActive: true, lastLogin: "5 min ago", sensors: 20, cameras: 6 },
  { id: 6, name: "Anderson Home", system: "2GIG Edge", status: "Armed-Away", portalActive: true, lastLogin: "12 hrs ago", sensors: 10, cameras: 2 },
];
const tickets = [
  { id: "ST-001", customer: "Williams Home", issue: "Sensor battery low - Zone 4", priority: "low", status: "open", created: "2 hrs ago" },
  { id: "ST-002", customer: "Thompson LLC", issue: "Camera offline - Parking lot", priority: "high", status: "in_progress", created: "4 hrs ago" },
  { id: "ST-003", customer: "Martinez Residence", issue: "False alarm - Motion sensor", priority: "medium", status: "open", created: "1 day ago" },
];

export default function CustomerPortalPage() {
  const [tab, setTab] = useState<"customers"|"tickets"|"activity">("customers");
  const [search, setSearch] = useState("");
  const statusColors: Record<string,string> = { "Armed-Away": "bg-green-100 text-green-700", "Armed-Stay": "bg-blue-100 text-blue-700", "Disarmed": "bg-gray-100 text-gray-600" };
  const priorityColors: Record<string,string> = { high: "bg-red-100 text-red-700", medium: "bg-yellow-100 text-yellow-700", low: "bg-green-100 text-green-700" };
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8"><h1 className="text-3xl font-bold text-[#0B1F3A]">Customer Portal</h1><p className="text-gray-500 mt-1">Customer self-service portal management and service tickets</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{label:"Portal Users",value:customers.filter(c=>c.portalActive).length.toString(),icon:Users},{label:"Active Systems",value:customers.filter(c=>c.status.includes("Armed")).length.toString(),icon:Shield},{label:"Open Tickets",value:tickets.filter(t=>t.status==="open").length.toString(),icon:Wrench},{label:"Avg Login/Week",value:"4.2",icon:Activity}].map((s,i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-1"><s.icon size={16} className="text-[#F0A500]" /><span className="text-xs text-gray-500">{s.label}</span></div><div className="text-2xl font-bold text-[#0B1F3A]">{s.value}</div></div>
        ))}
      </div>
      <div className="flex gap-2 mb-4">{(["customers","tickets","activity"] as const).map(t => <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${tab===t?"bg-[#0B1F3A] text-white":"bg-white text-gray-600 hover:bg-gray-100"}`}>{t}</button>)}</div>
      {tab === "customers" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="relative mb-4"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search customers..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm" /></div>
          <table className="w-full text-sm"><thead><tr className="border-b border-gray-100">{["Customer","System","Status","Sensors","Cameras","Portal","Last Login"].map(h=><th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead><tbody>{customers.filter(c=>c.name.toLowerCase().includes(search.toLowerCase())).map(c=>(
            <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50"><td className="py-3 px-3 font-medium text-[#0B1F3A]">{c.name}</td><td className="py-3 px-3 text-gray-600">{c.system}</td><td className="py-3 px-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[c.status]||""}`}>{c.status}</span></td><td className="py-3 px-3">{c.sensors}</td><td className="py-3 px-3">{c.cameras}</td><td className="py-3 px-3">{c.portalActive?<span className="text-green-600 font-medium">Active</span>:<span className="text-gray-400">Inactive</span>}</td><td className="py-3 px-3 text-gray-500">{c.lastLogin}</td></tr>
          ))}</tbody></table>
        </div>
      )}
      {tab === "tickets" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <table className="w-full text-sm"><thead><tr className="border-b border-gray-100">{["Ticket","Customer","Issue","Priority","Status","Created"].map(h=><th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead><tbody>{tickets.map(t=>(
            <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50"><td className="py-3 px-3 font-mono text-[#F0A500]">{t.id}</td><td className="py-3 px-3 font-medium">{t.customer}</td><td className="py-3 px-3 text-gray-600">{t.issue}</td><td className="py-3 px-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[t.priority]}`}>{t.priority}</span></td><td className="py-3 px-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.status==="open"?"bg-blue-100 text-blue-700":"bg-yellow-100 text-yellow-700"}`}>{t.status.replace("_"," ")}</span></td><td className="py-3 px-3 text-gray-500">{t.created}</td></tr>
          ))}</tbody></table>
        </div>
      )}
      {tab === "activity" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-[#0B1F3A] mb-4">Recent Portal Activity</h3>
          <div className="space-y-3">{[{msg:"Thompson LLC viewed live cameras",time:"5 min ago"},{msg:"Williams Home submitted service ticket ST-001",time:"2 hrs ago"},{msg:"Johnson Family updated payment method",time:"3 hrs ago"},{msg:"Anderson Home viewed event history",time:"12 hrs ago"},{msg:"Martinez Residence downloaded invoice",time:"1 day ago"}].map((a,i)=>(
            <div key={i} className="flex items-center gap-3 text-sm"><Clock size={14} className="text-gray-400" /><span className="flex-1 text-gray-700">{a.msg}</span><span className="text-xs text-gray-400">{a.time}</span></div>
          ))}</div>
        </div>
      )}
    </div>
  );
}
