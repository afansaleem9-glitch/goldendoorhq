"use client";
import { useState } from "react";
import { CloudLightning, AlertTriangle, MapPin, Calendar, Search, Bell, Eye, TrendingUp, Users, Filter, RefreshCw, Shield } from "lucide-react";

interface WeatherAlert {
  id: string; event_type: string; severity: string; date: string; location: string; radius: string;
  hail_size: string | null; wind_speed: string | null; affected_properties: number; leads_generated: number;
  status: string; description: string;
}

const SOURCES = [
  { name: "HailWatch", logo: "🌨️", desc: "Real-time hail tracking & damage probability", features: ["Live Radar","Property Overlay","Auto-Alert","Historical Data"] },
  { name: "CoreLogic", logo: "🌪️", desc: "Comprehensive weather & property risk intelligence", features: ["Storm Paths","Damage Estimates","Claim Probability","Demographic Data"] },
  { name: "NWS Alerts", logo: "⚡", desc: "National Weather Service official warnings", features: ["Severe Warnings","Tornado Watch","Flash Flood","Winter Storm"] },
  { name: "StormBot AI", logo: "🤖", desc: "AI-powered storm damage prediction engine", features: ["ML Prediction","Auto-Canvass","Lead Scoring","Route Optimization"] }
];

const ALERTS: WeatherAlert[] = [
  { id:"1",event_type:"Hailstorm",severity:"severe",date:"2024-04-12",location:"Dallas-Fort Worth Metro",radius:"15 mile radius",hail_size:'2.5"',wind_speed:"65 mph",affected_properties:2400,leads_generated:185,status:"active_canvass",description:"Large hail event with significant roof damage potential. Multiple reports of 2-3 inch hail across north Dallas suburbs." },
  { id:"2",event_type:"Hailstorm",severity:"moderate",date:"2024-04-08",location:"Columbus, OH Metro",radius:"8 mile radius",hail_size:'1.5"',wind_speed:"50 mph",affected_properties:890,leads_generated:67,status:"canvass_complete",description:"Moderate hail with scattered damage reports. Primary impact zone: Westerville to Gahanna corridor." },
  { id:"3",event_type:"Severe Thunderstorm",severity:"severe",date:"2024-04-05",location:"Houston Metro",radius:"20 mile radius",hail_size:'1"',wind_speed:"80 mph",affected_properties:3200,leads_generated:142,status:"active_canvass",description:"Straight-line wind event with widespread debris impact. Tree fall damage to multiple roofs." },
  { id:"4",event_type:"Tornado",severity:"extreme",date:"2024-03-28",location:"North Dallas",radius:"5 mile path",hail_size:null,wind_speed:"120 mph",affected_properties:450,leads_generated:89,status:"response_complete",description:"EF-2 tornado touched down near Plano. Path of destruction 5 miles long. Emergency response activated." },
  { id:"5",event_type:"Hailstorm",severity:"minor",date:"2024-03-20",location:"Detroit Metro",radius:"10 mile radius",hail_size:'0.75"',wind_speed:"40 mph",affected_properties:1200,leads_generated:34,status:"monitoring",description:"Pea to penny-sized hail. Limited roof damage expected but good opportunity for inspection upsells." },
  { id:"6",event_type:"Ice Storm",severity:"moderate",date:"2024-02-15",location:"Detroit Metro",radius:"25 mile radius",hail_size:null,wind_speed:"35 mph",affected_properties:1800,leads_generated:52,status:"canvass_complete",description:"Ice accumulation caused gutter and flashing damage across Wayne and Oakland counties." }
];

