"use client";
import { useState, useMemo } from "react";
import {
  Dna, Search, ChevronRight, Phone, Mail, MapPin,
  Sun, Shield, Home, Wifi, DollarSign, Calendar, Clock,
  FileText, MessageSquare, CheckCircle2, AlertCircle,
  User, Users, Activity, ExternalLink, Star, Plus, ArrowLeft,
  BarChart3, Zap, TrendingUp, Heart, Target, Brain,
  Lightbulb, ThumbsUp, AlertTriangle, CreditCard, Receipt,
  Send, Paperclip, Filter, ArrowUpDown, Grid3X3, List,
  ChevronDown, Eye, MoreHorizontal, Percent, RefreshCw
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";

/* ─── TYPES ─── */
interface CustomerDNA {
  id: string; first_name: string; last_name: string; email: string; phone: string; mobile: string;
  address: string; city: string; state: string; zip: string; avatar: string;
  lifecycle_stage: string; lead_source: string; owner: string; created_at: string; last_activity: string;
  credit_score: number; household_income: number; utility_company: string; avg_electric_bill: number;
  roof_type: string; roof_age: number; home_sqft: number; home_year_built: number;
  tags: string[];
  health_score: number; ltv: number; churn_risk: number; referral_score: number;
  cross_sell_score: number; sentiment: number; next_best_action: string;
  payment_default_risk: number; predicted_ltv: number;
  solar: { active: boolean; system_size: string; panels: string; inverter: string; battery: string; financing: string; lender: string; contract_amount: number; stage: string; install_date: string; production_today: string; production_month: string; lifetime_mwh: string; monitoring_status: string; } | null;
  smart_home: { active: boolean; provider: string; panel_type: string; cameras: number; sensors: number; monitoring_plan: string; monthly_cost: number; contract_term: string; install_date: string; system_status: string; } | null;
  roofing: { active: boolean; material: string; scope: string; warranty: string; contract_amount: number; install_date: string; status: string; } | null;
  att: { active: boolean; plan: string; speed: string; monthly_cost: number; install_date: string; status: string; } | null;
  payments: { month: string; amount: number; status: string; }[];
  activities: { id: string; type: string; description: string; date: string; user: string; }[];
  documents: { id: string; name: string; type: string; date: string; size: string; }[];
  tickets: { id: string; number: number; subject: string; status: string; priority: string; created: string; }[];
  communications: { id: string; channel: string; direction: string; subject: string; preview: string; date: string; user: string; }[];
  notes: string;
  cross_sell_opps: { vertical: string; title: string; estimated_revenue: number; confidence: number; approach: string; }[];
}

/* ─── MOCK DATA ─── */
const CUSTOMERS: CustomerDNA[] = [
  {
    id: "dna1", first_name: "Robert", last_name: "Martinez", email: "robert.martinez@gmail.com", phone: "(214) 555-0101", mobile: "(214) 555-0102",
    address: "4521 Oak Lawn Ave", city: "Dallas", state: "TX", zip: "75219", avatar: "RM",
    lifecycle_stage: "Customer", lead_source: "Door-to-Door", owner: "Marcus Johnson", created_at: "2026-01-15", last_activity: "2 hours ago",
    credit_score: 742, household_income: 95000, utility_company: "Oncor / TXU Energy", avg_electric_bill: 287,
    roof_type: "Composition Shingle", roof_age: 8, home_sqft: 2450, home_year_built: 2014,
    tags: ["solar", "smart-home", "vip"],
    health_score: 92, ltv: 48750, churn_risk: 8, referral_score: 88, cross_sell_score: 75,
    sentiment: 94, next_best_action: "Offer EV Charger add-on — customer mentioned interest",
    payment_default_risk: 3, predicted_ltv: 125000,
    solar: { active: true, system_size: "12.0 kW", panels: "24x REC Alpha Pure-R 400W", inverter: "Enphase IQ8+", battery: "Enphase IQ Battery 10T", financing: "Loan", lender: "GoodLeap", contract_amount: 42800, stage: "Install / Schedule", install_date: "Apr 14, 2026", production_today: "42.3 kWh", production_month: "487.2 kWh", lifetime_mwh: "4.8", monitoring_status: "Online" },
    smart_home: { active: true, provider: "Alarm.com (ADC)", panel_type: "ADC Smart Hub Pro", cameras: 4, sensors: 12, monitoring_plan: "Interactive Gold", monthly_cost: 49.99, contract_term: "36 months", install_date: "Feb 5, 2026", system_status: "Online" },
    roofing: null, att: null,
    payments: [
      { month: "Apr 2026", amount: 289, status: "paid" }, { month: "Mar 2026", amount: 339, status: "paid" },
      { month: "Feb 2026", amount: 339, status: "paid" }, { month: "Jan 2026", amount: 339, status: "paid" },
      { month: "Dec 2025", amount: 339, status: "paid" }, { month: "Nov 2025", amount: 339, status: "paid" },
    ],
    activities: [
      { id: "a1", type: "install", description: "Solar install Day 1 started — Install Crew A on site", date: "Apr 14, 2026 8:00 AM", user: "System" },
      { id: "a2", type: "call", description: "Confirmation call — install schedule confirmed", date: "Apr 12, 2026 2:30 PM", user: "Marcus Johnson" },
      { id: "a3", type: "email", description: "Welcome packet sent via DocuSign", date: "Apr 10, 2026 9:00 AM", user: "System" },
      { id: "a4", type: "stage_change", description: "Solar: Permit Approval → Install / Schedule", date: "Apr 8, 2026 3:15 PM", user: "Sarah Chen" },
      { id: "a5", type: "document", description: "Permit approved — City of Dallas", date: "Apr 5, 2026 11:00 AM", user: "Sarah Chen" },
      { id: "a6", type: "note", description: "Customer will be home during install. Dogs inside.", date: "Apr 3, 2026 4:00 PM", user: "Marcus Johnson" },
      { id: "a7", type: "smart_home", description: "ADC system installed — 4 cameras + 12 sensors + hub", date: "Feb 5, 2026 2:00 PM", user: "David Park" },
      { id: "a8", type: "contract", description: "Solar HIC signed — DPG-2026-001 ($42,800)", date: "Jan 20, 2026 10:30 AM", user: "Marcus Johnson" },
    ],
    documents: [
      { id: "d1", name: "Solar HIC — DPG-2026-001.pdf", type: "Contract", date: "Jan 20, 2026", size: "2.4 MB" },
      { id: "d2", name: "ADC Monitoring Agreement.pdf", type: "Contract", date: "Feb 3, 2026", size: "1.1 MB" },
      { id: "d3", name: "GoodLeap Loan Agreement.pdf", type: "Finance", date: "Jan 22, 2026", size: "3.2 MB" },
      { id: "d4", name: "Site Survey Report.pdf", type: "Survey", date: "Jan 28, 2026", size: "8.7 MB" },
      { id: "d5", name: "CAD Design — Final.pdf", type: "Design", date: "Feb 15, 2026", size: "5.1 MB" },
      { id: "d6", name: "City of Dallas Permit.pdf", type: "Permit", date: "Apr 5, 2026", size: "0.8 MB" },
    ],
    tickets: [
      { id: "t1", number: 1015, subject: "Monitoring login not working", status: "Resolved", priority: "Medium", created: "Mar 10, 2026" },
    ],
    communications: [
      { id: "c1", channel: "email", direction: "outbound", subject: "Your Solar Install is Scheduled!", preview: "Hi Robert, great news — your install is confirmed for April 14...", date: "Apr 10, 2026", user: "System" },
      { id: "c2", channel: "call", direction: "outbound", subject: "Install Confirmation Call", preview: "Spoke with Robert for 8 min. Confirmed April 14 install date...", date: "Apr 12, 2026", user: "Marcus Johnson" },
      { id: "c3", channel: "sms", direction: "outbound", subject: "Appointment Reminder", preview: "Hi Robert! Reminder: Solar install tomorrow at 8 AM.", date: "Apr 13, 2026", user: "System" },
    ],
    notes: "VIP customer — referred by neighbor. Very engaged, checks monitoring daily. Interested in EV charger. Excellent credit.",
    cross_sell_opps: [
      { vertical: "Roofing", title: "Roof replacement before solar degradation", estimated_revenue: 18500, confidence: 45, approach: "Roof is 8 years old. Recommend inspection before Year 10. Bundle with warranty upgrade." },
      { vertical: "AT&T", title: "AT&T Fiber bundle with smart home", estimated_revenue: 960, confidence: 72, approach: "Customer has ADC smart home — AT&T Fiber enhances connectivity for cameras." },
    ],
  },
  {
    id: "dna2", first_name: "Amanda", last_name: "Davis", email: "amanda.davis@gmail.com", phone: "(817) 555-0401", mobile: "(817) 555-0402",
    address: "3367 Camp Bowie Blvd", city: "Fort Worth", state: "TX", zip: "76107", avatar: "AD",
    lifecycle_stage: "Customer", lead_source: "Door-to-Door", owner: "Marcus Johnson", created_at: "2025-12-10", last_activity: "3 hours ago",
    credit_score: 698, household_income: 78000, utility_company: "Oncor / Direct Energy", avg_electric_bill: 210,
    roof_type: "Composition Shingle", roof_age: 12, home_sqft: 1890, home_year_built: 2010,
    tags: ["smart-home", "att"],
    health_score: 85, ltv: 6240, churn_risk: 15, referral_score: 65, cross_sell_score: 88,
    sentiment: 80, next_best_action: "Schedule roof inspection — 12yr old roof ideal for solar+roof bundle",
    payment_default_risk: 8, predicted_ltv: 72000,
    solar: null,
    smart_home: { active: true, provider: "Alarm.com (ADC)", panel_type: "ADC Smart Hub", cameras: 3, sensors: 8, monitoring_plan: "Interactive Silver", monthly_cost: 39.99, contract_term: "36 months", install_date: "Dec 15, 2025", system_status: "Online" },
    roofing: null,
    att: { active: true, plan: "AT&T Fiber 1000", speed: "1 Gbps", monthly_cost: 79.99, install_date: "Dec 20, 2025", status: "Active" },
    payments: [
      { month: "Apr 2026", amount: 119.98, status: "paid" }, { month: "Mar 2026", amount: 119.98, status: "paid" },
      { month: "Feb 2026", amount: 119.98, status: "paid" }, { month: "Jan 2026", amount: 119.98, status: "paid" },
    ],
    activities: [
      { id: "a1", type: "call", description: "Monthly check-in — system performing well", date: "Apr 11, 2026 10:00 AM", user: "David Park" },
      { id: "a2", type: "payment", description: "Monitoring payment processed — $39.99", date: "Apr 1, 2026", user: "System" },
    ],
    documents: [
      { id: "d1", name: "ADC Monitoring Agreement.pdf", type: "Contract", date: "Dec 12, 2025", size: "1.1 MB" },
      { id: "d2", name: "AT&T Service Agreement.pdf", type: "Contract", date: "Dec 18, 2025", size: "0.9 MB" },
    ],
    tickets: [],
    communications: [
      { id: "c1", channel: "call", direction: "outbound", subject: "Monthly Check-in", preview: "Spoke for 5 min. System working well. Mentioned roof concern.", date: "Apr 11, 2026", user: "David Park" },
    ],
    notes: "Happy customer. Interested in solar but waiting for roof replacement. Roof is 12 years old.",
    cross_sell_opps: [
      { vertical: "Solar", title: "Solar + Roof bundle — $210/mo electric bill", estimated_revenue: 38000, confidence: 82, approach: "High electric bill + aging roof = perfect combo. Offer roof+solar bundle discount." },
      { vertical: "Roofing", title: "Roof replacement needed before solar", estimated_revenue: 16200, confidence: 85, approach: "12-year-old shingle roof. Inspection will likely reveal need for replacement." },
    ],
  },
  {
    id: "dna3", first_name: "James", last_name: "Brown", email: "jbrown77@gmail.com", phone: "(313) 555-0701", mobile: "(313) 555-0702",
    address: "5120 Woodward Ave", city: "Detroit", state: "MI", zip: "48202", avatar: "JB",
    lifecycle_stage: "Customer", lead_source: "Canvassing", owner: "Lisa Rodriguez", created_at: "2026-03-15", last_activity: "12 hours ago",
    credit_score: 711, household_income: 82000, utility_company: "DTE Energy", avg_electric_bill: 195,
    roof_type: "GAF Timberline HDZ", roof_age: 0, home_sqft: 2100, home_year_built: 2000,
    tags: ["roofing"],
    health_score: 78, ltv: 18900, churn_risk: 12, referral_score: 60, cross_sell_score: 90,
    sentiment: 75, next_best_action: "Schedule solar consultation after roof completion",
    payment_default_risk: 10, predicted_ltv: 85000,
    solar: null, smart_home: null,
    roofing: { active: true, material: "GAF Timberline HDZ", scope: "Full tear-off — 2,100 sqft", warranty: "GAF Golden Pledge Lifetime", contract_amount: 18900, install_date: "Apr 14, 2026", status: "In Progress" },
    att: null,
    payments: [
      { month: "Mar 2026", amount: 9450, status: "paid" }, { month: "Apr 2026", amount: 9450, status: "pending" },
    ],
    activities: [
      { id: "a1", type: "install", description: "Roof install Day 1 — tear-off done", date: "Apr 14, 2026", user: "Install Crew B" },
      { id: "a2", type: "contract", description: "Roofing HIC signed — $18,900", date: "Mar 20, 2026", user: "Lisa Rodriguez" },
    ],
    documents: [
      { id: "d1", name: "Roofing HIC — DPG-2026-004.pdf", type: "Contract", date: "Mar 20, 2026", size: "1.8 MB" },
    ],
    tickets: [],
    communications: [
      { id: "c1", channel: "call", direction: "outbound", subject: "Install Day 1 Update", preview: "Called to confirm tear-off complete. Day 2 starts tomorrow.", date: "Apr 14, 2026", user: "Lisa Rodriguez" },
    ],
    notes: "Full roof replacement. Solar planned after roof complete. Potential $40K+ solar deal.",
    cross_sell_opps: [
      { vertical: "Solar", title: "New roof = perfect solar candidate", estimated_revenue: 42000, confidence: 88, approach: "Brand new roof + $195/mo electric bill. Schedule consultation week after roof completion." },
      { vertical: "Smart Home", title: "Security system with new home investment", estimated_revenue: 4800, confidence: 65, approach: "Customer investing in home — security is natural next step." },
      { vertical: "AT&T", title: "AT&T Fiber bundle", estimated_revenue: 960, confidence: 50, approach: "Standard bundle offer with smart home." },
    ],
  },
  {
    id: "dna4", first_name: "Emily", last_name: "Wilson", email: "emily.w@outlook.com", phone: "(214) 555-0801", mobile: "(214) 555-0802",
    address: "7744 Forest Ln", city: "Dallas", state: "TX", zip: "75230", avatar: "EW",
    lifecycle_stage: "Lead", lead_source: "Google Ads", owner: "Marcus Johnson", created_at: "2026-04-01", last_activity: "1 day ago",
    credit_score: 780, household_income: 125000, utility_company: "Oncor / TXU Energy", avg_electric_bill: 340,
    roof_type: "Tile", roof_age: 5, home_sqft: 3200, home_year_built: 2019,
    tags: ["solar", "att", "high-value"],
    health_score: 70, ltv: 0, churn_risk: 25, referral_score: 50, cross_sell_score: 95,
    sentiment: 72, next_best_action: "Schedule in-home solar consultation — $340/mo bill is massive",
    payment_default_risk: 2, predicted_ltv: 165000,
    solar: null, smart_home: null, roofing: null, att: null,
    payments: [],
    activities: [
      { id: "a1", type: "email", description: "Solar + AT&T bundle brochure sent", date: "Apr 5, 2026", user: "Marcus Johnson" },
      { id: "a2", type: "form", description: "Web form submitted — Solar quote request", date: "Apr 1, 2026", user: "Website" },
    ],
    documents: [],
    tickets: [],
    communications: [
      { id: "c1", channel: "email", direction: "outbound", subject: "Your Custom Solar Savings Report", preview: "Hi Emily, based on your home at 7744 Forest Ln...", date: "Apr 5, 2026", user: "Marcus Johnson" },
    ],
    notes: "High-value lead. $340/mo bill. 780 credit. 3,200 sqft home. Perfect for 15kW+ system.",
    cross_sell_opps: [
      { vertical: "Solar", title: "Premium solar system — $340/mo savings potential", estimated_revenue: 58000, confidence: 92, approach: "Highest electric bill in pipeline. 15kW+ system. Cash or GoodLeap." },
      { vertical: "Smart Home", title: "Premium home deserves premium security", estimated_revenue: 7200, confidence: 70, approach: "3,200 sqft luxury home. Offer 6-camera + 16 sensor package." },
      { vertical: "AT&T", title: "AT&T Fiber for smart home integration", estimated_revenue: 960, confidence: 80, approach: "Bundle AT&T with smart home for seamless experience." },
    ],
  },
  {
    id: "dna5", first_name: "Sarah", last_name: "Johnson", email: "sarahj@gmail.com", phone: "(440) 555-0601", mobile: "(440) 555-0602",
    address: "2847 Lakeshore Blvd", city: "Cleveland", state: "OH", zip: "44118", avatar: "SJ",
    lifecycle_stage: "Customer", lead_source: "Door-to-Door", owner: "Sarah Chen", created_at: "2025-11-05", last_activity: "6 hours ago",
    credit_score: 725, household_income: 88000, utility_company: "Cleveland Electric Illuminating", avg_electric_bill: 245,
    roof_type: "Composition Shingle", roof_age: 6, home_sqft: 2200, home_year_built: 2016,
    tags: ["solar", "smart-home"],
    health_score: 62, ltv: 39680, churn_risk: 35, referral_score: 40, cross_sell_score: 60,
    sentiment: 55, next_best_action: "Resolve production ticket ASAP — churn risk elevated",
    payment_default_risk: 5, predicted_ltv: 95000,
    solar: { active: true, system_size: "8.5 kW", panels: "20x Q.CELLS Q.PEAK DUO", inverter: "Enphase IQ8+", battery: "None", financing: "Loan", lender: "Mosaic", contract_amount: 34200, stage: "Monitoring", install_date: "Dec 2, 2025", production_today: "22.1 kWh", production_month: "298.4 kWh", lifetime_mwh: "12.4", monitoring_status: "Warning" },
    smart_home: { active: true, provider: "Alarm.com (ADC)", panel_type: "ADC Hub + Ring Cameras", cameras: 3, sensors: 6, monitoring_plan: "Interactive Silver", monthly_cost: 39.99, contract_term: "36 months", install_date: "Nov 20, 2025", system_status: "Online" },
    roofing: null, att: null,
    payments: [
      { month: "Apr 2026", amount: 289, status: "paid" }, { month: "Mar 2026", amount: 289, status: "paid" },
      { month: "Feb 2026", amount: 289, status: "paid" }, { month: "Jan 2026", amount: 289, status: "late" },
    ],
    activities: [
      { id: "a1", type: "ticket", description: "Ticket #1002 — Solar production below estimate", date: "Apr 11, 2026", user: "Sarah Johnson" },
      { id: "a2", type: "call", description: "Customer called about low production", date: "Apr 10, 2026", user: "Sarah Chen" },
    ],
    documents: [
      { id: "d1", name: "Solar HIC — DPG-2025-089.pdf", type: "Contract", date: "Nov 10, 2025", size: "2.1 MB" },
      { id: "d2", name: "Mosaic Loan Agreement.pdf", type: "Finance", date: "Nov 12, 2025", size: "2.8 MB" },
    ],
    tickets: [
      { id: "t1", number: 1002, subject: "Solar production 30% below estimate", status: "Open", priority: "High", created: "Apr 11, 2026" },
    ],
    communications: [
      { id: "c1", channel: "call", direction: "inbound", subject: "Production Complaint", preview: "Sarah called upset about low production numbers...", date: "Apr 10, 2026", user: "Sarah Chen" },
    ],
    notes: "Production issue — possible shading from neighbor's new tree. Site revisit scheduled. Customer frustrated.",
    cross_sell_opps: [
      { vertical: "AT&T", title: "AT&T Fiber bundle", estimated_revenue: 960, confidence: 40, approach: "Wait until production issue is resolved before any cross-sell." },
    ],
  },
  {
    id: "dna6", first_name: "Michael", last_name: "Thompson", email: "mthompson@yahoo.com", phone: "(614) 555-0301", mobile: "(614) 555-0302",
    address: "891 High St", city: "Columbus", state: "OH", zip: "43215", avatar: "MT",
    lifecycle_stage: "Customer", lead_source: "Referral", owner: "Sarah Chen", created_at: "2025-09-20", last_activity: "1 day ago",
    credit_score: 765, household_income: 112000, utility_company: "AEP Ohio", avg_electric_bill: 310,
    roof_type: "Standing Seam Metal", roof_age: 3, home_sqft: 2800, home_year_built: 2018,
    tags: ["solar", "smart-home", "att", "whale"],
    health_score: 96, ltv: 62400, churn_risk: 4, referral_score: 95, cross_sell_score: 40,
    sentiment: 98, next_best_action: "Ask for referrals — 95 referral score, extremely satisfied",
    payment_default_risk: 1, predicted_ltv: 180000,
    solar: { active: true, system_size: "14.0 kW", panels: "28x REC Alpha Pure-R 500W", inverter: "Enphase IQ8M+", battery: "Tesla Powerwall 3", financing: "Cash", lender: "N/A", contract_amount: 56200, stage: "Final Complete", install_date: "Oct 15, 2025", production_today: "55.2 kWh", production_month: "612.8 kWh", lifetime_mwh: "28.4", monitoring_status: "Online" },
    smart_home: { active: true, provider: "Alarm.com (ADC)", panel_type: "ADC Smart Hub Pro", cameras: 6, sensors: 16, monitoring_plan: "Interactive Gold", monthly_cost: 49.99, contract_term: "36 months", install_date: "Sep 25, 2025", system_status: "Online" },
    roofing: null,
    att: { active: true, plan: "AT&T Fiber 2000", speed: "2 Gbps", monthly_cost: 99.99, install_date: "Oct 1, 2025", status: "Active" },
    payments: [
      { month: "Apr 2026", amount: 149.98, status: "paid" }, { month: "Mar 2026", amount: 149.98, status: "paid" },
      { month: "Feb 2026", amount: 149.98, status: "paid" }, { month: "Jan 2026", amount: 149.98, status: "paid" },
    ],
    activities: [
      { id: "a1", type: "call", description: "Referral check-in — gave 2 neighbor contacts", date: "Apr 8, 2026", user: "Sarah Chen" },
      { id: "a2", type: "payment", description: "Monthly monitoring + AT&T — $149.98", date: "Apr 1, 2026", user: "System" },
    ],
    documents: [
      { id: "d1", name: "Solar HIC — DPG-2025-042.pdf", type: "Contract", date: "Sep 22, 2025", size: "2.5 MB" },
      { id: "d2", name: "ADC Agreement.pdf", type: "Contract", date: "Sep 22, 2025", size: "1.0 MB" },
      { id: "d3", name: "AT&T Agreement.pdf", type: "Contract", date: "Sep 28, 2025", size: "0.8 MB" },
    ],
    tickets: [],
    communications: [
      { id: "c1", channel: "call", direction: "outbound", subject: "Referral Check-in", preview: "Michael gave 2 neighbor contacts. Very happy with everything.", date: "Apr 8, 2026", user: "Sarah Chen" },
    ],
    notes: "Whale customer — all verticals. Paid cash for solar. Extremely satisfied. Active referral source.",
    cross_sell_opps: [
      { vertical: "Roofing", title: "Premium standing seam metal — future maintenance", estimated_revenue: 2500, confidence: 20, approach: "Metal roof is only 3 years old. Low priority — flag for Year 10." },
    ],
  },
  {
    id: "dna7", first_name: "Jennifer", last_name: "Garcia", email: "jgarcia@hotmail.com", phone: "(734) 555-0501", mobile: "(734) 555-0502",
    address: "2210 Washtenaw Ave", city: "Ann Arbor", state: "MI", zip: "48104", avatar: "JG",
    lifecycle_stage: "Customer", lead_source: "Door-to-Door", owner: "Lisa Rodriguez", created_at: "2026-02-01", last_activity: "4 hours ago",
    credit_score: 690, household_income: 72000, utility_company: "DTE Energy", avg_electric_bill: 178,
    roof_type: "Asphalt Shingle", roof_age: 15, home_sqft: 1750, home_year_built: 2008,
    tags: ["smart-home"],
    health_score: 74, ltv: 1440, churn_risk: 20, referral_score: 55, cross_sell_score: 82,
    sentiment: 70, next_best_action: "Roof inspection — 15yr old roof, solar opportunity after replacement",
    payment_default_risk: 12, predicted_ltv: 68000,
    solar: null,
    smart_home: { active: true, provider: "Alarm.com (ADC)", panel_type: "ADC Smart Hub", cameras: 2, sensors: 6, monitoring_plan: "Interactive Silver", monthly_cost: 39.99, contract_term: "36 months", install_date: "Feb 10, 2026", system_status: "Online" },
    roofing: null, att: null,
    payments: [
      { month: "Apr 2026", amount: 39.99, status: "paid" }, { month: "Mar 2026", amount: 39.99, status: "paid" },
    ],
    activities: [
      { id: "a1", type: "payment", description: "Monitoring payment — $39.99", date: "Apr 1, 2026", user: "System" },
      { id: "a2", type: "smart_home", description: "ADC system installed", date: "Feb 10, 2026", user: "David Park" },
    ],
    documents: [
      { id: "d1", name: "ADC Monitoring Agreement.pdf", type: "Contract", date: "Feb 8, 2026", size: "1.1 MB" },
    ],
    tickets: [],
    communications: [],
    notes: "Roof is 15 years old. Strong candidate for roof + solar bundle. Credit may need work.",
    cross_sell_opps: [
      { vertical: "Roofing", title: "15-year-old roof needs replacement", estimated_revenue: 14500, confidence: 90, approach: "Roof is past prime. Schedule free inspection." },
      { vertical: "Solar", title: "Solar after roof replacement", estimated_revenue: 32000, confidence: 75, approach: "$178/mo electric bill. After roof, perfect for 9kW system." },
      { vertical: "AT&T", title: "AT&T Fiber bundle", estimated_revenue: 960, confidence: 55, approach: "Bundle with existing smart home." },
    ],
  },
  {
    id: "dna8", first_name: "David", last_name: "Kim", email: "dkim.texas@gmail.com", phone: "(972) 555-0901", mobile: "(972) 555-0902",
    address: "1520 Preston Rd", city: "Plano", state: "TX", zip: "75093", avatar: "DK",
    lifecycle_stage: "Customer", lead_source: "Website", owner: "Marcus Johnson", created_at: "2025-08-15", last_activity: "30 min ago",
    credit_score: 800, household_income: 165000, utility_company: "Oncor / TXU Energy", avg_electric_bill: 420,
    roof_type: "Concrete Tile", roof_age: 2, home_sqft: 4100, home_year_built: 2021,
    tags: ["solar", "smart-home", "att", "roofing", "vip", "whale"],
    health_score: 98, ltv: 89500, churn_risk: 2, referral_score: 92, cross_sell_score: 15,
    sentiment: 99, next_best_action: "Referral program — customer has referred 3 neighbors already",
    payment_default_risk: 1, predicted_ltv: 220000,
    solar: { active: true, system_size: "18.0 kW", panels: "36x REC Alpha Pure-R 500W", inverter: "Enphase IQ8M+", battery: "2x Tesla Powerwall 3", financing: "Cash", lender: "N/A", contract_amount: 72000, stage: "Final Complete", install_date: "Sep 1, 2025", production_today: "68.4 kWh", production_month: "820.1 kWh", lifetime_mwh: "45.2", monitoring_status: "Online" },
    smart_home: { active: true, provider: "Alarm.com (ADC)", panel_type: "ADC Smart Hub Pro", cameras: 8, sensors: 22, monitoring_plan: "Interactive Platinum", monthly_cost: 59.99, contract_term: "60 months", install_date: "Aug 20, 2025", system_status: "Online" },
    roofing: { active: true, material: "Concrete Tile — color match", scope: "Partial repair after solar", warranty: "10 Year Workmanship", contract_amount: 4500, install_date: "Sep 5, 2025", status: "Complete" },
    att: { active: true, plan: "AT&T Fiber 5000", speed: "5 Gbps", monthly_cost: 179.99, install_date: "Aug 25, 2025", status: "Active" },
    payments: [
      { month: "Apr 2026", amount: 239.98, status: "paid" }, { month: "Mar 2026", amount: 239.98, status: "paid" },
      { month: "Feb 2026", amount: 239.98, status: "paid" }, { month: "Jan 2026", amount: 239.98, status: "paid" },
      { month: "Dec 2025", amount: 239.98, status: "paid" }, { month: "Nov 2025", amount: 239.98, status: "paid" },
    ],
    activities: [
      { id: "a1", type: "call", description: "David referred 3rd neighbor — scheduling consultation", date: "Apr 14, 2026", user: "Marcus Johnson" },
      { id: "a2", type: "payment", description: "Monthly services — $239.98", date: "Apr 1, 2026", user: "System" },
    ],
    documents: [
      { id: "d1", name: "Solar HIC — DPG-2025-028.pdf", type: "Contract", date: "Aug 10, 2025", size: "3.1 MB" },
      { id: "d2", name: "ADC Agreement — Platinum.pdf", type: "Contract", date: "Aug 15, 2025", size: "1.4 MB" },
      { id: "d3", name: "AT&T Fiber 5G Agreement.pdf", type: "Contract", date: "Aug 22, 2025", size: "0.9 MB" },
      { id: "d4", name: "Roofing Repair Invoice.pdf", type: "Invoice", date: "Sep 5, 2025", size: "0.5 MB" },
    ],
    tickets: [],
    communications: [
      { id: "c1", channel: "call", direction: "inbound", subject: "3rd Referral", preview: "David called to give another neighbor's contact info.", date: "Apr 14, 2026", user: "Marcus Johnson" },
    ],
    notes: "Ultimate whale. All 4 verticals active. Cash buyer. 3 referrals so far. Treat like royalty.",
    cross_sell_opps: [],
  },
];

const VERTICALS = [
  { key: "solar", label: "Solar", icon: Sun, color: "text-amber-600", bg: "bg-amber-50" },
  { key: "smart_home", label: "Security", icon: Shield, color: "text-purple-600", bg: "bg-purple-50" },
  { key: "roofing", label: "Roofing", icon: Home, color: "text-blue-600", bg: "bg-blue-50" },
  { key: "att", label: "AT&T", icon: Wifi, color: "text-sky-600", bg: "bg-sky-50" },
];

const ACTIVITY_ICONS: Record<string, { icon: typeof Phone; color: string }> = {
  call: { icon: Phone, color: "bg-green-50 text-green-600" },
  email: { icon: Mail, color: "bg-blue-50 text-blue-600" },
  install: { icon: Zap, color: "bg-black text-white" },
  stage_change: { icon: Activity, color: "bg-amber-50 text-amber-600" },
  document: { icon: FileText, color: "bg-gray-100 text-gray-600" },
  note: { icon: MessageSquare, color: "bg-gray-50 text-gray-500" },
  smart_home: { icon: Shield, color: "bg-purple-50 text-purple-600" },
  contract: { icon: FileText, color: "bg-black text-white" },
  payment: { icon: DollarSign, color: "bg-green-50 text-green-600" },
  att: { icon: Wifi, color: "bg-blue-50 text-blue-600" },
  ticket: { icon: AlertCircle, color: "bg-red-50 text-red-600" },
  form: { icon: ExternalLink, color: "bg-gray-100 text-gray-600" },
};

const PIE_COLORS = ["#F0A500", "#7C5CBF", "#007A67", "#0B1F3A", "#EF4444", "#3B82F6"];

function HealthGauge({ score }: { score: number }) {
  const color = score >= 80 ? "text-green-600" : score >= 60 ? "text-amber-500" : "text-red-500";
  const bg = score >= 80 ? "bg-green-500" : score >= 60 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-14 h-14">
        <svg viewBox="0 0 36 36" className="w-14 h-14 -rotate-90">
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e5e7eb" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.5" fill="none" stroke={score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444"} strokeWidth="3" strokeDasharray={`${score} ${100 - score}`} strokeLinecap="round" />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${color}`}>{score}</span>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500">Health Score</p>
        <div className={`w-2 h-2 rounded-full inline-block mr-1 ${bg}`} />
        <span className={`text-xs font-bold ${color}`}>{score >= 80 ? "Excellent" : score >= 60 ? "Fair" : "At Risk"}</span>
      </div>
    </div>
  );
}

export default function CustomerDNAPage() {
  const [customers] = useState(CUSTOMERS);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [sortBy, setSortBy] = useState<"name" | "ltv" | "health" | "created">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [filterVertical, setFilterVertical] = useState("all");
  const [filterStage, setFilterStage] = useState("all");
  const [filterState, setFilterState] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const selected = customers.find(c => c.id === selectedId) || null;

  const filtered = useMemo(() => {
    let result = customers.filter(c => {
      const matchSearch = search === "" || `${c.first_name} ${c.last_name} ${c.email} ${c.city} ${c.state}`.toLowerCase().includes(search.toLowerCase());
      const matchVertical = filterVertical === "all" || (filterVertical === "solar" && c.solar) || (filterVertical === "smart_home" && c.smart_home) || (filterVertical === "roofing" && c.roofing) || (filterVertical === "att" && c.att);
      const matchStage = filterStage === "all" || c.lifecycle_stage === filterStage;
      const matchState = filterState === "all" || c.state === filterState;
      return matchSearch && matchVertical && matchStage && matchState;
    });
    result.sort((a, b) => {
      let cmp = 0;
      if (sortBy === "name") cmp = `${a.last_name}${a.first_name}`.localeCompare(`${b.last_name}${b.first_name}`);
      else if (sortBy === "ltv") cmp = a.ltv - b.ltv;
      else if (sortBy === "health") cmp = a.health_score - b.health_score;
      else if (sortBy === "created") cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return sortDir === "desc" ? -cmp : cmp;
    });
    return result;
  }, [customers, search, filterVertical, filterStage, filterState, sortBy, sortDir]);

  const stats = useMemo(() => ({
    total: customers.length,
    totalLtv: customers.reduce((s, c) => s + c.ltv, 0),
    avgHealth: Math.round(customers.reduce((s, c) => s + c.health_score, 0) / customers.length),
    crossSellOpps: customers.reduce((s, c) => s + c.cross_sell_opps.length, 0),
    totalPredictedLtv: customers.reduce((s, c) => s + c.predicted_ltv, 0),
  }), [customers]);

  const toggleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("asc"); }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map(c => c.id)));
  };

  /* ─── DETAIL VIEW ─── */
  if (selected) {
    const tabs = ["overview", "ai-insights", "financial", "activity", "communications", "documents", "tickets", "notes"];
    const verticalRevenue = [
      selected.solar ? { name: "Solar", value: selected.solar.contract_amount } : null,
      selected.smart_home ? { name: "Security", value: selected.smart_home.monthly_cost * 36 } : null,
      selected.roofing ? { name: "Roofing", value: selected.roofing.contract_amount } : null,
      selected.att ? { name: "AT&T", value: selected.att.monthly_cost * 24 } : null,
    ].filter(Boolean) as { name: string; value: number }[];

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[1440px] mx-auto px-6 py-6">
          <button onClick={() => { setSelectedId(null); setActiveTab("overview"); }} className="flex items-center gap-1 text-sm text-gray-500 hover:text-black mb-4"><ArrowLeft size={14} /> Back to Customers</button>

          {/* Profile Header */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold shrink-0">{selected.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h1 className="text-2xl font-bold text-black">{selected.first_name} {selected.last_name}</h1>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${selected.lifecycle_stage === "Customer" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-700"}`}>{selected.lifecycle_stage}</span>
                  {selected.tags.map(t => <span key={t} className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{t}</span>)}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                  <span className="flex items-center gap-1"><Mail size={13} /> {selected.email}</span>
                  <span className="flex items-center gap-1"><Phone size={13} /> {selected.phone}</span>
                  <span className="flex items-center gap-1"><MapPin size={13} /> {selected.city}, {selected.state} {selected.zip}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400 mt-1.5">
                  <span>Owner: <strong className="text-gray-600">{selected.owner}</strong></span>
                  <span>Source: {selected.lead_source}</span>
                  <span>Last activity: {selected.last_activity}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <HealthGauge score={selected.health_score} />
                <div className="flex flex-col gap-1.5 ml-4">
                  <button className="px-4 py-2 bg-black text-white rounded-lg text-xs font-semibold hover:bg-gray-800 flex items-center gap-1"><Phone size={12} /> Call</button>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold hover:bg-gray-50 flex items-center gap-1"><Mail size={12} /> Email</button>
                </div>
              </div>
            </div>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-6 gap-3 mb-5">
            {[
              { label: "Lifetime Value", value: `$${selected.ltv.toLocaleString()}`, icon: DollarSign, sub: `Predicted: $${selected.predicted_ltv.toLocaleString()}` },
              { label: "Churn Risk", value: `${selected.churn_risk}%`, icon: AlertTriangle, sub: selected.churn_risk <= 10 ? "Low Risk" : selected.churn_risk <= 30 ? "Medium Risk" : "High Risk" },
              { label: "Referral Score", value: `${selected.referral_score}/100`, icon: ThumbsUp, sub: selected.referral_score >= 80 ? "Likely to refer" : "Moderate" },
              { label: "Sentiment", value: `${selected.sentiment}%`, icon: Heart, sub: selected.sentiment >= 80 ? "Very Positive" : "Neutral" },
              { label: "Cross-Sell", value: `${selected.cross_sell_opps.length} opps`, icon: Target, sub: `$${selected.cross_sell_opps.reduce((s, o) => s + o.estimated_revenue, 0).toLocaleString()} potential` },
              { label: "Default Risk", value: `${selected.payment_default_risk}%`, icon: CreditCard, sub: selected.payment_default_risk <= 5 ? "Very Low" : "Moderate" },
            ].map(kpi => {
              const KIcon = kpi.icon;
              return (
                <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <KIcon size={14} className="text-gray-400" />
                    <span className="text-[11px] font-semibold text-gray-500 uppercase">{kpi.label}</span>
                  </div>
                  <p className="text-lg font-bold text-black">{kpi.value}</p>
                  <p className="text-[11px] text-gray-400">{kpi.sub}</p>
                </div>
              );
            })}
          </div>

          {/* Vertical Cards */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            {VERTICALS.map(v => {
              const data = selected[v.key as keyof CustomerDNA];
              const active = data && typeof data === "object" && "active" in data && data.active;
              const VIcon = v.icon;
              return (
                <div key={v.key} className={`rounded-xl border p-4 ${active ? "bg-white border-gray-200" : "bg-gray-50 border-gray-100"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${active ? v.bg : "bg-gray-100"}`}>
                      <VIcon size={14} className={active ? v.color : "text-gray-300"} />
                    </div>
                    <span className={`text-sm font-bold ${active ? "text-black" : "text-gray-400"}`}>{v.label}</span>
                    <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-400"}`}>{active ? "ACTIVE" : "—"}</span>
                  </div>
                  {active && v.key === "solar" && selected.solar && <p className="text-xs text-gray-600">{selected.solar.system_size} · {selected.solar.stage}</p>}
                  {active && v.key === "smart_home" && selected.smart_home && <p className="text-xs text-gray-600">{selected.smart_home.cameras} cameras · ${selected.smart_home.monthly_cost}/mo</p>}
                  {active && v.key === "roofing" && selected.roofing && <p className="text-xs text-gray-600">{selected.roofing.material} · {selected.roofing.status}</p>}
                  {active && v.key === "att" && selected.att && <p className="text-xs text-gray-600">{selected.att.plan} · {selected.att.speed}</p>}
                  {!active && <p className="text-xs text-gray-400">Not enrolled</p>}
                </div>
              );
            })}
          </div>

          {/* Tabs */}
          <div className="flex gap-0.5 mb-5 border-b border-gray-200 overflow-x-auto">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${activeTab === tab ? "border-black text-black" : "border-transparent text-gray-500 hover:text-black"}`}>
                {tab.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
              </button>
            ))}
          </div>

          {/* ─── OVERVIEW ─── */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-2 gap-5">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-bold text-black mb-4 flex items-center gap-2"><User size={14} /> Homeowner Profile</h3>
                <div className="space-y-2">
                  {[
                    { l: "Credit Score", v: String(selected.credit_score) },
                    { l: "Household Income", v: `$${selected.household_income.toLocaleString()}` },
                    { l: "Utility Company", v: selected.utility_company },
                    { l: "Avg Electric Bill", v: `$${selected.avg_electric_bill}/mo` },
                    { l: "Roof Type", v: selected.roof_type },
                    { l: "Roof Age", v: `${selected.roof_age} years` },
                    { l: "Home Size", v: `${selected.home_sqft.toLocaleString()} sqft` },
                    { l: "Year Built", v: String(selected.home_year_built) },
                  ].map(f => (
                    <div key={f.l} className="flex justify-between py-1.5 border-b border-gray-50">
                      <span className="text-xs text-gray-500">{f.l}</span>
                      <span className="text-sm text-black font-medium">{f.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selected.solar && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-sm font-bold text-black mb-3 flex items-center gap-2"><Sun size={14} className="text-amber-500" /> Solar System</h3>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-amber-50 rounded-lg p-2.5 text-center"><p className="text-base font-bold text-black">{selected.solar.production_today}</p><p className="text-[10px] text-gray-500">Today</p></div>
                    <div className="bg-amber-50 rounded-lg p-2.5 text-center"><p className="text-base font-bold text-black">{selected.solar.production_month}</p><p className="text-[10px] text-gray-500">Month</p></div>
                    <div className={`rounded-lg p-2.5 text-center ${selected.solar.monitoring_status === "Online" ? "bg-green-50" : "bg-red-50"}`}><p className={`text-base font-bold ${selected.solar.monitoring_status === "Online" ? "text-green-600" : "text-red-600"}`}>{selected.solar.monitoring_status}</p><p className="text-[10px] text-gray-500">Status</p></div>
                  </div>
                  {[
                    { l: "System", v: selected.solar.system_size }, { l: "Panels", v: selected.solar.panels },
                    { l: "Inverter", v: selected.solar.inverter }, { l: "Battery", v: selected.solar.battery },
                    { l: "Finance", v: `${selected.solar.financing} — ${selected.solar.lender}` },
                    { l: "Contract", v: `$${selected.solar.contract_amount.toLocaleString()}` },
                    { l: "Stage", v: selected.solar.stage },
                  ].map(f => <div key={f.l} className="flex justify-between py-1 border-b border-gray-50 text-sm"><span className="text-xs text-gray-500">{f.l}</span><span className="text-black font-medium text-xs">{f.v}</span></div>)}
                </div>
              )}

              {selected.smart_home && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-sm font-bold text-black mb-3 flex items-center gap-2"><Shield size={14} className="text-purple-500" /> Smart Home / Security</h3>
                  {[
                    { l: "Provider", v: selected.smart_home.provider }, { l: "Panel", v: selected.smart_home.panel_type },
                    { l: "Cameras", v: String(selected.smart_home.cameras) }, { l: "Sensors", v: String(selected.smart_home.sensors) },
                    { l: "Plan", v: selected.smart_home.monitoring_plan }, { l: "Monthly", v: `$${selected.smart_home.monthly_cost}/mo` },
                    { l: "Term", v: selected.smart_home.contract_term }, { l: "Status", v: selected.smart_home.system_status },
                  ].map(f => <div key={f.l} className="flex justify-between py-1 border-b border-gray-50 text-sm"><span className="text-xs text-gray-500">{f.l}</span><span className="text-black font-medium text-xs">{f.v}</span></div>)}
                </div>
              )}

              {selected.roofing && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-sm font-bold text-black mb-3 flex items-center gap-2"><Home size={14} className="text-blue-500" /> Roofing</h3>
                  {[
                    { l: "Material", v: selected.roofing.material }, { l: "Scope", v: selected.roofing.scope },
                    { l: "Warranty", v: selected.roofing.warranty }, { l: "Contract", v: `$${selected.roofing.contract_amount.toLocaleString()}` },
                    { l: "Status", v: selected.roofing.status },
                  ].map(f => <div key={f.l} className="flex justify-between py-1 border-b border-gray-50 text-sm"><span className="text-xs text-gray-500">{f.l}</span><span className="text-black font-medium text-xs">{f.v}</span></div>)}
                </div>
              )}

              {selected.att && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-sm font-bold text-black mb-3 flex items-center gap-2"><Wifi size={14} className="text-sky-500" /> AT&T / Telecom</h3>
                  {[
                    { l: "Plan", v: selected.att.plan }, { l: "Speed", v: selected.att.speed },
                    { l: "Monthly", v: `$${selected.att.monthly_cost}/mo` }, { l: "Status", v: selected.att.status },
                  ].map(f => <div key={f.l} className="flex justify-between py-1 border-b border-gray-50 text-sm"><span className="text-xs text-gray-500">{f.l}</span><span className="text-black font-medium text-xs">{f.v}</span></div>)}
                </div>
              )}

              {/* Cross-sell Opportunities */}
              {selected.cross_sell_opps.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5 col-span-2">
                  <h3 className="text-sm font-bold text-black mb-4 flex items-center gap-2"><Target size={14} className="text-[#F0A500]" /> Cross-Sell Opportunities</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {selected.cross_sell_opps.map((opp, i) => (
                      <div key={i} className="border border-gray-100 rounded-lg p-4 hover:border-[#F0A500]/40 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-[#F0A500] uppercase">{opp.vertical}</span>
                          <span className="text-xs font-bold text-green-600">${opp.estimated_revenue.toLocaleString()}</span>
                        </div>
                        <p className="text-sm font-semibold text-black mb-1">{opp.title}</p>
                        <p className="text-xs text-gray-500 mb-2">{opp.approach}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#F0A500] rounded-full" style={{ width: `${opp.confidence}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-gray-500">{opp.confidence}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── AI INSIGHTS ─── */}
          {activeTab === "ai-insights" && (
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-black to-gray-800 rounded-xl p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <Brain size={18} className="text-[#F0A500]" />
                  <h3 className="text-lg font-bold">AI Intelligence Report</h3>
                  <span className="ml-auto text-xs text-white/60">Updated 2 hours ago</span>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-5">
                  {[
                    { label: "Health Score", value: selected.health_score, color: selected.health_score >= 80 ? "#22c55e" : "#f59e0b" },
                    { label: "Churn Risk", value: `${selected.churn_risk}%`, color: selected.churn_risk <= 15 ? "#22c55e" : "#ef4444" },
                    { label: "Referral Likelihood", value: `${selected.referral_score}%`, color: "#F0A500" },
                    { label: "Sentiment", value: `${selected.sentiment}%`, color: selected.sentiment >= 70 ? "#22c55e" : "#f59e0b" },
                  ].map(m => (
                    <div key={m.label} className="bg-white/10 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold" style={{ color: typeof m.color === "string" ? m.color : undefined }}>{m.value}</p>
                      <p className="text-xs text-white/60 mt-1">{m.label}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb size={14} className="text-[#F0A500]" />
                    <span className="text-sm font-bold">Next Best Action</span>
                  </div>
                  <p className="text-sm text-white/80">{selected.next_best_action}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-sm font-bold text-black mb-4">Predictive Scores</h3>
                  {[
                    { label: "Predicted Lifetime Value", value: `$${selected.predicted_ltv.toLocaleString()}`, pct: Math.min(100, (selected.predicted_ltv / 200000) * 100), color: "bg-[#F0A500]" },
                    { label: "Payment Default Risk", value: `${selected.payment_default_risk}%`, pct: selected.payment_default_risk, color: selected.payment_default_risk > 15 ? "bg-red-500" : "bg-green-500" },
                    { label: "Cross-Sell Readiness", value: `${selected.cross_sell_score}%`, pct: selected.cross_sell_score, color: "bg-purple-500" },
                    { label: "Referral Likelihood", value: `${selected.referral_score}%`, pct: selected.referral_score, color: "bg-blue-500" },
                  ].map(s => (
                    <div key={s.label} className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-500">{s.label}</span>
                        <span className="text-xs font-bold text-black">{s.value}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-sm font-bold text-black mb-4">Cross-Sell Recommendations</h3>
                  {selected.cross_sell_opps.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle2 size={24} className="text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Customer has all available verticals!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selected.cross_sell_opps.map((opp, i) => (
                        <div key={i} className="border border-gray-100 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-[#F0A500]">{opp.vertical}</span>
                            <span className="text-sm font-bold text-green-600">${opp.estimated_revenue.toLocaleString()}</span>
                          </div>
                          <p className="text-xs font-semibold text-black">{opp.title}</p>
                          <p className="text-[11px] text-gray-500 mt-1">{opp.approach}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] text-gray-500">Confidence:</span>
                            <div className="flex-1 h-1 bg-gray-100 rounded-full"><div className="h-full bg-[#F0A500] rounded-full" style={{ width: `${opp.confidence}%` }} /></div>
                            <span className="text-[10px] font-bold">{opp.confidence}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ─── FINANCIAL ─── */}
          {activeTab === "financial" && (
            <div className="space-y-5">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                  <p className="text-xs text-gray-500 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-black">${selected.ltv.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                  <p className="text-xs text-gray-500 mb-1">Monthly Recurring</p>
                  <p className="text-2xl font-bold text-black">${((selected.smart_home?.monthly_cost || 0) + (selected.att?.monthly_cost || 0)).toFixed(2)}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                  <p className="text-xs text-gray-500 mb-1">Outstanding</p>
                  <p className="text-2xl font-bold text-black">${selected.payments.filter(p => p.status === "pending").reduce((s, p) => s + p.amount, 0).toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                  <p className="text-xs text-gray-500 mb-1">Predicted LTV</p>
                  <p className="text-2xl font-bold text-[#F0A500]">${selected.predicted_ltv.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-sm font-bold text-black mb-4">Revenue by Vertical</h3>
                  {verticalRevenue.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={verticalRevenue} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, value }: any) => `${name}: $${value.toLocaleString()}`}>
                          {verticalRevenue.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : <p className="text-sm text-gray-400 text-center py-8">No revenue data</p>}
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-sm font-bold text-black mb-4">Payment History</h3>
                  {selected.payments.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={[...selected.payments].reverse()}>
                        <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} />
                        <Bar dataKey="amount" fill="#F0A500" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : <p className="text-sm text-gray-400 text-center py-8">No payments yet</p>}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-bold text-black mb-4">Payment Log</h3>
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-100"><th className="text-left py-2 text-xs font-semibold text-gray-500">Month</th><th className="text-right py-2 text-xs font-semibold text-gray-500">Amount</th><th className="text-right py-2 text-xs font-semibold text-gray-500">Status</th></tr></thead>
                  <tbody>
                    {selected.payments.map((p, i) => (
                      <tr key={i} className="border-b border-gray-50">
                        <td className="py-2 text-black">{p.month}</td>
                        <td className="py-2 text-right font-semibold text-black">${p.amount.toLocaleString()}</td>
                        <td className="py-2 text-right"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.status === "paid" ? "bg-green-50 text-green-700" : p.status === "late" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{p.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── ACTIVITY ─── */}
          {activeTab === "activity" && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-black mb-4">Activity Timeline ({selected.activities.length})</h3>
              <div className="space-y-0">
                {selected.activities.map((act, i) => {
                  const cfg = ACTIVITY_ICONS[act.type] || ACTIVITY_ICONS.note;
                  const AIcon = cfg.icon;
                  return (
                    <div key={act.id} className="flex gap-3 relative">
                      {i < selected.activities.length - 1 && <div className="absolute left-[15px] top-9 bottom-0 w-px bg-gray-100" />}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${cfg.color}`}><AIcon size={14} /></div>
                      <div className="flex-1 pb-5">
                        <p className="text-sm text-black font-medium">{act.description}</p>
                        <div className="flex items-center gap-2 mt-1"><span className="text-[11px] text-gray-500">{act.date}</span><span className="text-[11px] text-gray-400">·</span><span className="text-[11px] text-gray-500 font-semibold">{act.user}</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── COMMUNICATIONS ─── */}
          {activeTab === "communications" && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-black">Communications ({selected.communications.length})</h3>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-black text-white rounded-lg text-xs font-semibold"><Send size={12} /> Compose</button>
              </div>
              {selected.communications.length === 0 ? <p className="text-sm text-gray-400 text-center py-8">No communications yet</p> : (
                <div className="space-y-2">
                  {selected.communications.map(c => (
                    <div key={c.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${c.channel === "email" ? "bg-blue-50 text-blue-600" : c.channel === "call" ? "bg-green-50 text-green-600" : "bg-purple-50 text-purple-600"}`}>
                        {c.channel === "email" ? <Mail size={14} /> : c.channel === "call" ? <Phone size={14} /> : <MessageSquare size={14} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-black">{c.subject}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${c.direction === "inbound" ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-600"}`}>{c.direction}</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{c.preview}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{c.date} · {c.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── DOCUMENTS ─── */}
          {activeTab === "documents" && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-black">Documents ({selected.documents.length})</h3>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-black text-white rounded-lg text-xs font-semibold"><Plus size={12} /> Upload</button>
              </div>
              {selected.documents.length === 0 ? <p className="text-sm text-gray-400 text-center py-8">No documents</p> : (
                <div className="space-y-2">
                  {selected.documents.map(doc => (
                    <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                      <FileText size={16} className="text-gray-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black truncate">{doc.name}</p>
                        <p className="text-[11px] text-gray-500">{doc.type} · {doc.date} · {doc.size}</p>
                      </div>
                      <button className="text-xs font-semibold text-black hover:underline">View</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── TICKETS ─── */}
          {activeTab === "tickets" && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-black">Support Tickets ({selected.tickets.length})</h3>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-black text-white rounded-lg text-xs font-semibold"><Plus size={12} /> New Ticket</button>
              </div>
              {selected.tickets.length === 0 ? <p className="text-sm text-gray-400 text-center py-8">No tickets</p> : (
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-100"><th className="text-left py-2 text-xs text-gray-500">#</th><th className="text-left py-2 text-xs text-gray-500">Subject</th><th className="text-left py-2 text-xs text-gray-500">Status</th><th className="text-left py-2 text-xs text-gray-500">Priority</th><th className="text-left py-2 text-xs text-gray-500">Created</th></tr></thead>
                  <tbody>
                    {selected.tickets.map(t => (
                      <tr key={t.id} className="border-b border-gray-50">
                        <td className="py-2 font-mono text-xs">#{t.number}</td>
                        <td className="py-2 font-medium text-black">{t.subject}</td>
                        <td className="py-2"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${t.status === "Open" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>{t.status}</span></td>
                        <td className="py-2"><span className={`text-xs font-semibold ${t.priority === "High" ? "text-red-600" : "text-gray-600"}`}>{t.priority}</span></td>
                        <td className="py-2 text-gray-500">{t.created}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ─── NOTES ─── */}
          {activeTab === "notes" && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-black mb-4">Notes</h3>
              <textarea className="w-full h-40 border border-gray-200 rounded-lg p-3 text-sm text-black outline-none focus:border-black resize-none" defaultValue={selected.notes} />
              <div className="flex justify-end mt-3"><button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800">Save Notes</button></div>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ─── LIST VIEW ─── */
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-black flex items-center gap-2"><Dna size={24} /> Customer DNA</h1>
            <p className="text-sm text-gray-500 mt-0.5">360° customer intelligence — all verticals, all data, one view</p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800"><Plus size={14} /> Add Customer</button>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-5 gap-3 mb-5">
          {[
            { label: "Total Customers", value: stats.total, icon: Users, color: "text-black" },
            { label: "Total LTV", value: `$${stats.totalLtv.toLocaleString()}`, icon: DollarSign, color: "text-green-600" },
            { label: "Avg Health Score", value: stats.avgHealth, icon: Heart, color: stats.avgHealth >= 80 ? "text-green-600" : "text-amber-500" },
            { label: "Cross-Sell Opps", value: stats.crossSellOpps, icon: Target, color: "text-[#F0A500]" },
            { label: "Predicted Total LTV", value: `$${stats.totalPredictedLtv.toLocaleString()}`, icon: TrendingUp, color: "text-purple-600" },
          ].map(s => {
            const SIcon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-1"><SIcon size={14} className="text-gray-400" /><span className="text-[10px] font-semibold text-gray-500 uppercase">{s.label}</span></div>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            );
          })}
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 max-w-md focus-within:border-black">
            <Search size={14} className="text-gray-400 mr-2" />
            <input type="text" placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 text-sm outline-none bg-transparent text-black placeholder-gray-400" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold border transition-colors ${showFilters ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}>
            <Filter size={14} /> Filters
          </button>
          <div className="flex items-center gap-1 ml-auto">
            <button onClick={() => setViewMode("list")} className={`p-2 rounded ${viewMode === "list" ? "bg-black text-white" : "text-gray-400 hover:text-black"}`}><List size={16} /></button>
            <button onClick={() => setViewMode("grid")} className={`p-2 rounded ${viewMode === "grid" ? "bg-black text-white" : "text-gray-400 hover:text-black"}`}><Grid3X3 size={16} /></button>
          </div>
        </div>

        {showFilters && (
          <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded-lg border border-gray-200">
            <select value={filterVertical} onChange={e => setFilterVertical(e.target.value)} className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 outline-none bg-white text-black">
              <option value="all">All Verticals</option>
              <option value="solar">Solar</option>
              <option value="smart_home">Security</option>
              <option value="roofing">Roofing</option>
              <option value="att">AT&T</option>
            </select>
            <select value={filterStage} onChange={e => setFilterStage(e.target.value)} className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 outline-none bg-white text-black">
              <option value="all">All Stages</option>
              <option value="Lead">Lead</option>
              <option value="Customer">Customer</option>
            </select>
            <select value={filterState} onChange={e => setFilterState(e.target.value)} className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 outline-none bg-white text-black">
              <option value="all">All States</option>
              <option value="TX">Texas</option>
              <option value="OH">Ohio</option>
              <option value="MI">Michigan</option>
            </select>
            <button onClick={() => { setFilterVertical("all"); setFilterStage("all"); setFilterState("all"); }} className="text-xs text-gray-500 hover:text-black ml-auto">Clear All</button>
          </div>
        )}

        {/* Bulk actions */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 mb-4 p-3 bg-black text-white rounded-lg text-sm">
            <span className="font-semibold">{selectedIds.size} selected</span>
            <button className="px-3 py-1 bg-white/20 rounded text-xs font-semibold hover:bg-white/30">Bulk Email</button>
            <button className="px-3 py-1 bg-white/20 rounded text-xs font-semibold hover:bg-white/30">Assign Owner</button>
            <button className="px-3 py-1 bg-white/20 rounded text-xs font-semibold hover:bg-white/30">Add Tag</button>
            <button onClick={() => setSelectedIds(new Set())} className="ml-auto text-xs text-white/60 hover:text-white">Deselect All</button>
          </div>
        )}

        {/* Table Header */}
        {viewMode === "list" && (
          <div className="flex items-center gap-4 px-5 py-2 text-[10px] font-bold text-gray-500 uppercase border-b border-gray-200">
            <input type="checkbox" checked={selectedIds.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="shrink-0" />
            <button onClick={() => toggleSort("name")} className="flex items-center gap-1 flex-1 min-w-[200px]">Customer <ArrowUpDown size={10} /></button>
            <span className="w-20 text-center">Verticals</span>
            <button onClick={() => toggleSort("health")} className="flex items-center gap-1 w-20 justify-center">Health <ArrowUpDown size={10} /></button>
            <button onClick={() => toggleSort("ltv")} className="flex items-center gap-1 w-28 justify-end">LTV <ArrowUpDown size={10} /></button>
            <span className="w-24 text-center">Cross-Sell</span>
            <span className="w-20 text-center">State</span>
            <span className="w-10" />
          </div>
        )}

        {/* List / Grid */}
        {viewMode === "list" ? (
          <div className="space-y-0">
            {filtered.map(c => {
              const verticals = [c.solar && "Solar", c.smart_home && "Security", c.roofing && "Roofing", c.att && "AT&T"].filter(Boolean);
              const hColor = c.health_score >= 80 ? "text-green-600 bg-green-50" : c.health_score >= 60 ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50";
              return (
                <div key={c.id} className="flex items-center gap-4 px-5 py-3 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors group">
                  <input type="checkbox" checked={selectedIds.has(c.id)} onChange={() => toggleSelect(c.id)} className="shrink-0" onClick={e => e.stopPropagation()} />
                  <button onClick={() => setSelectedId(c.id)} className="flex items-center gap-3 flex-1 min-w-[200px] text-left">
                    <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold shrink-0">{c.avatar}</div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-black truncate">{c.first_name} {c.last_name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{c.email}</p>
                    </div>
                  </button>
                  <div className="w-20 flex items-center justify-center gap-0.5">
                    {c.solar && <Sun size={12} className="text-amber-500" />}
                    {c.smart_home && <Shield size={12} className="text-purple-500" />}
                    {c.roofing && <Home size={12} className="text-blue-500" />}
                    {c.att && <Wifi size={12} className="text-sky-500" />}
                  </div>
                  <div className="w-20 flex justify-center"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${hColor}`}>{c.health_score}</span></div>
                  <div className="w-28 text-right text-sm font-semibold text-black">${c.ltv.toLocaleString()}</div>
                  <div className="w-24 text-center"><span className="text-xs font-semibold text-[#F0A500]">{c.cross_sell_opps.length} opps</span></div>
                  <div className="w-20 text-center text-xs font-semibold text-gray-600">{c.state}</div>
                  <button onClick={() => setSelectedId(c.id)} className="w-10 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Eye size={14} className="text-gray-400 hover:text-black" /></button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {filtered.map(c => (
              <button key={c.id} onClick={() => setSelectedId(c.id)} className="text-left bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">{c.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-black">{c.first_name} {c.last_name}</p>
                    <p className="text-[11px] text-gray-500">{c.city}, {c.state}</p>
                  </div>
                  <HealthGauge score={c.health_score} />
                </div>
                <div className="flex items-center gap-1.5 mb-3">
                  {c.solar && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">Solar</span>}
                  {c.smart_home && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700">Security</span>}
                  {c.roofing && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">Roofing</span>}
                  {c.att && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-sky-50 text-sky-700">AT&T</span>}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">LTV: <strong className="text-black">${c.ltv.toLocaleString()}</strong></span>
                  <span className="text-[#F0A500] font-semibold">{c.cross_sell_opps.length} cross-sell opps</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 && <div className="text-center py-16"><p className="text-gray-400">No customers match your filters</p></div>}
      </div>
    </div>
  );
}
