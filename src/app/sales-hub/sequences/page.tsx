"use client";
import { useState } from "react";
import { Zap, Mail, Phone, Clock, Users, ChevronDown } from "lucide-react";

const SEQUENCES = [
  { id: "1", name: "Cold Outreach - Solar", steps: [{ type: "email", label: "Intro Email" }, { type: "wait", label: "Wait 2 days" }, { type: "email", label: "Follow-up" }, { type: "wait", label: "Wait 3 days" }, { type: "call", label: "Phone Call" }, { type: "email", label: "Final Email" }], enrolled: 245, replied: 67, meetings: 23, status: "Active" },
  { id: "2", name: "Demo Follow-up", steps: [{ type: "email", label: "Thank You Email" }, { type: "wait", label: "Wait 1 day" }, { type: "email", label: "Proposal Recap" }, { type: "wait", label: "Wait 2 days" }, { type: "call", label: "Check-in Call" }], enrolled: 89, replied: 34, meetings: 18, status: "Active" },
  { id: "3", name: "Referral Outreach", steps: [{ type: "email", label: "Referral Intro" }, { type: "wait", label: "Wait 3 days" }, { type: "email", label: "Value Prop" }, { type: "wait", label: "Wait 4 days" }, { type: "call", label: "Personal Call" }], enrolled: 156, replied: 52, meetings: 28, status: "Active" },
  { id: "4", name: "Lost Deal Re-engage", steps: [{ type: "email", label: "Check-in Email" }, { type: "wait", label: "Wait 5 days" }, { type: "email", label: "New Offer" }, { type: "wait", label: "Wait 7 days" }, { type: "email", label: "Last Chance" }], enrolled: 78, replied: 12, meetings: 5, status: "Paused" },
  { id: "5", name: "Insurance Claim Follow-up", steps: [{ type: "email", label: "Claim Status Update" }, { type: "wait", label: "Wait 2 days" }, { type: "call", label: "Follow-up Call" }, { type: "email", label: "Next Steps" }], enrolled: 112, replied: 45, meetings: 15, status: "Active" },
];

const STEP_ICONS: Record<string, any> = { email: Mail, call: Phone, wait: Clock };

export default function SequencesPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#0B1F3A] to-[#1a3a5c] text-white px-8 py-8">
        <h1 className="text-2xl font-bold">Sales Sequences</h1>
        <p className="text-blue-200 text-sm mt-1">Automated outreach workflows</p>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-4 text-center"><div className="text-2xl font-bold text-blue-600">{SEQUENCES.reduce((s, sq) => s + sq.enrolled, 0)}</div><div className="text-xs text-gray-500">Total Enrolled</div></div>
          <div className="bg-white rounded-xl border p-4 text-center"><div className="text-2xl font-bold text-green-600">{(SEQUENCES.reduce((s, sq) => s + sq.replied, 0) / SEQUENCES.reduce((s, sq) => s + sq.enrolled, 0) * 100).toFixed(1)}%</div><div className="text-xs text-gray-500">Reply Rate</div></div>
          <div className="bg-white rounded-xl border p-4 text-center"><div className="text-2xl font-bold text-purple-600">{SEQUENCES.reduce((s, sq) => s + sq.meetings, 0)}</div><div className="text-xs text-gray-500">Meetings Booked</div></div>
        </div>
        <div className="space-y-3">
          {SEQUENCES.map(sq => (
            <div key={sq.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-sm transition-shadow">
              <div className="p-5 flex items-center gap-4 cursor-pointer" onClick={() => setExpanded(expanded === sq.id ? null : sq.id)}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${sq.status === "Active" ? "bg-green-100" : "bg-yellow-100"}`}><Zap size={18} className={sq.status === "Active" ? "text-green-600" : "text-yellow-600"} /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2"><h3 className="font-semibold">{sq.name}</h3><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${sq.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{sq.status}</span></div>
                  <p className="text-xs text-gray-500 mt-0.5">{sq.steps.length} steps · {sq.enrolled} enrolled</p>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="text-center"><div className="font-semibold text-gray-900">{sq.replied}</div><div className="text-[10px]">Replies</div></div>
                  <div className="text-center"><div className="font-semibold text-gray-900">{sq.meetings}</div><div className="text-[10px]">Meetings</div></div>
                  <ChevronDown size={16} className={`transition-transform ${expanded === sq.id ? "rotate-180" : ""}`} />
                </div>
              </div>
              {expanded === sq.id && (
                <div className="border-t px-5 py-4 bg-gray-50">
                  <div className="flex items-center gap-2">
                    {sq.steps.map((step, i) => { const Icon = STEP_ICONS[step.type] || Mail; return (
                      <div key={i} className="flex items-center gap-2">
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${step.type === "email" ? "bg-blue-50 text-blue-700" : step.type === "call" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}><Icon size={12} />{step.label}</div>
                        {i < sq.steps.length - 1 && <div className="w-4 h-px bg-gray-300" />}
                      </div>
                    );})}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
