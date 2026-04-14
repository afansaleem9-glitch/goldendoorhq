// ═══════════════════════════════════════════════════════════════
// GOLDENDOOR SOLAR — Coperniq-Class Solar CRM Data Layer
// Full mock data for every module: projects, assets, crews,
// invoices, inventory, schedules, monitoring, contracts
// ═══════════════════════════════════════════════════════════════

export type SolarStage =
  | 'lead' | 'site_survey' | 'design' | 'proposal' | 'contract'
  | 'permitting' | 'procurement' | 'install_scheduled' | 'install_in_progress'
  | 'install_complete' | 'inspection' | 'pto_submitted' | 'pto_approved'
  | 'monitoring_setup' | 'complete';

export interface SolarStageConfig {
  key: SolarStage;
  label: string;
  short: string;
  color: string;
  bgLight: string;
  group: 'sell' | 'build' | 'service';
}

export const STAGES: SolarStageConfig[] = [
  { key: 'lead', label: 'New Lead', short: 'Lead', color: '#6366F1', bgLight: '#EEF2FF', group: 'sell' },
  { key: 'site_survey', label: 'Site Survey', short: 'Survey', color: '#8B5CF6', bgLight: '#F5F3FF', group: 'sell' },
  { key: 'design', label: 'System Design', short: 'Design', color: '#A855F7', bgLight: '#FAF5FF', group: 'sell' },
  { key: 'proposal', label: 'Proposal Sent', short: 'Proposal', color: '#D946EF', bgLight: '#FDF4FF', group: 'sell' },
  { key: 'contract', label: 'Contract Signed', short: 'Contract', color: '#3B82F6', bgLight: '#EFF6FF', group: 'sell' },
  { key: 'permitting', label: 'Permitting', short: 'Permits', color: '#F59E0B', bgLight: '#FFFBEB', group: 'build' },
  { key: 'procurement', label: 'Procurement', short: 'Procure', color: '#F97316', bgLight: '#FFF7ED', group: 'build' },
  { key: 'install_scheduled', label: 'Install Scheduled', short: 'Sched.', color: '#EF4444', bgLight: '#FEF2F2', group: 'build' },
  { key: 'install_in_progress', label: 'Install In Progress', short: 'Installing', color: '#DC2626', bgLight: '#FEF2F2', group: 'build' },
  { key: 'install_complete', label: 'Install Complete', short: 'Installed', color: '#EA580C', bgLight: '#FFF7ED', group: 'build' },
  { key: 'inspection', label: 'Inspection', short: 'Inspect', color: '#14B8A6', bgLight: '#F0FDFA', group: 'build' },
  { key: 'pto_submitted', label: 'PTO Submitted', short: 'PTO Sub.', color: '#059669', bgLight: '#ECFDF5', group: 'build' },
  { key: 'pto_approved', label: 'PTO Approved', short: 'PTO OK', color: '#047857', bgLight: '#ECFDF5', group: 'build' },
  { key: 'monitoring_setup', label: 'Monitoring Setup', short: 'Monitor', color: '#0D9488', bgLight: '#F0FDFA', group: 'service' },
  { key: 'complete', label: 'Complete', short: 'Done', color: '#22C55E', bgLight: '#F0FDF4', group: 'service' },
];

export function stageIndex(s: SolarStage) { return STAGES.findIndex(x => x.key === s); }
export function stageConfig(s: SolarStage) { return STAGES.find(x => x.key === s) || STAGES[0]; }
export function progressPct(s: SolarStage) { return Math.round(((stageIndex(s) + 1) / STAGES.length) * 100); }

