-- GoldenDoor CRM Complete Database Schema
-- Organization ID: a97d1a8b-3691-42a3-b116-d131e085b00f
-- This migration creates the complete schema for the GoldenDoor CRM platform
-- Supporting all verticals, HubSpot hub equivalents, and Customer DNA engine

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

CREATE TYPE user_role AS ENUM ('admin', 'manager', 'sales', 'support', 'viewer');
CREATE TYPE account_status AS ENUM ('active', 'inactive', 'suspended', 'deleted');
CREATE TYPE contact_status AS ENUM ('lead', 'prospect', 'customer', 'inactive');
CREATE TYPE contact_type AS ENUM ('person', 'company');
CREATE TYPE opportunity_status AS ENUM ('open', 'in_progress', 'won', 'lost', 'stalled');
CREATE TYPE opportunity_stage AS ENUM ('lead', 'qualified_lead', 'proposal', 'negotiation', 'closed_won', 'closed_lost');
CREATE TYPE pipeline_stage AS ENUM ('lead', 'contact_made', 'qualified', 'proposal_sent', 'negotiating', 'closed_won', 'closed_lost');
CREATE TYPE task_status AS ENUM ('open', 'in_progress', 'completed', 'cancelled');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE email_status AS ENUM ('draft', 'sent', 'failed', 'bounced');
CREATE TYPE ticket_status AS ENUM ('new', 'open', 'pending', 'resolved', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE article_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE engagement_type AS ENUM ('email_open', 'email_click', 'page_view', 'form_submission', 'download', 'video_play', 'call', 'meeting');
CREATE TYPE campaign_status AS ENUM ('draft', 'scheduled', 'active', 'paused', 'completed', 'failed');
CREATE TYPE email_template_type AS ENUM ('marketing', 'transactional', 'notification');
CREATE TYPE vertical_type AS ENUM ('solar', 'security', 'roofing', 'telecom');
CREATE TYPE solar_status AS ENUM ('survey_pending', 'design_in_progress', 'quote_sent', 'quote_accepted', 'installation_scheduled', 'installed', 'cancelled');
CREATE TYPE security_status AS ENUM ('site_assessment', 'proposal_sent', 'equipment_selection', 'installation_scheduled', 'installed', 'monitoring_active', 'cancelled');
CREATE TYPE roofing_status AS ENUM ('inspection_scheduled', 'inspection_done', 'estimate_sent', 'estimate_accepted', 'materials_ordered', 'installation_scheduled', 'installation_done', 'cancelled');
CREATE TYPE telecom_status AS ENUM ('needs_analysis', 'proposal_sent', 'service_selected', 'activation_scheduled', 'activated', 'active', 'cancelled');
CREATE TYPE crew_availability_status AS ENUM ('available', 'unavailable', 'on_leave', 'training');

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Organizations table
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  website VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  country VARCHAR(100),
  logo_url VARCHAR(500),
  settings JSONB DEFAULT '{}',
  status account_status DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(org_id)
);

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  role user_role DEFAULT 'viewer',
  department VARCHAR(100),
  avatar_url VARCHAR(500),
  bio TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  failed_login_attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE
);

-- Accounts/Companies table
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  website VARCHAR(255),
  phone VARCHAR(20),
  billing_street VARCHAR(255),
  billing_city VARCHAR(100),
  billing_state VARCHAR(50),
  billing_zip VARCHAR(20),
  billing_country VARCHAR(100),
  shipping_street VARCHAR(255),
  shipping_city VARCHAR(100),
  shipping_state VARCHAR(50),
  shipping_zip VARCHAR(20),
  shipping_country VARCHAR(100),
  number_of_employees INTEGER,
  annual_revenue DECIMAL(15, 2),
  account_owner_id UUID,
  status contact_status DEFAULT 'lead',
  source VARCHAR(100),
  custom_fields JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
  FOREIGN KEY (account_owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Contacts table
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  account_id UUID NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  mobile VARCHAR(20),
  title VARCHAR(100),
  department VARCHAR(100),
  reports_to UUID,
  type contact_type DEFAULT 'person',
  status contact_status DEFAULT 'lead',
  source VARCHAR(100),
  primary_contact BOOLEAN DEFAULT FALSE,
  is_decision_maker BOOLEAN DEFAULT FALSE,
  do_not_call BOOLEAN DEFAULT FALSE,
  do_not_contact BOOLEAN DEFAULT FALSE,
  photo_url VARCHAR(500),
  custom_fields JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (reports_to) REFERENCES contacts(id) ON DELETE SET NULL
);

-- ============================================================================
-- SALES HUB TABLES
-- ============================================================================

