'use client';

import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Grid3x3,
  List,
  Power,
  Settings,
  Sun,
  TrendingUp,
  Zap,
  AlertTriangle,
  MapPin,
} from 'lucide-react';

// Type Definitions
interface MonitoredSystem {
  id: string;
  systemName: string;
  customer: string;
  provider: 'enphase' | 'solaredge' | 'tesla' | 'generac' | 'other';
  sizeKw: number;
  status: 'online' | 'offline' | 'degraded';
  currentPowerW: number;
  todayKwh: number;
  monthKwh: number;
  lifetimeMwh: number;
  performanceRatio: number;
  lastReading: string;
  alertCount: number;
  installDate: string;
}

interface SystemAlert {
  id: string;
  systemId: string;
  systemName: string;
  alertType: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  createdAt: string;
  isResolved: boolean;
}

// Mock Data
const mockSystems: MonitoredSystem[] = [
  {
    id: 'sys-001',
    systemName: 'Sunnyvale Complex',
    customer: 'Tech Corp Inc',
    provider: 'enphase',
    sizeKw: 50,
    status: 'online',
    currentPowerW: 42500,
    todayKwh: 285,
    monthKwh: 8200,
    lifetimeMwh: 1450,
    performanceRatio: 97.2,
    lastReading: '2 minutes ago',
    alertCount: 0,
    installDate: '2021-03-15',
  },
  {
    id: 'sys-002',
    systemName: 'Downtown Office',
    customer: 'Finance Group',
    provider: 'solaredge',
    sizeKw: 30,
    status: 'online',
    currentPowerW: 28800,
    todayKwh: 195,
    monthKwh: 5400,
    lifetimeMwh: 890,
    performanceRatio: 96.8,
    lastReading: '5 minutes ago',
    alertCount: 1,
    installDate: '2022-07-20',
  },
  {
    id: 'sys-003',
    systemName: 'Warehouse North',
    customer: 'Logistics Ltd',
    provider: 'tesla',
    sizeKw: 75,
    status: 'degraded',
    currentPowerW: 52000,
    todayKwh: 380,
    monthKwh: 10500,
    lifetimeMwh: 2100,
    performanceRatio: 91.5,
    lastReading: '8 minutes ago',
    alertCount: 2,
    installDate: '2020-11-08',
  },
  {
    id: 'sys-004',
    systemName: 'Retail Plaza',
    customer: 'Retail Partners',
    provider: 'enphase',
    sizeKw: 40,
    status: 'online',
    currentPowerW: 35200,
    todayKwh: 224,
    monthKwh: 6800,
    lifetimeMwh: 1200,
    performanceRatio: 95.1,
    lastReading: '3 minutes ago',
    alertCount: 0,
    installDate: '2022-01-12',
  },
  {
    id: 'sys-005',
    systemName: 'Industrial Park',
    customer: 'Manufacturing Co',
    provider: 'generac',
    sizeKw: 100,
    status: 'offline',
    currentPowerW: 0,
    todayKwh: 0,
    monthKwh: 7200,
    lifetimeMwh: 3500,
    performanceRatio: 0,
    lastReading: '1 hour ago',
    alertCount: 3,
    installDate: '2019-09-25',
  },
  {
    id: 'sys-006',
    systemName: 'Campus Green',
    customer: 'University',
    provider: 'solaredge',
    sizeKw: 60,
    status: 'online',
    currentPowerW: 54000,
    todayKwh: 312,
    monthKwh: 9100,
    lifetimeMwh: 1800,
    performanceRatio: 98.3,
    lastReading: '1 minute ago',
    alertCount: 0,
    installDate: '2021-05-30',
  },
  {
    id: 'sys-007',
    systemName: 'Harbor Terminal',
    customer: 'Port Authority',
    provider: 'tesla',
    sizeKw: 55,
    status: 'online',
    currentPowerW: 48500,
    todayKwh: 298,
    monthKwh: 8900,
    lifetimeMwh: 1650,
    performanceRatio: 96.5,
    lastReading: '4 minutes ago',
    alertCount: 0,
    installDate: '2022-02-18',
  },
  {
    id: 'sys-008',
    systemName: 'Medical Center',
    customer: 'Health Systems',
    provider: 'enphase',
    sizeKw: 45,
    status: 'online',
    currentPowerW: 39800,
    todayKwh: 268,
    monthKwh: 7900,
    lifetimeMwh: 1500,
    performanceRatio: 97.8,
    lastReading: '6 minutes ago',
    alertCount: 0,
    installDate: '2021-08-12',
  },
];

