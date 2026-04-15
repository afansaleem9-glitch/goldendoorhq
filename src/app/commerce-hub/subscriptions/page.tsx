"use client";
import { useState } from "react";
import { RefreshCw, Plus, Search, DollarSign, Users, TrendingUp, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronRight } from "lucide-react";

interface Subscription {
  id: string;
  customer_name: string;
  plan: string;
  amount: number;
  interval: string;
  status: string;
  start_date: string;
  next_billing: string;
  payments_made: number;
  total_value: number;
}

const MOCK_SUBS: Subscription[] = [
  { id: "1", customer_name: "Johnson Family", plan: "Premium Monitoring", amount: 49.99, interval: "monthly", status: "active", start_date: "2023-06-15", next_billing: "2024-04-15", payments_made: 22, total_value: 1099.78 },
  { id: "2", customer_name: "Smith Residence", plan: "Basic Monitoring", amount: 29.99, interval: "monthly", status: "active", start_date: "2023-09-01", next_billing: "2024-04-01", payments_made: 19, total_value: 569.81 },
  { id: "3", customer_name: "Williams Home", plan: "Solar Maintenance", amount: 99.99, interval: "quarterly", status: "active", start_date: "2024-01-01", next_billing: "2024-04-01", payments_made: 4, total_value: 399.96 },
  { id: "4", customer_name: "Brown Corp", plan: "Enterprise Security", amount: 299.99, interval: "monthly", status: "active", start_date: "2023-03-15", next_billing: "2024-04-15", payments_made: 25, total_value: 7499.75 },
  { id: "5", customer_name: "Davis Family", plan: "Smart Home Pro", amount: 79.99, interval: "monthly", status: "past_due", start_date: "2023-11-01", next_billing: "2024-03-01", payments_made: 16, total_value: 1279.84 },
  { id: "6", customer_name: "Garcia Residence", plan: "AT&T Fiber Bundle", amount: 199.99, interval: "monthly", status: "active", start_date: "2024-01-15", next_billing: "2024-04-15", payments_made: 3, total_value: 599.97 },
  { id: "7", customer_name: "Martinez Home", plan: "Premium Monitoring", amount: 49.99, interval: "monthly", status: "cancelled", start_date: "2023-04-01", next_billing: "-", payments_made: 11, total_value: 549.89 },
  { id: "8", customer_name: "Anderson LLC", plan: "Commercial Package", amount: 499.99, interval: "monthly", status: "active", start_date: "2023-07-01", next_billing: "2024-04-01", payments_made: 21, total_value: 10499.79 },
  { id: "9", customer_name: "Taylor Home", plan: "Basic Monitoring", amount: 29.99, interval: "monthly", status: "active", start_date: "2024-02-01", next_billing: "2024-04-01", payments_made: 2, total_value: 59.98 },
  { id: "10", customer_name: "Thomas Residence", plan: "Solar + Security Bundle", amount: 149.99, interval: "monthly", status: "active", start_date: "2023-08-15", next_billing: "2024-04-15", payments_made: 20, total_value: 2999.80 },
];

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>(MOCK_SUBS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = subs.filter((s) => {
    const matchSearch = s.customer_name.toLowerCase().includes(search.toLowerCase()) || s.plan.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const mrr = subs.filter((s) => s.status === "active" && s.interval === "monthly").reduce((a, s) => a + s.amount, 0);
  const activeCount = subs.filter((s) => s.status === "active").length;
  const churnRate = Math.round((subs.filter((s) => s.status === "cancelled").length / subs.length) * 100);
  const ltv = Math.round(subs.reduce((a, s) => a + s.total_value, 0) / subs.length);

  const statusColor: Record<string, string> = { active: "bg-green-100 text-green-700", past_due: "bg-red-100 text-red-700", cancelled: "bg-gray-100 text-gray-700", trial: "bg-blue-100 text-blue-700" };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2"><RefreshCw className="w-8 h-8" /><h1 className="text-3xl font-bold">Subscriptions</h1></div>
            <p className="text-purple-200">Manage recurring billing, plans, and subscription lifecycle.</p>
          </div>
          <button className="bg-white text-purple-700 px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-purple-50"><Plus className="w-5 h-5" /> New Subscription</button>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[
            { label: "MRR", val: `$${mrr.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
            { label: "Active Subscriptions", val: activeCount },
            { label: "Churn Rate", val: `${churnRate}%` },
            { label: "Avg LTV", val: `$${ltv.toLocaleString()}` },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 rounded-xl p-4"><div className="text-2xl font-bold">{s.val}</div><div className="text-purple-200 text-sm">{s.label}</div></div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1"><Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search subscriptions..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" /></div>
        <div className="flex gap-2">
          {["all", "active", "past_due", "cancelled"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${statusFilter === s ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s.replace("_", " ")}</button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr>
            {["Customer", "Plan", "Amount", "Interval", "Status", "Next Billing", "Payments", "Total Value"].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}
          </tr></thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{s.customer_name}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{s.plan}</td>
                <td className="px-4 py-3 text-sm font-semibold">${s.amount}</td>
                <td className="px-4 py-3 text-sm text-gray-500 capitalize">{s.interval}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[s.status]}`}>{s.status.replace("_", " ")}</span></td>
                <td className="px-4 py-3 text-sm text-gray-500">{s.next_billing}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{s.payments_made}</td>
                <td className="px-4 py-3 text-sm font-semibold text-green-700">${s.total_value.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
