'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  FileText,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';

// TypeScript Interfaces
interface KPICard {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

interface Invoice {
  id: string;
  customer: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
}

interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  date: string;
  method: 'credit_card' | 'bank_transfer' | 'check' | 'cash';
  status: 'completed' | 'pending' | 'failed';
}

interface Costing {
  item: string;
  category: string;
  unitCost: number;
  quantity: number;
  total: number;
}

interface Profitability {
  customer: string;
  revenue: number;
  costs: number;
  grossProfit: number;
  marginPercentage: number;
}

// Mock Data
const mockInvoices: Invoice[] = [
  {
    id: 'INV-001',
    customer: 'Sunny Homes LLC',
    amount: 12500,
    dueDate: '2026-04-30',
    status: 'pending',
    description: 'Solar panel installation - residential',
  },
  {
    id: 'INV-002',
    customer: 'Green Energy Corp',
    amount: 35000,
    dueDate: '2026-04-15',
    status: 'overdue',
    description: 'Commercial solar system',
  },
  {
    id: 'INV-003',
    customer: 'Eco Solutions Inc',
    amount: 8750,
    dueDate: '2026-05-10',
    status: 'pending',
    description: 'Solar panel maintenance',
  },
  {
    id: 'INV-004',
    customer: 'Bright Future Homes',
    amount: 15200,
    dueDate: '2026-04-20',
    status: 'paid',
    description: 'Installation and equipment',
  },
  {
    id: 'INV-005',
    customer: 'Solar Innovations Ltd',
    amount: 42000,
    dueDate: '2026-05-05',
    status: 'pending',
    description: 'Large-scale industrial installation',
  },
  {
    id: 'INV-006',
    customer: 'Clean Power Corp',
    amount: 9500,
    dueDate: '2026-04-25',
    status: 'pending',
    description: 'System upgrade and optimization',
  },
];

const mockPayments: Payment[] = [
  {
    id: 'PAY-001',
    invoiceId: 'INV-004',
    amount: 15200,
    date: '2026-04-10',
    method: 'bank_transfer',
    status: 'completed',
  },
  {
    id: 'PAY-002',
    invoiceId: 'INV-001',
    amount: 12500,
    date: '2026-04-13',
    method: 'credit_card',
    status: 'pending',
  },
  {
    id: 'PAY-003',
    invoiceId: 'INV-005',
    amount: 42000,
    date: '2026-04-11',
    method: 'bank_transfer',
    status: 'completed',
  },
  {
    id: 'PAY-004',
    invoiceId: 'INV-002',
    amount: 35000,
    date: '2026-04-08',
    method: 'check',
    status: 'failed',
  },
  {
    id: 'PAY-005',
    invoiceId: 'INV-003',
    amount: 8750,
    date: '2026-04-12',
    method: 'credit_card',
    status: 'completed',
  },
  {
    id: 'PAY-006',
    invoiceId: 'INV-006',
    amount: 9500,
    date: '2026-04-14',
    method: 'bank_transfer',
    status: 'pending',
  },
];

const mockCosting: Costing[] = [
  {
    item: 'Solar Panel (400W)',
    category: 'Equipment',
    unitCost: 250,
    quantity: 15,
    total: 3750,
  },
  {
    item: 'Inverter (5KW)',
    category: 'Equipment',
    unitCost: 1200,
    quantity: 2,
    total: 2400,
  },
  {
    item: 'Installation Labor',
    category: 'Labor',
    unitCost: 85,
    quantity: 40,
    total: 3400,
  },
  {
    item: 'Mounting Hardware Kit',
    category: 'Equipment',
    unitCost: 450,
    quantity: 2,
    total: 900,
  },
  {
    item: 'Electrical Wiring & Components',
    category: 'Materials',
    unitCost: 300,
    quantity: 5,
    total: 1500,
  },
  {
    item: 'System Monitoring Setup',
    category: 'Equipment',
    unitCost: 600,
    quantity: 1,
    total: 600,
  },
];

const mockProfitability: Profitability[] = [
  {
    customer: 'Sunny Homes LLC',
    revenue: 12500,
    costs: 8200,
    grossProfit: 4300,
    marginPercentage: 34.4,
  },
  {
    customer: 'Green Energy Corp',
    revenue: 35000,
    costs: 21500,
    grossProfit: 13500,
    marginPercentage: 38.6,
  },
  {
    customer: 'Eco Solutions Inc',
    revenue: 8750,
    costs: 5600,
    grossProfit: 3150,
    marginPercentage: 36,
  },
  {
    customer: 'Bright Future Homes',
    revenue: 15200,
    costs: 9800,
    grossProfit: 5400,
    marginPercentage: 35.5,
  },
  {
    customer: 'Solar Innovations Ltd',
    revenue: 42000,
    costs: 25000,
    grossProfit: 17000,
    marginPercentage: 40.5,
  },
];

// Status Badge Component
interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Payment Status Icon Component
interface PaymentStatusIconProps {
  status: string;
}

const PaymentStatusIcon: React.FC<PaymentStatusIconProps> = ({ status }) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    case 'pending':
      return <Clock className="w-5 h-5 text-yellow-600" />;
    case 'failed':
      return <AlertCircle className="w-5 h-5 text-red-600" />;
    default:
      return null;
  }
};

// Main Component
export default function AccountingPage() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments' | 'costing' | 'profitability'>('invoices');

  // Calculate KPI values
  const totalOutstanding = mockInvoices
    .filter((inv) => inv.status !== 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const monthToDateRevenue = mockInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  const pendingInvoices = mockInvoices.filter((inv) => inv.status === 'pending').length;

  const accountBalance = monthToDateRevenue - totalOutstanding;

  const kpiCards: KPICard[] = [
    {
      label: 'Total Outstanding',
      value: `$${totalOutstanding.toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-teal-50 border-teal-200',
    },
    {
      label: 'Month-to-Date Revenue',
      value: `$${monthToDateRevenue.toLocaleString()}`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-yellow-50 border-yellow-200',
    },
    {
      label: 'Pending Invoices',
      value: pendingInvoices.toString(),
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-blue-50 border-blue-200',
    },
    {
      label: 'Account Balance',
      value: `$${accountBalance.toLocaleString()}`,
      icon: <CreditCard className="w-6 h-6" />,
      color: 'bg-indigo-50 border-indigo-200',
      },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-teal-700 to-teal-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Accounting & Payments</h1>
          <p className="text-blue-100 mt-2">Manage invoices, payments, and financial analytics</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiCards.map((card, index) => (
            <div
              key={index}
              className={`${card.color} border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
                </div>
                <div className="text-gray-400">{card.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              {(['invoices', 'payments', 'costing', 'profitability'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? 'text-teal-600 border-b-2 border-teal-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Invoices Tab */}
            {activeTab === 'invoices' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Invoice ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mockInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {invoice.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {invoice.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${invoice.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {invoice.dueDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={invoice.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Payment ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Invoice
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mockPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {payment.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {payment.invoiceId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${payment.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {payment.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {payment.method.replace('_', ' ').toUpperCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <PaymentStatusIcon status={payment.status} />
                            <StatusBadge status={payment.status} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Costing Tab */}
            {activeTab === 'costing' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Unit Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mockCosting.map((cost, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {cost.item}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {cost.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${cost.unitCost.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {cost.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${cost.total.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Profitability Tab */}
            {activeTab === 'profitability' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Costs
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Gross Profit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Margin %
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mockProfitability.map((profit, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {profit.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${profit.revenue.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${profit.costs.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          ${profit.grossProfit.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {profit.marginPercentage.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
