// GoldenDoor CRM — Type Definitions

export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  company_id?: string;
  job_title: string;
  lifecycle_stage: string;
  lead_status: string;
  lead_score: number;
  owner: string;
  owner_id?: string;
  last_contacted: string;
  created_at: string;
  tags: string[];
  city?: string;
  state?: string;
  avatar_url?: string;
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  industry: string;
  type: string;
  company_size: string;
  annual_revenue: number;
  phone: string;
  city: string;
  state: string;
  owner: string;
  contacts_count: number;
  deals_count: number;
  created_at: string;
}

export interface Deal {
  id: string;
  name: string;
  amount: number;
  stage: string;
  stage_id: string;
  pipeline: string;
  contact: string;
  contact_id?: string;
  company: string;
  company_id?: string;
  owner: string;
  close_date: string;
  priority: string;
  deal_type: string;
  created_at: string;
  last_activity: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  task_type: string;
  status: string;
  priority: string;
  due_date: string;
  owner: string;
  contact?: string;
  deal?: string;
  completed_at?: string;
  created_at: string;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  priority: string;
  status: string;
  category: string;
  contact: string;
  owner: string;
  source: string;
  created_at: string;
  sla_due: string;
  first_response?: string;
}

export interface Activity {
  id: string;
  type: string;
  subject: string;
  body: string;
  contact?: string;
  deal?: string;
  performed_by: string;
  created_at: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  probability: number;
  color: string;
  deal_count: number;
  total_value: number;
}

export type SolarStage =
  | 'contract_signed'
  | 'site_survey_scheduled'
  | 'site_survey_completed'
  | 'cads_in_progress'
  | 'cads_completed'
  | 'permits_submitted'
  | 'permits_approved'
  | 'install_scheduled'
  | 'install_in_progress'
  | 'install_completed'
  | 'inspection_scheduled'
  | 'inspection_passed'
  | 'pto_submitted'
  | 'pto_approved'
  | 'final_completion';

export interface SolarProject {
  id: string;
  deal_id?: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  rep_name: string;
  rep_id?: string;
  current_stage: SolarStage;
  system_size_kw: number;
  panel_count: number;
  panel_type: string;
  inverter_type: string;
  financing_type: string;
  contract_amount: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  utility_company: string;
  ahj: string;
  contract_signed_at?: string;
  site_survey_completed_at?: string;
  cads_completed_at?: string;
  permits_approved_at?: string;
  install_completed_at?: string;
  inspection_passed_at?: string;
  pto_approved_at?: string;
  completed_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SolarStageInfo {
  key: SolarStage;
  label: string;
  shortLabel: string;
  color: string;
  icon: string;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';
  list_name: string;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  send_at?: string;
  sent_at?: string;
  created_at: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  category: string;
  html_content: string;
  usage_count: number;
  created_at: string;
}
