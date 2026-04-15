"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { RefreshCw, Plus, CheckCircle, AlertTriangle, Clock, ArrowLeftRight, Trash2, Settings, Search, Filter } from "lucide-react";

interface SyncConnection {
  id: string;
  name: string;
  source_app: string;
  target_app: string;
  object_type: string;
  direction: string;
  status: string;
  last_sync: string;
  records_synced: number;
  frequency: string;
}

const MOCK_CONNECTIONS: SyncConnection[] = [
  { id: "1", name: "HubSpot Contacts", source_app: "HubSpot", target_app: "GoldenDoor", object_type: "Contacts", direction: "two-way", status: "active", last_sync: "2 min ago", records_synced: 14523, frequency: "Real-time" },
  { id: "2", name: "Stripe Payments", source_app: "Stripe", target_app: "GoldenDoor", object_type: "Payments", direction: "one-way", status: "active", last_sync: "5 min ago", records_synced: 3891, frequency: "Every 5 min" },
  { id: "3", name: "QuickBooks Invoices", source_app: "QuickBooks", target_app: "GoldenDoor", object_type: "Invoices", direction: "two-way", status: "active", last_sync: "12 min ago", records_synced: 2156, frequency: "Every 15 min" },
  { id: "4", name: "Salesforce Deals", source_app: "Salesforce", target_app: "GoldenDoor", object_type: "Deals", direction: "one-way", status: "error", last_sync: "1 hr ago", records_synced: 892, frequency: "Every 30 min" },
  { id: "5", name: "Google Calendar Events", source_app: "Google Calendar", target_app: "GoldenDoor", object_type: "Meetings", direction: "two-way", status: "active", last_sync: "1 min ago", records_synced: 567, frequency: "Real-time" },
  { id: "6", name: "Mailchimp Lists", source_app: "Mailchimp", target_app: "GoldenDoor", object_type: "Contacts", direction: "one-way", status: "paused", last_sync: "3 days ago", records_synced: 8934, frequency: "Daily" },
  { id: "7", name: "Slack Notifications", source_app: "GoldenDoor", target_app: "Slack", object_type: "Activities", direction: "one-way", status: "active", last_sync: "30 sec ago", records_synced: 24102, frequency: "Real-time" },
  { id: "8", name: "Zapier Webhooks", source_app: "Zapier", target_app: "GoldenDoor", object_type: "Custom", direction: "two-way", status: "active", last_sync: "8 min ago", records_synced: 1203, frequency: "On trigger" },
  { id: "9", name: "SiteCapture Photos", source_app: "SiteCapture", target_app: "GoldenDoor", object_type: "Media", direction: "one-way", status: "active", last_sync: "20 min ago", records_synced: 4521, frequency: "Every 10 min" },
  { id: "10", name: "CompanyCam Projects", source_app: "CompanyCam", target_app: "GoldenDoor", object_type: "Projects", direction: "two-way", status: "error", last_sync: "2 hrs ago", records_synced: 312, frequency: "Every 15 min" },
];

export default function DataSyncPage() {
  const [connections, setConnections] = useState<SyncConnection[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [newConn, setNewConn] = useState({ name: "", source_app: "", target_app: "GoldenDoor", object_type: "Contacts", direction: "two-way", frequency: "Real-time" });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("data_sync_connections").select("*").eq("org_id", ORG_ID).order("created_at", { ascending: false });
      setConnections(data && data.length > 0 ? data : MOCK_CONNECTIONS);
    })();
  }, []);

  const filtered = connections.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.source_app.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAdd = async () => {
    const record = { ...newConn, org_id: ORG_ID, status: "active", last_sync: "Just now", records_synced: 0 };
    const { data } = await supabase.from("data_sync_connections").insert(record).select();
    if (data) setConnections([data[0], ...connections]);
    else setConnections([{ id: Date.now().toString(), ...record } as any, ...connections]);
    setShowAdd(false);
    setNewConn({ name: "", source_app: "", target_app: "GoldenDoor", object_type: "Contacts", direction: "two-way", frequency: "Real-time" });
  };

  const statusColor: Record<string, string> = { active: "bg-green-100 text-green-700", error: "bg-red-100 text-red-700", paused: "bg-yellow-100 text-yellow-700" };
  const activeCount = connections.filter((c) => c.status === "active").length;
  const errorCount = connections.filter((c) => c.status === "error").length;
  const totalRecords = connections.reduce((a, c) => a + c.records_synced, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <RefreshCw className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Data Sync</h1>
            </div>
            <p className="text-blue-200">Keep your data in sync across every app. Two-way or one-way — you choose.</p>
          </div>
          <button onClick={() => setShowAdd(true)} className="bg-white text-blue-700 px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-50">
            <Plus className="w-5 h-5" /> New Connection
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[
            { label: "Total Connections", val: connections.length },
            { label: "Active", val: activeCount },
            { label: "Errors", val: errorCount },
            { label: "Records Synced", val: totalRecords.toLocaleString() },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold">{s.val}</div>
              <div className="text-blue-200 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search connections..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div className="flex gap-2">
          {["all", "active", "error", "paused"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${statusFilter === s ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((c) => (
          <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ArrowLeftRight className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{c.name}</h3>
                  <p className="text-sm text-gray-500">{c.source_app} → {c.target_app} • {c.object_type} • {c.direction}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{c.records_synced.toLocaleString()} records</div>
                  <div className="flex items-center gap-1 text-xs text-gray-500"><Clock className="w-3 h-3" /> {c.last_sync} • {c.frequency}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[c.status] || "bg-gray-100 text-gray-600"}`}>{c.status}</span>
                <button className="p-2 text-gray-400 hover:text-gray-600"><Settings className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-6">New Sync Connection</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Connection Name</label><input value={newConn.name} onChange={(e) => setNewConn({ ...newConn, name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="e.g. HubSpot Contacts Sync" /></div>
              <div><label className="block text-sm font-medium mb-1">Source App</label><input value={newConn.source_app} onChange={(e) => setNewConn({ ...newConn, source_app: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="e.g. HubSpot, Stripe, Salesforce" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Object Type</label><select value={newConn.object_type} onChange={(e) => setNewConn({ ...newConn, object_type: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2"><option>Contacts</option><option>Deals</option><option>Payments</option><option>Invoices</option><option>Meetings</option><option>Custom</option></select></div>
                <div><label className="block text-sm font-medium mb-1">Direction</label><select value={newConn.direction} onChange={(e) => setNewConn({ ...newConn, direction: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2"><option value="two-way">Two-way</option><option value="one-way">One-way</option></select></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Frequency</label><select value={newConn.frequency} onChange={(e) => setNewConn({ ...newConn, frequency: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2"><option>Real-time</option><option>Every 5 min</option><option>Every 15 min</option><option>Every 30 min</option><option>Hourly</option><option>Daily</option></select></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleAdd} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700">Create Connection</button>
              <button onClick={() => setShowAdd(false)} className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
