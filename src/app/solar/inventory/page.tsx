"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { DollarSign, TrendingUp, Users, CheckCircle, AlertTriangle, Search, Plus, Package, ClipboardCheck, Sun, Wrench, BarChart3, Star, Calendar } from "lucide-react";

const inventory = [
  { item: "REC Alpha Pure-R 400W", sku: "PNL-REC-400", category: "Panel", onHand: 120, reserved: 48, reorderPoint: 50, location: "WH-Dallas" },
  { item: "Qcells Q.Peak DUO 380W", sku: "PNL-QC-380", category: "Panel", onHand: 85, reserved: 19, reorderPoint: 40, location: "WH-Dallas" },
  { item: "Enphase IQ8+", sku: "INV-ENP-IQ8P", category: "Inverter", onHand: 200, reserved: 67, reorderPoint: 80, location: "WH-Dallas" },
  { item: "SolarEdge SE7600H", sku: "INV-SE-7600", category: "Inverter", onHand: 15, reserved: 8, reorderPoint: 20, location: "WH-Ohio" },
  { item: "IronRidge XR100 Rail", sku: "RCK-IR-XR100", category: "Racking", onHand: 340, reserved: 120, reorderPoint: 100, location: "WH-Dallas" },
  { item: "MC4 Connectors (pair)", sku: "BOS-MC4-PR", category: "BOS", onHand: 500, reserved: 180, reorderPoint: 200, location: "WH-Dallas" },
  { item: "Tesla Powerwall 3", sku: "BAT-TSL-PW3", category: "Battery", onHand: 8, reserved: 3, reorderPoint: 10, location: "WH-Dallas" },
  { item: "#10 PV Wire (500ft)", sku: "BOS-PVW-10", category: "BOS", onHand: 45, reserved: 12, reorderPoint: 20, location: "WH-Ohio" },
];
export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const filtered = inventory.filter(i => (catFilter === "all" || i.category === catFilter) && i.item.toLowerCase().includes(search.toLowerCase()));
  const lowStock = inventory.filter(i => i.onHand - i.reserved <= i.reorderPoint);
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8"><h1 className="text-3xl font-bold text-[#0B1F3A]">Inventory</h1><p className="text-gray-500 mt-1">Equipment stock levels, purchase orders, and warehouse management</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{l:"Total SKUs",v:inventory.length.toString(),icon:Package},{l:"Below Reorder",v:lowStock.length.toString(),icon:AlertTriangle},{l:"POs In Transit",v:"3",icon:BarChart3},{l:"Inventory Value",v:"$847K",icon:DollarSign}].map((s,i) => <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-1"><s.icon size={16} className="text-[#F0A500]" /><span className="text-xs text-gray-500">{s.l}</span></div><div className="text-2xl font-bold text-[#0B1F3A]">{s.v}</div></div>)}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Search inventory..." /></div>
          <div className="flex gap-2">{["all","Panel","Inverter","Racking","BOS","Battery"].map(c => <button key={c} onClick={()=>setCatFilter(c)} className={`px-3 py-2 rounded-lg text-xs font-medium ${catFilter===c?"bg-[#0B1F3A] text-white":"bg-gray-100 text-gray-600"}`}>{c}</button>)}</div>
        </div>
        <table className="w-full text-sm"><thead><tr className="border-b">{["Item","SKU","Category","On Hand","Reserved","Available","Reorder Pt","Location"].map(h=><th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead><tbody>{filtered.map((item,i)=>{const avail=item.onHand-item.reserved;const low=avail<=item.reorderPoint;return(
          <tr key={i} className={`border-b border-gray-50 hover:bg-gray-50 ${low?"bg-red-50":""}`}><td className="py-3 px-3 font-medium">{item.item}</td><td className="py-3 px-3 font-mono text-xs text-gray-500">{item.sku}</td><td className="py-3 px-3"><span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">{item.category}</span></td><td className="py-3 px-3">{item.onHand}</td><td className="py-3 px-3">{item.reserved}</td><td className={`py-3 px-3 font-bold ${low?"text-red-600":"text-green-600"}`}>{avail}</td><td className="py-3 px-3 text-gray-500">{item.reorderPoint}</td><td className="py-3 px-3 text-gray-500">{item.location}</td></tr>
        )})}</tbody></table>
      </div>
    </div>
  );
}
