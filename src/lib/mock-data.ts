import { Contact, Company, Deal, Task, Ticket, Activity, PipelineStage } from './types';

export const pipelineStages: PipelineStage[] = [
  { id: 's1', name: 'Appointment Scheduled', probability: 20, color: '#3B82F6', deal_count: 8, total_value: 124000 },
  { id: 's2', name: 'Qualified to Buy', probability: 40, color: '#8B5CF6', deal_count: 6, total_value: 89000 },
  { id: 's3', name: 'Presentation Scheduled', probability: 60, color: '#F59E0B', deal_count: 5, total_value: 156000 },
  { id: 's4', name: 'Decision Maker Bought-In', probability: 80, color: '#F97316', deal_count: 3, total_value: 210000 },
  { id: 's5', name: 'Contract Sent', probability: 90, color: '#10B981', deal_count: 4, total_value: 178000 },
  { id: 's6', name: 'Closed Won', probability: 100, color: '#22C55E', deal_count: 12, total_value: 445000 },
  { id: 's7', name: 'Closed Lost', probability: 0, color: '#EF4444', deal_count: 5, total_value: 87000 },
];

export const contacts: Contact[] = [
  { id: 'c1', first_name: 'Sarah', last_name: 'Johnson', email: 'sarah.j@techcorp.com', phone: '(512) 555-0142', company: 'TechCorp Solutions', job_title: 'VP of Operations', lifecycle_stage: 'customer', lead_status: 'open_deal', lead_score: 92, owner: 'Afan Saleem', last_contacted: '2026-04-12', created_at: '2026-01-15', tags: ['decision-maker', 'solar'], city: 'Austin', state: 'TX' },
  { id: 'c2', first_name: 'Marcus', last_name: 'Williams', email: 'marcus@buildright.com', phone: '(614) 555-0198', company: 'BuildRight Construction', job_title: 'CEO', lifecycle_stage: 'opportunity', lead_status: 'in_progress', lead_score: 85, owner: 'James Reed', last_contacted: '2026-04-11', created_at: '2026-02-03', tags: ['roofing', 'high-value'], city: 'Columbus', state: 'OH' },
  { id: 'c3', first_name: 'Emily', last_name: 'Chen', email: 'echen@novahome.io', phone: '(313) 555-0267', company: 'NovaHome', job_title: 'Homeowner', lifecycle_stage: 'lead', lead_status: 'new', lead_score: 67, owner: 'Mike Torres', last_contacted: '2026-04-10', created_at: '2026-03-20', tags: ['smart-home'], city: 'Detroit', state: 'MI' },
  { id: 'c4', first_name: 'Robert', last_name: 'Martinez', email: 'robert.m@sunvalley.com', phone: '(512) 555-0334', company: 'Sun Valley Estates', job_title: 'Property Manager', lifecycle_stage: 'sales_qualified_lead', lead_status: 'connected', lead_score: 78, owner: 'Afan Saleem', last_contacted: '2026-04-09', created_at: '2026-03-01', tags: ['solar', 'commercial'], city: 'San Antonio', state: 'TX' },
  { id: 'c5', first_name: 'Jennifer', last_name: 'Thompson', email: 'jthompson@greenbuild.org', phone: '(614) 555-0411', company: 'GreenBuild LLC', job_title: 'Director of Sustainability', lifecycle_stage: 'marketing_qualified_lead', lead_status: 'attempted_to_contact', lead_score: 71, owner: 'Sarah Kim', last_contacted: '2026-04-08', created_at: '2026-02-18', tags: ['solar', 'eco-conscious'], city: 'Cincinnati', state: 'OH' },
  { id: 'c6', first_name: 'David', last_name: 'Patel', email: 'dpatel@safeguard.net', phone: '(313) 555-0523', company: 'SafeGuard Properties', job_title: 'Owner', lifecycle_stage: 'customer', lead_status: 'open_deal', lead_score: 95, owner: 'James Reed', last_contacted: '2026-04-13', created_at: '2025-11-10', tags: ['smart-home', 'security', 'repeat'], city: 'Ann Arbor', state: 'MI' },
  { id: 'c7', first_name: 'Lisa', last_name: 'Rodriguez', email: 'lisa.r@horizondev.com', phone: '(512) 555-0687', company: 'Horizon Development', job_title: 'CFO', lifecycle_stage: 'opportunity', lead_status: 'in_progress', lead_score: 88, owner: 'Mike Torres', last_contacted: '2026-04-12', created_at: '2026-01-28', tags: ['roofing', 'commercial', 'decision-maker'], city: 'Houston', state: 'TX' },
  { id: 'c8', first_name: 'Kevin', last_name: 'O\'Brien', email: 'kobrien@midwestind.com', phone: '(614) 555-0745', company: 'Midwest Industries', job_title: 'Facilities Manager', lifecycle_stage: 'lead', lead_status: 'new', lead_score: 55, owner: 'Sarah Kim', last_contacted: '2026-04-07', created_at: '2026-04-01', tags: ['solar'], city: 'Dayton', state: 'OH' },
  { id: 'c9', first_name: 'Amanda', last_name: 'Foster', email: 'afoster@lakehomes.com', phone: '(313) 555-0856', company: 'Lake Homes Realty', job_title: 'Real Estate Agent', lifecycle_stage: 'subscriber', lead_status: 'new', lead_score: 34, owner: 'Afan Saleem', last_contacted: '2026-04-05', created_at: '2026-04-03', tags: ['referral-partner'], city: 'Grand Rapids', state: 'MI' },
  { id: 'c10', first_name: 'Chris', last_name: 'Anderson', email: 'canderson@premiumprop.com', phone: '(512) 555-0912', company: 'Premium Properties', job_title: 'VP Real Estate', lifecycle_stage: 'customer', lead_status: 'open_deal', lead_score: 90, owner: 'James Reed', last_contacted: '2026-04-14', created_at: '2025-09-22', tags: ['solar', 'roofing', 'bundle'], city: 'Dallas', state: 'TX' },
];

