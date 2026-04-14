-- Freedom Forever Solar Portal Schema
-- GoldenDoor HQ (goldendoorhq.com)
-- Migration: 001_freedom_forever_schema.sql
-- Created: 2026-04-14

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- TABLE: ff_users
-- Portal user accounts with roles and status
-- ============================================================================
CREATE TABLE ff_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'sales_rep',
  title TEXT,
  selling_status TEXT,
  account_status TEXT DEFAULT 'active',
  lms_status TEXT,
  service_branch TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: ff_pipeline_stages
-- Defines all stages in the solar project pipeline
-- ============================================================================
CREATE TABLE ff_pipeline_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  display_order INTEGER NOT NULL,
  color TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: ff_projects
-- Main projects table - central hub for all solar installations
-- ============================================================================
CREATE TABLE ff_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_project_id SERIAL UNIQUE NOT NULL,
  site_id TEXT UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  project_stage TEXT DEFAULT 'Customer Contact',
  system_size_kw DECIMAL(8, 2),
  system_price DECIMAL(12, 2),
  modules_count INTEGER,
  modules_type TEXT,
  inverter_type TEXT,
  mount_type TEXT,
  battery_type TEXT,
  battery_capacity TEXT,
  financing_type TEXT,
  finance_company TEXT,
  key_adders TEXT[],
  domestic_content_pct DECIMAL(5, 2),
  service_branch TEXT,
  install_branch TEXT,
  utility TEXT,
  sales_rep_id UUID REFERENCES ff_users(id),
  dealer TEXT,
  entity TEXT,
  branch_manager TEXT,
  branch_manager_email TEXT,
  freedom_advantage BOOLEAN DEFAULT FALSE,
  duplicate_project BOOLEAN DEFAULT FALSE,
  pre_existing_pv BOOLEAN DEFAULT FALSE,
  expected_hours TEXT,
  project_created_via TEXT,
  do_not_contact BOOLEAN DEFAULT FALSE,
  priority_install BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ
);

-- ============================================================================
-- TABLE: ff_pipeline_tasks
-- Individual tasks within each pipeline stage
-- ============================================================================
CREATE TABLE ff_pipeline_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES ff_projects(id) ON DELETE CASCADE,
  stage_id UUID REFERENCES ff_pipeline_stages(id),
  task_name TEXT NOT NULL,
  assignee_name TEXT,
  assignee_id UUID REFERENCES ff_users(id),
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'archived')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  started_by TEXT,
  completed_by TEXT,
  fields JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: ff_notes
-- Activity feed and notes/communication log
-- ============================================================================
CREATE TABLE ff_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES ff_projects(id) ON DELETE CASCADE,
  author_name TEXT,
  author_role TEXT,
  note_type TEXT NOT NULL DEFAULT 'project' CHECK (note_type IN ('project', 'ticket', 'communication', 'review', 'event')),
  category_tags TEXT[],
  content TEXT,
  ticket_reference TEXT,
  task_reference TEXT,
  communication_type TEXT CHECK (communication_type IN ('inbound_phone', 'outbound_email', 'ai_agent_call', NULL)),
  contact_name TEXT,
  contact_from TEXT,
  contact_to TEXT,
  contact_datetime TIMESTAMPTZ,
  ai_agent_name TEXT,
  attachments JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: ff_documents
-- Project documentation (permits, designs, etc.)
-- ============================================================================
CREATE TABLE ff_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES ff_projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('complete', 'pending', 'active')),
  creator_name TEXT,
  document_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: ff_sow
