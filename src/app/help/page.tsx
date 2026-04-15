"use client";
import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Users, Building2, Handshake, Sun, Calendar,
  FileSignature, Activity, DollarSign, Package, CheckSquare,
  Ticket, Mail, Workflow, Plug, Globe, Zap, Wrench, BarChart3,
  Settings, ChevronRight, BookOpen, ArrowLeft, Lightbulb, HelpCircle,
  Monitor, Database, Shield, Code, Layers
} from "lucide-react";

interface ViewManual {
  route: string;
  title: string;
  icon: React.ElementType;
  category: string;
  purpose: string;
  overview: string;
  features: string[];
  dataSource: string;
  userActions: string[];
  tips: string[];
  relatedViews: string[];
}

const manuals: ViewManual[] = [
  {
    route: "/",
    title: "Dashboard",
    icon: LayoutDashboard,
    category: "Core",
    purpose: "Executive command center showing real-time business health.",
    overview: "The Dashboard is your home base. It aggregates data from contacts, deals, tasks, and activities into a single view with KPI cards, pipeline charts, and activity feeds. Designed for quick daily check-ins on business health.",
    features: [
      "KPI Cards — Total Contacts, Active Deals, Pipeline Value, Open Tasks with trend indicators",
      "Pipeline Chart — Recharts bar chart showing deal distribution across stages",
      "Recent Activity Feed — Last 20 actions across the CRM with timestamps and actor info",
      "Quick Action Buttons — One-click access to create contacts, deals, and tasks",
      "Revenue Trend — Monthly line chart showing revenue trajectory",
    ],
    dataSource: "Aggregated from /api/contacts, /api/deals, /api/tasks, /api/activities",
    userActions: [
      "Click any KPI card to navigate to its detail page",
      "Hover over chart elements for detailed tooltips",
      "Use quick action buttons for fast record creation",
      "Scroll the activity feed to review recent changes",
    ],
    tips: [
      "Start every day on the Dashboard to spot issues early",
      "Watch the pipeline chart for bottlenecks in specific stages",
      "Activity feed shows who changed what — great for team accountability",
    ],
    relatedViews: ["/contacts", "/deals", "/tasks"],
  },
  {
    route: "/contacts",
    title: "Contacts",
    icon: Users,
    category: "Core",
    purpose: "Central contact database — every person in Delta's history.",
    overview: "The Contacts page is the heart of the CRM. It displays all leads, customers, and cancelled accounts with search, pagination, and direct access to the Customer DNA 360 view. Every contact has 33 fields including credit data, lifecycle stage, and source tracking.",
    features: [
      "Search Bar — Real-time filtering by name, email, or phone number",
      "Paginated Table — 50 records per page with sortable columns",
      "Clickable Rows — Click any contact to open their full Customer DNA page",
      "Create Button — Inline form for adding new contacts with all 33 fields",
      "Lifecycle Badges — Visual indicators for Lead, Customer, Opportunity, Cancelled",
    ],
    dataSource: "/api/contacts with pagination (?page=1&limit=50) and company joins",
    userActions: [
      "Type in the search bar to find contacts instantly",
      "Click a row to drill into the Customer DNA 360 view",
      "Click '+ New Contact' to create a record",
      "Use pagination to browse large contact lists",
    ],
    tips: [
      "Search works across name, email, and phone simultaneously",
      "The Customer DNA page is where you'll spend most of your time per contact",
      "Lifecycle stage tells you exactly where each person is in the funnel",
    ],
    relatedViews: ["/contacts/[id]", "/companies", "/deals"],
  },
  {
    route: "/contacts/[id]",
    title: "Customer DNA (360 View)",
    icon: Users,
    category: "Core",
    purpose: "Complete lifecycle view — the entire history of a contact in one place.",
    overview: "Customer DNA is the most powerful page in the CRM. It parallel-fetches 10 data sources (contact, deals, tickets, tasks, activities, notes, contracts, solar projects, invoices, payments) and presents them in a unified view with 9 tabs. This is where you see the full story of any person who has ever interacted with Delta.",
    features: [
      "KPI Strip — Deal value, tickets open, customer tenure, total payments at a glance",
      "Contact Sidebar — Full profile: name, email, phone, address, company, lifecycle stage, lead source",
      "Credit/PreQual Section — Credit score, prequal status with date, Equifax and TransUnion data",
      "Key Dates — Created, last activity, first deal, first payment, contract dates",
      "Timeline Tab — Unified chronological feed of ALL events across every data source",
      "Deals Tab — All associated deals with stage, amount, probability, close date",
      "Contracts Tab — Signed documents with status badges and expiration tracking",
      "Solar Tab — Installation projects with system specs, status, production data",
      "Tickets Tab — Support issues with priority, status, assignee tracking",
      "Payments Tab — Complete payment history with amounts, methods, dates",
      "Communications Tab — RingCentral integration for call recordings and SMS/text history",
      "Photos Tab — CompanyCam integration for install photos with timestamps",
      "Reviews Tab — GoldenReviews with one-click review request button",
    ],
    dataSource: "/api/contacts/[id] — Promise.all() parallel fetch of 10 Supabase queries",
    userActions: [
      "Switch between 9 tabs to explore different data dimensions",
      "Click 'Sync Calls' or 'Sync Texts' in Communications to pull RingCentral data",
      "Click 'Request Review' in Reviews tab for one-click GoldenReviews request",
      "Edit contact fields via the edit button in the sidebar",
      "Use the HubSpot sync button to synchronize with external CRM",
    ],
    tips: [
      "The Timeline tab is the best starting point — it shows everything in order",
      "Credit/PreQual data is critical for solar sales qualification",
      "Communications tab is your audit trail for all customer interactions",
      "Photos tab proves installation quality with timestamped evidence",
    ],
    relatedViews: ["/contacts", "/deals", "/contracts", "/solar"],
  },
  {
    route: "/deals",
    title: "Deals",
    icon: Handshake,
    category: "Sales",
    purpose: "Sales pipeline management — track every opportunity to close.",
    overview: "The Deals page shows your entire sales pipeline. Deals are organized by stage with visual cards showing amount, contact, company, and expected close date. Supports full CRUD and stage management.",
    features: [
      "Pipeline Board — Deal cards organized by stage columns",
      "Deal Cards — Amount, contact name, company, close date, probability percentage",
      "Won/Lost Badges — Green for won, red for lost with clear visual indicators",
      "Stage Management — Move deals through pipeline stages",
      "Create Form — Full deal creation with all 31 fields",
    ],
    dataSource: "/api/deals with deal_stages, contacts, and companies joins",
    userActions: [
      "View deals by pipeline stage",
      "Create new deals with the + button",
      "Click deals for detail view",
      "Track win/loss rates across the pipeline",
    ],
    tips: [
      "Review close dates weekly — stale deals need attention",
      "Track probability percentages for accurate forecasting",
      "Link every deal to a contact for full Customer DNA tracking",
    ],
    relatedViews: ["/contacts", "/contracts", "/solar"],
  },
  {
    route: "/companies",
    title: "Companies",
    icon: Building2,
    category: "Core",
    purpose: "Company directory with relationship intelligence.",
    overview: "Manage business accounts and organizations. Each company has 26 fields including industry, size, revenue, and associations with contacts and deals.",
    features: [
      "Company Cards — Logo, name, industry, employee count display",
      "Deal Metrics — Total deals and revenue per company",
      "Contact Associations — All people linked to each company",
      "Search & Filter — Find by name, industry, or location",
    ],
    dataSource: "/api/companies with deal and contact count aggregations",
    userActions: ["Search companies", "Create new companies", "View associated contacts and deals", "Edit company profiles"],
    tips: ["Companies help group contacts by organization", "Revenue per company identifies your highest-value accounts"],
    relatedViews: ["/contacts", "/deals"],
  },
  {
    route: "/contracts",
    title: "Contracts",
    icon: FileSignature,
    category: "Operations",
    purpose: "Contract lifecycle — from draft through signing and tracking.",
    overview: "Manage all customer contracts including HIC agreements, monitoring contracts, solar agreements, and roofing contracts. Template-based creation with status tracking and expiration alerts.",
    features: [
      "Status Tracking — Draft, Sent, Signed, Expired with color badges",
      "Template System — Create from pre-built templates for consistency",
      "Expiration Alerts — Visual warnings for contracts nearing expiration",
      "Document Links — Direct access to signed documents",
      "Contact Association — Every contract links to a customer",
    ],
    dataSource: "/api/contracts with contract_templates joins",
    userActions: ["Create contracts from templates", "Track signing status", "Monitor expiration dates", "Export contract documents"],
    tips: ["Always use templates for compliance consistency", "Set reminders for contracts expiring within 30 days"],
    relatedViews: ["/contacts/[id]", "/deals", "/solar"],
  },
  {
    route: "/solar",
    title: "Solar Projects",
    icon: Sun,
    category: "Verticals",
    purpose: "Complete solar installation pipeline — the most detailed module with 84 fields.",
    overview: "Manage solar projects from initial design through permitting, installation, inspection, and ongoing monitoring. Each project has 84 fields covering system specs, financial details, permit status, inspection results, and production monitoring.",
    features: [
      "Pipeline Stages — Design, Permit, Install, Inspection, Monitoring",
      "System Specs — Panel type, count, inverter, battery, system size (kW/kWh)",
      "Permit Tracking — AHJ, status, submission/approval dates",
      "Timeline View — Project milestones with dates",
      "Change Orders — Track modifications and cost adjustments",
      "Production Monitoring — Integration with Enphase/SolarEdge",
    ],
    dataSource: "/api/solar — 84 columns per project with timeline, documents, change orders",
    userActions: ["Create solar projects", "Update status through pipeline stages", "Track permits and inspections", "Monitor production data"],
    tips: ["84 fields means complete documentation — fill them all", "Timeline view shows the critical path", "Change orders must be tracked for financial accuracy"],
    relatedViews: ["/contacts/[id]", "/scheduling", "/monitoring"],
  },
  {
    route: "/tasks",
    title: "Tasks",
    icon: CheckSquare,
    category: "Productivity",
    purpose: "Action item tracking with priority and assignment.",
    overview: "Manage all tasks across the organization. Tasks have priority levels (high/medium/low), due dates, assignees, and can be linked to contacts and deals for context.",
    features: [
      "Priority Colors — Red (high), Yellow (medium), Green (low)",
      "Status Filters — Open, In Progress, Completed",
      "Due Date Tracking — Overdue tasks highlighted prominently",
      "Contact/Deal Linking — Context for every action item",
    ],
    dataSource: "/api/tasks with contact and assignee joins",
    userActions: ["Create tasks", "Assign to team members", "Set priority and due date", "Mark complete", "Filter by status/priority"],
    tips: ["Address overdue tasks first every morning", "Link tasks to contacts so they appear in Customer DNA"],
    relatedViews: ["/contacts/[id]", "/deals", "/rep-portal"],
  },
  {
    route: "/tickets",
    title: "Tickets",
    icon: Ticket,
    category: "Support",
    purpose: "Customer support ticket management.",
    overview: "Track and resolve customer support issues. Tickets have priority levels, status tracking, assignee management, and are linked to contacts for full context in the Customer DNA view.",
    features: [
      "Priority Badges — Urgent, High, Medium, Low",
      "Status Tracking — Open, In Progress, Resolved, Closed",
      "Assignee Management — Route to the right team member",
      "Contact Association — Full customer context from DNA page",
    ],
    dataSource: "/api/tickets with contact joins",
    userActions: ["Create support tickets", "Assign to team", "Update status", "Resolve and close"],
    tips: ["High-priority tickets should be acknowledged within 1 hour", "Always link to the customer contact for history"],
    relatedViews: ["/contacts/[id]", "/tasks"],
  },
  {
    route: "/scheduling",
    title: "Scheduling",
    icon: Calendar,
    category: "Operations",
    purpose: "Crew calendar and resource management.",
    overview: "Schedule crews for installations, inspections, and service calls. Manage equipment allocation, crew member availability, and time slot assignments.",
    features: [
      "Calendar View — Visual schedule with crew color coding",
      "Equipment Allocation — Track which equipment is assigned where",
      "Crew Assignments — Assign team members to jobs",
      "Availability Overview — See who's free and when",
    ],
    dataSource: "/api/scheduling — crew_members, schedule_entries, crew_assignments tables",
    userActions: ["Create schedule entries", "Assign crews to jobs", "Manage equipment", "View availability"],
    tips: ["Always check crew availability before scheduling", "Equipment conflicts are highlighted automatically"],
    relatedViews: ["/solar", "/tech-portal", "/rep-portal"],
  },
  {
    route: "/accounting",
    title: "Accounting",
    icon: DollarSign,
    category: "Finance",
    purpose: "Financial management — invoices, payments, job costing.",
    overview: "Complete financial visibility into invoices, payments received, and job-level profitability analysis. Tracks the financial lifecycle of every project.",
    features: [
      "Invoice Management — Create, send, and track invoice status",
      "Payment Recording — Log payments with method and amount",
      "Job Costing — Per-project profitability breakdown",
      "Revenue Dashboard — Trends and summaries",
    ],
    dataSource: "/api/accounting — invoices, invoice_line_items, payments, job_costing tables",
    userActions: ["Create invoices", "Record payments", "Analyze job costs", "Export financial reports"],
    tips: ["Review overdue invoices daily", "Job costing reveals which project types are most profitable"],
    relatedViews: ["/contacts/[id]", "/solar", "/contracts"],
  },
  {
    route: "/catalog",
    title: "Product Catalog",
    icon: Package,
    category: "Operations",
    purpose: "Equipment and materials management with tiered pricing.",
    overview: "Manage all equipment, materials, and pricing across Delta's three verticals. Includes price books for different customer tiers and material order tracking.",
    features: [
      "Equipment Catalog — Full specs and pricing for all products",
      "Price Books — Tiered pricing for different customer segments",
      "Material Orders — Track orders from placement to delivery",
      "Inventory Tracking — Stock levels and reorder alerts",
    ],
    dataSource: "/api/catalog — equipment_catalog, price_book_entries, material_orders tables",
    userActions: ["Add equipment", "Manage price books", "Create material orders", "Track inventory"],
    tips: ["Keep price books current for accurate proposals", "Track material lead times to avoid project delays"],
    relatedViews: ["/solar", "/contracts", "/accounting"],
  },
  {
    route: "/marketing",
    title: "Marketing",
    icon: Mail,
    category: "Growth",
    purpose: "Email campaigns, contact lists, and automated sequences.",
    overview: "Run email marketing campaigns, manage segmented contact lists, and build automated follow-up sequences. Track open rates, click rates, and conversion metrics.",
    features: [
      "Campaign Management — Create and send email campaigns",
      "Contact Lists — Segmented lists with member counts",
      "Sequences — Automated multi-step follow-up workflows",
      "Analytics — Open, click, bounce, and unsubscribe tracking",
    ],
    dataSource: "/api/marketing — email_campaigns, contact_lists, sequences, email_sends tables",
    userActions: ["Create campaigns", "Build contact lists", "Set up sequences", "View analytics"],
    tips: ["Segment lists for 2-3x better engagement", "Sequences automate your follow-up — set them and focus on closing"],
    relatedViews: ["/contacts", "/workflows"],
  },
  {
    route: "/monitoring",
    title: "Monitoring",
    icon: Activity,
    category: "Operations",
    purpose: "Installed system health tracking and alert management.",
    overview: "Monitor all installed solar, alarm, and smart home systems. Track system health, manage alerts, and review performance readings with trend analysis.",
    features: [
      "Health Dashboard — System status indicators (green/yellow/red)",
      "Alert Management — Severity levels with acknowledgment tracking",
      "Performance Readings — Energy production, system metrics, trends",
      "Trend Charts — Identify degrading systems before they fail",
    ],
    dataSource: "/api/monitoring — monitored_systems, system_alerts, system_readings tables",
    userActions: ["View system health", "Acknowledge alerts", "Review performance", "Generate reports"],
    tips: ["Critical alerts need same-day response", "Trend charts catch issues before customers notice"],
    relatedViews: ["/solar", "/tickets", "/tech-portal"],
  },
  {
    route: "/workflows",
    title: "Workflows",
    icon: Workflow,
    category: "Automation",
    purpose: "Business process automation with triggers and actions.",
    overview: "Build automated workflows that trigger on events (new deal, contact created, etc.) and execute actions (send email, create task, update record). Monitor enrollment rates and errors.",
    features: [
      "Workflow Builder — Configure triggers and actions",
      "Status Management — Active, Paused, Draft states",
      "Enrollment Tracking — See how many records flow through",
      "Error Monitoring — Catch and fix automation failures",
    ],
    dataSource: "/api/workflows — workflows table with trigger_config and status tracking",
    userActions: ["Create workflows", "Configure triggers", "Set actions", "Activate/pause", "Monitor errors"],
    tips: ["Start simple — one trigger, one action", "Monitor error rates weekly", "Pausing doesn't lose enrolled records"],
    relatedViews: ["/integrations", "/marketing", "/tasks"],
  },
  {
    route: "/integrations",
    title: "Integrations",
    icon: Plug,
    category: "Platform",
    purpose: "Connected app management and sync monitoring.",
    overview: "View and manage all external service connections — HubSpot, RingCentral, CompanyCam, SiteCapture, SubcontractorHub, and more. Monitor sync status and troubleshoot issues.",
    features: [
      "Connection Cards — Status indicator for each integration",
      "Sync Timestamps — When each service last synced",
      "Error/Success Logs — Troubleshoot failed syncs",
      "Configuration — API keys and connection settings",
    ],
    dataSource: "/api/integrations — integration_connections, integration_logs tables",
    userActions: ["View connection status", "Configure integrations", "Review sync logs", "Troubleshoot errors"],
    tips: ["Check sync timestamps daily — stale data means broken connections", "Error logs reveal exactly what failed and why"],
    relatedViews: ["/contacts/[id]", "/workflows"],
  },
  {
    route: "/portal",
    title: "Customer Portal",
    icon: Globe,
    category: "Customer-Facing",
    purpose: "Self-service portal for customers to track their projects.",
    overview: "Customer-facing view where homeowners can check project status, access signed documents, view payment history, and communicate with the Delta team.",
    features: [
      "Project Status — Real-time progress updates",
      "Document Access — Signed contracts and permits",
      "Payment History — All transactions visible",
      "Communication — Message Delta team directly",
    ],
    dataSource: "Filtered views of contacts, solar_projects, contracts, payments",
    userActions: ["Check project status", "Download documents", "View payments", "Send messages"],
    tips: ["Share portal links with customers to reduce support calls"],
    relatedViews: ["/contacts/[id]", "/solar", "/contracts"],
  },
  {
    route: "/rep-portal",
    title: "Rep Portal",
    icon: Zap,
    category: "Role-Based",
    purpose: "Personal sales rep dashboard with KPIs and pipeline.",
    overview: "Filtered view showing only the logged-in rep's data. Personal KPIs, pipeline, tasks, solar projects, schedule, and commission tracking all in one place.",
    features: [
      "Personal KPIs — My Deals, Pipeline Value, Won Revenue, Pending Tasks",
      "Pipeline Tab — Deals assigned to you, sorted by stage",
      "Tasks Tab — Your action items with due dates",
      "Solar Tab — Your solar projects with status",
      "Schedule Tab — Your upcoming appointments",
      "Commissions Tab — Earnings tracking and projections",
    ],
    dataSource: "/api/deals, /api/tasks, /api/solar, /api/scheduling (filtered by rep)",
    userActions: ["View personal pipeline", "Manage tasks", "Track commissions", "Check schedule"],
    tips: ["Check pipeline and tasks every morning", "Commission tracking updates in real-time as deals close"],
    relatedViews: ["/deals", "/tasks", "/scheduling"],
  },
  {
    route: "/tech-portal",
    title: "Tech Portal",
    icon: Wrench,
    category: "Role-Based",
    purpose: "Field technician dashboard for job management.",
    overview: "Everything a technician needs in the field — today's job schedule, inspection checklists with pre-install/install/post-install sections, photo upload via CompanyCam, and document access for permits.",
    features: [
      "Today's Jobs — Addresses, project details, customer info",
      "Inspection Checklists — Pre-Install (site survey, panel, permits), Installation (mounting, panels, inverter, wiring), Post-Install (testing, monitoring, cleanup, walkthrough)",
      "Photo Upload — CompanyCam integration for documenting work",
      "Documents — Access permits, plans, and project files",
    ],
    dataSource: "/api/scheduling, /api/solar, /api/contracts (filtered by tech)",
    userActions: ["View today's schedule", "Complete inspection checklists", "Upload photos", "Access documents"],
    tips: ["Complete ALL checklist items before marking a job done", "Upload photos at each installation stage for records", "Review permits before starting any work"],
    relatedViews: ["/scheduling", "/solar", "/monitoring"],
  },
  {
    route: "/reports",
    title: "Reports",
    icon: BarChart3,
    category: "Analytics",
    purpose: "Comprehensive reporting and data export.",
    overview: "Generate reports across all CRM modules with date range filtering, module selection, and export capabilities.",
    features: [
      "Module Selection — Reports for contacts, deals, solar, finance, etc.",
      "Date Range Filters — Custom period analysis",
      "Export Options — CSV and PDF downloads",
      "Report Templates — Pre-built reports for common needs",
    ],
    dataSource: "Aggregated from all API endpoints based on selected module",
    userActions: ["Select report type", "Set date range", "Apply filters", "Export data"],
    tips: ["Compare month-over-month for trend analysis", "Export to PDF for stakeholder presentations"],
    relatedViews: ["/", "/deals", "/accounting"],
  },
  {
    route: "/settings",
    title: "Settings",
    icon: Settings,
    category: "Platform",
    purpose: "Organization configuration and user management.",
    overview: "Configure organization profile, manage user roles and permissions, handle API keys, and set notification preferences.",
    features: [
      "Organization Profile — Company name, domain, logo, plan",
      "User Management — Roles (admin, manager, rep, tech) and permissions",
      "API Keys — View and manage integration credentials",
      "Notifications — Email and in-app alert preferences",
    ],
    dataSource: "organizations and user_profiles tables",
    userActions: ["Update org profile", "Manage users", "Configure API keys", "Set notifications"],
    tips: ["Only admins should access Settings", "Rotate API keys quarterly for security"],
    relatedViews: ["/integrations", "/workflows"],
  },
];

