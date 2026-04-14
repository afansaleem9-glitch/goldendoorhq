'use client';

import { useState } from 'react';
import { useApi } from '@/lib/hooks/useApi';
import { Task } from '@/lib/types';
import { Plus, Search, CheckCircle2, Circle, Clock, Loader } from 'lucide-react';

const statusIcons: Record<string, typeof Circle> = { pending: Circle, in_progress: Clock, completed: CheckCircle2 };
const priorityColors: Record<string, string> = { urgent: 'border-l-red-500', high: 'border-l-orange-500', medium: 'border-l-blue-500', low: 'border-l-gray-300' };

export default function TasksPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', task_type: 'todo', priority: 'medium', status: 'pending', due_date: '' });

  const { data: tasks, loading, error, total, create, update } = useApi<Task>('/api/tasks', {
    limit: 100, search, filters: statusFilter ? { status: statusFilter } : {},
  });

  const handleCreate = async () => {
    try { await create(form); setShowCreate(false); setForm({ title: '', description: '', task_type: 'todo', priority: 'medium', status: 'pending', due_date: '' }); }
    catch (e) { alert(e instanceof Error ? e.message : 'Error'); }
  };

  const toggleComplete = async (t: Task) => {
    const newStatus = t.status === 'completed' ? 'pending' : 'completed';
    await update({ id: t.id, status: newStatus, completed_at: newStatus === 'completed' ? new Date().toISOString() : null });
  };

  const pending = tasks.filter(t => t.status === 'pending');
  const inProgress = tasks.filter(t => t.status === 'in_progress');
  const completed = tasks.filter(t => t.status === 'completed');

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-[#0B1F3A]">Tasks</h1><p className="text-sm text-[#9CA3AF]">{total} total · {pending.length} pending</p></div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Task</button>
      </div>
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#F0A500]/30 focus:border-[#F0A500] outline-none" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none">
          <option value="">All Status</option><option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="completed">Completed</option>
        </select>
      </div>

      {loading ? <div className="flex items-center justify-center py-20"><Loader className="animate-spin text-gray-400" size={32} /></div>
      : error ? <div className="text-red-500 text-sm">{error}</div>
      : tasks.length === 0 ? (
        <div className="card text-center py-20 text-gray-400"><CheckCircle2 size={48} className="mx-auto mb-3 opacity-40" /><p className="font-medium">No tasks yet</p></div>
      ) : (
        <div className="space-y-2">
          {tasks.map(t => {
            const Icon = statusIcons[t.status] || Circle;
            return (
              <div key={t.id} className={`card flex items-center gap-3 border-l-4 ${priorityColors[t.priority] || 'border-l-gray-300'} ${t.status === 'completed' ? 'opacity-60' : ''}`}>
                <button onClick={() => toggleComplete(t)} className="shrink-0">
                  <Icon size={20} className={t.status === 'completed' ? 'text-green-500' : 'text-gray-300 hover:text-green-400'} />
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${t.status === 'completed' ? 'line-through text-gray-400' : 'text-[#0B1F3A]'}`}>{t.title}</p>
                  {t.description && <p className="text-xs text-[#9CA3AF] truncate">{t.description}</p>}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-[#9CA3AF]">{t.task_type}</span>
                  {t.due_date && <span className="text-xs text-[#9CA3AF]">{new Date(t.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.priority === 'urgent' ? 'bg-red-100 text-red-700' : t.priority === 'high' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>{t.priority}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">New Task</h2>
            <div className="space-y-3">
              <input placeholder="Task Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" rows={3} />
              <div className="grid grid-cols-2 gap-2">
                <select value={form.task_type} onChange={e => setForm({...form, task_type: e.target.value})} className="border rounded-lg px-3 py-2 text-sm">
                  {['todo','call','email','meeting','follow_up','site_visit'].map(t => <option key={t} value={t}>{t.replace('_',' ')}</option>)}
                </select>
                <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="border rounded-lg px-3 py-2 text-sm">
                  {['low','medium','high','urgent'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <input type="date" value={form.due_date} onChange={e => setForm({...form, due_date: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreate} className="btn-primary text-sm">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
