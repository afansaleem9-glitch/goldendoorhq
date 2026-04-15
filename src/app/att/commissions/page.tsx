"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { FileText, DollarSign, Users, MapPin, CheckCircle, TrendingUp, Search, Plus, Signal, Wifi, Clock, AlertTriangle, BarChart3, Star } from "lucide-react";

const tiers = [{product:"Internet",amount:"$75"},{product:"TV",amount:"$50"},{product:"Bundle (Internet+TV)",amount:"$150"},{product:"Wireless (per line)",amount:"$100"},{product:"Phone Add-on",amount:"$25"}];
const reps = [
  {name:"Sarah Chen",orders:15,commission:2340,status:"approved"},{name:"Mike Torres",orders:12,commission:1890,status:"approved"},
  {name:"James Reid",orders:9,commission:1425,status:"pending"},{name:"Lisa Park",orders:11,commission:1710,status:"approved"},
  {name:"David Kim",orders:7,commission:1050,status:"pending"},
];
const records = [
  {rep:"Sarah Chen",orderNo:"ATT-2024-001",product:"Fiber 1000 + TV",amount:150,status:"paid",date:"2024-04-01"},
  {rep:"Sarah Chen",orderNo:"ATT-2024-003",product:"Fiber 2000 + TV + Phone",amount:175,status:"paid",date:"2024-03-28"},
  {rep:"Mike Torres",orderNo:"ATT-2024-002",product:"Fiber 500",amount:75,status:"approved",date:"2024-04-10"},
  {rep:"James Reid",orderNo:"ATT-2024-004",product:"Fiber 300",amount:75,status:"pending",date:"2024-04-12"},
  {rep:"Lisa Park",orderNo:"ATT-2024-005",product:"Fiber 1000 + TV",amount:150,status:"paid",date:"2024-03-20"},
  {rep:"David Kim",orderNo:"ATT-2024-007",product:"Fiber 5000",amount:75,status:"pending",date:"2024-04-11"},
];
export default function ATTCommissionsPage() {
  const [tab, setTab] = useState<"leaderboard"|"records"|"tiers">("leaderboard");
  const statusColors: Record<string,string> = { paid:"bg-green-100 text-green-700", approved:"bg-blue-100 text-blue-700", pending:"bg-yellow-100 text-yellow-700" };
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8"><h1 className="text-3xl font-bold text-[#0B1F3A]">AT&T Commissions</h1><p className="text-gray-500 mt-1">Sales rep commission tracking, tiers, and payouts</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{l:"Total Commissions",v:`$${reps.reduce((a,r)=>a+r.commission,0).toLocaleString()}`,icon:DollarSign},{l:"Avg Per Rep",v:`$${Math.round(reps.reduce((a,r)=>a+r.commission,0)/reps.length)}`,icon:Users},{l:"Paid This Month",v:`$${records.filter(r=>r.status==="paid").reduce((a,r)=>a+r.amount,0)}`,icon:CheckCircle},{l:"Pending Payout",v:`$${records.filter(r=>r.status==="pending").reduce((a,r)=>a+r.amount,0)}`,icon:Clock}].map((s,i)=><div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-1"><s.icon size={16} className="text-[#F0A500]"/><span className="text-xs text-gray-500">{s.l}</span></div><div className="text-2xl font-bold text-[#0B1F3A]">{s.v}</div></div>)}
      </div>
      <div className="flex gap-2 mb-4">{(["leaderboard","records","tiers"] as const).map(t=><button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${tab===t?"bg-[#0B1F3A] text-white":"bg-white text-gray-600"}`}>{t}</button>)}</div>
      {tab==="leaderboard" && <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"><div className="space-y-3">{reps.sort((a,b)=>b.commission-a.commission).map((r,i)=><div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50"><span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i===0?"bg-[#F0A500] text-white":i===1?"bg-gray-300 text-white":i===2?"bg-orange-400 text-white":"bg-gray-200 text-gray-600"}`}>{i+1}</span><div className="flex-1"><div className="font-medium text-[#0B1F3A]">{r.name}</div><div className="text-xs text-gray-500">{r.orders} orders</div></div><div className="text-right"><div className="font-bold text-[#0B1F3A]">${r.commission.toLocaleString()}</div><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status]}`}>{r.status}</span></div></div>)}</div></div>}
      {tab==="records" && <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"><table className="w-full text-sm"><thead><tr className="border-b">{["Rep","Order","Product","Amount","Status","Date"].map(h=><th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead><tbody>{records.map((r,i)=><tr key={i} className="border-b border-gray-50 hover:bg-gray-50"><td className="py-3 px-3 font-medium">{r.rep}</td><td className="py-3 px-3 font-mono text-[#F0A500]">{r.orderNo}</td><td className="py-3 px-3">{r.product}</td><td className="py-3 px-3 font-semibold">${r.amount}</td><td className="py-3 px-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status]}`}>{r.status}</span></td><td className="py-3 px-3 text-gray-500">{r.date}</td></tr>)}</tbody></table></div>}
      {tab==="tiers" && <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"><h3 className="font-bold text-[#0B1F3A] mb-4">Commission Tiers</h3><div className="space-y-3">{tiers.map((t,i)=><div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50"><span className="font-medium">{t.product}</span><span className="font-bold text-[#F0A500] text-lg">{t.amount}</span></div>)}</div></div>}
    </div>
  );
}
