'use client';

import { Search, Filter, Phone, MapPin, Zap, DollarSign, Calendar, ChevronDown, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const LeadsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const leads = [
    {
      id: 1,
      name: 'Sarah Johnson',
      address: '1425 Oak Street, Austin, TX 78701',
      currentISP: 'Comcast',
      speed: '100 Mbps',
      monthlyCost: '$89.99',
      status: 'hot',
      assignedRep: 'Michael Chen',
      phone: '(512) 555-0142',
      lastContact: '2 days ago',
      qualityScore: 92,
    },
    {
      id: 2,
      name: 'David Martinez',
      address: '3847 Maple Drive, Dallas, TX 75201',
      currentISP: 'Charter',
      speed: '200 Mbps',
      monthlyCost: '$129.99',
      status: 'qualified',
      assignedRep: 'Lisa Anderson',
      phone: '(214) 555-0189',
      lastContact: '5 days ago',
      qualityScore: 78,
    },
    {
      id: 3,
      name: 'Jennifer Williams',
      address: '5623 Pine Avenue, Houston, TX 77002',
      currentISP: 'Spectrum',
      speed: '150 Mbps',
      monthlyCost: '$99.99',
      status: 'contacted',
      assignedRep: 'Robert Taylor',
      phone: '(713) 555-0234',
      lastContact: '1 week ago',
      qualityScore: 65,
    },
    {
      id: 4,
      name: 'James Brown',
      address: '2341 Cedar Lane, San Antonio, TX 78201',
      currentISP: 'Windstream',
      speed: '50 Mbps',
      monthlyCost: '$49.99',
      status: 'hot',
      assignedRep: 'Michael Chen',
      phone: '(210) 555-0456',
      lastContact: '1 day ago',
      qualityScore: 88,
    },
    {
      id: 5,
      name: 'Patricia Garcia',
      address: '7654 Elm Street, Austin, TX 78704',
      currentISP: 'AT&T (Legacy)',
      speed: '25 Mbps',
      monthlyCost: '$59.99',
      status: 'new',
      assignedRep: 'Sarah Williams',
      phone: '(512) 555-0678',
      lastContact: 'Never',
      qualityScore: 72,
    },
    {
      id: 6,
      name: 'Christopher Lee',
      address: '9876 Birch Road, Fort Worth, TX 76102',
      currentISP: 'Verizon',
      speed: '300 Mbps',
      monthlyCost: '$149.99',
      status: 'qualified',
      assignedRep: 'Lisa Anderson',
      phone: '(817) 555-0890',
      lastContact: '3 days ago',
      qualityScore: 81,
    },
    {
      id: 7,
      name: 'Nancy Rodriguez',
      address: '4321 Walnut Court, Arlington, TX 76010',
      currentISP: 'Dish',
      speed: '75 Mbps',
      monthlyCost: '$79.99',
      status: 'contacted',
      assignedRep: 'Robert Taylor',
      phone: '(817) 555-1012',
      lastContact: '4 days ago',
      qualityScore: 58,
    },
    {
      id: 8,
      name: 'Thomas Anderson',
      address: '5555 Oak Park Way, Plano, TX 75023',
      currentISP: 'Comcast',
      speed: '250 Mbps',
      monthlyCost: '$119.99',
      status: 'hot',
      assignedRep: 'Michael Chen',
      phone: '(972) 555-1234',
      lastContact: 'Today',
      qualityScore: 95,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot':
        return 'bg-red-500/10 border-red-500/20 text-red-400';
      case 'qualified':
        return 'bg-green-500/10 border-green-500/20 text-green-400';
      case 'contacted':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      case 'new':
        return 'bg-purple-500/10 border-purple-500/20 text-purple-400';
      default:
        return 'bg-slate-500/10 border-slate-500/20 text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'hot':
        return <AlertCircle className="w-4 h-4" />;
      case 'qualified':
        return <CheckCircle className="w-4 h-4" />;
      case 'contacted':
        return <Clock className="w-4 h-4" />;
      case 'new':
        return <Zap className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-blue-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: leads.length,
    hot: leads.filter((l) => l.status === 'hot').length,
    qualified: leads.filter((l) => l.status === 'qualified').length,
    contacted: leads.filter((l) => l.status === 'contacted').length,
    new: leads.filter((l) => l.status === 'new').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Sales Leads</h1>
          <p className="text-slate-400">Manage and track potential customers</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-4 border border-slate-700">
            <p className="text-slate-400 text-sm mb-1">Total Leads</p>
            <p className="text-3xl font-bold text-white">{statusCounts.all}</p>
          </div>
          <div className="bg-gradient-to-br from-red-900 to-red-800 rounded-lg p-4 border border-red-700">
            <p className="text-red-300 text-sm mb-1">Hot Leads</p>
            <p className="text-3xl font-bold text-white">{statusCounts.hot}</p>
          </div>
          <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-4 border border-green-700">
            <p className="text-green-300 text-sm mb-1">Qualified</p>
            <p className="text-3xl font-bold text-white">{statusCounts.qualified}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-4 border border-blue-700">
            <p className="text-blue-300 text-sm mb-1">Contacted</p>
            <p className="text-3xl font-bold text-white">{statusCounts.contacted}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-4 border border-purple-700">
            <p className="text-purple-300 text-sm mb-1">New</p>
            <p className="text-3xl font-bold text-white">{statusCounts.new}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-lg mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex-grow relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by name, address, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Filter
                  <ChevronDown className="w-4 h-4" />
                </button>
                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 bg-slate-700 border border-slate-600 rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => {
                        setStatusFilter('all');
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-slate-600 ${statusFilter === 'all' ? 'text-sky-400' : 'text-slate-300'}`}
                    >
                      All Leads ({statusCounts.all})
                    </button>
                    <button
                      onClick={() => {
                        setStatusFilter('hot');
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-slate-600 ${statusFilter === 'hot' ? 'text-red-400' : 'text-slate-300'}`}
                    >
                      Hot Leads ({statusCounts.hot})
                    </button>
                    <button
                      onClick={() => {
                        setStatusFilter('qualified');
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-slate-600 ${statusFilter === 'qualified' ? 'text-green-400' : 'text-slate-300'}`}
                    >
                      Qualified ({statusCounts.qualified})
                    </button>
                    <button
                      onClick={() => {
                        setStatusFilter('contacted');
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-slate-600 ${statusFilter === 'contacted' ? 'text-blue-400' : 'text-slate-300'}`}
                    >
                      Contacted ({statusCounts.contacted})
                    </button>
                    <button
                      onClick={() => {
                        setStatusFilter('new');
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-slate-600 ${statusFilter === 'new' ? 'text-purple-400' : 'text-slate-300'}`}
                    >
                      New ({statusCounts.new})
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700 border-b border-slate-600">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Address</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Current ISP</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Speed</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Cost</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Quality</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Rep</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Last Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-700/50 transition-colors cursor-pointer">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-medium">{lead.name}</p>
                          <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3" />
                            {lead.phone}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-300 text-sm flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />
                          {lead.address}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{lead.currentISP}</td>
                      <td className="px-6 py-4">
                        <p className="text-slate-300 flex items-center gap-1">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          {lead.speed}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-300 flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-green-400" />
                          {lead.monthlyCost}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border ${getStatusColor(lead.status)}`}>
                          {getStatusIcon(lead.status)}
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className={`font-semibold ${getQualityColor(lead.qualityScore)}`}>{lead.qualityScore}%</p>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{lead.assignedRep}</td>
                      <td className="px-6 py-4 text-slate-400 text-sm">{lead.lastContact}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center text-slate-400">
                      No leads match your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-slate-400 text-sm">
          <p>Showing {filteredLeads.length} of {leads.length} leads</p>
        </div>
      </div>
    </div>
  );
};

export default LeadsPage;
