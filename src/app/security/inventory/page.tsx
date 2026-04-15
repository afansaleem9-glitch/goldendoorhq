"use client";
import { useState } from "react";
import { Package, Plus, Search, AlertTriangle, Truck, Building, DollarSign } from "lucide-react";

const MOCK = [
  { id:"1",name:"Qolsys IQ Panel 4",sku:"QS-IQ4-001",category:"Panels",qty:45,min_qty:10,cost:289,price:499,supplier:"ADI Global",warehouse:"Dallas",status:"in_stock" },
  { id:"2",name:"DSC Neo Panel",sku:"DSC-NEO-001",category:"Panels",qty:28,min_qty:10,cost:195,price:349,supplier:"ADI Global",warehouse:"Columbus",status:"in_stock" },
  { id:"3",name:"DMP XR550",sku:"DMP-XR550",category:"Panels",qty:8,min_qty:5,cost:425,price:699,supplier:"Wave Electronics",warehouse:"Dallas",status:"in_stock" },
  { id:"4",name:"Door/Window Sensor",sku:"SEN-DW-001",category:"Sensors",qty:342,min_qty:100,cost:12,price:29,supplier:"ADI Global",warehouse:"All",status:"in_stock" },
  { id:"5",name:"Motion Detector (PIR)",sku:"SEN-MOT-001",category:"Sensors",qty:156,min_qty:50,cost:18,price:39,supplier:"ADI Global",warehouse:"All",status:"in_stock" },
  { id:"6",name:"Glass Break Sensor",sku:"SEN-GB-001",category:"Sensors",qty:89,min_qty:30,cost:22,price:45,supplier:"Wave Electronics",warehouse:"All",status:"in_stock" },
  { id:"7",name:"Smoke Detector",sku:"SEN-SMK-001",category:"Fire",qty:7,min_qty:20,cost:35,price:69,supplier:"ADI Global",warehouse:"Detroit",status:"low_stock" },
  { id:"8",name:"Indoor Camera (WiFi)",sku:"CAM-IN-001",category:"Cameras",qty:67,min_qty:20,cost:45,price:99,supplier:"Wave Electronics",warehouse:"All",status:"in_stock" },
  { id:"9",name:"Outdoor Camera (PoE)",sku:"CAM-OUT-001",category:"Cameras",qty:34,min_qty:15,cost:89,price:179,supplier:"ADI Global",warehouse:"All",status:"in_stock" },
  { id:"10",name:"Video Doorbell Pro",sku:"CAM-DB-001",category:"Cameras",qty:23,min_qty:15,cost:125,price:249,supplier:"ADI Global",warehouse:"All",status:"in_stock" },
  { id:"11",name:"Smart Lock (Z-Wave)",sku:"LOCK-ZW-001",category:"Smart Home",qty:4,min_qty:10,cost:145,price:299,supplier:"Wave Electronics",warehouse:"Dallas",status:"low_stock" },
  { id:"12",name:"Smart Thermostat",sku:"THERM-001",category:"Smart Home",qty:18,min_qty:10,cost:89,price:179,supplier:"ADI Global",warehouse:"All",status:"in_stock" },
  { id:"13",name:"Siren (Indoor)",sku:"SIR-IN-001",category:"Accessories",qty:56,min_qty:20,cost:15,price:35,supplier:"ADI Global",warehouse:"All",status:"in_stock" },
  { id:"14",name:"Key Fob Remote",sku:"FOB-001",category:"Accessories",qty:3,min_qty:20,cost:18,price:39,supplier:"Wave Electronics",warehouse:"Columbus",status:"low_stock" },
];

export default function InventoryPage() {
  const [items] = useState(MOCK);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const categories = ["all",...Array.from(new Set(MOCK.map(i=>i.category)))];
  const filtered = items.filter(i=>{
    const ms = i.name.toLowerCase().includes(search.toLowerCase())||i.sku.toLowerCase().includes(search.toLowerCase());
    const mf = catFilter==="all"||i.category===catFilter;
    return ms&&mf;
  });
  const totalValue = items.reduce((a,i)=>a+i.qty*i.cost,0);
  const lowStock = items.filter(i=>i.qty<i.min_qty);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-amber-600 to-amber-800 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div><div className="flex items-center gap-3 mb-2"><Package className="w-8 h-8"/><h1 className="text-3xl font-bold">Inventory</h1></div><p className="text-amber-200">Equipment tracking across all warehouses. ADI Global + Wave Electronics integration.</p></div>
          <button className="bg-white text-amber-700 px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2"><Truck className="w-5 h-5"/> Create PO</button>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[{label:"Total SKUs",val:items.length},{label:"Total Units",val:items.reduce((a,i)=>a+i.qty,0).toLocaleString()},{label:"Inventory Value",val:`$${(totalValue/1000).toFixed(0)}K`},{label:"Low Stock Alerts",val:lowStock.length}].map(s=><div key={s.label} className="bg-white/10 rounded-xl p-4"><div className="text-2xl font-bold">{s.val}</div><div className="text-amber-200 text-sm">{s.label}</div></div>)}
        </div>
      </div>

      {lowStock.length>0&&(
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600"/><div><span className="font-semibold text-red-800">Low Stock Alert:</span><span className="text-red-700 ml-1">{lowStock.map(i=>i.name).join(", ")} — reorder from {lowStock.map(i=>i.supplier).filter((v,i,a)=>a.indexOf(v)===i).join(", ")}</span></div>
        </div>
      )}

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1"><Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search inventory..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"/></div>
        <div className="flex gap-2">{categories.map(c=><button key={c} onClick={()=>setCatFilter(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${catFilter===c?"bg-amber-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{c}</button>)}</div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full"><thead className="bg-gray-50"><tr>{["SKU","Item","Category","In Stock","Min Qty","Cost","Price","Supplier","Warehouse","Status"].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{filtered.map(i=>(
            <tr key={i.id} className={`hover:bg-gray-50 ${i.qty<i.min_qty?"bg-red-50":""}`}>
              <td className="px-4 py-3 text-xs font-mono text-gray-500">{i.sku}</td>
              <td className="px-4 py-3 text-sm font-medium">{i.name}</td>
              <td className="px-4 py-3 text-sm">{i.category}</td>
              <td className="px-4 py-3 text-sm font-bold">{i.qty}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{i.min_qty}</td>
              <td className="px-4 py-3 text-sm">${i.cost}</td>
              <td className="px-4 py-3 text-sm font-semibold text-green-700">${i.price}</td>
              <td className="px-4 py-3 text-sm">{i.supplier}</td>
              <td className="px-4 py-3 text-sm">{i.warehouse}</td>
              <td className="px-4 py-3">{i.qty<i.min_qty?<span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><AlertTriangle className="w-3 h-3"/>Low</span>:<span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">OK</span>}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
