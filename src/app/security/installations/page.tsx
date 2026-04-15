"use client";
import { useState } from "react";
import { Wrench, Plus, Search, Calendar, Clock, CheckCircle, AlertTriangle, MapPin, User, ChevronDown, ChevronRight } from "lucide-react";

interface Install {
  id: string; customer: string; address: string; city: string; state: string; system_type: string;
  panel: string; sensors: number; cameras: number; status: string; scheduled_date: string;
  technician: string; duration_hrs: number; sale_rep: string; notes: string;
}

const MOCK: Install[] = [
  { id:"1",customer:"Taylor Home",address:"8901 Walnut Ct",city:"Dallas",state:"TX",system_type:"Full Smart Home",panel:"Qolsys IQ4",sensors:22,cameras:10,status:"scheduled",scheduled_date:"2024-04-16",technician:"Mike Rodriguez",duration_hrs:4,sale_rep:"James Bond",notes:"Customer wants doorbell cam on left side" },
  { id:"2",customer:"Chen Residence",address:"345 Lotus Ln",city:"Columbus",state:"OH",system_type:"Security + Fire",panel:"DSC Neo",sensors:16,cameras:4,status:"scheduled",scheduled_date:"2024-04-16",technician:"David Lee",duration_hrs:3,sale_rep:"Sarah Thompson",notes:"Two-story home, ladder needed" },
  { id:"3",customer:"Patel Family",address:"678 Summit Dr",city:"Detroit",state:"MI",system_type:"Smart Home + Video",panel:"Alarm.com Smart Hub",sensors:20,cameras:8,status:"in_progress",scheduled_date:"2024-04-15",technician:"Carlos Mendez",duration_hrs:5,sale_rep:"James Bond",notes:"Running wires through attic" },
  { id:"4",customer:"Wilson Corp",address:"200 Tech Park",city:"Dallas",state:"TX",system_type:"Commercial",panel:"DMP XR550",sensors:48,cameras:16,status:"in_progress",scheduled_date:"2024-04-15",technician:"Jake Wilson",duration_hrs:8,sale_rep:"Mike Chen",notes:"Multi-floor commercial. Need access control on 6 doors" },
  { id:"5",customer:"Kim Home",address:"1122 Bamboo Way",city:"Columbus",state:"OH",system_type:"Security Only",panel:"2GIG Edge",sensors:10,cameras:2,status:"completed",scheduled_date:"2024-04-14",technician:"David Lee",duration_hrs:2.5,sale_rep:"Sarah Thompson",notes:"Quick install, no issues" },
  { id:"6",customer:"Foster Residence",address:"4455 River Rd",city:"Dallas",state:"TX",system_type:"Full Smart Home",panel:"Qolsys IQ4",sensors:18,cameras:6,status:"completed",scheduled_date:"2024-04-13",technician:"Mike Rodriguez",duration_hrs:4,sale_rep:"James Bond",notes:"Customer extremely happy" },
  { id:"7",customer:"Robinson Home",address:"7788 Hill St",city:"Detroit",state:"MI",system_type:"Security + Automation",panel:"Qolsys IQ4",sensors:14,cameras:4,status:"rescheduled",scheduled_date:"2024-04-18",technician:"Carlos Mendez",duration_hrs:3.5,sale_rep:"Mike Chen",notes:"Customer rescheduled from 4/12" },
  { id:"8",customer:"Clark Family",address:"9900 Valley View",city:"Columbus",state:"OH",system_type:"Smart Home + Fire",panel:"DSC Neo",sensors:20,cameras:6,status:"pending_parts",scheduled_date:"2024-04-17",technician:"David Lee",duration_hrs:4,sale_rep:"Sarah Thompson",notes:"Waiting for smoke detectors from ADI" },
];

