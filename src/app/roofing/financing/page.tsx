"use client";
import { useState } from "react";
import { Wallet, DollarSign, TrendingUp, CheckCircle, Clock, AlertTriangle, Search, Plus, Calculator, FileText, Send, Users } from "lucide-react";

interface FinancingApp {
  id: string; customer: string; address: string; loan_amount: number; term: string; rate: string;
  monthly_payment: number; provider: string; status: string; date: string; credit_score: number; job: string;
}

const LENDERS = [
  { name: "GreenSky", logo: "🌿", desc: "America's leading home improvement financing", max_loan: "$100,000", terms: "12-180 months", promo: "0% APR for 12-18 months", dealer_fee: "3.99-12.99%", features: ["Instant Decisions","Soft Pull Pre-Qual","E-Sign","Mobile Friendly"] },
  { name: "PureFinance Group", logo: "🏦", desc: "Roofing-specific financing solutions", max_loan: "$75,000", terms: "12-144 months", promo: "Same-as-cash 12 months", dealer_fee: "Custom", features: ["Same-Day Funding","Contractor Portal","Multi-Lender","Custom Terms"] },
  { name: "AccuFi", logo: "📊", desc: "Built-in CRM financing integration", max_loan: "$65,000", terms: "12-120 months", promo: "Rate match guarantee", dealer_fee: "2.99-8.99%", features: ["CRM Integrated","Auto-Submit","Lender Waterfall","Real-time Status"] },
  { name: "Wells Fargo", logo: "🏛️", desc: "Home improvement credit line", max_loan: "$100,000", terms: "12-84 months", promo: "0% for 12 months", dealer_fee: "4.99%", features: ["Revolving Credit","Low Rates","Established Lender","Quick Approval"] }
];

const APPS: FinancingApp[] = [
  { id:"1",customer:"Johnson Family",address:"4521 Oak Ave, Dallas TX",loan_amount:12250,term:"12 months",rate:"0% APR",monthly_payment:1020.83,provider:"GreenSky",status:"funded",date:"2024-03-22",credit_score:742,job:"RJ-2024-090" },
  { id:"2",customer:"Garcia Residence",address:"6789 Cedar Ln, Dallas TX",loan_amount:15600,term:"24 months",rate:"5.99% APR",monthly_payment:691.20,provider:"PureFinance Group",status:"funded",date:"2024-03-16",credit_score:698,job:"RJ-2024-085" },
  { id:"3",customer:"Martinez Family",address:"9012 Birch Rd, Houston TX",loan_amount:19800,term:"18 months",rate:"0% APR",monthly_payment:1100.00,provider:"GreenSky",status:"pending_docs",date:"2024-04-12",credit_score:725,job:"RJ-2024-096" },
  { id:"4",customer:"Lee Residence",address:"777 Sunset Blvd, Columbus OH",loan_amount:14200,term:"36 months",rate:"7.99% APR",monthly_payment:444.78,provider:"AccuFi",status:"approved",date:"2024-04-08",credit_score:681,job:"RJ-2024-097" },
  { id:"5",customer:"Anderson Property",address:"321 Spruce St, Detroit MI",loan_amount:24500,term:"60 months",rate:"9.99% APR",monthly_payment:520.75,provider:"PureFinance Group",status:"pre_qualified",date:"2024-04-14",credit_score:665,job:"RJ-2024-095" },
  { id:"6",customer:"Thompson Residence",address:"1500 Maple Dr, Dallas TX",loan_amount:21300,term:"24 months",rate:"3.99% APR",monthly_payment:923.45,provider:"Wells Fargo",status:"funded",date:"2024-03-10",credit_score:780,job:"RJ-2024-088" },
  { id:"7",customer:"Nguyen Family",address:"456 Oak Ridge Dr, Houston TX",loan_amount:16500,term:"18 months",rate:"0% APR",monthly_payment:916.67,provider:"GreenSky",status:"declined",date:"2024-04-11",credit_score:580,job:"RJ-2024-098" }
];

