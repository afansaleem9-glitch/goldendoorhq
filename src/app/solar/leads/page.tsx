'use client';

import { useState, useMemo } from 'react';
import { supabase, ORG_ID } from '@/lib/supabase';
import {
  Search, Plus, Download, ChevronLeft, ChevronRight, X, Users, UserPlus,
  CheckSquare, Square, Loader2, Phone, Mail, MapPin
} from 'lucide-react';

const STATUS_OPTIONS = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Disqualified'];
const SOURCE_OPTIONS = ['Door Knock', 'Referral', 'Online', 'Event', 'Partner'];
const STATE_OPTIONS = ['TX', 'OH', 'MI'];
const STATUS_COLORS: Record<string, string> = {
  New: 'bg-blue-50 text-blue-700 border-blue-200', Contacted: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  Qualified: 'bg-green-50 text-green-700 border-green-200', 'Proposal Sent': 'bg-purple-50 text-purple-700 border-purple-200',
  Disqualified: 'bg-red-50 text-red-700 border-red-200',
};
const REPS = ['Marcus Johnson', 'Sarah Chen', 'David Park', 'James Wright', 'Emily Rodriguez', 'Tyler Brooks'];

interface Lead {
  id: string; first_name: string; last_name: string; email: string; phone: string;
  city: string; state: string; zip: string; lead_status: string; lead_source: string;
  lead_score: number; created_at: string; address?: string; assigned_rep?: string;
}

const MOCK: Lead[] = [
  { id:'1',first_name:'Robert',last_name:'Garcia',email:'garcia.rm@gmail.com',phone:'(713) 555-0142',city:'Houston',state:'TX',zip:'77084',lead_status:'Qualified',lead_source:'Door Knock',lead_score:85,created_at:'2026-04-10',address:'4521 Maple Creek Dr',assigned_rep:'Marcus Johnson'},
  { id:'2',first_name:'Jennifer',last_name:'Williams',email:'jwilliams@outlook.com',phone:'(614) 555-0198',city:'Columbus',state:'OH',zip:'43204',lead_status:'New',lead_source:'Online',lead_score:62,created_at:'2026-04-12',address:'9102 Sunset Ridge Ln',assigned_rep:'Sarah Chen'},
  { id:'3',first_name:'Michael',last_name:'Thompson',email:'mthompson@yahoo.com',phone:'(313) 555-0267',city:'Detroit',state:'MI',zip:'48201',lead_status:'Contacted',lead_source:'Referral',lead_score:74,created_at:'2026-04-08',address:'305 Birchwood Ave',assigned_rep:'David Park'},
  { id:'4',first_name:'Daniel',last_name:'Martinez',email:'damartinez@gmail.com',phone:'(281) 555-0334',city:'Houston',state:'TX',zip:'77064',lead_status:'Proposal Sent',lead_source:'Door Knock',lead_score:91,created_at:'2026-04-05',address:'7788 Willow Bend Ct',assigned_rep:'Marcus Johnson'},
  { id:'5',first_name:'Brian',last_name:'Henderson',email:'bhenderson@gmail.com',phone:'(419) 555-0478',city:'Toledo',state:'OH',zip:'43615',lead_status:'New',lead_source:'Event',lead_score:45,created_at:'2026-04-13',address:'1400 Pine Valley Dr',assigned_rep:'James Wright'},
  { id:'6',first_name:'Ashley',last_name:'Baker',email:'abaker@outlook.com',phone:'(832) 555-0512',city:'Katy',state:'TX',zip:'77494',lead_status:'Qualified',lead_source:'Referral',lead_score:88,created_at:'2026-04-02',address:'2233 Oakmont Blvd',assigned_rep:'Sarah Chen'},
  { id:'7',first_name:'James',last_name:'Nguyen',email:'jnguyen@gmail.com',phone:'(734) 555-0641',city:'Ann Arbor',state:'MI',zip:'48104',lead_status:'Contacted',lead_source:'Online',lead_score:67,created_at:'2026-04-07',address:'890 Elmhurst Rd',assigned_rep:'David Park'},
  { id:'8',first_name:'Catherine',last_name:'Davis',email:'cdavis@proton.me',phone:'(281) 555-0789',city:'Sugar Land',state:'TX',zip:'77478',lead_status:'Disqualified',lead_source:'Partner',lead_score:22,created_at:'2026-03-28',address:'5544 River Oaks Dr',assigned_rep:'Marcus Johnson'},
  { id:'9',first_name:'Anthony',last_name:'Mitchell',email:'amitchell@gmail.com',phone:'(216) 555-0856',city:'Cleveland',state:'OH',zip:'44102',lead_status:'New',lead_source:'Door Knock',lead_score:53,created_at:'2026-04-14',address:'3321 Heritage Ct',assigned_rep:'James Wright'},
  { id:'10',first_name:'Amanda',last_name:'Clark',email:'aclark@yahoo.com',phone:'(713) 555-0923',city:'Pearland',state:'TX',zip:'77581',lead_status:'Qualified',lead_source:'Door Knock',lead_score:79,created_at:'2026-04-06',address:'1100 Magnolia Ln',assigned_rep:'Emily Rodriguez'},
];