const mockAlerts: SystemAlert[] = [
  {
    id: 'alert-001',
    systemId: 'sys-003',
    systemName: 'Warehouse North',
    alertType: 'performance',
    severity: 'warning',
    title: 'Low Performance Detected',
    description: 'System performance below threshold at 91.5%',
    createdAt: '2 hours ago',
    isResolved: false,
  },
  {
    id: 'alert-002',
    systemId: 'sys-005',
    systemName: 'Industrial Park',
    alertType: 'offline',
    severity: 'critical',
    title: 'System Offline',
    description: 'No data received in the last hour',
    createdAt: '1 hour ago',
    isResolved: false,
  },
  {
    id: 'alert-003',
    systemId: 'sys-002',
    systemName: 'Downtown Office',
    alertType: 'inverter',
    severity: 'info',
    title: 'Scheduled Maintenance',
    description: 'Inverter maintenance scheduled for next week',
    createdAt: '4 hours ago',
    isResolved: false,
  },
  {
    id: 'alert-004',
    systemId: 'sys-005',
    systemName: 'Industrial Park',
    alertType: 'communication',
    severity: 'critical',
    title: 'Communication Error',
    description: 'Loss of communication with monitoring device',
    createdAt: '1 hour ago',
    isResolved: false,
  },
  {
    id: 'alert-005',
    systemId: 'sys-003',
    systemName: 'Warehouse North',
    alertType: 'sensor',
    severity: 'warning',
    title: 'Sensor Malfunction',
    description: 'Temperature sensor reading inconsistent',
    createdAt: '3 hours ago',
    isResolved: false,
  },
];

// 7-day production data (in kWh)
const productionData = [
  { day: 'Mon', value: 1420 },
  { day: 'Tue', value: 1580 },
  { day: 'Wed', value: 1650 },
  { day: 'Thu', value: 1540 },
  { day: 'Fri', value: 1720 },
  { day: 'Sat', value: 1860 },
  { day: 'Sun', value: 1640 },
];

const maxValue = Math.max(...productionData.map((d) => d.value));

