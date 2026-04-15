"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { Smartphone, Users, MapPin, Clock, Camera, FileText, CheckCircle, AlertTriangle, Wifi, Battery, Navigation, Wrench, Star, BarChart3 } from "lucide-react";

interface CrewMember {
  id: string; name: string; role: string; phone: string; status: string; location: string;
  current_job: string | null; check_in_time: string | null; photos_today: number; tasks_complete: number; tasks_total: number;
  certifications: string[]; rating: number;
}

interface FieldJob {
  id: string; job_number: string; customer: string; address: string; status: string;
  crew: string; start_time: string; checklist: { item: string; done: boolean }[];
  materials_on_site: boolean; photos_required: number; photos_taken: number;
}

const CREW: CrewMember[] = [
  { id:"1",name:"Carlos Rivera",role:"Crew Lead",phone:"(214) 555-1001",status:"on_site",location:"789 Pine St, Detroit MI",current_job:"RJ-2024-089",check_in_time:"6:45 AM",photos_today:8,tasks_complete:4,tasks_total:12,certifications:["GAF Master Elite","OSHA 30"],rating:4.9 },
  { id:"2",name:"Marcus Thompson",role:"Installer",phone:"(214) 555-1002",status:"on_site",location:"789 Pine St, Detroit MI",current_job:"RJ-2024-089",check_in_time:"6:50 AM",photos_today:3,tasks_complete:4,tasks_total:12,certifications:["GAF Certified","OSHA 10"],rating:4.7 },
  { id:"3",name:"David Chen",role:"Installer",phone:"(214) 555-1003",status:"on_site",location:"789 Pine St, Detroit MI",current_job:"RJ-2024-089",check_in_time:"6:48 AM",photos_today:2,tasks_complete:4,tasks_total:12,certifications:["OSHA 10"],rating:4.6 },
  { id:"4",name:"James Wilson",role:"Crew Lead",phone:"(214) 555-1004",status:"in_transit",location:"En route to 123 Elm St",current_job:"RJ-2024-082",check_in_time:null,photos_today:0,tasks_complete:0,tasks_total:8,certifications:["GAF Master Elite","OSHA 30","CertainTeed SELECT"],rating:4.8 },
  { id:"5",name:"Alex Rodriguez",role:"Installer",phone:"(214) 555-1005",status:"available",location:"Warehouse",current_job:null,check_in_time:"7:00 AM",photos_today:0,tasks_complete:0,tasks_total:0,certifications:["OSHA 10"],rating:4.5 },
  { id:"6",name:"Mike Johnson",role:"QA Inspector",phone:"(214) 555-1006",status:"on_site",location:"6789 Cedar Ln, Dallas TX",current_job:"RJ-2024-085",check_in_time:"9:30 AM",photos_today:12,tasks_complete:6,tasks_total:8,certifications:["HAAG Certified","GAF Master Elite","OSHA 30"],rating:4.9 }
];

const FIELD_JOBS: FieldJob[] = [
  { id:"1",job_number:"RJ-2024-089",customer:"Williams Home",address:"789 Pine St, Detroit MI",status:"in_progress",crew:"Alpha Crew (3)",start_time:"7:00 AM",materials_on_site:true,photos_required:20,photos_taken:13,
    checklist:[{item:"Safety meeting completed",done:true},{item:"Perimeter protection installed",done:true},{item:"Tear-off started",done:true},{item:"Tear-off complete",done:true},{item:"Decking inspected",done:false},{item:"Ice & water shield installed",done:false},{item:"Underlayment installed",done:false},{item:"Drip edge installed",done:false},{item:"Shingles started",done:false},{item:"Shingles complete",done:false},{item:"Ridge cap installed",done:false},{item:"Final cleanup & magnet sweep",done:false}]},
  { id:"2",job_number:"RJ-2024-082",customer:"Davis Home",address:"123 Elm St, Columbus OH",status:"crew_en_route",crew:"Bravo Crew (2)",start_time:"1:00 PM",materials_on_site:true,photos_required:10,photos_taken:0,
    checklist:[{item:"Safety meeting completed",done:false},{item:"Assess storm damage",done:false},{item:"Install emergency tarp",done:false},{item:"Partial tear-off",done:false},{item:"Flash & repair damaged area",done:false},{item:"Install new shingles",done:false},{item:"Quality check",done:false},{item:"Customer walkthrough",done:false}]},
  { id:"3",job_number:"RJ-2024-085",customer:"Garcia Residence",address:"6789 Cedar Ln, Dallas TX",status:"inspection",crew:"QA Team (1)",start_time:"9:30 AM",materials_on_site:false,photos_required:15,photos_taken:12,
    checklist:[{item:"Shingle alignment check",done:true},{item:"Flashing inspection",done:true},{item:"Ridge cap verification",done:true},{item:"Drip edge check",done:true},{item:"Gutter re-attachment",done:true},{item:"Attic ventilation check",done:true},{item:"Before/after photo set",done:false},{item:"Customer sign-off",done:false}]}
];

