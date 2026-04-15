"use client";
import { useState } from "react";
import {
  GitBranch, Plus, Search, Play, Pause, CheckCircle2,
  AlertCircle, Clock, Zap, Mail, MessageSquare, Bell,
  Users, Filter, ChevronRight, ToggleLeft, ToggleRight,
  ArrowRight, Settings, Copy, Trash2, Edit2, BarChart3
} from "lucide-react";

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "draft";
  trigger: string;
  trigger_type: string;
  actions: string[];
  enrollments_total: number;
  enrollments_active: number;
  success_rate: number;
  last_run: string;
  created_at: string;
  category: string;
}

const MOCK_WORKFLOWS: Workflow[] = [
  { id: "wf1", name: "New Lead Welcome Sequence", description: "Auto-enroll new leads from web forms into 5-email welcome drip", status: "active", trigger: "Contact created + Source = Website", trigger_type: "contact", actions: ["Send welcome email", "Wait 2 days", "Send solar info packet", "Wait 3 days", "Send consultation CTA", "Wait 5 days", "Send case study", "Wait 3 days", "Send final follow-up"], enrollments_total: 1247, enrollments_active: 89, success_rate: 34, last_run: "2 min ago", created_at: "Jan 10, 2026", category: "Lead Nurturing" },
  { id: "wf2", name: "Deal Stage Change Notification", description: "Notify deal owner and manager when deal moves to Contract stage", status: "active", trigger: "Deal stage changed to Contract Signed", trigger_type: "deal", actions: ["Send email to deal owner", "Send Slack notification to #sales", "Create task: Send welcome packet", "Update HubSpot"], enrollments_total: 342, enrollments_active: 0, success_rate: 98, last_run: "4 hours ago", created_at: "Feb 1, 2026", category: "Sales Ops" },
  { id: "wf3", name: "Solar Install Complete → Monitoring Setup", description: "After install marked complete, trigger monitoring onboarding", status: "active", trigger: "Solar project stage = Final Complete", trigger_type: "solar", actions: ["Create monitoring account", "Send homeowner monitoring guide", "Schedule 30-day check-in call", "Add to monthly report list"], enrollments_total: 156, enrollments_active: 12, success_rate: 96, last_run: "1 day ago", created_at: "Dec 15, 2025", category: "Operations" },
  { id: "wf4", name: "Stale Deal Re-engagement", description: "If deal untouched for 14+ days, trigger re-engagement", status: "active", trigger: "Deal last activity > 14 days", trigger_type: "deal", actions: ["Send re-engagement email", "Create task for owner: Call customer", "Wait 7 days", "If no activity: Notify manager", "Wait 7 more days", "If no activity: Move to Lost"], enrollments_total: 89, enrollments_active: 23, success_rate: 41, last_run: "6 hours ago", created_at: "Mar 1, 2026", category: "Sales Ops" },
  { id: "wf5", name: "Smart Home Monitoring Alert", description: "When ADC system goes offline, create ticket and notify team", status: "active", trigger: "Monitoring status = Offline for 2+ hours", trigger_type: "monitoring", actions: ["Create support ticket (Priority: High)", "Send SMS to assigned tech", "Send email to customer", "Notify #support Slack channel"], enrollments_total: 47, enrollments_active: 1, success_rate: 92, last_run: "18 hours ago", created_at: "Jan 20, 2026", category: "Service" },
  { id: "wf6", name: "Referral Program Trigger", description: "After install complete + 30 days, send referral program invite", status: "active", trigger: "30 days after install complete", trigger_type: "solar", actions: ["Send referral program email", "Wait 14 days", "Send reminder with incentive", "Create task: Personal follow-up call"], enrollments_total: 203, enrollments_active: 34, success_rate: 28, last_run: "3 hours ago", created_at: "Feb 15, 2026", category: "Marketing" },
  { id: "wf7", name: "Contract Expiry Reminder", description: "60-day warning before monitoring contracts expire", status: "paused", trigger: "Contract end date in 60 days", trigger_type: "contract", actions: ["Send renewal reminder email", "Create task: Renewal call", "Wait 30 days", "Send urgent renewal notice", "Notify manager"], enrollments_total: 34, enrollments_active: 0, success_rate: 78, last_run: "2 weeks ago", created_at: "Mar 10, 2026", category: "Service" },
  { id: "wf8", name: "AT&T Bundle Upsell", description: "Cross-sell AT&T fiber to solar customers after install", status: "draft", trigger: "Solar install complete + No AT&T service", trigger_type: "solar", actions: ["Wait 7 days", "Send AT&T bundle email", "Wait 5 days", "Create task: Bundle consultation call", "If interested: Create AT&T deal"], enrollments_total: 0, enrollments_active: 0, success_rate: 0, last_run: "—", created_at: "Apr 10, 2026", category: "Marketing" },
];