-- Opportunities table
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  account_id UUID NOT NULL,
  contact_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  amount DECIMAL(15, 2),
  expected_revenue DECIMAL(15, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  stage opportunity_stage DEFAULT 'lead',
  status opportunity_status DEFAULT 'open',
  probability DECIMAL(5, 2) DEFAULT 0,
  owner_id UUID,
  close_date DATE,
  created_date DATE DEFAULT CURRENT_DATE,
  competitor VARCHAR(255),
  forecast_category VARCHAR(50),
  type VARCHAR(100),
  custom_fields JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Deals/Pipeline table
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  opportunity_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  value DECIMAL(15, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  stage pipeline_stage DEFAULT 'lead',
  owner_id UUID,
  probability DECIMAL(5, 2) DEFAULT 0,
  expected_close_date DATE,
  closed_date DATE,
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
  FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Sales Activities table
CREATE TABLE sales_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  opportunity_id UUID NOT NULL,
  contact_id UUID NOT NULL,
  activity_type VARCHAR(50) NOT NULL,
  subject VARCHAR(255),
  description TEXT,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  owner_id UUID,
  duration_minutes INTEGER,
  outcome VARCHAR(100),
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
  FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================================
-- MARKETING HUB TABLES
-- ============================================================================

-- Campaigns table
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50),
  status campaign_status DEFAULT 'draft',
  budget DECIMAL(15, 2),
  spent DECIMAL(15, 2) DEFAULT 0,
  roi DECIMAL(8, 2),
  owner_id UUID,
  start_date DATE,
  end_date DATE,
  expected_revenue DECIMAL(15, 2),
  actual_revenue DECIMAL(15, 2),
  leads_generated INTEGER DEFAULT 0,
  contacts_engaged INTEGER DEFAULT 0,
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Email templates table
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  body TEXT,
  html_body TEXT,
  template_type email_template_type DEFAULT 'marketing',
  status article_status DEFAULT 'draft',
  owner_id UUID,
  folder VARCHAR(100),
  preview_text VARCHAR(500),
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Emails table
CREATE TABLE emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  campaign_id UUID,
  contact_id UUID NOT NULL,
  account_id UUID,
  sender_id UUID,
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  body TEXT,
  html_body TEXT,
  status email_status DEFAULT 'draft',
  sent_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  bounced_at TIMESTAMP WITH TIME ZONE,
  reply_count INTEGER DEFAULT 0,
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Landing pages table
CREATE TABLE landing_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  campaign_id UUID,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  title VARCHAR(255),
  description TEXT,
  html_content TEXT,
  status article_status DEFAULT 'draft',
  owner_id UUID,
  conversion_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  conversion_rate DECIMAL(8, 2),
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Forms table
CREATE TABLE forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  campaign_id UUID,
  landing_page_id UUID,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  form_fields JSONB DEFAULT '[]',
  submission_count INTEGER DEFAULT 0,
  owner_id UUID,
  redirect_url VARCHAR(500),
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL,
  FOREIGN KEY (landing_page_id) REFERENCES landing_pages(id) ON DELETE SET NULL,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Form submissions table
CREATE TABLE form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  form_id UUID NOT NULL,
  contact_id UUID,
  form_data JSONB DEFAULT '{}',
  ip_address VARCHAR(45),
  user_agent TEXT,
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
  FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL
);

-- Engagement tracking table
CREATE TABLE engagements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  contact_id UUID NOT NULL,
  account_id UUID,
  campaign_id UUID,
  engagement_type engagement_type NOT NULL,
  resource_type VARCHAR(50),
  resource_id VARCHAR(255),
  resource_name VARCHAR(255),
  engagement_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  engagement_score DECIMAL(8, 2) DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL
);

-- ============================================================================
-- SERVICE HUB TABLES
-- ============================================================================

-- Tickets/Cases table
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  ticket_number VARCHAR(50) UNIQUE NOT NULL,
  contact_id UUID NOT NULL,
  account_id UUID NOT NULL,
  subject VARCHAR(255) NOT NULL,
  description TEXT,
  status ticket_status DEFAULT 'new',
  priority ticket_priority DEFAULT 'medium',
  assigned_to UUID,
  owner_id UUID,
  origin VARCHAR(50),
  type VARCHAR(100),
  category VARCHAR(100),
  sub_category VARCHAR(100),
  resolution TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  closed_at TIMESTAMP WITH TIME ZONE,
  time_to_first_response INTERVAL,
  time_to_resolution INTERVAL,
  satisfaction_rating DECIMAL(3, 2),
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Ticket comments/replies table
CREATE TABLE ticket_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  ticket_id UUID NOT NULL,
  author_id UUID NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE,
  body TEXT NOT NULL,
  attachment_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Knowledge base articles table
