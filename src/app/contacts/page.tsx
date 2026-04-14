'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, Trash2, UserPlus, FolderPlus } from 'lucide-react';
import { Contact } from '@/lib/types';
import { contacts } from '@/lib/mock-data';

export default function ContactsPage() {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [lifecycleFilter, setLifecycleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [ownerFilter, setOwnerFilter] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique values for filters
  const uniqueLifecycleStages = Array.from(new Set(contacts.map(c => c.lifecycle_stage)));
  const uniqueStatuses = Array.from(new Set(contacts.map(c => c.lead_status)));
  const uniqueOwners = Array.from(new Set(contacts.map(c => c.owner)));

  // Filter and search logic
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesSearch =
        contact.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLifecycle = !lifecycleFilter || contact.lifecycle_stage === lifecycleFilter;
      const matchesStatus = !statusFilter || contact.lead_status === statusFilter;
      const matchesOwner = !ownerFilter || contact.owner === ownerFilter;

      return matchesSearch && matchesLifecycle && matchesStatus && matchesOwner;
    });
  }, [searchQuery, lifecycleFilter, statusFilter, ownerFilter]);

  // Sorting logic
  const sortedContacts = useMemo(() => {
    const sorted = [...filteredContacts];

    if (sortColumn) {
      sorted.sort((a, b) => {
        let aVal: any = a[sortColumn as keyof Contact];
        let bVal: any = b[sortColumn as keyof Contact];

        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = (bVal as string).toLowerCase();
        }

        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return sorted;
  }, [filteredContacts, sortColumn, sortDirection]);

  // Pagination logic
  const totalPages = Math.ceil(sortedContacts.length / itemsPerPage);
  const paginatedContacts = sortedContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle sort column click
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Handle row selection
  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedRows.size === paginatedContacts.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedContacts.map(c => c.id)));
    }
  };

  // Generate avatar initials
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Get lifecycle stage color
  const getLifecycleColor = (stage: string) => {
    const colors: Record<string, string> = {
      subscriber: 'bg-gray-100 text-gray-800',
      lead: 'bg-blue-100 text-blue-800',
      marketing_qualified_lead: 'bg-purple-100 text-purple-800',
      sales_qualified_lead: 'bg-orange-100 text-orange-800',
      opportunity: 'bg-yellow-100 text-yellow-800',
      customer: 'bg-green-100 text-green-800'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  // Get lead score color
  const getLeadScoreColor = (score: number) => {
    if (score > 80) return 'text-green-600 font-semibold';
    if (score >= 50) return 'text-yellow-600 font-semibold';
    return 'text-red-600 font-semibold';
  };

  // Format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const startIdx = (currentPage - 1) * itemsPerPage + 1;
  const endIdx = Math.min(currentPage * itemsPerPage, sortedContacts.length);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <button className="bg-[#F0A500] text-navy-900 font-bold py-2 px-6 rounded-lg hover:bg-yellow-600 transition">
            + Create contact
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0A500]"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            {/* Lifecycle Stage Filter */}
            <div className="relative">
              <select
                className="appearance-none px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0A500] cursor-pointer pr-8"
                value={lifecycleFilter || ''}
                onChange={(e) => {
                  setLifecycleFilter(e.target.value || null);
                  setCurrentPage(1);
                }}
              >
                <option value="">Lifecycle Stage</option>
                {uniqueLifecycleStages.map(stage => (
                  <option key={stage} value={stage}>{stage.replace(/_/g, ' ')}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-3 text-gray-400 pointer-events-none" size={18} />
            </div>

            {/* Lead Status Filter */}
            <div className="relative">
              <select
                className="appearance-none px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0A500] cursor-pointer pr-8"
                value={statusFilter || ''}
                onChange={(e) => {
                  setStatusFilter(e.target.value || null);
                  setCurrentPage(1);
                }}
              >
                <option value="">Lead Status</option>
                {uniqueStatuses.map(status => (
                  <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-3 text-gray-400 pointer-events-none" size={18} />
            </div>

            {/* Owner Filter */}
            <div className="relative">
              <select
                className="appearance-none px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0A500] cursor-pointer pr-8"
                value={ownerFilter || ''}
                onChange={(e) => {
                  setOwnerFilter(e.target.value || null);
                  setCurrentPage(1);
                }}
              >
                <option value="">Owner</option>
                {uniqueOwners.map(owner => (
                  <option key={owner} value={owner}>{owner}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-3 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>

          {/* Contact Count */}
          <div className="text-sm text-gray-600 mt-4">
            All contacts ({sortedContacts.length})
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedRows.size > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-900">
              {selectedRows.size} contact{selectedRows.size !== 1 ? 's' : ''} selected
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                Edit
              </button>
              <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
                <Trash2 size={16} />
                Delete
              </button>
              <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
                <FolderPlus size={16} />
                Add to List
              </button>
              <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
                <UserPlus size={16} />
                Change Owner
              </button>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="w-12 px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedContacts.length && paginatedContacts.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded cursor-pointer"
                  />
                </th>
                <th
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort('first_name')}
                >
                  <div className="flex items-center gap-2">
                    Name
                    {sortColumn === 'first_name' && (
                      sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center gap-2">
                    Email
                    {sortColumn === 'email' && (
                      sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort('phone')}
                >
                  <div className="flex items-center gap-2">
                    Phone
                    {sortColumn === 'phone' && (
                      sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort('company')}
                >
                  <div className="flex items-center gap-2">
                    Company
                    {sortColumn === 'company' && (
                      sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort('job_title')}
                >
                  <div className="flex items-center gap-2">
                    Job Title
                    {sortColumn === 'job_title' && (
                      sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort('lifecycle_stage')}
                >
                  <div className="flex items-center gap-2">
                    Lifecycle Stage
                    {sortColumn === 'lifecycle_stage' && (
                      sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort('lead_status')}
                >
                  <div className="flex items-center gap-2">
                    Lead Status
                    {sortColumn === 'lead_status' && (
                      sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort('lead_score')}
                >
                  <div className="flex items-center gap-2">
                    Lead Score
                    {sortColumn === 'lead_score' && (
                      sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort('owner')}
                >
                  <div className="flex items-center gap-2">
                    Owner
                    {sortColumn === 'owner' && (
                      sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort('last_contacted')}
                >
                  <div className="flex items-center gap-2">
                    Last Contacted
                    {sortColumn === 'last_contacted' && (
                      sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedContacts.map(contact => (
                <tr
                  key={contact.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer"
                >
                  <td className="px-6 py-3 w-12">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(contact.id)}
                      onChange={() => handleSelectRow(contact.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 rounded cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#F0A500] text-navy-900 font-bold flex items-center justify-center text-sm">
                        {getInitials(contact.first_name, contact.last_name)}
                      </div>
                      <span className="font-medium text-gray-900">
                        {contact.first_name} {contact.last_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">{contact.email}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{contact.phone}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{contact.company}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{contact.job_title}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getLifecycleColor(contact.lifecycle_stage)}`}>
                      {contact.lifecycle_stage.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {contact.lead_status.replace(/_/g, ' ')}
                  </td>
                  <td className={`px-6 py-3 text-sm ${getLeadScoreColor(contact.lead_score)}`}>
                    {contact.lead_score}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">{contact.owner}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {formatDate(contact.last_contacted)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            Showing {paginatedContacts.length > 0 ? startIdx : 0}-{endIdx} of {sortedContacts.length} contacts
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5 && currentPage > 3) {
                  pageNum = currentPage - 2 + i;
                }
                if (pageNum > totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      currentPage === pageNum
                        ? 'bg-[#F0A500] text-navy-900'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
