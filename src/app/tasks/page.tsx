"use client";
import { useState } from "react";
import {
  CheckSquare, Plus, Search, Filter, Calendar, Clock,
  User, Flag, Edit2, Check, X, ChevronDown, Circle,
  CheckCircle2, AlertCircle, MoreHorizontal, Tag
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  type: string;
  status: "todo" | "in_progress" | "done";
  priority: "high" | "medium" | "low";
  due_date: string;
  assigned_to: string;
  assigned_avatar: string;
  contact_name: string;
  deal_name: string;
  tags: string[];
  created_at: string;
}

const MOCK_TASKS: Task[] = [
  { id: "t1", title: "Follow up with Robert Martinez — solar proposal", description: "Send revised 12kW proposal with updated Enphase pricing", type: "Follow-up", status: "todo", priority: "high", due_date: "Apr 15, 2026", assigned_to: "Marcus Johnson", assigned_avatar: "MJ", contact_name: "Robert Martinez", deal_name: "Martinez Solar 12kW", tags: ["solar"], created_at: "Apr 12, 2026" },
  { id: "t2", title: "Schedule site survey — Thompson residence", description: "Coordinate with survey team for roof + electrical assessment", type: "Scheduling", status: "in_progress", priority: "high", due_date: "Apr 16, 2026", assigned_to: "Sarah Chen", assigned_avatar: "SC", contact_name: "Michael Thompson", deal_name: "Thompson Roof + Solar", tags: ["solar", "roofing"], created_at: "Apr 11, 2026" },
  { id: "t3", title: "Send contract to James Brown — roofing", description: "GAF Timberline HDZ full replacement. DocuSign ready.", type: "Contract", status: "todo", priority: "high", due_date: "Apr 14, 2026", assigned_to: "Lisa Rodriguez", assigned_avatar: "LR", contact_name: "James Brown", deal_name: "Brown Roof Replacement", tags: ["roofing"], created_at: "Apr 13, 2026" },
  { id: "t4", title: "Call Emily Wilson — qualify solar+ATT bundle", description: "High credit score lead from Google Ads. Discuss bundle options.", type: "Call", status: "todo", priority: "medium", due_date: "Apr 15, 2026", assigned_to: "Marcus Johnson", assigned_avatar: "MJ", contact_name: "Emily Wilson", deal_name: "Wilson Bundle", tags: ["solar", "att"], created_at: "Apr 12, 2026" },
  { id: "t5", title: "Process Garcia monitoring payment", description: "Monthly ADC monitoring — auto-payment bounced", type: "Billing", status: "in_progress", priority: "medium", due_date: "Apr 17, 2026", assigned_to: "David Park", assigned_avatar: "DP", contact_name: "Carlos Garcia", deal_name: "Garcia Smart Home", tags: ["smart-home"], created_at: "Apr 10, 2026" },
  { id: "t6", title: "Submit permit for Williams solar install", description: "City of Plano — 9.6kW rooftop system. Plans attached.", type: "Permitting", status: "done", priority: "high", due_date: "Apr 12, 2026", assigned_to: "Sarah Chen", assigned_avatar: "SC", contact_name: "Jennifer Williams", deal_name: "Williams Solar 9.6kW", tags: ["solar"], created_at: "Apr 8, 2026" },
  { id: "t7", title: "Order Enphase IQ8+ microinverters (24 units)", description: "For Martinez and Davis installs. Check distributor stock.", type: "Procurement", status: "todo", priority: "medium", due_date: "Apr 18, 2026", assigned_to: "Sarah Chen", assigned_avatar: "SC", contact_name: "", deal_name: "", tags: ["solar"], created_at: "Apr 13, 2026" },
  { id: "t8", title: "Review inspection photos — Johnson system", description: "City of Cleveland passed. Upload final docs to SiteCapture.", type: "Review", status: "done", priority: "low", due_date: "Apr 11, 2026", assigned_to: "David Park", assigned_avatar: "DP", contact_name: "Sarah Johnson", deal_name: "Johnson Solar 8.5kW", tags: ["solar"], created_at: "Apr 9, 2026" },
  { id: "t9", title: "3rd call attempt — David Lee", description: "Facebook lead, no answer on 2 prior attempts. Try mobile.", type: "Call", status: "todo", priority: "low", due_date: "Apr 16, 2026", assigned_to: "David Park", assigned_avatar: "DP", contact_name: "David Lee", deal_name: "", tags: ["solar"], created_at: "Apr 12, 2026" },
  { id: "t10", title: "Weekly pipeline review meeting prep", description: "Pull reports for Monday leadership standup", type: "Internal", status: "in_progress", priority: "medium", due_date: "Apr 14, 2026", assigned_to: "Marcus Johnson", assigned_avatar: "MJ", contact_name: "", deal_name: "", tags: [], created_at: "Apr 13, 2026" },
];

