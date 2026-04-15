"use client";
import { useState } from "react";
import { Mail, Plus, Search, Play, Pause, Clock, Users, CheckCircle2, BarChart3, Edit2, Copy, Send, MessageSquare, Phone, ArrowRight, ToggleLeft, ToggleRight } from "lucide-react";

interface Sequence {
  id: string; name: string; description: string; status: "active" | "paused" | "draft";
  steps: { type: string; label: string; delay: string }[];
  enrolled: number; active: number; completed: number;
  open_rate: number; reply_rate: number; meeting_rate: number;
  created_at: string; owner: string;
}

const MOCK: Sequence[] = [
  { id: "sq1", name: "Solar Cold Outreach", description: "5-step sequence for new solar leads from Facebook/Google ads", status: "active",
    steps: [{ type: "email", label: "Intro + savings estimate", delay: "Immediately" }, { type: "email", label: "Case study — neighbor saved $X", delay: "Day 3" }, { type: "call", label: "Discovery call attempt", delay: "Day 5" }, { type: "email", label: "Limited-time incentive", delay: "Day 8" }, { type: "call", label: "Final follow-up", delay: "Day 12" }],
    enrolled: 847, active: 124, completed: 612, open_rate: 42, reply_rate: 12, meeting_rate: 8, created_at: "Feb 1, 2026", owner: "Marcus Johnson" },
  { id: "sq2", name: "Smart Home Post-Install Upsell", description: "Cross-sell additional cameras and sensors after initial install", status: "active",
    steps: [{ type: "email", label: "How's your new system?", delay: "Day 7" }, { type: "email", label: "Did you know: Extra camera benefits", delay: "Day 14" }, { type: "call", label: "Quick check-in + upsell", delay: "Day 21" }],
    enrolled: 203, active: 34, completed: 156, open_rate: 58, reply_rate: 18, meeting_rate: 14, created_at: "Jan 15, 2026", owner: "David Park" },
  { id: "sq3", name: "Roofing Estimate Follow-up", description: "Re-engage homeowners who got a free roof inspection", status: "active",
    steps: [{ type: "email", label: "Your roof report + photos", delay: "Day 1" }, { type: "sms", label: "Quick reminder — questions?", delay: "Day 4" }, { type: "email", label: "Before/after gallery + financing options", delay: "Day 7" }, { type: "call", label: "Schedule decision call", delay: "Day 10" }, { type: "email", label: "Storm season is coming", delay: "Day 14" }],
    enrolled: 156, active: 41, completed: 98, open_rate: 51, reply_rate: 15, meeting_rate: 11, created_at: "Mar 5, 2026", owner: "Lisa Rodriguez" },
  { id: "sq4", name: "AT&T Bundle Pitch", description: "Pitch AT&T Fiber + Smart Home to existing solar customers", status: "paused",
    steps: [{ type: "email", label: "Save on internet + security", delay: "Immediately" }, { type: "email", label: "Bundle savings breakdown", delay: "Day 5" }, { type: "call", label: "Bundle consultation", delay: "Day 8" }],
    enrolled: 78, active: 0, completed: 52, open_rate: 38, reply_rate: 9, meeting_rate: 6, created_at: "Mar 20, 2026", owner: "Marcus Johnson" },
  { id: "sq5", name: "Referral Ask", description: "Ask satisfied customers for referrals 30 days post-install", status: "active",
    steps: [{ type: "email", label: "How's everything going?", delay: "Day 30" }, { type: "email", label: "$500 for every friend you refer", delay: "Day 37" }, { type: "sms", label: "Referral link reminder", delay: "Day 44" }],
    enrolled: 312, active: 67, completed: 198, open_rate: 62, reply_rate: 22, meeting_rate: 0, created_at: "Feb 10, 2026", owner: "David Park" },
  { id: "sq6", name: "Lost Deal Re-engagement", description: "Re-approach deals that went cold or were lost", status: "draft",
    steps: [{ type: "email", label: "Things have changed — new pricing", delay: "Day 90" }, { type: "email", label: "New incentives available", delay: "Day 97" }, { type: "call", label: "Re-discovery call", delay: "Day 104" }],
    enrolled: 0, active: 0, completed: 0, open_rate: 0, reply_rate: 0, meeting_rate: 0, created_at: "Apr 12, 2026", owner: "Marcus Johnson" },
];

