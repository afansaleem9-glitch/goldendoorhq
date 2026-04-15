"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Sun, Shield, Home, Wifi, ChevronDown, Phone, Mail, MapPin,
  ExternalLink, Edit3, Sparkles, CheckCircle2, Clock,
  Search, FileText, Info, Headphones, Download, CreditCard, FileCheck, DollarSign,
  PhoneCall, Paperclip, Lock, TrendingUp, Receipt,
  Activity, Wrench, Camera, Router
} from "lucide-react";
import { PipelineTab } from "@/components/PipelineTab";

const c = {
  id: "1", portalId: 559302, name: "Lynna Dy", phone: "(469) 212-4849", email: "lynna.dy@email.com",
  address: "2716 Helen Lane", city: "Mesquite", state: "TX", zip: "75181",
  specifications: "Husband Jared Simpson 469-490-7940 is auth.",
  verticals: ["solar", "security"] as string[],
  solarStage: "Final Completed", systemSize: 13.77, systemPrice: 40990, modules: 34,
  modulesType: "JA SOLAR 405Ws", inverterType: "1 SolarEdge USE10000H-USMNBL75",
  mountType: "Roof Mount - Comp Shingle", financing: "Sunrun PPA",
  keyAdders: ["Rebate", "Multiple Planes"],
  serviceBranch: "Fort Worth", installBranch: "Dallas", utility: "Oncor",
  salesRep: "Matthew Johnson", dealer: "Delta Power Group",
  submitted: "May 05, 2025", createdOn: "May 05, 2025",
  branchManager: "Austin Radford", branchManagerEmail: "aradford@deltapowergroup.com",
  expectedHours: "78h 25m",
  // Security
  securityPackage: "Premium", securityMonthly: 49.99, securityStatus: "Active",
  securityInstallDate: "May 10, 2025", securityContractTerm: "36 months", securityRenewalDate: "May 10, 2028",
  securityDevices: [
    { type: "Door/Window Sensor", qty: 8, model: "2GIG-DW30-345" },
    { type: "Motion Detector", qty: 2, model: "2GIG-PIR1-345" },
    { type: "Smart Thermostat", qty: 1, model: "Honeywell T6 Pro" },
    { type: "Doorbell Camera", qty: 1, model: "Ring Pro 2" },
    { type: "Indoor Camera", qty: 2, model: "Ring Stick Up" },
    { type: "Smart Lock", qty: 2, model: "Yale Assure" },
    { type: "Control Panel", qty: 1, model: "2GIG GC3e" },
  ],
  securityServiceCalls: [
    { date: "Jun 15, 2025", type: "False Alarm", resolution: "Adjusted sensor sensitivity", tech: "Samuel Elliott" },
    { date: "Aug 22, 2025", type: "Equipment Swap", resolution: "Replaced faulty motion detector", tech: "Nelson Bonilla" },
  ],
  // AT&T
  attPlan: "Fiber 1Gbps", attStatus: "Active", attMonthly: 79.99,
  attInstallDate: "May 15, 2025", attContractTerm: "24 months",
  attEquipment: [
    { type: "Gateway Router", model: "BGW320-505", status: "Active" },
    { type: "Wi-Fi Extender", model: "Airties 4960", qty: 2, status: "Active" },
  ],
  attServiceTickets: [
    { date: "Jul 03, 2025", issue: "Speed below advertised", resolution: "Firmware update applied", status: "Resolved" },
  ],
  // Roofing
  roofType: "Comp Shingle", roofStatus: "Completed", roofCost: 14200, roofSqFt: 2400,
  roofPermitStatus: "Approved",
  roofWarranty: { type: "Manufacturer + Workmanship", years: 25, endDate: "Jun 2050" },
  roofInspections: [
    { date: "May 20, 2025", type: "Pre-Install", result: "Passed", inspector: "City of Mesquite" },
    { date: "Jun 05, 2025", type: "Final", result: "Passed", inspector: "City of Mesquite" },
  ],
  roofInstallDates: { start: "May 25, 2025", end: "May 28, 2025" },
  // Warranties
  warranties: [
    { type: "Workmanship", years: 10, endDate: "Jun 20, 2035", status: "active" },
    { type: "Roof Penetration", years: 10, endDate: "Jun 20, 2035", status: "active" },
    { type: "Production Guarantee", years: 0, endDate: "N/A", status: "inactive" },
  ],
  documents: [
    { name: "Acknowledgement Of Utility Billing Practices", status: "Complete", creator: "Sukhjeet Johal" },
    { name: "Texas Permit Authorization", status: "Complete", creator: "Sukhjeet Johal" },
    { name: "Opt-In To Receive Calls And/Or Text Messages", status: "Complete", creator: "Sukhjeet Johal" },
  ],
  sowVersion: "v1.3", sowStatus: "Draft", sowCreator: "LIGHTSPEED Automation", sowUpdated: "01/12/2026, 4:57 pm",
  sowSpecs: { size: 13.77, modules: "34 JA SOLAR 405Ws", inverters: "1 SolarEdge" },
  sowAdders: [{ name: "Rebate", cost: 500 }, { name: "*Multiple Planes", cost: 900 }],
  sowFinancials: { grossPrice: 40989.94, financeAmount: 40989.94, grossPPW: 2.98 },
  fieldVisits: [
    { type: "Inspection", subtype: "PV Final", date: "Jul 1, 2025 @ 7:00 AM", status: "AHJ - Confirmed", creator: "Christopher Smith", crew: "Neslon Bonilla" },
    { type: "Install", subtype: "Additional Install Day", date: "Jun 20, 2025 @ 5:00 AM", status: "Homeowner - Confirmed", creator: "Samuel Elliott" },
    { type: "Install", subtype: "PV Install", date: "Jun 19, 2025 @ 7:00 AM", status: "Homeowner - Confirmed", creator: "Maria Montano Siguenza" },
    { type: "Install", subtype: "PV Install", date: "Jun 18, 2025 @ 7:00 AM", status: "Homeowner - Confirmed", creator: "Maria Montano Siguenza" },
    { type: "Site Survey Visit", subtype: "", date: "May 7, 2025 @ 1:30 PM", status: "Complete", creator: "Robert Dellavecchia" },
  ],
  hubspotFiles: [
    { id: "f1", name: "Signed_Contract_LynnaDy.pdf", size: "2.4 MB", uploaded: "May 05, 2025", uploadedBy: "Matthew Johnson", category: "Contract" },
    { id: "f2", name: "Site_Survey_Photos.zip", size: "48.2 MB", uploaded: "May 07, 2025", uploadedBy: "Robert Dellavecchia", category: "Survey" },
    { id: "f3", name: "Design_Layout_v3.pdf", size: "1.8 MB", uploaded: "May 23, 2025", uploadedBy: "LIGHTSPEED Automation", category: "Design" },
    { id: "f4", name: "Permit_Approval_Mesquite.pdf", size: "340 KB", uploaded: "Jun 23, 2025", uploadedBy: "Permitting Team", category: "Permit" },
    { id: "f5", name: "HOA_Approval_Letter.pdf", size: "210 KB", uploaded: "Jun 18, 2025", uploadedBy: "HOA Coordinator", category: "HOA" },
    { id: "f6", name: "Interconnection_Agreement.pdf", size: "580 KB", uploaded: "Mar 08, 2026", uploadedBy: "Lotoannalelei Tootoo", category: "Utility" },
    { id: "f7", name: "PTO_Confirmation_Oncor.pdf", size: "125 KB", uploaded: "Mar 18, 2026", uploadedBy: "Oncor Electric", category: "Utility" },
    { id: "f8", name: "Warranty_Certificate.pdf", size: "290 KB", uploaded: "Mar 28, 2026", uploadedBy: "System Auto", category: "Warranty" },
    { id: "f9", name: "Wells_Fargo_Equipment_Agreement.pdf", size: "1.1 MB", uploaded: "May 05, 2025", uploadedBy: "Matthew Johnson", category: "Finance" },
    { id: "f10", name: "Customer_ID_Verification.pdf", size: "890 KB", uploaded: "May 05, 2025", uploadedBy: "Matthew Johnson", category: "Verification" },
  ],
  recordedCalls: [
    { id: "rc1", date: "Jul 28, 2025", duration: "12:34", direction: "inbound", agent: "Jamie Belford", summary: "Production concern — customer asking about expected vs actual production numbers.", sentiment: "concerned" },
    { id: "rc2", date: "Jul 11, 2025", duration: "8:45", direction: "inbound", agent: "Robert Brabec", summary: "Customer calling about system activation status. Confirmed monitoring setup in progress.", sentiment: "neutral" },
    { id: "rc3", date: "Jul 11, 2025", duration: "4:22", direction: "inbound", agent: "AI Agent - Raya", summary: "AI Agent handled inquiry about system performance dashboard access.", sentiment: "positive" },
    { id: "rc4", date: "May 05, 2025", duration: "22:10", direction: "outbound", agent: "Matthew Johnson", summary: "Initial sales call. Discussed system size, financing options, and timeline.", sentiment: "positive" },
    { id: "rc5", date: "Jun 18, 2025", duration: "3:12", direction: "outbound", agent: "Maria Montano Siguenza", summary: "Install day 1 confirmation call.", sentiment: "positive" },
    { id: "rc6", date: "May 07, 2025", duration: "6:45", direction: "outbound", agent: "Robert Dellavecchia", summary: "Pre-survey call to confirm appointment and discuss access requirements.", sentiment: "neutral" },
  ],
  emailHistory: [
    { id: "em1", date: "Jul 08, 2025", subject: "Monitoring & Activation Instructions", from: "Brianna Warren", to: "Lynna Dy", direction: "outbound", status: "delivered", opened: true },
    { id: "em2", date: "Jul 07, 2025", subject: "Utility Documents - Signature Required", from: "Angelique Harper", to: "Lynna Dy", direction: "outbound", status: "delivered", opened: true },
    { id: "em3", date: "Jun 23, 2025", subject: "Your Permit Has Been Approved!", from: "notifications@dpg.com", to: "Lynna Dy", direction: "outbound", status: "delivered", opened: true },
    { id: "em4", date: "Jun 18, 2025", subject: "Installation Schedule Confirmation", from: "scheduling@dpg.com", to: "Lynna Dy", direction: "outbound", status: "delivered", opened: true },
    { id: "em5", date: "May 23, 2025", subject: "Design Approval Needed", from: "design@dpg.com", to: "Lynna Dy", direction: "outbound", status: "delivered", opened: true },
    { id: "em6", date: "May 05, 2025", subject: "Welcome to Delta Power Group!", from: "welcome@dpg.com", to: "Lynna Dy", direction: "outbound", status: "delivered", opened: true },
    { id: "em7", date: "Jul 15, 2025", subject: "Re: Production Concern", from: "Lynna Dy", to: "support@dpg.com", direction: "inbound", status: "received", opened: true },
    { id: "em8", date: "Mar 28, 2026", subject: "Your Solar System is Fully Operational!", from: "success@dpg.com", to: "Lynna Dy", direction: "outbound", status: "delivered", opened: true },
  ],
  contracts: [
    { id: "ct1", name: "Solar Installation Agreement", signedDate: "May 05, 2025", status: "executed", signedBy: "Lynna Dy", docusignId: "ENV-8827364", amount: 40990 },
    { id: "ct2", name: "Wells Fargo Equipment Finance Agreement", signedDate: "May 05, 2025", status: "executed", signedBy: "Lynna Dy", docusignId: "ENV-8827365", amount: 40990 },
    { id: "ct3", name: "Sunrun PPA Agreement", signedDate: "May 05, 2025", status: "executed", signedBy: "Lynna Dy / Jared Simpson", docusignId: "ENV-8827366", amount: 0 },
    { id: "ct4", name: "Texas Permit Authorization", signedDate: "May 05, 2025", status: "executed", signedBy: "Lynna Dy", docusignId: "ENV-8827367", amount: 0 },
    { id: "ct5", name: "Interconnection Agreement - Oncor", signedDate: "Mar 08, 2026", status: "executed", signedBy: "Lynna Dy", docusignId: "ENV-9114522", amount: 0 },
  ],
  creditProfile: {
    score: 742, tier: "A", pullDate: "May 05, 2025", bureau: "Experian", approved: true,
    monthlyIncome: 8500, dti: 32, maxApproved: 55000,
    financierDecisions: [
      { financier: "GoodLeap", decision: "Approved", rate: "1.49%", term: "25 years", maxAmount: 50000, date: "May 05, 2025" },
      { financier: "Mosaic", decision: "Approved", rate: "1.99%", term: "25 years", maxAmount: 48000, date: "May 05, 2025" },
      { financier: "Sunrun PPA", decision: "Approved", rate: "PPA", term: "25 years", maxAmount: 0, date: "May 05, 2025" },
    ]
  },
  monitoringPayments: [
    { month: "Jul 2025", amount: 49.99, status: "paid", method: "Visa ****4821" },
    { month: "Aug 2025", amount: 49.99, status: "paid", method: "Visa ****4821" },
    { month: "Sep 2025", amount: 49.99, status: "paid", method: "Visa ****4821" },
    { month: "Oct 2025", amount: 49.99, status: "paid", method: "Visa ****4821" },
    { month: "Nov 2025", amount: 49.99, status: "paid", method: "Visa ****4821" },
    { month: "Dec 2025", amount: 49.99, status: "paid", method: "Visa ****4821" },
    { month: "Jan 2026", amount: 49.99, status: "paid", method: "Visa ****4821" },
    { month: "Feb 2026", amount: 49.99, status: "paid", method: "Visa ****4821" },
    { month: "Mar 2026", amount: 49.99, status: "paid", method: "Visa ****4821" },
    { month: "Apr 2026", amount: 49.99, status: "due", method: "Visa ****4821" },
  ],
  activityFeed: [
    { id: "a1", type: "communication", vertical: "solar", author: "Jamie Belford", role: "Support", content: "Production concern - Jamie B 7/28/25", date: "Jul 28, 2025", tags: ["Final Completed"] },
    { id: "a2", type: "communication", vertical: "solar", author: "Robert Brabec", role: "Support", content: "7/11/25 calling about system activation", date: "Jul 11, 2025", tags: ["Final Completed"] },
    { id: "a3", type: "project", vertical: "solar", author: "Brianna Warren", role: "Monitoring Admin", content: "Sent monitoring and activation emails - requested FSD for IA and site access.", date: "Jul 08, 2025", tags: ["Monitoring"] },
    { id: "a4", type: "ticket", vertical: "solar", author: "Lotoannalelei Tootoo", role: "Interconnection Specialist", content: "Interconnection Agreement complete.", date: "Jul 08, 2025", tags: ["Final Review"], ticketRef: "#2661773" },
    { id: "a5", type: "service", vertical: "security", author: "Samuel Elliott", role: "Installer", content: "False alarm - adjusted sensor sensitivity on zone 3.", date: "Jun 15, 2025", tags: ["Smart Home"] },
    { id: "a6", type: "service", vertical: "att", author: "AT&T Tech", role: "Field Tech", content: "Firmware update applied to BGW320 gateway. Speed test confirmed 940Mbps.", date: "Jul 03, 2025", tags: ["AT&T"] },
    { id: "a7", type: "milestone", vertical: "roofing", author: "City of Mesquite", role: "Inspector", content: "Final roofing inspection passed. All permits closed.", date: "Jun 05, 2025", tags: ["Roofing"] },
  ],
};

