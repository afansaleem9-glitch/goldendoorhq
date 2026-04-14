-- ============================================================
-- GOLDENDOOR CRM — Migration 003: Coperniq-Class Expansion
-- Scheduling, Contracts, Invoicing, Monitoring, Catalog, Integrations
-- ============================================================

-- ============================================================
-- CREW MEMBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS crew_members (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id       UUID NOT NULL REFERENCES organizations(id),
  user_id               UUID REFERENCES user_profiles(id),
  name                  TEXT NOT NULL,
  email                 TEXT,
  phone                 TEXT,
  role                  TEXT NOT NULL CHECK (role IN ('lead_installer','installer','electrician','roofer','surveyor','project_manager')),
  skills                TEXT[] DEFAULT '{}',
  hourly_rate           DECIMAL(8,2),
  is_active             BOOLEAN DEFAULT true,
  availability_status   TEXT DEFAULT 'available' CHECK (availability_status IN ('available','on_job','off_duty','vacation')),
  current_job_id        UUID REFERENCES solar_projects(id),
  certifications        JSONB DEFAULT '[]',
  hire_date             DATE,
  license_number        TEXT,
  vehicle_id            TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),
  deleted_at            TIMESTAMPTZ
);

CREATE INDEX idx_crew_org ON crew_members(organization_id);
CREATE INDEX idx_crew_active ON crew_members(is_active, availability_status);
ALTER TABLE crew_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON crew_members USING (organization_id = get_user_org_id());
CREATE TRIGGER set_updated_at BEFORE UPDATE ON crew_members FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- SCHEDULE ENTRIES
-- ============================================================
CREATE TABLE IF NOT EXISTS schedule_entries (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id       UUID NOT NULL REFERENCES organizations(id),
  project_id            UUID REFERENCES solar_projects(id),
  entry_type            TEXT NOT NULL CHECK (entry_type IN ('install','survey','inspection','delivery','maintenance','consultation')),
  title                 TEXT NOT NULL,
  description           TEXT,
  scheduled_date        DATE NOT NULL,
  start_time            TIME,
  end_time              TIME,
  duration_hours        DECIMAL(5,1),
  lead_installer_id     UUID REFERENCES crew_members(id),
  status                TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled','in_progress','completed','cancelled','rescheduled')),
  address               TEXT,
  city                  TEXT,
  state                 TEXT,
  zip                   TEXT,
  latitude              DECIMAL(10,7),
  longitude             DECIMAL(10,7),
  notes                 TEXT,
  completed_at          TIMESTAMPTZ,
  cancelled_reason      TEXT,
  weather_status        TEXT,
  created_by            UUID REFERENCES user_profiles(id),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),
  deleted_at            TIMESTAMPTZ
);

