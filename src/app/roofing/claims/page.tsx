"use client";
import { useState } from "react";
import { Shield, Plus, Search, DollarSign, FileText, Clock, CheckCircle, AlertTriangle, ChevronDown, ChevronRight, Upload } from "lucide-react";

interface Claim {
  id: string; claim_number: string; customer: string; address: string; insurance_company: string;
  adjuster: string; adjuster_phone: string; status: string; damage_type: string;
  initial_estimate: number; supplement_amount: number; approved_amount: number;
  deductible: number; date_of_loss: string; filed_date: string;
  milestones: { name: string; done: boolean; date: string }[];
}

const MOCK: Claim[] = [
  { id:"1",claim_number:"CLM-2024-045",customer:"Johnson Family",address:"4521 Oak Ave, Dallas TX",insurance_company:"State Farm",adjuster:"Tom Richards",adjuster_phone:"(214) 555-9001",status:"supplement_pending",damage_type:"Hail + Wind",initial_estimate:14200,supplement_amount:4800,approved_amount:14200,deductible:1000,date_of_loss:"2024-02-15",filed_date:"2024-02-20",
    milestones:[{name:"Initial Inspection",done:true,date:"2024-02-18"},{name:"Claim Filed",done:true,date:"2024-02-20"},{name:"Adjuster Meeting",done:true,date:"2024-03-05"},{name:"Initial Approval",done:true,date:"2024-03-12"},{name:"Supplement Filed",done:true,date:"2024-03-20"},{name:"Supplement Approved",done:false,date:""},{name:"Work Completed",done:false,date:""},{name:"Final Payment",done:false,date:""}]},
  { id:"2",claim_number:"CLM-2024-044",customer:"Williams Home",address:"789 Pine St, Detroit MI",insurance_company:"Allstate",adjuster:"Sarah Kim",adjuster_phone:"(313) 555-9002",status:"approved",damage_type:"Wind Damage",initial_estimate:18750,supplement_amount:0,approved_amount:18750,deductible:2500,date_of_loss:"2024-01-28",filed_date:"2024-02-01",
    milestones:[{name:"Initial Inspection",done:true,date:"2024-01-30"},{name:"Claim Filed",done:true,date:"2024-02-01"},{name:"Adjuster Meeting",done:true,date:"2024-02-15"},{name:"Initial Approval",done:true,date:"2024-02-22"},{name:"Work Completed",done:false,date:""},{name:"Final Payment",done:false,date:""}]},
  { id:"3",claim_number:"CLM-2024-043",customer:"Davis Family",address:"2345 Maple Dr, Columbus OH",insurance_company:"USAA",adjuster:"Mike Torres",adjuster_phone:"(614) 555-9003",status:"adjuster_scheduled",damage_type:"Hail Damage",initial_estimate:16200,supplement_amount:0,approved_amount:0,deductible:1500,date_of_loss:"2024-03-01",filed_date:"2024-03-05",
    milestones:[{name:"Initial Inspection",done:true,date:"2024-03-03"},{name:"Claim Filed",done:true,date:"2024-03-05"},{name:"Adjuster Meeting",done:false,date:"2024-04-18"},{name:"Initial Approval",done:false,date:""},{name:"Work Completed",done:false,date:""},{name:"Final Payment",done:false,date:""}]},
  { id:"4",claim_number:"CLM-2024-042",customer:"Martinez Home",address:"3456 Birch Rd, Detroit MI",insurance_company:"Progressive",adjuster:"Lisa Chang",adjuster_phone:"(313) 555-9004",status:"denied",damage_type:"Age/Wear",initial_estimate:11800,supplement_amount:0,approved_amount:0,deductible:2000,date_of_loss:"2024-02-10",filed_date:"2024-02-15",
    milestones:[{name:"Initial Inspection",done:true,date:"2024-02-12"},{name:"Claim Filed",done:true,date:"2024-02-15"},{name:"Adjuster Meeting",done:true,date:"2024-03-01"},{name:"Denied — Re-inspect",done:true,date:"2024-03-10"}]},
  { id:"5",claim_number:"CLM-2024-041",customer:"Taylor Home",address:"8901 Walnut Ct, Dallas TX",insurance_company:"Liberty Mutual",adjuster:"James Brown",adjuster_phone:"(214) 555-9005",status:"complete",damage_type:"Hail + Wind",initial_estimate:22000,supplement_amount:6500,approved_amount:28500,deductible:1000,date_of_loss:"2024-01-15",filed_date:"2024-01-18",
    milestones:[{name:"Initial Inspection",done:true,date:"2024-01-17"},{name:"Claim Filed",done:true,date:"2024-01-18"},{name:"Adjuster Meeting",done:true,date:"2024-02-01"},{name:"Initial Approval",done:true,date:"2024-02-08"},{name:"Supplement Filed",done:true,date:"2024-02-20"},{name:"Supplement Approved",done:true,date:"2024-03-05"},{name:"Work Completed",done:true,date:"2024-03-20"},{name:"Final Payment",done:true,date:"2024-04-01"}]},
];

