"use client";
import { useState } from "react";
import {
  Activity, Search, Wifi, WifiOff, Zap, Sun, Battery,
  AlertTriangle, CheckCircle2, Clock, TrendingUp,
  BarChart3, Eye, RefreshCw, MapPin
} from "lucide-react";

interface MonitoredSystem {
  id: string;
  system_name: string;
  homeowner: string;
  provider: string;
  status: "online" | "offline" | "warning" | "maintenance";
  system_size_kw: number;
  current_power_w: number;
  today_kwh: number;
  month_kwh: number;
  lifetime_mwh: number;
  efficiency: number;
  last_reading: string;
  address: string;
  city: string;
  state: string;
  installed_date: string;
  panel_type: string;
  inverter_type: string;
  alert_count: number;
}

const MOCK_SYSTEMS: MonitoredSystem[] = [
  { id: "m1", system_name: "Martinez Solar 12kW", homeowner: "Robert Martinez", provider: "Enphase Enlighten", status: "online", system_size_kw: 12.0, current_power_w: 9450, today_kwh: 42.3, month_kwh: 487.2, lifetime_mwh: 4.8, efficiency: 96, last_reading: "2 min ago", address: "4521 Oak Lawn Ave", city: "Dallas", state: "TX", installed_date: "Feb 2026", panel_type: "REC Alpha Pure-R 400W", inverter_type: "Enphase IQ8+", alert_count: 0 },
  { id: "m2", system_name: "Johnson Solar 8.5kW", homeowner: "Sarah Johnson", provider: "Enphase Enlighten", status: "warning", system_size_kw: 8.5, current_power_w: 4200, today_kwh: 22.1, month_kwh: 298.4, lifetime_mwh: 12.4, efficiency: 72, last_reading: "5 min ago", address: "2847 Lakeshore Blvd", city: "Cleveland", state: "OH", installed_date: "Nov 2025", panel_type: "Q.CELLS Q.PEAK DUO", inverter_type: "Enphase IQ8+", alert_count: 2 },
  { id: "m3", system_name: "Williams Solar 9.6kW", homeowner: "Jennifer Williams", provider: "SolarEdge", status: "online", system_size_kw: 9.6, current_power_w: 7840, today_kwh: 35.6, month_kwh: 412.8, lifetime_mwh: 1.2, efficiency: 94, last_reading: "1 min ago", address: "8903 Preston Rd", city: "Plano", state: "TX", installed_date: "Mar 2026", panel_type: "Canadian Solar 400W", inverter_type: "SolarEdge SE10000H", alert_count: 0 },
  { id: "m4", system_name: "Davis ADC Smart Home", homeowner: "Amanda Davis", provider: "Alarm.com", status: "online", system_size_kw: 0, current_power_w: 0, today_kwh: 0, month_kwh: 0, lifetime_mwh: 0, efficiency: 100, last_reading: "3 min ago", address: "3367 Camp Bowie Blvd", city: "Fort Worth", state: "TX", installed_date: "Dec 2025", panel_type: "ADC Panel + 4 Cameras", inverter_type: "ADC Hub", alert_count: 0 },
  { id: "m5", system_name: "Garcia ADC System", homeowner: "Carlos Garcia", provider: "Alarm.com", status: "offline", system_size_kw: 0, current_power_w: 0, today_kwh: 0, month_kwh: 0, lifetime_mwh: 0, efficiency: 0, last_reading: "18 hours ago", address: "4455 Hulen St", city: "Fort Worth", state: "TX", installed_date: "Jan 2026", panel_type: "ADC Panel + 6 Cameras + Doorbell", inverter_type: "ADC Hub", alert_count: 1 },
  { id: "m6", system_name: "Moore Solar 7.2kW", homeowner: "Patricia Moore", provider: "Enphase Enlighten", status: "online", system_size_kw: 7.2, current_power_w: 5890, today_kwh: 28.4, month_kwh: 321.6, lifetime_mwh: 0.9, efficiency: 95, last_reading: "4 min ago", address: "3289 Main St", city: "Frisco", state: "TX", installed_date: "Mar 2026", panel_type: "REC Alpha Pure-R 400W", inverter_type: "Enphase IQ8+", alert_count: 0 },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof Wifi }> = {
  online: { label: "Online", color: "text-green-600", bg: "bg-green-50", icon: Wifi },
  offline: { label: "Offline", color: "text-red-600", bg: "bg-red-50", icon: WifiOff },
  warning: { label: "Warning", color: "text-amber-600", bg: "bg-amber-50", icon: AlertTriangle },
  maintenance: { label: "Maintenance", color: "text-blue-600", bg: "bg-blue-50", icon: Clock },
};