-- Scope of Work (SOW) records - pricing and system specifications
-- ============================================================================
CREATE TABLE ff_sow (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES ff_projects(id) ON DELETE CASCADE,
  version TEXT NOT NULL DEFAULT 'v1.0',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  system_size_kw DECIMAL(8, 2),
  modules_count INTEGER,
  modules_type TEXT,
  inverter_type TEXT,
  adders JSONB,
  gross_price DECIMAL(12, 2),
  finance_amount DECIMAL(12, 2),
  gross_ppw DECIMAL(8, 2),
  creator TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: ff_sow_versions
-- Historical versions of SOW for tracking changes
-- ============================================================================
CREATE TABLE ff_sow_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sow_id UUID NOT NULL REFERENCES ff_sow(id) ON DELETE CASCADE,
  adders_total DECIMAL(12, 2),
  size_kw DECIMAL(8, 2),
  net_ppw DECIMAL(8, 2),
  last_edited TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: ff_field_visits
-- Field visit records (inspections, installs, surveys)
-- ============================================================================
CREATE TABLE ff_field_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES ff_projects(id) ON DELETE CASCADE,
  visit_type TEXT NOT NULL CHECK (visit_type IN ('inspection', 'install', 'site_survey', 'service')),
  visit_subtype TEXT,
  scheduled_date DATE,
  scheduled_time TIME,
  status TEXT DEFAULT 'pending' CHECK (status IN ('complete', 'homeowner_confirmed', 'ahj_confirmed', 'pending')),
  creator_name TEXT,
  crew_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  fields JSONB
);

-- ============================================================================
-- TABLE: ff_warranties
-- Warranty information for projects
-- ============================================================================
CREATE TABLE ff_warranties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES ff_projects(id) ON DELETE CASCADE,
  warranty_type TEXT NOT NULL CHECK (warranty_type IN ('workmanship', 'roof_penetration', 'production_guarantee')),
  duration_years INTEGER,
  end_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: ff_adder_sheet
