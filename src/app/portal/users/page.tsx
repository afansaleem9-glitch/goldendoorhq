"use client";
import { useState, useMemo } from "react";
import {
  Search, Filter, ChevronDown, MoreHorizontal, User, Mail, Phone,
  Shield, Star, MapPin, Calendar, Clock, CheckCircle2, XCircle,
  TrendingUp, Award, Users, Building2
} from "lucide-react";

type Role = "all" | "dealer" | "branch_manager" | "sales_rep" | "installer" | "surveyor" | "admin" | "support";
type Status = "all" | "active" | "inactive" | "pending";

interface PortalUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  branch: string;
  status: "active" | "inactive" | "pending";
  lastActive: string;
  joined: string;
  dealsTotal: number;
  dealsMonth: number;
  revenue: number;
  avatar?: string;
}

const mockUsers: PortalUser[] = [
  { id: "1", name: "Matthew Johnson", email: "mjohnson@deltapowergroup.com", phone: "(469) 555-0101", role: "Sales Rep", branch: "Dallas", status: "active", lastActive: "2 hours ago", joined: "Jan 15, 2024", dealsTotal: 187, dealsMonth: 14, revenue: 1248000 },
  { id: "2", name: "Sarah Chen", email: "schen@deltapowergroup.com", phone: "(214) 555-0202", role: "Sales Rep", branch: "Dallas", status: "active", lastActive: "30 min ago", joined: "Mar 22, 2024", dealsTotal: 143, dealsMonth: 11, revenue: 982500 },
  { id: "3", name: "Maria Santos", email: "msantos@deltapowergroup.com", phone: "(313) 555-0303", role: "Sales Rep", branch: "Detroit", status: "active", lastActive: "1 hour ago", joined: "Feb 08, 2024", dealsTotal: 98, dealsMonth: 8, revenue: 654200 },
  { id: "4", name: "James Wilson", email: "jwilson@deltapowergroup.com", phone: "(614) 555-0404", role: "Sales Rep", branch: "Columbus", status: "active", lastActive: "4 hours ago", joined: "Apr 01, 2024", dealsTotal: 112, dealsMonth: 9, revenue: 789000 },
  { id: "5", name: "Austin Radford", email: "aradford@deltapowergroup.com", phone: "(469) 555-0505", role: "Branch Manager", branch: "Fort Worth", status: "active", lastActive: "15 min ago", joined: "Nov 10, 2023", dealsTotal: 0, dealsMonth: 0, revenue: 0 },
  { id: "6", name: "Robert Dellavecchia", email: "rdellavecchia@deltapowergroup.com", phone: "(469) 555-0606", role: "Surveyor", branch: "Dallas", status: "active", lastActive: "1 day ago", joined: "Jun 15, 2024", dealsTotal: 0, dealsMonth: 0, revenue: 0 },
  { id: "7", name: "Christopher Smith", email: "csmith@deltapowergroup.com", phone: "(469) 555-0707", role: "Installer", branch: "Dallas", status: "active", lastActive: "3 hours ago", joined: "May 20, 2024", dealsTotal: 0, dealsMonth: 0, revenue: 0 },
  { id: "8", name: "Nelson Bonilla", email: "nbonilla@deltapowergroup.com", phone: "(469) 555-0808", role: "Installer", branch: "Dallas", status: "active", lastActive: "5 hours ago", joined: "Jul 03, 2024", dealsTotal: 0, dealsMonth: 0, revenue: 0 },
  { id: "9", name: "Jamie Belford", email: "jbelford@deltapowergroup.com", phone: "(469) 555-0909", role: "Support", branch: "Dallas", status: "active", lastActive: "20 min ago", joined: "Sep 12, 2024", dealsTotal: 0, dealsMonth: 0, revenue: 0 },
  { id: "10", name: "Sukhjeet Johal", email: "sjohal@deltapowergroup.com", phone: "(469) 555-1010", role: "Sales Rep", branch: "Dallas", status: "inactive", lastActive: "2 weeks ago", joined: "Jan 05, 2024", dealsTotal: 67, dealsMonth: 0, revenue: 445600 },
  { id: "11", name: "Samuel Elliott", email: "selliott@deltapowergroup.com", phone: "(469) 555-1111", role: "Installer", branch: "Fort Worth", status: "active", lastActive: "6 hours ago", joined: "Aug 01, 2024", dealsTotal: 0, dealsMonth: 0, revenue: 0 },
  { id: "12", name: "Brianna Warren", email: "bwarren@deltapowergroup.com", phone: "(469) 555-1212", role: "Admin", branch: "Dallas", status: "active", lastActive: "45 min ago", joined: "Oct 20, 2024", dealsTotal: 0, dealsMonth: 0, revenue: 0 },
];

