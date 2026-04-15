"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { FileText, DollarSign, Users, MapPin, CheckCircle, TrendingUp, Search, Plus, Signal, Wifi, Clock, AlertTriangle, BarChart3, Star } from "lucide-react";

const stages = ["Order Placed","Credit Check","Provisioning","Install Scheduled","Activated"];
const stageColors = ["bg-blue-500","bg-purple-500","bg-orange-500","bg-yellow-500","bg-green-500"];
const activations = [
  {id:1,customer:"Rodriguez Family",service:"Fiber 1000",status:4,scheduled:"2024-04-05",tech:"Tech #201"},
  {id:2,customer:"Chen Household",service:"Fiber 500",status:2,scheduled:"2024-04-15",tech:"TBD"},
  {id:3,customer:"Patel Residence",service:"Fiber 2000 + TV",status:4,scheduled:"2024-04-02",tech:"Tech #305"},
  {id:4,customer:"Kim Family",service:"Fiber 300",status:0,scheduled:"TBD",tech:"TBD"},
  {id:5,customer:"Wilson Family",service:"Fiber 5000",status:3,scheduled:"2024-04-16",tech:"Tech #412"},
  {id:6,customer:"Lee Home",service:"Fiber 1000 + TV",status:1,scheduled:"TBD",tech:"TBD"},
];
export default function ActivationsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8"><h1 className="text-3xl font-bold text-[#0B1F3A]">Activations</h1><p className="text-gray-500 mt-1">Service activation pipeline from order to live connection</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{l:"Activations Today",v:"8",icon:CheckCircle},{l:"Pending Installs",v:activations.filter(a=>a.status<4).length.toString(),icon:Clock},{l:"Avg Activation Time",v:"3.2 days",icon:TrendingUp},{l:"Success Rate",v:"94%",icon:BarChart3}].map((s,i)=><div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-1"><s.icon size={16} className="text-[#F0A500]"/><span className="text-xs text-gray-500">{s.l}</span></div><div className="text-2xl font-bold text-[#0B1F3A]">{s.v}</div></div>)}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6"><div className="flex items-center gap-1">{stages.map((s,i)=>{const count=activations.filter(a=>a.status===i).length;return<div key={i} className="flex-1 text-center py-3"><div className={`w-8 h-8 rounded-full ${stageColors[i]} text-white text-sm font-bold flex items-center justify-center mx-auto mb-1`}>{count}</div><div className="text-xs text-gray-600">{s}</div></div>})}</div></div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"><table className="w-full text-sm"><thead><tr className="border-b">{["Customer","Service","Stage","Scheduled","Technician"].map(h=><th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead><tbody>{activations.map(a=><tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50"><td className="py-3 px-3 font-medium">{a.customer}</td><td className="py-3 px-3">{a.service}</td><td className="py-3 px-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${stageColors[a.status]}`}>{stages[a.status]}</span></td><td className="py-3 px-3 text-gray-500">{a.scheduled}</td><td className="py-3 px-3 text-gray-500">{a.tech}</td></tr>)}</tbody></table></div>
    </div>
  );
}
