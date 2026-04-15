"use client";
import { useState } from "react";
import { Target, Shield, Users, BookOpen, BarChart3, DollarSign, CheckCircle, AlertTriangle, TrendingUp, Clock, Star, Search, Headphones, FileText } from "lucide-react";

const atRisk = [
  { id: 1, customer: "Roberts Family", reason: "Price", tenure: "14 mo", monthly: 124.99, offer: "Free speed upgrade", status: "contacted" },
  { id: 2, customer: "Clark Home", reason: "Competition", tenure: "8 mo", monthly: 65.00, offer: "Price lock 24mo", status: "offer_sent" },
  { id: 3, customer: "Lewis Residence", reason: "Moving", tenure: "22 mo", monthly: 189.99, offer: "Transfer service", status: "new" },
  { id: 4, customer: "Walker Family", reason: "Service", tenure: "6 mo", monthly: 80.00, offer: "Tech visit + credit", status: "saved" },
  { id: 5, customer: "Hall Home", reason: "Price", tenure: "18 mo", monthly: 55.00, offer: "Loyalty discount", status: "contacted" },
  { id: 6, customer: "Young Residence", reason: "Competition", tenure: "10 mo", monthly: 110.00, offer: "Bundle credit", status: "lost" },
];
const offers = [{name:"Free Speed Upgrade",uses:23},{name:"Price Lock (24mo)",uses:18},{name:"Loyalty Discount ($15/mo)",uses:31},{name:"Bundle Credit ($50)",uses:14},{name:"Free Premium Channel (3mo)",uses:9}];
export default function RetentionPage() {
  const statusColors: Record<string,string> = { new:"bg-blue-100 text-blue-700", contacted:"bg-yellow-100 text-yellow-700", offer_sent:"bg-purple-100 text-purple-700", saved:"bg-green-100 text-green-700", lost:"bg-red-100 text-red-700" };
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8"><h1 className="text-3xl font-bold text-[#0B1F3A]">Retention</h1><p className="text-gray-500 mt-1">At-risk customer management, save offers, and win-back campaigns</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{l:"Save Rate",v:"87%",icon:Headphones},{l:"Avg Value Saved",v:"$112/mo",icon:DollarSign},{l:"Churn Rate",v:"3.2%",icon:TrendingUp},{l:"Offers Used",v:offers.reduce((a,o)=>a+o.uses,0).toString(),icon:CheckCircle}].map((s,i)=><div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-1"><s.icon size={16} className="text-[#F0A500]"/><span className="text-xs text-gray-500">{s.l}</span></div><div className="text-2xl font-bold text-[#0B1F3A]">{s.v}</div></div>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6"><h2 className="text-lg font-bold text-[#0B1F3A] mb-4">At-Risk Customers</h2><table className="w-full text-sm"><thead><tr className="border-b">{["Customer","Reason","Tenure","Monthly","Save Offer","Status"].map(h=><th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead><tbody>{atRisk.map(c=><tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50"><td className="py-3 px-3 font-medium">{c.customer}</td><td className="py-3 px-3"><span className="px-2 py-0.5 rounded-full text-xs bg-red-50 text-red-600">{c.reason}</span></td><td className="py-3 px-3">{c.tenure}</td><td className="py-3 px-3 font-semibold">${c.monthly}</td><td className="py-3 px-3 text-gray-600">{c.offer}</td><td className="py-3 px-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[c.status]}`}>{c.status.replace("_"," ")}</span></td></tr>)}</tbody></table></div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"><h2 className="text-lg font-bold text-[#0B1F3A] mb-4">Retention Offers</h2><div className="space-y-3">{offers.map((o,i)=><div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50"><span className="text-sm font-medium">{o.name}</span><span className="text-sm font-bold text-[#F0A500]">{o.uses} used</span></div>)}</div></div>
      </div>
    </div>
  );
}
