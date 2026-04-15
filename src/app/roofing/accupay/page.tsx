"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { CreditCard, DollarSign, Plus, Search, CheckCircle, Clock, AlertTriangle, Send, Download, TrendingUp, ArrowRight, RefreshCw, Wallet } from "lucide-react";

interface Payment {
  id: string; invoice_number: string; customer: string; job: string; amount: number; status: string;
  method: string; processor: string; date: string; description: string;
}

interface FinancingApp {
  id: string; customer: string; amount: number; term: string; rate: string; provider: string; status: string; date: string;
}

const PROCESSORS = [
  { name: "Stripe", logo: "💳", desc: "Primary payment processor — cards, ACH, Apple Pay", fees: "2.9% + $0.30", features: ["Credit/Debit Cards","ACH Bank Transfer","Apple Pay/Google Pay","Recurring Billing"] },
  { name: "PureFinance Group", logo: "🏦", desc: "Roofing-specific financing & payment solutions", fees: "Custom rates", features: ["Homeowner Financing","Dealer Fees","Same-as-Cash","Low Monthly"] },
  { name: "GreenSky", logo: "🌿", desc: "Home improvement financing platform", fees: "Dealer fee varies", features: ["0% Promo Periods","Up to $100K","Instant Decisions","No Prepay Penalty"] },
  { name: "AccuFi", logo: "📊", desc: "Built-in financing for roofing contractors", fees: "Integrated", features: ["Pre-Qualification","Multiple Lenders","Soft Pull","E-Sign"] }
];

const PAYMENTS: Payment[] = [
  { id:"1",invoice_number:"INV-2024-089",customer:"Williams Home",job:"RJ-2024-089",amount:18750,status:"paid",method:"Credit Card",processor:"Stripe",date:"2024-03-25",description:"Full roof replacement — GAF Timberline HDZ" },
  { id:"2",invoice_number:"INV-2024-090",customer:"Johnson Family",job:"RJ-2024-090",amount:12250,status:"paid",method:"ACH Transfer",processor:"Stripe",date:"2024-03-26",description:"50% deposit — roof replacement" },
  { id:"3",invoice_number:"INV-2024-090B",customer:"Johnson Family",job:"RJ-2024-090",amount:12250,status:"pending",method:"Financing",processor:"GreenSky",date:"2024-04-15",description:"Final 50% — roof replacement (financed)" },
  { id:"4",invoice_number:"INV-2024-091",customer:"Brown Corp",job:"RJ-2024-091",amount:33900,status:"paid",method:"ACH Transfer",processor:"Stripe",date:"2024-03-20",description:"50% deposit — commercial TPO roof" },
  { id:"5",invoice_number:"INV-2024-085",customer:"Garcia Residence",job:"RJ-2024-085",amount:15600,status:"paid",method:"Financing",processor:"PureFinance Group",date:"2024-03-18",description:"Full payment via 12-month financing" },
  { id:"6",invoice_number:"INV-2024-082",customer:"Davis Home",job:"RJ-2024-082",amount:5200,status:"insurance_pending",method:"Insurance Check",processor:"Manual",date:"2024-03-28",description:"Insurance claim payout — storm damage repair" },
  { id:"7",invoice_number:"INV-2024-095",customer:"Anderson Property",job:"RJ-2024-095",amount:8400,status:"sent",method:"Payment Link",processor:"Stripe",date:"2024-04-10",description:"Deposit invoice — awaiting payment" },
  { id:"8",invoice_number:"INV-2024-088",customer:"Thompson Residence",job:"RJ-2024-088",amount:21300,status:"paid",method:"Credit Card",processor:"Stripe",date:"2024-03-15",description:"Full payment — roof replacement" }
];

const FINANCING: FinancingApp[] = [
  { id:"1",customer:"Johnson Family",amount:12250,term:"12 months",rate:"0% APR",provider:"GreenSky",status:"approved",date:"2024-03-22" },
  { id:"2",customer:"Garcia Residence",amount:15600,term:"24 months",rate:"5.99% APR",provider:"PureFinance Group",status:"funded",date:"2024-03-16" },
  { id:"3",customer:"Martinez Family",amount:19800,term:"18 months",rate:"0% APR",provider:"GreenSky",status:"pending",date:"2024-04-12" },
  { id:"4",customer:"Lee Residence",amount:14200,term:"36 months",rate:"7.99% APR",provider:"AccuFi",status:"approved",date:"2024-04-08" },
  { id:"5",customer:"Anderson Property",amount:24500,term:"60 months",rate:"9.99% APR",provider:"PureFinance Group",status:"pre_qualified",date:"2024-04-14" }
];

