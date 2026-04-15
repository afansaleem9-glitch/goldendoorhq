"use client";
import { useState } from "react";
import { BarChart3, TrendingUp, DollarSign, Users, Download, Calendar, Filter, PieChart, ArrowUp, ArrowDown } from "lucide-react";

const REPORT_CATEGORIES = [
  { name: "Sales Reports", icon: TrendingUp, color: "bg-green-100 text-green-700",
    reports: ["Lead Conversion Funnel","Sales by Rep","Revenue by Month","Win/Loss Analysis","Average Deal Size","Lead Source ROI","Quote-to-Close Ratio","Sales Cycle Length"] },
  { name: "Production Reports", icon: BarChart3, color: "bg-blue-100 text-blue-700",
    reports: ["Jobs by Stage","Crew Utilization","Average Job Duration","Material Waste Analysis","Quality Scores","Inspection Pass Rate","Weather Delay Impact","Subcontractor Performance"] },
  { name: "Financial Reports", icon: DollarSign, color: "bg-purple-100 text-purple-700",
    reports: ["Revenue vs Expenses","Profit Margin by Job","Accounts Receivable Aging","Cash Flow Forecast","Cost Per Square Trend","Material Cost Trends","Commission Payouts","Tax Summary"] },
  { name: "Customer Reports", icon: Users, color: "bg-orange-100 text-orange-700",
    reports: ["Customer Satisfaction","Referral Tracking","Review Generation","Warranty Claims","Portal Engagement","Communication Log","Repeat Business","Net Promoter Score"] }
];

const KPI_DATA = [
  { label: "Revenue MTD", value: "$284,500", change: "+12.3%", up: true },
  { label: "Jobs Completed", value: "18", change: "+3 vs last month", up: true },
  { label: "Avg Margin", value: "34.2%", change: "-1.1%", up: false },
  { label: "Lead Conversion", value: "28%", change: "+4.2%", up: true },
  { label: "Avg Job Size", value: "$15,800", change: "+$1,200", up: true },
  { label: "Customer Rating", value: "4.8/5", change: "+0.2", up: true }
];

const TOP_REPS = [
  { name: "James Bond", closed: 12, revenue: 189400, margin: 36.2, conversion: 42 },
  { name: "Sarah Mitchell", closed: 9, revenue: 142800, margin: 34.8, conversion: 38 },
  { name: "Carlos Rivera", closed: 8, revenue: 118600, margin: 33.1, conversion: 35 },
  { name: "Mike Thompson", closed: 6, revenue: 95200, margin: 31.5, conversion: 28 },
  { name: "Alex Rodriguez", closed: 5, revenue: 78400, margin: 35.0, conversion: 32 }
];

const MONTHLY = [
  { month: "Jan", revenue: 185000, jobs: 12, margin: 33 },
  { month: "Feb", revenue: 210000, jobs: 14, margin: 34 },
  { month: "Mar", revenue: 265000, jobs: 17, margin: 35 },
  { month: "Apr", revenue: 284500, jobs: 18, margin: 34 }
];

export default function ReportsPlusPage() {
  const [period, setPeriod] = useState("This Month");
  const [activeCategory, setActiveCategory] = useState<string|null>(null);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-[#0B1F3A] flex items-center gap-2"><BarChart3 className="text-[#F0A500]" size={28}/>ReportsPlus</h1><p className="text-gray-500 mt-1">Sales, production, financial & customer reports — custom dashboards & analytics</p></div>
        <div className="flex gap-2">
          <select value={period} onChange={e=>setPeriod(e.target.value)} className="border rounded-lg px-3 py-2 text-sm"><option>This Week</option><option>This Month</option><option>This Quarter</option><option>This Year</option><option>Custom Range</option></select>
          <button className="bg-[#F0A500] text-[#0B1F3A] px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-yellow-500"><Download size={18}/>Export All</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {KPI_DATA.map((kpi,i) => (
          <div key={i} className="bg-white rounded-xl border p-4">
            <p className="text-xs text-gray-500">{kpi.label}</p>
            <p className="text-2xl font-bold text-[#0B1F3A] mt-1">{kpi.value}</p>
            <p className={`text-xs mt-1 flex items-center gap-1 ${kpi.up?"text-green-600":"text-red-600"}`}>{kpi.up?<ArrowUp size={12}/>:<ArrowDown size={12}/>}{kpi.change}</p>
          </div>
        ))}
      </div>

      {/* Monthly Trend */}
      <div className="bg-white rounded-xl border p-4">
        <h3 className="font-bold text-[#0B1F3A] mb-3">Monthly Revenue Trend</h3>
        <div className="flex items-end gap-4 h-40">
          {MONTHLY.map(m => (
            <div key={m.month} className="flex-1 flex flex-col items-center">
              <p className="text-xs font-bold text-[#0B1F3A] mb-1">${(m.revenue/1000).toFixed(0)}K</p>
              <div className="w-full bg-gradient-to-t from-[#0B1F3A] to-[#F0A500] rounded-t-lg" style={{height:`${(m.revenue/300000)*100}%`}}/>
              <p className="text-xs text-gray-500 mt-1">{m.month}</p>
              <p className="text-[10px] text-gray-400">{m.jobs} jobs · {m.margin}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REPORT_CATEGORIES.map(cat => (
          <div key={cat.name} className="bg-white rounded-xl border p-4">
            <div className="flex items-center gap-2 mb-3 cursor-pointer" onClick={()=>setActiveCategory(activeCategory===cat.name?null:cat.name)}>
              <div className={`p-2 rounded-lg ${cat.color}`}><cat.icon size={18}/></div>
              <h3 className="font-bold text-[#0B1F3A]">{cat.name}</h3>
              <span className="text-xs text-gray-400 ml-auto">{cat.reports.length} reports</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {cat.reports.map(r => (
                <button key={r} className="text-left text-xs p-2 rounded-lg border hover:bg-gray-50 hover:border-[#F0A500] transition-colors">{r}</button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-xl border p-4">
        <h3 className="font-bold text-[#0B1F3A] mb-3 flex items-center gap-2"><Users size={16} className="text-[#F0A500]"/>Sales Rep Performance</h3>
        <table className="w-full text-sm"><thead><tr className="text-xs text-gray-500 border-b"><th className="text-left py-2">Rep</th><th className="text-right py-2">Closed</th><th className="text-right py-2">Revenue</th><th className="text-right py-2">Margin</th><th className="text-right py-2">Conversion</th><th className="py-2">Performance</th></tr></thead><tbody>
          {TOP_REPS.map((rep,i)=>(
            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="py-2 font-medium text-[#0B1F3A]"><span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold mr-2 ${i===0?"bg-yellow-400 text-yellow-900":i===1?"bg-gray-300 text-gray-700":i===2?"bg-orange-300 text-orange-800":"bg-gray-100 text-gray-500"}`}>{i+1}</span>{rep.name}</td>
              <td className="py-2 text-right font-bold">{rep.closed}</td>
              <td className="py-2 text-right font-bold text-green-600">${(rep.revenue/1000).toFixed(0)}K</td>
              <td className="py-2 text-right">{rep.margin}%</td>
              <td className="py-2 text-right">{rep.conversion}%</td>
              <td className="py-2"><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-[#F0A500] h-2 rounded-full" style={{width:`${(rep.revenue/200000)*100}%`}}/></div></td>
            </tr>
          ))}
        </tbody></table>
      </div>
    </div>
  );
}
