"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { Search, Plus, X, Phone, DollarSign, Users, Activity } from "lucide-react";

const STATUS_COLORS: Record<string, string> = { Active: "bg-green-100 text-green-800", Suspended: "bg-yellow-100 text-yellow-800", Cancelled: "bg-red-100 text-red-800" };

const MOCK = [
  { id: "1", account_number: "ATT-2025-0001", plan_type: "AT&T Fiber 300", monthly_amount: 55, device_type: "Gateway", device_model: "BGW320", status: "Active", activation_date: "2025-01-15", contact_name: "Marcus Johnson" },
  { id: "2", account_number: "ATT-2025-0002", plan_type: "AT&T Unlimited Premium", monthly_amount: 85, device_type: "iPhone 16 Pro", device_model: "A3101", status: "Active", activation_date: "2025-02-01", contact_name: "Patricia Williams" },
  { id: "3", account_number: "ATT-2025-0003", plan_type: "AT&T Fiber 500", monthly_amount: 65, device_type: "Gateway", device_model: "BGW320", status: "Active", activation_date: "2025-02-20", contact_name: "Robert Chen" },
  { id: "4", account_number: "ATT-2025-0004", plan_type: "AT&T Starter", monthly_amount: 65, device_type: "Samsung S25", device_model: "SM-S936U", status: "Suspended", activation_date: "2025-01-10", contact_name: "Sandra Davis" },
  { id: "5", account_number: "ATT-2025-0005", plan_type: "AT&T Business Fiber", monthly_amount: 120, device_type: "Gateway", device_model: "BGW320-505", status: "Active", activation_date: "2025-03-01", contact_name: "James Wilson" },
  { id: "6", account_number: "ATT-2025-0006", plan_type: "AT&T Unlimited Extra", monthly_amount: 75, device_type: "iPhone 15", device_model: "A3090", status: "Cancelled", activation_date: "2024-12-15", contact_name: "Angela Martinez" },
];

export default function ATTAccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ account_number: "", plan_type: "AT&T Fiber 300", monthly_amount: "", device_type: "", device_model: "", contact_name: "" });

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("telecom_accounts").select("*").eq("organization_id", ORG_ID).order("created_at", { ascending: false });
      setAccounts(data && data.length > 0 ? data : MOCK);
    }
    load();
  }, []);

  const filtered = accounts.filter(a => {
    const ms = search === "" || a.account_number?.toLowerCase().includes(search.toLowerCase()) || a.contact_name?.toLowerCase().includes(search.toLowerCase()) || a.plan_type?.toLowerCase().includes(search.toLowerCase());
    const mst = statusFilter === "All" || a.status === statusFilter;
    return ms && mst;
  });

  const active = accounts.filter(a => a.status === "Active");
  const monthlyRev = active.reduce((s, a) => s + (a.monthly_amount || 0), 0);
  const stats = [
    { label: "Total Accounts", value: accounts.length, icon: Users, color: "text-blue-600" },
    { label: "Active", value: active.length, icon: Activity, color: "text-green-600" },
    { label: "Monthly Revenue", value: "$" + monthlyRev.toLocaleString(), icon: DollarSign, color: "text-emerald-600" },
    { label: "Avg Plan Value", value: "$" + (active.length ? Math.round(monthlyRev / active.length) : 0), icon: DollarSign, color: "text-purple-600" },
  ];

  async function handleAdd() {
    await supabase.from("telecom_accounts").insert({ organization_id: ORG_ID, account_number: form.account_number, plan_type: form.plan_type, monthly_amount: Number(form.monthly_amount), device_type: form.device_type, device_model: form.device_model, status: "Active" });
    setShowModal(false);
    const { data } = await supabase.from("telecom_accounts").select("*").eq("organization_id", ORG_ID).order("created_at", { ascending: false });
    if (data && data.length) setAccounts(data);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-8 py-8">
        <h1 className="text-2xl font-bold">AT&T Accounts</h1>
        <p className="text-blue-200 text-sm mt-1">Manage telecom accounts and subscriptions</p>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">{stats.map(s => { const Icon = s.icon; return (<div key={s.label} className="bg-white rounded-xl border p-4"><div className="flex items-center gap-2 mb-1"><Icon size={16} className={s.color} /><span className="text-xs text-gray-500">{s.label}</span></div><div className="text-xl font-bold">{s.value}</div></div>);})}</div>
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center bg-white rounded-lg border px-3 py-2 flex-1 min-w-[200px]"><Search size={16} className="text-gray-400 mr-2" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search accounts..." className="outline-none text-sm flex-1" /></div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-white border rounded-lg px-3 py-2 text-sm"><option>All</option><option>Active</option><option>Suspended</option><option>Cancelled</option></select>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"><Plus size={16} />Add Account</button>
        </div>
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b"><tr>{["Account #","Contact","Plan","Device","Monthly","Status","Activated"].map(h => <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>)}</tr></thead>
            <tbody>{filtered.map(a => (
              <tr key={a.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs font-medium">{a.account_number}</td>
                <td className="px-4 py-3">{a.contact_name || "—"}</td>
                <td className="px-4 py-3 text-gray-600">{a.plan_type}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{a.device_type} {a.device_model}</td>
                <td className="px-4 py-3 font-semibold">${a.monthly_amount}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[a.status] || "bg-gray-100"}`}>{a.status}</span></td>
                <td className="px-4 py-3 text-gray-400 text-xs">{a.activation_date ? new Date(a.activation_date).toLocaleDateString() : "—"}</td>
              </tr>
            ))}</tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No accounts found</div>}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">Add Account</h2><button onClick={() => setShowModal(false)}><X size={20} /></button></div>
            <div className="space-y-3">
              <input placeholder="Account Number" value={form.account_number} onChange={e => setForm({...form, account_number: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <select value={form.plan_type} onChange={e => setForm({...form, plan_type: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"><option>AT&T Fiber 300</option><option>AT&T Fiber 500</option><option>AT&T Fiber 1000</option><option>AT&T Unlimited Starter</option><option>AT&T Unlimited Extra</option><option>AT&T Unlimited Premium</option><option>AT&T Business Fiber</option></select>
              <input type="number" placeholder="Monthly Amount" value={form.monthly_amount} onChange={e => setForm({...form, monthly_amount: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <div className="grid grid-cols-2 gap-3"><input placeholder="Device Type" value={form.device_type} onChange={e => setForm({...form, device_type: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" /><input placeholder="Model" value={form.device_model} onChange={e => setForm({...form, device_model: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" /></div>
            </div>
            <button onClick={handleAdd} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium">Add Account</button>
          </div>
        </div>
      )}
    </div>
  );
}
