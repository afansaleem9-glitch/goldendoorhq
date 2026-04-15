"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, Users, Handshake, CheckSquare,
  Ticket, BarChart3, Settings, Search, Bell, Sun, Mail,
  Calendar, FileSignature, Activity, DollarSign,
  HelpCircle, Dna, ChevronDown, Calculator, FileSpreadsheet,
  UserCheck, Plug, Phone, GitBranch, Zap, FileText,
  TrendingUp, BookOpen, SlidersHorizontal, ShoppingCart, X,
  Shield, Home, Wifi, Target, PenTool, Headphones, Globe,
  Database, RefreshCw, LinkIcon, Radio, MapPin, Wrench, Monitor, Package, ClipboardCheck, LogOut
} from "lucide-react";

const primaryNav = [
  { href: "/customers", label: "Customer DNA", icon: Dna },
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/deals", label: "Deals", icon: Handshake },
  { href: "/contacts", label: "Contacts", icon: Users },
  { href: "/solar", label: "Solar", icon: Sun },
  { href: "/security", label: "Security", icon: Shield },
  { href: "/roofing", label: "Roofing", icon: Home },
  { href: "/att", label: "AT&T", icon: Wifi },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/commerce", label: "Commerce", icon: ShoppingCart },
];

const solarSubNav = [
  { href: "/solar", label: "Command Center" },
  { href: "/solar/proposals", label: "Proposals" },
  { href: "/solar/system-design", label: "System Design" },
  { href: "/solar/financing", label: "Financing" },
  { href: "/solar/utility-rates", label: "Utility Rates" },
  { href: "/solar/interconnection", label: "Interconnection" },
  { href: "/solar/production-monitoring", label: "Production Monitoring" },
  { href: "/solar/battery-storage", label: "Battery Storage" },
  { href: "/solar/incentives", label: "Incentives" },
  { href: "/solar/installer-portal", label: "Installer Portal" },
  { href: "/solar/customer-portal", label: "Customer Portal" },
  { href: "/solar/inventory", label: "Inventory" },
  { href: "/solar/permits", label: "Permits" },
];

const securitySubNav = [
  { href: "/security", label: "Command Center" },
  { href: "/security/system-designer", label: "System Designer" },
  { href: "/security/monitoring-contracts", label: "Monitoring Contracts" },
  { href: "/security/video-verification", label: "Video Verification" },
  { href: "/security/competitor-takeover", label: "Competitor Takeover" },
  { href: "/security/customer-portal", label: "Customer Portal" },
  { href: "/security/alarm-com", label: "Alarm.com" },
  { href: "/security/site-surveys", label: "Site Surveys" },
  { href: "/security/activation-tracker", label: "Activation Tracker" },
  { href: "/security/warranty-claims", label: "Warranty Claims" },
  { href: "/security/recurring-revenue", label: "Recurring Revenue" },
];

const roofingSubNav = [
  { href: "/roofing", label: "Command Center" },
  { href: "/roofing/leads", label: "Leads & CRM" },
  { href: "/roofing/estimates", label: "Estimates" },
  { href: "/roofing/production", label: "Production" },
  { href: "/roofing/insurance-claims", label: "Insurance Claims" },
  { href: "/roofing/scheduling", label: "Scheduling" },
  { href: "/roofing/job-costing", label: "Job Costing" },
  { href: "/roofing/aerial-measurements", label: "Aerial Measurements" },
  { href: "/roofing/material-ordering", label: "Material Ordering" },
  { href: "/roofing/smart-docs", label: "SmartDocs" },
  { href: "/roofing/photos", label: "Photos & Media" },
  { href: "/roofing/customer-portal", label: "Customer Portal" },
  { href: "/roofing/text-messaging", label: "Text Messaging" },
  { href: "/roofing/crew-app", label: "Crew App" },
  { href: "/roofing/accupay", label: "AccuPay Payments" },
  { href: "/roofing/reports-plus", label: "ReportsPlus" },
  { href: "/roofing/datamart", label: "DataMart" },
  { href: "/roofing/commissions", label: "Commissions" },
  { href: "/roofing/financing", label: "Financing" },
  { href: "/roofing/permits", label: "Permits" },
  { href: "/roofing/weather-alerts", label: "Weather Alerts" },
  { href: "/roofing/integrations", label: "Integrations" },
];

