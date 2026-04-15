"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { DollarSign, TrendingUp, Users, CheckCircle, AlertTriangle, Search, Plus, Package, ClipboardCheck, Sun, Wrench, BarChart3, Star, Calendar } from "lucide-react";

const permits = [
  { id: 1, customer: "Garcia Residence", jurisdiction: "City of Dallas", permit: "BP-2024-4521", type: "Building", status: "approved", submitted: "2024-03-15", fee: 350 },
  { id: 2, customer: "Garcia Residence", jurisdiction: "City of Dallas", permit: "EP-2024-4522", type: "Electrical", status: "approved", submitted: "2024-03-15", fee: 275 },
  { id: 3, customer: "Williams Home", jurisdiction: "City of Plano", permit: "BP-2024-7892", type: "Building", status: "in_review", submitted: "2024-04-05", fee: 400 },
  { id: 4, customer: "Johnson Family", jurisdiction: "City of Frisco", permit: "BP-2024-3456", type: "Building", status: "applied", submitted: "2024-04-10", fee: 375 },
  { id: 5, customer: "Martinez Home", jurisdiction: "Columbus, OH", permit: "BP-2024-6789", type: "Building", status: "inspection_scheduled", submitted: "2024-03-20", fee: 300 },
  { id: 6, customer: "Brown Family", jurisdiction: "City of Detroit", permit: "EP-2024-2345", type: "Electrical", status: "passed", submitted: "2024-03-01", fee: 250 },
];
export default function PermitsPage() {
  const statusColors: Record<string,string> = { applied: "bg-blue-100 text-blue-700", in_review: "bg-purple-100 text-purple-700", approved: "bg-green-100 text-green-700", inspection_scheduled: "bg-orange-100 text-orange-700", passed: "bg-emerald-100 text-emerald-700", failed: "bg-red-100 text-red-700" };
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8"><h1 className="text-3xl font-bold text-[#0B1F3A]">Permits</h1><p className="text-gray-500 mt-1">Building and electrical permit tracking across jurisdictions</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{l:"Permits Pending",v:permits.filter(p=>!["approved","passed"].includes(p.status)).length.toString(),icon:ClipboardCheck},{l:"Avg Approval Days",v:"12",icon:Calendar},{l:"Pass Rate",v:"96%",icon:CheckCircle},{l:"Inspections This Week",v:"4",icon:Search}].map((s,i) => <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-1"><s.icon size={16} className="text-[#F0A500]" /><span className="text-xs text-gray-500">{s.l}</span></div><div className="text-2xl font-bold text-[#0B1F3A]">{s.v}</div></div>)}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <table className="w-full text-sm"><thead><tr className="border-b">{["Customer","Jurisdiction","Permit #","Type","Status","Submitted","Fee"].map(h=><th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead><tbody>{permits.map(p=>(
          <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50"><td className="py-3 px-3 font-medium">{p.customer}</td><td className="py-3 px-3 text-gray-600">{p.jurisdiction}</td><td className="py-3 px-3 font-mono text-[#F0A500]">{p.permit}</td><td className="py-3 px-3">{p.type}</td><td className="py-3 px-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[p.status]||""}`}>{p.status.replace("_"," ")}</span></td><td className="py-3 px-3 text-gray-500">{p.submitted}</td><td className="py-3 px-3">${p.fee}</td></tr>
        ))}</tbody></table>
      </div>
    </div>
  );
}
