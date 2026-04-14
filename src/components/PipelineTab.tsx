"use client";
import { useState } from "react";
import {
  ChevronDown, ChevronRight, CheckCircle2, Clock, AlertTriangle,
  Phone, FileText, Wrench, ClipboardList, User, Calendar, MapPin,
  ArrowRight, MessageSquare, Plus, MoreHorizontal, Search
} from "lucide-react";

interface PipelineTask {
  id: string;
  title: string;
  assignee?: string;
  dueDate?: string;
  status: "complete" | "in_progress" | "blocked" | "pending" | "skipped";
  priority?: "high" | "medium" | "low";
  description?: string;
  completedDate?: string;
}

interface PipelineStage {
  id: string;
  name: string;
  order: number;
  status: "complete" | "active" | "upcoming" | "skipped";
  enteredDate?: string;
  completedDate?: string;
  tasks: PipelineTask[];
  color: string;
}

const pipelineStages: PipelineStage[] = [
  {
    id: "customer_contact", name: "Customer Contact", order: 1, status: "complete",
    enteredDate: "May 05, 2025", completedDate: "May 05, 2025", color: "bg-green-500",
    tasks: [
      { id: "cc1", title: "Initial contact made", status: "complete", assignee: "Matthew Johnson", completedDate: "May 05, 2025" },
      { id: "cc2", title: "Customer credit check completed", status: "complete", assignee: "System Auto", completedDate: "May 05, 2025" },
      { id: "cc3", title: "Welcome email sent", status: "complete", assignee: "System Auto", completedDate: "May 05, 2025" },
    ]
  },
  {
    id: "survey", name: "Survey", order: 2, status: "complete",
    enteredDate: "May 06, 2025", completedDate: "May 14, 2025", color: "bg-green-500",
    tasks: [
      { id: "sv1", title: "Survey scheduled", status: "complete", assignee: "Robert Dellavecchia", completedDate: "May 06, 2025" },
      { id: "sv2", title: "Site survey completed", status: "complete", assignee: "Robert Dellavecchia", completedDate: "May 07, 2025" },
      { id: "sv3", title: "Photos uploaded", status: "complete", assignee: "Robert Dellavecchia", completedDate: "May 07, 2025" },
      { id: "sv4", title: "Structural assessment passed", status: "complete", assignee: "Engineering Team", completedDate: "May 14, 2025" },
    ]
  },
  {
    id: "design", name: "Design", order: 3, status: "complete",
    enteredDate: "May 15, 2025", completedDate: "May 23, 2025", color: "bg-green-500",
    tasks: [
      { id: "ds1", title: "System design created", status: "complete", assignee: "LIGHTSPEED Automation", completedDate: "May 16, 2025" },
      { id: "ds2", title: "Design review completed", status: "complete", assignee: "Austin Radford", completedDate: "May 20, 2025" },
      { id: "ds3", title: "Customer design approval", status: "complete", assignee: "Lynna Dy", completedDate: "May 23, 2025" },
    ]
  },
  {
    id: "account_review", name: "Account Review", order: 4, status: "complete",
    enteredDate: "May 23, 2025", completedDate: "May 28, 2025", color: "bg-green-500",
    tasks: [
      { id: "ar1", title: "Financial review completed", status: "complete", assignee: "Finance Team", completedDate: "May 24, 2025" },
      { id: "ar2", title: "Contract verification", status: "complete", assignee: "Samuel Elliott", completedDate: "May 26, 2025" },
      { id: "ar3", title: "Account approved", status: "complete", assignee: "Austin Radford", completedDate: "May 28, 2025" },
    ]
  },
  {
    id: "scope_of_work", name: "Scope of Work", order: 5, status: "complete",
    enteredDate: "May 29, 2025", completedDate: "Jun 09, 2025", color: "bg-green-500",
    tasks: [
      { id: "sw1", title: "SOW v1.0 generated", status: "complete", assignee: "LIGHTSPEED Automation", completedDate: "May 29, 2025" },
      { id: "sw2", title: "SOW revised to v1.3", status: "complete", assignee: "LIGHTSPEED Automation", completedDate: "Jun 05, 2025" },
      { id: "sw3", title: "SOW approved", status: "complete", assignee: "Austin Radford", completedDate: "Jun 09, 2025" },
    ]
  },
  {
    id: "permits", name: "Permits", order: 6, status: "complete",
    enteredDate: "Jun 09, 2025", completedDate: "Jun 23, 2025", color: "bg-green-500",
    tasks: [
      { id: "pm1", title: "Permit application submitted", status: "complete", assignee: "Permitting Team", completedDate: "Jun 10, 2025" },
      { id: "pm2", title: "HOA approval received", status: "complete", assignee: "HOA Coordinator", completedDate: "Jun 18, 2025" },
      { id: "pm3", title: "AHJ permit approved", status: "complete", assignee: "City of Mesquite", completedDate: "Jun 23, 2025" },
    ]
  },
  {
    id: "stamps", name: "Stamps", order: 7, status: "complete",
    enteredDate: "Jun 23, 2025", completedDate: "Jul 30, 2025", color: "bg-green-500",
    tasks: [
      { id: "st1", title: "PE stamp requested", status: "complete", assignee: "Engineering", completedDate: "Jun 24, 2025" },
      { id: "st2", title: "PE stamp received", status: "complete", assignee: "Engineering", completedDate: "Jul 30, 2025" },
    ]
  },
  {
    id: "installs", name: "Installs", order: 8, status: "complete",
    enteredDate: "Jan 28, 2026", completedDate: "Feb 27, 2026", color: "bg-green-500",
    tasks: [
      { id: "in1", title: "Install scheduled", status: "complete", assignee: "Maria Montano Siguenza", completedDate: "Jan 28, 2026" },
      { id: "in2", title: "Material delivery confirmed", status: "complete", assignee: "Warehouse", completedDate: "Jun 16, 2025" },
      { id: "in3", title: "PV Install Day 1", status: "complete", assignee: "Install Crew", completedDate: "Jun 18, 2025", description: "Crew: Nelson Bonilla" },
      { id: "in4", title: "PV Install Day 2", status: "complete", assignee: "Install Crew", completedDate: "Jun 19, 2025" },
      { id: "in5", title: "Additional Install Day", status: "complete", assignee: "Install Crew", completedDate: "Jun 20, 2025" },
      { id: "in6", title: "Installation QA passed", status: "complete", assignee: "QA Inspector", completedDate: "Feb 27, 2026" },
    ]
  },
  {
    id: "inspections", name: "Inspections", order: 9, status: "complete",
    enteredDate: "Feb 28, 2026", completedDate: "Mar 26, 2026", color: "bg-green-500",
    tasks: [
      { id: "is1", title: "Inspection scheduled", status: "complete", assignee: "Christopher Smith", completedDate: "Feb 28, 2026" },
      { id: "is2", title: "PV Final inspection", status: "complete", assignee: "AHJ Inspector", completedDate: "Mar 26, 2026", description: "AHJ - Confirmed" },
    ]
  },
  {
    id: "interconnection", name: "Interconnection", order: 10, status: "complete",
    enteredDate: "Mar 01, 2026", completedDate: "Mar 18, 2026", color: "bg-green-500",
    tasks: [
      { id: "ic1", title: "Interconnection application submitted", status: "complete", assignee: "Angelique Harper", completedDate: "Mar 01, 2026" },
      { id: "ic2", title: "Utility documents sent for signature", status: "complete", assignee: "Angelique Harper", completedDate: "Mar 07, 2026" },
      { id: "ic3", title: "Interconnection agreement complete", status: "complete", assignee: "Lotoannalelei Tootoo", completedDate: "Mar 08, 2026" },
      { id: "ic4", title: "PTO granted by Oncor", status: "complete", assignee: "Oncor Electric Delivery", completedDate: "Mar 18, 2026" },
    ]
  },
  {
    id: "monitoring", name: "Monitoring", order: 11, status: "complete",
    enteredDate: "Mar 18, 2026", completedDate: "Mar 25, 2026", color: "bg-green-500",
    tasks: [
      { id: "mn1", title: "Monitoring activation emails sent", status: "complete", assignee: "Brianna Warren", completedDate: "Jul 08, 2025" },
      { id: "mn2", title: "System connected to monitoring", status: "complete", assignee: "Monitoring Team", completedDate: "Mar 20, 2026" },
      { id: "mn3", title: "System performance verified", status: "complete", assignee: "Timothy Rosenberger", completedDate: "Mar 25, 2026" },
    ]
  },
  {
    id: "processing", name: "Processing", order: 12, status: "complete",
    enteredDate: "Mar 25, 2026", completedDate: "Mar 26, 2026", color: "bg-green-500",
    tasks: [
      { id: "pr1", title: "Final documentation compiled", status: "complete", assignee: "Processing Team", completedDate: "Mar 25, 2026" },
      { id: "pr2", title: "Quality review passed", status: "complete", assignee: "QA Team", completedDate: "Mar 26, 2026" },
    ]
  },
  {
    id: "accounts_payable", name: "Accounts Payable", order: 13, status: "complete",
    enteredDate: "Mar 26, 2026", completedDate: "Mar 27, 2026", color: "bg-green-500",
    tasks: [
      { id: "ap1", title: "Invoice generated", status: "complete", assignee: "Finance", completedDate: "Mar 26, 2026" },
      { id: "ap2", title: "Payment to dealer processed", status: "complete", assignee: "Finance", completedDate: "Mar 27, 2026" },
    ]
  },
  {
    id: "accounts_receivable", name: "Accounts Receivable", order: 14, status: "complete",
    enteredDate: "Mar 27, 2026", completedDate: "Mar 28, 2026", color: "bg-green-500",
    tasks: [
      { id: "ar1b", title: "Funding received from financier", status: "complete", assignee: "Finance", completedDate: "Mar 28, 2026" },
      { id: "ar2b", title: "Revenue recognized", status: "complete", assignee: "Accounting", completedDate: "Mar 28, 2026" },
    ]
  },
  {
    id: "service", name: "Service", order: 15, status: "complete",
    enteredDate: "Mar 28, 2026", completedDate: "Mar 28, 2026", color: "bg-green-500",
    tasks: [
      { id: "sr1", title: "Project transitioned to service", status: "complete", assignee: "System Auto", completedDate: "Mar 28, 2026" },
      { id: "sr2", title: "Warranty period started", status: "complete", assignee: "System Auto", completedDate: "Mar 28, 2026" },
    ]
  },
  {
    id: "schedule_service", name: "Schedule Service Visit", order: 16, status: "upcoming",
    color: "bg-gray-400",
    tasks: [
      { id: "ssv1", title: "Schedule annual service visit", status: "pending", assignee: "Service Team", dueDate: "Mar 28, 2027" },
    ]
  },
  {
    id: "field_visit_review", name: "Field Visit Review", order: 17, status: "upcoming",
    color: "bg-gray-400",
    tasks: [
      { id: "fvr1", title: "Review field visit results", status: "pending" },
    ]
  },
  {
    id: "pipeline_management", name: "Pipeline Management", order: 18, status: "complete",
    enteredDate: "Mar 28, 2026", completedDate: "Mar 28, 2026", color: "bg-green-500",
    tasks: [
      { id: "plm1", title: "Final pipeline review", status: "complete", assignee: "Austin Radford", completedDate: "Mar 28, 2026" },
      { id: "plm2", title: "Project marked Final Completed", status: "complete", assignee: "System Auto", completedDate: "Mar 28, 2026" },
    ]
  },
];

