"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { Calendar, Clock, Users, Plus, X, MapPin } from "lucide-react";

const TYPE_COLORS: Record<string, string> = { Discovery: "bg-blue-100 text-blue-800", Demo: "bg-purple-100 text-purple-800", Closing: "bg-green-100 text-green-800", "Follow-up": "bg-amber-100 text-amber-800" };

const MOCK = [
  { id: "1", title: "Solar Consultation - Johnson", scheduled_date: "2025-04-14", start_time: "09:00", end_time: "09:45", description: "Discovery", notes: "Marcus Johnson, Austin TX. Interested in 8kW system.", address: "Virtual - Zoom" },
  { id: "2", title: "Security Demo - Williams", scheduled_date: "2025-04-14", start_time: "11:00", end_time: "11:30", description: "Demo", notes: "Patricia Williams. Show Qolsys panel + cameras.", address: "890 Maple Ave, Columbus OH" },
  { id: "3", title: "Roofing Proposal - Chen", scheduled_date: "2025-04-15", start_time: "10:00", end_time: "10:45", description: "Closing", notes: "Robert Chen. Full replacement quote $28k.", address: "2100 Elm St, Detroit MI" },
  { id: "4", title: "AT&T Bundle Review - Davis", scheduled_date: "2025-04-15", start_time: "14:00", end_time: "14:30", description: "Follow-up", notes: "Sandra Davis. Fiber + wireless bundle.", address: "Virtual - Teams" },
  { id: "5", title: "Full Home Package - Thompson", scheduled_date: "2025-04-16", start_time: "09:00", end_time: "10:00", description: "Closing", notes: "David Thompson. Solar + Security + Roofing. $78k deal.", address: "555 Walnut Dr, Houston TX" },
  { id: "6", title: "Solar Follow-up - Anderson", scheduled_date: "2025-04-17", start_time: "13:00", end_time: "13:30", description: "Follow-up", notes: "Lisa Anderson. Address financing questions.", address: "Virtual - Zoom" },
];

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", scheduled_date: "", start_time: "09:00", end_time: "10:00", description: "Discovery", address: "", notes: "" });

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("schedule_entries").select("*").eq("organization_id", ORG_ID).eq("entry_type", "meeting").order("scheduled_date", { ascending: true });
      setMeetings(data && data.length > 0 ? data : MOCK);
    }
    load();
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const todayMeetings = meetings.filter(m => m.scheduled_date === today).length;
  const thisWeek = meetings.filter(m => { const d = new Date(m.scheduled_date); const now = new Date(); const weekEnd = new Date(now); weekEnd.setDate(now.getDate() + 7); return d >= now && d <= weekEnd; }).length;

  async function handleAdd() {
    await supabase.from("schedule_entries").insert({ organization_id: ORG_ID, entry_type: "meeting", ...form, status: "Scheduled" });
    setShowModal(false);
    const { data } = await supabase.from("schedule_entries").select("*").eq("organization_id", ORG_ID).eq("entry_type", "meeting").order("scheduled_date", { ascending: true });
    if (data && data.length) setMeetings(data);
  }

  const grouped = meetings.reduce((acc: Record<string, any[]>, m) => { const d = m.scheduled_date; if (!acc[d]) acc[d] = []; acc[d].push(m); return acc; }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#0B1F3A] to-[#1a3a5c] text-white px-8 py-8">
        <h1 className="text-2xl font-bold">Meetings</h1>
        <p className="text-blue-200 text-sm mt-1">Schedule and track sales meetings</p>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-white rounded-xl border px-5 py-3 flex-1 text-center"><div className="text-2xl font-bold text-blue-600">{todayMeetings}</div><div className="text-xs text-gray-500">Today</div></div>
          <div className="bg-white rounded-xl border px-5 py-3 flex-1 text-center"><div className="text-2xl font-bold text-purple-600">{thisWeek}</div><div className="text-xs text-gray-500">This Week</div></div>
          <div className="bg-white rounded-xl border px-5 py-3 flex-1 text-center"><div className="text-2xl font-bold text-green-600">{meetings.length}</div><div className="text-xs text-gray-500">Total Upcoming</div></div>
          <button onClick={() => setShowModal(true)} className="bg-[#0B1F3A] hover:bg-[#1a3a5c] text-white px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 shrink-0"><Plus size={16} />Schedule</button>
        </div>
        <div className="space-y-6">
          {Object.keys(grouped).sort().map(date => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2"><Calendar size={14} />{new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</h3>
              <div className="space-y-2">
                {grouped[date].sort((a: any, b: any) => a.start_time.localeCompare(b.start_time)).map((m: any) => (
                  <div key={m.id} className="bg-white rounded-lg border p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                    <div className="text-center shrink-0 w-16"><div className="text-sm font-bold">{m.start_time}</div><div className="text-xs text-gray-400">{m.end_time}</div></div>
                    <div className="w-px h-10 bg-gray-200" />
                    <div className="flex-1 min-w-0"><p className="font-medium text-sm truncate">{m.title}</p><p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><MapPin size={11} />{m.address}</p></div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ${TYPE_COLORS[m.description] || "bg-gray-100"}`}>{m.description}</span>
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
            <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">Schedule Meeting</h2><button onClick={() => setShowModal(false)}><X size={20} /></button></div>
            <div className="space-y-3">
              <input placeholder="Meeting Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <input type="date" value={form.scheduled_date} onChange={e => setForm({...form, scheduled_date: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <div className="grid grid-cols-2 gap-3"><input type="time" value={form.start_time} onChange={e => setForm({...form, start_time: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" /><input type="time" value={form.end_time} onChange={e => setForm({...form, end_time: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" /></div>
              <select value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"><option>Discovery</option><option>Demo</option><option>Closing</option><option>Follow-up</option></select>
              <input placeholder="Location / Link" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" rows={2} />
            </div>
            <button onClick={handleAdd} className="w-full mt-4 bg-[#0B1F3A] hover:bg-[#1a3a5c] text-white py-2 rounded-lg font-medium">Schedule Meeting</button>
          </div>
        </div>
      )}
    </div>
  );
}
