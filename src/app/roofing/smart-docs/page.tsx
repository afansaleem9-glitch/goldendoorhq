"use client";
import { useState, useEffect } from 'react';
import { supabase, ORG_ID } from '@/lib/supabase';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Send,
  Download,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  MoreVertical,
  Upload,
  PenTool,
  FileSignature,
  Folder,
  Tag,
  Copy,
  Archive,
  RefreshCw,
  Users,
  Calendar,
  DollarSign,
  Home,
  Shield,
  Mail,
  Phone,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  Zap,
  Star,
  BarChart3,
  TrendingUp,
  Activity,
} from 'lucide-react';

interface DocumentTemplate {
  id: string;
  name: string;
  category: string;
  lastUpdated: string;
  timesUsed: number;
  icon: React.ReactNode;
}

interface Signer {
  name: string;
  email: string;
  status: 'pending' | 'signed' | 'declined' | 'viewed';
  signedDate?: string;
  signatureUrl?: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  customer: string;
  job: string;
  status: 'Draft' | 'Sent' | 'Viewed' | 'Signed' | 'Expired';
  created: string;
  signers: Signer[];
  expanded?: boolean;
}

const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'roofing-contract',
    name: 'Roofing Contract',
    category: 'Contracts',
    lastUpdated: '2026-03-15',
    timesUsed: 347,
    icon: <FileSignature className="w-5 h-5" />,
  },
  {
    id: 'insurance-auth',
    name: 'Insurance Authorization',
    category: 'Insurance',
    lastUpdated: '2026-03-10',
    timesUsed: 289,
    icon: <Shield className="w-5 h-5" />,
  },
  {
    id: 'material-order',
    name: 'Material Order Form',
    category: 'Orders',
    lastUpdated: '2026-02-28',
    timesUsed: 156,
    icon: <Folder className="w-5 h-5" />,
  },
  {
    id: 'change-order',
    name: 'Change Order',
    category: 'Modifications',
    lastUpdated: '2026-03-12',
    timesUsed: 203,
    icon: <Edit className="w-5 h-5" />,
  },
  {
    id: 'lien-waiver',
    name: 'Lien Waiver',
    category: 'Legal',
    lastUpdated: '2026-03-08',
    timesUsed: 178,
    icon: <FileText className="w-5 h-5" />,
  },
  {
    id: 'warranty-cert',
    name: 'Warranty Certificate',
    category: 'Warranties',
    lastUpdated: '2026-03-05',
    timesUsed: 342,
    icon: <CheckCircle className="w-5 h-5" />,
  },
  {
    id: 'completion-cert',
    name: 'Completion Certificate',
    category: 'Completion',
    lastUpdated: '2026-03-14',
    timesUsed: 234,
    icon: <Star className="w-5 h-5" />,
  },
  {
    id: 'customer-agreement',
    name: 'Customer Agreement',
    category: 'Agreements',
    lastUpdated: '2026-03-11',
    timesUsed: 298,
    icon: <Users className="w-5 h-5" />,
  },
];