const roleColors: Record<string, string> = {
  "Sales Rep": "bg-blue-100 text-blue-700",
  "Branch Manager": "bg-purple-100 text-purple-700",
  "Installer": "bg-orange-100 text-orange-700",
  "Surveyor": "bg-teal-100 text-teal-700",
  "Admin": "bg-red-100 text-red-700",
  "Support": "bg-green-100 text-green-700",
};

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return mockUsers.filter(u => {
      if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
      if (roleFilter !== "all" && u.role.toLowerCase().replace(" ", "_") !== roleFilter) return false;
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      return true;
    });
  }, [search, roleFilter, statusFilter]);

  const totalActive = mockUsers.filter(u => u.status === "active").length;
  const totalDeals = mockUsers.reduce((s, u) => s + u.dealsMonth, 0);
  const totalRevenue = mockUsers.reduce((s, u) => s + u.revenue, 0);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F3A]">Users & Team</h1>
          <p className="text-sm text-gray-500">Manage portal users, roles, and performance</p>
        </div>
        <button className="px-4 py-2 bg-[#007A67] text-white text-sm font-medium rounded-lg hover:bg-[#006655]">+ Invite User</button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Active Users", value: totalActive, icon: Users, color: "text-green-600" },
          { label: "Total Users", value: mockUsers.length, icon: User, color: "text-[#0B1F3A]" },
          { label: "Deals This Month", value: totalDeals, icon: TrendingUp, color: "text-blue-600" },
          { label: "Total Revenue", value: `$${(totalRevenue / 1000000).toFixed(1)}M`, icon: Award, color: "text-amber-600" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <p className="text-2xl font-bold text-[#0B1F3A]">{kpi.value}</p>
            <p className="text-xs text-gray-500">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007A67]/20 focus:border-[#007A67]" />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none">
          <option value="all">All Roles</option>
          <option value="sales_rep">Sales Rep</option>
          <option value="branch_manager">Branch Manager</option>
          <option value="installer">Installer</option>
          <option value="surveyor">Surveyor</option>
          <option value="admin">Admin</option>
          <option value="support">Support</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-gray-500 font-medium">User</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Role</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Branch</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Deals (Mo)</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Revenue</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Last Active</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#0B1F3A] flex items-center justify-center text-white text-xs font-bold">
                      {u.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium text-[#0B1F3A]">{u.name}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[u.role] || "bg-gray-100 text-gray-600"}`}>{u.role}</span></td>
                <td className="px-4 py-3 text-gray-600"><div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-gray-400" /> {u.branch}</div></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${u.status === "active" ? "bg-green-500" : u.status === "inactive" ? "bg-gray-400" : "bg-yellow-500"}`} />
                    <span className="text-gray-600 capitalize">{u.status}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600 font-medium">{u.dealsMonth > 0 ? u.dealsMonth : "—"}</td>
                <td className="px-4 py-3 text-gray-600 font-medium">{u.revenue > 0 ? `$${(u.revenue / 1000).toFixed(0)}K` : "—"}</td>
                <td className="px-4 py-3 text-xs text-gray-400">{u.lastActive}</td>
                <td className="px-4 py-3"><button className="text-gray-400 hover:text-gray-600"><MoreHorizontal className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 bg-gray-50 text-xs text-gray-500 flex items-center justify-between">
          <span>Showing {filtered.length} of {mockUsers.length} users</span>
        </div>
      </div>
    </div>
  );
}
