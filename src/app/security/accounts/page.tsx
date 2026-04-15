"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { Users, Plus, Search, Shield, Radio, DollarSign, Phone, Mail, MapPin, Eye, Settings, AlertTriangle } from "lucide-react";

interface Account {
  id: string; customer_name: string; address: string; city: string; state: string; phone: string; email: string;
  system_type: string; panel_type: string; monitoring_plan: string; mrr: number; status: string;
  install_date: string; contract_end: string; alarm_com_id: string; sensors: number; cameras: number;
}

const MOCK: Account[] = [
  { id:"1",customer_name:"Johnson Family",address:"4521 Oak Ave",city:"Dallas",state:"TX",phone:"(214) 555-0123",email:"johnson@email.com",system_type:"Full Smart Home",panel_type:"Qolsys IQ4",monitoring_plan:"Premium Interactive",mrr:49.99,status:"active",install_date:"2023-06-15",contract_end:"2026-06-15",alarm_com_id:"ACM-78234",sensors:18,cameras:6 },
  { id:"2",customer_name:"Smith Residence",address:"1234 Elm St",city:"Columbus",state:"OH",phone:"(614) 555-0456",email:"smith@email.com",system_type:"Security Only",panel_type:"DSC Neo",monitoring_plan:"Basic Monitoring",mrr:29.99,status:"active",install_date:"2023-09-01",contract_end:"2026-09-01",alarm_com_id:"ACM-91023",sensors:12,cameras:0 },
  { id:"3",customer_name:"Williams Home",address:"789 Pine St",city:"Detroit",state:"MI",phone:"(313) 555-0789",email:"williams@email.com",system_type:"Smart Home + Fire",panel_type:"Qolsys IQ4",monitoring_plan:"Premium + Fire",mrr:59.99,status:"active",install_date:"2024-01-10",contract_end:"2027-01-10",alarm_com_id:"ACM-45678",sensors:24,cameras:8 },
  { id:"4",customer_name:"Brown Corp",address:"500 Commerce Blvd",city:"Dallas",state:"TX",phone:"(214) 555-1111",email:"brown@corp.com",system_type:"Commercial",panel_type:"DMP XR550",monitoring_plan:"Enterprise",mrr:299.99,status:"active",install_date:"2023-03-15",contract_end:"2028-03-15",alarm_com_id:"ACM-12345",sensors:48,cameras:16 },
  { id:"5",customer_name:"Davis Family",address:"2345 Maple Dr",city:"Columbus",state:"OH",phone:"(614) 555-2222",email:"davis@email.com",system_type:"Security + Automation",panel_type:"Qolsys IQ4",monitoring_plan:"Premium Interactive",mrr:49.99,status:"past_due",install_date:"2023-11-01",contract_end:"2026-11-01",alarm_com_id:"ACM-67890",sensors:16,cameras:4 },
  { id:"6",customer_name:"Garcia Residence",address:"6789 Cedar Ln",city:"Dallas",state:"TX",phone:"(214) 555-3333",email:"garcia@email.com",system_type:"Full Smart Home",panel_type:"Alarm.com Smart Hub",monitoring_plan:"Premium Interactive",mrr:49.99,status:"active",install_date:"2024-02-01",contract_end:"2027-02-01",alarm_com_id:"ACM-11122",sensors:20,cameras:6 },
  { id:"7",customer_name:"Martinez Home",address:"3456 Birch Rd",city:"Detroit",state:"MI",phone:"(313) 555-4444",email:"martinez@email.com",system_type:"Security Only",panel_type:"2GIG Edge",monitoring_plan:"Basic Monitoring",mrr:29.99,status:"pending_cancel",install_date:"2023-04-01",contract_end:"2026-04-01",alarm_com_id:"ACM-33344",sensors:10,cameras:2 },
  { id:"8",customer_name:"Anderson LLC",address:"100 Industrial Pkwy",city:"Columbus",state:"OH",phone:"(614) 555-5555",email:"anderson@llc.com",system_type:"Commercial + Access",panel_type:"DMP XR550",monitoring_plan:"Enterprise + Access",mrr:499.99,status:"active",install_date:"2023-07-01",contract_end:"2028-07-01",alarm_com_id:"ACM-55566",sensors:64,cameras:24 },
  { id:"9",customer_name:"Taylor Home",address:"8901 Walnut Ct",city:"Dallas",state:"TX",phone:"(214) 555-6666",email:"taylor@email.com",system_type:"Smart Home + Video",panel_type:"Qolsys IQ4",monitoring_plan:"Premium + Video",mrr:69.99,status:"active",install_date:"2024-03-01",contract_end:"2027-03-01",alarm_com_id:"ACM-77788",sensors:22,cameras:10 },
  { id:"10",customer_name:"Thomas Residence",address:"5678 Spruce Ave",city:"Detroit",state:"MI",phone:"(313) 555-7777",email:"thomas@email.com",system_type:"Security + Fire",panel_type:"DSC Neo",monitoring_plan:"Standard + Fire",mrr:39.99,status:"active",install_date:"2023-08-15",contract_end:"2026-08-15",alarm_com_id:"ACM-99900",sensors:14,cameras:0 },
];

