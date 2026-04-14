'use client';

import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Copy,
  Archive,
  Sun,
  Battery,
  Zap,
  Box,
  Tag,
  DollarSign,
  AlertTriangle,
  BarChart3,
  Settings,
} from 'lucide-react';

// Type Definitions
interface Equipment {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  category: 'Panel' | 'Inverter' | 'Battery' | 'Racking' | 'BOS' | 'Optimizer';
  cost_price: number;
  retail_price: number;
  stock_level: number;
  reorder_point: number;
  specs: string;
}

interface PriceBookEntry {
  id: string;
  name: string;
  category: 'Panel' | 'Inverter' | 'Battery' | 'Racking' | 'BOS' | 'Optimizer';
  unit_cost: number;
  labor_hours: number;
  labor_rate: number;
  total_price: number;
  effective_start: string;
  effective_end: string;
  applies_to: 'Residential' | 'Commercial' | 'Utility';
}

// Mock Data
const equipmentData: Equipment[] = [
  {
    id: 'eq-001',
    name: 'REC 415W',
    manufacturer: 'REC',
    model: 'REC415TP2S',
    category: 'Panel',
    cost_price: 180,
    retail_price: 290,
    stock_level: 145,
    reorder_point: 50,
    specs: '415W, 21% efficiency, 25-year warranty',
  },
  {
    id: 'eq-002',
    name: 'Qcells 410W',
    manufacturer: 'Qcells',
    model: 'Q.PEAK-DUO-G10',
    category: 'Panel',
    cost_price: 165,
    retail_price: 275,
    stock_level: 32,
    reorder_point: 50,
    specs: '410W, 20.6% efficiency, 25-year warranty',
  },
  {
    id: 'eq-003',
    name: 'Canadian Solar 420W',
    manufacturer: 'Canadian Solar',
    model: 'CS6L-420MS',
    category: 'Panel',
    cost_price: 175,
    retail_price: 285,
    stock_level: 98,
    reorder_point: 50,
    specs: '420W, 20.8% efficiency, 25-year warranty',
  },
  {
    id: 'eq-004',
    name: 'REC 400W',
    manufacturer: 'REC',
    model: 'REC400AA',
    category: 'Panel',
    cost_price: 170,
    retail_price: 280,
    stock_level: 67,
    reorder_point: 50,
    specs: '400W, 20.8% efficiency, 25-year warranty',
  },
  {
    id: 'eq-005',
    name: 'Enphase IQ8A',
    manufacturer: 'Enphase',
    model: 'IQ8A-2-M',
    category: 'Inverter',
    cost_price: 450,
    retail_price: 725,
    stock_level: 28,
    reorder_point: 20,
    specs: '5.8kW micro-inverter, wireless monitoring',
  },
  {
    id: 'eq-006',
    name: 'SolarEdge 7.6kW',
    manufacturer: 'SolarEdge',
    model: 'SE7600H-US',
    category: 'Inverter',
    cost_price: 3200,
    retail_price: 5100,
    stock_level: 12,
    reorder_point: 10,
    specs: '7.6kW single-phase, built-in DC switch',
  },
  {
    id: 'eq-007',
    name: 'Tesla Powerwall',
    manufacturer: 'Tesla',
    model: 'Powerwall-3',
    category: 'Inverter',
    cost_price: 8500,
    retail_price: 13800,
    stock_level: 5,
    reorder_point: 5,
    specs: '13.5kWh, integrated battery + inverter',
  },
  {
    id: 'eq-008',
    name: 'Tesla Powerwall',
    manufacturer: 'Tesla',
    model: 'Powerwall-3',
    category: 'Battery',
    cost_price: 8200,
    retail_price: 13500,
    stock_level: 8,
    reorder_point: 5,
    specs: '13.5kWh lithium-ion, 11.5kW power',
  },
  {
    id: 'eq-009',
    name: 'Enphase IQ Battery',
    manufacturer: 'Enphase',
    model: 'IQ-BATTERY-10T',
    category: 'Battery',
    cost_price: 3500,
    retail_price: 5800,
    stock_level: 2,
    reorder_point: 5,
    specs: '10.08kWh stackable, modular design',
  },
  {
    id: 'eq-010',
    name: 'IronRidge XR100',
    manufacturer: 'IronRidge',
    model: 'XR100-24',
    category: 'Racking',
    cost_price: 285,
    retail_price: 450,
    stock_level: 75,
    reorder_point: 30,
    specs: 'Aluminum rail, holds up to 3 panels',
  },
  {
    id: 'eq-011',
    name: 'Unirac SolarMount',
    manufacturer: 'Unirac',
    model: 'SM-4-0',
    category: 'Racking',
    cost_price: 220,
    retail_price: 350,
    stock_level: 91,
    reorder_point: 30,
    specs: 'Adjustable, 4-panel capacity',
  },
  {
    id: 'eq-012',
    name: 'SolarEdge Power Optimizer',
    manufacturer: 'SolarEdge',
    model: 'P730-5R',
    category: 'Optimizer',
    cost_price: 95,
    retail_price: 160,
    stock_level: 220,
    reorder_point: 100,
    specs: '5.75kW, per-panel optimization',
  },
];

