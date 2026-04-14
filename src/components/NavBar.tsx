"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Building2, Handshake, CheckSquare,
  Ticket, BarChart3, Settings, Search, Bell, User, Sun, Mail,
  Calendar, FileSignature, Activity, DollarSign, Package, Plug,
  Workflow, Globe, Zap, Wrench, HelpCircle, Dna
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/customers", label: "Customer DNA", icon: Dna, highlight: true },
  { href: "/contacts", label: "Contacts", icon: Users },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/deals", label: "Deals", icon: Handshake },
  { href: "/solar", label: "Solar", icon: Sun },
  { href: "/scheduling", label: "Scheduling", icon: Calendar },
  { href: "/contracts", label: "Contracts", icon: FileSignature },
  { href: "/monitoring", label: "Monitoring", icon: Activity },
  { href: "/accounting", label: "Accounting", icon: DollarSign },
  { href: "/catalog", label: "Catalog", icon: Package },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/tickets", label: "Tickets", icon: Ticket },
  { href: "/marketing", label: "Marketing", icon: Mail },
  { href: "/workflows", label: "Workflows", icon: Workflow },
  { href: "/integrations", label: "Integrations", icon: Plug },
  { href: "/portal", label: "Portal", icon: Globe },
  { href: "/rep-portal", label: "Rep Portal", icon: Zap },
  { href: "/tech-portal", label: "Tech Portal", icon: Wrench },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help", icon: HelpCircle },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B1F3A] h-[60px] flex items-center px-4 shadow-lg">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mr-8 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-[#F0A500] flex items-center justify-center">
          <span className="text-[#0B1F3A] font-bold text-sm">GD</span>
        </div>
        <span className="text-white font-bold text-lg hidden md:block">GoldenDoor</span>
      </Link>

      {/* Nav Items */}
      <nav className="flex items-center gap-1 overflow-x-auto hide-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          const isHighlight = "highlight" in item && item.highlight;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? "text-[#F0A500] bg-white/10"
                  : isHighlight
                  ? "text-[#F0A500] hover:text-[#F0A500] hover:bg-white/10"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={16} />
              <span className="hidden lg:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="hidden md:flex items-center bg-white/10 rounded-lg px-3 py-1.5 mr-4 w-64">
        <Search size={16} className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search CRM..."
          className="bg-transparent text-white text-sm placeholder-gray-400 outline-none w-full"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button className="text-gray-300 hover:text-white transition-colors relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">3</span>
        </button>
        <div className="w-8 h-8 rounded-full bg-[#F0A500] flex items-center justify-center cursor-pointer">
          <User size={16} className="text-[#0B1F3A]" />
        </div>
      </div>
    </header>
  );
}
