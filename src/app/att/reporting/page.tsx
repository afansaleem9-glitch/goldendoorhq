"use client";
import { useState } from "react";
import { Target, Shield, Users, BookOpen, BarChart3, DollarSign, CheckCircle, AlertTriangle, TrendingUp, Clock, Star, Search, Headphones, FileText } from "lucide-react";

const monthlyData = [{m:"Oct",rev:245000,orders:128},{m:"Nov",rev:268000,orders:142},{m:"Dec",rev:252000,orders:134},{m:"Jan",rev:278000,orders:148},{m:"Feb",rev:285000,orders:152},{m:"Mar",rev:289000,orders:156}];
const repPerformance = [
  { name: "Sarah Chen", orders: 38, revenue: 72400, arpu: 82.50, churn: 1.8 },
  { name: "Mike Torres", orders: 31, revenue: 58900, arpu: 78.20, churn: 2.4 },
  { name: "Lisa Park", orders: 29, revenue: 55100, arpu: 76.80, churn: 2.1 },
  { name: "James Reid", orders: 22, revenue: 41800, arpu: 71.50, churn: 3.8 },
  { name: "David Kim", orders: 18, revenue: 34200, arpu: 68.90, churn: 4.2 },
];
export default function ReportingPage() {
  const latest = monthlyData[monthlyData.length - 1];
  const maxRev = Math.max(...monthlyData.map(m=>m.rev));
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8"><h1 className="text-3xl font-bold text-[#0B1F3A]">Reporting</h1><p className="text-gray-500 mt-1">Sales, operations, and financial performance reports</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{l:"Monthly Revenue",v:`$${(latest.rev/1000).toFixed(0)}K`,icon:DollarSign},{l:"Orders",v:latest.orders.toString(),icon:FileText},{l:"ARPU",v:"$75.12",icon:TrendingUp},{l:"Churn",v:"3.2%",icon:AlertTriangle}].map((s,i)=><div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-1"><s.icon size={16} className="text-[#F0A500]"/><span className="text-xs text-gray-500">{s.l}</span></div><div className="text-2xl font-bold text-[#0B1F3A]">{s.v}</div></div>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"><h2 className="text-lg font-bold text-[#0B1F3A] mb-4">Revenue Trend</h2><div className="flex items-end gap-3 h-40">{monthlyData.map((m,i)=><div key={i} className="flex-1 flex flex-col items-center gap-1"><div className="w-full bg-gradient-to-t from-[#0B1F3A] to-[#F0A500] rounded-t" style={{height:`${(m.rev/maxRev)*100}%`}}/><span className="text-xs text-gray-500">{m.m}</span></div>)}</div></div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"><h2 className="text-lg font-bold text-[#0B1F3A] mb-4">Orders Trend</h2><div className="flex items-end gap-3 h-40">{monthlyData.map((m,i)=><div key={i} className="flex-1 flex flex-col items-center gap-1"><div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t" style={{height:`${(m.orders/160)*100}%`}}/><span className="text-xs text-gray-500">{m.m}</span></div>)}</div></div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"><h2 className="text-lg font-bold text-[#0B1F3A] mb-4">Rep Performance</h2><table className="w-full text-sm"><thead><tr className="border-b">{["Rep","Orders","Revenue","ARPU","Churn"].map(h=><th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead><tbody>{repPerformance.map((r,i)=><tr key={i} className="border-b border-gray-50 hover:bg-gray-50"><td className="py-3 px-3 font-medium">{r.name}</td><td className="py-3 px-3">{r.orders}</td><td className="py-3 px-3 font-semibold">${r.revenue.toLocaleString()}</td><td className="py-3 px-3">${r.arpu}</td><td className="py-3 px-3"><span className={`font-medium ${r.churn<3?"text-green-600":"text-red-600"}`}>{r.churn}%</span></td></tr>)}</tbody></table></div>
    </div>
  );
}