export const companies: Company[] = [
  { id: 'co1', name: 'TechCorp Solutions', domain: 'techcorp.com', industry: 'Technology', type: 'customer', company_size: '51-200', annual_revenue: 12000000, phone: '(512) 555-1000', city: 'Austin', state: 'TX', owner: 'Afan Saleem', contacts_count: 3, deals_count: 2, created_at: '2026-01-15' },
  { id: 'co2', name: 'BuildRight Construction', domain: 'buildright.com', industry: 'Construction', type: 'prospect', company_size: '11-50', annual_revenue: 5500000, phone: '(614) 555-2000', city: 'Columbus', state: 'OH', owner: 'James Reed', contacts_count: 2, deals_count: 1, created_at: '2026-02-03' },
  { id: 'co3', name: 'NovaHome', domain: 'novahome.io', industry: 'Real Estate', type: 'prospect', company_size: '1-10', annual_revenue: 800000, phone: '(313) 555-3000', city: 'Detroit', state: 'MI', owner: 'Mike Torres', contacts_count: 1, deals_count: 0, created_at: '2026-03-20' },
  { id: 'co4', name: 'Sun Valley Estates', domain: 'sunvalley.com', industry: 'Real Estate', type: 'prospect', company_size: '11-50', annual_revenue: 8200000, phone: '(512) 555-4000', city: 'San Antonio', state: 'TX', owner: 'Afan Saleem', contacts_count: 4, deals_count: 1, created_at: '2026-03-01' },
  { id: 'co5', name: 'SafeGuard Properties', domain: 'safeguard.net', industry: 'Property Management', type: 'customer', company_size: '11-50', annual_revenue: 3200000, phone: '(313) 555-5000', city: 'Ann Arbor', state: 'MI', owner: 'James Reed', contacts_count: 2, deals_count: 3, created_at: '2025-11-10' },
  { id: 'co6', name: 'Horizon Development', domain: 'horizondev.com', industry: 'Construction', type: 'prospect', company_size: '201-500', annual_revenue: 45000000, phone: '(512) 555-6000', city: 'Houston', state: 'TX', owner: 'Mike Torres', contacts_count: 5, deals_count: 2, created_at: '2026-01-28' },
  { id: 'co7', name: 'GreenBuild LLC', domain: 'greenbuild.org', industry: 'Sustainability', type: 'prospect', company_size: '11-50', annual_revenue: 2100000, phone: '(614) 555-7000', city: 'Cincinnati', state: 'OH', owner: 'Sarah Kim', contacts_count: 2, deals_count: 1, created_at: '2026-02-18' },
  { id: 'co8', name: 'Premium Properties', domain: 'premiumprop.com', industry: 'Real Estate', type: 'customer', company_size: '51-200', annual_revenue: 28000000, phone: '(512) 555-8000', city: 'Dallas', state: 'TX', owner: 'James Reed', contacts_count: 6, deals_count: 4, created_at: '2025-09-22' },
];

