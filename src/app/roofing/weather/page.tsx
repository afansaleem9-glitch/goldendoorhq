"use client";
import { useState, useEffect } from 'react';
import { supabase, ORG_ID } from '@/lib/supabase';
import {
  Search,
  Filter,
  AlertTriangle,
  X,
  ChevronDown,
  ChevronRight,
  Clock,
  Calendar,
  Home,
  MapPin,
  Eye,
  RefreshCw,
  Cloud,
  Zap,
  Star,
  Activity,
  Bell,
  Target,
  TrendingUp,
  BarChart3,
  Download,
  ExternalLink,
  Shield,
  Layers,
  Wind,
  Droplets,
  Sun,
  CloudRain,
  Thermometer,
  Navigation,
} from 'lucide-react';

export default function WeatherPage() {
  const [dismissedAlert, setDismissedAlert] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'hailmap' | 'eventlog' | 'tracker' | 'hailwatch' | 'corelogic' | 'leads'>('overview');

  // Mock current conditions for 3 markets
  const marketConditions = [
    {
      id: 'dallas',
      name: 'Dallas, TX',
      temp: 87,
      condition: 'Severe Thunderstorm',
      windSpeed: 34,
      humidity: 72,
      precipChance: 85,
      feelsLike: 91,
      icon: CloudRain,
      forecast: [
        { day: 'Mon', high: 88, low: 72, condition: 'Storms', icon: CloudRain },
        { day: 'Tue', high: 85, low: 70, condition: 'Scattered', icon: Cloud },
        { day: 'Wed', high: 86, low: 71, condition: 'Partly Cloudy', icon: Sun },
        { day: 'Thu', high: 89, low: 73, condition: 'Sunny', icon: Sun },
        { day: 'Fri', high: 91, low: 75, condition: 'Hot', icon: Sun },
      ],
    },
    {
      id: 'columbus',
      name: 'Columbus, OH',
      temp: 68,
      condition: 'Tornado Watch',
      windSpeed: 28,
      humidity: 68,
      precipChance: 90,
      feelsLike: 66,
      icon: Zap,
      forecast: [
        { day: 'Mon', high: 70, low: 58, condition: 'Severe', icon: Zap },
        { day: 'Tue', high: 72, low: 60, condition: 'Cloudy', icon: Cloud },
        { day: 'Wed', high: 75, low: 62, condition: 'Partly Cloudy', icon: Cloud },
        { day: 'Thu', high: 78, low: 65, condition: 'Sunny', icon: Sun },
        { day: 'Fri', high: 80, low: 67, condition: 'Sunny', icon: Sun },
      ],
    },
    {
      id: 'detroit',
      name: 'Detroit, MI',
      temp: 62,
      condition: 'Heavy Rain',
      windSpeed: 22,
      humidity: 81,
      precipChance: 75,
      feelsLike: 60,
      icon: CloudRain,
      forecast: [
        { day: 'Mon', high: 65, low: 55, condition: 'Rainy', icon: CloudRain },
        { day: 'Tue', high: 68, low: 58, condition: 'Clearing', icon: Cloud },
        { day: 'Wed', high: 70, low: 60, condition: 'Partly Cloudy', icon: Cloud },
        { day: 'Thu', high: 73, low: 62, condition: 'Sunny', icon: Sun },
        { day: 'Fri', high: 76, low: 65, condition: 'Sunny', icon: Sun },
      ],
    },
  ];

  // Mock hail events
  const hailEvents = [
    {
      id: 1,
      location: 'Frisco, TX',
      size: 'Golf Ball (1.75")',
      date: '2024-04-14',
      propertiesAffected: 2847,
      intensity: 'Severe',
    },
    {
      id: 2,
      location: 'Arlington, TX',
      size: 'Quarter (1.0")',
      date: '2024-04-13',
      propertiesAffected: 1523,
      intensity: 'Moderate',
    },
    {
      id: 3,
      location: 'Columbus, OH',
      size: 'Marble (0.75")',
      date: '2024-04-12',
      propertiesAffected: 892,
      intensity: 'Moderate',
    },
    {
      id: 4,
      location: 'Westerville, OH',
      size: 'Pea (0.25")',
      date: '2024-04-11',
      propertiesAffected: 456,
      intensity: 'Light',
    },
    {
      id: 5,
      location: 'Detroit, MI',
      size: 'Quarter (1.0")',
      date: '2024-04-10',
      propertiesAffected: 1234,
      intensity: 'Moderate',
    },
    {
      id: 6,
      location: 'Troy, MI',
      size: 'Marble (0.75")',
      date: '2024-04-09',
      propertiesAffected: 678,
      intensity: 'Light',
    },
  ];

  // Mock storm events log
  const stormEvents = [
    {
      id: 1,
      date: '2024-04-14 14:32',
      type: 'Hail',
      location: 'Frisco, TX',
      severity: 5,
      affectedProperties: 2847,
      leadsGenerated: 1423,
      status: 'Active',
    },
    {
      id: 2,
      date: '2024-04-14 12:15',
      type: 'Tornado',
      location: 'Columbus, OH',
      severity: 4,
      affectedProperties: 3124,
      leadsGenerated: 1562,
      status: 'Monitoring',
    },
    {
      id: 3,
      date: '2024-04-13 16:42',
      type: 'Wind',
      location: 'Arlington, TX',
      severity: 3,
      affectedProperties: 1523,
      leadsGenerated: 761,
      status: 'Monitoring',
    },
    {
      id: 4,
      date: '2024-04-13 09:18',
      type: 'Hail',
      location: 'Westerville, OH',
      severity: 2,
      affectedProperties: 892,
      leadsGenerated: 446,
      status: 'Monitoring',
    },
    {
      id: 5,
      date: '2024-04-12 18:54',
      type: 'Flood',
      location: 'Detroit, MI',
      severity: 3,
      affectedProperties: 2156,
      leadsGenerated: 1078,
      status: 'Monitoring',
    },
    {
      id: 6,
      date: '2024-04-11 13:22',
      type: 'Hail',
      location: 'Detroit, MI',
      severity: 4,
      affectedProperties: 1234,
      leadsGenerated: 617,
      status: 'Passed',
    },
    {
      id: 7,
      date: '2024-04-10 15:45',
      type: 'Wind',
      location: 'Troy, MI',
      severity: 2,
      affectedProperties: 678,
      leadsGenerated: 339,
      status: 'Passed',
    },
    {
      id: 8,
      date: '2024-04-09 11:30',
      type: 'Hail',
      location: 'Dallas, TX',
      severity: 3,
      affectedProperties: 945,
      leadsGenerated: 472,
      status: 'Passed',
    },
    {
      id: 9,
      date: '2024-04-08 09:12',
      type: 'Tornado',
      location: 'Arlington, TX',
      severity: 5,
      affectedProperties: 4156,
      leadsGenerated: 2078,
      status: 'Passed',
    },
    {
      id: 10,
      date: '2024-04-07 14:28',
      type: 'Wind',
      location: 'Columbus, OH',
      severity: 2,
      affectedProperties: 512,
      leadsGenerated: 256,
      status: 'Passed',
    },
  ];

  // Mock storm response tracker
  const stormResponses = [
    {
      id: 1,
      name: 'Frisco Hail Event',
      date: '2024-04-14',
      area: 'North Dallas Metroplex',
      doorsKnocked: 847,
      inspectionsScheduled: 342,
      estimatesSent: 289,
      contractsSigned: 156,
      conversionRate: 53.9,
    },
    {
      id: 2,
      name: 'Columbus Tornado Watch',
      date: '2024-04-14',
      area: 'Franklin County, OH',
      doorsKnocked: 1203,
      inspectionsScheduled: 512,
      estimatesSent: 423,
      contractsSigned: 215,
      conversionRate: 50.8,
    },
    {
      id: 3,
      name: 'Detroit Flooding',
      date: '2024-04-12',
      area: 'Wayne County, MI',
      doorsKnocked: 645,
      inspectionsScheduled: 289,
      estimatesSent: 234,
      contractsSigned: 98,
      conversionRate: 41.9,
    },
    {
      id: 4,
      name: 'Arlington Wind Event',
      date: '2024-04-13',
      area: 'Arlington, TX',
      doorsKnocked: 523,
      inspectionsScheduled: 198,
      estimatesSent: 156,
      contractsSigned: 72,
      conversionRate: 46.2,
    },
  ];

  // Mock HailWatch integration data
  const hailWatchData = {
    status: 'Connected',
    tier: 'Enterprise',
    coverageAreas: ['Texas', 'Ohio', 'Michigan'],
    activeAlerts: 3,
    alertsToday: 8,
    alertPreferences: {
      minHailSize: 'Quarter (1.0")',
      includeWindEvents: true,
      includeTornadoAlerts: true,
      includeFloodAlerts: false,
      notifications: 'Real-time',
    },
  };

  // Mock CoreLogic data
  const coreLogicData = {
    propertiesInAffectedZones: 12847,
    estimatedDamageReports: 4523,
    highPriorityZones: [
      { zone: 'Frisco, TX', count: 2847, damageEstimate: '$89.3M' },
      { zone: 'Columbus, OH', count: 3124, damageEstimate: '$71.2M' },
      { zone: 'Detroit, MI', count: 2156, damageEstimate: '$54.8M' },
      { zone: 'Arlington, TX', count: 1523, damageEstimate: '$38.1M' },
    ],
  };

  // Mock generated leads
  const generatedLeads = [
    {
      id: 1,
      address: '4287 Silverado Way, Frisco, TX 75034',
      owner: 'James Mitchell',
      phone: '(469) 555-0142',
      property: 'Single Family - 2 Story',
      sqft: '3,847',
      roofAge: '12 years',
      source: 'Hail Event - 04/14',
      priority: 'High',
    },
    {
      id: 2,
      address: '892 Oak Ridge Ln, Arlington, TX 76010',
      owner: 'Sarah Thompson',
      phone: '(817) 555-0189',
      property: 'Single Family - 1.5 Story',
      sqft: '2,456',
      roofAge: '15 years',
      source: 'Hail Event - 04/13',
      priority: 'High',
    },
    {
      id: 3,
      address: '561 Riverside Dr, Columbus, OH 43215',
      owner: 'Michael Chen',
      phone: '(614) 555-0276',
      property: 'Single Family - 2 Story',
      sqft: '4,123',
      roofAge: '18 years',
      source: 'Tornado Watch - 04/14',
      priority: 'Critical',
    },
    {
      id: 4,
      address: '1204 Maple Ave, Westerville, OH 43081',
      owner: 'Jennifer Rodriguez',
      phone: '(614) 555-0341',
      property: 'Single Family - Ranch',
      sqft: '2,198',
      roofAge: '8 years',
      source: 'Hail Event - 04/12',
      priority: 'Medium',
    },
    {
      id: 5,
      address: '3456 Lake Shore Rd, Detroit, MI 48224',
      owner: 'David Martinez',
      phone: '(313) 555-0428',
      property: 'Single Family - 2 Story',
      sqft: '3,567',
      roofAge: '20 years',
      source: 'Flood Event - 04/12',
      priority: 'High',
    },
    {
      id: 6,
      address: '728 Pine Street, Troy, MI 48083',
      owner: 'Lisa Anderson',
      phone: '(248) 555-0512',
      property: 'Single Family - Ranch',
      sqft: '2,834',
      roofAge: '11 years',
      source: 'Hail Event - 04/10',
      priority: 'Medium',
    },
    {
      id: 7,
      address: '945 Cedar Lane, Dallas, TX 75201',
      owner: 'Robert Williams',
      phone: '(214) 555-0623',
      property: 'Single Family - 2 Story',
      sqft: '3,912',
      roofAge: '14 years',
      source: 'Hail Event - 04/09',
      priority: 'High',
    },
    {
      id: 8,
      address: '2134 Elm Court, Arlington, TX 76011',
      owner: 'Amanda Johnson',
      phone: '(817) 555-0734',
      property: 'Single Family - 1.5 Story',
      sqft: '2,678',
      roofAge: '9 years',
      source: 'Tornado Event - 04/08',
      priority: 'Critical',
    },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const getSeverityColor = (severity: number) => {
    if (severity === 5) return 'bg-red-900 text-white';
    if (severity === 4) return 'bg-orange-600 text-white';
    if (severity === 3) return 'bg-yellow-500 text-white';
    return 'bg-yellow-200 text-gray-900';
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'Critical') return 'bg-red-100 border-red-300 text-red-900';
    if (priority === 'High') return 'bg-orange-100 border-orange-300 text-orange-900';
    return 'bg-yellow-100 border-yellow-300 text-yellow-900';
  };

  const getStatusColor = (status: string) => {
    if (status === 'Active') return 'bg-red-100 text-red-900 border border-red-300';
    if (status === 'Monitoring') return 'bg-yellow-100 text-yellow-900 border border-yellow-300';
    return 'bg-gray-100 text-gray-700 border border-gray-300';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Weather & Storm Tracking</h1>
                <p className="text-sm text-gray-500">Real-time severe weather monitoring for roofing leads</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Storm Alert Banner */}
        {!dismissedAlert && (
          <div className="mb-8 p-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg border border-red-800 shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-lg">SEVERE WEATHER ALERT - ACTIVE</h3>
                  <p className="text-red-100 text-sm mt-1">Tornado Warning issued for Franklin County, OH (expires 7:45 PM) • Severe Hail in North Dallas (1.75" Golf Ball) • High Wind Event in Arlington, TX</p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-red-100">
                    <Clock className="w-4 h-4" />
                    <span>Updated 2:32 PM • 3 active warnings</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setDismissedAlert(true)}
                className="flex-shrink-0 p-1 hover:bg-red-700 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200 mb-8 rounded-t-lg overflow-hidden">
          <div className="flex overflow-x-auto">
            {[
              { id: 'overview', label: 'Market Overview', icon: Eye },
              { id: 'hailmap', label: 'Hail Activity Map', icon: MapPin },
              { id: 'eventlog', label: 'Event Log', icon: Activity },
              { id: 'tracker', label: 'Response Tracker', icon: Target },
              { id: 'hailwatch', label: 'HailWatch', icon: Shield },
              { id: 'corelogic', label: 'Property Data', icon: Home },
              { id: 'leads', label: 'Generated Leads', icon: TrendingUp },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 min-w-max px-4 py-4 font-medium text-sm flex items-center justify-center gap-2 transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-blue-600 bg-blue-50'
                      : 'text-gray-600 border-transparent hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Current Conditions Cards */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Current Market Conditions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {marketConditions.map((market) => {
                  const IconComponent = market.icon;
                  return (
                    <div
                      key={market.id}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setSelectedMarket(market.id)}
                    >
                      {/* Header */}
                      <div className={`px-6 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span className="font-bold">{market.name}</span>
                          </div>
                          <IconComponent className="w-6 h-6" />
                        </div>
                      </div>

                      {/* Main Stats */}
                      <div className="px-6 py-4">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-3xl font-bold text-gray-900">{market.temp}°</p>
                            <p className="text-xs text-gray-600">Feels like {market.feelsLike}°</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900 text-sm">{market.condition}</p>
                            <p className="text-xs text-gray-600">Current</p>
                          </div>
                        </div>

                        {/* Conditions Grid */}
                        <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded p-3 mb-4">
                          <div className="text-center">
                            <Wind className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                            <p className="text-xs text-gray-600">Wind</p>
                            <p className="font-bold text-sm text-gray-900">{market.windSpeed} mph</p>
                          </div>
                          <div className="text-center">
                            <Droplets className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                            <p className="text-xs text-gray-600">Humidity</p>
                            <p className="font-bold text-sm text-gray-900">{market.humidity}%</p>
                          </div>
                          <div className="text-center">
                            <CloudRain className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                            <p className="text-xs text-gray-600">Precip</p>
                            <p className="font-bold text-sm text-gray-900">{market.precipChance}%</p>
                          </div>
                        </div>
                      </div>

                      {/* 5-Day Forecast */}
                      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <p className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">5-Day Forecast</p>
                        <div className="space-y-2">
                          {market.forecast.map((day, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <span className="font-medium text-gray-900 w-12">{day.day}</span>
                              <span className="text-gray-600">{day.condition}</span>
                              <span className="font-bold text-gray-900">{day.high}° / {day.low}°</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Hail Activity Map Tab */}
        {activeTab === 'hailmap' && (
          <div className="space-y-8">
            {/* Map Placeholder */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Real-Time Hail Activity</h2>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Map Container */}
                <div className="relative w-full h-96 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center border-b border-gray-200">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-red-500" />
                    <div className="absolute top-1/3 right-1/3 w-24 h-24 rounded-full bg-orange-500" />
                    <div className="absolute bottom-1/4 right-1/4 w-20 h-20 rounded-full bg-yellow-500" />
                  </div>
                  <div className="text-center z-10">
                    <Layers className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">Interactive Hail Storm Map</p>
                    <p className="text-sm text-gray-500 mt-1">Real-time storm tracking with location pins</p>
                  </div>
                </div>

                {/* Legend */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">Hail Size Legend</p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-200 border border-yellow-300" />
                      <span className="text-xs text-gray-700">Pea (0.25")</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-yellow-300 border border-yellow-400" />
                      <span className="text-xs text-gray-700">Marble (0.75")</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-orange-400 border border-orange-500" />
                      <span className="text-xs text-gray-700">Quarter (1.0")</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-orange-500 border border-orange-600" />
                      <span className="text-xs text-gray-700">Golf Ball (1.75")</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-red-600 border border-red-700" />
                      <span className="text-xs text-gray-700">Baseball (2.75")</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Hail Events */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Hail Events (Last 7 Days)</h2>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Hail Size</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Intensity</th>
                      <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Properties</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {hailEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-900">{event.location}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{event.size}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{event.date}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            event.intensity === 'Severe' ? 'bg-red-100 text-red-900' :
                            event.intensity === 'Moderate' ? 'bg-orange-100 text-orange-900' :
                            'bg-yellow-100 text-yellow-900'
                          }`}>
                            {event.intensity}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-bold text-gray-900">{event.propertiesAffected.toLocaleString()}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Event Log Tab */}
        {activeTab === 'eventlog' && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Storm Event Log</h2>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date/Time</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Severity</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Affected</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Leads</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stormEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700">{event.date}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-900">
                          {event.type === 'Hail' && <Cloud className="w-3 h-3" />}
                          {event.type === 'Wind' && <Wind className="w-3 h-3" />}
                          {event.type === 'Tornado' && <Zap className="w-3 h-3" />}
                          {event.type === 'Flood' && <Droplets className="w-3 h-3" />}
                          {event.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {event.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded font-bold text-xs ${getSeverityColor(event.severity)}`}>
                          {event.severity}/5
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-gray-900">{event.affectedProperties.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-blue-600">{event.leadsGenerated.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded text-xs font-bold ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Response Tracker Tab */}
        {activeTab === 'tracker' && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Active Storm Response Trackers</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {stormResponses.map((response) => (
                <div key={response.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Header */}
                  <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white">
                    <h3 className="font-bold">{response.name}</h3>
                    <p className="text-sm text-teal-100 mt-1">{response.date} • {response.area}</p>
                  </div>

                  {/* Metrics Grid */}
                  <div className="px-6 py-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">Doors Knocked</p>
                      <p className="text-2xl font-bold text-gray-900">{response.doorsKnocked.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">Inspections Scheduled</p>
                      <p className="text-2xl font-bold text-gray-900">{response.inspectionsScheduled}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">Estimates Sent</p>
                      <p className="text-2xl font-bold text-gray-900">{response.estimatesSent}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">Contracts Signed</p>
                      <p className="text-2xl font-bold text-blue-600">{response.contractsSigned}</p>
                    </div>
                  </div>

                  {/* Conversion Rate */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">Conversion Rate</p>
                        <p className="text-xl font-bold text-gray-900">{response.conversionRate}%</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HailWatch Integration Tab */}
        {activeTab === 'hailwatch' && (
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6" />
                    <div>
                      <h3 className="font-bold">HailWatch Integration</h3>
                      <p className="text-sm text-emerald-100">Connected & Active</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-block px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-bold">
                      ✓ Connected
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-2">Subscription Tier</p>
                  <p className="text-2xl font-bold text-gray-900">{hailWatchData.tier}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-2">Active Alerts</p>
                  <p className="text-2xl font-bold text-red-600">{hailWatchData.activeAlerts}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-2">Alerts Today</p>
                  <p className="text-2xl font-bold text-blue-600">{hailWatchData.alertsToday}</p>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-3">Coverage Areas</p>
                <div className="flex gap-2">
                  {hailWatchData.coverageAreas.map((area) => (
                    <span key={area} className="inline-block px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full text-xs font-bold">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Alert Preferences */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-900">Alert Preferences</h3>
              </div>

              <div className="px-6 py-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Minimum Hail Size</p>
                    <p className="text-sm text-gray-600">{hailWatchData.alertPreferences.minHailSize}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>

                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Wind Events</p>
                    <p className="text-sm text-gray-600">Receive wind alerts</p>
                  </div>
                  <input type="checkbox" checked={hailWatchData.alertPreferences.includeWindEvents} readOnly className="w-5 h-5 rounded border-gray-300" />
                </div>

                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Tornado Alerts</p>
                    <p className="text-sm text-gray-600">Receive tornado watch alerts</p>
                  </div>
                  <input type="checkbox" checked={hailWatchData.alertPreferences.includeTornadoAlerts} readOnly className="w-5 h-5 rounded border-gray-300" />
                </div>

                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Flood Alerts</p>
                    <p className="text-sm text-gray-600">Receive flood warnings</p>
                  </div>
                  <input type="checkbox" checked={hailWatchData.alertPreferences.includeFloodAlerts} readOnly className="w-5 h-5 rounded border-gray-300" />
                </div>

                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Notification Mode</p>
                    <p className="text-sm text-gray-600">{hailWatchData.alertPreferences.notifications}</p>
                  </div>
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CoreLogic Property Data Tab */}
        {activeTab === 'corelogic' && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <p className="text-sm text-blue-100 font-bold uppercase tracking-wide">Properties in Affected Zones</p>
                </div>
                <div className="px-6 py-6 text-center">
                  <p className="text-4xl font-bold text-gray-900">{coreLogicData.propertiesInAffectedZones.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mt-2">Last 7 days</p>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white">
                  <p className="text-sm text-red-100 font-bold uppercase tracking-wide">Estimated Damage Reports</p>
                </div>
                <div className="px-6 py-6 text-center">
                  <p className="text-4xl font-bold text-gray-900">{coreLogicData.estimatedDamageReports.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mt-2">Documented losses</p>
                </div>
              </div>
            </div>

            {/* High Priority Zones */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-900">High Priority Zones (Last 7 Days)</h3>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Zone</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Properties</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Est. Damage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {coreLogicData.highPriorityZones.map((zone) => (
                    <tr key={zone.zone} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{zone.zone}</td>
                      <td className="px-6 py-4 text-right text-gray-700">{zone.count.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right font-bold text-red-600">{zone.damageEstimate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Generated Leads Tab */}
        {activeTab === 'leads' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Storm-Generated Leads</h2>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export</span>
              </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Address</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Property</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Roof Age</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Source</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {generatedLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{lead.address}</div>
                        <div className="text-xs text-gray-500">{lead.sqft} sqft</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{lead.owner}</div>
                        <div className="text-xs text-gray-500">{lead.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{lead.property}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{lead.roofAge}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{lead.source}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          lead.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                          lead.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>{lead.priority}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}