export default function InstallationsPage() {
  const [installs, setInstalls] = useState<Install[]>(MOCK);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = installs.filter(i => {
    const ms = i.customer.toLowerCase().includes(search.toLowerCase()) || i.technician.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter === "all" || i.status === statusFilter;
    return ms && mf;
  });

  const statusColor: Record<string,string> = { scheduled:"bg-blue-100 text-blue-700", in_progress:"bg-yellow-100 text-yellow-700", completed:"bg-green-100 text-green-700", rescheduled:"bg-purple-100 text-purple-700", pending_parts:"bg-orange-100 text-orange-700" };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div><div className="flex items-center gap-3 mb-2"><Wrench className="w-8 h-8" /><h1 className="text-3xl font-bold">Installations</h1></div>
            <p className="text-blue-200">Schedule, assign, and track every installation from sale to completion.</p></div>
          <button className="bg-white text-blue-700 px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2"><Plus className="w-5 h-5" /> Schedule Install</button>
        </div>
        <div className="grid grid-cols-5 gap-4 mt-6">
          {[
            { label:"Today",val:installs.filter(i=>i.scheduled_date==="2024-04-15").length },
            { label:"This Week",val:installs.filter(i=>i.status!=="completed").length },
            { label:"In Progress",val:installs.filter(i=>i.status==="in_progress").length },
            { label:"Completed",val:installs.filter(i=>i.status==="completed").length },
            { label:"Avg Duration",val:`${(installs.reduce((a,i)=>a+i.duration_hrs,0)/installs.length).toFixed(1)}h` },
          ].map(s=><div key={s.label} className="bg-white/10 rounded-xl p-4"><div className="text-2xl font-bold">{s.val}</div><div className="text-blue-200 text-sm">{s.label}</div></div>)}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1"><Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search installations..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" /></div>
        <div className="flex gap-2">{["all","scheduled","in_progress","completed","rescheduled","pending_parts"].map(s=><button key={s} onClick={()=>setStatusFilter(s)} className={`px-3 py-2 rounded-lg text-xs font-medium capitalize ${statusFilter===s?"bg-blue-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s.replace("_"," ")}</button>)}</div>
      </div>

      <div className="space-y-3">
        {filtered.map(inst=>(
          <div key={inst.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-5 cursor-pointer hover:bg-gray-50" onClick={()=>setExpanded(expanded===inst.id?null:inst.id)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {expanded===inst.id?<ChevronDown className="w-5 h-5 text-gray-400"/>:<ChevronRight className="w-5 h-5 text-gray-400"/>}
                  <div>
                    <h3 className="font-semibold text-gray-900">{inst.customer}</h3>
                    <p className="text-sm text-gray-500"><MapPin className="w-3 h-3 inline mr-1"/>{inst.address}, {inst.city}, {inst.state}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm"><div className="text-gray-900"><Calendar className="w-3 h-3 inline mr-1"/>{inst.scheduled_date}</div><div className="text-gray-500"><User className="w-3 h-3 inline mr-1"/>{inst.technician}</div></div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[inst.status]}`}>{inst.status.replace("_"," ")}</span>
                </div>
              </div>
            </div>
            {expanded===inst.id&&(
              <div className="border-t border-gray-200 p-5 bg-gray-50 grid grid-cols-3 gap-4">
                <div><div className="text-xs text-gray-500 mb-1">System</div><div className="text-sm font-medium">{inst.system_type}</div></div>
                <div><div className="text-xs text-gray-500 mb-1">Panel</div><div className="text-sm font-medium">{inst.panel}</div></div>
                <div><div className="text-xs text-gray-500 mb-1">Equipment</div><div className="text-sm font-medium">{inst.sensors} sensors, {inst.cameras} cameras</div></div>
                <div><div className="text-xs text-gray-500 mb-1">Duration</div><div className="text-sm font-medium">{inst.duration_hrs} hours</div></div>
                <div><div className="text-xs text-gray-500 mb-1">Sales Rep</div><div className="text-sm font-medium">{inst.sale_rep}</div></div>
                <div><div className="text-xs text-gray-500 mb-1">Notes</div><div className="text-sm font-medium">{inst.notes}</div></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
