'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, List, MapPin, Users, AlertCircle } from 'lucide-react';

interface ScheduleEntry {
  id: string;
  jobNumber: string;
  customerName: string;
  address: string;
  time: string;
  duration: number;
  type: 'install' | 'survey' | 'inspection' | 'delivery';
  stage: string;
  crew: string;
  notes: string;
}

interface CrewMember {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'break' | 'offline';
  currentJob?: string;
  skillLevel: string;
}

const scheduleData: ScheduleEntry[] = [
  {
    id: '1',
    jobNumber: 'JB-2024-001',
    customerName: 'John Smith',
    address: '123 Oak Lane, Denver, CO',
    time: '08:00',
    duration: 4,
    type: 'install',
    stage: 'In Progress',
    crew: 'Team A',
    notes: '8.5kW system installation'
  },
  {
    id: '2',
    jobNumber: 'JB-2024-002',
    customerName: 'Sarah Johnson',
    address: '456 Maple Ave, Boulder, CO',
    time: '09:30',
    duration: 2,
    type: 'survey',
    stage: 'Scheduled',
    crew: 'Team B',
    notes: 'Initial roof survey'
  },
  {
    id: '3',
    jobNumber: 'JB-2024-003',
    customerName: 'Michael Davis',
    address: '789 Pine St, Golden, CO',
    time: '11:00',
    duration: 3,
    type: 'inspection',
    stage: 'Pending',
    crew: 'Team A',
    notes: 'Final inspection'
  },
  {
    id: '4',
    jobNumber: 'JB-2024-004',
    customerName: 'Emily Wilson',
    address: '321 Elm Road, Aurora, CO',
    time: '13:00',
    duration: 5,
    type: 'install',
    stage: 'In Progress',
    crew: 'Team C',
    notes: '12kW system with battery'
  },
  {
    id: '5',
    jobNumber: 'JB-2024-005',
    customerName: 'Robert Brown',
    address: '654 Cedar Lane, Littleton, CO',
    time: '14:30',
    duration: 1,
    type: 'delivery',
    stage: 'Scheduled',
    crew: 'Logistics',
    notes: 'Equipment delivery'
  },
  {
    id: '6',
    jobNumber: 'JB-2024-006',
    customerName: 'Lisa Anderson',
    address: '987 Birch Ave, Westminster, CO',
    time: '16:00',
    duration: 2,
    type: 'survey',
    stage: 'Scheduled',
    crew: 'Team B',
    notes: 'Smart home consultation'
  },
  {
    id: '7',
    jobNumber: 'JB-2024-007',
    customerName: 'David Martinez',
    address: '135 Oak Court, Arvada, CO',
    time: '10:00',
    duration: 4,
    type: 'install',
    stage: 'In Progress',
    crew: 'Team D',
    notes: 'Roof installation'
  },
  {
    id: '8',
    jobNumber: 'JB-2024-008',
    customerName: 'Jennifer Taylor',
    address: '246 Spruce St, Broomfield, CO',
    time: '15:00',
    duration: 2,
    type: 'inspection',
    stage: 'Scheduled',
    crew: 'Team C',
    notes: 'Quality assurance check'
  }
];

const crewData: CrewMember[] = [
  { id: '1', name: 'Marcus Johnson', status: 'busy', currentJob: 'JB-2024-001', skillLevel: 'Lead Installer' },
  { id: '2', name: 'James Wilson', status: 'available', skillLevel: 'Installer' },
  { id: '3', name: 'Carlos Rodriguez', status: 'break', skillLevel: 'Surveyor' },
  { id: '4', name: 'Ahmed Hassan', status: 'busy', currentJob: 'JB-2024-004', skillLevel: 'Lead Installer' },
  { id: '5', name: 'Tom Bradley', status: 'offline', skillLevel: 'Technician' },
  { id: '6', name: 'Kevin Park', status: 'available', skillLevel: 'Inspector' }
];

