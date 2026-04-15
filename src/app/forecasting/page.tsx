"use client";
import { useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle, ChevronDown, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart, Cell } from "recharts";

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const monthlyData = months.map((m,i)=>({
  month: m,
  actual: i < 4 ? [820000,940000,1100000,980000][i] : 0,
  forecast: [800000,900000,1050000,950000,1020000,1150000,1250000,1180000,1300000,1400000,1350000,1500000][i],
  best: [850000,960000,1120000,1010000,1100000,1280000,1400000,1330000,1480000,1600000,1520000,1700000][i],
  worst: [720000,810000,930000,850000,890000,980000,1050000,1000000,1100000,1180000,1130000,1280000][i],
}));

interface DealForecast { id:number; name:string; amount:number; probability:number; weighted:number; stage:string; rep:string; closeDate:string; vertical:string; risk:"low"|"medium"|"high"; }
const deals: DealForecast[] = [
  {id:1,name:"Martinez Solar 12kW",amount:42000,probability:90,weighted:37800,stage:"Contract Sent",rep:"Marcus Johnson",closeDate:"Apr 18",vertical:"Solar",risk:"low"},
  {id:2,name:"Thompson Smart Home",amount:8500,probability:75,weighted:6375,stage:"Proposal",rep:"Sarah Chen",closeDate:"Apr 22",vertical:"Smart Home",risk:"low"},
  {id:3,name:"Williams Roof Replace",amount:18500,probability:60,weighted:11100,stage:"Site Survey Done",rep:"David Kim",closeDate:"Apr 28",vertical:"Roofing",risk:"medium"},
  {id:4,name:"Garcia Solar + AT&T",amount:52000,probability:80,weighted:41600,stage:"Design Approved",rep:"Marcus Johnson",closeDate:"Apr 20",vertical:"Solar",risk:"low"},
  {id:5,name:"Anderson Solar 8kW",amount:28000,probability:40,weighted:11200,stage:"Qualified",rep:"Lisa Park",closeDate:"May 5",vertical:"Solar",risk:"high"},
  {id:6,name:"Brown ADC Security",amount:6200,probability:85,weighted:5270,stage:"Contract Sent",rep:"Sarah Chen",closeDate:"Apr 16",vertical:"Smart Home",risk:"low"},
  {id:7,name:"Davis Roof Repair",amount:9800,probability:50,weighted:4900,stage:"Estimate",rep:"David Kim",closeDate:"May 10",vertical:"Roofing",risk:"medium"},
  {id:8,name:"Wilson AT&T Fiber",amount:3600,probability:70,weighted:2520,stage:"Proposal",rep:"Lisa Park",closeDate:"Apr 25",vertical:"AT&T",risk:"medium"},
  {id:9,name:"Taylor Solar 15kW",amount:55000,probability:30,weighted:16500,stage:"Discovery",rep:"Marcus Johnson",closeDate:"May 15",vertical:"Solar",risk:"high"},
  {id:10,name:"Lee Solar + Security Bundle",amount:48000,probability:65,weighted:31200,stage:"Design Review",rep:"Sarah Chen",closeDate:"May 1",vertical:"Solar",risk:"medium"},
];

const fmt = (n:number)=> n>=1000000?`$${(n/1000000).toFixed(1)}M`:n>=1000?`$${(n/1000).toFixed(0)}K`:`$${n}`;