const statusIcons: Record<string, { icon: typeof CheckCircle2; color: string }> = {
  complete: { icon: CheckCircle2, color: "text-green-500" },
  in_progress: { icon: Clock, color: "text-blue-500" },
  blocked: { icon: AlertTriangle, color: "text-red-500" },
  pending: { icon: Clock, color: "text-gray-300" },
  skipped: { icon: ArrowRight, color: "text-gray-400" },
};

export function PipelineTab() {
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set(["customer_contact"]));
  const [searchQuery, setSearchQuery] = useState("");

  const toggleStage = (id: string) => {
    setExpandedStages(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpandedStages(new Set(pipelineStages.map(s => s.id)));
  const collapseAll = () => setExpandedStages(new Set());

  const completedCount = pipelineStages.filter(s => s.status === "complete").length;
  const progressPct = Math.round((completedCount / pipelineStages.length) * 100);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#0B1F3A]">Pipeline Progress</h3>
          <p className="text-sm text-gray-500">{completedCount} of {pipelineStages.length} stages complete</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search stages..."
              className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#007A67] w-48"
            />
          </div>
          <button onClick={expandAll} className="px-3 py-1.5 text-xs text-[#007A67] font-medium hover:bg-green-50 rounded-lg">Expand All</button>
          <button onClick={collapseAll} className="px-3 py-1.5 text-xs text-gray-500 font-medium hover:bg-gray-50 rounded-lg">Collapse All</button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#007A67] to-green-400 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
      </div>
      <p className="text-xs text-gray-400 text-right">{progressPct}% Complete</p>

      {/* Stages */}
      <div className="space-y-2">
        {pipelineStages
          .filter(s => !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.tasks.some(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())))
          .map((stage, idx) => {
            const isExpanded = expandedStages.has(stage.id);
            const completedTasks = stage.tasks.filter(t => t.status === "complete").length;
            const stageStatusColor = stage.status === "complete" ? "border-green-200 bg-green-50/30" : stage.status === "active" ? "border-blue-200 bg-blue-50/30" : "border-gray-200 bg-white";

            return (
              <div key={stage.id} className={`border rounded-xl overflow-hidden transition-all ${stageStatusColor}`}>
                {/* Stage Header */}
                <button
                  onClick={() => toggleStage(stage.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50/50 transition-all"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {/* Order Badge */}
                    <div className={`w-8 h-8 rounded-full ${stage.color} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
                      {stage.status === "complete" ? <CheckCircle2 className="w-4 h-4" /> : stage.order}
                    </div>

                    {/* Stage Name */}
                    <div className="text-left flex-1">
                      <p className="font-semibold text-sm text-[#0B1F3A]">{stage.name}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        {stage.enteredDate && <span>Entered: {stage.enteredDate}</span>}
                        {stage.completedDate && <span>Completed: {stage.completedDate}</span>}
                        <span>{completedTasks}/{stage.tasks.length} tasks</span>
                      </div>
                    </div>

                    {/* Task Progress Mini Bar */}
                    <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${stage.status === "complete" ? "bg-green-500" : stage.status === "active" ? "bg-blue-500" : "bg-gray-300"}`}
                        style={{ width: `${stage.tasks.length > 0 ? (completedTasks / stage.tasks.length) * 100 : 0}%` }}
                      />
                    </div>

                    {/* Status Badge */}
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap ${
                      stage.status === "complete" ? "bg-green-100 text-green-700" :
                      stage.status === "active" ? "bg-blue-100 text-blue-700" :
                      stage.status === "skipped" ? "bg-gray-100 text-gray-500" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {stage.status === "complete" ? "Complete" : stage.status === "active" ? "Active" : stage.status === "skipped" ? "Skipped" : "Upcoming"}
                    </span>
                  </div>

                  {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />}
                </button>

                {/* Expanded Tasks */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-white">
                    <div className="divide-y divide-gray-50">
                      {stage.tasks.map(task => {
                        const { icon: StatusIcon, color: iconColor } = statusIcons[task.status] || statusIcons.pending;
                        return (
                          <div key={task.id} className="flex items-center gap-3 px-6 py-2.5 hover:bg-gray-50/50 transition-all">
                            <StatusIcon className={`w-4 h-4 shrink-0 ${iconColor}`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-[#0B1F3A]">{task.title}</p>
                              {task.description && <p className="text-xs text-gray-400">{task.description}</p>}
                            </div>
                            {task.assignee && (
                              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <User className="w-3 h-3" />
                                <span>{task.assignee}</span>
                              </div>
                            )}
                            {task.completedDate && (
                              <span className="text-xs text-gray-400 whitespace-nowrap">{task.completedDate}</span>
                            )}
                            {task.dueDate && task.status !== "complete" && (
                              <span className="text-xs text-amber-500 whitespace-nowrap flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> Due: {task.dueDate}
                              </span>
                            )}
                            {task.priority && (
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                task.priority === "high" ? "bg-red-100 text-red-700" :
                                task.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                                "bg-gray-100 text-gray-500"
                              }`}>{task.priority}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {/* Add Task Button */}
                    <div className="px-6 py-2 border-t border-gray-50">
                      <button className="flex items-center gap-1.5 text-xs text-[#007A67] font-medium hover:text-[#006655]">
                        <Plus className="w-3 h-3" /> Add Task
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
