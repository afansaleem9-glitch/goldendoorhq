"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { DollarSign, TrendingUp, Users, CheckCircle, AlertTriangle, Search, Plus, Package, ClipboardCheck, Sun, Wrench, BarChart3, Star, Calendar } from "lucide-react";

const incentiveTypes = [
  { name: "Federal ITC", value: "30%", desc: "Investment Tax Credit through 2032. Applies to solar + battery.", status: "Active", savings: "Avg $8,400" },
  { name: "TX Property Tax Exemption", value: "100%", desc: "Solar systems exempt from property tax increase.", status: "Active", savings: "Avg $1,200/yr" },
  { name: "OH SREC", value: "$25/SREC", desc: "Solar Renewable Energy Credits — 1 SREC per 1,000 kWh.", status: "Active", savings: "Avg $250/yr" },
  { name: "MI Net Metering", value: "1:1", desc: "Full retail rate credit for exported solar energy.", status: "Active", savings: "Avg $1,400/yr" },
  { name: "Oncor Rebate", value: "$0.50/W", desc: "Utility rebate up to 10kW residential systems.", status: "Limited", savings: "Up to $5,000" },
];
const tracking = [
  { id: 1, customer: "Garcia Residence", type: "Federal ITC", amount: 8520, status: "claimed", date: "2024-04-01" },
  { id: 2, customer: "Williams Home", type: "Federal ITC", amount: 6480, status: "pending", date: "2024-04-10" },
  { id: 3, customer: "Johnson Family", type: "OH SREC", amount: 250, status: "earned", date: "2024-03-15" },
  { id: 4, customer: "Anderson Home", type: "Oncor Rebate", amount: 3000, status: "approved", date: "2024-03-28" },
];
export default function IncentivesPage() {
  const [calcCost, setCalcCost] = useState(28000);
  const itc = calcCost * 0.3;
  const statusColors: Record<string,string> = { claimed: "bg-green-100 text-green-700", pending: "bg-blue-100 text-blue-700", earned: "bg-emerald-100 text-emerald-700", approved: "bg-purple-100 text-purple-700" };
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8"><h1 className="text-3xl font-bold text-[#0B1F3A]">Incentives & Credits</h1><p className="text-gray-500 mt-1">Tax credits, rebates, SRECs, and incentive tracking</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{l:"Total ITC Value",v:"$1.2M",icon:DollarSign},{l:"Avg Customer Savings",v:"$9,800",icon:TrendingUp},{l:"Pending Claims",v:tracking.filter(t=>t.status==="pending").length.toString(),icon:AlertTriangle},{l:"SRECs Earned",v:"342",icon:Sun}].map((s,i) => <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-1"><s.icon size={16} className="text-[#F0A500]" /><span className="text-xs text-gray-500">{s.l}</span></div><div className="text-2xl font-bold text-[#0B1F3A]">{s.v}</div></div>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">Available Incentives</h2>
          <div className="space-y-3">{incentiveTypes.map((inc,i) => <div key={i} className="p-4 rounded-lg border border-gray-100 hover:border-[#F0A500] transition"><div className="flex items-center justify-between"><div><span className="font-bold text-[#0B1F3A]">{inc.name}</span><span className="ml-2 text-lg font-bold text-[#F0A500]">{inc.value}</span></div><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${inc.status==="Active"?"bg-green-100 text-green-700":"bg-yellow-100 text-yellow-700"}`}>{inc.status}</span></div><p className="text-sm text-gray-500 mt-1">{inc.desc}</p><span className="text-xs text-green-600 font-medium">{inc.savings}</span></div>)}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
          <h3 className="font-bold text-[#0B1F3A] mb-3">Incentive Calculator</h3>
          <div><label className="text-xs text-gray-500">System Cost</label><input type="range" min={15000} max={60000} step={1000} value={calcCost} onChange={e=>setCalcCost(+e.target.value)} className="w-full accent-[#F0A500]" /><div className="text-center font-bold">${calcCost.toLocaleString()}</div></div>
          <div className="mt-4 space-y-2 bg-green-50 rounded-lg p-4">{[{l:"Federal ITC (30%)",v:`-$${itc.toLocaleString()}`},{l:"State Credits",v:"-$1,200"},{l:"Utility Rebate",v:"-$2,500"},{l:"Net System Cost",v:`$${(calcCost-itc-1200-2500).toLocaleString()}`}].map((d,i)=><div key={i} className="flex justify-between text-sm"><span>{d.l}</span><span className="font-bold text-green-700">{d.v}</span></div>)}</div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">Customer Incentive Tracking</h2>
        <table className="w-full text-sm"><thead><tr className="border-b">{["Customer","Incentive","Amount","Status","Date"].map(h=><th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead><tbody>{tracking.map(t=><tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50"><td className="py-3 px-3 font-medium">{t.customer}</td><td className="py-3 px-3">{t.type}</td><td className="py-3 px-3 font-semibold">${t.amount.toLocaleString()}</td><td className="py-3 px-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[t.status]}`}>{t.status}</span></td><td className="py-3 px-3 text-gray-500">{t.date}</td></tr>)}</tbody></table>
      </div>
    </div>
  );
}
