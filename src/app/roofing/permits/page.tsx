"use client";
import { useState, useEffect, Fragment } from 'react';
import { supabase, ORG_ID } from '@/lib/supabase';
import { Search, Filter, Plus, CheckCircle, AlertTriangle, X, Clock, Calendar, Home, MapPin, FileText, Download, Eye, RefreshCw, Building2, Shield, ChevronDown, DollarSign, ExternalLink } from 'lucide-react';

interface Permit {
  id: string;
  permit_number: string;
  job_name: string;
  customer: string;
  address: string;
  city: string;
  state: string;
  municipality: string;
  permit_type: string;
  status: 'approved' | 'pending' | 'in_review' | 'expired' | 'denied' | 'renewal';
  submitted_date: string;
  approved_date: string | null;
  expiration_date: string;
  fee: number;
  fee_paid: boolean;
  inspector: string;
  inspection_date: string | null;
  inspection_result: string | null;
  notes: string;
}

const mockPermits: Permit[] = [
  { id: '1', permit_number: 'DAL-2026-4521', job_name: 'Martinez Roof Replacement', customer: 'Carlos Martinez', address: '4521 Oak Lawn Ave', city: 'Dallas', state: 'TX', municipality: 'City of Dallas', permit_type: 'Residential Roofing', status: 'approved', submitted_date: '2026-03-18', approved_date: '2026-03-25', expiration_date: '2026-09-25', fee: 275, fee_paid: true, inspector: 'Robert Chen', inspection_date: null, inspection_result: null, notes: 'Standard shingle replacement, no structural changes' },
  { id: '2', permit_number: 'COL-2026-8834', job_name: 'Thompson Hail Repair', customer: 'Sarah Thompson', address: '2847 Broad St', city: 'Columbus', state: 'OH', municipality: 'City of Columbus', permit_type: 'Residential Roofing', status: 'approved', submitted_date: '2026-03-10', approved_date: '2026-03-17', expiration_date: '2026-09-17', fee: 185, fee_paid: true, inspector: 'Linda Park', inspection_date: '2026-04-12', inspection_result: 'Passed', notes: 'Insurance claim - hail damage repair' },
  { id: '3', permit_number: 'DET-2026-1192', job_name: 'Anderson Commercial Re-Roof', customer: 'Anderson Industries', address: '900 Michigan Ave', city: 'Detroit', state: 'MI', municipality: 'City of Detroit', permit_type: 'Commercial Roofing', status: 'in_review', submitted_date: '2026-04-01', approved_date: null, expiration_date: '', fee: 650, fee_paid: true, inspector: '', inspection_date: null, inspection_result: null, notes: 'TPO flat roof system, 12,000 sqft' },
  { id: '4', permit_number: 'DAL-2026-4598', job_name: 'Wilson Solar + Roof', customer: 'James Wilson', address: '7823 Preston Rd', city: 'Dallas', state: 'TX', municipality: 'City of Dallas', permit_type: 'Residential Roofing + Solar', status: 'pending', submitted_date: '2026-04-08', approved_date: null, expiration_date: '', fee: 425, fee_paid: false, inspector: '', inspection_date: null, inspection_result: null, notes: 'Combined roofing and Tesla Solar Roof install' },
  { id: '5', permit_number: 'COL-2026-8901', job_name: 'Patel Storm Damage', customer: 'Raj Patel', address: '1156 High St', city: 'Columbus', state: 'OH', municipality: 'Franklin County', permit_type: 'Emergency Repair', status: 'approved', submitted_date: '2026-03-22', approved_date: '2026-03-23', expiration_date: '2026-06-23', fee: 150, fee_paid: true, inspector: 'Mike Torres', inspection_date: '2026-04-10', inspection_result: 'Passed', notes: 'Emergency tarp and repair after tornado damage' },
  { id: '6', permit_number: 'DET-2026-1205', job_name: 'Garcia Tear-Off & Replace', customer: 'Maria Garcia', address: '3401 Woodward Ave', city: 'Detroit', state: 'MI', municipality: 'City of Detroit', permit_type: 'Residential Roofing', status: 'approved', submitted_date: '2026-03-05', approved_date: '2026-03-14', expiration_date: '2026-09-14', fee: 225, fee_paid: true, inspector: 'David Kim', inspection_date: null, inspection_result: null, notes: 'Full tear-off, architectural shingles, new underlayment' },
  { id: '7', permit_number: 'DAL-2025-3876', job_name: 'Roberts Metal Roof', customer: 'Tom Roberts', address: '1590 Greenville Ave', city: 'Dallas', state: 'TX', municipality: 'City of Dallas', permit_type: 'Residential Roofing', status: 'expired', submitted_date: '2025-08-15', approved_date: '2025-08-22', expiration_date: '2026-02-22', fee: 275, fee_paid: true, inspector: 'Robert Chen', inspection_date: null, inspection_result: null, notes: 'Standing seam metal roof - permit expired, needs renewal' },
  { id: '8', permit_number: 'COL-2026-8955', job_name: 'Chen Multi-Family', customer: 'Wei Chen', address: '4200 Sawmill Rd', city: 'Columbus', state: 'OH', municipality: 'City of Columbus', permit_type: 'Multi-Family Roofing', status: 'pending', submitted_date: '2026-04-10', approved_date: null, expiration_date: '', fee: 475, fee_paid: false, inspector: '', inspection_date: null, inspection_result: null, notes: '4-unit townhome complex, GAF Timberline HDZ' },
  { id: '9', permit_number: 'DET-2026-1220', job_name: 'Johnson Flat Roof', customer: 'Derek Johnson', address: '5600 Livernois Ave', city: 'Detroit', state: 'MI', municipality: 'Wayne County', permit_type: 'Commercial Roofing', status: 'denied', submitted_date: '2026-03-28', approved_date: null, expiration_date: '', fee: 350, fee_paid: true, inspector: '', inspection_date: null, inspection_result: null, notes: 'Denied - missing structural engineer report, resubmission required' },
  { id: '10', permit_number: 'DAL-2026-4612', job_name: 'Park HOA Roofing', customer: 'Lakewood HOA', address: '200 Lakewood Blvd', city: 'Dallas', state: 'TX', municipality: 'City of Dallas', permit_type: 'Multi-Family Roofing', status: 'in_review', submitted_date: '2026-04-05', approved_date: null, expiration_date: '', fee: 1200, fee_paid: true, inspector: '', inspection_date: null, inspection_result: null, notes: '24-unit HOA complex, phased replacement plan' },
];

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  approved: { color: 'text-green-700', bg: 'bg-green-100', label: 'Approved' },
  pending: { color: 'text-yellow-700', bg: 'bg-yellow-100', label: 'Pending' },
  in_review: { color: 'text-blue-700', bg: 'bg-blue-100', label: 'In Review' },
  expired: { color: 'text-red-700', bg: 'bg-red-100', label: 'Expired' },
  denied: { color: 'text-red-700', bg: 'bg-red-100', label: 'Denied' },
  renewal: { color: 'text-purple-700', bg: 'bg-purple-100', label: 'Renewal' },
};