export default function AccuPayPage() {
  const [payments, setPayments] = useState(PAYMENTS);
  const [financing, setFinancing] = useState(FINANCING);
  const [tab, setTab] = useState<"payments"|"financing"|"processors">("payments");
  const [search, setSearch] = useState("");

  useEffect(() => { supabase.from("roofing_payments").select("*").eq("org_id", ORG_ID).then(({ data }) => { if (data?.length) setPayments(data as any); }); }, []);

  const totalCollected = payments.filter(p=>p.status==="paid").reduce((s,p)=>s+p.amount,0);
  const totalPending = payments.filter(p=>p.status!=="paid").reduce((s,p)=>s+p.amount,0);
  const filtered = payments.filter(p => p.customer.toLowerCase().includes(search.toLowerCase()) || p.invoice_number.toLowerCase().includes(search.toLowerCase()));

  const statusStyle = (s: string) => s === "paid" ? "bg-green-100 text-green-700" : s === "pending" || s === "sent" ? "bg-yellow-100 text-yellow-700" : s === "insurance_pending" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600";
  const finStatusStyle = (s: string) => s === "funded" ? "bg-green-100 text-green-700" : s === "approved" ? "bg-blue-100 text-blue-700" : s === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-purple-100 text-purple-700";

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-[#0B1F3A] flex items-center gap-2"><Wallet className="text-[#F0A500]" size={28}/>AccuPay — Payment Processing</h1><p className="text-gray-500 mt-1">Stripe, PureFinance, GreenSky & AccuFi — collect payments & offer financing</p></div>
        <div className="flex gap-2">
          <button className="border px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50"><Download size={16}/>Export</button>
          <button className="bg-[#F0A500] text-[#0B1F3A] px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-yellow-500"><Plus size={18}/>Create Invoice</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[{l:"Collected",v:`$${(totalCollected/1000).toFixed(0)}K`,c:"text-green-600"},{l:"Pending",v:`$${(totalPending/1000).toFixed(0)}K`,c:"text-yellow-600"},{l:"Financed",v:`$${(financing.reduce((s,f)=>s+f.amount,0)/1000).toFixed(0)}K`,c:"text-blue-600"},{l:"Transactions",v:payments.length,c:"text-purple-600"},{l:"Avg Ticket",v:`$${Math.round(totalCollected/payments.filter(p=>p.status==="paid").length).toLocaleString()}`,c:"text-cyan-600"}].map((s,i)=>(
          <div key={i} className="bg-white rounded-xl border p-4 text-center"><p className={`text-2xl font-bold ${s.c}`}>{s.v}</p><p className="text-xs text-gray-500 mt-1">{s.l}</p></div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["payments","financing","processors"] as const).map(t=><button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab===t?"bg-[#0B1F3A] text-white":"bg-gray-100 text-gray-600"}`}>{t==="payments"?"Payments":t==="financing"?"Financing Apps":"Processors"}</button>)}
        <div className="relative flex-1 max-w-xs ml-auto"><Search className="absolute left-3 top-2.5 text-gray-400" size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." className="pl-9 pr-3 py-2 border rounded-lg w-full text-sm"/></div>
      </div>

      {tab === "payments" && (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm"><thead><tr className="bg-gray-50 text-gray-600 text-xs"><th className="text-left p-3">Invoice</th><th className="text-left p-3">Customer</th><th className="text-left p-3">Description</th><th className="text-left p-3">Method</th><th className="text-left p-3">Processor</th><th className="text-right p-3">Amount</th><th className="text-center p-3">Status</th><th className="text-left p-3">Date</th></tr></thead><tbody>
            {filtered.map(p=>(
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-mono text-xs">{p.invoice_number}</td>
                <td className="p-3 font-medium text-[#0B1F3A]">{p.customer}</td>
                <td className="p-3 text-xs text-gray-500 max-w-[200px] truncate">{p.description}</td>
                <td className="p-3 text-xs">{p.method}</td>
                <td className="p-3 text-xs">{p.processor}</td>
                <td className="p-3 text-right font-bold">${p.amount.toLocaleString()}</td>
                <td className="p-3 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusStyle(p.status)}`}>{p.status.replace("_"," ")}</span></td>
                <td className="p-3 text-xs text-gray-500">{p.date}</td>
              </tr>
            ))}
          </tbody></table>
        </div>
      )}

      {tab === "financing" && (
        <div className="space-y-3">
          {financing.map(f=>(
            <div key={f.id} className="bg-white rounded-xl border p-4 flex items-center gap-4">
              <div className="flex-1"><h3 className="font-semibold text-[#0B1F3A]">{f.customer}</h3><p className="text-xs text-gray-500">{f.provider} · {f.term} · {f.rate}</p></div>
              <p className="text-lg font-bold text-[#0B1F3A]">${f.amount.toLocaleString()}</p>
              <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${finStatusStyle(f.status)}`}>{f.status.replace("_"," ")}</span>
              <p className="text-xs text-gray-400">{f.date}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "processors" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROCESSORS.map(p=>(
            <div key={p.name} className="bg-white rounded-xl border p-5">
              <div className="flex items-center gap-3 mb-3"><span className="text-3xl">{p.logo}</span><div><h3 className="font-bold text-lg text-[#0B1F3A]">{p.name}</h3><p className="text-xs text-gray-500">{p.desc}</p></div></div>
              <p className="text-sm text-gray-600 mb-3">Fees: <span className="font-medium">{p.fees}</span></p>
              <div className="flex flex-wrap gap-2">{p.features.map(f=><span key={f} className="bg-gray-100 px-2 py-1 rounded-lg text-xs text-gray-600">{f}</span>)}</div>
              <button className="mt-3 w-full border-2 border-[#0B1F3A] text-[#0B1F3A] rounded-lg py-2 text-sm font-semibold hover:bg-[#0B1F3A] hover:text-white transition-colors flex items-center justify-center gap-2"><RefreshCw size={14}/>Configure Integration</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
