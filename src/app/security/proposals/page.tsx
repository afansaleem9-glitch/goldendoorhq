"use client";
import { useState } from "react";
import { FileText, Plus, Search, DollarSign, Send, Eye, CheckCircle, Clock, ChevronDown, ChevronRight } from "lucide-react";

const MOCK = [
  { id:"1",customer:"Taylor Home",address:"8901 Walnut Ct, Dallas TX",rep:"James Bond",status:"sent",created:"2024-03-20",
    tiers:[
      { name:"Good",price:2499,monthly:29.99,equipment:"10 sensors, 2 cameras, IQ2 Panel",monitoring:"Basic 24/7" },
      { name:"Better",price:3999,monthly:49.99,equipment:"18 sensors, 6 cameras, IQ4 Panel, Doorbell",monitoring:"Interactive + Video" },
      { name:"Best",price:6499,monthly:69.99,equipment:"22 sensors, 10 cameras, IQ4 Panel, Doorbell, Smart Locks, Thermostat",monitoring:"Premium Smart Home" },
    ]},
  { id:"2",customer:"Chen Residence",address:"345 Lotus Ln, Columbus OH",rep:"Sarah Thompson",status:"accepted",created:"2024-03-18",
    tiers:[
      { name:"Good",price:1999,monthly:29.99,equipment:"8 sensors, IQ2 Panel",monitoring:"Basic 24/7" },
      { name:"Better",price:3499,monthly:49.99,equipment:"16 sensors, 4 cameras, IQ4 Panel",monitoring:"Interactive + Video" },
      { name:"Best",price:5299,monthly:59.99,equipment:"20 sensors, 8 cameras, IQ4 Panel, Smart Lock",monitoring:"Premium Interactive" },
    ]},
  { id:"3",customer:"Wilson Corp",address:"200 Tech Park, Dallas TX",rep:"Mike Chen",status:"draft",created:"2024-03-22",
    tiers:[
      { name:"Standard",price:18000,monthly:299.99,equipment:"48 sensors, 16 cameras, DMP XR550",monitoring:"Enterprise 24/7" },
      { name:"Enhanced",price:28000,monthly:399.99,equipment:"64 sensors, 24 cameras, DMP, Access Control 6 doors",monitoring:"Enterprise + Access" },
      { name:"Premium",price:45000,monthly:499.99,equipment:"Full build-out, 12 doors access, intercom",monitoring:"Enterprise Premium" },
    ]},
  { id:"4",customer:"Robinson Home",address:"7788 Hill St, Detroit MI",rep:"James Bond",status:"sent",created:"2024-03-19",
    tiers:[
      { name:"Good",price:1799,monthly:29.99,equipment:"8 sensors, DSC Neo Panel",monitoring:"Basic 24/7" },
      { name:"Better",price:2999,monthly:39.99,equipment:"14 sensors, 4 cameras, QS IQ4",monitoring:"Standard Interactive" },
      { name:"Best",price:4499,monthly:49.99,equipment:"16 sensors, 6 cameras, QS IQ4, Doorbell, Lock",monitoring:"Premium Interactive" },
    ]},
];

export default function ProposalsPage() {
  const [proposals] = useState(MOCK);
  const [expanded, setExpanded] = useState<string|null>(null);
  const [search, setSearch] = useState("");
  const filtered = proposals.filter(p=>p.customer.toLowerCase().includes(search.toLowerCase()));
  const statusColor: Record<string,string> = { draft:"bg-gray-100 text-gray-700",sent:"bg-blue-100 text-blue-700",accepted:"bg-green-100 text-green-700",expired:"bg-red-100 text-red-700" };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div><div className="flex items-center gap-3 mb-2"><FileText className="w-8 h-8"/><h1 className="text-3xl font-bold">Proposals</h1></div>
            <p className="text-purple-200">Three-tier Good/Better/Best proposals with equipment configs and financing.</p></div>
          <button className="bg-white text-purple-700 px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2"><Plus className="w-5 h-5"/> New Proposal</button>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[{label:"Total",val:proposals.length},{label:"Sent",val:proposals.filter(p=>p.status==="sent").length},{label:"Accepted",val:proposals.filter(p=>p.status==="accepted").length},{label:"Win Rate",val:"62%"}].map(s=><div key={s.label} className="bg-white/10 rounded-xl p-4"><div className="text-2xl font-bold">{s.val}</div><div className="text-purple-200 text-sm">{s.label}</div></div>)}
        </div>
      </div>
      <div className="relative mb-6"><Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search proposals..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"/></div>
      <div className="space-y-3">
        {filtered.map(p=>(
          <div key={p.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-5 cursor-pointer hover:bg-gray-50" onClick={()=>setExpanded(expanded===p.id?null:p.id)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">{expanded===p.id?<ChevronDown className="w-5 h-5 text-gray-400"/>:<ChevronRight className="w-5 h-5 text-gray-400"/>}<div><h3 className="font-semibold text-gray-900">{p.customer}</h3><p className="text-sm text-gray-500">{p.address} • Rep: {p.rep} • {p.created}</p></div></div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[p.status]}`}>{p.status}</span>
              </div>
            </div>
            {expanded===p.id&&(
              <div className="border-t border-gray-200 p-5 bg-gray-50">
                <div className="grid grid-cols-3 gap-4">
                  {p.tiers.map((t,i)=>(
                    <div key={i} className={`rounded-xl border-2 p-5 ${i===1?"border-purple-500 bg-white shadow-lg":"border-gray-200 bg-white"}`}>
                      {i===1&&<div className="text-xs font-bold text-purple-600 mb-2">⭐ MOST POPULAR</div>}
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{t.name}</h4>
                      <div className="text-3xl font-bold text-gray-900 mb-1">${t.price.toLocaleString()}</div>
                      <div className="text-sm text-gray-500 mb-3">${t.monthly}/mo monitoring</div>
                      <div className="text-xs text-gray-600 mb-2"><strong>Equipment:</strong> {t.equipment}</div>
                      <div className="text-xs text-gray-600"><strong>Monitoring:</strong> {t.monitoring}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium"><Send className="w-4 h-4 inline mr-1"/>Send to Customer</button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium">Download PDF</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