export default function RoofingPermitsPage() {
  const [permits, setPermits] = useState<Permit[]>(mockPermits);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase.from('roofing_permits').select('*').eq('org_id', ORG_ID);
        if (data && data.length > 0) setPermits(data as any);
      } catch {}
    }
    load();
  }, []);

  const filtered = permits.filter(p => {
    const matchSearch = search === '' || p.permit_number.toLowerCase().includes(search.toLowerCase()) || p.customer.toLowerCase().includes(search.toLowerCase()) || p.address.toLowerCase().includes(search.toLowerCase()) || p.job_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchState = stateFilter === 'all' || p.state === stateFilter;
    return matchSearch && matchStatus && matchState;
  });

  const stats = {
    total: permits.length,
    approved: permits.filter(p => p.status === 'approved').length,
    pending: permits.filter(p => p.status === 'pending' || p.status === 'in_review').length,
    expired: permits.filter(p => p.status === 'expired').length,
    totalFees: permits.reduce((s, p) => s + p.fee, 0),
    unpaidFees: permits.filter(p => !p.fee_paid).reduce((s, p) => s + p.fee, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#0B1F3A' }}>Permit Management</h1>
            <p className="text-gray-500 mt-1">Track building permits across all markets</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
              <Download className="w-4 h-4" /> Export
            </button>
            <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-5 py-2 rounded-lg text-white text-sm font-semibold" style={{ background: '#F0A500' }}>
              <Plus className="w-4 h-4" /> New Permit
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Total Permits', value: stats.total, icon: FileText, color: '#0B1F3A' },
            { label: 'Approved', value: stats.approved, icon: CheckCircle, color: '#059669' },
            { label: 'Pending/Review', value: stats.pending, icon: Clock, color: '#D97706' },
            { label: 'Expired', value: stats.expired, icon: AlertTriangle, color: '#DC2626' },
            { label: 'Total Fees', value: `$${stats.totalFees.toLocaleString()}`, icon: DollarSign, color: '#007A67' },
            { label: 'Unpaid Fees', value: `$${stats.unpaidFees.toLocaleString()}`, icon: DollarSign, color: '#DC2626' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
                <span className="text-xs text-gray-500 font-medium">{s.label}</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Municipality Quick View */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { city: 'Dallas, TX', permits: permits.filter(p => p.state === 'TX').length, pending: permits.filter(p => p.state === 'TX' && (p.status === 'pending' || p.status === 'in_review')).length, avgDays: 7, portal: 'dallas.gov/permits' },
            { city: 'Columbus, OH', permits: permits.filter(p => p.state === 'OH').length, pending: permits.filter(p => p.state === 'OH' && (p.status === 'pending' || p.status === 'in_review')).length, avgDays: 5, portal: 'columbus.gov/permits' },
            { city: 'Detroit, MI', permits: permits.filter(p => p.state === 'MI').length, pending: permits.filter(p => p.state === 'MI' && (p.status === 'pending' || p.status === 'in_review')).length, avgDays: 10, portal: 'detroitmi.gov/permits' },
          ].map((m, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" style={{ color: '#0B1F3A' }} />
                  <h3 className="font-bold text-lg" style={{ color: '#0B1F3A' }}>{m.city}</h3>
                </div>
                <a href="#" className="text-xs flex items-center gap-1" style={{ color: '#007A67' }}>
                  Portal <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xl font-bold" style={{ color: '#0B1F3A' }}>{m.permits}</p>
                  <p className="text-xs text-gray-500">Active</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-yellow-600">{m.pending}</p>
                  <p className="text-xs text-gray-500">Pending</p>
                </div>
                <div>
                  <p className="text-xl font-bold" style={{ color: '#007A67' }}>{m.avgDays}d</p>
                  <p className="text-xs text-gray-500">Avg Approval</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search permits, customers, addresses..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0A500]/30" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="in_review">In Review</option>
              <option value="expired">Expired</option>
              <option value="denied">Denied</option>
            </select>
            <select value={stateFilter} onChange={e => setStateFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
              <option value="all">All Markets</option>
              <option value="TX">Texas</option>
              <option value="OH">Ohio</option>
              <option value="MI">Michigan</option>
            </select>
          </div>
        </div>

        {/* Permits Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider" style={{ background: '#F8FAFC' }}>
                  <th className="px-4 py-3">Permit #</th>
                  <th className="px-4 py-3">Job / Customer</th>
                  <th className="px-4 py-3">Municipality</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Fee</th>
                  <th className="px-4 py-3">Inspection</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(p => {
                  const sc = statusConfig[p.status];
                  const isExpanded = expanded === p.id;
                  return (
                    <Fragment key={p.id}>
                      <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => setExpanded(isExpanded ? null : p.id)}>
                        <td className="px-4 py-3">
                          <span className="font-mono text-sm font-semibold" style={{ color: '#0B1F3A' }}>{p.permit_number}</span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-900">{p.job_name}</p>
                          <p className="text-xs text-gray-500">{p.customer} · {p.address}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="text-sm">{p.municipality}</span>
                          </div>
                          <p className="text-xs text-gray-400">{p.city}, {p.state}</p>
                        </td>
                        <td className="px-4 py-3 text-sm">{p.permit_type}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}>
                            {sc.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{p.submitted_date}</td>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-medium ${p.fee_paid ? 'text-green-600' : 'text-red-600'}`}>
                            ${p.fee}
                          </span>
                          <p className="text-xs text-gray-400">{p.fee_paid ? 'Paid' : 'Unpaid'}</p>
                        </td>
                        <td className="px-4 py-3">
                          {p.inspection_result ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                              <CheckCircle className="w-3 h-3" /> {p.inspection_result}
                            </span>
                          ) : p.status === 'approved' ? (
                            <span className="text-xs text-yellow-600">Not Scheduled</span>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={9} className="px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Permit Details</h4>
                                <div className="space-y-1 text-sm">
                                  <p><span className="text-gray-500">Submitted:</span> {p.submitted_date}</p>
                                  <p><span className="text-gray-500">Approved:</span> {p.approved_date || 'Pending'}</p>
                                  <p><span className="text-gray-500">Expires:</span> {p.expiration_date || 'N/A'}</p>
                                  <p><span className="text-gray-500">Fee:</span> ${p.fee} ({p.fee_paid ? 'Paid' : 'Unpaid'})</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Inspection</h4>
                                <div className="space-y-1 text-sm">
                                  <p><span className="text-gray-500">Inspector:</span> {p.inspector || 'Not Assigned'}</p>
                                  <p><span className="text-gray-500">Date:</span> {p.inspection_date || 'Not Scheduled'}</p>
                                  <p><span className="text-gray-500">Result:</span> {p.inspection_result || 'Pending'}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Notes</h4>
                                <p className="text-sm text-gray-600">{p.notes}</p>
                                <div className="flex gap-2 mt-3">
                                  <button className="text-xs px-3 py-1 rounded-md text-white font-medium" style={{ background: '#007A67' }}>View Documents</button>
                                  {p.status === 'expired' && <button className="text-xs px-3 py-1 rounded-md bg-yellow-500 text-white font-medium">Renew Permit</button>}
                                  {p.status === 'denied' && <button className="text-xs px-3 py-1 rounded-md bg-blue-500 text-white font-medium">Resubmit</button>}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Expirations */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4" style={{ color: '#0B1F3A' }}>Upcoming Expirations</h2>
          <div className="space-y-3">
            {permits.filter(p => p.expiration_date && p.status === 'approved').sort((a, b) => a.expiration_date.localeCompare(b.expiration_date)).slice(0, 4).map(p => {
              const exp = new Date(p.expiration_date);
              const now = new Date();
              const daysLeft = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              return (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${daysLeft < 30 ? 'bg-red-500' : daysLeft < 90 ? 'bg-yellow-500' : 'bg-green-500'}`} />
                    <div>
                      <p className="text-sm font-medium">{p.permit_number} — {p.job_name}</p>
                      <p className="text-xs text-gray-500">{p.municipality}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${daysLeft < 30 ? 'text-red-600' : daysLeft < 90 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                    </p>
                    <p className="text-xs text-gray-400">Expires {p.expiration_date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Create Modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold" style={{ color: '#0B1F3A' }}>New Permit Application</h2>
                <button onClick={() => setShowCreate(false)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job / Customer</label>
                  <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Select job..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Municipality</label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                      <option>City of Dallas</option>
                      <option>City of Columbus</option>
                      <option>City of Detroit</option>
                      <option>Franklin County</option>
                      <option>Wayne County</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Permit Type</label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                      <option>Residential Roofing</option>
                      <option>Commercial Roofing</option>
                      <option>Multi-Family Roofing</option>
                      <option>Emergency Repair</option>
                      <option>Residential Roofing + Solar</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Address</label>
                  <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Full address..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Permit Fee</label>
                    <input type="number" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="$0.00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fee Status</label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                      <option>Paid</option>
                      <option>Unpaid</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Scope of work, special requirements..." />
                </div>
              </div>
              <div className="flex justify-end gap-3 p-6 border-t">
                <button onClick={() => setShowCreate(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium">Cancel</button>
                <button onClick={() => setShowCreate(false)} className="px-5 py-2 rounded-lg text-white text-sm font-semibold" style={{ background: '#F0A500' }}>Submit Application</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

