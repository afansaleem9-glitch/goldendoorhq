"use client";
import { useState, useEffect } from 'react';
import { supabase, ORG_ID } from '@/lib/supabase';
import {
  Search,
  Filter,
  Download,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  ChevronDown,
  ChevronRight,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Calendar,
  Target,
  Layers,
  Activity,
  RefreshCw,
  FileText,
  PieChart,
  Zap,
  Building2,
  Receipt,
} from 'lucide-react';
import {
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const NAVY = '#0B1F3A';
const GOLD = '#F0A500';
const TEAL = '#007A67';

interface Job {
  id: string;
  name: string;
  customer: string;
  address: string;
  contractAmount: number;
  materialCost: number;
  laborCost: number;
  subcontractorCost: number;
  overhead: number;
  grossProfit: number;
  marginPercent: number;
  status: 'Profitable' | 'At Risk' | 'Over Budget';
}

interface SalesRep {
  id: string;
  name: string;
  jobsClosed: number;
  revenueGenerated: number;
  commissionRate: number;
  commissionEarned: number;
  status: 'Paid' | 'Pending';
}

interface BudgetJob {
  name: string;
  budgeted: number;
  actual: number;
  variance: number;
}

const jobCostingPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const [budgetJobs, setBudgetJobs] = useState<BudgetJob[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setLoading(false);
      // Initialize with realistic roofing data
      setJobs(generateJobData());
      setSalesReps(generateSalesRepData());
      setBudgetJobs(generateBudgetData());
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const generateJobData = (): Job[] => {
    const jobsData = [
      {
        id: '1',
        name: 'Smith Residence - Asphalt Shingle',
        customer: 'John Smith',
        address: '1423 Oak Ridge Drive, Denver CO',
        contractAmount: 24500,
        materialCost: 7350,
        laborCost: 12200,
        subcontractorCost: 0,
        overhead: 2450,
        grossProfit: 2500,
        marginPercent: 10.2,
        status: 'At Risk' as const,
      },
      {
        id: '2',
        name: 'Commercial Warehouse Flat Roof',
        customer: 'Summit Industries',
        address: '2850 Commerce Way, Aurora CO',
        contractAmount: 65000,
        materialCost: 19500,
        laborCost: 26000,
        subcontractorCost: 5200,
        overhead: 6500,
        grossProfit: 7800,
        marginPercent: 12.0,
        status: 'At Risk' as const,
      },
      {
        id: '3',
        name: 'Johnson Home - Metal Roof',
        customer: 'Sarah Johnson',
        address: '521 Maple Street, Boulder CO',
        contractAmount: 38500,
        materialCost: 12750,
        laborCost: 15400,
        subcontractorCost: 2310,
        overhead: 3850,
        grossProfit: 4190,
        marginPercent: 10.9,
        status: 'At Risk' as const,
      },
      {
        id: '4',
        name: 'Park Plaza - Tile Roof',
        customer: 'Park Plaza LLC',
        address: '4875 Park Center, Littleton CO',
        contractAmount: 52000,
        materialCost: 13000,
        laborCost: 18720,
        subcontractorCost: 3120,
        overhead: 5200,
        grossProfit: 11960,
        marginPercent: 23.0,
        status: 'Profitable' as const,
      },
      {
        id: '5',
        name: 'Heritage Estate - Custom Slate',
        customer: 'Margaret Wilson',
        address: '789 Heritage Lane, Castle Rock CO',
        contractAmount: 48000,
        materialCost: 11520,
        laborCost: 14400,
        subcontractorCost: 2880,
        overhead: 4800,
        grossProfit: 14400,
        marginPercent: 30.0,
        status: 'Profitable' as const,
      },
      {
        id: '6',
        name: 'Downtown Medical Center',
        customer: 'City Health Partners',
        address: '1500 Medical Center Drive, Denver CO',
        contractAmount: 58000,
        materialCost: 15740,
        laborCost: 20300,
        subcontractorCost: 3480,
        overhead: 5800,
        grossProfit: 12680,
        marginPercent: 21.9,
        status: 'Profitable' as const,
      },
      {
        id: '7',
        name: 'Riverside Townhomes Phase 2',
        customer: 'Riverside Development',
        address: '3200 River Road, Westminster CO',
        contractAmount: 32000,
        materialCost: 9280,
        laborCost: 13120,
        subcontractorCost: 2240,
        overhead: 3200,
        grossProfit: 4160,
        marginPercent: 13.0,
        status: 'At Risk' as const,
      },
      {
        id: '8',
        name: 'Mountain View Golf Club',
        customer: 'Mountain View Golf Club',
        address: '6500 Golf Club Drive, Golden CO',
        contractAmount: 44500,
        materialCost: 10680,
        laborCost: 15575,
        subcontractorCost: 1780,
        overhead: 4450,
        grossProfit: 12015,
        marginPercent: 27.0,
        status: 'Profitable' as const,
      },
    ];
    return jobsData;
  };

  const generateSalesRepData = (): SalesRep[] => {
    return [
      {
        id: '1',
        name: 'Michael Chen',
        jobsClosed: 12,
        revenueGenerated: 385000,
        commissionRate: 0.05,
        commissionEarned: 19250,
        status: 'Paid',
      },
      {
        id: '2',
        name: 'Jessica Garcia',
        jobsClosed: 9,
        revenueGenerated: 318500,
        commissionRate: 0.05,
        commissionEarned: 15925,
        status: 'Paid',
      },
      {
        id: '3',
        name: 'David Thompson',
        jobsClosed: 8,
        revenueGenerated: 275000,
        commissionRate: 0.05,
        commissionEarned: 13750,
        status: 'Pending',
      },
      {
        id: '4',
        name: 'Amanda Martinez',
        jobsClosed: 7,
        revenueGenerated: 238000,
        commissionRate: 0.05,
        commissionEarned: 11900,
        status: 'Pending',
      },
    ];
  };

  const generateBudgetData = (): BudgetJob[] => {
    return [
      {
        name: 'Smith Residence',
        budgeted: 22000,
        actual: 24500,
        variance: -2500,
      },
      {
        name: 'Commercial Warehouse',
        budgeted: 62000,
        actual: 65000,
        variance: -3000,
      },
      {
        name: 'Johnson Home',
        budgeted: 36000,
        actual: 38500,
        variance: -2500,
      },
      {
        name: 'Park Plaza',
        budgeted: 50000,
        actual: 52000,
        variance: -2000,
      },
    ];
  };

  const costBreakdownData = [
    { name: 'Materials', value: 87560, percentage: 28 },
    { name: 'Labor', value: 106620, percentage: 34 },
    { name: 'Subcontractors', value: 17810, percentage: 6 },
    { name: 'Overhead', value: 36200, percentage: 11 },
    { name: 'Permits & Misc', value: 65410, percentage: 21 },
  ];

  const marginTrendData = [
    { month: 'Jan', margin: 18.5 },
    { month: 'Feb', margin: 19.2 },
    { month: 'Mar', margin: 17.8 },
    { month: 'Apr', margin: 19.5 },
    { month: 'May', margin: 21.3 },
    { month: 'Jun', margin: 22.1 },
    { month: 'Jul', margin: 20.8 },
    { month: 'Aug', margin: 22.9 },
    { month: 'Sep', margin: 21.5 },
    { month: 'Oct', margin: 23.2 },
    { month: 'Nov', margin: 22.8 },
    { month: 'Dec', margin: 24.1 },
  ];

  const expenseCategoryData = [
    { category: 'Materials', amount: 87560, percentage: 28.0 },
    { category: 'Labor', amount: 106620, percentage: 34.2 },
    { category: 'Equipment Rental', amount: 18400, percentage: 5.9 },
    { category: 'Permits', amount: 12500, percentage: 4.0 },
    { category: 'Dumpster', amount: 8200, percentage: 2.6 },
    { category: 'Fuel', amount: 6800, percentage: 2.2 },
    { category: 'Insurance', amount: 52100, percentage: 16.7 },
  ];

  const totalRevenueMTD = jobs.reduce((sum, job) => sum + job.contractAmount, 0);
  const totalCOGS = jobs.reduce(
    (sum, job) =>
      sum + job.materialCost + job.laborCost + job.subcontractorCost + job.overhead,
    0
  );
  const grossProfitMTD = totalRevenueMTD - totalCOGS;
  const avgJobMargin =
    jobs.reduce((sum, job) => sum + job.marginPercent, 0) / jobs.length;
  const totalLaborCost = jobs.reduce((sum, job) => sum + job.laborCost, 0);
  const totalMaterialCost = jobs.reduce((sum, job) => sum + job.materialCost, 0);
  const laborCostRatio = (totalLaborCost / totalRevenueMTD) * 100;
  const materialCostRatio = (totalMaterialCost / totalRevenueMTD) * 100;

  const filteredJobs = jobs.filter(
    (job) =>
      job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportCSV = () => {
    const headers = [
      'Job Name',
      'Customer',
      'Contract Amount',
      'Material Cost',
      'Labor Cost',
      'Subcontractor Cost',
      'Overhead',
      'Total Cost',
      'Gross Profit',
      'Margin %',
      'Status',
    ];
    const csvContent = [
      headers.join(','),
      ...jobs.map(
        (job) =>
          `"${job.name}","${job.customer}",${job.contractAmount},${job.materialCost},${job.laborCost},${job.subcontractorCost},${job.overhead},${
            job.materialCost +
            job.laborCost +
            job.subcontractorCost +
            job.overhead
          },${job.grossProfit},${job.marginPercent.toFixed(1)},${job.status}`
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job-costing-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const exportPDF = () => {
    alert('PDF export would be generated with pdfkit or similar library');
  };

  const getStatusColor = (margin: number) => {
    if (margin >= 30) return '#10b981'; // green
    if (margin >= 15) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Profitable: 'bg-green-100 text-green-800 border-green-300',
      'At Risk': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Over Budget': 'bg-red-100 text-red-800 border-red-300',
    };
    return styles[status as keyof typeof styles] || styles.Profitable;
  };

  const COLORS = ['#007A67', '#F0A500', '#0B1F3A', '#10b981', '#ef4444'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div
        className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-8 px-6 border-b-4"
        style={{ borderColor: GOLD }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 size={32} className="text-yellow-400" />
            <h1 className="text-4xl font-bold">Job Costing & Profitability</h1>
          </div>
          <p className="text-blue-100 text-lg">
            Real-time tracking of job margins, costs, and profitability metrics
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Gross Profit MTD
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${(grossProfitMTD / 1000).toFixed(1)}K
                </p>
              </div>
              <DollarSign size={24} style={{ color: TEAL }} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Avg Job Margin
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {avgJobMargin.toFixed(1)}%
                </p>
              </div>
              <TrendingUp size={24} style={{ color: GOLD }} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Revenue MTD
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${(totalRevenueMTD / 1000).toFixed(1)}K
                </p>
              </div>
              <ArrowUpRight size={24} className="text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">COGS MTD</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${(totalCOGS / 1000).toFixed(1)}K
                </p>
              </div>
              <Receipt size={24} style={{ color: NAVY }} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Labor Cost Ratio
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {laborCostRatio.toFixed(1)}%
                </p>
              </div>
              <Users size={24} className="text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Material Cost Ratio
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {materialCostRatio.toFixed(1)}%
                </p>
              </div>
              <Layers size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Cost Breakdown Pie Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <PieChart size={20} style={{ color: NAVY }} />
              <h2 className="text-lg font-bold text-gray-900">
                Cost Breakdown
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={costBreakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => `$${(value / 1000).toFixed(1)}K`}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          {/* Margin Trend Line Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={20} style={{ color: GOLD }} />
              <h2 className="text-lg font-bold text-gray-900">Margin Trend</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={marginTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: any) => `${value.toFixed(1)}%`}
                  contentStyle={{
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="margin"
                  stroke={GOLD}
                  strokeWidth={3}
                  dot={{ fill: GOLD, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              selectedTab === 'overview'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <BarChart3 size={18} />
              Job Profitability
            </div>
          </button>
          <button
            onClick={() => setSelectedTab('budget')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              selectedTab === 'budget'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Target size={18} />
              Budget vs Actual
            </div>
          </button>
          <button
            onClick={() => setSelectedTab('commission')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              selectedTab === 'commission'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users size={18} />
              Commission Tracker
            </div>
          </button>
          <button
            onClick={() => setSelectedTab('expenses')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              selectedTab === 'expenses'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Receipt size={18} />
              Expense Categories
            </div>
          </button>
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Search and Filter */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex gap-4 items-center flex-wrap">
                <div className="flex-1 min-w-64 relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search jobs by name, customer, or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={exportCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download size={18} />
                  CSV
                </button>
                <button
                  onClick={exportPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <FileText size={18} />
                  PDF
                </button>
              </div>
            </div>

            {/* Job Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Job
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                      Contract
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                      Material
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                      Labor
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                      Subs
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                      Overhead
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                      Total Cost
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                      Gross Profit
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                      Margin %
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredJobs.map((job) => {
                    const totalCost =
                      job.materialCost +
                      job.laborCost +
                      job.subcontractorCost +
                      job.overhead;
                    return (
                      <tr
                        key={job.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {job.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {job.customer}
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-gray-900 font-medium">
                          ${job.contractAmount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-gray-600">
                          ${job.materialCost.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-gray-600">
                          ${job.laborCost.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-gray-600">
                          ${job.subcontractorCost.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-gray-600">
                          ${job.overhead.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-gray-900 font-medium">
                          ${totalCost.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-right font-medium">
                          <span
                            style={{
                              color: getStatusColor(job.marginPercent),
                            }}
                          >
                            ${job.grossProfit.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-right font-bold">
                          <span
                            style={{
                              color: getStatusColor(job.marginPercent),
                            }}
                          >
                            {job.marginPercent.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                              job.status
                            )}`}
                          >
                            {job.status === 'Profitable' && (
                              <CheckCircle size={14} className="mr-1" />
                            )}
                            {job.status === 'At Risk' && (
                              <AlertTriangle size={14} className="mr-1" />
                            )}
                            {job.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
              Showing {filteredJobs.length} of {jobs.length} jobs
            </div>
          </div>
        )}

        {selectedTab === 'budget' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Budget vs Actual Comparison
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {budgetJobs.map((job, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">{job.name}</h3>
                    <div className="flex gap-6">
                      <div>
                        <p className="text-xs text-gray-600">Budgeted</p>
                        <p className="text-lg font-bold text-gray-900">
                          ${job.budgeted.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Actual</p>
                        <p className="text-lg font-bold text-gray-900">
                          ${job.actual.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Variance</p>
                        <p
                          className="text-lg font-bold"
                          style={{
                            color: job.variance < 0 ? '#ef4444' : '#10b981',
                          }}
                        >
                          {job.variance < 0 ? '+' : '-'}${Math.abs(
                            job.variance
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          (job.actual / job.budgeted) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    {((job.actual / job.budgeted) * 100).toFixed(0)}% of budget
                    used
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'commission' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Sales Rep
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                      Jobs Closed
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                      Revenue Generated
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                      Commission Rate
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                      Commission Earned
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {salesReps.map((rep) => (
                    <tr
                      key={rep.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {rep.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-gray-900 font-medium">
                        {rep.jobsClosed}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-gray-900 font-medium">
                        ${rep.revenueGenerated.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-gray-600">
                        {(rep.commissionRate * 100).toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-gray-900 font-bold">
                        ${rep.commissionEarned.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                            rep.status === 'Paid'
                              ? 'bg-green-100 text-green-800 border-green-300'
                              : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                          }`}
                        >
                          {rep.status === 'Paid' && (
                            <CheckCircle size={14} className="mr-1" />
                          )}
                          {rep.status === 'Pending' && (
                            <Clock size={14} className="mr-1" />
                          )}
                          {rep.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Total Commissions
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${salesReps
                      .reduce((sum, rep) => sum + rep.commissionEarned, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Paid</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${salesReps
                      .filter((rep) => rep.status === 'Paid')
                      .reduce((sum, rep) => sum + rep.commissionEarned, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    ${salesReps
                      .filter((rep) => rep.status === 'Pending')
                      .reduce((sum, rep) => sum + rep.commissionEarned, 0)
                      .toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'expenses' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Expense Categories
            </h2>
            <div className="overflow-x-auto mb-8">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Category
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                      % of Revenue
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                      Progress
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {expenseCategoryData.map((expense, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {expense.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-gray-900 font-medium">
                        ${expense.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-gray-600">
                        {expense.percentage.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mx-auto">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${Math.min(
                                expense.percentage,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Total Revenue</p>
                  <p className="text-xl font-bold text-gray-900">
                    ${totalRevenueMTD.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Expenses</p>
                  <p className="text-xl font-bold text-gray-900">
                    ${expenseCategoryData
                      .reduce((sum, exp) => sum + exp.amount, 0)
                      .toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default jobCostingPage;
