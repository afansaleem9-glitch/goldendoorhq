"use client";
import { useState } from "react";
import { Search, Plus, X, AlertTriangle, Tag, Filter } from "lucide-react";

const CATEGORIES = ["All", "Panels", "Sensors", "Cameras", "Locks", "Accessories"];
const MOCK = [
  { id: "1", name: "Qolsys IQ Panel 4", sku: "QOL-IQ4-001", category: "Panels", manufacturer: "Qolsys", cost_price: 280, retail_price: 450, in_stock_qty: 24 },
  { id: "2", name: "DSC PowerG Door/Window", sku: "DSC-PG-DW", category: "Sensors", manufacturer: "DSC", cost_price: 28, retail_price: 55, in_stock_qty: 142 },
  { id: "3", name: "Alarm.com ADC-V523X", sku: "ADC-V523X", category: "Cameras", manufacturer: "Alarm.com", cost_price: 145, retail_price: 249, in_stock_qty: 38 },
  { id: "4", name: "Yale Assure Lock 2", sku: "YAL-ASR2-BLK", category: "Locks", manufacturer: "Yale", cost_price: 180, retail_price: 299, in_stock_qty: 16 },
  { id: "5", name: "DSC PowerG Motion", sku: "DSC-PG-MOT", category: "Sensors", manufacturer: "DSC", cost_price: 35, retail_price: 65, in_stock_qty: 98 },
  { id: "6", name: "Qolsys IQ Panel 2+", sku: "QOL-IQ2P-001", category: "Panels", manufacturer: "Qolsys", cost_price: 210, retail_price: 380, in_stock_qty: 8 },
  { id: "7", name: "Alarm.com ADC-V724X", sku: "ADC-V724X", category: "Cameras", manufacturer: "Alarm.com", cost_price: 195, retail_price: 349, in_stock_qty: 22 },
  { id: "8", name: "DSC PowerG Smoke", sku: "DSC-PG-SMK", category: "Sensors", manufacturer: "DSC", cost_price: 42, retail_price: 79, in_stock_qty: 56 },
  { id: "9", name: "Alarm.com Video Doorbell", sku: "ADC-VDB780", category: "Cameras", manufacturer: "Alarm.com", cost_price: 120, retail_price: 219, in_stock_qty: 31 },
  { id: "10", name: "Z-Wave Repeater", sku: "ZW-RPT-100", category: "Accessories", manufacturer: "Aeotec", cost_price: 25, retail_price: 45, in_stock_qty: 5 },
  { id: "11", name: "PowerG Glass Break", sku: "DSC-PG-GB", category: "Sensors", manufacturer: "DSC", cost_price: 38, retail_price: 72, in_stock_qty: 67 },
  { id: "12", name: "Kwikset Halo Lock", sku: "KWK-HALO-SN", category: "Locks", manufacturer: "Kwikset", cost_price: 155, retail_price: 269, in_stock_qty: 12 },
];

export default function SecurityEquipmentPage() {
  const [items] = useState(MOCK);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const filtered = items.filter(i => {
    const ms = search === "" || i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase());
    const mc = category === "All" || i.category === category;
    return ms && mc;
  });

  const lowStock = items.filter(i => i.in_stock_qty < 10);
  const totalValue = items.reduce((s, i) => s + i.cost_price * i.in_stock_qty, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-900 to-purple-700 text-white px-8 py-8">
        <h1 className="text-2xl font-bold">Security Equipment</h1>
        <p className="text-purple-200 text-sm mt-1">Inventory management for security hardware</p>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-4"><div className="text-xs text-gray-500 mb-1">Total SKUs</div><div className="text-xl font-bold">{items.length}</div></div>
          <div className="bg-white rounded-xl border p-4"><div className="text-xs text-gray-500 mb-1">Total Units</div><div className="text-xl font-bold">{items.reduce((s, i) => s + i.in_stock_qty, 0)}</div></div>
          <div className="bg-white rounded-xl border p-4"><div className="text-xs text-gray-500 mb-1">Inventory Value</div><div className="text-xl font-bold text-green-600">${totalValue.toLocaleString()}</div></div>
          <div className="bg-white rounded-xl border p-4"><div className="text-xs text-gray-500 mb-1">Low Stock Alerts</div><div className="text-xl font-bold text-red-600">{lowStock.length}</div></div>
        </div>
        {lowStock.length > 0 && <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 flex items-center gap-2"><AlertTriangle size={16} className="text-red-500" /><span className="text-sm text-red-700">Low stock: {lowStock.map(i => i.name).join(", ")}</span></div>}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center bg-white rounded-lg border px-3 py-2 flex-1 min-w-[200px]"><Search size={16} className="text-gray-400 mr-2" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search equipment..." className="outline-none text-sm flex-1" /></div>
          <div className="flex gap-1">{CATEGORIES.map(c => <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${category === c ? "bg-purple-600 text-white" : "bg-white border text-gray-600 hover:bg-gray-50"}`}>{c}</button>)}</div>
          <button onClick={() => setShowModal(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"><Plus size={16} />Add Item</button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(i => (
            <div key={i.id} className={`bg-white rounded-xl border p-4 hover:shadow-md transition-shadow ${i.in_stock_qty < 10 ? "border-red-200" : ""}`}>
              <div className="flex justify-between items-start mb-2"><span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-medium">{i.category}</span>{i.in_stock_qty < 10 && <AlertTriangle size={14} className="text-red-500" />}</div>
              <h3 className="font-semibold text-sm">{i.name}</h3>
              <p className="text-xs text-gray-400 font-mono mt-0.5">{i.sku}</p>
              <p className="text-xs text-gray-500 mt-1">{i.manufacturer}</p>
              <div className="flex justify-between items-end mt-3">
                <div><p className="text-xs text-gray-400">Cost / Retail</p><p className="text-sm font-medium">${i.cost_price} / <span className="text-green-600">${i.retail_price}</span></p></div>
                <div className="text-right"><p className="text-xs text-gray-400">In Stock</p><p className={`text-lg font-bold ${i.in_stock_qty < 10 ? "text-red-600" : "text-gray-900"}`}>{i.in_stock_qty}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">Add Equipment</h2><button onClick={() => setShowModal(false)}><X size={20} /></button></div>
            <p className="text-sm text-gray-500 mb-4">Equipment management coming soon — connect to your inventory system.</p>
            <button onClick={() => setShowModal(false)} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
