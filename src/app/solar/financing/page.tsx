"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { DollarSign, TrendingUp, Users, Search, Zap, BarChart3, Clock, CheckCircle, AlertTriangle, Sun, Battery, Plug } from "lucide-react";

const lenders = [
  { name: "Sunlight Financial", rate: "1.49-5.99%", terms: "10-25 yr", dealerFee: "15-28%", minFICO: 650, features: ["Same-day approval", "Bridge loans", "Re-amortization"] },
  { name: "GoodLeap", rate: "1.99-7.99%", terms: "10-25 yr", dealerFee: "12-30%", minFICO: 600, features: ["Instant decisions", "Home improvement", "Battery add-on"] },
  { name: "Mosaic", rate: "2.99-6.99%", terms: "10-25 yr", dealerFee: "15-25%", minFICO: 640, features: ["0% intro rate", "Flexible terms", "Fast funding"] },
  { name: "Dividend Finance", rate: "2.49-7.99%", terms: "10-20 yr", dealerFee: "13-28%", minFICO: 650, features: ["Lease options", "PPA available", "Commercial"] },
  { name: "Enfin", rate: "1.99-6.99%", terms: "12-25 yr", dealerFee: "10-22%", minFICO: 620, features: ["Low dealer fees", "Quick close", "Battery eligible"] },
];
const applications = [
  { id: 1, customer: "Garcia Residence", lender: "GoodLeap", amount: 28400, status: "funded", rate: "2.99%", term: "25 yr" },
  { id: 2, customer: "Williams Home", lender: "Sunlight", amount: 21600, status: "approved", rate: "3.49%", term: "20 yr" },
  { id: 3, customer: "Johnson Family", lender: "Mosaic", amount: 38400, status: "submitted", rate: "Pending", term: "25 yr" },
  { id: 4, customer: "Martinez Home", lender: "Enfin", amount: 24360, status: "funded", rate: "2.49%", term: "20 yr" },
  { id: 5, customer: "Thompson Residence", lender: "Dividend", amount: 32400, status: "declined", rate: "N/A", term: "N/A" },
];
export default function SolarFinancingPage() {
  const [tab, setTab] = useState<"lenders"|"applications"|"calculator">("lenders");
  const [loanAmt, setLoanAmt] = useState(25000);
  const [term, setTerm] = useState(20);
  const [rate, setRate] = useState(3.49);
  const monthly = (loanAmt * (rate/100/12) * Math.pow(1+rate/100/12, term*12)) / (Math.pow(1+rate/100/12, term*12) - 1);
  const statusColors: Record<string,string> = { submitted: "bg-blue-100 text-blue-700", approved: "bg-green-100 text-green-700", funded: "bg-emerald-100 text-emerald-700", declined: "bg-red-100 text-red-700" };
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8"><h1 className="text-3xl font-bold text-[#0B1F3A]">Solar Financing</h1><p className="text-gray-500 mt-1">Loan, lease, and PPA options from top solar lenders</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{l:"Funded This Month",v:"$186K",icon:DollarSign},{l:"Avg Loan Amount",v:"$27.4K",icon:TrendingUp},{l:"Approval Rate",v:"82%",icon:CheckCircle},{l:"Total Funded",v:"$2.1M",icon:BarChart3}].map((s,i) => <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-1"><s.icon size={16} className="text-[#F0A500]" /><span className="text-xs text-gray-500">{s.l}</span></div><div className="text-2xl font-bold text-[#0B1F3A]">{s.v}</div></div>)}
      </div>
      <div className="flex gap-2 mb-4">{(["lenders","applications","calculator"] as const).map(t => <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${tab===t?"bg-[#0B1F3A] text-white":"bg-white text-gray-600"}`}>{t}</button>)}</div>
      {tab==="lenders" && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{lenders.map((l,i)=><div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"><h3 className="text-lg font-bold text-[#0B1F3A]">{l.name}</h3><div className="grid grid-cols-2 gap-2 mt-3 text-sm">{[{k:"Rate",v:l.rate},{k:"Terms",v:l.terms},{k:"Dealer Fee",v:l.dealerFee},{k:"Min FICO",v:l.minFICO.toString()}].map((d,j)=><div key={j}><div className="text-xs text-gray-400">{d.k}</div><div className="font-medium">{d.v}</div></div>)}</div><div className="mt-3 space-y-1">{l.features.map((f,j)=><div key={j} className="text-xs text-green-600 flex items-center gap-1"><CheckCircle size={10}/>{f}</div>)}</div></div>)}</div>}
      {tab==="applications" && <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"><table className="w-full text-sm"><thead><tr className="border-b">{["Customer","Lender","Amount","Rate","Term","Status"].map(h=><th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead><tbody>{applications.map(a=><tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50"><td className="py-3 px-3 font-medium">{a.customer}</td><td className="py-3 px-3">{a.lender}</td><td className="py-3 px-3 font-semibold">${a.amount.toLocaleString()}</td><td className="py-3 px-3">{a.rate}</td><td className="py-3 px-3">{a.term}</td><td className="py-3 px-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[a.status]}`}>{a.status}</span></td></tr>)}</tbody></table></div>}
      {tab==="calculator" && <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-xl"><h3 className="font-bold text-[#0B1F3A] mb-4">Payment Calculator</h3><div className="space-y-4"><div><label className="text-xs text-gray-500">Loan Amount: ${loanAmt.toLocaleString()}</label><input type="range" min={10000} max={80000} step={1000} value={loanAmt} onChange={e=>setLoanAmt(+e.target.value)} className="w-full accent-[#F0A500]" /></div><div className="flex gap-2">{[10,15,20,25].map(t=><button key={t} onClick={()=>setTerm(t)} className={`px-4 py-2 rounded-lg text-sm font-medium ${term===t?"bg-[#0B1F3A] text-white":"bg-gray-100"}`}>{t} yr</button>)}</div><div className="flex gap-2">{[2.99,3.49,4.99,6.99].map(r=><button key={r} onClick={()=>setRate(r)} className={`px-4 py-2 rounded-lg text-sm font-medium ${rate===r?"bg-[#0B1F3A] text-white":"bg-gray-100"}`}>{r}%</button>)}</div><div className="bg-[#0B1F3A] rounded-xl p-4 text-center"><div className="text-sm text-gray-300">Monthly Payment</div><div className="text-3xl font-bold text-[#F0A500]">${monthly.toFixed(2)}</div></div></div></div>}
    </div>
  );
}
