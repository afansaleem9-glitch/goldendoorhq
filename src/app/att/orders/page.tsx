"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { FileText, DollarSign, Users, MapPin, CheckCircle, TrendingUp, Search, Plus, Signal, Wifi, Clock, AlertTriangle, BarChart3, Star } from "lucide-react";

const mockOrders = [
  { id: 1, orderNo: "ATT-2024-001", customer: "Rodriguez Family", products: "Fiber 1000 + TV Choice", monthly: 124.99, status: "active", orderDate: "2024-04-01", installDate: "2024-04-05" },
  { id: 2, orderNo: "ATT-2024-002", customer: "Chen Household", products: "Fiber 500", monthly: 65.00, status: "provisioning", orderDate: "2024-04-10", installDate: "2024-04-15" },
  { id: 3, orderNo: "ATT-2024-003", customer: "Patel Residence", products: "Fiber 2000 + TV Premium + Phone", monthly: 189.99, status: "active", orderDate: "2024-03-28", installDate: "2024-04-02" },
  { id: 4, orderNo: "ATT-2024-004", customer: "Kim Family", products: "Fiber 300", monthly: 55.00, status: "pending", orderDate: "2024-04-12", installDate: "TBD" },
  { id: 5, orderNo: "ATT-2024-005", customer: "Davis Home", products: "Fiber 1000 + TV Choice", monthly: 124.99, status: "active", orderDate: "2024-03-20", installDate: "2024-03-25" },
  { id: 6, orderNo: "ATT-2024-006", customer: "Brown Residence", products: "Fiber 500 + Phone", monthly: 85.00, status: "cancelled", orderDate: "2024-04-05", installDate: "N/A" },
  { id: 7, orderNo: "ATT-2024-007", customer: "Wilson Family", products: "Fiber 5000", monthly: 180.00, status: "provisioning", orderDate: "2024-04-11", installDate: "2024-04-16" },
  { id: 8, orderNo: "ATT-2024-008", customer: "Taylor Home", products: "Fiber 1000 + TV Ultimate + Phone", monthly: 229.99, status: "active", orderDate: "2024-03-15", installDate: "2024-03-20" },
];
export default function ATTOrdersPage() {
  const [orders, setOrders] = useState(mockOrders);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  useEffect(() => { (async()=>{ const{data}=await supabase.from("att_orders").select("*").eq("org_id",ORG_ID); if(data&&data.length>0) setOrders(data); })(); }, []);
  const filtered = orders.filter(o=>(filter==="all"||o.status===filter)&&o.customer.toLowerCase().includes(search.toLowerCase()));
  const statusColors: Record<string,string> = { active:"bg-green-100 text-green-700", pending:"bg-blue-100 text-blue-700", provisioning:"bg-purple-100 text-purple-700", cancelled:"bg-red-100 text-red-700" };
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8"><div><h1 className="text-3xl font-bold text-[#0B1F3A]">AT&T Orders</h1><p className="text-gray-500 mt-1">Internet, TV, Phone, and Wireless bundle management</p></div><button className="bg-[#F0A500] text-[#0B1F3A] font-semibold px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={18}/> New Order</button></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{l:"Orders This Month",v:orders.length.toString(),icon:FileText},{l:"Avg Order Value",v:`$${Math.round(orders.reduce((a,o)=>a+o.monthly,0)/Math.max(orders.length,1))}/mo`,icon:DollarSign},{l:"Pending Installs",v:orders.filter(o=>o.status==="provisioning"||o.status==="pending").length.toString(),icon:Clock},{l:"Active Subscribers",v:orders.filter(o=>o.status==="active").length.toString(),icon:Users}].map((s,i)=><div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-1"><s.icon size={16} className="text-[#F0A500]"/><span className="text-xs text-gray-500">{s.l}</span></div><div className="text-2xl font-bold text-[#0B1F3A]">{s.v}</div></div>)}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-4"><div className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input value={search} onChange={e=>setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Search orders..."/></div><div className="flex gap-2">{["all","active","pending","provisioning","cancelled"].map(f=><button key={f} onClick={()=>setFilter(f)} className={`px-3 py-2 rounded-lg text-xs font-medium capitalize ${filter===f?"bg-[#0B1F3A] text-white":"bg-gray-100 text-gray-600"}`}>{f}</button>)}</div></div>
        <table className="w-full text-sm"><thead><tr className="border-b">{["Order #","Customer","Products","Monthly","Status","Order Date","Install Date"].map(h=><th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead><tbody>{filtered.map(o=><tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50"><td className="py-3 px-3 font-mono text-[#F0A500]">{o.orderNo}</td><td className="py-3 px-3 font-medium">{o.customer}</td><td className="py-3 px-3 text-gray-600">{o.products}</td><td className="py-3 px-3 font-semibold">${o.monthly}</td><td className="py-3 px-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[o.status]}`}>{o.status}</span></td><td className="py-3 px-3 text-gray-500">{o.orderDate}</td><td className="py-3 px-3 text-gray-500">{o.installDate}</td></tr>)}</tbody></table>
      </div>
    </div>
  );
}
