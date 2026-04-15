"use client";
import { useState } from "react";
import { Shield, CheckCircle2, AlertCircle, Clock, Wifi, Camera, MapPin, Search, Filter, Bell } from "lucide-react";

const SYSTEMS = [
  { id: 1, customer: "Robert Martinez", address: "4521 Oak Lawn Ave, Dallas, TX", status: "Online", cameras: 4, sensors: 12, plan: "Interactive Gold", lastSignal: "2 min ago", monthly: 49.99 },
  { id: 2, customer: "Amanda Davis", address: "3367 Camp Bowie Blvd, Fort Worth, TX", status: "Online", cameras: 3, sensors: 8, plan: "Interactive Silver", lastSignal: "5 min ago", monthly: 39.99 },
  { id: 3, customer: "Sarah Johnson", address: "2847 Lakeshore Blvd, Cleveland, OH", status: "Online", cameras: 3, sensors: 6, plan: "Interactive Silver", lastSignal: "1 min ago", monthly: 39.99 },
  { id: 4, customer: "Michael Thompson", address: "891 High St, Columbus, OH", status: "Online", cameras: 6, sensors: 16, plan: "Interactive Gold", lastSignal: "3 min ago", monthly: 49.99 },
  { id: 5, customer: "David Kim", address: "1520 Preston Rd, Plano, TX", status: "Online", cameras: 8, sensors: 22, plan: "Interactive Platinum", lastSignal: "1 min ago", monthly: 59.99 },
  { id: 6, customer: "Jennifer Garcia", address: "2210 Washtenaw Ave, Ann Arbor, MI", status: "Online", cameras: 2, sensors: 6, plan: "Interactive Silver", lastSignal: "8 min ago", monthly: 39.99 },
  { id: 7, customer: "Thomas Wright", address: "4567 Main St, Akron, OH", status: "Offline", cameras: 3, sensors: 10, plan: "Interactive Gold", lastSignal: "2 hours ago", monthly: 49.99 },
  { id: 8, customer: "Lisa Chen", address: "8901 Belt Line Rd, Richardson, TX", status: "Alert", cameras: 4, sensors: 14, plan: "Interactive Gold", lastSignal: "15 min ago", monthly: 49.99 },
];

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: typeof CheckCircle2 }> = {
  Online: { color: "text-green-600", bg: "bg-green-50 border-green-200", icon: CheckCircle2 },
  Offline: { color: "text-red-600", bg: "bg-red-50 border-red-200", icon: AlertCircle },
  Alert: { color: "text-amber-600", bg: "bg-amber-50 border-amber-200", icon: Bell },
};

export default function SecurityMonitoring() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const online = SYSTEMS.filter(s => s.status === "Online").length;
  const offline = SYSTEMS.filter(s => s.status === "Offline").length;
  const alerts = SYSTEMS.filter(s => s.status === "Alert").length;
  const filtered = SYSTEMS.filter(s => {
    const matchSearch = search === "" || `${s.customer} ${s.address}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-purple-900 to-purple-700 px-6 py-6">
        <div className="max-w-[1440px] mx-auto">
          <h1 className="text-xl font-bold text-white flex items-center gap-2"><Shield size={20} /> System Monitoring</h1>
          <p className="text-purple-200 text-sm mt-1">Real-time ADC system status</p>
          <div className="flex gap-4 mt-4">
            <div className="bg-white/10 rounded-lg px-4 py-2 flex items-center gap-2"><CheckCircle2 size={14} className="text-green-400" /><span className="text-white font-bold">{online}</span><span className="text-purple-200 text-xs">Online</span></div>
            <div className="bg-white/10 rounded-lg px-4 py-2 flex items-center gap-2"><AlertCircle size={14} className="text-red-400" /><span className="text-white font-bold">{offline}</span><span className="text-purple-200 text-xs">Offline</span></div>
            <div className="bg-white/10 rounded-lg px-4 py-2 flex items-center gap-2"><Bell size={14} className="text-amber-400" /><span className="text-white font-bold">{alerts}</span><span className="text-purple-200 text-xs">Alerts</span></div>
          </div>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-6 py-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 max-w-md"><Search size={14} className="text-gray-400 mr-2" /><input type="text" placeholder="Search systems..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 text-sm outline-none bg-transparent text-black" /></div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none bg-white text-black"><option value="all">All Status</option><option value="Online">Online</option><option value="Offline">Offline</option><option value="Alert">Alert</option></select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {filtered.map(s => {
            const cfg = STATUS_CONFIG[s.status] || STATUS_CONFIG.Online;
            const SIcon = cfg.icon;
            return (
              <div key={s.id} className={`rounded-xl border-2 p-5 ${cfg.bg}`}>
                <div className="flex items-start justify-between mb-3">
                  <div><p className="text-sm font-bold text-black">{s.customer}</p><p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={10} /> {s.address}</p></div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${cfg.color} bg-white`}><SIcon size={12} /> {s.status}</div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div><p className="text-[10px] text-gray-500 uppercase">Cameras</p><p className="text-sm font-bold text-black flex items-center gap-1"><Camera size={12} /> {s.cameras}</p></div>
                  <div><p className="text-[10px] text-gray-500 uppercase">Sensors</p><p className="text-sm font-bold text-black">{s.sensors}</p></div>
                  <div><p className="text-[10px] text-gray-500 uppercase">Plan</p><p className="text-xs font-semibold text-black">{s.plan}</p></div>
                  <div><p className="text-[10px] text-gray-500 uppercase">Last Signal</p><p className="text-xs font-semibold text-black">{s.lastSignal}</p></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
