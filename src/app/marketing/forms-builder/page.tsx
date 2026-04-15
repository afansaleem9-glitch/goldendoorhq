"use client";
import { useState } from "react";
import { FileText, Plus, Eye, Search, CheckCircle, X } from "lucide-react";

const MOCK_FORMS = [
  { id: "1", name: "Solar Lead Form", submissions: 1245, conversion: 34.2, status: "Active", fields: 6, created: "2025-01-10" },
  { id: "2", name: "Security Assessment", submissions: 892, conversion: 28.7, status: "Active", fields: 8, created: "2025-01-15" },
  { id: "3", name: "Roofing Inspection Request", submissions: 567, conversion: 42.1, status: "Active", fields: 5, created: "2025-02-01" },
  { id: "4", name: "AT&T Bundle Interest", submissions: 423, conversion: 22.3, status: "Active", fields: 7, created: "2025-02-15" },
  { id: "5", name: "Customer Referral", submissions: 334, conversion: 56.8, status: "Active", fields: 4, created: "2025-03-01" },
  { id: "6", name: "Contact Us", submissions: 2100, conversion: 18.5, status: "Active", fields: 5, created: "2024-12-01" },
  { id: "7", name: "Newsletter Signup", submissions: 3450, conversion: 62.1, status: "Inactive", fields: 2, created: "2024-11-15" },
];

export default function FormsBuilderPage() {
  const [forms] = useState(MOCK_FORMS);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filtered = forms.filter(f => search === "" || f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-teal-900 to-teal-700 text-white px-8 py-8">
        <h1 className="text-2xl font-bold">Forms Builder</h1>
        <p className="text-teal-200 text-sm mt-1">Create and manage lead capture forms</p>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-4 text-center"><div className="text-2xl font-bold">{forms.length}</div><div className="text-xs text-gray-500">Total Forms</div></div>
          <div className="bg-white rounded-xl border p-4 text-center"><div className="text-2xl font-bold text-blue-600">{forms.reduce((s, f) => s + f.submissions, 0).toLocaleString()}</div><div className="text-xs text-gray-500">Total Submissions</div></div>
          <div className="bg-white rounded-xl border p-4 text-center"><div className="text-2xl font-bold text-green-600">{(forms.reduce((s, f) => s + f.conversion, 0) / forms.length).toFixed(1)}%</div><div className="text-xs text-gray-500">Avg Conversion</div></div>
        </div>
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center bg-white rounded-lg border px-3 py-2 flex-1 min-w-[200px]"><Search size={16} className="text-gray-400 mr-2" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search forms..." className="outline-none text-sm flex-1" /></div>
          <button onClick={() => setShowModal(true)} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"><Plus size={16} />Create Form</button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(f => (
            <div key={f.id} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center"><FileText size={18} className="text-teal-600" /></div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${f.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{f.status}</span>
              </div>
              <h3 className="font-semibold text-sm">{f.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{f.fields} fields</p>
              <div className="flex justify-between mt-4 text-sm">
                <div><span className="text-gray-500">Submissions:</span> <span className="font-semibold">{f.submissions.toLocaleString()}</span></div>
                <div><span className="text-gray-500">Conv:</span> <span className="font-semibold text-green-600">{f.conversion}%</span></div>
              </div>
              <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5"><div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${Math.min(f.conversion, 100)}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">Create Form</h2><button onClick={() => setShowModal(false)}><X size={20} /></button></div>
            <p className="text-sm text-gray-500 mb-4">Drag-and-drop form builder coming soon. Available field types: Text, Email, Phone, Dropdown, Checkbox, Textarea.</p>
            <button onClick={() => setShowModal(false)} className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg font-medium">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