const attSubNav = [
  { href: "/att", label: "Command Center" },
  { href: "/att/orders", label: "Orders" },
  { href: "/att/commissions", label: "Commissions" },
  { href: "/att/territories", label: "Territories" },
  { href: "/att/activations", label: "Activations" },
  { href: "/att/availability", label: "Availability" },
  { href: "/att/quality", label: "Quality" },
  { href: "/att/compliance", label: "Compliance" },
  { href: "/att/retention", label: "Retention" },
  { href: "/att/training", label: "Training" },
  { href: "/att/reporting", label: "Reporting" },
];

const hubsNav = [
  { href: "/marketing", label: "Marketing Hub", icon: Mail },
  { href: "/marketing/campaigns", label: "Campaigns", icon: Mail },
  { href: "/marketing/automation", label: "Automation", icon: Zap },
  { href: "/marketing/forms-builder", label: "Forms", icon: FileText },
  { href: "/marketing/analytics", label: "Marketing Analytics", icon: BarChart3 },
  { href: "/sales-hub/pipeline", label: "Pipeline", icon: Target },
  { href: "/sales-hub/sequences", label: "Sequences", icon: Zap },
  { href: "/sales-hub/meetings", label: "Meetings", icon: Calendar },
  { href: "/sales-hub/forecasting", label: "Forecasting", icon: TrendingUp },
  { href: "/service-hub/tickets", label: "Tickets", icon: Ticket },
  { href: "/service-hub/knowledge-base", label: "Knowledge Base", icon: BookOpen },
  { href: "/service-hub/surveys", label: "Surveys", icon: CheckSquare },
  { href: "/content-hub/blog", label: "Blog", icon: PenTool },
  { href: "/content-hub/landing-pages", label: "Landing Pages", icon: Globe },
  { href: "/content-hub/seo", label: "SEO", icon: TrendingUp },
  { href: "/data-hub", label: "Data Hub", icon: Database },
  { href: "/data-hub/data-sync", label: "Data Sync", icon: RefreshCw },
  { href: "/data-hub/data-quality", label: "Data Quality", icon: Shield },
  { href: "/data-hub/automation", label: "Programmable Automation", icon: Zap },
  { href: "/commerce-hub", label: "Commerce Hub", icon: ShoppingCart },
  { href: "/commerce-hub/invoices", label: "Invoices", icon: FileText },
  { href: "/commerce-hub/payment-links", label: "Payment Links", icon: LinkIcon },
  { href: "/commerce-hub/subscriptions", label: "Subscriptions", icon: RefreshCw },
  { href: "/commerce-hub/quotes", label: "Quotes / CPQ", icon: Calculator },
];

const secondaryNav = [
  { href: "/scheduling", label: "Scheduling", icon: Calendar },
  { href: "/contracts", label: "Contracts", icon: FileSignature },
  { href: "/monitoring", label: "Monitoring", icon: Activity },
  { href: "/calling", label: "Calling Center", icon: Phone },
  { href: "/workflows", label: "Workflows", icon: GitBranch },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/accounting", label: "Accounting", icon: DollarSign },
  { href: "/portal/users", label: "Users", icon: UserCheck },
  { href: "/portal/calculator", label: "Calculator", icon: Calculator },
  { href: "/portal/adders", label: "Adders", icon: FileSpreadsheet },
  { href: "/integrations", label: "Integrations", icon: Plug },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help", icon: HelpCircle },
];

