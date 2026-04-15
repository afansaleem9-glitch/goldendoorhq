"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { Package, Plus, Search, Truck, Clock, CheckCircle, DollarSign, ShoppingCart, RefreshCw, MapPin, AlertTriangle } from "lucide-react";

interface MaterialOrder {
  id: string; po_number: string; supplier: string; job: string; customer: string; status: string;
  ordered_date: string; delivery_date: string; total: number;
  items: { product: string; qty: number; unit: string; price: number; total: number }[];
  delivery_address: string; notes: string;
}

const SUPPLIERS = [
  { name: "ABC Supply", logo: "🔶", desc: "America's largest roofing distributor", branches: "800+ locations", features: ["Real-time Inventory","Preferred Pricing","Same-Day Delivery","Credit Terms"] },
  { name: "SRS Distribution", logo: "🔷", desc: "Full-line roofing materials", branches: "700+ locations", features: ["Online Ordering","Boom Truck","Material Lists","Returns"] },
  { name: "QXO / Beacon", logo: "🟢", desc: "Major roofing & exterior products", branches: "600+ locations", features: ["Digital Catalog","Job Delivery","Loyalty Program","Tech Support"] }
];

const MOCK: MaterialOrder[] = [
  { id:"1",po_number:"PO-2024-0145",supplier:"ABC Supply",job:"RJ-2024-089",customer:"Williams Home",status:"delivered",ordered_date:"2024-03-18",delivery_date:"2024-03-20",total:6230,delivery_address:"789 Pine St, Detroit MI",notes:"Boom truck requested. Deliver to driveway.",
    items:[{product:"GAF Timberline HDZ — Charcoal (28 sq)",qty:96,unit:"bundles",price:42.50,total:4080},{product:"GAF WeatherWatch Ice & Water",qty:6,unit:"rolls",price:89,total:534},{product:"GAF FeltBuster Synthetic Underlayment",qty:8,unit:"rolls",price:62,total:496},{product:"GAF TimberTex Ridge Cap",qty:4,unit:"bundles",price:65,total:260},{product:"Drip Edge 2x2 — White",qty:32,unit:"10ft pcs",price:8.50,total:272},{product:"Pipe Boot Flashings",qty:6,unit:"each",price:28,total:168},{product:"Roofing Nails — Coil",qty:4,unit:"boxes",price:105,total:420}]},
  { id:"2",po_number:"PO-2024-0148",supplier:"SRS Distribution",job:"RJ-2024-090",customer:"Johnson Family",status:"in_transit",ordered_date:"2024-03-24",delivery_date:"2024-03-26",total:8200,delivery_address:"4521 Oak Ave, Dallas TX",notes:"Delivery before 7AM. Gate code: 4521.",
    items:[{product:"GAF Timberline UHDZ — Weathered Wood (35 sq)",qty:120,unit:"bundles",price:48.75,total:5850},{product:"Synthetic Underlayment",qty:10,unit:"rolls",price:62,total:620},{product:"Ridge Vent — ShingleVent II",qty:9,unit:"4ft pcs",price:18,total:162},{product:"Ice & Water Shield",qty:8,unit:"rolls",price:89,total:712},{product:"Starter Strip Plus",qty:12,unit:"bundles",price:35,total:420},{product:"Step Flashing Kit",qty:2,unit:"kits",price:65,total:130},{product:"Roofing Nails + Misc Hardware",qty:1,unit:"lot",price:306,total:306}]},
  { id:"3",po_number:"PO-2024-0152",supplier:"QXO / Beacon",job:"RJ-2024-091",customer:"Brown Corp",status:"processing",ordered_date:"2024-03-25",delivery_date:"2024-03-28",total:22500,delivery_address:"500 Commerce Blvd, Dallas TX",notes:"Crane delivery required. Contact site foreman.",
    items:[{product:"Carlisle TPO Membrane 60mil White (82 sq)",qty:82,unit:"squares",price:185,total:15170},{product:"Polyiso Insulation 2.5\" R-16",qty:164,unit:"4x8 sheets",price:28,total:4592},{product:"Metal Edge & Coping — 24ga",qty:64,unit:"10ft pcs",price:32,total:2048},{product:"TPO Bonding Adhesive",qty:20,unit:"5gal",price:34.50,total:690}]},
  { id:"4",po_number:"PO-2024-0139",supplier:"ABC Supply",job:"RJ-2024-085",customer:"Garcia Residence",status:"delivered",ordered_date:"2024-03-14",delivery_date:"2024-03-15",total:4800,delivery_address:"6789 Cedar Ln, Dallas TX",notes:"",
    items:[{product:"OC Duration — Estate Gray (22 sq)",qty:75,unit:"bundles",price:38.50,total:2888},{product:"Synthetic Underlayment",qty:7,unit:"rolls",price:62,total:434},{product:"Ice & Water Shield",qty:4,unit:"rolls",price:89,total:356},{product:"Ridge Cap + Starter + Accessories",qty:1,unit:"lot",price:1122,total:1122}]},
  { id:"5",po_number:"PO-2024-0155",supplier:"ABC Supply",job:"RJ-2024-095",customer:"Anderson Property",status:"pending",ordered_date:"2024-03-26",delivery_date:"TBD",total:5600,delivery_address:"321 Spruce St, Detroit MI",notes:"Waiting on measurement report.",
    items:[{product:"CertainTeed Landmark — Moire Black (25 sq)",qty:85,unit:"bundles",price:40,total:3400},{product:"Full Accessory Package",qty:1,unit:"lot",price:2200,total:2200}]}
];

