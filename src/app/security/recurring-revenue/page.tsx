"use client";
import { useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, Users, BarChart3, ArrowUp, ArrowDown } from "lucide-react";

const planData = [
  { plan: "Basic ($29.99)", accounts: 312, rmr: 9357, color: "bg-blue-500", pct: 20 },
  { plan: "Standard ($39.99)", accounts: 487, rmr: 19475, color: "bg-[#F0A500]", pct: 41 },
  { plan: "Premium ($59.99)", accounts: 390, rmr: 23396, color: "bg-[#007A67]", pct: 49 },
];
const topAccounts = [
  { name: "Thompson LLC", plan: "Premium", monthly: 264.99, sensors: 42, cameras: 12 },
  { name: "Dallas Medical Center", plan: "Premium", monthly: 189.99, sensors: 28, cameras: 8 },
  { name: "Anderson Home", plan: "Premium", monthly: 64.99, sensors: 10, cameras: 4 },
  { name: "Williams Home", plan: "Premium", monthly: 59.99, sensors: 15, cameras: 3 },
  { name: "Garcia Family", plan: "Standard", monthly: 44.99, sensors: 8, cameras: 2 },
];
const monthlyTrend = [
  { month: "Oct", rmr: 42100, new: 2400, churned: 890 },
  { month: "Nov", rmr: 43610, new: 2800, churned: 1290 },
  { month: "Dec", rmr: 44800, new: 2100, churned: 910 },
  { month: "Jan", rmr: 45890, new: 2600, churned: 1510 },
  { month: "Feb", rmr: 46700, new: 2200, churned: 1390 },
  { month: "Mar", rmr: 47560, new: 2900, churned: 2040 },
];

export default function RecurringRevenuePage() {
  const totalRMR = planData.reduce((a, p) => a + p.rmr, 0);
  const maxRMR = Math.max(...monthlyTrend.map(m => m.rmr));
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8"><h1 className="text-3xl font-bold text-[#0B1F3A]">Recurring Revenue</h1><p className="text-gray-500 mt-1">RMR analytics, churn tracking, and revenue forecasting</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{label:"Total RMR",value:`$${totalRMR.toLocaleString()}`,change:"+$860",up:true,icon:DollarSign},{label:"MRR Growth",value:"+1.8%",change:"vs last month",up:true,icon:TrendingUp},{label:"Annual RMR",value:`$${(totalRMR*12/1000).toFixed(0)}K`,change:"+$10.3K",up:true,icon:BarChart3},{label:"Churn Rate",value:"2.1%",change:"-0.3%",up:false,icon:TrendingDown}].map((s,i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-1"><s.icon size={16} className="text-[#F0A500]" /><span className="text-xs text-gray-500">{s.label}</span></div><div className="text-2xl font-bold text-[#0B1F3A]">{s.value}</div><div className={`text-xs font-medium mt-1 flex items-center gap-1 ${s.up?"text-green-600":"text-green-600"}`}>{s.up?<ArrowUp size={12}/>:<ArrowDown size={12}/>}{s.change}</div></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">Revenue by Plan Tier</h2>
          <div className="space-y-4">{planData.map((p,i) => (
            <div key={i}><div className="flex justify-between text-sm mb-1"><span className="font-medium">{p.plan}</span><span className="text-gray-500">{p.accounts} accounts · ${p.rmr.toLocaleString()}/mo</span></div><div className="w-full h-4 bg-gray-100 rounded-full"><div className={`h-4 rounded-full ${p.color}`} style={{width:`${p.pct}%`}} /></div></div>
          ))}</div>
          <div className="mt-4 pt-4 border-t flex justify-between"><span className="font-semibold">Total</span><span className="font-bold text-[#0B1F3A]">{planData.reduce((a,p)=>a+p.accounts,0)} accounts · ${totalRMR.toLocaleString()}/mo</span></div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">Monthly RMR Trend</h2>
          <div className="flex items-end gap-2 h-40">{monthlyTrend.map((m,i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1"><div className="w-full bg-gradient-to-t from-[#0B1F3A] to-[#F0A500] rounded-t" style={{height:`${(m.rmr/maxRMR)*100}%`}} /><span className="text-xs text-gray-500">{m.month}</span></div>
          ))}</div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center pt-4 border-t">{[{l:"New MRR",v:`+$${monthlyTrend[5].new.toLocaleString()}`,c:"text-green-600"},{l:"Churned",v:`-$${monthlyTrend[5].churned.toLocaleString()}`,c:"text-red-600"},{l:"Net",v:`+$${(monthlyTrend[5].new-monthlyTrend[5].churned).toLocaleString()}`,c:"text-green-600"}].map((d,i) => <div key={i}><div className="text-xs text-gray-400">{d.l}</div><div className={`text-sm font-bold ${d.c}`}>{d.v}</div></div>)}</div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">Top Accounts by RMR</h2>
        <table className="w-full text-sm"><thead><tr className="border-b border-gray-100">{["Account","Plan","Monthly RMR","Sensors","Cameras"].map(h=><th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead><tbody>{topAccounts.map((a,i) => (
          <tr key={i} className="border-b border-gray-50 hover:bg-gray-50"><td className="py-3 px-3 font-medium text-[#0B1F3A]">{a.name}</td><td className="py-3 px-3"><span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#007A67]/10 text-[#007A67]">{a.plan}</span></td><td className="py-3 px-3 font-bold">${a.monthly}</td><td className="py-3 px-3">{a.sensors}</td><td className="py-3 px-3">{a.cameras}</td></tr>
        ))}</tbody></table>
      </div>
    </div>
  );
}