const STEP_ICON: Record<string, typeof Mail> = { email: Mail, call: Phone, sms: MessageSquare };
const STATUS_CFG = { active: { label: "Active", color: "bg-green-50 text-green-700" }, paused: { label: "Paused", color: "bg-amber-50 text-amber-700" }, draft: { label: "Draft", color: "bg-gray-100 text-gray-500" } };

export default function SequencesPage() {
  const [sequences, setSequences] = useState(MOCK);
  const [search, setSearch] = useState("");

  const filtered = sequences.filter(s => search === "" || s.name.toLowerCase().includes(search.toLowerCase()));
  const toggle = (id: string) => setSequences(prev => prev.map(s => s.id === id ? { ...s, status: s.status === "active" ? "paused" : "active" } as Sequence : s));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black flex items-center gap-2"><Send size={24} /> Sequences</h1>
            <p className="text-sm text-gray-500 mt-1">Automated multi-step outreach — {sequences.filter(s => s.status === "active").length} active</p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800"><Plus size={14} /> Create Sequence</button>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Active Sequences", value: sequences.filter(s => s.status === "active").length },
            { label: "Currently Enrolled", value: sequences.reduce((s, sq) => s + sq.active, 0) },
            { label: "Avg Open Rate", value: `${(sequences.filter(s => s.open_rate > 0).reduce((s, sq) => s + sq.open_rate, 0) / sequences.filter(s => s.open_rate > 0).length).toFixed(0)}%` },
            { label: "Avg Reply Rate", value: `${(sequences.filter(s => s.reply_rate > 0).reduce((s, sq) => s + sq.reply_rate, 0) / sequences.filter(s => s.reply_rate > 0).length).toFixed(0)}%` },
          ].map(kpi => (
            <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-2xl font-bold text-black">{kpi.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 max-w-md focus-within:border-black transition-all">
            <Search size={14} className="text-gray-500 mr-2" />
            <input type="text" placeholder="Search sequences..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 text-sm outline-none bg-transparent text-black placeholder-gray-400" aria-label="Search sequences" />
          </div>
        </div>
        <div className="space-y-3">
          {filtered.map(seq => {
            const sc = STATUS_CFG[seq.status];
            return (
              <div key={seq.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-black">{seq.name}</h3>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${sc.color}`}>{sc.label}</span>
                    </div>
                    <p className="text-xs text-gray-500">{seq.description}</p>
                    <p className="text-[11px] text-gray-500 mt-1">Owner: {seq.owner} · Created: {seq.created_at}</p>
                  </div>
                  <button onClick={() => toggle(seq.id)} className="text-gray-500 hover:text-black" aria-label={`Toggle ${seq.name}`}>
                    {seq.status === "active" ? <ToggleRight size={24} className="text-green-600" /> : <ToggleLeft size={24} />}
                  </button>
                </div>
                {/* Step chain */}
                <div className="flex items-center gap-1 mb-4 flex-wrap">
                  {seq.steps.map((step, i) => {
                    const SIcon = STEP_ICON[step.type] || Mail;
                    return (
                      <span key={i} className="flex items-center gap-0.5">
                        <span className="flex items-center gap-1 text-[11px] text-gray-700 bg-gray-50 px-2 py-1 rounded border border-gray-200/60">
                          <SIcon size={10} className="text-gray-500" />
                          <span className="font-medium">{step.label}</span>
                          <span className="text-gray-500 ml-1">{step.delay}</span>
                        </span>
                        {i < seq.steps.length - 1 && <ArrowRight size={8} className="text-gray-300 mx-0.5" />}
                      </span>
                    );
                  })}
                </div>
                {/* Stats */}
                <div className="flex items-center gap-6 pt-3 border-t border-gray-50">
                  {[
                    { label: "Enrolled", value: seq.enrolled },
                    { label: "Active", value: seq.active },
                    { label: "Completed", value: seq.completed },
                    { label: "Open Rate", value: seq.open_rate > 0 ? `${seq.open_rate}%` : "—" },
                    { label: "Reply Rate", value: seq.reply_rate > 0 ? `${seq.reply_rate}%` : "—" },
                    { label: "Meeting Rate", value: seq.meeting_rate > 0 ? `${seq.meeting_rate}%` : "—" },
                  ].map(stat => (
                    <div key={stat.label} className="text-center">
                      <p className="text-sm font-bold text-black">{stat.value}</p>
                      <p className="text-[11px] text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
