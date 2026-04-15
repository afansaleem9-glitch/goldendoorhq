"use client";
import { useState } from "react";
import { Eye, Camera, CheckCircle, AlertTriangle, Clock, Play, Shield, Wifi } from "lucide-react";

const cameras = [
  { name: "Front Door", location: "4521 Oak Lane", status: "online", lastEvent: "2 min ago" },
  { name: "Backyard", location: "4521 Oak Lane", status: "online", lastEvent: "15 min ago" },
  { name: "Garage", location: "7892 Elm St", status: "online", lastEvent: "1 hr ago" },
  { name: "Driveway", location: "1234 Birch Ave", status: "offline", lastEvent: "3 hrs ago" },
  { name: "Side Gate", location: "5678 Pine Ct", status: "online", lastEvent: "30 min ago" },
  { name: "Front Porch", location: "9012 Cedar Blvd", status: "online", lastEvent: "5 min ago" },
];
const alarmEvents = [
  { id: 1, customer: "Johnson Family", zone: "Zone 3 - Motion", time: "2 min ago", verified: false, type: "intrusion", priority: "high" },
  { id: 2, customer: "Garcia Family", zone: "Zone 1 - Front Door", time: "8 min ago", verified: true, type: "entry", priority: "medium", result: "Homeowner" },
  { id: 3, customer: "Thompson LLC", zone: "Zone 5 - Glass Break", time: "15 min ago", verified: true, type: "glass_break", priority: "high", result: "False Alarm" },
  { id: 4, customer: "Williams Home", zone: "Zone 2 - Back Door", time: "25 min ago", verified: true, type: "entry", priority: "low", result: "Delivery" },
  { id: 5, customer: "Anderson Home", zone: "Zone 4 - Smoke", time: "1 hr ago", verified: true, type: "fire", priority: "critical", result: "Dispatched" },
];

export default function VideoVerificationPage() {
  const [tab, setTab] = useState<"cameras"|"queue"|"events">("queue");
  const priorityColors: Record<string,string> = { critical: "bg-red-100 text-red-700", high: "bg-orange-100 text-orange-700", medium: "bg-yellow-100 text-yellow-700", low: "bg-green-100 text-green-700" };
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8"><h1 className="text-3xl font-bold text-[#0B1F3A]">Video Verification</h1><p className="text-gray-500 mt-1">Camera feeds, alarm verification, and event management</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{ label: "Verified Today", value: "47", icon: CheckCircle, color: "text-green-500" },{ label: "False Alarm Rate", value: "12%", icon: AlertTriangle, color: "text-yellow-500" },{ label: "Avg Response", value: "28s", icon: Clock, color: "text-blue-500" },{ label: "Cameras Online", value: `${cameras.filter(c=>c.status==="online").length}/${cameras.length}`, icon: Camera, color: "text-purple-500" }].map((s,i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-1"><s.icon size={16} className={s.color} /><span className="text-xs text-gray-500">{s.label}</span></div><div className="text-2xl font-bold text-[#0B1F3A]">{s.value}</div></div>
        ))}
      </div>
      <div className="flex gap-2 mb-4">{(["queue","cameras","events"] as const).map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${tab===t?"bg-[#0B1F3A] text-white":"bg-white text-gray-600 hover:bg-gray-100"}`}>{t === "queue" ? "Verification Queue" : t}</button>)}</div>
      {tab === "queue" && (
        <div className="space-y-3">{alarmEvents.filter(e=>!e.verified).map(e => (
          <div key={e.id} className="bg-white rounded-xl border-2 border-red-200 p-4 shadow-sm animate-pulse">
            <div className="flex items-center justify-between"><div><span className="font-bold text-[#0B1F3A]">{e.customer}</span><span className="text-sm text-gray-500 ml-3">{e.zone}</span><span className={`ml-3 px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[e.priority]}`}>{e.priority}</span></div><div className="flex gap-2"><button className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium">Verify Safe</button><button className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium">Dispatch</button></div></div>
            <div className="mt-3 grid grid-cols-2 gap-3">{[1,2].map(n => <div key={n} className="bg-gray-900 rounded-lg h-32 flex items-center justify-center"><Play size={24} className="text-white opacity-50" /></div>)}</div>
          </div>
        ))}
        {alarmEvents.filter(e=>!e.verified).length === 0 && <div className="bg-white rounded-xl p-8 text-center"><CheckCircle size={48} className="mx-auto text-green-500 mb-3" /><p className="text-gray-500">All alarms verified — queue is clear</p></div>}
        </div>
      )}
      {tab === "cameras" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{cameras.map((c,i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-900 h-40 flex items-center justify-center relative"><Camera size={32} className="text-gray-600" /><div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${c.status==="online"?"bg-green-500":"bg-red-500"}`} /></div>
            <div className="p-3"><div className="font-medium text-[#0B1F3A]">{c.name}</div><div className="text-xs text-gray-500">{c.location}</div><div className="text-xs text-gray-400 mt-1">Last event: {c.lastEvent}</div></div>
          </div>
        ))}</div>
      )}
      {tab === "events" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"><table className="w-full text-sm"><thead><tr className="border-b border-gray-100">{["Customer","Zone","Type","Priority","Time","Result"].map(h => <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead><tbody>{alarmEvents.filter(e=>e.verified).map(e => (
          <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50"><td className="py-3 px-3 font-medium">{e.customer}</td><td className="py-3 px-3 text-gray-600">{e.zone}</td><td className="py-3 px-3 capitalize">{e.type.replace("_"," ")}</td><td className="py-3 px-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[e.priority]}`}>{e.priority}</span></td><td className="py-3 px-3 text-gray-500">{e.time}</td><td className="py-3 px-3 font-medium">{e.result}</td></tr>
        ))}</tbody></table></div>
      )}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[{name:"Alarm.com",desc:"Primary video platform",status:"Connected"},{name:"OpenEye",desc:"Commercial video analytics",status:"Available"},{name:"Eagle Eye Networks",desc:"Cloud video surveillance",status:"Available"}].map((p,i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-3"><div className="p-2 rounded-lg bg-purple-100"><Eye size={18} className="text-purple-600" /></div><div className="flex-1"><div className="font-medium text-[#0B1F3A]">{p.name}</div><div className="text-xs text-gray-500">{p.desc}</div></div><span className={`text-xs font-medium px-2 py-1 rounded-full ${p.status==="Connected"?"bg-green-100 text-green-700":"bg-gray-100 text-gray-600"}`}>{p.status}</span></div>
        ))}
      </div>
    </div>
  );
}
