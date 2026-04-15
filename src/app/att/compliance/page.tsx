"use client";
import { useState } from "react";
import { Target, Shield, Users, BookOpen, BarChart3, DollarSign, CheckCircle, AlertTriangle, TrendingUp, Clock, Star, Search, Headphones, FileText } from "lucide-react";

const checklist = [
  { item: "CPNI Verification on all calls", status: "pass", lastAudit: "2024-04-10" },
  { item: "Third-party verification for orders", status: "pass", lastAudit: "2024-04-10" },
  { item: "Slamming prevention protocols", status: "pass", lastAudit: "2024-04-08" },
  { item: "Do Not Call list compliance", status: "warning", lastAudit: "2024-04-05" },
  { item: "Recording disclosure on calls", status: "pass", lastAudit: "2024-04-10" },
  { item: "Price quote accuracy verification", status: "fail", lastAudit: "2024-04-12" },
];
const training = [
  { rep: "Sarah Chen", cpni: true, sales: true, regulatory: true, lastCompleted: "2024-04-01" },
  { rep: "Mike Torres", cpni: true, sales: true, regulatory: false, lastCompleted: "2024-03-15" },
  { rep: "James Reid", cpni: true, sales: false, regulatory: false, lastCompleted: "2024-02-28" },
  { rep: "Lisa Park", cpni: true, sales: true, regulatory: true, lastCompleted: "2024-04-05" },
  { rep: "David Kim", cpni: false, sales: false, regulatory: false, lastCompleted: "2024-01-15" },
];
export default function CompliancePage() {
  const statusIcons: Record<string,string> = { pass: "bg-green-100 text-green-700", warning: "bg-yellow-100 text-yellow-700", fail: "bg-red-100 text-red-700" };
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8"><h1 className="text-3xl font-bold text-[#0B1F3A]">Compliance</h1><p className="text-gray-500 mt-1">CPNI verification, regulatory tracking, and audit readiness</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{l:"Compliance Score",v:"92%",icon:Shield},{l:"Violations (Qtr)",v:"2",icon:AlertTriangle},{l:"Training Completion",v:`${Math.round(training.filter(t=>t.cpni&&t.sales&&t.regulatory).length/training.length*100)}%`,icon:BookOpen},{l:"Audits Passed",v:"12/13",icon:CheckCircle}].map((s,i)=><div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-1"><s.icon size={16} className="text-[#F0A500]"/><span className="text-xs text-gray-500">{s.l}</span></div><div className="text-2xl font-bold text-[#0B1F3A]">{s.v}</div></div>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"><h2 className="text-lg font-bold text-[#0B1F3A] mb-4">Compliance Checklist</h2><div className="space-y-3">{checklist.map((c,i)=><div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50"><span className="text-sm font-medium">{c.item}</span><div className="flex items-center gap-2"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusIcons[c.status]}`}>{c.status}</span><span className="text-xs text-gray-400">{c.lastAudit}</span></div></div>)}</div></div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"><h2 className="text-lg font-bold text-[#0B1F3A] mb-4">Training Status</h2><table className="w-full text-sm"><thead><tr className="border-b">{["Rep","CPNI","Sales","Regulatory","Last Completed"].map(h=><th key={h} className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead><tbody>{training.map((t,i)=><tr key={i} className="border-b border-gray-50"><td className="py-3 px-2 font-medium">{t.rep}</td>{[t.cpni,t.sales,t.regulatory].map((v,j)=><td key={j} className="py-3 px-2">{v?<CheckCircle size={16} className="text-green-500"/>:<AlertTriangle size={16} className="text-red-500"/>}</td>)}<td className="py-3 px-2 text-gray-500">{t.lastCompleted}</td></tr>)}</tbody></table></div>
      </div>
    </div>
  );
}
