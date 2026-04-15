'use client';

import { useState, useEffect } from 'react';
import {
  Grid3x3,
  List,
  Upload,
  Filter,
  Search,
  Settings,
  Calendar,
  MapPin,
  User,
  Tag,
  Clock,
  HardDrive,
  Briefcase,
  Plus,
  Trash2,
  Download,
  Share2,
  Edit3,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  X,
} from 'lucide-react';

export default function PhotoManagementPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const [activeFilters, setActiveFilters] = useState({
    job: '',
    dateRange: '',
    photoType: '',
    photographer: '',
    tags: [] as string[],
  });
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showAnnotationTools, setShowAnnotationTools] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');

  // Brand colors
  const colors = {
    navy: '#0B1F3A',
    gold: '#F0A500',
    teal: '#007A67',
  };

  // Mock data
  const stats = [
    { label: 'Total Photos', value: '1,247', icon: '📸' },
    { label: 'Jobs Documented', value: '18', icon: '🏠' },
    { label: 'This Week', value: '156', icon: '📅' },
    { label: 'Storage Used', value: '2.3 GB', icon: '💾' },
  ];

  const jobs = [
    { id: 1, address: '245 Oak Street, Denver, CO', photos: 42, lastUpdated: '2 hours ago' },
    { id: 2, address: '678 Pine Avenue, Boulder, CO', photos: 38, lastUpdated: 'Yesterday' },
    { id: 3, address: '123 Maple Drive, Aurora, CO', photos: 35, lastUpdated: '3 days ago' },
    { id: 4, address: '456 Cedar Lane, Fort Collins, CO', photos: 28, lastUpdated: '1 week ago' },
    { id: 5, address: '789 Elm Street, Littleton, CO', photos: 22, lastUpdated: '2 weeks ago' },
    { id: 6, address: '321 Birch Road, Lakewood, CO', photos: 18, lastUpdated: '3 weeks ago' },
  ];

  const photoCategories = [
    { id: 1, name: 'Roof Assessment', beforeAfter: true, count: 156 },
    { id: 2, name: 'Damage Documentation', beforeAfter: true, count: 89 },
    { id: 3, name: 'Installation Progress', beforeAfter: true, count: 234 },
    { id: 4, name: 'Final Inspection', beforeAfter: false, count: 103 },
    { id: 5, name: 'Materials & Supplies', beforeAfter: false, count: 67 },
  ];

  const photos = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    type: photoCategories[i % photoCategories.length].name,
    jobAddress: jobs[i % jobs.length].address,
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    photographer: ['John Smith', 'Sarah Johnson', 'Mike Davis'][i % 3],
    tags: ['damage', 'critical', 'review-needed'].slice(0, Math.floor(Math.random() * 3) + 1),
    hasGps: Math.random() > 0.3,
  }));

  const togglePhotoSelection = (id: number) => {
    setSelectedPhotos((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Header Stats Bar */}
      <div className="border-b" style={{ backgroundColor: colors.navy, borderColor: colors.gold }}>
        <div className="mx-auto max-w-7xl px-6 py-6">
          <h1 className="mb-6 text-3xl font-bold text-white">Photo Management</h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="rounded-lg border-2 p-4 text-white"
                style={{ borderColor: colors.gold, backgroundColor: `${colors.teal}20` }}
              >
                <div className="text-3xl">{stat.icon}</div>
                <div className="mt-2 text-sm opacity-75">{stat.label}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Toolbar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-lg p-2 transition ${
                viewMode === 'grid'
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={{
                backgroundColor: viewMode === 'grid' ? colors.teal : 'transparent',
              }}
            >
              <Grid3x3 size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-lg p-2 transition ${
                viewMode === 'list'
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={{
                backgroundColor: viewMode === 'list' ? colors.teal : 'transparent',
              }}
            >
              <List size={20} />
            </button>
          </div>

          <div className="flex flex-1 max-w-md items-center rounded-lg border-2 border-gray-300 px-3">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search photos..."
              className="ml-2 w-full border-0 bg-transparent py-2 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="rounded-lg border-2 border-gray-300 px-4 py-2 font-medium transition hover:border-gray-400"
            >
              <Filter size={18} className="inline mr-2" />
              Filters
            </button>
            <button
              className="rounded-lg px-4 py-2 font-medium text-white transition hover:opacity-90"
              style={{ backgroundColor: colors.gold }}
            >
              <Plus size={18} className="inline mr-2" />
              Upload
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilterPanel && (
          <div className="mb-8 rounded-lg border-2 border-gray-300 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold" style={{ color: colors.navy }}>
                Filters
              </h3>
              <button onClick={() => setShowFilterPanel(false)}>
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {/* Job Filter */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Job
                </label>
                <select className="w-full rounded-lg border-2 border-gray-300 px-3 py-2">
                  <option>All Jobs</option>
                  {jobs.map((job) => (
                    <option key={job.id}>{job.address}</option>
                  ))}
                </select>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Date Range
                </label>
                <select className="w-full rounded-lg border-2 border-gray-300 px-3 py-2">
                  <option>Any Time</option>
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>This Year</option>
                </select>
              </div>

              {/* Photo Type Filter */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Photo Type
                </label>
                <select className="w-full rounded-lg border-2 border-gray-300 px-3 py-2">
                  <option>All Types</option>
                  {photoCategories.map((cat) => (
                    <option key={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Photographer Filter */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Photographer
                </label>
                <select className="w-full rounded-lg border-2 border-gray-300 px-3 py-2">
                  <option>All Photographers</option>
                  <option>John Smith</option>
                  <option>Sarah Johnson</option>
                  <option>Mike Davis</option>
                </select>
              </div>

              {/* Tags Filter */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Tags
                </label>
                <select className="w-full rounded-lg border-2 border-gray-300 px-3 py-2">
                  <option>All Tags</option>
                  <option>damage</option>
                  <option>critical</option>
                  <option>review-needed</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Photo Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="overflow-hidden rounded-lg border-2 border-gray-200 transition hover:border-gray-400"
                  >
                    {/* Photo Placeholder */}
                    <div
                      className="relative h-48 w-full"
                      style={{
                        background: `linear-gradient(135deg, ${colors.teal}40 0%, ${colors.gold}20 100%)`,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPhotos.includes(photo.id)}
                        onChange={() => togglePhotoSelection(photo.id)}
                        className="absolute left-2 top-2 h-5 w-5 cursor-pointer"
                      />
                      <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-white px-2 py-1 text-xs font-medium text-gray-700">
                        {photo.hasGps && <MapPin size={14} />}
                      </div>
                    </div>

                    {/* Photo Info */}
                    <div className="bg-white p-3">
                      <div className="mb-2 text-xs font-semibold text-gray-600">
                        {photo.type}
                      </div>
                      <div className="mb-2 text-xs text-gray-500">{photo.jobAddress}</div>
                      <div className="mb-2 flex items-center gap-1 text-xs text-gray-500">
                        <Calendar size={12} />
                        {photo.date}
                      </div>
                      <div className="mb-2 flex items-center gap-1 text-xs text-gray-500">
                        <User size={12} />
                        {photo.photographer}
                      </div>
                      {photo.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {photo.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full px-2 py-1 text-xs"
                              style={{
                                backgroundColor: `${colors.teal}20`,
                                color: colors.teal,
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Photo List View */}
            {viewMode === 'list' && (
              <div className="space-y-2">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="flex items-center gap-4 rounded-lg border-2 border-gray-200 p-4 hover:border-gray-400"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPhotos.includes(photo.id)}
                      onChange={() => togglePhotoSelection(photo.id)}
                      className="h-5 w-5 cursor-pointer"
                    />
                    <div
                      className="h-16 w-16 flex-shrink-0 rounded-lg"
                      style={{
                        background: `linear-gradient(135deg, ${colors.teal}40 0%, ${colors.gold}20 100%)`,
                      }}
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{photo.type}</div>
                      <div className="mt-1 text-sm text-gray-500">{photo.jobAddress}</div>
                      <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {photo.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <User size={12} />
                          {photo.photographer}
                        </span>
                        {photo.hasGps && (
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            GPS Tagged
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="rounded-lg p-2 text-gray-400 hover:text-gray-600">
                        <Download size={18} />
                      </button>
                      <button className="rounded-lg p-2 text-gray-400 hover:text-gray-600">
                        <Share2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Job Albums */}
            <div className="rounded-lg border-2 border-gray-200 p-4">
              <h3 className="mb-4 font-semibold" style={{ color: colors.navy }}>
                <Briefcase size={18} className="mb-1 inline mr-2" />
                Job Albums
              </h3>
              <div className="space-y-2">
                {jobs.map((job) => (
                  <button
                    key={job.id}
                    className="w-full rounded-lg border-l-4 p-3 text-left transition hover:bg-gray-50"
                    style={{ borderColor: colors.teal }}
                  >
                    <div className="text-sm font-medium text-gray-900">{job.address}</div>
                    <div className="mt-1 text-xs text-gray-500">
                      {job.photos} photos • {job.lastUpdated}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* CompanyCam Sync */}
            <div className="rounded-lg border-2 border-gray-200 p-4">
              <h3 className="mb-3 font-semibold" style={{ color: colors.navy }}>
                <RefreshCw size={18} className="mb-1 inline mr-2" />
                CompanyCam Sync
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {syncStatus === 'synced' && (
                    <>
                      <CheckCircle size={16} className="text-green-500" />
                      <span className="text-sm text-gray-700">Synced</span>
                    </>
                  )}
                  {syncStatus === 'syncing' && (
                    <>
                      <RefreshCw size={16} className="animate-spin text-blue-500" />
                      <span className="text-sm text-gray-700">Syncing...</span>
                    </>
                  )}
                  {syncStatus === 'error' && (
                    <>
                      <AlertCircle size={16} className="text-red-500" />
                      <span className="text-sm text-gray-700">Sync error</span>
                    </>
                  )}
                </div>
                <button
                  className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 text-sm font-medium transition hover:border-gray-400"
                >
                  <RefreshCw size={14} className="mb-1 inline mr-2" />
                  Sync Now
                </button>
              </div>
            </div>

            {/* Before/After Categories */}
            <div className="rounded-lg border-2 border-gray-200 p-4">
              <h3 className="mb-4 font-semibold" style={{ color: colors.navy }}>
                Categories
              </h3>
              <div className="space-y-2">
                {photoCategories.map((cat) => (
                  <button
                    key={cat.id}
                    className="w-full rounded-lg bg-gray-50 p-3 text-left transition hover:bg-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900">{cat.name}</div>
                      <span className="text-xs font-semibold text-gray-500">
                        {cat.count}
                      </span>
                    </div>
                    {cat.beforeAfter && (
                      <div className="mt-1 text-xs text-gray-500">Before/After</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Annotation Tools */}
            <div className="rounded-lg border-2 border-gray-200 p-4">
              <button
                onClick={() => setShowAnnotationTools(!showAnnotationTools)}
                className="mb-3 w-full text-left font-semibold"
                style={{ color: colors.navy }}
              >
                <Edit3 size={18} className="mb-1 inline mr-2" />
                Annotation Tools
              </button>
              {showAnnotationTools && (
                <div className="space-y-2">
                  <button className="w-full rounded-lg bg-gray-100 px-3 py-2 text-left text-sm hover:bg-gray-200">
                    Draw
                  </button>
                  <button className="w-full rounded-lg bg-gray-100 px-3 py-2 text-left text-sm hover:bg-gray-200">
                    Text
                  </button>
                  <button className="w-full rounded-lg bg-gray-100 px-3 py-2 text-left text-sm hover:bg-gray-200">
                    Arrows
                  </button>
                  <button className="w-full rounded-lg bg-gray-100 px-3 py-2 text-left text-sm hover:bg-gray-200">
                    Shapes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="mt-8 rounded-lg border-4 border-dashed p-12 text-center" style={{ borderColor: colors.gold }}>
          <Upload size={48} className="mx-auto mb-4 opacity-50" />
          <h3 className="mb-2 text-lg font-semibold" style={{ color: colors.navy }}>
            Drag and drop photos here
          </h3>
          <p className="mb-4 text-gray-600">or click to browse from your device</p>
          <button
            className="rounded-lg px-6 py-2 font-medium text-white transition hover:opacity-90"
            style={{ backgroundColor: colors.teal }}
          >
            Select Files
          </button>
        </div>
      </div>
    </div>
  );
}
