"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Home, Users, DollarSign, Calendar, Zap, Shield, Wifi, Wrench,
  Phone, FileText, Settings, BarChart3, ArrowRight, Command, Plus, X
} from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: any;
  action: () => void;
  section: string;
  keywords?: string[];
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const navigate = useCallback((path: string) => {
    router.push(path);
    setOpen(false);
  }, [router]);

  const items: CommandItem[] = [
    { id: "nav-home", label: "Dashboard", description: "Main overview", icon: Home, action: () => navigate("/"), section: "Navigation", keywords: ["home", "overview"] },
    { id: "nav-contacts", label: "Contacts", description: "Customer database", icon: Users, action: () => navigate("/contacts"), section: "Navigation", keywords: ["people", "customers"] },
    { id: "nav-deals", label: "Deals", description: "Sales pipeline", icon: DollarSign, action: () => navigate("/deals"), section: "Navigation", keywords: ["pipeline", "sales"] },
    { id: "nav-calendar", label: "Calendar", description: "Schedule & events", icon: Calendar, action: () => navigate("/calendar"), section: "Navigation" },
    { id: "nav-calling", label: "Call Center", description: "Phone system", icon: Phone, action: () => navigate("/calling"), section: "Navigation" },
    { id: "nav-tasks", label: "Tasks", description: "Task management", icon: FileText, action: () => navigate("/tasks"), section: "Navigation" },
    { id: "nav-solar", label: "Solar Command Center", description: "Solar vertical", icon: Zap, action: () => navigate("/solar"), section: "Navigation", keywords: ["panels", "install"] },
    { id: "nav-security", label: "Security Command Center", description: "Security vertical", icon: Shield, action: () => navigate("/security"), section: "Navigation", keywords: ["alarm", "monitoring"] },
    { id: "nav-att", label: "AT&T Command Center", description: "AT&T vertical", icon: Wifi, action: () => navigate("/att"), section: "Navigation", keywords: ["fiber", "internet"] },
    { id: "nav-roofing", label: "Roofing Command Center", description: "Roofing vertical", icon: Wrench, action: () => navigate("/roofing"), section: "Navigation" },
    { id: "nav-reports", label: "Reports", description: "Analytics & reports", icon: BarChart3, action: () => navigate("/reports"), section: "Navigation" },
    { id: "nav-settings", label: "Settings", description: "App configuration", icon: Settings, action: () => navigate("/settings"), section: "Navigation" },
    { id: "nav-solar-proposals", label: "Solar Proposals", icon: FileText, action: () => navigate("/solar/proposals"), section: "Solar", keywords: ["quote"] },
    { id: "nav-solar-design", label: "System Design", icon: Zap, action: () => navigate("/solar/system-design"), section: "Solar" },
    { id: "nav-solar-financing", label: "Solar Financing", icon: DollarSign, action: () => navigate("/solar/financing"), section: "Solar", keywords: ["loan", "lender"] },
    { id: "nav-solar-permits", label: "Solar Permits", icon: FileText, action: () => navigate("/solar/permits"), section: "Solar" },
    { id: "nav-solar-monitoring", label: "Production Monitoring", icon: BarChart3, action: () => navigate("/solar/production-monitoring"), section: "Solar" },
    { id: "nav-sec-designer", label: "System Designer", icon: Shield, action: () => navigate("/security/system-designer"), section: "Security" },
    { id: "nav-sec-monitoring", label: "Monitoring Contracts", icon: FileText, action: () => navigate("/security/monitoring-contracts"), section: "Security", keywords: ["rmr"] },
    { id: "nav-sec-takeover", label: "Competitor Takeover", icon: Shield, action: () => navigate("/security/competitor-takeover"), section: "Security", keywords: ["adt", "vivint"] },
    { id: "nav-att-orders", label: "AT&T Orders", icon: FileText, action: () => navigate("/att/orders"), section: "AT&T" },
    { id: "nav-att-commissions", label: "AT&T Commissions", icon: DollarSign, action: () => navigate("/att/commissions"), section: "AT&T" },
    { id: "act-new-deal", label: "New Deal", description: "Create a new deal", icon: Plus, action: () => navigate("/deals?new=true"), section: "Actions" },
    { id: "act-new-contact", label: "New Contact", description: "Add a contact", icon: Plus, action: () => navigate("/contacts?new=true"), section: "Actions" },
  ];

  const filtered = query.trim() === "" ? items : items.filter(item => {
    const q = query.toLowerCase();
    return item.label.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.section.toLowerCase().includes(q) ||
      item.keywords?.some(k => k.includes(q));
  });

  const sections = Array.from(new Set(filtered.map(i => i.section)));

  useEffect(() => { setSelectedIndex(0); }, [query]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(prev => !prev);
        setQuery("");
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleNav(e: KeyboardEvent) {
      if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex(prev => Math.min(prev + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex(prev => Math.max(prev - 1, 0)); }
      if (e.key === "Enter" && filtered[selectedIndex]) { e.preventDefault(); filtered[selectedIndex].action(); setOpen(false); setQuery(""); }
    }
    document.addEventListener("keydown", handleNav);
    return () => document.removeEventListener("keydown", handleNav);
  }, [open, filtered, selectedIndex]);

  if (!open) return null;

  let flatIndex = 0;

  return (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-[15vh]" onClick={() => setOpen(false)}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input ref={inputRef} type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search commands, pages, actions..." className="flex-1 text-sm text-gray-900 placeholder-gray-400 outline-none bg-transparent" />
          <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-gray-100 text-[10px] font-mono text-gray-500">ESC</kbd>
        </div>
        <div className="max-h-[360px] overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center"><p className="text-sm text-gray-400">No results found</p></div>
          ) : (
            sections.map(section => {
              const sectionItems = filtered.filter(i => i.section === section);
              return (
                <div key={section}>
                  <div className="px-4 py-1.5"><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{section}</span></div>
                  {sectionItems.map(item => {
                    const currentIndex = flatIndex++;
                    const isSelected = currentIndex === selectedIndex;
                    return (
                      <button key={item.id} onClick={() => { item.action(); setOpen(false); setQuery(""); }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${isSelected ? "bg-gray-100" : "hover:bg-gray-50"}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? "bg-black text-white" : "bg-gray-100 text-gray-500"}`}><item.icon size={15} /></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-gray-900 truncate">{item.label}</p>
                          {item.description && <p className="text-[11px] text-gray-400 truncate">{item.description}</p>}
                        </div>
                        {isSelected && <ArrowRight size={14} className="text-gray-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[10px] text-gray-400"><kbd className="px-1 py-0.5 rounded bg-gray-200 text-[9px] font-mono">↑↓</kbd> Navigate</span>
            <span className="flex items-center gap-1 text-[10px] text-gray-400"><kbd className="px-1 py-0.5 rounded bg-gray-200 text-[9px] font-mono">↵</kbd> Select</span>
          </div>
          <span className="flex items-center gap-1 text-[10px] text-gray-400"><Command size={10} /> <kbd className="px-1 py-0.5 rounded bg-gray-200 text-[9px] font-mono">K</kbd> Toggle</span>
        </div>
      </div>
    </div>
  );
}
