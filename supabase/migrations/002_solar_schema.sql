-- ============================================================
-- GOLDENDOOR CRM — Solar Pipeline Schema Extension
-- Tracks the full solar project lifecycle:
-- Contract Signed → Site Survey → CADs → Permits → Install → Inspection → PTO → Final Completion
-- ============================================================

-- ============================================================
-- SOLAR PROJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS solar_projects (
  id                      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id         UUID NOT NULL REFERENCES organizations(id),
  deal_id                 UUID REFERENCES deals(id),
  contact_id              UUID REFERENCES contacts(id),
  company_id              UUID REFERENCES companies(id),
  rep_id                  UUID REFERENCES user_profiles(id),
  assigned_to             UUID REFERENCES user_profiles(id),
  external_id             TEXT,
  last_synced_at          TIMESTAMPTZ,

  -- Current stage
  current_stage           TEXT NOT NULL DEFAULT 'contract_signed'
    CHECK (current_stage IN (
      'contract_signed',
      'site_survey_scheduled',
      'site_survey_completed',
      'cads_in_progress',
      'cads_completed',
      'permits_submitted',
      'permits_approved',
      'install_scheduled',
      'install_in_progress',
      'install_completed',
      'inspection_scheduled',
      'inspection_passed',
      'pto_submitted',
      'pto_approved',
      'final_completion'
    )),

  -- Stage timestamps (populated as each stage is reached)
  contract_signed_at          TIMESTAMPTZ,
  site_survey_scheduled_at    TIMESTAMPTZ,
  site_survey_completed_at    TIMESTAMPTZ,
  cads_in_progress_at         TIMESTAMPTZ,
  cads_completed_at           TIMESTAMPTZ,
  permits_submitted_at        TIMESTAMPTZ,
  permits_approved_at         TIMESTAMPTZ,
  install_scheduled_at        TIMESTAMPTZ,
  install_in_progress_at      TIMESTAMPTZ,
  install_completed_at        TIMESTAMPTZ,
  inspection_scheduled_at     TIMESTAMPTZ,
  inspection_passed_at        TIMESTAMPTZ,
  pto_submitted_at            TIMESTAMPTZ,
  pto_approved_at             TIMESTAMPTZ,
  final_completion_at         TIMESTAMPTZ,
  completed_at                TIMESTAMPTZ,

  -- System specs
  system_size_kw              DECIMAL(10,2),
  panel_count                 INTEGER,
  panel_type                  TEXT,
  inverter_type               TEXT,
  battery_type                TEXT,
  battery_count               INTEGER,
  roof_type                   TEXT,
  roof_age_years              INTEGER,
  estimated_production_kwh    DECIMAL(12,2),
  estimated_offset_pct        DECIMAL(5,2),

  -- Financial
  financing_type              TEXT CHECK (financing_type IN ('cash', 'loan', 'lease', 'ppa')),
  contract_amount             DECIMAL(12,2),
  lender_name                 TEXT,
  loan_term_months            INTEGER,
  monthly_payment             DECIMAL(10,2),
  down_payment                DECIMAL(10,2),
  dealer_fee_pct              DECIMAL(5,2),
  adders_total                DECIMAL(10,2),

  -- Location
  address                     TEXT,
  city                        TEXT,
  state                       TEXT,
  zip                         TEXT,
  county                      TEXT,
  latitude                    DECIMAL(10,7),
  longitude                   DECIMAL(10,7),
  utility_company             TEXT,
  ahj                         TEXT, -- Authority Having Jurisdiction

  -- Survey data
  survey_notes                TEXT,
  survey_photos_url           TEXT,
  survey_report_url           TEXT,

  -- CAD data
  cad_file_url                TEXT,
  cad_designer                TEXT,
  cad_revision_count          INTEGER DEFAULT 0,

  -- Permit data
  permit_number               TEXT,
  permit_submitted_to         TEXT,
  permit_approved_number      TEXT,
  permit_fee                  DECIMAL(10,2),

  -- Install data
  install_completed_by        UUID REFERENCES user_profiles(id),
  install_crew_size           INTEGER,
  install_photos_url          TEXT,
  install_duration_hours      DECIMAL(5,1),

  -- Inspection data
  inspection_result           TEXT CHECK (inspection_result IN ('passed', 'failed', 'conditional')),
  inspector_name              TEXT,
  inspection_notes            TEXT,
  inspection_failure_reason   TEXT,
  reinspection_date           DATE,

  -- PTO data
  pto_approval_number         TEXT,
  pto_utility_account         TEXT,
  meter_swap_date             DATE,

  -- General
  notes                       TEXT,
  tags                        TEXT[] DEFAULT '{}',
  custom_properties           JSONB DEFAULT '{}',
  hubspot_synced_at           TIMESTAMPTZ,

  -- Timestamps
  created_at                  TIMESTAMPTZ DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ DEFAULT NOW(),
  deleted_at                  TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_solar_projects_org ON solar_projects(organization_id);
CREATE INDEX idx_solar_projects_stage ON solar_projects(current_stage);
CREATE INDEX idx_solar_projects_rep ON solar_projects(rep_id);
CREATE INDEX idx_solar_projects_contact ON solar_projects(contact_id);
CREATE INDEX idx_solar_projects_deal ON solar_projects(deal_id);
CREATE INDEX idx_solar_projects_state ON solar_projects(state);

-- RLS
ALTER TABLE solar_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON solar_projects
  USING (organization_id = get_user_org_id());

-- Updated_at trigger
CREATE TRIGGER set_updated_at BEFORE UPDATE ON solar_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- SOLAR PROJECT TIMELINE (stage transition log)
-- ============================================================
CREATE TABLE IF NOT EXISTS solar_project_timeline (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id   UUID NOT NULL REFERENCES organizations(id),
  project_id        UUID NOT NULL REFERENCES solar_projects(id) ON DELETE CASCADE,
  old_stage         TEXT,
  new_stage         TEXT NOT NULL,
  actor_id          UUID REFERENCES user_profiles(id),
  notes             TEXT,
  metadata          JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_solar_timeline_project ON solar_project_timeline(project_id);
CREATE INDEX idx_solar_timeline_org ON solar_project_timeline(organization_id);
CREATE INDEX idx_solar_timeline_created ON solar_project_timeline(created_at);

ALTER TABLE solar_project_timeline ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON solar_project_timeline
  USING (organization_id = get_user_org_id());

-- ============================================================
-- SOLAR DOCUMENTS (permits, contracts, photos, etc.)
-- ============================================================
CREATE TABLE IF NOT EXISTS solar_documents (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id   UUID NOT NULL REFERENCES organizations(id),
  project_id        UUID NOT NULL REFERENCES solar_projects(id) ON DELETE CASCADE,
  document_type     TEXT NOT NULL CHECK (document_type IN (
    'contract', 'site_survey', 'cad_design', 'permit', 'permit_approval',
    'install_photo', 'inspection_report', 'pto_approval', 'utility_bill',
    'roof_report', 'shade_analysis', 'change_order', 'completion_cert', 'other'
  )),
  file_name         TEXT NOT NULL,
  file_url          TEXT NOT NULL,
  file_size_bytes   BIGINT,
  mime_type         TEXT,
  uploaded_by       UUID REFERENCES user_profiles(id),
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_solar_docs_project ON solar_documents(project_id);
CREATE INDEX idx_solar_docs_type ON solar_documents(document_type);

ALTER TABLE solar_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON solar_documents
  USING (organization_id = get_user_org_id());

-- ============================================================
-- SOLAR CHANGE ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS solar_change_orders (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id   UUID NOT NULL REFERENCES organizations(id),
  project_id        UUID NOT NULL REFERENCES solar_projects(id) ON DELETE CASCADE,
  reason            TEXT NOT NULL,
  description       TEXT,
  amount_change     DECIMAL(10,2) DEFAULT 0,
  old_system_size   DECIMAL(10,2),
  new_system_size   DECIMAL(10,2),
  old_panel_count   INTEGER,
  new_panel_count   INTEGER,
  status            TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by       UUID REFERENCES user_profiles(id),
  approved_at       TIMESTAMPTZ,
  created_by        UUID REFERENCES user_profiles(id),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE solar_change_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON solar_change_orders
  USING (organization_id = get_user_org_id());

-- ============================================================
-- MARKETING: EMAIL TEMPLATES
-- ============================================================
CREATE TABLE IF NOT EXISTS email_campaigns (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id   UUID NOT NULL REFERENCES organizations(id),
  name              TEXT NOT NULL,
  subject           TEXT NOT NULL,
  from_name         TEXT,
  from_email        TEXT,
  reply_to          TEXT,
  template_id       UUID REFERENCES email_templates(id),
  html_content      TEXT,
  plain_content     TEXT,
  status            TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled')),
  send_at           TIMESTAMPTZ,
  sent_at           TIMESTAMPTZ,
  list_id           UUID REFERENCES contact_lists(id),
  segment_filters   JSONB DEFAULT '{}',
  stats             JSONB DEFAULT '{"sent": 0, "delivered": 0, "opened": 0, "clicked": 0, "bounced": 0, "unsubscribed": 0}',
  created_by        UUID REFERENCES user_profiles(id),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);

CREATE INDEX idx_email_campaigns_org ON email_campaigns(organization_id);
CREATE INDEX idx_email_campaigns_status ON email_campaigns(status);

ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON email_campaigns
  USING (organization_id = get_user_org_id());

-- ============================================================
-- MARKETING: EMAIL SENDS (individual send records)
-- ============================================================
CREATE TABLE IF NOT EXISTS email_sends (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id   UUID NOT NULL REFERENCES organizations(id),
  campaign_id       UUID REFERENCES email_campaigns(id),
  contact_id        UUID REFERENCES contacts(id),
  email_address     TEXT NOT NULL,
  status            TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed', 'unsubscribed')),
  sent_at           TIMESTAMPTZ,
  delivered_at      TIMESTAMPTZ,
  opened_at         TIMESTAMPTZ,
  clicked_at        TIMESTAMPTZ,
  bounced_at        TIMESTAMPTZ,
  bounce_reason     TEXT,
  unsubscribed_at   TIMESTAMPTZ,
  click_urls        JSONB DEFAULT '[]',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_sends_campaign ON email_sends(campaign_id);
CREATE INDEX idx_email_sends_contact ON email_sends(contact_id);
CREATE INDEX idx_email_sends_status ON email_sends(status);

ALTER TABLE email_sends ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON email_sends
  USING (organization_id = get_user_org_id());

-- ============================================================
-- SEQUENCES (multi-step automated outreach)
-- ============================================================
CREATE TABLE IF NOT EXISTS sequences (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id   UUID NOT NULL REFERENCES organizations(id),
  name              TEXT NOT NULL,
  description       TEXT,
  status            TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
  steps             JSONB DEFAULT '[]', -- Array of {step_number, delay_days, type, template_id, subject, body}
  settings          JSONB DEFAULT '{"send_window_start": "09:00", "send_window_end": "17:00", "timezone": "America/Chicago", "skip_weekends": true}',
  enrolled_count    INTEGER DEFAULT 0,
  completed_count   INTEGER DEFAULT 0,
  reply_rate_pct    DECIMAL(5,2) DEFAULT 0,
  created_by        UUID REFERENCES user_profiles(id),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);

ALTER TABLE sequences ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON sequences
  USING (organization_id = get_user_org_id());

-- ============================================================
-- SEQUENCE ENROLLMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS sequence_enrollments (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id   UUID NOT NULL REFERENCES organizations(id),
  sequence_id       UUID NOT NULL REFERENCES sequences(id),
  contact_id        UUID NOT NULL REFERENCES contacts(id),
  current_step      INTEGER DEFAULT 0,
  status            TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'bounced', 'replied', 'unsubscribed', 'unenrolled')),
  enrolled_at       TIMESTAMPTZ DEFAULT NOW(),
  enrolled_by       UUID REFERENCES user_profiles(id),
  completed_at      TIMESTAMPTZ,
  next_step_at      TIMESTAMPTZ,
  last_activity_at  TIMESTAMPTZ
);

CREATE INDEX idx_seq_enroll_sequence ON sequence_enrollments(sequence_id);
CREATE INDEX idx_seq_enroll_contact ON sequence_enrollments(contact_id);
CREATE INDEX idx_seq_enroll_status ON sequence_enrollments(status);

ALTER TABLE sequence_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON sequence_enrollments
  USING (organization_id = get_user_org_id());
