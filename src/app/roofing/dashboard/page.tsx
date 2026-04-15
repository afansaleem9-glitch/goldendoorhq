'use client';

import { useState } from 'react';
import {
  Home,
  TrendingUp,
  DollarSign,
  Calendar,
  Package,
  Eye,
  BarChart3,
  Activity,
  AlertTriangle,
  CloudRain,
  Sun,
  Wrench,
  CheckCircle2,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 45000 },
  { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 48000 },
  { month: 'Apr', revenue: 61000 },
  { month: 'May', revenue: 55000 },
  { month: 'Jun', revenue: 67000 },
];

const projectStatusData = [
  { name: 'Estimate', value: 8, color: '#3b82f6' },
  { name: 'Approved', value: 12, color: '#10b981' },
  { name: 'In Progress', value: 5, color: '#f59e0b' },
  { name: 'Complete', value: 23, color: '#6366f1' },
];

const materialUsageData = [
  { material: 'GAF Shingles', percentage: 35 },
  { material: 'Owens Corning', percentage: 28 },
  { material: 'CertainTeed', percentage: 20 },
  { material: 'Other', percentage: 17 },
];

const recentActivity = [
  {
    id: 1,
    type: 'project_created',
    title: 'New project: 1247 Oak Street',
    description: 'Created by John Smith',
    time: '2 hours ago',
    icon: Home,
  },
  {
    id: 2,
    type: 'inspection_scheduled',
    title: 'Inspection scheduled',
    description: '892 Maple Ave - Pre-install inspection',
    time: '4 hours ago',
    icon: Eye,
  },
  {
    id: 3,
    type: 'lead_qualified',
    title: 'Lead qualified: Sarah Johnson',
    description: 'Roof age: 18 years, Lead score: 92',
    time: '1 day ago',
    icon: TrendingUp,
  },
  {
    id: 4,
    type: 'project_completed',
    title: 'Project completed: 456 Elm Drive',
    description: 'Total revenue: $12,500',
    time: '2 days ago',
    icon: CheckCircle2,
  },
  {
    id: 5,
    type: 'materials_ordered',
    title: 'Materials ordered',
    description: '2 bundles GAF, 3 bundles Owens Corning',
    time: '3 days ago',
    icon: Package,
  },
];

const weatherAlerts = [
  {
    id: 1,
    type: 'rain',
    title: 'Heavy rain expected',
    description: 'Thursday 2-6 PM - May affect outdoor work',
    severity: 'medium',
  },
  {
    id: 2,
    type: 'wind',
    title: 'High winds forecasted',
    description: '25-35 mph Friday - Pause roofing operations',
    severity: 'high',
  },
];

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const kpis = [
    {
      label: 'Active Projects',
      value: '18',
      change: '+2 this week',
      icon: Home,
      color: 'from-blue-600 to-blue-400',
    },
    {
      label: 'Pipeline Value',
      value: '$287K',
      change: '+$42K pending',
      icon: DollarSign,
      color: 'from-green-600 to-green-400',
    },
    {
      label: 'Completed This Month',
      value: '12',
      change: '+3 scheduled',
      icon: CheckCircle2,
      color: 'from-purple-600 to-purple-400',
    },
    {
      label: 'Avg Job Size',
      value: '$8,600',
      change: '+5% vs. last month',
      icon: TrendingUp,
      color: 'from-orange-600 to-orange-400',
    },
    {
      label: 'Materials Ordered',
      value: '156 bundles',
      change: '8 pending delivery',
      icon: Package,
      color: 'from-indigo-600 to-indigo-400',
    },
    {
      label: 'Open Inspections',
      value: '7',
      change: '3 scheduled today',
      icon: Eye,
      color: 'from-rose-600 to-rose-400',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-blue-200">Welcome back, Manager • Real-time roofing operations overview</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-slate-700 hover:border-blue-500 transition"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 text-sm font-medium">{kpi.label}</h3>
                <div className={`bg-gradient-to-br ${kpi.color} p-2 rounded-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-2">{kpi.value}</p>
              <p className="text-green-400 text-sm">{kpi.change}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                formatter={(value: any) => `$${value.toLocaleString()}`}
              />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Project Status Pie Chart */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">Project Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={projectStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {projectStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => value} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Material Usage & Weather Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Material Usage */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">Material Usage Breakdown</h2>
          <div className="space-y-4">
            {materialUsageData.map((material) => (
              <div key={material.material}>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300 text-sm">{material.material}</span>
                  <span className="text-white font-bold text-sm">{material.percentage}%</span>
                </div>
                <div className="bg-slate-600 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full"
                    style={{ width: `${material.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weather Alerts */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-white mb-4">Weather & Alerts</h2>
          <div className="space-y-3">
            {weatherAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${
                  alert.severity === 'high'
                    ? 'bg-red-900/20 border-red-500/30'
                    : 'bg-yellow-900/20 border-yellow-500/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  {alert.type === 'rain' ? (
                    <CloudRain className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-white">{alert.title}</p>
                    <p className="text-sm text-slate-300">{alert.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => {
            const ActivityIcon = activity.icon;
            return (
              <div key={activity.id} className="flex gap-4 pb-4 border-b border-slate-600 last:border-0">
                <div className="bg-blue-900/40 rounded-full p-2 flex-shrink-0">
                  <ActivityIcon className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white">{activity.title}</p>
                  <p className="text-sm text-slate-400">{activity.description}</p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
