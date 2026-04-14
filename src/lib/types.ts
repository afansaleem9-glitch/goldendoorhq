// GoldenDoor CRM — Type Definitions (matches Supabase schema)

export interface Contact {
  id: string;
  organization_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  mobile: string;
  company_id?: string;
  job_title: string;
  lifecycle_stage: string;
  lead_status: string;
  lead_source: string;
  owner_id?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  tags: string[];
  custom_properties: Record<string, unknown>;
  last_activity_at: string;
  last_contacted_at: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  organization_id: string;
  name: string;
  domain: string;
  industry: string;
  type: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  employee_count: number;
  annual_revenue: number;
  description: string;
  owner_id?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface DealStage {
  id: string;
  organization_id: string;
  name: string;
  pipeline: string;
  display_order: number;
  probability: number;
  is_won: boolean;
  is_lost: boolean;
  color: string;
}

export interface Deal {
  id: string;
  organization_id: string;
  name: string;
  contact_id?: string;
  company_id?: string;
  stage_id?: string;
  stage_name: string;
  pipeline: string;
  amount: number;
  probability: number;
  expected_revenue: number;
  close_date: string;
  owner_id?: string;
  deal_type: string;
  lead_source: string;
  priority: string;
  is_won: boolean;
  is_lost: boolean;
  tags: string[];
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  organization_id: string;
  title: string;
  description: string;
  task_type: string;
  status: string;
  priority: string;
  due_date: string;
  completed_at?: string;
  assigned_to?: string;
  created_by?: string;
  contact_id?: string;
  deal_id?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Ticket {
  id: string;
  organization_id: string;
  ticket_number: number;
  subject: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  contact_id?: string;
  assigned_to?: string;
  created_by?: string;
  resolved_at?: string;
  sla_due_at?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  organization_id: string;
  activity_type: string;
  subject: string;
  body: string;
  actor_id?: string;
  contact_id?: string;
  deal_id?: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export type SolarStage =
  | 'ntp'
  | 'welcome_call_done'
  | 'welcome_call_reviewed'
  | 'agreements_completed'
  | 'site_capture_photos_received'
  | 'site_survey'
  | 'preliminary_cad'
  | 'scope_of_work_approval'
  | 'cad'
  | 'permit_sub'
  | 'permit_approval'
  | 'interconnection_sub'
  | 'install_schedule'
  | 'inspection'
  | 'interconnection_pto_complete'
  | 'monitoring'
  | 'final_complete';

export const SOLAR_STAGES: { key: SolarStage; label: string; color: string }[] = [
  { key: 'ntp', label: 'NTP', color: '#3B82F6' },
  { key: 'welcome_call_done', label: 'Welcome Call Done', color: '#6366F1' },
  { key: 'welcome_call_reviewed', label: 'Welcome Call Reviewed', color: '#8B5CF6' },
  { key: 'agreements_completed', label: 'Agreements Completed', color: '#A855F7' },
  { key: 'site_capture_photos_received', label: 'Site Capture Photos', color: '#D946EF' },
  { key: 'site_survey', label: 'Site Survey', color: '#EC4899' },
  { key: 'preliminary_cad', label: 'Preliminary CAD', color: '#F43F5E' },
  { key: 'scope_of_work_approval', label: 'SOW Approval', color: '#EF4444' },
  { key: 'cad', label: 'CAD', color: '#F97316' },
  { key: 'permit_sub', label: 'Permit Sub', color: '#F59E0B' },
  { key: 'permit_approval', label: 'Permit Approval', color: '#EAB308' },
  { key: 'interconnection_sub', label: 'Interconnection Sub', color: '#84CC16' },
  { key: 'install_schedule', label: 'Install / Schedule', color: '#22C55E' },
  { key: 'inspection', label: 'Inspection', color: '#14B8A6' },
  { key: 'interconnection_pto_complete', label: 'Interconnection / PTO', color: '#06B6D4' },
  { key: 'monitoring', label: 'Monitoring', color: '#0EA5E9' },
  { key: 'final_complete', label: 'Final Complete', color: '#10B981' },
];

export interface SolarProject {
  id: string;
  organization_id: string;
  deal_id?: string;
  contact_id?: string;
  company_id?: string;
  rep_id?: string;
  assigned_to?: string;
  current_stage: SolarStage;
  system_size_kw: number;
  panel_count: number;
  panel_type: string;
  inverter_type: string;
  battery_type: string;
  battery_count: number;
  financing_type: string;
  contract_amount: number;
  lender_name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  utility_company: string;
  ahj: string;
  notes: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface EmailCampaign {
  id: string;
  organization_id: string;
  name: string;
  subject: string;
  status: string;
  from_name: string;
  from_email: string;
  html_content: string;
  stats: { sent: number; delivered: number; opened: number; clicked: number; bounced: number; unsubscribed: number };
  send_at?: string;
  sent_at?: string;
  created_at: string;
  updated_at: string;
}

export interface EmailTemplate {
  id: string;
  organization_id: string;
  name: string;
  subject: string;
  category: string;
  html_body: string;
  is_active: boolean;
  created_at: string;
}

export interface ScheduleEntry {
  id: string;
  organization_id: string;
  project_id?: string;
  entry_type: string;
  title: string;
  description: string;
  scheduled_date: string;
  start_time: string;
  end_time: string;
  status: string;
  address: string;
  city: string;
  state: string;
  notes: string;
  created_at: string;
}

export interface Contract {
  id: string;
  organization_id: string;
  project_id?: string;
  contact_id?: string;
  contract_number: string;
  contract_type: string;
  status: string;
  title: string;
  contract_amount: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  organization_id: string;
  invoice_number: string;
  status: string;
  total: number;
  amount_paid: number;
  amount_due: number;
  due_date: string;
  created_at: string;
}

export interface MonitoredSystem {
  id: string;
  organization_id: string;
  system_name: string;
  monitoring_provider: string;
  status: string;
  system_size_kw: number;
  current_power_w: number;
  today_production_kwh: number;
  month_production_kwh: number;
  lifetime_production_kwh: number;
  last_reading_at: string;
  created_at: string;
}

export interface EquipmentItem {
  id: string;
  organization_id: string;
  sku: string;
  name: string;
  category: string;
  manufacturer: string;
  model: string;
  cost_price: number;
  retail_price: number;
  in_stock_qty: number;
  is_active: boolean;
  created_at: string;
}

export interface IntegrationConnection {
  id: string;
  organization_id: string;
  provider: string;
  status: string;
  display_name: string;
  last_sync_at: string;
  sync_frequency: string;
  created_at: string;
}
