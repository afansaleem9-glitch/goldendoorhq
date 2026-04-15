"use client";
import { useState } from "react";
import { DollarSign, Users, TrendingUp, Calendar, Download, CheckCircle, Clock, AlertTriangle, Search, Filter, Award } from "lucide-react";

interface CommissionRecord {
  id: string; rep: string; job: string; customer: string; close_date: string; revenue: number;
  commission_rate: number; commission_amount: number; bonus: number; total_payout: number;
  status: string; paid_date: string | null;
}

const REPS = [
  { name: "James Bond", tier: "Elite", rate: 12, mtd_revenue: 189400, mtd_commission: 22728, jobs: 12, avg_margin: 36.2 },
  { name: "Sarah Mitchell", tier: "Senior", rate: 10, mtd_revenue: 142800, mtd_commission: 14280, jobs: 9, avg_margin: 34.8 },
  { name: "Carlos Rivera", tier: "Senior", rate: 10, mtd_revenue: 118600, mtd_commission: 11860, jobs: 8, avg_margin: 33.1 },
  { name: "Mike Thompson", tier: "Standard", rate: 8, mtd_revenue: 95200, mtd_commission: 7616, jobs: 6, avg_margin: 31.5 },
  { name: "Alex Rodriguez", tier: "Standard", rate: 8, mtd_revenue: 78400, mtd_commission: 6272, jobs: 5, avg_margin: 35.0 }
];

const RECORDS: CommissionRecord[] = [
  { id:"1",rep:"James Bond",job:"RJ-2024-091",customer:"Brown Corp",close_date:"2024-03-18",revenue:67800,commission_rate:12,commission_amount:8136,bonus:2000,total_payout:10136,status:"paid",paid_date:"2024-04-01" },
  { id:"2",rep:"James Bond",job:"RJ-2024-089",customer:"Williams Home",close_date:"2024-03-15",revenue:18750,commission_rate:12,commission_amount:2250,bonus:0,total_payout:2250,status:"paid",paid_date:"2024-04-01" },
  { id:"3",rep:"Sarah Mitchell",job:"RJ-2024-090",customer:"Johnson Family",close_date:"2024-03-20",revenue:24500,commission_rate:10,commission_amount:2450,bonus:500,total_payout:2950,status:"pending",paid_date:null },
  { id:"4",rep:"James Bond",job:"RJ-2024-088",customer:"Thompson Residence",close_date:"2024-03-10",revenue:21300,commission_rate:12,commission_amount:2556,bonus:0,total_payout:2556,status:"paid",paid_date:"2024-04-01" },
  { id:"5",rep:"Carlos Rivera",job:"RJ-2024-085",customer:"Garcia Residence",close_date:"2024-03-08",revenue:15600,commission_rate:10,commission_amount:1560,bonus:0,total_payout:1560,status:"paid",paid_date:"2024-04-01" },
  { id:"6",rep:"Mike Thompson",job:"RJ-2024-082",customer:"Davis Home",close_date:"2024-03-05",revenue:12400,commission_rate:8,commission_amount:992,bonus:0,total_payout:992,status:"paid",paid_date:"2024-04-01" },
  { id:"7",rep:"Sarah Mitchell",job:"RJ-2024-095",customer:"Anderson Property",close_date:"2024-03-25",revenue:24500,commission_rate:10,commission_amount:2450,bonus:0,total_payout:2450,status:"pending",paid_date:null },
  { id:"8",rep:"Alex Rodriguez",job:"RJ-2024-096",customer:"Martinez Family",close_date:"2024-03-22",revenue:19800,commission_rate:8,commission_amount:1584,bonus:0,total_payout:1584,status:"approved",paid_date:null }
];

const TIERS = [
  { tier: "Elite", min_revenue: 150000, rate: "12%", bonuses: "$2K bonus on deals >$50K, $500 per 5-star review" },
  { tier: "Senior", min_revenue: 100000, rate: "10%", bonuses: "$500 bonus on deals >$25K, $250 per 5-star review" },
  { tier: "Standard", min_revenue: 0, rate: "8%", bonuses: "No bonuses until Senior tier" }
];

