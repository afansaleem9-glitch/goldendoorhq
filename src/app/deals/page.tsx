'use client';

import { useState, useMemo } from 'react';
import { LayoutGrid, List, Plus, Calendar, User, Building2, DollarSign } from 'lucide-react';
import { Deal, PipelineStage } from '@/lib/types';
import { deals, pipelineStages } from '@/lib/mock-data';

export default function DealsPage() {
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');

  // Group deals by stage
  const dealsByStage = useMemo(() => {
    const grouped: { [key: string]: Deal[] } = {};
    pipelineStages.forEach(stage => {
      grouped[stage.id] = deals.filter(deal => deal.stage_id === stage.id);
    });
    return grouped;
  }, []);

  // Calculate metrics
  const metrics = useMemo(() => {
    // Total pipeline value (all open deals, weighted by probability)
    const openStages = pipelineStages.filter(s => s.id !== 's6' && s.id !== 's7');
    const weightedValue = deals
      .filter(d => d.stage_id !== 's6' && d.stage_id !== 's7')
      .reduce((sum, deal) => {
        const stage = pipelineStages.find(s => s.id === deal.stage_id);
        return sum + (deal.amount * (stage?.probability || 0) / 100);
      }, 0);

    // Average deal age (in days)
    const now = new Date('2026-04-14');
    const avgAge = Math.round(
      deals.reduce((sum, deal) => {
        const created = new Date(deal.created_at);
        const daysOld = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        return sum + daysOld;
      }, 0) / deals.length
    );

    // Win rate (closed won / total closed)
    const closedDeals = deals.filter(d => d.stage_id === 's6' || d.stage_id === 's7');
    const wonDeals = deals.filter(d => d.stage_id === 's6');
    const winRate = closedDeals.length > 0 ? Math.round((wonDeals.length / closedDeals.length) * 100) : 0;

    return {
      totalPipelineValue: deals.reduce((sum, d) => sum + d.amount, 0),
      totalDeals: deals.length,
      weightedPipelineValue: weightedValue,
      avgDealAge: avgAge,
      winRate: winRate,
    };
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Deals</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-1">
                <button
                  onClick={() => setViewMode('board')}
                  className={`flex items-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'board'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <LayoutGrid size={18} />
                  Board
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List size={18} />
                  List
                </button>
              </div>
              <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                <Plus size={18} />
                Create deal
              </button>
            </div>
          </div>
        </div>

        {/* Pipeline Summary Bar */}
        <div className="border-t border-gray-200 bg-gray-50 px-8 py-4">
          <div className="flex items-center gap-8">
            <div>
              <p className="text-sm font-medium text-gray-600">Sales Pipeline</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalPipelineValue)}</p>
            </div>
            <div className="h-8 border-l border-gray-300" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Deals</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalDeals}</p>
            </div>
            <div className="h-8 border-l border-gray-300" />
            <div>
              <p className="text-sm font-medium text-gray-600">Weighted Pipeline Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.weightedPipelineValue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {viewMode === 'board' ? (
          // Board View
          <div className="overflow-x-auto">
            <div className="flex gap-6 min-w-min">
              {pipelineStages.map(stage => (
                <div
                  key={stage.id}
                  className="w-96 flex-shrink-0 rounded-lg border border-gray-200 bg-white overflow-hidden flex flex-col"
                >
                  {/* Stage Header */}
                  <div
                    className="px-4 py-3 border-b border-gray-200"
                    style={{ borderTopWidth: '4px', borderTopColor: stage.color }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {dealsByStage[stage.id].length} deals • {formatCurrency(stage.total_value)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium text-gray-600">{stage.probability}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Deal Cards */}
                  <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-400px)]">
                    {dealsByStage[stage.id].map(deal => (
                      <div
                        key={deal.id}
                        className="p-3 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <h4 className="font-medium text-gray-900 text-sm mb-2">{deal.name}</h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center gap-2 text-gray-600">
                            <DollarSign size={14} className="text-gray-400" />
                            {formatCurrency(deal.amount)}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Building2 size={14} className="text-gray-400" />
                            {deal.company}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <User size={14} className="text-gray-400" />
                            {deal.contact}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar size={14} className="text-gray-400" />
                            {new Date(deal.close_date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(deal.priority)}`}>
                            {deal.priority.charAt(0).toUpperCase() + deal.priority.slice(1)}
                          </span>
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                            {getInitials(deal.owner)}
                          </div>
                        </div>
                      </div>
                    ))}
                    {dealsByStage[stage.id].length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <p className="text-sm">No deals in this stage</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // List View
          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Deal Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Stage</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Close Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Owner</th>
                </tr>
              </thead>
              <tbody>
                {deals.map((deal, index) => {
                  const stage = pipelineStages.find(s => s.id === deal.stage_id);
                  return (
                    <tr key={deal.id} className={`border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{deal.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatCurrency(deal.amount)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{deal.company}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{deal.contact}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: stage?.color || '#ccc' }}
                        >
                          {stage?.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(deal.close_date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(deal.priority)}`}>
                          {deal.priority.charAt(0).toUpperCase() + deal.priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                            {getInitials(deal.owner)}
                          </div>
                          {deal.owner}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Metrics Bar */}
      <div className="border-t border-gray-200 bg-white">
        <div className="px-8 py-6">
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="text-sm font-medium text-gray-600">Weighted Pipeline Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(metrics.weightedPipelineValue)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Average Deal Age</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.avgDealAge} days</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Win Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.winRate}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
