"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { Wrench, Search, CheckCircle, Clock, AlertTriangle, Truck, Camera, FileText, ChevronDown, ChevronRight, Plus } from "lucide-react";

interface Job {
  id: string; job_number: string; customer: string; address: string; status: string; stage: string;
  roof_type: string; squares: number; crew: string; install_date: string; material_status: string;
  permit_status: string; inspection_status: string; completion_pct: number; days_in_stage: number;
}

const STAGES = ["Contract Signed", "Permit Pulled", "Material Ordered", "Material Delivered", "Install Scheduled", "In Progress", "Install Complete", "Final Inspection", "Job Complete"];

const MOCK: Job[] = [
  { id:"1",job_number:"RJ-2024-089",customer:"Williams Home",address:"789 Pine St, Detroit MI",status:"active",stage:"In Progress",roof_type:"Architectural Shingle",squares:28,crew:"Crew Alpha",install_date:"2024-04-15",material_status:"delivered",permit_status:"approved",inspection_status:"pending",completion_pct:65,days_in_stage:2 },
  { id:"2",job_number:"RJ-2024-090",customer:"Johnson Family",address:"4521 Oak Ave, Dallas TX",status:"active",stage:"Material Ordered",roof_type:"UHDZ Shingle",squares:35,crew:"Crew Bravo",install_date:"2024-04-18",material_status:"ordered",permit_status:"approved",inspection_status:"not_started",completion_pct:30,days_in_stage:1 },
  { id:"3",job_number:"RJ-2024-087",customer:"Garcia Residence",address:"6789 Cedar Ln, Dallas TX",status:"active",stage:"Install Complete",roof_type:"Architectural Shingle",squares:22,crew:"Crew Alpha",install_date:"2024-04-12",material_status:"delivered",permit_status:"approved",inspection_status:"scheduled",completion_pct:90,days_in_stage:1 },
  { id:"4",job_number:"RJ-2024-091",customer:"Brown Corp",address:"500 Commerce Blvd, Dallas TX",status:"active",stage:"Permit Pulled",roof_type:"TPO Commercial",squares:82,crew:"Commercial Team",install_date:"2024-04-22",material_status:"ordered",permit_status:"approved",inspection_status:"not_started",completion_pct:20,days_in_stage:3 },
  { id:"5",job_number:"RJ-2024-088",customer:"Davis Family",address:"2345 Maple Dr, Columbus OH",status:"active",stage:"Contract Signed",roof_type:"Landmark Shingle",squares:16,crew:"TBD",install_date:"TBD",material_status:"not_ordered",permit_status:"pending",inspection_status:"not_started",completion_pct:10,days_in_stage:4 },
  { id:"6",job_number:"RJ-2024-085",customer:"Taylor Home",address:"8901 Walnut Ct, Dallas TX",status:"completed",stage:"Job Complete",roof_type:"Architectural Shingle",squares:24,crew:"Crew Bravo",install_date:"2024-04-08",material_status:"delivered",permit_status:"approved",inspection_status:"passed",completion_pct:100,days_in_stage:0 },
  { id:"7",job_number:"RJ-2024-086",customer:"Chen Residence",address:"345 Lotus Ln, Columbus OH",status:"active",stage:"Install Scheduled",roof_type:"Duration Shingle",squares:20,crew:"Crew Charlie",install_date:"2024-04-17",material_status:"delivered",permit_status:"approved",inspection_status:"not_started",completion_pct:45,days_in_stage:1 },
  { id:"8",job_number:"RJ-2024-092",customer:"Patel Family",address:"678 Summit Dr, Detroit MI",status:"active",stage:"Material Delivered",roof_type:"HDZ Shingle",squares:26,crew:"Crew Alpha",install_date:"2024-04-19",material_status:"delivered",permit_status:"approved",inspection_status:"not_started",completion_pct:40,days_in_stage:1 },
];