export default function ForecastingPage() {
  const [period, setPeriod] = useState("Q2 2026");
  const [view, setView] = useState<"chart"|"deals">("chart");

  const commit = deals.filter(d=>d.probability>=70).reduce((a,b)=>a+b.weighted,0);
  const bestCase = deals.reduce((a,b)=>a+b.weighted,0);
  const pipeline = deals.reduce((a,b)=>a+b.amount,0);
  const quota = 1200000;
  const gap = quota - commit;

  const verticalBreakdown = ["Solar","Smart Home","Roofing","AT&T"].map(v=>({
    vertical: v,
    pipeline: deals.filter(d=>d.vertical===v).reduce((a,b)=>a+b.amount,0),
    weighted: deals.filter(d=>d.vertical===v).reduce((a,b)=>a+b.weighted,0),
    count: deals.filter(d=>d.vertical===v).length,
  }));

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Revenue Forecasting</h1>
          <p className="text-sm text-gray-500 mt-1">Weighted pipeline, commit vs. best case, gap-to-quota</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={()=>setView(view==="chart"?"deals":"chart")} className="px-3 py-1.5 text-xs font-medium bg-gray-100 rounded-lg hover:bg-gray-200">{view==="chart"?"Show Deals":"Show Chart"}</button>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-3 py-1.5 text-xs font-medium"><Calendar size={13}/>{period}<ChevronDown size={13}/></div>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {[
          {l:"Quota",v:fmt(quota),icon:Target,color:"text-black"},
          {l:"Commit (≥70%)",v:fmt(commit),icon:TrendingUp,color:commit>=quota?"text-green-600":"text-amber-600"},
          {l:"Best Case (Weighted)",v:fmt(bestCase),icon:DollarSign,color:"text-black"},
          {l:"Total Pipeline",v:fmt(pipeline),icon:BarChart,color:"text-black"},
          {l:"Gap to Quota",v:gap>0?fmt(gap):"On Track",icon:gap>0?AlertTriangle:TrendingUp,color:gap>0?"text-red-600":"text-green-600"},
        ].map(k=>{const I=k.icon;return(
          <div key={k.l} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2"><p className="text-xs text-gray-500 uppercase tracking-wide">{k.l}</p><I size={16} className={k.color}/></div>
            <p className={`text-2xl font-bold ${k.color}`}>{k.v}</p>
          </div>
        )})}
      </div>

      {view === "chart" ? (
        <div className="space-y-6">
          {/* Revenue Forecast Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-black mb-4">2026 Revenue Forecast — Actual vs. Projected</h2>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                <XAxis dataKey="month" tick={{fontSize:11}} stroke="#9CA3AF"/>
                <YAxis tickFormatter={(v)=>fmt(v)} tick={{fontSize:11}} stroke="#9CA3AF"/>
                <Tooltip formatter={(v)=>[fmt(Number(v))]} contentStyle={{fontSize:12,borderRadius:8}}/>
                <Area type="monotone" dataKey="best" fill="#e5e7eb" stroke="transparent" name="Best Case"/>
                <Area type="monotone" dataKey="worst" fill="#f3f4f6" stroke="transparent" name="Worst Case"/>
                <Line type="monotone" dataKey="forecast" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Forecast"/>
                <Line type="monotone" dataKey="actual" stroke="#000" strokeWidth={3} dot={{fill:"#000",r:4}} name="Actual"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Vertical Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-black mb-4">Forecast by Vertical</h2>
            <div className="grid grid-cols-4 gap-4">
              {verticalBreakdown.map(v=>(
                <div key={v.vertical} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2">{v.vertical}</p>
                  <p className="text-xl font-bold text-black">{fmt(v.weighted)}</p>
                  <p className="text-[11px] text-gray-500 mt-1">{v.count} deals · {fmt(v.pipeline)} pipeline</p>
                  <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-black rounded-full" style={{width:`${Math.min((v.weighted/(quota/4))*100,100)}%`}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Deal-level forecast table */
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>{["Deal","Amount","Probability","Weighted","Stage","Rep","Close Date","Risk"].map(h=><th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
            </thead>
            <tbody>
              {deals.sort((a,b)=>b.weighted-a.weighted).map(d=>(
                <tr key={d.id} className="border-b border-gray-200/60 hover:bg-gray-50">
                  <td className="px-4 py-3"><p className="font-medium text-black text-sm">{d.name}</p><p className="text-[11px] text-gray-500">{d.vertical}</p></td>
                  <td className="px-4 py-3 font-semibold">{fmt(d.amount)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-black rounded-full" style={{width:`${d.probability}%`}}/></div>
                      <span className="text-xs">{d.probability}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-black">{fmt(d.weighted)}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{d.stage}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{d.rep}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{d.closeDate}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${d.risk==="low"?"bg-green-100 text-green-700":d.risk==="medium"?"bg-amber-100 text-amber-700":"bg-red-100 text-red-700"}`}>{d.risk}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
