"use client";
import { useState } from "react";
import { tasks } from "@/lib/mock-data";
import { Plus, Search, Phone, Mail, Calendar, CheckSquare, Clock, Circle, CheckCircle2 } from "lucide-react";

const typeIcons: Record<string, typeof Phone> = { call: Phone, email: Mail, meeting: Calendar, todo: CheckSquare, follow_up: Clock };
const priorityColors: Record<string, string> = { urgent: "bg-red-100 text-red-700", high: "bg-orange-100 text-orange-700", medium: "bg-blue-100 text-blue-700", low: "bg-gray-100 text-gray-600" };
const statusLabels: Record<string, string> = { not_started: "Not Started", in_progress: "In Progress", waiting: "Waiting", completed: "Completed", deferred: "Deferred" };

export default function TasksPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [taskList, setTaskList] = useState(tasks);

  const filtered = taskList.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch = !q || `${t.title} ${t.owner} ${t.contact || ""} ${t.deal || ""}`.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const matchPriority = priorityFilter === "all" || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const toggleComplete = (id: string) => {
    setTaskList(prev => prev.map(t => t.id === id ? { ...t, status: t.status === "completed" ? "not_started" : "completed", completed_at: t.status === "completed" ? undefined : new Date().toISOString() } : t));
  };

  const overdue = filtered.filter(t => t.status !== "completed" && new Date(t.due_date) < new Date()).length;
  const dueToday = filtered.filter(t => t.status !== "completed" && new Date(t.due_date).toDateString() === new Date().toDateString()).length;
  const completed = filtered.filter(t => t.status === "completed").length;

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F3A]">Tasks</h1>
          <p className="text-sm text-[#9CA3AF]">{filtered.length} tasks</p>
        </div>
        <button className="btn-primary"><Plus size={16} /> Create task</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center"><p className="text-2xl font-bold text-red-500">{overdue}</p><p className="text-sm text-[#9CA3AF]">Overdue</p></div>
        <div className="card text-center"><p className="text-2xl font-bold text-[#F0A500]">{dueToday}</p><p className="text-sm text-[#9CA3AF]">Due Today</p></div>
        <div className="card text-center"><p className="text-2xl font-bold text-green-600">{completed}</p><p className="text-sm text-[#9CA3AF]">Completed</p></div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center bg-white rounded-lg border border-[#E5E7EB] px-3 py-2 flex-1 max-w-md">
          <Search size={16} className="text-[#9CA3AF] mr-2" />
          <input type="text" placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none w-full text-[#0B1F3A] placeholder-[#9CA3AF]" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white text-[#0B1F3A] outline-none">
          <option value="all">All statuses</option>
          {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}
          className="text-sm border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white text-[#0B1F3A] outline-none">
          <option value="all">All priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {filtered.map((t) => {
          const Icon = typeIcons[t.task_type] || CheckSquare;
          const isOverdue = t.status !== "completed" && new Date(t.due_date) < new Date();
          return (
            <div key={t.id} className={`card flex items-start gap-4 py-4 ${t.status === "completed" ? "opacity-60" : ""}`}>
              <button onClick={() => toggleComplete(t.id)} className="mt-0.5 shrink-0">
                {t.status === "completed" ? (
                  <CheckCircle2 size={20} className="text-green-500" />
                ) : (
                  <Circle size={20} className="text-[#9CA3AF] hover:text-[#F0A500] transition-colors" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-medium text-[#0B1F3A] ${t.status === "completed" ? "line-through" : ""}`}>{t.title}</h3>
                  <span className={`badge text-xs ${priorityColors[t.priority]}`}>{t.priority}</span>
                </div>
                {t.description && <p className="text-sm text-[#9CA3AF] mb-2">{t.description}</p>}
                <div className="flex items-center gap-4 text-xs text-[#9CA3AF]">
                  <div className="flex items-center gap-1"><Icon size={12} />{t.task_type}</div>
                  <span>{t.owner}</span>
                  {t.contact && <span>Contact: {t.contact}</span>}
                  {t.deal && <span>Deal: {t.deal}</span>}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-sm font-medium ${isOverdue ? "text-red-500" : "text-[#0B1F3A]"}`}>
                  {new Date(t.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
                <p className="text-xs text-[#9CA3AF]">{isOverdue ? "Overdue" : statusLabels[t.status]}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