CREATE TABLE knowledge_base_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  body TEXT,
  category VARCHAR(100),
  sub_category VARCHAR(100),
  status article_status DEFAULT 'draft',
  author_id UUID,
  view_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  not_helpful_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================================
-- CONTENT HUB TABLES
-- ============================================================================

-- Blog posts table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  excerpt TEXT,
  body TEXT,
  featured_image_url VARCHAR(500),
  author_id UUID,
  status article_status DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Blog comments table
CREATE TABLE blog_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  blog_post_id UUID NOT NULL,
  contact_id UUID,
  author_name VARCHAR(255),
  author_email VARCHAR(255),
  body TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
  FOREIGN KEY (blog_post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL
);

-- Documents/Assets table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50),
  file_url VARCHAR(500),
  file_size BIGINT,
  mime_type VARCHAR(100),
  owner_id UUID,
  description TEXT,
  folder VARCHAR(255),
  visibility VARCHAR(20),
  download_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================================
-- TASK & ACTIVITY MANAGEMENT TABLES
-- ============================================================================

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  account_id UUID,
  contact_id UUID,
  opportunity_id UUID,
  ticket_id UUID,
  subject VARCHAR(255) NOT NULL,
  description TEXT,
  status task_status DEFAULT 'open',
  priority task_priority DEFAULT 'medium',
  assigned_to UUID,
  created_by UUID,
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  reminder_date TIMESTAMP WITH TIME ZONE,
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
  FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Meetings/Events table
CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  subject VARCHAR(255) NOT NULL,
  description TEXT,
  organizer_id UUID NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  location VARCHAR(255),
  meeting_url VARCHAR(500),
  status VARCHAR(50),
  attendees JSONB DEFAULT '[]',
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
  FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Meeting attendees table
CREATE TABLE meeting_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  meeting_id UUID NOT NULL,
  contact_id UUID,
  user_id UUID,
  email VARCHAR(255),
  response_status VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
  FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE CASCADE,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================================
-- CUSTOMER DNA ENGINE TABLES
-- ============================================================================

-- Customer profiles table
CREATE TABLE customer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  account_id UUID NOT NULL,
  contact_id UUID NOT NULL,
  vertical vertical_type,
  customer_lifetime_value DECIMAL(15, 2),
  engagement_score DECIMAL(8, 2) DEFAULT 0,
  purchase_history JSONB DEFAULT '[]',
  preferences JSONB DEFAULT '{}',
  behavioral_data JSONB DEFAULT '{}',
  demographic_data JSONB DEFAULT '{}',
  firmographic_data JSONB DEFAULT '{}',
  psychographic_data JSONB DEFAULT '{}',
  sentiment VARCHAR(50),
  churn_risk DECIMAL(5, 2),
  next_best_action VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);

-- Cross-sell opportunities table
CREATE TABLE cross_sell_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  customer_profile_id UUID NOT NULL,
  account_id UUID NOT NULL,
  contact_id UUID NOT NULL,
  product_name VARCHAR(255),
  vertical vertical_type,
  relevance_score DECIMAL(5, 2),
  estimated_value DECIMAL(15, 2),
  recommendation_reason TEXT,
  status VARCHAR(50),
  owner_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
  FOREIGN KEY (customer_profile_id) REFERENCES customer_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Customer journey tracking table
CREATE TABLE customer_journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  contact_id UUID NOT NULL,
  account_id UUID NOT NULL,
  stage VARCHAR(100),
  entry_date TIMESTAMP WITH TIME ZONE,
  exit_date TIMESTAMP WITH TIME ZONE,
  duration_days INTEGER,
  touches INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

-- Behavioral insights table
CREATE TABLE behavioral_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  customer_profile_id UUID NOT NULL,
  contact_id UUID NOT NULL,
  account_id UUID NOT NULL,
  insight_type VARCHAR(100),
  description TEXT,
  confidence_score DECIMAL(5, 2),
  action_recommended TEXT,
  insight_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
  FOREIGN KEY (customer_profile_id) REFERENCES customer_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

-- ============================================================================
-- SOLAR VERTICAL TABLES
-- ============================================================================

