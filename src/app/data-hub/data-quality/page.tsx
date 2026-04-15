"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { Shield, AlertTriangle, CheckCircle, Search, Play, Pause, Trash2, Plus, Users, Mail, Phone, MapPin, Building } from "lucide-react";

interface QualityRule {
  id: string;
  name: string;
  type: string;
  object: string;
  property: string;
  status: string;
  issues_found: number;
  issues_fixed: number;
  last_run: string;
}

const MOCK_RULES: QualityRule[] = [
  { id: "1", name: "Duplicate Contacts", type: "dedup", object: "Contacts", property: "email", status: "active", issues_found: 234, issues_fixed: 187, last_run: "10 min ago" },
  { id: "2", name: "Missing Phone Numbers", type: "missing", object: "Contacts", property: "phone", status: "active", issues_found: 891, issues_fixed: 0, last_run: "1 hr ago" },
  { id: "3", name: "Invalid Email Format", type: "format", object: "Contacts", property: "email", status: "active", issues_found: 56, issues_fixed: 56, last_run: "30 min ago" },
  { id: "4", name: "Phone Number Formatting", type: "format", object: "Contacts", property: "phone", status: "active", issues_found: 1203, issues_fixed: 1203, last_run: "2 hrs ago" },
  { id: "5", name: "Missing Company Name", type: "missing", object: "Companies", property: "name", status: "paused", issues_found: 45, issues_fixed: 0, last_run: "1 day ago" },
  { id: "6", name: "Duplicate Companies", type: "dedup", object: "Companies", property: "domain", status: "active", issues_found: 78, issues_fixed: 62, last_run: "3 hrs ago" },
  { id: "7", name: "Address Standardization", type: "format", object: "Contacts", property: "address", status: "active", issues_found: 2341, issues_fixed: 2341, last_run: "4 hrs ago" },
  { id: "8", name: "Deal Amount Validation", type: "validate", object: "Deals", property: "amount", status: "active", issues_found: 12, issues_fixed: 12, last_run: "6 hrs ago" },
  { id: "9", name: "State Field Normalization", type: "format", object: "Contacts", property: "state", status: "active", issues_found: 456, issues_fixed: 456, last_run: "5 hrs ago" },
];

export default function DataQualityPage() {
  const [rules, setRules] = useState<QualityRule[]>(MOCK_RULES);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");

  const totalIssues = rules.reduce((a, r) => a + r.issues_found, 0);
  const totalFixed = rules.reduce((a, r) => a + r.issues_fixed, 0);
  const qualityScore = Math.round((totalFixed / Math.max(totalIssues, 1)) * 100);
  const activeRules = rules.filter((r) => r.status === "active").length;

  const filtered = rules.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  const typeIcon: Record<string, any> = { dedup: Users, missing: AlertTriangle, format: CheckCircle, validate: Shield };
  const typeColor: Record<string, string> = { dedup: "bg-purple-100 text-purple-600", missing: "bg-yellow-100 text-yellow-600", format: "bg-blue-100 text-blue-600", validate: "bg-green-100 text-green-600" };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2"><Shield className="w-8 h-8" /><h1 className="text-3xl font-bold">Data Quality</h1></div>
            <p className="text-emerald-200">Automatically find and fix data issues. Keep your CRM spotless.</p>
          </div>
          <button onClick={() => setShowAdd(true)} className="bg-white text-emerald-700 px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-emerald-50"><Plus className="w-5 h-5" /> New Rule</button>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[
            { label: "Quality Score", val: `${qualityScore}%` },
            { label: "Active Rules", val: activeRules },
            { label: "Issues Found", val: totalIssues.toLocaleString() },
            { label: "Issues Fixed", val: totalFixed.toLocaleString() },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold">{s.val}</div>
              <div className="text-emerald-200 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quality Score Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-3">Overall Data Health</h2>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div className="h-4 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all" style={{ width: `${qualityScore}%` }} />
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>{totalFixed.toLocaleString()} issues resolved</span>
          <span>{(totalIssues - totalFixed).toLocaleString()} remaining</span>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search rules..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" />
      </div>

      <div className="space-y-3">
        {filtered.map((r) => {
          const Icon = typeIcon[r.type] || Shield;
          const fixRate = r.issues_found > 0 ? Math.round((r.issues_fixed / r.issues_found) * 100) : 100;
          return (
            <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeColor[r.type]}`}><Icon className="w-5 h-5" /></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{r.name}</h3>
                    <p className="text-sm text-gray-500">{r.object} → {r.property} • {r.type} • Last run: {r.last_run}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{r.issues_found.toLocaleString()} found / {r.issues_fixed.toLocaleString()} fixed</div>
                    <div className="w-32 bg-gray-200 rounded-full h-2 mt-1"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${fixRate}%` }} /></div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${r.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{r.status}</span>
                  <button className="p-2 text-gray-400 hover:text-emerald-600"><Play className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-6">New Quality Rule</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Rule Name</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="e.g. Duplicate Contact Cleanup" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Type</label><select className="w-full border border-gray-300 rounded-lg px-3 py-2"><option value="dedup">Deduplication</option><option value="missing">Missing Data</option><option value="format">Formatting</option><option value="validate">Validation</option></select></div>
                <div><label className="block text-sm font-medium mb-1">Object</label><select className="w-full border border-gray-300 rounded-lg px-3 py-2"><option>Contacts</option><option>Companies</option><option>Deals</option><option>Tickets</option></select></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Property</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="e.g. email, phone, name" /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAdd(false)} className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg font-semibold hover:bg-emerald-700">Create Rule</button>
              <button onClick={() => setShowAdd(false)} className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