export const deals: Deal[] = [
  { id: 'd1', name: 'TechCorp Solar Installation', amount: 45000, stage: 'Contract Sent', stage_id: 's5', pipeline: 'Sales Pipeline', contact: 'Sarah Johnson', company: 'TechCorp Solutions', owner: 'Afan Saleem', close_date: '2026-04-30', priority: 'high', deal_type: 'new_business', created_at: '2026-02-15', last_activity: '2026-04-12' },
  { id: 'd2', name: 'BuildRight Roofing Project', amount: 32000, stage: 'Presentation Scheduled', stage_id: 's3', pipeline: 'Sales Pipeline', contact: 'Marcus Williams', company: 'BuildRight Construction', owner: 'James Reed', close_date: '2026-05-15', priority: 'medium', deal_type: 'new_business', created_at: '2026-03-01', last_activity: '2026-04-11' },
  { id: 'd3', name: 'SafeGuard Smart Home Upgrade', amount: 28000, stage: 'Decision Maker Bought-In', stage_id: 's4', pipeline: 'Sales Pipeline', contact: 'David Patel', company: 'SafeGuard Properties', owner: 'James Reed', close_date: '2026-04-25', priority: 'high', deal_type: 'existing_business', created_at: '2026-03-10', last_activity: '2026-04-13' },
  { id: 'd4', name: 'Sun Valley Estate Solar Array', amount: 125000, stage: 'Qualified to Buy', stage_id: 's2', pipeline: 'Sales Pipeline', contact: 'Robert Martinez', company: 'Sun Valley Estates', owner: 'Afan Saleem', close_date: '2026-06-30', priority: 'urgent', deal_type: 'new_business', created_at: '2026-03-15', last_activity: '2026-04-09' },
  { id: 'd5', name: 'Horizon Commercial Roofing', amount: 210000, stage: 'Appointment Scheduled', stage_id: 's1', pipeline: 'Sales Pipeline', contact: 'Lisa Rodriguez', company: 'Horizon Development', owner: 'Mike Torres', close_date: '2026-07-31', priority: 'high', deal_type: 'new_business', created_at: '2026-04-01', last_activity: '2026-04-12' },
  { id: 'd6', name: 'GreenBuild Solar Assessment', amount: 18000, stage: 'Appointment Scheduled', stage_id: 's1', pipeline: 'Sales Pipeline', contact: 'Jennifer Thompson', company: 'GreenBuild LLC', owner: 'Sarah Kim', close_date: '2026-05-30', priority: 'medium', deal_type: 'new_business', created_at: '2026-04-05', last_activity: '2026-04-08' },
  { id: 'd7', name: 'Premium Properties Solar Bundle', amount: 89000, stage: 'Closed Won', stage_id: 's6', pipeline: 'Sales Pipeline', contact: 'Chris Anderson', company: 'Premium Properties', owner: 'James Reed', close_date: '2026-03-28', priority: 'high', deal_type: 'existing_business', created_at: '2026-01-10', last_activity: '2026-03-28' },
  { id: 'd8', name: 'Premium Properties Roofing Phase 2', amount: 156000, stage: 'Contract Sent', stage_id: 's5', pipeline: 'Sales Pipeline', contact: 'Chris Anderson', company: 'Premium Properties', owner: 'James Reed', close_date: '2026-05-15', priority: 'high', deal_type: 'existing_business', created_at: '2026-03-29', last_activity: '2026-04-14' },
  { id: 'd9', name: 'NovaHome Smart Home Install', amount: 12000, stage: 'Appointment Scheduled', stage_id: 's1', pipeline: 'Sales Pipeline', contact: 'Emily Chen', company: 'NovaHome', owner: 'Mike Torres', close_date: '2026-05-20', priority: 'low', deal_type: 'new_business', created_at: '2026-04-10', last_activity: '2026-04-10' },
  { id: 'd10', name: 'SafeGuard Monitoring Renewal', amount: 8500, stage: 'Closed Won', stage_id: 's6', pipeline: 'Sales Pipeline', contact: 'David Patel', company: 'SafeGuard Properties', owner: 'James Reed', close_date: '2026-04-01', priority: 'medium', deal_type: 'renewal', created_at: '2026-03-01', last_activity: '2026-04-01' },
];