export interface SolarProject {
  id: string;
  project_number: string;
  customer: { name: string; email: string; phone: string; address: string; city: string; state: string; zip: string; };
  rep: { name: string; id: string; avatar?: string };
  assigned_to: { name: string; role: string };
  current_stage: SolarStage;
  system: { size_kw: number; panels: number; panel_type: string; inverter: string; battery?: string; roof_type: string; };
  financial: { contract_amount: number; financing: string; lender?: string; monthly_payment?: number; adders: number; dealer_fee_pct: number; down_payment: number; };
  utility: { company: string; ahj: string; rate_schedule?: string; };
  permit: { number?: string; submitted_at?: string; approved_at?: string; fee?: number; };
  install: { crew_lead?: string; crew_size?: number; scheduled_date?: string; completed_date?: string; duration_hrs?: number; };
  inspection: { result?: string; inspector?: string; date?: string; notes?: string; };
  pto: { submitted_at?: string; approved_at?: string; number?: string; meter_swap?: string; };
  monitoring: { provider?: string; system_id?: string; status?: string; production_today_kwh?: number; lifetime_kwh?: number; };
  stage_timestamps: Partial<Record<SolarStage, string>>;
  blockers: { stage: SolarStage; description: string; severity: 'critical' | 'warning' }[];
  documents: { name: string; type: string; url: string; date: string }[];
  notes: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export const projects: SolarProject[] = [
  {
    id: 'sp1', project_number: 'GD-2026-001',
    customer: { name: 'Sarah Johnson', email: 'sarah.j@techcorp.com', phone: '(512) 555-0142', address: '2847 Sunset Ridge', city: 'Austin', state: 'TX', zip: '78746' },
    rep: { name: 'Afan Saleem', id: 'r1' }, assigned_to: { name: 'Jake Morrison', role: 'Install Coordinator' },
    current_stage: 'install_in_progress',
    system: { size_kw: 12.4, panels: 31, panel_type: 'REC Alpha Pure-R 400W', inverter: 'Enphase IQ8+', battery: 'Enphase IQ 5P', roof_type: 'Composition Shingle' },
    financial: { contract_amount: 42800, financing: 'Loan', lender: 'GoodLeap', monthly_payment: 189, adders: 4200, dealer_fee_pct: 18, down_payment: 0 },
    utility: { company: 'Austin Energy', ahj: 'City of Austin', rate_schedule: 'Residential TOU' },
    permit: { number: 'AUS-2026-44521', submitted_at: '2026-02-12', approved_at: '2026-02-28', fee: 450 },
    install: { crew_lead: 'Carlos Rivera', crew_size: 4, scheduled_date: '2026-03-28', duration_hrs: 14 },
    inspection: {}, pto: {},
    monitoring: { provider: 'Enphase', system_id: 'ENV-44521', status: 'pending_activation' },
    stage_timestamps: { lead: '2026-01-02', site_survey: '2026-01-10', design: '2026-01-18', proposal: '2026-01-22', contract: '2026-01-28', permitting: '2026-02-12', procurement: '2026-03-01', install_scheduled: '2026-03-15', install_in_progress: '2026-03-28' },
    blockers: [],
    documents: [
      { name: 'Contract — GoodLeap Finance', type: 'contract', url: '#', date: '2026-01-28' },
      { name: 'Site Survey Report', type: 'survey', url: '#', date: '2026-01-10' },
      { name: 'CAD Design v2', type: 'design', url: '#', date: '2026-02-05' },
      { name: 'Permit Approval', type: 'permit', url: '#', date: '2026-02-28' },
      { name: 'Install Day 1 Photos', type: 'photo', url: '#', date: '2026-03-28' },
    ],
    notes: 'Premium install — battery + panels. Customer requested south-facing max production layout.',
    tags: ['battery', 'premium', 'high-value'],
    created_at: '2026-01-02', updated_at: '2026-04-01',
  },
  {
    id: 'sp2', project_number: 'GD-2026-002',
    customer: { name: 'Marcus Williams', email: 'marcus@buildright.com', phone: '(614) 555-0198', address: '1455 Oak Park Blvd', city: 'Columbus', state: 'OH', zip: '43215' },
    rep: { name: 'James Reed', id: 'r2' }, assigned_to: { name: 'Lisa Park', role: 'Permit Coordinator' },
    current_stage: 'permitting',
    system: { size_kw: 8.8, panels: 22, panel_type: 'Canadian Solar 400W', inverter: 'SolarEdge SE7600H', roof_type: 'Standing Seam Metal' },
    financial: { contract_amount: 29400, financing: 'Cash', adders: 1800, dealer_fee_pct: 0, down_payment: 29400 },
    utility: { company: 'AEP Ohio', ahj: 'City of Columbus' },
    permit: { submitted_at: '2026-03-25' },
    install: {}, inspection: {}, pto: {},
    monitoring: { provider: 'SolarEdge' },
    stage_timestamps: { lead: '2026-02-05', site_survey: '2026-02-15', design: '2026-02-28', proposal: '2026-03-05', contract: '2026-03-12', permitting: '2026-03-25' },
    blockers: [{ stage: 'permitting', description: 'AHJ requires structural engineering letter — awaiting from engineer', severity: 'warning' }],
    documents: [
      { name: 'Cash Purchase Agreement', type: 'contract', url: '#', date: '2026-03-12' },
      { name: 'Site Survey + Shade Analysis', type: 'survey', url: '#', date: '2026-02-15' },
    ],
    notes: 'Metal roof requires specialized racking. Cash deal — no lender docs.',
    tags: ['cash', 'metal-roof'],
    created_at: '2026-02-05', updated_at: '2026-03-25',
  },
  {
    id: 'sp3', project_number: 'GD-2026-003',
    customer: { name: 'Emily Chen', email: 'echen@novahome.io', phone: '(313) 555-0267', address: '890 Maple Dr', city: 'Detroit', state: 'MI', zip: '48201' },
    rep: { name: 'Mike Torres', id: 'r3' }, assigned_to: { name: 'Mike Torres', role: 'Sales Rep' },
    current_stage: 'site_survey',
    system: { size_kw: 10.0, panels: 25, panel_type: 'Qcells Q.PEAK DUO 400W', inverter: 'Enphase IQ8M', roof_type: 'Asphalt Shingle' },
    financial: { contract_amount: 35600, financing: 'Loan', lender: 'Mosaic', monthly_payment: 155, adders: 2400, dealer_fee_pct: 22, down_payment: 0 },
    utility: { company: 'DTE Energy', ahj: 'City of Detroit' },
    permit: {}, install: {}, inspection: {}, pto: {},
    monitoring: { provider: 'Enphase' },
    stage_timestamps: { lead: '2026-04-02', site_survey: '2026-04-08' },
    blockers: [],
    documents: [],
    notes: 'New lead from door knock. Interested in reducing $280/mo electric bill.',
    tags: ['new', 'door-knock'],
    created_at: '2026-04-02', updated_at: '2026-04-08',
  },
  {
    id: 'sp4', project_number: 'GD-2026-004',
    customer: { name: 'Robert Martinez', email: 'robert.m@sunvalley.com', phone: '(512) 555-0334', address: '5678 Longhorn Way', city: 'San Antonio', state: 'TX', zip: '78229' },
    rep: { name: 'Afan Saleem', id: 'r1' }, assigned_to: { name: 'Jake Morrison', role: 'Install Coordinator' },
    current_stage: 'pto_submitted',
    system: { size_kw: 15.6, panels: 39, panel_type: 'REC Alpha Pure-R 400W', inverter: 'Enphase IQ8+', battery: 'Tesla Powerwall 3', roof_type: 'Clay Tile' },
    financial: { contract_amount: 58200, financing: 'PPA', adders: 6800, dealer_fee_pct: 0, down_payment: 0 },
    utility: { company: 'CPS Energy', ahj: 'City of San Antonio' },
    permit: { number: 'SA-2026-11234', submitted_at: '2026-01-30', approved_at: '2026-02-18', fee: 380 },
    install: { crew_lead: 'Carlos Rivera', crew_size: 5, scheduled_date: '2026-02-25', completed_date: '2026-02-27', duration_hrs: 18 },
    inspection: { result: 'passed', inspector: 'R. Davis', date: '2026-03-10', notes: 'Passed — no corrections needed' },
    pto: { submitted_at: '2026-03-15' },
    monitoring: { provider: 'Enphase', system_id: 'ENV-11234', status: 'pending_activation' },
    stage_timestamps: { lead: '2025-12-01', site_survey: '2025-12-10', design: '2025-12-22', proposal: '2026-01-05', contract: '2026-01-12', permitting: '2026-01-30', procurement: '2026-02-10', install_scheduled: '2026-02-20', install_in_progress: '2026-02-25', install_complete: '2026-02-27', inspection: '2026-03-10', pto_submitted: '2026-03-15' },
    blockers: [{ stage: 'pto_submitted', description: 'CPS Energy backlog — estimated 4-6 weeks for PTO review', severity: 'warning' }],
    documents: [
      { name: 'PPA Agreement', type: 'contract', url: '#', date: '2026-01-12' },
      { name: 'Structural Engineering Report', type: 'engineering', url: '#', date: '2026-01-25' },
      { name: 'Permit Approval', type: 'permit', url: '#', date: '2026-02-18' },
      { name: 'Inspection Pass Certificate', type: 'inspection', url: '#', date: '2026-03-10' },
      { name: 'PTO Application', type: 'pto', url: '#', date: '2026-03-15' },
    ],
    notes: 'Large commercial PPA. Battery + panels. Tile roof required additional engineering.',
    tags: ['battery', 'commercial', 'tile-roof', 'ppa'],
    created_at: '2025-12-01', updated_at: '2026-03-15',
  },
  {
    id: 'sp5', project_number: 'GD-2026-005',
    customer: { name: 'Jennifer Thompson', email: 'jthompson@greenbuild.org', phone: '(614) 555-0411', address: '342 Green Valley Rd', city: 'Cincinnati', state: 'OH', zip: '45202' },
    rep: { name: 'Sarah Kim', id: 'r4' }, assigned_to: { name: 'Sarah Kim', role: 'Sales Rep' },
    current_stage: 'design',
    system: { size_kw: 6.4, panels: 16, panel_type: 'LG NeON R 400W', inverter: 'SolarEdge SE5000H', roof_type: 'Flat (TPO)' },
    financial: { contract_amount: 22800, financing: 'Loan', lender: 'Sunlight Financial', monthly_payment: 118, adders: 1200, dealer_fee_pct: 20, down_payment: 0 },
    utility: { company: 'Duke Energy Ohio', ahj: 'Hamilton County' },
    permit: {}, install: {}, inspection: {}, pto: {},
    monitoring: { provider: 'SolarEdge' },
    stage_timestamps: { lead: '2026-03-15', site_survey: '2026-03-25', design: '2026-04-01' },
    blockers: [],
    documents: [
      { name: 'Site Survey Photos', type: 'survey', url: '#', date: '2026-03-25' },
    ],
    notes: 'Flat roof requires ballast mount system. Awaiting Aurora design.',
    tags: ['flat-roof', 'ballast'],
    created_at: '2026-03-15', updated_at: '2026-04-01',
  },
  {
    id: 'sp6', project_number: 'GD-2025-089',
    customer: { name: 'David Patel', email: 'dpatel@safeguard.net', phone: '(313) 555-0523', address: '1920 Liberty St', city: 'Ann Arbor', state: 'MI', zip: '48104' },
    rep: { name: 'James Reed', id: 'r2' }, assigned_to: { name: 'Operations', role: 'Service Team' },
    current_stage: 'complete',
    system: { size_kw: 11.2, panels: 28, panel_type: 'SunPower M-Series 400W', inverter: 'Enphase IQ8+', roof_type: 'Composition Shingle' },
    financial: { contract_amount: 39800, financing: 'Cash', adders: 3200, dealer_fee_pct: 0, down_payment: 39800 },
    utility: { company: 'DTE Energy', ahj: 'City of Ann Arbor' },
    permit: { number: 'AA-2025-8891', submitted_at: '2025-11-20', approved_at: '2025-12-05', fee: 325 },
    install: { crew_lead: 'Carlos Rivera', crew_size: 4, scheduled_date: '2025-12-10', completed_date: '2025-12-11', duration_hrs: 12 },
    inspection: { result: 'passed', inspector: 'M. Thompson', date: '2025-12-22', notes: 'All clear' },
    pto: { submitted_at: '2025-12-28', approved_at: '2026-01-15', number: 'DTE-PTO-2026-0045', meter_swap: '2026-01-20' },
    monitoring: { provider: 'Enphase', system_id: 'ENV-8891', status: 'active', production_today_kwh: 42.3, lifetime_kwh: 3840 },
    stage_timestamps: { lead: '2025-10-01', site_survey: '2025-10-08', design: '2025-10-20', proposal: '2025-10-28', contract: '2025-11-05', permitting: '2025-11-20', procurement: '2025-12-01', install_scheduled: '2025-12-05', install_in_progress: '2025-12-10', install_complete: '2025-12-11', inspection: '2025-12-22', pto_submitted: '2025-12-28', pto_approved: '2026-01-15', monitoring_setup: '2026-01-20', complete: '2026-01-20' },
    blockers: [],
    documents: [
      { name: 'Cash Agreement', type: 'contract', url: '#', date: '2025-11-05' },
      { name: 'PTO Approval Letter', type: 'pto', url: '#', date: '2026-01-15' },
      { name: 'As-Built Diagrams', type: 'engineering', url: '#', date: '2025-12-12' },
    ],
    notes: 'Completed project. System producing 15% above estimate. Customer extremely satisfied — referral program enrolled.',
    tags: ['completed', 'referral-enrolled', 'cash'],
    created_at: '2025-10-01', updated_at: '2026-01-20',
  },
  {
    id: 'sp7', project_number: 'GD-2026-006',
    customer: { name: 'Lisa Rodriguez', email: 'lisa.r@horizondev.com', phone: '(512) 555-0687', address: '4500 Industrial Pkwy', city: 'Houston', state: 'TX', zip: '77002' },
    rep: { name: 'Mike Torres', id: 'r3' }, assigned_to: { name: 'Mike Torres', role: 'Sales Rep' },
    current_stage: 'proposal',
    system: { size_kw: 20.0, panels: 50, panel_type: 'Canadian Solar 400W', inverter: 'SolarEdge SE10000H', battery: 'Tesla Powerwall 3 x2', roof_type: 'TPO Commercial' },
    financial: { contract_amount: 68000, financing: 'Lease', adders: 8500, dealer_fee_pct: 15, down_payment: 0 },
    utility: { company: 'CenterPoint Energy', ahj: 'City of Houston' },
    permit: {}, install: {}, inspection: {}, pto: {},
    monitoring: { provider: 'SolarEdge' },
    stage_timestamps: { lead: '2026-04-01', site_survey: '2026-04-05', design: '2026-04-09', proposal: '2026-04-12' },
    blockers: [],
    documents: [
      { name: 'Proposal v1 — 20kW + 2x Powerwall', type: 'proposal', url: '#', date: '2026-04-12' },
    ],
    notes: 'Large commercial opportunity. Customer comparing against SunRun quote.',
    tags: ['commercial', 'competitive', 'battery', 'high-value'],
    created_at: '2026-04-01', updated_at: '2026-04-12',
  },
  {
    id: 'sp8', project_number: 'GD-2026-007',
    customer: { name: 'Amanda Foster', email: 'amanda.f@suncoast.com', phone: '(512) 555-0891', address: '7722 Sunset Blvd', city: 'Dallas', state: 'TX', zip: '75201' },
    rep: { name: 'Afan Saleem', id: 'r1' }, assigned_to: { name: 'Jake Morrison', role: 'Install Coordinator' },
    current_stage: 'inspection',
    system: { size_kw: 9.6, panels: 24, panel_type: 'Qcells Q.PEAK DUO 400W', inverter: 'Enphase IQ8M', roof_type: 'Composition Shingle' },
    financial: { contract_amount: 33200, financing: 'Loan', lender: 'GoodLeap', monthly_payment: 145, adders: 2100, dealer_fee_pct: 18, down_payment: 0 },
    utility: { company: 'Oncor', ahj: 'City of Dallas' },
    permit: { number: 'DAL-2026-22890', submitted_at: '2026-03-05', approved_at: '2026-03-18', fee: 410 },
    install: { crew_lead: 'Marcus Day', crew_size: 3, scheduled_date: '2026-03-25', completed_date: '2026-03-26', duration_hrs: 10 },
    inspection: { date: '2026-04-10' },
    pto: {},
    monitoring: { provider: 'Enphase', system_id: 'ENV-22890' },
    stage_timestamps: { lead: '2026-01-15', site_survey: '2026-01-22', design: '2026-02-01', proposal: '2026-02-08', contract: '2026-02-15', permitting: '2026-03-05', procurement: '2026-03-12', install_scheduled: '2026-03-20', install_in_progress: '2026-03-25', install_complete: '2026-03-26', inspection: '2026-04-10' },
    blockers: [{ stage: 'inspection', description: 'Inspection scheduled for Apr 15 — awaiting city inspector', severity: 'warning' }],
    documents: [
      { name: 'Loan Agreement — GoodLeap', type: 'contract', url: '#', date: '2026-02-15' },
      { name: 'Install Completion Photos', type: 'photo', url: '#', date: '2026-03-26' },
    ],
    notes: 'Clean install. Awaiting city inspection — scheduled Apr 15.',
    tags: ['standard'],
    created_at: '2026-01-15', updated_at: '2026-04-10',
  },
];

// Crew & Dispatch data
export interface CrewMember {
  id: string; name: string; role: string; phone: string; status: 'available' | 'on_job' | 'off';
  current_job?: string; skills: string[]; rating: number;
}

export const crews: CrewMember[] = [
  { id: 'cm1', name: 'Carlos Rivera', role: 'Lead Installer', phone: '(512) 555-1001', status: 'on_job', current_job: 'GD-2026-001', skills: ['solar', 'battery', 'tile-roof'], rating: 4.9 },
  { id: 'cm2', name: 'Marcus Day', role: 'Lead Installer', phone: '(614) 555-1002', status: 'available', skills: ['solar', 'metal-roof', 'flat-roof'], rating: 4.7 },
  { id: 'cm3', name: 'Tony Nguyen', role: 'Electrician', phone: '(313) 555-1003', status: 'available', skills: ['electrical', 'battery', 'panel-upgrade'], rating: 4.8 },
  { id: 'cm4', name: 'Alex Cruz', role: 'Installer', phone: '(512) 555-1004', status: 'on_job', current_job: 'GD-2026-001', skills: ['solar', 'racking'], rating: 4.5 },
  { id: 'cm5', name: 'Brian Kim', role: 'Installer', phone: '(614) 555-1005', status: 'off', skills: ['solar', 'electrical'], rating: 4.6 },
  { id: 'cm6', name: 'Devon Hart', role: 'Site Surveyor', phone: '(512) 555-1006', status: 'available', skills: ['survey', 'drone', 'shade-analysis'], rating: 4.9 },
];

// Schedule entries
export interface ScheduleEntry {
  id: string; project_id: string; project_number: string; customer_name: string;
  type: 'install' | 'survey' | 'inspection' | 'service' | 'consultation';
  date: string; time_start: string; time_end: string;
  crew: string[]; status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  address: string; notes?: string;
}

export const schedule: ScheduleEntry[] = [
  { id: 'sc1', project_id: 'sp1', project_number: 'GD-2026-001', customer_name: 'Sarah Johnson', type: 'install', date: '2026-04-14', time_start: '07:00', time_end: '17:00', crew: ['Carlos Rivera', 'Alex Cruz', 'Tony Nguyen'], status: 'in_progress', address: '2847 Sunset Ridge, Austin TX', notes: 'Day 2 — finish panel install + electrical' },
  { id: 'sc2', project_id: 'sp3', project_number: 'GD-2026-003', customer_name: 'Emily Chen', type: 'survey', date: '2026-04-15', time_start: '10:00', time_end: '11:30', crew: ['Devon Hart'], status: 'scheduled', address: '890 Maple Dr, Detroit MI', notes: 'Initial site survey — bring drone' },
  { id: 'sc3', project_id: 'sp8', project_number: 'GD-2026-007', customer_name: 'Amanda Foster', type: 'inspection', date: '2026-04-15', time_start: '14:00', time_end: '15:00', crew: ['Jake Morrison'], status: 'scheduled', address: '7722 Sunset Blvd, Dallas TX', notes: 'City inspection — meet inspector on site' },
  { id: 'sc4', project_id: 'sp6', project_number: 'GD-2025-089', customer_name: 'David Patel', type: 'service', date: '2026-04-16', time_start: '09:00', time_end: '10:30', crew: ['Tony Nguyen'], status: 'scheduled', address: '1920 Liberty St, Ann Arbor MI', notes: 'Quarterly monitoring check + panel clean' },
];

// Invoices
export interface Invoice {
  id: string; project_id: string; project_number: string; customer_name: string;
  number: string; amount: number; status: 'draft' | 'sent' | 'paid' | 'overdue' | 'partial';
  milestone: string; due_date: string; paid_date?: string; paid_amount: number;
}

export const invoices: Invoice[] = [
  { id: 'inv1', project_id: 'sp1', project_number: 'GD-2026-001', customer_name: 'Sarah Johnson', number: 'INV-2026-0042', amount: 42800, status: 'partial', milestone: 'Contract Signed', due_date: '2026-02-15', paid_amount: 21400 },
  { id: 'inv2', project_id: 'sp2', project_number: 'GD-2026-002', customer_name: 'Marcus Williams', number: 'INV-2026-0055', amount: 29400, status: 'paid', milestone: 'Full Payment (Cash)', due_date: '2026-03-20', paid_date: '2026-03-18', paid_amount: 29400 },
  { id: 'inv3', project_id: 'sp4', project_number: 'GD-2026-004', customer_name: 'Robert Martinez', number: 'INV-2026-0038', amount: 58200, status: 'partial', milestone: 'Install Complete', due_date: '2026-03-15', paid_amount: 29100 },
  { id: 'inv4', project_id: 'sp6', project_number: 'GD-2025-089', customer_name: 'David Patel', number: 'INV-2025-0312', amount: 39800, status: 'paid', milestone: 'Final Payment', due_date: '2025-12-20', paid_date: '2025-12-15', paid_amount: 39800 },
  { id: 'inv5', project_id: 'sp8', project_number: 'GD-2026-007', customer_name: 'Amanda Foster', number: 'INV-2026-0067', amount: 33200, status: 'sent', milestone: 'Install Complete', due_date: '2026-04-20', paid_amount: 0 },
];

// Equipment catalog
export interface CatalogItem {
  id: string; name: string; category: 'panel' | 'inverter' | 'battery' | 'racking' | 'electrical' | 'monitoring';
  manufacturer: string; model: string; specs: string; unit_cost: number; sell_price: number;
  in_stock: number; on_order: number; lead_time_days: number;
}

export const catalog: CatalogItem[] = [
  { id: 'cat1', name: 'REC Alpha Pure-R 400W', category: 'panel', manufacturer: 'REC', model: 'REC400AA-72', specs: '400W, 21.6% efficiency, 25yr warranty', unit_cost: 185, sell_price: 290, in_stock: 124, on_order: 200, lead_time_days: 14 },
  { id: 'cat2', name: 'Canadian Solar 400W', category: 'panel', manufacturer: 'Canadian Solar', model: 'CS6R-400MS', specs: '400W, 20.8% efficiency, 25yr warranty', unit_cost: 142, sell_price: 235, in_stock: 88, on_order: 150, lead_time_days: 10 },
  { id: 'cat3', name: 'Qcells Q.PEAK DUO 400W', category: 'panel', manufacturer: 'Qcells', model: 'Q.PEAK-G11S-400', specs: '400W, 21.1% efficiency, 25yr warranty', unit_cost: 158, sell_price: 255, in_stock: 60, on_order: 0, lead_time_days: 21 },
  { id: 'cat4', name: 'Enphase IQ8+', category: 'inverter', manufacturer: 'Enphase', model: 'IQ8PLUS-72-M-US', specs: '300VA, microinverter, 25yr warranty', unit_cost: 165, sell_price: 245, in_stock: 200, on_order: 100, lead_time_days: 7 },
  { id: 'cat5', name: 'SolarEdge SE7600H', category: 'inverter', manufacturer: 'SolarEdge', model: 'SE7600H-US', specs: '7.6kW string inverter, 12yr warranty', unit_cost: 1450, sell_price: 2100, in_stock: 12, on_order: 8, lead_time_days: 14 },
  { id: 'cat6', name: 'Enphase IQ Battery 5P', category: 'battery', manufacturer: 'Enphase', model: 'B03-T01-US-1-3', specs: '5kWh, 3.84kW continuous', unit_cost: 4200, sell_price: 6800, in_stock: 6, on_order: 10, lead_time_days: 28 },
  { id: 'cat7', name: 'Tesla Powerwall 3', category: 'battery', manufacturer: 'Tesla', model: 'PW3-US', specs: '13.5kWh, 11.5kW peak', unit_cost: 6500, sell_price: 9800, in_stock: 3, on_order: 5, lead_time_days: 45 },
  { id: 'cat8', name: 'IronRidge XR100', category: 'racking', manufacturer: 'IronRidge', model: 'XR100-168-B', specs: 'Flush mount rail, 168"', unit_cost: 38, sell_price: 65, in_stock: 340, on_order: 0, lead_time_days: 5 },
];

// Monitoring systems (active)
export interface MonitoredSystem {
  id: string; project_id: string; customer_name: string; provider: 'Enphase' | 'SolarEdge';
  system_size_kw: number; status: 'active' | 'alert' | 'offline' | 'pending';
  production_today_kwh: number; production_month_kwh: number; lifetime_mwh: number;
  last_updated: string; alerts: { type: string; message: string; severity: 'info' | 'warning' | 'critical' }[];
}

export const monitoredSystems: MonitoredSystem[] = [
  { id: 'mon1', project_id: 'sp6', customer_name: 'David Patel', provider: 'Enphase', system_size_kw: 11.2, status: 'active', production_today_kwh: 42.3, production_month_kwh: 512, lifetime_mwh: 3.84, last_updated: '2026-04-14T15:30:00', alerts: [] },
  { id: 'mon2', project_id: 'old1', customer_name: 'Tom Henderson', provider: 'Enphase', system_size_kw: 8.4, status: 'active', production_today_kwh: 31.8, production_month_kwh: 389, lifetime_mwh: 12.6, last_updated: '2026-04-14T15:28:00', alerts: [] },
  { id: 'mon3', project_id: 'old2', customer_name: 'Rachel Green', provider: 'SolarEdge', system_size_kw: 6.8, status: 'alert', production_today_kwh: 8.2, production_month_kwh: 245, lifetime_mwh: 8.1, last_updated: '2026-04-14T15:25:00', alerts: [{ type: 'underperformance', message: 'System producing 40% below expected — possible shading or panel issue', severity: 'warning' }] },
  { id: 'mon4', project_id: 'old3', customer_name: 'Kevin Brooks', provider: 'Enphase', system_size_kw: 14.0, status: 'active', production_today_kwh: 56.7, production_month_kwh: 678, lifetime_mwh: 5.2, last_updated: '2026-04-14T15:32:00', alerts: [] },
  { id: 'mon5', project_id: 'old4', customer_name: 'Maria Santos', provider: 'SolarEdge', system_size_kw: 10.2, status: 'offline', production_today_kwh: 0, production_month_kwh: 198, lifetime_mwh: 15.4, last_updated: '2026-04-12T11:00:00', alerts: [{ type: 'offline', message: 'System offline since Apr 12 — inverter communication lost', severity: 'critical' }] },
];
