"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Users, Search, Plus, Phone, Mail,
  MapPin, Calendar, Edit2, X, Check, Trash2,
  Download, Tag, ArrowUpDown, Loader2
} from "lucide-react";
import { supabase, ORG_ID } from "@/lib/supabase";

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  mobile: string;
  job_title: string;
  lifecycle_stage: string;
  lead_status: string;
  lead_score: number;
  lead_source: string;
  city: string;
  state: string;
  zip: string;
  tags: string[];
  last_contacted: string | null;
  created_at: string;
}

const LIFECYCLE_STAGES = ["All", "subscriber", "lead", "marketing_qualified_lead", "sales_qualified_lead", "opportunity", "customer", "evangelist"];
const LEAD_STATUSES = ["All", "new", "open", "in_progress", "open_deal", "unqualified", "attempted_to_contact", "connected", "bad_timing"];
const STAGE_LABELS: Record<string, string> = { subscriber: "Subscriber", lead: "Lead", marketing_qualified_lead: "MQL", sales_qualified_lead: "SQL", opportunity: "Opportunity", customer: "Customer", evangelist: "Evangelist", other: "Other" };
const STATUS_LABELS: Record<string, string> = { new: "New", open: "Open", in_progress: "In Progress", open_deal: "Open Deal", unqualified: "Unqualified", attempted_to_contact: "Attempting", connected: "Connected", bad_timing: "Bad Timing" };

