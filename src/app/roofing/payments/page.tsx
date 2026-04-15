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
  DollarSign,
  CreditCard,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Users,
  Calendar,
  Home,
  Mail,
  Phone,
  ExternalLink,
  Zap,
  Star,
  BarChart3,
  TrendingUp,
  Activity,
  Wallet,
  Receipt,
  BadgeCheck,
} from 'lucide-react';

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState('invoices');
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock financial data
  const financialMetrics = {
    revenueCollected: {
      value: 284500,
      trend: 12.5,
      period: 'This Month',
    },
    outstandingAR: {
      value: 67840,
      trend: -3.2,
      period: 'Total',
    },
    overdueAmount: {
      value: 12340,
      trend: 8.1,
      period: 'Total',
    },
    avgDaysToPay: {
      value: 14,
      trend: -2.1,
      period: 'Avg',
    },
  };

  const paymentProcessors = [
    {
      id: 'stripe',
      name: 'Stripe',
      type: 'Credit Cards',
      icon: CreditCard,
      status: 'connected',
      volumeProcessed: 156200,
      feeRate: 2.9,
      transactions: 245,
    },
    {
      id: 'purefinance',
      name: 'PureFinance Group',
      type: 'Financing',
      icon: Zap,
      status: 'connected',
      volumeProcessed: 89400,
      feeRate: 3.5,
      transactions: 42,
    },
    {
      id: 'ach',
      name: 'ACH & Bank',
      type: 'Direct Transfer',
      icon: Building2,
      status: 'connected',
      volumeProcessed: 38900,
      feeRate: 0.5,
      transactions: 78,
    },
  ];

  const invoices = [
    {
      id: 'INV-2024-2847',
      customer: 'Smithson Properties LLC',
      jobAddress: '1247 Oak Ridge Drive, Denver, CO 80210',
      amount: 45200,
      amountPaid: 22600,
      status: 'partial',
      dueDate: '2026-04-20',
      paymentMethod: 'Stripe - Visa 4242',
      daysOverdue: 0,
    },
    {
      id: 'INV-2024-2846',
      customer: 'Metropolitan Homes Inc',
      jobAddress: '3894 Cherry Lane, Boulder, CO 80301',
      amount: 38500,
      amountPaid: 38500,
      status: 'paid',
      dueDate: '2026-03-25',
      paymentMethod: 'ACH',
      daysOverdue: 0,
    },
    {
      id: 'INV-2024-2845',
      customer: 'Crown Development Co',
      jobAddress: '567 Maple Street, Aurora, CO 80010',
      amount: 28750,
      amountPaid: 0,
      status: 'overdue',
      dueDate: '2026-03-28',
      paymentMethod: 'Pending',
      daysOverdue: 18,
    },
    {
      id: 'INV-2024-2844',
      customer: 'Peak Construction Group',
      jobAddress: '2156 Aspen Way, Colorado Springs, CO 80909',
      amount: 32100,
      amountPaid: 32100,
      status: 'paid',
      dueDate: '2026-04-10',
      paymentMethod: 'PureFinance 24-month',
      daysOverdue: 0,
    },
    {
      id: 'INV-2024-2843',
      customer: 'Heritage Restoration LLC',
      jobAddress: '4422 Willow Drive, Fort Collins, CO 80521',
      amount: 19500,
      amountPaid: 0,
      status: 'overdue',
      dueDate: '2026-04-01',
      paymentMethod: 'Pending',
      daysOverdue: 14,
    },
    {
      id: 'INV-2024-2842',
      customer: 'Elite Property Group',
      jobAddress: '891 Pine Ridge Road, Westminster, CO 80031',
      amount: 41800,
      amountPaid: 20900,
      status: 'sent',
      dueDate: '2026-05-15',
      paymentMethod: 'Pending',
      daysOverdue: 0,
    },
    {
      id: 'INV-2024-2841',
      customer: 'Summit Real Estate Partners',
      jobAddress: '3015 Valley View Lane, Littleton, CO 80127',
      amount: 23600,
      amountPaid: 23600,
      status: 'paid',
      dueDate: '2026-04-05',
      paymentMethod: 'Check #1847',
      daysOverdue: 0,
    },
    {
      id: 'INV-2024-2840',
      customer: 'Greenfield Developments',
      jobAddress: '2847 Sunset Boulevard, Broomfield, CO 80020',
      amount: 35400,
      amountPaid: 0,
      status: 'draft',
      dueDate: '2026-05-01',
      paymentMethod: 'Not Sent',
      daysOverdue: 0,
    },
    {
      id: 'INV-2024-2839',
      customer: 'Liberty Construction Inc',
      jobAddress: '6234 Mountain View Road, Lafayette, CO 80026',
      amount: 29800,
      amountPaid: 14900,
      status: 'partial',
      dueDate: '2026-04-25',
      paymentMethod: 'Stripe - Amex',
      daysOverdue: 0,
    },
    {
      id: 'INV-2024-2838',
      customer: 'Westbrook Homes',
      jobAddress: '1589 River Road, Longmont, CO 80501',
      amount: 17900,
      amountPaid: 17900,
      status: 'paid',
      dueDate: '2026-03-20',
      paymentMethod: 'ACH',
      daysOverdue: 0,
    },
  ];

  const paymentHistory = [
    {
      id: 'PAY-892',
      date: '2026-04-14',
      customer: 'Peak Construction Group',
      amount: 32100,
      method: 'PureFinance 24-month',
      status: 'completed',
    },
    {
      id: 'PAY-891',
      date: '2026-04-12',
      customer: 'Metropolitan Homes Inc',
      amount: 38500,
      method: 'ACH',
      status: 'completed',
    },
    {
      id: 'PAY-890',
      date: '2026-04-10',
      customer: 'Summit Real Estate Partners',
      amount: 23600,
      method: 'Check #1847',
      status: 'completed',
    },
    {
      id: 'PAY-889',
      date: '2026-04-08',
      customer: 'Smithson Properties LLC',
      amount: 22600,
      method: 'Visa 4242',
      status: 'completed',
    },
    {
      id: 'PAY-888',
      date: '2026-04-05',
      customer: 'Liberty Construction Inc',
      amount: 14900,
      method: 'Amex',
      status: 'completed',
    },
    {
      id: 'PAY-887',
      date: '2026-04-02',
      customer: 'Northern Colorado Builders',
      amount: 45600,
      method: 'ACH',
      status: 'completed',
    },
    {
      id: 'PAY-886',
      date: '2026-03-31',
      customer: 'Rocky Mountain Homes',
      amount: 28400,
      method: 'PureFinance 36-month',
      status: 'completed',
    },
    {
      id: 'PAY-885',
      date: '2026-03-28',
      customer: 'Alpine Development',
      amount: 19900,
      method: 'Visa 8765',
      status: 'completed',
    },
  ];

  const financingApplications = [
    {
      id: 'FIN-405',
      customer: 'Peak Construction Group',
      amount: 32100,
      term: '24-month',
      interestRate: 8.99,
      status: 'funded',
      fundedDate: '2026-04-14',
      monthlyPayment: 1461,
    },
    {
      id: 'FIN-404',
      customer: 'Crown Development Co',
      amount: 28750,
      term: '36-month',
      interestRate: 9.49,
      status: 'approved',
      fundedDate: null,
      monthlyPayment: 893,
    },
    {
      id: 'FIN-403',
      customer: 'Rocky Mountain Homes',
      amount: 45000,
      term: '60-month',
      interestRate: 10.99,
      status: 'funded',
      fundedDate: '2026-03-31',
      monthlyPayment: 979,
    },
    {
      id: 'FIN-402',
      customer: 'Heritage Restoration LLC',
      amount: 19500,
      term: '12-month',
      interestRate: 7.99,
      status: 'pending',
      fundedDate: null,
      monthlyPayment: 1693,
    },
  ];

  const stats = {
    totalCollectedMTD: 284500,
    ytdRevenue: 2156400,
    avgInvoiceAmount: 31245,
    collectionRate: 87.5,
  };

  const statusColors = {
    paid: 'bg-green-100 text-green-800',
    partial: 'bg-blue-100 text-blue-800',
    sent: 'bg-yellow-100 text-yellow-800',
    draft: 'bg-gray-100 text-gray-800',
    overdue: 'bg-red-100 text-red-800',
  };

  const statusIcons = {
    paid: CheckCircle,
    partial: Clock,
    sent: Send,
    draft: FileText,
    overdue: AlertTriangle,
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = invoice.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || invoice.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Payments & Invoicing</h1>
              <p className="mt-1 text-sm text-slate-600">Manage invoices, track payments, and configure processors</p>
            </div>
            <button
              onClick={() => setShowCreateInvoice(true)}
              className="flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-white font-medium hover:bg-yellow-600 transition-colors"
              style={{ backgroundColor: '#F0A500' }}
            >
              <Plus className="h-5 w-5" />
              Create Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Financial Dashboard */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {Object.entries(financialMetrics).map(([key, metric]) => {
            const Icon = metric.trend >= 0 ? ArrowUpRight : ArrowDownRight;
            const trendColor = metric.trend >= 0 ? 'text-green-600' : 'text-red-600';

            return (
              <div key={key} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {key === 'avgDaysToPay'
                        ? `${metric.value} days`
                        : formatCurrency(metric.value)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{metric.period}</p>
                  </div>
                  <div className={`flex items-center gap-1 rounded-full px-2 py-1 ${trendColor} bg-opacity-10`}>
                    <Icon className="h-4 w-4" />
                    <span className="text-xs font-medium">{Math.abs(metric.trend)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment Processors */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Payment Processors</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {paymentProcessors.map((processor) => {
              const Icon = processor.icon;
              return (
                <div
                  key={processor.id}
                  className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg p-2" style={{ backgroundColor: '#F0A500' }}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{processor.name}</h3>
                        <p className="text-xs text-slate-600">{processor.type}</p>
                      </div>
                    </div>
                    <div className="flex h-2 w-2 rounded-full bg-green-500"></div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-600">Volume Processed</p>
                      <p className="text-sm font-semibold text-slate-900">{formatCurrency(processor.volumeProcessed)}</p>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-xs text-slate-600">Fee Rate</p>
                        <p className="text-sm font-semibold text-slate-900">{processor.feeRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">Transactions</p>
                        <p className="text-sm font-semibold text-slate-900">{processor.transactions}</p>
                      </div>
                    </div>
                  </div>

                  <button className="mt-4 w-full rounded-md border border-slate-300 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    Manage
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 border-b border-slate-200">
          {[
            { id: 'invoices', label: 'Invoices' },
            { id: 'payments', label: 'Payment History' },
            { id: 'financing', label: 'Financing' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
              style={activeTab === tab.id ? { borderColor: '#F0A500', color: '#F0A500' } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            {/* Search and Filter */}
            <div className="border-b border-slate-200 p-4 md:flex md:items-center md:justify-between">
              <div className="flex flex-1 gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search invoices or customers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-md border border-slate-300 pl-10 pr-4 py-2 text-sm placeholder-slate-500 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                    />
                  </div>
                </div>
                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:border-slate-400 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                  >
                    <option value="all">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="partial">Partial</option>
                    <option value="sent">Sent</option>
                    <option value="draft">Draft</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>
              <div className="mt-3 flex gap-2 md:mt-0">
                <button className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                  <Filter className="h-4 w-4" />
                  More Filters
                </button>
                <button className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
            </div>

            {/* Invoices Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Invoice</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Job Address</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700">Amount</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700">Paid</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700">Balance</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Due Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Method</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredInvoices.map((invoice) => {
                    const StatusIcon = statusIcons[invoice.status as keyof typeof statusIcons];
                    const balance = invoice.amount - invoice.amountPaid;
                    const isOverdue = invoice.daysOverdue > 0;

                    return (
                      <tr
                        key={invoice.id}
                        className={`hover:bg-slate-50 transition-colors ${isOverdue ? 'bg-red-50' : ''}`}
                      >
                        <td className="px-4 py-3 text-sm font-semibold text-slate-900">{invoice.id}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{invoice.customer}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 max-w-xs truncate">{invoice.jobAddress}</td>
                        <td className="px-4 py-3 text-right text-sm font-medium text-slate-900">
                          {formatCurrency(invoice.amount)}
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-medium text-green-600">
                          {formatCurrency(invoice.amountPaid)}
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-medium text-slate-900">
                          {formatCurrency(balance)}
                        </td>
                        <td className="px-4 py-3">
                          <div className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[invoice.status as keyof typeof statusColors]}`}>
                            <StatusIcon className="h-3 w-3" />
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {new Date(invoice.dueDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                          {isOverdue && <p className="text-xs text-red-600 font-medium">{invoice.daysOverdue} days overdue</p>}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">{invoice.paymentMethod}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button className="p-1 hover:bg-slate-200 rounded transition-colors" title="View">
                              <Eye className="h-4 w-4 text-slate-600" />
                            </button>
                            <button className="p-1 hover:bg-slate-200 rounded transition-colors" title="Edit">
                              <Edit className="h-4 w-4 text-slate-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between text-sm">
              <p className="text-slate-600">
                Showing <span className="font-semibold text-slate-900">{filteredInvoices.length}</span> of{' '}
                <span className="font-semibold text-slate-900">{invoices.length}</span> invoices
              </p>
              <div className="flex items-center gap-2">
                <button className="p-1 hover:bg-slate-200 rounded transition-colors" disabled>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>
                <button className="p-1 hover:bg-slate-200 rounded transition-colors">
                  <ChevronRight className="h-4 w-4 text-slate-600" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment History Tab */}
        {activeTab === 'payments' && (
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Payment ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Customer</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Method</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Status</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {paymentHistory.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900">{payment.id}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {new Date(payment.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">{payment.customer}</td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-green-600">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{payment.method}</td>
                      <td className="px-4 py-3">
                        <div className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3" />
                          Completed
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button className="p-1 hover:bg-slate-200 rounded transition-colors">
                          <Eye className="h-4 w-4 text-slate-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Financing Tab */}
        {activeTab === 'financing' && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">PureFinance Applications</h3>
              <button className="flex items-center gap-2 rounded-lg border border-yellow-500 px-4 py-2 text-yellow-600 font-medium hover:bg-yellow-50 transition-colors"
                style={{ borderColor: '#F0A500', color: '#F0A500' }}>
                <Plus className="h-4 w-4" />
                New Application
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {financingApplications.map((app) => (
                <div key={app.id} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-slate-900">{app.customer}</h4>
                      <p className="text-sm text-slate-600">{app.id}</p>
                    </div>
                    <div className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                      app.status === 'funded' ? 'bg-green-100 text-green-800' : app.status === 'approved' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {app.status === 'funded' ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Loan Amount</span>
                      <span className="text-sm font-semibold text-slate-900">{formatCurrency(app.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Term</span>
                      <span className="text-sm font-semibold text-slate-900">{app.term}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Interest Rate</span>
                      <span className="text-sm font-semibold text-slate-900">{app.interestRate}%</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-3">
                      <span className="text-sm text-slate-600">Monthly Payment</span>
                      <span className="text-sm font-bold text-slate-900">{formatCurrency(app.monthlyPayment)}</span>
                    </div>
                  </div>

                  {app.fundedDate && (
                    <p className="mt-4 text-xs text-slate-500">
                      Funded on {new Date(app.fundedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          {[
            { label: 'Collected MTD', value: stats.totalCollectedMTD },
            { label: 'YTD Revenue', value: stats.ytdRevenue },
            { label: 'Avg Invoice', value: stats.avgInvoiceAmount },
            { label: 'Collection Rate', value: stats.collectionRate, isMoney: false },
          ].map((stat, idx) => (
            <div key={idx} className="rounded-lg border border-slate-200 bg-white p-4 text-center">
              <p className="text-xs text-slate-600 uppercase tracking-wide">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {stat.isMoney !== false ? formatCurrency(stat.value) : `${stat.value}%`}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Create Invoice Modal */}
      {showCreateInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-lg">
            <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Create Invoice</h2>
              <button
                onClick={() => setShowCreateInvoice(false)}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-6">
              {/* Customer Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Customer</label>
                <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500">
                  <option>Select a customer...</option>
                  <option>Smithson Properties LLC</option>
                  <option>Metropolitan Homes Inc</option>
                  <option>Crown Development Co</option>
                </select>
              </div>

              {/* Job Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Job/Project</label>
                <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500">
                  <option>Select a job...</option>
                  <option>1247 Oak Ridge Drive, Denver</option>
                  <option>3894 Cherry Lane, Boulder</option>
                </select>
              </div>

              {/* Line Items */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-slate-900">Line Items</label>
                  <button className="text-xs text-yellow-600 hover:text-yellow-700 font-medium">+ Add Item</button>
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-xs text-slate-600 font-medium">
                    <div className="col-span-5">Description</div>
                    <div className="col-span-2">Qty</div>
                    <div className="col-span-2">Rate</div>
                    <div className="col-span-3">Total</div>
                  </div>
                  <div className="rounded-md border border-slate-300 p-3 space-y-2">
                    <div className="grid grid-cols-12 gap-2">
                      <input type="text" placeholder="Roof replacement..." className="col-span-5 rounded-md border border-slate-200 px-2 py-1 text-sm" />
                      <input type="number" placeholder="1" className="col-span-2 rounded-md border border-slate-200 px-2 py-1 text-sm" />
                      <input type="number" placeholder="0.00" className="col-span-2 rounded-md border border-slate-200 px-2 py-1 text-sm" />
                      <div className="col-span-3 flex items-center py-1 text-sm font-medium text-slate-900">$0.00</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-end">
                  <div className="w-48">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="font-medium text-slate-900">$0.00</span>
                    </div>
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-slate-600">Tax</span>
                      <input type="number" placeholder="0.00" className="w-24 rounded-md border border-slate-200 px-2 py-1 text-sm text-right" />
                    </div>
                    <div className="border-t border-slate-200 pt-2 flex justify-between text-base font-semibold">
                      <span className="text-slate-900">Total</span>
                      <span className="text-slate-900">$0.00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Terms */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Payment Terms</label>
                <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500">
                  <option>Net 30 (Default)</option>
                  <option>Net 15</option>
                  <option>Net 60</option>
                  <option>Due on receipt</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Notes</label>
                <textarea
                  placeholder="Add any notes or special instructions..."
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                  rows={3}
                ></textarea>
              </div>
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateInvoice(false)}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                className="rounded-md px-4 py-2 text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: '#F0A500' }}
              >
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
