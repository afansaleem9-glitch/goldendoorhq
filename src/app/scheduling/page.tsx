"use client";
import { useState } from "react";
import {
  Calendar, Plus, ChevronLeft, ChevronRight, Clock,
  MapPin, User, Wrench, Eye, Sun, Shield, Home, Phone
} from "lucide-react";

interface ScheduleEvent {
  id: string;
  title: string;
  type: "install" | "survey" | "inspection" | "meeting" | "call" | "followup";
  date: string;
  start_time: string;
  end_time: string;
  address: string;
  city: string;
  state: string;
  contact_name: string;
  assigned_to: string;
  assigned_avatar: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  notes: string;
  vertical: "solar" | "smart_home" | "roofing" | "att";
}

const MOCK_EVENTS: ScheduleEvent[] = [
  { id: "e1", title: "Martinez Solar Install — Day 1", type: "install", date: "2026-04-14", start_time: "8:00 AM", end_time: "4:00 PM", address: "4521 Oak Lawn Ave", city: "Dallas", state: "TX", contact_name: "Robert Martinez", assigned_to: "Install Crew A", assigned_avatar: "IA", status: "in_progress", notes: "12kW system. 24 panels. Crew of 4.", vertical: "solar" },
  { id: "e2", title: "Thompson Site Survey", type: "survey", date: "2026-04-14", start_time: "10:00 AM", end_time: "11:30 AM", address: "1205 Mockingbird Ln", city: "Richardson", state: "TX", contact_name: "Michael Thompson", assigned_to: "Sarah Chen", assigned_avatar: "SC", status: "scheduled", notes: "Roof + electrical assessment for solar", vertical: "solar" },
  { id: "e3", title: "Garcia Monitoring Fix", type: "call", date: "2026-04-14", start_time: "11:00 AM", end_time: "11:30 AM", address: "4455 Hulen St", city: "Fort Worth", state: "TX", contact_name: "Carlos Garcia", assigned_to: "David Park", assigned_avatar: "DP", status: "scheduled", notes: "ADC panel offline — remote troubleshoot first", vertical: "smart_home" },
  { id: "e4", title: "Weekly Pipeline Review", type: "meeting", date: "2026-04-14", start_time: "2:00 PM", end_time: "3:00 PM", address: "HQ — Conference Room A", city: "Dallas", state: "TX", contact_name: "Leadership Team", assigned_to: "Afan Saleem", assigned_avatar: "AS", status: "scheduled", notes: "Q2 pipeline review + rep performance", vertical: "solar" },
  { id: "e5", title: "Williams Permit Pickup", type: "inspection", date: "2026-04-15", start_time: "9:00 AM", end_time: "10:00 AM", address: "City of Plano — Building Dept", city: "Plano", state: "TX", contact_name: "Jennifer Williams", assigned_to: "Sarah Chen", assigned_avatar: "SC", status: "scheduled", notes: "Pick up approved permit + schedule install", vertical: "solar" },
  { id: "e6", title: "Brown Roof Install — Day 2", type: "install", date: "2026-04-15", start_time: "7:30 AM", end_time: "5:00 PM", address: "5120 Woodward Ave", city: "Detroit", state: "MI", contact_name: "James Brown", assigned_to: "Install Crew B", assigned_avatar: "IB", status: "scheduled", notes: "GAF Timberline HDZ. Day 2 of 3.", vertical: "roofing" },
  { id: "e7", title: "Wilson Bundle Consultation", type: "followup", date: "2026-04-15", start_time: "1:00 PM", end_time: "2:00 PM", address: "7744 Forest Ln", city: "Dallas", state: "TX", contact_name: "Emily Wilson", assigned_to: "Marcus Johnson", assigned_avatar: "MJ", status: "scheduled", notes: "Solar + AT&T fiber bundle walkthrough", vertical: "att" },
  { id: "e8", title: "Moore System Inspection", type: "inspection", date: "2026-04-16", start_time: "10:00 AM", end_time: "11:00 AM", address: "3289 Main St", city: "Frisco", state: "TX", contact_name: "Patricia Moore", assigned_to: "David Park", assigned_avatar: "DP", status: "scheduled", notes: "Final city inspection — solar PV", vertical: "solar" },
  { id: "e9", title: "Johnson PTO Call — Cleveland Electric", type: "call", date: "2026-04-16", start_time: "2:00 PM", end_time: "2:30 PM", address: "Phone", city: "Cleveland", state: "OH", contact_name: "Sarah Johnson", assigned_to: "Sarah Chen", assigned_avatar: "SC", status: "scheduled", notes: "Follow up on interconnection application", vertical: "solar" },
  { id: "e10", title: "AT&T Fiber Install — Davis", type: "install", date: "2026-04-17", start_time: "9:00 AM", end_time: "12:00 PM", address: "3367 Camp Bowie Blvd", city: "Fort Worth", state: "TX", contact_name: "Amanda Davis", assigned_to: "AT&T Tech", assigned_avatar: "AT", status: "scheduled", notes: "Fiber ONT installation + router setup", vertical: "att" },
];

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  install: { label: "Install", color: "text-black", bg: "bg-black/5 border-l-4 border-l-black" },
  survey: { label: "Survey", color: "text-gray-700", bg: "bg-gray-50 border-l-4 border-l-gray-400" },
  inspection: { label: "Inspection", color: "text-blue-700", bg: "bg-blue-50/50 border-l-4 border-l-blue-400" },
  meeting: { label: "Meeting", color: "text-gray-600", bg: "bg-gray-50 border-l-4 border-l-gray-300" },
  call: { label: "Call", color: "text-green-700", bg: "bg-green-50/50 border-l-4 border-l-green-400" },
  followup: { label: "Follow-up", color: "text-amber-700", bg: "bg-amber-50/50 border-l-4 border-l-amber-400" },
};