export default function ClaimsPage() {
  const [claims] = useState(MOCK);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string|null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = claims.filter(c=>{
    const ms = c.customer.toLowerCase().includes(search.toLowerCase())||c.claim_number.toLowerCase().includes(search.toLowerCase())||c.insurance_company.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter==="all"||c.status===statusFilter;
    return ms&&mf;
  });

  const totalApproved = claims.reduce((a,c)=>a+c.approved_amount,0);
  const totalSupplements = claims.reduce((a,c)=>a+c.supplement_amount,0);
  const statusColor: Record<string,string> = { adjuster_scheduled:"bg-blue-100 text-blue-700",supplement_pending:"bg-yellow-100 text-yellow-700",approved:"bg-green-100 text-green-700",denied:"bg-red-100 text-red-700",complete:"bg-emerald-100 text-emerald-700",filed:"bg-purple-100 text-purple-700" };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-red-700 to-red-900 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div><div className="flex items-center gap-3 mb-2"><Shield className="w-8 h-8"/><h1 className="text-3xl font-bold">Insurance Claims</h1></div>
            <p className="text-red-200">Full claim lifecycle — Xactimate integration, supplement tracking, adjuster management, and payment collection.</p></div>
          <button className="bg-white text-red-700 px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2"><Plus className="w-5 h-5"/> New Claim</button>
        </div>
        <div className="grid grid-cols-5 gap-4 mt-6">
          {[{label:"Total Claims",val:claims.length},{label:"Approved Value",val:`$${(totalApproved/1000).toFixed(0)}K`},{label:"Supplement Value",val:`$${(totalSupplements/1000).toFixed(0)}K`},{label:"Pending",val:claims.filter(c=>c.status==="supplement_pending"||c.status==="adjuster_scheduled").length},{label:"Win Rate",val:`${Math.round(claims.filter(c=>c.approved_amount>0).length/claims.length*100)}%`}].map(s=><div key={s.label} className="bg-white/10 rounded-xl p-4"><div className="text-2xl font-bold">{s.val}</div><div className="text-red-200 text-sm">{s.label}</div></div>)}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1"><Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search claims..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"/></div>
        <div className="flex gap-2 flex-wrap">{["all","adjuster_scheduled","supplement_pending","approved","denied","complete"].map(s=><button key={s} onClick={()=>setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${statusFilter===s?"bg-red-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s.replace("_"," ")}</button>)}</div>
      </div>

      <div className="space-y-3">
        {filtered.map(c=>(
          <div key={c.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-5 cursor-pointer hover:bg-gray-50" onClick={()=>setExpanded(expanded===c.id?null:c.id)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {expanded===c.id?<ChevronDown className="w-5 h-5 text-gray-400"/>:<ChevronRight className="w-5 h-5 text-gray-400"/>}
                  <div>
                    <h3 className="font-semibold text-gray-900">{c.claim_number} — {c.customer}</h3>
                    <p className="text-sm text-gray-500">{c.insurance_company} • {c.damage_type} • Adjuster: {c.adjuster} • DOL: {c.date_of_loss}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">${c.approved_amount>0?c.approved_amount.toLocaleString():c.initial_estimate.toLocaleString()}</div>
                    {c.supplement_amount>0&&<div className="text-xs text-orange-600">+${c.supplement_amount.toLocaleString()} supplement</div>}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[c.status]||"bg-gray-100 text-gray-600"}`}>{c.status.replace("_"," ")}</span>
                </div>
              </div>
            </div>
            {expanded===c.id&&(
              <div className="border-t border-gray-200 p-5 bg-gray-50">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Claim Timeline</h4>
                    <div className="space-y-3">
                      {c.milestones.map((m,i)=>(
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${m.done?"bg-green-100":"bg-gray-100"}`}>
                            {m.done?<CheckCircle className="w-4 h-4 text-green-600"/>:<Clock className="w-4 h-4 text-gray-400"/>}
                          </div>
                          <div className="flex-1"><span className={`text-sm ${m.done?"text-gray-900":"text-gray-500"}`}>{m.name}</span></div>
                          <span className="text-xs text-gray-400">{m.date||"—"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Financial Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-500">Initial Estimate</span><span>${c.initial_estimate.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Supplement Amount</span><span className="text-orange-600">+${c.supplement_amount.toLocaleString()}</span></div>
                      <div className="flex justify-between border-t pt-2 font-bold"><span>Approved Total</span><span className="text-green-700">${c.approved_amount.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Deductible (customer)</span><span className="text-red-600">-${c.deductible.toLocaleString()}</span></div>
                      <div className="flex justify-between border-t pt-2 font-bold"><span>Net to Delta</span><span className="text-green-700">${(c.approved_amount-c.deductible).toLocaleString()}</span></div>
                    </div>
                    <h4 className="font-semibold text-gray-900 mt-4 mb-2">Adjuster Info</h4>
                    <div className="text-sm text-gray-600"><div>{c.adjuster}</div><div>{c.adjuster_phone}</div><div>{c.insurance_company}</div></div>
                    <div className="flex gap-2 mt-4">
                      <button className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium">File Supplement</button>
                      <button className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium flex items-center gap-1"><Upload className="w-3 h-3"/>Upload Xactimate</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