CREATE INDEX idx_schedule_org ON schedule_entries(organization_id);
CREATE INDEX idx_schedule_date ON schedule_entries(scheduled_date);
CREATE INDEX idx_schedule_project ON schedule_entries(project_id);
CREATE INDEX idx_schedule_status ON schedule_entries(status);
ALTER TABLE schedule_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON schedule_entries USING (organization_id = get_user_org_id());
CREATE TRIGGER set_updated_at BEFORE UPDATE ON schedule_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- CREW ASSIGNMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS crew_assignments (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id       UUID NOT NULL REFERENCES organizations(id),
  schedule_entry_id     UUID NOT NULL REFERENCES schedule_entries(id) ON DELETE CASCADE,
  crew_member_id        UUID NOT NULL REFERENCES crew_members(id),
  role_on_job           TEXT,
  confirmed             BOOLEAN DEFAULT false,
  confirmed_at          TIMESTAMPTZ,
  check_in_at           TIMESTAMPTZ,
  check_out_at          TIMESTAMPTZ,
  hours_worked          DECIMAL(5,2),
  notes                 TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_crew_assign_entry ON crew_assignments(schedule_entry_id);
CREATE INDEX idx_crew_assign_member ON crew_assignments(crew_member_id);
ALTER TABLE crew_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON crew_assignments USING (organization_id = get_user_org_id());

-- ============================================================
-- EQUIPMENT CATALOG
-- ============================================================
CREATE TABLE IF NOT EXISTS equipment_catalog (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id       UUID NOT NULL REFERENCES organizations(id),
  sku                   TEXT,
  name                  TEXT NOT NULL,
  category              TEXT NOT NULL CHECK (category IN ('panel','inverter','battery','racking','bos','wire','conduit','meter','optimizer','other')),
  manufacturer          TEXT,
  model                 TEXT,
  description           TEXT,
  specifications        JSONB DEFAULT '{}',
  cost_price            DECIMAL(10,2) NOT NULL,
  retail_price          DECIMAL(10,2),
  markup_pct            DECIMAL(5,2) DEFAULT 30,
  unit                  TEXT DEFAULT 'each' CHECK (unit IN ('each','foot','box','roll','set')),
  in_stock_qty          INTEGER DEFAULT 0,
  reorder_point         INTEGER DEFAULT 5,
  supplier_name         TEXT,
  supplier_sku          TEXT,
  supplier_url          TEXT,
  is_active             BOOLEAN DEFAULT true,
  image_url             TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),
  deleted_at            TIMESTAMPTZ
);

CREATE INDEX idx_catalog_org ON equipment_catalog(organization_id);
CREATE INDEX idx_catalog_category ON equipment_catalog(category);
CREATE INDEX idx_catalog_active ON equipment_catalog(is_active);
ALTER TABLE equipment_catalog ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON equipment_catalog USING (organization_id = get_user_org_id());
CREATE TRIGGER set_updated_at BEFORE UPDATE ON equipment_catalog FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- PRICE BOOK ENTRIES
-- ============================================================
CREATE TABLE IF NOT EXISTS price_book_entries (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id       UUID NOT NULL REFERENCES organizations(id),
  name                  TEXT NOT NULL,
  category              TEXT NOT NULL,
  description           TEXT,
  unit_cost             DECIMAL(10,2),
  unit_price            DECIMAL(10,2),
  markup_pct            DECIMAL(5,2),
  labor_hours           DECIMAL(5,2),
  labor_rate            DECIMAL(8,2),
  total_price           DECIMAL(10,2),
  is_addon              BOOLEAN DEFAULT false,
  is_active             BOOLEAN DEFAULT true,
  effective_from        DATE,
  effective_to          DATE,
  applies_to            TEXT DEFAULT 'both' CHECK (applies_to IN ('residential','commercial','both')),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),
  deleted_at            TIMESTAMPTZ
);

CREATE INDEX idx_pricebook_org ON price_book_entries(organization_id);
ALTER TABLE price_book_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON price_book_entries USING (organization_id = get_user_org_id());