const allNav = [...primaryNav, ...hubsNav, ...secondaryNav];

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showMore, setShowMore] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const barInputRef = useRef<HTMLInputElement>(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Filter navigation items based on search
  const searchResults = searchQuery.trim()
    ? allNav.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : allNav;

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus search input when modal opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  const navigateTo = (href: string) => {
    router.push(href);
    setSearchOpen(false);
    setSearchQuery("");
    setShowMore(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black h-[56px] flex items-center px-5 shadow-sm">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2.5 mr-6 shrink-0 group">
          <div className="relative shrink-0 w-[38px] h-[48px]">
            <div className="absolute inset-0 rounded-full bg-[#FFD700]/10 blur-lg animate-pulse" />
            <Image
              src="/golden-door-logo.svg"
              alt="GoldenDoor"
              width={38}
              height={48}
              className="relative z-10 drop-shadow-[0_0_8px_rgba(255,215,0,0.4)] group-hover:drop-shadow-[0_0_14px_rgba(255,215,0,0.6)] transition-all duration-500"
              priority
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-extrabold text-[15px] tracking-[0.10em] bg-gradient-to-r from-[#996515] via-[#FFE44D] to-[#996515] bg-clip-text text-transparent" style={{textShadow:"none"}}>GOLDEN DOOR</span>
            <span className="text-[#DAA520]/40 text-[7.5px] font-semibold tracking-[0.25em] uppercase mt-0.5">Delta Power Group</span>
          </div>
        </Link>

        {/* Primary Nav */}
        <nav className="flex items-center gap-0.5 overflow-x-auto hide-scrollbar" role="navigation" aria-label="Primary navigation">
          {primaryNav.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[12px] font-medium transition-all whitespace-nowrap ${
                  active
                    ? "text-white bg-white/15"
                    : "text-white/60 hover:text-white hover:bg-white/8"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={14} strokeWidth={active ? 2.5 : 2} />
                <span className="hidden xl:inline">{item.label}</span>
              </Link>
            );
          })}

          {/* More button (just the trigger — dropdown renders outside overflow container) */}
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded text-[12px] font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all"
            aria-expanded={showMore}
            aria-haspopup="true"
          >
            <span className="hidden xl:inline">More</span>
            <ChevronDown size={14} className={`transition-transform ${showMore ? "rotate-180" : ""}`} />
          </button>
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search — now opens command palette */}
        <div
          className="hidden md:flex items-center rounded-lg px-3 py-1.5 mr-3 bg-white/8 w-48 hover:bg-white/12 cursor-pointer transition-all"
          onClick={() => setSearchOpen(true)}
        >
          <Search size={14} className="text-white/40 mr-2 shrink-0" />
          <span className="text-white/40 text-[12px]">Search...</span>
          <kbd className="hidden lg:inline text-[10px] text-white/30 bg-white/10 px-1.5 py-0.5 rounded font-mono ml-auto shrink-0">⌘K</kbd>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="relative text-white/60 hover:text-white transition-colors p-1.5 rounded hover:bg-white/8" aria-label="Notifications">
            <Bell size={17} />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">3</span>
          </button>
          <div className="w-[1px] h-5 bg-white/15 mx-1" />
          <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors p-1 rounded hover:bg-white/8" aria-label="User menu">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
              <span className="text-black text-[11px] font-bold">AS</span>
            </div>
          </button>
          <Link
            href="/documents"
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-[12px] font-medium transition-all ${
              isActive("/documents") ? "text-white bg-white/15" : "text-white/60 hover:text-white hover:bg-white/8"
            }`}
            aria-current={isActive("/documents") ? "page" : undefined}
            title="Documents"
          >
            <FileText size={14} />
            <span className="hidden xl:inline">Documents</span>
          </Link>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-1 text-white/60 hover:text-white transition-colors p-1.5 rounded hover:bg-white/8"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </form>
        </div>
      </header>

      {/* More Dropdown — rendered OUTSIDE the overflow container so it doesn't get clipped */}
      {showMore && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setShowMore(false)} />
          <div className="fixed top-[56px] right-[200px] w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-[70] max-h-[70vh] overflow-auto" role="menu">
            <div className="px-3 py-1.5 text-[10px] font-bold text-[#F0A500] uppercase tracking-wider border-b border-gray-100">Solar CRM</div>
            {solarSubNav.map(item => {
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href} onClick={() => setShowMore(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 text-[13px] transition-all ${active ? "text-black font-semibold bg-gray-50" : "text-gray-600 hover:text-black hover:bg-gray-50"}`} role="menuitem">
                  <Sun size={13} className="text-[#F0A500]" />
                  {item.label}
                </Link>
              );
            })}
            <div className="border-t border-gray-100 my-1" />
            <div className="px-3 py-1.5 text-[10px] font-bold text-purple-500 uppercase tracking-wider">Security CRM</div>
            {securitySubNav.map(item => (
              <Link key={item.href} href={item.href} onClick={() => setShowMore(false)} className={`flex items-center gap-2.5 px-3 py-2 text-[13px] transition-all ${isActive(item.href) ? "text-black font-semibold bg-gray-50" : "text-gray-600 hover:text-black hover:bg-gray-50"}`} role="menuitem"><Shield size={13} className="text-purple-500" />{item.label}</Link>
            ))}
            <div className="border-t border-gray-100 my-1" />
            <div className="px-3 py-1.5 text-[10px] font-bold text-amber-600 uppercase tracking-wider">Roofing CRM</div>
            {roofingSubNav.map(item => (
              <Link key={item.href} href={item.href} onClick={() => setShowMore(false)} className={`flex items-center gap-2.5 px-3 py-2 text-[13px] transition-all ${isActive(item.href) ? "text-black font-semibold bg-gray-50" : "text-gray-600 hover:text-black hover:bg-gray-50"}`} role="menuitem"><Home size={13} className="text-amber-600" />{item.label}</Link>
            ))}
            <div className="border-t border-gray-100 my-1" />
            <div className="px-3 py-1.5 text-[10px] font-bold text-blue-600 uppercase tracking-wider">AT&T CRM</div>
            {attSubNav.map(item => (
              <Link key={item.href} href={item.href} onClick={() => setShowMore(false)} className={`flex items-center gap-2.5 px-3 py-2 text-[13px] transition-all ${isActive(item.href) ? "text-black font-semibold bg-gray-50" : "text-gray-600 hover:text-black hover:bg-gray-50"}`} role="menuitem"><Wifi size={13} className="text-blue-600" />{item.label}</Link>
            ))}
            <div className="border-t border-gray-100 my-1" />
            <div className="px-3 py-1.5 text-[10px] font-bold text-teal-600 uppercase tracking-wider">Hubs</div>
            {hubsNav.map(item => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} onClick={() => setShowMore(false)} className={`flex items-center gap-2.5 px-3 py-2 text-[13px] transition-all ${isActive(item.href) ? "text-black font-semibold bg-gray-50" : "text-gray-600 hover:text-black hover:bg-gray-50"}`} role="menuitem"><Icon size={13} className="text-teal-600" />{item.label}</Link>
              );
            })}
            <div className="border-t border-gray-100 my-1" />
            <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tools</div>
            {secondaryNav.map(item => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMore(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 text-[13px] transition-all ${
                    active ? "text-black font-semibold bg-gray-50" : "text-gray-600 hover:text-black hover:bg-gray-50"
                  }`}
                  role="menuitem"
                >
                  <Icon size={15} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </>
      )}

      {/* Command Palette / Search Modal */}
      {searchOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80]" onClick={() => { setSearchOpen(false); setSearchQuery(""); }} />
          <div className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-lg bg-white rounded-xl shadow-2xl z-[90] overflow-hidden">
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
              <Search size={18} className="text-gray-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search pages, contacts, deals..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && searchResults.length > 0) {
                    navigateTo(searchResults[0].href);
                  }
                }}
                className="flex-1 text-[15px] text-black outline-none placeholder-gray-400"
              />
              <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="text-gray-400 hover:text-black">
                <X size={18} />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-auto py-2">
              {searchQuery.trim() === "" && (
                <p className="px-4 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Quick Navigation</p>
              )}
              {searchResults.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-gray-400">No results for &ldquo;{searchQuery}&rdquo;</p>
                </div>
              ) : (
                searchResults.map(item => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <button
                      key={item.href}
                      onClick={() => navigateTo(item.href)}
                      className={`flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors ${
                        active ? "bg-gray-50" : ""
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <Icon size={16} className="text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[13px] font-semibold text-black">{item.label}</p>
                        <p className="text-[11px] text-gray-400">{item.href}</p>
                      </div>
                      {active && <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Current</span>}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-4 py-2 flex items-center gap-4 text-[11px] text-gray-400">
              <span className="flex items-center gap-1"><kbd className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">↵</kbd> Navigate</span>
              <span className="flex items-center gap-1"><kbd className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">Esc</kbd> Close</span>
            </div>
          </div>
        </>
      )}

      {/* Spacer for fixed header */}
      <div className="h-[56px]" />
    </>
  );
}
