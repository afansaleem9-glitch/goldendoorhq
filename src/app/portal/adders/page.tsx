"use client";
import { useState, useMemo } from "react";
import { Search, Plus, Edit3, Trash2, DollarSign, Clock, Tag, ToggleLeft, ToggleRight, ChevronDown } from "lucide-react";

interface Adder {
  id: string;
  name: string;
  cost: number;
  costType: "flat" | "per_watt" | "per_module" | "per_foot";
  category: string;
  laborHours: number;
  active: boolean;
  description: string;
  frequency: number;
}

const mockAdders: Adder[] = [
  { id: "1", name: "Rebate", cost: 500, costType: "flat", category: "Financial", laborHours: 0, active: true, description: "Standard rebate applied at point of sale", frequency: 89 },
  { id: "2", name: "*Multiple Planes", cost: 900, costType: "flat", category: "Structural", laborHours: 2.5, active: true, description: "Additional labor for multi-plane roof installations", frequency: 67 },
  { id: "3", name: "Ground Mount", cost: 3500, costType: "flat", category: "Mounting", laborHours: 8, active: true, description: "Ground-mounted racking system instead of roof mount", frequency: 12 },
  { id: "4", name: "Battery Storage - 10kWh", cost: 8500, costType: "flat", category: "Storage", laborHours: 4, active: true, description: "10kWh battery backup system (e.g., Tesla Powerwall)", frequency: 34 },
  { id: "5", name: "Battery Storage - 13.5kWh", cost: 11500, costType: "flat", category: "Storage", laborHours: 4, active: true, description: "13.5kWh battery backup system", frequency: 22 },
  { id: "6", name: "Main Panel Upgrade (MPU)", cost: 2200, costType: "flat", category: "Electrical", laborHours: 6, active: true, description: "200A main panel upgrade required for system integration", frequency: 45 },
  { id: "7", name: "Sub Panel Install", cost: 1400, costType: "flat", category: "Electrical", laborHours: 4, active: true, description: "Additional sub-panel for dedicated solar circuit", frequency: 28 },
  { id: "8", name: "Conduit Run (per ft)", cost: 8.50, costType: "per_foot", category: "Electrical", laborHours: 0.05, active: true, description: "Extended conduit run beyond standard 50ft", frequency: 56 },
  { id: "9", name: "Critter Guard", cost: 750, costType: "flat", category: "Protection", laborHours: 2, active: true, description: "Mesh guard to prevent animal nesting under panels", frequency: 78 },
  { id: "10", name: "EV Charger Install", cost: 1200, costType: "flat", category: "Electrical", laborHours: 3, active: true, description: "Level 2 EV charger installation with dedicated circuit", frequency: 15 },
  { id: "11", name: "Tile Roof Attachment", cost: 25, costType: "per_module", category: "Structural", laborHours: 0.25, active: true, description: "Tile hook attachment system per module", frequency: 31 },
  { id: "12", name: "Steep Roof (>35°)", cost: 600, costType: "flat", category: "Structural", laborHours: 3, active: true, description: "Additional safety equipment and labor for steep pitch", frequency: 19 },
  { id: "13", name: "Tree Trimming", cost: 350, costType: "flat", category: "Site Prep", laborHours: 0, active: true, description: "Removal of shading obstructions", frequency: 42 },
  { id: "14", name: "Snow Guard Kit", cost: 450, costType: "flat", category: "Protection", laborHours: 1.5, active: false, description: "Snow retention system for northern installations", frequency: 8 },
  { id: "15", name: "Smart Home Integration", cost: 300, costType: "flat", category: "Smart Home", laborHours: 1, active: true, description: "Integration with Enphase/SolarEdge monitoring app", frequency: 61 },
  { id: "16", name: "Derate (Per Watt)", cost: 0.15, costType: "per_watt", category: "Financial", laborHours: 0, active: true, description: "Price adjustment per watt for system derate", frequency: 38 },
];

const categories = [...new Set(mockAdders.map(a => a.category))];

const costTypeLabels: Record<string, string> = {
  flat: "Flat",
  per_watt: "/W",
  per_module: "/Module",
  per_foot: "/ft",
};

export default function AdderSheet() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [showActive, setShowActive] = useState<"all" | "active" | "inactive">("all");
  const [sortBy, setSortBy] = useState<"name" | "cost" | "frequency">("frequency");

  const filtered = useMemo(() => {
    return mockAdders
      .filter(a => {
        if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
        if (catFilter !== "all" && a.category !== catFilter) return false;
        if (showActive === "active" && !a.active) return false;
        if (showActive === "inactive" && a.active) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "cost") return b.cost - a.cost;
        return b.frequency - a.frequency;
      });
  }, [search, catFilter, showActive, sortBy]);

  const totalActive = mockAdders.filter(a => a.active).length;
  const avgCost = mockAdders.filter(a => a.costType === "flat" && a.active).reduce((s, a) => s + a.cost, 0) / mockAdders.filter(a => a.costType === "flat" && a.active).length;

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F3A]">Adder Sheet</h1>
          <p className="text-sm text-gray-500">Manage system adders, pricing, and labor hours</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#007A67] text-white text-sm font-medium rounded-lg hover:bg-[#006655]"><Plus className="w-4 h-4" /> Add New Adder</button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Adders", value: mockAdders.length },
          { label: "Active", value: totalActive },
          { label: "Avg Flat Cost", value: `$${avgCost.toFixed(0)}` },
          { label: "Categories", value: categories.length },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-2xl font-bold text-[#0B1F3A]">{kpi.value}</p>
            <p className="text-xs text-gray-500">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search adders..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007A67]/20 focus:border-[#007A67]" />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600">
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={showActive} onChange={e => setShowActive(e.target.value as typeof showActive)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600">
          <option value="all">All Status</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600">
          <option value="frequency">Most Used</option>
          <option value="cost">Highest Cost</option>
          <option value="name">Alphabetical</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Adder Name</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Category</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Cost</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Type</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Labor (hrs)</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Usage</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-[#0B1F3A]">{a.name}</p>
                    <p className="text-xs text-gray-400">{a.description}</p>
                  </div>
                </td>
                <td className="px-4 py-3"><span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{a.category}</span></td>
                <td className="px-4 py-3 font-bold text-[#0B1F3A]">${a.cost.toLocaleString(undefined, { minimumFractionDigits: a.cost < 1 ? 2 : 0 })}</td>
                <td className="px-4 py-3 text-gray-500">{costTypeLabels[a.costType]}</td>
                <td className="px-4 py-3 text-gray-600">{a.laborHours > 0 ? a.laborHours : "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#007A67] rounded-full" style={{ width: `${(a.frequency / 100) * 100}%` }} />
                    </div>
                    <span className="text-xs text-gray-500">{a.frequency}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {a.active ? (
                    <span className="flex items-center gap-1 text-green-600 text-xs"><ToggleRight className="w-4 h-4" /> Active</span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-400 text-xs"><ToggleLeft className="w-4 h-4" /> Inactive</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="p-1 text-gray-400 hover:text-[#007A67]"><Edit3 className="w-3.5 h-3.5" /></button>
                    <button className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 bg-gray-50 text-xs text-gray-500 flex items-center justify-between">
          <span>Showing {filtered.length} of {mockAdders.length} adders</span>
        </div>
      </div>
    </div>
  );
}