export default function SolarLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(MOCK);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [showAdd, setShowAdd] = useState(false);
  const [showBulkAssign, setShowBulkAssign] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkRep, setBulkRep] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [form, setForm] = useState({ first_name:'',last_name:'',email:'',phone:'',address:'',city:'',state:'TX',zip:'',lead_source:'Door Knock',assigned_rep:'',notes:'' });

  const filtered = useMemo(() => {
    let f = [...leads];
    if (search) { const q = search.toLowerCase(); f = f.filter(l => `${l.first_name} ${l.last_name} ${l.email} ${l.phone} ${l.city}`.toLowerCase().includes(q)); }
    if (statusFilter !== 'All') f = f.filter(l => l.lead_status === statusFilter);
    if (sourceFilter !== 'All') f = f.filter(l => l.lead_source === sourceFilter);
    return f;
  }, [leads, search, statusFilter, sourceFilter]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const toggleAll = () => { if (selected.size === paginated.length) setSelected(new Set()); else setSelected(new Set(paginated.map(l => l.id))); };
  const toggleOne = (id: string) => { const s = new Set(selected); s.has(id) ? s.delete(id) : s.add(id); setSelected(s); };

  const handleAddLead = () => {
    setSaving(true);
    const nl: Lead = { id: Date.now().toString(), ...form, lead_status:'New', lead_score: Math.floor(Math.random()*40)+30, created_at: new Date().toISOString().split('T')[0] };
    setLeads(p => [nl, ...p]);
    setShowAdd(false);
    setForm({ first_name:'',last_name:'',email:'',phone:'',address:'',city:'',state:'TX',zip:'',lead_source:'Door Knock',assigned_rep:'',notes:'' });
    setSaving(false);
  };

  const handleBulkAssign = () => { if(!bulkRep) return; setLeads(p => p.map(l => selected.has(l.id)?{...l,assigned_rep:bulkRep}:l)); setSelected(new Set()); setShowBulkAssign(false); setBulkRep(''); };

  const exportCSV = () => {
    const h = ['First Name','Last Name','Email','Phone','Address','City','State','Zip','Status','Source','Score','Rep'];
    const r = filtered.map(l => [l.first_name,l.last_name,l.email,l.phone,l.address||'',l.city,l.state,l.zip,l.lead_status,l.lead_source,l.lead_score,l.assigned_rep||'']);
    const csv = [h,...r].map(x => x.join(',')).join('\n');
    const b = new Blob([csv],{type:'text/csv'}); const u = URL.createObjectURL(b);
    const a = document.createElement('a'); a.href=u; a.download='solar-leads.csv'; a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#0B1F3A] via-[#132d4f] to-[#0B1F3A]">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3"><Users size={28} className="text-[#F0A500]" /> Solar Leads</h1>
              <p className="text-blue-200/70 text-sm mt-1">{filtered.length} leads found</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowAdd(true)} className="bg-[#F0A500] hover:bg-[#d4920a] text-[#0B1F3A] font-semibold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2"><Plus size={16} /> Add Lead</button>
              {selected.size > 0 && <button onClick={() => setShowBulkAssign(true)} className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 border border-white/20"><UserPlus size={16} /> Bulk Assign ({selected.size})</button>}
              <button onClick={exportCSV} className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 border border-white/20"><Download size={16} /> Export</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 shadow-sm flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0A500]/30 focus:border-[#F0A500]" /></div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"><option value="All">All Status</option>{STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}</select>
          <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"><option value="All">All Sources</option>{SOURCE_OPTIONS.map(s => <option key={s}>{s}</option>)}</select>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 w-10"><button onClick={toggleAll}>{selected.size === paginated.length && paginated.length > 0 ? <CheckSquare size={16} className="text-[#F0A500]" /> : <Square size={16} className="text-gray-300" />}</button></th>
                {['Name','Address','Phone','Status','Source','Score','Rep','Created'].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{h}</th>)}
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map(l => (
                  <tr key={l.id} className={`hover:bg-gray-50/50 transition-colors ${selected.has(l.id)?'bg-[#F0A500]/5':''}`}>
                    <td className="px-4 py-3"><button onClick={() => toggleOne(l.id)}>{selected.has(l.id)?<CheckSquare size={16} className="text-[#F0A500]" />:<Square size={16} className="text-gray-300" />}</button></td>
                    <td className="px-4 py-3"><p className="font-semibold text-[#0B1F3A]">{l.first_name} {l.last_name}</p><p className="text-[11px] text-gray-400">{l.email}</p></td>
                    <td className="px-4 py-3"><p className="text-gray-700 text-xs">{l.address}</p><p className="text-[11px] text-gray-400">{l.city}, {l.state} {l.zip}</p></td>
                    <td className="px-4 py-3 text-xs">{l.phone}</td>
                    <td className="px-4 py-3 relative">
                      <button onClick={() => setEditingStatus(editingStatus===l.id?null:l.id)} className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${STATUS_COLORS[l.lead_status]||'bg-gray-50 text-gray-700 border-gray-200'}`}>{l.lead_status}</button>
                      {editingStatus===l.id && <div className="absolute z-20 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl py-1 w-40">
                        {STATUS_OPTIONS.map(s => <button key={s} onClick={() => { setLeads(p=>p.map(x=>x.id===l.id?{...x,lead_status:s}:x)); setEditingStatus(null); }} className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50">{s}</button>)}
                      </div>}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{l.lead_source}</td>
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{width:`${l.lead_score}%`,backgroundColor:l.lead_score>=75?'#007A67':l.lead_score>=50?'#F0A500':'#DC2626'}} /></div><span className="text-[11px] font-semibold text-gray-600">{l.lead_score}</span></div></td>
                    <td className="px-4 py-3 text-xs text-gray-600">{l.assigned_rep||'—'}</td>
                    <td className="px-4 py-3 text-[11px] text-gray-400">{l.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500">Show <select value={perPage} onChange={e=>{setPerPage(+e.target.value);setPage(1);}} className="border border-gray-200 rounded px-1.5 py-0.5 text-xs">{[25,50,100].map(n=><option key={n} value={n}>{n}</option>)}</select> per page — {filtered.length} total</div>
            <div className="flex items-center gap-1"><button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"><ChevronLeft size={16} /></button><span className="text-xs text-gray-600 px-2">Page {page} of {totalPages}</span><button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"><ChevronRight size={16} /></button></div>
          </div>
        </div>
      </div>

      {showAdd && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setShowAdd(false)}>
        <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e=>e.stopPropagation()}>
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between"><h2 className="text-lg font-bold text-[#0B1F3A]">Add Solar Lead</h2><button onClick={()=>setShowAdd(false)} className="p-1 hover:bg-gray-100 rounded"><X size={18} /></button></div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">{['first_name','last_name'].map(f=><div key={f}><label className="block text-xs font-semibold text-gray-600 mb-1">{f==='first_name'?'First Name *':'Last Name *'}</label><input value={(form as any)[f]} onChange={e=>setForm({...form,[f]:e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0A500]/30" /></div>)}</div>
            <div className="grid grid-cols-2 gap-4">{['email','phone'].map(f=><div key={f}><label className="block text-xs font-semibold text-gray-600 mb-1">{f==='email'?'Email':'Phone'}</label><input value={(form as any)[f]} onChange={e=>setForm({...form,[f]:e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0A500]/30" /></div>)}</div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Address</label><input value={form.address} onChange={e=>setForm({...form,address:e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0A500]/30" /></div>
            <div className="grid grid-cols-3 gap-4">
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">City</label><input value={form.city} onChange={e=>setForm({...form,city:e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0A500]/30" /></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">State</label><select value={form.state} onChange={e=>setForm({...form,state:e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">{STATE_OPTIONS.map(s=><option key={s}>{s}</option>)}</select></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Zip</label><input value={form.zip} onChange={e=>setForm({...form,zip:e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0A500]/30" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Source</label><select value={form.lead_source} onChange={e=>setForm({...form,lead_source:e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">{SOURCE_OPTIONS.map(s=><option key={s}>{s}</option>)}</select></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Assign to Rep</label><select value={form.assigned_rep} onChange={e=>setForm({...form,assigned_rep:e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"><option value="">Unassigned</option>{REPS.map(r=><option key={r}>{r}</option>)}</select></div>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
            <button onClick={()=>setShowAdd(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button onClick={handleAddLead} disabled={!form.first_name||!form.last_name||saving} className="px-5 py-2 bg-[#F0A500] hover:bg-[#d4920a] text-[#0B1F3A] font-semibold text-sm rounded-lg disabled:opacity-50 flex items-center gap-2">{saving?<Loader2 size={14} className="animate-spin" />:<Plus size={14} />} Add Lead</button>
          </div>
        </div>
      </div>}

      {showBulkAssign && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setShowBulkAssign(false)}>
        <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl" onClick={e=>e.stopPropagation()}>
          <div className="px-6 py-4 border-b border-gray-100"><h2 className="text-lg font-bold text-[#0B1F3A]">Bulk Assign {selected.size} Leads</h2></div>
          <div className="p-6"><label className="block text-xs font-semibold text-gray-600 mb-2">Assign to Rep</label><select value={bulkRep} onChange={e=>setBulkRep(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"><option value="">Select rep...</option>{REPS.map(r=><option key={r}>{r}</option>)}</select></div>
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3"><button onClick={()=>setShowBulkAssign(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button><button onClick={handleBulkAssign} disabled={!bulkRep} className="px-5 py-2 bg-[#F0A500] hover:bg-[#d4920a] text-[#0B1F3A] font-semibold text-sm rounded-lg disabled:opacity-50">Assign</button></div>
        </div>
      </div>}
    </div>
  );
}