-- ============================================================
-- MATERIAL ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS material_orders (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id       UUID NOT NULL REFERENCES organizations(id),
  project_id            UUID REFERENCES solar_projects(id),
  order_number          TEXT,
  supplier              TEXT NOT NULL,
  status                TEXT DEFAULT 'draft' CHECK (status IN ('draft','ordered','shipped','delivered','partial','cancelled')),
  items                 JSONB DEFAULT '[]',
  subtotal              DECIMAL(12,2),
  tax                   DECIMAL(10,2),
  shipping              DECIMAL(10,2),
  total                 DECIMAL(12,2),
  ordered_at            TIMESTAMPTZ,
  expected_delivery     DATE,
  delivered_at          TIMESTAMPTZ,
  tracking_number       TEXT,
  notes                 TEXT,
  created_by            UUID REFERENCES user_profiles(id),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_material_orders_org ON material_orders(organization_id);
CREATE INDEX idx_material_orders_project ON material_orders(project_id);
ALTER TABLE material_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON material_orders USING (organization_id = get_user_org_id());

-- ============================================================
-- PROPOSALS
-- ============================================================
CREATE TABLE IF NOT EXISTS proposals (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id       UUID NOT NULL REFERENCES organizations(id),
  deal_id               UUID REFERENCES deals(id),
  contact_id            UUID REFERENCES contacts(id),
  project_id            UUID REFERENCES solar_projects(id),
  proposal_number       TEXT UNIQUE,
  version               INTEGER DEFAULT 1,
  status                TEXT DEFAULT 'draft' CHECK (status IN ('draft','sent','viewed','accepted','rejected','expired')),
  title                 TEXT,
  system_size_kw        DECIMAL(10,2),
  panel_count           INTEGER,
  panel_type            TEXT,
  inverter_type         TEXT,
  battery_included      BOOLEAN DEFAULT false,
  estimated_production  DECIMAL(12,2),
  estimated_savings_y1  DECIMAL(10,2),
  estimated_savings_25y DECIMAL(12,2),
  pricing_tier          TEXT CHECK (pricing_tier IN ('good','better','best')),
  cash_price            DECIMAL(12,2),
  financed_price        DECIMAL(12,2),
  monthly_payment       DECIMAL(10,2),
  loan_term_months      INTEGER,
  lender                TEXT,
  dealer_fee            DECIMAL(10,2),
  federal_itc           DECIMAL(10,2),
  state_incentives      DECIMAL(10,2),
  utility_rebate        DECIMAL(10,2),
  net_cost              DECIMAL(12,2),
  proposal_pdf_url      TEXT,
  sent_at               TIMESTAMPTZ,
  viewed_at             TIMESTAMPTZ,
  accepted_at           TIMESTAMPTZ,
  rejected_at           TIMESTAMPTZ,
  expires_at            TIMESTAMPTZ,
  signature_url         TEXT,
  signed_at             TIMESTAMPTZ,
  notes                 TEXT,
  created_by            UUID REFERENCES user_profiles(id),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),
  deleted_at            TIMESTAMPTZ
);

CREATE INDEX idx_proposals_org ON proposals(organization_id);
CREATE INDEX idx_proposals_deal ON proposals(deal_id);
CREATE INDEX idx_proposals_status ON proposals(status);
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON proposals USING (organization_id = get_user_org_id());

-- ============================================================
-- CONTRACTS
-- ============================================================
CREATE TABLE IF NOT EXISTS contracts (
  id                      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id         UUID NOT NULL REFERENCES organizations(id),
  project_id              UUID REFERENCES solar_projects(id),
  contact_id              UUID REFERENCES contacts(id),
  contract_number         TEXT UNIQUE,
  contract_type           TEXT NOT NULL CHECK (contract_type IN ('solar_install','smart_home','roofing','monitoring','maintenance')),
  status                  TEXT DEFAULT 'draft' CHECK (status IN ('draft','sent','signed','active','completed','cancelled','voided')),
  template_id             UUID,
  title                   TEXT,
  terms_text              TEXT,
  contract_amount         DECIMAL(12,2),
  monthly_amount          DECIMAL(10,2),
  term_months             INTEGER,
  start_date              DATE,
  end_date                DATE,
  cancellation_deadline   DATE,
  pdf_url                 TEXT,
  signed_pdf_url          TEXT,
  customer_signature_url  TEXT,
  customer_signed_at      TIMESTAMPTZ,
  company_signature_url   TEXT,
  company_signed_at       TIMESTAMPTZ,
  witness_name            TEXT,
  esign_provider          TEXT CHECK (esign_provider IN ('docusign','hellosign','internal')),
  esign_envelope_id       TEXT,
  notes                   TEXT,
  created_by              UUID REFERENCES user_profiles(id),
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW(),
  deleted_at              TIMESTAMPTZ
);

