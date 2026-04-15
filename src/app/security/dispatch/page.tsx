"use client";
import { useState } from "react";
import { MapPin, Users, Clock, CheckCircle, Phone, Navigation, Wrench, AlertTriangle, Calendar } from "lucide-react";

interface Technician {
  id: string; name: string; status: string; current_job: string; location: string;
  jobs_today: number; avg_rating: number; certifications: string[];
}

interface Job {
  id: string; type: string; customer: string; address: string; technician: string;
  scheduled_time: string; status: string; priority: string; estimated_duration: string;
}

const TECHS: Technician[] = [
  { id:"1",name:"Mike Rodriguez",status:"on_job",current_job:"Taylor Home - Install",location:"8901 Walnut Ct, Dallas",jobs_today:2,avg_rating:4.9,certifications:["Qolsys","Alarm.com","DSC","Fire"] },
  { id:"2",name:"Carlos Mendez",status:"on_job",current_job:"Patel Family - Install",location:"678 Summit Dr, Detroit",jobs_today:1,avg_rating:4.8,certifications:["Qolsys","Alarm.com","DMP","Access Control"] },
  { id:"3",name:"David Lee",status:"available",current_job:"—",location:"Columbus Warehouse",jobs_today:3,avg_rating:4.7,certifications:["DSC","2GIG","Fire","Network"] },
  { id:"4",name:"Jake Wilson",status:"on_job",current_job:"Wilson Corp - Commercial",location:"200 Tech Park, Dallas",jobs_today:1,avg_rating:4.6,certifications:["DMP","Access Control","CCTV","Fire"] },
  { id:"5",name:"Ana Torres",status:"available",current_job:"—",location:"Dallas Office",jobs_today:2,avg_rating:4.9,certifications:["Qolsys","Alarm.com","Smart Home","Z-Wave"] },
  { id:"6",name:"Ryan Park",status:"en_route",current_job:"Davis Family - Service",location:"En route to 2345 Maple Dr",jobs_today:2,avg_rating:4.5,certifications:["DSC","2GIG","Troubleshoot"] },
];

const JOBS: Job[] = [
  { id:"1",type:"Install",customer:"Taylor Home",address:"8901 Walnut Ct, Dallas TX",technician:"Mike Rodriguez",scheduled_time:"9:00 AM",status:"in_progress",priority:"normal",estimated_duration:"4 hrs" },
  { id:"2",type:"Install",customer:"Patel Family",address:"678 Summit Dr, Detroit MI",technician:"Carlos Mendez",scheduled_time:"8:30 AM",status:"in_progress",priority:"normal",estimated_duration:"5 hrs" },
  { id:"3",type:"Service",customer:"Davis Family",address:"2345 Maple Dr, Columbus OH",technician:"Ryan Park",scheduled_time:"11:00 AM",status:"en_route",priority:"high",estimated_duration:"1.5 hrs" },
  { id:"4",type:"Install",customer:"Wilson Corp",address:"200 Tech Park, Dallas TX",technician:"Jake Wilson",scheduled_time:"7:00 AM",status:"in_progress",priority:"normal",estimated_duration:"8 hrs" },
  { id:"5",type:"Inspection",customer:"Foster Residence",address:"4455 River Rd, Dallas TX",technician:"Ana Torres",scheduled_time:"2:00 PM",status:"scheduled",priority:"normal",estimated_duration:"1 hr" },
  { id:"6",type:"Service",customer:"Smith Residence",address:"1234 Elm St, Columbus OH",technician:"David Lee",scheduled_time:"1:30 PM",status:"scheduled",priority:"medium",estimated_duration:"2 hrs" },
  { id:"7",type:"Takeover",customer:"Robinson Home",address:"7788 Hill St, Detroit MI",technician:"Carlos Mendez",scheduled_time:"3:00 PM",status:"scheduled",priority:"normal",estimated_duration:"2.5 hrs" },
];

export default function DispatchPage() {
  const [view, setView] = useState<"board"|"list">("board");

  const techStatusColor: Record<string,string> = { available:"bg-green-100 text-green-700",on_job:"bg-blue-100 text-blue-700",en_route:"bg-yellow-100 text-yellow-700",off_duty:"bg-gray-100 text-gray-600" };
  const jobStatusColor: Record<string,string> = { scheduled:"bg-gray-100 text-gray-700",en_route:"bg-yellow-100 text-yellow-700",in_progress:"bg-blue-100 text-blue-700",completed:"bg-green-100 text-green-700" };
  const priorityColor: Record<string,string> = { high:"border-l-red-500",medium:"border-l-yellow-500",normal:"border-l-blue-500" };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-green-700 to-green-900 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div><div className="flex items-center gap-3 mb-2"><MapPin className="w-8 h-8" /><h1 className="text-3xl font-bold">Dispatch Center</h1></div>
            <p className="text-green-200">Route technicians, manage schedules, and track field operations in real-time.</p></div>
        </div>
        <div className="grid grid-cols-5 gap-4 mt-6">
          {[
            { label:"Techs Available",val:TECHS.filter(t=>t.status==="available").length },
            { label:"On Job",val:TECHS.filter(t=>t.status==="on_job").length },
            { label:"En Route",val:TECHS.filter(t=>t.status==="en_route").length },
            { label:"Jobs Today",val:JOBS.length },
            { label:"Completed",val:JOBS.filter(j=>j.status==="completed").length },
          ].map(s=><div key={s.label} className="bg-white/10 rounded-xl p-4"><div className="text-2xl font-bold">{s.val}</div><div className="text-green-200 text-sm">{s.label}</div></div>)}
        </div>
      </div>

      <h2 className="text-lg font-bold text-gray-900 mb-4">Technician Status</h2>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {TECHS.map(t=>(
          <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">{t.name.split(" ").map(n=>n[0]).join("")}</div>
                <div><h3 className="font-semibold text-gray-900">{t.name}</h3><p className="text-xs text-gray-500">{t.current_job}</p></div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${techStatusColor[t.status]}`}>{t.status.replace("_"," ")}</span>
            </div>
            <div className="text-xs text-gray-500 mb-2"><MapPin className="w-3 h-3 inline mr-1"/>{t.location}</div>
            <div className="flex items-center justify-between text-xs">
              <span>{t.jobs_today} jobs today</span><span>⭐ {t.avg_rating}</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">{t.certifications.map(c=><span key={c} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">{c}</span>)}</div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-bold text-gray-900 mb-4">Today&apos;s Schedule</h2>
      <div className="space-y-3">
        {JOBS.map(j=>(
          <div key={j.id} className={`bg-white rounded-xl border border-gray-200 border-l-4 ${priorityColor[j.priority]} p-5`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center"><div className="text-lg font-bold text-gray-900">{j.scheduled_time}</div><div className="text-xs text-gray-500">{j.estimated_duration}</div></div>
                <div className="border-l border-gray-200 pl-4">
                  <div className="flex items-center gap-2"><span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">{j.type}</span><h3 className="font-semibold text-gray-900">{j.customer}</h3></div>
                  <p className="text-sm text-gray-500"><MapPin className="w-3 h-3 inline mr-1"/>{j.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right text-sm"><div className="text-gray-900">{j.technician}</div></div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${jobStatusColor[j.status]}`}>{j.status.replace("_"," ")}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
