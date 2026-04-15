"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { Mail, Send, Eye, Plus, X, Search } from "lucide-react";

const STATUS_COLORS: Record<string, string> = { Draft: "bg-gray-100 text-gray-700", Scheduled: "bg-blue-100 text-blue-800", Sent: "bg-green-100 text-green-800", Active: "bg-purple-100 text-purple-800" };

const MOCK = [
  { id: "1", name: "Spring Solar Promo", subject: "Save 30% on Solar This Spring!", status: "Sent", stats: { sent: 4250, delivered: 4180, opened: 1672, clicked: 389, bounced: 70, unsubscribed: 12 }, sent_at: "2025-03-15" },
  { id: "2", name: "Security System Launch", subject: "Protect Your Home with Smart Security", status: "Active", stats: { sent: 2800, delivered: 2756, opened: 1240, clicked: 298, bounced: 44, unsubscribed: 8 }, sent_at: "2025-04-01" },
  { id: "3", name: "Roofing Season Kickoff", subject: "Free Roof Inspection - Limited Time", status: "Scheduled", stats: { sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0, unsubscribed: 0 }, send_at: "2025-04-20" },
  { id: "4", name: "Customer Referral Program", subject: "Earn $500 for Every Referral!", status: "Sent", stats: { sent: 3100, delivered: 3045, opened: 1523, clicked: 456, bounced: 55, unsubscribed: 5 }, sent_at: "2025-03-01" },
  { id: "5", name: "AT&T Bundle Offer", subject: "Internet + Wireless = Big Savings", status: "Draft", stats: { sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0, unsubscribed: 0 } },
  { id: "6", name: "Monthly Newsletter - April", subject: "Delta Power Group April Update", status: "Draft", stats: { sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0, unsubscribed: 0 } },
];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", subject: "", from_name: "Delta Power Group", from_email: "marketing@deltapowergroup.com" });

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("email_campaigns").select("*").eq("organization_id", ORG_ID).order("created_at", { ascending: false });
      setCampaigns(data && data.length > 0 ? data : MOCK);
    }
    load();
  }, []);

  const filtered = campaigns.filter(c => search === "" || c.name.toLowerCase().includes(search.toLowerCase()));
  const totalSent = campaigns.reduce((s, c) => s + (c.stats?.sent || 0), 0);
  const totalOpened = campaigns.reduce((s, c) => s + (c.stats?.opened || 0), 0);
  const totalClicked = campaigns.reduce((s, c) => s + (c.stats?.clicked || 0), 0);

  async function handleCreate() {
    await supabase.from("email_campaigns").insert({ organization_id: ORG_ID, ...form, status: "Draft", stats: { sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0, unsubscribed: 0 } });
    setShowModal(false);
    const { data } = await supabase.from("email_campaigns").select("*").eq("organization_id", ORG_ID).order("created_at", { ascending: false });
    if (data && data.length) setCampaigns(data);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-teal-900 to-teal-700 text-white px-8 py-8">
        <h1 className="text-2xl font-bold">Email Campaigns</h1>
        <p className="text-teal-200 text-sm mt-1">Create and manage marketing campaigns</p>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-4"><div className="text-xs text-gray-500 mb-1">Total Campaigns</div><div className="text-xl font-bold">{campaigns.length}</div></div>
          <div className="bg-white rounded-xl border p-4"><div className="text-xs text-gray-500 mb-1">Emails Sent</div><div className="text-xl font-bold text-blue-600">{totalSent.toLocaleString()}</div></div>
          <div className="bg-white rounded-xl border p-4"><div className="text-xs text-gray-500 mb-1">Open Rate</div><div className="text-xl font-bold text-green-600">{totalSent ? ((totalOpened / totalSent) * 100).toFixed(1) : 0}%</div></div>
          <div className="bg-white rounded-xl border p-4"><div className="text-xs text-gray-500 mb-1">Click Rate</div><div className="text-xl font-bold text-purple-600">{totalSent ? ((totalClicked / totalSent) * 100).toFixed(1) : 0}%</div></div>
        </div>
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center bg-white rounded-lg border px-3 py-2 flex-1 min-w-[200px]"><Search size={16} className="text-gray-400 mr-2" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search campaigns..." className="outline-none text-sm flex-1" /></div>
          <button onClick={() => setShowModal(true)} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"><Plus size={16} />Create Campaign</button>
        </div>
        <div className="space-y-3">
          {filtered.map(c => (
            <div key={c.id} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div><h3 className="font-semibold">{c.name}</h3><p className="text-sm text-gray-500 mt-0.5">{c.subject}</p></div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[c.status] || "bg-gray-100"}`}>{c.status}</span>
              </div>
              {c.stats?.sent > 0 && (
                <div className="flex gap-6 mt-4 text-sm">
                  <div className="flex items-center gap-1.5"><Send size={13} className="text-blue-500" /><span className="text-gray-500">Sent:</span><span className="font-medium">{c.stats.sent.toLocaleString()}</span></div>
                  <div className="flex items-center gap-1.5"><Eye size={13} className="text-green-500" /><span className="text-gray-500">Opened:</span><span className="font-medium">{c.stats.opened.toLocaleString()} ({((c.stats.opened / c.stats.sent) * 100).toFixed(1)}%)</span></div>
                  <div className="flex items-center gap-1.5"><Mail size={13} className="text-purple-500" /><span className="text-gray-500">Clicked:</span><span className="font-medium">{c.stats.clicked.toLocaleString()} ({((c.stats.clicked / c.stats.sent) * 100).toFixed(1)}%)</span></div>
                </div>
              )}
              {c.sent_at && <p className="text-xs text-gray-400 mt-2">Sent {new Date(c.sent_at).toLocaleDateString()}</p>}
            </div>
          ))}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">Create Campaign</h2><button onClick={() => setShowModal(false)}><X size={20} /></button></div>
            <div className="space-y-3">
              <input placeholder="Campaign Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Subject Line" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <input placeholder="From Name" value={form.from_name} onChange={e => setForm({...form, from_name: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <input placeholder="From Email" value={form.from_email} onChange={e => setForm({...form, from_email: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <button onClick={handleCreate} className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg font-medium">Create Campaign</button>
          </div>
        </div>
      )}
    </div>
  );
}
