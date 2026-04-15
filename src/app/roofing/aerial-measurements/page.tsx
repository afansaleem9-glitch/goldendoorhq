"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { Ruler, Plus, Search, Download, Eye, RefreshCw, MapPin, CheckCircle, Clock, AlertTriangle, ExternalLink } from "lucide-react";

interface MeasurementReport {
  id: string; order_id: string; provider: string; customer: string; address: string; status: string;
  ordered_date: string; completed_date: string | null; total_squares: number; predominant_pitch: string;
  ridges_lf: number; valleys_lf: number; eaves_lf: number; rakes_lf: number; hips_lf: number;
  facets: number; layers: number; roof_type: string; cost: number;
}

const PROVIDERS = [
  { name: "EagleView", logo: "🦅", desc: "Premium aerial roof reports with 3D models", cost: "$45-85", turnaround: "24-48 hrs", features: ["3D Model","Waste Calc","Pitch Map","Wall Measurements"] },
  { name: "GAF QuickMeasure", logo: "📐", desc: "Fast & free for GAF certified contractors", cost: "Free*", turnaround: "1-4 hrs", features: ["Instant Reports","GAF Integration","Material Lists","Auto-Order"] },
  { name: "Hover", logo: "📱", desc: "Smartphone-based 3D property models", cost: "$25-40", turnaround: "Instant", features: ["3D Exterior","Phone Capture","Siding+Roof","AR Preview"] },
  { name: "Geospan", logo: "🛰️", desc: "High-resolution aerial imagery & analytics", cost: "$35-60", turnaround: "12-24 hrs", features: ["HD Imagery","AI Detection","Storm Mapping","Multi-Property"] },
  { name: "RoofScope", logo: "🔭", desc: "Automated roof measurement & reporting", cost: "$20-35", turnaround: "4-8 hrs", features: ["Auto-Measure","Material Calc","Simple Reports","Batch Orders"] }
];

const MOCK: MeasurementReport[] = [
  { id:"1",order_id:"EV-89012",provider:"EagleView",customer:"Williams Home",address:"789 Pine St, Detroit MI",status:"completed",ordered_date:"2024-03-15",completed_date:"2024-03-16",total_squares:28,predominant_pitch:"6/12",ridges_lf:85,valleys_lf:42,eaves_lf:180,rakes_lf:120,hips_lf:65,facets:12,layers:2,roof_type:"Architectural Shingle",cost:65 },
  { id:"2",order_id:"GQM-34567",provider:"GAF QuickMeasure",customer:"Johnson Family",address:"4521 Oak Ave, Dallas TX",status:"completed",ordered_date:"2024-03-20",completed_date:"2024-03-20",total_squares:35,predominant_pitch:"5/12",ridges_lf:110,valleys_lf:55,eaves_lf:220,rakes_lf:140,hips_lf:80,facets:16,layers:1,roof_type:"3-Tab Shingle",cost:0 },
  { id:"3",order_id:"HV-78901",provider:"Hover",customer:"Garcia Residence",address:"6789 Cedar Ln, Dallas TX",status:"completed",ordered_date:"2024-03-22",completed_date:"2024-03-22",total_squares:22,predominant_pitch:"4/12",ridges_lf:60,valleys_lf:28,eaves_lf:140,rakes_lf:90,hips_lf:45,facets:8,layers:1,roof_type:"Architectural Shingle",cost:35 },
  { id:"4",order_id:"EV-89456",provider:"EagleView",customer:"Brown Corp",address:"500 Commerce Blvd, Dallas TX",status:"completed",ordered_date:"2024-03-18",completed_date:"2024-03-19",total_squares:82,predominant_pitch:"1/12",ridges_lf:0,valleys_lf:0,eaves_lf:480,rakes_lf:0,hips_lf:0,facets:1,layers:1,roof_type:"Commercial TPO",cost:85 },
  { id:"5",order_id:"GS-12345",provider:"Geospan",customer:"Davis Home",address:"123 Elm St, Columbus OH",status:"processing",ordered_date:"2024-03-24",completed_date:null,total_squares:0,predominant_pitch:"TBD",ridges_lf:0,valleys_lf:0,eaves_lf:0,rakes_lf:0,hips_lf:0,facets:0,layers:0,roof_type:"TBD",cost:45 },
  { id:"6",order_id:"RS-67890",provider:"RoofScope",customer:"Martinez Family",address:"9012 Birch Rd, Houston TX",status:"completed",ordered_date:"2024-03-23",completed_date:"2024-03-23",total_squares:35,predominant_pitch:"7/12",ridges_lf:95,valleys_lf:60,eaves_lf:200,rakes_lf:130,hips_lf:70,facets:14,layers:2,roof_type:"Architectural Shingle",cost:28 }
];