const priceBookData: PriceBookEntry[] = [
  {
    id: 'pb-001',
    name: 'Standard Residential Install - 5kW',
    category: 'Panel',
    unit_cost: 8500,
    labor_hours: 16,
    labor_rate: 85,
    total_price: 9860,
    effective_start: '2026-01-01',
    effective_end: '2026-06-30',
    applies_to: 'Residential',
  },
  {
    id: 'pb-002',
    name: 'Commercial System - 25kW',
    category: 'Inverter',
    unit_cost: 42000,
    labor_hours: 80,
    labor_rate: 95,
    total_price: 49600,
    effective_start: '2026-01-01',
    effective_end: '2026-12-31',
    applies_to: 'Commercial',
  },
  {
    id: 'pb-003',
    name: 'Micro-inverter Bundle (12 units)',
    category: 'Inverter',
    unit_cost: 5400,
    labor_hours: 20,
    labor_rate: 85,
    total_price: 6100,
    effective_start: '2026-02-01',
    effective_end: '2026-08-31',
    applies_to: 'Residential',
  },
  {
    id: 'pb-004',
    name: 'Battery Storage - 10kWh',
    category: 'Battery',
    unit_cost: 3500,
    labor_hours: 8,
    labor_rate: 100,
    total_price: 4300,
    effective_start: '2026-03-01',
    effective_end: '2026-09-30',
    applies_to: 'Residential',
  },
  {
    id: 'pb-005',
    name: 'Racking and Hardware Kit',
    category: 'Racking',
    unit_cost: 1200,
    labor_hours: 12,
    labor_rate: 75,
    total_price: 1700,
    effective_start: '2026-01-15',
    effective_end: '2026-12-31',
    applies_to: 'Residential',
  },
  {
    id: 'pb-006',
    name: 'Utility Scale System - 100kW',
    category: 'BOS',
    unit_cost: 185000,
    labor_hours: 400,
    labor_rate: 110,
    total_price: 229000,
    effective_start: '2026-01-01',
    effective_end: '2026-12-31',
    applies_to: 'Utility',
  },
  {
    id: 'pb-007',
    name: 'Power Optimizer Upgrade Kit',
    category: 'Optimizer',
    unit_cost: 1900,
    labor_hours: 6,
    labor_rate: 85,
    total_price: 2410,
    effective_start: '2026-02-15',
    effective_end: '2026-10-31',
    applies_to: 'Residential',
  },
  {
    id: 'pb-008',
    name: 'Commercial Panel Array - 50 units',
    category: 'Panel',
    unit_cost: 13500,
    labor_hours: 40,
    labor_rate: 95,
    total_price: 17300,
    effective_start: '2026-03-01',
    effective_end: '2026-11-30',
    applies_to: 'Commercial',
  },
];

// Category Icons Map
const getCategoryIcon = (category: Equipment['category']) => {
  const iconProps = { size: 20, className: 'text-white' };
  switch (category) {
    case 'Panel':
      return <Sun {...iconProps} />;
    case 'Inverter':
      return <Zap {...iconProps} />;
    case 'Battery':
      return <Battery {...iconProps} />;
    case 'Racking':
      return <Box {...iconProps} />;
    case 'BOS':
      return <Tag {...iconProps} />;
    case 'Optimizer':
      return <Settings {...iconProps} />;
    default:
      return <Package {...iconProps} />;
  }
};

// Category Color Map
const getCategoryColor = (category: Equipment['category']): string => {
  switch (category) {
    case 'Panel':
      return 'bg-yellow-600';
    case 'Inverter':
      return 'bg-blue-600';
    case 'Battery':
      return 'bg-red-600';
    case 'Racking':
      return 'bg-gray-600';
    case 'BOS':
      return 'bg-purple-600';
    case 'Optimizer':
      return 'bg-green-600';
    default:
      return 'bg-gray-600';
  }
};

