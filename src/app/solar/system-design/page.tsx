"use client";
import { useState } from "react";
import { Sun, Zap, Grid3X3, Calculator, Package } from "lucide-react";

const panels = [
  { brand: "REC Alpha Pure-R", watt: 400, efficiency: 21.6, warranty: 25, price: 280 },
  { brand: "Qcells Q.Peak DUO", watt: 380, efficiency: 20.4, warranty: 25, price: 240 },
  { brand: "Canadian Solar HiKu6", watt: 405, efficiency: 21.3, warranty: 25, price: 250 },
  { brand: "SunPower Maxeon 6", watt: 420, efficiency: 22.8, warranty: 40, price: 380 },
];
const inverters = [
  { brand: "Enphase IQ8+", type: "Micro", power: "300W/panel", warranty: 25, price: 180 },
  { brand: "Enphase IQ8M", type: "Micro", power: "330W/panel", warranty: 25, price: 210 },
  { brand: "SolarEdge SE7600H", type: "String", power: "7.6kW", warranty: 12, price: 1800 },
  { brand: "SolarEdge SE10000H", type: "String", power: "10kW", warranty: 12, price: 2200 },
  { brand: "Tesla Inverter", type: "String", power: "7.6kW", warranty: 12, price: 1700 },
];
const designs = [
  { id: 1, customer: "Garcia Residence", kw: 9.6, panels: 24, annualProd: 14200, roofType: "Comp Shingle", azimuth: "180° S", tilt: 25 },
  { id: 2, customer: "Williams Home", kw: 7.2, panels: 19, annualProd: 10800, roofType: "Tile", azimuth: "195° SSW", tilt: 20 },
  { id: 3, customer: "Johnson Family", kw: 12.0, panels: 29, annualProd: 17400, roofType: "Metal", azimuth: "170° S", tilt: 30 },
];

export default function SystemDesignPage() {
  const [selectedPanel, setSelectedPanel] = useState(0);
  const [systemKW, setSystemKW] = useState(8);
  const panelCount = Math.ceil((systemKW * 1000) / panels[selectedPanel].watt);
  const annualProd = Math.round(systemKW * 1450);
  const sunHours = 5.2;
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8"><h1 className="text-3xl font-bold text-[#0B1F3A]">System Design</h1><p className="text-gray-500 mt-1">Panel placement, string sizing, and production estimation</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-[#0B1F3A] mb-4 flex items-center gap-2"><Grid3X3 size={18} /> Roof Layout</h2>
          <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center"><Sun size={48} className="mx-auto text-gray-400 mb-2" /><p className="text-gray-500 text-sm">Panel layout visualization</p><p className="text-gray-400 text-xs">{panelCount} panels · {systemKW}kW system</p></div>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">{[{l:"System Size",v:`${systemKW}kW`},{l:"Panel Count",v:panelCount.toString()},{l:"Annual Production",v:`${annualProd.toLocaleString()} kWh`},{l:"Daily Avg",v:`${(annualProd/365).toFixed(1)} kWh`}].map((d,i) => <div key={i} className="bg-gray-50 rounded-lg p-3 text-center"><div className="text-xs text-gray-400">{d.l}</div><div className="text-sm font-bold text-[#0B1F3A]">{d.v}</div></div>)}</div>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-[#0B1F3A] mb-3 flex items-center gap-2"><Calculator size={16} /> System Size</h3>
            <input type="range" min={4} max={20} step={0.4} value={systemKW} onChange={e=>setSystemKW(+e.target.value)} className="w-full accent-[#F0A500]" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>4kW</span><span className="font-bold text-[#0B1F3A]">{systemKW}kW</span><span>20kW</span></div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-[#0B1F3A] mb-3 flex items-center gap-2"><Zap size={16} /> Production Estimate</h3>
            <div className="space-y-2">{[{l:"Peak Sun Hours",v:`${sunHours} hrs/day`},{l:"System Efficiency",v:`${panels[selectedPanel].efficiency}%`},{l:"Year 1 Production",v:`${annualProd.toLocaleString()} kWh`},{l:"25-Year Production",v:`${Math.round(annualProd*23.5/1000)}K kWh`}].map((d,i) => <div key={i} className="flex justify-between text-sm"><span className="text-gray-500">{d.l}</span><span className="font-medium">{d.v}</span></div>)}</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">Panel Selection</h2>
          <div className="space-y-2">{panels.map((p,i) => (
            <div key={i} onClick={()=>setSelectedPanel(i)} className={`p-3 rounded-lg border-2 cursor-pointer transition ${selectedPanel===i?"border-[#F0A500] bg-[#F0A500]/5":"border-gray-100 hover:border-gray-200"}`}>
              <div className="flex justify-between"><span className="font-medium text-sm">{p.brand}</span><span className="text-sm font-bold">${p.price}/panel</span></div>
              <div className="flex gap-4 mt-1 text-xs text-gray-500"><span>{p.watt}W</span><span>{p.efficiency}% eff</span><span>{p.warranty}yr warranty</span></div>
            </div>
          ))}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">Inverter Selection</h2>
          <div className="space-y-2">{inverters.map((inv,i) => (
            <div key={i} className="p-3 rounded-lg border border-gray-100 hover:border-[#F0A500] cursor-pointer transition">
              <div className="flex justify-between"><span className="font-medium text-sm">{inv.brand}</span><span className="text-sm font-bold">${inv.price}</span></div>
              <div className="flex gap-4 mt-1 text-xs text-gray-500"><span>{inv.type}</span><span>{inv.power}</span><span>{inv.warranty}yr warranty</span></div>
            </div>
          ))}</div>
        </div>
      </div>
    </div>
  );
}
