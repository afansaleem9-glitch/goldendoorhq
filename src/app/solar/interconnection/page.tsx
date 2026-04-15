"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { DollarSign, TrendingUp, Users, Search, Zap, BarChart3, Clock, CheckCircle, AlertTriangle, Sun, Battery, Plug } from "lucide-react";

const stages = ["Submitted", "Engineering Review", "Meter Set", "PTO Granted"];
const stageColors = ["bg-blue-500", "bg-purple-500", "bg-orange-500", "bg-green-500"];
const applications = [
  { id: 1, customer: "Garcia Residence", utility: "Oncor", appNo: "IC-2024-4521", status: 0, submitted: "2024-04-01", days: 14 },
  { id: 2, customer: "Williams Home", utility: "AEP Texas", appNo: "IC-2024-4522", status: 1, submitted: "2024-03-20", days: 26 },
  { id: 3, customer: "Johnson Family", utility: "Oncor", appNo: "IC-2024-4523", status: 2, submitted: "2024-03-05", days: 41 },
  { id: 4, customer: "Anderson Home", utility: "CenterPoint", appNo: "IC-2024-4524", status: 3, submitted: "2024-02-15", days: 59 },
  { id: 5, customer: "Martinez Home", utility: "DTE Energy", appNo: "IC-2024-4525", status: 0, submitted: "2024-04-08", days: 7 },
  { id: 6, customer: "Brown Family", utility: "Consumers", appNo: "IC-2024-4526", status: 1, submitted: "2024-03-25", days: 21 },
];
export default function InterconnectionPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8"><h1 className="text-3xl font-bold text-[#0B1F3A]">Interconnection</h1><p className="text-gray-500 mt-1">Utility application tracking from submission to PTO</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{l:"Avg Days to PTO",v:"42",icon:Clock},{l:"Pending Apps",v:applications.filter(a=>a.status<3).length.toString(),icon:AlertTriangle},{l:"PTO This Month",v:"8",icon:CheckCircle},{l:"Rejections",v:"1",icon:AlertTriangle}].map((s,i) => <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-1"><s.icon size={16} className="text-[#F0A500]" /><span className="text-xs text-gray-500">{s.l}</span></div><div className="text-2xl font-bold text-[#0B1F3A]">{s.v}</div></div>)}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-1">{stages.map((s,i)=>{const count=applications.filter(a=>a.status===i).length;return <div key={i} className="flex-1 text-center py-3"><div className={`w-8 h-8 rounded-full ${stageColors[i]} text-white text-sm font-bold flex items-center justify-center mx-auto mb-1`}>{count}</div><div className="text-xs text-gray-600 font-medium">{s}</div></div>})}</div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <table className="w-full text-sm"><thead><tr className="border-b">{["Customer","Utility","App #","Stage","Submitted","Days Pending"].map(h=><th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead><tbody>{applications.map(a=>(
          <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50"><td className="py-3 px-3 font-medium">{a.customer}</td><td className="py-3 px-3">{a.utility}</td><td className="py-3 px-3 font-mono text-[#F0A500]">{a.appNo}</td><td className="py-3 px-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${stageColors[a.status]}`}>{stages[a.status]}</span></td><td className="py-3 px-3 text-gray-500">{a.submitted}</td><td className="py-3 px-3 font-semibold">{a.days}d</td></tr>
        ))}</tbody></table>
      </div>
    </div>
  );
}
