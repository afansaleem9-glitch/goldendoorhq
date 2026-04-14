'use client';

import React, { useState, useMemo } from 'react';
import { ChevronDown, Search, Filter, Download, Plus, Calendar, DollarSign, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: string;
  projectName: string;
  homeowner: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  systemSize: number;
  systemCost: number;
  ptoTimeline: string;
  status: 'Lead' | 'Proposal' | 'Contract' | 'Installation' | 'PTO' | 'Active' | 'Inactive';
  createdDate: string;
  lastModified: string;
  designer: string;
  financeType: string;
  estimatedProduction: number;
  roofType: string;
}

const mockProjects: Project[] = [
  {
    id: '1',
    projectName: 'Smith Residence Solar',
    homeowner: 'John Smith',
    address: '123 Oak Street',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    systemSize: 6.5,
    systemCost: 19500,
    ptoTimeline: '8-12 weeks',
    status: 'Active',
    createdDate: '2024-01-15',
    lastModified: '2024-04-10',
    designer: 'Sarah Johnson',
    financeType: 'Cash',
    estimatedProduction: 8500,
    roofType: 'Asphalt Shingle',
  },
  {
    id: '2',
    projectName: 'Johnson Family Home',
    homeowner: 'Michael Johnson',
    address: '456 Elm Avenue',
    city: 'Austin',
    state: 'TX',
    zip: '78702',
    systemSize: 8.2,
    systemCost: 24600,
    ptoTimeline: '6-8 weeks',
    status: 'Installation',
    createdDate: '2024-02-20',
    lastModified: '2024-04-08',
    designer: 'Tom Davis',
    financeType: 'Financing',
    estimatedProduction: 10700,
    roofType: 'Metal Roof',
  },
  {
    id: '3',
    projectName: 'Garcia Property Development',
    homeowner: 'Maria Garcia',
    address: '789 Pine Road',
    city: 'Austin',
    state: 'TX',
    zip: '78703',
    systemSize: 10.0,
    systemCost: 30000,
    ptoTimeline: '10-14 weeks',
    status: 'Contract',
    createdDate: '2024-03-05',
    lastModified: '2024-04-09',
    designer: 'Lisa Chen',
    financeType: 'PACE Financing',
    estimatedProduction: 13000,
    roofType: 'Clay Tile',
  },
  {
    id: '4',
    projectName: 'Williams Suburban Home',
    homeowner: 'David Williams',
    address: '321 Maple Lane',
    city: 'Austin',
    state: 'TX',
    zip: '78704',
    systemSize: 5.8,
    systemCost: 17400,
    ptoTimeline: '6-10 weeks',
    status: 'PTO',
    createdDate: '2023-11-10',
    lastModified: '2024-04-07',
    designer: 'Sarah Johnson',
    financeType: 'Cash',
    estimatedProduction: 7500,
    roofType: 'Asphalt Shingle',
  },
  {
    id: '5',
    projectName: 'Anderson Eco Project',
    homeowner: 'Jennifer Anderson',
    address: '654 Birch Drive',
    city: 'Austin',
    state: 'TX',
    zip: '78705',
    systemSize: 9.5,
    systemCost: 28500,
    ptoTimeline: '12-16 weeks',
    status: 'Proposal',
    createdDate: '2024-03-25',
    lastModified: '2024-04-11',
    designer: 'Tom Davis',
    financeType: 'Financing',
    estimatedProduction: 12400,
    roofType: 'Composite Shingle',
  },
  {
    id: '6',
    projectName: 'Martinez Family Solar',
    homeowner: 'Carlos Martinez',
    address: '987 Cedar Court',
    city: 'Austin',
    state: 'TX',
    zip: '78706',
    systemSize: 7.2,
    systemCost: 21600,
    ptoTimeline: '8-12 weeks',
    status: 'Active',
    createdDate: '2023-12-01',
    lastModified: '2024-04-06',
    designer: 'Lisa Chen',
    financeType: 'Cash',
    estimatedProduction: 9400,
    roofType: 'Metal Roof',
  },
  {
    id: '7',
    projectName: 'Taylor Residential Install',
    homeowner: 'Robert Taylor',
    address: '159 Spruce Street',
    city: 'Austin',
    state: 'TX',
    zip: '78707',
    systemSize: 6.0,
    systemCost: 18000,
    ptoTimeline: '4-6 weeks',
    status: 'Active',
    createdDate: '2024-01-30',
    lastModified: '2024-04-05',
    designer: 'Sarah Johnson',
    financeType: 'Financing',
    estimatedProduction: 7800,
    roofType: 'Asphalt Shingle',
  },
  {
    id: '8',
    projectName: 'Brown Estate Solar',
    homeowner: 'Patricia Brown',
    address: '753 Walnut Way',
    city: 'Austin',
    state: 'TX',
    zip: '78708',
    systemSize: 11.5,
    systemCost: 34500,
    ptoTimeline: '14-18 weeks',
    status: 'Installation',
    createdDate: '2024-02-14',
    lastModified: '2024-04-04',
    designer: 'Tom Davis',
    financeType: 'PACE Financing',
    estimatedProduction: 15000,
    roofType: 'Clay Tile',
  },
  {
    id: '9',
    projectName: 'Lee Modern Home',
    homeowner: 'Steven Lee',
    address: '852 Poplar Place',
    city: 'Austin',
    state: 'TX',
    zip: '78709',
    systemSize: 8.8,
    systemCost: 26400,
    ptoTimeline: '10-12 weeks',
    status: 'Lead',
    createdDate: '2024-04-08',
    lastModified: '2024-04-11',
    designer: 'Lisa Chen',
    financeType: 'Financing',
    estimatedProduction: 11500,
    roofType: 'Metal Roof',
  },
  {
    id: '10',
    projectName: 'White Country Property',
    homeowner: 'Linda White',
    address: '456 Oak Ridge Road',
    city: 'Austin',
    state: 'TX',
    zip: '78710',
    systemSize: 7.5,
    systemCost: 22500,
    ptoTimeline: '8-10 weeks',
    status: 'Proposal',
    createdDate: '2024-03-18',
    lastModified: '2024-04-09',
    designer: 'Sarah Johnson',
    financeType: 'Cash',
    estimatedProduction: 9800,
    roofType: 'Asphalt Shingle',
  },
  {
    id: '11',
    projectName: 'Harris Tech Professional',
    homeowner: 'James Harris',
    address: '321 Tech Boulevard',
    city: 'Austin',
    state: 'TX',
    zip: '78711',
    systemSize: 9.0,
    systemCost: 27000,
    ptoTimeline: '9-13 weeks',
    status: 'Contract',
    createdDate: '2024-02-28',
    lastModified: '2024-04-02',
    designer: 'Tom Davis',
    financeType: 'Financing',
    estimatedProduction: 11700,
    roofType: 'Composite Shingle',
  },
  {
    id: '12',
    projectName: 'Martin Suburban Solar',
    homeowner: 'Susan Martin',
    address: '789 Suburban Lane',
    city: 'Austin',
    state: 'TX',
    zip: '78712',
    systemSize: 6.8,
    systemCost: 20400,
    ptoTimeline: '7-11 weeks',
    status: 'Installation',
    createdDate: '2024-03-12',
    lastModified: '2024-04-03',
    designer: 'Lisa Chen',
    financeType: 'Cash',
    estimatedProduction: 8900,
    roofType: 'Metal Roof',
  },
  {
    id: '13',
    projectName: 'Clark Family Residence',
    homeowner: 'Christopher Clark',
    address: '654 Family Drive',
    city: 'Austin',
    state: 'TX',
    zip: '78713',
    systemSize: 5.5,
    systemCost: 16500,
    ptoTimeline: '6-8 weeks',
    status: 'Lead',
    createdDate: '2024-04-09',
    lastModified: '2024-04-11',
    designer: 'Sarah Johnson',
    financeType: 'Financing',
    estimatedProduction: 7200,
    roofType: 'Asphalt Shingle',
  },
  {
    id: '14',
    projectName: 'Robinson Estate Project',
    homeowner: 'Dorothy Robinson',
    address: '159 Estate Avenue',
    city: 'Austin',
    state: 'TX',
    zip: '78714',
    systemSize: 10.8,
    systemCost: 32400,
    ptoTimeline: '13-17 weeks',
    status: 'PTO',
    createdDate: '2023-10-15',
    lastModified: '2024-04-01',
    designer: 'Tom Davis',
    financeType: 'PACE Financing',
    estimatedProduction: 14000,
    roofType: 'Clay Tile',
  },
  {
    id: '15',
    projectName: 'Allen Urban Home',
    homeowner: 'Kenneth Allen',
    address: '753 Urban Street',
    city: 'Austin',
    state: 'TX',
    zip: '78715',
    systemSize: 7.8,
    systemCost: 23400,
    ptoTimeline: '8-12 weeks',
    status: 'Active',
    createdDate: '2024-01-20',
    lastModified: '2024-04-08',
    designer: 'Lisa Chen',
    financeType: 'Cash',
    estimatedProduction: 10200,
    roofType: 'Metal Roof',
  },
  {
    id: '16',
    projectName: 'Young Modern Construction',
    homeowner: 'Barbara Young',
    address: '852 Modern Way',
    city: 'Austin',
    state: 'TX',
    zip: '78716',
    systemSize: 9.2,
    systemCost: 27600,
    ptoTimeline: '10-14 weeks',
    status: 'Proposal',
    createdDate: '2024-03-28',
    lastModified: '2024-04-10',
    designer: 'Sarah Johnson',
    financeType: 'Financing',
    estimatedProduction: 12000,
    roofType: 'Composite Shingle',
  },
  {
    id: '17',
    projectName: 'Hernandez Home Solar',
    homeowner: 'Antonio Hernandez',
    address: '456 Hernandez Court',
    city: 'Austin',
    state: 'TX',
    zip: '78717',
    systemSize: 6.3,
    systemCost: 18900,
    ptoTimeline: '7-10 weeks',
    status: 'Installation',
    createdDate: '2024-02-05',
    lastModified: '2024-04-07',
    designer: 'Tom Davis',
    financeType: 'Cash',
    estimatedProduction: 8200,
    roofType: 'Asphalt Shingle',
  },
  {
    id: '18',
    projectName: 'King Residential Project',
    homeowner: 'Karen King',
    address: '321 King Drive',
    city: 'Austin',
    state: 'TX',
    zip: '78718',
    systemSize: 8.5,
    systemCost: 25500,
    ptoTimeline: '9-13 weeks',
    status: 'Active',
    createdDate: '2024-01-08',
    lastModified: '2024-04-06',
    designer: 'Lisa Chen',
    financeType: 'Financing',
    estimatedProduction: 11100,
    roofType: 'Metal Roof',
  },
  {
    id: '19',
    projectName: 'Wright Solar Installation',
    homeowner: 'Daniel Wright',
    address: '789 Wright Lane',
    city: 'Austin',
    state: 'TX',
    zip: '78719',
    systemSize: 7.0,
    systemCost: 21000,
    ptoTimeline: '8-11 weeks',
    status: 'Contract',
    createdDate: '2024-03-01',
    lastModified: '2024-04-04',
    designer: 'Sarah Johnson',
    financeType: 'PACE Financing',
    estimatedProduction: 9100,
    roofType: 'Composite Shingle',
  },
  {
    id: '20',
    projectName: 'Lopez Family Green',
    homeowner: 'Angela Lopez',
    address: '654 Lopez Drive',
    city: 'Austin',
    state: 'TX',
    zip: '78720',
    systemSize: 6.9,
    systemCost: 20700,
    ptoTimeline: '7-9 weeks',
    status: 'PTO',
    createdDate: '2023-12-10',
    lastModified: '2024-03-31',
    designer: 'Tom Davis',
    financeType: 'Cash',
    estimatedProduction: 9000,
    roofType: 'Metal Roof',
  },
];