const VERTICAL_ICON: Record<string, typeof Sun> = { solar: Sun, smart_home: Shield, roofing: Home, att: Phone };

const DAYS = ["Mon 4/13", "Tue 4/14", "Wed 4/15", "Thu 4/16", "Fri 4/17", "Sat 4/18", "Sun 4/19"];
const DATE_MAP: Record<string, string> = {
  "2026-04-13": "Mon 4/13", "2026-04-14": "Tue 4/14", "2026-04-15": "Wed 4/15",
  "2026-04-16": "Thu 4/16", "2026-04-17": "Fri 4/17", "2026-04-18": "Sat 4/18", "2026-04-19": "Sun 4/19",
};

export default function SchedulingPage() {
  const [events] = useState(MOCK_EVENTS);
  const [view, setView] = useState<"week" | "list">("week");
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);

  const todayCount = events.filter(e => e.date === "2026-04-14").length;
  const weekCount = events.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black flex items-center gap-2"><Calendar size={24} /> Scheduling</h1>
            <p className="text-sm text-gray-500 mt-1">{todayCount} events today · {weekCount} this week</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
              <button onClick={() => setView("week")} className={`px-3 py-1.5 text-xs font-semibold ${view === "week" ? "bg-black text-white" : "text-gray-500 hover:text-black"}`}>Week</button>
              <button onClick={() => setView("list")} className={`px-3 py-1.5 text-xs font-semibold ${view === "list" ? "bg-black text-white" : "text-gray-500 hover:text-black"}`}>List</button>
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">
              <Plus size={14} /> Add Event
            </button>
          </div>
        </div>

        {/* Week Header */}
        <div className="flex items-center gap-4 mb-4">
          <button className="p-1.5 rounded hover:bg-gray-200 transition-colors" aria-label="Previous week"><ChevronLeft size={18} /></button>
          <h2 className="text-lg font-bold text-black">April 13 — 19, 2026</h2>
          <button className="p-1.5 rounded hover:bg-gray-200 transition-colors" aria-label="Next week"><ChevronRight size={18} /></button>
          <button className="ml-2 px-3 py-1 bg-black text-white rounded text-xs font-semibold">Today</button>
        </div>

        {view === "week" ? (
          <div className="grid grid-cols-7 gap-3">
            {DAYS.map(day => {
              const isToday = day === "Tue 4/14";
              const dayEvents = events.filter(e => DATE_MAP[e.date] === day);
              return (
                <div key={day} className={`min-h-[400px] rounded-xl border ${isToday ? "border-black bg-white" : "border-gray-200 bg-white"}`}>
                  <div className={`px-3 py-2 border-b ${isToday ? "border-black bg-black text-white" : "border-gray-200/60"}`}>
                    <p className={`text-xs font-bold ${isToday ? "text-white" : "text-black"}`}>{day}</p>
                    {dayEvents.length > 0 && <p className={`text-[11px] ${isToday ? "text-white/60" : "text-gray-500"}`}>{dayEvents.length} events</p>}
                  </div>
                  <div className="p-2 space-y-1.5">
                    {dayEvents.map(event => {
                      const tc = TYPE_CONFIG[event.type];
                      const VIcon = VERTICAL_ICON[event.vertical];
                      return (
                        <button
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className={`w-full text-left p-2 rounded-lg ${tc.bg} hover:shadow-sm transition-shadow`}
                        >
                          <div className="flex items-center gap-1 mb-0.5">
                            <VIcon size={10} className="text-gray-500" />
                            <span className="text-[9px] font-semibold text-gray-500">{event.start_time}</span>
                          </div>
                          <p className="text-[11px] font-semibold text-black leading-tight">{event.title}</p>
                          <p className="text-[9px] text-gray-500 mt-0.5">{event.contact_name}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200/60 bg-gray-50/50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Event</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Date & Time</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Location</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Assigned</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedEvent(event)}>
                    <td className="py-3 px-4"><p className="font-semibold text-black">{event.title}</p><p className="text-xs text-gray-500">{event.contact_name}</p></td>
                    <td className="py-3 px-4"><span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600">{TYPE_CONFIG[event.type].label}</span></td>
                    <td className="py-3 px-4 text-gray-600"><p className="text-xs">{event.date}</p><p className="text-xs text-gray-500">{event.start_time} – {event.end_time}</p></td>
                    <td className="py-3 px-4 text-xs text-gray-600">{event.address}, {event.city}, {event.state}</td>
                    <td className="py-3 px-4"><div className="flex items-center gap-1.5"><div className="w-6 h-6 rounded-full bg-black text-white text-[11px] font-bold flex items-center justify-center">{event.assigned_avatar}</div><span className="text-xs text-gray-600">{event.assigned_to}</span></div></td>
                    <td className="py-3 px-4"><span className={`text-xs font-semibold ${event.status === "in_progress" ? "text-amber-600" : event.status === "completed" ? "text-green-600" : "text-gray-500"}`}>{event.status.replace("_", " ")}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-label="Event details">
            <div className="absolute inset-0 bg-black/20" onClick={() => setSelectedEvent(null)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-[500px] max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${TYPE_CONFIG[selectedEvent.type].bg.split(" ")[0]} text-gray-700`}>{TYPE_CONFIG[selectedEvent.type].label}</span>
                  <button onClick={() => setSelectedEvent(null)} className="text-gray-500 hover:text-black text-lg" aria-label="Close">&times;</button>
                </div>
                <h2 className="text-lg font-bold text-black mb-2">{selectedEvent.title}</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600"><Clock size={14} /> {selectedEvent.start_time} – {selectedEvent.end_time}</div>
                  <div className="flex items-center gap-2 text-gray-600"><Calendar size={14} /> {selectedEvent.date}</div>
                  <div className="flex items-center gap-2 text-gray-600"><MapPin size={14} /> {selectedEvent.address}, {selectedEvent.city}, {selectedEvent.state}</div>
                  <div className="flex items-center gap-2 text-gray-600"><User size={14} /> {selectedEvent.contact_name}</div>
                  <div className="flex items-center gap-2 text-gray-600"><Wrench size={14} /> {selectedEvent.assigned_to}</div>
                  <div className="pt-3 border-t border-gray-200/60">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Notes</p>
                    <p className="text-sm text-gray-700">{selectedEvent.notes}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
