'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { SOLAR_STAGES } from '@/lib/types';
import { supabase, ORG_ID } from '@/lib/supabase';
import Link from 'next/link';
import {
  Search, Plus, MapPin, ChevronRight, ChevronDown, Filter,
  Download, MoreHorizontal, Edit3, Trash2, Eye, X, Pencil,
  CheckCircle, Clock, AlertCircle, Zap, Grid3X3, List, Check,
  Columns, Phone, Mail, Calendar, FileText, DollarSign, User,
  ArrowUpDown, GripVertical, MessageSquare, ListChecks, Send,
  CheckSquare, Square, Loader2, ChevronUp
} from 'lucide-react';

function fmt(n: number) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n); }
function timeAgo(d: string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

interface Project {
  id: string; address: string; city: string; state: string; zip: string;
  systemKw: number; panels: number; value: number; financing: string;
  stage: string; rep: string; lender: string; utility: string;
  phone: string; email: string; homeowner: string;
  panelType: string; inverter: string; created: string; daysInStage: number;
  supabaseId?: string;
}

interface Note {
  id: string; body: string; created_at: string; created_by: string | null;
}

interface Task {
  id: string; title: string; description: string | null; priority: string;
  status: string; due_date: string | null; created_at: string;
  parent_task_id: string | null;
  subtasks?: Task[];
}

// Map DB rows to frontend projects — we still use the enriched mock data for display fields
// (homeowner name, phone, email, rep, lender, financing, panelType) since those aren't in solar_projects yet
const MOCK_ENRICHMENT: Record<number, Partial<Project>> = {
  0: { homeowner: 'Robert & Maria Garcia', address: '4521 Maple Creek Dr', city: 'Houston', state: 'TX', zip: '77084', value: 42800, financing: 'Loan', rep: 'Marcus Johnson', lender: 'GoodLeap', phone: '(713) 555-0142', email: 'garcia.rm@gmail.com', panelType: 'REC Alpha 425W' },
  1: { homeowner: 'Jennifer Williams', address: '9102 Sunset Ridge Ln', city: 'Columbus', state: 'OH', zip: '43204', value: 36200, financing: 'Loan', rep: 'Sarah Chen', lender: 'Mosaic', phone: '(614) 555-0198', email: 'jwilliams@outlook.com', panelType: 'Qcells DUO ML-G11S' },
  2: { homeowner: 'Michael & Susan Thompson', address: '305 Birchwood Ave', city: 'Detroit', state: 'MI', zip: '48201', value: 51200, financing: 'Cash', rep: 'David Park', lender: '—', phone: '(313) 555-0267', email: 'mthompson@yahoo.com', panelType: 'REC Alpha 425W' },
  3: { homeowner: 'Daniel & Ashley Martinez', address: '7788 Willow Bend Ct', city: 'Houston', state: 'TX', zip: '77064', value: 39800, financing: 'Loan', rep: 'Marcus Johnson', lender: 'GoodLeap', phone: '(281) 555-0334', email: 'damartinez@gmail.com', panelType: 'Qcells DUO ML-G11S' },
  4: { homeowner: 'Brian Henderson', address: '1400 Pine Valley Dr', city: 'Toledo', state: 'OH', zip: '43615', value: 31500, financing: 'PPA', rep: 'James Wright', lender: 'Sunrun PPA', phone: '(419) 555-0478', email: 'bhenderson@gmail.com', panelType: 'Canadian Solar HiKu7' },
  5: { homeowner: 'Christopher & Nicole Baker', address: '2233 Oakmont Blvd', city: 'Katy', state: 'TX', zip: '77494', value: 58700, financing: 'Loan', rep: 'Sarah Chen', lender: 'GoodLeap', phone: '(832) 555-0512', email: 'cbaker@outlook.com', panelType: 'REC Alpha 425W' },
  6: { homeowner: 'James & Lisa Nguyen', address: '890 Elmhurst Rd', city: 'Ann Arbor', state: 'MI', zip: '48104', value: 46300, financing: 'Loan', rep: 'David Park', lender: 'Mosaic', phone: '(734) 555-0641', email: 'jnguyen@gmail.com', panelType: 'Qcells DUO ML-G11S' },
  7: { homeowner: 'William & Catherine Davis', address: '5544 River Oaks Dr', city: 'Sugar Land', state: 'TX', zip: '77478', value: 64200, financing: 'Cash', rep: 'Marcus Johnson', lender: '—', phone: '(281) 555-0789', email: 'wdavis@proton.me', panelType: 'REC Alpha 425W' },
  8: { homeowner: 'Anthony Mitchell', address: '3321 Heritage Ct', city: 'Cleveland', state: 'OH', zip: '44102', value: 28900, financing: 'Loan', rep: 'James Wright', lender: 'GoodLeap', phone: '(216) 555-0856', email: 'amitchell@gmail.com', panelType: 'Canadian Solar HiKu7' },
  9: { homeowner: 'Steven & Amanda Clark', address: '1100 Magnolia Ln', city: 'Pearland', state: 'TX', zip: '77581', value: 43500, financing: 'Loan', rep: 'Sarah Chen', lender: 'Mosaic', phone: '(713) 555-0923', email: 'saclark@yahoo.com', panelType: 'REC Alpha 425W' },
  10: { homeowner: 'Kevin & Rachel Lewis', address: '6677 Lakeshore Ave', city: 'Grand Rapids', state: 'MI', zip: '49503', value: 41200, financing: 'Loan', rep: 'David Park', lender: 'GoodLeap', phone: '(616) 555-1034', email: 'klewis@gmail.com', panelType: 'Qcells DUO ML-G11S' },
  11: { homeowner: 'Ryan & Stephanie Moore', address: '445 Meadowbrook St', city: 'Houston', state: 'TX', zip: '77007', value: 53800, financing: 'Loan', rep: 'Marcus Johnson', lender: 'GoodLeap', phone: '(832) 555-1167', email: 'rsmoore@outlook.com', panelType: 'REC Alpha 425W' },
  12: { homeowner: 'Eric & Melissa Taylor', address: '8899 Chestnut Hill Rd', city: 'Cincinnati', state: 'OH', zip: '45202', value: 37600, financing: 'PPA', rep: 'James Wright', lender: 'Sunrun PPA', phone: '(513) 555-1245', email: 'emtaylor@gmail.com', panelType: 'Canadian Solar HiKu7' },
  13: { homeowner: 'Thomas & Laura Wilson', address: '2100 Peachtree Way', city: 'Spring', state: 'TX', zip: '77386', value: 47200, financing: 'Loan', rep: 'Sarah Chen', lender: 'GoodLeap', phone: '(281) 555-1378', email: 'twwilson@proton.me', panelType: 'REC Alpha 425W' },
  14: { homeowner: 'Jason & Michelle Brown', address: '7701 Timber Creek Blvd', city: 'Dearborn', state: 'MI', zip: '48124', value: 42100, financing: 'Loan', rep: 'David Park', lender: 'Mosaic', phone: '(313) 555-1456', email: 'jmbrown@yahoo.com', panelType: 'Qcells DUO ML-G11S' },
  15: { homeowner: 'Andrew & Kimberly Hall', address: '3300 Summit View Dr', city: 'Missouri City', state: 'TX', zip: '77459', value: 61800, financing: 'Cash', rep: 'Marcus Johnson', lender: '—', phone: '(832) 555-1534', email: 'akhall@gmail.com', panelType: 'REC Alpha 425W' },
  16: { homeowner: 'Patrick Sullivan', address: '520 Lakewood Dr', city: 'Akron', state: 'OH', zip: '44301', value: 32400, financing: 'Loan', rep: 'James Wright', lender: 'GoodLeap', phone: '(330) 555-1623', email: 'psullivan@gmail.com', panelType: 'Canadian Solar HiKu7' },
  17: { homeowner: 'Derek & Vanessa Kim', address: '1455 Briarwood Ln', city: 'Cypress', state: 'TX', zip: '77429', value: 49500, financing: 'Loan', rep: 'Sarah Chen', lender: 'GoodLeap', phone: '(281) 555-1789', email: 'dvkim@outlook.com', panelType: 'REC Alpha 425W' },
};

// Kanban card
function KanbanCard({ p, onDragStart }: { p: Project; onDragStart: (e: React.DragEvent, id: string) => void }) {
  return (
    <div draggable onDragStart={e => onDragStart(e, p.id)}
      className="bg-white rounded-lg border border-gray-200 p-3 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-gray-300 transition-all group relative">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical size={12} className="text-gray-300" />
      </div>
      <p className="text-[13px] font-bold text-black leading-tight pr-4">{p.homeowner}</p>
      <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-1"><MapPin size={9} />{p.address}</p>
      <p className="text-[11px] text-gray-300">{p.city}, {p.state} {p.zip}</p>
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200/60">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-black">{p.systemKw} kW</span>
          <span className="text-[11px] text-gray-300">·</span>
          <span className="text-[11px] text-gray-500">{p.panels}p</span>
        </div>
        <span className="text-[12px] font-extrabold text-black">{fmt(p.value)}</span>
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[8px] font-bold">
            {p.rep.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="text-[11px] text-gray-500">{p.rep.split(' ')[0]}</span>
        </div>
        <span className="text-[9px] font-bold text-gray-500 border border-gray-200 rounded px-1.5 py-0.5 uppercase">{p.financing}</span>
      </div>
      {p.daysInStage > 14 && (
        <div className="mt-2 flex items-center gap-1 text-[11px] text-amber-600 bg-amber-50 rounded px-2 py-1">
          <AlertCircle size={10} /> {p.daysInStage}d in stage
        </div>
      )}
    </div>
  );
}

export default function SolarPage() {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const dragItem = useRef<string | null>(null);

  // Slide-over tabs
  const [activeTab, setActiveTab] = useState<'details' | 'notes' | 'tasks'>('details');

  // Notes state
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [addingTask, setAddingTask] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  // Load projects from Supabase
  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from('solar_projects')
        .select('id, system_size_kw, panel_count, inverter_type, utility_company, stage, cost_per_watt, created_at')
        .eq('organization_id', ORG_ID)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mapped: Project[] = data.map((row, idx) => {
          const enrich = MOCK_ENRICHMENT[idx] || {};
          const daysInStage = Math.floor((Date.now() - new Date(row.created_at).getTime()) / 86400000);
          return {
            id: String(idx + 1),
            supabaseId: row.id,
            homeowner: enrich.homeowner || `Project ${idx + 1}`,
            address: enrich.address || '',
            city: enrich.city || '',
            state: enrich.state || '',
            zip: enrich.zip || '',
            systemKw: Number(row.system_size_kw) || 0,
            panels: row.panel_count || 0,
            value: enrich.value || Math.round((Number(row.system_size_kw) || 0) * (Number(row.cost_per_watt) || 2.8) * 1000),
            financing: enrich.financing || 'Loan',
            stage: row.stage || 'site_survey',
            rep: enrich.rep || 'Unassigned',
            lender: enrich.lender || '—',
            utility: row.utility_company || '',
            phone: enrich.phone || '',
            email: enrich.email || '',
            panelType: enrich.panelType || '',
            inverter: row.inverter_type || '',
            created: row.created_at?.split('T')[0] || '',
            daysInStage,
          };
        });
        setProjects(mapped);
      }
      setLoading(false);
    }
    load();
  }, []);

  // Load notes when project selected & notes tab active
  useEffect(() => {
    if (!selectedProject?.supabaseId || activeTab !== 'notes') return;
    async function loadNotes() {
      setNotesLoading(true);
      const { data } = await supabase
        .from('notes')
        .select('id, body, created_at, created_by')
        .eq('solar_project_id', selectedProject!.supabaseId!)
        .order('created_at', { ascending: false });
      setNotes(data || []);
      setNotesLoading(false);
    }
    loadNotes();
  }, [selectedProject?.supabaseId, activeTab]);

  // Load tasks when project selected & tasks tab active
  useEffect(() => {
    if (!selectedProject?.supabaseId || activeTab !== 'tasks') return;
    async function loadTasks() {
      setTasksLoading(true);
      const { data } = await supabase
        .from('tasks')
        .select('id, title, description, priority, status, due_date, created_at, parent_task_id')
        .eq('solar_project_id', selectedProject!.supabaseId!)
        .order('created_at', { ascending: true });
      if (data) {
        // Build tree: separate parents and subtasks
        const parents = data.filter(t => !t.parent_task_id);
        const children = data.filter(t => t.parent_task_id);
        const tree = parents.map(p => ({
          ...p,
          subtasks: children.filter(c => c.parent_task_id === p.id),
        }));
        setTasks(tree);
        // Auto-expand all
        setExpandedTasks(new Set(parents.map(p => p.id)));
      }
      setTasksLoading(false);
    }
    loadTasks();
  }, [selectedProject?.supabaseId, activeTab]);

  // Add note
  async function handleAddNote() {
    if (!newNote.trim() || !selectedProject?.supabaseId) return;
    setAddingNote(true);
    const { data, error } = await supabase.from('notes').insert({
      organization_id: ORG_ID,
      body: newNote.trim(),
      solar_project_id: selectedProject.supabaseId,
    }).select('id, body, created_at, created_by').single();
    if (!error && data) setNotes(prev => [data, ...prev]);
    setNewNote('');
    setAddingNote(false);
  }

  // Add task
  async function handleAddTask() {
    if (!newTaskTitle.trim() || !selectedProject?.supabaseId) return;
    setAddingTask(true);
    const { data, error } = await supabase.from('tasks').insert({
      organization_id: ORG_ID,
      title: newTaskTitle.trim(),
      type: 'task',
      priority: 'medium',
      status: 'open',
      solar_project_id: selectedProject.supabaseId,
      tags: ['solar', 'backend'],
    }).select('id, title, description, priority, status, due_date, created_at, parent_task_id').single();
    if (!error && data) setTasks(prev => [...prev, { ...data, subtasks: [] }]);
    setNewTaskTitle('');
    setAddingTask(false);
  }

  // Toggle task status
  async function handleToggleTask(taskId: string, currentStatus: string) {
    const newStatus = currentStatus === 'completed' ? 'open' : 'completed';
    await supabase.from('tasks').update({
      status: newStatus,
      completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
    }).eq('id', taskId);
    // Update local state
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) return { ...t, status: newStatus };
      return {
        ...t,
        subtasks: t.subtasks?.map(s => s.id === taskId ? { ...s, status: newStatus } : s),
      };
    }));
  }

  // Toggle expanded
  function toggleExpanded(taskId: string) {
    setExpandedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId); else next.add(taskId);
      return next;
    });
  }

  // Update stage in Supabase
  async function handleStageChange(projectId: string, newStage: string) {
    const proj = projects.find(p => p.id === projectId);
    if (proj?.supabaseId) {
      await supabase.from('solar_projects').update({ stage: newStage }).eq('id', proj.supabaseId);
      // Log timeline
      await supabase.from('solar_project_timeline').insert({
        organization_id: ORG_ID,
        project_id: proj.supabaseId,
        old_stage: proj.stage,
        new_stage: newStage,
        notes: 'Stage updated via drag-and-drop',
      });
    }
  }

  const totalValue = projects.reduce((s, p) => s + p.value, 0);
  const stageMap = new Map<string, Project[]>();
  SOLAR_STAGES.forEach(s => stageMap.set(s.key, []));
  projects.forEach(p => stageMap.get(p.stage)?.push(p));

  const onDragStart = (e: React.DragEvent, id: string) => { dragItem.current = id; e.dataTransfer.effectAllowed = 'move'; };
  const onDragOver = (e: React.DragEvent, stageKey: string) => { e.preventDefault(); setDragOver(stageKey); };
  const onDragLeave = () => setDragOver(null);
  const onDrop = (e: React.DragEvent, stageKey: string) => {
    e.preventDefault(); setDragOver(null);
    if (dragItem.current) {
      handleStageChange(dragItem.current, stageKey);
      setProjects(prev => prev.map(p => p.id === dragItem.current ? { ...p, stage: stageKey, daysInStage: 0 } : p));
      dragItem.current = null;
    }
  };

  const filtered = !search ? projects : projects.filter(p => {
    const q = search.toLowerCase();
    return [p.homeowner, p.address, p.city, p.state, p.rep, p.email, p.phone].some(f => f.toLowerCase().includes(q));
  });

  function openProject(p: Project) {
    setSelectedProject(p);
    setActiveTab('details');
    setNotes([]);
    setTasks([]);
    setNewNote('');
    setNewTaskTitle('');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-56px)]">
        <Loader2 size={24} className="animate-spin text-gray-400" />
        <span className="ml-2 text-[13px] text-gray-500">Loading solar pipeline...</span>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-[100vw] mx-auto space-y-4 h-[calc(100vh-56px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-[20px] font-extrabold text-black tracking-tight flex items-center gap-2">
            <Zap size={20} strokeWidth={2.5} /> Solar Pipeline
          </h1>
          <p className="text-[12px] text-gray-500">{projects.length} projects · {fmt(totalValue)} pipeline · <span className="text-green-600 font-semibold">Live from Supabase</span></p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={() => setViewMode('kanban')} className={`flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold transition-all ${viewMode === 'kanban' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
              <Columns size={13} /> Board
            </button>
            <button onClick={() => setViewMode('table')} className={`flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold transition-all ${viewMode === 'table' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
              <List size={13} /> Table
            </button>
          </div>
          <div className="relative w-56">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300" />
            <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-[12px] focus:border-black outline-none" />
          </div>
          <button className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Download size={12} /> Export
          </button>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-white bg-black rounded-lg hover:bg-gray-900">
            <Plus size={13} /> New Project
          </button>
        </div>
      </div>

      {/* KANBAN VIEW */}
      {viewMode === 'kanban' ? (
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex gap-3 h-full min-w-max pb-4">
            {SOLAR_STAGES.map(stage => {
              const cards = (stageMap.get(stage.key) || []).filter(p => {
                if (!search) return true;
                const q = search.toLowerCase();
                return [p.homeowner, p.address, p.city, p.rep].some(f => f.toLowerCase().includes(q));
              });
              const colValue = cards.reduce((s, p) => s + p.value, 0);
              const isDragTarget = dragOver === stage.key;
              const isComplete = stage.key === 'final_complete';
              return (
                <div key={stage.key}
                  onDragOver={e => onDragOver(e, stage.key)}
                  onDragLeave={onDragLeave}
                  onDrop={e => onDrop(e, stage.key)}
                  className={`w-[260px] shrink-0 flex flex-col rounded-xl transition-all ${isDragTarget ? 'bg-black/5 ring-2 ring-black/20' : 'bg-gray-50/80'}`}>
                  <div className={`p-3 rounded-t-xl border-b-2 ${isComplete ? 'border-emerald-500' : 'border-black'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded flex items-center justify-center text-[11px] font-extrabold ${isComplete ? 'bg-emerald-500 text-white' : 'bg-black text-white'}`}>
                          {cards.length}
                        </span>
                        <span className="text-[11px] font-bold text-black uppercase tracking-wide">{stage.label}</span>
                      </div>
                    </div>
                    {colValue > 0 && <p className="text-[11px] text-gray-500 mt-1 font-medium">{fmt(colValue)}</p>}
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[100px]">
                    {cards.map(p => (
                      <div key={p.id} onClick={() => openProject(p)}>
                        <KanbanCard p={p} onDragStart={onDragStart} />
                      </div>
                    ))}
                    {cards.length === 0 && (
                      <div className="text-center py-8 text-gray-300">
                        <p className="text-[11px] font-medium">No projects</p>
                        <p className="text-[11px]">Drag here or create new</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="flex-1 overflow-auto bg-white rounded-xl border border-gray-200/60">
          <table className="w-full">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="border-b border-gray-200/60">
                <th className="w-8 px-3 py-3"><input type="checkbox" className="w-3.5 h-3.5 accent-black" /></th>
                {['Homeowner', 'Address', 'System', 'Value', 'Stage', 'Rep', 'Financing', 'Lender', 'Days'].map(h => (
                  <th key={h} className="px-3 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-black">
                    <span className="inline-flex items-center gap-1">{h} <ArrowUpDown size={9} className="text-gray-300" /></span>
                  </th>
                ))}
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const stage = SOLAR_STAGES.find(s => s.key === p.stage);
                const isComplete = p.stage === 'final_complete';
                return (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => openProject(p)}>
                    <td className="px-3 py-2.5"><input type="checkbox" className="w-3.5 h-3.5 accent-black" onClick={e => e.stopPropagation()} /></td>
                    <td className="px-3 py-2.5">
                      <p className="text-[13px] font-semibold text-black">{p.homeowner}</p>
                      <p className="text-[11px] text-gray-300">{p.phone}</p>
                    </td>
                    <td className="px-3 py-2.5">
                      <p className="text-[12px] text-black">{p.address}</p>
                      <p className="text-[11px] text-gray-300">{p.city}, {p.state}</p>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-[12px] font-semibold text-black">{p.systemKw} kW</span>
                      <span className="text-[11px] text-gray-300 ml-1">· {p.panels}p</span>
                    </td>
                    <td className="px-3 py-2.5 text-[13px] font-bold text-black">{fmt(p.value)}</td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${isComplete ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                        {isComplete ? <CheckCircle size={9} /> : <Clock size={9} />} {stage?.label}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[8px] font-bold">
                          {p.rep.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-[12px] text-gray-600">{p.rep}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5"><span className="text-[11px] font-bold text-gray-500 border border-gray-200 rounded px-1.5 py-0.5">{p.financing}</span></td>
                    <td className="px-3 py-2.5 text-[12px] text-gray-500">{p.lender}</td>
                    <td className="px-3 py-2.5">
                      <span className={`text-[11px] font-bold ${p.daysInStage > 14 ? 'text-amber-600' : 'text-gray-500'}`}>{p.daysInStage}d</span>
                    </td>
                    <td className="px-3 py-2.5"><MoreHorizontal size={14} className="text-gray-300" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== PROJECT DETAIL SLIDE-OVER ===== */}
      {selectedProject && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setSelectedProject(null)} />
          <div className="fixed right-0 top-0 bottom-0 w-[520px] bg-white z-50 shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 border-b border-gray-200/60 p-4 flex items-center justify-between">
              <div>
                <h2 className="text-[16px] font-extrabold text-black">{selectedProject.homeowner}</h2>
                <p className="text-[12px] text-gray-500">{selectedProject.address}, {selectedProject.city}, {selectedProject.state}</p>
              </div>
              <button onClick={() => setSelectedProject(null)} className="text-gray-300 hover:text-black p-1"><X size={20} /></button>
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-b border-gray-200/60 flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold text-white bg-black rounded-lg"><Phone size={12} /> Call</button>
              <button className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold text-gray-600 border border-gray-200 rounded-lg"><Mail size={12} /> Email</button>
              <button className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold text-gray-600 border border-gray-200 rounded-lg"><Calendar size={12} /> Schedule</button>
            </div>

            {/* Stage Progress */}
            <div className="p-4 border-b border-gray-200/60">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Pipeline Progress</p>
              <div className="flex gap-0.5">
                {SOLAR_STAGES.map((s, i) => {
                  const currentIdx = SOLAR_STAGES.findIndex(st => st.key === selectedProject.stage);
                  const isPast = i <= currentIdx;
                  return (
                    <div key={s.key} className="flex-1 group relative">
                      <div className={`h-2 rounded-sm ${s.key === 'final_complete' && isPast ? 'bg-emerald-500' : isPast ? 'bg-black' : 'bg-gray-200'} ${i === currentIdx ? 'ring-1 ring-offset-1 ring-black' : ''}`} />
                      <div className="hidden group-hover:block absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] px-2 py-1 rounded whitespace-nowrap z-10">
                        {s.label}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[12px] font-bold text-black mt-2">{SOLAR_STAGES.find(s => s.key === selectedProject.stage)?.label}</p>
              <p className="text-[11px] text-gray-500">{selectedProject.daysInStage} days in this stage</p>
            </div>

            {/* TAB BAR */}
            <div className="flex border-b border-gray-200/60">
              {([
                { key: 'details', label: 'Details', icon: FileText },
                { key: 'notes', label: 'Notes', icon: MessageSquare },
                { key: 'tasks', label: 'Tasks & Subtasks', icon: ListChecks },
              ] as const).map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-3 text-[12px] font-semibold transition-all border-b-2 ${
                    activeTab === tab.key ? 'text-black border-black' : 'text-gray-400 border-transparent hover:text-gray-600'
                  }`}>
                  <tab.icon size={14} /> {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENT */}
            <div className="flex-1">
              {/* DETAILS TAB */}
              {activeTab === 'details' && (
                <div className="p-4 space-y-3">
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Project Details</p>
                  {[
                    { label: 'Phone', value: selectedProject.phone, icon: Phone },
                    { label: 'Email', value: selectedProject.email, icon: Mail },
                    { label: 'System Size', value: `${selectedProject.systemKw} kW`, icon: Zap },
                    { label: 'Panel Count', value: `${selectedProject.panels} panels`, icon: Grid3X3 },
                    { label: 'Panel Type', value: selectedProject.panelType, icon: Zap },
                    { label: 'Inverter', value: selectedProject.inverter, icon: Zap },
                    { label: 'Contract Value', value: fmt(selectedProject.value), icon: DollarSign },
                    { label: 'Financing', value: selectedProject.financing, icon: FileText },
                    { label: 'Lender', value: selectedProject.lender, icon: DollarSign },
                    { label: 'Utility', value: selectedProject.utility, icon: Zap },
                    { label: 'Sales Rep', value: selectedProject.rep, icon: User },
                    { label: 'Created', value: selectedProject.created, icon: Calendar },
                  ].map(field => (
                    <div key={field.label} className="flex items-center gap-3 group hover:bg-gray-50 rounded-lg px-2 py-1.5 -mx-2 cursor-pointer transition-colors">
                      <field.icon size={13} className="text-gray-300 shrink-0" />
                      <span className="text-[11px] text-gray-500 w-24 shrink-0">{field.label}</span>
                      <span className="text-[13px] font-medium text-black flex-1">{field.value}</span>
                      <Pencil size={10} className="text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>
                  ))}
                </div>
              )}

              {/* NOTES TAB */}
              {activeTab === 'notes' && (
                <div className="flex flex-col h-[calc(100vh-380px)]">
                  {/* Add note input */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex gap-2">
                      <textarea
                        value={newNote} onChange={e => setNewNote(e.target.value)}
                        placeholder="Add a note... (visible to all reps)"
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:border-black outline-none resize-none h-[72px]"
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddNote(); } }}
                      />
                      <button onClick={handleAddNote} disabled={addingNote || !newNote.trim()}
                        className="self-end px-3 py-2 text-[11px] font-semibold text-white bg-black rounded-lg hover:bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1">
                        {addingNote ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />} Post
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">Press Enter to submit · Shift+Enter for new line</p>
                  </div>

                  {/* Notes list */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {notesLoading ? (
                      <div className="flex items-center justify-center py-12"><Loader2 size={18} className="animate-spin text-gray-400" /></div>
                    ) : notes.length === 0 ? (
                      <div className="text-center py-12">
                        <MessageSquare size={24} className="mx-auto text-gray-200 mb-2" />
                        <p className="text-[13px] text-gray-400">No notes yet</p>
                        <p className="text-[11px] text-gray-300">Add the first note above</p>
                      </div>
                    ) : (
                      notes.map(note => (
                        <div key={note.id} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                          <p className="text-[13px] text-gray-800 leading-relaxed whitespace-pre-wrap">{note.body}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center text-[7px] font-bold">B</div>
                            <span className="text-[10px] text-gray-400">{timeAgo(note.created_at)}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TASKS TAB */}
              {activeTab === 'tasks' && (
                <div className="flex flex-col h-[calc(100vh-380px)]">
                  {/* Add task input */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex gap-2">
                      <input
                        value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)}
                        placeholder="Add a new task..."
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:border-black outline-none"
                        onKeyDown={e => { if (e.key === 'Enter') handleAddTask(); }}
                      />
                      <button onClick={handleAddTask} disabled={addingTask || !newTaskTitle.trim()}
                        className="px-3 py-2 text-[11px] font-semibold text-white bg-black rounded-lg hover:bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1">
                        {addingTask ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />} Add
                      </button>
                    </div>
                  </div>

                  {/* Tasks list */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {tasksLoading ? (
                      <div className="flex items-center justify-center py-12"><Loader2 size={18} className="animate-spin text-gray-400" /></div>
                    ) : tasks.length === 0 ? (
                      <div className="text-center py-12">
                        <ListChecks size={24} className="mx-auto text-gray-200 mb-2" />
                        <p className="text-[13px] text-gray-400">No tasks yet</p>
                        <p className="text-[11px] text-gray-300">Add a task to track progress</p>
                      </div>
                    ) : (
                      tasks.map(task => {
                        const isExpanded = expandedTasks.has(task.id);
                        const completedSubs = task.subtasks?.filter(s => s.status === 'completed').length || 0;
                        const totalSubs = task.subtasks?.length || 0;
                        return (
                          <div key={task.id} className="border border-gray-200 rounded-xl overflow-hidden">
                            {/* Parent task */}
                            <div className="flex items-center gap-3 px-3 py-2.5 bg-white hover:bg-gray-50 transition-colors">
                              <button onClick={() => handleToggleTask(task.id, task.status)} className="shrink-0">
                                {task.status === 'completed'
                                  ? <CheckSquare size={16} className="text-emerald-500" />
                                  : <Square size={16} className="text-gray-300 hover:text-black" />
                                }
                              </button>
                              <div className="flex-1 min-w-0">
                                <p className={`text-[13px] font-semibold ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-black'}`}>
                                  {task.title}
                                </p>
                                {task.description && (
                                  <p className="text-[11px] text-gray-400 mt-0.5 truncate">{task.description}</p>
                                )}
                              </div>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                task.priority === 'high' ? 'bg-red-50 text-red-600 border border-red-200' :
                                task.priority === 'medium' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                                'bg-gray-50 text-gray-500 border border-gray-200'
                              }`}>{task.priority}</span>
                              {totalSubs > 0 && (
                                <button onClick={() => toggleExpanded(task.id)} className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-black">
                                  <span className="font-semibold">{completedSubs}/{totalSubs}</span>
                                  {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                </button>
                              )}
                            </div>

                            {/* Subtasks */}
                            {isExpanded && totalSubs > 0 && (
                              <div className="bg-gray-50/50 border-t border-gray-100">
                                {/* Progress bar */}
                                <div className="px-3 pt-2">
                                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${totalSubs > 0 ? (completedSubs / totalSubs) * 100 : 0}%` }} />
                                  </div>
                                </div>
                                {task.subtasks?.map(sub => (
                                  <div key={sub.id} className="flex items-center gap-3 px-3 py-2 pl-8 hover:bg-gray-100/50 transition-colors">
                                    <button onClick={() => handleToggleTask(sub.id, sub.status)} className="shrink-0">
                                      {sub.status === 'completed'
                                        ? <CheckSquare size={14} className="text-emerald-500" />
                                        : <Square size={14} className="text-gray-300 hover:text-black" />
                                      }
                                    </button>
                                    <span className={`text-[12px] flex-1 ${sub.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                      {sub.title}
                                    </span>
                                    <span className={`text-[8px] font-bold px-1 py-0.5 rounded uppercase ${
                                      sub.priority === 'high' ? 'text-red-500' : sub.priority === 'medium' ? 'text-amber-500' : 'text-gray-400'
                                    }`}>{sub.priority}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Link */}
            <div className="p-4 border-t border-gray-200/60">
              <Link href={`/customers/${selectedProject.id}`}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-[12px] font-semibold text-white bg-black rounded-lg hover:bg-gray-900 transition-colors">
                Open Full Customer DNA <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[18px] font-extrabold text-black">New Solar Project</h2>
              <button onClick={() => setShowCreate(false)} className="text-gray-300 hover:text-black"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Homeowner Name', placeholder: 'Robert & Maria Garcia' },
                { label: 'Street Address', placeholder: '4521 Maple Creek Dr' },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">{f.label}</label>
                  <input placeholder={f.placeholder} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] focus:border-black outline-none" />
                </div>
              ))}
              <div className="grid grid-cols-3 gap-2">
                <div><label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">City</label><input placeholder="Houston" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] focus:border-black outline-none" /></div>
                <div><label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">State</label><select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] focus:border-black outline-none bg-white">{['TX','OH','MI'].map(s=><option key={s}>{s}</option>)}</select></div>
                <div><label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">ZIP</label><input placeholder="77084" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] focus:border-black outline-none" /></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">System (kW)</label><input type="number" placeholder="10.2" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] focus:border-black outline-none" /></div>
                <div><label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">Contract Amount</label><input type="number" placeholder="42800" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] focus:border-black outline-none" /></div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-[12px] font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={() => setShowCreate(false)} className="px-5 py-2 text-[12px] font-semibold text-white bg-black rounded-lg hover:bg-gray-900">Create Project</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
