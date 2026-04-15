"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { ClipboardCheck, MapPin, Clock, TrendingUp, Search, Plus, Calendar, User } from "lucide-react";

const mockSurveys = [
  { id: 1, customer: "Patterson Home", address: "1234 Oak Dr, Dallas TX", date: "2024-04-15", surveyor: "Mike Torres", status: "completed", propertyType: "Single Family", entryPoints: 8, existingEquipment: "ADT Panel (old)", wifiStrength: "Strong", recommended: "Qolsys IQ4 + 10 sensors + 2 cameras" },
  { id: 2, customer: "Chen Residence", address: "5678 Elm Ave, Plano TX", date: "2024-04-16", surveyor: "Sarah Kim", status: "scheduled", propertyType: "Townhouse", entryPoints: 5, existingEquipment: "None", wifiStrength: "Moderate", recommended: "Pending" },
  { id: 3, customer: "Roberts Family", address: "9012 Pine Ln, Frisco TX", date: "2024-04-14", surveyor: "Mike Torres", status: "needs_review", propertyType: "Single Family", entryPoints: 12, existingEquipment: "SimpliSafe DIY", wifiStrength: "Weak - needs extender", recommended: "2GIG Edge + 14 sensors + mesh WiFi" },
  { id: 4, customer: "Blake Commercial", address: "3456 Business Pkwy, McKinney TX", date: "2024-04-17", surveyor: "James Reid", status: "scheduled", propertyType: "Commercial", entryPoints: 20, existingEquipment: "Legacy Honeywell", wifiStrength: "Strong", recommended: "Pending" },
  { id: 5, customer: "Nguyen Home", address: "7890 Maple Ct, Allen TX", date: "2024-04-13", surveyor: "Sarah Kim", status: "completed", propertyType: "Single Family", entryPoints: 7, existingEquipment: "Ring DIY", wifiStrength: "Strong", recommended: "Qolsys IQ4 + 8 sensors + doorbell cam" },
];

export default function SiteSurveysPage() {
  const [surveys, setSurveys] = useState(mockSurveys);
  const [expanded, setExpanded] = useState<number|null>(null);
  const [filter, setFilter] = useState("all");
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("security_site_surveys").select("*").eq("org_id", ORG_ID);
      if (data && data.length > 0) setSurveys(data);
    })();
  }, []);
  const filtered = surveys.filter(s => filter === "all" || s.status === filter);
  const statusColors: Record<string,string> = { completed: "bg-green-100 text-green-700", scheduled: "bg-blue-100 text-blue-700", needs_review: "bg-yellow-100 text-yellow-700" };
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-3xl font-bold text-[#0B1F3A]">Site Surveys</h1><p className="text-gray-500 mt-1">Pre-installation property assessments and equipment recommendations</p></div>
        <button className="bg-[#F0A500] text-[#0B1F3A] font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-500"><Plus size={18} /> Schedule Survey</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{label:"Surveys This Week",value:"8",icon:ClipboardCheck},{label:"Avg Survey Time",value:"45 min",icon:Clock},{label:"Conversion Rate",value:"78%",icon:TrendingUp},{label:"Pending Reviews",value:surveys.filter(s=>s.status==="needs_review").length.toString(),icon:Search}].map((s,i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-1"><s.icon size={16} className="text-[#F0A500]" /><span className="text-xs text-gray-500">{s.label}</span></div><div className="text-2xl font-bold text-[#0B1F3A]">{s.value}</div></div>
        ))}
      </div>
      <div className="flex gap-2 mb-4">{["all","scheduled","completed","needs_review"].map(f => <button key={f} onClick={()=>setFilter(f)} className={`px-3 py-2 rounded-lg text-xs font-medium capitalize ${filter===f?"bg-[#0B1F3A] text-white":"bg-white text-gray-600 hover:bg-gray-100"}`}>{f.replace("_"," ")}</button>)}</div>
      <div className="space-y-3">{filtered.map(s => (
        <div key={s.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50" onClick={()=>setExpanded(expanded===s.id?null:s.id)}>
            <div className="flex items-center gap-4"><div><div className="font-medium text-[#0B1F3A]">{s.customer}</div><div className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={12} />{s.address}</div></div></div>
            <div className="flex items-center gap-4"><div className="text-right"><div className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={12} />{s.date}</div><div className="text-xs text-gray-400 flex items-center gap-1"><User size={12} />{s.surveyor}</div></div><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[s.status]||""}`}>{s.status.replace("_"," ")}</span></div>
          </div>
          {expanded === s.id && (
            <div className="px-4 pb-4 border-t border-gray-100 pt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><span className="text-xs text-gray-400 block">Property Type</span><span className="text-sm font-medium">{s.propertyType}</span></div>
              <div><span className="text-xs text-gray-400 block">Entry Points</span><span className="text-sm font-medium">{s.entryPoints}</span></div>
              <div><span className="text-xs text-gray-400 block">Existing Equipment</span><span className="text-sm font-medium">{s.existingEquipment}</span></div>
              <div><span className="text-xs text-gray-400 block">WiFi Strength</span><span className="text-sm font-medium">{s.wifiStrength}</span></div>
              <div className="col-span-2 md:col-span-4"><span className="text-xs text-gray-400 block">Recommended System</span><span className="text-sm font-medium text-[#007A67]">{s.recommended}</span></div>
            </div>
          )}
        </div>
      ))}</div>
    </div>
  );
}
