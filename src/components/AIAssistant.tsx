"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";

// ── Knowledge base for every CRM view ──
const KB: Record<string, { title: string; purpose: string; features: string[]; tips: string[] }> = {
  "/": {
    title: "Dashboard",
    purpose: "Executive command center showing real-time business health across all Delta verticals.",
    features: [
      "KPI cards: Total Contacts, Active Deals, Pipeline Value, Open Tasks",
      "Pipeline chart showing deals by stage",
      "Recent activity feed with timestamps",
      "Quick action buttons for creating contacts, deals, tasks",
      "Revenue trend line chart",
    ],
    tips: [
      "Click any KPI card to jump to its detail page",
      "The pipeline chart is interactive — hover for deal counts per stage",
      "Activity feed auto-refreshes every 30 seconds",
    ],
  },
  "/contacts": {
    title: "Contacts",
    purpose: "Central contact database — every lead, customer, and cancelled account in Delta history.",
    features: [
      "Search by name, email, or phone",
      "Paginated table with 50 contacts per page",
      "Click any row to open the Customer DNA 360 view",
      "Create new contacts with the + button",
      "Columns: Name, Email, Phone, Company, Lifecycle Stage, Created",
    ],
    tips: [
      "Use the search bar for instant filtering",
      "Click column headers to sort",
      "The Customer DNA page shows the complete lifecycle of any contact",
    ],
  },
  "/contacts/[id]": {
    title: "Customer DNA (360 View)",
    purpose: "Complete lifecycle view of a single contact — from first touch to installation and beyond.",
    features: [
      "KPI strip: Deal value, open tickets, days as customer, total payments",
      "Contact sidebar with all profile fields",
      "Credit/PreQual section: score, status, Equifax/TransUnion data",
      "9 tabs: Timeline, Deals, Contracts, Solar, Tickets, Payments, Communications, Photos, Reviews",
      "HubSpot sync button for real-time CRM sync",
    ],
    tips: [
      "Timeline tab shows ALL events chronologically across every data source",
      "Communications tab connects to RingCentral for call recordings and texts",
      "Photos tab pulls from CompanyCam with timestamps",
      "Reviews tab lets you send a review request with one click",
      "Edit contact fields by clicking the edit button in the sidebar",
    ],
  },
  "/deals": {
    title: "Deals",
    purpose: "Sales pipeline management — track every deal from lead to close.",
    features: [
      "Pipeline board view with deal cards by stage",
      "Deal cards show amount, contact, company, close date",
      "Won/Lost badges with color coding",
      "Create new deals with full form",
    ],
    tips: [
      "Focus on deals closest to close date first",
      "Won deals show green, lost show red",
      "Each deal links to its contact's DNA page",
    ],
  },
  "/companies": {
    title: "Companies",
    purpose: "Company directory with deal and contact associations.",
    features: [
      "Company cards with logo, name, industry",
      "Deal count and revenue per company",
      "Search and filter capabilities",
      "26-field company profile",
    ],
    tips: [
      "Companies aggregate all related contacts and deals",
      "Use industry filter to segment your view",
    ],
  },
  "/contracts": {
    title: "Contracts",
    purpose: "Contract lifecycle — creation, signing, tracking, and compliance.",
    features: [
      "Status badges: Draft, Sent, Signed, Expired",
      "Template-based contract creation",
      "Expiration date tracking and alerts",
      "Document links and signing history",
    ],
    tips: [
      "Always create from a template for consistency",
      "Expired contracts are highlighted in red",
      "Contracts link to their associated contacts and deals",
    ],
  },
  "/solar": {
    title: "Solar Projects",
    purpose: "Full solar installation pipeline — design, permit, install, inspect, monitor.",
    features: [
      "84-field project records with complete system details",
      "Pipeline stages: Design, Permit, Install, Inspection, Monitoring",
      "Timeline view per project",
      "Change order and production tracking",
    ],
    tips: [
      "Solar projects have the most detailed records in the CRM (84 fields)",
      "Use the timeline tab to track progress milestones",
      "Monitoring data integrates with Enphase/SolarEdge",
    ],
  },
  "/tasks": {
    title: "Tasks",
    purpose: "Task management with priority, due dates, and assignees.",
    features: [
      "Priority color coding: High (red), Medium (yellow), Low (green)",
      "Filter by status, priority, and assignee",
      "Due date tracking with overdue alerts",
      "Contact and deal linking",
    ],
    tips: [
      "Overdue tasks are highlighted — address these first",
      "Link tasks to contacts for better tracking",
      "Use filters to focus on your personal tasks",
    ],
  },
  "/tickets": {
    title: "Tickets",
    purpose: "Customer support ticket system.",
    features: [
      "Priority and status badges",
      "Assignee management",
      "Contact association for context",
      "Resolution time tracking",
    ],
    tips: [
      "High-priority tickets should be addressed within 4 hours",
      "Always link tickets to the relevant contact",
    ],
  },
  "/scheduling": {
    title: "Scheduling",
    purpose: "Crew calendar and job scheduling.",
    features: [
      "Calendar view with crew assignments",
      "Equipment allocation tracking",
      "Schedule entry creation with time slots",
      "Crew availability overview",
    ],
    tips: [
      "Check crew availability before scheduling",
      "Equipment conflicts are highlighted automatically",
    ],
  },
  "/accounting": {
    title: "Accounting",
    purpose: "Financial management — invoices, payments, job costing.",
    features: [
      "Invoice list with status tracking",
      "Payment recording with method details",
      "Job costing breakdown per project",
      "Revenue summary and trends",
    ],
    tips: [
      "Overdue invoices are highlighted in red",
      "Job costing helps track profitability per project",
    ],
  },
  "/catalog": {
    title: "Product Catalog",
    purpose: "Equipment and materials management with pricing.",
    features: [
      "Equipment catalog with specs and pricing",
      "Price book tiers for different customer segments",
      "Material order tracking",
      "Inventory monitoring",
    ],
    tips: [
      "Keep price books updated for accurate proposals",
      "Track material orders to avoid installation delays",
    ],
  },
  "/marketing": {
    title: "Marketing",
    purpose: "Email campaign management and outreach automation.",
    features: [
      "Campaign creation with open/click tracking",
      "Contact list management",
      "Sequence builder for automated follow-ups",
      "Analytics dashboard with engagement metrics",
    ],
    tips: [
      "Segment contact lists for better engagement rates",
      "Use sequences for automated nurture campaigns",
    ],
  },
  "/monitoring": {
    title: "Monitoring",
    purpose: "Installed system health monitoring and alerts.",
    features: [
      "System health dashboard with status indicators",
      "Alert management with severity levels",
      "Performance readings and trend charts",
      "Alert acknowledgment tracking",
    ],
    tips: [
      "Critical alerts require immediate attention",
      "Use trend charts to identify degrading systems",
    ],
  },
  "/workflows": {
    title: "Workflows",
    purpose: "Automation workflow builder for business processes.",
    features: [
      "Workflow list with Active/Paused/Draft status",
      "Trigger configuration",
      "Enrollment and completion tracking",
      "Error monitoring",
    ],
    tips: [
      "Start with simple workflows and build complexity over time",
      "Monitor error rates to catch integration issues early",
    ],
  },
  "/integrations": {
    title: "Integrations",
    purpose: "Connected app management and sync status.",
    features: [
      "Integration cards with connection status",
      "Last sync timestamps",
      "Error and success logs",
      "Configuration management",
    ],
    tips: [
      "Check sync timestamps regularly to ensure data freshness",
      "Review error logs when data seems out of sync",
    ],
  },
  "/reports": {
    title: "Reports",
    purpose: "Comprehensive reporting across all CRM modules.",
    features: [
      "Filterable data views",
      "Export to CSV/PDF",
      "Date range selection",
      "Module-specific report templates",
    ],
    tips: [
      "Use date ranges to compare periods",
      "Export reports for stakeholder presentations",
    ],
  },
  "/settings": {
    title: "Settings",
    purpose: "Organization and application configuration.",
    features: [
      "Organization profile",
      "User role management",
      "API key management",
      "Notification preferences",
    ],
    tips: [
      "Only admins should modify organization settings",
      "Keep API keys secure and rotate regularly",
    ],
  },
  "/portal": {
    title: "Customer Portal",
    purpose: "Customer-facing view for project status and documents.",
    features: [
      "Project status tracking",
      "Document access",
      "Payment history",
      "Communication with Delta team",
    ],
    tips: [
      "Share portal links with customers for self-service updates",
    ],
  },
  "/rep-portal": {
    title: "Rep Portal",
    purpose: "Personal sales rep dashboard — KPIs, pipeline, tasks, commissions.",
    features: [
      "Personal KPIs: My Deals, Pipeline Value, Won Revenue, Pending Tasks",
      "5 tabs: Pipeline, Tasks, Solar, Schedule, Commissions",
      "Filtered to show only your data",
    ],
    tips: [
      "Check your pipeline tab daily for deal updates",
      "Use the tasks tab to manage your action items",
      "Commission tracking updates in real-time",
    ],
  },
  "/tech-portal": {
    title: "Tech Portal",
    purpose: "Installer/technician field dashboard for job management.",
    features: [
      "Today's jobs with addresses and details",
      "Inspection checklists: Pre-Install, Installation, Post-Install",
      "Photo upload via CompanyCam",
      "Document access for permits and plans",
    ],
    tips: [
      "Complete all checklist items before marking a job done",
      "Upload photos at each stage for documentation",
      "Access permits directly from the Documents tab",
    ],
  },
  "/help": {
    title: "Help & Documentation",
    purpose: "Complete user manuals for every CRM view.",
    features: [
      "View-by-view documentation",
      "Feature explanations and tips",
      "Quick navigation to any page",
    ],
    tips: [
      "Click any card to see the full manual for that view",
      "Use the AI Assistant (chat bubble) for real-time help",
    ],
  },
};