export default function MaterialOrderingPage() {
  const [orders, setOrders] = useState(MOCK);
  const [search, setSearch] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("All");
  const [showOrder, setShowOrder] = useState(false);
  const [expanded, setExpanded] = useState<string|null>(null);

  useEffect(() => { supabase.from("roofing_materials").select("*").eq("org_id", ORG_ID).then(({ data }) => { if (data?.length) setOrders(data as any); }); }, []);

  const filtered = orders.filter(o => (supplierFilter === "All" || o.supplier === supplierFilter) && (o.customer.toLowerCase().includes(search.toLowerCase()) || o.po_number.toLowerCase().includes(search.toLowerCase())));
  const statusIcon = (s: string) => s === "delivered" ? <CheckCircle size={14} className="text-green-600"/> : s === "in_transit" ? <Truck size={14} className="text-blue-600"/> : s === "processing" ? <RefreshCw size={14} className="text-yellow-600"/> : <Clock size={14} className="text-gray-400"/>;
  const statusStyle = (s: string) => s === "delivered" ? "bg-green-100 text-green-700" : s === "in_transit" ? "bg-blue-100 text-blue-700" : s === "processing" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600";

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-[#0B1F3A] flex items-center gap-2"><ShoppingCart className="text-[#F0A500]" size={28}/>Material Ordering</h1><p className="text-gray-500 mt-1">ABC Supply, SRS Distribution & QXO real-time ordering with preferred pricing</p></div>
        <button onClick={()=>setShowOrder(true)} className="bg-[#F0A500] text-[#0B1F3A] px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-yellow-500"><Plus size={18}/>New Order</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SUPPLIERS.map(s=>(
          <div key={s.name} className="bg-white rounded-xl border p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2"><span className="text-2xl">{s.logo}</span><div><h3 className="font-bold text-[#0B1F3A]">{s.name}</h3><p className="text-[10px] text-gray-500">{s.desc}</p></div></div>
            <p className="text-xs text-gray-400 mb-2">{s.branches}</p>
            <div className="flex flex-wrap gap-1">{s.features.map(f=><span key={f} className="bg-gray-100 px-2 py-0.5 rounded text-[10px] text-gray-600">{f}</span>)}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[{l:"Total Orders",v:orders.length,c:"text-blue-600"},{l:"Pending",v:orders.filter(o=>o.status==="pending"||o.status==="processing").length,c:"text-yellow-600"},{l:"In Transit",v:orders.filter(o=>o.status==="in_transit").length,c:"text-purple-600"},{l:"Total Spend",v:`$${(orders.reduce((s,o)=>s+o.total,0)/1000).toFixed(1)}K`,c:"text-green-600"}].map((s,i)=>(
          <div key={i} className="bg-white rounded-xl border p-4 text-center"><p className={`text-2xl font-bold ${s.c}`}>{s.v}</p><p className="text-xs text-gray-500 mt-1">{s.l}</p></div>
        ))}
      </div>

      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-xs"><Search className="absolute left-3 top-2.5 text-gray-400" size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search orders..." className="pl-9 pr-3 py-2 border rounded-lg w-full text-sm"/></div>
        {["All",...SUPPLIERS.map(s=>s.name)].map(s=><button key={s} onClick={()=>setSupplierFilter(s)} className={`px-3 py-1.5 rounded-full text-xs font-medium ${supplierFilter===s?"bg-[#0B1F3A] text-white":"bg-gray-100 text-gray-600"}`}>{s}</button>)}
      </div>

      <div className="space-y-3">
        {filtered.map(o=>(
          <div key={o.id} className="bg-white rounded-xl border overflow-hidden">
            <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50" onClick={()=>setExpanded(expanded===o.id?null:o.id)}>
              {statusIcon(o.status)}
              <div className="flex-1">
                <div className="flex items-center gap-2"><span className="font-mono text-xs text-gray-400">{o.po_number}</span><span className="text-xs text-gray-400">→</span><span className="font-mono text-xs text-gray-400">{o.job}</span><h3 className="font-semibold text-[#0B1F3A]">{o.customer}</h3><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusStyle(o.status)}`}>{o.status.replace("_"," ")}</span></div>
                <p className="text-xs text-gray-500 mt-0.5">{o.supplier} · Delivery: {o.delivery_date} · <MapPin size={10} className="inline"/>{o.delivery_address}</p>
              </div>
              <p className="text-lg font-bold text-[#0B1F3A]">${o.total.toLocaleString()}</p>
            </div>
            {expanded === o.id && (
              <div className="border-t px-4 py-3 bg-gray-50">
                <table className="w-full text-xs"><thead><tr className="text-gray-500 border-b"><th className="text-left py-1">Product</th><th className="text-right py-1">Qty</th><th className="text-right py-1">Unit</th><th className="text-right py-1">Price</th><th className="text-right py-1">Total</th></tr></thead><tbody>
                  {o.items.map((item,i)=><tr key={i} className="border-b border-gray-100"><td className="py-1.5">{item.product}</td><td className="text-right">{item.qty}</td><td className="text-right text-gray-500">{item.unit}</td><td className="text-right font-mono">${item.price.toFixed(2)}</td><td className="text-right font-mono font-bold">${item.total.toLocaleString()}</td></tr>)}
                </tbody></table>
                {o.notes && <p className="text-xs text-gray-500 mt-2 italic">📝 {o.notes}</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      {showOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={()=>setShowOrder(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg" onClick={e=>e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">New Material Order</h2>
            <div className="space-y-3">
              <select className="w-full border rounded-lg p-2 text-sm"><option value="">Select Supplier</option>{SUPPLIERS.map(s=><option key={s.name}>{s.name}</option>)}</select>
              <select className="w-full border rounded-lg p-2 text-sm"><option value="">Link to Job</option><option>RJ-2024-089 — Williams Home</option><option>RJ-2024-090 — Johnson Family</option><option>RJ-2024-091 — Brown Corp</option></select>
              <input placeholder="Delivery Address" className="w-full border rounded-lg p-2 text-sm"/>
              <input type="date" className="w-full border rounded-lg p-2 text-sm"/>
              <textarea placeholder="Special delivery instructions..." className="w-full border rounded-lg p-2 text-sm" rows={2}/>
              <div className="border rounded-lg p-3 bg-gray-50"><p className="text-xs font-medium text-gray-600 mb-2">Order Items</p>
                <div className="grid grid-cols-4 gap-2 text-xs"><input placeholder="Product" className="col-span-2 border rounded p-1"/><input placeholder="Qty" type="number" className="border rounded p-1"/><input placeholder="Price" type="number" className="border rounded p-1"/></div>
                <button className="text-xs text-blue-600 mt-2 flex items-center gap-1"><Plus size={12}/>Add Item</button>
              </div>
            </div>
            <div className="flex gap-3 mt-4"><button onClick={()=>setShowOrder(false)} className="flex-1 border rounded-lg py-2 text-sm">Cancel</button><button onClick={()=>setShowOrder(false)} className="flex-1 bg-[#F0A500] text-[#0B1F3A] rounded-lg py-2 text-sm font-semibold">Place Order</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
