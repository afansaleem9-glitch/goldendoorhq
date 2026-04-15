'use client';

import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, TrendingUp, Zap, DollarSign, Award } from 'lucide-react';

// Mock data
const mockReps = [
  {
    id: 1,
    name: 'Marcus Johnson',
    channel: 'D2D',
    group: 'Team Alpha',
    state: 'TX',
    financeCompany: 'GoodLeap',
    appointmentsSet: 45,
    showRate: 87,
    qualifiedRate: 72,
    dealsFromSets: 32,
    kwFromSets: 156,
    dealsClosed: 32,
    kwSold: 156,
    revenueGenerated: 234000,
    closeRate: 94,
    avgDealSize: 7312,
    commissionEarned: 18720,
  },
  {
    id: 2,
    name: 'Sarah Chen',
    channel: 'Retail',
    group: 'Team Beta',
    state: 'OH',
    financeCompany: 'Mosaic',
    appointmentsSet: 52,
    showRate: 92,
    qualifiedRate: 78,
    dealsFromSets: 40,
    kwFromSets: 198,
    dealsClosed: 40,
    kwSold: 198,
    revenueGenerated: 286000,
    closeRate: 96,
    avgDealSize: 7150,
    commissionEarned: 22880,
  },
  {
    id: 3,
    name: 'David Park',
    channel: 'D2D',
    group: 'Team Alpha',
    state: 'MI',
    financeCompany: 'Sunrun PPA',
    appointmentsSet: 38,
    showRate: 84,
    qualifiedRate: 68,
    dealsFromSets: 25,
    kwFromSets: 128,
    dealsClosed: 25,
    kwSold: 128,
    revenueGenerated: 198400,
    closeRate: 91,
    avgDealSize: 7936,
    commissionEarned: 15872,
  },
  {
    id: 4,
    name: 'James Wright',
    channel: 'Referral',
    group: 'Team Alpha',
    state: 'TX',
    financeCompany: 'Cash',
    appointmentsSet: 28,
    showRate: 79,
    qualifiedRate: 64,
    dealsFromSets: 17,
    kwFromSets: 94,
    dealsClosed: 17,
    kwSold: 94,
    revenueGenerated: 142800,
    closeRate: 88,
    avgDealSize: 8400,
    commissionEarned: 11424,
  },
  {
    id: 5,
    name: 'Emily Rodriguez',
    channel: 'Retail',
    group: 'Team Beta',
    state: 'OH',
    financeCompany: 'Enfin',
    appointmentsSet: 42,
    showRate: 88,
    qualifiedRate: 74,
    dealsFromSets: 31,
    kwFromSets: 155,
    dealsClosed: 31,
    kwSold: 155,
    revenueGenerated: 221500,
    closeRate: 93,
    avgDealSize: 7145,
    commissionEarned: 17720,
  },
  {
    id: 6,
    name: 'Tyler Brooks',
    channel: 'D2D',
    group: 'Team Beta',
    state: 'TX',
    financeCompany: 'GoodLeap',
    appointmentsSet: 35,
    showRate: 82,
    qualifiedRate: 66,
    dealsFromSets: 23,
    kwFromSets: 118,
    dealsClosed: 23,
    kwSold: 118,
    revenueGenerated: 175600,
    closeRate: 89,
    avgDealSize: 7635,
    commissionEarned: 14048,
  },
  {
    id: 7,
    name: 'Priya Patel',
    channel: 'Referral',
    group: 'Team Beta',
    state: 'MI',
    financeCompany: 'Credit Human',
    appointmentsSet: 48,
    showRate: 90,
    qualifiedRate: 76,
    dealsFromSets: 36,
    kwFromSets: 184,
    dealsClosed: 36,
    kwSold: 184,
    revenueGenerated: 260400,
    closeRate: 95,
    avgDealSize: 7233,
    commissionEarned: 20832,
  },
  {
    id: 8,
    name: 'Mike Torres',
    channel: 'Retail',
    group: 'Team Alpha',
    state: 'OH',
    financeCompany: 'Mosaic',
    appointmentsSet: 40,
    showRate: 85,
    qualifiedRate: 70,
    dealsFromSets: 28,
    kwFromSets: 142,
    dealsClosed: 28,
    kwSold: 142,
    revenueGenerated: 203600,
    closeRate: 92,
    avgDealSize: 7271,
    commissionEarned: 16288,
  },
];