export const tasks: Task[] = [
  { id: 't1', title: 'Follow up with Sarah Johnson on solar contract', description: 'Review contract terms and get final signature', task_type: 'call', status: 'not_started', priority: 'high', due_date: '2026-04-15', owner: 'Afan Saleem', contact: 'Sarah Johnson', deal: 'TechCorp Solar Installation', created_at: '2026-04-12' },
  { id: 't2', title: 'Send roofing assessment report to Marcus', description: 'Prepare and send the detailed assessment', task_type: 'email', status: 'in_progress', priority: 'medium', due_date: '2026-04-16', owner: 'James Reed', contact: 'Marcus Williams', deal: 'BuildRight Roofing Project', created_at: '2026-04-11' },
  { id: 't3', title: 'Schedule demo for Emily Chen', description: 'Set up smart home demo at the NovaHome office', task_type: 'meeting', status: 'not_started', priority: 'medium', due_date: '2026-04-17', owner: 'Mike Torres', contact: 'Emily Chen', deal: 'NovaHome Smart Home Install', created_at: '2026-04-10' },
  { id: 't4', title: 'Prepare Sun Valley proposal deck', description: 'Create customized solar array proposal for 125kW system', task_type: 'todo', status: 'not_started', priority: 'urgent', due_date: '2026-04-14', owner: 'Afan Saleem', deal: 'Sun Valley Estate Solar Array', created_at: '2026-04-09' },
  { id: 't5', title: 'Review Premium Properties Phase 2 contract', description: 'Legal review before sending to client', task_type: 'todo', status: 'completed', priority: 'high', due_date: '2026-04-13', owner: 'James Reed', deal: 'Premium Properties Roofing Phase 2', completed_at: '2026-04-13', created_at: '2026-04-10' },
  { id: 't6', title: 'Call Jennifer Thompson - GreenBuild follow up', description: 'She was interested in solar assessment, follow up on timing', task_type: 'call', status: 'not_started', priority: 'low', due_date: '2026-04-18', owner: 'Sarah Kim', contact: 'Jennifer Thompson', created_at: '2026-04-08' },
  { id: 't7', title: 'Update SafeGuard smart home proposal', description: 'Add the additional security cameras David requested', task_type: 'todo', status: 'in_progress', priority: 'high', due_date: '2026-04-15', owner: 'James Reed', contact: 'David Patel', deal: 'SafeGuard Smart Home Upgrade', created_at: '2026-04-13' },
  { id: 't8', title: 'Quarterly pipeline review meeting', description: 'Prepare slides and review all open deals', task_type: 'meeting', status: 'not_started', priority: 'medium', due_date: '2026-04-20', owner: 'Afan Saleem', created_at: '2026-04-14' },
];

export const tickets: Ticket[] = [
  { id: 'tk1', subject: 'Solar panel not generating expected output', description: 'Customer reports 30% less output than projected', priority: 'high', status: 'Waiting on Us', category: 'Technical', contact: 'Chris Anderson', owner: 'Mike Torres', source: 'email', created_at: '2026-04-12', sla_due: '2026-04-15' },
  { id: 'tk2', subject: 'Smart home app connectivity issues', description: 'App losing connection to hub intermittently', priority: 'medium', status: 'New', category: 'Technical', contact: 'David Patel', owner: 'Sarah Kim', source: 'phone', created_at: '2026-04-13', sla_due: '2026-04-16' },
  { id: 'tk3', subject: 'Billing inquiry - monitoring fee', description: 'Question about monitoring fee increase', priority: 'low', status: 'Waiting on Contact', category: 'Billing', contact: 'Sarah Johnson', owner: 'James Reed', source: 'email', created_at: '2026-04-10', sla_due: '2026-04-17', first_response: '2026-04-10' },
  { id: 'tk4', subject: 'Roof leak after installation', description: 'Customer reports water damage in attic near install point', priority: 'urgent', status: 'Waiting on Us', category: 'Warranty', contact: 'Marcus Williams', owner: 'Mike Torres', source: 'phone', created_at: '2026-04-14', sla_due: '2026-04-14' },
  { id: 'tk5', subject: 'Request for system expansion quote', description: 'Want to add 5 more panels to existing array', priority: 'low', status: 'Closed', category: 'Sales', contact: 'Chris Anderson', owner: 'Afan Saleem', source: 'form', created_at: '2026-04-08', sla_due: '2026-04-11', first_response: '2026-04-08' },
];

