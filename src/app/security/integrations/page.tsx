"use client";
import { useState } from "react";
import { Plug, CheckCircle, AlertTriangle, Clock, Settings, ExternalLink, RefreshCw, Search, Zap } from "lucide-react";

interface Integration {
  id: string; name: string; category: string; status: string; description: string;
  last_sync: string; records_synced: number; api_type: string; logo_color: string;
}

const INTEGRATIONS: Integration[] = [
  { id:"1",name:"Alarm.com",category:"Monitoring",status:"connected",description:"Central station integration, system management, video verification, smart home control",last_sync:"Real-time",records_synced:6234,api_type:"REST API + Webhooks",logo_color:"bg-blue-600" },
  { id:"2",name:"SecurityTrax",category:"CRM",status:"connected",description:"Account management, contract tracking, RMR billing, commission calculations",last_sync:"5 min ago",records_synced:4521,api_type:"REST API",logo_color:"bg-indigo-600" },
  { id:"3",name:"ADI Global",category:"Equipment",status:"connected",description:"Equipment ordering, inventory management, pricing, product catalog sync",last_sync:"1 hr ago",records_synced:2341,api_type:"EDI + API",logo_color:"bg-red-600" },
  { id:"4",name:"Wave Electronics",category:"Equipment",status:"connected",description:"Distributor integration for panels, sensors, cameras, and smart home devices",last_sync:"2 hrs ago",records_synced:1892,api_type:"REST API",logo_color:"bg-purple-600" },
  { id:"5",name:"Pure Finance Group",category:"Financing",status:"connected",description:"Customer financing, loan applications, payment processing, approval workflows",last_sync:"15 min ago",records_synced:892,api_type:"REST API + OAuth",logo_color:"bg-green-600" },
  { id:"6",name:"n8n",category:"Automation",status:"connected",description:"Workflow automation, data transformation, multi-system orchestration, custom triggers",last_sync:"Real-time",records_synced:24102,api_type:"Webhooks + REST",logo_color:"bg-orange-600" },
  { id:"7",name:"GoldenDoorApp.com",category:"Customer Portal",status:"connected",description:"Customer-facing portal for system control, bill pay, service requests, and video",last_sync:"Real-time",records_synced:8934,api_type:"REST API + WebSocket",logo_color:"bg-amber-600" },
  { id:"8",name:"RingCentral",category:"Communications",status:"connected",description:"VoIP calling, SMS, fax, call recording, IVR, team messaging, video meetings",last_sync:"Real-time",records_synced:15672,api_type:"REST API + WebRTC",logo_color:"bg-blue-500" },
  { id:"9",name:"PandaDoc",category:"Documents",status:"connected",description:"Proposals, contracts, e-signatures, document tracking, template management",last_sync:"30 min ago",records_synced:1456,api_type:"REST API + Webhooks",logo_color:"bg-green-500" },
  { id:"10",name:"CallPilot",category:"Communications",status:"connected",description:"Auto-dialer, call scripting, lead calling campaigns, compliance recording",last_sync:"Real-time",records_synced:34521,api_type:"SIP + REST API",logo_color:"bg-cyan-600" },
  { id:"11",name:"CompanyCam",category:"Field Ops",status:"connected",description:"Job site photos, project documentation, before/after comparisons, GPS tagging",last_sync:"10 min ago",records_synced:4521,api_type:"REST API",logo_color:"bg-yellow-600" },
  { id:"12",name:"TransUnion",category:"Credit",status:"connected",description:"Credit checks, identity verification, fraud detection, customer qualification",last_sync:"On-demand",records_synced:3456,api_type:"REST API + SOAP",logo_color:"bg-red-500" },
  { id:"13",name:"SiteCapture",category:"Field Ops",status:"connected",description:"Property surveys, roof measurements, solar shading analysis, photo capture",last_sync:"20 min ago",records_synced:2134,api_type:"REST API",logo_color:"bg-teal-600" },
  { id:"14",name:"SubcontractorHub",category:"Operations",status:"connected",description:"Subcontractor management, job assignment, quality tracking, payment processing",last_sync:"1 hr ago",records_synced:567,api_type:"REST API",logo_color:"bg-gray-600" },
  { id:"15",name:"Wells Fargo",category:"Financing",status:"connected",description:"Equipment financing split, monitoring payment processing, auto-pay enrollment",last_sync:"Daily",records_synced:1234,api_type:"SFTP + API",logo_color:"bg-red-700" },
  { id:"16",name:"HubSpot",category:"Marketing",status:"connected",description:"Marketing automation, email campaigns, lead tracking, contact sync, analytics",last_sync:"5 min ago",records_synced:14523,api_type:"REST API + Webhooks",logo_color:"bg-orange-500" },
  { id:"17",name:"Zapier",category:"Automation",status:"connected",description:"Multi-app workflow automation, 6000+ app connections, trigger-based actions",last_sync:"Real-time",records_synced:8901,api_type:"Webhooks",logo_color:"bg-orange-600" },
  { id:"18",name:"Google Workspace",category:"Productivity",status:"connected",description:"Gmail, Calendar, Drive, Sheets, Docs — full workspace integration",last_sync:"Real-time",records_synced:45623,api_type:"REST API + OAuth",logo_color:"bg-blue-400" },
];

export default function IntegrationsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = ["all", ...Array.from(new Set(INTEGRATIONS.map(i=>i.category)))];
  const filtered = INTEGRATIONS.filter(i => {
    const ms = i.name.toLowerCase().includes(search.toLowerCase());
    const mf = categoryFilter === "all" || i.category === categoryFilter;
    return ms && mf;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-violet-700 to-violet-900 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div><div className="flex items-center gap-3 mb-2"><Plug className="w-8 h-8" /><h1 className="text-3xl font-bold">Integrations</h1></div>
            <p className="text-violet-200">Connected to every tool in your stack. Alarm.com, SecurityTrax, ADI, Wave, PureFinance, n8n + 12 more.</p></div>
          <button className="bg-white text-violet-700 px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2"><Zap className="w-5 h-5" /> Add Integration</button>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[
            { label:"Connected",val:INTEGRATIONS.filter(i=>i.status==="connected").length },
            { label:"Total Records Synced",val:`${(INTEGRATIONS.reduce((a,i)=>a+i.records_synced,0)/1000).toFixed(0)}K` },
            { label:"Real-time Syncs",val:INTEGRATIONS.filter(i=>i.last_sync==="Real-time").length },
            { label:"Categories",val:categories.length-1 },
          ].map(s=><div key={s.label} className="bg-white/10 rounded-xl p-4"><div className="text-2xl font-bold">{s.val}</div><div className="text-violet-200 text-sm">{s.label}</div></div>)}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1"><Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search integrations..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" /></div>
        <div className="flex gap-2 flex-wrap">{categories.map(c=><button key={c} onClick={()=>setCategoryFilter(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${categoryFilter===c?"bg-violet-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{c}</button>)}</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filtered.map(i=>(
          <div key={i.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 ${i.logo_color} rounded-xl flex items-center justify-center text-white font-bold text-lg`}>{i.name.charAt(0)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900">{i.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" />{i.status}</span>
                    <button className="p-1 text-gray-400 hover:text-violet-600"><Settings className="w-4 h-4" /></button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-2">{i.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span><RefreshCw className="w-3 h-3 inline mr-1"/>{i.last_sync}</span>
                  <span>{i.records_synced.toLocaleString()} records</span>
                  <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-600">{i.api_type}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
