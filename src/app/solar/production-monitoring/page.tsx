"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { DollarSign, TrendingUp, Users, Search, Zap, BarChart3, Clock, CheckCircle, AlertTriangle, Sun, Battery, Plug } from "lucide-react";

const systems = [
  { id: 1, customer: "Garcia Residence", size: 9.6, todayKwh: 42.3, expected: 44.2, ratio: 95.7, status: "performing" },
  { id: 2, customer: "Williams Home", size: 7.2, todayKwh: 28.1, expected: 33.1, ratio: 84.9, status: "underperforming" },
  { id: 3, customer: "Johnson Family", size: 12.0, todayKwh: 55.8, expected: 55.2, ratio: 101.1, status: "performing" },
  { id: 4, customer: "Anderson Home", size: 6.0, todayKwh: 0, expected: 27.6, ratio: 0, status: "offline" },
  { id: 5, customer: "Martinez Home", size: 8.4, todayKwh: 38.9, expected: 38.6, ratio: 100.8, status: "performing" },
  { id: 6, customer: "Brown Family", size: 10.8, todayKwh: 47.2, expected: 49.7, ratio: 95.0, status: "performing" },
];
const integrations = [{name:"Enphase Enlighten",status:"Connected"},{name:"SolarEdge Monitoring",status:"Connected"},{name:"Tesla Gateway",status:"Available"}];
export default function ProductionMonitoringPage() {
  const totalToday = systems.reduce((a,s) => a + s.todayKwh, 0);
  const online = systems.filter(s => s.status !== "offline").length;
  const avgRatio = Math.round(systems.filter(s=>s.status!=="offline").reduce((a,s)=>a+s.ratio,0)/Math.max(online,1)*10)/10;
  const statusColors: Record<string,string> = { performing: "bg-green-100 text-green-700", underperforming: "bg-yellow-100 text-yellow-700", offline: "bg-red-100 text-red-700" };
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8"><h1 className="text-3xl font-bold text-[#0B1F3A]">Production Monitoring</h1><p className="text-gray-500 mt-1">Fleet-wide solar production tracking and performance alerts</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{l:"Fleet kWh Today",v:`${totalToday.toFixed(1)}`,icon:Sun},{l:"Systems Online",v:`${online}/${systems.length}`,icon:Zap},{l:"Avg Performance",v:`${avgRatio}%`,icon:BarChart3},{l:"Alerts",v:systems.filter(s=>s.status!=="performing").length.toString(),icon:AlertTriangle}].map((s,i) => <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-1"><s.icon size={16} className="text-[#F0A500]" /><span className="text-xs text-gray-500">{s.l}</span></div><div className="text-2xl font-bold text-[#0B1F3A]">{s.v}</div></div>)}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <table className="w-full text-sm"><thead><tr className="border-b">{["Customer","System Size","Today (kWh)","Expected","Performance","Status"].map(h=><th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead><tbody>{systems.map(s=>(
          <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50"><td className="py-3 px-3 font-medium">{s.customer}</td><td className="py-3 px-3">{s.size}kW</td><td className="py-3 px-3 font-semibold">{s.todayKwh}</td><td className="py-3 px-3 text-gray-500">{s.expected}</td><td className="py-3 px-3"><div className="flex items-center gap-2"><div className="w-20 h-2 bg-gray-200 rounded-full"><div className={`h-2 rounded-full ${s.ratio>=95?"bg-green-500":s.ratio>=80?"bg-yellow-500":"bg-red-500"}`} style={{width:`${Math.min(s.ratio,100)}%`}} /></div><span className="text-xs font-medium">{s.ratio}%</span></div></td><td className="py-3 px-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[s.status]}`}>{s.status}</span></td></tr>
        ))}</tbody></table>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{integrations.map((p,i) => <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-3"><div className="p-2 rounded-lg bg-orange-100"><Plug size={18} className="text-orange-600" /></div><div className="flex-1"><div className="font-medium text-[#0B1F3A]">{p.name}</div></div><span className={`text-xs font-medium px-2 py-1 rounded-full ${p.status==="Connected"?"bg-green-100 text-green-700":"bg-gray-100 text-gray-600"}`}>{p.status}</span></div>)}</div>
    </div>
  );
}
