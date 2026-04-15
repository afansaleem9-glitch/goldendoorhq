"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { Calculator, Plus, Search, Send, Download, Eye, CheckCircle, Clock, FileText, DollarSign, ChevronDown, ChevronRight, Trash2, Copy } from "lucide-react";

interface Estimate {
  id: string; estimate_number: string; customer_name: string; address: string; status: string;
  total: number; profit_margin: number; created_at: string; valid_until: string;
  items: { description: string; qty: number; unit: string; rate: number; total: number }[];
  measurement_source: string; roof_squares: number;
}

const MOCK: Estimate[] = [
  { id:"1",estimate_number:"E-2024-089",customer_name:"Williams Home",address:"789 Pine St, Detroit MI",status:"signed",total:18750,profit_margin:42,created_at:"2024-03-20",valid_until:"2024-04-20",measurement_source:"EagleView",roof_squares:28,
    items:[{description:"GAF Timberline HDZ Architectural Shingles",qty:28,unit:"squares",rate:425,total:11900},{description:"Ice & Water Shield",qty:6,unit:"rolls",rate:89,total:534},{description:"Synthetic Underlayment",qty:28,unit:"squares",rate:45,total:1260},{description:"Ridge Cap Shingles",qty:4,unit:"bundles",rate:65,total:260},{description:"Drip Edge Flashing",qty:320,unit:"lf",rate:3.50,total:1120},{description:"Pipe Boots & Flashing",qty:6,unit:"each",rate:45,total:270},{description:"Labor — Tear-off & Install",qty:28,unit:"squares",rate:85,total:2380},{description:"Dumpster & Disposal",qty:1,unit:"each",rate:650,total:650},{description:"Permits & Inspection",qty:1,unit:"each",rate:376,total:376}]},
  { id:"2",estimate_number:"E-2024-090",customer_name:"Johnson Family",address:"4521 Oak Ave, Dallas TX",status:"sent",total:24500,profit_margin:38,created_at:"2024-03-22",valid_until:"2024-04-22",measurement_source:"GAF QuickMeasure",roof_squares:35,
    items:[{description:"GAF Timberline UHDZ Shingles",qty:35,unit:"squares",rate:475,total:16625},{description:"Ice & Water Shield",qty:8,unit:"rolls",rate:89,total:712},{description:"Synthetic Underlayment",qty:35,unit:"squares",rate:45,total:1575},{description:"Ridge Vent System",qty:85,unit:"lf",rate:12,total:1020},{description:"Labor — Complete Tear-off & Install",qty:35,unit:"squares",rate:95,total:3325},{description:"Dumpster & Disposal",qty:1,unit:"each",rate:750,total:750},{description:"Permits",qty:1,unit:"each",rate:493,total:493}]},
  { id:"3",estimate_number:"E-2024-091",customer_name:"Brown Corp",address:"500 Commerce Blvd, Dallas TX",status:"draft",total:67800,profit_margin:35,created_at:"2024-03-23",valid_until:"2024-04-23",measurement_source:"Hover",roof_squares:82,
    items:[{description:"Commercial TPO Membrane 60mil",qty:82,unit:"squares",rate:385,total:31570},{description:"ISO Board Insulation 2.5\"",qty:82,unit:"squares",rate:125,total:10250},{description:"Metal Edge & Coping",qty:640,unit:"lf",rate:18,total:11520},{description:"Penetration Flashings",qty:24,unit:"each",rate:175,total:4200},{description:"Labor — Commercial Install",qty:82,unit:"squares",rate:110,total:9020},{description:"Equipment Rental",qty:1,unit:"each",rate:1240,total:1240}]},
  { id:"4",estimate_number:"E-2024-092",customer_name:"Garcia Residence",address:"6789 Cedar Ln, Dallas TX",status:"signed",total:15600,profit_margin:44,created_at:"2024-03-18",valid_until:"2024-04-18",measurement_source:"EagleView",roof_squares:22,
    items:[{description:"Owens Corning Duration Shingles",qty:22,unit:"squares",rate:410,total:9020},{description:"Underlayment & Barriers",qty:22,unit:"squares",rate:55,total:1210},{description:"Flashing Package",qty:1,unit:"lot",rate:890,total:890},{description:"Labor — Full Replacement",qty:22,unit:"squares",rate:90,total:1980},{description:"Disposal & Cleanup",qty:1,unit:"each",rate:600,total:600},{description:"GAF System Plus Warranty Upgrade",qty:1,unit:"each",rate:900,total:900}]},
  { id:"5",estimate_number:"E-2024-093",customer_name:"Davis Family",address:"2345 Maple Dr, Columbus OH",status:"sent",total:9800,profit_margin:40,created_at:"2024-03-21",valid_until:"2024-04-21",measurement_source:"RoofScope",roof_squares:16,
    items:[{description:"CertainTeed Landmark Shingles",qty:16,unit:"squares",rate:380,total:6080},{description:"Underlayment",qty:16,unit:"squares",rate:40,total:640},{description:"Flashing & Accessories",qty:1,unit:"lot",rate:560,total:560},{description:"Labor",qty:16,unit:"squares",rate:85,total:1360},{description:"Disposal",qty:1,unit:"each",rate:450,total:450},{description:"Permit",qty:1,unit:"each",rate:210,total:210}]},
  { id:"6",estimate_number:"E-2024-094",customer_name:"Martinez Home",address:"3456 Birch Rd, Detroit MI",status:"expired",total:12400,profit_margin:36,created_at:"2024-02-15",valid_until:"2024-03-15",measurement_source:"Geospan",roof_squares:19,
    items:[{description:"IKO Cambridge Shingles",qty:19,unit:"squares",rate:365,total:6935},{description:"Full Accessory Package",qty:1,unit:"lot",rate:1890,total:1890},{description:"Labor",qty:19,unit:"squares",rate:88,total:1672},{description:"Disposal & Permits",qty:1,unit:"each",rate:903,total:903}]},
];

