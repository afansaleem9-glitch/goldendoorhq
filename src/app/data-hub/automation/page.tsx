"use client";
import { useState } from "react";
import { Zap, Plus, Play, Pause, Code, GitBranch, Clock, CheckCircle, AlertTriangle, ChevronDown, ChevronRight, Settings, Trash2 } from "lucide-react";

interface Workflow {
  id: string;
  name: string;
  trigger: string;
  status: string;
  runs_total: number;
  runs_success: number;
  runs_failed: number;
  last_run: string;
  steps: { type: string; label: string; config: string }[];
  code?: string;
}

const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: "1", name: "Lead Scoring Engine", trigger: "Contact Created/Updated", status: "active", runs_total: 14523, runs_success: 14498, runs_failed: 25, last_run: "2 min ago",
    steps: [
      { type: "trigger", label: "Contact Created or Updated", config: "Any property change" },
      { type: "code", label: "Calculate Lead Score", config: "JavaScript function" },
      { type: "condition", label: "Score > 80?", config: "If score >= 80" },
      { type: "action", label: "Assign to Sales Rep", config: "Round-robin assignment" },
      { type: "action", label: "Send Slack Notification", config: "#sales-leads channel" },
    ],
    code: `// Lead Scoring Engine\nfunction score(contact) {\n  let s = 0;\n  if (contact.email) s += 10;\n  if (contact.phone) s += 15;\n  if (contact.company) s += 20;\n  if (contact.visits > 5) s += 25;\n  if (contact.form_submissions > 0) s += 30;\n  return s;\n}`
  },
  {
    id: "2", name: "Deal Stage Automation", trigger: "Deal Updated", status: "active", runs_total: 3891, runs_success: 3880, runs_failed: 11, last_run: "15 min ago",
    steps: [
      { type: "trigger", label: "Deal Stage Changed", config: "pipeline_stage property" },
      { type: "code", label: "Update Close Probability", config: "Based on stage mapping" },
      { type: "action", label: "Create Follow-up Task", config: "Assigned to deal owner" },
      { type: "action", label: "Update Revenue Forecast", config: "Recalculate weighted pipeline" },
    ],
  },
  {
    id: "3", name: "Renewal Reminder Workflow", trigger: "Scheduled (Daily)", status: "active", runs_total: 365, runs_success: 360, runs_failed: 5, last_run: "6 hrs ago",
    steps: [
      { type: "trigger", label: "Daily at 8:00 AM", config: "Cron schedule" },
      { type: "code", label: "Find Expiring Contracts", config: "Next 30 days" },
      { type: "condition", label: "Any found?", config: "If count > 0" },
      { type: "action", label: "Create Tasks for Reps", config: "Per contract owner" },
      { type: "action", label: "Send Email to Customer", config: "Renewal reminder template" },
    ],
  },
  {
    id: "4", name: "Data Enrichment Pipeline", trigger: "Contact Created", status: "active", runs_total: 8934, runs_success: 8712, runs_failed: 222, last_run: "5 min ago",
    steps: [
      { type: "trigger", label: "New Contact Created", config: "Via any source" },
      { type: "code", label: "Lookup Company Data", config: "Clearbit/Apollo API" },
      { type: "action", label: "Enrich Contact Record", config: "Fill missing fields" },
      { type: "action", label: "Assign Lead Source Tag", config: "Based on origin" },
    ],
  },
  {
    id: "5", name: "SLA Escalation Engine", trigger: "Ticket Updated", status: "active", runs_total: 2156, runs_success: 2150, runs_failed: 6, last_run: "1 hr ago",
    steps: [
      { type: "trigger", label: "Ticket SLA Timer", config: "Response/resolution time" },
      { type: "condition", label: "SLA Breached?", config: "If time > threshold" },
      { type: "action", label: "Escalate Priority", config: "Bump priority level" },
      { type: "action", label: "Notify Manager", config: "Email + Slack DM" },
    ],
  },
  {
    id: "6", name: "Invoice Auto-Generation", trigger: "Deal Closed Won", status: "paused", runs_total: 567, runs_success: 560, runs_failed: 7, last_run: "3 days ago",
    steps: [
      { type: "trigger", label: "Deal moved to Closed Won", config: "Stage change" },
      { type: "code", label: "Generate Invoice Data", config: "From deal + line items" },
      { type: "action", label: "Create Invoice", config: "In Commerce Hub" },
      { type: "action", label: "Send to Customer", config: "Via email" },
    ],
  },
];

export default function AutomationPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(MOCK_WORKFLOWS);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showCode, setShowCode] = useState<string | null>(null);

  const totalRuns = workflows.reduce((a, w) => a + w.runs_total, 0);
  const successRate = Math.round((workflows.reduce((a, w) => a + w.runs_success, 0) / Math.max(totalRuns, 1)) * 100);

  const stepIcon: Record<string, any> = { trigger: Zap, code: Code, condition: GitBranch, action: CheckCircle };
  const stepColor: Record<string, string> = { trigger: "bg-yellow-100 text-yellow-600", code: "bg-purple-100 text-purple-600", condition: "bg-blue-100 text-blue-600", action: "bg-green-100 text-green-600" };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2"><Zap className="w-8 h-8" /><h1 className="text-3xl font-bold">Programmable Automation</h1></div>
            <p className="text-purple-200">Build custom automations with JavaScript. Webhooks, data transforms, conditional logic.</p>
          </div>
          <button className="bg-white text-purple-700 px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-purple-50"><Plus className="w-5 h-5" /> New Workflow</button>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[
            { label: "Active Workflows", val: workflows.filter((w) => w.status === "active").length },
            { label: "Total Runs", val: totalRuns.toLocaleString() },
            { label: "Success Rate", val: `${successRate}%` },
            { label: "Failed Runs", val: workflows.reduce((a, w) => a + w.runs_failed, 0) },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold">{s.val}</div>
              <div className="text-purple-200 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {workflows.map((w) => (
          <div key={w.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-5 cursor-pointer hover:bg-gray-50" onClick={() => setExpanded(expanded === w.id ? null : w.id)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {expanded === w.id ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><Zap className="w-5 h-5 text-purple-600" /></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{w.name}</h3>
                    <p className="text-sm text-gray-500">Trigger: {w.trigger} • {w.runs_total.toLocaleString()} runs • Last: {w.last_run}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${w.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{w.status}</span>
                  <button className="p-2 text-gray-400 hover:text-purple-600">{w.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
                </div>
              </div>
            </div>
            {expanded === w.id && (
              <div className="border-t border-gray-200 p-5 bg-gray-50">
                <div className="flex gap-6">
                  <div className="flex-1 space-y-3">
                    <h4 className="font-medium text-gray-700 text-sm">Workflow Steps</h4>
                    {w.steps.map((s, i) => {
                      const Icon = stepIcon[s.type] || Zap;
                      return (
                        <div key={i} className="flex items-center gap-3">
                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stepColor[s.type]}`}><Icon className="w-4 h-4" /></div>
                            {i < w.steps.length - 1 && <div className="w-0.5 h-6 bg-gray-300 mt-1" />}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{s.label}</div>
                            <div className="text-xs text-gray-500">{s.config}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {w.code && (
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-700 text-sm mb-2">Code</h4>
                      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">{w.code}</pre>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2"><Play className="w-4 h-4" /> Run Now</button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 flex items-center gap-2"><Settings className="w-4 h-4" /> Edit</button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 flex items-center gap-2"><Code className="w-4 h-4" /> View Logs</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