export default function SolarScoreboard() {
  // Filters
  const [channel, setChannel] = useState('All');
  const [group, setGroup] = useState('All Teams');
  const [period, setPeriod] = useState('This Month');
  const [unit, setUnit] = useState('Deals');
  const [state, setState] = useState('All States');
  const [financeCompany, setFinanceCompany] = useState('All');

  // Filter data
  const filteredReps = useMemo(() => {
    return mockReps.filter((rep) => {
      const channelMatch = channel === 'All' || rep.channel === channel;
      const groupMatch = group === 'All Teams' || rep.group === group;
      const stateMatch = state === 'All States' || rep.state === state;
      const financeMatch = financeCompany === 'All' || rep.financeCompany === financeCompany;
      return channelMatch && groupMatch && stateMatch && financeMatch;
    });
  }, [channel, group, state, financeCompany]);

  // Sort by unit
  const sortedReps = useMemo(() => {
    const sorted = [...filteredReps];
    sorted.sort((a, b) => {
      switch (unit) {
        case 'kW':
          return b.kwSold - a.kwSold;
        case 'Revenue':
          return b.revenueGenerated - a.revenueGenerated;
        case 'Deals':
        default:
          return b.dealsClosed - a.dealsClosed;
      }
    });
    return sorted;
  }, [filteredReps, unit]);

  // Top performers
  const topClosers = sortedReps.slice(0, 3);

  // Chart data
  const chartData = sortedReps.slice(0, 10).map((rep) => ({
    name: rep.name.split(' ')[0],
    value:
      unit === 'kW'
        ? rep.kwSold
        : unit === 'Revenue'
          ? rep.revenueGenerated / 1000
          : rep.dealsClosed,
  }));

  // Quick stats
  const quickStats = {
    totalKw: filteredReps.reduce((sum, rep) => sum + rep.kwSold, 0),
    totalRevenue: filteredReps.reduce((sum, rep) => sum + rep.revenueGenerated, 0),
    totalDeals: filteredReps.reduce((sum, rep) => sum + rep.dealsClosed, 0),
    avgSystemSize: filteredReps.length
      ? filteredReps.reduce((sum, rep) => sum + rep.avgDealSize, 0) / filteredReps.length
      : 0,
  };

  const medalColors = {
    gold: '#F0A500',
    silver: '#C0C0C0',
    bronze: '#CD7F32',
  };

  const getMedalIcon = (position: number) => {
    if (position === 0) return '🥇';
    if (position === 1) return '🥈';
    if (position === 2) return '🥉';
    return '⭐';
  };

  const getMedalBgColor = (position: number) => {
    if (position === 0) return 'from-yellow-100 to-yellow-50 border-yellow-300';
    if (position === 1) return 'from-slate-100 to-slate-50 border-slate-300';
    if (position === 2) return 'from-orange-100 to-orange-50 border-orange-300';
    return 'from-blue-100 to-blue-50 border-blue-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-800 border-b border-yellow-600/30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg">
                <Zap className="w-8 h-8 text-slate-900" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-1">Solar Sales Scoreboard</h1>
                <p className="text-yellow-400 font-semibold">Freedom Forever Style</p>
              </div>
            </div>
            <TrendingUp className="w-12 h-12 text-yellow-500 opacity-60" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Filter Bar */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-6 shadow-xl border border-slate-600/50 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Channel Filter */}
            <div>
              <label className="block text-sm font-semibold text-yellow-400 mb-2">Channel</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
              >
                <option>All</option>
                <option>D2D</option>
                <option>Retail</option>
                <option>Referral</option>
              </select>
            </div>

            {/* Group Filter */}
            <div>
              <label className="block text-sm font-semibold text-yellow-400 mb-2">Group</label>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
              >
                <option>All Teams</option>
                <option>Team Alpha</option>
                <option>Team Beta</option>
              </select>
            </div>

            {/* Period Filter */}
            <div>
              <label className="block text-sm font-semibold text-yellow-400 mb-2">Period</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
              >
                <option>This Week</option>
                <option>This Month</option>
                <option>This Quarter</option>
                <option>YTD</option>
                <option>Custom</option>
              </select>
            </div>

            {/* Unit Filter */}
            <div>
              <label className="block text-sm font-semibold text-yellow-400 mb-2">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
              >
                <option>Deals</option>
                <option>kW</option>
                <option>Revenue</option>
              </select>
            </div>

            {/* State Filter */}
            <div>
              <label className="block text-sm font-semibold text-yellow-400 mb-2">State</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
              >
                <option>All States</option>
                <option>TX</option>
                <option>OH</option>
                <option>MI</option>
              </select>
            </div>

            {/* Finance Company Filter */}
            <div>
              <label className="block text-sm font-semibold text-yellow-400 mb-2">Finance Co.</label>
              <select
                value={financeCompany}
                onChange={(e) => setFinanceCompany(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
              >
                <option>All</option>
                <option>GoodLeap</option>
                <option>Mosaic</option>
                <option>Sunrun PPA</option>
                <option>Cash</option>
                <option>Enfin</option>
                <option>Credit Human</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-6 border border-blue-700/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-semibold mb-1">Total kW Sold</p>
                <p className="text-3xl font-bold text-white">{quickStats.totalKw.toLocaleString()}</p>
              </div>
              <Zap className="w-10 h-10 text-yellow-500 opacity-60" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-900 to-teal-800 rounded-lg p-6 border border-teal-700/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-300 text-sm font-semibold mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-white">${(quickStats.totalRevenue / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}K</p>
              </div>
              <DollarSign className="w-10 h-10 text-yellow-500 opacity-60" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-6 border border-purple-700/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-semibold mb-1">Total Deals</p>
                <p className="text-3xl font-bold text-white">{quickStats.totalDeals.toLocaleString()}</p>
              </div>
              <Award className="w-10 h-10 text-yellow-500 opacity-60" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-6 border border-slate-700/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm font-semibold mb-1">Avg System Size</p>
                <p className="text-3xl font-bold text-white">${quickStats.avgSystemSize.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-yellow-500 opacity-60" />
            </div>
          </div>
        </div>

        {/* Top Performers Cards */}
        {topClosers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topClosers.map((rep, index) => (
              <div
                key={rep.id}
                className={`bg-gradient-to-br ${getMedalBgColor(index)} rounded-lg p-6 border-2 shadow-xl transform hover:scale-105 transition-transform`}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{getMedalIcon(index)}</div>
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full border-4 border-white/50 flex items-center justify-center">
                    <span className="text-3xl font-bold text-slate-900">{rep.name.charAt(0)}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{rep.name}</h3>
                  <div className="space-y-1 mb-4">
                    <p className="text-sm font-semibold text-slate-700">
                      {unit === 'kW' ? `${rep.kwSold.toLocaleString()} kW` : unit === 'Revenue' ? `$${(rep.revenueGenerated / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}K` : `${rep.dealsClosed} Deals`}
                    </p>
                    <p className="text-xs text-slate-600">
                      {rep.channel} • {rep.state}
                    </p>
                  </div>
                  <div className="bg-white/40 rounded px-3 py-1 inline-block">
                    <p className="text-xs font-bold text-slate-900">
                      {unit === 'Revenue'
                        ? `${rep.closeRate}% Close Rate`
                        : unit === 'kW'
                          ? `${rep.avgDealSize.toLocaleString()}/Deal`
                          : `${rep.closeRate}% Close Rate`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Leaderboard Chart */}
        {chartData.length > 0 && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 shadow-xl border border-slate-600/50">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-yellow-500" />
              Top 10 Reps by {unit}
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis
                  dataKey="name"
                  stroke="#cbd5e1"
                  style={{ fontSize: '12px', fontWeight: '500' }}
                />
                <YAxis stroke="#cbd5e1" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '2px solid #f0a500',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value: any) =>
                    unit === 'Revenue'
                      ? `$${Number(value||0).toLocaleString(undefined, { maximumFractionDigits: 0 })}K`
                      : unit === 'kW'
                        ? `${Number(value||0).toLocaleString()} kW`
                        : `${value} Deals`
                  }
                />
                <Bar
                  dataKey="value"
                  fill="#F0A500"
                  radius={[8, 8, 0, 0]}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Setters Table */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg shadow-xl border border-slate-600/50 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-950 to-slate-900 px-6 py-4 border-b border-yellow-600/30">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              SETTERS
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-700/50 border-b border-slate-600">
                  <th className="px-6 py-3 text-left text-xs font-bold text-yellow-400">RANK</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-yellow-400">NAME</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-yellow-400">APPOINTMENTS SET</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-yellow-400">SHOW RATE %</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-yellow-400">QUALIFIED %</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-yellow-400">DEALS FROM SETS</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-yellow-400">kW FROM SETS</th>
                </tr>
              </thead>
              <tbody>
                {sortedReps.map((rep, index) => (
                  <tr
                    key={rep.id}
                    className="border-b border-slate-600/30 hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-bold text-yellow-500">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-white">{rep.name}</td>
                    <td className="px-6 py-4 text-sm text-center text-blue-300 font-semibold">{rep.appointmentsSet}</td>
                    <td className="px-6 py-4 text-sm text-center text-teal-300 font-semibold">{rep.showRate}%</td>
                    <td className="px-6 py-4 text-sm text-center text-purple-300 font-semibold">{rep.qualifiedRate}%</td>
                    <td className="px-6 py-4 text-sm text-center text-green-300 font-semibold">{rep.dealsFromSets}</td>
                    <td className="px-6 py-4 text-sm text-center text-cyan-300 font-semibold">{rep.kwFromSets}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Closers Table */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg shadow-xl border border-slate-600/50 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-950 to-slate-900 px-6 py-4 border-b border-yellow-600/30">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              CLOSERS
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-700/50 border-b border-slate-600">
                  <th className="px-6 py-3 text-left text-xs font-bold text-yellow-400">RANK</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-yellow-400">NAME</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-yellow-400">DEALS CLOSED</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-yellow-400">kW SOLD</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-yellow-400">REVENUE</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-yellow-400">CLOSE RATE %</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-yellow-400">AVG DEAL SIZE</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-yellow-400">COMMISSION</th>
                </tr>
              </thead>
              <tbody>
                {sortedReps.map((rep, index) => (
                  <tr
                    key={rep.id}
                    className="border-b border-slate-600/30 hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-bold text-yellow-500">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-white">{rep.name}</td>
                    <td className="px-6 py-4 text-sm text-center text-blue-300 font-semibold">{rep.dealsClosed}</td>
                    <td className="px-6 py-4 text-sm text-center text-teal-300 font-semibold">{rep.kwSold}</td>
                    <td className="px-6 py-4 text-sm text-center text-green-300 font-semibold">
                      ${(rep.revenueGenerated / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}K
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-purple-300 font-semibold">{rep.closeRate}%</td>
                    <td className="px-6 py-4 text-sm text-center text-yellow-300 font-semibold">
                      ${rep.avgDealSize.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-cyan-300 font-semibold">
                      ${rep.commissionEarned.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