const categories = ["All", "Core", "Sales", "Operations", "Verticals", "Productivity", "Support", "Finance", "Growth", "Automation", "Platform", "Role-Based", "Analytics", "Customer-Facing"];

export default function HelpPage() {
  const [selected, setSelected] = useState<ViewManual | null>(null);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = manuals.filter((m) => {
    const matchCat = category === "All" || m.category === category;
    const matchSearch = !search || m.title.toLowerCase().includes(search.toLowerCase()) || m.purpose.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (selected) {
    const Icon = selected.icon;
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-[#007A67] hover:text-[#005A4C] mb-6 font-medium">
          <ArrowLeft size={18} /> Back to Help Center
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-[#0B1F3A] p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-[#F0A500] flex items-center justify-center">
                <Icon size={22} className="text-[#0B1F3A]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{selected.title}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded bg-[#007A67] text-white">{selected.category}</span>
                  <code className="text-xs text-gray-500">{selected.route}</code>
                </div>
              </div>
            </div>
            <p className="text-gray-300 mt-3">{selected.purpose}</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Overview */}
            <section>
              <h2 className="text-lg font-bold text-[#0B1F3A] flex items-center gap-2 mb-3">
                <BookOpen size={18} className="text-[#007A67]" /> Overview
              </h2>
              <p className="text-gray-700 leading-relaxed">{selected.overview}</p>
            </section>

            {/* Features */}
            <section>
              <h2 className="text-lg font-bold text-[#0B1F3A] flex items-center gap-2 mb-3">
                <Layers size={18} className="text-[#007A67]" /> Features
              </h2>
              <div className="space-y-2">
                {selected.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 bg-gray-50 rounded-lg p-3">
                    <ChevronRight size={16} className="text-[#F0A500] mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-700">{f}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Data Source */}
            <section>
              <h2 className="text-lg font-bold text-[#0B1F3A] flex items-center gap-2 mb-3">
                <Database size={18} className="text-[#007A67]" /> Data Source
              </h2>
              <div className="bg-gray-900 text-green-400 rounded-lg p-3 font-mono text-sm">
                {selected.dataSource}
              </div>
            </section>

            {/* User Actions */}
            <section>
              <h2 className="text-lg font-bold text-[#0B1F3A] flex items-center gap-2 mb-3">
                <Monitor size={18} className="text-[#007A67]" /> What You Can Do
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selected.userActions.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 bg-[#0B1F3A]/5 rounded-lg p-3">
                    <div className="w-6 h-6 rounded-full bg-[#007A67] text-white flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                    <span className="text-sm text-gray-700">{a}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Tips */}
            <section>
              <h2 className="text-lg font-bold text-[#0B1F3A] flex items-center gap-2 mb-3">
                <Lightbulb size={18} className="text-[#F0A500]" /> Pro Tips
              </h2>
              <div className="space-y-2">
                {selected.tips.map((t, i) => (
                  <div key={i} className="flex items-start gap-2 bg-[#F0A500]/10 rounded-lg p-3 border border-[#F0A500]/20">
                    <span className="text-[#F0A500]">💡</span>
                    <span className="text-sm text-gray-700">{t}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Related Views */}
            <section>
              <h2 className="text-lg font-bold text-[#0B1F3A] flex items-center gap-2 mb-3">
                <Plug size={18} className="text-[#007A67]" /> Related Views
              </h2>
              <div className="flex flex-wrap gap-2">
                {selected.relatedViews.map((rv) => {
                  const related = manuals.find((m) => m.route === rv);
                  return (
                    <button
                      key={rv}
                      onClick={() => { const r = manuals.find((m) => m.route === rv); if (r) setSelected(r); }}
                      className="px-3 py-1.5 rounded-lg bg-[#0B1F3A]/10 text-[#0B1F3A] text-sm font-medium hover:bg-[#0B1F3A]/20 transition-colors"
                    >
                      {related?.title || rv}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Go to page */}
            <div className="pt-4 border-t border-gray-200">
              <Link
                href={selected.route.includes("[id]") ? "/contacts" : selected.route}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#007A67] text-white rounded-lg hover:bg-[#005A4C] transition-colors font-medium"
              >
                Go to {selected.title} <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-[#F0A500] flex items-center justify-center">
            <HelpCircle size={22} className="text-[#0B1F3A]" />
          </div>
          <h1 className="text-2xl font-bold text-[#0B1F3A]">Help Center & Documentation</h1>
        </div>
        <p className="text-gray-600 mt-1">Complete manuals for every view in GoldenDoor CRM. Click any card for the full guide.</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <HelpCircle size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documentation..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F0A500] focus:ring-1 focus:ring-[#F0A500]"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.filter(c => c === "All" || manuals.some(m => m.category === c)).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                category === cat
                  ? "bg-[#0B1F3A] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="text-2xl font-bold text-[#0B1F3A]">{manuals.length}</div>
          <div className="text-xs text-gray-500">Views Documented</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="text-2xl font-bold text-[#007A67]">17</div>
          <div className="text-xs text-gray-500">API Endpoints</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="text-2xl font-bold text-[#F0A500]">44</div>
          <div className="text-xs text-gray-500">Database Tables</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="text-2xl font-bold text-[#7C5CBF]">19</div>
          <div className="text-xs text-gray-500">Integrations</div>
        </div>
      </div>

      {/* Manual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((manual) => {
          const Icon = manual.icon;
          return (
            <button
              key={manual.route}
              onClick={() => setSelected(manual)}
              className="bg-white rounded-xl border border-gray-200 p-5 text-left hover:shadow-md hover:border-[#F0A500]/50 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-[#0B1F3A]/10 flex items-center justify-center group-hover:bg-[#F0A500]/20 transition-colors">
                  <Icon size={18} className="text-[#0B1F3A]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0B1F3A] text-sm">{manual.title}</h3>
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{manual.category}</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">{manual.purpose}</p>
              <div className="flex items-center justify-between">
                <code className="text-[11px] text-gray-500">{manual.route}</code>
                <ChevronRight size={14} className="text-gray-500 group-hover:text-[#F0A500] transition-colors" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Architecture Overview */}
      <div className="mt-10 bg-[#0B1F3A] rounded-xl p-6 text-white">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Code size={20} className="text-[#F0A500]" /> Technical Architecture
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="text-[#F0A500] font-bold mb-2">Frontend Stack</h3>
            <p className="text-gray-300">Next.js 16.2.3 (App Router) + React 19 + Tailwind CSS 4 + TypeScript 5 + Recharts + Lucide Icons</p>
          </div>
          <div>
            <h3 className="text-[#F0A500] font-bold mb-2">Backend Stack</h3>
            <p className="text-gray-300">Next.js Route Handlers (17 endpoints) + Supabase PostgreSQL (44 tables) + Row Level Security</p>
          </div>
          <div>
            <h3 className="text-[#F0A500] font-bold mb-2">Data Pattern</h3>
            <p className="text-gray-300">useApi&lt;T&gt;() hook → /api/* route → createServerClient() → Supabase → JSON → React state → UI</p>
          </div>
          <div>
            <h3 className="text-[#F0A500] font-bold mb-2">Deployment</h3>
            <p className="text-gray-300">Vercel (auto-scaling) + goldendoorhq.com + GitHub CI/CD</p>
          </div>
        </div>
      </div>
    </div>
  );
}
