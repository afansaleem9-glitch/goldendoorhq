'use client';

import { useApi } from '@/lib/hooks/useApi';
import { MonitoredSystem } from '@/lib/types';
import { Activity, Zap, AlertTriangle, Loader, Sun, Battery, Wifi, WifiOff } from 'lucide-react';

const statusColors: Record<string, { bg: string; text: string; icon: typeof Wifi }> = {
  online: { bg: 'bg-green-100', text: 'text-green-700', icon: Wifi },
  offline: { bg: 'bg-red-100', text: 'text-red-700', icon: WifiOff },
  degraded: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: AlertTriangle },
  maintenance: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Activity },
};

export default function MonitoringPage() {
  const { data: systems, loading, error, total } = useApi<MonitoredSystem>('/api/monitoring', { limit: 100 });

  const online = systems.filter(s => s.status === 'online').length;
  const totalPower = systems.reduce((s, sys) => s + (Number(sys.current_power_w) || 0), 0);
  const todayProduction = systems.reduce((s, sys) => s + (Number(sys.today_production_kwh) || 0), 0);

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-[#0B1F3A] flex items-center gap-2"><Activity className="text-[#F0A500]" /> System Monitoring</h1>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card"><p className="text-sm text-[#9CA3AF]">Systems</p><p className="text-2xl font-bold text-[#0B1F3A]">{total}</p></div>
        <div className="card"><p className="text-sm text-[#9CA3AF]">Online</p><p className="text-2xl font-bold text-green-600">{online}</p></div>
        <div className="card"><p className="text-sm text-[#9CA3AF]">Current Power</p><p className="text-2xl font-bold text-[#F0A500]">{(totalPower / 1000).toFixed(1)} kW</p></div>
        <div className="card"><p className="text-sm text-[#9CA3AF]">Today</p><p className="text-2xl font-bold text-[#0B1F3A]">{todayProduction.toFixed(1)} kWh</p></div>
      </div>
      {loading ? <div className="flex items-center justify-center py-20"><Loader className="animate-spin text-gray-400" size={32} /></div>
      : error ? <div className="text-red-500 text-sm">{error}</div>
      : systems.length === 0 ? (
        <div className="card text-center py-20 text-gray-400"><Sun size={48} className="mx-auto mb-3 opacity-40" /><p className="font-medium">No monitored systems</p><p className="text-sm mt-1">Connect solar monitoring to see live data</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {systems.map(sys => {
            const sc = statusColors[sys.status] || statusColors.offline;
            const Icon = sc.icon;
            return (
              <div key={sys.id} className="card hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-[#0B1F3A]">{sys.system_name}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${sc.bg} ${sc.text}`}>
                    <Icon size={12} /> {sys.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-gray-50 rounded-lg p-2"><p className="text-xs text-[#9CA3AF]">Current</p><p className="text-sm font-bold text-[#F0A500]">{((Number(sys.current_power_w) || 0) / 1000).toFixed(1)} kW</p></div>
                  <div className="bg-gray-50 rounded-lg p-2"><p className="text-xs text-[#9CA3AF]">Today</p><p className="text-sm font-bold text-[#0B1F3A]">{Number(sys.today_production_kwh || 0).toFixed(1)} kWh</p></div>
                  <div className="bg-gray-50 rounded-lg p-2"><p className="text-xs text-[#9CA3AF]">Month</p><p className="text-sm font-bold text-[#0B1F3A]">{Number(sys.month_production_kwh || 0).toFixed(0)} kWh</p></div>
                  <div className="bg-gray-50 rounded-lg p-2"><p className="text-xs text-[#9CA3AF]">Size</p><p className="text-sm font-bold text-[#0B1F3A]">{sys.system_size_kw || '—'} kW</p></div>
                </div>
                <p className="text-xs text-[#9CA3AF] mt-2">{sys.monitoring_provider || 'Unknown provider'} · Last reading: {sys.last_reading_at ? new Date(sys.last_reading_at).toLocaleString() : 'Never'}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
