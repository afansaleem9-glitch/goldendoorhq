"use client";
import { useState } from "react";
import { Package, Plus, Search, Truck, CheckCircle, Clock, AlertTriangle, DollarSign, ExternalLink } from "lucide-react";

const ORDERS = [
  { id:"1",order_number:"PO-2024-089",supplier:"ABC Supply",job:"Williams Home",items:"34sq GAF Timberline HDZ, Ice & Water, Starter, Ridge Cap, Felt",total:7480,status:"delivered",ordered:"2024-04-08",eta:"2024-04-10",delivered:"2024-04-10",branch:"Dallas #142" },
  { id:"2",order_number:"PO-2024-090",supplier:"SRS Distribution",job:"Anderson LLC",items:"85sq Firestone SBS, Adhesive, Primer, Metal Edge, Drain Boots",total:21250,status:"in_transit",ordered:"2024-04-10",eta:"2024-04-16",delivered:"",branch:"Columbus #23" },
  { id:"3",order_number:"PO-2024-091",supplier:"ABC Supply",job:"Johnson Family",items:"28sq GAF Timberline HDZ, Starter, Ridge Cap, Ventilation Kit",total:6440,status:"delivered",ordered:"2024-04-09",eta:"2024-04-11",delivered:"2024-04-11",branch:"Dallas #142" },
  { id:"4",order_number:"PO-2024-092",supplier:"QXO",job:"Smith Residence",items:"22sq 24ga Standing Seam Panels, Clips, Underlayment, Trim",total:15400,status:"processing",ordered:"2024-04-14",eta:"2024-04-20",delivered:"",branch:"Columbus #8" },
  { id:"5",order_number:"PO-2024-093",supplier:"ABC Supply",job:"Brown Corp",items:"120sq Carlisle TPO 60mil, Adhesive, Fasteners, Edge Metal, Drains",total:36000,status:"pending",ordered:"2024-04-15",eta:"2024-04-22",delivered:"",branch:"Dallas #142" },
  { id:"6",order_number:"PO-2024-094",supplier:"Tesla",job:"Smith Residence",items:"22sq Tesla Solar Glass Tiles, Mounting Hardware, Powerwall",total:28600,status:"processing",ordered:"2024-04-12",eta:"2024-05-01",delivered:"",branch:"Tesla Factory Direct" },
];

export default function MaterialsPage() {
  const [orders] = useState(ORDERS);
  const [search, setSearch] = useState("");
  const filtered = orders.filter(o=>o.job.toLowerCase().includes(search.toLowerCase())||o.supplier.toLowerCase().includes(search.toLowerCase())||o.order_number.toLowerCase().includes(search.toLowerCase()));
  const statusColor: Record<string,string> = { delivered:"bg-green-100 text-green-700",in_transit:"bg-blue-100 text-blue-700",processing:"bg-yellow-100 text-yellow-700",pending:"bg-gray-100 text-gray-600" };
  const supplierColor: Record<string,string> = { "ABC Supply":"bg-red-600","SRS Distribution":"bg-blue-600",QXO:"bg-purple-600",Tesla:"bg-gray-900" };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-sky-600 to-sky-800 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div><div className="flex items-center gap-3 mb-2"><Package className="w-8 h-8"/><h1 className="text-3xl font-bold">Materials & Orders</h1></div>
            <p className="text-sky-200">Real-time catalog, pricing, and direct ordering from ABC Supply, SRS Distribution, QXO, and Tesla.</p></div>
          <button className="bg-white text-sky-700 px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2"><Plus className="w-5 h-5"/> New Order</button>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[{label:"Total Orders",val:orders.length},{label:"Order Value",val:`$${(orders.reduce((a,o)=>a+o.total,0)/1000).toFixed(0)}K`},{label:"Delivered",val:orders.filter(o=>o.status==="delivered").length},{label:"In Transit",val:orders.filter(o=>o.status==="in_transit").length}].map(s=><div key={s.label} className="bg-white/10 rounded-xl p-4"><div className="text-2xl font-bold">{s.val}</div><div className="text-sky-200 text-sm">{s.label}</div></div>)}
        </div>
      </div>
      <div className="relative mb-6"><Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search orders..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"/></div>
      <div className="space-y-3">
        {filtered.map(o=>(
          <div key={o.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 ${supplierColor[o.supplier]||"bg-gray-600"} rounded-lg flex items-center justify-center text-white font-bold text-xs`}>{o.supplier.split(" ")[0].substring(0,3)}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{o.order_number} — {o.job}</h3>
                  <p className="text-sm text-gray-500">{o.supplier} • Branch: {o.branch}</p>
                  <p className="text-xs text-gray-400 mt-1">{o.items}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right"><div className="text-lg font-bold">${o.total.toLocaleString()}</div><div className="text-xs text-gray-500">ETA: {o.eta}</div></div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[o.status]}`}>{o.status.replace("_"," ")}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