export const activities: Activity[] = [
  { id: 'a1', type: 'call', subject: 'Discovery call with Sarah Johnson', body: 'Discussed solar installation timeline and financing options. She is very interested in the 10kW system.', contact: 'Sarah Johnson', deal: 'TechCorp Solar Installation', performed_by: 'Afan Saleem', created_at: '2026-04-12T14:30:00' },
  { id: 'a2', type: 'email', subject: 'Sent proposal to Marcus Williams', body: 'Emailed the roofing assessment and cost breakdown. Waiting for his review.', contact: 'Marcus Williams', deal: 'BuildRight Roofing Project', performed_by: 'James Reed', created_at: '2026-04-11T10:15:00' },
  { id: 'a3', type: 'meeting', subject: 'On-site assessment - SafeGuard Properties', body: 'Walked through all 12 units. Identified camera placement and panel locations.', contact: 'David Patel', deal: 'SafeGuard Smart Home Upgrade', performed_by: 'James Reed', created_at: '2026-04-13T09:00:00' },
  { id: 'a4', type: 'note', subject: 'Sun Valley pricing discussion', body: 'Robert mentioned competitors quoting 15% lower. Need to adjust our proposal to remain competitive.', contact: 'Robert Martinez', deal: 'Sun Valley Estate Solar Array', performed_by: 'Afan Saleem', created_at: '2026-04-09T16:45:00' },
  { id: 'a5', type: 'deal_stage_change', subject: 'Deal moved to Contract Sent', body: 'Premium Properties Roofing Phase 2 advanced from Decision Maker Bought-In to Contract Sent', deal: 'Premium Properties Roofing Phase 2', performed_by: 'James Reed', created_at: '2026-04-14T11:20:00' },
  { id: 'a6', type: 'email', subject: 'Welcome email to Emily Chen', body: 'Sent introductory email about our smart home solutions and scheduled initial consultation.', contact: 'Emily Chen', performed_by: 'Mike Torres', created_at: '2026-04-10T13:00:00' },
  { id: 'a7', type: 'call', subject: 'Quick check-in with Chris Anderson', body: 'Chris confirmed he wants to proceed with Phase 2 roofing. Very happy with solar install quality.', contact: 'Chris Anderson', deal: 'Premium Properties Roofing Phase 2', performed_by: 'James Reed', created_at: '2026-04-14T08:30:00' },
  { id: 'a8', type: 'task_completed', subject: 'Contract review completed', body: 'Legal review of Premium Properties Phase 2 contract is done. Ready to send.', deal: 'Premium Properties Roofing Phase 2', performed_by: 'James Reed', created_at: '2026-04-13T17:00:00' },
];

export const dashboardMetrics = {
  total_revenue: 542500,
  revenue_change: 12.4,
  deals_in_pipeline: 26,
  pipeline_value: 757000,
  pipeline_change: 8.2,
  contacts_created: 47,
  contacts_change: 15.3,
  tasks_overdue: 3,
  tasks_due_today: 5,
  conversion_rate: 34.2,
  conversion_change: 2.1,
  avg_deal_size: 52800,
  avg_deal_change: -3.5,
  monthly_revenue: [
    { month: 'Sep', revenue: 32000 },
    { month: 'Oct', revenue: 45000 },
    { month: 'Nov', revenue: 38000 },
    { month: 'Dec', revenue: 52000 },
    { month: 'Jan', revenue: 67000 },
    { month: 'Feb', revenue: 58000 },
    { month: 'Mar', revenue: 89000 },
    { month: 'Apr', revenue: 97500 },
  ],
  deals_by_stage: [
    { stage: 'Scheduled', count: 8, value: 124000 },
    { stage: 'Qualified', count: 6, value: 89000 },
    { stage: 'Presentation', count: 5, value: 156000 },
    { stage: 'Bought-In', count: 3, value: 210000 },
    { stage: 'Contract', count: 4, value: 178000 },
  ],
  lead_sources: [
    { source: 'Website', count: 34 },
    { source: 'Referral', count: 22 },
    { source: 'Door-to-Door', count: 18 },
    { source: 'Social Media', count: 12 },
    { source: 'Events', count: 8 },
  ],
  team_performance: [
    { rep: 'Afan Saleem', deals_closed: 8, revenue: 189000, quota_pct: 94 },
    { rep: 'James Reed', deals_closed: 12, revenue: 245000, quota_pct: 112 },
    { rep: 'Mike Torres', deals_closed: 5, revenue: 78000, quota_pct: 65 },
    { rep: 'Sarah Kim', deals_closed: 3, revenue: 42000, quota_pct: 52 },
  ],
};
