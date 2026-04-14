'use client';

import { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Download,
  Send,
  Eye,
  Trash2,
  Copy,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  BarChart3,
  Settings,
} from 'lucide-react';

interface Contract {
  id: string;
  title: string;
  client: string;
  value: number;
  status: 'draft' | 'pending_signature' | 'signed' | 'expired';
  created_date: string;
  due_date: string;
  template_used: string;
}

interface ContractTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  created_by: string;
  usage_count: number;
  last_modified: string;
}

const mockContracts: Contract[] = [
  {
    id: 'c001',
    title: 'Solar Installation Agreement',
    client: 'Acme Corp',
    value: 150000,
    status: 'signed',
    created_date: '2026-03-15',
    due_date: '2026-04-15',
    template_used: 'Standard Solar Installation',
  },
  {
    id: 'c002',
    title: 'Maintenance Service Contract',
    client: 'Green Energy Ltd',
    value: 45000,
    status: 'pending_signature',
    created_date: '2026-04-05',
    due_date: '2026-04-20',
    template_used: 'Maintenance Agreement',
  },
  {
    id: 'c003',
    title: 'Power Purchase Agreement',
    client: 'Tech Industries',
    value: 500000,
    status: 'draft',
    created_date: '2026-04-10',
    due_date: '2026-05-10',
    template_used: 'PPA Framework',
  },
  {
    id: 'c004',
    title: 'Rooftop Lease Agreement',
    client: 'Urban Properties Inc',
    value: 75000,
    status: 'signed',
    created_date: '2026-02-20',
    due_date: '2026-03-20',
    template_used: 'Rooftop Lease',
  },
  {
    id: 'c005',
    title: 'EPC Contract',
    client: 'BuildRight Corp',
    value: 2500000,
    status: 'pending_signature',
    created_date: '2026-03-25',
    due_date: '2026-04-25',
    template_used: 'Engineering Procurement',
  },
  {
    id: 'c006',
    title: 'Operations Agreement',
    client: 'Solar Solutions Co',
    value: 120000,
    status: 'signed',
    created_date: '2026-01-10',
    due_date: '2026-02-10',
    template_used: 'O&M Agreement',
  },
  {
    id: 'c007',
    title: 'Installation Agreement',
    client: 'Future Energy LLC',
    value: 350000,
    status: 'draft',
    created_date: '2026-04-08',
    due_date: '2026-05-08',
    template_used: 'Standard Solar Installation',
  },
  {
    id: 'c008',
    title: 'Joint Development Agreement',
    client: 'Global Solar Partners',
    value: 1200000,
    status: 'expired',
    created_date: '2025-10-15',
    due_date: '2026-04-01',
    template_used: 'Joint Development',
  },
];

const mockTemplates: ContractTemplate[] = [
  {
    id: 't001',
    name: 'Standard Solar Installation',
    category: 'Installation',
    description: 'Standard agreement for residential and commercial solar installations',
    created_by: 'Legal Team',
    usage_count: 42,
    last_modified: '2026-03-20',
  },
  {
    id: 't002',
    name: 'Maintenance Agreement',
    category: 'Operations',
    description: 'Operations and maintenance service contract for solar systems',
    created_by: 'Legal Team',
    usage_count: 28,
    last_modified: '2026-02-15',
  },
  {
    id: 't003',
    name: 'PPA Framework',
    category: 'Power Purchase',
    description: 'Power purchase agreement framework for utility-scale projects',
    created_by: 'Legal Team',
    usage_count: 12,
    last_modified: '2026-03-01',
  },
  {
    id: 't004',
    name: 'Rooftop Lease',
    category: 'Leasing',
    description: 'Rooftop lease agreement for solar installations',
    created_by: 'Business Development',
    usage_count: 31,
    last_modified: '2026-02-28',
  },
  {
    id: 't005',
    name: 'Engineering Procurement',
    category: 'EPC',
    description: 'Engineering, procurement, and construction contract',
    created_by: 'Legal Team',
    usage_count: 8,
    last_modified: '2026-04-01',
  },
  {
    id: 't006',
    name: 'Joint Development',
    category: 'Partnership',
    description: 'Joint development and collaboration agreement',
    created_by: 'Business Development',
    usage_count: 5,
    last_modified: '2026-03-15',
  },
];

const statusStyles: Record<Contract['status'], string> = {
  draft: 'bg-gray-100 text-gray-700',
  pending_signature: 'bg-yellow-100 text-yellow-700',
  signed: 'bg-green-100 text-green-700',
  expired: 'bg-red-100 text-red-700',
};

const statusLabels: Record<Contract['status'], string> = {
  draft: 'Draft',
  pending_signature: 'Pending Signature',
  signed: 'Signed',
  expired: 'Expired',
};

