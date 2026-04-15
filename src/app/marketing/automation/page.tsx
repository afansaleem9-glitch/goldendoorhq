"use client";
import { useState } from "react";
import { Zap, Play, Clock, Users, ChevronDown, CheckCircle } from "lucide-react";

const WORKFLOWS = [
  { id: "1", name: "Welcome Series", trigger: "New contact created", steps: 5, status: "Active", enrolled: 342, completed: 289, description: "Onboard new leads with 5-email sequence", stepsList: ["Welcome Email (Day 0)", "Company Overview (Day 2)", "Service Guide (Day 4)", "Customer Stories (Day 7)", "Book Consultation CTA (Day 10)"] },
  { id: "2", name: "Re-engagement Campaign", trigger: "No activity for 30 days", steps: 3, status: "Active", enrolled: 156, completed: 98, description: "Win back dormant contacts", stepsList: ["We Miss You Email", "Special Offer (Day 3)", "Final Follow-up (Day 7)"] },
  { id: "3", name: "Lead Nurture - Solar", trigger: "Solar lead form submitted", steps: 7, status: "Active", enrolled: 218, completed: 145, description: "Educate solar leads through the funnel", stepsList: ["Solar Guide Download", "ROI Calculator (Day 2)", "Case Study (Day 5)", "Incentives Info (Day 8)", "Consultation CTA (Day 12)", "Financing Options (Day 15)", "Final Push (Day 20)"] },
  { id: "4", name: "Post-Install Follow-up", trigger: "Installation completed", steps: 4, status: "Paused", enrolled: 89, completed: 72, description: "Ensure satisfaction after installation", stepsList: ["Thank You Email", "Satisfaction Survey (Day 7)", "Referral Request (Day 14)", "Review Request (Day 30)"] },
  { id: "5", name: "Lead Nurture - Security", trigger: "Security lead form submitted", steps: 5, status: "Active", enrolled: 167, completed: 120, description: "Convert security prospects", stepsList: ["Home Security Guide", "Package Comparison (Day 3)", "Customer Testimonial (Day 6)", "Free Assessment CTA (Day 10)", "Limited Offer (Day 14)"] },
  { id: "6", name: "Insurance Claim Follow-up", trigger: "Insurance claim tagged", steps: 3, status: "Draft", enrolled: 0, completed: 0, description: "Guide homeowners through claims process", stepsList: ["Claims Process Guide", "Documentation Checklist (Day 2)", "Schedule Inspection CTA (Day 5)"] },
];

export default function AutomationPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [workflows, setWorkflows] = useState(WORKFLOWS);

  const toggleStatus = (id: string) => {
    setWorkflows(ws => ws.map(w => w.id === id ? { ...w, status: w.status === "Active" ? "Paused" : "Active" } : w));
  };

  const active = workflows.filter(w => w.status === "Active").length;
  const totalEnrolled = workflows.reduce((s, w) => s + w.enrolled, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-teal-900 to-teal-700 text-white px-8 py-8">
        <h1 className="text-2xl font-bold">Marketing Automation</h1>
        <p className="text-teal-200 text-sm mt-1">Automated workflows and email sequences</p>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-4 text-center"><div className="text-2xl font-bold text-teal-600">{workflows.length}</div><div className="text-xs text-gray-500">Total Workflows</div></div>
          <div className="bg-white rounded-xl border p-4 text-center"><div className="text-2xl font-bold text-green-600">{active}</div><div className="text-xs text-gray-500">Active</div></div>
          <div className="bg-white rounded-xl border p-4 text-center"><div className="text-2xl font-bold text-blue-600">{totalEnrolled.toLocaleString()}</div><div className="text-xs text-gray-500">Total Enrolled</div></div>
        </div>
        <div className="space-y-3">
          {workflows.map(w => (
            <div key={w.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-sm transition-shadow">
              <div className="p-5 flex items-center gap-4 cursor-pointer" onClick={() => setExpanded(expanded === w.id ? null : w.id)}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${w.status === "Active" ? "bg-green-100" : w.status === "Paused" ? "bg-yellow-100" : "bg-gray-100"}`}>
                  <Zap size={18} className={w.status === "Active" ? "text-green-600" : w.status === "Paused" ? "text-yellow-600" : "text-gray-400"} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2"><h3 className="font-semibold">{w.name}</h3><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${w.status === "Active" ? "bg-green-100 text-green-700" : w.status === "Paused" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"}`}>{w.status}</span></div>
                  <p className="text-xs text-gray-500 mt-0.5">{w.description}</p>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="text-center"><div className="font-semibold text-gray-900">{w.steps}</div><div className="text-[10px]">Steps</div></div>
                  <div className="text-center"><div className="font-semibold text-gray-900">{w.enrolled}</div><div className="text-[10px]">Enrolled</div></div>
                  <button onClick={e => { e.stopPropagation(); toggleStatus(w.id); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${w.status === "Active" ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100" : "bg-green-50 text-green-700 hover:bg-green-100"}`}>{w.status === "Active" ? "Pause" : "Activate"}</button>
                  <ChevronDown size={16} className={`transition-transform ${expanded === w.id ? "rotate-180" : ""}`} />
                </div>
              </div>
              {expanded === w.id && (
                <div className="border-t px-5 py-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-3 text-xs text-gray-500"><Clock size={12} />Trigger: <span className="font-medium text-gray-700">{w.trigger}</span></div>
                  <div className="space-y-2">
                    {w.stepsList.map((step, i) => (
                      <div key={i} className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold">{i + 1}</div><span className="text-sm">{step}</span></div>
                    ))}
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
