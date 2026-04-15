'use client';

import { useState } from 'react';
import { supabase, ORG_ID } from '@/lib/supabase';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  ChevronDown,
  Download,
} from 'lucide-react';

const CommissionsPage = () => {
  const [activeTab, setActiveTab] = useState('statements');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock data
  const statements = [
    {
      id: 'STMT-001',
      payDate: '2024-12-15',
      gross: 8500,
      deductions: 1200,
      net: 7300,
      status: 'paid',
    },
    {
      id: 'STMT-002',
      payDate: '2024-11-15',
      gross: 7200,
      deductions: 1000,
      net: 6200,
      status: 'paid',
    },
    {
      id: 'STMT-003',
      payDate: '2024-10-15',
      gross: 9100,
      deductions: 1400,
      net: 7700,
      status: 'paid',
    },
    {
      id: 'STMT-004',
      payDate: '2025-01-15',
      gross: 6800,
      deductions: 950,
      net: 5850,
      status: 'pending',
    },
    {
      id: 'STMT-005',
      payDate: '2025-02-15',
      gross: 7500,
      deductions: 1050,
      net: 6450,
      status: 'processing',
    },
  ];

  const monthlyData = [
    { month: 'Jan', earned: 6800, paid: 6800 },
    { month: 'Feb', earned: 7500, paid: 0 },
    { month: 'Mar', earned: 8200, paid: 0 },
    { month: 'Apr', earned: 7100, paid: 7100 },
    { month: 'May', earned: 8900, paid: 8900 },
    { month: 'Jun', earned: 9400, paid: 9400 },
    { month: 'Jul', earned: 8100, paid: 8100 },
    { month: 'Aug', earned: 8600, paid: 8600 },
    { month: 'Sep', earned: 7800, paid: 7800 },
    { month: 'Oct', earned: 9100, paid: 9100 },
    { month: 'Nov', earned: 7200, paid: 7200 },
    { month: 'Dec', earned: 8500, paid: 8500 },
  ];

  const trendData = [
    { month: 'Jan', commission: 6800 },
    { month: 'Feb', commission: 7500 },
    { month: 'Mar', commission: 8200 },
    { month: 'Apr', commission: 7100 },
    { month: 'May', commission: 8900 },
    { month: 'Jun', commission: 9400 },
    { month: 'Jul', commission: 8100 },
    { month: 'Aug', commission: 8600 },
    { month: 'Sep', commission: 7800 },
    { month: 'Oct', commission: 9100 },
    { month: 'Nov', commission: 7200 },
    { month: 'Dec', commission: 8500 },
  ];

  const commissionPlan = {
    baseRate: 18,
    kickerRate: 22,
    bonusThreshold: 10,
    tiers: [
      { range: '0-2 kW', rate: '16%', deals: 0 },
      { range: '2-4 kW', rate: '18%', deals: 3 },
      { range: '4-6 kW', rate: '20%', deals: 6 },
      { range: '6-8 kW', rate: '22%', deals: 10 },
      { range: '8+ kW', rate: '25%', deals: 15 },
    ],
  };

  const filteredStatements = statements.filter((s) => {
    if (selectedStatus !== 'all' && s.status !== selectedStatus) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B1F3A] to-[#1a3554] text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Commission Tracking</h1>
              <p className="text-gray-300 mt-2">Manage and track your commission statements and plans</p>
            </div>
            <button className="flex items-center gap-2 bg-[#F0A500] hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition">
              <Download size={20} />
              Export Statement
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-300 mb-8">
          {['statements', 'summary', 'plan'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium text-lg transition relative ${
                activeTab === tab ? 'text-[#0B1F3A]' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab === 'statements' && 'STATEMENTS'}
              {tab === 'summary' && 'SUMMARY'}
              {tab === 'plan' && 'PLAN MANAGEMENT'}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#F0A500]"></div>
              )}
            </button>
          ))}
        </div>

        {/* STATEMENTS TAB */}
        {activeTab === 'statements' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0A500]"
                >
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0A500]"
                >
                  <option value="all">All</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                </select>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Earned</p>
                    <p className="text-2xl font-bold text-[#0B1F3A] mt-2">$127,400</p>
                  </div>
                  <DollarSign className="text-[#F0A500]" size={40} />
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-2">$29,200</p>
                  </div>
                  <Clock className="text-yellow-500" size={40} />
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Paid</p>
                    <p className="text-2xl font-bold text-green-600 mt-2">$98,200</p>
                  </div>
                  <CheckCircle className="text-green-500" size={40} />
                </div>
              </div>
            </div>

            {/* Statements Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Statement ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Pay Date</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Gross</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Deductions</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Net</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStatements.map((stmt, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-[#0B1F3A]">{stmt.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{stmt.payDate}</td>
                      <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">${stmt.gross.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-right text-gray-600">${stmt.deductions.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-right font-semibold text-[#0B1F3A]">${stmt.net.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(stmt.status)}`}>
                          {getStatusLabel(stmt.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUMMARY TAB */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider">Total Earned YTD</p>
                <p className="text-3xl font-bold text-[#0B1F3A] mt-3">$127,400</p>
                <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                  <TrendingUp size={16} />
                  <span>+12% vs last year</span>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider">Total Paid</p>
                <p className="text-3xl font-bold text-green-600 mt-3">$98,200</p>
                <div className="flex items-center gap-1 mt-2 text-gray-600 text-sm">
                  <CheckCircle size={16} />
                  <span>77% of earned</span>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 mt-3">$29,200</p>
                <div className="flex items-center gap-1 mt-2 text-yellow-600 text-sm">
                  <Clock size={16} />
                  <span>23% of earned</span>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider">Avg Per Deal</p>
                <p className="text-3xl font-bold text-[#7C5CBF] mt-3">$4,247</p>
                <div className="flex items-center gap-1 mt-2 text-gray-600 text-sm">
                  <span>30 deals closed</span>
                </div>
              </div>
            </div>

            {/* Monthly Breakdown Table */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[#0B1F3A] mb-4">Monthly Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Month</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">Earned</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">Paid</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">Pending</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData.map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{row.month}</td>
                        <td className="text-right py-3 px-4 text-gray-600">${row.earned.toLocaleString()}</td>
                        <td className="text-right py-3 px-4 font-medium text-green-600">${row.paid.toLocaleString()}</td>
                        <td className="text-right py-3 px-4 text-yellow-600">${(row.earned - row.paid).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Commission Trend Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[#0B1F3A] mb-4">Commission Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px' }}
                    formatter={(value: any) => `$${Number(value || 0).toLocaleString()}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="commission"
                    stroke="#F0A500"
                    strokeWidth={3}
                    dot={{ fill: '#F0A500', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* PLAN MANAGEMENT TAB */}
        {activeTab === 'plan' && (
          <div className="space-y-6">
            {/* Commission Plan Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-[#0B1F3A] mb-6">Your Commission Plan</h3>

              <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-[#F0A500] to-yellow-600 rounded-lg p-6 text-white">
                  <p className="text-sm font-medium opacity-90">Base Rate</p>
                  <p className="text-4xl font-bold mt-2">{commissionPlan.baseRate}%</p>
                </div>

                <div className="bg-gradient-to-br from-[#007A67] to-teal-700 rounded-lg p-6 text-white">
                  <p className="text-sm font-medium opacity-90">Kicker Rate</p>
                  <p className="text-4xl font-bold mt-2">{commissionPlan.kickerRate}%</p>
                </div>

                <div className="bg-gradient-to-br from-[#7C5CBF] to-purple-700 rounded-lg p-6 text-white">
                  <p className="text-sm font-medium opacity-90">Bonus Threshold</p>
                  <p className="text-3xl font-bold mt-2">{commissionPlan.bonusThreshold} deals</p>
                </div>

                <div className="bg-gradient-to-br from-[#0B1F3A] to-slate-800 rounded-lg p-6 text-white">
                  <p className="text-sm font-medium opacity-90">Status</p>
                  <p className="text-xl font-bold mt-2">Active</p>
                </div>
              </div>

              {/* Tier Progression Visual */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-[#0B1F3A] mb-4">Tier Progression</h4>
                <div className="space-y-3">
                  {commissionPlan.tiers.map((tier, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-32 text-sm font-medium text-gray-700">{tier.range}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#F0A500] to-[#007A67] h-full rounded-full flex items-center justify-center"
                          style={{ width: `${(idx + 1) * 20}%` }}
                        >
                          {idx >= 2 && <span className="text-xs font-bold text-white">{tier.rate}</span>}
                        </div>
                      </div>
                      <div className="w-16 text-right">
                        <p className="text-sm font-bold text-[#0B1F3A]">{tier.rate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rate Card Table */}
              <div>
                <h4 className="text-lg font-semibold text-[#0B1F3A] mb-4">Rate Card</h4>
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">System Size Range</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">Commission Rate</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">Deals Required</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commissionPlan.tiers.map((tier, idx) => (
                      <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-4 px-4 font-medium text-gray-900">{tier.range}</td>
                        <td className="text-center py-4 px-4">
                          <span className="inline-block bg-[#F0A500] text-white px-3 py-1 rounded font-bold text-sm">
                            {tier.rate}
                          </span>
                        </td>
                        <td className="text-right py-4 px-4 text-gray-600">{tier.deals}+</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Plan Details */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-[#0B1F3A] mb-3">Plan Details</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Base commission applies to all system sizes</li>
                <li>• Kicker rate activates at {commissionPlan.bonusThreshold}+ deals per month</li>
                <li>• Tier progression provides increasing rates as system size increases</li>
                <li>• Commission calculated on system gross price, less customer discount</li>
                <li>• Payments processed monthly within 15 days of period end</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommissionsPage;
