"use client";
import { useState } from "react";
import { DollarSign, FileText, CreditCard, Send, Download, Plus, Search, Eye, X, CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";

type DocStatus = "paid"|"sent"|"draft"|"overdue"|"partial";
interface Invoice { id:number; number:string; customer:string; amount:number; status:DocStatus; date:string; dueDate:string; vertical:string; items:{desc:string;qty:number;rate:number}[]; paidAmount:number; }
interface Quote { id:number; number:string; customer:string; amount:number; status:"accepted"|"sent"|"draft"|"expired"; date:string; expiresDate:string; vertical:string; }

const invoices: Invoice[] = [
  {id:1,number:"INV-2026-001",customer:"Martinez Family",amount:42000,status:"paid",date:"Mar 15, 2026",dueDate:"Apr 14, 2026",vertical:"Solar",items:[{desc:"28x Qcell 410W Panels",qty:28,rate:800},{desc:"Enphase IQ8+ Microinverters",qty:28,rate:350},{desc:"Installation Labor",qty:1,rate:5600},{desc:"Permits & Inspection",qty:1,rate:1200}],paidAmount:42000},
  {id:2,number:"INV-2026-002",customer:"Thompson Residence",amount:8500,status:"sent",date:"Apr 1, 2026",dueDate:"May 1, 2026",vertical:"Smart Home",items:[{desc:"ADC Smart Home Package",qty:1,rate:4200},{desc:"4x Indoor/Outdoor Cameras",qty:4,rate:450},{desc:"Installation",qty:1,rate:2500}],paidAmount:0},
  {id:3,number:"INV-2026-003",customer:"Williams Property",amount:18500,status:"overdue",date:"Feb 20, 2026",dueDate:"Mar 22, 2026",vertical:"Roofing",items:[{desc:"Architectural Shingles — 24 sq",qty:24,rate:550},{desc:"Underlayment & Flashing",qty:1,rate:2800},{desc:"Labor",qty:1,rate:2500}],paidAmount:0},
  {id:4,number:"INV-2026-004",customer:"Garcia Family",amount:52000,status:"partial",date:"Mar 28, 2026",dueDate:"Apr 27, 2026",vertical:"Solar",items:[{desc:"32x Qcell 410W Panels",qty:32,rate:800},{desc:"Tesla Powerwall 3",qty:2,rate:8500},{desc:"Installation + Electrical",qty:1,rate:8600}],paidAmount:26000},
  {id:5,number:"INV-2026-005",customer:"Anderson Home",amount:3600,status:"draft",date:"Apr 10, 2026",dueDate:"May 10, 2026",vertical:"AT&T",items:[{desc:"AT&T Fiber 2 Gig — Annual",qty:12,rate:120},{desc:"Installation",qty:1,rate:0},{desc:"Router Equipment",qty:1,rate:240}],paidAmount:0},
  {id:6,number:"INV-2026-006",customer:"Brown Residence",amount:6200,status:"paid",date:"Mar 5, 2026",dueDate:"Apr 4, 2026",vertical:"Smart Home",items:[{desc:"ADC Security System",qty:1,rate:3500},{desc:"Doorbell Camera",qty:1,rate:350},{desc:"Smart Lock Set",qty:2,rate:275},{desc:"Installation",qty:1,rate:1800}],paidAmount:6200},
];

const quotes: Quote[] = [
  {id:1,number:"QT-2026-015",customer:"Davis Family",amount:38000,status:"sent",date:"Apr 10, 2026",expiresDate:"Apr 24, 2026",vertical:"Solar"},
  {id:2,number:"QT-2026-016",customer:"Wilson Home",amount:12500,status:"accepted",date:"Apr 5, 2026",expiresDate:"Apr 19, 2026",vertical:"Roofing"},
  {id:3,number:"QT-2026-017",customer:"Taylor Property",amount:55000,status:"draft",date:"Apr 12, 2026",expiresDate:"Apr 26, 2026",vertical:"Solar"},
  {id:4,number:"QT-2026-018",customer:"Lee Residence",amount:9800,status:"expired",date:"Mar 1, 2026",expiresDate:"Mar 15, 2026",vertical:"Smart Home"},
  {id:5,number:"QT-2026-019",customer:"Johnson Home",amount:48000,status:"sent",date:"Apr 8, 2026",expiresDate:"Apr 22, 2026",vertical:"Solar"},
];

const fmt = (n:number)=>`$${n.toLocaleString()}`;
const statusConfig: Record<string,{color:string;icon:typeof CheckCircle}> = {
  paid:{color:"bg-green-100 text-green-700",icon:CheckCircle},sent:{color:"bg-blue-100 text-blue-700",icon:Send},
  draft:{color:"bg-gray-100 text-gray-500",icon:FileText},overdue:{color:"bg-red-100 text-red-700",icon:AlertCircle},
  partial:{color:"bg-amber-100 text-amber-700",icon:Clock},accepted:{color:"bg-green-100 text-green-700",icon:CheckCircle},
  expired:{color:"bg-red-100 text-red-700",icon:XCircle},
};

export default function CommercePage() {
  const [tab, setTab] = useState<"invoices"|"quotes"|"payments">("invoices");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState<Invoice|null>(null);

  const totalRevenue = invoices.reduce((a,b)=>a+b.paidAmount,0);
  const outstanding = invoices.reduce((a,b)=>a+(b.amount-b.paidAmount),0);
  const overdueAmt = invoices.filter(i=>i.status==="overdue").reduce((a,b)=>a+b.amount,0);
  const quotesPending = quotes.filter(q=>q.status==="sent").reduce((a,b)=>a+b.amount,0);

  const filteredInvoices = invoices.filter(i=>{
    if (filter!=="all" && i.status!==filter) return false;
    if (search && !i.customer.toLowerCase().includes(search.toLowerCase()) && !i.number.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const filteredQuotes = quotes.filter(q=>{
    if (filter!=="all" && q.status!==filter) return false;
    if (search && !q.customer.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Commerce</h1>
          <p className="text-sm text-gray-500 mt-1">Quotes, invoices, and payment tracking</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800">
          <Plus size={16}/>{tab==="quotes"?"Create Quote":"Create Invoice"}
        </button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[{l:"Collected Revenue",v:fmt(totalRevenue),c:"text-green-600"},{l:"Outstanding",v:fmt(outstanding),c:"text-amber-600"},{l:"Overdue",v:fmt(overdueAmt),c:"text-red-600"},{l:"Pending Quotes",v:fmt(quotesPending),c:"text-blue-600"}].map(k=>(
          <div key={k.l} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">{k.l}</p>
            <p className={`text-2xl font-bold mt-1 ${k.c}`}>{k.v}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 border-b border-gray-200">
        {(["invoices","quotes","payments"] as const).map(t=>(
          <button key={t} onClick={()=>{setTab(t);setFilter("all")}} className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${tab===t?"border-black text-black":"border-transparent text-gray-500 hover:text-gray-600"}`}>{t}</button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search ${tab}...`} className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/20"/>
        </div>
        {tab==="invoices" && ["all","paid","sent","draft","overdue","partial"].map(s=>(
          <button key={s} onClick={()=>setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${filter===s?"bg-black text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s}</button>
        ))}
        {tab==="quotes" && ["all","accepted","sent","draft","expired"].map(s=>(
          <button key={s} onClick={()=>setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${filter===s?"bg-black text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s}</button>
        ))}
      </div>

      {/* Invoices Table */}
      {tab==="invoices" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>{["Invoice #","Customer","Amount","Paid","Status","Date","Due","Vertical","Actions"].map(h=><th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
            </thead>
            <tbody>
              {filteredInvoices.map(inv=>{
                const sc = statusConfig[inv.status];
                const SI = sc?.icon || FileText;
                return (
                  <tr key={inv.id} className="border-b border-gray-200/60 hover:bg-gray-50 cursor-pointer" onClick={()=>setDetail(inv)}>
                    <td className="px-4 py-3 font-mono text-xs font-semibold">{inv.number}</td>
                    <td className="px-4 py-3 font-medium">{inv.customer}</td>
                    <td className="px-4 py-3 font-semibold">{fmt(inv.amount)}</td>
                    <td className="px-4 py-3 text-gray-500">{fmt(inv.paidAmount)}</td>
                    <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${sc?.color}`}><SI size={10}/>{inv.status}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-500">{inv.date}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{inv.dueDate}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{inv.vertical}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-black"><Eye size={13}/></button>
                        <button className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-black"><Send size={13}/></button>
                        <button className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-black"><Download size={13}/></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Quotes Table */}
      {tab==="quotes" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>{["Quote #","Customer","Amount","Status","Created","Expires","Vertical"].map(h=><th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
            </thead>
            <tbody>
              {filteredQuotes.map(q=>{
                const sc = statusConfig[q.status];
                const SI = sc?.icon || FileText;
                return (
                  <tr key={q.id} className="border-b border-gray-200/60 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs font-semibold">{q.number}</td>
                    <td className="px-4 py-3 font-medium">{q.customer}</td>
                    <td className="px-4 py-3 font-semibold">{fmt(q.amount)}</td>
                    <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${sc?.color}`}><SI size={10}/>{q.status}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-500">{q.date}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{q.expiresDate}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{q.vertical}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Payments Tab */}
      {tab==="payments" && (
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="text-center">
            <CreditCard size={40} className="mx-auto text-gray-300 mb-3"/>
            <h3 className="text-lg font-bold text-black mb-1">Payment Processing</h3>
            <p className="text-sm text-gray-500 mb-4">Accept credit cards, ACH, and financing payments</p>
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              {[{l:"Credit Card",d:"Stripe integration"},{l:"ACH / Bank",d:"Direct debit"},{l:"Financing",d:"GoodLeap, Mosaic, Sunlight"}].map(p=>(
                <div key={p.l} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm font-semibold text-black">{p.l}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{p.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Invoice Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-mono">{detail.number}</p>
                <h2 className="text-lg font-bold text-black">{detail.customer}</h2>
              </div>
              <button onClick={()=>setDetail(null)} className="p-1.5 hover:bg-gray-100 rounded"><X size={18}/></button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div><p className="text-[11px] text-gray-500 uppercase">Amount</p><p className="text-lg font-bold">{fmt(detail.amount)}</p></div>
                <div><p className="text-[11px] text-gray-500 uppercase">Paid</p><p className="text-lg font-bold text-green-600">{fmt(detail.paidAmount)}</p></div>
                <div><p className="text-[11px] text-gray-500 uppercase">Balance</p><p className="text-lg font-bold text-red-600">{fmt(detail.amount-detail.paidAmount)}</p></div>
                <div><p className="text-[11px] text-gray-500 uppercase">Status</p><p className="text-lg font-bold capitalize">{detail.status}</p></div>
              </div>
              <table className="w-full text-sm mb-6">
                <thead><tr className="border-b border-gray-200">{["Item","Qty","Rate","Total"].map(h=><th key={h} className="text-left py-2 text-[11px] font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
                <tbody>
                  {detail.items.map((item,i)=>(
                    <tr key={i} className="border-b border-gray-200/60">
                      <td className="py-2">{item.desc}</td>
                      <td className="py-2">{item.qty}</td>
                      <td className="py-2">{fmt(item.rate)}</td>
                      <td className="py-2 font-semibold">{fmt(item.qty*item.rate)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot><tr><td colSpan={3} className="py-2 text-right font-semibold">Total</td><td className="py-2 font-bold text-lg">{fmt(detail.amount)}</td></tr></tfoot>
              </table>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg flex items-center gap-2"><Send size={14}/>Send Invoice</button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg flex items-center gap-2"><CreditCard size={14}/>Record Payment</button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg flex items-center gap-2"><Download size={14}/>Download PDF</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
