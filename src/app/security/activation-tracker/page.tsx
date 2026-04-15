"use client";
import { useState } from "react";
import { CheckCircle, Clock, Package, Wrench, Radio, ArrowRight, Filter } from "lucide-react";

const stages = ["Sold", "Survey", "Install Scheduled", "Equipment Ordered", "Installed", "Activated", "Monitoring Live"];
const stageColors = ["bg-blue-500", "bg-purple-500", "bg-yellow-500", "bg-orange-500", "bg-teal-500", "bg-green-500", "bg-emerald-600"];
const activations = [
  { id: 1, customer: "Patterson Home", address: "1234 Oak Dr", system: "Qolsys IQ4", stage: 5, daysInStage: 1, rep: "Mike Torres", soldDate: "2024-04-01" },
  { id: 2, customer: "Chen Residence", address: "5678 Elm Ave", system: "2GIG Edge", stage: 3, daysInStage: 2, rep: "Sarah Kim", soldDate: "2024-04-05" },
  { id: 3, customer: "Blake Commercial", address: "3456 Business Pkwy", system: "Qolsys IQ4", stage: 2, daysInStage: 3, rep: "James Reid", soldDate: "2024-04-08" },
  { id: 4, customer: "Roberts Family", address: "9012 Pine Ln", system: "DSC PowerSeries", stage: 4, daysInStage: 1, rep: "Mike Torres", soldDate: "2024-04-03" },
  { id: 5, customer: "Nguyen Home", address: "7890 Maple Ct", system: "Qolsys IQ4", stage: 6, daysInStage: 0, rep: "Sarah Kim", soldDate: "2024-03-28" },
  { id: 6, customer: "Lee Residence", address: "2345 Cedar Blvd", system: "2GIG Edge", stage: 1, daysInStage: 1, rep: "James Reid", soldDate: "2024-04-12" },
  { id: 7, customer: "Kim Family", address: "6789 Birch Way", system: "Qolsys IQ4", stage: 0, daysInStage: 0, rep: "Mike Torres", soldDate: "2024-04-14" },
  { id: 8, customer: "Patel Home", address: "4567 Spruce Dr", system: "DSC PowerSeries", stage: 6, daysInStage: 0, rep: "Sarah Kim", soldDate: "2024-03-20" },
];

export default function ActivationTrackerPage() {
  const [filterStage, setFilterStage] = useState<number|null>(null);
  const filtered = filterStage !== null ? activations.filter(a => a.stage === filterStage) : activations;
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8"><h1 className="text-3xl font-bold text-[#0B1F3A]">Activation Tracker</h1><p className="text-gray-500 mt-1">Track systems from sale to monitoring-live</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{label:"Activations This Month",value:"34",icon:CheckCircle},{label:"Avg Days to Activate",value:"8.2",icon:Clock},{label:"Pending Installs",value:activations.filter(a=>a.stage<5).length.toString(),icon:Package},{label:"Success Rate",value:"96%",icon:Radio}].map((s,i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-1"><s.icon size={16} className="text-[#F0A500]" /><span className="text-xs text-gray-500">{s.label}</span></div><div className="text-2xl font-bold text-[#0B1F3A]">{s.value}</div></div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-sm font-bold text-gray-500 uppercase mb-4">Pipeline Stages</h2>
        <div className="flex items-center gap-1">{stages.map((s,i) => {const count = activations.filter(a=>a.stage===i).length; return (
          <button key={i} onClick={()=>setFilterStage(filterStage===i?null:i)} className={`flex-1 text-center py-3 rounded-lg transition ${filterStage===i?"ring-2 ring-[#F0A500]":""} ${count>0?"bg-gray-50":"bg-gray-50/50"}`}>
            <div className={`w-6 h-6 rounded-full ${stageColors[i]} text-white text-xs font-bold flex items-center justify-center mx-auto mb-1`}>{count}</div>
            <div className="text-xs text-gray-600 font-medium">{s}</div>
          </button>
        )})}</div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <table className="w-full text-sm"><thead><tr className="border-b border-gray-100">{["Customer","Address","System","Stage","Days in Stage","Rep","Sold Date"].map(h=><th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead><tbody>{filtered.map(a => (
          <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50"><td className="py-3 px-3 font-medium text-[#0B1F3A]">{a.customer}</td><td className="py-3 px-3 text-gray-600">{a.address}</td><td className="py-3 px-3">{a.system}</td><td className="py-3 px-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${stageColors[a.stage]}`}>{stages[a.stage]}</span></td><td className="py-3 px-3">{a.daysInStage}d</td><td className="py-3 px-3 text-gray-500">{a.rep}</td><td className="py-3 px-3 text-gray-500">{a.soldDate}</td></tr>
        ))}</tbody></table>
      </div>
    </div>
  );
}
