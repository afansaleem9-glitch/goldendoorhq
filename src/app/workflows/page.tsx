'use client';

import { useState } from 'react';
import { useApi } from '@/lib/hooks/useApi';
import {
  Workflow, Plus, Play, Pause, Search, Clock, CheckCircle2,
  AlertTriangle, Zap, Mail, Bell, UserPlus,
  ArrowRight, GitBranch, Filter, ChevronRight, Settings, Copy, Loader,
} from 'lucide-react';

/*
 * WORKFLOW AUTOMATION UI
 * HubSpot-class workflow builder for automating:
 * - Lead nurturing sequences
 * - Deal stage automation
 * - Solar project stage triggers
 * - Task creation on events
 * - Email/SMS sending
 * - Team notifications
 *
 * Note: Workflows table exists in Supabase (from migration 003).
 * This page reads from /api/workflows — but if no API route exists yet,
 * it falls back gracefully to an empty state.
 */

interface WorkflowRecord {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  trigger_type: string;
  trigger_config: Record<string, unknown>;
  status: string;
  workflow_type: string;
  actions_count: number;
  enrolled_count: number;
  completed_count: number;
  error_count: number;
  last_run_at?: string;
  created_at: string;
  updated_at: string;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: typeof Play }> = {
  active: { label: 'Active', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: Play },
  paused: { label: 'Paused', color: 'text-amber-600', bg: 'bg-amber-50', icon: Pause },
  draft: { label: 'Draft', color: 'text-gray-500', bg: 'bg-gray-100', icon: Clock },
};

const typeConfig: Record<string, { label: string; color: string }> = {
  contact: { label: 'Contact', color: 'bg-blue-100 text-blue-700' },
  deal: { label: 'Deal', color: 'bg-violet-100 text-violet-700' },
  solar: { label: 'Solar', color: 'bg-amber-100 text-amber-700' },
  ticket: { label: 'Ticket', color: 'bg-rose-100 text-rose-700' },
};