export default function FinancingPage() {
  const [apps, setApps] = useState(APPS);
  const [tab, setTab] = useState<"applications"|"lenders"|"calculator">("applications");
  const [search, setSearch] = useState("");
  const [calcAmount, setCalcAmount] = useState(20000);
  const [calcTerm, setCalcTerm] = useState(24);
  const [calcRate, setCalcRate] = useState(5.99);

  const totalFinanced = apps.filter(a => a.status === "funded").reduce((s, a) => s + a.loan_amount, 0);
  const filtered = apps.filter(a => a.customer.toLowerCase().includes(search.toLowerCase()));
  const monthlyPayment = calcRate === 0 ? calcAmount / calcTerm : (calcAmount * (calcRate / 100 / 12) * Math.pow(1 + calcRate / 100 / 12, calcTerm)) / (Math.pow(1 + calcRate / 100 / 12, calcTerm) - 1);

  const statusStyle = (s: string) => s === "funded" ? "bg-green-100 text-green-700" : s === "approved" ? "bg-blue-100 text-blue-700" : s === "pending_docs" ? "bg-yellow-100 text-yellow-700" : s === "pre_qualified" ? "bg-purple-100 text-purple-700" : "bg-red-100 text-red-700";

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-[#0B1F3A] flex items-center gap-2"><Wallet className="text-[#F0A500]" size={28}/>Roofing Finance</h1><p className="text-gray-500 mt-1">GreenSky, PureFinance, AccuFi & Wells Fargo — homeowner financing solutions</p></div>
        <button className="bg-[#F0A500] text-[#0B1F3A] px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-yellow-500"><Plus size={18}/>New Application</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[{l:"Total Financed",v:`$${(totalFinanced/1000).toFixed(0)}K`,c:"text-green-600"},{l:"Applications",v:apps.length,c:"text-blue-600"},{l:"Approval Rate",v:`${Math.round((apps.filter(a=>["funded","approved"].includes(a.status)).length/apps.length)*100)}%`,c:"text-purple-600"},{l:"Avg Loan",v:`$${Math.round(apps.reduce((s,a)=>s+a.loan_amount,0)/apps.length/1000)}K`,c:"text-orange-600"},{l:"Active Lenders",v:LENDERS.length,c:"text-cyan-600"}].map((s,i)=>(
          <div key={i} className="bg-white rounded-xl border p-4 text-center"><p className={`text-2xl font-bold ${s.c}`}>{s.v}</p><p className="text-xs text-gray-500 mt-1">{s.l}</p></div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["applications","lenders","calculator"] as const).map(t=><button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab===t?"bg-[#0B1F3A] text-white":"bg-gray-100 text-gray-600"}`}>{t==="applications"?"Applications":t==="lenders"?"Lender Partners":"Payment Calculator"}</button>)}
        {tab==="applications"&&<div className="relative flex-1 max-w-xs ml-auto"><Search className="absolute left-3 top-2.5 text-gray-400" size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." className="pl-9 pr-3 py-2 border rounded-lg w-full text-sm"/></div>}
      </div>

      {tab === "applications" && (
        <div className="space-y-3">
          {filtered.map(a=>(
            <div key={a.id} className="bg-white rounded-xl border p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="flex-1"><h3 className="font-semibold text-[#0B1F3A]">{a.customer}</h3><p className="text-xs text-gray-500">{a.address} · {a.job}</p><p className="text-xs text-gray-400 mt-0.5">{a.provider} · {a.term} · {a.rate}</p></div>
              <div className="text-center"><p className="font-bold text-[#0B1F3A]">${a.loan_amount.toLocaleString()}</p><p className="text-[10px] text-gray-500">Loan Amount</p></div>
              <div className="text-center"><p className="font-bold text-green-600">${a.monthly_payment.toFixed(0)}</p><p className="text-[10px] text-gray-500">/month</p></div>
              <div className="text-center"><p className="font-bold text-blue-600">{a.credit_score}</p><p className="text-[10px] text-gray-500">Credit</p></div>
              <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${statusStyle(a.status)}`}>{a.status.replace("_"," ")}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "lenders" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LENDERS.map(l=>(
            <div key={l.name} className="bg-white rounded-xl border p-5">
              <div className="flex items-center gap-3 mb-3"><span className="text-3xl">{l.logo}</span><div><h3 className="font-bold text-lg text-[#0B1F3A]">{l.name}</h3><p className="text-xs text-gray-500">{l.desc}</p></div></div>
              <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                <div><p className="text-gray-500">Max Loan</p><p className="font-bold">{l.max_loan}</p></div>
                <div><p className="text-gray-500">Terms</p><p className="font-bold">{l.terms}</p></div>
                <div><p className="text-gray-500">Promo Rate</p><p className="font-bold text-green-600">{l.promo}</p></div>
                <div><p className="text-gray-500">Dealer Fee</p><p className="font-bold">{l.dealer_fee}</p></div>
              </div>
              <div className="flex flex-wrap gap-1">{l.features.map(f=><span key={f} className="bg-gray-100 px-2 py-0.5 rounded text-[10px] text-gray-600">{f}</span>)}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "calculator" && (
        <div className="max-w-lg mx-auto bg-white rounded-xl border p-6">
          <h3 className="font-bold text-lg text-[#0B1F3A] mb-4 flex items-center gap-2"><Calculator size={20} className="text-[#F0A500]"/>Payment Calculator</h3>
          <div className="space-y-4">
            <div><label className="text-sm font-medium text-gray-700">Loan Amount</label><input type="range" min={5000} max={100000} step={500} value={calcAmount} onChange={e=>setCalcAmount(+e.target.value)} className="w-full mt-1"/><div className="flex justify-between text-xs text-gray-500"><span>$5,000</span><span className="font-bold text-[#0B1F3A] text-lg">${calcAmount.toLocaleString()}</span><span>$100,000</span></div></div>
            <div><label className="text-sm font-medium text-gray-700">Term (months)</label><div className="flex gap-2 mt-1">{[12,18,24,36,48,60].map(t=><button key={t} onClick={()=>setCalcTerm(t)} className={`px-3 py-2 rounded-lg text-sm ${calcTerm===t?"bg-[#0B1F3A] text-white":"bg-gray-100"}`}>{t}</button>)}</div></div>
            <div><label className="text-sm font-medium text-gray-700">Interest Rate (APR %)</label><div className="flex gap-2 mt-1">{[0,3.99,5.99,7.99,9.99].map(r=><button key={r} onClick={()=>setCalcRate(r)} className={`px-3 py-2 rounded-lg text-sm ${calcRate===r?"bg-[#0B1F3A] text-white":"bg-gray-100"}`}>{r}%</button>)}</div></div>
            <div className="border-t pt-4 mt-4 text-center">
              <p className="text-gray-500 text-sm">Estimated Monthly Payment</p>
              <p className="text-4xl font-bold text-[#F0A500] mt-1">${monthlyPayment.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-1">Total: ${(monthlyPayment*calcTerm).toFixed(0)} over {calcTerm} months{calcRate>0?` · Interest: $${((monthlyPayment*calcTerm)-calcAmount).toFixed(0)}`:""}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