export default function ContractsPage() {
  const [activeTab, setActiveTab] = useState<'contracts' | 'templates'>('contracts');
  const [contractSearch, setContractSearch] = useState('');
  const [contractTypeFilter, setContractTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredContracts = mockContracts.filter((contract) => {
    const matchesSearch = contract.title.toLowerCase().includes(contractSearch.toLowerCase()) ||
      contract.client.toLowerCase().includes(contractSearch.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeContractsCount = mockContracts.filter((c) => c.status !== 'expired').length;
  const pendingSignatureCount = mockContracts.filter((c) => c.status === 'pending_signature').length;
  const signedThisMonthCount = mockContracts.filter(
    (c) => c.status === 'signed' && c.created_date.startsWith('2026-04')
  ).length;
  const totalValue = mockContracts.reduce((sum, c) => sum + c.value, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-[#F0A500] to-[#D4860D] p-3">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#0B1F3A]">Contract Manager</h1>
                <p className="text-gray-500">Manage your solar agreements and templates</p>
              </div>
            </div>
            <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#F0A500] to-[#D4860D] px-4 py-2 font-semibold text-white transition-all hover:shadow-lg">
              <Plus className="h-5 w-5" />
              New Contract
            </button>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Contracts</p>
                  <p className="mt-1 text-2xl font-bold text-[#0B1F3A]">{activeContractsCount}</p>
                </div>
                <div className="rounded-lg bg-[#007A67]/10 p-3">
                  <BarChart3 className="h-6 w-6 text-[#007A67]" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Signatures</p>
                  <p className="mt-1 text-2xl font-bold text-[#0B1F3A]">{pendingSignatureCount}</p>
                </div>
                <div className="rounded-lg bg-yellow-100 p-3">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Signed This Month</p>
                  <p className="mt-1 text-2xl font-bold text-[#0B1F3A]">{signedThisMonthCount}</p>
                </div>
                <div className="rounded-lg bg-green-100 p-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="mt-1 text-2xl font-bold text-[#0B1F3A]">
                    ${(totalValue / 1000000).toFixed(2)}M
                  </p>
                </div>
                <div className="rounded-lg bg-[#F0A500]/10 p-3">
                  <DollarSign className="h-6 w-6 text-[#F0A500]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Tabs */}
        <div className="mb-6 flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('contracts')}
            className={`pb-3 font-semibold transition-colors ${
              activeTab === 'contracts'
                ? 'border-b-2 border-[#F0A500] text-[#0B1F3A]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Contracts
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`pb-3 font-semibold transition-colors ${
              activeTab === 'templates'
                ? 'border-b-2 border-[#F0A500] text-[#0B1F3A]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Templates
          </button>
        </div>

        {/* Contracts Tab */}
        {activeTab === 'contracts' && (
          <div>
            {/* Filter Row */}
            <div className="mb-6 flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search contracts..."
                    value={contractSearch}
                    onChange={(e) => setContractSearch(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 focus:border-[#F0A500] focus:outline-none focus:ring-2 focus:ring-[#F0A500]/20"
                  />
                </div>
              </div>

              <select
                value={contractTypeFilter}
                onChange={(e) => setContractTypeFilter(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-[#F0A500] focus:outline-none focus:ring-2 focus:ring-[#F0A500]/20"
              >
                <option value="all">All Contract Types</option>
                <option value="installation">Installation</option>
                <option value="maintenance">Maintenance</option>
                <option value="ppa">Power Purchase</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Contract['status'] | 'all')}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-[#F0A500] focus:outline-none focus:ring-2 focus:ring-[#F0A500]/20"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="pending_signature">Pending Signature</option>
                <option value="signed">Signed</option>
                <option value="expired">Expired</option>
              </select>

              <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50">
                <Filter className="h-5 w-5" />
                More Filters
              </button>
            </div>

            {/* Contracts Table */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Contract Title</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Client</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Value</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Due Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContracts.map((contract, idx) => (
                    <tr key={contract.id} className={idx !== filteredContracts.length - 1 ? 'border-b border-gray-200' : ''}>
                      <td className="px-6 py-4 text-sm font-medium text-[#0B1F3A]">{contract.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{contract.client}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        ${(contract.value / 1000).toFixed(0)}K
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[contract.status]}`}>
                          {statusLabels[contract.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{contract.due_date}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
                            <Download className="h-4 w-4" />
                          </button>
                          <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
                            <Send className="h-4 w-4" />
                          </button>
                          <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockTemplates.map((template) => (
                <div
                  key={template.id}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="rounded-lg bg-[#007A67]/10 p-3">
                      <FileText className="h-6 w-6 text-[#007A67]" />
                    </div>
                    <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>

                  <h3 className="mb-2 text-lg font-bold text-[#0B1F3A]">{template.name}</h3>
                  <p className="mb-3 text-sm text-gray-600">{template.description}</p>

                  <div className="mb-4 space-y-2 border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-semibold text-gray-900">{template.category}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Used:</span>
                      <span className="font-semibold text-gray-900">{template.usage_count} times</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Modified:</span>
                      <span className="font-semibold text-gray-900">{template.last_modified}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 rounded-lg bg-[#F0A500] px-3 py-2 font-semibold text-white transition-all hover:bg-[#D4860D]">
                      Use Template
                    </button>
                    <button className="flex-1 rounded-lg border border-gray-300 px-3 py-2 font-semibold text-gray-700 transition-all hover:bg-gray-50">
                      <Copy className="inline h-4 w-4 mr-2" />
                      Duplicate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
