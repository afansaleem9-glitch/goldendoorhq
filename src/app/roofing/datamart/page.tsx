"use client";
import { useState } from "react";
import { Database, Search, Download, Play, Code, Table, BarChart3, Filter, Plus, Clock, Save, FileText } from "lucide-react";

interface SavedQuery {
  id: string; name: string; description: string; sql: string; last_run: string; rows: number; category: string;
}

const DATASETS = [
  { name: "roofing_jobs", records: 1247, columns: 52, desc: "All roofing job records with customer, financial, and production data" },
  { name: "roofing_estimates", records: 3891, columns: 28, desc: "Estimates with line items, margins, and conversion tracking" },
  { name: "roofing_materials", records: 8432, columns: 18, desc: "Material orders, deliveries, and supplier pricing history" },
  { name: "roofing_crews", records: 48, columns: 22, desc: "Crew profiles, certifications, performance metrics" },
  { name: "roofing_photos", records: 24519, columns: 14, desc: "Job photos with GPS, timestamps, categories, and tags" },
  { name: "roofing_payments", records: 2156, columns: 20, desc: "Payment transactions, financing apps, and AR tracking" },
  { name: "roofing_weather_alerts", records: 891, columns: 16, desc: "Storm events, hail reports, and affected property mapping" },
  { name: "roofing_insurance_claims", records: 1834, columns: 34, desc: "Insurance claims with supplement tracking and Xactimate data" },
  { name: "roofing_leads", records: 15672, columns: 24, desc: "Lead sources, qualification scores, and conversion data" },
  { name: "roofing_commissions", records: 3421, columns: 16, desc: "Sales rep commission calculations and payout history" }
];

const SAVED_QUERIES: SavedQuery[] = [
  { id:"1",name:"Revenue by Shingle Brand",description:"Total revenue grouped by shingle manufacturer with margin analysis",sql:"SELECT shingle_brand, COUNT(*) as jobs, SUM(revenue) as total_revenue, AVG(profit_margin) as avg_margin FROM roofing_jobs WHERE status = 'complete' GROUP BY shingle_brand ORDER BY total_revenue DESC",last_run:"2 hours ago",rows:5,category:"Financial" },
  { id:"2",name:"Crew Efficiency Report",description:"Average job duration and quality score by crew",sql:"SELECT crew_name, COUNT(*) as jobs_completed, AVG(duration_days) as avg_days, AVG(quality_score) as avg_quality, SUM(revenue) as total_revenue FROM roofing_jobs j JOIN roofing_crews c ON j.crew_id = c.id WHERE j.status = 'complete' GROUP BY crew_name",last_run:"Yesterday",rows:8,category:"Production" },
  { id:"3",name:"Insurance Claim Conversion",description:"Claim-to-job conversion rate by insurance company",sql:"SELECT insurance_company, COUNT(*) as total_claims, SUM(CASE WHEN job_status = 'complete' THEN 1 ELSE 0 END) as converted, AVG(supplement_amount) as avg_supplement FROM roofing_insurance_claims GROUP BY insurance_company ORDER BY total_claims DESC",last_run:"3 days ago",rows:12,category:"Insurance" },
  { id:"4",name:"Lead Source ROI",description:"Revenue and conversion by lead source with cost per acquisition",sql:"SELECT lead_source, COUNT(*) as leads, SUM(CASE WHEN converted THEN 1 ELSE 0 END) as won, SUM(revenue) as total_revenue, SUM(marketing_cost) as cost, SUM(revenue)/NULLIF(SUM(marketing_cost),0) as roi FROM roofing_leads l LEFT JOIN roofing_jobs j ON l.id = j.lead_id GROUP BY lead_source",last_run:"1 day ago",rows:9,category:"Sales" },
  { id:"5",name:"Material Cost Trends",description:"Monthly material cost per square with supplier comparison",sql:"SELECT DATE_TRUNC('month', order_date) as month, supplier, AVG(cost_per_square) as avg_cost, SUM(total_amount) as total_spend FROM roofing_materials GROUP BY month, supplier ORDER BY month DESC, supplier",last_run:"5 hours ago",rows:36,category:"Financial" },
  { id:"6",name:"Weather Impact Analysis",description:"Storm events correlated with lead volume and revenue spikes",sql:"SELECT w.event_date, w.severity, w.hail_size, COUNT(l.id) as leads_generated, SUM(j.revenue) as storm_revenue FROM roofing_weather_alerts w LEFT JOIN roofing_leads l ON l.created_at BETWEEN w.event_date AND w.event_date + interval '30 days' LEFT JOIN roofing_jobs j ON j.lead_id = l.id GROUP BY w.event_date, w.severity, w.hail_size ORDER BY w.event_date DESC",last_run:"1 week ago",rows:24,category:"Analytics" }
];

