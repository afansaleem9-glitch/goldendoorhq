"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { FileText, Plus, Search, DollarSign, Clock, CheckCircle, AlertTriangle, Send, Download, Eye } from "lucide-react";

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  status: string;
  due_date: string;
  created_at: string;
  items: { description: string; qty: number; rate: number }[];
}

const MOCK_INVOICES: Invoice[] = [
  { id: "1", invoice_number: "INV-2024-001", customer_name: "Johnson Family", customer_email: "johnson@email.com", amount: 12500, status: "paid", due_date: "2024-03-15", created_at: "2024-03-01", items: [{ description: "Solar Panel Installation - 8kW", qty: 1, rate: 12500 }] },
  { id: "2", invoice_number: "INV-2024-002", customer_name: "Smith Residence", customer_email: "smith@email.com", amount: 4200, status: "sent", due_date: "2024-04-01", created_at: "2024-03-10", items: [{ description: "Security System Package", qty: 1, rate: 3500 }, { description: "Installation Fee", qty: 1, rate: 700 }] },
  { id: "3", invoice_number: "INV-2024-003", customer_name: "Williams Home", customer_email: "williams@email.com", amount: 18750, status: "paid", due_date: "2024-03-20", created_at: "2024-03-05", items: [{ description: "Complete Roof Replacement", qty: 1, rate: 18750 }] },
  { id: "4", invoice_number: "INV-2024-004", customer_name: "Brown Corp", customer_email: "brown@corp.com", amount: 8900, status: "overdue", due_date: "2024-02-28", created_at: "2024-02-15", items: [{ description: "Commercial Solar Install", qty: 1, rate: 8900 }] },
  { id: "5", invoice_number: "INV-2024-005", customer_name: "Davis Family", customer_email: "davis@email.com", amount: 3200, status: "draft", due_date: "2024-04-15", created_at: "2024-03-18", items: [{ description: "Smart Home Package", qty: 1, rate: 2800 }, { description: "Monthly Monitoring (12mo)", qty: 12, rate: 33.33 }] },
  { id: "6", invoice_number: "INV-2024-006", customer_name: "Garcia Residence", customer_email: "garcia@email.com", amount: 15600, status: "paid", due_date: "2024-03-10", created_at: "2024-02-25", items: [{ description: "Solar + Battery Storage", qty: 1, rate: 15600 }] },
  { id: "7", invoice_number: "INV-2024-007", customer_name: "Martinez Home", customer_email: "martinez@email.com", amount: 6400, status: "sent", due_date: "2024-04-05", created_at: "2024-03-15", items: [{ description: "Roof Repair + Inspection", qty: 1, rate: 6400 }] },
  { id: "8", invoice_number: "INV-2024-008", customer_name: "AT&T Business", customer_email: "att@business.com", amount: 2400, status: "paid", due_date: "2024-03-25", created_at: "2024-03-12", items: [{ description: "Business Internet Setup", qty: 1, rate: 2400 }] },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [newInv, setNewInv] = useState({ customer_name: "", customer_email: "", items: [{ description: "", qty: 1, rate: 0 }], due_date: "" });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("invoices").select("*").eq("org_id", ORG_ID).order("created_at", { ascending: false });
      setInvoices(data && data.length > 0 ? data : MOCK_INVOICES);
    })();
  }, []);

  const filtered = invoices.filter((i) => {
    const matchSearch = i.customer_name.toLowerCase().includes(search.toLowerCase()) || i.invoice_number.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = invoices.reduce((a, i) => a + i.amount, 0);
  const paidAmount = invoices.filter((i) => i.status === "paid").reduce((a, i) => a + i.amount, 0);
  const overdueAmount = invoices.filter((i) => i.status === "overdue").reduce((a, i) => a + i.amount, 0);

  const statusColor: Record<string, string> = { paid: "bg-green-100 text-green-700", sent: "bg-blue-100 text-blue-700", draft: "bg-gray-100 text-gray-700", overdue: "bg-red-100 text-red-700" };

  const handleCreate = async () => {
    const invNum = `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, "0")}`;
    const amount = newInv.items.reduce((a, it) => a + it.qty * it.rate, 0);
    const record = { invoice_number: invNum, customer_name: newInv.customer_name, customer_email: newInv.customer_email, amount, status: "draft", due_date: newInv.due_date, items: newInv.items, org_id: ORG_ID };
    const { data } = await supabase.from("invoices").insert(record).select();
    if (data) setInvoices([data[0], ...invoices]);
    else setInvoices([{ id: Date.now().toString(), created_at: new Date().toISOString(), ...record } as any, ...invoices]);
    setShowCreate(false);
    setNewInv({ customer_name: "", customer_email: "", items: [{ description: "", qty: 1, rate: 0 }], due_date: "" });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2"><FileText className="w-8 h-8" /><h1 className="text-3xl font-bold">Invoices</h1></div>
            <p className="text-green-200">Create, send, and track invoices. Get paid faster.</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="bg-white text-green-700 px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-green-50"><Plus className="w-5 h-5" /> New Invoice</button>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[
            { label: "Total Invoiced", val: `$${totalRevenue.toLocaleString()}` },
            { label: "Paid", val: `$${paidAmount.toLocaleString()}` },
            { label: "Overdue", val: `$${overdueAmount.toLocaleString()}` },
            { label: "Open Invoices", val: invoices.filter((i) => i.status === "sent").length },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 rounded-xl p-4"><div className="text-2xl font-bold">{s.val}</div><div className="text-green-200 text-sm">{s.label}</div></div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1"><Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search invoices..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" /></div>
        <div className="flex gap-2">
          {["all", "draft", "sent", "paid", "overdue"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${statusFilter === s ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr>
            {["Invoice", "Customer", "Amount", "Status", "Due Date", "Actions"].map((h) => <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}
          </tr></thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 text-sm font-medium text-gray-900">{inv.invoice_number}</td>
                <td className="px-5 py-4"><div className="text-sm text-gray-900">{inv.customer_name}</div><div className="text-xs text-gray-500">{inv.customer_email}</div></td>
                <td className="px-5 py-4 text-sm font-semibold text-gray-900">${inv.amount.toLocaleString()}</td>
                <td className="px-5 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[inv.status]}`}>{inv.status}</span></td>
                <td className="px-5 py-4 text-sm text-gray-500">{inv.due_date}</td>
                <td className="px-5 py-4"><div className="flex gap-2">
                  <button className="p-1.5 text-gray-400 hover:text-blue-600" title="View"><Eye className="w-4 h-4" /></button>
                  <button className="p-1.5 text-gray-400 hover:text-green-600" title="Send"><Send className="w-4 h-4" /></button>
                  <button className="p-1.5 text-gray-400 hover:text-gray-600" title="Download"><Download className="w-4 h-4" /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-6">Create Invoice</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Customer Name</label><input value={newInv.customer_name} onChange={(e) => setNewInv({ ...newInv, customer_name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Customer Email</label><input value={newInv.customer_email} onChange={(e) => setNewInv({ ...newInv, customer_email: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2" /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Due Date</label><input type="date" value={newInv.due_date} onChange={(e) => setNewInv({ ...newInv, due_date: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2" /></div>
              <div>
                <label className="block text-sm font-medium mb-1">Line Items</label>
                {newInv.items.map((item, i) => (
                  <div key={i} className="grid grid-cols-6 gap-2 mb-2">
                    <input className="col-span-3 border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Description" value={item.description} onChange={(e) => { const items = [...newInv.items]; items[i].description = e.target.value; setNewInv({ ...newInv, items }); }} />
                    <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm" type="number" placeholder="Qty" value={item.qty} onChange={(e) => { const items = [...newInv.items]; items[i].qty = Number(e.target.value); setNewInv({ ...newInv, items }); }} />
                    <input className="col-span-2 border border-gray-300 rounded-lg px-3 py-2 text-sm" type="number" placeholder="Rate" value={item.rate || ""} onChange={(e) => { const items = [...newInv.items]; items[i].rate = Number(e.target.value); setNewInv({ ...newInv, items }); }} />
                  </div>
                ))}
                <button onClick={() => setNewInv({ ...newInv, items: [...newInv.items, { description: "", qty: 1, rate: 0 }] })} className="text-sm text-green-600 font-medium">+ Add Line Item</button>
              </div>
              <div className="text-right text-lg font-bold">Total: ${newInv.items.reduce((a, it) => a + it.qty * it.rate, 0).toLocaleString()}</div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleCreate} className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700">Create Invoice</button>
              <button onClick={() => setShowCreate(false)} className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