export default function EstimatesPage() {
  const [estimates, setEstimates] = useState<Estimate[]>(MOCK);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const filtered = estimates.filter(e => {
    const ms = e.customer_name.toLowerCase().includes(search.toLowerCase()) || e.estimate_number.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter === "all" || e.status === statusFilter;
    return ms && mf;
  });

  const totalValue = estimates.reduce((a, e) => a + e.total, 0);
  const signedValue = estimates.filter(e => e.status === "signed").reduce((a, e) => a + e.total, 0);
  const avgMargin = Math.round(estimates.reduce((a, e) => a + e.profit_margin, 0) / estimates.length);
  const closeRate = Math.round((estimates.filter(e => e.status === "signed").length / estimates.length) * 100);

  const statusColor: Record<string, string> = { draft: "bg-gray-100 text-gray-700", sent: "bg-blue-100 text-blue-700", signed: "bg-green-100 text-green-700", expired: "bg-red-100 text-red-700", declined: "bg-red-100 text-red-700" };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2"><Calculator className="w-8 h-8" /><h1 className="text-3xl font-bold">Estimates</h1></div>
            <p className="text-blue-200">Template library, measurement auto-populate, profit margins, material integration.</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="bg-white text-blue-700 px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-50"><Plus className="w-5 h-5" /> New Estimate</button>
        </div>
        <div className="grid grid-cols-5 gap-4 mt-6">
          {[
            { label: "Total Estimates", val: estimates.length },
            { label: "Total Value", val: `$${(totalValue / 1000).toFixed(0)}K` },
            { label: "Signed Value", val: `$${(signedValue / 1000).toFixed(0)}K` },
            { label: "Avg Margin", val: `${avgMargin}%` },
            { label: "Close Rate", val: `${closeRate}%` },
          ].map(s => <div key={s.label} className="bg-white/10 rounded-xl p-4"><div className="text-2xl font-bold">{s.val}</div><div className="text-blue-200 text-sm">{s.label}</div></div>)}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1"><Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search estimates..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" /></div>
        <div className="flex gap-2">{["all", "draft", "sent", "signed", "expired"].map(s => <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${statusFilter === s ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s}</button>)}</div>
      </div>

      <div className="space-y-3">
        {filtered.map(e => (
          <div key={e.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-5 cursor-pointer hover:bg-gray-50" onClick={() => setExpanded(expanded === e.id ? null : e.id)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {expanded === e.id ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                  <div>
                    <h3 className="font-semibold text-gray-900">{e.estimate_number} — {e.customer_name}</h3>
                    <p className="text-sm text-gray-500">{e.address} • {e.roof_squares} squares • {e.measurement_source}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right"><div className="text-xl font-bold text-gray-900">${e.total.toLocaleString()}</div><div className="text-xs text-green-600">{e.profit_margin}% margin</div></div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[e.status]}`}>{e.status}</span>
                </div>
              </div>
            </div>
            {expanded === e.id && (
              <div className="border-t border-gray-200 p-5 bg-gray-50">
                <table className="w-full mb-4">
                  <thead><tr className="text-xs text-gray-500 uppercase"><th className="text-left pb-2">Item</th><th className="text-right pb-2">Qty</th><th className="text-right pb-2">Unit</th><th className="text-right pb-2">Rate</th><th className="text-right pb-2">Total</th></tr></thead>
                  <tbody>{e.items.map((item, i) => (
                    <tr key={i} className="border-t border-gray-200">
                      <td className="py-2 text-sm">{item.description}</td>
                      <td className="py-2 text-sm text-right">{item.qty}</td>
                      <td className="py-2 text-sm text-right text-gray-500">{item.unit}</td>
                      <td className="py-2 text-sm text-right">${item.rate.toLocaleString()}</td>
                      <td className="py-2 text-sm text-right font-medium">${item.total.toLocaleString()}</td>
                    </tr>
                  ))}</tbody>
                  <tfoot><tr className="border-t-2 border-gray-300"><td colSpan={4} className="py-2 text-sm font-bold text-right">Total</td><td className="py-2 text-sm font-bold text-right text-green-700">${e.total.toLocaleString()}</td></tr></tfoot>
                </table>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2"><Send className="w-4 h-4" /> Send to Customer</button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium flex items-center gap-2"><Download className="w-4 h-4" /> Download PDF</button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium flex items-center gap-2"><Copy className="w-4 h-4" /> Duplicate</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-6">New Estimate</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Customer Name</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Address</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2" /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-sm font-medium mb-1">Measurement Source</label><select className="w-full border border-gray-300 rounded-lg px-3 py-2"><option>EagleView</option><option>GAF QuickMeasure</option><option>Hover</option><option>Geospan</option><option>RoofScope</option><option>Manual</option></select></div>
                <div><label className="block text-sm font-medium mb-1">Roof Squares</label><input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Template</label><select className="w-full border border-gray-300 rounded-lg px-3 py-2"><option>Standard Residential</option><option>Insurance Claim</option><option>Commercial Flat</option><option>Metal Roof</option><option>Tile Roof</option><option>Custom</option></select></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Shingle Brand</label><select className="w-full border border-gray-300 rounded-lg px-3 py-2"><option>GAF Timberline HDZ</option><option>GAF Timberline UHDZ</option><option>Owens Corning Duration</option><option>CertainTeed Landmark</option><option>IKO Cambridge</option><option>Tesla Solar Roof</option><option>Custom</option></select></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowCreate(false)} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700">Create Estimate</button>
              <button onClick={() => setShowCreate(false)} className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
