"use client";
import { useState } from "react";
import { Target, DollarSign, Users, TrendingUp, Calculator, ArrowRight } from "lucide-react";

const competitors = [
  { name: "ADT", monthly: 45.99, etf: 750, term: 36, weaknesses: ["High ETF fees", "Outdated equipment", "Long contracts", "Poor app reviews"], marketShare: "28%" },
  { name: "Vivint", monthly: 52.99, etf: 1200, term: 60, weaknesses: ["Expensive equipment", "Solar bundling pressure", "5-year lock-in", "Aggressive sales tactics"], marketShare: "12%" },
  { name: "SimpliSafe", monthly: 27.99, etf: 0, term: 0, weaknesses: ["No professional monitoring default", "Limited smart home", "Basic cameras", "No local storage"], marketShare: "8%" },
  { name: "Ring", monthly: 20.00, etf: 0, term: 0, weaknesses: ["DIY only", "Privacy concerns", "Limited sensors", "No professional install"], marketShare: "15%" },
  { name: "Brinks", monthly: 39.99, etf: 500, term: 36, weaknesses: ["Rebranded Monitronics", "Aging infrastructure", "Slow response", "Limited smart home"], marketShare: "5%" },
];
const mockLeads = [
  { id: 1, customer: "Williams Family", competitor: "ADT", monthly: 49.99, remaining: 18, etf: 375, status: "contacted" },
  { id: 2, customer: "Rodriguez Home", competitor: "Vivint", monthly: 59.99, remaining: 34, etf: 1200, status: "proposal_sent" },
  { id: 3, customer: "Chen Residence", competitor: "ADT", monthly: 42.99, remaining: 8, etf: 167, status: "ready_to_close" },
  { id: 4, customer: "Patel Family", competitor: "Brinks", monthly: 44.99, remaining: 22, etf: 306, status: "new" },
  { id: 5, customer: "Kim Home", competitor: "SimpliSafe", monthly: 27.99, remaining: 0, etf: 0, status: "contacted" },
];

export default function CompetitorTakeoverPage() {
  const [calc, setCalc] = useState({ compRate: 45.99, remaining: 24, etf: 500 });
  const deltaRate = 39.99;
  const monthlySavings = calc.compRate - deltaRate;
  const totalSavings = monthlySavings * 36;
  const statusColors: Record<string,string> = { new: "bg-blue-100 text-blue-700", contacted: "bg-yellow-100 text-yellow-700", proposal_sent: "bg-purple-100 text-purple-700", ready_to_close: "bg-green-100 text-green-700" };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8"><h1 className="text-3xl font-bold text-[#0B1F3A]">Competitor Takeover</h1><p className="text-gray-500 mt-1">Win customers from ADT, Vivint, SimpliSafe and more</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{ label: "Takeover Prospects", value: "47", icon: Target },{ label: "Won This Month", value: "12", icon: Users },{ label: "Avg Savings Offered", value: "$18/mo", icon: DollarSign },{ label: "Win Rate", value: "68%", icon: TrendingUp }].map((s,i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-1"><s.icon size={16} className="text-[#F0A500]" /><span className="text-xs text-gray-500">{s.label}</span></div><div className="text-2xl font-bold text-[#0B1F3A]">{s.value}</div></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {competitors.map((c,i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3"><h3 className="text-lg font-bold text-[#0B1F3A]">{c.name}</h3><span className="text-xs text-gray-400">{c.marketShare} share</span></div>
              <div className="grid grid-cols-3 gap-2 mb-3 text-center">{[{l:"Monthly",v:`$${c.monthly}`},{l:"ETF",v:c.etf>0?`$${c.etf}`:"None"},{l:"Term",v:c.term>0?`${c.term}mo`:"None"}].map((d,j)=><div key={j} className="bg-gray-50 rounded-lg p-2"><div className="text-xs text-gray-400">{d.l}</div><div className="text-sm font-bold text-[#0B1F3A]">{d.v}</div></div>)}</div>
              <div className="space-y-1">{c.weaknesses.map((w,j) => <div key={j} className="text-xs text-red-600 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-400" />{w}</div>)}</div>
              <button className="mt-3 w-full bg-[#F0A500] text-[#0B1F3A] font-semibold py-2 rounded-lg text-sm hover:bg-yellow-500">Build Counter Offer</button>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
          <h2 className="text-lg font-bold text-[#0B1F3A] mb-4 flex items-center gap-2"><Calculator size={18} /> Takeover Calculator</h2>
          <div className="space-y-4">
            <div><label className="text-xs text-gray-500 block mb-1">Competitor Monthly Rate</label><input type="number" value={calc.compRate} onChange={e => setCalc({...calc, compRate: +e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="text-xs text-gray-500 block mb-1">Months Remaining</label><input type="number" value={calc.remaining} onChange={e => setCalc({...calc, remaining: +e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="text-xs text-gray-500 block mb-1">Early Termination Fee</label><input type="number" value={calc.etf} onChange={e => setCalc({...calc, etf: +e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" /></div>
            <div className="bg-green-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm"><span>Delta Monthly Rate</span><span className="font-bold text-green-700">${deltaRate}/mo</span></div>
              <div className="flex justify-between text-sm"><span>Monthly Savings</span><span className="font-bold text-green-700">${monthlySavings.toFixed(2)}/mo</span></div>
              <div className="flex justify-between text-sm"><span>36-Month Savings</span><span className="font-bold text-green-700">${totalSavings.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span>ETF Buyout Cost</span><span className="font-bold text-red-600">${calc.etf}</span></div>
              <div className="border-t pt-2 flex justify-between"><span className="font-semibold">Net Customer Savings</span><span className="font-bold text-green-700">${(totalSavings - calc.etf).toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">Takeover Pipeline</h2>
        <table className="w-full text-sm"><thead><tr className="border-b border-gray-100">{["Customer","Competitor","Their Rate","Remaining","ETF","Status","Action"].map(h => <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead><tbody>{mockLeads.map(l => (
          <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50"><td className="py-3 px-3 font-medium">{l.customer}</td><td className="py-3 px-3">{l.competitor}</td><td className="py-3 px-3">${l.monthly}</td><td className="py-3 px-3">{l.remaining} mo</td><td className="py-3 px-3">${l.etf}</td><td className="py-3 px-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[l.status]}`}>{l.status.replace("_"," ")}</span></td><td className="py-3 px-3"><button className="text-[#F0A500] hover:text-yellow-600 text-xs font-medium">Send Offer →</button></td></tr>
        ))}</tbody></table>
      </div>
    </div>
  );
}