-- Solar projects table
CREATE TABLE solar_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  opportunity_id UUID NOT NULL,
  account_id UUID NOT NULL,
  contact_id UUID NOT NULL,
  project_name VARCHAR(255) NOT NULL,
  status solar_status DEFAULT 'survey_pending',
  property_address TEXT,
  property_city VARCHAR(100),
  property_state VARCHAR(50),
  property_zip VARCHAR(20),
  system_size_kw DECIMAL(8, 2),
  modules_count INTEGER,
  inverter_type VARCHAR(100),
  battery_type VARCHAR(100),
  battery_capacity_kwh DECIMAL(8, 2),
  roof_type VARCHAR(50),
  roof_condition VARCHAR(50),
  annual_consumption_kwh DECIMAL(10, 2),
  estimated_production_kwh DECIMAL(10, 2),
  estimated_savings_annual DECIMAL(12, 2),
  project_cost DECIMAL(15, 2),
  financing_option VARCHAR(100),
  installation_start_date DATE,
  installation_end_date DATE,
  inspector_id UUID,
  installer_id UUID,
  permits_status VARCHAR(50),
  final_inspection_date DATE,
  pto_date DATE,
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
  FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
  FOREIGN KEY (inspector_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (installer_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Solar surveys/Site assessments table
CREATE TABLE solar_surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  project_id UUID NOT NULL,
  surveyor_id UUID NOT NULL,
  survey_date TIMESTAMP WITH TIME ZONE,
  survey_notes TEXT,
  roof_slope DECIMAL(5, 2),
  shading_percentage DECIMAL(5, 2),
  available_space_sqft INTEGER,
  electrical_panel_location VARCHAR(255),
  electrical_panel_capacity_amps INTEGER,
  utility_type VARCHAR(50),
  net_metering_available BOOLEAN,
  solar_radiation_data JSONB,
  images_urls VARCHAR[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES solar_projects(id) ON DELETE CASCADE,
  FOREIGN KEY (surveyor_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Solar financing table
CREATE TABLE solar_financing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  project_id UUID NOT NULL,
  financing_type VARCHAR(50),
  loan_amount DECIMAL(15, 2),
  interest_rate DECIMAL(8, 2),
  loan_term_years INTEGER,
  monthly_payment DECIMAL(10, 2),
  down_payment DECIMAL(15, 2),
  incentives_tax_credits DECIMAL(15, 2),
  state_rebates DECIMAL(15, 2),
  federal_tax_credit_amount DECIMAL(15, 2),
  lender_name VARCHAR(255),
  loan_number VARCHAR(100),
  approval_date DATE,
  funded_date DATE,
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES solar_projects(id) ON DELETE CASCADE
);

-- Solar system performance table
CREATE TABLE solar_system_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  project_id UUID NOT NULL,
  performance_month DATE,
  energy_produced_kwh DECIMAL(10, 2),
  energy_consumed_kwh DECIMAL(10, 2),
  net_energy_exported_kwh DECIMAL(10, 2),
  battery_percentage_min DECIMAL(5, 2),
  battery_percentage_max DECIMAL(5, 2),
  system_efficiency_percentage DECIMAL(5, 2),
  performance_ratio DECIMAL(5, 2),
  actual_vs_predicted DECIMAL(5, 2),
  alerts_count INTEGER DEFAULT 0,
  maintenance_needed BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES solar_projects(id) ON DELETE CASCADE
);

-- ============================================================================
-- SECURITY VERTICAL TABLES
-- ============================================================================

-- Security projects table
CREATE TABLE security_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  opportunity_id UUID NOT NULL,
  account_id UUID NOT NULL,
  contact_id UUID NOT NULL,
  project_name VARCHAR(255) NOT NULL,
  status security_status DEFAULT 'site_assessment',
  property_address TEXT,
  property_type VARCHAR(100),
  property_size_sqft INTEGER,
  number_of_entry_points INTEGER,
  number_of_cameras INTEGER,
  number_of_sensors INTEGER,
  control_panel_type VARCHAR(100),
  monitoring_center VARCHAR(255),
  monitoring_contract_term_months INTEGER,
  monthly_monitoring_cost DECIMAL(10, 2),
  installation_start_date DATE,
  installation_end_date DATE,
  inspector_id UUID,
  installer_id UUID,
  final_inspection_date DATE,
  monitoring_start_date DATE,
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
  FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
  FOREIGN KEY (inspector_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (installer_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Security equipment table
CREATE TABLE security_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT 'a97d1a8b-3691-42a3-b116-d131e085b00f',
  project_id UUID NOT NULL,
  equipment_type VARCHAR(100),
  model VARCHAR(100),
  manufacturer VARCHAR(100),
  quantity INTEGER,
  location VARCHAR(255),
  installation_date DATE,
  warranty_end_date DATE,
  maintenance_schedule_months INTEGER,
  next_maintenance_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES security_projects(id) ON DELETE CASCADE
);

-- Security incidents table
CREATE TABLE security_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL DEFAULT '