type SortField = 'projectName' | 'systemCost' | 'createdDate' | 'status';
type SortOrder = 'asc' | 'desc';

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [designerFilter, setDesignerFilter] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('createdDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const statuses = Array.from(new Set(mockProjects.map(p => p.status)));
  const designers = Array.from(new Set(mockProjects.map(p => p.designer)));

  const filteredProjects = useMemo(() => {
    return mockProjects.filter(project => {
      const matchesSearch =
        project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.homeowner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.city.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !statusFilter || project.status === statusFilter;
      const matchesDesigner = !designerFilter || project.designer === designerFilter;

      return matchesSearch && matchesStatus && matchesDesigner;
    });
  }, [searchTerm, statusFilter, designerFilter]);

  const sortedProjects = useMemo(() => {
    const sorted = [...filteredProjects].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'systemCost') {
        return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
      }

      if (sortField === 'createdDate') {
        return sortOrder === 'asc'
          ? new Date(aVal as string).getTime() - new Date(bVal as string).getTime()
          : new Date(bVal as string).getTime() - new Date(aVal as string).getTime();
      }

      return sortOrder === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    return sorted;
  }, [filteredProjects, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = sortedProjects.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Lead':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Proposal':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Contract':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Installation':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'PTO':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#0B1F3A] mb-2">Projects Dashboard</h1>
            <p className="text-slate-600">Manage and track all solar installation projects</p>
          </div>
          <button className="bg-[#F0A500] hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors">
            <Plus size={20} />
            New Project
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Total Projects</p>
                <p className="text-3xl font-bold text-[#0B1F3A] mt-1">{mockProjects.length}</p>
              </div>
              <TrendingUp className="text-[#F0A500]" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Active Projects</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{mockProjects.filter(p => p.status === 'Active').length}</p>
              </div>
              <TrendingUp className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Total Value</p>
                <p className="text-3xl font-bold text-[#0B1F3A] mt-1">${(mockProjects.reduce((sum, p) => sum + p.systemCost, 0) / 1000).toFixed(0)}K</p>
              </div>
              <DollarSign className="text-[#007A67]" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Avg System Size</p>
                <p className="text-3xl font-bold text-[#0B1F3A] mt-1">{(mockProjects.reduce((sum, p) => sum + p.systemSize, 0) / mockProjects.length).toFixed(1)} kW</p>
              </div>
              <Users className="text-[#7C5CBF]" size={32} />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Search Projects</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Project name, homeowner, address..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F0A500] focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F0A500] focus:border-transparent outline-none"
              >
                <option value="">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Designer</label>
              <select
                value={designerFilter}
                onChange={(e) => {
                  setDesignerFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F0A500] focus:border-transparent outline-none"
              >
                <option value="">All Designers</option>
                {designers.map(designer => (
                  <option key={designer} value={designer}>{designer}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Export</label>
              <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                <Download size={18} />
                Export to CSV
              </button>
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => {
                        setSortField('projectName');
                        setSortOrder(sortField === 'projectName' && sortOrder === 'asc' ? 'desc' : 'asc');
                      }}
                      className="font-semibold text-slate-900 flex items-center gap-2 hover:text-[#F0A500]"
                    >
                      Project Name
                      <ChevronDown size={16} className={`transition-transform ${sortField === 'projectName' && sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">Homeowner</th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => {
                        setSortField('systemCost');
                        setSortOrder(sortField === 'systemCost' && sortOrder === 'asc' ? 'desc' : 'asc');
                      }}
                      className="font-semibold text-slate-900 flex items-center gap-2 hover:text-[#F0A500]"
                    >
                      System Size / Cost
                      <ChevronDown size={16} className={`transition-transform ${sortField === 'systemCost' && sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">Designer</th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => {
                        setSortField('createdDate');
                        setSortOrder(sortField === 'createdDate' && sortOrder === 'asc' ? 'desc' : 'asc');
                      }}
                      className="font-semibold text-slate-900 flex items-center gap-2 hover:text-[#F0A500]"
                    >
                      Created
                      <ChevronDown size={16} className={`transition-transform ${sortField === 'createdDate' && sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProjects.map((project, idx) => (
                  <tr key={project.id} className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                    <td className="px-6 py-4 font-medium text-slate-900">{project.projectName}</td>
                    <td className="px-6 py-4 text-slate-700">{project.homeowner}</td>
                    <td className="px-6 py-4 text-slate-700">
                      <div>{project.systemSize} kW</div>
                      <div className="text-sm text-slate-500">${project.systemCost.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{project.designer}</td>
                    <td className="px-6 py-4 text-slate-700 flex items-center gap-1">
                      <Calendar size={16} className="text-slate-400" />
                      {new Date(project.createdDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/portal/projects/${project.id}`}>
                        <button className="bg-[#007A67] hover:bg-teal-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                          View Details
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
            <p className="text-slate-600 text-sm">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedProjects.length)} of {sortedProjects.length} projects
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-[#F0A500] text-white'
                          : 'border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && <span className="px-3 py-2 text-slate-600">...</span>}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
