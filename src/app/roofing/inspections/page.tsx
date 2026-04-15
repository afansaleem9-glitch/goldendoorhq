"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { Calendar, Clock, MapPin, Plus, X, CheckCircle, XCircle } from "lucide-react";

const STATUS_COLORS: Record<string, string> = { Scheduled: "bg-blue-100 text-blue-800", Completed: "bg-green-100 text-green-800", Cancelled: "bg-red-100 text-red-800" };

const MOCK = [
  { id: "1", title: "Roof Inspection - Johnson", scheduled_date: "2025-04-14", start_time: "09:00", end_time: "10:30", address: "1420 Oak Hill Dr, Austin TX", status: "Scheduled", notes: "Storm damage assessment", description: "Inspector: Mike Torres" },
  { id: "2", title: "Post-Install Inspection", scheduled_date: "2025-04-14", start_time: "13:00", end_time: "14:00", address: "890 Maple Ave, Columbus OH", status: "Completed", notes: "Final walkthrough", description: "Inspector: Sarah Kim" },
  { id: "3", title: "Insurance Inspection - Chen", scheduled_date: "2025-04-15", start_time: "10:00", end_time: "11:30", address: "2100 Elm St, Detroit MI", status: "Scheduled", notes: "Allstate adjuster present", description: "Inspector: Mike Torres" },
  { id: "4", title: "Roof Inspection - Davis", scheduled_date: "2025-04-15", start_time: "14:00", end_time: "15:00", address: "456 Cedar Ln, San Antonio TX", status: "Scheduled", notes: "New lead assessment", description: "Inspector: James Reed" },
  { id: "5", title: "Maintenance Check - Wilson", scheduled_date: "2025-04-16", start_time: "09:00", end_time: "10:00", address: "789 Pine Rd, Cleveland OH", status: "Scheduled", notes: "Annual maintenance", description: "Inspector: Sarah Kim" },
  { id: "6", title: "Repair Verification", scheduled_date: "2025-04-12", start_time: "11:00", end_time: "12:00", address: "321 Birch Ct, Ann Arbor MI", status: "Completed", notes: "Verify leak repair", description: "Inspector: Mike Torres" },
  { id: "7", title: "Pre-Install Survey", scheduled_date: "2025-04-11", start_time: "08:00", end_time: "09:30", address: "555 Walnut Dr, Houston TX", status: "Completed", notes: "Measurements + material order", description: "Inspector: James Reed" },
  { id: "8", title: "Emergency Inspection", scheduled_date: "2025-04-10", start_time: "16:00", end_time: "17:00", address: "100 Main St, Toledo OH", status: "Cancelled", notes: "Customer rescheduled", description: "Inspector: Sarah Kim" },
];

export default function RoofingInspectionsPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", scheduled_date: "", start_time: "09:00", end_time: "10:00", address: "", notes: "", description: "" });

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("schedule_entries").select("*").eq("organization_id", ORG_ID).eq("entry_type", "roofing_inspection").order("scheduled_date", { ascending: false });
      setEntries(data && data.length > 0 ? data : MOCK);
    }
    load();
  }, []);

  const grouped = entries.reduce((acc: Record<string, any[]>, e) => { const d = e.scheduled_date; if (!acc[d]) acc[d] = []; acc[d].push(e); return acc; }, {});
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const stats = [
    { label: "This Week", value: entries.filter(e => e.status === "Scheduled").length, color: "text-blue-600" },
    { label: "Completed", value: entries.filter(e => e.status === "Completed").length, color: "text-green-600" },
    { label: "Cancelled", value: entries.filter(e => e.status === "Cancelled").length, color: "text-red-600" },
  ];

  async function handleAdd() {
    await supabase.from("schedule_entries").insert({ organization_id: ORG_ID, entry_type: "roofing_inspection", ...form, status: "Scheduled" });
    setShowModal(false);
    const { data } = await supabase.from("schedule_entries").select("*").eq("organization_id", ORG_ID).eq("entry_type", "roofing_inspection").order("scheduled_date", { ascending: false });
    if (data && data.length) setEntries(data);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-amber-900 to-amber-700 text-white px-8 py-8">
        <h1 className="text-2xl font-bold">Roofing Inspections</h1>
        <p className="text-amber-200 text-sm mt-1">Schedule and track roof inspections</p>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex items-center gap-4 mb-6">
          {stats.map(s => <div key={s.label} className="bg-white rounded-xl border px-5 py-3 flex-1 text-center"><div className={`text-2xl font-bold ${s.color}`}>{s.value}</div><div className="text-xs text-gray-500">{s.label}</div></div>)}
          <button onClick={() => setShowModal(true)} className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 shrink-0"><Plus size={16} />Schedule</button>
        </div>
        <div className="space-y-6">
          {sortedDates.map(date => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-3"><Calendar size={16} className="text-amber-600" /><h3 className="font-semibold text-sm">{new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</h3></div>
              <div className="space-y-2">
                {grouped[date].sort((a: any, b: any) => a.start_time.localeCompare(b.start_time)).map((e: any) => (
                  <div key={e.id} className="bg-white rounded-lg border p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                    <div className="text-center shrink-0 w-16"><div className="text-sm font-bold">{e.start_time}</div><div className="text-xs text-gray-400">{e.end_time}</div></div>
                    <div className="w-px h-10 bg-gray-200" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{e.title}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><MapPin size={11} />{e.address}</p>
                      {e.description && <p className="text-xs text-gray-400 mt-0.5">{e.description}</p>}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ${STATUS_COLORS[e.status] || "bg-gray-100"}`}>{e.status}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">Schedule Inspection</h2><button onClick={() => setShowModal(false)}><X size={20} /></button></div>
            <div className="space-y-3">
              <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <input type="date" value={form.scheduled_date} onChange={e => setForm({...form, scheduled_date: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <div className="grid grid-cols-2 gap-3"><input type="time" value={form.start_time} onChange={e => setForm({...form, start_time: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" /><input type="time" value={form.end_time} onChange={e => setForm({...form, end_time: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" /></div>
              <input placeholder="Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Inspector" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" rows={2} />
            </div>
            <button onClick={handleAdd} className="w-full mt-4 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg font-medium">Schedule</button>
          </div>
        </div>
      )}
    </div>
  );
}