const EMPTY_CONTACT = { first_name: "", last_name: "", email: "", phone: "", mobile: "", job_title: "Homeowner", lifecycle_stage: "lead", lead_status: "new", lead_score: 0, lead_source: "", city: "", state: "", zip: "", tags: [] as string[] };

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newContact, setNewContact] = useState(EMPTY_CONTACT);
  const [saving, setSaving] = useState(false);
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contacts")
      .select("id, first_name, last_name, email, phone, mobile, job_title, lifecycle_stage, lead_status, lead_score, lead_source, city, state, zip, tags, last_contacted, created_at")
      .eq("organization_id", ORG_ID)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });
    if (!error && data) setContacts(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const filtered = useMemo(() => {
    return contacts.filter(c => {
      const matchSearch = search === "" || `${c.first_name} ${c.last_name} ${c.email} ${c.phone} ${c.city}`.toLowerCase().includes(search.toLowerCase());
      const matchStage = stageFilter === "All" || c.lifecycle_stage === stageFilter;
      const matchStatus = statusFilter === "All" || c.lead_status === statusFilter;
      return matchSearch && matchStage && matchStatus;
    });
  }, [contacts, search, stageFilter, statusFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[sortField] ?? "";
      const bVal = (b as unknown as Record<string, unknown>)[sortField] ?? "";
      if (typeof aVal === "number" && typeof bVal === "number") return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      return sortDir === "asc" ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
    });
  }, [filtered, sortField, sortDir]);

  const saveEdit = async (contactId: string, field: string) => {
    const { error } = await supabase.from("contacts").update({ [field]: editValue, updated_at: new Date().toISOString() }).eq("id", contactId);
    if (!error) {
      setContacts(prev => prev.map(c => c.id === contactId ? { ...c, [field]: editValue } : c));
      if (selectedContact?.id === contactId) setSelectedContact({ ...selectedContact, [field]: editValue } as Contact);
    }
    setEditingField(null);
  };

  const createContact = async () => {
    if (!newContact.first_name || !newContact.last_name) return;
    setSaving(true);
    const { data, error } = await supabase.from("contacts").insert({
      organization_id: ORG_ID,
      ...newContact,
      lead_score: newContact.lead_score || 0,
    }).select().single();
    if (!error && data) {
      setContacts(prev => [data, ...prev]);
      setShowCreate(false);
      setNewContact(EMPTY_CONTACT);
    }
    setSaving(false);
  };

  const deleteContact = async (id: string) => {
    if (!confirm("Delete this contact? This action is permanent.")) return;
    const { error } = await supabase.from("contacts").update({ deleted_at: new Date().toISOString() }).eq("id", id);
    if (!error) {
      setContacts(prev => prev.filter(c => c.id !== id));
      if (selectedContact?.id === id) setSelectedContact(null);
    }
  };

  const exportCSV = () => {
    const headers = "First Name,Last Name,Email,Phone,City,State,Stage,Status,Source,Score\n";
    const rows = contacts.map(c => `${c.first_name},${c.last_name},${c.email},${c.phone},${c.city},${c.state},${c.lifecycle_stage},${c.lead_status},${c.lead_source},${c.lead_score}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "delta-contacts.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const stageColor = (stage: string) => {
    switch (stage) {
      case "customer": return "bg-green-50 text-green-700";
      case "opportunity": return "bg-amber-50 text-amber-700";
      case "sales_qualified_lead": return "bg-blue-50 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const timeAgo = (ts: string | null) => {
    if (!ts) return "Never";
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black flex items-center gap-2"><Users size={24} /> Contacts</h1>
            <p className="text-sm text-gray-500 mt-1">{filtered.length} contacts{stageFilter !== "All" ? ` · ${STAGE_LABELS[stageFilter] || stageFilter}` : ""}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <Download size={14} /> Export CSV
            </button>
            <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">
              <Plus size={14} /> Add Contact
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 max-w-md focus-within:border-black transition-all">
            <Search size={14} className="text-gray-500 mr-2" />
            <input type="text" placeholder="Search contacts..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 text-sm outline-none bg-transparent text-black placeholder-gray-400" aria-label="Search contacts" />
          </div>
          <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-black outline-none focus:border-black" aria-label="Filter by stage">
            {LIFECYCLE_STAGES.map(s => <option key={s} value={s}>{s === "All" ? "All Stages" : STAGE_LABELS[s] || s}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-black outline-none focus:border-black" aria-label="Filter by status">
            {LEAD_STATUSES.map(s => <option key={s} value={s}>{s === "All" ? "All Statuses" : STATUS_LABELS[s] || s}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-gray-400" /><span className="ml-2 text-gray-500">Loading contacts...</span></div>
        ) : (
          <div className="flex gap-6">
            {/* Table */}
            <div className="flex-1 min-w-0 bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200/60 bg-gray-50/50">
                      {[
                        { key: "first_name", label: "Name" },
                        { key: "email", label: "Email" },
                        { key: "phone", label: "Phone" },
                        { key: "lifecycle_stage", label: "Stage" },
                        { key: "lead_source", label: "Source" },
                        { key: "lead_score", label: "Score" },
                        { key: "city", label: "Location" },
                        { key: "created_at", label: "Created" },
                      ].map(col => (
                        <th key={col.key} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          <button className="flex items-center gap-1 hover:text-black transition-colors" onClick={() => { setSortField(col.key); setSortDir(d => d === "asc" ? "desc" : "asc"); }}>
                            {col.label} <ArrowUpDown size={11} />
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((contact) => (
                      <tr key={contact.id} className={`border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${selectedContact?.id === contact.id ? "bg-gray-50" : ""}`} onClick={() => setSelectedContact(contact)}>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold shrink-0">
                              {contact.first_name[0]}{contact.last_name[0]}
                            </div>
                            <div>
                              <p className="font-semibold text-black">{contact.first_name} {contact.last_name}</p>
                              <p className="text-xs text-gray-500">{contact.job_title}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{contact.email}</td>
                        <td className="py-3 px-4 text-gray-600 font-mono text-xs">{contact.phone}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stageColor(contact.lifecycle_stage)}`}>
                            {STAGE_LABELS[contact.lifecycle_stage] || contact.lifecycle_stage}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-xs">{contact.lead_source}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-black rounded-full" style={{ width: `${contact.lead_score}%` }} /></div>
                            <span className="text-xs font-mono text-gray-600">{contact.lead_score}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-xs">{contact.city}{contact.state ? `, ${contact.state}` : ""}</td>
                        <td className="py-3 px-4 text-gray-500 text-xs">{new Date(contact.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                      </tr>
                    ))}
                    {sorted.length === 0 && (
                      <tr><td colSpan={8} className="py-12 text-center text-gray-500">No contacts found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detail Panel */}
            {selectedContact && (
              <aside className="w-[400px] shrink-0 bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-5 border-b border-gray-200/60">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-black">{selectedContact.first_name} {selectedContact.last_name}</h2>
                    <div className="flex items-center gap-2">
                      <button onClick={() => deleteContact(selectedContact.id)} className="text-red-500 hover:text-red-700 transition-colors" aria-label="Delete contact"><Trash2 size={16} /></button>
                      <button onClick={() => setSelectedContact(null)} className="text-gray-500 hover:text-black transition-colors" aria-label="Close panel"><X size={18} /></button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold">
                      {selectedContact.first_name[0]}{selectedContact.last_name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-black">{selectedContact.job_title}</p>
                      <p className="text-xs text-gray-500">{selectedContact.city}, {selectedContact.state} {selectedContact.zip}</p>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {(selectedContact.tags || []).map(t => (
                          <span key={t} className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <a href={`tel:${selectedContact.phone}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-black text-white rounded-lg text-xs font-semibold hover:bg-gray-800 transition-colors"><Phone size={13} /> Call</a>
                    <a href={`mailto:${selectedContact.email}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-black hover:bg-gray-50 transition-colors"><Mail size={13} /> Email</a>
                  </div>
                </div>

                <div className="p-5 space-y-3 max-h-[calc(100vh-350px)] overflow-y-auto">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact Details</h3>
                  {[
                    { key: "email", label: "Email", icon: Mail },
                    { key: "phone", label: "Phone", icon: Phone },
                    { key: "mobile", label: "Mobile", icon: Phone },
                    { key: "city", label: "City", icon: MapPin },
                    { key: "state", label: "State", icon: MapPin },
                    { key: "zip", label: "ZIP", icon: MapPin },
                    { key: "lifecycle_stage", label: "Lifecycle Stage", icon: Tag },
                    { key: "lead_status", label: "Lead Status", icon: Tag },
                    { key: "lead_source", label: "Lead Source", icon: Tag },
                    { key: "created_at", label: "Created", icon: Calendar },
                  ].map((prop) => {
                    const Icon = prop.icon;
                    const rawValue = selectedContact[prop.key as keyof Contact];
                    const value = prop.key === "created_at" ? new Date(rawValue as string).toLocaleDateString() : String(rawValue ?? "—");
                    const isEditing = editingField === `${selectedContact.id}-${prop.key}`;
                    const isReadOnly = prop.key === "created_at";
                    return (
                      <div key={prop.key} className="flex items-start gap-3 group">
                        <Icon size={13} className="text-gray-500 mt-1 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{prop.label}</p>
                          {isEditing ? (
                            <div className="flex items-center gap-1 mt-0.5">
                              {(prop.key === "lifecycle_stage") ? (
                                <select autoFocus value={editValue} onChange={(e) => setEditValue(e.target.value)} className="flex-1 text-sm text-black border border-black rounded px-2 py-0.5 outline-none">
                                  {LIFECYCLE_STAGES.filter(s => s !== "All").map(s => <option key={s} value={s}>{STAGE_LABELS[s] || s}</option>)}
                                </select>
                              ) : (prop.key === "lead_status") ? (
                                <select autoFocus value={editValue} onChange={(e) => setEditValue(e.target.value)} className="flex-1 text-sm text-black border border-black rounded px-2 py-0.5 outline-none">
                                  {LEAD_STATUSES.filter(s => s !== "All").map(s => <option key={s} value={s}>{STATUS_LABELS[s] || s}</option>)}
                                </select>
                              ) : (
                                <input autoFocus type="text" value={editValue} onChange={(e) => setEditValue(e.target.value)}
                                  onKeyDown={(e) => { if (e.key === "Enter") saveEdit(selectedContact.id, prop.key); if (e.key === "Escape") setEditingField(null); }}
                                  className="flex-1 text-sm text-black border border-black rounded px-2 py-0.5 outline-none" />
                              )}
                              <button onClick={() => saveEdit(selectedContact.id, prop.key)} className="text-green-600 hover:text-green-700"><Check size={14} /></button>
                              <button onClick={() => setEditingField(null)} className="text-gray-500 hover:text-black"><X size={14} /></button>
                            </div>
                          ) : (
                            <button
                              onClick={() => { if (!isReadOnly) { setEditingField(`${selectedContact.id}-${prop.key}`); setEditValue(String(rawValue ?? "")); } }}
                              className={`text-sm text-black flex items-center gap-1 mt-0.5 ${isReadOnly ? "cursor-default" : "hover:underline"}`}
                            >
                              {prop.key === "lifecycle_stage" ? (STAGE_LABELS[value] || value) : prop.key === "lead_status" ? (STATUS_LABELS[value] || value) : value}
                              {!isReadOnly && <Edit2 size={10} className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div className="pt-3 border-t border-gray-200/60">
                    <p className="text-xs text-gray-500">Lead Score: <strong className="text-black">{selectedContact.lead_score}/100</strong></p>
                    <p className="text-xs text-gray-500 mt-1">Last Contacted: <strong className="text-black">{timeAgo(selectedContact.last_contacted)}</strong></p>
                  </div>
                </div>
              </aside>
            )}
          </div>
        )}

        {/* Create Contact Modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCreate(false)}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-black">New Contact</h2>
                <button onClick={() => setShowCreate(false)} className="text-gray-500 hover:text-black"><X size={18} /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">First Name *</label>
                  <input type="text" value={newContact.first_name} onChange={e => setNewContact(p => ({ ...p, first_name: e.target.value }))} className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black outline-none focus:border-black" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Last Name *</label>
                  <input type="text" value={newContact.last_name} onChange={e => setNewContact(p => ({ ...p, last_name: e.target.value }))} className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black outline-none focus:border-black" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Email</label>
                  <input type="email" value={newContact.email} onChange={e => setNewContact(p => ({ ...p, email: e.target.value }))} className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black outline-none focus:border-black" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Phone</label>
                  <input type="tel" value={newContact.phone} onChange={e => setNewContact(p => ({ ...p, phone: e.target.value }))} className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black outline-none focus:border-black" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">City</label>
                  <input type="text" value={newContact.city} onChange={e => setNewContact(p => ({ ...p, city: e.target.value }))} className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black outline-none focus:border-black" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">State</label>
                  <input type="text" value={newContact.state} onChange={e => setNewContact(p => ({ ...p, state: e.target.value }))} className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black outline-none focus:border-black" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Lifecycle Stage</label>
                  <select value={newContact.lifecycle_stage} onChange={e => setNewContact(p => ({ ...p, lifecycle_stage: e.target.value }))} className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black outline-none focus:border-black">
                    {LIFECYCLE_STAGES.filter(s => s !== "All").map(s => <option key={s} value={s}>{STAGE_LABELS[s] || s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Lead Source</label>
                  <input type="text" value={newContact.lead_source} onChange={e => setNewContact(p => ({ ...p, lead_source: e.target.value }))} placeholder="Door Knock, Website, Referral..." className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black outline-none focus:border-black" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-5">
                <button onClick={() => setShowCreate(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                <button onClick={createContact} disabled={saving || !newContact.first_name || !newContact.last_name}
                  className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  {saving && <Loader2 size={14} className="animate-spin" />} Create Contact
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
