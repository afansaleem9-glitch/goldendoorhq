"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Sun, Shield, Home, Wifi, ChevronDown, Phone, Mail, MapPin,
  ExternalLink, Edit3, Sparkles, CheckCircle2, Clock, AlertTriangle,
  Search, Filter, MessageSquare, Ticket, FileText, Star, CalendarDays,
  User, Info, Headphones, Download, CreditCard, FileCheck, DollarSign,
  PhoneCall, Video, Paperclip, Lock, TrendingUp, Receipt, ShieldCheck
} from "lucide-react";
import { PipelineTab } from "@/components/PipelineTab";

// Mock customer data
const mockCustomer = {
  id: "1", portalId: 559302, name: "Lynna Dy", phone: "(469) 212-4849", email: "lynna.dy@email.com",
  address: "2716 Helen Lane", city: "Mesquite", state: "TX", zip: "75181",
  lat: 32.7369484, lng: -96.5419037, specifications: "Husband Jared Simpson 469-490-7940 is auth.",
  doNotContact: false, hideTimeline: false,
  pointsOfContact: "Matthew Johnson",
  entity: "Freedom Forever Texas, LLC",
  verticals: ["solar", "security"] as string[],
  // Solar
  solarStage: "Final Completed", systemSize: 13.77, systemPrice: 40990, modules: 34,
  modulesType: "JA SOLAR 405Ws", inverterType: "1 SolarEdge USE10000H-USMNBL75",
  mountType: "Roof Mount - Comp Shingle", financing: "Sunrun PPA",
  batteryType: "", batteryCapacity: "", keyAdders: ["Rebate", "Multiple Planes"],
  serviceBranch: "Fort Worth", installBranch: "Dallas", utility: "Oncor",
  salesRep: "Matthew Johnson", dealer: "Delta Power Group",
  submitted: "May 05, 2025", createdOn: "May 05, 2025", createdVia: "Manual",
  freedomAdvantage: true, duplicateProject: false, preExistingPV: false,
  branchManager: "Austin Radford", branchManagerEmail: "aradford@deltapowergroup.com",
  expectedHours: "78h 25m (Base 75h 44m + Adders 2h 41m)",
  domesticContent: [
    { code: "N-25-08: PV", designedBom: "15%", warehouseIssued: "15%" },
    { code: "N-24-41: PV", designedBom: "25.8%", warehouseIssued: "25.8%" },
  ],
  processedAt: ["2025-05-14 11:55 PM PDT", "2025-07-03 12:31 PM PDT"],
  // Security
  securityPackage: "Premium", securityMonthly: 49.99, securityStatus: "Active",
  securityDevices: 12, securityMonitoring: "24/7 Professional",
  // Warranties
  warranties: [
    { type: "Workmanship", years: 10, endDate: "Jun 20, 2035", status: "active" },
    { type: "Roof Penetration", years: 10, endDate: "Jun 20, 2035", status: "active" },
    { type: "Production Guarantee", years: 0, endDate: "N/A", status: "inactive" },
  ],
  // Documents
  documents: [
    { name: "Acknowledgement Of Utility Billing Practices - English", status: "Complete", creator: "Sukhjeet Johal" },
    { name: "Texas Permit Authorization", status: "Complete", creator: "Sukhjeet Johal" },
    { name: "Opt-In To Receive Calls And/Or Text Messages - English", status: "Complete", creator: "Sukhjeet Johal" },
  ],
  // SOW
  sowVersion: "v1.3", sowStatus: "Draft", sowCreator: "LIGHTSPEED Automation",
  sowUpdated: "01/12/2026, 4:57 pm",
  sowSpecs: { size: 13.77, modules: "34 JA SOLAR 405Ws", inverters: "1 SolarEdge" },
  sowAdders: [
    { name: "Rebate", cost: 500, addedIn: "New Deal" },
    { name: "*Multiple Planes", cost: 900, addedIn: "Project" },
  ],
  sowFinancials: { grossPrice: 40989.94, financeAmount: 40989.94, grossPPW: 2.98 },
  // Field Visits
  fieldVisits: [
    { type: "Inspection", subtype: "PV Final", date: "Jul 1, 2025 @ 7:00 AM", status: "AHJ - Confirmed", creator: "Christopher Smith", crew: "Neslon Bonilla" },
    { type: "Install", subtype: "Additional Install Day", date: "Jun 20, 2025 @ 5:00 AM", status: "Homeowner - Confirmed", creator: "Samuel Elliott" },
    { type: "Install", subtype: "PV Install", date: "Jun 19, 2025 @ 7:00 AM", status: "Homeowner - Confirmed", creator: "Maria Montano Siguenza" },
    { type: "Install", subtype: "PV Install", date: "Jun 18, 2025 @ 7:00 AM", status: "Homeowner - Confirmed", creator: "Maria Montano Siguenza" },
    { type: "Site Survey Visit", subtype: "", date: "May 7, 2025 @ 1:30 PM", status: "Complete", creator: "Robert Dellavecchia" },
  ],
  // Notes
  notes: [
    { id: "1", type: "communication", author: "Jamie Belford", role: "Customer Support Specialist", content: "Production concern - Jamie B 7/28/25", date: "Jul 28, 2025 7:20 PM", tags: ["Final Completed"], taskRef: "Customer Contact", commType: "Inbound Phone Call", contactFrom: "Lynna Dy, Customer", contactTo: "Jamie Belford, Customer Support Specialist" },
    { id: "2", type: "communication", author: "Robert Brabec", role: "Customer Support Specialist", content: "7/11/25 calling about system activation - Robert B", date: "Jul 11, 2025 3:16 PM", tags: ["Final Completed"], taskRef: "Customer Contact" },
    { id: "3", type: "communication", author: "Freedom User", role: "", content: "AI Agent Call Summary:\nAgent: Raya", date: "Jul 11, 2025 5:03 PM", tags: [], commType: "Inbound Phone Call", contactFrom: "Lynna Dy, Customer", contactTo: "Freedom User" },
    { id: "4", type: "project", author: "Brianna Warren", role: "Monitoring Administrator", content: "-Sent monitoring and activation emails - requested an FSD for IA and site access.", date: "Jul 08, 2025 7:11 PM", tags: ["Final Completed", "Monitoring", "Communication"], commType: "Outbound Email", contactFrom: "Brianna Warren, Monitoring Administrator", contactTo: "Lynna Dy, Customer" },
    { id: "5", type: "ticket", author: "Lotoannalelei Tootoo", role: "Senior Interconnection Specialist, Las Vegas", content: "Interconnection Agreement complete.", date: "Jul 08, 2025 4:18 PM", tags: ["Final Review"], ticketRef: "#2661773" },
    { id: "6", type: "project", author: "Angelique Harper", role: "Interconnection Specialist, Las Vegas", content: "Utility Generated Document Sent for Signature: Documents required by the utility have been sent (edited)", date: "Jul 07, 2025 11:07 AM", tags: ["PTO"], ticketRef: "#2661773" },
    { id: "7", type: "event", author: "Timothy Rosenberger", role: "Monitoring Specialist Supervisor", content: "no service call required, standby exited, archived process", date: "Jul 16, 2025 5:47 PM", tags: ["Final Completed"], taskRef: "Service Call" },
  ],
  // HubSpot Files
  hubspotFiles: [
    { id: "f1", name: "Signed_Contract_LynnaDy.pdf", type: "pdf", size: "2.4 MB", uploaded: "May 05, 2025", uploadedBy: "Matthew Johnson", category: "Contract" },
    { id: "f2", name: "Site_Survey_Photos.zip", type: "zip", size: "48.2 MB", uploaded: "May 07, 2025", uploadedBy: "Robert Dellavecchia", category: "Survey" },
    { id: "f3", name: "Design_Layout_v3.pdf", type: "pdf", size: "1.8 MB", uploaded: "May 23, 2025", uploadedBy: "LIGHTSPEED Automation", category: "Design" },
    { id: "f4", name: "Permit_Approval_Mesquite.pdf", type: "pdf", size: "340 KB", uploaded: "Jun 23, 2025", uploadedBy: "Permitting Team", category: "Permit" },
    { id: "f5", name: "HOA_Approval_Letter.pdf", type: "pdf", size: "210 KB", uploaded: "Jun 18, 2025", uploadedBy: "HOA Coordinator", category: "HOA" },
    { id: "f6", name: "Interconnection_Agreement.pdf", type: "pdf", size: "580 KB", uploaded: "Mar 08, 2026", uploadedBy: "Lotoannalelei Tootoo", category: "Utility" },
    { id: "f7", name: "PTO_Confirmation_Oncor.pdf", type: "pdf", size: "125 KB", uploaded: "Mar 18, 2026", uploadedBy: "Oncor Electric", category: "Utility" },
    { id: "f8", name: "Warranty_Certificate.pdf", type: "pdf", size: "290 KB", uploaded: "Mar 28, 2026", uploadedBy: "System Auto", category: "Warranty" },
    { id: "f9", name: "Wells_Fargo_Equipment_Agreement.pdf", type: "pdf", size: "1.1 MB", uploaded: "May 05, 2025", uploadedBy: "Matthew Johnson", category: "Finance" },
    { id: "f10", name: "Customer_ID_Verification.pdf", type: "pdf", size: "890 KB", uploaded: "May 05, 2025", uploadedBy: "Matthew Johnson", category: "Verification" },
  ],
  // Recorded Calls
  recordedCalls: [
    { id: "rc1", date: "Jul 28, 2025 7:20 PM", duration: "12:34", direction: "inbound", agent: "Jamie Belford", summary: "Production concern — customer asking about expected vs actual production numbers.", recording: true, sentiment: "concerned" },
    { id: "rc2", date: "Jul 11, 2025 3:16 PM", duration: "8:45", direction: "inbound", agent: "Robert Brabec", summary: "Customer calling about system activation status. Confirmed monitoring setup in progress.", recording: true, sentiment: "neutral" },
    { id: "rc3", date: "Jul 11, 2025 5:03 PM", duration: "4:22", direction: "inbound", agent: "AI Agent - Raya", summary: "AI Agent handled inquiry about system performance dashboard access.", recording: true, sentiment: "positive" },
    { id: "rc4", date: "May 05, 2025 2:15 PM", duration: "22:10", direction: "outbound", agent: "Matthew Johnson", summary: "Initial sales call. Discussed system size, financing options, and timeline. Customer agreed to move forward.", recording: true, sentiment: "positive" },
    { id: "rc5", date: "Jun 18, 2025 9:30 AM", duration: "3:12", direction: "outbound", agent: "Maria Montano Siguenza", summary: "Install day 1 confirmation call. Confirmed homeowner will be present.", recording: true, sentiment: "positive" },
    { id: "rc6", date: "May 07, 2025 11:00 AM", duration: "6:45", direction: "outbound", agent: "Robert Dellavecchia", summary: "Pre-survey call to confirm appointment and discuss access requirements.", recording: true, sentiment: "neutral" },
  ],
  // Email History
  emailHistory: [
    { id: "em1", date: "Jul 08, 2025", subject: "Monitoring & Activation Instructions", from: "Brianna Warren", to: "Lynna Dy", direction: "outbound", status: "delivered", opened: true },
    { id: "em2", date: "Jul 07, 2025", subject: "Utility Documents - Signature Required", from: "Angelique Harper", to: "Lynna Dy", direction: "outbound", status: "delivered", opened: true },
    { id: "em3", date: "Jun 23, 2025", subject: "Your Permit Has Been Approved!", from: "notifications@deltapowergroup.com", to: "Lynna Dy", direction: "outbound", status: "delivered", opened: true },
    { id: "em4", date: "Jun 18, 2025", subject: "Installation Schedule Confirmation", from: "scheduling@deltapowergroup.com", to: "Lynna Dy", direction: "outbound", status: "delivered", opened: true },
    { id: "em5", date: "May 23, 2025", subject: "Design Approval Needed", from: "design@deltapowergroup.com", to: "Lynna Dy", direction: "outbound", status: "delivered", opened: true },
    { id: "em6", date: "May 05, 2025", subject: "Welcome to Delta Power Group!", from: "welcome@deltapowergroup.com", to: "Lynna Dy", direction: "outbound", status: "delivered", opened: true },
    { id: "em7", date: "May 06, 2025", subject: "Site Survey Appointment Confirmation", from: "scheduling@deltapowergroup.com", to: "Lynna Dy", direction: "outbound", status: "delivered", opened: false },
    { id: "em8", date: "Jul 15, 2025", subject: "Re: Production Concern", from: "Lynna Dy", to: "support@deltapowergroup.com", direction: "inbound", status: "received", opened: true },
    { id: "em9", date: "Mar 28, 2026", subject: "Your Solar System is Fully Operational!", from: "success@deltapowergroup.com", to: "Lynna Dy", direction: "outbound", status: "delivered", opened: true },
  ],
  // Contracts & Agreements
  contracts: [
    { id: "ct1", name: "Solar Installation Agreement", signedDate: "May 05, 2025", status: "executed", signedBy: "Lynna Dy", docusignId: "ENV-8827364", amount: 40990 },
    { id: "ct2", name: "Wells Fargo Equipment Finance Agreement", signedDate: "May 05, 2025", status: "executed", signedBy: "Lynna Dy", docusignId: "ENV-8827365", amount: 40990 },
    { id: "ct3", name: "Sunrun PPA Agreement", signedDate: "May 05, 2025", status: "executed", signedBy: "Lynna Dy / Jared Simpson", docusignId: "ENV-8827366", amount: 0 },
    { id: "ct4", name: "Texas Permit Authorization", signedDate: "May 05, 2025", status: "executed", signedBy: "Lynna Dy", docusignId: "ENV-8827367" },
    { id: "ct5", name: "Utility Billing Acknowledgement", signedDate: "May 05, 2025", status: "executed", signedBy: "Lynna Dy", docusignId: "ENV-8827368" },
    { id: "ct6", name: "Opt-In Communication Consent", signedDate: "May 05, 2025", status: "executed", signedBy: "Lynna Dy", docusignId: "ENV-8827369" },
    { id: "ct7", name: "Interconnection Agreement - Oncor", signedDate: "Mar 08, 2026", status: "executed", signedBy: "Lynna Dy", docusignId: "ENV-9114522" },
  ],
  // Credit Profile
  creditProfile: {
    score: 742, tier: "A", pullDate: "May 05, 2025", bureau: "Experian", approved: true,
    monthlyIncome: 8500, dti: 32, maxApproved: 55000,
    priorBankruptcy: false, priorForeclosure: false,
    financierDecisions: [
      { financier: "GoodLeap", decision: "Approved", rate: "1.49%", term: "25 years", maxAmount: 50000, date: "May 05, 2025" },
      { financier: "Mosaic", decision: "Approved", rate: "1.99%", term: "25 years", maxAmount: 48000, date: "May 05, 2025" },
      { financier: "Sunrun PPA", decision: "Approved", rate: "PPA", term: "25 years", maxAmount: 0, date: "May 05, 2025" },
    ]
  },
  // Prequal Results
  prequalResults: [
    { id: "pq1", financier: "Sunrun PPA", result: "Approved", date: "May 05, 2025", systemSize: "13.77 kW", monthlyPayment: "$0 (PPA)", details: "25-year PPA at $0.089/kWh escalator 2.9%" },
    { id: "pq2", financier: "GoodLeap", result: "Approved", date: "May 05, 2025", systemSize: "13.77 kW", monthlyPayment: "$185/mo", details: "25yr loan at 1.49% APR, $0 down" },
    { id: "pq3", financier: "Mosaic", result: "Approved", date: "May 05, 2025", systemSize: "13.77 kW", monthlyPayment: "$198/mo", details: "25yr loan at 1.99% APR, $0 down" },
  ],
  // Monitoring Payment History (for security/alarm customers)
  monitoringPayments: [
    { month: "Jul 2025", amount: 49.99, status: "paid", method: "Visa ****4821", paidDate: "Jul 01, 2025" },
    { month: "Aug 2025", amount: 49.99, status: "paid", method: "Visa ****4821", paidDate: "Aug 01, 2025" },
    { month: "Sep 2025", amount: 49.99, status: "paid", method: "Visa ****4821", paidDate: "Sep 01, 2025" },
    { month: "Oct 2025", amount: 49.99, status: "paid", method: "Visa ****4821", paidDate: "Oct 01, 2025" },
    { month: "Nov 2025", amount: 49.99, status: "paid", method: "Visa ****4821", paidDate: "Nov 01, 2025" },
    { month: "Dec 2025", amount: 49.99, status: "paid", method: "Visa ****4821", paidDate: "Dec 01, 2025" },
    { month: "Jan 2026", amount: 49.99, status: "paid", method: "Visa ****4821", paidDate: "Jan 01, 2026" },
    { month: "Feb 2026", amount: 49.99, status: "paid", method: "Visa ****4821", paidDate: "Feb 01, 2026" },
    { month: "Mar 2026", amount: 49.99, status: "paid", method: "Visa ****4821", paidDate: "Mar 01, 2026" },
    { month: "Apr 2026", amount: 49.99, status: "due", method: "Visa ****4821", paidDate: "" },
  ],
};