export default function SecurityAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>(MOCK);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = accounts.filter(a => {
    const ms = a.customer_name.toLowerCase().includes(search.toLowerCase()) || a.address.toLowerCase().includes(search.toLowerCase()) || a.alarm_com_id.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter === "all" || a.status === statusFilter;
    return ms && mf;
  });

  const totalMRR = accounts.filter(a => a.status === "active").reduce((s, a) => s + a.mrr, 0);
  const statusColor: Record<string,string> = { active: "bg-green-100 text-green-700", past_due: "bg-red-100 text-red-700", pending_cancel: "bg-yellow-100 text-yellow-700", inactive: "bg-gray-100 text-gray-600" };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2"><Users className="w-8 h-8" /><h1 className="text-3xl font-bold">Security Accounts</h1></div>
            <p className="text-indigo-200">Every customer, system, and monitoring plan in one view.</p>
          </div>
          <button className="bg-white text-indigo-700 px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-indigo-50"><Plus className="w-5 h-5" /> New Account</button>
        </div>
        <div className="grid grid-cols-5 gap-4 mt-6">
          {[
            { label: "Total Accounts", val: accounts.length },
            { label: "Active", val: accounts.filter(a=>a.status==="active").length },
            { label: "Monthly MRR", val: `$${totalMRR.toLocaleString(undefined,{minimumFractionDigits:2})}` },
            { label: "Total Sensors", val: accounts.reduce((s,a)=>s+a.sensors,0).toLocaleString() },
            { label: "Total Cameras", val: accounts.reduce((s,a)=>s+a.cameras,0) },
          ].map(s=><div key={s.label} className="bg-white/10 rounded-xl p-4"><div className="text-2xl font-bold">{s.val}</div><div className="text-indigo-200 text-sm">{s.label}</div></div>)}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1"><Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, address, or Alarm.com ID..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" /></div>
        <div className="flex gap-2">{["all","active","past_due","pending_cancel"].map(s=><button key={s} onClick={()=>setStatusFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${statusFilter===s?"bg-indigo-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s.replace("_"," ")}</button>)}</div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50"><tr>
              {["Customer","Address","System","Panel","Plan","MRR","Sensors/Cams","Alarm.com ID","Status",""].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(a=>(
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3"><div className="text-sm font-medium text-gray-900">{a.customer_name}</div><div className="text-xs text-gray-500">{a.phone}</div></td>
                  <td className="px-4 py-3 text-sm text-gray-700">{a.address}, {a.city}, {a.state}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{a.system_type}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{a.panel_type}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{a.monitoring_plan}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-700">${a.mrr}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{a.sensors} / {a.cameras}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 font-mono">{a.alarm_com_id}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[a.status]}`}>{a.status.replace("_"," ")}</span></td>
                  <td className="px-4 py-3"><button className="p-1.5 text-gray-400 hover:text-indigo-600"><Eye className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
