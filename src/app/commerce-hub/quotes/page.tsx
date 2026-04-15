"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { Calculator, Plus, Search, Send, Download, Eye, CheckCircle, Clock, XCircle, FileText } from "lucide-react";

interface Quote {
  id: string;
  quote_number: string;
  customer_name: string;
  deal_name: string;
  amount: number;
  status: string;
  valid_until: string;
  created_at: string;
  items: { description: string; qty: number; rate: number; discount: number }[];
}

const MOCK_QUOTES: Quote[] = [
  { id: "1", quote_number: "QTE-2024-001", customer_name: "Johnson Family", deal_name: "Solar 8kW Install", amount: 24500, status: "accepted", valid_until: "2024-04-30", created_at: "2024-03-01", items: [{ description: "8kW Solar Panel System", qty: 1, rate: 22000, discount: 0 }, { description: "Battery Storage 10kWh", qty: 1, rate: 3500, discount: 1000 }] },
  { id: "2", quote_number: "QTE-2024-002", customer_name: "Smith Residence", deal_name: "Full Security Package", amount: 8750, status: "sent", valid_until: "2024-04-15", created_at: "2024-03-10", items: [{ description: "Security Panel + Sensors", qty: 1, rate: 4500, discount: 0 }, { description: "Camera Package (8 cams)", qty: 1, rate: 3200, discount: 0 }, { description: "Smart Lock Bundle", qty: 1, rate: 1050, discount: 0 }] },
  { id: "3", quote_number: "QTE-2024-003", customer_name: "Williams Home", deal_name: "Roof Replacement", amount: 18750, status: "accepted", valid_until: "2024-04-20", created_at: "2024-03-05", items: [{ description: "Architectural Shingle Roof", qty: 28, rate: 550, discount: 2650 }, { description: "Gutter System", qty: 1, rate: 3200, discount: 200 }] },
  { id: "4", quote_number: "QTE-2024-004", customer_name: "Brown Corp", deal_name: "Commercial Solar", amount: 156000, status: "draft", valid_until: "2024-05-01", created_at: "2024-03-18", items: [{ description: "50kW Commercial System", qty: 1, rate: 145000, discount: 0 }, { description: "Monitoring + Maintenance 3yr", qty: 1, rate: 11000, discount: 0 }] },
  { id: "5", quote_number: "QTE-2024-005", customer_name: "Davis Family", deal_name: "Smart Home + Security", amount: 6200, status: "sent", valid_until: "2024-04-25", created_at: "2024-03-15", items: [{ description: "Smart Home Hub Package", qty: 1, rate: 2800, discount: 0 }, { description: "Security System Basic", qty: 1, rate: 2500, discount: 0 }, { description: "Installation", qty: 1, rate: 900, discount: 0 }] },
  { id: "6", quote_number: "QTE-2024-006", customer_name: "Garcia Residence", deal_name: "Solar + Battery", amount: 32400, status: "expired", valid_until: "2024-02-28", created_at: "2024-02-01", items: [{ description: "12kW Solar System", qty: 1, rate: 28000, discount: 0 }, { description: "Powerwall Battery", qty: 1, rate: 5400, discount: 1000 }] },
  { id: "7", quote_number: "QTE-2024-007", customer_name: "Martinez Home", deal_name: "AT&T Full Bundle", amount: 4800, status: "accepted", valid_until: "2024-04-10", created_at: "2024-03-08", items: [{ description: "AT&T Fiber 1Gbps (12mo)", qty: 12, rate: 89.99, discount: 0 }, { description: "TV + Streaming Bundle (12mo)", qty: 12, rate: 149.99, discount: 0 }, { description: "Installation Waived", qty: 1, rate: 0, discount: 0 }] },
  { id: "8", quote_number: "QTE-2024-008", customer_name: "Anderson LLC", deal_name: "Enterprise Security + Fire", amount: 45000, status: "sent", valid_until: "2024-05-15", created_at: "2024-03-20", items: [{ description: "Commercial Fire Alarm System", qty: 1, rate: 18000, discount: 0 }, { description: "Access Control (12 doors)", qty: 12, rate: 1500, discount: 0 }, { description: "24/7 Central Station Monitoring (3yr)", qty: 1, rate: 9000, discount: 0 }] },
];

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>(MOCK_QUOTES);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = quotes.filter((q) => {
    const matchSearch = q.customer_name.toLowerCase().includes(search.toLowerCase()) || q.quote_number.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || q.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalValue = quotes.reduce((a, q) => a + q.amount, 0);
  const acceptedValue = quotes.filter((q) => q.status === "accepted").reduce((a, q) => a + q.amount, 0);
  const winRate = Math.round((quotes.filter((q) => q.status === "accepted").length / Math.max(quotes.length, 1)) * 100);

  const statusColor: Record<string, string> = { accepted: "bg-green-100 text-green-700", sent: "bg-blue-100 text-blue-700", draft: "bg-gray-100 text-gray-700", expired: "bg-red-100 text-red-700" };
  const statusIcon: Record<string, any> = { accepted: CheckCircle, sent: Send, draft: FileText, expired: XCircle };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-orange-600 to-orange-800 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2"><Calculator className="w-8 h-8" /><h1 className="text-3xl font-bold">Quotes / CPQ</h1></div>
            <p className="text-orange-200">Configure, price, and quote. Build proposals with line items, discounts, and e-signatures.</p>
          </div>
          <button className="bg-white text-orange-700 px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-orange-50"><Plus className="w-5 h-5" /> New Quote</button>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[
            { label: "Total Quoted", val: `$${(totalValue / 1000).toFixed(0)}K` },
            { label: "Accepted Value", val: `$${(acceptedValue / 1000).toFixed(0)}K` },
            { label: "Win Rate", val: `${winRate}%` },
            { label: "Pending", val: quotes.filter((q) => q.status === "sent").length },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 rounded-xl p-4"><div className="text-2xl font-bold">{s.val}</div><div className="text-orange-200 text-sm">{s.label}</div></div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1"><Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search quotes..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" /></div>
        <div className="flex gap-2">
          {["all", "draft", "sent", "accepted", "expired"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${statusFilter === s ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((q) => {
          const Icon = statusIcon[q.status] || FileText;
          return (
            <div key={q.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-5 cursor-pointer hover:bg-gray-50" onClick={() => setExpanded(expanded === q.id ? null : q.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center"><Calculator className="w-5 h-5 text-orange-600" /></div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{q.quote_number} — {q.deal_name}</h3>
                      <p className="text-sm text-gray-500">{q.customer_name} • Valid until {q.valid_until}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-xl font-bold text-gray-900">${q.amount.toLocaleString()}</div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[q.status]}`}>{q.status}</span>
                  </div>
                </div>
              </div>
              {expanded === q.id && (
                <div className="border-t border-gray-200 p-5 bg-gray-50">
                  <table className="w-full mb-4">
                    <thead><tr className="text-xs text-gray-500 uppercase">
                      <th className="text-left pb-2">Item</th><th className="text-right pb-2">Qty</th><th className="text-right pb-2">Rate</th><th className="text-right pb-2">Discount</th><th className="text-right pb-2">Total</th>
                    </tr></thead>
                    <tbody>
                      {q.items.map((item, i) => (
                        <tr key={i} className="border-t border-gray-200">
                          <td className="py-2 text-sm">{item.description}</td>
                          <td className="py-2 text-sm text-right">{item.qty}</td>
                          <td className="py-2 text-sm text-right">${item.rate.toLocaleString()}</td>
                          <td className="py-2 text-sm text-right text-red-600">{item.discount > 0 ? `-$${item.discount}` : "—"}</td>
                          <td className="py-2 text-sm text-right font-medium">${(item.qty * item.rate - item.discount).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 flex items-center gap-2"><Send className="w-4 h-4" /> Send to Customer</button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 flex items-center gap-2"><Download className="w-4 h-4" /> Download PDF</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
