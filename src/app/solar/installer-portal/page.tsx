"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { DollarSign, TrendingUp, Users, CheckCircle, AlertTriangle, Search, Plus, Package, ClipboardCheck, Sun, Wrench, BarChart3, Star, Calendar } from "lucide-react";

const installers = [
  { id: 1, company: "SunTech Installations", license: "TX-SOL-4521", states: ["TX","OH"], certs: ["NABCEP","REC Certified"], rating: 4.8, activeJobs: 5, insuranceExp: "2025-06-15", avgTime: "1.2 days", warranty: 0.8 },
  { id: 2, company: "Green Power Crew", license: "TX-SOL-7892", states: ["TX"], certs: ["NABCEP","Enphase Certified"], rating: 4.6, activeJobs: 3, insuranceExp: "2025-03-01", avgTime: "1.5 days", warranty: 1.2 },
  { id: 3, company: "Midwest Solar Pros", license: "OH-SOL-3456", states: ["OH","MI"], certs: ["NABCEP","SolarEdge Certified"], rating: 4.9, activeJobs: 4, insuranceExp: "2025-09-30", avgTime: "1.1 days", warranty: 0.5 },
  { id: 4, company: "Peak Energy Install", license: "MI-SOL-6789", states: ["MI"], certs: ["NABCEP"], rating: 4.4, activeJobs: 2, insuranceExp: "2025-04-15", avgTime: "1.8 days", warranty: 2.1 },
];
export default function InstallerPortalPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8"><h1 className="text-3xl font-bold text-[#0B1F3A]">Installer Portal</h1><p className="text-gray-500 mt-1">Subcontractor management, certifications, and job assignment</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{l:"Active Installers",v:installers.length.toString(),icon:Wrench},{l:"Avg Install Time",v:"1.4 days",icon:Calendar},{l:"Quality Score",v:"4.7/5",icon:Star},{l:"Jobs This Month",v:installers.reduce((a,i)=>a+i.activeJobs,0).toString(),icon:CheckCircle}].map((s,i) => <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-1"><s.icon size={16} className="text-[#F0A500]" /><span className="text-xs text-gray-500">{s.l}</span></div><div className="text-2xl font-bold text-[#0B1F3A]">{s.v}</div></div>)}
      </div>
      <div className="space-y-4">{installers.map(inst => (
        <div key={inst.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3"><div><h3 className="text-lg font-bold text-[#0B1F3A]">{inst.company}</h3><span className="text-xs text-gray-400">License: {inst.license}</span></div><div className="flex items-center gap-2"><Star size={14} className="text-[#F0A500] fill-[#F0A500]" /><span className="font-bold">{inst.rating}</span></div></div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">{[{k:"States",v:inst.states.join(", ")},{k:"Active Jobs",v:inst.activeJobs.toString()},{k:"Avg Install Time",v:inst.avgTime},{k:"Warranty Claims",v:`${inst.warranty}%`},{k:"Insurance Exp",v:inst.insuranceExp}].map((d,j)=><div key={j} className="bg-gray-50 rounded-lg p-2"><div className="text-xs text-gray-400">{d.k}</div><div className="text-sm font-medium">{d.v}</div></div>)}</div>
          <div className="mt-3 flex gap-2">{inst.certs.map((c,j)=><span key={j} className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{c}</span>)}</div>
        </div>
      ))}</div>
    </div>
  );
}