export default function CommissionsPage() {
  const [tab, setTab] = useState<"overview"|"records"|"tiers">("overview");
  const [search, setSearch] = useState("");
  const [repFilter, setRepFilter] = useState("All");

  const totalCommissions = RECORDS.reduce((s, r) => s + r.total_payout, 0);
  const totalPaid = RECORDS.filter(r => r.status === "paid").reduce((s, r) => s + r.total_payout, 0);
  const totalPending = RECORDS.filter(r => r.status !== "paid").reduce((s, r) => s + r.total_payout, 0);
  const filteredRecords = RECORDS.filter(r => (repFilter === "All" || r.rep === repFilter) && (r.customer.toLowerCase().includes(search.toLowerCase()) || r.rep.toLowerCase().includes(search.toLowerCase())));

  const statusStyle = (s: string) => s === "paid" ? "bg-green-100 text-green-700" : s === "approved" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700";

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-[#0B1F3A] flex items-center gap-2"><Award className="text-[#F0A500]" size={28}/>Commission Tracker</h1><p className="text-gray-500 mt-1">Sales rep commissions, tier management & payout approvals</p></div>
        <button className="bg-[#F0A500] text-[#0B1F3A] px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-yellow-500"><Download size={18}/>Export Payroll</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[{l:"Total Commissions",v:`$${(totalCommissions/1000).toFixed(1)}K`,c:"text-green-600"},{l:"Paid Out",v:`$${(totalPaid/1000).toFixed(1)}K`,c:"text-blue-600"},{l:"Pending",v:`$${(totalPending/1000).toFixed(1)}K`,c:"text-yellow-600"},{l:"Active Reps",v:REPS.length,c:"text-purple-600"}].map((s,i)=>(
          <div key={i} className="bg-white rounded-xl border p-4 text-center"><p className={`text-2xl font-bold ${s.c}`}>{s.v}</p><p className="text-xs text-gray-500 mt-1">{s.l}</p></div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["overview","records","tiers"] as const).map(t=><button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab===t?"bg-[#0B1F3A] text-white":"bg-gray-100 text-gray-600"}`}>{t==="overview"?"Rep Overview":t==="records"?"Commission Records":"Tier Structure"}</button>)}
      </div>

      {tab === "overview" && (
        <div className="space-y-3">
          {REPS.map((rep,i) => (
            <div key={rep.name} className="bg-white rounded-xl border p-4 flex items-center gap-4">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i===0?"bg-yellow-400 text-yellow-900":i===1?"bg-gray-300 text-gray-700":"bg-gray-100 text-gray-500"}`}>{i+1}</span>
              <div className="flex-1"><h3 className="font-semibold text-[#0B1F3A]">{rep.name}</h3><p className="text-xs text-gray-500">{rep.tier} Tier · {rep.rate}% base rate</p></div>
              <div className="text-center"><p className="font-bold text-green-600">${(rep.mtd_revenue/1000).toFixed(0)}K</p><p className="text-[10px] text-gray-500">Revenue</p></div>
              <div className="text-center"><p className="font-bold text-blue-600">${(rep.mtd_commission/1000).toFixed(1)}K</p><p className="text-[10px] text-gray-500">Commission</p></div>
              <div className="text-center"><p className="font-bold text-purple-600">{rep.jobs}</p><p className="text-[10px] text-gray-500">Jobs</p></div>
              <div className="text-center"><p className="font-bold text-cyan-600">{rep.avg_margin}%</p><p className="text-[10px] text-gray-500">Avg Margin</p></div>
              <div className="w-24"><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-[#F0A500] h-2 rounded-full" style={{width:`${Math.min((rep.mtd_revenue/200000)*100,100)}%`}}/></div><p className="text-[9px] text-gray-400 mt-0.5 text-center">{Math.round((rep.mtd_revenue/200000)*100)}% of target</p></div>
            </div>
          ))}
        </div>
      )}

      {tab === "records" && (
        <div>
          <div className="flex gap-3 items-center mb-4">
            <div className="relative flex-1 max-w-xs"><Search className="absolute left-3 top-2.5 text-gray-400" size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." className="pl-9 pr-3 py-2 border rounded-lg w-full text-sm"/></div>
            {["All",...REPS.map(r=>r.name)].map(r=><button key={r} onClick={()=>setRepFilter(r)} className={`px-3 py-1.5 rounded-full text-xs font-medium ${repFilter===r?"bg-[#0B1F3A] text-white":"bg-gray-100 text-gray-600"}`}>{r.split(" ")[0]}</button>)}
          </div>
          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full text-sm"><thead><tr className="bg-gray-50 text-xs text-gray-600"><th className="text-left p-3">Rep</th><th className="text-left p-3">Job</th><th className="text-left p-3">Customer</th><th className="text-right p-3">Revenue</th><th className="text-right p-3">Rate</th><th className="text-right p-3">Commission</th><th className="text-right p-3">Bonus</th><th className="text-right p-3">Total</th><th className="text-center p-3">Status</th></tr></thead><tbody>
              {filteredRecords.map(r=>(
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{r.rep}</td><td className="p-3 font-mono text-xs text-gray-400">{r.job}</td><td className="p-3">{r.customer}</td>
                  <td className="p-3 text-right">${r.revenue.toLocaleString()}</td><td className="p-3 text-right">{r.commission_rate}%</td>
                  <td className="p-3 text-right font-mono">${r.commission_amount.toLocaleString()}</td>
                  <td className="p-3 text-right font-mono text-green-600">{r.bonus>0?`+$${r.bonus}`:"-"}</td>
                  <td className="p-3 text-right font-bold">${r.total_payout.toLocaleString()}</td>
                  <td className="p-3 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusStyle(r.status)}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody></table>
          </div>
        </div>
      )}

      {tab === "tiers" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TIERS.map(t=>(
            <div key={t.tier} className={`rounded-xl border-2 p-6 ${t.tier==="Elite"?"border-yellow-400 bg-yellow-50":t.tier==="Senior"?"border-blue-400 bg-blue-50":"border-gray-300 bg-gray-50"}`}>
              <h3 className="text-xl font-bold text-[#0B1F3A]">{t.tier}</h3>
              <p className="text-4xl font-bold text-[#F0A500] my-3">{t.rate}</p>
              <p className="text-sm text-gray-600">Commission Rate</p>
              <div className="border-t my-3 pt-3"><p className="text-xs text-gray-500">Minimum Monthly Revenue</p><p className="font-bold text-[#0B1F3A]">${t.min_revenue.toLocaleString()}{t.min_revenue===0?" (Entry)":""}</p></div>
              <div className="border-t pt-3"><p className="text-xs text-gray-500">Bonuses</p><p className="text-sm text-gray-700 mt-1">{t.bonuses}</p></div>
              <p className="text-xs text-gray-400 mt-3">{REPS.filter(r=>r.tier===t.tier).length} reps at this tier</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
