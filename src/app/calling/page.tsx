"use client";
import { useState, useEffect } from "react";
import { Phone, Search, PhoneCall, PhoneOff, PhoneMissed, PhoneIncoming, PhoneOutgoing, Clock, User, Voicemail, MessageSquare, Plus, BarChart3, Play, X } from "lucide-react";
import { supabase, ORG_ID } from "@/lib/supabase";

interface CallLog {
  id: string;
  customer_name: string;
  phone_number: string;
  duration_seconds: number;
  call_type: "inbound" | "outbound" | "transfer";
  status: "ringing" | "active" | "on_hold" | "completed" | "missed" | "voicemail";
  notes: string;
  handled_by: string;
  recording_url: string | null;
  started_at: string;
  created_at: string;
}

interface Extension {
  id: string;
  name: string;
  number: string;
  status: "available" | "on_call" | "dnd" | "offline";
  current_call: string;
}

const EXTENSIONS: Extension[] = [
  { id: "x1", name: "Afan Saleem", number: "101", status: "available", current_call: "" },
  { id: "x2", name: "Marcus Johnson", number: "102", status: "on_call", current_call: "Emily Wilson" },
  { id: "x3", name: "Sarah Chen", number: "103", status: "available", current_call: "" },
  { id: "x4", name: "David Park", number: "104", status: "dnd", current_call: "" },
  { id: "x5", name: "Lisa Rodriguez", number: "105", status: "available", current_call: "" },
];

const DIR_ICON = { inbound: PhoneIncoming, outbound: PhoneOutgoing, transfer: PhoneOff, missed: PhoneMissed };
const DIR_COLOR = { inbound: "text-blue-600", outbound: "text-green-600", transfer: "text-purple-600", missed: "text-red-600" };
const EXT_STATUS = { available: { label: "Available", color: "bg-green-500" }, on_call: { label: "On Call", color: "bg-amber-500" }, dnd: { label: "DND", color: "bg-red-500" }, offline: { label: "Offline", color: "bg-gray-300" } };

