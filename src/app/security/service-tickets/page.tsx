"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { Headphones, Plus, Search, AlertTriangle, CheckCircle, Clock, User, Phone, Wrench } from "lucide-react";

interface Ticket { id:string; ticket_number:string; customer:string; issue:string; category:string; priority:string; status:string; assigned_to:string; created:string; sla_deadline:string; }

const MOCK: Ticket[] = [
  { id:"1",ticket_number:"SVC-4521",customer:"Johnson Family",issue:"Camera 3 offline — no video feed since yesterday",category:"Equipment",priority:"high",status:"open",assigned_to:"Ryan Park",created:"2 hrs ago",sla_deadline:"4 hrs" },
  { id:"2",ticket_number:"SVC-4520",customer:"Davis Family",issue:"Panel not arming — zone 5 showing tamper",category:"Panel",priority:"critical",status:"in_progress",assigned_to:"David Lee",created:"4 hrs ago",sla_deadline:"2 hrs" },
  { id:"3",ticket_number:"SVC-4519",customer:"Brown Corp",issue:"Access control card reader not responding on Door 4",category:"Access Control",priority:"high",status:"open",assigned_to:"Jake Wilson",created:"6 hrs ago",sla_deadline:"8 hrs" },
  { id:"4",ticket_number:"SVC-4518",customer:"Smith Residence",issue:"Low battery on sensor zone 8 — front window",category:"Sensor",priority:"low",status:"scheduled",assigned_to:"David Lee",created:"1 day ago",sla_deadline:"3 days" },
  { id:"5",ticket_number:"SVC-4517",customer:"Garcia Residence",issue:"Doorbell camera motion detection too sensitive",category:"Camera",priority:"low",status:"scheduled",assigned_to:"Ana Torres",created:"1 day ago",sla_deadline:"3 days" },
  { id:"6",ticket_number:"SVC-4516",customer:"Williams Home",issue:"Smoke detector false alarms in kitchen",category:"Fire",priority:"medium",status:"in_progress",assigned_to:"Carlos Mendez",created:"2 days ago",sla_deadline:"1 day" },
  { id:"7",ticket_number:"SVC-4515",customer:"Taylor Home",issue:"Z-Wave thermostat not connecting to panel",category:"Smart Home",priority:"medium",status:"open",assigned_to:"Ana Torres",created:"2 days ago",sla_deadline:"2 days" },
  { id:"8",ticket_number:"SVC-4514",customer:"Anderson LLC",issue:"Warranty claim — 4 motion sensors defective",category:"Warranty",priority:"medium",status:"parts_ordered",assigned_to:"Jake Wilson",created:"3 days ago",sla_deadline:"5 days" },
  { id:"9",ticket_number:"SVC-4513",customer:"Martinez Home",issue:"Customer wants system upgrade from basic to smart home",category:"Upgrade",priority:"low",status:"quoted",assigned_to:"Mike Rodriguez",created:"4 days ago",sla_deadline:"7 days" },
  { id:"10",ticket_number:"SVC-4512",customer:"Kim Home",issue:"Panel firmware update needed — v4.2 to v5.0",category:"Maintenance",priority:"low",status:"resolved",assigned_to:"David Lee",created:"5 days ago",sla_deadline:"Completed" },
];

export default function ServiceTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>(MOCK);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = tickets.filter(t => {
    const ms = t.customer.toLowerCase().includes(search.toLowerCase()) || t.issue.toLowerCase().includes(search.toLowerCase()) || t.ticket_number.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter === "all" || t.status === statusFilter;
    return ms && mf;
  });

  const priorityColor: Record<string,string> = { critical:"bg-red-600 text-white",high:"bg-red-100 text-red-700",medium:"bg-yellow-100 text-yellow-700",low:"bg-blue-100 text-blue-700" };
  const statusColor: Record<string,string> = { open:"bg-red-100 text-red-700",in_progress:"bg-blue-100 text-blue-700",scheduled:"bg-purple-100 text-purple-700",parts_ordered:"bg-orange-100 text-orange-700",quoted:"bg-teal-100 text-teal-700",resolved:"bg-green-100 text-green-700" };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-orange-600 to-orange-800 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div><div className="flex items-center gap-3 mb-2"><Headphones className="w-8 h-8" /><h1 className="text-3xl font-bold">Service Tickets</h1></div>
            <p className="text-orange-200">Track issues, warranty claims, and service scheduling.</p></div>
          <button className="bg-white text-orange-700 px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2"><Plus className="w-5 h-5" /> New Ticket</button>
        </div>
        <div className="grid grid-cols-5 gap-4 mt-6">
          {[
            { label:"Open",val:tickets.filter(t=>t.status==="open").length },
            { label:"In Progress",val:tickets.filter(t=>t.status==="in_progress").length },
            { label:"Critical",val:tickets.filter(t=>t.priority==="critical").length },
            { label:"Avg Resolution",val:"1.8 days" },
            { label:"SLA Compliance",val:"94%" },
          ].map(s=><div key={s.label} className="bg-white/10 rounded-xl p-4"><div className="text-2xl font-bold">{s.val}</div><div className="text-orange-200 text-sm">{s.label}</div></div>)}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1"><Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tickets..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"/></div>
        <div className="flex gap-2 flex-wrap">{["all","open","in_progress","scheduled","parts_ordered","resolved"].map(s=><button key={s} onClick={()=>setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${statusFilter===s?"bg-orange-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s.replace("_"," ")}</button>)}</div>
      </div>

      <div className="space-y-3">
        {filtered.map(t=>(
          <div key={t.id} className={`bg-white rounded-xl border ${t.priority==="critical"?"border-red-300":"border-gray-200"} p-5 hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="text-center"><div className="text-xs font-mono text-gray-500">{t.ticket_number}</div></div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t.customer}</h3>
                  <p className="text-sm text-gray-600">{t.issue}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="px-2 py-0.5 bg-gray-100 rounded">{t.category}</span>
                    <span><User className="w-3 h-3 inline mr-1"/>{t.assigned_to}</span>
                    <span><Clock className="w-3 h-3 inline mr-1"/>{t.created}</span>
                    <span>SLA: {t.sla_deadline}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColor[t.priority]}`}>{t.priority}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[t.status]}`}>{t.status.replace("_"," ")}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
