'use client';

import { useState } from 'react';
import { useApi } from '@/lib/hooks/useApi';
import { SolarProject, SOLAR_STAGES } from '@/lib/types';
import {
  Sun, CheckCircle2, Clock, MapPin, Phone, Mail, FileText,
  Download, MessageSquare, Zap, DollarSign, ArrowRight, Loader,
} from 'lucide-react';

/*
 * CUSTOMER PORTAL — Solar Project Tracking
 * Customer-facing view at goldendoorhq.com/portal
 * Shows: current stage, timeline, documents, rep contact, system details.
 * In production, this would be gated by magic link or customer auth.
 */

function getStageLabel(key: string) {
  return SOLAR_STAGES.find(s => s.key === key)?.label || key.replace(/_/g, ' ');
}
function getStageColor(key: string) {
  return SOLAR_STAGES.find(s => s.key === key)?.color || '#6B7280';
}

export default function CustomerPortalPage() {
  const [tab, setTab] = useState<'status' | 'details'>('status');
  const { data: projects, loading } = useApi<SolarProject>('/api/solar', { limit: 1 });

  const p = projects[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1F3A] flex items-center justify-center">
        <Loader className="animate-spin text-[#F0A500]" size={40} />
      </div>
    );
  }

  if (!p) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0B1F3A] to-[#0B1F3A]/95 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#F0A500] flex items-center justify-center mx-auto mb-4">
            <Sun className="w-8 h-8 text-[#0B1F3A]" />
          </div>
          <h1 className="text-white text-2xl font-bold mb-2">GoldenDoor Customer Portal</h1>
          <p className="text-white/60">No active solar projects found. Contact your rep to get started.</p>
        </div>
      </div>
    );
  }

  const currentIdx = SOLAR_STAGES.findIndex(s => s.key === p.current_stage);
  const progressPct = currentIdx >= 0 ? Math.round(((currentIdx + 1) / SOLAR_STAGES.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1F3A] to-[#0B1F3A]/95">
      {/* Portal Header */}
      <div className="px-6 pt-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#F0A500] flex items-center justify-center">
              <span className="text-[#0B1F3A] font-bold text-sm">GD</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">GoldenDoor Customer Portal</h1>
              <p className="text-white/60 text-sm">Your Solar Project Dashboard</p>
            </div>
          </div>

          {/* Welcome Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/70 text-sm">Project</p>
                <h2 className="text-white text-2xl font-bold mt-0.5">{p.address || 'Solar Project'}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <MapPin className="w-4 h-4 text-white/50" />
                  <span className="text-white/70 text-sm">{[p.address, p.city, p.state, p.zip].filter(Boolean).join(', ') || 'No address'}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{ backgroundColor: `${getStageColor(p.current_stage)}30`, color: getStageColor(p.current_stage) }}>
                  <Sun className="w-4 h-4" />
                  {getStageLabel(p.current_stage)}
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/60 text-xs">Project Progress</span>
                <span className="text-white font-bold text-sm">{progressPct}%</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#F0A500] to-emerald-400 rounded-full transition-all duration-1000"
                  style={{ width: `${progressPct}%` }} />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="bg-white/5 rounded-xl p-3">
                <Zap className="w-5 h-5 text-[#F0A500] mb-1" />
                <p className="text-white font-bold">{p.system_size_kw || '—'} kW</p>
                <p className="text-white/50 text-xs">System Size</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <Sun className="w-5 h-5 text-amber-400 mb-1" />
                <p className="text-white font-bold">{p.panel_count || '—'}</p>
                <p className="text-white/50 text-xs">Panels</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <DollarSign className="w-5 h-5 text-emerald-400 mb-1" />
                <p className="text-white font-bold">{p.contract_amount ? `$${Number(p.contract_amount).toLocaleString()}` : '—'}</p>
                <p className="text-white/50 text-xs">Contract Value</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <FileText className="w-5 h-5 text-blue-400 mb-1" />
                <p className="text-white font-bold">{p.financing_type || '—'}</p>
                <p className="text-white/50 text-xs">Financing</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-gray-50 rounded-t-3xl min-h-[50vh]">
        <div className="max-w-4xl mx-auto px-6 pt-4">
          <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'status' as const, label: 'Project Status', icon: CheckCircle2 },
              { key: 'details' as const, label: 'System Details', icon: FileText },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition ${
                  tab === t.key ? 'bg-white text-[#0B1F3A] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}>
                <t.icon className="w-4 h-4" /> {t.label}
              </button>
            ))}
          </div>

          {tab === 'status' && (
            <div className="space-y-6 pb-8">
              {/* Stage Timeline */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-[#0B1F3A] mb-4">Project Timeline</h3>
                <div className="space-y-0">
                  {SOLAR_STAGES.map((stage, i) => {
                    const isCompleted = currentIdx >= 0 && i < currentIdx;
                    const isActive = i === currentIdx;
                    const color = stage.color;
                    return (
                      <div key={stage.key} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isCompleted ? 'bg-emerald-500' : isActive ? 'ring-4 ring-offset-2' : 'bg-gray-200'
                          }`} style={isActive ? { backgroundColor: color } : {}}>
                            {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            : isActive ? <Clock className="w-3.5 h-3.5 text-white" />
                            : <span className="w-2 h-2 rounded-full bg-gray-300" />}
                          </div>
                          {i < SOLAR_STAGES.length - 1 && (
                            <div className={`w-0.5 h-8 ${isCompleted ? 'bg-emerald-300' : 'bg-gray-200'}`} />
                          )}
                        </div>
                        <div className={`pb-4 ${!isCompleted && !isActive ? 'opacity-40' : ''}`}>
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-medium ${isActive ? 'text-[#0B1F3A]' : isCompleted ? 'text-gray-700' : 'text-gray-500'}`}>
                              {stage.label}
                            </p>
                            {isActive && (
                              <span className="text-[11px] px-2 py-0.5 rounded-full font-bold text-white" style={{ backgroundColor: color }}>
                                CURRENT
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* What's Next */}
              <div className="bg-gradient-to-r from-[#F0A500]/10 to-amber-50 rounded-xl border border-[#F0A500]/20 p-6">
                <h3 className="text-sm font-semibold text-[#0B1F3A] flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-[#F0A500]" /> What Happens Next
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  {currentIdx < SOLAR_STAGES.length - 1
                    ? `Your project is currently in the "${getStageLabel(p.current_stage)}" stage. The next step is "${SOLAR_STAGES[currentIdx + 1]?.label}". Your Delta Power team is working to move your project forward.`
                    : 'Congratulations! Your solar project is complete. Welcome to clean energy!'}
                </p>
              </div>
            </div>
          )}

          {tab === 'details' && (
            <div className="space-y-6 pb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-[#0B1F3A] mb-3">System Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500">System Size:</span> <span className="font-medium">{p.system_size_kw || '—'} kW</span></div>
                  <div><span className="text-gray-500">Panel Count:</span> <span className="font-medium">{p.panel_count || '—'}</span></div>
                  <div><span className="text-gray-500">Panel Type:</span> <span className="font-medium">{p.panel_type || '—'}</span></div>
                  <div><span className="text-gray-500">Inverter:</span> <span className="font-medium">{p.inverter_type || '—'}</span></div>
                  <div><span className="text-gray-500">Battery:</span> <span className="font-medium">{p.battery_type || 'None'}{p.battery_count ? ` x${p.battery_count}` : ''}</span></div>
                  <div><span className="text-gray-500">Financing:</span> <span className="font-medium">{p.financing_type || '—'}</span></div>
                  <div><span className="text-gray-500">Lender:</span> <span className="font-medium">{p.lender_name || '—'}</span></div>
                  <div><span className="text-gray-500">Utility:</span> <span className="font-medium">{p.utility_company || '—'}</span></div>
                  <div><span className="text-gray-500">AHJ:</span> <span className="font-medium">{p.ahj || '—'}</span></div>
                  <div><span className="text-gray-500">Contract Value:</span> <span className="font-medium">{p.contract_amount ? `$${Number(p.contract_amount).toLocaleString()}` : '—'}</span></div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-[#0B1F3A] mb-3">Location</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-[#F0A500]" />
                  {[p.address, p.city, p.state, p.zip].filter(Boolean).join(', ') || 'No address on file'}
                </div>
              </div>

              {p.notes && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-sm font-semibold text-[#0B1F3A] mb-3">Notes</h3>
                  <p className="text-sm text-gray-600">{p.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
