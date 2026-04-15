"use client";
import { useState } from "react";
import { LinkIcon, Plus, Copy, ExternalLink, DollarSign, Search, Eye, Trash2, CheckCircle } from "lucide-react";

interface PaymentLink {
  id: string;
  name: string;
  amount: number;
  type: string;
  url: string;
  status: string;
  clicks: number;
  payments: number;
  revenue: number;
  created_at: string;
}

const MOCK_LINKS: PaymentLink[] = [
  { id: "1", name: "Solar Deposit - Standard", amount: 500, type: "one-time", url: "https://pay.goldendoorhq.com/solar-deposit", status: "active", clicks: 342, payments: 156, revenue: 78000, created_at: "2024-01-15" },
  { id: "2", name: "Monthly Monitoring Fee", amount: 49.99, type: "recurring", url: "https://pay.goldendoorhq.com/monitoring", status: "active", clicks: 891, payments: 423, revenue: 21142, created_at: "2024-01-10" },
  { id: "3", name: "Security System Package", amount: 2999, type: "one-time", url: "https://pay.goldendoorhq.com/security-pkg", status: "active", clicks: 234, payments: 89, revenue: 266911, created_at: "2024-02-01" },
  { id: "4", name: "Roof Inspection Fee", amount: 150, type: "one-time", url: "https://pay.goldendoorhq.com/roof-inspect", status: "active", clicks: 178, payments: 134, revenue: 20100, created_at: "2024-02-15" },
  { id: "5", name: "AT&T Business Bundle", amount: 199.99, type: "recurring", url: "https://pay.goldendoorhq.com/att-bundle", status: "active", clicks: 456, payments: 201, revenue: 40198, created_at: "2024-01-20" },
  { id: "6", name: "Custom Quote Payment", amount: 0, type: "variable", url: "https://pay.goldendoorhq.com/custom", status: "active", clicks: 567, payments: 312, revenue: 892340, created_at: "2024-01-05" },
  { id: "7", name: "Warranty Extension", amount: 299, type: "one-time", url: "https://pay.goldendoorhq.com/warranty", status: "paused", clicks: 89, payments: 34, revenue: 10166, created_at: "2024-03-01" },
  { id: "8", name: "Referral Reward Claim", amount: 250, type: "one-time", url: "https://pay.goldendoorhq.com/referral", status: "active", clicks: 123, payments: 67, revenue: 16750, created_at: "2024-02-20" },
];

export default function PaymentLinksPage() {
  const [links, setLinks] = useState<PaymentLink[]>(MOCK_LINKS);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = links.filter((l) => l.name.toLowerCase().includes(search.toLowerCase()));
  const totalRevenue = links.reduce((a, l) => a + l.revenue, 0);
  const totalPayments = links.reduce((a, l) => a + l.payments, 0);
  const conversionRate = Math.round((totalPayments / Math.max(links.reduce((a, l) => a + l.clicks, 0), 1)) * 100);

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const typeColor: Record<string, string> = { "one-time": "bg-blue-100 text-blue-700", recurring: "bg-purple-100 text-purple-700", variable: "bg-orange-100 text-orange-700" };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2"><LinkIcon className="w-8 h-8" /><h1 className="text-3xl font-bold">Payment Links</h1></div>
            <p className="text-blue-200">Create shareable payment links. Get paid with a single click.</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="bg-white text-blue-700 px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-50"><Plus className="w-5 h-5" /> New Link</button>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[
            { label: "Total Revenue", val: `$${(totalRevenue / 1000).toFixed(0)}K` },
            { label: "Total Payments", val: totalPayments.toLocaleString() },
            { label: "Active Links", val: links.filter((l) => l.status === "active").length },
            { label: "Conversion Rate", val: `${conversionRate}%` },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 rounded-xl p-4"><div className="text-2xl font-bold">{s.val}</div><div className="text-blue-200 text-sm">{s.label}</div></div>
          ))}
        </div>
      </div>

      <div className="relative mb-6"><Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search payment links..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" /></div>

      <div className="grid grid-cols-2 gap-4">
        {filtered.map((l) => (
          <div key={l.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{l.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColor[l.type]}`}>{l.type}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${l.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{l.status}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-gray-900">{l.amount > 0 ? `$${l.amount.toLocaleString()}` : "Variable"}</div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600 truncate flex-1">{l.url}</span>
              <button onClick={() => copyUrl(l.url, l.id)} className="ml-2 p-1.5 text-gray-400 hover:text-blue-600">
                {copied === l.id ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div><div className="text-sm font-semibold text-gray-900">{l.clicks}</div><div className="text-xs text-gray-500">Clicks</div></div>
              <div><div className="text-sm font-semibold text-gray-900">{l.payments}</div><div className="text-xs text-gray-500">Payments</div></div>
              <div><div className="text-sm font-semibold text-gray-900">${(l.revenue / 1000).toFixed(1)}K</div><div className="text-xs text-gray-500">Revenue</div></div>
            </div>
          </div>
        ))}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-6">Create Payment Link</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Link Name</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="e.g. Solar Deposit" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Amount</label><input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="0.00" /></div>
                <div><label className="block text-sm font-medium mb-1">Type</label><select className="w-full border border-gray-300 rounded-lg px-3 py-2"><option>one-time</option><option>recurring</option><option>variable</option></select></div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowCreate(false)} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700">Create Link</button>
              <button onClick={() => setShowCreate(false)} className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
