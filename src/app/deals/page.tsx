'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Search, Plus, DollarSign, ChevronRight, X, MoreHorizontal,
  Phone, Mail, Calendar, FileText, Pencil,
  CheckCircle, Clock, AlertCircle, Columns, List,
  Filter, Download, Zap, Home, Shield, Eye
} from 'lucide-react';
import { supabase, ORG_ID } from '@/lib/supabase';

function fmt(n: number) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n); }

interface Deal {
  id: string; deal_name: string; contact_name: string; amount: number;
  stage_id: string; stage_name: string; deal_type: string; priority: string;
  owner_name: string; close_date: string; phone: string; email: string;
  source: string; probability: number; created_at: string;
}

interface DealStage {
  id: string; name: string; display_order: number; pipeline_id: string;
}

export default function DealsPage() {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [stages, setStages] = useState<DealStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [selected, setSelected] = useState<Deal | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const dragItem = useRef<string | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formType, setFormType] = useState('solar');
  const [formPriority, setFormPriority] = useState('medium');
  const [formSource, setFormSource] = useState('Door Knock');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formStageId, setFormStageId] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true);
    try {
      // Fetch deal stages
      const { data: stageData } = await supabase
        .from('deal_stages')
        .select('*')
        .eq('organization_id', ORG_ID)
        .order('display_order', { ascending: true });

      const stgs = stageData || [];
      setStages(stgs);
      if (stgs.length > 0 && !formStageId) setFormStageId(stgs[0].id);

      // Fetch deals with contact info
      const { data: dealData } = await supabase
        .from('deals')
        .select(`
          id, deal_name, amount, deal_type, priority, close_date,
          source, probability, stage_id, created_at,
          contacts ( first_name, last_name, email, phone )
        `)
        .eq('organization_id', ORG_ID)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (dealData) {
        const mapped: Deal[] = dealData.map((d: any) => {
          const c = d.contacts;
          const stageName = stgs.find((s: DealStage) => s.id === d.stage_id)?.name || 'Unknown';
          return {
            id: d.id,
            deal_name: d.deal_name,
            contact_name: c ? `${c.first_name} ${c.last_name}` : 'Unknown',
            amount: d.amount || 0,
            stage_id: d.stage_id,
            stage_name: stageName,
            deal_type: d.deal_type || 'solar',
            priority: d.priority || 'medium',
            owner_name: 'Delta Team',
            close_date: d.close_date || '',
            phone: c?.phone || '',
            email: c?.email || '',
            source: d.source || '',
            probability: d.probability || 0,
            created_at: d.created_at,
          };
        });
        setDeals(mapped);
      }
    } catch (err) {
      console.error('Error fetching deals:', err);
    } finally {
      setLoading(false);
    }
  }

  async function createDeal(e: React.FormEvent) {
    e.preventDefault();
    if (!formName || !formAmount) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('deals').insert([{
        organization_id: ORG_ID,
        deal_name: formName,
        amount: parseFloat(formAmount),
        deal_type: formType,
        priority: formPriority,
        source: formSource,
        stage_id: formStageId,
        probability: 20,
        close_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      }]);
      if (error) throw error;
      setFormName(''); setFormContact(''); setFormAmount(''); setFormPhone(''); setFormEmail('');
      setShowCreate(false);
      fetchData();
    } catch (err) {
      console.error('Error creating deal:', err);
    } finally {
      setSaving(false);
    }
  }

  async function moveDeal(dealId: string, newStageId: string) {
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, stage_id: newStageId, stage_name: stages.find(s => s.id === newStageId)?.name || d.stage_name } : d));
    const { error } = await supabase.from('deals').update({ stage_id: newStageId }).eq('id', dealId);
    if (error) { console.error('Error moving deal:', error); fetchData(); }
  }

  async function deleteDeal(dealId: string) {
    const { error } = await supabase.from('deals').update({ deleted_at: new Date().toISOString() }).eq('id', dealId);
    if (error) console.error('Error deleting deal:', error);
    else { setDeals(prev => prev.filter(d => d.id !== dealId)); setSelected(null); }
  }

  function exportCSV() {
    const header = 'Deal,Contact,Amount,Stage,Type,Priority,Source,Close Date\n';
    const rows = deals.map(d => `"${d.deal_name}","${d.contact_name}",${d.amount},"${d.stage_name}","${d.deal_type}","${d.priority}","${d.source}","${d.close_date}"`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'deals_export.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  const totalPipeline = deals.filter(d => {
    const s = stages.find(st => st.id === d.stage_id);
    return s && !s.name.toLowerCase().includes('won') && !s.name.toLowerCase().includes('lost');
  }).reduce((s, d) => s + d.amount, 0);

  const wonValue = deals.filter(d => {
    const s = stages.find(st => st.id === d.stage_id);
    return s && s.name.toLowerCase().includes('won');
  }).reduce((s, d) => s + d.amount, 0);

  const filtered = !search ? deals : deals.filter(d => {
    const q = search.toLowerCase();
    return [d.deal_name, d.contact_name, d.deal_type, d.source].some(f => (f || '').toLowerCase().includes(q));
  });

  const onDragStart = (e: React.DragEvent, id: string) => { dragItem.current = id; e.dataTransfer.effectAllowed = 'move'; };
  const onDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault(); setDragOver(null);
    if (dragItem.current) { moveDeal(dragItem.current, stageId); dragItem.current = null; }
  };

  const typeIcons: Record<string, typeof Zap> = { solar: Zap, smart_home: Shield, roofing: Home, bundle: DollarSign, alarm: Shield };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-56px)]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading deals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-[100vw] mx-auto space-y-4 h-[calc(100vh-56px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-[20px] font-extrabold text-black tracking-tight flex items-center gap-2"><DollarSign size={20} strokeWidth={2.5} /> Deals</h1>
          <p className="text-[12px] text-gray-500">{deals.length} deals · {fmt(totalPipeline)} pipeline · {fmt(wonValue)} won</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50"><Download size={13} /> Export</button>
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={() => setViewMode('kanban')} className={`flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold ${viewMode === 'kanban' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}><Columns size={13} /> Board</button>
            <button onClick={() => setViewMode('table')} className={`flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold ${viewMode === 'table' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}><List size={13} /> Table</button>
          </div>
          <div className="relative w-48">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300" />
            <input type="text" placeholder="Search deals..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-[12px] focus:border-black outline-none" />
          </div>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-white bg-black rounded-lg hover:bg-gray-900"><Plus size={13} /> New Deal</button>
        </div>
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' ? (
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex gap-3 h-full min-w-max pb-4">
            {stages.map(stage => {
              const cards = filtered.filter(d => d.stage_id === stage.id);
              const colValue = cards.reduce((s, d) => s + d.amount, 0);
              const isWon = stage.name.toLowerCase().includes('won');
              const isLost = stage.name.toLowerCase().includes('lost');
              return (
                <div key={stage.id} onDragOver={e => { e.preventDefault(); setDragOver(stage.id); }} onDragLeave={() => setDragOver(null)} onDrop={e => onDrop(e, stage.id)}
                  className={`w-[260px] shrink-0 flex flex-col rounded-xl transition-all ${dragOver === stage.id ? 'bg-black/5 ring-2 ring-black/20' : 'bg-gray-50/80'}`}>
                  <div className={`p-3 rounded-t-xl border-b-2 ${isWon ? 'border-emerald-500' : isLost ? 'border-red-400' : 'border-black'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded flex items-center justify-center text-[11px] font-extrabold text-white ${isWon ? 'bg-emerald-500' : isLost ? 'bg-red-400' : 'bg-black'}`}>{cards.length}</span>
                        <span className="text-[11px] font-bold text-black uppercase tracking-wide">{stage.name}</span>
                      </div>
                    </div>
                    {colValue > 0 && <p className="text-[11px] text-gray-500 mt-1 font-medium">{fmt(colValue)}</p>}
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[80px]">
                    {cards.map(d => {
                      const TypeIcon = typeIcons[d.deal_type] || DollarSign;
                      return (
                        <div key={d.id} draggable onDragStart={e => onDragStart(e, d.id)} onClick={() => setSelected(d)}
                          className="bg-white rounded-lg border border-gray-200 p-3 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-gray-300 transition-all group">
                          <div className="flex items-start justify-between">
                            <p className="text-[12px] font-bold text-black leading-tight pr-2">{d.deal_name}</p>
                            <TypeIcon size={12} className="text-gray-300 shrink-0 mt-0.5" />
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5">{d.contact_name}</p>
                          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-200/60">
                            <span className="text-[13px] font-extrabold text-black">{fmt(d.amount)}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${d.priority === 'urgent' ? 'border-black text-black' : d.priority === 'high' ? 'border-gray-400 text-gray-600' : 'border-gray-200 text-gray-500'}`}>{d.priority}</span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1.5">
                              <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[8px] font-bold">DT</div>
                              <span className="text-[11px] text-gray-500">{d.source || 'Direct'}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {cards.length === 0 && <div className="text-center py-8 text-[11px] text-gray-300">Drop deals here</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Table View */
        <div className="flex-1 overflow-auto bg-white rounded-xl border border-gray-200/60">
          <table className="w-full">
            <thead className="sticky top-0 bg-white z-10"><tr className="border-b border-gray-200/60">
              {['Deal', 'Amount', 'Stage', 'Type', 'Priority', 'Source', 'Close Date'].map(h => (
                <th key={h} className="px-3 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
              <th className="w-10 px-3 py-3" />
            </tr></thead>
            <tbody>{filtered.map(d => {
              const isWon = d.stage_name.toLowerCase().includes('won');
              const TypeIcon = typeIcons[d.deal_type] || DollarSign;
              return (
                <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer" onClick={() => setSelected(d)}>
                  <td className="px-3 py-2.5"><p className="text-[13px] font-semibold text-black">{d.deal_name}</p><p className="text-[11px] text-gray-300">{d.contact_name}</p></td>
                  <td className="px-3 py-2.5 text-[13px] font-bold text-black">{fmt(d.amount)}</td>
                  <td className="px-3 py-2.5"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${isWon ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>{d.stage_name}</span></td>
                  <td className="px-3 py-2.5"><span className="inline-flex items-center gap-1 text-[11px] text-gray-500"><TypeIcon size={11} />{d.deal_type.replace('_', ' ')}</span></td>
                  <td className="px-3 py-2.5"><span className={`text-[11px] font-bold px-1.5 py-0.5 rounded border ${d.priority === 'urgent' ? 'border-black text-black' : 'border-gray-200 text-gray-500'}`}>{d.priority}</span></td>
                  <td className="px-3 py-2.5 text-[12px] text-gray-500">{d.source}</td>
                  <td className="px-3 py-2.5 text-[12px] text-gray-500">{d.close_date ? new Date(d.close_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}</td>
                  <td className="px-3 py-2.5">
                    <button onClick={(e) => { e.stopPropagation(); deleteDeal(d.id); }} className="text-gray-300 hover:text-red-500" title="Delete"><X size={14} /></button>
                  </td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      )}

      {/* Create Deal Modal */}
      {showCreate && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
              <div className="p-4 border-b border-gray-200/60 flex items-center justify-between">
                <h2 className="text-[16px] font-extrabold text-black">New Deal</h2>
                <button onClick={() => setShowCreate(false)} className="text-gray-300 hover:text-black"><X size={20} /></button>
              </div>
              <form onSubmit={createDeal} className="p-4 space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">Deal Name *</label>
                  <input type="text" value={formName} onChange={e => setFormName(e.target.value)} placeholder="Garcia Residence — 10kW Solar" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:border-black outline-none" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1">Amount *</label>
                    <input type="number" value={formAmount} onChange={e => setFormAmount(e.target.value)} placeholder="42000" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:border-black outline-none" required />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1">Stage</label>
                    <select value={formStageId} onChange={e => setFormStageId(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:border-black outline-none">
                      {stages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1">Type</label>
                    <select value={formType} onChange={e => setFormType(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:border-black outline-none">
                      <option value="solar">Solar</option>
                      <option value="smart_home">Smart Home</option>
                      <option value="roofing">Roofing</option>
                      <option value="bundle">Bundle</option>
                      <option value="alarm">Alarm</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1">Priority</label>
                    <select value={formPriority} onChange={e => setFormPriority(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:border-black outline-none">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">Source</label>
                  <select value={formSource} onChange={e => setFormSource(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:border-black outline-none">
                    <option>Door Knock</option>
                    <option>Referral</option>
                    <option>Web Lead</option>
                    <option>Canvass</option>
                    <option>Social Media</option>
                    <option>Partner</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-[12px] font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-black text-white rounded-lg text-[12px] font-semibold hover:bg-gray-900 disabled:opacity-50">{saving ? 'Creating...' : 'Create Deal'}</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Deal Detail Slide-Over */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="fixed right-0 top-0 bottom-0 w-[480px] bg-white z-50 shadow-2xl overflow-y-auto" role="dialog" aria-label="Deal details">
            <div className="sticky top-0 bg-white z-10 border-b border-gray-200/60 p-4 flex items-center justify-between">
              <div>
                <h2 className="text-[16px] font-extrabold text-black">{selected.deal_name}</h2>
                <p className="text-[12px] text-gray-500">{selected.contact_name}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-300 hover:text-black p-1"><X size={20} /></button>
            </div>
            <div className="p-4 border-b border-gray-200/60 flex items-center gap-2">
              {selected.phone && <a href={`tel:${selected.phone}`} className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold text-white bg-black rounded-lg"><Phone size={12} /> Call</a>}
              {selected.email && <a href={`mailto:${selected.email}`} className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold text-gray-600 border border-gray-200 rounded-lg"><Mail size={12} /> Email</a>}
            </div>
            <div className="p-4 border-b border-gray-200/60">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Deal Stage</p>
              <div className="flex gap-0.5">
                {stages.filter(s => !s.name.toLowerCase().includes('lost')).map((s, i) => {
                  const currentIdx = stages.findIndex(st => st.id === selected.stage_id);
                  const isPast = i <= currentIdx;
                  const isWon = s.name.toLowerCase().includes('won') && isPast;
                  return <div key={s.id} className={`flex-1 h-2 rounded-sm ${isWon ? 'bg-emerald-500' : isPast ? 'bg-black' : 'bg-gray-200'}`} title={s.name} />;
                })}
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[12px] font-bold text-black">{selected.stage_name}</p>
                <p className="text-[11px] text-gray-500">{selected.probability}% probability</p>
              </div>
              {/* Stage Mover */}
              <div className="mt-3">
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Move to stage:</label>
                <select value={selected.stage_id} onChange={e => { moveDeal(selected.id, e.target.value); setSelected({ ...selected, stage_id: e.target.value, stage_name: stages.find(s => s.id === e.target.value)?.name || '' }); }} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[12px] focus:border-black outline-none">
                  {stages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>
            <div className="p-4 space-y-2.5">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Deal Properties</p>
              {[
                { label: 'Amount', value: fmt(selected.amount), icon: DollarSign },
                { label: 'Phone', value: selected.phone || 'N/A', icon: Phone },
                { label: 'Email', value: selected.email || 'N/A', icon: Mail },
                { label: 'Type', value: selected.deal_type.replace('_', ' '), icon: Zap },
                { label: 'Priority', value: selected.priority, icon: AlertCircle },
                { label: 'Source', value: selected.source || 'N/A', icon: FileText },
                { label: 'Close Date', value: selected.close_date || 'Not set', icon: Calendar },
              ].map(f => (
                <div key={f.label} className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-2 py-1.5 -mx-2">
                  <f.icon size={13} className="text-gray-300 shrink-0" />
                  <span className="text-[11px] text-gray-500 w-20 shrink-0">{f.label}</span>
                  <span className="text-[13px] font-medium text-black flex-1">{f.value}</span>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200/60 flex gap-2">
              <button onClick={() => deleteDeal(selected.id)} className="flex-1 px-4 py-2.5 text-[12px] font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50">Delete Deal</button>
              <Link href={`/customers/${selected.id}`} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[12px] font-semibold text-white bg-black rounded-lg hover:bg-gray-900">
                Open Full Record <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
