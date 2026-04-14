'use client';

import { useState } from 'react';
import { useApi } from '@/lib/hooks/useApi';
import { IntegrationConnection } from '@/lib/types';
import { Building2, Users, Palette, Bell, Shield, Database, Zap, Globe } from 'lucide-react';

const tabs = [
  { id: 'account', label: 'Account', icon: Building2 },
  { id: 'users', label: 'Users & Teams', icon: Users },
  { id: 'pipeline', label: 'Pipeline', icon: Database },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'integrations', label: 'Integrations', icon: Zap },
  { id: 'branding', label: 'Branding', icon: Palette },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'domain', label: 'Domain', icon: Globe },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const { data: integrations } = useApi<IntegrationConnection>('/api/integrations', { limit: 50 });

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <h1 className="text-2xl font-bold text-[#0B1F3A] mb-6">Settings</h1>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-56 shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-[#0B1F3A] text-white' : 'text-[#0B1F3A] hover:bg-gray-100'}`}>
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'account' && (
            <div className="card space-y-6">
              <h2 className="text-lg font-bold text-[#0B1F3A]">Account Settings</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Organization Name</label>
                  <input type="text" defaultValue="GoldenDoor HQ" className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#F0A500]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Domain</label>
                  <input type="text" defaultValue="goldendoorhq.com" className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#F0A500]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Industry</label>
                  <input type="text" defaultValue="Home Services" className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#F0A500]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Time Zone</label>
                  <select className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#F0A500]">
                    <option>America/Chicago (CST)</option>
                    <option>America/New_York (EST)</option>
                    <option>America/Denver (MST)</option>
                    <option>America/Los_Angeles (PST)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Plan</label>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#F0A500]/20 text-[#0B1F3A]">Enterprise</span>
                  <span className="text-sm text-[#9CA3AF]">Unlimited users, all features</span>
                </div>
              </div>
              <button className="btn-primary">Save Changes</button>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="card space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#0B1F3A]">Users & Teams</h2>
                <button className="btn-primary text-sm">Invite User</button>
              </div>
              {[
                { name: 'Afan Saleem', email: 'afan@goldendoorhq.com', role: 'Owner', active: true },
                { name: 'James Reed', email: 'james@goldendoorhq.com', role: 'Admin', active: true },
                { name: 'Mike Torres', email: 'mike@goldendoorhq.com', role: 'Rep', active: true },
                { name: 'Sarah Kim', email: 'sarah@goldendoorhq.com', role: 'Rep', active: true },
              ].map((u) => (
                <div key={u.email} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#0B1F3A] flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{u.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#0B1F3A]">{u.name}</p>
                    <p className="text-sm text-[#9CA3AF]">{u.email}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#0B1F3A]/10 text-[#0B1F3A]">{u.role}</span>
                  <span className={`w-2 h-2 rounded-full ${u.active ? 'bg-green-500' : 'bg-gray-400'}`} />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'pipeline' && (
            <div className="card space-y-4">
              <h2 className="text-lg font-bold text-[#0B1F3A]">Pipeline Configuration</h2>
              <p className="text-sm text-[#9CA3AF]">Configure your sales pipeline stages</p>
              <div className="space-y-2">
                {['Appointment Scheduled', 'Qualified to Buy', 'Presentation Scheduled', 'Decision Maker Bought-In', 'Contract Sent', 'Closed Won', 'Closed Lost'].map((stage, i) => (
                  <div key={stage} className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB]">
                    <div className="w-8 h-8 rounded flex items-center justify-center bg-gray-100 text-sm font-bold text-[#0B1F3A]">{i + 1}</div>
                    <input type="text" defaultValue={stage} className="flex-1 border border-[#E5E7EB] rounded px-3 py-1.5 text-sm outline-none focus:border-[#F0A500]" />
                    <input type="number" defaultValue={[20, 40, 60, 80, 90, 100, 0][i]} className="w-20 border border-[#E5E7EB] rounded px-3 py-1.5 text-sm outline-none text-center" />
                    <span className="text-xs text-[#9CA3AF]">%</span>
                  </div>
                ))}
              </div>
              <button className="btn-primary">Save Pipeline</button>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="card space-y-4">
              <h2 className="text-lg font-bold text-[#0B1F3A]">Integrations</h2>
              {integrations.length === 0 ? (
                <p className="text-sm text-[#9CA3AF]">No integrations configured. Go to the Integrations page to connect your tools.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {integrations.map((integ) => (
                    <div key={integ.id} className="flex items-center gap-3 p-4 rounded-lg border border-[#E5E7EB] hover:border-[#F0A500]/50 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Zap size={18} className="text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#0B1F3A]">{integ.display_name || integ.provider}</p>
                        <p className="text-xs text-[#9CA3AF]">Sync: {integ.sync_frequency || 'manual'}</p>
                      </div>
                      <span className={`text-sm px-3 py-1 rounded-lg font-medium ${integ.status === 'connected' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-[#0B1F3A]'}`}>
                        {integ.status === 'connected' ? 'Connected' : integ.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card space-y-4">
              <h2 className="text-lg font-bold text-[#0B1F3A]">Notification Preferences</h2>
              {['New deal created', 'Deal stage changed', 'Task assigned to you', 'Ticket assigned to you', 'Contact created', 'Weekly digest report'].map(pref => (
                <div key={pref} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                  <span className="text-sm text-[#0B1F3A]">{pref}</span>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 text-sm text-[#9CA3AF]"><input type="checkbox" defaultChecked className="rounded" /> Email</label>
                    <label className="flex items-center gap-1.5 text-sm text-[#9CA3AF]"><input type="checkbox" defaultChecked className="rounded" /> In-app</label>
                    <label className="flex items-center gap-1.5 text-sm text-[#9CA3AF]"><input type="checkbox" className="rounded" /> Slack</label>
                  </div>
                </div>
              ))}
              <button className="btn-primary">Save Preferences</button>
            </div>
          )}

          {(activeTab === 'branding' || activeTab === 'security' || activeTab === 'domain') && (
            <div className="card">
              <h2 className="text-lg font-bold text-[#0B1F3A] mb-2">{tabs.find(t => t.id === activeTab)?.label}</h2>
              <p className="text-sm text-[#9CA3AF]">Configuration coming soon. This section will allow you to customize your {activeTab === 'branding' ? 'brand colors and logo' : activeTab === 'security' ? 'authentication and access controls' : 'custom domain settings'}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
