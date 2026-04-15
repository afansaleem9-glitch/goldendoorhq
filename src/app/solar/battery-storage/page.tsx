"use client";
import { useState } from "react";
import { Battery, Zap, DollarSign, TrendingUp, Plus } from "lucide-react";

const batteries = [
  { name: "Tesla Powerwall 3", capacity: "13.5 kWh", power: "11.5 kW", price: 11500, warranty: "10 yr", features: ["Whole-home backup", "Storm Watch", "Solar self-consumption"] },
  { name: "Enphase IQ Battery 5P", capacity: "5 kWh", power: "3.84 kW", price: 7000, warranty: "15 yr", features: ["Modular (stack up to 4)", "Microinverter native", "Grid-agnostic"] },
  { name: "Franklin WH", capacity: "13.6 kWh", power: "10 kW", price: 10800, warranty: "12 yr", features: ["Whole-home backup", "200A panel support", "Solar optimized"] },
  { name: "SolarEdge Home Battery", capacity: "9.7 kWh", power: "5 kW", price: 8500, warranty: "10 yr", features: ["DC-coupled", "SolarEdge native", "Compact design"] },
];
const installs = [
  { id: 1, customer: "Garcia Residence", battery: "Tesla Powerwall 3", capacity: "13.5 kWh", backupLoads: "Whole Home", installDate: "2024-04-05", status: "active" },
  { id: 2, customer: "Johnson Family", battery: "Enphase IQ Battery 5P x2", capacity: "10 kWh", backupLoads: "Essential Loads", installDate: "2024-03-28", status: "active" },
  { id: 3, customer: "Williams Home", battery: "Franklin WH", capacity: "13.6 kWh", backupLoads: "Whole Home", installDate: "2024-04-12", status: "pending" },
  { id: 4, customer: "Anderson Home", battery: "Tesla Powerwall 3", capacity: "13.5 kWh", backupLoads: "Whole Home", installDate: "2024-03-15", status: "active" },
];

export default function BatteryStoragePage() {
  const [tab, setTab] = useState<"products"|"installs">("products");
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8"><h1 className="text-3xl font-bold text-[#0B1F3A]">Battery Storage</h1><p className="text-gray-500 mt-1">Energy storage products, installations, and backup load management</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{l:"Batteries Installed",v:"67",icon:Battery},{l:"Avg Battery Revenue",v:"$9,400",icon:DollarSign},{l:"Attach Rate",v:"34%",icon:TrendingUp},{l:"kWh Deployed",v:"724",icon:Zap}].map((s,i) => <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-1"><s.icon size={16} className="text-[#F0A500]" /><span className="text-xs text-gray-500">{s.l}</span></div><div className="text-2xl font-bold text-[#0B1F3A]">{s.v}</div></div>)}
      </div>
      <div className="flex gap-2 mb-4">{(["products","installs"] as const).map(t => <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${tab===t?"bg-[#0B1F3A] text-white":"bg-white text-gray-600"}`}>{t}</button>)}</div>
      {tab==="products" && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{batteries.map((b,i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-[#0B1F3A]">{b.name}</h3>
          <div className="grid grid-cols-2 gap-3 mt-3">{[{k:"Capacity",v:b.capacity},{k:"Power Output",v:b.power},{k:"Price",v:`$${b.price.toLocaleString()}`},{k:"Warranty",v:b.warranty}].map((d,j)=><div key={j} className="bg-gray-50 rounded-lg p-2"><div className="text-xs text-gray-400">{d.k}</div><div className="text-sm font-bold text-[#0B1F3A]">{d.v}</div></div>)}</div>
          <div className="mt-3 space-y-1">{b.features.map((f,j)=><div key={j} className="text-xs text-green-600 flex items-center gap-1"><Zap size={10}/>{f}</div>)}</div>
          <button className="mt-4 w-full bg-[#F0A500] text-[#0B1F3A] font-semibold py-2 rounded-lg hover:bg-yellow-500">Add to Proposal</button>
        </div>
      ))}</div>}
      {tab==="installs" && <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"><table className="w-full text-sm"><thead><tr className="border-b">{["Customer","Battery","Capacity","Backup Loads","Install Date","Status"].map(h=><th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead><tbody>{installs.map(inst=>(
        <tr key={inst.id} className="border-b border-gray-50 hover:bg-gray-50"><td className="py-3 px-3 font-medium">{inst.customer}</td><td className="py-3 px-3">{inst.battery}</td><td className="py-3 px-3">{inst.capacity}</td><td className="py-3 px-3">{inst.backupLoads}</td><td className="py-3 px-3 text-gray-500">{inst.installDate}</td><td className="py-3 px-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${inst.status==="active"?"bg-green-100 text-green-700":"bg-yellow-100 text-yellow-700"}`}>{inst.status}</span></td></tr>
      ))}</tbody></table></div>}
    </div>
  );
}
