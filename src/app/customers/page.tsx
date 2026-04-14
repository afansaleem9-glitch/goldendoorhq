"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search, Filter, ChevronDown, ChevronUp, Sun, Shield, Home, Wifi,
  Users, MoreHorizontal, Download, Plus, Calendar, ArrowUpDown
} from "lucide-react";

type Vertical = "all" | "solar" | "security" | "roofing" | "att";
type SortField = "name" | "stage" | "systemSize" | "submitted" | "branch" | "vertical";
type SortDir = "asc" | "desc";

interface Customer {
  id: string;
  portalId: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  verticals: Vertical[];
  // Solar fields
  solarStage?: string;
  systemSize?: number;
  systemPrice?: number;
  modules?: number;
  modulesType?: string;
  financeCompany?: string;
  serviceBranch?: string;
  utility?: string;
  salesRep?: string;
  dealer?: string;
  submitted?: string;
  // Security fields
  securityPackage?: string;
  securityMonthly?: number;
  securityStatus?: string;
  // Roofing fields
  roofType?: string;
  roofStatus?: string;
  roofCost?: number;
  // ATT fields
  attPlan?: string;
  attStatus?: string;
}

const customers: Customer[] = [
  { id: "1", portalId: 559302, name: "Lynna Dy", phone: "(469) 212-4849", email: "lynna.dy@email.com", address: "2716 Helen Lane", city: "Mesquite", state: "TX", zip: "75181", verticals: ["solar", "security"], solarStage: "Final Completed", systemSize: 13.77, systemPrice: 40990, modules: 34, modulesType: "JA SOLAR 405Ws", financeCompany: "Sunrun PPA", serviceBranch: "Fort Worth", utility: "Oncor", salesRep: "Matthew Johnson", dealer: "Delta Power Group", submitted: "2025-05-05", securityPackage: "Premium", securityMonthly: 49.99, securityStatus: "Active" },
  { id: "2", portalId: 558901, name: "Marcus Thompson", phone: "(214) 555-0142", email: "marcus.t@email.com", address: "1847 Oak Ridge Dr", city: "Dallas", state: "TX", zip: "75201", verticals: ["solar"], solarStage: "Installation", systemSize: 10.8, systemPrice: 32400, modules: 27, modulesType: "REC Alpha 400W", financeCompany: "GoodLeap", serviceBranch: "Dallas", utility: "Oncor", salesRep: "Sarah Chen", dealer: "Delta Power Group", submitted: "2025-06-12" },
  { id: "3", portalId: 558742, name: "Jennifer Walsh", phone: "(469) 555-0198", email: "jwelsh@email.com", address: "3421 Elm St", city: "Plano", state: "TX", zip: "75024", verticals: ["solar", "roofing"], solarStage: "Permitting", systemSize: 8.1, systemPrice: 24300, modules: 20, modulesType: "JA SOLAR 405Ws", financeCompany: "Mosaic", serviceBranch: "Dallas", utility: "Oncor", salesRep: "Matthew Johnson", dealer: "Delta Power Group", submitted: "2025-07-01", roofType: "Comp Shingle", roofStatus: "Completed", roofCost: 12500 },
  { id: "4", portalId: 558600, name: "David Rodriguez", phone: "(972) 555-0334", email: "drod@email.com", address: "892 Maple Ave", city: "Arlington", state: "TX", zip: "76010", verticals: ["security", "att"], securityPackage: "Standard", securityMonthly: 34.99, securityStatus: "Active", attPlan: "Fiber 1Gbps", attStatus: "Active" },
  { id: "5", portalId: 558455, name: "Amanda Foster", phone: "(614) 555-0267", email: "afoster@email.com", address: "4521 River Rd", city: "Columbus", state: "OH", zip: "43201", verticals: ["solar", "security", "roofing"], solarStage: "Survey", systemSize: 12.15, systemPrice: 36450, modules: 30, modulesType: "REC Alpha 400W", financeCompany: "Sunrun PPA", serviceBranch: "Columbus", utility: "AEP Ohio", salesRep: "James Wilson", dealer: "Delta Power Group", submitted: "2025-08-15", securityPackage: "Premium Plus", securityMonthly: 59.99, securityStatus: "Pending Install", roofType: "Architectural", roofStatus: "Scheduled", roofCost: 18750 },
  { id: "6", portalId: 558310, name: "Robert Kim", phone: "(313) 555-0189", email: "rkim@email.com", address: "1123 Grand Blvd", city: "Detroit", state: "MI", zip: "48201", verticals: ["solar"], solarStage: "Design", systemSize: 9.72, systemPrice: 29160, modules: 24, modulesType: "Canadian Solar 405W", financeCompany: "GoodLeap", serviceBranch: "Detroit", utility: "DTE Energy", salesRep: "Maria Santos", dealer: "Delta Power Group", submitted: "2025-07-22" },
  { id: "7", portalId: 558201, name: "Sarah Mitchell", phone: "(469) 555-0445", email: "smitchell@email.com", address: "7890 Preston Rd", city: "Frisco", state: "TX", zip: "75034", verticals: ["solar", "security", "att"], solarStage: "Interconnection", systemSize: 15.39, systemPrice: 46170, modules: 38, modulesType: "JA SOLAR 405Ws", financeCompany: "Mosaic", serviceBranch: "Dallas", utility: "Oncor", salesRep: "Sarah Chen", dealer: "Delta Power Group", submitted: "2025-04-18", securityPackage: "Premium", securityMonthly: 49.99, securityStatus: "Active", attPlan: "Fiber 500Mbps", attStatus: "Active" },
  { id: "8", portalId: 558050, name: "Michael O'Brien", phone: "(614) 555-0321", email: "mobrien@email.com", address: "234 High St", city: "Dublin", state: "OH", zip: "43017", verticals: ["roofing"], roofType: "Metal Standing Seam", roofStatus: "In Progress", roofCost: 28900 },
  { id: "9", portalId: 557890, name: "Lisa Chang", phone: "(972) 555-0556", email: "lchang@email.com", address: "5678 Legacy Dr", city: "Plano", state: "TX", zip: "75024", verticals: ["solar", "roofing"], solarStage: "Inspection", systemSize: 11.34, systemPrice: 34020, modules: 28, modulesType: "JA SOLAR 405Ws", financeCompany: "Sunrun PPA", serviceBranch: "Dallas", utility: "Oncor", salesRep: "Matthew Johnson", dealer: "Delta Power Group", submitted: "2025-05-30", roofType: "Comp Shingle", roofStatus: "Completed", roofCost: 14200 },
  { id: "10", portalId: 557700, name: "James Patterson", phone: "(313) 555-0678", email: "jpatt@email.com", address: "901 Woodward Ave", city: "Royal Oak", state: "MI", zip: "48067", verticals: ["solar", "security"], solarStage: "PTO", systemSize: 7.29, systemPrice: 21870, modules: 18, modulesType: "Canadian Solar 405W", financeCompany: "GoodLeap", serviceBranch: "Detroit", utility: "DTE Energy", salesRep: "Maria Santos", dealer: "Delta Power Group", submitted: "2025-06-05", securityPackage: "Standard", securityMonthly: 34.99, securityStatus: "Active" },
  { id: "11", portalId: 557550, name: "Nicole Harris", phone: "(469) 555-0789", email: "nharris@email.com", address: "3456 Belt Line Rd", city: "Richardson", state: "TX", zip: "75080", verticals: ["solar"], solarStage: "Monitoring", systemSize: 6.48, systemPrice: 19440, modules: 16, modulesType: "REC Alpha 400W", financeCompany: "Mosaic", serviceBranch: "Dallas", utility: "Oncor", salesRep: "Sarah Chen", dealer: "Delta Power Group", submitted: "2025-03-20" },
  { id: "12", portalId: 557400, name: "Carlos Mendez", phone: "(214) 555-0890", email: "cmendez@email.com", address: "2345 Commerce St", city: "Dallas", state: "TX", zip: "75226", verticals: ["security", "att"], securityPackage: "Premium Plus", securityMonthly: 59.99, securityStatus: "Active", attPlan: "Fiber 1Gbps", attStatus: "Active" },
  { id: "13", portalId: 557250, name: "Emily Watson", phone: "(614) 555-0901", email: "ewatson@email.com", address: "7890 Scioto Trail", city: "Columbus", state: "OH", zip: "43215", verticals: ["solar", "security", "roofing", "att"], solarStage: "Accounts Payable", systemSize: 18.63, systemPrice: 55890, modules: 46, modulesType: "JA SOLAR 405Ws", financeCompany: "Sunrun PPA", serviceBranch: "Columbus", utility: "AEP Ohio", salesRep: "James Wilson", dealer: "Delta Power Group", submitted: "2025-02-14", securityPackage: "Premium Plus", securityMonthly: 59.99, securityStatus: "Active", roofType: "Architectural", roofStatus: "Completed", roofCost: 22400, attPlan: "Fiber 1Gbps", attStatus: "Active" },
  { id: "14", portalId: 557100, name: "Brian Taylor", phone: "(972) 555-0012", email: "btaylor@email.com", address: "4567 Park Blvd", city: "Garland", state: "TX", zip: "75040", verticals: ["solar"], solarStage: "Stamps", systemSize: 10.12, systemPrice: 30360, modules: 25, modulesType: "Canadian Solar 405W", financeCompany: "GoodLeap", serviceBranch: "Dallas", utility: "Oncor", salesRep: "Matthew Johnson", dealer: "Delta Power Group", submitted: "2025-07-10" },
  { id: "15", portalId: 556950, name: "Ashley Moore", phone: "(313) 555-0123", email: "amoore@email.com", address: "678 Michigan Ave", city: "Ann Arbor", state: "MI", zip: "48104", verticals: ["solar", "security"], solarStage: "Scope of Work", systemSize: 14.58, systemPrice: 43740, modules: 36, modulesType: "REC Alpha 400W", financeCompany: "Mosaic", serviceBranch: "Detroit", utility: "DTE Energy", salesRep: "Maria Santos", dealer: "Delta Power Group", submitted: "2025-08-01", securityPackage: "Standard", securityMonthly: 34.99, securityStatus: "Pending Install" },
  { id: "16", portalId: 556800, name: "Kevin Wright", phone: "(469) 555-0234", email: "kwright@email.com", address: "9012 Spring Valley", city: "Dallas", state: "TX", zip: "75240", verticals: ["att"], attPlan: "Fiber 500Mbps", attStatus: "Active" },
  { id: "17", portalId: 556650, name: "Rachel Green", phone: "(614) 555-0345", email: "rgreen@email.com", address: "1234 Broad St", city: "Columbus", state: "OH", zip: "43205", verticals: ["solar", "roofing"], solarStage: "Account Review", systemSize: 11.34, systemPrice: 34020, modules: 28, modulesType: "JA SOLAR 405Ws", financeCompany: "Sunrun PPA", serviceBranch: "Columbus", utility: "AEP Ohio", salesRep: "James Wilson", dealer: "Delta Power Group", submitted: "2025-06-28", roofType: "Comp Shingle", roofStatus: "Scheduled", roofCost: 15800 },
  { id: "18", portalId: 556500, name: "Thomas Lee", phone: "(972) 555-0456", email: "tlee@email.com", address: "5678 Greenville Ave", city: "Dallas", state: "TX", zip: "75206", verticals: ["solar", "security", "att"], solarStage: "Processing", systemSize: 16.2, systemPrice: 48600, modules: 40, modulesType: "JA SOLAR 405Ws", financeCompany: "GoodLeap", serviceBranch: "Dallas", utility: "Oncor", salesRep: "Sarah Chen", dealer: "Delta Power Group", submitted: "2025-04-02", securityPackage: "Premium", securityMonthly: 49.99, securityStatus: "Active", attPlan: "Fiber 1Gbps", attStatus: "Active" },
];