export default function AerialMeasurementsPage() {
  const [reports, setReports] = useState(MOCK);
  const [search, setSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState("All");
  const [showOrder, setShowOrder] = useState(false);
  const [expanded, setExpanded] = useState<string|null>(null);

  useEffect(() => { supabase.from("roofing_measurements").select("*").eq("org_id", ORG_ID).then(({ data }) => { if (data?.length) setReports(data as any); }); }, []);

  const filtered = reports.filter(r => (providerFilter === "All" || r.provider === providerFilter) && (r.customer.toLowerCase().includes(search.toLowerCase()) || r.address.toLowerCase().includes(search.toLowerCase())));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-[#0B1F3A] flex items-center gap-2"><Ruler className="text-[#F0A500]" size={28}/>Aerial Measurements</h1><p className="text-gray-500 mt-1">EagleView, GAF QuickMeasure, Hover, Geospan & RoofScope integration</p></div>
        <button onClick={()=>setShowOrder(true)} className="bg-[#F0A500] text-[#0B1F3A] px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-yellow-500"><Plus size={18}/>Order Report</button>
      </div>

      {/* Provider Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {PROVIDERS.map(p => (
          <div key={p.name} className="bg-white rounded-xl border p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={()=>setShowOrder(true)}>
            <div className="text-2xl mb-1">{p.logo}</div>
            <h3 className="font-bold text-sm text-[#0B1F3A]">{p.name}</h3>
            <p className="text-[10px] text-gray-500 mt-0.5">{p.desc}</p>
            <div className="flex justify-between mt-2 text-[10px]"><span className="text-green-600 font-medium">{p.cost}</span><span className="text-blue-600">{p.turnaround}</span></div>
            <div className="flex flex-wrap gap-1 mt-2">{p.features.map(f=><span key={f} className="bg-gray-100 px-1.5 py-0.5 rounded text-[9px] text-gray-600">{f}</span>)}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-xs"><Search className="absolute left-3 top-2.5 text-gray-400" size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search reports..." className="pl-9 pr-3 py-2 border rounded-lg w-full text-sm"/></div>
        {["All",...PROVIDERS.map(p=>p.name)].map(p=><button key={p} onClick={()=>setProviderFilter(p)} className={`px-3 py-1.5 rounded-full text-xs font-medium ${providerFilter===p?"bg-[#0B1F3A] text-white":"bg-gray-100 text-gray-600"}`}>{p}</button>)}
      </div>

      <div className="space-y-3">
        {filtered.map(r => (
          <div key={r.id} className="bg-white rounded-xl border overflow-hidden">
            <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50" onClick={()=>setExpanded(expanded===r.id?null:r.id)}>
              <div className="text-xl">{PROVIDERS.find(p=>p.name===r.provider)?.logo}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2"><span className="font-mono text-xs text-gray-400">{r.order_id}</span><h3 className="font-semibold text-[#0B1F3A]">{r.customer}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${r.status==="completed"?"bg-green-100 text-green-700":"bg-yellow-100 text-yellow-700"}`}>{r.status === "completed" ? "✓ Complete" : "⏳ Processing"}</span>
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><MapPin size={12}/>{r.address}</p>
              </div>
              {r.status === "completed" && <div className="text-center"><p className="text-lg font-bold text-[#0B1F3A]">{r.total_squares}</p><p className="text-[10px] text-gray-500">Squares</p></div>}
              <div className="text-center"><p className="text-sm font-medium text-gray-600">{r.predominant_pitch}</p><p className="text-[10px] text-gray-500">Pitch</p></div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg hover:bg-gray-100" title="View Report"><Eye size={16} className="text-blue-600"/></button>
                <button className="p-2 rounded-lg hover:bg-gray-100" title="Download"><Download size={16} className="text-green-600"/></button>
              </div>
            </div>
            {expanded === r.id && r.status === "completed" && (
              <div className="border-t px-4 py-3 bg-gray-50">
                <div className="grid grid-cols-3 md:grid-cols-7 gap-3 text-center text-xs">
                  {[{l:"Ridges",v:`${r.ridges_lf} LF`},{l:"Valleys",v:`${r.valleys_lf} LF`},{l:"Eaves",v:`${r.eaves_lf} LF`},{l:"Rakes",v:`${r.rakes_lf} LF`},{l:"Hips",v:`${r.hips_lf} LF`},{l:"Facets",v:r.facets},{l:"Layers",v:r.layers}].map((m,i)=>(
                    <div key={i} className="bg-white rounded-lg p-2 border"><p className="font-bold text-[#0B1F3A]">{m.v}</p><p className="text-[10px] text-gray-500">{m.l}</p></div>
                  ))}
                </div>
                <div className="flex gap-3 mt-3">
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700"><ExternalLink size={12}/>View Full Report</button>
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700"><Download size={12}/>Download PDF</button>
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs hover:bg-purple-700"><RefreshCw size={12}/>Re-order</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={()=>setShowOrder(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg" onClick={e=>e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">Order Aerial Measurement</h2>
            <div className="space-y-3">
              <select className="w-full border rounded-lg p-2 text-sm"><option value="">Select Provider</option>{PROVIDERS.map(p=><option key={p.name}>{p.name} — {p.cost}</option>)}</select>
              <input placeholder="Customer Name" className="w-full border rounded-lg p-2 text-sm"/>
              <input placeholder="Property Address" className="w-full border rounded-lg p-2 text-sm"/>
              <select className="w-full border rounded-lg p-2 text-sm"><option>Standard Report</option><option>Premium Report (3D Model)</option><option>Commercial Report</option><option>Multi-Structure Report</option></select>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded"/>Include wall measurements</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded"/>Include waste calculation</label>
            </div>
            <div className="flex gap-3 mt-4"><button onClick={()=>setShowOrder(false)} className="flex-1 border rounded-lg py-2 text-sm">Cancel</button><button onClick={()=>setShowOrder(false)} className="flex-1 bg-[#F0A500] text-[#0B1F3A] rounded-lg py-2 text-sm font-semibold">Order Report</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
