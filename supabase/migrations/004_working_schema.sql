-- GoldenDoor CRM — Complete Working Schema
-- All tables with RLS, indexes, and seed data

-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============ ORGANIZATION SETTINGS (logo, branding, persistent config) ============
CREATE TABLE IF NOT EXISTS org_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  company_name TEXT DEFAULT 'Delta Power Group',
  logo_url TEXT,
  primary_color TEXT DEFAULT '#F0A500',
  secondary_color TEXT DEFAULT '#0B1F3A',
  address TEXT DEFAULT '1910 Pacific Ave, Dallas, TX 75201',
  phone TEXT DEFAULT '(214) 555-0100',
  email TEXT DEFAULT 'support@deltapowergroup.com',
  website TEXT DEFAULT 'https://deltapowergroup.com',
  timezone TEXT DEFAULT 'America/Chicago',
  date_format TEXT DEFAULT 'MM/DD/YYYY',
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============ CONTACTS ============
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  mobile TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  lifecycle_stage TEXT DEFAULT 'Lead',
  lead_source TEXT,
  lead_status TEXT DEFAULT 'New',
  owner_id UUID,
  job_title TEXT,
  company_id UUID,
  tags TEXT[] DEFAULT '{}',
  custom_properties JSONB DEFAULT '{}',
  notes TEXT,
  credit_score INTEGER,
  household_income NUMERIC,
  utility_company TEXT,
  avg_electric_bill NUMERIC,
  roof_type TEXT,
  roof_age INTEGER,
  home_sqft INTEGER,
  home_year_built INTEGER,
  health_score INTEGER DEFAULT 50,
  ltv NUMERIC DEFAULT 0,
  churn_risk INTEGER DEFAULT 50,
  referral_score INTEGER DEFAULT 50,
  cross_sell_score INTEGER DEFAULT 50,
  last_activity_at TIMESTAMPTZ,
  last_contacted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============ DEALS ============
CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  name TEXT NOT NULL,
  contact_id UUID REFERENCES contacts(id),
  stage TEXT DEFAULT 'Prospecting',
  pipeline TEXT DEFAULT 'default',
  amount NUMERIC DEFAULT 0,
  probability INTEGER DEFAULT 50,
  close_date DATE,
  owner_id UUID,
  deal_type TEXT,
  lead_source TEXT,
  priority TEXT DEFAULT 'Medium',
  is_won BOOLEAN DEFAULT false,
  is_lost BOOLEAN DEFAULT false,
  vertical TEXT,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============ TASKS ============
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  title TEXT NOT NULL,
  description TEXT,
  task_type TEXT DEFAULT 'To-Do',
  status TEXT DEFAULT 'Not Started',
  priority TEXT DEFAULT 'Medium',
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  assigned_to UUID,
  created_by UUID,
  contact_id UUID REFERENCES contacts(id),
  deal_id UUID REFERENCES deals(id),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============ ACTIVITIES ============
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  activity_type TEXT NOT NULL,
  subject TEXT,
  body TEXT,
  actor_name TEXT,
  contact_id UUID REFERENCES contacts(id),
  deal_id UUID REFERENCES deals(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============ TICKETS ============
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  ticket_number SERIAL,
  subject TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'New',
  priority TEXT DEFAULT 'Medium',
  category TEXT,
  contact_id UUID REFERENCES contacts(id),
  assigned_to TEXT,
  resolved_at TIMESTAMPTZ,
  sla_due_at TIMESTAMPTZ,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============ DOCUMENTS ============
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  name TEXT NOT NULL,
  file_url TEXT,
  file_size TEXT,
  file_type TEXT,
  category TEXT,
  contact_id UUID REFERENCES contacts(id),
  deal_id UUID REFERENCES deals(id),
  uploaded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============ SOLAR PROJECTS ============
CREATE TABLE IF NOT EXISTS solar_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  contact_id UUID REFERENCES contacts(id),
  deal_id UUID REFERENCES deals(id),
  rep_name TEXT,
  assigned_to TEXT,
  current_stage TEXT DEFAULT 'ntp',
  system_size_kw NUMERIC,
  panel_count INTEGER,
  panel_type TEXT,
  inverter_type TEXT,
  battery_type TEXT,
  battery_count INTEGER DEFAULT 0,
  financing_type TEXT,
  contract_amount NUMERIC,
  lender_name TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  utility_company TEXT,
  ahj TEXT,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============ SECURITY SYSTEMS ============
CREATE TABLE IF NOT EXISTS security_systems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  contact_id UUID REFERENCES contacts(id),
  deal_id UUID REFERENCES deals(id),
  provider TEXT DEFAULT 'Alarm.com',
  panel_type TEXT,
  camera_count INTEGER DEFAULT 0,
  sensor_count INTEGER DEFAULT 0,
  monitoring_plan TEXT,
  monthly_cost NUMERIC,
  contract_term_months INTEGER DEFAULT 36,
  install_date DATE,
  system_status TEXT DEFAULT 'Pending',
  last_signal_at TIMESTAMPTZ,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============ ROOFING PROJECTS ============
CREATE TABLE IF NOT EXISTS roofing_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  contact_id UUID REFERENCES contacts(id),
  deal_id UUID REFERENCES deals(id),
  material TEXT,
  scope TEXT,
  warranty TEXT,
  contract_amount NUMERIC,
  crew TEXT,
  status TEXT DEFAULT 'Estimate',
  install_date DATE,
  completion_date DATE,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============ TELECOM ACCOUNTS (AT&T) ============
CREATE TABLE IF NOT EXISTS telecom_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  contact_id UUID REFERENCES contacts(id),
  plan_name TEXT,
  speed TEXT,
  monthly_cost NUMERIC,
  install_date DATE,
  status TEXT DEFAULT 'Active',
  equipment TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============ EMAIL CAMPAIGNS ============
CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  name TEXT NOT NULL,
  subject TEXT,
  status TEXT DEFAULT 'Draft',
  from_name TEXT,
  from_email TEXT,
  html_content TEXT,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  bounced_count INTEGER DEFAULT 0,
  send_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============ CONTRACTS ============
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  contact_id UUID REFERENCES contacts(id),
  contract_number TEXT,
  contract_type TEXT,
  title TEXT,
  status TEXT DEFAULT 'Draft',
  contract_amount NUMERIC,
  start_date DATE,
  end_date DATE,
  vertical TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============ INVOICES ============
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  contact_id UUID REFERENCES contacts(id),
  invoice_number TEXT,
  status TEXT DEFAULT 'Pending',
  total NUMERIC,
  amount_paid NUMERIC DEFAULT 0,
  amount_due NUMERIC,
  due_date DATE,
  vertical TEXT,
  line_items JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============ SCHEDULING ============
CREATE TABLE IF NOT EXISTS schedule_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  contact_id UUID REFERENCES contacts(id),
  title TEXT NOT NULL,
  description TEXT,
  entry_type TEXT DEFAULT 'Appointment',
  scheduled_date DATE,
  start_time TEXT,
  end_time TEXT,
  status TEXT DEFAULT 'Scheduled',
  assigned_to TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_contacts_org ON contacts(organization_id);
CREATE INDEX IF NOT EXISTS idx_contacts_stage ON contacts(lifecycle_stage);
CREATE INDEX IF NOT EXISTS idx_contacts_state ON contacts(state);
CREATE INDEX IF NOT EXISTS idx_deals_org ON deals(organization_id);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage);
CREATE INDEX IF NOT EXISTS idx_tasks_org ON tasks(organization_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_activities_org ON activities(organization_id);
CREATE INDEX IF NOT EXISTS idx_activities_contact ON activities(contact_id);
CREATE INDEX IF NOT EXISTS idx_tickets_org ON tickets(organization_id);
CREATE INDEX IF NOT EXISTS idx_solar_org ON solar_projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_security_org ON security_systems(organization_id);
CREATE INDEX IF NOT EXISTS idx_roofing_org ON roofing_projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_telecom_org ON telecom_accounts(organization_id);

-- ============ RLS ============
ALTER TABLE org_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE solar_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE roofing_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE telecom_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_entries ENABLE ROW LEVEL SECURITY;

-- Allow anon read/write for now (production would use auth)
CREATE POLICY IF NOT EXISTS "anon_all_org_settings" ON org_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "anon_all_contacts" ON contacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "anon_all_deals" ON deals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "anon_all_tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "anon_all_activities" ON activities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "anon_all_tickets" ON tickets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "anon_all_documents" ON documents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "anon_all_solar" ON solar_projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "anon_all_security" ON security_systems FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "anon_all_roofing" ON roofing_projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "anon_all_telecom" ON telecom_accounts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "anon_all_campaigns" ON email_campaigns FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "anon_all_contracts" ON contracts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "anon_all_invoices" ON invoices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "anon_all_schedule" ON schedule_entries FOR ALL USING (true) WITH CHECK (true);

-- ============ SEED DEFAULT ORG SETTINGS ============
INSERT INTO org_settings (organization_id, company_name, address, email, phone)
VALUES ('a97d1a8b-3691-42a3-b116-d131e085b00f', 'Delta Power Group', '1910 Pacific Ave, Dallas, TX 75201', 'support@deltapowergroup.com', '(214) 555-0100')
ON CONFLICT DO NOTHING;
