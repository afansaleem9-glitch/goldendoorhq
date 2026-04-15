"use client";
import { useState } from "react";
import { Target, Shield, Users, BookOpen, BarChart3, DollarSign, CheckCircle, AlertTriangle, TrendingUp, Clock, Star, Search, Headphones, FileText } from "lucide-react";

const reps = [
  { name: "Sarah Chen", callQuality: 95, orderAccuracy: 98, satisfaction: 9.4, compliance: 100, overall: 97 },
  { name: "Mike Torres", callQuality: 88, orderAccuracy: 92, satisfaction: 8.8, compliance: 95, overall: 91 },
  { name: "James Reid", callQuality: 82, orderAccuracy: 85, satisfaction: 7.9, compliance: 88, overall: 85 },
  { name: "Lisa Park", callQuality: 92, orderAccuracy: 96, satisfaction: 9.1, compliance: 100, overall: 95 },
  { name: "David Kim", callQuality: 78, orderAccuracy: 80, satisfaction: 7.5, compliance: 82, overall: 80 },
];
const reviews = [
  { id: 1, rep: "James Reid", call: "Call #89012", score: 72, issues: ["Missed disclosure","Incomplete address verification"], date: "2024-04-12" },
  { id: 2, rep: "David Kim", call: "Call #89034", score: 68, issues: ["CPNI not verified","Wrong product quoted"], date: "2024-04-11" },
  { id: 3, rep: "Mike Torres", call: "Call #89056", score: 85, issues: ["Minor script deviation"], date: "2024-04-10" },
];
export default function QualityPage() {
  const [tab, setTab] = useState<"scorecards"|"reviews">("scorecards");
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8"><h1 className="text-3xl font-bold text-[#0B1F3A]">Quality Assurance</h1><p className="text-gray-500 mt-1">QA scorecards, call reviews, and performance grading</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{l:"Avg QA Score",v:"92",icon:Target},{l:"Reviews Completed",v:"47",icon:CheckCircle},{l:"Failed Reviews",v:reviews.filter(r=>r.score<75).length.toString(),icon:AlertTriangle},{l:"Top Performer",v:"Sarah Chen",icon:Star}].map((s,i)=><div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-1"><s.icon size={16} className="text-[#F0A500]"/><span className="text-xs text-gray-500">{s.l}</span></div><div className="text-2xl font-bold text-[#0B1F3A]">{s.v}</div></div>)}
      </div>
      <div className="flex gap-2 mb-4">{(["scorecards","reviews"] as const).map(t=><button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${tab===t?"bg-[#0B1F3A] text-white":"bg-white text-gray-600"}`}>{t}</button>)}</div>
      {tab==="scorecards" && <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"><table className="w-full text-sm"><thead><tr className="border-b">{["Rep","Call Quality","Order Accuracy","Satisfaction","Compliance","Overall"].map(h=><th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead><tbody>{reps.map((r,i)=><tr key={i} className="border-b border-gray-50 hover:bg-gray-50"><td className="py-3 px-3 font-medium">{r.name}</td>{[r.callQuality,r.orderAccuracy,r.satisfaction*10,r.compliance,r.overall].map((v,j)=><td key={j} className="py-3 px-3"><span className={`font-bold ${v>=90?"text-green-600":v>=80?"text-yellow-600":"text-red-600"}`}>{j===2?(v/10).toFixed(1):v}%</span></td>)}</tr>)}</tbody></table></div>}
      {tab==="reviews" && <div className="space-y-3">{reviews.map(r=><div key={r.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"><div className="flex items-center justify-between"><div><span className="font-medium text-[#0B1F3A]">{r.rep}</span><span className="text-gray-400 ml-2 text-sm">{r.call}</span></div><div className="flex items-center gap-2"><span className={`font-bold text-lg ${r.score>=80?"text-green-600":r.score>=70?"text-yellow-600":"text-red-600"}`}>{r.score}</span><span className="text-xs text-gray-400">{r.date}</span></div></div><div className="mt-2 flex gap-2">{r.issues.map((issue,j)=><span key={j} className="px-2 py-0.5 rounded-full text-xs bg-red-50 text-red-600">{issue}</span>)}</div></div>)}</div>}
    </div>
  );
}
