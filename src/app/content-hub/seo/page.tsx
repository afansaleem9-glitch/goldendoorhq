"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Globe, Link, Search } from "lucide-react";

const TRAFFIC = [
  { month: "Oct", organic: 8200 }, { month: "Nov", organic: 9400 }, { month: "Dec", organic: 8800 },
  { month: "Jan", organic: 11200 }, { month: "Feb", organic: 13400 }, { month: "Mar", organic: 15600 },
];

const KEYWORDS = [
  { keyword: "solar installation texas", position: 3, volume: 8100, change: 2 },
  { keyword: "home security system", position: 7, volume: 12400, change: -1 },
  { keyword: "roof replacement cost", position: 5, volume: 6800, change: 3 },
  { keyword: "AT&T fiber plans", position: 12, volume: 14200, change: 0 },
  { keyword: "solar tax credits 2025", position: 2, volume: 9800, change: 5 },
  { keyword: "smart home security cameras", position: 9, volume: 5600, change: 1 },
  { keyword: "roofing contractor near me", position: 4, volume: 7400, change: 2 },
  { keyword: "solar panel cost ohio", position: 6, volume: 3200, change: -2 },
  { keyword: "home alarm system reviews", position: 11, volume: 4500, change: 3 },
  { keyword: "solar battery storage", position: 8, volume: 6100, change: 1 },
];

const PAGE_PERF = [
  { url: "/solar-texas", speed: 94, mobile: 91 },
  { url: "/home-security", speed: 88, mobile: 85 },
  { url: "/roof-inspection", speed: 96, mobile: 93 },
  { url: "/att-bundle", speed: 92, mobile: 89 },
  { url: "/blog/solar-tax-credits", speed: 97, mobile: 95 },
];

export default function SEOPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-teal-800 to-emerald-700 text-white px-8 py-8">
        <h1 className="text-2xl font-bold">SEO Dashboard</h1>
        <p className="text-teal-200 text-sm mt-1">Search engine optimization analytics</p>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-4"><div className="flex items-center gap-2 mb-1"><Globe size={16} className="text-teal-600" /><span className="text-xs text-gray-500">Domain Authority</span></div><div className="text-2xl font-bold">42</div></div>
          <div className="bg-white rounded-xl border p-4"><div className="flex items-center gap-2 mb-1"><Search size={16} className="text-blue-600" /><span className="text-xs text-gray-500">Ranking Keywords</span></div><div className="text-2xl font-bold">{KEYWORDS.length}</div></div>
          <div className="bg-white rounded-xl border p-4"><div className="flex items-center gap-2 mb-1"><TrendingUp size={16} className="text-green-600" /><span className="text-xs text-gray-500">Organic Traffic</span></div><div className="text-2xl font-bold">15.6k</div></div>
          <div className="bg-white rounded-xl border p-4"><div className="flex items-center gap-2 mb-1"><Link size={16} className="text-purple-600" /><span className="text-xs text-gray-500">Backlinks</span></div><div className="text-2xl font-bold">1,247</div></div>
        </div>
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold mb-4">Organic Traffic Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={TRAFFIC}><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip formatter={(value: any) => value.toLocaleString()} /><Bar dataKey="organic" fill="#007A67" radius={[4, 4, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold mb-4">Page Performance</h3>
            <table className="w-full text-sm">
              <thead className="border-b"><tr>{["Page", "Speed", "Mobile"].map(h => <th key={h} className="text-left py-2 text-gray-500 font-medium">{h}</th>)}</tr></thead>
              <tbody>{PAGE_PERF.map(p => (
                <tr key={p.url} className="border-b last:border-0">
                  <td className="py-2 font-mono text-xs">{p.url}</td>
                  <td className="py-2"><span className={`font-bold ${p.speed >= 90 ? "text-green-600" : "text-amber-600"}`}>{p.speed}</span></td>
                  <td className="py-2"><span className={`font-bold ${p.mobile >= 90 ? "text-green-600" : "text-amber-600"}`}>{p.mobile}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <h3 className="font-semibold mb-4">Top Keywords</h3>
          <table className="w-full text-sm">
            <thead className="border-b"><tr>{["Keyword", "Position", "Search Volume", "Change"].map(h => <th key={h} className="text-left py-2 text-gray-500 font-medium">{h}</th>)}</tr></thead>
            <tbody>{KEYWORDS.map(k => (
              <tr key={k.keyword} className="border-b last:border-0">
                <td className="py-2.5 font-medium">{k.keyword}</td>
                <td className="py-2.5"><span className="bg-gray-100 px-2 py-0.5 rounded font-bold text-xs">#{k.position}</span></td>
                <td className="py-2.5 text-gray-600">{k.volume.toLocaleString()}</td>
                <td className="py-2.5"><span className={`text-xs font-medium ${k.change > 0 ? "text-green-600" : k.change < 0 ? "text-red-600" : "text-gray-400"}`}>{k.change > 0 ? `↑${k.change}` : k.change < 0 ? `↓${Math.abs(k.change)}` : "—"}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
