-- ============================================================
-- GoldenDoor CRM — HubSpot Data Integration Schema
-- Migration 002: Customer DNA Hub tables
-- ============================================================

-- Customer Files (HubSpot file attachments)
CREATE TABLE IF NOT EXISTS customer_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES ff_projects(id) ON DELETE CASCADE,
  organization_id UUID,
  name TEXT NOT NULL,
  file_type TEXT, -- pdf, zip, jpg, etc.
  size_bytes BIGINT,
  category TEXT, -- Contract, Survey, Design, Permit, HOA, Utility, Warranty, Finance, Verification
  storage_path TEXT, -- Supabase storage path
  hubspot_file_id TEXT, -- HubSpot file engagement ID
  uploaded_by TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT now(),
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_customer_files_customer ON customer_files(customer_id);
CREATE INDEX idx_customer_files_category ON customer_files(category);

-- Recorded Calls
CREATE TABLE IF NOT EXISTS customer_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES ff_projects(id) ON DELETE CASCADE,
  organization_id UUID,
  hubspot_call_id TEXT, -- HubSpot engagement ID
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  duration_seconds INTEGER,
  agent_name TEXT,
  agent_email TEXT,
  summary TEXT,
  recording_url TEXT,
  recording_storage_path TEXT, -- Supabase storage backup
  sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'concerned', 'negative')),
  call_disposition TEXT, -- e.g., "Connected", "No Answer", "Voicemail"
  call_date TIMESTAMPTZ NOT NULL,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_customer_calls_customer ON customer_calls(customer_id);
CREATE INDEX idx_customer_calls_date ON customer_calls(call_date DESC);

-- Email History
CREATE TABLE IF NOT EXISTS customer_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES ff_projects(id) ON DELETE CASCADE,
  organization_id UUID,
  hubspot_email_id TEXT,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  subject TEXT NOT NULL,
  from_address TEXT,
  from_name TEXT,
  to_address TEXT,
  to_name TEXT,
  body_preview TEXT, -- First 500 chars
  status TEXT CHECK (status IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed', 'received')),
  opened BOOLEAN DEFAULT false,
  opened_at TIMESTAMPTZ,
  clicked BOOLEAN DEFAULT false,
  has_attachments BOOLEAN DEFAULT false,
  email_date TIMESTAMPTZ NOT NULL,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_customer_emails_customer ON customer_emails(customer_id);
CREATE INDEX idx_customer_emails_date ON customer_emails(email_date DESC);

-- Contracts & Agreements
CREATE TABLE IF NOT EXISTS customer_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES ff_projects(id) ON DELETE CASCADE,
  organization_id UUID,
  name TEXT NOT NULL,
  contract_type TEXT, -- Solar Installation, Equipment Finance, PPA, Permit Auth, etc.
  status TEXT CHECK (status IN ('draft', 'sent', 'viewed', 'executed', 'expired', 'voided')),
  signed_date TIMESTAMPTZ,
  signed_by TEXT,
  docusign_envelope_id TEXT,
  amount DECIMAL(12,2),
  storage_path TEXT, -- Supabase storage path for PDF
  hubspot_deal_id TEXT,
  expiry_date TIMESTAMPTZ,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_customer_contracts_customer ON customer_contracts(customer_id);

-- Credit Profile
CREATE TABLE IF NOT EXISTS customer_credit_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES ff_projects(id) ON DELETE CASCADE,
  organization_id UUID,
  credit_score INTEGER,
  credit_tier TEXT, -- A, B, C, D
  bureau TEXT, -- Experian, TransUnion, Equifax
  pull_date TIMESTAMPTZ,
  approved BOOLEAN,
  monthly_income DECIMAL(10,2),
  dti_ratio DECIMAL(5,2),
  max_approved_amount DECIMAL(12,2),
  prior_bankruptcy BOOLEAN DEFAULT false,
  prior_foreclosure BOOLEAN DEFAULT false,
  raw_response JSONB, -- Full credit pull response for compliance
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_customer_credit_customer ON customer_credit_profiles(customer_id);

-- Financier Decisions (linked to credit profile)
CREATE TABLE IF NOT EXISTS financier_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_profile_id UUID NOT NULL REFERENCES customer_credit_profiles(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES ff_projects(id) ON DELETE CASCADE,
  organization_id UUID,
  financier TEXT NOT NULL, -- GoodLeap, Mosaic, Sunrun PPA, etc.
  decision TEXT CHECK (decision IN ('Approved', 'Denied', 'Pending', 'Conditional')),
  rate TEXT,
  term TEXT,
  max_amount DECIMAL(12,2),
  monthly_payment DECIMAL(10,2),
  decision_date TIMESTAMPTZ,
  stipulations TEXT,
  raw_response JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_financier_decisions_customer ON financier_decisions(customer_id);

-- Pre-Qualification Results
CREATE TABLE IF NOT EXISTS prequal_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES ff_projects(id) ON DELETE CASCADE,
  organization_id UUID,
  financier TEXT NOT NULL,
  result TEXT CHECK (result IN ('Approved', 'Denied', 'Pending', 'Conditional')),
  system_size_kw DECIMAL(8,2),
  monthly_payment DECIMAL(10,2),
  details TEXT,
  prequal_date TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  raw_response JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_prequal_customer ON prequal_results(customer_id);

-- Monitoring Payment History (for alarm/security customers)
CREATE TABLE IF NOT EXISTS monitoring_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES ff_projects(id) ON DELETE CASCADE,
  organization_id UUID,
  month TEXT NOT NULL, -- "Jul 2025"
  amount DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('paid', 'due', 'overdue', 'failed', 'refunded')),
  payment_method TEXT, -- "Visa ****4821"
  paid_date TIMESTAMPTZ,
  transaction_id TEXT,
  processor TEXT, -- Stripe, Square, etc.
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_monitoring_payments_customer ON monitoring_payments(customer_id);
CREATE INDEX idx_monitoring_payments_status ON monitoring_payments(status);

-- Customer Verticals (many-to-many)
CREATE TABLE IF NOT EXISTS customer_verticals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES ff_projects(id) ON DELETE CASCADE,
  vertical TEXT NOT NULL CHECK (vertical IN ('solar', 'security', 'roofing', 'att')),
  status TEXT DEFAULT 'active',
  started_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(customer_id, vertical)
);