// ── General Q&A knowledge ──
const GENERAL_QA: Array<{ q: RegExp; a: string }> = [
  { q: /how.*(create|add|new).*(contact|lead)/i, a: "Go to the Contacts page and click the '+ New Contact' button in the top-right. Fill in the required fields (name, email) and click Save. The contact will appear in the list immediately." },
  { q: /how.*(create|add|new).*(deal)/i, a: "Navigate to the Deals page and click '+ New Deal'. Select a contact, enter the deal amount, choose a pipeline stage, and set the expected close date." },
  { q: /how.*(search|find).*(contact|customer)/i, a: "Use the search bar at the top of the Contacts page. It searches by name, email, and phone number in real-time. You can also use the global search in the top navigation bar." },
  { q: /what.*(customer.*dna|360|lifecycle)/i, a: "Customer DNA is the complete 360-degree view of any contact. Click on any contact in the Contacts list to see their full history — deals, contracts, solar projects, tickets, payments, communications, photos, and reviews all in one place." },
  { q: /how.*(export|download)/i, a: "Most tables have an export button in the top-right corner. You can export to CSV or PDF format. For the Customer DNA page, use the export button on each individual tab." },
  { q: /what.*(integration|connect)/i, a: "The CRM connects to HubSpot, RingCentral, CompanyCam, SiteCapture, SubcontractorHub, Google Sheets/Docs, Notion, Asana, and more. Check the Integrations page for connection status and configuration." },
  { q: /how.*(ringcentral|call|text|sms)/i, a: "RingCentral integration is in the Customer DNA page under the Communications tab. Click 'Sync Calls' or 'Sync Texts' to pull the latest call recordings and SMS history for that contact." },
  { q: /how.*(companycam|photo|picture|install.*photo)/i, a: "Install photos are in the Customer DNA page under the Photos tab. They sync from CompanyCam with timestamps. You can also upload photos directly from the Tech Portal during installations." },
  { q: /how.*(review|golden.*review)/i, a: "Go to the Customer DNA page for any contact and click the Reviews tab. Hit the 'Request Review' button to send a one-click review request via GoldenReviews." },
  { q: /what.*(rep.*portal|sales.*portal)/i, a: "The Rep Portal (/rep-portal) is your personal sales dashboard. It shows your deals, pipeline value, tasks, solar projects, schedule, and commissions — filtered to show only your data." },
  { q: /what.*(tech.*portal|installer)/i, a: "The Tech Portal (/tech-portal) is for field technicians. It shows today's jobs, inspection checklists (Pre-Install, Installation, Post-Install), photo upload, and document access." },
  { q: /how.*(workflow|automat)/i, a: "Go to the Workflows page to create automation workflows. Set a trigger (e.g., new deal created), configure actions (e.g., send email, create task), and activate. Monitor enrollment and error rates from the list view." },
  { q: /how.*(login|sign.*in|auth)/i, a: "Authentication is managed by Clerk. You'll be prompted to sign in when you first visit the CRM. Your role (admin, rep, tech) determines which pages and data you can access." },
  { q: /how.*(help|support|manual)/i, a: "You can access help in two ways: (1) Click the chat bubble in the bottom-right for AI-powered help, or (2) Go to the Help page (/help) for complete view-by-view documentation." },
  { q: /how.*(supabase|database)/i, a: "The CRM uses Supabase (PostgreSQL) with 44 tables. All data is organization-scoped with Row Level Security. The database is at https://miplrboxsrxsaqfuyrne.supabase.co." },
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm the GoldenDoor AI Assistant. Ask me anything about using the CRM — how to find customers, create deals, use the portals, or navigate any page. How can I help?",
    },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function getAnswer(question: string): string {
    const q = question.toLowerCase();

    // Check view-specific questions
    for (const [path, info] of Object.entries(KB)) {
      const nameLC = info.title.toLowerCase();
      if (q.includes(nameLC) || q.includes(path.replace("/", ""))) {
        if (q.includes("how") || q.includes("what") || q.includes("tell") || q.includes("explain") || q.includes("help")) {
          return `**${info.title}**\n\n${info.purpose}\n\n**Key Features:**\n${info.features.map((f) => `• ${f}`).join("\n")}\n\n**Tips:**\n${info.tips.map((t) => `💡 ${t}`).join("\n")}`;
        }
      }
    }

    // Check general Q&A
    for (const qa of GENERAL_QA) {
      if (qa.q.test(question)) {
        return qa.a;
      }
    }

    // Navigation help
    if (q.includes("where") || q.includes("navigate") || q.includes("go to") || q.includes("find page")) {
      return "Here are the main pages you can navigate to:\n\n• **Dashboard** (/) — Overview and KPIs\n• **Contacts** (/contacts) — Customer database\n• **Deals** (/deals) — Sales pipeline\n• **Solar** (/solar) — Solar projects\n• **Contracts** (/contracts) — Contract management\n• **Tasks** (/tasks) — Task management\n• **Tickets** (/tickets) — Support tickets\n• **Scheduling** (/scheduling) — Crew calendar\n• **Accounting** (/accounting) — Finances\n• **Rep Portal** (/rep-portal) — Sales rep view\n• **Tech Portal** (/tech-portal) — Installer view\n• **Help** (/help) — Full documentation\n\nUse the navigation bar at the top to access any page.";
    }

    // Fallback
    return `I can help with questions about any CRM page or feature. Try asking:\n\n• "How do I create a new contact?"\n• "What is Customer DNA?"\n• "Tell me about the Rep Portal"\n• "How do I export data?"\n• "How does RingCentral integration work?"\n\nOr visit the **Help** page (/help) for complete documentation on every view.`;
  }

  function handleSend() {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    const answer = getAnswer(input);
    const assistantMsg: Message = { role: "assistant", content: answer };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
  }

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full bg-[#F0A500] text-[#0B1F3A] shadow-xl hover:scale-110 transition-transform flex items-center justify-center"
        >
          <Sparkles size={24} />
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-[100] w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-[#0B1F3A] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#F0A500] flex items-center justify-center">
                <Bot size={18} className="text-[#0B1F3A]" />
              </div>
              <div>
                <div className="text-white text-sm font-bold">GoldenDoor AI</div>
                <div className="text-gray-400 text-xs">CRM Assistant</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex items-start gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "user" ? "bg-[#007A67]" : "bg-[#F0A500]"
                  }`}>
                    {msg.role === "user" ? <User size={12} className="text-white" /> : <Bot size={12} className="text-[#0B1F3A]" />}
                  </div>
                  <div className={`rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-[#007A67] text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {msg.content.split("\n").map((line, j) => (
                      <span key={j}>
                        {line.replace(/\*\*(.*?)\*\*/g, "$1")}
                        {j < msg.content.split("\n").length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-3 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about any CRM feature..."
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#F0A500] focus:ring-1 focus:ring-[#F0A500]"
            />
            <button
              onClick={handleSend}
              className="w-9 h-9 rounded-lg bg-[#F0A500] text-[#0B1F3A] flex items-center justify-center hover:bg-[#e09600] transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
