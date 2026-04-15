"use client";
import { useState, useEffect } from 'react';
import { supabase, ORG_ID } from '@/lib/supabase';
import {
  Search,
  Filter,
  Plus,
  CheckCircle,
  AlertTriangle,
  X,
  ChevronDown,
  ChevronRight,
  Settings,
  Zap,
  RefreshCw,
  ExternalLink,
  Clock,
  Activity,
  Link as LinkIcon,
  Shield,
  Globe,
  Cloud,
  Database,
  ArrowUpRight,
  Star,
  BarChart3,
  Eye,
  Download,
  Upload,
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'pending' | 'disconnected';
  apiType: 'REST API' | 'OAuth2' | 'Webhook';
  category: 'Supplier' | 'Measurement' | 'Financial' | 'Communication' | 'Document' | 'Automation';
  lastSync: string;
  recordsSynced: number;
  syncFrequency: string;
  icon: React.ReactNode;
}

const integrations: Integration[] = [
  {
    id: 'abc-supply',
    name: 'ABC Supply',
    description: 'Materials ordering, catalog sync',
    status: 'connected',
    apiType: 'REST API',
    category: 'Supplier',
    lastSync: '2 hours ago',
    recordsSynced: 1247,
    syncFrequency: 'Every 4 hours',
    icon: <Database className="w-8 h-8" />,
  },
  {
    id: 'gaf',
    name: 'GAF',
    description: 'Warranty registration, certification',
    status: 'connected',
    apiType: 'REST API',
    category: 'Supplier',
    lastSync: '3 hours ago',
    recordsSynced: 456,
    syncFrequency: 'Every 6 hours',
    icon: <Shield className="w-8 h-8" />,
  },
  {
    id: 'tesla-solar',
    name: 'Tesla Solar/Roofing',
    description: 'Product catalog, orders',
    status: 'connected',
    apiType: 'REST API',
    category: 'Supplier',
    lastSync: '1 hour ago',
    recordsSynced: 892,
    syncFrequency: 'Every 3 hours',
    icon: <Zap className="w-8 h-8" />,
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Payment processing',
    status: 'connected',
    apiType: 'REST API',
    category: 'Financial',
    lastSync: '15 minutes ago',
    recordsSynced: 3421,
    syncFrequency: 'Real-time',
    icon: <BarChart3 className="w-8 h-8" />,
  },
  {
    id: 'purefinance',
    name: 'PureFinance Group',
    description: 'Customer financing',
    status: 'connected',
    apiType: 'REST API',
    category: 'Financial',
    lastSync: '30 minutes ago',
    recordsSynced: 234,
    syncFrequency: 'Every 2 hours',
    icon: <ArrowUpRight className="w-8 h-8" />,
  },
  {
    id: 'eagleview',
    name: 'EagleView',
    description: 'Aerial measurements',
    status: 'connected',
    apiType: 'REST API',
    category: 'Measurement',
    lastSync: '45 minutes ago',
    recordsSynced: 678,
    syncFrequency: 'Every 8 hours',
    icon: <Eye className="w-8 h-8" />,
  },
  {
    id: 'hover',
    name: 'Hover',
    description: '3D property models',
    status: 'connected',
    apiType: 'REST API',
    category: 'Measurement',
    lastSync: '1 hour ago',
    recordsSynced: 543,
    syncFrequency: 'Every 6 hours',
    icon: <Globe className="w-8 h-8" />,
  },
  {
    id: 'companycam',
    name: 'CompanyCam',
    description: 'Photo management',
    status: 'connected',
    apiType: 'REST API',
    category: 'Document',
    lastSync: '20 minutes ago',
    recordsSynced: 2156,
    syncFrequency: 'Real-time',
    icon: <Upload className="w-8 h-8" />,
  },
  {
    id: 'sitecapture',
    name: 'SiteCapture',
    description: 'Property inspections',
    status: 'connected',
    apiType: 'REST API',
    category: 'Measurement',
    lastSync: '2 hours ago',
    recordsSynced: 387,
    syncFrequency: 'Every 4 hours',
    icon: <Download className="w-8 h-8" />,
  },
  {
    id: 'ringcentral',
    name: 'RingCentral',
    description: 'VoIP, SMS, RingSense AI',
    status: 'connected',
    apiType: 'REST API',
    category: 'Communication',
    lastSync: '5 minutes ago',
    recordsSynced: 5234,
    syncFrequency: 'Real-time',
    icon: <Cloud className="w-8 h-8" />,
  },
  {
    id: 'pandadoc',
    name: 'PandaDoc',
    description: 'Document signing',
    status: 'connected',
    apiType: 'REST API',
    category: 'Document',
    lastSync: '35 minutes ago',
    recordsSynced: 892,
    syncFrequency: 'Every 1 hour',
    icon: <LinkIcon className="w-8 h-8" />,
  },
  {
    id: 'callpilot',
    name: 'CallPilot',
    description: 'AI call handling',
    status: 'connected',
    apiType: 'Webhook',
    category: 'Communication',
    lastSync: '2 minutes ago',
    recordsSynced: 8945,
    syncFrequency: 'Real-time',
    icon: <Activity className="w-8 h-8" />,
  },
  {
    id: 'xactimate',
    name: 'Xactimate',
    description: 'Insurance estimating',
    status: 'connected',
    apiType: 'REST API',
    category: 'Financial',
    lastSync: '1 hour ago',
    recordsSynced: 567,
    syncFrequency: 'Every 3 hours',
    icon: <BarChart3 className="w-8 h-8" />,
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    description: 'Accounting sync',
    status: 'pending',
    apiType: 'OAuth2',
    category: 'Financial',
    lastSync: 'Never',
    recordsSynced: 0,
    syncFrequency: 'Pending',
    icon: <Database className="w-8 h-8" />,
  },
  {
    id: 'n8n',
    name: 'n8n',
    description: 'Workflow automation',
    status: 'connected',
    apiType: 'Webhook',
    category: 'Automation',
    lastSync: '10 minutes ago',
    recordsSynced: 12453,
    syncFrequency: 'Real-time',
    icon: <Zap className="w-8 h-8" />,
  },
  {
    id: 'subcontractorhub',
    name: 'SubcontractorHub',
    description: 'Sub management',
    status: 'connected',
    apiType: 'REST API',
    category: 'Supplier',
    lastSync: '4 hours ago',
    recordsSynced: 234,
    syncFrequency: 'Every 8 hours',
    icon: <Shield className="w-8 h-8" />,
  },
  {
    id: 'transunion',
    name: 'TransUnion',
    description: 'Credit checks',
    status: 'connected',
    apiType: 'REST API',
    category: 'Financial',
    lastSync: '30 minutes ago',
    recordsSynced: 145,
    syncFrequency: 'On-demand',
    icon: <Star className="w-8 h-8" />,
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'CRM sync',
    status: 'connected',
    apiType: 'REST API',
    category: 'Automation',
    lastSync: '15 minutes ago',
    recordsSynced: 4567,
    syncFrequency: 'Every 2 hours',
    icon: <Globe className="w-8 h-8" />,
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: '3rd party automations',
    status: 'connected',
    apiType: 'REST API',
    category: 'Automation',
    lastSync: '25 minutes ago',
    recordsSynced: 3456,
    syncFrequency: 'Real-time',
    icon: <Zap className="w-8 h-8" />,
  },
  {
    id: 'google-workspace',
    name: 'Google Workspace',
    description: 'Email, calendar, drive',
    status: 'connected',
    apiType: 'OAuth2',
    category: 'Communication',
    lastSync: '1 minute ago',
    recordsSynced: 9876,
    syncFrequency: 'Real-time',
    icon: <Cloud className="w-8 h-8" />,
  },
];

