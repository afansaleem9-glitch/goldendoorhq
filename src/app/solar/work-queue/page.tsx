'use client';

import { useEffect, useState } from 'react';
import { supabase, ORG_ID } from '@/lib/supabase';
import { SOLAR_STAGES } from '@/lib/types';
import {
  Check,
  UserPlus,
  ChevronRight,
  MessageSquare,
  Calendar,
  TrendingUp,
  AlertCircle,
  Clock,
  Search,
  Filter,
  PlayCircle,
  Loader2,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface WorkItem {
  id: string;
  project_id: string;
  homeowner_name: string;
  address: string;
  current_stage: string;
  days_in_stage: number;
  priority: 'High' | 'Medium' | 'Low';
  action_required: string;
  due_date: string;
  assigned_to: string;
  selected?: boolean;
}

interface StageFilter {
  id: string;
  label: string;
  stage: string;
}

export default function WorkQueuePage() {
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [batchSize, setBatchSize] = useState<number>(10);
  const [queueType, setQueueType] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [stageFilter, setStageFilter] = useState<string>('All');

  const [totalInQueue, setTotalInQueue] = useState(0);
  const [overdueItems, setOverdueItems] = useState(0);
  const [avgDaysInQueue, setAvgDaysInQueue] = useState(0);
  const [completedToday, setCompletedToday] = useState(0);

  const stageFilters: StageFilter[] = [
    { id: 'all', label: 'All Stages', stage: 'All' },
    { id: 'welcome', label: 'Welcome Calls', stage: 'welcome_call' },
    { id: 'survey', label: 'Site Surveys', stage: 'site_survey' },
    { id: 'permit', label: 'Permit Follow-ups', stage: 'permit_followup' },
    { id: 'install', label: 'Install Scheduling', stage: 'install_scheduling' },
    { id: 'inspection', label: 'Inspection Scheduling', stage: 'inspection_scheduling' },
  ];

  const queueTypeOptions = [
    { id: 'all', label: 'All' },
    { id: 'welcome', label: 'Welcome Calls' },
    { id: 'survey', label: 'Site Surveys' },
    { id: 'permit', label: 'Permit Follow-ups' },
    { id: 'install', label: 'Install Scheduling' },
    { id: 'inspection', label: 'Inspection Scheduling' },
  ];

  // Fetch work queue items
  const fetchWorkItems = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('solar_projects')
        .select('*')
        .eq('org_id', ORG_ID)
        .neq('current_stage', 'completed');

      if (queueType !== 'All') {
        const stageMap: Record<string, string> = {
          welcome: 'welcome_call',
          survey: 'site_survey',
          permit: 'permit_followup',
          install: 'install_scheduling',
          inspection: 'inspection_scheduling',
        };
        query = query.eq('current_stage', stageMap[queueType]);
      }

      const { data, error } = await query.limit(batchSize);

      if (error) throw error;

      const mapped = (data || []).map((item: any) => ({
        id: item.id,
        project_id: item.project_id,
        homeowner_name: item.homeowner_name || 'Unknown',
        address: item.address || 'No address',
        current_stage: item.current_stage || 'unknown',
        days_in_stage: item.days_in_stage || 0,
        priority: item.priority || 'Medium',
        action_required: item.action_required || 'Review needed',
        due_date: item.due_date || new Date().toISOString().split('T')[0],
        assigned_to: item.assigned_to || 'Unassigned',
      }));

      setWorkItems(mapped);

      // Calculate stats
      setTotalInQueue(mapped.length);
      const overdue = mapped.filter((item: WorkItem) => {
        const due = new Date(item.due_date);
        return due < new Date();
      }).length;
      setOverdueItems(overdue);

      const avgDays =
        mapped.length > 0
          ? Math.round(
              mapped.reduce((sum: number, item: WorkItem) => sum + item.days_in_stage, 0) /
                mapped.length
            )
          : 0;
      setAvgDaysInQueue(avgDays);
      setCompletedToday(Math.floor(Math.random() * 15)); // Placeholder
    } catch (error) {
      console.error('Error fetching work items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...workItems];

    if (priorityFilter !== 'All') {
      filtered = filtered.filter((item) => item.priority === priorityFilter);
    }

    if (stageFilter !== 'All') {
      const stageMap: Record<string, string> = {
        welcome: 'welcome_call',
        survey: 'site_survey',
        permit: 'permit_followup',
        install: 'install_scheduling',
        inspection: 'inspection_scheduling',
      };
      filtered = filtered.filter((item) => item.current_stage === stageMap[stageFilter]);
    }

    setFilteredItems(filtered);
  }, [workItems, priorityFilter, stageFilter]);

  const toggleSelection = (id: string) => {
    setWorkItems(
      workItems.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const selectedCount = workItems.filter((item) => item.selected).length;

  const handleCompleteAll = async () => {
    const selectedIds = workItems.filter((item) => item.selected).map((item) => item.id);
    if (selectedIds.length === 0) return;

    try {
      await supabase
        .from('solar_projects')
        .update({ current_stage: 'completed' })
        .in('id', selectedIds);

      setWorkItems(workItems.filter((item) => !item.selected));
    } catch (error) {
      console.error('Error completing items:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return '#DC2626';
      case 'Medium':
        return '#F59E0B';
      case 'Low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Header */}
      <div
        className="text-white py-8 px-8 mb-8"
        style={{
          background: `linear-gradient(135deg, #0B1F3A 0%, #1a3052 100%)`,
        }}
      >
        <h1 className="text-4xl font-bold">Work Queue</h1>
        <p className="text-blue-100 mt-2">Manage and prioritize your solar projects</p>
      </div>

      <div className="px-8 grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Stats Cards */}
        <div className="bg-white rounded-lg p-6 shadow-md border-l-4" style={{ borderColor: '#F0A500' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total in Queue</p>
              <p className="text-3xl font-bold mt-2" style={{ color: '#0B1F3A' }}>
                {totalInQueue}
              </p>
            </div>
            <TrendingUp size={32} style={{ color: '#F0A500' }} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Overdue Items</p>
              <p className="text-3xl font-bold mt-2 text-red-600">{overdueItems}</p>
            </div>
            <AlertCircle size={32} className="text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border-l-4" style={{ borderColor: '#007A67' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Avg Days in Queue</p>
              <p className="text-3xl font-bold mt-2" style={{ color: '#007A67' }}>
                {avgDaysInQueue}
              </p>
            </div>
            <Clock size={32} style={{ color: '#007A67' }} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border-l-4" style={{ borderColor: '#0B1F3A' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Completed Today</p>
              <p className="text-3xl font-bold mt-2" style={{ color: '#0B1F3A' }}>
                {completedToday}
              </p>
            </div>
            <Check size={32} style={{ color: '#0B1F3A' }} />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-8 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold" style={{ color: '#0B1F3A' }}>
                Batch Size
              </label>
              <select
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
                style={{ outlineColor: '#F0A500' }}
              >
                <option value={1}>1</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold" style={{ color: '#0B1F3A' }}>
                Queue Type
              </label>
              <select
                value={queueType}
                onChange={(e) => setQueueType(e.target.value)}
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
                style={{ outlineColor: '#F0A500' }}
              >
                {queueTypeOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold" style={{ color: '#0B1F3A' }}>
                Priority Filter
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
                style={{ outlineColor: '#F0A500' }}
              >
                <option value="All">All</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchWorkItems}
                disabled={loading}
                className="w-full py-2 px-6 font-bold text-white rounded-lg transition hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: '#F0A500' }}
              >
                {loading ? 'Loading...' : 'GET WORK'}
              </button>
            </div>
          </div>

          {/* Stage Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            {stageFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setStageFilter(filter.stage)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  stageFilter === filter.stage
                    ? 'text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                style={
                  stageFilter === filter.stage
                    ? { backgroundColor: '#0B1F3A' }
                    : undefined
                }
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Work Items Table */}
      {filteredItems.length > 0 && (
        <div className="px-8 mb-8">
          {/* Bulk Actions */}
          {selectedCount > 0 && (
            <div
              className="mb-4 p-4 rounded-lg text-white flex justify-between items-center"
              style={{ backgroundColor: '#007A67' }}
            >
              <span className="font-semibold">{selectedCount} items selected</span>
              <div className="flex gap-3">
                <button
                  onClick={handleCompleteAll}
                  className="px-4 py-2 bg-white text-teal-700 rounded font-medium hover:bg-gray-100"
                >
                  Complete All
                </button>
                <button className="px-4 py-2 bg-white text-teal-700 rounded font-medium hover:bg-gray-100">
                  Reassign All
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#0B1F3A' }}>
                    <th className="px-6 py-3 text-left text-white">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          const newState = e.target.checked;
                          setWorkItems(
                            workItems.map((item) => ({
                              ...item,
                              selected: newState,
                            }))
                          );
                        }}
                        checked={selectedCount === workItems.length && workItems.length > 0}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-white font-semibold">Project ID</th>
                    <th className="px-6 py-3 text-left text-white font-semibold">Homeowner</th>
                    <th className="px-6 py-3 text-left text-white font-semibold">Address</th>
                    <th className="px-6 py-3 text-left text-white font-semibold">Current Stage</th>
                    <th className="px-6 py-3 text-left text-white font-semibold">Days in Stage</th>
                    <th className="px-6 py-3 text-left text-white font-semibold">Priority</th>
                    <th className="px-6 py-3 text-left text-white font-semibold">Action Required</th>
                    <th className="px-6 py-3 text-left text-white font-semibold">Due Date</th>
                    <th className="px-6 py-3 text-left text-white font-semibold">Assigned To</th>
                    <th className="px-6 py-3 text-center text-white font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-t ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-blue-50 transition`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={item.selected || false}
                          onChange={() => toggleSelection(item.id)}
                        />
                      </td>
                      <td className="px-6 py-4 font-mono text-sm" style={{ color: '#0B1F3A' }}>
                        {item.project_id}
                      </td>
                      <td className="px-6 py-4 font-medium" style={{ color: '#0B1F3A' }}>
                        {item.homeowner_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.address}</td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                          style={{ backgroundColor: '#E8F3F1', color: '#007A67' }}
                        >
                          {item.current_stage.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold" style={{ color: '#0B1F3A' }}>
                        {item.days_in_stage}d
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                            item.priority
                          )}`}
                        >
                          {item.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.action_required}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.due_date}</td>
                      <td className="px-6 py-4 text-sm font-medium" style={{ color: '#0B1F3A' }}>
                        {item.assigned_to}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            className="p-2 hover:rounded-full transition"
                            style={{
                              color: '#007A67',
                              backgroundColor: '#E8F3F1',
                              padding: '8px',
                              borderRadius: '6px',
                            }}
                            title="Complete"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            className="p-2 hover:rounded-full transition"
                            style={{
                              color: '#F0A500',
                              backgroundColor: '#FEF3E2',
                              padding: '8px',
                              borderRadius: '6px',
                            }}
                            title="Reassign"
                          >
                            <UserPlus size={18} />
                          </button>
                          <button
                            className="p-2 hover:rounded-full transition"
                            style={{
                              color: '#0B1F3A',
                              backgroundColor: '#E8EFF7',
                              padding: '8px',
                              borderRadius: '6px',
                            }}
                            title="Skip"
                          >
                            <ChevronRight size={18} />
                          </button>
                          <button
                            className="p-2 hover:rounded-full transition"
                            style={{
                              color: '#007A67',
                              backgroundColor: '#E8F3F1',
                              padding: '8px',
                              borderRadius: '6px',
                            }}
                            title="Add Note"
                          >
                            <MessageSquare size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {workItems.length === 0 && !loading && (
        <div className="px-8 mb-8">
          <div className="bg-white rounded-lg p-12 text-center shadow-md">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No work items found. Click "GET WORK" to load items.</p>
          </div>
        </div>
      )}
    </div>
  );
}
