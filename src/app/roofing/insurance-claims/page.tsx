"use client";
import { useState } from "react";
import { Shield, Plus, Search, DollarSign, FileText, Clock, CheckCircle, AlertTriangle, Phone, ChevronDown, ChevronRight, Upload } from "lucide-react";

interface Claim {
  id: string; job_number: string; customer: string; address: string; insurance_company: string;
  claim_number: string; policy_number: string; deductible: number; status: string;
  adjuster_name: string; adjuster_phone: string; adjuster_email: string;
  initial_amount: number; supplement_amount: number; total_approved: number;
  supplement_status: string; mortgage_company: string; mortgage_check_status: string;
  xactimate_uploaded: boolean; inspection_date: string; created: string;
}

const MOCK: Claim[] = [
  { id:"1",job_number:"RJ-2024-089",customer:"Williams Home",address:"789 Pine St, Detroit MI",insurance_company:"State Farm",claim_number:"CLM-4521-2024",policy_number:"HO-789456123",deductible:1000,status:"approved",adjuster_name:"Robert Chen",adjuster_phone:"(313) 555-9001",adjuster_email:"r.chen@statefarm.com",initial_amount:14200,supplement_amount:4550,total_approved:18750,supplement_status:"approved",mortgage_company:"Wells Fargo",mortgage_check_status:"received",xactimate_uploaded:true,inspection_date:"2024-03-10",created:"2024-03-05" },
  { id:"2",job_number:"RJ-2024-090",customer:"Johnson Family",address:"4521 Oak Ave, Dallas TX",insurance_company:"Allstate",claim_number:"CLM-8923-2024",policy_number:"HO-456789012",deductible:2500,status:"supplement_pending",adjuster_name:"Maria Santos",adjuster_phone:"(214) 555-9002",adjuster_email:"m.santos@allstate.com",initial_amount:18900,supplement_amount:5600,total_approved:18900,supplement_status:"submitted",mortgage_company:"Chase",mortgage_check_status:"pending",xactimate_uploaded:true,inspection_date:"2024-03-15",created:"2024-03-10" },
  { id:"3",job_number:"RJ-2024-087",customer:"Garcia Residence",address:"6789 Cedar Ln, Dallas TX",insurance_company:"USAA",claim_number:"CLM-3456-2024",policy_number:"HO-123456789",deductible:1500,status:"approved",adjuster_name:"James Wilson",adjuster_phone:"(214) 555-9003",adjuster_email:"j.wilson@usaa.com",initial_amount:12100,supplement_amount:3500,total_approved:15600,supplement_status:"approved",mortgage_company:"None",mortgage_check_status:"n/a",xactimate_uploaded:true,inspection_date:"2024-03-08",created:"2024-03-01" },
  { id:"4",job_number:"RJ-2024-093",customer:"Davis Family",address:"2345 Maple Dr, Columbus OH",insurance_company:"Progressive",claim_number:"CLM-6789-2024",policy_number:"HO-987654321",deductible:1000,status:"inspection_scheduled",adjuster_name:"TBD",adjuster_phone:"",adjuster_email:"",initial_amount:0,supplement_amount:0,total_approved:0,supplement_status:"not_started",mortgage_company:"Rocket Mortgage",mortgage_check_status:"not_started",xactimate_uploaded:false,inspection_date:"2024-04-18",created:"2024-03-21" },
  { id:"5",job_number:"RJ-2024-094",customer:"Martinez Home",address:"3456 Birch Rd, Detroit MI",insurance_company:"Farmers",claim_number:"CLM-1234-2024",policy_number:"HO-111222333",deductible:2000,status:"denied",adjuster_name:"Lisa Park",adjuster_phone:"(313) 555-9005",adjuster_email:"l.park@farmers.com",initial_amount:0,supplement_amount:0,total_approved:0,supplement_status:"n/a",mortgage_company:"",mortgage_check_status:"n/a",xactimate_uploaded:true,inspection_date:"2024-02-20",created:"2024-02-15" },
  { id:"6",job_number:"RJ-2024-095",customer:"Robinson Home",address:"7788 Hill St, Detroit MI",insurance_company:"Liberty Mutual",claim_number:"CLM-5678-2024",policy_number:"HO-444555666",deductible:1500,status:"supplement_pending",adjuster_name:"David Kim",adjuster_phone:"(313) 555-9006",adjuster_email:"d.kim@libertymutual.com",initial_amount:11800,supplement_amount:3200,total_approved:11800,supplement_status:"reviewing",mortgage_company:"US Bank",mortgage_check_status:"requested",xactimate_uploaded:true,inspection_date:"2024-03-18",created:"2024-03-12" },
];