CREATE INDEX idx_customer_verticals_customer ON customer_verticals(customer_id);
CREATE INDEX idx_customer_verticals_vertical ON customer_verticals(vertical);

-- Portal Users (team members)
CREATE TABLE IF NOT EXISTS portal_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL, -- Sales Rep, Branch Manager, Installer, Surveyor, Admin, Support
  branch TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  last_active_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ DEFAULT now(),
  deals_total INTEGER DEFAULT 0,
  revenue_total DECIMAL(12,2) DEFAULT 0,
  avatar_url TEXT,
  auth_user_id UUID, -- Links to Supabase auth.users
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_portal_users_email ON portal_users(email);
CREATE INDEX idx_portal_users_role ON portal_users(role);
CREATE INDEX idx_portal_users_branch ON portal_users(branch);

-- Adder Sheet
CREATE TABLE IF NOT EXISTS adder_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID,
  name TEXT NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  cost_type TEXT NOT NULL CHECK (cost_type IN ('flat', 'per_watt', 'per_module', 'per_foot')),
  category TEXT,
  labor_hours DECIMAL(6,2) DEFAULT 0,
  active BOOLEAN DEFAULT true,
  description TEXT,
  usage_frequency INTEGER DEFAULT 0, -- percentage
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_adder_items_active ON adder_items(active);
CREATE INDEX idx_adder_items_category ON adder_items(category);

-- Enable RLS
ALTER TABLE customer_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_credit_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE financier_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prequal_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_verticals ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE adder_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow authenticated users to read)
CREATE POLICY "Allow authenticated read" ON customer_files FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON customer_calls FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON customer_emails FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON customer_contracts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON customer_credit_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON financier_decisions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON prequal_results FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON monitoring_payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON customer_verticals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON portal_users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON adder_items FOR SELECT TO authenticated USING (true);

-- Anon read policies for development
CREATE POLICY "Allow anon read" ON customer_files FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read" ON customer_calls FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read" ON customer_emails FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read" ON customer_contracts FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read" ON customer_credit_profiles FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read" ON financier_decisions FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read" ON prequal_results FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read" ON monitoring_payments FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read" ON customer_verticals FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read" ON portal_users FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read" ON adder_items FOR SELECT TO anon USING (true);