-- Reference table for available adders and pricing
-- ============================================================================
CREATE TABLE ff_adder_sheet (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  cost DECIMAL(12, 2),
  unit TEXT,
  state TEXT,
  notes TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: ff_project_milestones
-- Key milestone dates and statuses for project summary
-- ============================================================================
CREATE TABLE ff_project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES ff_projects(id) ON DELETE CASCADE,
  stage_name TEXT NOT NULL,
  stage_date DATE,
  duration_text TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_ff_projects_sales_rep_id ON ff_projects(sales_rep_id);
CREATE INDEX idx_ff_projects_project_stage ON ff_projects(project_stage);
CREATE INDEX idx_ff_projects_customer_email ON ff_projects(customer_email);
CREATE INDEX idx_ff_projects_created_at ON ff_projects(created_at);
CREATE INDEX idx_ff_projects_portal_project_id ON ff_projects(portal_project_id);

CREATE INDEX idx_ff_pipeline_tasks_project_id ON ff_pipeline_tasks(project_id);
CREATE INDEX idx_ff_pipeline_tasks_stage_id ON ff_pipeline_tasks(stage_id);
CREATE INDEX idx_ff_pipeline_tasks_assignee_id ON ff_pipeline_tasks(assignee_id);
CREATE INDEX idx_ff_pipeline_tasks_status ON ff_pipeline_tasks(status);

CREATE INDEX idx_ff_notes_project_id ON ff_notes(project_id);
CREATE INDEX idx_ff_notes_note_type ON ff_notes(note_type);
CREATE INDEX idx_ff_notes_created_at ON ff_notes(created_at);

CREATE INDEX idx_ff_documents_project_id ON ff_documents(project_id);
CREATE INDEX idx_ff_documents_status ON ff_documents(status);

CREATE INDEX idx_ff_sow_project_id ON ff_sow(project_id);
CREATE INDEX idx_ff_sow_status ON ff_sow(status);

CREATE INDEX idx_ff_sow_versions_sow_id ON ff_sow_versions(sow_id);

CREATE INDEX idx_ff_field_visits_project_id ON ff_field_visits(project_id);
CREATE INDEX idx_ff_field_visits_visit_type ON ff_field_visits(visit_type);
CREATE INDEX idx_ff_field_visits_scheduled_date ON ff_field_visits(scheduled_date);

CREATE INDEX idx_ff_warranties_project_id ON ff_warranties(project_id);

CREATE INDEX idx_ff_project_milestones_project_id ON ff_project_milestones(project_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp for ff_users
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ff_users_updated_at BEFORE UPDATE ON ff_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_ff_projects_updated_at BEFORE UPDATE ON ff_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_ff_pipeline_tasks_updated_at BEFORE UPDATE ON ff_pipeline_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_ff_documents_updated_at BEFORE UPDATE ON ff_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_ff_sow_updated_at BEFORE UPDATE ON ff_sow
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_ff_field_visits_updated_at BEFORE UPDATE ON ff_field_visits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_ff_warranties_updated_at BEFORE UPDATE ON ff_warranties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_ff_adder_sheet_updated_at BEFORE UPDATE ON ff_adder_sheet
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_ff_project_milestones_updated_at BEFORE UPDATE ON ff_project_milestones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE ff_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_pipeline_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_sow ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_sow_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_field_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_warranties ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_adder_sheet ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_project_milestones ENABLE ROW LEVEL SECURITY;

-- Permissive read policies for anonymous access (public read)
CREATE POLICY ff_users_select_all ON ff_users FOR SELECT USING (TRUE);
CREATE POLICY ff_projects_select_all ON ff_projects FOR SELECT USING (TRUE);
CREATE POLICY ff_pipeline_stages_select_all ON ff_pipeline_stages FOR SELECT USING (TRUE);
CREATE POLICY ff_pipeline_tasks_select_all ON ff_pipeline_tasks FOR SELECT USING (TRUE);
CREATE POLICY ff_notes_select_all ON ff_notes FOR SELECT USING (TRUE);
CREATE POLICY ff_documents_select_all ON ff_documents FOR SELECT USING (TRUE);
CREATE POLICY ff_sow_select_all ON ff_sow FOR SELECT USING (TRUE);
CREATE POLICY ff_sow_versions_select_all ON ff_sow_versions FOR SELECT USING (TRUE);
CREATE POLICY ff_field_visits_select_all ON ff_field_visits FOR SELECT USING (TRUE);
CREATE POLICY ff_warranties_select_all ON ff_warranties FOR SELECT USING (TRUE);
CREATE POLICY ff_adder_sheet_select_all ON ff_adder_sheet FOR SELECT USING (TRUE);
CREATE POLICY ff_project_milestones_select_all ON ff_project_milestones FOR SELECT USING (TRUE);

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert pipeline stages (15+ stages in order)
INSERT INTO ff_pipeline_stages (name, display_order, color, description) VALUES
('Customer Contact', 1, '#E3F2FD', 'Initial customer outreach and qualification'),
('Survey', 2, '#BBDEFB', 'Site survey and assessment'),
('Design', 3, '#90CAF9', 'System design and engineering'),
('Account Review', 4, '#64B5F6', 'Account and customer verification'),
('Scope of Work', 5, '#42A5F5', 'SOW creation and pricing'),
('Permits', 6, '#2196F3', 'Permit applications and submissions'),
('Stamps', 7, '#1E88E5', 'Permit approvals and stamps'),
('Installs', 8, '#1976D2', 'System installation'),
('Inspections', 9, '#1565C0', 'Final inspections'),
('Interconnection', 10, '#0D47A1', 'Utility interconnection and approval'),
('Monitoring', 11, '#F3E5F5', 'System monitoring activation'),
('Processing', 12, '#E1BEE7', 'Administrative processing'),
('Accounts Payable', 13, '#CE93D8', 'Invoice and payment processing'),
('Accounts Receivable', 14, '#BA68C8', 'Customer payment collection'),
('Service', 15, '#AB47BC', 'Warranty and service tracking'),
('Schedule Service Visit', 16, '#9C27B0', 'Service appointment scheduling'),
('Field Visit Review', 17, '#7B1FA2', 'Post-visit review and documentation'),
('Pipeline Management', 19, '#4A148C', 'Overall pipeline oversight');

-- Insert sample adders (~15 common solar adders)
INSERT INTO ff_adder_sheet (category, name, cost, unit, state, notes, active) VALUES
('Electrical', 'Roof Penetration Flashing Kit', 150.00, 'per_kit', 'CA', 'Weatherproof roof flashing for conduit penetrations', TRUE),
('Electrical', 'Disconnects and Combiner Box', 500.00, 'per_system', 'CA', 'DC and AC disconnects with combiner box', TRUE),
('Electrical', 'Upgraded Breaker Panel', 800.00, 'per_install', 'CA', 'Panel upgrade for capacity and safety', TRUE),
('Electrical', 'Grounding Equipment', 250.00, 'per_system', 'CA', 'Enhanced grounding rods and connections', TRUE),
('Structural', 'Wood Reinforcement', 400.00, 'per_roof', 'CA', 'Roof framing reinforcement for load', TRUE),
('Structural', 'Metal Roof Installation', 1200.00, 'per_roof', 'CA', 'Special mounting for metal roofs', TRUE),
('Structural', 'Tile Roof Installation', 1500.00, 'per_roof', 'CA', 'Special mounting and flashing for tile', TRUE),
('Aesthetic', 'Conduit Covering', 300.00, 'per_run', 'CA', 'Hidden conduit raceways', TRUE),
('Aesthetic', 'Wall-Mounted Equipment Enclosure', 600.00, 'per_install', 'CA', 'Professional equipment mounting', TRUE),
('Safety', 'Rapid Shutdown Kit', 450.00, 'per_system', 'CA', 'Rapid shutdown module per NEC', TRUE),
('Energy Storage', 'Battery System (10kWh)', 8000.00, 'per_system', 'CA', 'Powerwall or equivalent 10kWh storage', TRUE),
('Energy Storage', 'Battery System (15kWh)', 12000.00, 'per_system', 'CA', 'Powerwall or equivalent 15kWh storage', TRUE),
('Monitoring', 'Advanced Monitoring Portal', 200.00, 'per_system', 'CA', 'Real-time production monitoring', TRUE),
('Utility', 'Utility Rebate Processing', 150.00, 'per_project', 'CA', 'Utility rebate application assistance', TRUE),
('Permits', 'Expedited Permitting', 500.00, 'per_project', 'CA', 'Expedited permit review service', TRUE);

-- Insert sample users
INSERT INTO ff_users (name, email, role, title, selling_status, account_status) VALUES
('John Smith', 'john.smith@example.com', 'sales_rep', 'Solar Sales Representative', 'active', 'active'),
('Sarah Johnson', 'sarah.johnson@example.com', 'sales_manager', 'Branch Sales Manager', NULL, 'active'),
('Mike Chen', 'mike.chen@example.com', 'designer', 'System Designer', NULL, 'active'),
('Lisa Rodriguez', 'lisa.rodriguez@example.com', 'permits_admin', 'Permit Administrator', NULL, 'active'),
('Robert Taylor', 'robert.taylor@example.com', 'installer', 'Lead Installer', NULL, 'active');

-- Insert a sample project
INSERT INTO ff_projects (
  site_id, customer_name, customer_phone, customer_email, address, city, state, zip,
  lat, lng, project_stage, system_size_kw, system_price, modules_count, modules_type,
  inverter_type, mount_type, battery_type, battery_capacity, financing_type,
  finance_company, key_adders, domestic_content_pct, service_branch, install_branch,
  utility, sales_rep_id, dealer, entity, branch_manager, branch_manager_email,
  freedom_advantage, duplicate_project, pre_existing_pv, expected_hours,
  project_created_via, do_not_contact, priority_install
) VALUES (
  'SITE-2026-0001', 'Robert Thompson', '415-555-0123', 'robert.thompson@email.com',
  '1234 Sunny Lane', 'San Francisco', 'CA', '94102',
  37.7749, -122.4194, 'Design', 8.25, 24750.00, 22, 'REC 415W Black',
  'SolarEdge SE10K', 'Tilted Roof Mount', 'Tesla Powerwall 3', '15 kWh',
  'Sunrun Lease', 'Sunrun Inc', ARRAY['Powerwall 15kWh', 'Advanced Monitoring'],
  90.0, 'San Francisco', 'San Francisco', 'PG&E',
  (SELECT id FROM ff_users WHERE email = 'john.smith@example.com'),
  'EarthGen Solar', 'Freedom Forever Inc', 'Sarah Johnson', 'sarah.johnson@example.com',
  TRUE, FALSE, FALSE, '40-50', 'sales_rep_portal', FALSE, FALSE
);

-- Get the sample project ID for use in related tables
DO $$
DECLARE
  sample_project_id UUID;
  design_stage_id UUID;
  survey_stage_id UUID;
  permits_stage_id UUID;
BEGIN
  -- Get the sample project ID
  SELECT id INTO sample_project_id FROM ff_projects WHERE site_id = 'SITE-2026-0001';

  -- Get stage IDs
  SELECT id INTO design_stage_id FROM ff_pipeline_stages WHERE name = 'Design';
  SELECT id INTO survey_stage_id FROM ff_pipeline_stages WHERE name = 'Survey';
  SELECT id INTO permits_stage_id FROM ff_pipeline_stages WHERE name = 'Permits';

  -- Insert pipeline tasks for the sample project
  INSERT INTO ff_pipeline_tasks (
    project_id, stage_id, task_name, assignee_name, assignee_id, status,
    started_at, fields
  ) VALUES
  (sample_project_id, survey_stage_id, 'Schedule Site Survey', 'John Smith',
   (SELECT id FROM ff_users WHERE email = 'john.smith@example.com'), 'completed',
   NOW() - INTERVAL '15 days', '{"survey_date": "2026-03-30", "inspector": "Mike Chen"}'),

  (sample_project_id, design_stage_id, 'Create System Design', 'Mike Chen',
   (SELECT id FROM ff_users WHERE email = 'mike.chen@example.com'), 'in_progress',
   NOW() - INTERVAL '10 days',
   '{"design_tool": "Aurora", "system_offset": "22 degrees", "shading_analysis": "complete"}'),

  (sample_project_id, design_stage_id, 'Get Customer Approval', 'John Smith',
   (SELECT id FROM ff_users WHERE email = 'john.smith@example.com'), 'pending',
   NULL, '{"approval_method": "email", "sent_date": "2026-04-10"}'),

  (sample_project_id, permits_stage_id, 'Prepare Permit Application', 'Lisa Rodriguez',
   (SELECT id FROM ff_users WHERE email = 'lisa.rodriguez@example.com'), 'not_started',
   NULL, '{"jurisdiction": "San Francisco", "ahj_email": "permits@sfgov.org"}');

  -- Insert notes/activity for the sample project
  INSERT INTO ff_notes (
    project_id, author_name, author_role, note_type, category_tags,
    content, communication_type, contact_name, contact_datetime
  ) VALUES
  (sample_project_id, 'John Smith', 'Sales Rep', 'communication',
   ARRAY['outbound', 'initial_contact'],
   'Initial contact call with customer. Very interested in solar. Roof is ideal for installation. Will schedule survey.',
   'outbound_email', 'Robert Thompson', NOW() - INTERVAL '20 days'),

  (sample_project_id, 'Mike Chen', 'Designer', 'review',
   ARRAY['design', 'engineering'],
   'Site survey complete. Roof orientation excellent (SSW facing). No major obstructions. Recommended 22-module system for $24,750 price point.',
   NULL, NULL, NOW() - INTERVAL '15 days'),

  (sample_project_id, 'System', 'ai_agent_call', 'communication',
   ARRAY['ai_contact', 'status_update'],
   'AI agent called customer to confirm design approval. Left voicemail regarding next steps in installation process.',
   'ai_agent_call', 'Robert Thompson', NOW() - INTERVAL '5 days');

  -- Insert SOW for the sample project
  INSERT INTO ff_sow (
    project_id, version, status, system_size_kw, modules_count,
    modules_type, inverter_type, gross_price, finance_amount, gross_ppw, creator
  ) VALUES
  (sample_project_id, 'v1.2', 'active', 8.25, 22, 'REC 415W Black',
   'SolarEdge SE10K', 24750.00, 19800.00, 3.00, 'Mike Chen');

  -- Insert documents for the sample project
  INSERT INTO ff_documents (project_id, name, status, creator_name, document_type) VALUES
  (sample_project_id, 'System Design - v1.2', 'complete', 'Mike Chen', 'system_design'),
  (sample_project_id, 'Customer Agreement', 'complete', 'John Smith', 'contract'),
  (sample_project_id, 'Electrical Single Line', 'active', 'Mike Chen', 'electrical_diagram'),
  (sample_project_id, 'Roof Attachment Schedule', 'pending', 'Mike Chen', 'structural_drawing');

  -- Insert field visits for the sample project
  INSERT INTO ff_field_visits (
    project_id, visit_type, visit_subtype, scheduled_date,
    status, creator_name, crew_name
  ) VALUES
  (sample_project_id, 'site_survey', 'Initial Survey', DATE '2026-03-30',
   'complete', 'John Smith', 'Survey Team A'),

  (sample_project_id, 'install', 'PV Installation', DATE '2026-05-15',
   'pending', 'John Smith', NULL);

  -- Insert warranties for the sample project
  INSERT INTO ff_warranties (project_id, warranty_type, duration_years, end_date, status) VALUES
  (sample_project_id, 'workmanship', 10, DATE '2036-05-15', 'active'),
  (sample_project_id, 'production_guarantee', 25, DATE '2051-05-15', 'active'),
  (sample_project_id, 'roof_penetration', 10, DATE '2036-05-15', 'active');

  -- Insert milestones for the sample project
  INSERT INTO ff_project_milestones (project_id, stage_name, stage_date, duration_text, status) VALUES
  (sample_project_id, 'Survey Complete', DATE '2026-03-30', 'Day 15', 'pending'),
  (sample_project_id, 'Design Approval', DATE '2026-04-12', 'Day 27', 'pending'),
  (sample_project_id, 'Permits Submitted', DATE '2026-05-01', 'Day 46', 'pending'),
  (sample_project_id, 'Installation Start', DATE '2026-05-15', 'Day 60', 'pending');

END $$;

-- ============================================================================
-- COMMENTS (Documentation)
-- ============================================================================
COMMENT ON TABLE ff_projects IS 'Central hub for all solar installation projects. Contains customer info, system specifications, and project status.';
COMMENT ON TABLE ff_pipeline_stages IS 'Defines the stages that projects progress through in the Freedom Forever pipeline.';
COMMENT ON TABLE ff_pipeline_tasks IS 'Individual action items within each pipeline stage, tracked by assignee and status.';
COMMENT ON TABLE ff_notes IS 'Activity feed and communication log including phone calls, emails, and AI agent interactions.';
COMMENT ON TABLE ff_documents IS 'Project documentation including designs, permits, contracts, and drawings.';
COMMENT ON TABLE ff_sow IS 'Scope of Work pricing and system specifications, with version history.';
COMMENT ON TABLE ff_field_visits IS 'Field visits including surveys, installations, inspections, and service calls.';
COMMENT ON TABLE ff_warranties IS 'Warranty information covering workmanship, roof penetration, and production guarantees.';
COMMENT ON TABLE ff_adder_sheet IS 'Reference pricing for optional adders and upgrades.';
COMMENT ON TABLE ff_project_milestones IS 'Key milestone dates and durations for project tracking and reporting.';

-- ============================================================================
-- MIGRATION METADATA
-- ============================================================================
-- Schema version: 1.0.0
-- Created: 2026-04-14
-- Purpose: Initial Freedom Forever solar portal database schema
-- Features:
--   - Complete project lifecycle tracking
--   - Pipeline stage management
--   - Activity and communication logging
--   - SOW versioning
--   - Field visit tracking
--   - Warranty management
--   - Row-level security with permissive read policies
--   - Automated timestamp updates
--   - Comprehensive indexing for query performance
