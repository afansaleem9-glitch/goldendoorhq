"use client";
import { useState } from "react";
import { BookOpen, Search, Plus, FolderOpen, FileText, ChevronRight, Eye, Clock, ThumbsUp, ThumbsDown, Edit, X, Star } from "lucide-react";

interface Article { id:number; title:string; category:string; excerpt:string; content:string; views:number; helpful:number; notHelpful:number; author:string; updated:string; tags:string[]; featured:boolean; }

const categories = [
  { name:"Solar", count:12, icon:"☀️" },
  { name:"Smart Home", count:8, icon:"🏠" },
  { name:"Roofing", count:6, icon:"🔨" },
  { name:"AT&T / Telecom", count:4, icon:"📡" },
  { name:"Billing & Payments", count:7, icon:"💳" },
  { name:"Account Management", count:5, icon:"👤" },
  { name:"Troubleshooting", count:9, icon:"🔧" },
  { name:"Getting Started", count:3, icon:"🚀" },
];

const articles: Article[] = [
  {id:1,title:"Understanding Your Solar System Performance",category:"Solar",excerpt:"Learn how to read your solar monitoring dashboard and understand production metrics.",content:"Full article content here...",views:2840,helpful:156,notHelpful:12,author:"Delta Support",updated:"3 days ago",tags:["monitoring","production","efficiency"],featured:true},
  {id:2,title:"Smart Home Camera Setup Guide",category:"Smart Home",excerpt:"Step-by-step guide to setting up and configuring your ADC cameras.",content:"Full article content here...",views:1920,helpful:98,notHelpful:5,author:"Tech Team",updated:"1 week ago",tags:["cameras","ADC","setup"],featured:true},
  {id:3,title:"How Net Metering Works in Texas",category:"Solar",excerpt:"Everything you need to know about net metering credits on your electric bill.",content:"Full article content here...",views:3210,helpful:204,notHelpful:18,author:"Delta Support",updated:"2 weeks ago",tags:["net metering","billing","Texas"],featured:true},
  {id:4,title:"Roof Warranty Coverage Details",category:"Roofing",excerpt:"What's covered under your Delta roof warranty and how to file a claim.",content:"Full article content here...",views:890,helpful:67,notHelpful:8,author:"Operations",updated:"1 month ago",tags:["warranty","claims","coverage"],featured:false},
  {id:5,title:"AT&T Fiber Speed Test Guide",category:"AT&T / Telecom",excerpt:"How to test your internet speed and troubleshoot slow connections.",content:"Full article content here...",views:1540,helpful:82,notHelpful:11,author:"Tech Team",updated:"5 days ago",tags:["speed test","fiber","troubleshooting"],featured:false},
  {id:6,title:"Understanding Your Monthly Bill",category:"Billing & Payments",excerpt:"Breaking down each line item on your Delta monthly statement.",content:"Full article content here...",views:4120,helpful:312,notHelpful:24,author:"Billing Team",updated:"2 days ago",tags:["billing","payments","statement"],featured:true},
  {id:7,title:"Alarm Panel Troubleshooting",category:"Smart Home",excerpt:"Common alarm panel issues and how to resolve them quickly.",content:"Full article content here...",views:2100,helpful:134,notHelpful:9,author:"Tech Team",updated:"1 week ago",tags:["alarm","panel","troubleshooting"],featured:false},
  {id:8,title:"Solar Panel Cleaning Best Practices",category:"Solar",excerpt:"How and when to clean your solar panels for optimal performance.",content:"Full article content here...",views:1780,helpful:145,notHelpful:6,author:"Operations",updated:"3 weeks ago",tags:["cleaning","maintenance","panels"],featured:false},
  {id:9,title:"Setting Up Auto-Pay",category:"Billing & Payments",excerpt:"Enable automatic payments to never miss a due date.",content:"Full article content here...",views:2900,helpful:201,notHelpful:3,author:"Billing Team",updated:"1 day ago",tags:["auto-pay","payments","setup"],featured:false},
  {id:10,title:"Getting Started with Your Delta Account",category:"Getting Started",excerpt:"Welcome to Delta! Here's everything you need to know to get started.",content:"Full article content here...",views:5200,helpful:389,notHelpful:15,author:"Delta Support",updated:"4 days ago",tags:["onboarding","new customer","welcome"],featured:true},
];

