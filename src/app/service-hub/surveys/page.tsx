"use client";
import { useState } from "react";
import { Star, Users, TrendingUp, Plus } from "lucide-react";

const MOCK_SURVEYS = [
  { id: "1", name: "Post-Install CSAT", type: "CSAT", responses: 342, avg_score: 4.6, status: "Active" },
  { id: "2", name: "Quarterly NPS", type: "NPS", responses: 567, avg_score: 72, status: "Active" },
  { id: "3", name: "Security Onboarding", type: "CSAT", responses: 123, avg_score: 4.3, status: "Active" },
  { id: "4", name: "Roofing Satisfaction", type: "CSAT", responses: 89, avg_score: 4.7, status: "Paused" },
  { id: "5", name: "Service Experience", type: "NPS", responses: 234, avg_score: 65, status: "Active" },
];

const RECENT_RESPONSES = [
  { name: "Marcus Johnson", survey: "Post-Install CSAT", score: 5, comment: "Excellent work! The solar panels look great.", date: "2025-04-13" },
  { name: "Patricia Williams", survey: "Quarterly NPS", score: 9, comment: "Would definitely recommend to friends.", date: "2025-04-12" },
  { name: "Robert Chen", survey: "Security Onboarding", score: 4, comment: "Setup was smooth. App could be better.", date: "2025-04-11" },
  { name: "Sandra Davis", survey: "Post-Install CSAT", score: 5, comment: "Team was professional and efficient.", date: "2025-04-10" },
  { name: "James Wilson", survey: "Quarterly NPS", score: 10, comment: "Best decision we made for our home.", date: "2025-04-09" },
];

export default function SurveysPage() {
  const npsScore = 72;
  const npsColor = npsScore >= 50 ? "text-green-600" : npsScore >= 0 ? "text-yellow-600" : "text-red-600";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 text-white px-8 py-8">
        <h1 className="text-2xl font-bold">Customer Surveys</h1>
        <p className="text-indigo-200 text-sm mt-1">CSAT, NPS, and customer feedback</p>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-5 text-center">
            <div className="text-xs text-gray-500 mb-2">NPS Score</div>
            <div className={`text-4xl font-bold ${npsColor}`}>{npsScore}</div>
            <div className="mt-2 w-full bg-gray-100 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full" style={{ width: `${(npsScore + 100) / 2}%` }} /></div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>-100</span><span>0</span><span>100</span></div>
          </div>
          <div className="bg-white rounded-xl border p-5 text-center">
            <div className="text-xs text-gray-500 mb-2">Avg CSAT</div>
            <div className="text-4xl font-bold text-amber-500">4.6<span className="text-lg text-gray-300">/5</span></div>
            <div className="flex justify-center gap-0.5 mt-2">{[1,2,3,4,5].map(i => <Star key={i} size={16} fill={i <= 4.6 ? "#F0A500" : "none"} stroke="#F0A500" />)}</div>
          </div>
          <div className="bg-white rounded-xl border p-5 text-center">
            <div className="text-xs text-gray-500 mb-2">Total Responses</div>
            <div className="text-4xl font-bold text-blue-600">{MOCK_SURVEYS.reduce((s, sv) => s + sv.responses, 0).toLocaleString()}</div>
            <div className="text-xs text-gray-400 mt-2">Across {MOCK_SURVEYS.length} surveys</div>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold mb-4">Active Surveys</h3>
            <div className="space-y-3">
              {MOCK_SURVEYS.map(s => (
                <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-2 h-2 rounded-full ${s.status === "Active" ? "bg-green-500" : "bg-yellow-500"}`} />
                  <div className="flex-1"><p className="font-medium text-sm">{s.name}</p><p className="text-xs text-gray-400">{s.type} · {s.responses} responses</p></div>
                  <div className="text-right"><span className={`text-sm font-bold ${s.type === "NPS" ? (s.avg_score >= 50 ? "text-green-600" : "text-yellow-600") : "text-amber-500"}`}>{s.type === "NPS" ? s.avg_score : s.avg_score + "/5"}</span></div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold mb-4">Recent Responses</h3>
            <div className="space-y-3">
              {RECENT_RESPONSES.map((r, i) => (
                <div key={i} className="border-b last:border-0 pb-3 last:pb-0">
                  <div className="flex justify-between items-start"><span className="font-medium text-sm">{r.name}</span><div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= r.score ? "#F0A500" : "none"} stroke="#F0A500" />)}</div></div>
                  <p className="text-xs text-gray-500 mt-1">{r.comment}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{r.survey} · {new Date(r.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
