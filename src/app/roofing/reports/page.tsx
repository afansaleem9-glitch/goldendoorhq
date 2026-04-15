'use client';

import { useState, useEffect } from 'react';
import {
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
import {
  TrendingUp,
  Users,
  Percent,
  DollarSign,
  Zap,
  Clock,
  BarChart3,
  Target,
  PieChart as PieChartIcon,
  Wrench,
  FileText,
  Database,
  ChevronRight,
} from 'lucide-react';

// Mock data for demonstration
const revenueData = [
  { month: 'Jan', revenue: 45000 },
  { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 48000 },
  { month: 'Apr', revenue: 61000 },
  { month: 'May', revenue: 55000 },
  { month: 'Jun', revenue: 67000 },
  { month: 'Jul', revenue: 72000 },
  { month: 'Aug', revenue: 68000 },
  { month: 'Sep', revenue: 59000 },
  { month: 'Oct', revenue: 73000 },
  { month: 'Nov', revenue: 79000 },
  { month: 'Dec', revenue: 85000 },
];

const salesPipeline = [
  { stage: 'Leads', count: 124, rate: '100%' },
  { stage: 'Inspections', count: 89, rate: '71.8%' },
  { stage: 'Estimates', count: 67, rate: '75.3%' },
  { stage: 'Contracts', count: 52, rate: '77.6%' },
  { stage: 'Jobs', count: 48, rate: '92.3%' },
];

const repPerformance = [
  { name: 'John Smith', leads: 28, inspections: 22, estimates: 18, closed: 14, revenue: 156800, closeRate: '50%', avgDeal: 11200 },
  { name: 'Sarah Johnson', leads: 26, inspections: 21, estimates: 19, closed: 16, revenue: 182400, closeRate: '61.5%', avgDeal: 11400 },
  { name: 'Mike Rodriguez', leads: 24, inspections: 18, estimates: 15, closed: 12, revenue: 138600, closeRate: '50%', avgDeal: 11550 },
  { name: 'Emily Chen', leads: 22, inspections: 17, estimates: 14, closed: 11, revenue: 127050, closeRate: '50%', avgDeal: 11550 },
  { name: 'David Martinez', leads: 20, inspections: 14, estimates: 11, closed: 8, revenue: 92000, closeRate: '40%', avgDeal: 11500 },
  { name: 'Jessica Thompson', leads: 19, inspections: 13, estimates: 10, closed: 7, revenue: 79450, closeRate: '36.8%', avgDeal: 11350 },
];

const jobStatusData = [
  { name: 'In Progress', value: 34, color: '#007A67' },
  { name: 'Completed', value: 127, color: '#0B1F3A' },
  { name: 'Pending Start', value: 18, color: '#F0A500' },
  { name: 'On Hold', value: 6, color: '#E67E22' },
  { name: 'Warranty', value: 12, color: '#3498DB' },
];

const preBuiltReports = [
  { icon: TrendingUp, title: 'Sales Pipeline', description: 'View lead flow and conversion metrics' },
  { icon: Users, title: 'Revenue by Rep', description: 'Individual rep performance and targets' },
  { icon: DollarSign, title: 'Job Profitability', description: 'Margin analysis by project and size' },
  { icon: Target, title: 'Lead Source ROI', description: 'Campaign effectiveness and ROI breakdown' },
  { icon: Wrench, title: 'Material Costs', description: 'Cost analysis by material type and job' },
  { icon: FileText, title: 'Insurance Claims', description: 'Insurance-related invoices and claims' },
  { icon: Zap, title: 'Customer Satisfaction', description: 'Survey results and NPS tracking' },
  { icon: Clock, title: 'Crew Productivity', description: 'Crew utilization and efficiency metrics' },
];

export default function ReportsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const kpis = [
    { label: 'Revenue MTD', value: '$287,500', icon: DollarSign, change: '+12.5%' },
    { label: 'Jobs Completed', value: '23', icon: Zap, change: '+8' },
    { label: 'Close Rate', value: '52.4%', icon: Percent, change: '+3.1%' },
    { label: 'Avg Job Value', value: '$12,500', icon: TrendingUp, change: '+$850' },
    { label: 'Profit Margin', value: '28.3%', icon: BarChart3, change: '+1.2%' },
    { label: 'Lead-to-Close', value: '18 days', icon: Clock, change: '-2 days' },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">ReportsPlus Analytics</h1>
          <p className="text-slate-600 mt-2">Enterprise-grade insights for your roofing business</p>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.label}
                className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-l-[#F0A500] hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{kpi.label}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">{kpi.value}</p>
                    <p className="text-xs text-green-600 mt-2">{kpi.change}</p>
                  </div>
                  <Icon className="w-8 h-8 text-[#007A67] opacity-50" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-[#007A67]" />
            Revenue Trend - Last 12 Months
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0B1F3A',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="revenue" fill="#0B1F3A" radius={[8, 8, 0, 0]} />
              <Bar dataKey="revenue" fill="#F0A500" opacity={0.3} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sales Pipeline Funnel */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
            <Target className="w-5 h-5 mr-2 text-[#007A67]" />
            Sales Pipeline Funnel
          </h2>
          <div className="space-y-4">
            {salesPipeline.map((stage, index) => {
              const percentWidth = (stage.count / 124) * 100;
              return (
                <div key={stage.stage}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-slate-700">{stage.stage}</span>
                    <span className="text-sm text-slate-600">
                      {stage.count} leads • {stage.rate} conversion
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-8 overflow-hidden">
                    <div
                      className={`h-full flex items-center justify-end pr-3 text-white text-sm font-medium transition-all duration-500`}
                      style={{
                        width: `${percentWidth}%`,
                        backgroundColor: index === 0 ? '#0B1F3A' : index % 2 === 0 ? '#F0A500' : '#007A67',
                      }}
                    >
                      {stage.count}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rep Performance Table */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
            <Users className="w-5 h-5 mr-2 text-[#007A67]" />
            Sales Rep Performance (Ranked)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Rep Name</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700">Leads</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700">Inspections</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700">Estimates</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700">Closed</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">Revenue</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700">Close Rate</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">Avg Deal</th>
                </tr>
              </thead>
              <tbody>
                {repPerformance.map((rep, index) => (
                  <tr key={rep.name} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <span className="inline-block w-6 h-6 rounded-full bg-[#007A67] text-white text-xs flex items-center justify-center mr-2">
                        {index + 1}
                      </span>
                      {rep.name}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-700">{rep.leads}</td>
                    <td className="px-4 py-3 text-center text-slate-700">{rep.inspections}</td>
                    <td className="px-4 py-3 text-center text-slate-700">{rep.estimates}</td>
                    <td className="px-4 py-3 text-center text-slate-700 font-semibold text-[#007A67]">{rep.closed}</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900">${(rep.revenue / 1000).toFixed(0)}K</td>
                    <td className="px-4 py-3 text-center text-slate-700">{rep.closeRate}</td>
                    <td className="px-4 py-3 text-right text-slate-700">${(rep.avgDeal / 1000).toFixed(1)}K</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Job Status Breakdown */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
            <PieChartIcon className="w-5 h-5 mr-2 text-[#007A67]" />
            Job Status Breakdown
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={jobStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {jobStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {jobStatusData.map((status) => (
                <div key={status.name} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: status.color }} />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{status.name}</p>
                    <p className="text-xs text-slate-600">{status.value} jobs</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Production Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-t-4 border-t-[#007A67]">
            <p className="text-sm font-medium text-slate-600 mb-2">Avg Days to Complete</p>
            <p className="text-3xl font-bold text-slate-900">8.2</p>
            <p className="text-xs text-slate-500 mt-3">Target: 7 days</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border-t-4 border-t-[#F0A500]">
            <p className="text-sm font-medium text-slate-600 mb-2">Crews Utilized</p>
            <p className="text-3xl font-bold text-slate-900">14/16</p>
            <p className="text-xs text-slate-500 mt-3">87.5% utilization</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border-t-4 border-t-[#007A67]">
            <p className="text-sm font-medium text-slate-600 mb-2">Material Cost Ratio</p>
            <p className="text-3xl font-bold text-slate-900">38%</p>
            <p className="text-xs text-slate-500 mt-3">Target: 35-40%</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border-t-4 border-t-[#F0A500]">
            <p className="text-sm font-medium text-slate-600 mb-2">Labor Cost Ratio</p>
            <p className="text-3xl font-bold text-slate-900">42%</p>
            <p className="text-xs text-slate-500 mt-3">Target: 40-45%</p>
          </div>
        </div>

        {/* Pre-built Report Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-[#007A67]" />
            Pre-built Reports
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {preBuiltReports.map((report) => {
              const Icon = report.icon;
              return (
                <div
                  key={report.title}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all hover:border-[#007A67] border border-transparent cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Icon className="w-8 h-8 text-[#007A67] group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{report.title}</h3>
                  <p className="text-sm text-slate-600 mb-4">{report.description}</p>
                  <button className="inline-flex items-center text-sm font-medium text-[#007A67] hover:text-[#005a52] group/btn">
                    Run Report
                    <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* DataMart Custom Query Builder */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
            <Database className="w-5 h-5 mr-2 text-[#007A67]" />
            DataMart - Custom Query Builder
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Fields</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#007A67] focus:border-transparent">
                <option>Revenue</option>
                <option>Jobs Completed</option>
                <option>Customer Satisfaction</option>
                <option>Lead Source</option>
                <option>Material Costs</option>
                <option>Labor Costs</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date Range</label>
              <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#007A67] focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Filter By</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#007A67] focus:border-transparent">
                <option>All Reps</option>
                <option>Top Performers</option>
                <option>By Location</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button className="px-4 py-2 bg-[#007A67] text-white rounded-lg hover:bg-[#005a52] transition-colors font-medium">
              Run Query
            </button>
            <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
              Export to CSV
            </button>
            <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
              Schedule Report
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Create custom reports by selecting fields, setting date ranges, and applying filters. Export results as CSV or schedule automated delivery.
          </p>
        </div>
      </div>
    </div>
  );
}