export default function WeatherAlertsPage() {
  const [alerts, setAlerts] = useState(ALERTS);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [expanded, setExpanded] = useState<string|null>(null);

  const filtered = alerts.filter(a => (severityFilter === "All" || a.severity === severityFilter) && (a.location.toLowerCase().includes(search.toLowerCase()) || a.event_type.toLowerCase().includes(search.toLowerCase())));
  const totalAffected = alerts.reduce((s, a) => s + a.affected_properties, 0);
  const totalLeads = alerts.reduce((s, a) => s + a.leads_generated, 0);

  const sevColor = (s: string) => s === "extreme" ? "bg-red-600 text-white" : s === "severe" ? "bg-orange-500 text-white" : s === "moderate" ? "bg-yellow-500 text-white" : "bg-blue-400 text-white";
  const statusStyle = (s: string) => s === "active_canvass" ? "bg-green-100 text-green-700 animate-pulse" : s === "canvass_complete" ? "bg-blue-100 text-blue-700" : s === "response_complete" ? "bg-gray-100 text-gray-600" : "bg-yellow-100 text-yellow-700";

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-[#0B1F3A] flex items-center gap-2"><CloudLightning className="text-[#F0A500]" size={28}/>Weather Alerts & Storm Mapping</h1><p className="text-gray-500 mt-1">HailWatch, CoreLogic, NWS & StormBot AI — real-time storm tracking & canvassing</p></div>
        <button className="bg-[#F0A500] text-[#0B1F3A] px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-yellow-500"><RefreshCw size={18}/>Refresh Alerts</button>
      </div>

      {/* Data Sources */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {SOURCES.map(s=>(
          <div key={s.name} className="bg-white rounded-xl border p-3">
            <div className="flex items-center gap-2 mb-1"><span className="text-xl">{s.logo}</span><h3 className="font-bold text-sm text-[#0B1F3A]">{s.name}</h3></div>
            <p className="text-[10px] text-gray-500">{s.desc}</p>
            <div className="flex flex-wrap gap-1 mt-2">{s.features.map(f=><span key={f} className="bg-gray-100 px-1.5 py-0.5 rounded text-[9px] text-gray-600">{f}</span>)}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[{l:"Active Alerts",v:alerts.filter(a=>a.status.includes("active")).length,c:"text-red-600"},{l:"Total Events",v:alerts.length,c:"text-blue-600"},{l:"Affected Properties",v:`${(totalAffected/1000).toFixed(1)}K`,c:"text-orange-600"},{l:"Leads Generated",v:totalLeads,c:"text-green-600"},{l:"Conversion Rate",v:`${((totalLeads/totalAffected)*100).toFixed(1)}%`,c:"text-purple-600"}].map((s,i)=>(
          <div key={i} className="bg-white rounded-xl border p-4 text-center"><p className={`text-2xl font-bold ${s.c}`}>{s.v}</p><p className="text-xs text-gray-500 mt-1">{s.l}</p></div>
        ))}
      </div>

      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-xs"><Search className="absolute left-3 top-2.5 text-gray-400" size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search alerts..." className="pl-9 pr-3 py-2 border rounded-lg w-full text-sm"/></div>
        {["All","extreme","severe","moderate","minor"].map(s=><button key={s} onClick={()=>setSeverityFilter(s)} className={`px-3 py-1.5 rounded-full text-xs font-medium ${severityFilter===s?"bg-[#0B1F3A] text-white":"bg-gray-100 text-gray-600"}`}>{s==="All"?"All":s.charAt(0).toUpperCase()+s.slice(1)}</button>)}
      </div>

      {/* Storm Map Placeholder */}
      <div className="bg-white rounded-xl border p-4">
        <h3 className="font-bold text-[#0B1F3A] mb-2">Live Storm Map</h3>
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg h-48 flex items-center justify-center text-gray-400">
          <div className="text-center"><MapPin size={32} className="mx-auto mb-2 text-red-400"/><p className="text-sm">Interactive storm overlay map</p><p className="text-xs">HailWatch + CoreLogic radar data</p>
            <div className="flex gap-3 justify-center mt-3">{[{c:"bg-red-500",l:"Extreme"},{c:"bg-orange-500",l:"Severe"},{c:"bg-yellow-500",l:"Moderate"},{c:"bg-blue-400",l:"Minor"}].map(i=><span key={i.l} className="flex items-center gap-1 text-[10px]"><div className={`w-2 h-2 rounded-full ${i.c}`}/>{i.l}</span>)}</div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(a=>(
          <div key={a.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4 flex items-center gap-4 cursor-pointer" onClick={()=>setExpanded(expanded===a.id?null:a.id)}>
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${sevColor(a.severity)}`}>{a.severity}</span>
              <div className="flex-1"><h3 className="font-semibold text-[#0B1F3A]">{a.event_type} — {a.location}</h3><p className="text-xs text-gray-500">{a.date} · {a.radius}{a.hail_size?` · Hail: ${a.hail_size}`:""}{a.wind_speed?` · Wind: ${a.wind_speed}`:""}</p></div>
              <div className="text-center"><p className="font-bold text-orange-600">{a.affected_properties.toLocaleString()}</p><p className="text-[10px] text-gray-500">Properties</p></div>
              <div className="text-center"><p className="font-bold text-green-600">{a.leads_generated}</p><p className="text-[10px] text-gray-500">Leads</p></div>
              <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${statusStyle(a.status)}`}>{a.status.replace("_"," ")}</span>
            </div>
            {expanded === a.id && (
              <div className="border-t px-4 py-3 bg-gray-50">
                <p className="text-sm text-gray-700 mb-3">{a.description}</p>
                <div className="flex gap-3">
                  <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 flex items-center gap-1"><Users size={12}/>Launch Canvass</button>
                  <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 flex items-center gap-1"><Eye size={12}/>View Affected Properties</button>
                  <button className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs hover:bg-purple-700 flex items-center gap-1"><Bell size={12}/>Send Customer Alerts</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