CREATE INDEX idx_contracts_org ON contracts(organization_id);
CREATE INDEX idx_contracts_project ON contracts(project_id);
CREATE INDEX idx_contracts_status ON contracts(status);
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON contracts USING (organization_id = get_user_org_id());
CREATE TRIGGER set_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- CONTRACT TEMPLATES
-- ============================================================
CREATE TABLE IF NOT EXISTS contract_templates (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id       UUID NOT NULL REFERENCES organizations(id),
  name                  TEXT NOT NULL,
  contract_type         TEXT NOT NULL,
  description           TEXT,
  body_html             TEXT,
  variables             JSONB DEFAULT '[]',
  is_active             BOOLEAN DEFAULT true,
  version               INTEGER DEFAULT 1,
  state_specific        TEXT,
  created_by            UUID REFERENCES user_profiles(id),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contract_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON contract_templates USING (organization_id = get_user_org_id());

-- ============================================================
-- INVOICES
-- ============================================================
CREATE TABLE IF NOT EXISTS invoices (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id       UUID NOT NULL REFERENCES organizations(id),
  project_id            UUID REFERENCES solar_projects(id),
  contact_id            UUID REFERENCES contacts(id),
  invoice_number        TEXT UNIQUE,
  status                TEXT DEFAULT 'draft' CHECK (status IN ('draft','sent','viewed','partial','paid','overdue','void','written_off')),
  milestone             TEXT CHECK (milestone IN ('contract_signed','permit_approved','install_50pct','install_complete','pto_approved','final')),
  subtotal              DECIMAL(12,2) DEFAULT 0,
  tax_rate              DECIMAL(5,3) DEFAULT 0,
  tax_amount            DECIMAL(10,2) DEFAULT 0,
  discount_amount       DECIMAL(10,2) DEFAULT 0,
  total                 DECIMAL(12,2) DEFAULT 0,
  amount_paid           DECIMAL(12,2) DEFAULT 0,
  amount_due            DECIMAL(12,2) DEFAULT 0,
  due_date              DATE,
  sent_at               TIMESTAMPTZ,
  paid_at               TIMESTAMPTZ,
  overdue_at            TIMESTAMPTZ,
  payment_terms         TEXT DEFAULT 'Net 30',
  notes                 TEXT,
  stripe_invoice_id     TEXT,
  quickbooks_id         TEXT,
  pdf_url               TEXT,
  created_by            UUID REFERENCES user_profiles(id),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),
  deleted_at            TIMESTAMPTZ
);

