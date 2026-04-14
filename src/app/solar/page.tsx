'use client';

import { useState, useMemo } from 'react';
import {
  Sun, Search, Filter, ChevronRight, ChevronDown, MapPin, Phone, Mail,
  DollarSign, Zap, Calendar, Clock, User, MoreHorizontal, Plus,
  ArrowUpRight, ArrowDownRight, CheckCircle2, AlertCircle, Eye,
} from 'lucide-react';
import { solarProjects, SOLAR_STAGES } from '@/lib/mock-data';
import { SolarProject, SolarStage } from '@/lib/types';

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

function getStageIndex(stage: SolarStage): number {
  return SOLAR_STAGES.findIndex(s => s.key === stage);
}

function getStageInfo(stage: SolarStage) {
  return SOLAR_STAGES.find(s => s.key === stage) || SOLAR_STAGES[0];
}

function getProgressPct(stage: SolarStage): number {
  const idx = getStageIndex(stage);
  return Math.round(((idx + 1) / SOLAR_STAGES.length) * 100);
}

function getDaysInStage(project: SolarProject): number {
  const stageTimestamps: Record<string, string | undefined> = {
    contract_signed: project.contract_signed_at,
    site_survey_completed: project.site_survey_completed_at,
    cads_completed: project.cads_completed_at,
    permits_approved: project.permits_approved_at,
    install_completed: project.install_completed_at,
    inspection_passed: project.inspection_passed_at,
    pto_approved: project.pto_approved_at,
    final_completion: project.completed_at,
  };
  const ts = stageTimestamps[project.current_stage] || project.updated_at;
  const d = new Date(ts);
  const now = new Date();
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

export default function SolarPipelinePage() {
  const [view, setView] = useState<'pipeline' | 'list' | 'board'>('pipeline');
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<SolarStage | 'all'>('all');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [repFilter, setRepFilter] = useState<string>('all');
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return solarProjects.filter(p => {
      if (search && !p.contact_name.toLowerCase().includes(search.toLowerCase()) &&
          !p.address.toLowerCase().includes(search.toLowerCase()) &&
          !p.city.toLowerCase().includes(search.toLowerCase())) return false;
      if (stageFilter !== 'all' && p.current_stage !== stageFilter) return false;
      if (stateFilter !== 'all' && p.state !== stateFilter) return false;
      if (repFilter !== 'all' && p.rep_name !== repFilter) return false;
      return true;
    });
  }, [search, stageFilter, stateFilter, repFilter]);

  const states = [...new Set(solarProjects.map(p => p.state))];
  const reps = [...new Set(solarProjects.map(p => p.rep_name))];

  // Stage counts for overview
  const stageCounts = useMemo(() => {
    const counts: Record<string, { count: number; value: number }> = {};
    SOLAR_STAGES.forEach(s => { counts[s.key] = { count: 0, value: 0 }; });
    solarProjects.forEach(p => {
      counts[p.current_stage].count++;
      counts[p.current_stage].value += p.contract_amount;
    });
    return counts;
  }, []);

  // Summary stats
  const totalProjects = solarProjects.length;
  const totalValue = solarProjects.reduce((sum, p) => sum + p.contract_amount, 0);
  const avgSystemSize = solarProjects.reduce((sum, p) => sum + p.system_size_kw, 0) / totalProjects;
  const completedCount = solarProjects.filter(p => p.current_stage === 'final_completion').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Sun className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#0B1F3A]">Solar Pipeline</h1>
              <p className="text-sm text-gray-500">Track every project from contract to completion</p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-[#0B1F3A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0B1F3A]/90 transition">
            <Plus className="w-4 h-4" /> New Solar Project
          </button>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-gradient-to-r from-[#0B1F3A] to-[#0B1F3A]/80 rounded-xl p-4 text-white">
            <p className="text-xs text-white/70 font-medium">Active Projects</p>
            <p className="text-2xl font-bold mt-1">{totalProjects}</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-300">
              <ArrowUpRight className="w-3 h-3" /> 3 new this month
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#F0A500] to-amber-400 rounded-xl p-4 text-white">
            <p className="text-xs text-white/90 font-medium">Pipeline Value</p>
            <p className="text-2xl font-bold mt-1">{fmt(totalValue)}</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-white/80">
              <DollarSign className="w-3 h-3" /> Avg: {fmt(totalValue / totalProjects)}
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#007A67] to-teal-500 rounded-xl p-4 text-white">
            <p className="text-xs text-white/80 font-medium">Avg System Size</p>
            <p className="text-2xl font-bold mt-1">{avgSystemSize.toFixed(1)} kW</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-white/80">
              <Zap className="w-3 h-3" /> {Math.round(avgSystemSize * 25)} panels avg
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-500 to-green-400 rounded-xl p-4 text-white">
            <p className="text-xs text-white/80 font-medium">Completed</p>
            <p className="text-2xl font-bold mt-1">{completedCount} / {totalProjects}</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-white/80">
              <CheckCircle2 className="w-3 h-3" /> {Math.round((completedCount / totalProjects) * 100)}% completion rate
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, address, city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F0A500] focus:border-transparent outline-none"
            />
          </div>

          <select value={stageFilter} onChange={e => setStageFilter(e.target.value as SolarStage | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
            <option value="all">All Stages</option>
            {SOLAR_STAGES.map(s => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>

          <select value={stateFilter} onChange={e => setStateFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
            <option value="all">All States</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select value={repFilter} onChange={e => setRepFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
            <option value="all">All Reps</option>
            {reps.map(r => <option key={r} value={r}>{r}</option>)}
          </select>

          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-0.5 ml-auto">
            {(['pipeline', 'list', 'board'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition ${view === v ? 'bg-white text-[#0B1F3A] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stage Overview Bar */}
      <div className="px-6 py-3 bg-white border-b border-gray-100">
        <div className="flex gap-1 overflow-x-auto">
          {SOLAR_STAGES.map(stage => {
            const sc = stageCounts[stage.key];
            const isActive = stageFilter === stage.key;
            return (
              <button
                key={stage.key}
                onClick={() => setStageFilter(stageFilter === stage.key ? 'all' : stage.key)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition border ${
                  isActive
                    ? 'border-[#0B1F3A] bg-[#0B1F3A] text-white'
                    : sc.count > 0
                      ? 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                      : 'border-gray-100 bg-gray-50/50 text-gray-400'
                }`}
              >
                <span className="block">{stage.shortLabel}</span>
                <span className="block mt-0.5 font-bold">{sc.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {view === 'pipeline' && <PipelineView projects={filtered} expandedProject={expandedProject} setExpandedProject={setExpandedProject} />}
        {view === 'list' && <ListView projects={filtered} />}
        {view === 'board' && <BoardView projects={filtered} />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// PIPELINE VIEW — Visual stage tracker
// ═══════════════════════════════════════════
function PipelineView({ projects, expandedProject, setExpandedProject }: {
  projects: SolarProject[];
  expandedProject: string | null;
  setExpandedProject: (id: string | null) => void;
}) {
  return (
    <div className="space-y-3">
      {projects.map(project => {
        const stageInfo = getStageInfo(project.current_stage);
        const progressPct = getProgressPct(project.current_stage);
        const daysInStage = getDaysInStage(project);
        const isExpanded = expandedProject === project.id;

        return (
          <div key={project.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
            {/* Project Header */}
            <div
              className="px-5 py-4 cursor-pointer"
              onClick={() => setExpandedProject(isExpanded ? null : project.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-[#0B1F3A]">{project.contact_name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white" style={{ backgroundColor: stageInfo.color }}>
                        {stageInfo.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{project.address}, {project.city}, {project.state}</span>
                      <span className="flex items-center gap-1"><Zap className="w-3 h-3" />{project.system_size_kw} kW</span>
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{project.rep_name}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#0B1F3A]">{fmt(project.contract_amount)}</p>
                    <p className="text-xs text-gray-500">{project.financing_type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: daysInStage > 14 ? '#EF4444' : daysInStage > 7 ? '#F59E0B' : '#10B981' }}>
                      {daysInStage}d
                    </p>
                    <p className="text-xs text-gray-500">in stage</p>
                  </div>
                  <button className="p-1 rounded hover:bg-gray-100" onClick={e => e.stopPropagation()}>
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%`, backgroundColor: stageInfo.color }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-500 w-10 text-right">{progressPct}%</span>
              </div>

              {/* Stage dots */}
              <div className="mt-2 flex items-center gap-0.5">
                {SOLAR_STAGES.map((s, i) => {
                  const currentIdx = getStageIndex(project.current_stage);
                  const isPast = i < currentIdx;
                  const isCurrent = i === currentIdx;
                  return (
                    <div key={s.key} className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full transition ${
                          isPast ? 'bg-emerald-400' : isCurrent ? 'ring-2 ring-offset-1' : 'bg-gray-200'
                        }`}
                        style={isCurrent ? { backgroundColor: s.color } : isPast ? {} : {}}
                        title={s.label}
                      />
                      {i < SOLAR_STAGES.length - 1 && (
                        <div className={`w-3 h-0.5 ${isPast ? 'bg-emerald-300' : 'bg-gray-200'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/50">
                <div className="grid grid-cols-3 gap-6">
                  {/* Contact Info */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Contact</h4>
                    <div className="space-y-1.5 text-sm">
                      <p className="font-medium text-[#0B1F3A]">{project.contact_name}</p>
                      <p className="flex items-center gap-2 text-gray-600"><Mail className="w-3.5 h-3.5" />{project.contact_email}</p>
                      <p className="flex items-center gap-2 text-gray-600"><Phone className="w-3.5 h-3.5" />{project.contact_phone}</p>
                      <p className="flex items-center gap-2 text-gray-600"><MapPin className="w-3.5 h-3.5" />{project.address}, {project.city}, {project.state} {project.zip}</p>
                    </div>
                  </div>

                  {/* System Details */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">System</h4>
                    <div className="space-y-1.5 text-sm text-gray-600">
                      <p><span className="text-gray-400">Size:</span> <span className="font-medium text-[#0B1F3A]">{project.system_size_kw} kW</span></p>
                      <p><span className="text-gray-400">Panels:</span> {project.panel_count}× {project.panel_type}</p>
                      <p><span className="text-gray-400">Inverter:</span> {project.inverter_type}</p>
                      <p><span className="text-gray-400">Utility:</span> {project.utility_company}</p>
                      <p><span className="text-gray-400">AHJ:</span> {project.ahj}</p>
                    </div>
                  </div>

                  {/* Financial & Timeline */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Financial</h4>
                    <div className="space-y-1.5 text-sm text-gray-600">
                      <p><span className="text-gray-400">Contract:</span> <span className="font-bold text-[#0B1F3A]">{fmt(project.contract_amount)}</span></p>
                      <p><span className="text-gray-400">Financing:</span> <span className="capitalize">{project.financing_type}</span></p>
                      <p><span className="text-gray-400">Rep:</span> {project.rep_name}</p>
                      <p><span className="text-gray-400">Created:</span> {fmtDate(project.created_at)}</p>
                    </div>
                  </div>
                </div>

                {/* Stage Timeline */}
                <div className="mt-5">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Stage Timeline</h4>
                  <div className="flex items-start gap-0 overflow-x-auto pb-2">
                    {SOLAR_STAGES.map((stage, i) => {
                      const currentIdx = getStageIndex(project.current_stage);
                      const isPast = i < currentIdx;
                      const isCurrent = i === currentIdx;
                      const isFuture = i > currentIdx;

                      // Get timestamp for completed stages
                      const timestamps: Record<string, string | undefined> = {
                        contract_signed: project.contract_signed_at,
                        site_survey_completed: project.site_survey_completed_at,
                        cads_completed: project.cads_completed_at,
                        permits_approved: project.permits_approved_at,
                        install_completed: project.install_completed_at,
                        inspection_passed: project.inspection_passed_at,
                        pto_approved: project.pto_approved_at,
                        final_completion: project.completed_at,
                      };

                      return (
                        <div key={stage.key} className="flex items-start flex-shrink-0">
                          <div className="flex flex-col items-center w-16">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition ${
                                isPast ? 'bg-emerald-500 text-white' :
                                isCurrent ? 'text-white ring-4 ring-offset-2' :
                                'bg-gray-200 text-gray-400'
                              }`}
                              style={isCurrent ? { backgroundColor: stage.color } : {}}
                            >
                              {isPast ? '✓' : i + 1}
                            </div>
                            <span className={`text-[10px] mt-1 text-center leading-tight ${isCurrent ? 'font-bold text-[#0B1F3A]' : isFuture ? 'text-gray-300' : 'text-gray-500'}`}>
                              {stage.shortLabel}
                            </span>
                            {timestamps[stage.key] && (
                              <span className="text-[9px] text-gray-400 mt-0.5">{fmtDate(timestamps[stage.key])}</span>
                            )}
                          </div>
                          {i < SOLAR_STAGES.length - 1 && (
                            <div className={`h-0.5 w-4 mt-3 ${isPast ? 'bg-emerald-400' : 'bg-gray-200'}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-2">
                  <button className="px-3 py-1.5 bg-[#0B1F3A] text-white rounded-lg text-xs font-medium hover:bg-[#0B1F3A]/90 transition flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" /> Advance Stage
                  </button>
                  <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium hover:bg-gray-50 transition flex items-center gap-1">
                    <Eye className="w-3 h-3" /> View Full Detail
                  </button>
                  <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium hover:bg-gray-50 transition flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Schedule
                  </button>
                  <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium hover:bg-gray-50 transition flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Contact Customer
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {projects.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Sun className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No solar projects match your filters</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// LIST VIEW — Table format
// ═══════════════════════════════════════════
function ListView({ projects }: { projects: SolarProject[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Location</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Stage</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Progress</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">System</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Rep</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Days in Stage</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Contract Date</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => {
              const stageInfo = getStageInfo(project.current_stage);
              const progressPct = getProgressPct(project.current_stage);
              const daysInStage = getDaysInStage(project);

              return (
                <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-[#0B1F3A]">{project.contact_name}</p>
                    <p className="text-xs text-gray-400">{project.contact_email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-700">{project.city}, {project.state}</p>
                    <p className="text-xs text-gray-400">{project.utility_company}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full font-medium text-white" style={{ backgroundColor: stageInfo.color }}>
                      {stageInfo.shortLabel}
                    </span>
                  </td>
                  <td className="px-4 py-3 w-32">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${progressPct}%`, backgroundColor: stageInfo.color }} />
                      </div>
                      <span className="text-xs text-gray-500">{progressPct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">{project.system_size_kw} kW</p>
                    <p className="text-xs text-gray-400">{project.panel_count} panels</p>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-[#0B1F3A]">{fmt(project.contract_amount)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{project.rep_name}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-bold ${daysInStage > 14 ? 'text-red-500' : daysInStage > 7 ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {daysInStage}d
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{fmtDate(project.contract_signed_at)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// BOARD VIEW — Kanban-style grouped by stage
// ═══════════════════════════════════════════
function BoardView({ projects }: { projects: SolarProject[] }) {
  // Group by active stage clusters (to avoid 15 columns)
  const stageGroups = [
    { label: 'Pre-Survey', stages: ['contract_signed', 'site_survey_scheduled'] as SolarStage[], color: '#3B82F6' },
    { label: 'Design', stages: ['site_survey_completed', 'cads_in_progress', 'cads_completed'] as SolarStage[], color: '#8B5CF6' },
    { label: 'Permitting', stages: ['permits_submitted', 'permits_approved'] as SolarStage[], color: '#F59E0B' },
    { label: 'Installation', stages: ['install_scheduled', 'install_in_progress', 'install_completed'] as SolarStage[], color: '#F97316' },
    { label: 'Inspection & PTO', stages: ['inspection_scheduled', 'inspection_passed', 'pto_submitted', 'pto_approved'] as SolarStage[], color: '#10B981' },
    { label: 'Complete', stages: ['final_completion'] as SolarStage[], color: '#22C55E' },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {stageGroups.map(group => {
        const groupProjects = projects.filter(p => group.stages.includes(p.current_stage));
        const groupValue = groupProjects.reduce((sum, p) => sum + p.contract_amount, 0);

        return (
          <div key={group.label} className="flex-shrink-0 w-72">
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: group.color }} />
                <h3 className="text-sm font-semibold text-[#0B1F3A]">{group.label}</h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full font-medium">{groupProjects.length}</span>
              </div>
              <span className="text-xs text-gray-500">{fmt(groupValue)}</span>
            </div>

            <div className="space-y-2">
              {groupProjects.map(project => {
                const stageInfo = getStageInfo(project.current_stage);
                const daysInStage = getDaysInStage(project);

                return (
                  <div key={project.id} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition cursor-pointer">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-medium text-[#0B1F3A]">{project.contact_name}</p>
                      <span className={`text-[10px] font-bold ${daysInStage > 14 ? 'text-red-500' : daysInStage > 7 ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {daysInStage}d
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{project.city}, {project.state}</p>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs px-1.5 py-0.5 rounded text-white font-medium" style={{ backgroundColor: stageInfo.color }}>
                        {stageInfo.shortLabel}
                      </span>
                      <span className="text-xs font-bold text-[#0B1F3A]">{fmt(project.contract_amount)}</span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Zap className="w-3 h-3" /> {project.system_size_kw} kW
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <User className="w-3 h-3" /> {project.rep_name.split(' ')[0]}
                      </div>
                    </div>
                  </div>
                );
              })}

              {groupProjects.length === 0 && (
                <div className="border border-dashed border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-xs text-gray-400">No projects</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