export default function KnowledgeBasePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string|null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article|null>(null);
  const [editorOpen, setEditorOpen] = useState(false);

  const filtered = articles.filter(a => {
    if (selectedCategory && a.category !== selectedCategory) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.excerpt.toLowerCase().includes(search.toLowerCase()) && !a.tags.some(t=>t.includes(search.toLowerCase()))) return false;
    return true;
  });
  const featured = articles.filter(a=>a.featured);
  const totalViews = articles.reduce((a,b)=>a+b.views,0);

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Knowledge Base</h1>
          <p className="text-sm text-gray-500 mt-1">Customer self-service articles & internal docs</p>
        </div>
        <button onClick={()=>setEditorOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800">
          <Plus size={16}/>New Article
        </button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[{l:"Total Articles",v:articles.length},{l:"Total Views",v:totalViews.toLocaleString()},{l:"Categories",v:categories.length},{l:"Helpful Rate",v:`${Math.round(articles.reduce((a,b)=>a+b.helpful,0)/(articles.reduce((a,b)=>a+b.helpful+b.notHelpful,0))*100)}%`}].map(k=>(
          <div key={k.l} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">{k.l}</p>
            <p className="text-2xl font-bold text-black mt-1">{k.v}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"/>
        <input value={search} onChange={e=>{setSearch(e.target.value);setSelectedCategory(null)}} placeholder="Search articles, guides, and FAQs..."
          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/20 bg-white"/>
      </div>

      {!search && !selectedCategory && !selectedArticle ? (
        /* Landing: Categories + Featured */
        <div className="space-y-8">
          {/* Categories Grid */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map(c=>(
                <button key={c.name} onClick={()=>setSelectedCategory(c.name)} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow text-left group">
                  <span className="text-2xl">{c.icon}</span>
                  <p className="font-semibold text-sm text-black mt-2 group-hover:underline">{c.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{c.count} articles</p>
                </button>
              ))}
            </div>
          </div>

          {/* Featured Articles */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {featured.map(a=>(
                <button key={a.id} onClick={()=>setSelectedArticle(a)} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow text-left">
                  <div className="flex items-start gap-3">
                    <Star size={16} className="text-amber-400 mt-0.5 shrink-0"/>
                    <div>
                      <h3 className="font-semibold text-sm text-black">{a.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{a.excerpt}</p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500">
                        <span className="flex items-center gap-1"><Eye size={10}/>{a.views}</span>
                        <span className="flex items-center gap-1"><ThumbsUp size={10}/>{a.helpful}</span>
                        <span className="flex items-center gap-1"><Clock size={10}/>{a.updated}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : selectedArticle ? (
        /* Article View */
        <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-3xl mx-auto">
          <button onClick={()=>setSelectedArticle(null)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-black mb-4"><ChevronRight size={12} className="rotate-180"/>Back to articles</button>
          <span className="text-xs text-gray-500 uppercase">{selectedArticle.category}</span>
          <h1 className="text-xl font-bold text-black mt-1 mb-3">{selectedArticle.title}</h1>
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-6 pb-4 border-b border-gray-200/60">
            <span>By {selectedArticle.author}</span><span>Updated {selectedArticle.updated}</span><span className="flex items-center gap-1"><Eye size={11}/>{selectedArticle.views} views</span>
          </div>
          <div className="prose prose-sm max-w-none text-gray-700 mb-8">
            <p className="text-sm leading-relaxed">{selectedArticle.excerpt}</p>
            <p className="text-sm leading-relaxed mt-4">This is the full article content area. In production, this would render rich text from the database including formatted text, images, embedded videos, code blocks, and interactive elements.</p>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedArticle.tags.map(t=><span key={t} className="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{t}</span>)}
          </div>
          <div className="border-t border-gray-200/60 pt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">Was this article helpful?</p>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100"><ThumbsUp size={13}/>Yes ({selectedArticle.helpful})</button>
              <button className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-medium hover:bg-red-100"><ThumbsDown size={13}/>No ({selectedArticle.notHelpful})</button>
            </div>
          </div>
        </div>
      ) : (
        /* Filtered Article List */
        <div>
          {selectedCategory && (
            <div className="flex items-center gap-2 mb-4">
              <button onClick={()=>setSelectedCategory(null)} className="text-xs text-gray-500 hover:text-black">All Categories</button>
              <ChevronRight size={12} className="text-gray-300"/>
              <span className="text-xs font-semibold text-black">{selectedCategory}</span>
            </div>
          )}
          <div className="space-y-2">
            {filtered.map(a=>(
              <button key={a.id} onClick={()=>setSelectedArticle(a)} className="w-full bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow text-left flex items-start gap-3">
                <FileText size={16} className="text-gray-300 mt-0.5 shrink-0"/>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-black">{a.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{a.excerpt}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-500">
                    <span>{a.category}</span><span className="flex items-center gap-1"><Eye size={10}/>{a.views}</span><span className="flex items-center gap-1"><Clock size={10}/>{a.updated}</span>
                  </div>
                </div>
              </button>
            ))}
            {filtered.length===0 && <p className="text-center text-sm text-gray-500 py-12">No articles found matching your search.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
