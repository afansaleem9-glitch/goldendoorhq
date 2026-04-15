"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { DollarSign, TrendingUp, Users, Search, Zap, BarChart3, Clock, CheckCircle, AlertTriangle, Sun, Battery, Plug } from "lucide-react";

const utilities = [
  { name: "Oncor (TX)", rate: 0.128, netMetering: "Buy-All Sell-All", tou: false, avgBill: 165 },
  { name: "AEP Texas", rate: 0.115, netMetering: "1:1 Net Metering", tou: false, avgBill: 148 },
  { name: "CenterPoint (TX)", rate: 0.132, netMetering: "Buy-All Sell-All", tou: true, avgBill: 172 },
  { name: "AES Ohio", rate: 0.098, netMetering: "1:1 Net Metering", tou: true, avgBill: 125 },
  { name: "DTE Energy (MI)", rate: 0.184, netMetering: "Distributed Generation", tou: true, avgBill: 195 },
  { name: "Consumers Energy (MI)", rate: 0.178, netMetering: "Distributed Generation", tou: true, avgBill: 188 },
];
export default function UtilityRatesPage() {
  const [selected, setSelected] = useState(0);
  const [monthlyBill, setMonthlyBill] = useState(180);
  const u = utilities[selected];
  const solarOffset = Math.min(Math.round(monthlyBill * 0.92), monthlyBill);
  const newBill = monthlyBill - solarOffset;
  const savings25 = solarOffset * 12 * 25 * 1.03;
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8"><h1 className="text-3xl font-bold text-[#0B1F3A]">Utility Rates</h1><p className="text-gray-500 mt-1">Rate schedules, net metering policies, and savings calculator</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">Utility Companies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{utilities.map((ut,i)=>(
              <div key={i} onClick={()=>setSelected(i)} className={`p-4 rounded-lg border-2 cursor-pointer transition ${selected===i?"border-[#F0A500] bg-[#F0A500]/5":"border-gray-100 hover:border-gray-200"}`}>
                <div className="font-medium text-[#0B1F3A]">{ut.name}</div>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">{[{k:"Rate",v:`$${ut.rate}/kWh`},{k:"Avg Bill",v:`$${ut.avgBill}/mo`},{k:"Net Metering",v:ut.netMetering},{k:"TOU Rates",v:ut.tou?"Yes":"No"}].map((d,j)=><div key={j}><span className="text-gray-400">{d.k}: </span><span className="font-medium">{d.v}</span></div>)}</div>
              </div>
            ))}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">Historical Rate Increases</h2>
            <div className="flex items-end gap-2 h-32">{[3.2,4.1,2.8,5.2,3.9,4.5,6.1,3.8].map((r,i)=><div key={i} className="flex-1 flex flex-col items-center"><div className="w-full bg-gradient-to-t from-red-400 to-red-600 rounded-t" style={{height:`${r*15}px`}} /><span className="text-xs text-gray-400 mt-1">{2019+i}</span></div>)}</div>
            <p className="text-sm text-gray-500 mt-3">Average annual increase: <span className="font-bold text-red-600">4.2%</span></p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
          <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">Savings Calculator</h2>
          <div><label className="text-xs text-gray-500">Current Monthly Bill</label><input type="range" min={50} max={500} step={10} value={monthlyBill} onChange={e=>setMonthlyBill(+e.target.value)} className="w-full accent-[#F0A500]" /><div className="text-center font-bold text-lg text-[#0B1F3A]">${monthlyBill}/mo</div></div>
          <div className="mt-4 space-y-3 bg-green-50 rounded-lg p-4">{[{l:"Solar Offset",v:`-$${solarOffset}/mo`,c:"text-green-700"},{l:"New Monthly Bill",v:`$${newBill}/mo`,c:"text-[#0B1F3A]"},{l:"Annual Savings",v:`$${(solarOffset*12).toLocaleString()}`,c:"text-green-700"},{l:"25-Year Savings",v:`$${Math.round(savings25).toLocaleString()}`,c:"text-green-700 text-lg"}].map((d,i)=><div key={i} className="flex justify-between text-sm"><span className="text-gray-600">{d.l}</span><span className={`font-bold ${d.c}`}>{d.v}</span></div>)}</div>
        </div>
      </div>
    </div>
  );
}
