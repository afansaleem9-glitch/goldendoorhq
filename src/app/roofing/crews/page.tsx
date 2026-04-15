"use client";
import { useState } from "react";
import { HardHat, Plus, Calendar, MapPin, Star, Phone, Clock, CheckCircle, Users } from "lucide-react";

const CREWS = [
  { id:"1",name:"Crew Alpha",lead:"Roberto Vasquez",phone:"(214) 555-7001",size:6,type:"Residential Shingle",status:"on_job",current_job:"Williams Home — Tear-off",rating:4.9,jobs_completed:156,location:"789 Pine St, Detroit MI" },
  { id:"2",name:"Crew Bravo",lead:"Marcus Johnson",phone:"(614) 555-7002",size:5,type:"Residential Metal/Tile",status:"available",current_job:"—",rating:4.8,jobs_completed:98,location:"Columbus Yard" },
  { id:"3",name:"Crew Commercial",lead:"David Perez",phone:"(214) 555-7003",size:10,type:"Commercial Flat/TPO",status:"on_job",current_job:"Anderson LLC — Modified Bitumen",rating:4.7,jobs_completed:67,location:"100 Industrial Pkwy, Columbus OH" },
  { id:"4",name:"Crew Delta",lead:"Tony Kim",phone:"(313) 555-7004",size:6,type:"Residential Shingle",status:"available",current_job:"—",rating:4.6,jobs_completed:134,location:"Detroit Yard" },
  { id:"5",name:"Crew Echo",lead:"Luis Morales",phone:"(214) 555-7005",size:4,type:"Repairs & Service",status:"on_job",current_job:"Davis Family — Leak Repair",rating:4.8,jobs_completed:234,location:"2345 Maple Dr, Columbus OH" },
  { id:"6",name:"Crew Foxtrot",lead:"James Wright",phone:"(313) 555-7006",size:7,type:"Tesla Solar Roof",status:"training",current_job:"Tesla Certification Training",rating:4.5,jobs_completed:12,location:"Training Center" },
];

const SCHEDULE = [
  { date:"Mon 4/15",jobs:[{crew:"Crew Alpha",job:"Williams Home — Install Day 1",time:"7:00 AM",color:"bg-amber-100"},{crew:"Crew Commercial",job:"Anderson LLC — Tear-off",time:"6:30 AM",color:"bg-blue-100"},{crew:"Crew Echo",job:"Davis — Leak Repair",time:"8:00 AM",color:"bg-green-100"}]},
  { date:"Tue 4/16",jobs:[{crew:"Crew Alpha",job:"Williams Home — Install Day 2",time:"7:00 AM",color:"bg-amber-100"},{crew:"Crew Commercial",job:"Anderson LLC — Install",time:"6:30 AM",color:"bg-blue-100"},{crew:"Crew Bravo",job:"Smith Residence — Metal Install",time:"7:30 AM",color:"bg-purple-100"}]},
  { date:"Wed 4/17",jobs:[{crew:"Crew Alpha",job:"Johnson Family — Tear-off",time:"7:00 AM",color:"bg-amber-100"},{crew:"Crew Commercial",job:"Anderson LLC — Install Day 2",time:"6:30 AM",color:"bg-blue-100"},{crew:"Crew Delta",job:"Martinez Home — Shingle Install",time:"7:00 AM",color:"bg-orange-100"}]},
  { date:"Thu 4/18",jobs:[{crew:"Crew Alpha",job:"Johnson Family — Install",time:"7:00 AM",color:"bg-amber-100"},{crew:"Crew Bravo",job:"Smith Residence — Finish",time:"7:30 AM",color:"bg-purple-100"}]},
];

export default function CrewsPage() {
  const statusColor: Record<string,string> = { on_job:"bg-blue-100 text-blue-700",available:"bg-green-100 text-green-700",training:"bg-purple-100 text-purple-700",off:"bg-gray-100 text-gray-600" };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-orange-600 to-orange-800 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div><div className="flex items-center gap-3 mb-2"><HardHat className="w-8 h-8"/><h1 className="text-3xl font-bold">Crews & Scheduling</h1></div>
            <p className="text-orange-200">Labor manager, crew scheduling, production calendar, and subcontractor tracking.</p></div>
          <button className="bg-white text-orange-700 px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2"><Plus className="w-5 h-5"/> Add Crew</button>
        </div>
        <div className="grid grid-cols-5 gap-4 mt-6">
          {[{label:"Total Crews",val:CREWS.length},{label:"On Job",val:CREWS.filter(c=>c.status==="on_job").length},{label:"Available",val:CREWS.filter(c=>c.status==="available").length},{label:"Total Workers",val:CREWS.reduce((a,c)=>a+c.size,0)},{label:"Jobs Completed",val:CREWS.reduce((a,c)=>a+c.jobs_completed,0)}].map(s=><div key={s.label} className="bg-white/10 rounded-xl p-4"><div className="text-2xl font-bold">{s.val}</div><div className="text-orange-200 text-sm">{s.label}</div></div>)}
        </div>
      </div>

      <h2 className="text-lg font-bold text-gray-900 mb-4">Crew Roster</h2>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {CREWS.map(c=>(
          <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div><h3 className="font-bold text-gray-900">{c.name}</h3><p className="text-xs text-gray-500">{c.type}</p></div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[c.status]}`}>{c.status.replace("_"," ")}</span>
            </div>
            <div className="text-sm text-gray-600 mb-2"><Users className="w-3 h-3 inline mr-1"/>{c.lead} • {c.size} workers</div>
            <div className="text-xs text-gray-500 mb-2"><MapPin className="w-3 h-3 inline mr-1"/>{c.location}</div>
            {c.current_job!=="—"&&<div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded mb-2">{c.current_job}</div>}
            <div className="flex items-center justify-between text-xs"><span><Star className="w-3 h-3 inline text-yellow-500 fill-yellow-500 mr-1"/>{c.rating}</span><span>{c.jobs_completed} jobs completed</span></div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-bold text-gray-900 mb-4">Production Calendar</h2>
      <div className="grid grid-cols-4 gap-4">
        {SCHEDULE.map(day=>(
          <div key={day.date} className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-bold text-gray-900 mb-3">{day.date}</h3>
            <div className="space-y-2">
              {day.jobs.map((j,i)=>(
                <div key={i} className={`${j.color} rounded-lg p-3`}>
                  <div className="text-xs font-bold text-gray-900">{j.crew}</div>
                  <div className="text-xs text-gray-700">{j.job}</div>
                  <div className="text-xs text-gray-500">{j.time}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