CREATE INDEX idx_invoices_org ON invoices(organization_id);
CREATE INDEX idx_invoices_project ON invoices(project_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due ON invoices(due_date);
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON invoices USING (organization_id = get_user_org_id());
CREATE TRIGGER set_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- INVOICE LINE ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS invoice_line_items (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id       UUID NOT NULL REFERENCES organizations(id),
  invoice_id            UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description           TEXT NOT NULL,
  quantity              DECIMAL(10,2) DEFAULT 1,
  unit_price            DECIMAL(10,2) NOT NULL,
  discount_pct          DECIMAL(5,2) DEFAULT 0,
  amount                DECIMAL(12,2) NOT NULL,
  catalog_item_id       UUID REFERENCES equipment_catalog(id),
  sort_order            INTEGER DEFAULT 0,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_line_items_invoice ON invoice_line_items(invoice_id);
ALTER TABLE invoice_line_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON invoice_line_items USING (organization_id = get_user_org_id());

-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id       UUID NOT NULL REFERENCES organizations(id),
  invoice_id            UUID REFERENCES invoices(id),
  project_id            UUID REFERENCES solar_projects(id),
  contact_id            UUID REFERENCES contacts(id),
  amount                DECIMAL(12,2) NOT NULL,
  payment_method        TEXT CHECK (payment_method IN ('credit_card','ach','check','wire','cash','financing')),
  status                TEXT DEFAULT 'pending' CHECK (status IN ('pending','completed','failed','refunded')),
  reference_number      TEXT,
  stripe_payment_id     TEXT,
  quickbooks_payment_id TEXT,
  check_number          TEXT,
  notes                 TEXT,
  processed_at          TIMESTAMPTZ,
  created_by            UUID REFERENCES user_profiles(id),
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_org ON payments(organization_id);
CREATE INDEX idx_payments_invoice ON payments(invoice_id);
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON payments USING (organization_id = get_user_org_id());

-- ============================================================
-- JOB COSTING
-- ============================================================
CREATE TABLE IF NOT EXISTS job_costing (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id       UUID NOT NULL REFERENCES organizations(id),
  project_id            UUID NOT NULL REFERENCES solar_projects(id),
  category              TEXT NOT NULL CHECK (category IN ('materials','labor','permits','subcontractor','equipment_rental','travel','overhead','other')),
  description           TEXT NOT NULL,
  vendor                TEXT,
  amount                DECIMAL(12,2) NOT NULL,
  is_budgeted           BOOLEAN DEFAULT false,
  budgeted_amount       DECIMAL(12,2),
  variance              DECIMAL(12,2),
  receipt_url           TEXT,
  cost_date             DATE DEFAULT CURRENT_DATE,
  created_by            UUID REFERENCES user_profiles(id),
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_job_costing_org ON job_costing(organization_id);
CREATE INDEX idx_job_costing_project ON job_costing(project_id);
ALTER TABLE job_costing ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON job_costing USING (organization_id = get_user_org_id());

-- ============================================================
-- MONITORED SYSTEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS monitored_systems (
  id                      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id         UUID NOT NULL REFERENCES organizations(id),
  project_id              UUID REFERENCES solar_projects(id),
  contact_id              UUID REFERENCES contacts(id),
  system_name             TEXT NOT NULL,
  monitoring_provider     TEXT CHECK (monitoring_provider IN ('enphase','solaredge','tesla','generac','sense','other')),
  monitoring_system_id    TEXT,
  monitoring_url          TEXT,
  api_key_encrypted       TEXT,
  system_size_kw          DECIMAL(10,2),
  panel_count             INTEGER,
  inverter_serial         TEXT,
  battery_serial          TEXT,
  install_date            DATE,
  warranty_expiry         DATE,
  status                  TEXT DEFAULT 'online' CHECK (status IN ('online','offline','degraded','maintenance','decommissioned')),
  last_reading_at         TIMESTAMPTZ,
  lifetime_production_kwh DECIMAL(14,2) DEFAULT 0,
  current_power_w         DECIMAL(10,2) DEFAULT 0,
  today_production_kwh    DECIMAL(10,2) DEFAULT 0,
  month_production_kwh    DECIMAL(12,2) DEFAULT 0,
  year_production_kwh     DECIMAL(14,2) DEFAULT 0,
  performance_ratio       DECIMAL(5,2),
  alerts_enabled          BOOLEAN DEFAULT true,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW(),
  deleted_at              TIMESTAMPTZ
);

CREATE INDEX idx_monitored_org ON monitored_systems(organization_id);
CREATE INDEX idx_monitored_status ON monitored_systems(status);
ALTER TABLE monitored_systems ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON monitored_systems USING (organization_id = get_user_org_id());
CREATE TRIGGER set_updated_at BEFORE UPDATE ON monitored_systems FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- SYSTEM ALERTS
-- ============================================================
CREATE TABLE IF NOT EXISTS system_alerts (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id       UUID NOT NULL REFERENCES organizations(id),
  system_id             UUID NOT NULL REFERENCES monitored_systems(id) ON DELETE CASCADE,
  alert_type            TEXT NOT NULL CHECK (alert_type IN ('production_low','inverter_offline','panel_degradation','battery_issue','grid_outage','communication_lost','maintenance_due')),
  severity              TEXT NOT NULL CHECK (severity IN ('critical','warning','info')),
  title                 TEXT NOT NULL,
  description           TEXT,
  is_resolved           BOOLEAN DEFAULT false,
  resolved_at           TIMESTAMPTZ,
  resolved_by           UUID REFERENCES user_profiles(id),
  acknowledged_at       TIMESTAMPTZ,
  acknowledged_by       UUID REFERENCES user_profiles(id),
  auto_ticket_id        UUID,
  metadata              JSONB DEFAULT '{}',
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alerts_org ON system_alerts(organization_id);
CREATE INDEX idx_alerts_system ON system_alerts(system_id);
CREATE INDEX idx_alerts_resolved ON system_alerts(is_resolved);
ALTER TABLE system_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON system_alerts USING (organization_id = get_user_org_id());

-- ============================================================
-- SYSTEM READINGS (time-series)
-- ============================================================
-- TODO: Partition by recorded_at for performance at scale
CREATE TABLE IF NOT EXISTS system_readings (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id       UUID NOT NULL REFERENCES organizations(id),
  system_id             UUID NOT NULL REFERENCES monitored_systems(id) ON DELETE CASCADE,
  reading_type          TEXT NOT NULL CHECK (reading_type IN ('power','energy','voltage','current','temperature','battery_soc')),
  value                 DECIMAL(14,4) NOT NULL,
  unit                  TEXT NOT NULL,
  recorded_at           TIMESTAMPTZ NOT NULL,
  source                TEXT,
  UNIQUE (system_id, reading_type, recorded_at)
);

CREATE INDEX idx_readings_system ON system_readings(system_id, recorded_at);
CREATE INDEX idx_readings_org ON system_readings(organization_id);
ALTER TABLE system_readings ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON system_readings USING (organization_id = get_user_org_id());

-- ============================================================
-- PERMIT TRACKING
-- ============================================================
CREATE TABLE IF NOT EXISTS permit_tracking (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id       UUID NOT NULL REFERENCES organizations(id),
  project_id            UUID NOT NULL REFERENCES solar_projects(id),
  permit_type           TEXT NOT NULL CHECK (permit_type IN ('building','electrical','structural','fire','hoa')),
  jurisdiction          TEXT,
  application_number    TEXT,
  status                TEXT DEFAULT 'not_submitted' CHECK (status IN ('not_submitted','submitted','in_review','revision_required','approved','denied')),
  submitted_at          TIMESTAMPTZ,
  approved_at           TIMESTAMPTZ,
  denied_at             TIMESTAMPTZ,
  denial_reason         TEXT,
  fee                   DECIMAL(10,2),
  inspector_name        TEXT,
  inspector_phone       TEXT,
  notes                 TEXT,
  documents             JSONB DEFAULT '[]',
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_permits_org ON permit_tracking(organization_id);
CREATE INDEX idx_permits_project ON permit_tracking(project_id);
ALTER TABLE permit_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON permit_tracking USING (organization_id = get_user_org_id());

-- ============================================================
-- UTILITY APPLICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS utility_applications (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id       UUID NOT NULL REFERENCES organizations(id),
  project_id            UUID NOT NULL REFERENCES solar_projects(id),
  utility_company       TEXT NOT NULL,
  application_type      TEXT NOT NULL CHECK (application_type IN ('interconnection','net_metering','pto')),
  application_number    TEXT,
  status                TEXT DEFAULT 'not_submitted' CHECK (status IN ('not_submitted','submitted','in_review','approved','denied')),
  account_number        TEXT,
  meter_number          TEXT,
  submitted_at          TIMESTAMPTZ,
  approved_at           TIMESTAMPTZ,
  pto_date              DATE,
  notes                 TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_utility_apps_org ON utility_applications(organization_id);
CREATE INDEX idx_utility_apps_project ON utility_applications(project_id);
ALTER TABLE utility_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON utility_applications USING (organization_id = get_user_org_id());

-- ============================================================
-- INSPECTION RESULTS
-- ============================================================
CREATE TABLE IF NOT EXISTS inspection_results (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id       UUID NOT NULL REFERENCES organizations(id),
  project_id            UUID NOT NULL REFERENCES solar_projects(id),
  schedule_entry_id     UUID REFERENCES schedule_entries(id),
  inspection_type       TEXT NOT NULL CHECK (inspection_type IN ('rough','final','fire','structural','electrical')),
  result                TEXT CHECK (result IN ('passed','failed','conditional')),
  inspector_name        TEXT,
  inspector_license     TEXT,
  inspection_date       DATE,
  failure_reasons       JSONB DEFAULT '[]',
  conditions            JSONB DEFAULT '[]',
  reinspection_date     DATE,
  photos                JSONB DEFAULT '[]',
  notes                 TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inspections_org ON inspection_results(organization_id);
CREATE INDEX idx_inspections_project ON inspection_results(project_id);
ALTER TABLE inspection_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON inspection_results USING (organization_id = get_user_org_id());

-- ============================================================
-- INTEGRATION CONNECTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS integration_connections (
  id                      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id         UUID NOT NULL REFERENCES organizations(id),
  provider                TEXT NOT NULL,
  status                  TEXT DEFAULT 'inactive' CHECK (status IN ('active','inactive','error','expired')),
  display_name            TEXT,
  credentials_encrypted   TEXT,
  refresh_token_encrypted TEXT,
  token_expires_at        TIMESTAMPTZ,
  scopes                  TEXT[] DEFAULT '{}',
  webhook_url             TEXT,
  last_sync_at            TIMESTAMPTZ,
  last_error              TEXT,
  sync_frequency          TEXT DEFAULT 'manual' CHECK (sync_frequency IN ('realtime','hourly','daily','manual')),
  config                  JSONB DEFAULT '{}',
  connected_by            UUID REFERENCES user_profiles(id),
  connected_at            TIMESTAMPTZ,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_integrations_org ON integration_connections(organization_id);
CREATE INDEX idx_integrations_provider ON integration_connections(provider);
ALTER TABLE integration_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON integration_connections USING (organization_id = get_user_org_id());

-- ============================================================
-- INTEGRATION LOGS
-- ============================================================
-- TODO: Auto-purge logs older than 90 days
CREATE TABLE IF NOT EXISTS integration_logs (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id       UUID NOT NULL REFERENCES organizations(id),
  connection_id         UUID REFERENCES integration_connections(id) ON DELETE CASCADE,
  direction             TEXT NOT NULL CHECK (direction IN ('inbound','outbound')),
  endpoint              TEXT,
  method                TEXT,
  request_body          JSONB,
  response_status       INTEGER,
  response_body         JSONB,
  duration_ms           INTEGER,
  error                 TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_int_logs_connection ON integration_logs(connection_id, created_at);
CREATE INDEX idx_int_logs_org ON integration_logs(organization_id);
ALTER TABLE integration_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON integration_logs USING (organization_id = get_user_org_id());

-- ============================================================
-- UTILITY FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION increment_sequence_enrolled(seq_id UUID, inc_count INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE sequences SET enrolled_count = enrolled_count + inc_count WHERE id = seq_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION calculate_job_profit(p_project_id UUID)
RETURNS TABLE (revenue DECIMAL, cost DECIMAL, profit DECIMAL, margin_pct DECIMAL) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(inv.total_revenue, 0) AS revenue,
    COALESCE(jc.total_cost, 0) AS cost,
    COALESCE(inv.total_revenue, 0) - COALESCE(jc.total_cost, 0) AS profit,
    CASE WHEN COALESCE(inv.total_revenue, 0) > 0
      THEN ROUND(((COALESCE(inv.total_revenue, 0) - COALESCE(jc.total_cost, 0)) / inv.total_revenue) * 100, 2)
      ELSE 0
    END AS margin_pct
  FROM
    (SELECT SUM(amount_paid) AS total_revenue FROM invoices WHERE project_id = p_project_id AND status IN ('paid', 'partial')) inv,
    (SELECT SUM(amount) AS total_cost FROM job_costing WHERE project_id = p_project_id) jc;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