type MainTab = "snapshot" | "pipeline" | "details" | "sow" | "bom" | "hubspot";
type NoteFilter = "all" | "project" | "tickets" | "communication" | "reviews" | "events";
type VerticalTab = "solar" | "security" | "roofing" | "att";
type HubSpotSection = "files" | "calls" | "emails" | "contracts" | "credit" | "prequal" | "monitoring";

const visitStatusColors: Record<string, string> = {
  "AHJ - Confirmed": "bg-green-100 text-green-800",
  "Homeowner - Confirmed": "bg-green-100 text-green-800",
  "Complete": "bg-green-100 text-green-800",
  "Pending": "bg-yellow-100 text-yellow-800",
};

export default function CustomerDetail() {
  const params = useParams();
  const c = mockCustomer;
  const [mainTab, setMainTab] = useState<MainTab>("snapshot");
  const [noteFilter, setNoteFilter] = useState<NoteFilter>("all");
  const [noteSearch, setNoteSearch] = useState("");
  const [activeVertical, setActiveVertical] = useState<VerticalTab>("solar");
  const [showSummary, setShowSummary] = useState(false);
  const [hubspotSection, setHubspotSection] = useState<HubSpotSection>("files");

  const filteredNotes = c.notes.filter(n => noteFilter === "all" || n.type === noteFilter);

  const tabs: { key: MainTab; label: string }[] = [
    { key: "snapshot", label: "SNAPSHOT" },
    { key: "pipeline", label: "PIPELINE" },
    { key: "details", label: "PROJECT DETAILS" },
    { key: "sow", label: "SCOPE OF WORK" },
    { key: "bom", label: "BILL OF MATERIALS" },
    { key: "hubspot", label: "CUSTOMER DNA" },
  ];

  const stageDescription: Record<string, string> = {
    "Final Completed": "The completed project has been reviewed. Funding has been received, system is turned on and customer is happy!",
  };

  return (
    <div className="flex h-[calc(100vh-60px)]">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Priority Banner */}
        <div className="bg-gray-100 px-6 py-2 text-sm text-gray-500 border-b">
          This project doesn&apos;t qualify for priority install scheduling.
        </div>

        {/* Timeline */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
            <span>2025</span><span>2028</span><span>2031</span><span>2034</span><span>2038</span><span>2041</span><span>2044</span>
          </div>
          <div className="relative h-8">
            <div className="absolute inset-y-0 left-0 right-0 flex items-center">
              <div className="w-full h-0.5 bg-gray-200 relative" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 8px, #e5e7eb 8px, #e5e7eb 10px)" }}>
                <div className="absolute left-[2%] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
                <div className="absolute left-[2%] -top-5 text-[10px] text-gray-500 font-medium">PTO</div>
                <div className="absolute left-[8%] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gray-300"></div>
                <div className="absolute left-[8%] -top-5 text-[10px] text-gray-400 -rotate-45 origin-bottom-left">Workmanship & Roof...</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <select className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-600">
              <option>POST PTO TIMELINE - 25 YEARS</option>
            </select>
            <button className="text-xs text-[#007A67] flex items-center gap-1"><Info className="w-3 h-3" /> Timeline Help Guide</button>
          </div>
        </div>

        {/* Customer Header */}
        <div className="px-6 py-3 border-b border-gray-100">
          {/* Vertical Tabs */}
          <div className="flex gap-2 mb-3">
            {c.verticals.map(v => {
              const configs: Record<string, { label: string; icon: typeof Sun; color: string }> = {
                solar: { label: "Solar", icon: Sun, color: "bg-amber-500" },
                security: { label: "Smart Home Security", icon: Shield, color: "bg-blue-500" },
                roofing: { label: "Roofing", icon: Home, color: "bg-red-500" },
                att: { label: "AT&T", icon: Wifi, color: "bg-cyan-500" },
              };
              const cfg = configs[v];
              if (!cfg) return null;
              const Icon = cfg.icon;
              return (
                <button key={v} onClick={() => setActiveVertical(v as VerticalTab)} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${activeVertical === v ? `${cfg.color} text-white` : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  <Icon className="w-3.5 h-3.5" /> {cfg.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-400">Project</span>
                <span className="px-2 py-0.5 bg-green-500 text-white text-[10px] rounded-full font-medium">Project Support</span>
                <span className="px-2 py-0.5 bg-blue-500 text-white text-[10px] rounded-full font-medium">Eagleview Design</span>
              </div>
              <h1 className="text-xl font-bold text-[#0B1F3A] mb-1">{c.name}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" defaultChecked={c.doNotContact} className="rounded" /> Do Not Contact
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" defaultChecked={c.hideTimeline} className="rounded" /> Hide customer timeline
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowSummary(true)} className="flex items-center gap-2 px-4 py-2 border border-[#7C5CBF] text-[#7C5CBF] rounded-lg text-sm font-medium hover:bg-purple-50">
                <Sparkles className="w-4 h-4" /> Project Summary
              </button>
              <button className="flex items-center gap-2 px-5 py-2 bg-[#007A67] text-white rounded-lg text-sm font-medium hover:bg-[#006655]">
                Take Action <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Specs + Contact */}
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-gray-400 w-24 shrink-0">Specifications</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-700">{c.specifications}</span>
                <button className="text-gray-400 hover:text-gray-600"><Edit3 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 w-24 shrink-0">Address</span>
              <span className="text-gray-700">{c.address}, {c.city}, {c.state} {c.zip}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 w-24 shrink-0">Phone</span>
              <a href={`tel:${c.phone}`} className="text-[#007A67] hover:underline">{c.phone}</a>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 w-24 shrink-0">Points of Contact</span>
              <a className="text-[#007A67] hover:underline cursor-pointer">{c.pointsOfContact}</a>
            </div>
          </div>

          {/* Tab Nav */}
          <div className="flex items-center gap-0 mt-4 border-b border-gray-200 -mx-6 px-6 overflow-x-auto">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setMainTab(t.key)} className={`px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${mainTab === t.key ? "text-[#0B1F3A] border-[#007A67]" : "text-gray-400 border-transparent hover:text-gray-600"}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-6 py-4">
          {mainTab === "snapshot" && (
            <div className="space-y-6">
              {/* Specifications Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-[#0B1F3A]">Specifications</h3>
                  <button className="text-gray-400 hover:text-gray-600"><Edit3 className="w-4 h-4" /></button>
                </div>
                <p className="text-sm text-gray-600">{c.specifications}</p>
              </div>

              {/* Documents */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-[#0B1F3A] mb-3">Documents</h3>
                <div className="space-y-3">
                  {c.documents.map((d, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <a className="text-sm text-[#0B1F3A] hover:text-[#007A67] cursor-pointer font-medium">{d.name}</a>
                        <p className="text-xs text-gray-400">Creator: {d.creator}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${d.status === "Complete" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{d.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scope of Work */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-[#0B1F3A] mb-2">Scope of Work</h3>
                <p className="text-xs text-gray-400 mb-3">SCOPE OF WORK</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-sm">SOW {c.sowVersion}</span>
                    <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${c.sowStatus === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{c.sowStatus}</span>
                  </div>
                  <p className="text-xs text-gray-400">Creator: {c.sowCreator} - {c.sowUpdated}</p>
                </div>
              </div>

              {/* Field Visits */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-[#0B1F3A] mb-2">Field Visits</h3>
                <p className="text-xs text-gray-400 mb-3">PAST VISITS</p>
                <div className="space-y-3">
                  {c.fieldVisits.map((v, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-[#0B1F3A]">{v.type} · {v.subtype || v.type} · {v.date}</p>
                        <p className="text-xs text-gray-400">Creator: {v.creator}{v.crew ? ` - Crew: ${v.crew}` : ""}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${visitStatusColors[v.status] || "bg-gray-100 text-gray-700"}`}>{v.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {mainTab === "pipeline" && <PipelineTab />}

          {mainTab === "details" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#0B1F3A]">Project Details</h3>
                  <button className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Edit Project Details</button>
                </div>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  {[
                    ["Portal Project ID", c.portalId],
                    ["Site ID", "N/A"],
                    ["Project Created Via", c.createdVia],
                    ["Project Created On", c.createdOn],
                    ["Project Submitted Date", c.submitted],
                    ["Freedom Advantage", c.freedomAdvantage ? "Yes" : "No"],
                    ["Installation Address", `${c.address}, ${c.city}, ${c.state} ${c.zip}`],
                    ["Lat, Long", `${c.lat}, ${c.lng}`],
                    ["Entity", c.entity],
                    ["Install Branch", c.installBranch],
                    ["Service Branch", c.serviceBranch],
                    ["Project Stage", c.solarStage],
                    ["Duplicate Project", c.duplicateProject ? "Yes" : "No"],
                    ["Pre-Existing PV System", c.preExistingPV ? "Yes" : "No"],
                    ["Mount Type", c.mountType],
                    ["Branch Manager", c.branchManager],
                    ["Expected Hours", c.expectedHours],
                    ["Branch Manager Email", c.branchManagerEmail],
                    ["Sales Site Survey", "Sales Site Survey Not Found"],
                  ].map(([label, val], i) => (
                    <div key={i} className="flex justify-between px-2 py-1 odd:bg-gray-50 rounded">
                      <span className="text-gray-500">{label}</span>
                      <span className="text-gray-800 font-medium text-right">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warranty Info */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-[#0B1F3A] mb-4">Warranty Information</h3>
                <div className="space-y-3">
                  {c.warranties.map((w, i) => (
                    <div key={i} className="grid grid-cols-3 gap-4 text-sm py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-gray-500">{w.type} Warranty</p>
                        <p className="font-medium">{w.years} years</p>
                      </div>
                      <div>
                        <p className="text-gray-500">{w.type} Warranty End Date</p>
                        <p className="font-medium">{w.endDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">{w.type} Warranty Status</p>
                        <p className={`font-medium ${w.status === "active" ? "text-green-600" : "text-red-500"}`}>
                          Warranty {w.status === "active" ? "Active" : "Inactive"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-[#0B1F3A] mb-4">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Homeowner Name</span>
                    <span className="font-medium">{c.name}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Homeowner Phone</span>
                    <a className="text-[#007A67] font-medium hover:underline">{c.phone}</a>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Homeowner Email</span>
                    <a className="text-[#007A67] font-medium hover:underline">{c.email}</a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {mainTab === "sow" && (
            <div className="space-y-4">
              {/* Sub-tabs */}
              <div className="flex items-center gap-0 overflow-x-auto border-b border-gray-200 -mt-2 pb-0">
                {["REVISIONS", "FILES", "TASKS", "STANDARDS", "MODIFIERS", "COMMUNICATION", "CONVERSATION SUMMARIES"].map((t, i) => (
                  <button key={t} className={`px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 ${i === 0 ? "text-[#0B1F3A] border-[#007A67]" : "text-gray-400 border-transparent hover:text-gray-600"}`}>{t}</button>
                ))}
              </div>

              {/* SOW Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-lg font-bold text-[#0B1F3A]">SOW {c.sowVersion}</h2>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">{c.sowStatus}</span>
                </div>
                <p className="text-xs text-gray-400 mb-6">Created by {c.sowCreator} · Last updated by {c.sowCreator} {c.sowUpdated}</p>

                <div className="grid grid-cols-3 gap-8">
                  {/* System Specs */}
                  <div>
                    <h4 className="font-semibold text-sm mb-3">System Specifications</h4>
                    <a className="text-[#007A67] text-sm flex items-center gap-1 mb-3 hover:underline">View Layout <ExternalLink className="w-3 h-3" /></a>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-500">System Size</span><span className="font-medium">{c.sowSpecs.size} kw</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Modules</span><span className="font-medium">{c.sowSpecs.modules}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Inverters</span><span className="font-medium">{c.sowSpecs.inverters}</span></div>
                    </div>
                  </div>
                  {/* Adders */}
                  <div>
                    <h4 className="font-semibold text-sm mb-3">Adders</h4>
                    <div className="space-y-3 text-sm">
                      {c.sowAdders.map((a, i) => (
                        <div key={i}>
                          <div className="flex justify-between"><span className="text-gray-500">{a.name}</span><span className="font-medium">${a.cost.toFixed(2)}</span></div>
                          <p className="text-xs text-gray-400">(Added In {a.addedIn})</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Financial */}
                  <div>
                    <h4 className="font-semibold text-sm mb-3">Financial Data</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-500">Gross Price</span><span className="font-medium">${c.sowFinancials.grossPrice.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Sunrun PPA</span><span className="font-medium">${c.sowFinancials.financeAmount.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Gross PPW</span><span className="font-medium">${c.sowFinancials.grossPPW}</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Version History */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#0B1F3A]">Version History</h3>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50">ACTIVITY LOG</button>
                    <button className="px-3 py-1.5 bg-[#007A67] text-white rounded-lg text-xs font-medium hover:bg-[#006655]">COMPARE VERSIONS</button>
                  </div>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 text-gray-500 font-medium">Adders</th>
                      <th className="text-left py-2 text-gray-500 font-medium">Size</th>
                      <th className="text-left py-2 text-gray-500 font-medium">Net PPW</th>
                      <th className="text-left py-2 text-gray-500 font-medium">Last Edited</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { adders: "$1,400", size: "13.770 kW", ppw: "$2.88", edited: "01/12/2026, 4:57 ..." },
                      { adders: "$1,400", size: "13.770 kW", ppw: "$2.88", edited: "01/12/2026, 4:57 ..." },
                      { adders: "$500", size: "13.760 kW", ppw: "$2.87", edited: "01/12/2026, 4:57 ..." },
                      { adders: "$500", size: "12.960 kW", ppw: "$1.89", edited: "01/12/2026, 4:57 ..." },
                    ].map((r, i) => (
                      <tr key={i} className="border-b border-gray-50">
                        <td className="py-2">{r.adders}</td>
                        <td className="py-2">{r.size}</td>
                        <td className="py-2">{r.ppw}</td>
                        <td className="py-2 text-gray-500">{r.edited}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-gray-400 mt-2 text-right">Total Rows: 4</p>
              </div>
            </div>
          )}

          {mainTab === "bom" && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-[#0B1F3A] mb-4">Bill of Materials</h3>
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-200"><th className="text-left py-2 text-gray-500 font-medium">Item</th><th className="text-left py-2 text-gray-500 font-medium">Qty</th><th className="text-left py-2 text-gray-500 font-medium">Model</th><th className="text-left py-2 text-gray-500 font-medium">Status</th></tr></thead>
                  <tbody>
                    {[
                      ["Solar Modules", "34", "JA SOLAR 405W", "Issued"],
                      ["Inverter", "1", "SolarEdge USE10000H-USMNBL75", "Issued"],
                      ["Racking", "1 set", "IronRidge XR100", "Issued"],
                      ["Conduit", "85 ft", "3/4\" EMT", "Issued"],
                      ["Wire - #10 AWG", "320 ft", "THWN-2 Copper", "Issued"],
                      ["DC Disconnect", "1", "Eaton 60A", "Issued"],
                      ["AC Disconnect", "1", "Eaton 60A", "Issued"],
                      ["Optimizers", "34", "SolarEdge P505", "Issued"],
                      ["Roof Attachments", "68", "Quick Mount PV Classic Comp", "Issued"],
                      ["Junction Box", "2", "Milbank", "Issued"],
                    ].map(([item, qty, model, status], i) => (
                      <tr key={i} className="border-b border-gray-50">
                        <td className="py-2 font-medium text-[#0B1F3A]">{item}</td>
                        <td className="py-2 text-gray-600">{qty}</td>
                        <td className="py-2 text-gray-600">{model}</td>
                        <td className="py-2"><span className="px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">{status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {mainTab === "hubspot" && (
            <div className="space-y-4">
              {/* Sub-nav */}
              <div className="flex items-center gap-0 overflow-x-auto border-b border-gray-200 -mt-2 pb-0">
                {([
                  { key: "files" as HubSpotSection, label: "FILES & DOCS", icon: Paperclip },
                  { key: "calls" as HubSpotSection, label: "RECORDED CALLS", icon: PhoneCall },
                  { key: "emails" as HubSpotSection, label: "EMAILS", icon: Mail },
                  { key: "contracts" as HubSpotSection, label: "AGREEMENTS", icon: FileCheck },
                  { key: "credit" as HubSpotSection, label: "CREDIT PROFILE", icon: CreditCard },
                  { key: "prequal" as HubSpotSection, label: "PREQUAL RESULTS", icon: TrendingUp },
                  { key: "monitoring" as HubSpotSection, label: "MONITORING PAYMENTS", icon: Receipt },
                ]).map(t => {
                  const Icon = t.icon;
                  return (
                    <button key={t.key} onClick={() => setHubspotSection(t.key)} className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-all ${hubspotSection === t.key ? "text-[#0B1F3A] border-[#007A67]" : "text-gray-400 border-transparent hover:text-gray-600"}`}>
                      <Icon className="w-3.5 h-3.5" /> {t.label}
                    </button>
                  );
                })}
              </div>

              {/* FILES */}
              {hubspotSection === "files" && (
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-[#0B1F3A]">All Files & Documents ({c.hubspotFiles.length})</h3>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#007A67] text-white text-xs font-medium rounded-lg hover:bg-[#006655]"><Paperclip className="w-3 h-3" /> Upload File</button>
                  </div>
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-gray-200"><th className="text-left py-2 text-gray-500 font-medium">File Name</th><th className="text-left py-2 text-gray-500 font-medium">Category</th><th className="text-left py-2 text-gray-500 font-medium">Size</th><th className="text-left py-2 text-gray-500 font-medium">Uploaded</th><th className="text-left py-2 text-gray-500 font-medium">By</th><th className="py-2"></th></tr></thead>
                    <tbody>
                      {c.hubspotFiles.map(f => (
                        <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="py-2.5"><div className="flex items-center gap-2"><FileText className="w-4 h-4 text-red-400" /><span className="font-medium text-[#0B1F3A]">{f.name}</span></div></td>
                          <td className="py-2.5"><span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{f.category}</span></td>
                          <td className="py-2.5 text-gray-500">{f.size}</td>
                          <td className="py-2.5 text-gray-500">{f.uploaded}</td>
                          <td className="py-2.5 text-gray-500 text-xs">{f.uploadedBy}</td>
                          <td className="py-2.5"><button className="text-[#007A67] hover:text-[#006655]"><Download className="w-4 h-4" /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* RECORDED CALLS */}
              {hubspotSection === "calls" && (
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-[#0B1F3A]">Recorded Calls ({c.recordedCalls.length})</h3>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#007A67] text-white text-xs font-medium rounded-lg hover:bg-[#006655]"><PhoneCall className="w-3 h-3" /> Log Call</button>
                  </div>
                  <div className="space-y-3">
                    {c.recordedCalls.map(call => (
                      <div key={call.id} className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-all">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${call.direction === "inbound" ? "bg-blue-100" : "bg-green-100"}`}>
                              {call.direction === "inbound" ? <PhoneCall className="w-4 h-4 text-blue-600" /> : <Phone className="w-4 h-4 text-green-600" />}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#0B1F3A]">{call.direction === "inbound" ? "Inbound" : "Outbound"} Call</p>
                              <p className="text-xs text-gray-500">{call.agent} · {call.duration}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${call.sentiment === "positive" ? "bg-green-100 text-green-700" : call.sentiment === "concerned" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}>{call.sentiment}</span>
                            <span className="text-xs text-gray-400">{call.date}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 ml-11">{call.summary}</p>
                        {call.recording && (
                          <div className="ml-11 mt-2 flex items-center gap-2">
                            <button className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200"><Headphones className="w-3 h-3" /> Play Recording</button>
                            <button className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200"><Download className="w-3 h-3" /> Download</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EMAILS */}
              {hubspotSection === "emails" && (
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-[#0B1F3A]">Email History ({c.emailHistory.length})</h3>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#007A67] text-white text-xs font-medium rounded-lg hover:bg-[#006655]"><Mail className="w-3 h-3" /> Send Email</button>
                  </div>
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-gray-200"><th className="py-2"></th><th className="text-left py-2 text-gray-500 font-medium">Subject</th><th className="text-left py-2 text-gray-500 font-medium">From</th><th className="text-left py-2 text-gray-500 font-medium">To</th><th className="text-left py-2 text-gray-500 font-medium">Date</th><th className="text-left py-2 text-gray-500 font-medium">Status</th></tr></thead>
                    <tbody>
                      {c.emailHistory.map(em => (
                        <tr key={em.id} className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer">
                          <td className="py-2.5 w-8">{em.direction === "inbound" ? <Mail className="w-3.5 h-3.5 text-blue-400" /> : <Mail className="w-3.5 h-3.5 text-green-400" />}</td>
                          <td className="py-2.5 font-medium text-[#0B1F3A]">{em.subject}</td>
                          <td className="py-2.5 text-gray-500 text-xs">{em.from}</td>
                          <td className="py-2.5 text-gray-500 text-xs">{em.to}</td>
                          <td className="py-2.5 text-gray-500 text-xs">{em.date}</td>
                          <td className="py-2.5">
                            <div className="flex items-center gap-1">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${em.status === "delivered" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>{em.status}</span>
                              {em.opened && <span className="text-[10px] text-gray-400">Opened</span>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* CONTRACTS */}
              {hubspotSection === "contracts" && (
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-[#0B1F3A]">Agreements & Contracts ({c.contracts.length})</h3>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#007A67] text-white text-xs font-medium rounded-lg hover:bg-[#006655]"><FileCheck className="w-3 h-3" /> New Agreement</button>
                  </div>
                  <div className="space-y-3">
                    {c.contracts.map(ct => (
                      <div key={ct.id} className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-all">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-[#0B1F3A]">{ct.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">DocuSign: {ct.docusignId} · Signed by {ct.signedBy}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">{ct.status}</span>
                            {ct.amount && ct.amount > 0 && <span className="text-sm font-bold text-[#0B1F3A]">${ct.amount.toLocaleString()}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-gray-400">Signed: {ct.signedDate}</span>
                          <button className="text-xs text-[#007A67] font-medium hover:underline flex items-center gap-1"><ExternalLink className="w-3 h-3" /> View Document</button>
                          <button className="text-xs text-[#007A67] font-medium hover:underline flex items-center gap-1"><Download className="w-3 h-3" /> Download</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CREDIT PROFILE */}
              {hubspotSection === "credit" && (
                <div className="space-y-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-[#0B1F3A]">Credit Profile</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500"><Lock className="w-3 h-3" /> Confidential · Pulled {c.creditProfile.pullDate}</div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
                        <p className="text-3xl font-bold text-green-700">{c.creditProfile.score}</p>
                        <p className="text-xs text-green-600 font-medium">Credit Score</p>
                        <p className="text-[10px] text-green-500 mt-1">{c.creditProfile.bureau}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-[#0B1F3A]">{c.creditProfile.tier}</p>
                        <p className="text-xs text-gray-500">Credit Tier</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-[#0B1F3A]">{c.creditProfile.dti}%</p>
                        <p className="text-xs text-gray-500">DTI Ratio</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-[#0B1F3A]">${c.creditProfile.maxApproved.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Max Approved</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      {[
                        ["Monthly Income", `$${c.creditProfile.monthlyIncome.toLocaleString()}`],
                        ["Approved", c.creditProfile.approved ? "Yes" : "No"],
                        ["Prior Bankruptcy", c.creditProfile.priorBankruptcy ? "Yes" : "No"],
                        ["Prior Foreclosure", c.creditProfile.priorForeclosure ? "Yes" : "No"],
                      ].map(([label, val], i) => (
                        <div key={i} className="flex justify-between px-2 py-1.5 odd:bg-gray-50 rounded">
                          <span className="text-gray-500">{label}</span>
                          <span className="font-medium text-gray-800">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="font-semibold text-[#0B1F3A] mb-4">Financier Decisions</h3>
                    <table className="w-full text-sm">
                      <thead><tr className="border-b border-gray-200"><th className="text-left py-2 text-gray-500 font-medium">Financier</th><th className="text-left py-2 text-gray-500 font-medium">Decision</th><th className="text-left py-2 text-gray-500 font-medium">Rate</th><th className="text-left py-2 text-gray-500 font-medium">Term</th><th className="text-left py-2 text-gray-500 font-medium">Max Amount</th><th className="text-left py-2 text-gray-500 font-medium">Date</th></tr></thead>
                      <tbody>
                        {c.creditProfile.financierDecisions.map((fd, i) => (
                          <tr key={i} className="border-b border-gray-50">
                            <td className="py-2 font-medium">{fd.financier}</td>
                            <td className="py-2"><span className="px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">{fd.decision}</span></td>
                            <td className="py-2 text-gray-600">{fd.rate}</td>
                            <td className="py-2 text-gray-600">{fd.term}</td>
                            <td className="py-2 text-gray-600">{fd.maxAmount > 0 ? `$${fd.maxAmount.toLocaleString()}` : "N/A"}</td>
                            <td className="py-2 text-gray-500">{fd.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* PREQUAL RESULTS */}
              {hubspotSection === "prequal" && (
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-[#0B1F3A]">Pre-Qualification Results ({c.prequalResults.length})</h3>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#007A67] text-white text-xs font-medium rounded-lg hover:bg-[#006655]"><TrendingUp className="w-3 h-3" /> Run New Prequal</button>
                  </div>
                  <div className="space-y-3">
                    {c.prequalResults.map(pq => (
                      <div key={pq.id} className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-all">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-[#0B1F3A]">{pq.financier}</p>
                            <p className="text-xs text-gray-500">{pq.date} · System: {pq.systemSize}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${pq.result === "Approved" ? "bg-green-100 text-green-700" : pq.result === "Denied" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{pq.result}</span>
                            <span className="text-sm font-bold text-[#0B1F3A]">{pq.monthlyPayment}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{pq.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MONITORING PAYMENTS */}
              {hubspotSection === "monitoring" && (
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-[#0B1F3A]">Monitoring Fee Payment History</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Smart Home Security · {c.securityPackage} Package · ${c.securityMonthly}/mo</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Account Active</span>
                    </div>
                  </div>
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-gray-200"><th className="text-left py-2 text-gray-500 font-medium">Month</th><th className="text-left py-2 text-gray-500 font-medium">Amount</th><th className="text-left py-2 text-gray-500 font-medium">Status</th><th className="text-left py-2 text-gray-500 font-medium">Payment Method</th><th className="text-left py-2 text-gray-500 font-medium">Paid Date</th></tr></thead>
                    <tbody>
                      {c.monitoringPayments.map((p, i) => (
                        <tr key={i} className="border-b border-gray-50">
                          <td className="py-2 font-medium text-[#0B1F3A]">{p.month}</td>
                          <td className="py-2 text-gray-600">${p.amount.toFixed(2)}</td>
                          <td className="py-2"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${p.status === "paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{p.status === "paid" ? "Paid" : "Due"}</span></td>
                          <td className="py-2 text-gray-500">{p.method}</td>
                          <td className="py-2 text-gray-500">{p.paidDate || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-500">Total Collected (9 months)</span>
                    <span className="text-lg font-bold text-[#0B1F3A]">${(c.securityMonthly * 9).toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-[380px] border-l border-gray-200 bg-white overflow-y-auto shrink-0">
        {/* Stage Card */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">Project Details</h3>
          <div className="bg-green-500 rounded-xl p-4 text-center text-white mb-4">
            <p className="text-lg font-bold">{c.solarStage}</p>
            <p className="text-sm opacity-80">Current Stage</p>
          </div>

          {/* Stage Description */}
          {stageDescription[c.solarStage || ""] && (
            <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4 text-center">
              <Info className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <p className="font-semibold text-sm mb-1">{c.solarStage}</p>
              <p className="text-xs text-gray-500">{stageDescription[c.solarStage || ""]}</p>
            </div>
          )}

          {/* System Summary */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-[#0B1F3A]">{c.systemSize} kW</p>
              <p className="text-xs text-gray-500">System Size</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-[#0B1F3A]">${c.systemPrice?.toLocaleString()}</p>
              <p className="text-xs text-gray-500">System Price</p>
            </div>
          </div>

          <h4 className="text-sm font-semibold text-[#0B1F3A] mb-2">System Summary <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] rounded-full ml-1">PV</span></h4>
          <div className="text-sm space-y-2 mb-4">
            <div className="flex justify-between"><span className="text-gray-500">Modules</span><span className="font-medium">{c.modules} {c.modulesType}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Battery</span><span className="text-gray-400">{c.batteryType || "—"}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Inverters</span><span className="font-medium text-xs">{c.inverterType}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Mount Type</span><span className="font-medium">{c.mountType}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Key Adders</span><span className="font-medium">{c.keyAdders.join(", ")}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Financing</span><span className="font-medium">{c.financing}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Battery Capacity</span><span className="text-gray-400">{c.batteryCapacity || "—"}</span></div>
          </div>

          {/* Domestic Content */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">🇺🇸</span>
              <span className="text-sm font-semibold text-[#0B1F3A]">Domestic Content</span>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-1.5 text-gray-500"></th>
                  <th className="text-center py-1.5 text-gray-500 font-medium">Designed BOM</th>
                  <th className="text-center py-1.5 text-gray-500 font-medium">Warehouse Issued</th>
                </tr>
              </thead>
              <tbody>
                {c.domesticContent.map((d, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-1.5 text-gray-600">{d.code}</td>
                    <td className="py-1.5 text-center font-medium">{d.designedBom}</td>
                    <td className="py-1.5 text-center"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded font-medium">{d.warehouseIssued}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[10px] text-gray-400 mt-1">Processed At: {c.processedAt.join(" / ")}</p>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-2 h-2 bg-yellow-200 rounded-sm"></div>
              <span className="text-[10px] text-gray-400">Below 45% Threshold</span>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="border-t border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-[#0B1F3A] mb-3">Notes</h3>
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input value={noteSearch} onChange={e => setNoteSearch(e.target.value)} placeholder="Search" className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#007A67]" />
            </div>
            <button className="flex items-center gap-1 px-2 py-1.5 text-xs text-[#007A67] font-medium"><Filter className="w-3 h-3" /> Filters</button>
          </div>

          {/* Note Category Tabs */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {(["all", "project", "tickets", "communication", "reviews", "events"] as NoteFilter[]).map(f => (
              <button key={f} onClick={() => setNoteFilter(f)} className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${noteFilter === f ? "bg-[#0B1F3A] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Notes List */}
          <div className="space-y-3">
            {filteredNotes.map(n => (
              <div key={n.id} className="border-b border-gray-50 pb-3">
                <div className="flex items-start gap-2">
                  <div className="mt-1">
                    {n.type === "communication" && <Phone className="w-3.5 h-3.5 text-gray-400" />}
                    {n.type === "ticket" && <Ticket className="w-3.5 h-3.5 text-blue-400" />}
                    {n.type === "project" && <MessageSquare className="w-3.5 h-3.5 text-gray-400" />}
                    {n.type === "event" && <CalendarDays className="w-3.5 h-3.5 text-gray-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {n.commType && (
                          <div className="text-xs font-medium text-gray-700 mb-0.5">
                            Communication Note Added
                            <span className="ml-1.5 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px]">{n.commType}</span>
                          </div>
                        )}
                        {n.ticketRef && (
                          <div className="text-xs">
                            <span className="text-gray-600">{n.author} added a note to </span>
                            <a className="text-[#007A67] font-medium hover:underline cursor-pointer">Ticket {n.ticketRef}</a>
                          </div>
                        )}
                        {n.taskRef && !n.commType && (
                          <div className="text-xs text-gray-600">
                            {n.author} updated Brief Description of the Issue in <a className="text-[#007A67] font-medium hover:underline cursor-pointer">Task: {n.taskRef}</a>
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap">{n.date}</span>
                    </div>
                    {n.role && <p className="text-[10px] text-gray-400">{n.role}</p>}
                    {n.contactTo && <p className="text-[10px] text-gray-500"><strong>To:</strong> {n.contactTo}</p>}
                    {n.contactFrom && <p className="text-[10px] text-gray-500"><strong>From:</strong> {n.contactFrom}</p>}
                    <p className="text-xs text-gray-700 mt-1">{n.content}</p>
                    {n.tags.length > 0 && (
                      <div className="flex gap-1 mt-1.5">
                        {n.tags.map(t => <span key={t} className="text-[10px] text-gray-400">{t}</span>)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Summary Modal */}
      {showSummary && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowSummary(false)}>
          <div className="bg-white rounded-xl w-[700px] max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#7C5CBF]" />
                <h2 className="font-bold text-[#0B1F3A]">Project Summary</h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Apr 14, 2026, 6:31 PM</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-medium">LATEST</span>
                <span>1/1</span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-sm mb-1">Project {c.portalId} - {c.name}</h3>
                <p className="text-sm text-gray-600"><strong>Status:</strong> {c.solarStage} | <strong>Blockers:</strong> No</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-1">What&apos;s Holding It Up</h4>
                <p className="text-sm text-gray-500">Nothing blocking - project successfully completed and installed.</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Last Activity</h4>
                <table className="w-full text-sm">
                  <thead><tr className="border-b"><th className="text-left py-1 text-gray-500">Date</th><th className="text-left py-1 text-gray-500">Event</th></tr></thead>
                  <tbody>
                    {[
                      ["Mar 28", "Final inspection passed - project marked complete"],
                      ["Mar 26", "Final inspection scheduled and conducted"],
                      ["Mar 18", "PTO granted by Oncor Electric Delivery"],
                      ["Feb 27", "Installation completed by crew"],
                    ].map(([d, e], i) => (
                      <tr key={i} className="border-b border-gray-50"><td className="py-1.5 text-gray-600">{d}</td><td className="py-1.5 text-gray-600">{e}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-1">What&apos;s Next</h4>
                <p className="text-sm text-gray-500"><strong>Service Team:</strong> Monitor system performance and ensure customer satisfaction. Project transitioned to warranty/service phase.</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Key Milestones</h4>
                <table className="w-full text-sm">
                  <thead><tr className="border-b"><th className="text-left py-1 text-gray-500">Stage</th><th className="text-left py-1 text-gray-500">Date</th><th className="text-left py-1 text-gray-500">Duration</th><th className="text-left py-1 text-gray-500">Status</th></tr></thead>
                  <tbody>
                    {[
                      ["Sale", "May 6", "-", "Complete"],
                      ["Survey", "May 14", "8d", "Complete"],
                      ["Design", "May 23", "9d", "Complete"],
                      ["Engineering", "Jun 9", "17d", "Complete"],
                      ["HOA Approval", "Jun 23", "2w", "Complete"],
                      ["Permitting", "Jul 30", "5w", "Complete"],
                      ["Scheduling", "Jan 28", "26w", "Complete"],
                      ["Installation", "Feb 27", "4w", "Complete"],
                      ["Inspection", "Mar 26", "4w", "Complete"],
                      ["PTO", "Mar 18", "-", "Complete"],
                      ["Final Completed", "Mar 28", "10d", "Complete"],
                    ].map(([s, d, dur, st], i) => (
                      <tr key={i} className="border-b border-gray-50">
                        <td className="py-1.5">{s}</td><td className="py-1.5 text-gray-600">{d}</td><td className="py-1.5 text-gray-500">{dur}</td><td className="py-1.5 text-gray-600">{st}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400 italic">Timeline Note: 326 days elapsed from sale to completion. Project experienced extended delays during scheduling phase (26 weeks), likely due to installation queue backlog. However, project successfully completed with all inspections passed and system operational.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
