"use client";
import { useState } from "react";
import { Monitor, Radio, Phone, Users, Shield, Bell, CheckCircle, Clock, AlertTriangle, Activity, Wifi, Server } from "lucide-react";

export default function CentralStationPage() {
  const [activeTab, setActiveTab] = useState("live");

  const liveStats = [
    { label: "Signals/Hour", val: "47", trend: "+12%", icon: Activity },
    { label: "Operators Online", val: "8", trend: "Full staff", icon: Users },
    { label: "Avg Response Time", val: "18s", trend: "-3s", icon: Clock },
    { label: "Dispatches Today", val: "23", trend: "+5", icon: Phone },
    { label: "False Alarm Rate", val: "34%", trend: "-2%", icon: AlertTriangle },
    { label: "Uptime", val: "99.99%", trend: "245 days", icon: Server },
  ];

  const operators = [
    { name: "Maria Santos", status: "on_call", signals_handled: 34, avg_response: "15s", shift: "6AM-2PM" },
    { name: "James Porter", status: "on_call", signals_handled: 28, avg_response: "19s", shift: "6AM-2PM" },
    { name: "Lisa Chen", status: "on_call", signals_handled: 31, avg_response: "16s", shift: "6AM-2PM" },
    { name: "Robert Kim", status: "break", signals_handled: 22, avg_response: "21s", shift: "6AM-2PM" },
    { name: "Sarah Davis", status: "on_call", signals_handled: 29, avg_response: "17s", shift: "6AM-2PM" },
    { name: "David Wilson", status: "training", signals_handled: 12, avg_response: "28s", shift: "6AM-2PM" },
    { name: "Mike Rodriguez", status: "on_call", signals_handled: 35, avg_response: "14s", shift: "6AM-2PM" },
    { name: "Emily Brown", status: "on_call", signals_handled: 26, avg_response: "20s", shift: "6AM-2PM" },
  ];

  const receivers = [
    { name: "Primary Receiver A", ip: "10.0.1.100", protocol: "SIA DC-07", accounts: 4521, status: "online", load: "67%" },
    { name: "Primary Receiver B", ip: "10.0.1.101", protocol: "Contact ID", accounts: 3892, status: "online", load: "58%" },
    { name: "Backup Receiver C", ip: "10.0.2.100", protocol: "SIA DC-07", accounts: 0, status: "standby", load: "0%" },
    { name: "IP/Cellular Receiver", ip: "10.0.1.200", protocol: "Alarm.com API", accounts: 6234, status: "online", load: "72%" },
    { name: "Fire Receiver", ip: "10.0.1.150", protocol: "SIA DC-03", accounts: 1245, status: "online", load: "34%" },
  ];

  const opStatusColor: Record<string,string> = { on_call:"bg-green-100 text-green-700", break:"bg-yellow-100 text-yellow-700", training:"bg-blue-100 text-blue-700", offline:"bg-gray-100 text-gray-600" };
  const rcvStatusColor: Record<string,string> = { online:"bg-green-100 text-green-700", standby:"bg-yellow-100 text-yellow-700", offline:"bg-red-100 text-red-700" };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-gray-800 to-gray-950 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center gap-3 mb-2"><Monitor className="w-8 h-8 text-blue-400" /><h1 className="text-3xl font-bold">Central Station</h1></div>
        <p className="text-gray-400">UL-Listed 24/7 monitoring operations center. Signal processing, dispatch coordination, and operator management.</p>
        <div className="grid grid-cols-6 gap-4 mt-6">
          {liveStats.map(s=>(
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <s.icon className="w-5 h-5 mb-1 text-blue-400" /><div className="text-2xl font-bold">{s.val}</div>
              <div className="text-gray-400 text-xs">{s.label}</div><div className="text-green-400 text-xs">{s.trend}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {["live","operators","receivers"].map(t=><button key={t} onClick={()=>setActiveTab(t)} className={`px-5 py-2 rounded-lg text-sm font-medium capitalize ${activeTab===t?"bg-gray-900 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{t}</button>)}
      </div>

      {activeTab==="operators"&&(
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full"><thead className="bg-gray-50"><tr>{["Operator","Status","Signals Handled","Avg Response","Shift"].map(h=><th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-200">{operators.map((o,i)=>(
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-5 py-3 text-sm font-medium text-gray-900">{o.name}</td>
                <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${opStatusColor[o.status]}`}>{o.status.replace("_"," ")}</span></td>
                <td className="px-5 py-3 text-sm text-gray-700">{o.signals_handled}</td>
                <td className="px-5 py-3 text-sm text-gray-700">{o.avg_response}</td>
                <td className="px-5 py-3 text-sm text-gray-500">{o.shift}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {activeTab==="receivers"&&(
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full"><thead className="bg-gray-50"><tr>{["Receiver","IP","Protocol","Accounts","Load","Status"].map(h=><th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-200">{receivers.map((r,i)=>(
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-5 py-3 text-sm font-medium text-gray-900">{r.name}</td>
                <td className="px-5 py-3 text-sm font-mono text-gray-500">{r.ip}</td>
                <td className="px-5 py-3 text-sm text-gray-700">{r.protocol}</td>
                <td className="px-5 py-3 text-sm text-gray-700">{r.accounts.toLocaleString()}</td>
                <td className="px-5 py-3"><div className="w-24 bg-gray-200 rounded-full h-2"><div className="h-2 rounded-full bg-blue-600" style={{width:r.load}}/></div><span className="text-xs text-gray-500">{r.load}</span></td>
                <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${rcvStatusColor[r.status]}`}>{r.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {activeTab==="live"&&(
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Signal Queue</h3>
            <div className="space-y-3">
              {[
                { type:"Burglar",customer:"Johnson Family",zone:"Back Door",time:"2 min ago",priority:"critical" },
                { type:"Fire",customer:"Williams Home",zone:"Kitchen Smoke",time:"8 min ago",priority:"critical" },
                { type:"Panic",customer:"Garcia Residence",zone:"Master Bedroom",time:"22 min ago",priority:"high" },
                { type:"Comm Fail",customer:"Davis Family",zone:"Panel Offline",time:"2 hrs ago",priority:"high" },
              ].map((s,i)=>(
                <div key={i} className={`p-3 rounded-lg border ${s.priority==="critical"?"border-red-300 bg-red-50":"border-yellow-200 bg-yellow-50"}`}>
                  <div className="flex items-center justify-between">
                    <div><div className="text-sm font-semibold">{s.type} — {s.customer}</div><div className="text-xs text-gray-500">{s.zone}</div></div>
                    <div className="text-xs text-gray-500">{s.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Dispatch Log</h3>
            <div className="space-y-3">
              {[
                { action:"Police dispatched",customer:"Johnson Family",officer:"Unit 47",time:"1 min ago" },
                { action:"Fire dept dispatched",customer:"Williams Home",officer:"Engine 12",time:"7 min ago" },
                { action:"Guard dispatched",customer:"Anderson LLC",officer:"SecureGuard #3",time:"44 min ago" },
                { action:"Tech dispatched",customer:"Davis Family",officer:"Carlos Mendez",time:"1.5 hrs ago" },
              ].map((d,i)=>(
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div><div className="text-sm font-medium">{d.action}</div><div className="text-xs text-gray-500">{d.customer} → {d.officer}</div></div>
                  <div className="text-xs text-gray-500">{d.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