export default function ProductionPage() {
  const [jobs, setJobs] = useState<Job[]>(MOCK);
  const [view, setView] = useState<"board"|"list">("board");
  const [search, setSearch] = useState("");

  const filtered = jobs.filter(j => j.customer.toLowerCase().includes(search.toLowerCase()) || j.job_number.toLowerCase().includes(search.toLowerCase()));

  const materialColor: Record<string, string> = { delivered: "text-green-600", ordered: "text-blue-600", not_ordered: "text-gray-400" };
  const permitColor: Record<string, string> = { approved: "text-green-600", pending: "text-yellow-600", not_started: "text-gray-400" };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div><div className="flex items-center gap-3 mb-2"><Wrench className="w-8 h-8" /><h1 className="text-3xl font-bold">Production Management</h1></div>
            <p className="text-green-200">Track every job from contract to completion. Live milestones, crew scheduling, material tracking.</p></div>
          <div className="flex gap-2">
            <button onClick={() => setView("board")} className={`px-4 py-2 rounded-lg text-sm font-medium ${view === "board" ? "bg-white text-green-700" : "bg-white/20"}`}>Board</button>
            <button onClick={() => setView("list")} className={`px-4 py-2 rounded-lg text-sm font-medium ${view === "list" ? "bg-white text-green-700" : "bg-white/20"}`}>List</button>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4 mt-6">
          {[
            { label: "Active Jobs", val: jobs.filter(j => j.status === "active").length },
            { label: "In Progress", val: jobs.filter(j => j.stage === "In Progress").length },
            { label: "Awaiting Materials", val: jobs.filter(j => j.material_status === "ordered").length },
            { label: "Ready to Install", val: jobs.filter(j => j.stage === "Install Scheduled").length },
            { label: "Completed This Month", val: jobs.filter(j => j.status === "completed").length },
          ].map(s => <div key={s.label} className="bg-white/10 rounded-xl p-4"><div className="text-2xl font-bold">{s.val}</div><div className="text-green-200 text-sm">{s.label}</div></div>)}
        </div>
      </div>

      <div className="relative mb-6"><Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" /></div>

      {view === "board" ? (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {STAGES.map(stage => {
            const stageJobs = filtered.filter(j => j.stage === stage);
            return (
              <div key={stage} className="min-w-[260px] bg-gray-50 rounded-xl p-3">
                <div className="flex items-center justify-between mb-3"><h3 className="font-semibold text-sm text-gray-700">{stage}</h3><span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">{stageJobs.length}</span></div>
                <div className="space-y-2">
                  {stageJobs.map(j => (
                    <div key={j.id} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow">
                      <div className="text-xs font-mono text-gray-400 mb-1">{j.job_number}</div>
                      <div className="font-semibold text-sm text-gray-900">{j.customer}</div>
                      <div className="text-xs text-gray-500 mb-2">{j.address}</div>
                      <div className="flex items-center justify-between text-xs">
                        <span>{j.squares} sq • {j.crew}</span>
                        <span className={`font-medium ${j.completion_pct >= 90 ? "text-green-600" : j.completion_pct >= 50 ? "text-blue-600" : "text-amber-600"}`}>{j.completion_pct}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1"><div className="h-1.5 rounded-full bg-green-500 transition-all" style={{ width: `${j.completion_pct}%` }} /></div>
                      <div className="flex gap-2 mt-2 text-xs">
                        <span className={materialColor[j.material_status]}>Mat: {j.material_status.replace("_", " ")}</span>
                        <span className={permitColor[j.permit_status]}>Permit: {j.permit_status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full"><thead className="bg-gray-50"><tr>{["Job #", "Customer", "Stage", "Squares", "Crew", "Install Date", "Materials", "Permit", "Progress"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-200">{filtered.map(j => (
              <tr key={j.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-mono">{j.job_number}</td>
                <td className="px-4 py-3"><div className="text-sm font-medium">{j.customer}</div><div className="text-xs text-gray-500">{j.address}</div></td>
                <td className="px-4 py-3 text-sm">{j.stage}</td>
                <td className="px-4 py-3 text-sm">{j.squares}</td>
                <td className="px-4 py-3 text-sm">{j.crew}</td>
                <td className="px-4 py-3 text-sm">{j.install_date}</td>
                <td className="px-4 py-3"><span className={`text-xs font-medium ${materialColor[j.material_status]}`}>{j.material_status.replace("_", " ")}</span></td>
                <td className="px-4 py-3"><span className={`text-xs font-medium ${permitColor[j.permit_status]}`}>{j.permit_status}</span></td>
                <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-16 bg-gray-200 rounded-full h-2"><div className="h-2 rounded-full bg-green-500" style={{ width: `${j.completion_pct}%` }} /></div><span className="text-xs font-medium">{j.completion_pct}%</span></div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
