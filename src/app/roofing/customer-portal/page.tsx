'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Users,
  MessageSquare,
  Settings,
  Plus,
  Send,
  Bell,
  Lock,
  Globe,
  Image,
  Palette,
  Eye,
  EyeOff,
  Download,
  Upload,
  X,
  Check,
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  Activity,
  Mail,
  Phone,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID || 'default-org';

interface PortalStat {
  label: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  color: string;
}

interface CustomerPortal {
  id: string;
  name: string;
  company: string;
  customers: number;
  status: 'active' | 'inactive' | 'pending';
  created: string;
  lastActivity: string;
  engagement: string;
}

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user: string;
  icon: React.ReactNode;
}

interface FeatureConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface Message {
  id: string;
  from: string;
  preview: string;
  timestamp: string;
  unread: boolean;
}

export default function CustomerPortalPage() {
  const [portals, setPortals] = useState<CustomerPortal[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: '',
    company: '',
    role: 'admin',
    message: '',
  });
  const [features, setFeatures] = useState<FeatureConfig[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [brandingConfig, setBrandingConfig] = useState({
    logoUrl: '',
    primaryColor: '#0B1F3A',
    brandName: 'GoldenDoor',
  });

  useEffect(() => {
    // Initialize sample data
    const samplePortals: CustomerPortal[] = [
      {
        id: '1',
        name: 'Roofing Masters Portal',
        company: 'Roofing Masters Inc.',
        customers: 342,
        status: 'active',
        created: '2024-01-15',
        lastActivity: '2 hours ago',
        engagement: '94%',
      },
      {
        id: '2',
        name: 'Elite Roofing Solutions',
        company: 'Elite Roofing',
        customers: 218,
        status: 'active',
        created: '2024-02-20',
        lastActivity: '30 minutes ago',
        engagement: '87%',
      },
      {
        id: '3',
        name: 'Premier Roof Services',
        company: 'Premier Roof',
        customers: 156,
        status: 'active',
        created: '2024-03-10',
        lastActivity: '1 hour ago',
        engagement: '91%',
      },
      {
        id: '4',
        name: 'Coastal Roofing Group',
        company: 'Coastal Roofing',
        customers: 287,
        status: 'active',
        created: '2024-01-08',
        lastActivity: '4 hours ago',
        engagement: '89%',
      },
      {
        id: '5',
        name: 'Mountain Peak Roofing',
        company: 'Mountain Peak',
        customers: 195,
        status: 'inactive',
        created: '2024-02-01',
        lastActivity: '3 days ago',
        engagement: '62%',
      },
      {
        id: '6',
        name: 'Guardian Roof Solutions',
        company: 'Guardian Roofing',
        customers: 421,
        status: 'active',
        created: '2023-12-15',
        lastActivity: '15 minutes ago',
        engagement: '96%',
      },
      {
        id: '7',
        name: 'Horizon Roofing Services',
        company: 'Horizon Roofing',
        customers: 267,
        status: 'pending',
        created: '2024-04-01',
        lastActivity: 'Never',
        engagement: '0%',
      },
      {
        id: '8',
        name: 'Apex Roofing Contractors',
        company: 'Apex Roofing',
        customers: 334,
        status: 'active',
        created: '2024-01-22',
        lastActivity: '45 minutes ago',
        engagement: '93%',
      },
    ];

    const sampleFeatures: FeatureConfig[] = [
      {
        id: '1',
        name: 'Project Tracking',
        description: 'Allow customers to track ongoing roofing projects',
        enabled: true,
      },
      {
        id: '2',
        name: 'Estimate Portal',
        description: 'Enable customers to request and view estimates',
        enabled: true,
      },
      {
        id: '3',
        name: 'Document Management',
        description: 'Share contracts, warranties, and inspection reports',
        enabled: true,
      },
      {
        id: '4',
        name: 'Messaging System',
        description: 'Direct communication between contractors and customers',
        enabled: true,
      },
      {
        id: '5',
        name: 'Warranty Tracking',
        description: 'Access warranty information and history',
        enabled: false,
      },
      {
        id: '6',
        name: 'Invoice & Payment',
        description: 'View invoices and make online payments',
        enabled: true,
      },
      {
        id: '7',
        name: 'Mobile App Access',
        description: 'Portal access via mobile application',
        enabled: true,
      },
      {
        id: '8',
        name: 'Analytics Dashboard',
        description: 'View project statistics and ROI analytics',
        enabled: false,
      },
    ];

    const sampleMessages: Message[] = [
      {
        id: '1',
        from: 'Sarah Chen - Roofing Masters',
        preview: 'Question about the new portal features for our team...',
        timestamp: '10 min ago',
        unread: true,
      },
      {
        id: '2',
        from: 'Michael Rodriguez - Elite Roofing',
        preview: 'We noticed an issue with the document upload...',
        timestamp: '2 hours ago',
        unread: true,
      },
      {
        id: '3',
        from: 'Jennifer Park - Premier Roof',
        preview: 'Great update on the messaging feature. Our customers love it!',
        timestamp: '5 hours ago',
        unread: false,
      },
      {
        id: '4',
        from: 'David Thompson - Coastal Roofing',
        preview: 'Can we schedule a training session for our staff?',
        timestamp: '1 day ago',
        unread: false,
      },
      {
        id: '5',
        from: 'Amanda Lewis - Guardian Roof',
        preview: 'Integration with our CRM would be helpful. Any timeline?',
        timestamp: '2 days ago',
        unread: false,
      },
      {
        id: '6',
        from: 'System - Portal Updates',
        preview: 'New security features have been deployed',
        timestamp: '3 days ago',
        unread: false,
      },
    ];

    setPortals(samplePortals);
    setFeatures(sampleFeatures);
    setMessages(sampleMessages);
  }, []);

  const stats: PortalStat[] = [
    {
      label: 'Active Portals',
      value: portals.filter((p) => p.status === 'active').length,
      change: '+2 this month',
      icon: <Globe className="w-6 h-6" />,
      color: 'bg-blue-50',
    },
    {
      label: 'Total Customers',
      value: portals.reduce((sum, p) => sum + p.customers, 0),
      change: '+340 this month',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-green-50',
    },
    {
      label: 'Avg Engagement',
      value:
        Math.round(
          portals.reduce((sum, p) => sum + parseFloat(p.engagement), 0) /
            portals.length
        ) + '%',
      change: '+5% from last month',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-amber-50',
    },
    {
      label: 'Support Messages',
      value: messages.length,
      change: `${messages.filter((m) => m.unread).length} unread`,
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'bg-purple-50',
    },
  ];

  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'portal_created',
      description: 'Horizon Roofing Services portal created',
      timestamp: '4 hours ago',
      user: 'Admin',
      icon: <CheckCircle className="w-4 h-4 text-green-600" />,
    },
    {
      id: '2',
      type: 'feature_enabled',
      description: 'Project Tracking feature enabled',
      timestamp: '6 hours ago',
      user: 'Admin',
      icon: <Check className="w-4 h-4 text-blue-600" />,
    },
    {
      id: '3',
      type: 'user_invited',
      description: '15 new customers invited to Guardian Roof portal',
      timestamp: '1 day ago',
      user: 'Sarah',
      icon: <Mail className="w-4 h-4 text-purple-600" />,
    },
    {
      id: '4',
      type: 'engagement_spike',
      description: 'Elite Roofing portal engagement increased to 87%',
      timestamp: '1 day ago',
      user: 'System',
      icon: <TrendingUp className="w-4 h-4 text-amber-600" />,
    },
    {
      id: '5',
      type: 'document_uploaded',
      description: 'Warranty documentation updated across 3 portals',
      timestamp: '2 days ago',
      user: 'John',
      icon: <Upload className="w-4 h-4 text-indigo-600" />,
    },
    {
      id: '6',
      type: 'message_received',
      description: 'Coastal Roofing submitted feedback survey',
      timestamp: '2 days ago',
      user: 'System',
      icon: <MessageSquare className="w-4 h-4 text-pink-600" />,
    },
    {
      id: '7',
      type: 'portal_updated',
      description: 'Roofing Masters portal branding updated',
      timestamp: '3 days ago',
      user: 'Admin',
      icon: <Palette className="w-4 h-4 text-cyan-600" />,
    },
    {
      id: '8',
      type: 'security_audit',
      description: 'Security audit completed - all portals compliant',
      timestamp: '3 days ago',
      user: 'System',
      icon: <Lock className="w-4 h-4 text-red-600" />,
    },
    {
      id: '9',
      type: 'invitation_sent',
      description: '8 bulk invitations sent to Premier Roof customers',
      timestamp: '4 days ago',
      user: 'Jennifer',
      icon: <Mail className="w-4 h-4 text-purple-600" />,
    },
    {
      id: '10',
      type: 'engagement_report',
      description: 'Monthly engagement report generated',
      timestamp: '5 days ago',
      user: 'System',
      icon: <BarChart3 className="w-4 h-4 text-blue-600" />,
    },
    {
      id: '11',
      type: 'feature_request',
      description: 'Analytics Dashboard feature requested by 4 portals',
      timestamp: '5 days ago',
      user: 'System',
      icon: <AlertCircle className="w-4 h-4 text-yellow-600" />,
    },
    {
      id: '12',
      type: 'portal_milestone',
      description: 'Guardian Roof portal reached 400+ customers',
      timestamp: '6 days ago',
      user: 'System',
      icon: <CheckCircle className="w-4 h-4 text-green-600" />,
    },
  ];

  const handleToggleFeature = (id: string) => {
    setFeatures(
      features.map((f) =>
        f.id === id ? { ...f, enabled: !f.enabled } : f
      )
    );
  };

  const handleSendInvite = () => {
    if (inviteData.email && inviteData.company) {
      console.log('Sending invite:', inviteData);
      setInviteData({ email: '', company: '', role: 'admin', message: '' });
      setShowInviteModal(false);
      // In a real app, this would call an API endpoint
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            <Clock className="w-3 h-3 mr-1" />
            Inactive
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Customer Portal Management
              </h1>
              <p className="mt-2 text-gray-600">
                Manage roofing company customer portals and engagement
              </p>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-[#F0A500] hover:bg-[#E59400] text-white font-medium transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Invite Portal
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`rounded-lg border border-gray-200 p-6 ${stat.color}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">
                  {stat.label}
                </h3>
                <div className="text-[#0B1F3A]">{stat.icon}</div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="mt-2 text-sm text-gray-600">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Active Customer Portals */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">
                  Active Customer Portals
                </h2>
                <Globe className="w-5 h-5 text-[#0B1F3A]" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                        Portal Name
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                        Company
                      </th>
                      <th className="text-center px-4 py-3 text-sm font-semibold text-gray-700">
                        Customers
                      </th>
                      <th className="text-center px-4 py-3 text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                        Created
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                        Last Activity
                      </th>
                      <th className="text-center px-4 py-3 text-sm font-semibold text-gray-700">
                        Engagement
                      </th>
                      <th className="text-center px-4 py-3 text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {portals.map((portal) => (
                      <tr
                        key={portal.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-[#0B1F3A]">
                          {portal.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {portal.company}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-center font-medium">
                          {portal.customers}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {getStatusBadge(portal.status)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {portal.created}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {portal.lastActivity}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs">
                              <div
                                className="bg-[#007A67] h-2 rounded-full"
                                style={{
                                  width: portal.engagement,
                                }}
                              />
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-700">
                              {portal.engagement}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button className="text-[#0B1F3A] hover:text-[#F0A500] transition-colors">
                            <Settings className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Portal Activity Feed */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Activity Feed</h2>
              <Activity className="w-5 h-5 text-[#0B1F3A]" />
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {activities.slice(0, 12).map((activity) => (
                <div key={activity.id} className="flex gap-3 pb-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex-shrink-0 mt-1">{activity.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {activity.user}
                      </span>
                      <span className="text-xs text-gray-400">
                        {activity.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Portal Features Configuration */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              Portal Features Configuration
            </h2>
            <Settings className="w-5 h-5 text-[#0B1F3A]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-[#F0A500] transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900 text-sm">
                    {feature.name}
                  </h3>
                  <button
                    onClick={() => handleToggleFeature(feature.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      feature.enabled
                        ? 'bg-[#007A67]'
                        : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        feature.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Messages Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Messages */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                Customer Messages
              </h2>
              <MessageSquare className="w-5 h-5 text-[#0B1F3A]" />
            </div>

            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    msg.unread
                      ? 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">
                        {msg.from}
                      </p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {msg.preview}
                      </p>
                    </div>
                    {msg.unread && (
                      <div className="ml-2 flex-shrink-0 w-2 h-2 rounded-full bg-blue-600 mt-1" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{msg.timestamp}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Portal Branding */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                Portal Branding
              </h2>
              <Palette className="w-5 h-5 text-[#0B1F3A]" />
            </div>

            <div className="space-y-5">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Image className="w-4 h-4 inline mr-2" />
                  Portal Logo
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#F0A500] transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG up to 2MB
                  </p>
                </div>
              </div>

              {/* Brand Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={brandingConfig.brandName}
                  onChange={(e) =>
                    setBrandingConfig({
                      ...brandingConfig,
                      brandName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0A500]"
                  placeholder="GoldenDoor"
                />
              </div>

              {/* Primary Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Palette className="w-4 h-4 inline mr-2" />
                  Primary Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={brandingConfig.primaryColor}
                    onChange={(e) =>
                      setBrandingConfig({
                        ...brandingConfig,
                        primaryColor: e.target.value,
                      })
                    }
                    className="w-12 h-10 rounded-lg cursor-pointer border border-gray-300"
                  />
                  <input
                    type="text"
                    value={brandingConfig.primaryColor}
                    onChange={(e) =>
                      setBrandingConfig({
                        ...brandingConfig,
                        primaryColor: e.target.value,
                      })
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#F0A500]"
                  />
                </div>
              </div>

              <button className="w-full bg-[#0B1F3A] hover:bg-[#0A1829] text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Save Branding
              </button>
            </div>
          </div>
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Invite Customer Portal
                </h3>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteData.email}
                    onChange={(e) =>
                      setInviteData({ ...inviteData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0A500]"
                    placeholder="contractor@roofing.com"
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={inviteData.company}
                    onChange={(e) =>
                      setInviteData({
                        ...inviteData,
                        company: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0A500]"
                    placeholder="Your Roofing Co."
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Portal Role
                  </label>
                  <select
                    value={inviteData.role}
                    onChange={(e) =>
                      setInviteData({ ...inviteData, role: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0A500]"
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="user">User</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invitation Message
                  </label>
                  <textarea
                    value={inviteData.message}
                    onChange={(e) =>
                      setInviteData({
                        ...inviteData,
                        message: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0A500]"
                    rows={3}
                    placeholder="Welcome message..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendInvite}
                    className="flex-1 px-4 py-2 bg-[#F0A500] hover:bg-[#E59400] text-white font-medium rounded-lg transition-colors inline-flex items-center justify-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Invite
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
