"use client";
import { useState } from "react";
import { ClipboardCheck, Plus, Search, Clock, CheckCircle, AlertTriangle, FileText, MapPin, Calendar } from "lucide-react";

const MOCK = [
  { id:"1",customer:"Taylor Home",address:"8901 Walnut Ct, Dallas TX",permit_number:"ALM-2024-0456",type:"Alarm Permit",status:"approved",submitted:"2024-03-15",expires:"2025-03-15",fee:50,municipality:"City of Dallas" },
  { id:"2",customer:"Chen Residence",address:"345 Lotus Ln, Columbus OH",permit_number:"SEC-2024-1234",type:"Security System",status:"pending",submitted:"2024-03-20",expires:"-",fee:75,municipality:"City of Columbus" },
  { id:"3",customer:"Wilson Corp",address:"200 Tech Park, Dallas TX",permit_number:"COM-2024-0789",type:"Commercial Alarm + Fire",status:"approved",submitted:"2024-03-10",expires:"2025-03-10",fee:150,municipality:"City of Dallas" },
  { id:"4",customer:"Patel Family",address:"678 Summit Dr, Detroit MI",permit_number:"DET-2024-5678",type:"Alarm Permit",status:"pending",submitted:"2024-03-22",expires:"-",fee:40,municipality:"City of Detroit" },
  { id:"5",customer:"Robinson Home",address:"7788 Hill St, Detroit MI",permit_number:"DET-2024-5679",type:"Alarm Permit",status:"inspection_needed",submitted:"2024-03-12",expires:"-",fee:40,municipality:"City of Detroit" },
  { id:"6",customer:"Clark Family",address:"9900 Valley View, Columbus OH",permit_number:"SEC-2024-1235",type:"Security + Fire",status:"approved",submitted:"2024-02-28",expires:"2025-02-28",fee:100,municipality:"City of Columbus" },
  { id:"7",customer:"Foster Residence",address:"4455 River Rd, Dallas TX",permit_number:"ALM-2024-0457",type:"Alarm Renewal",status:"expiring_soon",submitted:"2023-04-01",expires:"2024-04-01",fee:50,municipality:"City of Dallas" },
];

export default function PermitsPage() {
  const [permits] = useState(MOCK);
  const [search, setSearch] = useState("");
  const filtered = permits.filter(p=>p.customer.toLowerCase().includes(search.toLowerCase())||p.permit_number.toLowerCase().includes(search.toLowerCase()));
  const statusColor: Record<string,string> = { approved:"bg-green-100 text-green-700",pending:"bg-yellow-100 text-yellow-700",inspection_needed:"bg-blue-100 text-blue-700",expiring_soon:"bg-red-100 text-red-700",denied:"bg-red-100 text-red-700" };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-teal-600 to-teal-800 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div><div className="flex items-center gap-3 mb-2"><ClipboardCheck className="w-8 h-8"/><h1 className="text-3xl font-bold">Permits & Inspections</h1></div><p className="text-teal-200">Municipal permit tracking, inspection scheduling, and compliance management.</p></div>
          <button className="bg-white text-teal-700 px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2"><Plus className="w-5 h-5"/> New Permit</button>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[{label:"Total",val:permits.length},{label:"Approved",val:permits.filter(p=>p.status==="approved").length},{label:"Pending",val:permits.filter(p=>p.status==="pending").length},{label:"Expiring Soon",val:permits.filter(p=>p.status==="expiring_soon").length}].map(s=><div key={s.label} className="bg-white/10 rounded-xl p-4"><div className="text-2xl font-bold">{s.val}</div><div className="text-teal-200 text-sm">{s.label}</div></div>)}
        </div>
      </div>
      <div className="relative mb-6"><Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search permits..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"/></div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full"><thead className="bg-gray-50"><tr>{["Permit #","Customer","Address","Type","Municipality","Fee","Status","Submitted","Expires"].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{filtered.map(p=>(
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-mono">{p.permit_number}</td>
              <td className="px-4 py-3 text-sm font-medium">{p.customer}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{p.address}</td>
              <td className="px-4 py-3 text-sm">{p.type}</td>
              <td className="px-4 py-3 text-sm">{p.municipality}</td>
              <td className="px-4 py-3 text-sm">${p.fee}</td>
              <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[p.status]}`}>{p.status.replace("_"," ")}</span></td>
              <td className="px-4 py-3 text-sm text-gray-500">{p.submitted}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{p.expires}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
