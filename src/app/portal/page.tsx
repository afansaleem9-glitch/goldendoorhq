'use client';

import { useState } from 'react';
import {
  Sun, CheckCircle2, Clock, MapPin, Phone, Mail, FileText,
  Download, MessageSquare, Zap, DollarSign, Calendar, Shield,
  ArrowRight, ExternalLink, Camera, HelpCircle,
} from 'lucide-react';
import { SOLAR_STAGES } from '@/lib/mock-data';
import { SolarStage } from '@/lib/types';

/*
 * CUSTOMER PORTAL — Solar Project Tracking
 * This is the customer-facing view accessible via goldendoorhq.com/portal
 * Customers get a magic link or login to see their project status.
 * Shows: current stage, timeline, documents, rep contact, next steps.
 */

// Mock: simulating a logged-in customer viewing their project
const customerProject = {
  id: 'sp1',
  contact_name: 'Sarah Johnson',
  address: '2847 Sunset Ridge, Austin, TX 78746',
  system_size_kw: 12.4,
  panel_count: 31,
  panel_type: 'REC Alpha Pure-R 400W',
  inverter_type: 'Enphase IQ8+',
  financing_type: 'Loan — GoodLeap 25yr',
  contract_amount: 42800,
  monthly_payment: 189,
  estimated_production: 18600,
  estimated_savings_yr1: 2400,
  current_stage: 'install_in_progress' as SolarStage,
  rep_name: 'Afan Saleem',
  rep_phone: '(512) 555-0001',
  rep_email: 'afan@goldendoorhq.com',
  rep_photo: null,
  timeline: [
    { stage: 'contract_signed', date: '2026-01-15', completed: true, note: 'Contract signed with GoodLeap financing' },
    { stage: 'site_survey_scheduled', date: '2026-01-20', completed: true, note: 'Survey scheduled' },
    { stage: 'site_survey_completed', date: '2026-01-28', completed: true, note: 'Survey completed — roof in great condition' },
    { stage: 'cads_in_progress', date: '2026-02-01', completed: true, note: 'Design team started CAD drawings' },
    { stage: 'cads_completed', date: '2026-02-10', completed: true, note: 'Final design approved — 31 panels, south-facing' },
    { stage: 'permits_submitted', date: '2026-02-12', completed: true, note: 'Permits submitted to City of Austin' },
    { stage: 'permits_approved', date: '2026-02-28', completed: true, note: 'All permits approved!' },
    { stage: 'install_scheduled', date: '2026-03-10', completed: true, note: 'Installation scheduled for March 28-29' },
    { stage: 'install_in_progress', date: '2026-03-28', completed: false, note: 'Installation crew on site — Day 1 complete' },
    { stage: 'install_completed', date: null, completed: false, note: null },
    { stage: 'inspection_scheduled', date: null, completed: false, note: null },
    { stage: 'inspection_passed', date: null, completed: false, note: null },
    { stage: 'pto_submitted', date: null, completed: false, note: null },
    { stage: 'pto_approved', date: null, completed: false, note: null },
    { stage: 'final_completion', date: null, completed: false, note: null },
  ],
  documents: [
    { name: 'Solar Contract', type: 'contract', date: '2026-01-15', url: '#' },
    { name: 'Site Survey Report', type: 'survey', date: '2026-01-28', url: '#' },
    { name: 'System Design (CAD)', type: 'cad', date: '2026-02-10', url: '#' },
    { name: 'Permit Application', type: 'permit', date: '2026-02-12', url: '#' },
    { name: 'Permit Approval', type: 'permit', date: '2026-02-28', url: '#' },
    { name: 'Installation Photos - Day 1', type: 'photo', date: '2026-03-28', url: '#' },
  ],
  messages: [
    { from: 'Afan Saleem', date: '2026-03-28', text: 'Day 1 of install went great! Crew mounted 20 of 31 panels today. Finishing tomorrow.' },
    { from: 'Sarah Johnson', date: '2026-03-27', text: 'Excited for tomorrow! Is there anything I need to do to prepare?' },
    { from: 'Afan Saleem', date: '2026-03-27', text: 'Just make sure the crew can access the breaker box. See you at 8 AM!' },
  ],
};

function getStageLabel(key: string) {
  return SOLAR_STAGES.find(s => s.key === key)?.label || key;
}

function getStageColor(key: string) {
  return SOLAR_STAGES.find(s => s.key === key)?.color || '#6B7280';
}

