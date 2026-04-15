"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { Calendar, Plus, Search, Clock, Users, Truck, ClipboardCheck, ChevronLeft, ChevronRight, MapPin, Phone, AlertTriangle } from "lucide-react";

interface ScheduleEvent {
  id: string; title: string; type: string; date: string; time: string; duration: string;
  crew: string; address: string; customer: string; phone: string; status: string; notes: string; color: string;
}

const TYPES = ["All", "Install", "Inspection", "Delivery", "Repair", "Supplement Meeting", "Sales Appointment"];
const COLORS: Record<string, string> = { Install: "#16a34a", Inspection: "#2563eb", Delivery: "#f59e0b", Repair: "#dc2626", "Supplement Meeting": "#7c3aed", "Sales Appointment": "#0891b2" };

const MOCK: ScheduleEvent[] = [
  { id:"1",title:"Full Tear-off & Reroof",type:"Install",date:"2024-04-15",time:"7:00 AM",duration:"2 days",crew:"Alpha Crew",address:"789 Pine St, Detroit MI",customer:"Williams Home",phone:"(313) 555-0147",status:"confirmed",notes:"28 sq GAF Timberline HDZ. Materials delivered 4/13.",color:"#16a34a" },
  { id:"2",title:"Final Inspection",type:"Inspection",date:"2024-04-15",time:"10:00 AM",duration:"1 hour",crew:"QA Team",address:"4521 Oak Ave, Dallas TX",customer:"Johnson Family",phone:"(214) 555-0293",status:"confirmed",notes:"City inspector confirmed. Need ladder access.",color:"#2563eb" },
  { id:"3",title:"Material Drop — ABC Supply",type:"Delivery",date:"2024-04-15",time:"6:30 AM",duration:"30 min",crew:"ABC Supply Driver",address:"6789 Cedar Ln, Dallas TX",customer:"Garcia Residence",phone:"(214) 555-0381",status:"en_route",notes:"22 sq GAF UHDZ + underlayment. Boom truck requested.",color:"#f59e0b" },
  { id:"4",title:"Storm Damage Repair",type:"Repair",date:"2024-04-15",time:"1:00 PM",duration:"4 hours",crew:"Bravo Crew",address:"123 Elm St, Columbus OH",customer:"Davis Home",phone:"(614) 555-0442",status:"confirmed",notes:"Emergency tarp + partial reroof. Insurance approved.",color:"#dc2626" },
  { id:"5",title:"Adjuster Meeting — Supplement",type:"Supplement Meeting",date:"2024-04-16",time:"9:00 AM",duration:"1.5 hours",crew:"Sales Team",address:"500 Commerce Blvd, Dallas TX",customer:"Brown Corp",phone:"(214) 555-0518",status:"pending",notes:"$12,400 supplement for decking replacement. Bring Xactimate report.",color:"#7c3aed" },
  { id:"6",title:"Roof Replacement",type:"Install",date:"2024-04-16",time:"7:00 AM",duration:"1 day",crew:"Charlie Crew",address:"9012 Birch Rd, Houston TX",customer:"Martinez Family",phone:"(713) 555-0624",status:"confirmed",notes:"35 sq Owens Corning Duration. Satellite dish relocate needed.",color:"#16a34a" },
  { id:"7",title:"New Lead Walk-through",type:"Sales Appointment",date:"2024-04-16",time:"2:00 PM",duration:"1 hour",crew:"James Bond",address:"1500 Maple Dr, Dallas TX",customer:"Thompson Residence",phone:"(214) 555-0735",status:"confirmed",notes:"Hail damage reported. Bring drone + EagleView tablet.",color:"#0891b2" },
  { id:"8",title:"Material Drop — SRS Distribution",type:"Delivery",date:"2024-04-17",time:"7:00 AM",duration:"30 min",crew:"SRS Driver",address:"321 Spruce St, Detroit MI",customer:"Anderson Property",phone:"(313) 555-0846",status:"scheduled",notes:"Commercial TPO + ISO board. Crane required on site.",color:"#f59e0b" },
  { id:"9",title:"Warranty Repair",type:"Repair",date:"2024-04-17",time:"10:00 AM",duration:"3 hours",crew:"Alpha Crew",address:"777 Sunset Blvd, Columbus OH",customer:"Lee Residence",phone:"(614) 555-0957",status:"confirmed",notes:"Flashing leak at chimney. Under 10-year workmanship warranty.",color:"#dc2626" },
  { id:"10",title:"Progress Inspection",type:"Inspection",date:"2024-04-17",time:"3:00 PM",duration:"45 min",crew:"QA Team",address:"9012 Birch Rd, Houston TX",customer:"Martinez Family",phone:"(713) 555-0624",status:"scheduled",notes:"Mid-install check. Verify underlayment and flashing before shingle.",color:"#2563eb" }
];