const MOCK_DOCUMENTS: Document[] = [
  {
    id: 'doc-001',
    name: 'Roofing Contract - Miller Residence',
    type: 'Roofing Contract',
    customer: 'John Miller',
    job: 'Columbus, OH - Shingle Replacement',
    status: 'Signed',
    created: '2026-04-10',
    signers: [
      {
        name: 'John Miller',
        email: 'john.miller@email.com',
        status: 'signed',
        signedDate: '2026-04-11 14:32',
      },
      {
        name: 'Sarah Thompson (Company Rep)',
        email: 'sarah@goldendoor.com',
        status: 'signed',
        signedDate: '2026-04-11 14:35',
      },
    ],
  },
  {
    id: 'doc-002',
    name: 'Insurance Authorization - Kowalski',
    type: 'Insurance Authorization',
    customer: 'Robert Kowalski',
    job: 'Detroit, MI - Storm Damage Repair',
    status: 'Viewed',
    created: '2026-04-12',
    signers: [
      {
        name: 'Robert Kowalski',
        email: 'rkowalski@email.com',
        status: 'pending',
      },
      {
        name: 'Tom Bradley (Insurance Agent)',
        email: 'tom.bradley@insurance.com',
        status: 'signed',
        signedDate: '2026-04-13 09:15',
      },
    ],
  },
  {
    id: 'doc-003',
    name: 'Material Order Form - Patterson Project',
    type: 'Material Order Form',
    customer: 'Patricia Patterson',
    job: 'Dallas, TX - Metal Roof Installation',
    status: 'Sent',
    created: '2026-04-13',
    signers: [
      {
        name: 'Patricia Patterson',
        email: 'ppatterson@email.com',
        status: 'pending',
      },
    ],
  },
  {
    id: 'doc-004',
    name: 'Change Order #2 - Garcia Residence',
    type: 'Change Order',
    customer: 'Manuel Garcia',
    job: 'Houston, TX - Roof Restoration',
    status: 'Signed',
    created: '2026-04-05',
    signers: [
      {
        name: 'Manuel Garcia',
        email: 'mgarcia@email.com',
        status: 'signed',
        signedDate: '2026-04-06 16:48',
      },
      {
        name: 'Lisa Chen (Project Manager)',
        email: 'lisa.chen@goldendoor.com',
        status: 'signed',
        signedDate: '2026-04-06 17:02',
      },
    ],
  },
  {
    id: 'doc-005',
    name: 'Lien Waiver - Thompson Build',
    type: 'Lien Waiver',
    customer: 'Commercial Dev LLC',
    job: 'Austin, TX - Commercial Roofing',
    status: 'Signed',
    created: '2026-03-28',
    signers: [
      {
        name: 'James Richardson',
        email: 'james@commercialdev.com',
        status: 'signed',
        signedDate: '2026-03-29 10:22',
      },
      {
        name: 'David Wilson (Accounting)',
        email: 'david.wilson@goldendoor.com',
        status: 'signed',
        signedDate: '2026-03-29 10:45',
      },
    ],
  },
  {
    id: 'doc-006',
    name: 'Warranty Certificate - Arlington Estate',
    type: 'Warranty Certificate',
    customer: 'Elizabeth Anderson',
    job: 'Arlington, TX - Premium Shingle Roof',
    status: 'Draft',
    created: '2026-04-14',
    signers: [
      {
        name: 'Elizabeth Anderson',
        email: 'eanderson@email.com',
        status: 'pending',
      },
    ],
  },
  {
    id: 'doc-007',
    name: 'Customer Agreement - Midwest Insurance',
    type: 'Customer Agreement',
    customer: 'Midwest Insurance Partners',
    job: 'Cleveland, OH - Multi-Property Program',
    status: 'Viewed',
    created: '2026-04-08',
    signers: [
      {
        name: 'Jennifer White',
        email: 'jwhite@midwestinsurance.com',
        status: 'signed',
        signedDate: '2026-04-09 13:54',
      },
      {
        name: 'Mark Stevens',
        email: 'mark.stevens@midwestinsurance.com',
        status: 'pending',
      },
    ],
  },
  {
    id: 'doc-008',
    name: 'Completion Certificate - Harris Roof',
    type: 'Completion Certificate',
    customer: 'William Harris',
    job: 'San Antonio, TX - Flat Roof Replacement',
    status: 'Signed',
    created: '2026-03-30',
    signers: [
      {
        name: 'William Harris',
        email: 'wharris@email.com',
        status: 'signed',
        signedDate: '2026-03-31 11:36',
      },
      {
        name: 'Robert Johnson (Supervisor)',
        email: 'robert.johnson@goldendoor.com',
        status: 'signed',
        signedDate: '2026-03-31 11:50',
      },
    ],
  },
  {
    id: 'doc-009',
    name: 'Roofing Contract - Perez Commercial',
    type: 'Roofing Contract',
    customer: 'Carlos Perez Development',
    job: 'Fort Worth, TX - Industrial Complex',
    status: 'Sent',
    created: '2026-04-11',
    signers: [
      {
        name: 'Carlos Perez',
        email: 'carlos@perezdev.com',
        status: 'viewed',
      },
      {
        name: 'Miguel Santos',
        email: 'miguel@perezdev.com',
        status: 'pending',
      },
    ],
  },
  {
    id: 'doc-010',
    name: 'Insurance Authorization - Campbell',
    type: 'Insurance Authorization',
    customer: 'Susan Campbell',
    job: 'Indianapolis, IN - Hail Damage Assessment',
    status: 'Expired',
    created: '2026-03-22',
    signers: [
      {
        name: 'Susan Campbell',
        email: 'scampbell@email.com',
        status: 'declined',
      },
    ],
  },
];

