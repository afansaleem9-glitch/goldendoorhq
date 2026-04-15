"use client";
import { useState } from "react";
import { Wifi, Shield, Camera, Lock, Thermometer, Activity, RefreshCw, CheckCircle, AlertTriangle, Settings } from "lucide-react";

const devices = [
  { name: "IQ4 Panel", type: "panel", location: "Johnson - Front Hall", status: "online", battery: 100, signal: 95 },
  { name: "Door Sensor - Front", type: "sensor", location: "Johnson - Entry", status: "online", battery: 87, signal: 92 },
  { name: "Motion Detector", type: "sensor", location: "Johnson - Living Room", status: "online", battery: 94, signal: 88 },
  { name: "Doorbell Camera", type: "camera", location: "Johnson - Porch", status: "online", battery: null, signal: 96 },
  { name: "Smart Lock", type: "lock", location: "Johnson - Front Door", status: "online", battery: 72, signal: 90 },
  { name: "Thermostat", type: "thermostat", location: "Johnson - Hallway", status: "online", battery: null, signal: 94 },
  { name: "2GIG Edge Panel", type: "panel", location: "Martinez - Kitchen", status: "online", battery: 100, signal: 91 },
  { name: "Smoke Detector", type: "sensor", location: "Martinez - Bedroom", status: "offline", battery: 12, signal: 0 },
  { name: "Outdoor Camera", type: "camera", location: "Williams - Backyard", status: "online", battery: null, signal: 87 },
  { name: "Glass Break", type: "sensor", location: "Williams - Living", status: "online", battery: 65, signal: 78 },
];
const events = [
  { time: "2 min ago", device: "Front Door Sensor", event: "Opened", customer: "Johnson" },
  { time: "5 min ago", device: "Motion Detector", event: "Motion Detected", customer: "Williams" },
  { time: "12 min ago", device: "Smart Lock", event: "Locked", customer: "Johnson" },
  { time: "15 min ago", device: "IQ4 Panel", event: "Armed Away", customer: "Johnson" },
  { time: "30 min ago", device: "Thermostat", event: "Set to 72°F", customer: "Johnson" },
  { time: "1 hr ago", device: "Doorbell Camera", event: "Motion Detected", customer: "Thompson" },
];

export default function AlarmComPage() {
  const [tab, setTab] = useState<"devices"|"events"|"commands">("devices");
  const typeIcons: Record<string,any> = { panel: Shield, sensor: Activity, camera: Camera, lock: Lock, thermostat: Thermometer };
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-3xl font-bold text-[#0B1F3A]">Alarm.com Integration</h1><p className="text-gray-500 mt-1">Device management, remote commands, and event streaming</p></div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /><span className="text-sm text-green-600 font-medium">Connected</span><span className="text-xs text-gray-400 ml-2">Last sync: 30s ago</span></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{label:"Devices Synced",value:devices.length.toString(),icon:Wifi},{label:"Events Today",value:"142",icon:Activity},{label:"Automations Active",value:"23",icon:Settings},{label:"Signal Strength",value:"91%",icon:CheckCircle}].map((s,i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-1"><s.icon size={16} className="text-[#F0A500]" /><span className="text-xs text-gray-500">{s.label}</span></div><div className="text-2xl font-bold text-[#0B1F3A]">{s.value}</div></div>
        ))}
      </div>
      <div className="flex gap-2 mb-4">{(["devices","events","commands"] as const).map(t => <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${tab===t?"bg-[#0B1F3A] text-white":"bg-white text-gray-600 hover:bg-gray-100"}`}>{t}</button>)}</div>
      {tab === "devices" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"><table className="w-full text-sm"><thead><tr className="border-b border-gray-100">{["Device","Type","Location","Status","Battery","Signal"].map(h=><th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead><tbody>{devices.map((d,i)=>{const Icon=typeIcons[d.type]||Activity;return(
          <tr key={i} className="border-b border-gray-50 hover:bg-gray-50"><td className="py-3 px-3 font-medium flex items-center gap-2"><Icon size={14} className="text-[#F0A500]" />{d.name}</td><td className="py-3 px-3 capitalize text-gray-600">{d.type}</td><td className="py-3 px-3 text-gray-500">{d.location}</td><td className="py-3 px-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${d.status==="online"?"bg-green-100 text-green-700":"bg-red-100 text-red-700"}`}>{d.status}</span></td><td className="py-3 px-3">{d.battery !== null ? <div className="flex items-center gap-2"><div className="w-16 h-2 bg-gray-200 rounded-full"><div className={`h-2 rounded-full ${d.battery>50?"bg-green-500":d.battery>20?"bg-yellow-500":"bg-red-500"}`} style={{width:`${d.battery}%`}} /></div><span className="text-xs">{d.battery}%</span></div> : <span className="text-xs text-gray-400">AC</span>}</td><td className="py-3 px-3">{d.signal > 0 ? <span className="text-sm">{d.signal}%</span> : <span className="text-xs text-red-500">No signal</span>}</td></tr>
        )})}</tbody></table></div>
      )}
      {tab === "events" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"><div className="space-y-3">{events.map((e,i)=>(
          <div key={i} className="flex items-center gap-4 py-2 border-b border-gray-50"><span className="text-xs text-gray-400 w-20">{e.time}</span><span className="text-sm font-medium text-[#0B1F3A] w-40">{e.device}</span><span className="text-sm text-gray-600 flex-1">{e.event}</span><span className="text-xs text-gray-400">{e.customer}</span></div>
        ))}</div></div>
      )}
      {tab === "commands" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[{title:"Arm/Disarm",desc:"Remote panel control",icon:Shield,actions:["Arm Away","Arm Stay","Disarm"]},{title:"Locks",desc:"Lock/unlock doors",icon:Lock,actions:["Lock All","Unlock Front","Lock Status"]},{title:"Cameras",desc:"View and record",icon:Camera,actions:["Live View","Record Clip","Snapshot"]},{title:"Thermostat",desc:"Temperature control",icon:Thermometer,actions:["Set 72°F","Set 68°F","Auto Mode"]},{title:"Automations",desc:"Scene triggers",icon:Settings,actions:["Goodnight","Away","Home"]}].map((c,i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"><div className="flex items-center gap-3 mb-3"><div className="p-2 rounded-lg bg-[#0B1F3A]/10"><c.icon size={18} className="text-[#0B1F3A]" /></div><div><div className="font-medium text-[#0B1F3A]">{c.title}</div><div className="text-xs text-gray-400">{c.desc}</div></div></div><div className="space-y-2">{c.actions.map((a,j)=><button key={j} className="w-full text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-[#F0A500]/10 text-sm font-medium text-gray-700 hover:text-[#0B1F3A] transition">{a}</button>)}</div></div>
          ))}
        </div>
      )}
    </div>
  );
}