const STATUS_CFG = {
  active: { label: "Active", color: "bg-green-50 text-green-700", dot: "bg-green-500" },
  paused: { label: "Paused", color: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  draft: { label: "Draft", color: "bg-gray-100 text-gray-500", dot: "bg-gray-400" },
};

const CATEGORIES = ["All", "Lead Nurturing", "Sales Ops", "Operations", "Service", "Marketing"];

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState(MOCK_WORKFLOWS);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = workflows.filter(wf => {
    const matchSearch = search === "" || wf.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "All" || wf.category === catFilter;
    const matchStatus = statusFilter === "all" || wf.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const toggleStatus = (id: string) => {
    setWorkflows(prev => prev.map(wf => wf.id === id ? { ...wf, status: wf.status === "active" ? "paused" : "active" } as Workflow : wf));
  };

  const totalEnrolled = workflows.reduce((s, w) => s + w.enrollments_active, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black flex items-center gap-2"><GitBranch size={24} /> Workflows</h1>
            <p className="text-sm text-gray-500 mt-1">Automation engine — {workflows.filter(w => w.status === "active").length} active workflows, {totalEnrolled} currently enrolled</p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"><Plus size={14} /> Create Workflow</button>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Active Workflows", value: workflows.filter(w => w.status === "active").length, icon: Play },
            { label: "Currently Enrolled", value: totalEnrolled, icon: Users },
            { label: "Total Enrollments", value: workflows.reduce((s, w) => s + w.enrollments_total, 0).toLocaleString(), icon: BarChart3 },
            { label: "Avg Success Rate", value: `${(workflows.filter(w => w.success_rate > 0).reduce((s, w) => s + w.success_rate, 0) / workflows.filter(w => w.success_rate > 0).length).toFixed(0)}%`, icon: CheckCircle2 },
          ].map(kpi => {
            const K = kpi.icon;
            return (
              <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-5">
                <K size={18} className="text-gray-500 mb-2" />
                <p className="text-2xl font-bold text-black">{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 max-w-md focus-within:border-black transition-all">
            <Search size={14} className="text-gray-500 mr-2" />
            <input type="text" placeholder="Search workflows..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 text-sm outline-none bg-transparent text-black placeholder-gray-400" aria-label="Search workflows" />
          </div>
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-black outline-none focus:border-black" aria-label="Filter by category">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          {(["all", "active", "paused", "draft"] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${statusFilter === s ? "bg-black text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Workflow Cards */}
        <div className="space-y-3">
          {filtered.map(wf => {
            const sc = STATUS_CFG[wf.status];
            return (
              <div key={wf.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-black">{wf.name}</h3>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${sc.color}`}>{sc.label}</span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-500">{wf.category}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{wf.description}</p>
                    {/* Trigger */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] font-bold text-gray-500 uppercase w-14">Trigger</span>
                      <span className="text-xs text-black font-medium bg-gray-50 px-2 py-1 rounded flex items-center gap-1"><Zap size={10} className="text-amber-500" /> {wf.trigger}</span>
                    </div>
                    {/* Action chain */}
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-[11px] font-bold text-gray-500 uppercase w-14 shrink-0">Actions</span>
                      {wf.actions.slice(0, 5).map((action, i) => (
                        <span key={i} className="flex items-center gap-0.5">
                          <span className="text-[11px] text-gray-600 bg-gray-50 px-1.5 py-0.5 rounded">{action}</span>
                          {i < Math.min(wf.actions.length, 5) - 1 && <ArrowRight size={8} className="text-gray-300 mx-0.5" />}
                        </span>
                      ))}
                      {wf.actions.length > 5 && <span className="text-[11px] text-gray-500 ml-1">+{wf.actions.length - 5} more</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-6 shrink-0">
                    <div className="text-center">
                      <p className="text-lg font-bold text-black">{wf.enrollments_active}</p>
                      <p className="text-[11px] text-gray-500">Active</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-black">{wf.enrollments_total.toLocaleString()}</p>
                      <p className="text-[11px] text-gray-500">Total</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-lg font-bold ${wf.success_rate >= 80 ? "text-green-600" : wf.success_rate >= 40 ? "text-amber-600" : wf.success_rate > 0 ? "text-gray-600" : "text-gray-300"}`}>{wf.success_rate > 0 ? `${wf.success_rate}%` : "—"}</p>
                      <p className="text-[11px] text-gray-500">Success</p>
                    </div>
                    <button onClick={() => toggleStatus(wf.id)} className="text-gray-500 hover:text-black transition-colors" aria-label={`Toggle ${wf.name}`}>
                      {wf.status === "active" ? <ToggleRight size={24} className="text-green-600" /> : <ToggleLeft size={24} />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  <span className="text-[11px] text-gray-500">Last run: {wf.last_run} · Created: {wf.created_at}</span>
                  <div className="flex items-center gap-2">
                    <button className="text-[11px] font-semibold text-gray-500 hover:text-black flex items-center gap-1"><Edit2 size={10} /> Edit</button>
                    <button className="text-[11px] font-semibold text-gray-500 hover:text-black flex items-center gap-1"><Copy size={10} /> Clone</button>
                    <button className="text-[11px] font-semibold text-gray-500 hover:text-black flex items-center gap-1"><BarChart3 size={10} /> Analytics</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