const getTypeColor = (type: ScheduleEntry['type']): string => {
  switch (type) {
    case 'install':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'survey':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'inspection':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'delivery':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const getStatusColor = (status: CrewMember['status']): string => {
  switch (status) {
    case 'available':
      return 'bg-green-100 text-green-800';
    case 'busy':
      return 'bg-blue-100 text-blue-800';
    case 'break':
      return 'bg-amber-100 text-amber-800';
    case 'offline':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusDot = (status: CrewMember['status']): string => {
  switch (status) {
    case 'available':
      return 'bg-green-500';
    case 'busy':
      return 'bg-blue-500';
    case 'break':
      return 'bg-amber-500';
    case 'offline':
      return 'bg-gray-400';
    default:
      return 'bg-gray-400';
  }
};

type ViewType = 'calendar' | 'list' | 'map';

export default function SchedulingPage() {
  const [view, setView] = useState<ViewType>('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 0, 15));
  const [selectedCrew, setSelectedCrew] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<ScheduleEntry['type'] | 'all'>('all');

  const hours = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 7;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const filteredSchedules = scheduleData.filter((schedule) => {
    const crewMatch = !selectedCrew || schedule.crew === selectedCrew;
    const typeMatch = selectedType === 'all' || schedule.type === selectedType;
    return crewMatch && typeMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Scheduling & Dispatch</h1>
          <p className="text-slate-600">Manage jobs, crew availability, and dispatch assignments</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setView('calendar')}
                    className={`p-2 rounded-lg transition-colors ${
                      view === 'calendar'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Calendar size={20} />
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      view === 'list'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <List size={20} />
                  </button>
                  <button
                    onClick={() => setView('map')}
                    className={`p-2 rounded-lg transition-colors ${
                      view === 'map'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <MapPin size={20} />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:bg-slate-100 rounded">
                    <ChevronLeft size={20} className="text-slate-600" />
                  </button>
                  <span className="text-sm font-medium text-slate-700 min-w-32 text-center">
                    {selectedDate.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <button className="p-1 hover:bg-slate-100 rounded">
                    <ChevronRight size={20} className="text-slate-600" />
                  </button>
                </div>
              </div>

              {view === 'calendar' && (
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-13 gap-1 min-w-max">
                    <div className="w-20 bg-slate-50 rounded-lg p-3 font-semibold text-sm text-slate-700">
                      Time
                    </div>
                    {hours.map((hour) => (
                      <div key={hour} className="w-32 bg-slate-50 rounded-lg p-3 font-semibold text-sm text-slate-700 text-center">
                        {hour}
                      </div>
                    ))}
                    {hours.map((hour) => (
                      <div key={`slot-${hour}`} className="w-20 border border-slate-200 rounded p-2 min-h-48"></div>
                    ))}
                    {filteredSchedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className={`w-32 rounded-lg p-3 border-2 cursor-pointer hover:shadow-md transition-shadow ${getTypeColor(schedule.type)}`}
                      >
                        <div className="font-semibold text-sm">{schedule.customerName}</div>
                        <div className="text-xs mt-1 opacity-75">{schedule.time}</div>
                        <div className="text-xs mt-1 opacity-75">{schedule.crew}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {view === 'list' && (
                <div className="space-y-3">
                  {filteredSchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-slate-900">{schedule.customerName}</h3>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getTypeColor(schedule.type)}`}>
                              {schedule.type.charAt(0).toUpperCase() + schedule.type.slice(1)}
                            </span>
                          </div>
                          <div className="text-sm text-slate-600 mt-1">{schedule.address}</div>
                          <div className="text-sm text-slate-600 mt-1">Job: {schedule.jobNumber}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-slate-900">{schedule.time}</div>
                          <div className="text-sm text-slate-600">{schedule.duration}h</div>
                          <div className="text-sm text-slate-600 mt-1">{schedule.crew}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {view === 'map' && (
                <div className="h-96 bg-slate-100 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
                  <div className="text-center">
                    <MapPin size={48} className="mx-auto text-slate-400 mb-3" />
                    <p className="text-slate-600">Map view coming soon</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Crew Status</h2>
              <div className="space-y-3">
                {crewData.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => setSelectedCrew(selectedCrew === member.name ? null : member.name)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedCrew === member.name ? 'bg-blue-50 border-2 border-blue-300' : 'border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${getStatusDot(member.status)}`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-slate-900">{member.name}</div>
                        <div className="text-xs text-slate-600 mt-1">{member.skillLevel}</div>
                        {member.currentJob && <div className="text-xs text-blue-600 mt-1">{member.currentJob}</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-3 text-sm">Filter by Type</h3>
                <div className="space-y-2">
                  {['all', 'install', 'survey', 'inspection', 'delivery'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type as ScheduleEntry['type'] | 'all')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedType === type
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
