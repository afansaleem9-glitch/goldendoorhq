"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { Briefcase, Plus, Search, CheckCircle, Clock, AlertTriangle, ChevronDown, ChevronRight, Camera, FileText, DollarSign, HardHat, Package, Calendar, MessageSquare, MapPin } from "lucide-react";

interface Job {
  id: string; job_number: string; customer: string; address: string; status: string;
  roof_type: string; squares: number; contract_amount: number; material_ordered: boolean;
  crew: string; start_date: string; completion_date: string; milestones: { name: string; done: boolean }[];
  photos: number; documents: number; messages: number;
}

const MOCK: Job[] = [
  { id:"1",job_number:"JOB-2024-018",customer:"Williams Home",address:"789 Pine St, Detroit MI",status:"in_progress",roof_type:"Architectural Shingle",squares:34,contract_amount:18750,material_ordered:true,crew:"Crew Alpha",start_date:"2024-04-10",completion_date:"",milestones:[{name:"Contract Signed",done:true},{name:"Permit Pulled",done:true},{name:"Material Ordered",done:true},{name:"Material Delivered",done:true},{name:"Tear-Off",done:true},{name:"Install",done:false},{name:"Final Inspection",done:false},{name:"Final Payment",done:false}],photos:34,documents:8,messages:12 },
  { id:"2",job_number:"JOB-2024-017",customer:"Anderson LLC",address:"100 Industrial Pkwy, Columbus OH",status:"in_progress",roof_type:"Modified Bitumen",squares:85,contract_amount:45000,material_ordered:true,crew:"Crew Commercial",start_date:"2024-04-08",completion_date:"",milestones:[{name:"Contract Signed",done:true},{name:"Permit Pulled",done:true},{name:"Material Ordered",done:true},{name:"Material Delivered",done:true},{name:"Tear-Off",done:false},{name:"Install",done:false},{name:"Final Inspection",done:false},{name:"Final Payment",done:false}],photos:56,documents:14,messages:23 },
  { id:"3",job_number:"JOB-2024-016",customer:"Smith Residence",address:"1234 Elm St, Columbus OH",status:"scheduled",roof_type:"Standing Seam Metal",squares:22,contract_amount:34000,material_ordered:true,crew:"Crew Bravo",start_date:"2024-04-18",completion_date:"",milestones:[{name:"Contract Signed",done:true},{name:"Permit Pulled",done:true},{name:"Material Ordered",done:true},{name:"Material Delivered",done:false},{name:"Tear-Off",done:false},{name:"Install",done:false},{name:"Final Inspection",done:false},{name:"Final Payment",done:false}],photos:12,documents:6,messages:8 },
  { id:"4",job_number:"JOB-2024-015",customer:"Garcia Residence",address:"6789 Cedar Ln, Dallas TX",status:"complete",roof_type:"Tile Roof",squares:30,contract_amount:34500,material_ordered:true,crew:"Crew Delta",start_date:"2024-03-25",completion_date:"2024-04-05",milestones:[{name:"Contract Signed",done:true},{name:"Permit Pulled",done:true},{name:"Material Ordered",done:true},{name:"Material Delivered",done:true},{name:"Tear-Off",done:true},{name:"Install",done:true},{name:"Final Inspection",done:true},{name:"Final Payment",done:true}],photos:78,documents:12,messages:18 },
  { id:"5",job_number:"JOB-2024-014",customer:"Johnson Family",address:"4521 Oak Ave, Dallas TX",status:"in_progress",roof_type:"Architectural Shingle",squares:28,contract_amount:14200,material_ordered:true,crew:"Crew Alpha",start_date:"2024-04-12",completion_date:"",milestones:[{name:"Contract Signed",done:true},{name:"Permit Pulled",done:true},{name:"Material Ordered",done:true},{name:"Material Delivered",done:true},{name:"Tear-Off",done:false},{name:"Install",done:false},{name:"Final Inspection",done:false},{name:"Final Payment",done:false}],photos:22,documents:7,messages:9 },
  { id:"6",job_number:"JOB-2024-013",customer:"Brown Corp",address:"500 Commerce Blvd, Dallas TX",status:"scheduled",roof_type:"TPO Commercial",squares:120,contract_amount:72000,material_ordered:false,crew:"Crew Commercial",start_date:"2024-04-22",completion_date:"",milestones:[{name:"Contract Signed",done:true},{name:"Permit Pulled",done:false},{name:"Material Ordered",done:false},{name:"Material Delivered",done:false},{name:"Tear-Off",done:false},{name:"Install",done:false},{name:"Final Inspection",done:false},{name:"Final Payment",done:false}],photos:8,documents:4,messages:5 },
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(MOCK);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState<string|null>(null);

  const filtered = jobs.filter(j=>{
    const ms = j.customer.toLowerCase().includes(search.toLowerCase())||j.job_number.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter==="all"||j.status===statusFilter;
    return ms&&mf;
  });

  const totalContract = jobs.reduce((a,j)=>a+j.contract_amount,0);
  const statusColor: Record<string,string> = { scheduled:"bg-blue-100 text-blue-700",in_progress:"bg-yellow-100 text-yellow-700",complete:"bg-green-100 text-green-700",on_hold:"bg-red-100 text-red-700" };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-amber-600 to-amber-800 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div><div className="flex items-center gap-3 mb-2"><Briefcase className="w-8 h-8"/><h1 className="text-3xl font-bold">Jobs & Production</h1></div>
            <p className="text-amber-200">Digital job files with milestone tracking, live activity feed, and full production board.</p></div>
          <button className="bg-white text-amber-700 px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2"><Plus className="w-5 h-5"/> New Job</button>
        </div>
        <div className="grid grid-cols-5 gap-4 mt-6">
          {[{label:"Total Jobs",val:jobs.length},{label:"In Progress",val:jobs.filter(j=>j.status==="in_progress").length},{label:"Scheduled",val:jobs.filter(j=>j.status==="scheduled").length},{label:"Completed",val:jobs.filter(j=>j.status==="complete").length},{label:"Contract Value",val:`$${(totalContract/1000).toFixed(0)}K`}].map(s=><div key={s.label} className="bg-white/10 rounded-xl p-4"><div className="text-2xl font-bold">{s.val}</div><div className="text-amber-200 text-sm">{s.label}</div></div>)}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1"><Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search jobs..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"/></div>
        <div className="flex gap-2">{["all","scheduled","in_progress","complete"].map(s=><button key={s} onClick={()=>setStatusFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${statusFilter===s?"bg-amber-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s.replace("_"," ")}</button>)}</div>
      </div>

      <div className="space-y-3">
        {filtered.map(j=>(
          <div key={j.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-5 cursor-pointer hover:bg-gray-50" onClick={()=>setExpanded(expanded===j.id?null:j.id)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {expanded===j.id?<ChevronDown className="w-5 h-5 text-gray-400"/>:<ChevronRight className="w-5 h-5 text-gray-400"/>}
                  <div>
                    <h3 className="font-semibold text-gray-900">{j.job_number} — {j.customer}</h3>
                    <p className="text-sm text-gray-500"><MapPin className="w-3 h-3 inline mr-1"/>{j.address} • {j.roof_type} • {j.squares} sq • {j.crew}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right"><div className="text-lg font-bold text-gray-900">${j.contract_amount.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{j.milestones.filter(m=>m.done).length}/{j.milestones.length} milestones</div></div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[j.status]}`}>{j.status.replace("_"," ")}</span>
                </div>
              </div>
              {/* Milestone Progress Bar */}
              <div className="mt-3 ml-9"><div className="w-full bg-gray-200 rounded-full h-2"><div className="h-2 rounded-full bg-amber-500 transition-all" style={{width:`${(j.milestones.filter(m=>m.done).length/j.milestones.length)*100}%`}}/></div></div>
            </div>
            {expanded===j.id&&(
              <div className="border-t border-gray-200 p-5 bg-gray-50">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Milestones</h4>
                    <div className="space-y-2">
                      {j.milestones.map((m,i)=>(
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${m.done?"bg-green-100":"bg-gray-100"}`}>
                            {m.done?<CheckCircle className="w-4 h-4 text-green-600"/>:<Clock className="w-4 h-4 text-gray-400"/>}
                          </div>
                          <span className={`text-sm ${m.done?"text-gray-900":"text-gray-500"}`}>{m.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Job Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-500">Start Date</span><span>{j.start_date}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Completion</span><span>{j.completion_date||"In Progress"}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Crew</span><span>{j.crew}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Material Ordered</span><span>{j.material_ordered?"Yes":"No"}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Contract</span><span className="font-bold text-green-700">${j.contract_amount.toLocaleString()}</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Job File</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white rounded-lg p-3 border text-center"><Camera className="w-5 h-5 mx-auto text-blue-600 mb-1"/><div className="text-lg font-bold">{j.photos}</div><div className="text-xs text-gray-500">Photos</div></div>
                      <div className="bg-white rounded-lg p-3 border text-center"><FileText className="w-5 h-5 mx-auto text-purple-600 mb-1"/><div className="text-lg font-bold">{j.documents}</div><div className="text-xs text-gray-500">Docs</div></div>
                      <div className="bg-white rounded-lg p-3 border text-center"><MessageSquare className="w-5 h-5 mx-auto text-green-600 mb-1"/><div className="text-lg font-bold">{j.messages}</div><div className="text-xs text-gray-500">Messages</div></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