export default function CrewAppPage() {
  const [crew, setCrew] = useState(CREW);
  const [jobs, setJobs] = useState(FIELD_JOBS);
  const [tab, setTab] = useState<"crew"|"jobs"|"live">("live");

  useEffect(() => { supabase.from("roofing_crews").select("*").eq("org_id", ORG_ID).then(({ data }) => { if (data?.length) setCrew(data as any); }); }, []);

  const statusColor = (s: string) => s === "on_site" ? "bg-green-100 text-green-700" : s === "in_transit" ? "bg-blue-100 text-blue-700" : s === "available" ? "bg-gray-100 text-gray-600" : "bg-yellow-100 text-yellow-700";
  const statusDot = (s: string) => s === "on_site" ? "bg-green-500" : s === "in_transit" ? "bg-blue-500" : "bg-gray-400";

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-[#0B1F3A] flex items-center gap-2"><Smartphone className="text-[#F0A500]" size={28}/>Mobile Crew App</h1><p className="text-gray-500 mt-1">Real-time field access — job details, photo upload, time tracking & checklists</p></div>
        <div className="flex gap-1">{(["live","crew","jobs"] as const).map(t=><button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab===t?"bg-[#0B1F3A] text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{t==="live"?"Live View":t==="crew"?"Crew Members":"Field Jobs"}</button>)}</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {[{l:"Crew On-Site",v:crew.filter(c=>c.status==="on_site").length,c:"text-green-600"},{l:"In Transit",v:crew.filter(c=>c.status==="in_transit").length,c:"text-blue-600"},{l:"Available",v:crew.filter(c=>c.status==="available").length,c:"text-gray-600"},{l:"Active Jobs",v:jobs.length,c:"text-purple-600"},{l:"Photos Today",v:crew.reduce((s,c)=>s+c.photos_today,0),c:"text-orange-600"},{l:"Tasks Done",v:`${crew.reduce((s,c)=>s+c.tasks_complete,0)}/${crew.reduce((s,c)=>s+c.tasks_total,0)}`,c:"text-cyan-600"}].map((s,i)=>(
          <div key={i} className="bg-white rounded-xl border p-3 text-center"><p className={`text-xl font-bold ${s.c}`}>{s.v}</p><p className="text-[10px] text-gray-500">{s.l}</p></div>
        ))}
      </div>

      {tab === "live" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Live Map Placeholder */}
          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-bold text-[#0B1F3A] mb-3 flex items-center gap-2"><Navigation size={16} className="text-[#F0A500]"/>Live GPS Tracking</h3>
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center text-gray-400 text-sm">
              <div className="text-center"><MapPin size={32} className="mx-auto mb-2 text-gray-300"/><p>Live map with crew GPS positions</p><p className="text-xs mt-1">Google Maps API integration</p></div>
            </div>
            <div className="mt-3 space-y-2">
              {crew.filter(c=>c.status!=="available").map(c=>(
                <div key={c.id} className="flex items-center gap-2 text-xs"><div className={`w-2 h-2 rounded-full ${statusDot(c.status)} animate-pulse`}/><span className="font-medium">{c.name}</span><span className="text-gray-400">—</span><span className="text-gray-500">{c.location}</span></div>
              ))}
            </div>
          </div>
          {/* Active Field Jobs */}
          <div className="space-y-3">
            {jobs.map(j=>(
              <div key={j.id} className="bg-white rounded-xl border p-4">
                <div className="flex items-center justify-between mb-2">
                  <div><span className="font-mono text-xs text-gray-400">{j.job_number}</span><h3 className="font-semibold text-[#0B1F3A]">{j.customer}</h3><p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={10}/>{j.address}</p></div>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${j.status==="in_progress"?"bg-green-100 text-green-700":j.status==="inspection"?"bg-blue-100 text-blue-700":"bg-yellow-100 text-yellow-700"}`}>{j.status.replace("_"," ")}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-2"><span className="flex items-center gap-1"><Users size={12}/>{j.crew}</span><span className="flex items-center gap-1"><Clock size={12}/>{j.start_time}</span><span className="flex items-center gap-1"><Camera size={12}/>{j.photos_taken}/{j.photos_required}</span></div>
                {/* Checklist progress */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-1"><div className="bg-green-500 h-2 rounded-full" style={{width:`${(j.checklist.filter(c=>c.done).length/j.checklist.length)*100}%`}}/></div>
                <p className="text-[10px] text-gray-400">{j.checklist.filter(c=>c.done).length}/{j.checklist.length} checklist items complete</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "crew" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {crew.map(c=>(
            <div key={c.id} className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#0B1F3A] rounded-full flex items-center justify-center text-white font-bold text-sm">{c.name.split(" ").map(n=>n[0]).join("")}</div>
                <div className="flex-1"><h3 className="font-semibold text-[#0B1F3A]">{c.name}</h3><p className="text-xs text-gray-500">{c.role} · {c.phone}</p></div>
                <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${statusColor(c.status)}`}>{c.status.replace("_"," ")}</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs mb-2">
                <div><p className="font-bold text-[#0B1F3A]">{c.photos_today}</p><p className="text-[10px] text-gray-400">Photos</p></div>
                <div><p className="font-bold text-[#0B1F3A]">{c.tasks_complete}/{c.tasks_total}</p><p className="text-[10px] text-gray-400">Tasks</p></div>
                <div><p className="font-bold text-yellow-600 flex items-center justify-center gap-0.5"><Star size={10}/>{c.rating}</p><p className="text-[10px] text-gray-400">Rating</p></div>
                <div><p className="font-bold text-gray-600">{c.check_in_time||"—"}</p><p className="text-[10px] text-gray-400">Check-in</p></div>
              </div>
              <div className="flex flex-wrap gap-1">{c.certifications.map(cert=><span key={cert} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[10px]">{cert}</span>)}</div>
              {c.current_job && <p className="text-xs text-gray-500 mt-2 flex items-center gap-1"><MapPin size={10}/>{c.location}</p>}
            </div>
          ))}
        </div>
      )}

      {tab === "jobs" && (
        <div className="space-y-4">
          {jobs.map(j=>(
            <div key={j.id} className="bg-white rounded-xl border p-4">
              <div className="flex items-center justify-between mb-3">
                <div><div className="flex items-center gap-2"><span className="font-mono text-xs text-gray-400">{j.job_number}</span><h3 className="font-semibold text-[#0B1F3A]">{j.customer}</h3></div><p className="text-xs text-gray-500">{j.address} · {j.crew} · Started {j.start_time}</p></div>
                <div className="flex gap-4 text-xs"><span className="flex items-center gap-1"><Camera size={12}/>{j.photos_taken}/{j.photos_required} photos</span><span className={j.materials_on_site?"text-green-600":"text-red-600"}>{j.materials_on_site?"✓ Materials on site":"⚠ Materials pending"}</span></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {j.checklist.map((item,i)=>(
                  <label key={i} className={`flex items-center gap-2 text-xs p-2 rounded-lg border ${item.done?"bg-green-50 border-green-200":"bg-gray-50"}`}>
                    <input type="checkbox" checked={item.done} readOnly className="rounded"/>
                    <span className={item.done?"text-green-700 line-through":"text-gray-700"}>{item.item}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
