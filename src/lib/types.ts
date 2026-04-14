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
