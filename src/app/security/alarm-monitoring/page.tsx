"use client";
import { useState, useEffect } from "react";
import { Radio, AlertTriangle, CheckCircle, Clock, Phone, MapPin, Shield, Bell, XCircle, Filter, Search } from "lucide-react";

interface AlarmSignal {
  id: string; account_name: string; address: string; signal_type: string; zone: string;
  timestamp: string; status: string; response: string; priority: string; alarm_com_id: string;
}

const MOCK_SIGNALS: AlarmSignal[] = [
  { id:"1",account_name:"Johnson Family",address:"4521 Oak Ave, Dallas TX",signal_type:"Burglar Alarm",zone:"Zone 3 - Back Door",timestamp:"2 min ago",status:"active",response:"Dispatching police",priority:"critical",alarm_com_id:"ACM-78234" },
  { id:"2",account_name:"Williams Home",address:"789 Pine St, Detroit MI",signal_type:"Fire Alarm",zone:"Zone 7 - Kitchen Smoke",timestamp:"8 min ago",status:"verified",response:"Fire dept dispatched",priority:"critical",alarm_com_id:"ACM-45678" },
  { id:"3",account_name:"Brown Corp",address:"500 Commerce Blvd, Dallas TX",signal_type:"Trouble Signal",zone:"Zone 12 - Low Battery",timestamp:"15 min ago",status:"acknowledged",response:"Tech scheduled",priority:"low",alarm_com_id:"ACM-12345" },
  { id:"4",account_name:"Garcia Residence",address:"6789 Cedar Ln, Dallas TX",signal_type:"Panic Alarm",zone:"Master Bedroom Panic",timestamp:"22 min ago",status:"false_alarm",response:"Customer cancelled",priority:"high",alarm_com_id:"ACM-11122" },
  { id:"5",account_name:"Taylor Home",address:"8901 Walnut Ct, Dallas TX",signal_type:"Door Open",zone:"Zone 1 - Front Door",timestamp:"35 min ago",status:"auto_cleared",response:"Auto-armed after 10min",priority:"info",alarm_com_id:"ACM-77788" },
  { id:"6",account_name:"Anderson LLC",address:"100 Industrial Pkwy, Columbus OH",signal_type:"Motion Detected",zone:"Zone 22 - Warehouse",timestamp:"45 min ago",status:"verified",response:"Guard dispatched",priority:"medium",alarm_com_id:"ACM-55566" },
  { id:"7",account_name:"Smith Residence",address:"1234 Elm St, Columbus OH",signal_type:"Freeze Alarm",zone:"Zone 5 - Basement Temp",timestamp:"1 hr ago",status:"acknowledged",response:"Customer notified",priority:"medium",alarm_com_id:"ACM-91023" },
  { id:"8",account_name:"Davis Family",address:"2345 Maple Dr, Columbus OH",signal_type:"Communication Failure",zone:"Panel Offline",timestamp:"2 hrs ago",status:"active",response:"Tech dispatched",priority:"high",alarm_com_id:"ACM-67890" },
  { id:"9",account_name:"Thomas Residence",address:"5678 Spruce Ave, Detroit MI",signal_type:"Glass Break",zone:"Zone 9 - Living Room",timestamp:"3 hrs ago",status:"false_alarm",response:"Customer tested sensor",priority:"medium",alarm_com_id:"ACM-99900" },
  { id:"10",account_name:"Kim Home",address:"1122 Bamboo Way, Columbus OH",signal_type:"Water Leak",zone:"Zone 14 - Laundry Room",timestamp:"4 hrs ago",status:"resolved",response:"Customer confirmed plumber called",priority:"medium",alarm_com_id:"ACM-44455" },
];

export default function AlarmMonitoringPage() {
  const [signals, setSignals] = useState<AlarmSignal[]>(MOCK_SIGNALS);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = signals.filter(s => {
    const ms = s.account_name.toLowerCase().includes(search.toLowerCase()) || s.signal_type.toLowerCase().includes(search.toLowerCase());
    const mf = priorityFilter === "all" || s.priority === priorityFilter;
    return ms && mf;
  });

  const priorityColor: Record<string,string> = { critical:"bg-red-600 text-white animate-pulse",high:"bg-red-100 text-red-700",medium:"bg-yellow-100 text-yellow-700",low:"bg-blue-100 text-blue-700",info:"bg-gray-100 text-gray-600" };
  const statusColor: Record<string,string> = { active:"bg-red-100 text-red-700",verified:"bg-orange-100 text-orange-700",acknowledged:"bg-blue-100 text-blue-700",false_alarm:"bg-gray-100 text-gray-600",auto_cleared:"bg-green-100 text-green-700",resolved:"bg-green-100 text-green-700" };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-red-700 to-red-900 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div><div className="flex items-center gap-3 mb-2"><Radio className="w-8 h-8" /><h1 className="text-3xl font-bold">Alarm Monitoring</h1></div>
            <p className="text-red-200">Real-time alarm signals, response management, and signal history.</p></div>
          <div className="flex items-center gap-3">
            <div className="bg-red-600/50 border border-red-400 rounded-xl px-4 py-2 flex items-center gap-2"><Bell className="w-5 h-5 animate-pulse"/><span className="text-lg font-bold">{signals.filter(s=>s.status==="active").length}</span><span className="text-red-200 text-sm">Active Alarms</span></div>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4 mt-6">
          {[
            { label:"Active",val:signals.filter(s=>s.status==="active").length },
            { label:"Verified",val:signals.filter(s=>s.status==="verified").length },
            { label:"False Alarms",val:signals.filter(s=>s.status==="false_alarm").length },
            { label:"Resolved Today",val:signals.filter(s=>s.status==="resolved").length },
            { label:"Critical",val:signals.filter(s=>s.priority==="critical").length },
          ].map(s=><div key={s.label} className="bg-white/10 rounded-xl p-4"><div className="text-2xl font-bold">{s.val}</div><div className="text-red-200 text-sm">{s.label}</div></div>)}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1"><Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search signals..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" /></div>
        <div className="flex gap-2">{["all","critical","high","medium","low"].map(p=><button key={p} onClick={()=>setPriorityFilter(p)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${priorityFilter===p?"bg-red-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{p}</button>)}</div>
      </div>

      <div className="space-y-3">
        {filtered.map(s=>(
          <div key={s.id} className={`bg-white rounded-xl border ${s.priority==="critical"?"border-red-300 shadow-red-100 shadow-lg":"border-gray-200"} p-5 hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.priority==="critical"?"bg-red-600":"bg-red-100"}`}>
                  <AlertTriangle className={`w-6 h-6 ${s.priority==="critical"?"text-white":"text-red-600"}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{s.signal_type}</h3>
                  <p className="text-sm text-gray-700">{s.account_name} — {s.zone}</p>
                  <p className="text-xs text-gray-500"><MapPin className="w-3 h-3 inline mr-1"/>{s.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-900">{s.response}</div>
                  <div className="text-xs text-gray-500 font-mono">{s.alarm_com_id} • {s.timestamp}</div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className={`px-3 py-0.5 rounded-full text-xs font-medium ${priorityColor[s.priority]}`}>{s.priority}</span>
                  <span className={`px-3 py-0.5 rounded-full text-xs font-medium ${statusColor[s.status]}`}>{s.status.replace("_"," ")}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