export default function SmartDocsPage() {
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.job.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !selectedStatus || doc.status === selectedStatus;
    const matchesType = !selectedType || doc.type === selectedType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    totalDocuments: documents.length,
    pendingSignatures: documents.reduce(
      (acc, doc) => acc + doc.signers.filter((s) => s.status === 'pending').length,
      0
    ),
    completed: documents.filter((doc) => doc.status === 'Signed').length,
    templatesAvailable: DOCUMENT_TEMPLATES.length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Signed':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'Sent':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'Viewed':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'Draft':
        return 'bg-gray-50 border-gray-200 text-gray-700';
      case 'Expired':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Signed':
        return <CheckCircle className="w-4 h-4" />;
      case 'Sent':
        return <Send className="w-4 h-4" />;
      case 'Viewed':
        return <Eye className="w-4 h-4" />;
      case 'Draft':
        return <FileText className="w-4 h-4" />;
      case 'Expired':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getSignerStatusIcon = (status: string) => {
    switch (status) {
      case 'signed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'declined':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: '#F0A500' }}
                >
                  <FileSignature className="w-8 h-8" style={{ color: '#0B1F3A' }} />
                </div>
                SmartDocs
              </h1>
              <p className="text-slate-600 mt-1">
                Professional document management and e-signature tracking
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
              style={{ backgroundColor: '#007A67' }}
            >
              <Plus className="w-5 h-5" />
              Create Document
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Documents</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {stats.totalDocuments}
                </p>
              </div>
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: '#F0A500' + '20' }}
              >
                <FileText className="w-6 h-6" style={{ color: '#F0A500' }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Pending Signatures
                </p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">
                  {stats.pendingSignatures}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-50">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {stats.completed}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Templates Available
                </p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {stats.templatesAvailable}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <Folder className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Document Templates Section */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <PenTool className="w-6 h-6" style={{ color: '#007A67' }} />
            Document Templates
          </h2>

          <div className="grid grid-cols-4 gap-4">
            {DOCUMENT_TEMPLATES.map((template) => (
              <div
                key={template.id}
                className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-blue-50 transition-colors">
                    {template.icon}
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-700">
                    {template.timesUsed}x
                  </span>
                </div>

                <h3 className="font-semibold text-slate-900 text-sm mb-1">
                  {template.name}
                </h3>
                <p className="text-xs text-slate-600 mb-3">{template.category}</p>
                <p className="text-xs text-slate-500 mb-4">
                  Updated {template.lastUpdated}
                </p>

                <button className="w-full py-2 px-3 rounded border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                  Use Template
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 mb-8">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by document name, customer, or job..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                >
                  <option value="">All Statuses</option>
                  <option value="Draft">Draft</option>
                  <option value="Sent">Sent</option>
                  <option value="Viewed">Viewed</option>
                  <option value="Signed">Signed</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Document Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                >
                  <option value="">All Types</option>
                  <option value="Roofing Contract">Roofing Contract</option>
                  <option value="Insurance Authorization">
                    Insurance Authorization
                  </option>
                  <option value="Material Order Form">Material Order Form</option>
                  <option value="Change Order">Change Order</option>
                  <option value="Lien Waiver">Lien Waiver</option>
                  <option value="Warranty Certificate">Warranty Certificate</option>
                  <option value="Completion Certificate">
                    Completion Certificate
                  </option>
                  <option value="Customer Agreement">Customer Agreement</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                >
                  <option value="">All Time</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                  <option value="year">This Year</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Active Documents Table */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5" style={{ color: '#007A67' }} />
              Active Documents ({filteredDocuments.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Job
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Signers
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc) => (
                  <div key={doc.id}>
                    <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() =>
                            setExpandedDocId(
                              expandedDocId === doc.id ? null : doc.id
                            )
                          }
                        >
                          {expandedDocId === doc.id ? (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          )}
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-slate-900">
                            {doc.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-700">{doc.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-900">
                          {doc.customer}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-700">{doc.job}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            doc.status
                          )}`}
                        >
                          {getStatusIcon(doc.status)}
                          {doc.status}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">{doc.created}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex -space-x-2">
                          {doc.signers.slice(0, 3).map((signer, idx) => (
                            <div
                              key={idx}
                              className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold border-2 border-white"
                              title={signer.name}
                            >
                              {signer.name.charAt(0)}
                            </div>
                          ))}
                          {doc.signers.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center text-slate-700 text-xs font-bold border-2 border-white">
                              +{doc.signers.length - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button className="p-2 hover:bg-slate-200 rounded transition-colors">
                          <MoreVertical className="w-4 h-4 text-slate-600" />
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Row */}
                    {expandedDocId === doc.id && (
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <td colSpan={8} className="px-6 py-6">
                          <div className="grid grid-cols-2 gap-8">
                            {/* Document Preview Placeholder */}
                            <div>
                              <h4 className="font-semibold text-slate-900 mb-4">
                                Document Preview
                              </h4>
                              <div className="bg-white border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                                <Eye className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500">
                                  Document preview not available
                                </p>
                                <button className="mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm">
                                  View Full Document
                                </button>
                              </div>
                            </div>

                            {/* Signer Details and Audit Trail */}
                            <div>
                              <h4 className="font-semibold text-slate-900 mb-4">
                                Signature Status & Audit Trail
                              </h4>
                              <div className="space-y-3">
                                {doc.signers.map((signer, idx) => (
                                  <div
                                    key={idx}
                                    className="bg-white border border-slate-200 rounded-lg p-4"
                                  >
                                    <div className="flex items-start justify-between mb-2">
                                      <div>
                                        <p className="font-medium text-slate-900">
                                          {signer.name}
                                        </p>
                                        <p className="text-sm text-slate-600">
                                          {signer.email}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {getSignerStatusIcon(signer.status)}
                                        <span className="text-xs font-semibold px-2 py-1 rounded capitalize">
                                          {signer.status === 'signed'
                                            ? 'Signed'
                                            : signer.status === 'pending'
                                              ? 'Pending'
                                              : 'Declined'}
                                        </span>
                                      </div>
                                    </div>

                                    {signer.signedDate && (
                                      <p className="text-xs text-slate-600 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        Signed on {signer.signedDate}
                                      </p>
                                    )}

                                    <div className="mt-3 pt-3 border-t border-slate-200">
                                      <p className="text-xs text-slate-600 mb-2">
                                        Activity Log:
                                      </p>
                                      <ul className="text-xs text-slate-600 space-y-1">
                                        <li>
                                          • Document sent -{' '}
                                          {new Date(doc.created).toLocaleDateString()}
                                        </li>
                                        {signer.status === 'signed' &&
                                          signer.signedDate && (
                                            <li>
                                              • Signed - {signer.signedDate}
                                            </li>
                                          )}
                                        {signer.status === 'pending' && (
                                          <li>• Awaiting signature</li>
                                        )}
                                        {signer.status === 'declined' && (
                                          <li>• Document declined</li>
                                        )}
                                      </ul>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </div>
                ))}
              </tbody>
            </table>
          </div>

          {filteredDocuments.length === 0 && (
            <div className="px-6 py-12 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No documents found matching your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Document Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Create New Document</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-slate-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Select Template
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {DOCUMENT_TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      className="text-left p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="p-2 rounded bg-slate-100"
                        >
                          {template.icon}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 text-sm">
                            {template.name}
                          </p>
                          <p className="text-xs text-slate-600">
                            {template.category}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Customer
                </label>
                <input
                  type="text"
                  placeholder="Select or type customer name..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Job
                </label>
                <input
                  type="text"
                  placeholder="Select or type job address..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Primary Signer
                  </label>
                  <input
                    type="email"
                    placeholder="Email address..."
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Secondary Signer (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="Email address..."
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg font-medium text-white transition-colors flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#007A67' }}
                >
                  <Send className="w-4 h-4" />
                  Create & Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
