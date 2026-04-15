"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { DollarSign, TrendingUp, Users, CheckCircle, AlertTriangle, Search, Plus, Package, ClipboardCheck, Sun, Wrench, BarChart3, Star, Calendar } from "lucide-react";

const customers = [
  { id: 1, name: "Garcia Residence", system: "9.6kW", installed: "2024-02-15", lastLogin: "2 hrs ago", portalActive: true, satisfaction: 9.2, referrals: 2 },
  { id: 2, name: "Williams Home", system: "7.2kW", installed: "2024-01-20", lastLogin: "1 day ago", portalActive: true, satisfaction: 8.8, referrals: 1 },
  { id: 3, name: "Johnson Family", system: "12.0kW", installed: "2024-03-10", lastLogin: "5 hrs ago", portalActive: true, satisfaction: 9.5, referrals: 3 },
  { id: 4, name: "Anderson Home", system: "6.0kW", installed: "2023-11-15", lastLogin: "Never", portalActive: false, satisfaction: 7.5, referrals: 0 },
  { id: 5, name: "Martinez Home", system: "8.4kW", installed: "2024-03-28", lastLogin: "3 hrs ago", portalActive: true, satisfaction: 9.0, referrals: 1 },
];
export default function SolarCustomerPortalPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8"><h1 className="text-3xl font-bold text-[#0B1F3A]">Customer Portal</h1><p className="text-gray-500 mt-1">Customer self-service solar portal management</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{l:"Active Users",v:customers.filter(c=>c.portalActive).length.toString(),icon:Users},{l:"Referrals Generated",v:customers.reduce((a,c)=>a+c.referrals,0).toString(),icon:TrendingUp},{l:"Avg Satisfaction",v:`${(customers.reduce((a,c)=>a+c.satisfaction,0)/customers.length).toFixed(1)}/10`,icon:Star},{l:"Support Tickets",v:"3",icon:AlertTriangle}].map((s,i) => <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-1"><s.icon size={16} className="text-[#F0A500]" /><span className="text-xs text-gray-500">{s.l}</span></div><div className="text-2xl font-bold text-[#0B1F3A]">{s.v}</div></div>)}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <table className="w-full text-sm"><thead><tr className="border-b">{["Customer","System","Installed","Portal","Last Login","Satisfaction","Referrals"].map(h=><th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead><tbody>{customers.map(c=>(
          <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50"><td className="py-3 px-3 font-medium">{c.name}</td><td className="py-3 px-3">{c.system}</td><td className="py-3 px-3 text-gray-500">{c.installed}</td><td className="py-3 px-3">{c.portalActive?<span className="text-green-600 font-medium">Active</span>:<span className="text-gray-400">Inactive</span>}</td><td className="py-3 px-3 text-gray-500">{c.lastLogin}</td><td className="py-3 px-3"><div className="flex items-center gap-1"><Star size={12} className="text-[#F0A500] fill-[#F0A500]" /><span className="font-medium">{c.satisfaction}</span></div></td><td className="py-3 px-3 font-semibold">{c.referrals}</td></tr>
        ))}</tbody></table>
      </div>
    </div>
  );
}