function formatDuration(seconds: number): string {
  if (!seconds || seconds === 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function getToday(): string {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

interface LogCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function LogCallModal({ isOpen, onClose, onSuccess }: LogCallModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callType, setCallType] = useState<"inbound" | "outbound" | "transfer">("outbound");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phoneNumber || !duration) return;

    setLoading(true);
    try {
      const durationSeconds = parseInt(duration) * 60;
      const { error } = await supabase.from("call_log").insert([
        {
          organization_id: ORG_ID,
          customer_name: customerName,
          phone_number: phoneNumber,
          call_type: callType,
          status: "completed",
          duration_seconds: durationSeconds,
          notes,
          handled_by: "Manual Entry",
          started_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
      setCustomerName("");
      setPhoneNumber("");
      setDuration("");
      setNotes("");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error logging call:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-black">Log Call</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-black outline-none focus:border-black"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="(555) 555-5555"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-black outline-none focus:border-black"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Call Type</label>
            <select
              value={callType}
              onChange={(e) => setCallType(e.target.value as "inbound" | "outbound" | "transfer")}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-black outline-none focus:border-black"
            >
              <option value="outbound">Outbound</option>
              <option value="inbound">Inbound</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="5"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-black outline-none focus:border-black"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Call details..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-black outline-none focus:border-black"
              rows={3}
            />
          </div>
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-black hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Logging..." : "Log Call"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface SMSModalProps {
  phoneNumber: string;
  contactName: string;
  isOpen: boolean;
  onClose: () => void;
}

function SMSModal({ phoneNumber, contactName, isOpen, onClose }: SMSModalProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      // Open SMS compose with pre-filled message
      const encodedMessage = encodeURIComponent(message);
      window.open(`sms:${phoneNumber}?body=${encodedMessage}`);
      setMessage("");
      onClose();
    } catch (error) {
      console.error("Error sending SMS:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-black">Send SMS</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X size={20} />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          To: <span className="font-semibold text-black">{contactName}</span> ({phoneNumber})
        </p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-black outline-none focus:border-black mb-4"
          rows={4}
        />
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-black hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={loading || !message.trim()}
            className="flex-1 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CallingPage() {
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialNumber, setDialNumber] = useState("");
  const [smsModal, setSmsModal] = useState<{ isOpen: boolean; phoneNumber: string; contactName: string }>({
    isOpen: false,
    phoneNumber: "",
    contactName: "",
  });
  const [logCallModalOpen, setLogCallModalOpen] = useState(false);

  useEffect(() => {
    const fetchCallLogs = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("call_log")
          .select("*")
          .eq("organization_id", ORG_ID)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setCallLogs(data || []);
      } catch (error) {
        console.error("Error fetching call logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCallLogs();
  }, []);

  const filtered = callLogs.filter(
    (c) =>
      search === "" ||
      c.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone_number.includes(search)
  );

  const today = getToday();
  const todaysCalls = callLogs.filter((c) => c.created_at?.split("T")[0] === today);
  const todayCallCount = todaysCalls.length;
  const todayTalkTime = todaysCalls.reduce((acc, c) => acc + (c.duration_seconds || 0), 0);
  const avgDuration = todayCallCount > 0 ? Math.round(todayTalkTime / todayCallCount) : 0;
  const missedCount = todaysCalls.filter((c) => c.status === "missed").length;

  const handleCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`);
  };

  const handleSMSClick = (phoneNumber: string, contactName: string) => {
    setSmsModal({ isOpen: true, phoneNumber, contactName });
  };

  const handleLogCallSuccess = async () => {
    try {
      const { data, error } = await supabase
        .from("call_log")
        .select("*")
        .eq("organization_id", ORG_ID)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCallLogs(data || []);
    } catch (error) {
      console.error("Error refreshing call logs:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black flex items-center gap-2">
              <Phone size={24} /> Calling Center
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              RingCentral integration — {todayCallCount} calls today, {formatDuration(todayTalkTime)} talk time
            </p>
          </div>
          <button
            onClick={() => setLogCallModalOpen(true)}
            className="py-2.5 px-4 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 flex items-center gap-2"
          >
            <Plus size={16} /> Log Call
          </button>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {/* Dialer + Extensions */}
          <div className="space-y-4">
            {/* Quick Dial */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-black mb-3">Quick Dial</h3>
              <input
                type="text"
                placeholder="Enter number or name..."
                value={dialNumber}
                onChange={(e) => setDialNumber(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-black outline-none focus:border-black mb-3"
                aria-label="Dial number"
              />
              <button
                onClick={() => handleCall(dialNumber)}
                disabled={!dialNumber}
                className="w-full py-2.5 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <PhoneCall size={14} /> Call
              </button>
              <button
                onClick={() => {
                  if (dialNumber) {
                    handleSMSClick(dialNumber, "Contact");
                  }
                }}
                disabled={!dialNumber}
                className="w-full py-2 mt-2 border border-gray-200 rounded-lg text-sm font-semibold text-black hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <MessageSquare size={14} /> Send SMS
              </button>
            </div>

            {/* Team Extensions */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-black mb-3">Team Extensions</h3>
              <div className="space-y-2">
                {EXTENSIONS.map((ext) => {
                  const es = EXT_STATUS[ext.status];
                  return (
                    <div key={ext.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[11px] font-bold">
                          {ext.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${es.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-black">{ext.name}</p>
                        <p className="text-[11px] text-gray-500">
                          Ext {ext.number} · {es.label}
                        </p>
                        {ext.current_call && <p className="text-[11px] text-amber-600">On call: {ext.current_call}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Today Stats */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-black mb-3">Today&apos;s Stats</h3>
              {[
                { label: "Total Calls", value: todayCallCount },
                { label: "Talk Time", value: formatDuration(todayTalkTime) },
                { label: "Avg Duration", value: formatDuration(avgDuration) },
                { label: "Missed Calls", value: missedCount },
              ].map((s) => (
                <div key={s.label} className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-xs text-gray-500">{s.label}</span>
                  <span className="text-xs font-bold text-black">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Call Log */}
          <div className="col-span-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 max-w-md focus-within:border-black transition-all">
                <Search size={14} className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search call log..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 text-sm outline-none bg-transparent text-black placeholder-gray-400"
                  aria-label="Search calls"
                />
              </div>
            </div>

            {loading ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <p className="text-gray-500">Loading call logs...</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200/60 bg-gray-50/50">
                      <th className="w-10 py-3 px-3"></th>
                      <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                      <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">Number</th>
                      <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">Duration</th>
                      <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">Rep</th>
                      <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">Time</th>
                      <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">Notes</th>
                      <th className="w-10 py-3 px-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 px-3 text-center text-gray-500">
                          No calls found
                        </td>
                      </tr>
                    ) : (
                      filtered.map((call) => {
                        const DIcon = DIR_ICON[call.call_type];
                        const dateObj = new Date(call.started_at);
                        const timeStr = dateObj.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        });
                        const dateStr = dateObj.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        });

                        return (
                          <tr key={call.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-3">
                              <DIcon size={16} className={DIR_COLOR[call.call_type]} />
                            </td>
                            <td className="py-3 px-3 font-semibold text-black">{call.customer_name}</td>
                            <td className="py-3 px-3 text-gray-600 font-mono text-xs">{call.phone_number}</td>
                            <td className="py-3 px-3">
                              <span
                                className={`text-xs font-mono ${
                                  call.duration_seconds === 0 ? "text-red-500" : "text-black"
                                }`}
                              >
                                {formatDuration(call.duration_seconds)}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-full bg-black text-white text-[9px] font-bold flex items-center justify-center">
                                  {call.handled_by.split(" ").map((n: string) => n[0]).join("").substring(0, 2)}
                                </div>
                                <span className="text-xs text-gray-600">
                                  {call.handled_by.split(" ")[0]}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-xs text-gray-500">
                              {timeStr}
                              <br />
                              <span className="text-gray-500">{dateStr}</span>
                            </td>
                            <td className="py-3 px-3 text-xs text-gray-500 max-w-[200px] truncate">
                              {call.notes}
                            </td>
                            <td className="py-3 px-3">
                              {call.recording_url && (
                                <button className="text-gray-500 hover:text-black" aria-label="Play recording">
                                  <Play size={14} />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <SMSModal
        isOpen={smsModal.isOpen}
        phoneNumber={smsModal.phoneNumber}
        contactName={smsModal.contactName}
        onClose={() => setSmsModal({ isOpen: false, phoneNumber: "", contactName: "" })}
      />
      <LogCallModal
        isOpen={logCallModalOpen}
        onClose={() => setLogCallModalOpen(false)}
        onSuccess={handleLogCallSuccess}
      />
    </div>
  );
}