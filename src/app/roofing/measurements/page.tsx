"use client";
import { useState } from "react";
import { Ruler, Plus, Search, Download, Eye, Clock, CheckCircle, ExternalLink, MapPin } from "lucide-react";

const MOCK = [
  { id:"1",customer:"Johnson Family",address:"4521 Oak Ave, Dallas TX",provider:"EagleView",report_type:"PremiumReport",status:"delivered",squares:28,pitch:"6/12",ridges:4,valleys:2,hips:6,total_area:"2,800 sq ft",waste_factor:"12%",ordered:"2024-03-15",delivered:"2024-03-16",cost:35 },
  { id:"2",customer:"Smith Residence",address:"1234 Elm St, Columbus OH",provider:"Hover",report_type:"3D Model + Measurements",status:"delivered",squares:22,pitch:"8/12",ridges:3,valleys:1,hips:4,total_area:"2,200 sq ft",waste_factor:"15%",ordered:"2024-03-12",delivered:"2024-03-13",cost:25 },
  { id:"3",customer:"Brown Corp",address:"500 Commerce Blvd, Dallas TX",provider:"Geospan",report_type:"Full 3D Model",status:"delivered",squares:120,pitch:"Flat/1:12",ridges:0,valleys:0,hips:0,total_area:"12,000 sq ft",waste_factor:"5%",ordered:"2024-03-10",delivered:"2024-03-11",cost:45 },
  { id:"4",customer:"Davis Family",address:"2345 Maple Dr, Columbus OH",provider:"RoofScope",report_type:"Aerial Measurement",status:"delivered",squares:26,pitch:"7/12",ridges:3,valleys:2,hips:5,total_area:"2,600 sq ft",waste_factor:"14%",ordered:"2024-03-18",delivered:"2024-03-19",cost:30 },
  { id:"5",customer:"Chen Residence",address:"345 Lotus Ln, Columbus OH",provider:"GAF QuickMeasure",report_type:"Quick Report (< 1hr)",status:"processing",squares:0,pitch:"TBD",ridges:0,valleys:0,hips:0,total_area:"Pending",waste_factor:"TBD",ordered:"2024-04-15",delivered:"",cost:15 },
  { id:"6",customer:"Garcia Residence",address:"6789 Cedar Ln, Dallas TX",provider:"EagleView",report_type:"PremiumReport",status:"delivered",squares:30,pitch:"5/12",ridges:2,valleys:0,hips:4,total_area:"3,000 sq ft",waste_factor:"10%",ordered:"2024-02-10",delivered:"2024-02-11",cost:35 },
  { id:"7",customer:"Martinez Home",address:"3456 Birch Rd, Detroit MI",provider:"RoofSnap",report_type:"DIY + Aerial Overlay",status:"delivered",squares:24,pitch:"6/12",ridges:3,valleys:1,hips:4,total_area:"2,400 sq ft",waste_factor:"13%",ordered:"2024-03-20",delivered:"2024-03-20",cost:20 },
];

export default function MeasurementsPage() {
  const [measurements] = useState(MOCK);
  const [search, setSearch] = useState("");
  const filtered = measurements.filter(m=>m.customer.toLowerCase().includes(search.toLowerCase())||m.provider.toLowerCase().includes(search.toLowerCase()));
  const providerColor: Record<string,string> = { EagleView:"bg-blue-100 text-blue-700",Hover:"bg-purple-100 text-purple-700",Geospan:"bg-green-100 text-green-700","GAF QuickMeasure":"bg-red-100 text-red-700",RoofScope:"bg-orange-100 text-orange-700",RoofSnap:"bg-cyan-100 text-cyan-700" };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div><div className="flex items-center gap-3 mb-2"><Ruler className="w-8 h-8"/><h1 className="text-3xl font-bold">Roof Measurements</h1></div>
            <p className="text-indigo-200">Order aerial measurements from EagleView, Hover, GAF QuickMeasure, Geospan, RoofScope, and RoofSnap. Auto-populate into estimates.</p></div>
          <button className="bg-white text-indigo-700 px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2"><Plus className="w-5 h-5"/> Order Measurement</button>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[{label:"Total Reports",val:measurements.length},{label:"Delivered",val:measurements.filter(m=>m.status==="delivered").length},{label:"Processing",val:measurements.filter(m=>m.status==="processing").length},{label:"Avg Cost",val:`$${Math.round(measurements.reduce((a,m)=>a+m.cost,0)/measurements.length)}`}].map(s=><div key={s.label} className="bg-white/10 rounded-xl p-4"><div className="text-2xl font-bold">{s.val}</div><div className="text-indigo-200 text-sm">{s.label}</div></div>)}
        </div>
      </div>
      <div className="relative mb-6"><Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search measurements..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"/></div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full"><thead className="bg-gray-50"><tr>{["Customer","Address","Provider","Type","Squares","Pitch","Area","Waste","Status","Cost",""].map(h=><th key={h} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{filtered.map(m=>(
            <tr key={m.id} className="hover:bg-gray-50">
              <td className="px-3 py-3 text-sm font-medium">{m.customer}</td>
              <td className="px-3 py-3 text-xs text-gray-500">{m.address}</td>
              <td className="px-3 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${providerColor[m.provider]||"bg-gray-100 text-gray-600"}`}>{m.provider}</span></td>
              <td className="px-3 py-3 text-xs">{m.report_type}</td>
              <td className="px-3 py-3 text-sm font-bold">{m.squares||"—"}</td>
              <td className="px-3 py-3 text-sm">{m.pitch}</td>
              <td className="px-3 py-3 text-sm">{m.total_area}</td>
              <td className="px-3 py-3 text-sm">{m.waste_factor}</td>
              <td className="px-3 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${m.status==="delivered"?"bg-green-100 text-green-700":"bg-yellow-100 text-yellow-700"}`}>{m.status}</span></td>
              <td className="px-3 py-3 text-sm">${m.cost}</td>
              <td className="px-3 py-3"><div className="flex gap-1">{m.status==="delivered"&&<><button className="p-1 text-gray-400 hover:text-blue-600"><Eye className="w-4 h-4"/></button><button className="p-1 text-gray-400 hover:text-green-600"><Download className="w-4 h-4"/></button></>}</div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
