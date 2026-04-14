'use client';

import { useState } from 'react';
import {
  Plug,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Settings,
  ExternalLink,
  Clock,
  Zap,
  Shield,
  Cloud,
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'solar' | 'financial' | 'communication' | 'storage' | 'automation' | 'data';
  status: 'connected' | 'available' | 'error';
  color: string;
  lastSync?: string;
  recordsSynced?: number;
  errorMessage?: string;
}

const integrations: Integration[] = [
  // Solar Integrations
  { id: 'enphase', name: 'Enphase Energy', description: 'Real-time solar production monitoring', category: 'solar', status: 'connected', color: '#FF6B35', lastSync: '2 hours ago', recordsSynced: 1250 },
  { id: 'solaredge', name: 'SolarEdge', description: 'Inverter data and performance analytics', category: 'solar', status: 'connected', color: '#4CAF50', lastSync: '1 hour ago', recordsSynced: 3400 },
  { id: 'fronius', name: 'Fronius', description: 'Solar inverter monitoring system', category: 'solar', status: 'available', color: '#5C8EC1' },
  { id: 'victron', name: 'Victron Energy', description: 'Battery and inverter integration', category: 'solar', status: 'connected', color: '#1FA5DB', lastSync: '30 minutes ago', recordsSynced: 580 },
  { id: 'huawei', name: 'Huawei FusionSolar', description: 'Enterprise solar monitoring platform', category: 'solar', status: 'available', color: '#FF0000' },
  { id: 'sunny', name: 'SMA Sunny Portal', description: 'Inverter and system monitoring', category: 'solar', status: 'error', color: '#3E8F3D', errorMessage: 'API authentication failed' },

  // Financial Integrations
  { id: 'quickbooks', name: 'QuickBooks Online', description: 'Accounting and financial management', category: 'financial', status: 'connected', color: '#4F8C5F', lastSync: '1 day ago', recordsSynced: 450 },
  { id: 'xero', name: 'Xero', description: 'Cloud accounting software', category: 'financial', status: 'available', color: '#0B5394' },
  { id: 'freshbooks', name: 'FreshBooks', description: 'Invoice and expense tracking', category: 'financial', status: 'connected', color: '#005FFF', lastSync: '3 hours ago', recordsSynced: 320 },
  { id: 'stripe', name: 'Stripe', description: 'Payment processing and subscriptions', category: 'financial', status: 'available', color: '#635BFF' },

  // Communication Integrations
  { id: 'mailchimp', name: 'Mailchimp', description: 'Email marketing and automation', category: 'communication', status: 'connected', color: '#FFE01B', lastSync: '5 hours ago', recordsSynced: 2100 },
  { id: 'twilio', name: 'Twilio', description: 'SMS and voice communications', category: 'communication', status: 'connected', color: '#F22F46', lastSync: '45 minutes ago', recordsSynced: 890 },
  { id: 'sendgrid', name: 'SendGrid', description: 'Email delivery platform', category: 'communication', status: 'available', color: '#1A73E8' },
  { id: 'slack', name: 'Slack', description: 'Team messaging and notifications', category: 'communication', status: 'connected', color: '#4A154B', lastSync: 'Real-time', recordsSynced: 0 },

  // Storage Integrations
  { id: 'dropbox', name: 'Dropbox', description: 'Cloud file storage and sharing', category: 'storage', status: 'available', color: '#0061FF' },
  { id: 'google-drive', name: 'Google Drive', description: 'Cloud storage and collaboration', category: 'storage', status: 'connected', color: '#4285F4', lastSync: '2 hours ago', recordsSynced: 1800 },
  { id: 'onedrive', name: 'OneDrive', description: 'Microsoft cloud storage', category: 'storage', status: 'available', color: '#0078D4' },
  { id: 's3', name: 'Amazon S3', description: 'Scalable cloud storage service', category: 'storage', status: 'connected', color: '#FF9900', lastSync: '30 minutes ago', recordsSynced: 5200 },

  // Automation Integrations
  { id: 'zapier', name: 'Zapier', description: 'Workflow automation platform', category: 'automation', status: 'connected', color: '#FF4A00', lastSync: '1 hour ago', recordsSynced: 620 },
  { id: 'make', name: 'Make (Integromat)', description: 'Advanced automation builder', category: 'automation', status: 'available', color: '#FF61DC' },
  { id: 'ifttt', name: 'IFTTT', description: 'Simple automation rules', category: 'automation', status: 'available', color: '#000000' },
  { id: 'microsoft-power', name: 'Microsoft Power Automate', description: 'Business process automation', category: 'automation', status: 'connected', color: '#0078D4', lastSync: '2 hours ago', recordsSynced: 340 },

  // Data Integrations
  { id: 'tableau', name: 'Tableau', description: 'Business intelligence and analytics', category: 'data', status: 'available', color: '#E4761B' },
  { id: 'powerbi', name: 'Power BI', description: 'Microsoft analytics platform', category: 'data', status: 'connected', color: '#F2C811', lastSync: '4 hours ago', recordsSynced: 2800 },
  { id: 'looker', name: 'Looker', description: 'Data visualization and BI', category: 'data', status: 'available', color: '#4285F4' },
  { id: 'segment', name: 'Segment', description: 'Customer data platform', category: 'data', status: 'connected', color: '#01D4AA', lastSync: '1 hour ago', recordsSynced: 3600 },
  { id: 'amplitude', name: 'Amplitude', description: 'Product analytics platform', category: 'data', status: 'available', color: '#162B4D' },
  { id: 'mixpanel', name: 'Mixpanel', description: 'User behavior analytics', category: 'data', status: 'connected', color: '#25292E', lastSync: '3 hours ago', recordsSynced: 1950 },
];

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | Integration['category']>('all');

  const categories: Array<'all' | Integration['category']> = [
    'all',
    'solar',
    'financial',
    'communication',
    'storage',
    'automation',
    'data',
  ];

  const categoryLabels: Record<string, string> = {
    all: 'All Integrations',
    solar: 'Solar Systems',
    financial: 'Financial',
    communication: 'Communication',
    storage: 'Storage',
    automation: 'Automation',
    data: 'Data & Analytics',
  };

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    const matchesSearch =
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const stats = {
    connected: integrations.filter((i) => i.status === 'connected').length,
    available: integrations.filter((i) => i.status === 'available').length,
    errors: integrations.filter((i) => i.status === 'error').length,
  };

  const getStatusIcon = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'available':
        return <Clock className="w-5 h-5 text-gray-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusBadge = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            Connected
          </span>
        );
      case 'available':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-full">
            <Clock className="w-3 h-3" />
            Available
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full">
            <AlertTriangle className="w-3 h-3" />
            Error
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg">
              <Plug className="w-6 h-6 text-gold" style={{ color: '#F0A500' }} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Integrations Hub</h1>
          </div>
          <p className="text-slate-600">
            Connect and manage your business tools, monitoring systems, and data platforms
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Integrations</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.connected}</p>
              </div>
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: 'rgba(0, 122, 103, 0.1)' }}
              >
                <CheckCircle2
                  className="w-6 h-6"
                  style={{ color: '#007A67' }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Ready to Connect</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.available}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Attention Needed</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.errors}</p>
              </div>
              <div className="p-3 rounded-lg bg-red-50">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                style={
                  selectedCategory === category
                    ? { backgroundColor: '#0B1F3A' }
                    : undefined
                }
              >
                {categoryLabels[category]}
              </button>
            ))}
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map((integration) => (
            <div
              key={integration.id}
              className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: integration.color }}
                >
                  {integration.name.charAt(0)}
                </div>
                <div>{getStatusBadge(integration.status)}</div>
              </div>

              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                {integration.name}
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                {integration.description}
              </p>

              {integration.status === 'connected' && integration.lastSync && (
                <div className="text-xs text-slate-500 mb-4">
                  Last sync: {integration.lastSync}
                  {integration.recordsSynced && ` • ${integration.recordsSynced} records`}
                </div>
              )}

              {integration.status === 'error' && integration.errorMessage && (
                <div className="text-xs text-red-600 mb-4 p-2 bg-red-50 rounded">
                  {integration.errorMessage}
                </div>
              )}

              <div className="flex gap-2">
                {integration.status === 'connected' ? (
                  <>
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium">
                      <RefreshCw className="w-4 h-4" />
                      Sync
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium">
                      <Settings className="w-4 h-4" />
                      Configure
                    </button>
                  </>
                ) : integration.status === 'available' ? (
                  <button
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                    style={{ backgroundColor: '#0B1F3A' }}
                  >
                    <Plug className="w-4 h-4" />
                    Connect
                  </button>
                ) : (
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    Fix Connection
                  </button>
                )}
                <button className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                  <ExternalLink className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredIntegrations.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No integrations found
            </h3>
            <p className="text-slate-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