const stageColors: Record<string, string> = {
  "Final Completed": "bg-green-100 text-green-800",
  "Installation": "bg-orange-100 text-orange-800",
  "Permitting": "bg-blue-100 text-blue-800",
  "Survey": "bg-purple-100 text-purple-800",
  "Design": "bg-indigo-100 text-indigo-800",
  "Interconnection": "bg-teal-100 text-teal-800",
  "Inspection": "bg-yellow-100 text-yellow-800",
  "PTO": "bg-emerald-100 text-emerald-800",
  "Monitoring": "bg-cyan-100 text-cyan-800",
  "Accounts Payable": "bg-amber-100 text-amber-800",
  "Stamps": "bg-rose-100 text-rose-800",
  "Scope of Work": "bg-violet-100 text-violet-800",
  "Account Review": "bg-lime-100 text-lime-800",
  "Processing": "bg-sky-100 text-sky-800",
};

const verticalConfig = {
  solar: { label: "Solar", icon: Sun, color: "bg-amber-500", badge: "bg-amber-100 text-amber-800" },
  security: { label: "Smart Home", icon: Shield, color: "bg-blue-500", badge: "bg-blue-100 text-blue-800" },
  roofing: { label: "Roofing", icon: Home, color: "bg-red-500", badge: "bg-red-100 text-red-800" },
  att: { label: "AT&T", icon: Wifi, color: "bg-cyan-500", badge: "bg-cyan-100 text-cyan-800" },
};