type MainTab = "snapshot" | "pipeline" | "details" | "sow" | "bom" | "dna";
type DNASection = "overview" | "files" | "calls" | "emails" | "contracts" | "credit" | "alarm" | "att" | "roofing" | "activity";

const visitStatusColors: Record<string, string> = {
  "AHJ - Confirmed": "bg-black text-white",
  "Homeowner - Confirmed": "bg-gray-800 text-white",
  "Complete": "bg-black text-white",
  "Pending": "bg-gray-200 text-gray-700",
};

const verticalBadge: Record<string, string> = {
  solar: "border-black text-black",
  security: "border-gray-600 text-gray-700",
  roofing: "border-gray-400 text-gray-600",
  att: "border-gray-500 text-gray-600",
};

export default function CustomerDetail() {
  const params = useParams();
  const [mainTab, setMainTab] = useState<MainTab>("snapshot");
  const [dnaSection, setDnaSection] = useState<DNASection>("overview");
  const [activeVertical, setActiveVertical] = useState("solar");

  const tabs: { key: MainTab; label: string }[] = [
    { key: "snapshot", label: "SNAPSHOT" },
    { key: "pipeline", label: "PIPELINE" },
    { key: "details", label: "PROJECT DETAILS" },
    { key: "sow", label: "SCOPE OF WORK" },
    { key: "bom", label: "BILL OF MATERIALS" },
    { key: "dna", label: "CUSTOMER DNA" },
  ];

  const dnaTabs: { key: DNASection; label: string }[] = [
    { key: "overview", label: "OVERVIEW" },
    { key: "files", label: "FILES & DOCS" },
    { key: "calls", label: "RECORDED CALLS" },
    { key: "emails", label: "EMAILS" },
    { key: "contracts", label: "AGREEMENTS" },
    { key: "credit", label: "CREDIT PROFILE" },
    { key: "alarm", label: "ALARM / SECURITY" },
    { key: "att", label: "AT&T / TELECOM" },
    { key: "roofing", label: "ROOFING" },
    { key: "activity", label: "ACTIVITY FEED" },
  ];

  const lifetimeValue = c.systemPrice + (c.roofCost || 0) + (c.securityMonthly * 36) + (c.attMonthly * 24);

  return (
    <div className="flex h-[calc(100vh-56px)]">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="bg-gray-100 px-6 py-2 text-sm text-gray-500 border-b border-gray-200">
          This project doesn&apos;t qualify for priority install scheduling.
        </div>

        {/* Timeline */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center gap-4 text-[11px] text-gray-500 mb-1">
            {["2025","2028","2031","2034","2038","2041","2044"].map(y => <span key={y}>{y}</span>)}
          </div>
          <div className="relative h-6">
            <div className="absolute inset-y-0 left-0 right-0 flex items-center">
              <div className="w-full h-0.5 bg-gray-200">
                <div className="absolute left-[2%] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-black flex items-center justify-center">
                  <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                </div>
                <div className="absolute left-[2%] -top-4 text-[11px] text-gray-500 font-medium">PTO</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <select className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-600 bg-white">
              <option>POST PTO TIMELINE - 25 YEARS</option>
            </select>
            <button className="text-xs text-gray-500 flex items-center gap-1 hover:text-black"><Info className="w-3 h-3" /> Timeline Help Guide</button>
          </div>
        </div>

        {/* Customer Header */}
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="flex gap-2 mb-3">
            {[
              { key: "solar", label: "Solar", icon: Sun },
              { key: "security", label: "Smart Home Security", icon: Shield },
            ].map(v => {
              const Icon = v.icon;
              return (
                <button key={v.key} onClick={() => setActiveVertical(v.key)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${activeVertical === v.key ? "bg-black text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  <Icon className="w-3.5 h-3.5" /> {v.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-500">Project</span>
                <span className="px-2 py-0.5 bg-black text-white text-[11px] rounded font-medium">Project Support</span>
                <span className="px-2 py-0.5 bg-gray-700 text-white text-[11px] rounded font-medium">Eagleview Design</span>
              </div>
              <h1 className="text-xl font-extrabold tracking-tight text-black mb-1">{c.name}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" className="rounded" /> Do Not Contact</label>
                <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" className="rounded" /> Hide customer timeline</label>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                <Sparkles className="w-4 h-4" /> Project Summary
              </button>
              <button className="flex items-center gap-2 px-5 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-900">
                Take Action <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-3 space-y-1.5 text-sm">
            <div className="flex items-center gap-2"><span className="text-gray-500 w-24 shrink-0">Specifications</span><span className="text-gray-700">{c.specifications}</span><button className="text-gray-500 hover:text-black"><Edit3 className="w-3.5 h-3.5" /></button></div>
            <div className="flex items-center gap-2"><span className="text-gray-500 w-24 shrink-0">Address</span><span className="text-gray-700">{c.address}, {c.city}, {c.state} {c.zip}</span></div>
            <div className="flex items-center gap-2"><span className="text-gray-500 w-24 shrink-0">Phone</span><a className="text-black font-medium hover:underline">{c.phone}</a></div>
            <div className="flex items-center gap-2"><span className="text-gray-500 w-24 shrink-0">Sales Rep</span><a className="text-black font-medium hover:underline">{c.salesRep}</a></div>
          </div>

          {/* Tab Nav */}
          <div className="flex items-center gap-0 mt-4 border-b border-gray-200 -mx-6 px-6 overflow-x-auto">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setMainTab(t.key)} className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap tracking-wider ${mainTab === t.key ? "text-black border-black" : "text-gray-500 border-transparent hover:text-gray-600"}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-6 py-4">
          {/* SNAPSHOT */}
          {mainTab === "snapshot" && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2"><h3 className="font-bold text-black">Specifications</h3><button className="text-gray-500 hover:text-black"><Edit3 className="w-4 h-4" /></button></div>
                <p className="text-sm text-gray-600">{c.specifications}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-bold text-black mb-3">Documents</h3>
                {c.documents.map((d, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-200/60 last:border-0">
                    <div><p className="text-sm font-medium text-black">{d.name}</p><p className="text-[11px] text-gray-500">Creator: {d.creator}</p></div>
                    <span className="px-2.5 py-0.5 bg-black text-white rounded text-[11px] font-medium">{d.status}</span>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-bold text-black mb-1">Scope of Work</h3>
                <p className="text-[11px] text-gray-500 mb-2 uppercase tracking-wider">SCOPE OF WORK</p>
                <div className="flex items-center justify-between">
                  <div><span className="font-semibold text-sm text-black">SOW {c.sowVersion}</span><span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-[11px] font-medium">{c.sowStatus}</span></div>
                  <p className="text-[11px] text-gray-500">Creator: {c.sowCreator} - {c.sowUpdated}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-bold text-black mb-1">Field Visits</h3>
                <p className="text-[11px] text-gray-500 mb-3 uppercase tracking-wider">PAST VISITS</p>
                {c.fieldVisits.map((v, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-200/60 last:border-0">
                    <div><p className="text-sm font-medium text-black">{v.type} · {v.subtype || v.type} · {v.date}</p><p className="text-[11px] text-gray-500">Creator: {v.creator}{v.crew ? ` - Crew: ${v.crew}` : ""}</p></div>
                    <span className={`px-3 py-1 rounded text-[11px] font-semibold whitespace-nowrap ${visitStatusColors[v.status] || "bg-gray-200 text-gray-700"}`}>{v.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PIPELINE */}
          {mainTab === "pipeline" && <PipelineTab />}

          {/* PROJECT DETAILS */}
          {mainTab === "details" && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-black">Project Details</h3><button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50">Edit</button></div>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  {[["Portal ID", c.portalId],["Created On", c.createdOn],["Submitted", c.submitted],["Install Branch", c.installBranch],["Service Branch", c.serviceBranch],["Stage", c.solarStage],["Mount Type", c.mountType],["Branch Manager", c.branchManager],["Expected Hours", c.expectedHours],["Address", `${c.address}, ${c.city}, ${c.state} ${c.zip}`]].map(([l,v],i) => (
                    <div key={i} className="flex justify-between px-2 py-1.5 odd:bg-gray-50 rounded"><span className="text-gray-500">{String(l)}</span><span className="font-medium text-black text-right">{String(v)}</span></div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-bold text-black mb-4">Warranty Information</h3>
                {c.warranties.map((w, i) => (
                  <div key={i} className="grid grid-cols-3 gap-4 text-sm py-2 border-b border-gray-200/60 last:border-0">
                    <div><p className="text-gray-500 text-[11px]">{w.type}</p><p className="font-medium">{w.years} years</p></div>
                    <div><p className="text-gray-500 text-[11px]">End Date</p><p className="font-medium">{w.endDate}</p></div>
                    <div><p className="text-gray-500 text-[11px]">Status</p><p className={`font-medium ${w.status === "active" ? "text-black" : "text-gray-500"}`}>{w.status === "active" ? "Active" : "Inactive"}</p></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCOPE OF WORK */}
          {mainTab === "sow" && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-1"><h2 className="text-lg font-extrabold text-black">SOW {c.sowVersion}</h2><span className="px-2.5 py-0.5 bg-gray-200 text-gray-700 text-xs font-medium rounded">{c.sowStatus}</span></div>
                <p className="text-[11px] text-gray-500 mb-6">Created by {c.sowCreator} · {c.sowUpdated}</p>
                <div className="grid grid-cols-3 gap-8">
                  <div><h4 className="font-bold text-sm text-black mb-3">System Specifications</h4><div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-gray-500">System Size</span><span className="font-medium">{c.sowSpecs.size} kW</span></div><div className="flex justify-between"><span className="text-gray-500">Modules</span><span className="font-medium">{c.sowSpecs.modules}</span></div><div className="flex justify-between"><span className="text-gray-500">Inverters</span><span className="font-medium">{c.sowSpecs.inverters}</span></div></div></div>
                  <div><h4 className="font-bold text-sm text-black mb-3">Adders</h4>{c.sowAdders.map((a,i) => <div key={i} className="flex justify-between text-sm mb-1"><span className="text-gray-500">{a.name}</span><span className="font-medium">${a.cost}</span></div>)}</div>
                  <div><h4 className="font-bold text-sm text-black mb-3">Financial Data</h4><div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-gray-500">Gross Price</span><span className="font-medium">${c.sowFinancials.grossPrice.toLocaleString()}</span></div><div className="flex justify-between"><span className="text-gray-500">Gross PPW</span><span className="font-medium">${c.sowFinancials.grossPPW}</span></div></div></div>
                </div>
              </div>
            </div>
          )}

          {/* BILL OF MATERIALS */}
          {mainTab === "bom" && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-black mb-4">Bill of Materials</h3>
              <table className="w-full text-sm"><thead><tr className="border-b border-gray-200"><th className="text-left py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Item</th><th className="text-left py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Qty</th><th className="text-left py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Model</th><th className="text-left py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th></tr></thead>
              <tbody>{[["Solar Modules","34","JA SOLAR 405W"],["Inverter","1","SolarEdge USE10000H"],["Racking","1 set","IronRidge XR100"],["Conduit","85 ft","3/4\" EMT"],["Wire","320 ft","THWN-2 Copper"],["DC Disconnect","1","Eaton 60A"],["AC Disconnect","1","Eaton 60A"],["Optimizers","34","SolarEdge P505"],["Roof Attachments","68","Quick Mount PV"],["Junction Box","2","Milbank"]].map(([item,qty,model],i) => (
                <tr key={i} className="border-b border-gray-200/60"><td className="py-2 font-semibold text-black">{item}</td><td className="py-2 text-gray-600">{qty}</td><td className="py-2 text-gray-600">{model}</td><td className="py-2"><span className="px-2 py-0.5 bg-black text-white rounded text-[11px] font-medium">Issued</span></td></tr>
              ))}</tbody></table>
            </div>
          )}

          {/* CUSTOMER DNA */}
          {mainTab === "dna" && (
            <div className="space-y-4">
              <div className="flex items-center gap-0 overflow-x-auto border-b border-gray-200 -mt-2 pb-0">
                {dnaTabs.map(t => (
                  <button key={t.key} onClick={() => setDnaSection(t.key)} className={`px-3 py-2.5 text-[11px] font-semibold whitespace-nowrap border-b-2 transition-all tracking-wider ${dnaSection === t.key ? "text-black border-black" : "text-gray-500 border-transparent hover:text-gray-600"}`}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* DNA: OVERVIEW */}
              {dnaSection === "overview" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-3">
                    <div className="bg-black rounded-xl p-4 text-white"><p className="text-3xl font-extrabold">92</p><p className="text-[11px] text-white/50 font-semibold uppercase tracking-wider mt-1">Health Score</p></div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4"><p className="text-2xl font-extrabold text-black">${(lifetimeValue / 1000).toFixed(0)}K</p><p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mt-1">Lifetime Value</p></div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4"><p className="text-2xl font-extrabold text-black">2 of 4</p><p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mt-1">Active Verticals</p></div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4"><p className="text-2xl font-extrabold text-black">Jul 28</p><p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mt-1">Last Interaction</p></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl border border-gray-200 p-4"><div className="flex items-center gap-2 mb-2"><Sun className="w-4 h-4" /><span className="font-bold text-black">Solar</span><span className="ml-auto px-2 py-0.5 bg-black text-white rounded text-[11px] font-medium">{c.solarStage}</span></div><div className="text-sm text-gray-500">{c.systemSize} kW · ${c.systemPrice.toLocaleString()} · {c.financing}</div></div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4"><div className="flex items-center gap-2 mb-2"><Shield className="w-4 h-4" /><span className="font-bold text-black">Smart Home Security</span><span className="ml-auto px-2 py-0.5 bg-black text-white rounded text-[11px] font-medium">{c.securityStatus}</span></div><div className="text-sm text-gray-500">{c.securityPackage} · ${c.securityMonthly}/mo · 24/7 Monitoring</div></div>
                  </div>
                </div>
              )}

              {/* DNA: FILES */}
              {dnaSection === "files" && (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-black">All Files ({c.hubspotFiles.length})</h3><button className="px-3 py-1.5 bg-black text-white text-xs font-semibold rounded-lg hover:bg-gray-900"><Paperclip className="w-3 h-3 inline mr-1" />Upload</button></div>
                  <table className="w-full text-sm"><thead><tr className="border-b border-gray-200"><th className="text-left py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">File</th><th className="text-left py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Category</th><th className="text-left py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Size</th><th className="text-left py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Uploaded</th><th className="py-2"></th></tr></thead>
                  <tbody>{c.hubspotFiles.map(f => (
                    <tr key={f.id} className="border-b border-gray-200/60 hover:bg-gray-50/50"><td className="py-2.5"><div className="flex items-center gap-2"><FileText className="w-4 h-4 text-gray-500" /><span className="font-medium text-black">{f.name}</span></div></td><td className="py-2.5"><span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{f.category}</span></td><td className="py-2.5 text-gray-500">{f.size}</td><td className="py-2.5 text-gray-500 text-xs">{f.uploaded}</td><td className="py-2.5"><button className="text-gray-500 hover:text-black"><Download className="w-4 h-4" /></button></td></tr>
                  ))}</tbody></table>
                </div>
              )}

              {/* DNA: CALLS */}
              {dnaSection === "calls" && (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-black">Recorded Calls ({c.recordedCalls.length})</h3><button className="px-3 py-1.5 bg-black text-white text-xs font-semibold rounded-lg hover:bg-gray-900"><PhoneCall className="w-3 h-3 inline mr-1" />Log Call</button></div>
                  <div className="space-y-3">{c.recordedCalls.map(call => (
                    <div key={call.id} className="border border-gray-200/60 rounded-xl p-4 hover:border-gray-300 transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${call.direction === "inbound" ? "bg-gray-200" : "bg-black"}`}><PhoneCall className={`w-4 h-4 ${call.direction === "inbound" ? "text-gray-600" : "text-white"}`} /></div>
                          <div><p className="text-sm font-semibold text-black">{call.direction === "inbound" ? "Inbound" : "Outbound"} Call</p><p className="text-[11px] text-gray-500">{call.agent} · {call.duration}</p></div>
                        </div>
                        <div className="flex items-center gap-2"><span className={`px-2 py-0.5 rounded text-[11px] font-medium ${call.sentiment === "positive" ? "bg-gray-100 text-black" : call.sentiment === "concerned" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600"}`}>{call.sentiment}</span><span className="text-[11px] text-gray-500">{call.date}</span></div>
                      </div>
                      <p className="text-sm text-gray-600 ml-11">{call.summary}</p>
                      <div className="ml-11 mt-2 flex items-center gap-2"><button className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200"><Headphones className="w-3 h-3" /> Play</button><button className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200"><Download className="w-3 h-3" /> Download</button></div>
                    </div>
                  ))}</div>
                </div>
              )}

              {/* DNA: EMAILS */}
              {dnaSection === "emails" && (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-black">Email History ({c.emailHistory.length})</h3></div>
                  <table className="w-full text-sm"><thead><tr className="border-b border-gray-200"><th className="py-2 w-6"></th><th className="text-left py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Subject</th><th className="text-left py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">From</th><th className="text-left py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Date</th><th className="text-left py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th></tr></thead>
                  <tbody>{c.emailHistory.map(em => (
                    <tr key={em.id} className="border-b border-gray-200/60 hover:bg-gray-50/50"><td className="py-2"><Mail className={`w-3.5 h-3.5 ${em.direction === "inbound" ? "text-gray-500" : "text-black"}`} /></td><td className="py-2 font-medium text-black">{em.subject}</td><td className="py-2 text-gray-500 text-xs">{em.from}</td><td className="py-2 text-gray-500 text-xs">{em.date}</td><td className="py-2"><span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[11px] font-medium">{em.status}{em.opened ? " · Opened" : ""}</span></td></tr>
                  ))}</tbody></table>
                </div>
              )}

              {/* DNA: CONTRACTS */}
              {dnaSection === "contracts" && (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-black">Agreements ({c.contracts.length})</h3></div>
                  <div className="space-y-3">{c.contracts.map(ct => (
                    <div key={ct.id} className="border border-gray-200/60 rounded-xl p-4 hover:border-gray-300 transition-all">
                      <div className="flex items-start justify-between"><div><p className="font-semibold text-black">{ct.name}</p><p className="text-[11px] text-gray-500 mt-0.5">DocuSign: {ct.docusignId} · Signed by {ct.signedBy}</p></div><div className="flex items-center gap-2"><span className="px-2 py-0.5 bg-black text-white rounded text-[11px] font-medium">{ct.status}</span>{ct.amount > 0 && <span className="text-sm font-bold text-black">${ct.amount.toLocaleString()}</span>}</div></div>
                      <div className="flex items-center gap-3 mt-2"><span className="text-[11px] text-gray-500">Signed: {ct.signedDate}</span><button className="text-[11px] text-black font-medium hover:underline flex items-center gap-1"><ExternalLink className="w-3 h-3" /> View</button><button className="text-[11px] text-black font-medium hover:underline flex items-center gap-1"><Download className="w-3 h-3" /> Download</button></div>
                    </div>
                  ))}</div>
                </div>
              )}

              {/* DNA: CREDIT PROFILE */}
              {dnaSection === "credit" && (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-black">Credit Profile</h3><div className="flex items-center gap-2 text-[11px] text-gray-500"><Lock className="w-3 h-3" /> Confidential · {c.creditProfile.pullDate}</div></div>
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      <div className="bg-black rounded-xl p-4 text-center text-white"><p className="text-3xl font-extrabold">{c.creditProfile.score}</p><p className="text-[11px] text-white/50 font-semibold uppercase tracking-wider">Score</p><p className="text-[11px] text-white/30 mt-1">{c.creditProfile.bureau}</p></div>
                      <div className="bg-gray-50 rounded-xl p-4 text-center"><p className="text-2xl font-extrabold text-black">{c.creditProfile.tier}</p><p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Tier</p></div>
                      <div className="bg-gray-50 rounded-xl p-4 text-center"><p className="text-2xl font-extrabold text-black">{c.creditProfile.dti}%</p><p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">DTI</p></div>
                      <div className="bg-gray-50 rounded-xl p-4 text-center"><p className="text-2xl font-extrabold text-black">${(c.creditProfile.maxApproved / 1000).toFixed(0)}K</p><p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Max Approved</p></div>
                    </div>
                    <h4 className="font-bold text-sm text-black mb-3">Financier Decisions</h4>
                    <table className="w-full text-sm"><thead><tr className="border-b border-gray-200"><th className="text-left py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Financier</th><th className="text-left py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Decision</th><th className="text-left py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Rate</th><th className="text-left py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Term</th><th className="text-left py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Max</th></tr></thead>
                    <tbody>{c.creditProfile.financierDecisions.map((fd,i) => (
                      <tr key={i} className="border-b border-gray-200/60"><td className="py-2 font-medium text-black">{fd.financier}</td><td className="py-2"><span className="px-2 py-0.5 bg-black text-white rounded text-[11px] font-medium">{fd.decision}</span></td><td className="py-2 text-gray-600">{fd.rate}</td><td className="py-2 text-gray-600">{fd.term}</td><td className="py-2 text-gray-600">{fd.maxAmount > 0 ? `$${fd.maxAmount.toLocaleString()}` : "N/A"}</td></tr>
                    ))}</tbody></table>
                  </div>
                </div>
              )}

              {/* DNA: ALARM / SECURITY */}
              {dnaSection === "alarm" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-3">
                    <div className="bg-black rounded-xl p-4 text-white"><p className="text-lg font-extrabold">{c.securityPackage}</p><p className="text-[11px] text-white/50 uppercase tracking-wider">Package</p></div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4"><p className="text-lg font-extrabold text-black">${c.securityMonthly}/mo</p><p className="text-[11px] text-gray-500 uppercase tracking-wider">Monthly</p></div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4"><p className="text-lg font-extrabold text-black">{c.securityStatus}</p><p className="text-[11px] text-gray-500 uppercase tracking-wider">Status</p></div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4"><p className="text-lg font-extrabold text-black">{c.securityContractTerm}</p><p className="text-[11px] text-gray-500 uppercase tracking-wider">Contract</p></div>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <h3 className="font-bold text-black mb-3">Device Inventory ({c.securityDevices.reduce((s,d) => s + d.qty, 0)} devices)</h3>
                    <table className="w-full text-sm"><thead><tr className="border-b border-gray-200"><th className="text-left py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Device</th><th className="text-left py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Qty</th><th className="text-left py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Model</th></tr></thead>
                    <tbody>{c.securityDevices.map((d,i) => <tr key={i} className="border-b border-gray-200/60"><td className="py-2 font-medium text-black">{d.type}</td><td className="py-2 text-gray-600">{d.qty}</td><td className="py-2 text-gray-500">{d.model}</td></tr>)}</tbody></table>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                      <h3 className="font-bold text-black mb-3">Payment History</h3>
                      {c.monitoringPayments.map((p,i) => (
                        <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-200/60 last:border-0 text-sm">
                          <span className="text-gray-600">{p.month}</span>
                          <div className="flex items-center gap-2"><span className="font-medium text-black">${p.amount}</span><span className={`px-2 py-0.5 rounded text-[11px] font-medium ${p.status === "paid" ? "bg-gray-100 text-gray-700" : "bg-gray-800 text-white"}`}>{p.status}</span></div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                      <h3 className="font-bold text-black mb-3">Service Calls</h3>
                      {c.securityServiceCalls.map((s,i) => (
                        <div key={i} className="border border-gray-200/60 rounded-lg p-3 mb-2 last:mb-0">
                          <div className="flex items-center justify-between mb-1"><span className="font-semibold text-sm text-black">{s.type}</span><span className="text-[11px] text-gray-500">{s.date}</span></div>
                          <p className="text-sm text-gray-600">{s.resolution}</p><p className="text-[11px] text-gray-500 mt-1">Tech: {s.tech}</p>
                        </div>
                      ))}
                      <div className="mt-3 pt-3 border-t border-gray-200/60 text-sm"><div className="flex justify-between mb-1"><span className="text-gray-500">Installed</span><span className="font-medium text-black">{c.securityInstallDate}</span></div><div className="flex justify-between"><span className="text-gray-500">Renewal</span><span className="font-medium text-black">{c.securityRenewalDate}</span></div></div>
                    </div>
                  </div>
                </div>
              )}

              {/* DNA: AT&T */}
              {dnaSection === "att" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-3">
                    <div className="bg-black rounded-xl p-4 text-white"><p className="text-lg font-extrabold">{c.attPlan}</p><p className="text-[11px] text-white/50 uppercase tracking-wider">Plan</p></div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4"><p className="text-lg font-extrabold text-black">${c.attMonthly}/mo</p><p className="text-[11px] text-gray-500 uppercase tracking-wider">Monthly</p></div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4"><p className="text-lg font-extrabold text-black">{c.attStatus}</p><p className="text-[11px] text-gray-500 uppercase tracking-wider">Status</p></div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4"><p className="text-lg font-extrabold text-black">{c.attContractTerm}</p><p className="text-[11px] text-gray-500 uppercase tracking-wider">Contract</p></div>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <h3 className="font-bold text-black mb-3">Equipment</h3>
                    <table className="w-full text-sm"><thead><tr className="border-b border-gray-200"><th className="text-left py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Type</th><th className="text-left py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Model</th><th className="text-left py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th></tr></thead>
                    <tbody>{c.attEquipment.map((e,i) => <tr key={i} className="border-b border-gray-200/60"><td className="py-2 font-medium text-black">{e.type}</td><td className="py-2 text-gray-600">{e.model}</td><td className="py-2"><span className="px-2 py-0.5 bg-black text-white rounded text-[11px] font-medium">{e.status}</span></td></tr>)}</tbody></table>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <h3 className="font-bold text-black mb-3">Service Tickets</h3>
                    {c.attServiceTickets.map((t,i) => (
                      <div key={i} className="border border-gray-200/60 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1"><span className="font-semibold text-sm text-black">{t.issue}</span><span className="text-[11px] text-gray-500">{t.date}</span></div>
                        <p className="text-sm text-gray-600">{t.resolution}</p>
                        <span className="mt-1 inline-block px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[11px] font-medium">{t.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* DNA: ROOFING */}
              {dnaSection === "roofing" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-3">
                    <div className="bg-black rounded-xl p-4 text-white"><p className="text-lg font-extrabold">{c.roofType}</p><p className="text-[11px] text-white/50 uppercase tracking-wider">Type</p></div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4"><p className="text-lg font-extrabold text-black">${c.roofCost.toLocaleString()}</p><p className="text-[11px] text-gray-500 uppercase tracking-wider">Cost</p></div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4"><p className="text-lg font-extrabold text-black">{c.roofSqFt.toLocaleString()} sq ft</p><p className="text-[11px] text-gray-500 uppercase tracking-wider">Area</p></div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4"><p className="text-lg font-extrabold text-black">{c.roofStatus}</p><p className="text-[11px] text-gray-500 uppercase tracking-wider">Status</p></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                      <h3 className="font-bold text-black mb-3">Project Timeline</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-500">Install Start</span><span className="font-medium text-black">{c.roofInstallDates.start}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Install End</span><span className="font-medium text-black">{c.roofInstallDates.end}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Permit</span><span className="font-medium text-black">{c.roofPermitStatus}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Warranty</span><span className="font-medium text-black">{c.roofWarranty.years}-Year {c.roofWarranty.type}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Warranty Expires</span><span className="font-medium text-black">{c.roofWarranty.endDate}</span></div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                      <h3 className="font-bold text-black mb-3">Inspections</h3>
                      {c.roofInspections.map((ins,i) => (
                        <div key={i} className="border border-gray-200/60 rounded-lg p-3 mb-2 last:mb-0">
                          <div className="flex items-center justify-between mb-1"><span className="font-semibold text-sm text-black">{ins.type} Inspection</span><span className="px-2 py-0.5 bg-black text-white rounded text-[11px] font-medium">{ins.result}</span></div>
                          <p className="text-[11px] text-gray-500">{ins.date} · {ins.inspector}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* DNA: ACTIVITY FEED */}
              {dnaSection === "activity" && (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="font-bold text-black mb-4">Activity Feed — All Verticals</h3>
                  <div className="space-y-3">
                    {c.activityFeed.map(a => (
                      <div key={a.id} className="border-l-2 border-black pl-4 py-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 border rounded text-[11px] font-medium ${verticalBadge[a.vertical] || "border-gray-300 text-gray-600"}`}>{a.vertical}</span>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[11px] font-medium">{a.type}</span>
                          <span className="text-[11px] text-gray-500 ml-auto">{a.date}</span>
                        </div>
                        <p className="text-sm text-black font-medium">{a.content}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">{a.author} · {a.role}</p>
                        {a.tags.length > 0 && <div className="flex gap-1 mt-1">{a.tags.map(t => <span key={t} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[11px]">{t}</span>)}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-[340px] border-l border-gray-200 overflow-y-auto bg-gray-50/50">
        <div className="p-4 space-y-4">
          {/* Customer Value */}
          <div className="bg-black rounded-xl p-5 text-white">
            <p className="text-[11px] text-white/40 font-semibold uppercase tracking-wider mb-1">Total Customer Value</p>
            <p className="text-3xl font-extrabold">${(lifetimeValue / 1000).toFixed(1)}K</p>
            <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-white/40">Verticals</span><p className="font-semibold">{c.verticals.length} Active</p></div>
              <div><span className="text-white/40">Since</span><p className="font-semibold">{c.submitted}</p></div>
            </div>
          </div>

          {/* Stage */}
          <div className="bg-black rounded-xl p-4 text-center text-white">
            <p className="text-lg font-extrabold">{c.solarStage}</p>
            <p className="text-[11px] text-white/50 uppercase tracking-wider">Current Stage</p>
          </div>

          {/* System Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-baseline justify-between mb-4">
              <span className="text-3xl font-extrabold text-black">{c.systemSize} <span className="text-sm font-normal text-gray-500">kW</span></span>
              <span className="text-xl font-extrabold text-black">${c.systemPrice.toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mb-3">System Summary</p>
            <div className="space-y-2 text-sm">
              {[["Modules", `${c.modules} ${c.modulesType}`],["Inverters", c.inverterType],["Mount Type", c.mountType],["Key Adders", c.keyAdders.join(", ")],["Financing", c.financing],["Utility", c.utility],["Sales Rep", c.salesRep],["Dealer", c.dealer]].map(([l,v],i) => (
                <div key={i} className="flex justify-between"><span className="text-gray-500">{l}</span><span className="font-medium text-black text-right max-w-[180px]">{v}</span></div>
              ))}
            </div>
          </div>

          {/* Quick Contact */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mb-3">Quick Contact</p>
            <div className="space-y-2">
              <a className="flex items-center gap-2 text-sm text-black font-medium hover:underline"><Phone className="w-3.5 h-3.5 text-gray-500" /> {c.phone}</a>
              <a className="flex items-center gap-2 text-sm text-black font-medium hover:underline"><Mail className="w-3.5 h-3.5 text-gray-500" /> {c.email}</a>
              <div className="flex items-center gap-2 text-sm text-gray-600"><MapPin className="w-3.5 h-3.5 text-gray-500" /> {c.city}, {c.state} {c.zip}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
