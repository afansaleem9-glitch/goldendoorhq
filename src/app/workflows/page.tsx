'use client';

import { useState } from 'react';
import {
  Workflow, Plus, Play, Pause, Search, Clock, CheckCircle2,
  AlertTriangle, Zap, Mail, MessageSquare, UserPlus, Bell,
  ArrowRight, GitBranch, Timer, Target, MoreHorizontal,
  Filter, ChevronRight, Settings, Trash2, Copy,
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
 */

interface WorkflowItem {
  id: string;
  name: string;
  description: string;
  trigger: string;
  triggerIcon: typeof Zap;
  status: 'active' | 'paused' | 'draft';
  type: 'contact' | 'deal' | 'solar' | 'ticket';
  actions_count: number;
  enrolled: number;
  completed: number;
  error_count: number;
  created_at: string;
  last_run?: string;
}

const workflows: WorkflowItem[] = [
  {
    id: 'wf1', name: 'New Lead Welcome Sequence', description: 'Auto-send welcome email + create follow-up task when a new lead enters the CRM',
    trigger: 'Contact created with lifecycle_stage = lead', triggerIcon: UserPlus,
    status: 'active', type: 'contact', actions_count: 4, enrolled: 892, completed: 756, error_count: 3,
    created_at: '2025-11-15', last_run: '2026-04-14T09:23:00',
  },
  {
    id: 'wf2', name: 'Solar Contract → Project Pipeline', description: 'When a solar deal closes, auto-create solar project, assign to ops, notify rep',
    trigger: 'Deal stage changed to "Closed Won" AND deal_type = solar', triggerIcon: Zap,
    status: 'active', type: 'deal', actions_count: 6, enrolled: 145, completed: 138, error_count: 0,
    created_at: '2025-12-01', last_run: '2026-04-13T16:45:00',
  },
  {
    id: 'wf3', name: 'Solar Stage Notifications', description: 'Notify customer + rep when solar project advances to each new stage',
    trigger: 'Solar project stage changed', triggerIcon: Bell,
    status: 'active', type: 'solar', actions_count: 3, enrolled: 312, completed: 289, error_count: 1,
    created_at: '2026-01-10', last_run: '2026-04-14T11:02:00',
  },
  {
    id: 'wf4', name: 'Overdue Task Escalation', description: 'If a task is overdue by 2 days, reassign to manager and send Slack alert',
    trigger: 'Task overdue by 48 hours', triggerIcon: AlertTriangle,
    status: 'active', type: 'contact', actions_count: 3, enrolled: 67, completed: 54, error_count: 2,
    created_at: '2026-02-05', last_run: '2026-04-14T08:00:00',
  },
  {
    id: 'wf5', name: 'Referral Request (Post-Install)', description: 'Send referral request email 7 days after solar install completion',
    trigger: 'Solar stage = install_completed AND 7 days elapsed', triggerIcon: Timer,
    status: 'active', type: 'solar', actions_count: 2, enrolled: 45, completed: 38, error_count: 0,
    created_at: '2026-01-20', last_run: '2026-04-10T10:00:00',
  },
  {
    id: 'wf6', name: 'Stale Deal Alert', description: 'If a deal has no activity for 14 days, alert the owner and create a follow-up task',
    trigger: 'Deal last_activity > 14 days AND stage != Closed', triggerIcon: Clock,
    status: 'paused', type: 'deal', actions_count: 3, enrolled: 23, completed: 18, error_count: 0,
    created_at: '2026-03-01', last_run: '2026-03-28T08:00:00',
  },
  {
    id: 'wf7', name: 'Ticket SLA Breach Warning', description: 'Alert team 2 hours before SLA breach, auto-escalate on breach',
    trigger: 'Ticket SLA due within 2 hours', triggerIcon: AlertTriangle,
    status: 'active', type: 'ticket', actions_count: 4, enrolled: 89, completed: 76, error_count: 5,
    created_at: '2026-02-15', last_run: '2026-04-14T07:30:00',
  },
  {
    id: 'wf8', name: 'Smart Home Upsell', description: 'After solar PTO approved, send smart home bundle offer to customer',
    trigger: 'Solar stage = pto_approved', triggerIcon: Target,
    status: 'draft', type: 'solar', actions_count: 3, enrolled: 0, completed: 0, error_count: 0,
    created_at: '2026-04-10',
  },
];

const statusConfig = {
  active: { label: 'Active', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: Play },
  paused: { label: 'Paused', color: 'text-amber-600', bg: 'bg-amber-50', icon: Pause },
  draft: { label: 'Draft', color: 'text-gray-500', bg: 'bg-gray-100', icon: Clock },
};

const typeConfig = {
  contact: { label: 'Contact', color: 'bg-blue-100 text-blue-700' },
  deal: { label: 'Deal', color: 'bg-violet-100 text-violet-700' },
  solar: { label: 'Solar', color: 'bg-amber-100 text-amber-700' },
  ticket: { label: 'Ticket', color: 'bg-rose-100 text-rose-700' },
};

export default function WorkflowsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = workflows.filter(w => {
    if (search && !w.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && w.status !== statusFilter) return false;
    if (typeFilter !== 'all' && w.type !== typeFilter) return false;
    return true;
  });

  const activeCount = workflows.filter(w => w.status === 'active').length;
  const totalEnrolled = workflows.reduce((s, w) => s + w.enrolled, 0);
  const totalCompleted = workflows.reduce((s, w) => s + w.completed, 0);
  const totalErrors = workflows.reduce((s, w) => s + w.error_count, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Workflow className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#0B1F3A]">Workflows</h1>
              <p className="text-sm text-gray-500">Automate your sales, solar, and service processes</p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-[#0B1F3A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0B1F3A]/90 transition">
            <Plus className="w-4 h-4" /> Create Workflow
          </button>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <Stat icon={Play} iconColor="text-emerald-500" iconBg="bg-emerald-50" label="Active Workflows" value={String(activeCount)} />
          <Stat icon={UserPlus} iconColor="text-blue-500" iconBg="bg-blue-50" label="Total Enrolled" value={totalEnrolled.toLocaleString()} />
          <Stat icon={CheckCircle2} iconColor="text-violet-500" iconBg="bg-violet-50" label="Completed" value={totalCompleted.toLocaleString()} />
          <Stat icon={AlertTriangle} iconColor="text-red-500" iconBg="bg-red-50" label="Errors" value={String(totalErrors)} />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search workflows..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F0A500] focus:border-transparent outline-none" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="draft">Draft</option>
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
            <option value="all">All Types</option>
            <option value="contact">Contact</option>
            <option value="deal">Deal</option>
            <option value="solar">Solar</option>
            <option value="ticket">Ticket</option>
          </select>
        </div>
      </div>

      {/* Workflow List */}
      <div className="p-6 space-y-3">
        {filtered.map(wf => {
          const sc = statusConfig[wf.status];
          const tc = typeConfig[wf.type];
          const StatusIcon = sc.icon;
          const TriggerIcon = wf.triggerIcon;

          return (
            <div key={wf.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TriggerIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-[#0B1F3A]">{wf.name}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${tc.color}`}>{tc.label}</span>
                      <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${sc.color} ${sc.bg}`}>
                        <StatusIcon className="w-3 h-3" /> {sc.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{wf.description}</p>

                    {/* Trigger */}
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                      <Zap className="w-3 h-3" /> <span className="font-medium">Trigger:</span> {wf.trigger}
                    </div>

                    {/* Visual flow */}
                    <div className="flex items-center gap-1 mt-2">
                      <div className="flex items-center gap-0.5 text-[10px] text-gray-500 bg-gray-50 px-2 py-1 rounded">
                        <Zap className="w-3 h-3 text-amber-500" /> Trigger
                      </div>
                      {Array.from({ length: Math.min(wf.actions_count, 5) }).map((_, i) => (
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
                      {wf.actions_count > 5 && <span className="text-[10px] text-gray-400 ml-1">+{wf.actions_count - 5} more</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm font-bold text-[#0B1F3A]">{wf.enrolled.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400">Enrolled</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-600">{wf.completed.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400">Completed</p>
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${wf.error_count > 0 ? 'text-red-500' : 'text-gray-400'}`}>{wf.error_count}</p>
                      <p className="text-[10px] text-gray-400">Errors</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {wf.status === 'active' ? (
                      <button className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 transition" title="Pause">
                        <Pause className="w-4 h-4" />
                      </button>
                    ) : (
                      <button className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-500 transition" title="Activate">
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                    <button className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 transition" title="Settings">
                      <Settings className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 transition" title="Clone">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Last run */}
              {wf.last_run && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">
                    Last run: {new Date(wf.last_run).toLocaleString()}
                  </span>
                  <button className="text-[10px] text-[#007A67] font-medium hover:underline flex items-center gap-1">
                    View execution log <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Workflow className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No workflows match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, iconColor, iconBg, label, value }: {
  icon: typeof Play; iconColor: string; iconBg: string; label: string; value: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-xl font-bold text-[#0B1F3A]">{value}</p>
        </div>
      </div>
    </div>
  );
}