export default function CustomerDNA() {
  const [search, setSearch] = useState("");
  const [activeVertical, setActiveVertical] = useState<Vertical>("all");
  const [sortField, setSortField] = useState<SortField>("submitted");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 12;

  const filtered = useMemo(() => {
    let list = customers;
    if (activeVertical !== "all") {
      list = list.filter(c => c.verticals.includes(activeVertical));
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(s) ||
        c.address.toLowerCase().includes(s) ||
        c.city.toLowerCase().includes(s) ||
        c.email.toLowerCase().includes(s) ||
        String(c.portalId).includes(s)
      );
    }
    list.sort((a, b) => {
      let av: string | number = "", bv: string | number = "";
      switch (sortField) {
        case "name": av = a.name; bv = b.name; break;
        case "stage": av = a.solarStage || ""; bv = b.solarStage || ""; break;
        case "systemSize": av = a.systemSize || 0; bv = b.systemSize || 0; break;
        case "submitted": av = a.submitted || ""; bv = b.submitted || ""; break;
        case "branch": av = a.serviceBranch || ""; bv = b.serviceBranch || ""; break;
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [search, activeVertical, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const stats = useMemo(() => ({
    total: customers.length,
    solar: customers.filter(c => c.verticals.includes("solar")).length,
    security: customers.filter(c => c.verticals.includes("security")).length,
    roofing: customers.filter(c => c.verticals.includes("roofing")).length,
    att: customers.filter(c => c.verticals.includes("att")).length,
    totalRevenue: customers.reduce((s, c) => s + (c.systemPrice || 0) + (c.roofCost || 0), 0),
  }), []);

  const toggleSort = (f: SortField) => {
    if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(f); setSortDir("desc"); }
  };

  const SortIcon = ({ field }: { field: SortField }) => (
    sortField === field
      ? (sortDir === "asc" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)
      : <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F3A]">Customer DNA</h1>
          <p className="text-sm text-gray-500 mt-1">Complete customer lifecycle across all verticals</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#007A67] text-white rounded-lg text-sm font-medium hover:bg-[#006655]">
            <Plus className="w-4 h-4" /> New Customer
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-[#0B1F3A]" />
            <span className="text-xs text-gray-500 font-medium">Total Customers</span>
          </div>
          <p className="text-2xl font-bold text-[#0B1F3A]">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Sun className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-gray-500 font-medium">Solar</span>
          </div>
          <p className="text-2xl font-bold text-[#0B1F3A]">{stats.solar}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-gray-500 font-medium">Smart Home</span>
          </div>
          <p className="text-2xl font-bold text-[#0B1F3A]">{stats.security}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Home className="w-4 h-4 text-red-500" />
            <span className="text-xs text-gray-500 font-medium">Roofing</span>
          </div>
          <p className="text-2xl font-bold text-[#0B1F3A]">{stats.roofing}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Wifi className="w-4 h-4 text-cyan-500" />
            <span className="text-xs text-gray-500 font-medium">AT&T</span>
          </div>
          <p className="text-2xl font-bold text-[#0B1F3A]">{stats.att}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-500 font-medium">Total Revenue</span>
          </div>
          <p className="text-2xl font-bold text-[#007A67]">${(stats.totalRevenue / 1000).toFixed(0)}K</p>
        </div>
      </div>

      {/* Vertical Filter Tabs */}
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => { setActiveVertical("all"); setCurrentPage(1); }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeVertical === "all" ? "bg-[#0B1F3A] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}>
          All Verticals
        </button>
        {(Object.entries(verticalConfig) as [Vertical, typeof verticalConfig.solar][]).map(([key, cfg]) => {
          const Icon = cfg.icon;
          return (
            <button key={key} onClick={() => { setActiveVertical(key as Vertical); setCurrentPage(1); }} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeVertical === key ? "bg-[#0B1F3A] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}>
              <Icon className="w-4 h-4" /> {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Search customers by name, address, email, or ID..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007A67]/30 focus:border-[#007A67]" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
          <Filter className="w-4 h-4" /> Advanced Filters
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
          <Calendar className="w-4 h-4" /> Date Range
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-600 cursor-pointer hover:text-[#0B1F3A]" onClick={() => toggleSort("name")}>
                  <div className="flex items-center gap-1">ID / Customer <SortIcon field="name" /></div>
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Verticals</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 cursor-pointer hover:text-[#0B1F3A]" onClick={() => toggleSort("stage")}>
                  <div className="flex items-center gap-1">Stage <SortIcon field="stage" /></div>
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 cursor-pointer hover:text-[#0B1F3A]" onClick={() => toggleSort("systemSize")}>
                  <div className="flex items-center gap-1">System Size <SortIcon field="systemSize" /></div>
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Finance</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 cursor-pointer hover:text-[#0B1F3A]" onClick={() => toggleSort("branch")}>
                  <div className="flex items-center gap-1">Branch <SortIcon field="branch" /></div>
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Sales Rep</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 cursor-pointer hover:text-[#0B1F3A]" onClick={() => toggleSort("submitted")}>
                  <div className="flex items-center gap-1">Submitted <SortIcon field="submitted" /></div>
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(c => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/customers/${c.id}`} className="group">
                      <div className="font-medium text-[#0B1F3A] group-hover:text-[#007A67]">{c.name}</div>
                      <div className="text-xs text-gray-400">#{c.portalId} · {c.city}, {c.state}</div>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {c.verticals.map(v => {
                        const cfg = verticalConfig[v as keyof typeof verticalConfig];
                        if (!cfg) return null;
                        const Icon = cfg.icon;
                        return <span key={v} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.badge}`}><Icon className="w-3 h-3" />{cfg.label}</span>;
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {c.solarStage && (
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${stageColors[c.solarStage] || "bg-gray-100 text-gray-700"}`}>
                        {c.solarStage}
                      </span>
                    )}
                    {!c.solarStage && c.securityStatus && (
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{c.securityStatus}</span>
                    )}
                    {!c.solarStage && !c.securityStatus && c.roofStatus && (
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">{c.roofStatus}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{c.systemSize ? `${c.systemSize} kW` : "—"}</td>
                  <td className="px-4 py-3 text-gray-700 text-xs">{c.financeCompany || "—"}</td>
                  <td className="px-4 py-3 text-gray-700 text-xs">{c.serviceBranch || "—"}</td>
                  <td className="px-4 py-3 text-gray-700 text-xs">{c.salesRep || "—"}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{c.submitted || "—"}</td>
                  <td className="px-4 py-3">
                    <button className="p-1 rounded hover:bg-gray-100"><MoreHorizontal className="w-4 h-4 text-gray-400" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">Showing {(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, filtered.length)} of {filtered.length} customers</p>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 rounded text-sm ${currentPage === i + 1 ? "bg-[#0B1F3A] text-white" : "text-gray-600 hover:bg-gray-100"}`}>{i + 1}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
