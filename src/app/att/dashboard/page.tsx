'use client';

import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, Clock, Zap, Activity } from 'lucide-react';

const Dashboard = () => {
  const kpiData = [
    { label: 'Total Accounts', value: '2,847', icon: Users, change: '+12%', trend: 'up' },
    { label: 'Monthly Recurring', value: '$847K', icon: TrendingUp, change: '+8.5%', trend: 'up' },
    { label: 'New Activations', value: '156', icon: Zap, change: '+23%', trend: 'up' },
    { label: 'Pending Installs', value: '43', icon: Clock, change: '-5%', trend: 'down' },
    { label: 'Avg Speed (Mbps)', value: '512', icon: Activity, change: '+4%', trend: 'up' },
  ];

  const planDistribution = [
    { name: 'Fiber 100', value: 45, fill: '#0369a1' },
    { name: 'Fiber 300', value: 32, fill: '#0284c7' },
    { name: 'Fiber 1000', value: 18, fill: '#06b6d4' },
    { name: 'Legacy DSL', value: 5, fill: '#38bdf8' },
  ];

  const monthlyActivations = [
    { month: 'Jan', activations: 89, revenue: 42 },
    { month: 'Feb', activations: 102, revenue: 48 },
    { month: 'Mar', activations: 128, revenue: 61 },
    { month: 'Apr', activations: 145, revenue: 69 },
    { month: 'May', activations: 156, revenue: 74 },
    { month: 'Jun', activations: 142, revenue: 68 },
  ];

  const revenueByPlan = [
    { plan: 'Fiber 100', revenue: 180 },
    { plan: 'Fiber 300', revenue: 340 },
    { plan: 'Fiber 1000', revenue: 285 },
    { plan: 'Legacy DSL', value: 42 },
  ];

  const recentActivity = [
    { id: 1, action: 'New account activated', customer: 'Acme Corp', time: '2 hours ago', status: 'completed' },
    { id: 2, action: 'Installation scheduled', customer: 'Tech Innovations Inc', time: '4 hours ago', status: 'pending' },
    { id: 3, action: 'Upgrade completed', customer: 'Global Solutions Ltd', time: '1 day ago', status: 'completed' },
    { id: 4, action: 'Service downtime reported', customer: 'Digital First Agency', time: '2 days ago', status: 'alert' },
    { id: 5, action: 'Contract renewal', customer: 'Enterprise Systems Co', time: '3 days ago', status: 'completed' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">AT&T Telecom Dashboard</h1>
          <p className="text-slate-400">Real-time account and revenue overview</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {kpiData.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div key={idx} className="bg-gradient-to-br from-sky-900 to-sky-700 rounded-lg p-6 border border-sky-600 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <Icon className="w-6 h-6 text-sky-300" />
                  <span className={`text-xs font-semibold ${kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {kpi.change}
                  </span>
                </div>
                <p className="text-slate-300 text-sm mb-1">{kpi.label}</p>
                <p className="text-3xl font-bold text-white">{kpi.value}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Plan Distribution Pie Chart */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-6">Plan Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `${value}%`} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {planDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="text-slate-300">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Activation Trend */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-6">Monthly Activations & Revenue</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyActivations}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip formatter={(value: any) => value} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="activations" fill="#0369a1" radius={[8, 8, 0, 0]} />
                <Bar dataKey="revenue" fill="#06b6d4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Plan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-6">Revenue by Plan Type</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByPlan}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="plan" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip formatter={(value: any) => `$${value}K`} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="revenue" fill="#0284c7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-4 pb-4 border-b border-slate-700 last:border-b-0">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${item.status === 'completed' ? 'bg-green-500' : item.status === 'alert' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                  <div className="flex-grow">
                    <p className="text-white font-medium text-sm">{item.action}</p>
                    <p className="text-slate-400 text-xs">{item.customer}</p>
                    <p className="text-slate-500 text-xs mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">Q2 Performance Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-700 rounded-lg">
              <p className="text-slate-400 text-sm mb-1">Activation Rate</p>
              <p className="text-2xl font-bold text-green-400">8.2%</p>
            </div>
            <div className="p-4 bg-slate-700 rounded-lg">
              <p className="text-slate-400 text-sm mb-1">Churn Rate</p>
              <p className="text-2xl font-bold text-red-400">1.3%</p>
            </div>
            <div className="p-4 bg-slate-700 rounded-lg">
              <p className="text-slate-400 text-sm mb-1">Avg Contract Value</p>
              <p className="text-2xl font-bold text-blue-400">$2,980</p>
            </div>
            <div className="p-4 bg-slate-700 rounded-lg">
              <p className="text-slate-400 text-sm mb-1">Customer Satisfaction</p>
              <p className="text-2xl font-bold text-purple-400">4.7/5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
