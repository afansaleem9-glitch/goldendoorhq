"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { FileText, DollarSign, Users, MapPin, CheckCircle, TrendingUp, Search, Plus, Signal, Wifi, Clock, AlertTriangle, BarChart3, Star } from "lucide-react";

const territories = [
  { id: 1, name: "Dallas Central", zips: "75201-75212", rep: "Sarah Chen", households: 45000, penetration: 38, fiberPct: 85 },
  { id: 2, name: "Plano/Frisco", zips: "75023-75035", rep: "Mike Torres", households: 62000, penetration: 42, fiberPct: 92 },
  { id: 3, name: "McKinney/Allen", zips: "75069-75075", rep: "James Reid", households: 38000, penetration: 28, fiberPct: 78 },
  { id: 4, name: "Richardson/Garland", zips: "75080-75089", rep: "Lisa Park", households: 51000, penetration: 35, fiberPct: 80 },
  { id: 5, name: "Columbus OH", zips: "43201-43235", rep: "David Kim", households: 72000, penetration: 22, fiberPct: 65 },
  { id: 6, name: "Detroit MI", zips: "48201-48235", rep: "Unassigned", households: 85000, penetration: 15, fiberPct: 45 },
];
export default function TerritoriesPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8"><h1 className="text-3xl font-bold text-[#0B1F3A]">Territories</h1><p className="text-gray-500 mt-1">Territory mapping, assignment, and penetration analysis</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{l:"Total Territories",v:territories.length.toString(),icon:MapPin},{l:"Avg Penetration",v:`${Math.round(territories.reduce((a,t)=>a+t.penetration,0)/territories.length)}%`,icon:TrendingUp},{l:"Top Territory",v:"Plano/Frisco",icon:Star},{l:"Unassigned",v:territories.filter(t=>t.rep==="Unassigned").length.toString(),icon:AlertTriangle}].map((s,i)=><div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-1"><s.icon size={16} className="text-[#F0A500]"/><span className="text-xs text-gray-500">{s.l}</span></div><div className="text-2xl font-bold text-[#0B1F3A]">{s.v}</div></div>)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{territories.map(t=>(
        <div key={t.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3"><h3 className="text-lg font-bold text-[#0B1F3A]">{t.name}</h3><span className="text-xs text-gray-400">{t.zips}</span></div>
          <div className="grid grid-cols-2 gap-3 mb-3">{[{k:"Households",v:t.households.toLocaleString()},{k:"Penetration",v:`${t.penetration}%`},{k:"Fiber Coverage",v:`${t.fiberPct}%`},{k:"Rep",v:t.rep}].map((d,j)=><div key={j} className="bg-gray-50 rounded-lg p-2"><div className="text-xs text-gray-400">{d.k}</div><div className="text-sm font-medium">{d.v}</div></div>)}</div>
          <div className="w-full h-3 bg-gray-200 rounded-full"><div className="h-3 rounded-full bg-gradient-to-r from-[#0B1F3A] to-[#F0A500]" style={{width:`${t.penetration}%`}}/></div>
        </div>
      ))}</div>
    </div>
  );
}