const WEEK_DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function RoofingSchedulingPage() {
  const [events, setEvents] = useState<ScheduleEvent[]>(MOCK);
  const [view, setView] = useState<"week"|"list">("week");
  const [typeFilter, setTypeFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [weekStart, setWeekStart] = useState("2024-04-14");

  useEffect(() => {
    supabase.from("roofing_schedule").select("*").eq("org_id", ORG_ID).then(({ data }) => { if (data?.length) setEvents(data as any); });
  }, []);

  const filtered = events.filter(e => (typeFilter === "All" || e.type === typeFilter) && (e.customer.toLowerCase().includes(search.toLowerCase()) || e.address.toLowerCase().includes(search.toLowerCase())));
  const weekDates = Array.from({ length: 7 }, (_, i) => { const d = new Date(weekStart); d.setDate(d.getDate() + i); return d.toISOString().split("T")[0]; });
  const hours = Array.from({ length: 13 }, (_, i) => `${i + 6}:00`);

  const statusColor = (s: string) => s === "confirmed" ? "bg-green-100 text-green-700" : s === "en_route" ? "bg-blue-100 text-blue-700" : s === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600";

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F3A] flex items-center gap-2"><Calendar className="text-[#F0A500]" size={28}/>Scheduling & Calendar</h1>
          <p className="text-gray-500 mt-1">Drag-and-drop crew scheduling, deliveries, inspections & appointments</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-[#F0A500] text-[#0B1F3A] px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-yellow-500"><Plus size={18}/>New Event</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[{l:"Today's Jobs",v:filtered.filter(e=>e.date==="2024-04-15").length,c:"text-green-600"},{l:"This Week",v:filtered.length,c:"text-blue-600"},{l:"Installs Scheduled",v:filtered.filter(e=>e.type==="Install").length,c:"text-purple-600"},{l:"Deliveries",v:filtered.filter(e=>e.type==="Delivery").length,c:"text-yellow-600"},{l:"Inspections",v:filtered.filter(e=>e.type==="Inspection").length,c:"text-cyan-600"}].map((s,i)=>(
          <div key={i} className="bg-white rounded-xl border p-4 text-center"><p className={`text-2xl font-bold ${s.c}`}>{s.v}</p><p className="text-xs text-gray-500 mt-1">{s.l}</p></div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-xs"><Search className="absolute left-3 top-2.5 text-gray-400" size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search customer or address..." className="pl-9 pr-3 py-2 border rounded-lg w-full text-sm"/></div>
        <div className="flex gap-1">{TYPES.map(t=><button key={t} onClick={()=>setTypeFilter(t)} className={`px-3 py-1.5 rounded-full text-xs font-medium ${typeFilter===t?"bg-[#0B1F3A] text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{t}</button>)}</div>
        <div className="flex gap-1 ml-auto">
          <button onClick={()=>setView("week")} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${view==="week"?"bg-[#0B1F3A] text-white":"bg-gray-100"}`}>Week</button>
          <button onClick={()=>setView("list")} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${view==="list"?"bg-[#0B1F3A] text-white":"bg-gray-100"}`}>List</button>
        </div>
      </div>

      {view === "week" ? (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <button onClick={()=>{ const d=new Date(weekStart); d.setDate(d.getDate()-7); setWeekStart(d.toISOString().split("T")[0]); }} className="p-1 rounded hover:bg-gray-100"><ChevronLeft size={20}/></button>
            <span className="font-semibold text-[#0B1F3A]">Week of April 14 – 20, 2024</span>
            <button onClick={()=>{ const d=new Date(weekStart); d.setDate(d.getDate()+7); setWeekStart(d.toISOString().split("T")[0]); }} className="p-1 rounded hover:bg-gray-100"><ChevronRight size={20}/></button>
          </div>
          <div className="grid grid-cols-8 text-xs">
            <div className="p-2 border-r bg-gray-50 font-medium text-gray-500">Time</div>
            {weekDates.map((d,i)=><div key={i} className="p-2 border-r bg-gray-50 font-medium text-center text-gray-600">{WEEK_DAYS[new Date(d+"T12:00:00").getDay()]}<br/><span className="text-[#0B1F3A] font-bold">{new Date(d+"T12:00:00").getDate()}</span></div>)}
          </div>
          {hours.map(h=>(
            <div key={h} className="grid grid-cols-8 text-xs min-h-[48px] border-t">
              <div className="p-1 border-r text-gray-400 text-[10px]">{h}</div>
              {weekDates.map((d,i)=>{
                const dayEvents = filtered.filter(e=>e.date===d && e.time.includes(h.split(":")[0]));
                return <div key={i} className="p-0.5 border-r relative">{dayEvents.map(ev=><div key={ev.id} className="rounded p-1 mb-0.5 text-white text-[10px] leading-tight cursor-pointer" style={{backgroundColor:ev.color}}><strong>{ev.title.slice(0,20)}</strong><br/>{ev.crew}</div>)}</div>;
              })}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(ev=>(
            <div key={ev.id} className="bg-white rounded-xl border p-4 flex gap-4 items-start hover:shadow-md transition-shadow">
              <div className="w-1 h-16 rounded-full" style={{backgroundColor:ev.color}}/>
              <div className="flex-1">
                <div className="flex items-center gap-2"><h3 className="font-semibold text-[#0B1F3A]">{ev.title}</h3><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColor(ev.status)}`}>{ev.status}</span></div>
                <div className="flex flex-wrap gap-4 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Clock size={12}/>{ev.date} · {ev.time} · {ev.duration}</span>
                  <span className="flex items-center gap-1"><Users size={12}/>{ev.crew}</span>
                  <span className="flex items-center gap-1"><MapPin size={12}/>{ev.address}</span>
                  <span className="flex items-center gap-1"><Phone size={12}/>{ev.customer} — {ev.phone}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{ev.notes}</p>
              </div>
              <span className="px-2 py-1 rounded text-[10px] font-medium text-white" style={{backgroundColor:ev.color}}>{ev.type}</span>
            </div>
          ))}
        </div>
      )}

      {/* Add Event Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={()=>setShowAdd(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg" onClick={e=>e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">Schedule New Event</h2>
            <div className="space-y-3">
              <input placeholder="Event Title" className="w-full border rounded-lg p-2 text-sm"/>
              <select className="w-full border rounded-lg p-2 text-sm"><option value="">Select Type</option>{TYPES.filter(t=>t!=="All").map(t=><option key={t}>{t}</option>)}</select>
              <div className="grid grid-cols-2 gap-3"><input type="date" className="border rounded-lg p-2 text-sm"/><input type="time" className="border rounded-lg p-2 text-sm"/></div>
              <select className="w-full border rounded-lg p-2 text-sm"><option>Alpha Crew (4 members)</option><option>Bravo Crew (3 members)</option><option>Charlie Crew (5 members)</option><option>QA Team</option><option>Sales Team</option></select>
              <input placeholder="Customer Name" className="w-full border rounded-lg p-2 text-sm"/>
              <input placeholder="Address" className="w-full border rounded-lg p-2 text-sm"/>
              <textarea placeholder="Notes" className="w-full border rounded-lg p-2 text-sm" rows={2}/>
            </div>
            <div className="flex gap-3 mt-4"><button onClick={()=>setShowAdd(false)} className="flex-1 border rounded-lg py-2 text-sm">Cancel</button><button onClick={()=>setShowAdd(false)} className="flex-1 bg-[#F0A500] text-[#0B1F3A] rounded-lg py-2 text-sm font-semibold">Schedule Event</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
