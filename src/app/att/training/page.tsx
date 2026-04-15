"use client";
import { useState } from "react";
import { Target, Shield, Users, BookOpen, BarChart3, DollarSign, CheckCircle, AlertTriangle, TrendingUp, Clock, Star, Search, Headphones, FileText } from "lucide-react";

const courses = [
  { title: "AT&T Fiber Products", type: "Video", duration: "45 min", status: "completed", score: 92 },
  { title: "Sales Process Mastery", type: "Role-Play", duration: "2 hrs", status: "completed", score: 88 },
  { title: "CPNI Compliance", type: "Quiz", duration: "30 min", status: "completed", score: 95 },
  { title: "TV Package Features", type: "Video", duration: "1 hr", status: "in_progress", score: null },
  { title: "Wireless Add-On Sales", type: "Video", duration: "30 min", status: "not_started", score: null },
  { title: "Bundle Selling Techniques", type: "Role-Play", duration: "1.5 hrs", status: "completed", score: 90 },
  { title: "System Navigation", type: "Interactive", duration: "2 hrs", status: "in_progress", score: null },
  { title: "Regulatory Updates Q2", type: "Quiz", duration: "20 min", status: "not_started", score: null },
];
const certs = [{name:"AT&T Fiber Certified",earned:true},{name:"Sales Professional",earned:true},{name:"Compliance Certified",earned:true},{name:"TV Specialist",earned:false},{name:"Wireless Expert",earned:false}];
export default function TrainingPage() {
  const completed = courses.filter(c=>c.status==="completed").length;
  const avgScore = Math.round(courses.filter(c=>c.score).reduce((a,c)=>a+(c.score||0),0)/Math.max(courses.filter(c=>c.score).length,1));
  const statusColors: Record<string,string> = { completed:"bg-green-100 text-green-700", in_progress:"bg-blue-100 text-blue-700", not_started:"bg-gray-100 text-gray-600" };
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8"><h1 className="text-3xl font-bold text-[#0B1F3A]">Training</h1><p className="text-gray-500 mt-1">Product training, certifications, and compliance modules</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{l:"Courses Completed",v:`${completed}/${courses.length}`,icon:BookOpen},{l:"Avg Score",v:`${avgScore}%`,icon:Star},{l:"Certified",v:`${certs.filter(c=>c.earned).length}/${certs.length}`,icon:CheckCircle},{l:"Overdue",v:courses.filter(c=>c.status==="not_started").length.toString(),icon:AlertTriangle}].map((s,i)=><div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="flex items-center gap-2 mb-1"><s.icon size={16} className="text-[#F0A500]"/><span className="text-xs text-gray-500">{s.l}</span></div><div className="text-2xl font-bold text-[#0B1F3A]">{s.v}</div></div>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6"><h2 className="text-lg font-bold text-[#0B1F3A] mb-4">Course Library</h2><div className="space-y-2">{courses.map((c,i)=><div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-[#F0A500] transition"><div><div className="font-medium text-sm">{c.title}</div><div className="text-xs text-gray-400">{c.type} · {c.duration}</div></div><div className="flex items-center gap-3">{c.score && <span className="text-sm font-bold text-green-600">{c.score}%</span>}<span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[c.status]}`}>{c.status.replace("_"," ")}</span></div></div>)}</div></div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"><h2 className="text-lg font-bold text-[#0B1F3A] mb-4">Certifications</h2><div className="space-y-3">{certs.map((c,i)=><div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">{c.earned?<CheckCircle size={18} className="text-green-500"/>:<div className="w-[18px] h-[18px] rounded-full border-2 border-gray-300"/>}<span className={`text-sm font-medium ${c.earned?"text-[#0B1F3A]":"text-gray-400"}`}>{c.name}</span></div>)}</div></div>
      </div>
    </div>
  );
}
