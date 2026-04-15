"use client";
import { useState } from "react";
import { Search, Plus, Eye, Calendar, X, FileText } from "lucide-react";

const STATUS_COLORS: Record<string, string> = { Published: "bg-green-100 text-green-800", Draft: "bg-gray-100 text-gray-700", Scheduled: "bg-blue-100 text-blue-800" };

const POSTS = [
  { id: "1", title: "Why Solar is the Best Investment for Texas Homeowners", author: "Afan Saleem", status: "Published", category: "Solar", published: "2025-04-10", views: 3420 },
  { id: "2", title: "5 Signs You Need a Roof Replacement", author: "Mike Torres", status: "Published", category: "Roofing", published: "2025-04-05", views: 2890 },
  { id: "3", title: "Smart Home Security: A Complete Guide", author: "Sarah Kim", status: "Published", category: "Security", published: "2025-03-28", views: 2150 },
  { id: "4", title: "How to File a Roof Insurance Claim", author: "James Reed", status: "Published", category: "Roofing", published: "2025-03-20", views: 4560 },
  { id: "5", title: "Solar Tax Credits in 2025: What You Need to Know", author: "Afan Saleem", status: "Published", category: "Solar", published: "2025-03-15", views: 6780 },
  { id: "6", title: "AT&T Fiber vs Cable: Which is Right for You?", author: "Sarah Kim", status: "Scheduled", category: "AT&T", published: "2025-04-20", views: 0 },
  { id: "7", title: "Home Energy Efficiency Tips for Summer", author: "Mike Torres", status: "Draft", category: "Solar", published: "", views: 0 },
  { id: "8", title: "The Future of Home Automation", author: "Afan Saleem", status: "Draft", category: "Security", published: "", views: 0 },
  { id: "9", title: "How Solar Panels Increase Home Value", author: "James Reed", status: "Published", category: "Solar", published: "2025-03-10", views: 3200 },
  { id: "10", title: "Choosing the Right Roofing Material", author: "Mike Torres", status: "Published", category: "Roofing", published: "2025-03-05", views: 1870 },
];

export default function BlogPage() {
  const [posts] = useState(POSTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = posts.filter(p => {
    const ms = search === "" || p.title.toLowerCase().includes(search.toLowerCase());
    const mst = statusFilter === "All" || p.status === statusFilter;
    return ms && mst;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-teal-800 to-emerald-700 text-white px-8 py-8">
        <h1 className="text-2xl font-bold">Blog & Content</h1>
        <p className="text-teal-200 text-sm mt-1">Manage blog posts and articles</p>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-4 text-center"><div className="text-2xl font-bold">{posts.length}</div><div className="text-xs text-gray-500">Total Posts</div></div>
          <div className="bg-white rounded-xl border p-4 text-center"><div className="text-2xl font-bold text-green-600">{posts.filter(p => p.status === "Published").length}</div><div className="text-xs text-gray-500">Published</div></div>
          <div className="bg-white rounded-xl border p-4 text-center"><div className="text-2xl font-bold text-blue-600">{posts.reduce((s, p) => s + p.views, 0).toLocaleString()}</div><div className="text-xs text-gray-500">Total Views</div></div>
        </div>
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center bg-white rounded-lg border px-3 py-2 flex-1 min-w-[200px]"><Search size={16} className="text-gray-400 mr-2" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts..." className="outline-none text-sm flex-1" /></div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-white border rounded-lg px-3 py-2 text-sm"><option>All</option><option>Published</option><option>Draft</option><option>Scheduled</option></select>
          <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"><Plus size={16} />New Post</button>
        </div>
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b"><tr>{["Title","Author","Category","Status","Views","Published"].map(h => <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>)}</tr></thead>
            <tbody>{filtered.map(p => (
              <tr key={p.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium max-w-[300px]"><div className="flex items-center gap-2"><FileText size={14} className="text-teal-600 shrink-0" /><span className="truncate">{p.title}</span></div></td>
                <td className="px-4 py-3 text-gray-500">{p.author}</td>
                <td className="px-4 py-3 text-gray-500">{p.category}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[p.status] || "bg-gray-100"}`}>{p.status}</span></td>
                <td className="px-4 py-3 text-gray-600">{p.views > 0 ? <span className="flex items-center gap-1"><Eye size={13} />{p.views.toLocaleString()}</span> : "—"}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{p.published ? new Date(p.published).toLocaleDateString() : "—"}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
