"use client";
import { useState } from "react";
import { UserCheck, Search, Star, Award, MapPin, Phone, Clock, Shield, Wrench, CheckCircle } from "lucide-react";

const TECHS = [
  { id:"1",name:"Mike Rodriguez",title:"Senior Installer",phone:"(214) 555-8001",location:"Dallas, TX",status:"active",hire_date:"2021-03-15",installs_completed:342,avg_rating:4.9,certifications:["Qolsys Certified","Alarm.com Pro","DSC Master","Fire Alarm NICET II","Smart Home Pro"],specialties:["Residential","Smart Home","Video"],current_month_installs:12,revenue_generated:156000 },
  { id:"2",name:"Carlos Mendez",title:"Lead Technician",phone:"(313) 555-8002",location:"Detroit, MI",status:"active",hire_date:"2020-08-01",installs_completed:456,avg_rating:4.8,certifications:["Qolsys Certified","Alarm.com Pro","DMP Certified","Access Control","CCTV Expert"],specialties:["Commercial","Access Control","CCTV"],current_month_installs:10,revenue_generated:198000 },
  { id:"3",name:"David Lee",title:"Installation Tech",phone:"(614) 555-8003",location:"Columbus, OH",status:"active",hire_date:"2022-01-10",installs_completed:189,avg_rating:4.7,certifications:["DSC Certified","2GIG Pro","Fire Alarm","Network+"],specialties:["Residential","Fire","Network"],current_month_installs:14,revenue_generated:112000 },
  { id:"4",name:"Jake Wilson",title:"Commercial Specialist",phone:"(214) 555-8004",location:"Dallas, TX",status:"active",hire_date:"2021-06-20",installs_completed:267,avg_rating:4.6,certifications:["DMP Master","Access Control Pro","CCTV Expert","Fire NICET III","Network+"],specialties:["Commercial","Multi-site","Enterprise"],current_month_installs:6,revenue_generated:234000 },
  { id:"5",name:"Ana Torres",title:"Smart Home Specialist",phone:"(214) 555-8005",location:"Dallas, TX",status:"active",hire_date:"2022-04-01",installs_completed:178,avg_rating:4.9,certifications:["Qolsys Certified","Alarm.com Pro","Z-Wave Expert","Lutron","Sonos"],specialties:["Smart Home","Automation","Voice Control"],current_month_installs:15,revenue_generated:145000 },
  { id:"6",name:"Ryan Park",title:"Service Tech",phone:"(614) 555-8006",location:"Columbus, OH",status:"active",hire_date:"2023-02-15",installs_completed:98,avg_rating:4.5,certifications:["DSC Certified","2GIG Pro","Troubleshooting"],specialties:["Service","Troubleshoot","Upgrades"],current_month_installs:8,revenue_generated:67000 },
];

export default function TechniciansPage() {
  const [search, setSearch] = useState("");
  const filtered = TECHS.filter(t=>t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-cyan-600 to-cyan-800 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center gap-3 mb-2"><UserCheck className="w-8 h-8" /><h1 className="text-3xl font-bold">Technicians</h1></div>
        <p className="text-cyan-200">Profiles, certifications, performance scorecards, and real-time status.</p>
        <div className="grid grid-cols-5 gap-4 mt-6">
          {[
            { label:"Total Techs",val:TECHS.length },
            { label:"Active Today",val:TECHS.filter(t=>t.status==="active").length },
            { label:"Avg Rating",val:"4.7" },
            { label:"Month Installs",val:TECHS.reduce((a,t)=>a+t.current_month_installs,0) },
            { label:"Month Revenue",val:`$${(TECHS.reduce((a,t)=>a+t.revenue_generated,0)/1000).toFixed(0)}K` },
          ].map(s=><div key={s.label} className="bg-white/10 rounded-xl p-4"><div className="text-2xl font-bold">{s.val}</div><div className="text-cyan-200 text-sm">{s.label}</div></div>)}
        </div>
      </div>

      <div className="relative mb-6"><Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search technicians..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"/></div>

      <div className="grid grid-cols-2 gap-6">
        {filtered.map(t=>(
          <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-700 font-bold text-xl">{t.name.split(" ").map(n=>n[0]).join("")}</div>
                <div><h3 className="text-lg font-bold text-gray-900">{t.name}</h3><p className="text-sm text-gray-500">{t.title}</p><p className="text-xs text-gray-400"><MapPin className="w-3 h-3 inline mr-1"/>{t.location} • <Phone className="w-3 h-3 inline mr-1"/>{t.phone}</p></div>
              </div>
              <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500"/><span className="text-sm font-bold text-yellow-700">{t.avg_rating}</span></div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4 text-center">
              <div className="bg-gray-50 rounded-lg p-3"><div className="text-xl font-bold text-gray-900">{t.installs_completed}</div><div className="text-xs text-gray-500">Total Installs</div></div>
              <div className="bg-gray-50 rounded-lg p-3"><div className="text-xl font-bold text-gray-900">{t.current_month_installs}</div><div className="text-xs text-gray-500">This Month</div></div>
              <div className="bg-gray-50 rounded-lg p-3"><div className="text-xl font-bold text-green-700">${(t.revenue_generated/1000).toFixed(0)}K</div><div className="text-xs text-gray-500">Revenue</div></div>
            </div>
            <div className="mb-3"><div className="text-xs font-medium text-gray-500 mb-2">Certifications</div><div className="flex flex-wrap gap-1">{t.certifications.map(c=><span key={c} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">{c}</span>)}</div></div>
            <div><div className="text-xs font-medium text-gray-500 mb-2">Specialties</div><div className="flex gap-1">{t.specialties.map(s=><span key={s} className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs">{s}</span>)}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}
