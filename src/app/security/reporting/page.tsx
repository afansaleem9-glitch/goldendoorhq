"use client";
import { useState } from "react";
import { BarChart3, TrendingUp, DollarSign, Users, AlertTriangle, Shield, Award, Clock } from "lucide-react";

export default function SecurityReportingPage() {
  const [period, setPeriod] = useState("month");

  const kpis = [
    { label:"Monthly Recurring Revenue",val:"$54,389",change:"+8.2%",trend:"up",icon:DollarSign },
    { label:"Total Accounts",val:"1,247",change:"+34",trend:"up",icon:Users },
    { label:"Attrition Rate",val:"2.1%",change:"-0.3%",trend:"down",icon:AlertTriangle },
    { label:"Avg Install Revenue",val:"$3,421",change:"+$156",trend:"up",icon:TrendingUp },
    { label:"Service Resolution Time",val:"1.8 days",change:"-0.4 days",trend:"down",icon:Clock },
    { label:"Customer Satisfaction",val:"4.8/5.0",change:"+0.1",trend:"up",icon:Award },
  ];

  const repPerformance = [
    { name:"James Bond",installs:15,revenue:52500,mrr_added:749.85,close_rate:"78%",avg_ticket:3500 },
    { name:"Sarah Thompson",installs:12,revenue:41600,mrr_added:599.88,close_rate:"72%",avg_ticket:3467 },
    { name:"Mike Chen",installs:8,revenue:68000,mrr_added:2399.92,close_rate:"65%",avg_ticket:8500 },
  ];

  const mrrByPlan = [
    { plan:"Basic Monitoring ($29.99)",accounts:312,mrr:9356.88 },
    { plan:"Standard Interactive ($39.99)",accounts:189,mrr:7558.11 },
    { plan:"Premium Interactive ($49.99)",accounts:423,mrr:21145.77 },
    { plan:"Premium + Video ($69.99)",accounts:156,mrr:10918.44 },
    { plan:"Enterprise ($299.99+)",accounts:28,mrr:8399.72 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-pink-600 to-pink-800 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div><div className="flex items-center gap-3 mb-2"><BarChart3 className="w-8 h-8"/><h1 className="text-3xl font-bold">Security Reporting</h1></div>
            <p className="text-pink-200">RMR reports, attrition, install metrics, technician KPIs, and live dashboards.</p></div>
          <div className="flex gap-2">{["week","month","quarter","year"].map(p=><button key={p} onClick={()=>setPeriod(p)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${period===p?"bg-white text-pink-700":"bg-white/20 text-white hover:bg-white/30"}`}>{p}</button>)}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {kpis.map(k=>(
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2"><k.icon className="w-5 h-5 text-gray-400"/><span className={`text-sm font-medium ${k.trend==="up"?"text-green-600":"text-red-600"}`}>{k.change}</span></div>
            <div className="text-2xl font-bold text-gray-900">{k.val}</div>
            <div className="text-sm text-gray-500">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Rep Performance</h3>
          <table className="w-full"><thead><tr>{["Rep","Installs","Revenue","MRR Added","Close Rate","Avg Ticket"].map(h=><th key={h} className="text-left text-xs text-gray-500 uppercase pb-2">{h}</th>)}</tr></thead>
            <tbody>{repPerformance.map(r=>(
              <tr key={r.name} className="border-t border-gray-100"><td className="py-2 text-sm font-medium">{r.name}</td><td className="py-2 text-sm">{r.installs}</td><td className="py-2 text-sm font-semibold text-green-700">${r.revenue.toLocaleString()}</td><td className="py-2 text-sm">${r.mrr_added}</td><td className="py-2 text-sm">{r.close_rate}</td><td className="py-2 text-sm">${r.avg_ticket}</td></tr>
            ))}</tbody>
          </table>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">MRR by Plan</h3>
          <table className="w-full"><thead><tr>{["Plan","Accounts","Monthly MRR"].map(h=><th key={h} className="text-left text-xs text-gray-500 uppercase pb-2">{h}</th>)}</tr></thead>
            <tbody>{mrrByPlan.map(p=>(
              <tr key={p.plan} className="border-t border-gray-100"><td className="py-2 text-sm">{p.plan}</td><td className="py-2 text-sm">{p.accounts}</td><td className="py-2 text-sm font-semibold text-green-700">${p.mrr.toLocaleString()}</td></tr>
            ))}</tbody>
          </table>
          <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between font-bold"><span>Total</span><span className="text-green-700">${mrrByPlan.reduce((a,p)=>a+p.mrr,0).toLocaleString()}</span></div>
        </div>
      </div>
    </div>
  );
}