export default function MonitoringPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [alertsExpanded, setAlertsExpanded] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const systemsOnline = mockSystems.filter((s) => s.status === 'online').length;
  const totalSystems = mockSystems.length;
  const totalProduction = mockSystems.reduce((sum, sys) => sum + sys.todayKwh, 0);
  const activeAlerts = mockAlerts.filter((a) => !a.isResolved).length;
  const avgPerformance =
    mockSystems
      .filter((s) => s.status !== 'offline')
      .reduce((sum, sys) => sum + sys.performanceRatio, 0) /
    mockSystems.filter((s) => s.status !== 'offline').length;

  const filteredSystems =
    selectedFilter === 'all'
      ? mockSystems
      : mockSystems.filter((s) => s.status === selectedFilter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg">
                <Activity className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Asset Monitoring</h1>
                <p className="text-sm text-slate-600">Real-time system health & performance</p>
              </div>
            </div>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Settings className="text-slate-600" size={24} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Systems Online</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {systemsOnline}/{totalSystems}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <CheckCircle2 className="text-emerald-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Today's Production</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {totalProduction.toFixed(1)} <span className="text-lg text-slate-600">kWh</span>
                </p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <Sun className="text-amber-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Active Alerts</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{activeAlerts}</p>
              </div>
              <div className={`p-3 rounded-lg ${activeAlerts > 0 ? 'bg-red-50' : 'bg-slate-50'}`}>
                <AlertCircle
                  className={activeAlerts > 0 ? 'text-red-600' : 'text-slate-400'}
                  size={28}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Avg Performance</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {avgPerformance.toFixed(1)} <span className="text-lg text-slate-600">%</span>
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <TrendingUp className="text-blue-600" size={28} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Controls */}
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Grid3x3 size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>

              <div className="flex gap-2">
                {['all', 'online', 'degraded', 'offline'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedFilter === filter
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {filteredSystems.map((system) => (
                  <div
                    key={system.id}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900">{system.systemName}</h3>
                        <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                          <MapPin size={14} />
                          {system.customer}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          system.status === 'online'
                            ? 'bg-emerald-100 text-emerald-700'
                            : system.status === 'degraded'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {system.status.charAt(0).toUpperCase() + system.status.slice(1)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-slate-600 uppercase tracking-wide">Size</p>
                        <p className="text-lg font-bold text-slate-900">{system.sizeKw} kW</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 uppercase tracking-wide">Today</p>
                        <p className="text-lg font-bold text-slate-900">{system.todayKwh} kWh</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 uppercase tracking-wide">This Month</p>
                        <p className="text-lg font-bold text-slate-900">
                          {(system.monthKwh / 1000).toFixed(1)} MWh
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 uppercase tracking-wide">Performance</p>
                        <p className="text-lg font-bold text-slate-900">{system.performanceRatio}%</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-600">Current Output</p>
                        <div className="flex items-baseline gap-1 mt-1">
                          <Zap className="text-amber-500" size={16} />
                          <p className="font-bold text-slate-900">
                            {(system.currentPowerW / 1000).toFixed(1)} kW
                          </p>
                        </div>
                      </div>
                      {system.alertCount > 0 && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg">
                          <AlertTriangle size={16} className="text-red-600" />
                          <span className="text-sm font-semibold text-red-700">
                            {system.alertCount} alert{system.alertCount > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                        System
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase">
                        Current
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase">
                        Today
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase">
                        Performance
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase">
                        Alerts
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredSystems.map((system) => (
                      <tr key={system.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-slate-900">{system.systemName}</p>
                            <p className="text-sm text-slate-600">{system.customer}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                              system.status === 'online'
                                ? 'bg-emerald-100 text-emerald-700'
                                : system.status === 'degraded'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-red-100 text-red-700'
                            }`}
                          >
                            <Power size={14} />
                            {system.status.charAt(0).toUpperCase() + system.status.slice(1)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="font-semibold text-slate-900">
                            {(system.currentPowerW / 1000).toFixed(1)} kW
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="font-semibold text-slate-900">{system.todayKwh} kWh</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="font-semibold text-slate-900">{system.performanceRatio}%</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {system.alertCount > 0 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                              {system.alertCount}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Production Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-8">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="text-blue-600" size={24} />
                <h2 className="text-lg font-bold text-slate-900">7-Day Production Summary</h2>
              </div>

              <div className="flex items-end justify-between h-48 gap-2">
                {productionData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg hover:from-blue-600 hover:to-blue-500 transition-colors"
                         style={{ height: `${(data.value / maxValue) * 180}px` }}>
                      <div className="text-xs font-bold text-white text-center mt-2">
                        {data.value}
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-600">{data.day}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-slate-600 uppercase tracking-wide">Avg Daily</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {(productionData.reduce((sum, d) => sum + d.value, 0) / productionData.length).toFixed(0)} kWh
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 uppercase tracking-wide">Weekly Total</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {productionData.reduce((sum, d) => sum + d.value, 0).toFixed(0)} kWh
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 uppercase tracking-wide">Peak Day</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {Math.max(...productionData.map((d) => d.value))} kWh
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
              <button
                onClick={() => setAlertsExpanded(!alertsExpanded)}
                className="w-full flex items-center justify-between p-6 bg-slate-50 border-b border-slate-200 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle
                    className={activeAlerts > 0 ? 'text-red-600' : 'text-slate-400'}
                    size={20}
                  />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-900">Active Alerts</p>
                    <p className="text-xs text-slate-600">{activeAlerts} total</p>
                  </div>
                </div>
                {alertsExpanded ? (
                  <ChevronUp className="text-slate-600" size={20} />
                ) : (
                  <ChevronDown className="text-slate-600" size={20} />
                )}
              </button>

              {alertsExpanded && (
                <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
                  {mockAlerts.length === 0 ? (
                    <div className="p-6 text-center">
                      <CheckCircle2 className="mx-auto text-emerald-500 mb-2" size={24} />
                      <p className="text-sm font-medium text-slate-900">No active alerts</p>
                      <p className="text-xs text-slate-600 mt-1">All systems operating normally</p>
                    </div>
                  ) : (
                    mockAlerts.map((alert) => (
                      <div key={alert.id} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-1 p-1.5 rounded ${
                              alert.severity === 'critical'
                                ? 'bg-red-100'
                                : alert.severity === 'warning'
                                  ? 'bg-amber-100'
                                  : 'bg-blue-100'
                            }`}
                          >
                            {alert.severity === 'critical' ? (
                              <AlertTriangle
                                className="text-red-600"
                                size={14}
                              />
                            ) : alert.severity === 'warning' ? (
                              <AlertCircle
                                className="text-amber-600"
                                size={14}
                              />
                            ) : (
                              <Clock className="text-blue-600" size={14} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {alert.systemName}
                            </p>
                            <p className="text-xs text-slate-700 font-medium mt-1">{alert.title}</p>
                            <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                              {alert.description}
                            </p>
                            <p className="text-xs text-slate-500 mt-2">{alert.createdAt}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