export default function WorkflowsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', workflow_type: 'contact', trigger_type: 'event', status: 'draft' });

  const { data: workflows, loading, error, total, create } = useApi<WorkflowRecord>('/api/workflows', { limit: 100, search });

  const handleCreate = async () => {
    try { await create(form); setShowCreate(false); setForm({ name: '', description: '', workflow_type: 'contact', trigger_type: 'event', status: 'draft' }); }
    catch (e) { alert(e instanceof Error ? e.message : 'Error'); }
  };

  const filtered = workflows.filter(w => {
    if (statusFilter !== 'all' && w.status !== statusFilter) return false;
    if (typeFilter !== 'all' && w.workflow_type !== typeFilter) return false;
    return true;
  });

  const activeCount = workflows.filter(w => w.status === 'active').length;
  const totalEnrolled = workflows.reduce((s, w) => s + (w.enrolled_count || 0), 0);
  const totalCompleted = workflows.reduce((s, w) => s + (w.completed_count || 0), 0);
  const totalErrors = workflows.reduce((s, w) => s + (w.error_count || 0), 0);

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F3A] flex items-center gap-2"><Workflow className="text-[#F0A500]" /> Workflows</h1>
          <p className="text-sm text-[#9CA3AF]">Automate your sales, solar, and service processes</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Create Workflow</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard icon={Play} iconColor="text-emerald-500" iconBg="bg-emerald-50" label="Active" value={String(activeCount)} />
        <StatCard icon={UserPlus} iconColor="text-blue-500" iconBg="bg-blue-50" label="Enrolled" value={totalEnrolled.toLocaleString()} />
        <StatCard icon={CheckCircle2} iconColor="text-violet-500" iconBg="bg-violet-50" label="Completed" value={totalCompleted.toLocaleString()} />
        <StatCard icon={AlertTriangle} iconColor="text-red-500" iconBg="bg-red-50" label="Errors" value={String(totalErrors)} />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search workflows..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#F0A500]/30 focus:border-[#F0A500] outline-none" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="draft">Draft</option>
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
          <option value="all">All Types</option>
          <option value="contact">Contact</option>
          <option value="deal">Deal</option>
          <option value="solar">Solar</option>
          <option value="ticket">Ticket</option>
        </select>
      </div>

      {loading ? <div className="flex items-center justify-center py-20"><Loader className="animate-spin text-gray-400" size={32} /></div>
      : error ? <div className="text-red-500 text-sm">{error}</div>
      : filtered.length === 0 ? (
        <div className="card text-center py-20 text-gray-400">
          <Workflow size={48} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">No workflows yet</p>
          <p className="text-sm mt-1">Create your first automation to streamline operations</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(wf => {
            const sc = statusConfig[wf.status] || statusConfig.draft;
            const tc = typeConfig[wf.workflow_type] || { label: wf.workflow_type, color: 'bg-gray-100 text-gray-700' };
            const StatusIcon = sc.icon;

            return (
              <div key={wf.id} className="card hover:shadow-md transition cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-[#0B1F3A]">{wf.name}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${tc.color}`}>{tc.label}</span>
                        <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${sc.color} ${sc.bg}`}>
                          <StatusIcon className="w-3 h-3" /> {sc.label}
                        </span>
                      </div>
                      {wf.description && <p className="text-xs text-gray-500 mt-1">{wf.description}</p>}
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                        <Zap className="w-3 h-3" /> <span className="font-medium">Trigger:</span> {wf.trigger_type}
                      </div>

                      {/* Visual flow */}
                      <div className="flex items-center gap-1 mt-2">
                        <div className="flex items-center gap-0.5 text-[10px] text-gray-500 bg-gray-50 px-2 py-1 rounded">
                          <Zap className="w-3 h-3 text-amber-500" /> Trigger
                        </div>
                        {Array.from({ length: Math.min(wf.actions_count || 0, 5) }).map((_, i) => (
                          <div key={i} className="flex items-center gap-0.5">
                            <ChevronRight className="w-3 h-3 text-gray-300" />
                            <div className="flex items-center gap-0.5 text-[10px] text-gray-500 bg-gray-50 px-2 py-1 rounded">
                              {i === 0 ? <Filter className="w-3 h-3 text-blue-400" /> :
                               i === 1 ? <Mail className="w-3 h-3 text-violet-400" /> :
                               i === 2 ? <Bell className="w-3 h-3 text-amber-400" /> :
                               <GitBranch className="w-3 h-3 text-teal-400" />}
                              Action {i + 1}
                            </div>
                          </div>
                        ))}
                        {(wf.actions_count || 0) > 5 && <span className="text-[10px] text-gray-400 ml-1">+{wf.actions_count - 5} more</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div><p className="text-sm font-bold text-[#0B1F3A]">{(wf.enrolled_count || 0).toLocaleString()}</p><p className="text-[10px] text-gray-400">Enrolled</p></div>
                      <div><p className="text-sm font-bold text-emerald-600">{(wf.completed_count || 0).toLocaleString()}</p><p className="text-[10px] text-gray-400">Completed</p></div>
                      <div><p className={`text-sm font-bold ${(wf.error_count || 0) > 0 ? 'text-red-500' : 'text-gray-400'}`}>{wf.error_count || 0}</p><p className="text-[10px] text-gray-400">Errors</p></div>
                    </div>
                    <div className="flex items-center gap-1">
                      {wf.status === 'active' ? (
                        <button className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 transition" title="Pause"><Pause className="w-4 h-4" /></button>
                      ) : (
                        <button className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-500 transition" title="Activate"><Play className="w-4 h-4" /></button>
                      )}
                      <button className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 transition" title="Settings"><Settings className="w-4 h-4" /></button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 transition" title="Clone"><Copy className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>

                {wf.last_run_at && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">Last run: {new Date(wf.last_run_at).toLocaleString()}</span>
                    <button className="text-[10px] text-[#007A67] font-medium hover:underline flex items-center gap-1">
                      View execution log <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">Create Workflow</h2>
            <div className="space-y-3">
              <input placeholder="Workflow Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <select value={form.workflow_type} onChange={e => setForm({...form, workflow_type: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="contact">Contact</option>
                <option value="deal">Deal</option>
                <option value="solar">Solar</option>
                <option value="ticket">Ticket</option>
              </select>
              <select value={form.trigger_type} onChange={e => setForm({...form, trigger_type: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="event">Event-based</option>
                <option value="schedule">Scheduled</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreate} className="btn-primary text-sm">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, iconColor, iconBg, label, value }: {
  icon: typeof Play; iconColor: string; iconBg: string; label: string; value: string;
}) {
  return (
    <div className="card">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <div>
          <p className="text-xs text-[#9CA3AF]">{label}</p>
          <p className="text-xl font-bold text-[#0B1F3A]">{value}</p>
        </div>
      </div>
    </div>
  );
}
