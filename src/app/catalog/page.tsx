'use client';

import { useState } from 'react';
import { useApi } from '@/lib/hooks/useApi';
import { EquipmentItem } from '@/lib/types';
import { Package, Plus, Search, Filter, Sun, Battery, Zap, Box, Tag, Settings, DollarSign, AlertTriangle, Loader } from 'lucide-react';

function fmt(n: number) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n); }

const categoryIcon: Record<string, typeof Sun> = { Panel: Sun, Inverter: Zap, Battery: Battery, Racking: Box, BOS: Tag, Optimizer: Settings };
const categoryColor: Record<string, string> = { Panel: 'bg-yellow-600', Inverter: 'bg-blue-600', Battery: 'bg-red-600', Racking: 'bg-gray-600', BOS: 'bg-purple-600', Optimizer: 'bg-green-600' };
const categories = ['All', 'Panel', 'Inverter', 'Battery', 'Racking', 'BOS', 'Optimizer'];

export default function CatalogPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'Panel', manufacturer: '', model: '', sku: '', cost_price: '', retail_price: '', in_stock_qty: '' });

  const { data: equipment, loading, error, total, create } = useApi<EquipmentItem>('/api/catalog', { limit: 200, search });

  const handleCreate = async () => {
    try {
      await create({ ...form, cost_price: parseFloat(form.cost_price) || 0, retail_price: parseFloat(form.retail_price) || 0, in_stock_qty: parseInt(form.in_stock_qty) || 0 });
      setShowCreate(false);
      setForm({ name: '', category: 'Panel', manufacturer: '', model: '', sku: '', cost_price: '', retail_price: '', in_stock_qty: '' });
    } catch (e) { alert(e instanceof Error ? e.message : 'Error'); }
  };

  const filtered = selectedCategory === 'All' ? equipment : equipment.filter(i => i.category === selectedCategory);
  const lowStock = equipment.filter(i => (i.in_stock_qty || 0) < 10).length;
  const activeItems = equipment.filter(i => i.is_active !== false).length;
  const avgMarkup = equipment.length > 0
    ? equipment.reduce((s, i) => s + ((Number(i.retail_price) - Number(i.cost_price)) / (Number(i.cost_price) || 1)) * 100, 0) / equipment.length
    : 0;

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-[#0B1F3A] flex items-center gap-2"><Package className="text-[#F0A500]" /> Equipment Catalog</h1><p className="text-sm text-[#9CA3AF]">{total} items</p></div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Equipment</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card"><p className="text-sm text-[#9CA3AF]">Total Items</p><p className="text-2xl font-bold text-[#0B1F3A]">{total}</p></div>
        <div className="card"><p className="text-sm text-[#9CA3AF]">Active Items</p><p className="text-2xl font-bold text-green-600">{activeItems}</p></div>
        <div className="card"><p className="text-sm text-[#9CA3AF] flex items-center gap-1"><AlertTriangle size={14} /> Low Stock</p><p className="text-2xl font-bold text-amber-600">{lowStock}</p></div>
        <div className="card"><p className="text-sm text-[#9CA3AF] flex items-center gap-1"><DollarSign size={14} /> Avg Markup</p><p className="text-2xl font-bold text-[#F0A500]">{avgMarkup.toFixed(1)}%</p></div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search equipment..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#F0A500]/30 focus:border-[#F0A500] outline-none" />
        </div>
        <div className="flex gap-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${selectedCategory === cat ? 'bg-[#0B1F3A] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? <div className="flex items-center justify-center py-20"><Loader className="animate-spin text-gray-400" size={32} /></div>
      : error ? <div className="text-red-500 text-sm">{error}</div>
      : filtered.length === 0 ? (
        <div className="card text-center py-20 text-gray-400"><Package size={48} className="mx-auto mb-3 opacity-40" /><p className="font-medium">No equipment found</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(item => {
            const costPrice = Number(item.cost_price) || 0;
            const retailPrice = Number(item.retail_price) || 0;
            const markup = costPrice > 0 ? ((retailPrice - costPrice) / costPrice) * 100 : 0;
            const isLowStock = (item.in_stock_qty || 0) < 10;
            const Icon = categoryIcon[item.category] || Package;

            return (
              <div key={item.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${categoryColor[item.category] || 'bg-gray-600'} flex items-center justify-center`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{item.category}</span>
                </div>

                <h3 className="text-sm font-bold text-[#0B1F3A]">{item.name}</h3>
                <p className="text-xs text-[#9CA3AF] mt-0.5">{item.manufacturer} · {item.model}</p>
                {item.sku && <p className="text-xs text-[#9CA3AF]">SKU: {item.sku}</p>}

                <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
                  <div className="flex justify-between text-xs"><span className="text-[#9CA3AF]">Cost</span><span className="font-semibold">{fmt(costPrice)}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-[#9CA3AF]">Retail</span><span className="font-semibold">{fmt(retailPrice)}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-[#9CA3AF]">Markup</span><span className="font-semibold text-[#F0A500]">{markup.toFixed(1)}%</span></div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-[#9CA3AF]">Stock</span>
                  <span className={`text-xs font-bold ${isLowStock ? 'text-red-500' : 'text-[#0B1F3A]'}`}>
                    {item.in_stock_qty ?? 0} units {isLowStock && '⚠'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">Add Equipment</h2>
            <div className="space-y-3">
              <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm">
                {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input placeholder="Manufacturer" value={form.manufacturer} onChange={e => setForm({...form, manufacturer: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Model" value={form.model} onChange={e => setForm({...form, model: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <input placeholder="SKU" value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <div className="grid grid-cols-3 gap-2">
                <input placeholder="Cost $" type="number" value={form.cost_price} onChange={e => setForm({...form, cost_price: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" />
                <input placeholder="Retail $" type="number" value={form.retail_price} onChange={e => setForm({...form, retail_price: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" />
                <input placeholder="Qty" type="number" value={form.in_stock_qty} onChange={e => setForm({...form, in_stock_qty: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreate} className="btn-primary text-sm">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