const STATUS_CONFIG = {
  todo: { label: "To Do", icon: Circle, color: "text-gray-500" },
  in_progress: { label: "In Progress", icon: AlertCircle, color: "text-amber-500" },
  done: { label: "Done", icon: CheckCircle2, color: "text-green-500" },
};

const PRIORITY_DOT = { high: "bg-red-500", medium: "bg-amber-400", low: "bg-gray-300" };

export default function TasksPage() {
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [filter, setFilter] = useState<"all" | "todo" | "in_progress" | "done">("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"board" | "list">("board");

  const filtered = tasks.filter(t => {
    const matchFilter = filter === "all" || t.status === filter;
    const matchSearch = search === "" || t.title.toLowerCase().includes(search.toLowerCase()) || t.assigned_to.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const toggleStatus = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const next = t.status === "todo" ? "in_progress" : t.status === "in_progress" ? "done" : "todo";
      return { ...t, status: next };
    }));
  };

  const statusGroups: ("todo" | "in_progress" | "done")[] = ["todo", "in_progress", "done"];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black flex items-center gap-2"><CheckSquare size={24} /> Tasks</h1>
            <p className="text-sm text-gray-500 mt-1">{tasks.filter(t => t.status !== "done").length} open · {tasks.filter(t => t.status === "done").length} completed</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
              <button onClick={() => setView("board")} className={`px-3 py-1.5 text-xs font-semibold transition-colors ${view === "board" ? "bg-black text-white" : "text-gray-500 hover:text-black"}`}>Board</button>
              <button onClick={() => setView("list")} className={`px-3 py-1.5 text-xs font-semibold transition-colors ${view === "list" ? "bg-black text-white" : "text-gray-500 hover:text-black"}`}>List</button>
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">
              <Plus size={14} /> Add Task
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 max-w-sm focus-within:border-black transition-all">
            <Search size={14} className="text-gray-500 mr-2" />
            <input type="text" placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 text-sm outline-none bg-transparent text-black placeholder-gray-400" aria-label="Search tasks" />
          </div>
          {(["all", ...statusGroups] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === s ? "bg-black text-white" : "bg-white border border-gray-200 text-gray-600 hover:text-black"}`}>
              {s === "all" ? "All" : STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>

        {/* Board View */}
        {view === "board" ? (
          <div className="grid grid-cols-3 gap-5">
            {statusGroups.map(status => {
              const cfg = STATUS_CONFIG[status];
              const Icon = cfg.icon;
              const groupTasks = filtered.filter(t => t.status === status);
              return (
                <div key={status}>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon size={16} className={cfg.color} />
                    <h2 className="text-sm font-bold text-black">{cfg.label}</h2>
                    <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">{groupTasks.length}</span>
                  </div>
                  <div className="space-y-2">
                    {groupTasks.map(task => (
                      <div key={task.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow group">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${PRIORITY_DOT[task.priority]}`} title={task.priority} />
                            <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{task.type}</span>
                          </div>
                          <button onClick={() => toggleStatus(task.id)} className="text-gray-300 hover:text-black transition-colors" aria-label={`Change status of ${task.title}`}>
                            <Icon size={16} className={cfg.color} />
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-black mb-1 leading-snug">{task.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{task.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[9px] font-bold">{task.assigned_avatar}</div>
                            <span className="text-[11px] text-gray-500">{task.assigned_to.split(" ")[0]}</span>
                          </div>
                          <span className="text-[11px] text-gray-500 flex items-center gap-1"><Calendar size={10} /> {task.due_date}</span>
                        </div>
                        {task.tags.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {task.tags.map(tag => (
                              <span key={tag} className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-gray-50 text-gray-500">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-gray-200/60 bg-gray-50/50">
                  <th className="w-8 py-3 px-3"></th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">Task</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">Assigned To</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">Due Date</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">Priority</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(task => {
                  const cfg = STATUS_CONFIG[task.status];
                  const Icon = cfg.icon;
                  return (
                    <tr key={task.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-3">
                        <button onClick={() => toggleStatus(task.id)} aria-label={`Toggle ${task.title}`}>
                          <Icon size={16} className={cfg.color} />
                        </button>
                      </td>
                      <td className="py-3 px-3">
                        <p className={`font-medium ${task.status === "done" ? "text-gray-500 line-through" : "text-black"}`}>{task.title}</p>
                        {task.contact_name && <p className="text-xs text-gray-500">{task.contact_name}</p>}
                      </td>
                      <td className="py-3 px-3"><span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600">{task.type}</span></td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[11px] font-bold">{task.assigned_avatar}</div>
                          <span className="text-gray-600">{task.assigned_to}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-gray-600">{task.due_date}</td>
                      <td className="py-3 px-3"><span className={`w-2.5 h-2.5 rounded-full inline-block ${PRIORITY_DOT[task.priority]}`} title={task.priority} /></td>
                      <td className="py-3 px-3"><span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