export default function DataMartPage() {
  const [tab, setTab] = useState<"explorer"|"queries"|"datasets">("explorer");
  const [query, setQuery] = useState("SELECT * FROM roofing_jobs WHERE status = 'complete' ORDER BY revenue DESC LIMIT 10");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");

  const categories = ["All", ...new Set(SAVED_QUERIES.map(q => q.category))];
  const filteredQueries = SAVED_QUERIES.filter(q => (catFilter === "All" || q.category === catFilter) && (q.name.toLowerCase().includes(search.toLowerCase())));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-[#0B1F3A] flex items-center gap-2"><Database className="text-[#F0A500]" size={28}/>DataMart</h1><p className="text-gray-500 mt-1">Advanced data access, custom queries & business intelligence</p></div>
        <div className="flex gap-2"><button className="bg-[#F0A500] text-[#0B1F3A] px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-yellow-500"><Plus size={18}/>New Query</button></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[{l:"Datasets",v:DATASETS.length,c:"text-blue-600"},{l:"Total Records",v:`${(DATASETS.reduce((s,d)=>s+d.records,0)/1000).toFixed(0)}K+`,c:"text-green-600"},{l:"Saved Queries",v:SAVED_QUERIES.length,c:"text-purple-600"},{l:"Columns Available",v:DATASETS.reduce((s,d)=>s+d.columns,0),c:"text-orange-600"}].map((s,i)=>(
          <div key={i} className="bg-white rounded-xl border p-4 text-center"><p className={`text-2xl font-bold ${s.c}`}>{s.v}</p><p className="text-xs text-gray-500 mt-1">{s.l}</p></div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["explorer","queries","datasets"] as const).map(t=><button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab===t?"bg-[#0B1F3A] text-white":"bg-gray-100 text-gray-600"}`}>{t==="explorer"?"SQL Explorer":t==="queries"?"Saved Queries":"Datasets"}</button>)}
      </div>

      {tab === "explorer" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="flex items-center justify-between p-3 bg-gray-900 text-white"><span className="text-xs flex items-center gap-2"><Code size={14}/>SQL Query Editor</span><div className="flex gap-2"><button className="px-3 py-1 bg-green-600 rounded text-xs flex items-center gap-1 hover:bg-green-700"><Play size={12}/>Run Query</button><button className="px-3 py-1 bg-gray-700 rounded text-xs flex items-center gap-1 hover:bg-gray-600"><Save size={12}/>Save</button></div></div>
            <textarea value={query} onChange={e=>setQuery(e.target.value)} className="w-full p-4 font-mono text-sm bg-gray-950 text-green-400 h-32 resize-y focus:outline-none" spellCheck={false}/>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <div className="flex items-center justify-between mb-3"><span className="text-xs text-gray-500 flex items-center gap-1"><Table size={12}/>Results — 10 rows returned in 0.042s</span><button className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800"><Download size={12}/>Export CSV</button></div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs"><thead><tr className="bg-gray-50 text-gray-600">{["job_number","customer","revenue","profit_margin","status","roof_squares","shingle_brand","completion_date"].map(h=><th key={h} className="text-left p-2 font-medium">{h}</th>)}</tr></thead><tbody>
                {[["RJ-2024-091","Brown Corp","$67,800","32.7%","complete","82","Carlisle TPO","2024-04-10"],["RJ-2024-090","Johnson Family","$24,500","34.5%","in_progress","35","GAF UHDZ","—"],["RJ-2024-088","Thompson","$21,300","34.3%","complete","30","GAF HDZ","2024-03-20"],["RJ-2024-089","Williams","$18,750","34.0%","complete","28","GAF HDZ","2024-04-18"],["RJ-2024-085","Garcia","$15,600","37.5%","complete","22","OC Duration","2024-03-22"]].map((row,i)=>(
                  <tr key={i} className="border-t hover:bg-gray-50">{row.map((cell,j)=><td key={j} className={`p-2 ${j===2?"font-bold text-green-600":""}`}>{cell}</td>)}</tr>
                ))}
              </tbody></table>
            </div>
          </div>
        </div>
      )}

      {tab === "queries" && (
        <div className="space-y-3">
          <div className="flex gap-3 items-center">
            <div className="relative flex-1 max-w-xs"><Search className="absolute left-3 top-2.5 text-gray-400" size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search queries..." className="pl-9 pr-3 py-2 border rounded-lg w-full text-sm"/></div>
            {categories.map(c=><button key={c} onClick={()=>setCatFilter(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium ${catFilter===c?"bg-[#0B1F3A] text-white":"bg-gray-100 text-gray-600"}`}>{c}</button>)}
          </div>
          {filteredQueries.map(q=>(
            <div key={q.id} className="bg-white rounded-xl border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div><h3 className="font-semibold text-[#0B1F3A]">{q.name}</h3><p className="text-xs text-gray-500">{q.description}</p></div>
                <div className="flex gap-2"><span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px]">{q.category}</span><button className="px-3 py-1 bg-green-600 text-white rounded text-xs flex items-center gap-1 hover:bg-green-700"><Play size={10}/>Run</button></div>
              </div>
              <pre className="bg-gray-950 text-green-400 p-3 rounded-lg text-xs font-mono overflow-x-auto">{q.sql}</pre>
              <div className="flex gap-4 mt-2 text-[10px] text-gray-400"><span className="flex items-center gap-1"><Clock size={10}/>{q.last_run}</span><span className="flex items-center gap-1"><Table size={10}/>{q.rows} rows</span></div>
            </div>
          ))}
        </div>
      )}

      {tab === "datasets" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DATASETS.map(d=>(
            <div key={d.name} className="bg-white rounded-xl border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-1"><Database size={14} className="text-[#F0A500]"/><h3 className="font-mono font-bold text-sm text-[#0B1F3A]">{d.name}</h3></div>
              <p className="text-xs text-gray-500 mb-2">{d.desc}</p>
              <div className="flex gap-4 text-xs"><span className="text-blue-600 font-medium">{d.records.toLocaleString()} records</span><span className="text-purple-600">{d.columns} columns</span></div>
              <button className="mt-2 text-xs text-blue-600 flex items-center gap-1 hover:text-blue-800"><FileText size={10}/>View Schema</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