export default function CustomerPortalPage() {
  const [tab, setTab] = useState<'status' | 'documents' | 'messages'>('status');
  const p = customerProject;
  const currentIdx = SOLAR_STAGES.findIndex(s => s.key === p.current_stage);
  const progressPct = Math.round(((currentIdx + 1) / SOLAR_STAGES.length) * 100);

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
                <p className="text-white/70 text-sm">Welcome back,</p>
                <h2 className="text-white text-2xl font-bold mt-0.5">{p.contact_name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <MapPin className="w-4 h-4 text-white/50" />
                  <span className="text-white/70 text-sm">{p.address}</span>
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
                <p className="text-white font-bold">{p.system_size_kw} kW</p>
                <p className="text-white/50 text-xs">System Size</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <Sun className="w-5 h-5 text-amber-400 mb-1" />
                <p className="text-white font-bold">{p.panel_count} Panels</p>
                <p className="text-white/50 text-xs">{p.panel_type.split(' ')[0]}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <DollarSign className="w-5 h-5 text-emerald-400 mb-1" />
                <p className="text-white font-bold">${p.estimated_savings_yr1.toLocaleString()}</p>
                <p className="text-white/50 text-xs">Est. Year 1 Savings</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <Zap className="w-5 h-5 text-blue-400 mb-1" />
                <p className="text-white font-bold">{(p.estimated_production / 1000).toFixed(1)}k kWh</p>
                <p className="text-white/50 text-xs">Est. Annual Production</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="bg-gray-50 rounded-t-3xl min-h-[60vh]">
        <div className="max-w-4xl mx-auto px-6 pt-4">
          <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'status' as const, label: 'Project Status', icon: CheckCircle2 },
              { key: 'documents' as const, label: 'Documents', icon: FileText },
              { key: 'messages' as const, label: 'Messages', icon: MessageSquare },
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
              {/* Timeline */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-[#0B1F3A] mb-4">Project Timeline</h3>
                <div className="space-y-0">
                  {p.timeline.map((step, i) => {
                    const isActive = step.stage === p.current_stage;
                    const color = getStageColor(step.stage);
                    return (
                      <div key={step.stage} className="flex gap-4">
                        {/* Timeline line + dot */}
                        <div className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            step.completed ? 'bg-emerald-500' : isActive ? 'ring-4 ring-offset-2' : 'bg-gray-200'
                          }`}
                            style={isActive ? { backgroundColor: color } : {}}>
                            {step.completed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            ) : isActive ? (
                              <Clock className="w-3.5 h-3.5 text-white" />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-gray-300" />
                            )}
                          </div>
                          {i < p.timeline.length - 1 && (
                            <div className={`w-0.5 h-12 ${step.completed ? 'bg-emerald-300' : 'bg-gray-200'}`} />
                          )}
                        </div>

                        {/* Content */}
                        <div className={`pb-6 ${!step.completed && !isActive ? 'opacity-40' : ''}`}>
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-medium ${isActive ? 'text-[#0B1F3A]' : step.completed ? 'text-gray-700' : 'text-gray-400'}`}>
                              {getStageLabel(step.stage)}
                            </p>
                            {isActive && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold text-white" style={{ backgroundColor: color }}>
                                CURRENT
                              </span>
                            )}
                          </div>
                          {step.date && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {new Date(step.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                          )}
                          {step.note && <p className="text-xs text-gray-500 mt-1">{step.note}</p>}
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
                  Your installation crew is on site today. Once installation is complete (expected tomorrow),
                  we&apos;ll schedule your city inspection. After the inspection passes, we submit for Permission to Operate (PTO)
                  with Austin Energy. Total estimated time to completion: 3-4 weeks.
                </p>
              </div>

              {/* Your Rep */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-[#0B1F3A] mb-3">Your Solar Consultant</h3>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#0B1F3A] flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{p.rep_name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#0B1F3A]">{p.rep_name}</p>
                    <p className="text-xs text-gray-500">Solar Energy Consultant</p>
                    <div className="flex gap-3 mt-2">
                      <a href={`tel:${p.rep_phone}`} className="flex items-center gap-1 text-xs text-[#007A67] font-medium hover:underline">
                        <Phone className="w-3 h-3" /> {p.rep_phone}
                      </a>
                      <a href={`mailto:${p.rep_email}`} className="flex items-center gap-1 text-xs text-[#007A67] font-medium hover:underline">
                        <Mail className="w-3 h-3" /> Email
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Details */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-[#0B1F3A] mb-3">System Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500">System Size:</span> <span className="font-medium">{p.system_size_kw} kW</span></div>
                  <div><span className="text-gray-500">Panel Count:</span> <span className="font-medium">{p.panel_count} panels</span></div>
                  <div><span className="text-gray-500">Panel Type:</span> <span className="font-medium">{p.panel_type}</span></div>
                  <div><span className="text-gray-500">Inverter:</span> <span className="font-medium">{p.inverter_type}</span></div>
                  <div><span className="text-gray-500">Financing:</span> <span className="font-medium">{p.financing_type}</span></div>
                  <div><span className="text-gray-500">Monthly Payment:</span> <span className="font-medium">${p.monthly_payment}/mo</span></div>
                </div>
              </div>
            </div>
          )}

          {tab === 'documents' && (
            <div className="space-y-3 pb-8">
              {p.documents.map((doc, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between hover:shadow-md transition cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      {doc.type === 'photo' ? <Camera className="w-5 h-5 text-gray-400" /> : <FileText className="w-5 h-5 text-gray-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#0B1F3A]">{doc.name}</p>
                      <p className="text-xs text-gray-500">{new Date(doc.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 text-xs text-[#007A67] font-medium hover:underline">
                    <Download className="w-3 h-3" /> Download
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === 'messages' && (
            <div className="space-y-4 pb-8">
              {p.messages.map((msg, i) => {
                const isRep = msg.from !== p.contact_name;
                return (
                  <div key={i} className={`flex ${isRep ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-md rounded-2xl p-4 ${isRep ? 'bg-white border border-gray-200' : 'bg-[#0B1F3A] text-white'}`}>
                      <p className={`text-xs font-medium mb-1 ${isRep ? 'text-gray-500' : 'text-white/70'}`}>{msg.from}</p>
                      <p className={`text-sm ${isRep ? 'text-gray-700' : 'text-white'}`}>{msg.text}</p>
                      <p className={`text-[10px] mt-2 ${isRep ? 'text-gray-400' : 'text-white/50'}`}>
                        {new Date(msg.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}

              <div className="flex gap-2 mt-4">
                <input type="text" placeholder="Type a message..." className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#F0A500] focus:border-transparent outline-none" />
                <button className="px-4 py-3 bg-[#0B1F3A] text-white rounded-xl hover:bg-[#0B1F3A]/90 transition">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
