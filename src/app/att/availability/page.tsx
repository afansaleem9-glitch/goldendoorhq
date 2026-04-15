"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { FileText, DollarSign, Users, MapPin, CheckCircle, TrendingUp, Search, Plus, Signal, Wifi, Clock, AlertTriangle, BarChart3, Star } from "lucide-react";

const tiers = [
  { tech: "Fiber", speeds: ["300 Mbps - $55/mo", "500 Mbps - $65/mo", "1 Gbps - $80/mo", "2 Gbps - $110/mo", "5 Gbps - $180/mo"] },
  { tech: "DSL", speeds: ["25 Mbps - $45/mo", "50 Mbps - $55/mo", "100 Mbps - $65/mo"] },
  { tech: "Fixed Wireless", speeds: ["25 Mbps - $50/mo", "50 Mbps - $60/mo"] },
];
export default function AvailabilityPage() {
  const [address, setAddress] = useState("");
  const [checked, setChecked] = useState(false);
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8"><h1 className="text-3xl font-bold text-[#0B1F3A]">Service Availability</h1><p className="text-gray-500 mt-1">Check AT&T service availability by address</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{l:"Fiber Coverage",v:"42%",icon:Wifi},{l:"DSL Coverage",v:"78%",icon:Signal},{l:"Fixed Wireless",v:"35%",icon:Signal},{l:"Total Addresses",v:"353K",icon:MapPin}].map((s,i)=><div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-1"><s.icon size={16} className="text-[#F0A500]"/><span className="text-xs text-gray-500">{s.l}</span></div><div className="text-2xl font-bold text-[#0B1F3A]">{s.v}</div></div>)}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">Address Lookup</h2>
        <div className="flex gap-3"><input value={address} onChange={e=>setAddress(e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm" placeholder="Enter street address, city, state, zip..."/><button onClick={()=>setChecked(true)} className="bg-[#F0A500] text-[#0B1F3A] font-semibold px-6 py-3 rounded-lg">Check Availability</button></div>
        {checked && <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200"><div className="flex items-center gap-2 text-green-700 font-medium"><CheckCircle size={18}/>AT&T Fiber is available at this address!</div><div className="mt-2 flex gap-2">{["Fiber","TV","Phone"].map((s,i)=><span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{s} Available</span>)}</div></div>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((t,i) => <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"><h3 className="text-lg font-bold text-[#0B1F3A] mb-3 flex items-center gap-2"><Wifi size={18} className="text-[#F0A500]"/>{t.tech}</h3><div className="space-y-2">{t.speeds.map((s,j)=><div key={j} className="p-2 rounded-lg bg-gray-50 text-sm font-medium">{s}</div>)}</div></div>)}
      </div>
    </div>
  );
}