const categories = [
  'All',
  'Supplier',
  'Measurement',
  'Financial',
  'Communication',
  'Document',
  'Automation',
];

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const connectedCount = integrations.filter(
    (i) => i.status === 'connected'
  ).length;
  const totalRecordsSynced = integrations.reduce(
    (sum, i) => sum + i.recordsSynced,
    0
  );

  const handleConfigure = (integrationId: string) => {
    console.log('Configure:', integrationId);
  };

  const handleDisconnect = (integrationId: string) => {
    console.log('Disconnect:', integrationId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-2 flex items-center gap-2">
            <LinkIcon className="w-8 h-8" style={{ color: '#F0A500' }} />
            <h1 className="text-3xl font-bold" style={{ color: '#0B1F3A' }}>
              Integrations
            </h1>
          </div>
          <p className="text-slate-600">
            Connect and manage your roofing business tools and services
          </p>
        </div>
      </div>

      {/* Sync Status Summary */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Total Connected */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Connected</p>
                <p
                  className="text-3xl font-bold"
                  style={{ color: '#0B1F3A' }}
                >
                  {connectedCount}
                </p>
                <p className="text-xs text-slate-500">of {integrations.length}</p>
              </div>
              <CheckCircle
                className="w-12 h-12"
                style={{ color: '#007A67' }}
              />
            </div>
          </div>

          {/* Last Full Sync */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Last Full Sync</p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: '#0B1F3A' }}
                >
                  Today
                </p>
                <p className="text-xs text-slate-500">2:34 PM</p>
              </div>
              <RefreshCw className="w-12 h-12 text-slate-400" />
            </div>
          </div>

          {/* Records Synced Today */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Records Synced</p>
                <p
                  className="text-3xl font-bold"
                  style={{ color: '#0B1F3A' }}
                >
                  {(totalRecordsSynced / 1000).toFixed(1)}K
                </p>
                <p className="text-xs text-slate-500">Today</p>
              </div>
              <Activity
                className="w-12 h-12"
                style={{ color: '#F0A500' }}
              />
            </div>
          </div>

          {/* Failed Syncs */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Failed Syncs</p>
                <p
                  className="text-3xl font-bold"
                  style={{ color: '#0B1F3A' }}
                >
                  0
                </p>
                <p className="text-xs text-slate-500">Last 24h</p>
              </div>
              <CheckCircle className="w-12 h-12 text-slate-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 lg:max-w-sm">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>

            {/* Add Integration Button */}
            <button
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#F0A500' }}
            >
              <Plus className="w-5 h-5" />
              Add Integration
            </button>
          </div>

          {/* Category Filter Tabs */}
          <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'text-white'
                    : 'border border-slate-300 text-slate-700 hover:border-slate-400'
                }`}
                style={{
                  backgroundColor:
                    selectedCategory === category ? '#007A67' : 'transparent',
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Integration Cards Grid */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredIntegrations.map((integration) => (
            <div
              key={integration.id}
              className="group flex flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
            >
              {/* Header */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-lg"
                    style={{ backgroundColor: '#F0A50120' }}
                  >
                    <div style={{ color: '#F0A500' }}>{integration.icon}</div>
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-lg font-bold"
                      style={{ color: '#0B1F3A' }}
                    >
                      {integration.name}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {integration.description}
                    </p>
                  </div>
                </div>
                <ExternalLink className="h-5 w-5 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>

              {/* Status and API Type */}
              <div className="mb-4 flex gap-2">
                <div>
                  {integration.status === 'connected' && (
                    <div className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: '#007A67' }}
                      />
                      <span
                        className="text-xs font-medium"
                        style={{ color: '#007A67' }}
                      >
                        Connected
                      </span>
                    </div>
                  )}
                  {integration.status === 'pending' && (
                    <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1">
                      <Clock className="h-3 w-3 text-amber-600" />
                      <span className="text-xs font-medium text-amber-600">
                        Pending
                      </span>
                    </div>
                  )}
                  {integration.status === 'disconnected' && (
                    <div className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1">
                      <X className="h-3 w-3 text-red-600" />
                      <span className="text-xs font-medium text-red-600">
                        Disconnected
                      </span>
                    </div>
                  )}
                </div>
                <div
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1"
                  style={{ backgroundColor: '#0B1F3A20' }}
                >
                  <span
                    className="text-xs font-medium"
                    style={{ color: '#0B1F3A' }}
                  >
                    {integration.apiType}
                  </span>
                </div>
              </div>

              {/* Sync Details */}
              <div className="mb-6 space-y-3 border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Last Sync</span>
                  <span
                    className="font-medium"
                    style={{ color: '#0B1F3A' }}
                  >
                    {integration.lastSync}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Records Synced</span>
                  <span
                    className="font-medium"
                    style={{ color: '#0B1F3A' }}
                  >
                    {integration.recordsSynced.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Sync Frequency</span>
                  <span
                    className="font-medium"
                    style={{ color: '#0B1F3A' }}
                  >
                    {integration.syncFrequency}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleConfigure(integration.id)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#007A67' }}
                >
                  <Settings className="w-4 h-4" />
                  Configure
                </button>
                {integration.status === 'connected' && (
                  <button
                    onClick={() => handleDisconnect(integration.id)}
                    className="flex-1 rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Disconnect
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredIntegrations.length === 0 && (
          <div className="rounded-lg border border-slate-200 bg-white p-12 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-slate-300" />
            <h3
              className="mb-2 text-lg font-bold"
              style={{ color: '#0B1F3A' }}
            >
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