// Badge Color Map for Price Book
const getAppliesToColor = (appliesTo: PriceBookEntry['applies_to']): string => {
  switch (appliesTo) {
    case 'Residential':
      return 'bg-blue-100 text-blue-800';
    case 'Commercial':
      return 'bg-green-100 text-green-800';
    case 'Utility':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Main Component
export default function CatalogPage() {
  const [activeTab, setActiveTab] = useState<'equipment' | 'pricebook'>('equipment');
  const [selectedCategory, setSelectedCategory] = useState<Equipment['category'] | 'All'>('All');

  const categories: (Equipment['category'] | 'All')[] = [
    'All',
    'Panel',
    'Inverter',
    'Battery',
    'Racking',
    'BOS',
    'Optimizer',
  ];

  const filteredEquipment =
    selectedCategory === 'All'
      ? equipmentData
      : equipmentData.filter((item) => item.category === selectedCategory);

  const lowStockCount = equipmentData.filter((item) => item.stock_level < item.reorder_point).length;
  const totalItems = equipmentData.length;
  const activeItems = equipmentData.filter((item) => item.stock_level > 0).length;
  const avgMarkup =
    equipmentData.reduce((sum, item) => sum + ((item.retail_price - item.cost_price) / item.cost_price) * 100, 0) /
    equipmentData.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 px-8 py-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-white p-3">
              <Package size={32} className="text-orange-500" />
            </div>
            <h1 className="text-4xl font-bold text-white">Equipment Catalog</h1>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-orange-600 hover:bg-gray-100">
            <Plus size={20} />
            Add Equipment
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8">
        {/* KPI Row */}
        <div className="mb-8 grid grid-cols-4 gap-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-3">
                <BarChart3 size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-3xl font-bold text-gray-900">{totalItems}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-3">
                <Package size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Items</p>
                <p className="text-3xl font-bold text-gray-900">{activeItems}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-100 p-3">
                <AlertTriangle size={24} className="text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-3xl font-bold text-amber-600">{lowStockCount}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-yellow-100 p-3">
                <DollarSign size={24} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Markup</p>
                <p className="text-3xl font-bold text-gray-900">{avgMarkup.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('equipment')}
              className={`border-b-2 px-1 py-4 font-semibold transition-colors ${
                activeTab === 'equipment'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Equipment
            </button>
            <button
              onClick={() => setActiveTab('pricebook')}
              className={`border-b-2 px-1 py-4 font-semibold transition-colors ${
                activeTab === 'pricebook'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Price Book
            </button>
          </div>
        </div>

        {/* Equipment Tab */}
        {activeTab === 'equipment' && (
          <div>
            {/* Filters */}
            <div className="mb-8 flex items-center gap-3">
              <Filter size={20} className="text-gray-600" />
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full px-4 py-2 font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-orange-500 text-white'
                        : 'border border-gray-300 bg-white text-gray-700 hover:border-orange-500'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Equipment Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredEquipment.map((item) => {
                const isLowStock = item.stock_level < item.reorder_point;
                const markup = ((item.retail_price - item.cost_price) / item.cost_price) * 100;
                return (
                  <div
                    key={item.id}
                    className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Header with Icon */}
                    <div className="mb-4 flex items-start justify-between">
                      <div className={`rounded-lg ${getCategoryColor(item.category)} p-3`}>
                        {getCategoryIcon(item.category)}
                      </div>
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                        {item.category}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="mb-1 text-lg font-bold text-gray-900">{item.name}</h3>
                    <p className="mb-2 text-sm text-gray-600">
                      {item.manufacturer} • {item.model}
                    </p>
                    <p className="mb-4 text-xs text-gray-500">{item.specs}</p>

                    {/* Pricing */}
                    <div className="mb-4 border-t border-gray-200 pt-4">
                      <div className="mb-2 flex justify-between">
                        <span className="text-sm text-gray-600">Cost</span>
                        <span className="font-semibold text-gray-900">${item.cost_price.toFixed(2)}</span>
                      </div>
                      <div className="mb-2 flex justify-between">
                        <span className="text-sm text-gray-600">Retail</span>
                        <span className="font-semibold text-gray-900">${item.retail_price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Markup</span>
                        <span className="font-semibold text-orange-600">{markup.toFixed(1)}%</span>
                      </div>
                    </div>

                    {/* Stock Level */}
                    <div className="mb-4 border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Stock Level</span>
                        <span className={isLowStock ? 'font-bold text-red-600' : 'font-bold text-gray-900'}>
                          {item.stock_level} units
                        </span>
                      </div>
                      {isLowStock && (
                        <p className="mt-1 text-xs text-red-600">
                          Below reorder point ({item.reorder_point})
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <Edit size={16} />
                        Edit
                      </button>
                      <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <Copy size={16} />
                        Duplicate
                      </button>
                      <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <Archive size={16} />
                        Deactivate
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Price Book Tab */}
        {activeTab === 'pricebook' && (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Unit Cost</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Labor Hours</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Labor Rate</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Total Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Effective Period</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Applies To</th>
                </tr>
              </thead>
              <tbody>
                {priceBookData.map((entry, index) => (
                  <tr key={entry.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 text-sm text-gray-900">{entry.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{entry.category}</td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      ${entry.unit_cost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-600">{entry.labor_hours}</td>
                    <td className="px-6 py-4 text-right text-sm text-gray-600">${entry.labor_rate}/hr</td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      ${entry.total_price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {entry.effective_start} to {entry.effective_end}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getAppliesToColor(entry.applies_to)}`}>
                        {entry.applies_to}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