export default function MonitoringPage() {
  const [systems] = useState(MOCK_SYSTEMS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<MonitoredSystem | null>(null);

  const filtered = systems.filter(s => {
    const matchSearch = search === "" || s.system_name.toLowerCase().includes(search.toLowerCase()) || s.homeowner.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPower = systems.reduce((s, sys) => s + sys.current_power_w, 0);
  const totalToday = systems.reduce((s, sys) => s + sys.today_kwh, 0);
  const onlineCount = systems.filter(s => s.status === "online").length;
  const alertCount = systems.reduce((s, sys) => s + sys.alert_count, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black flex items-center gap-2"><Activity size={24} /> System Monitoring</h1>
            <p className="text-sm text-gray-500 mt-1">{systems.length} systems tracked · {onlineCount} online</p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">
            <RefreshCw size={14} /> Refresh All
          </button>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Live Power Output", value: `${(totalPower / 1000).toFixed(1)} kW`, icon: Zap, color: "text-black" },
            { label: "Today's Production", value: `${totalToday.toFixed(1)} kWh`, icon: Sun, color: "text-black" },
            { label: "Systems Online", value: `${onlineCount}/${systems.length}`, icon: Wifi, color: "text-green-600" },
            { label: "Active Alerts", value: alertCount, icon: AlertTriangle, color: alertCount > 0 ? "text-red-600" : "text-green-600" },
          ].map(kpi => {
            const KIcon = kpi.icon;
            return (
              <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-5">
                <KIcon size={18} className="text-gray-500 mb-2" />
                <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 max-w-md focus-within:border-black transition-all">
            <Search size={14} className="text-gray-500 mr-2" />
            <input type="text" placeholder="Search systems..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 text-sm outline-none bg-transparent text-black placeholder-gray-400" aria-label="Search systems" />
          </div>
          {["all", "online", "warning", "offline"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${statusFilter === s ? "bg-black text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* System Cards */}
        <div className="grid grid-cols-2 gap-4">
          {filtered.map(sys => {
            const sc = STATUS_CONFIG[sys.status];
            const SIcon = sc.icon;
            const isSolar = sys.system_size_kw > 0;
            return (
              <div key={sys.id} className={`bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer ${sys.status === "offline" ? "border-red-200" : sys.status === "warning" ? "border-amber-200" : ""}`} onClick={() => setSelected(sys)}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-black">{sys.system_name}</h3>
                    <p className="text-xs text-gray-500">{sys.homeowner} · {sys.city}, {sys.state}</p>
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${sc.bg} ${sc.color}`}>
                    <SIcon size={11} /> {sc.label}
                  </span>
                </div>
                {isSolar ? (
                  <div className="grid grid-cols-4 gap-3 mt-3">
                    <div>
                      <p className="text-lg font-bold text-black">{(sys.current_power_w / 1000).toFixed(1)}<span className="text-xs text-gray-500 ml-0.5">kW</span></p>
                      <p className="text-[11px] text-gray-500">Current</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-black">{sys.today_kwh.toFixed(1)}<span className="text-xs text-gray-500 ml-0.5">kWh</span></p>
                      <p className="text-[11px] text-gray-500">Today</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-black">{sys.month_kwh.toFixed(0)}<span className="text-xs text-gray-500 ml-0.5">kWh</span></p>
                      <p className="text-[11px] text-gray-500">Month</p>
                    </div>
                    <div>
                      <p className={`text-lg font-bold ${sys.efficiency >= 90 ? "text-green-600" : sys.efficiency >= 70 ? "text-amber-600" : "text-red-600"}`}>{sys.efficiency}%</p>
                      <p className="text-[11px] text-gray-500">Efficiency</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600">{sys.panel_type}</p>
                    <p className="text-xs text-gray-500 mt-1">Provider: {sys.provider}</p>
                  </div>
                )}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  <span className="text-[11px] text-gray-500">Last reading: {sys.last_reading}</span>
                  {sys.alert_count > 0 && <span className="text-[11px] font-bold text-red-600 flex items-center gap-0.5"><AlertTriangle size={10} /> {sys.alert_count} alert{sys.alert_count > 1 ? "s" : ""}</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail Modal */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog">
            <div className="absolute inset-0 bg-black/20" onClick={() => setSelected(null)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-[520px] max-h-[80vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-black">{selected.system_name}</h2>
                <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-black text-lg" aria-label="Close">&times;</button>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  { label: "Homeowner", value: selected.homeowner },
                  { label: "Address", value: `${selected.address}, ${selected.city}, ${selected.state}` },
                  { label: "Provider", value: selected.provider },
                  { label: "System Size", value: selected.system_size_kw > 0 ? `${selected.system_size_kw} kW` : "N/A" },
                  { label: "Panel Type", value: selected.panel_type },
                  { label: "Inverter", value: selected.inverter_type },
                  { label: "Installed", value: selected.installed_date },
                  { label: "Lifetime Production", value: selected.lifetime_mwh > 0 ? `${selected.lifetime_mwh} MWh` : "N/A" },
                ].map(f => (
                  <div key={f.label} className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-xs font-semibold text-gray-500 uppercase">{f.label}</span>
                    <span className="text-sm text-black font-medium">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