export default function InsuranceClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>(MOCK);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = claims.filter(c => {
    const ms = c.customer.toLowerCase().includes(search.toLowerCase()) || c.claim_number.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter === "all" || c.status === statusFilter;
    return ms && mf;
  });

  const totalApproved = claims.reduce((a, c) => a + c.total_approved, 0);
  const totalSupplements = claims.reduce((a, c) => a + c.supplement_amount, 0);

  const statusColor: Record<string, string> = { approved: "bg-green-100 text-green-700", supplement_pending: "bg-yellow-100 text-yellow-700", inspection_scheduled: "bg-blue-100 text-blue-700", denied: "bg-red-100 text-red-700", in_review: "bg-purple-100 text-purple-700" };
  const suppColor: Record<string, string> = { approved: "text-green-600", submitted: "text-blue-600", reviewing: "text-yellow-600", not_started: "text-gray-400", "n/a": "text-gray-400" };
  const mortColor: Record<string, string> = { received: "text-green-600", pending: "text-yellow-600", requested: "text-blue-600", not_started: "text-gray-400", "n/a": "text-gray-400" };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-red-700 to-red-900 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div><div className="flex items-center gap-3 mb-2"><Shield className="w-8 h-8" /><h1 className="text-3xl font-bold">Insurance Claims</h1></div>
            <p className="text-red-200">Claims management, Xactimate integration, supplement tracking, adjuster coordination, mortgage check status.</p></div>
          <button className="bg-white text-red-700 px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2"><Plus className="w-5 h-5" /> New Claim</button>
        </div>
        <div className="grid grid-cols-5 gap-4 mt-6">
          {[
            { label: "Total Claims", val: claims.length },
            { label: "Approved", val: claims.filter(c => c.status === "approved").length },
            { label: "Total Approved $", val: `$${(totalApproved / 1000).toFixed(0)}K` },
            { label: "Supplement Value", val: `$${(totalSupplements / 1000).toFixed(0)}K` },
            { label: "Pending Supplements", val: claims.filter(c => c.supplement_status === "submitted" || c.supplement_status === "reviewing").length },
          ].map(s => <div key={s.label} className="bg-white/10 rounded-xl p-4"><div className="text-2xl font-bold">{s.val}</div><div className="text-red-200 text-sm">{s.label}</div></div>)}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1"><Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search claims..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" /></div>
        <div className="flex gap-2">{["all", "approved", "supplement_pending", "inspection_scheduled", "denied"].map(s => <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${statusFilter === s ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s.replace("_", " ")}</button>)}</div>
      </div>

      <div className="space-y-3">
        {filtered.map(c => (
          <div key={c.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-5 cursor-pointer hover:bg-gray-50" onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {expanded === c.id ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                  <div><h3 className="font-semibold text-gray-900">{c.customer} — {c.claim_number}</h3><p className="text-sm text-gray-500">{c.insurance_company} • {c.address}</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right"><div className="text-xl font-bold">{c.total_approved > 0 ? `$${c.total_approved.toLocaleString()}` : "Pending"}</div>
                    {c.supplement_amount > 0 && <div className="text-xs text-blue-600">+${c.supplement_amount.toLocaleString()} supplement</div>}</div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[c.status] || "bg-gray-100 text-gray-700"}`}>{c.status.replace("_", " ")}</span>
                </div>
              </div>
            </div>
            {expanded === c.id && (
              <div className="border-t border-gray-200 p-5 bg-gray-50">
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div><div className="text-xs text-gray-500 mb-1">Policy #</div><div className="text-sm font-medium">{c.policy_number}</div></div>
                  <div><div className="text-xs text-gray-500 mb-1">Deductible</div><div className="text-sm font-medium">${c.deductible.toLocaleString()}</div></div>
                  <div><div className="text-xs text-gray-500 mb-1">Initial Amount</div><div className="text-sm font-medium">${c.initial_amount.toLocaleString()}</div></div>
                  <div><div className="text-xs text-gray-500 mb-1">Inspection Date</div><div className="text-sm font-medium">{c.inspection_date}</div></div>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div><div className="text-xs text-gray-500 mb-1">Adjuster</div><div className="text-sm font-medium">{c.adjuster_name || "TBD"}</div>{c.adjuster_phone && <div className="text-xs text-gray-400">{c.adjuster_phone}</div>}</div>
                  <div><div className="text-xs text-gray-500 mb-1">Supplement Status</div><div className={`text-sm font-medium ${suppColor[c.supplement_status]}`}>{c.supplement_status.replace("_", " ")}</div></div>
                  <div><div className="text-xs text-gray-500 mb-1">Mortgage Check</div><div className={`text-sm font-medium ${mortColor[c.mortgage_check_status]}`}>{c.mortgage_check_status.replace("_", " ")}</div>{c.mortgage_company && <div className="text-xs text-gray-400">{c.mortgage_company}</div>}</div>
                  <div><div className="text-xs text-gray-500 mb-1">Xactimate</div><div className="text-sm font-medium">{c.xactimate_uploaded ? <span className="text-green-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Uploaded</span> : <span className="text-gray-400">Not uploaded</span>}</div></div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium flex items-center gap-2"><Upload className="w-4 h-4" /> Upload Xactimate</button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2"><FileText className="w-4 h-4" /> File Supplement</button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium flex items-center gap-2"><Phone className="w-4 h-4" /> Call Adjuster</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
