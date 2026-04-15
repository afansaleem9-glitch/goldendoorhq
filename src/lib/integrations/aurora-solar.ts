/*
 * AURORA SOLAR v2 API INTEGRATION
 * Full integration with Aurora Solar's design & proposal platform.
 *
 * Tenant: Delta Power Group, Inc.
 * Tenant ID: a52e5541-fa73-4948-b48d-e8c591cd18a1
 *
 * Access Scopes (via Tesla SolarDesigner app):
 *   read_users, read_tenants, read_projects, read_designs,
 *   write_designs, read_design_assets, write_design_assets, read_components
 *
 * API Docs: https://api-docs.aurorasolar.com
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AuroraProject {
  id: string;
  name: string;
  external_provider_id?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  status: 'active' | 'archived' | 'deleted';
  customer?: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  created_at: string;
  updated_at: string;
}

export interface AuroraDesign {
  id: string;
  project_id: string;
  name: string;
  system_size_stc: number;        // kW STC
  system_size_ptc: number;        // kW PTC
  annual_production: number;       // kWh/year
  module_count: number;
  module?: {
    id: string;
    manufacturer: string;
    model: string;
    wattage: number;
  };
  inverter?: {
    id: string;
    manufacturer: string;
    model: string;
  };
  roof_planes: {
    id: string;
    tilt: number;
    azimuth: number;
    area_sq_ft: number;
    module_count: number;
  }[];
  offset_percentage: number;       // % of annual usage offset
  created_at: string;
  updated_at: string;
}

export interface AuroraProposal {
  id: string;
  project_id: string;
  design_id: string;
  name: string;
  status: 'draft' | 'published' | 'signed' | 'declined' | 'expired';
  pricing: {
    system_cost: number;
    incentives: number;
    net_cost: number;
    monthly_payment?: number;
    loan_term_months?: number;
    loan_apr?: number;
    ppw: number;               // price per watt
  };
  savings: {
    year_1: number;
    lifetime_25yr: number;
    monthly_avg: number;
  };
  url?: string;                  // shareable proposal URL
  signed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AuroraConsumptionProfile {
  id: string;
  project_id: string;
  annual_kwh: number;
  monthly_kwh: number[];         // 12-element array
  utility_rate_id?: string;
  utility_name?: string;
  avg_monthly_bill: number;
}

export interface AuroraBOM {
  id: string;
  design_id: string;
  items: {
    category: string;
    name: string;
    manufacturer: string;
    model: string;
    quantity: number;
    unit_cost: number;
    total_cost: number;
  }[];
  total_cost: number;
}

export interface AuroraWebhookEvent {
  id: string;
  event: string;
  tenant_id: string;
  project_id?: string;
  design_id?: string;
  proposal_id?: string;
  data: Record<string, unknown>;
  created_at: string;
}

interface Result<T> { success: boolean; data?: T; error?: string; }

type PaginatedResult<T> = Result<T[]> & { total?: number; next_cursor?: string; };

// ---------------------------------------------------------------------------
// Aurora Solar v2 Client
// ---------------------------------------------------------------------------

export class AuroraSolarAPI {
  private bearerToken: string;
  private tenantId: string;
  private baseUrl = process.env.AURORA_SOLAR_API_URL || 'https://api.aurorasolar.com';

  constructor(bearerToken?: string, tenantId?: string) {
    this.bearerToken = bearerToken || process.env.AURORA_SOLAR_API_KEY || '';
    this.tenantId = tenantId || process.env.AURORA_SOLAR_TENANT_ID || '';
  }

  private headers(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.bearerToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<Result<T>> {
    try {
      const url = `${this.baseUrl}${path}`;
      const opts: RequestInit = { method, headers: this.headers() };
      if (body) opts.body = JSON.stringify(body);

      const res = await fetch(url, opts);

      if (!res.ok) {
        const errBody = await res.text();
        return { success: false, error: `Aurora API ${res.status}: ${errBody}` };
      }

      // 204 No Content
      if (res.status === 204) return { success: true } as Result<T>;

      const json = await res.json();
      return { success: true, data: (json.data ?? json) as T };
    } catch (err) {
      return { success: false, error: `Aurora API error: ${err instanceof Error ? err.message : String(err)}` };
    }
  }

  // -----------------------------------------------------------------------
  // Tenant / User
  // -----------------------------------------------------------------------

  async getTenant() {
    return this.request<{ id: string; name: string }>('GET', `/tenants/${this.tenantId}`);
  }

  async listUsers(limit = 50, cursor?: string) {
    const qs = new URLSearchParams({ limit: String(limit) });
    if (cursor) qs.set('starting_after', cursor);
    return this.request<{ id: string; name: string; email: string; role: string }[]>(
      'GET', `/tenants/${this.tenantId}/users?${qs}`
    );
  }

  // -----------------------------------------------------------------------
  // Projects
  // -----------------------------------------------------------------------

  async listProjects(limit = 50, cursor?: string): Promise<PaginatedResult<AuroraProject>> {
    const qs = new URLSearchParams({ limit: String(limit) });
    if (cursor) qs.set('starting_after', cursor);
    return this.request('GET', `/tenants/${this.tenantId}/projects?${qs}`) as Promise<PaginatedResult<AuroraProject>>;
  }

  async getProject(projectId: string) {
    return this.request<AuroraProject>('GET', `/tenants/${this.tenantId}/projects/${projectId}`);
  }

  async createProject(data: {
    name: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip_code: string;
      country?: string;
      latitude?: number;
      longitude?: number;
    };
    customer?: { first_name: string; last_name: string; email?: string; phone?: string };
    external_provider_id?: string;
  }) {
    return this.request<AuroraProject>('POST', `/tenants/${this.tenantId}/projects`, data);
  }

  async updateProject(projectId: string, data: Partial<AuroraProject>) {
    return this.request<AuroraProject>('PATCH', `/tenants/${this.tenantId}/projects/${projectId}`, data);
  }

  async searchProjects(query: string, limit = 20) {
    const qs = new URLSearchParams({ q: query, limit: String(limit) });
    return this.request<AuroraProject[]>('GET', `/tenants/${this.tenantId}/projects/search?${qs}`);
  }

  // -----------------------------------------------------------------------
  // Designs
  // -----------------------------------------------------------------------

  async listDesigns(projectId: string) {
    return this.request<AuroraDesign[]>('GET', `/tenants/${this.tenantId}/projects/${projectId}/designs`);
  }

  async getDesign(projectId: string, designId: string) {
    return this.request<AuroraDesign>('GET', `/tenants/${this.tenantId}/projects/${projectId}/designs/${designId}`);
  }

  async getDesignBOM(projectId: string, designId: string) {
    return this.request<AuroraBOM>('GET', `/tenants/${this.tenantId}/projects/${projectId}/designs/${designId}/bom`);
  }

  // -----------------------------------------------------------------------
  // Proposals
  // -----------------------------------------------------------------------

  async listProposals(projectId: string) {
    return this.request<AuroraProposal[]>('GET', `/tenants/${this.tenantId}/projects/${projectId}/proposals`);
  }

  async getProposal(projectId: string, proposalId: string) {
    return this.request<AuroraProposal>('GET', `/tenants/${this.tenantId}/projects/${projectId}/proposals/${proposalId}`);
  }

  async createProposal(projectId: string, data: {
    design_id: string;
    name: string;
    pricing?: Partial<AuroraProposal['pricing']>;
  }) {
    return this.request<AuroraProposal>('POST', `/tenants/${this.tenantId}/projects/${projectId}/proposals`, data);
  }

  // -----------------------------------------------------------------------
  // Consumption Profile
  // -----------------------------------------------------------------------

  async getConsumptionProfile(projectId: string) {
    return this.request<AuroraConsumptionProfile>(
      'GET', `/tenants/${this.tenantId}/projects/${projectId}/consumption_profile`
    );
  }

  async setConsumptionProfile(projectId: string, data: {
    annual_kwh?: number;
    monthly_kwh?: number[];
    utility_rate_id?: string;
  }) {
    return this.request<AuroraConsumptionProfile>(
      'PUT', `/tenants/${this.tenantId}/projects/${projectId}/consumption_profile`, data
    );
  }

  // -----------------------------------------------------------------------
  // Components (panels, inverters, batteries)
  // -----------------------------------------------------------------------

  async listComponents(type: 'modules' | 'inverters' | 'batteries', limit = 50) {
    const qs = new URLSearchParams({ limit: String(limit) });
    return this.request<{ id: string; manufacturer: string; model: string; wattage?: number }[]>(
      'GET', `/tenants/${this.tenantId}/components/${type}?${qs}`
    );
  }

  // -----------------------------------------------------------------------
  // Design Assets (images, 3D renders, shade reports)
  // -----------------------------------------------------------------------

  async listDesignAssets(projectId: string, designId: string) {
    return this.request<{ id: string; type: string; url: string; name: string }[]>(
      'GET', `/tenants/${this.tenantId}/projects/${projectId}/designs/${designId}/assets`
    );
  }

  async getDesignAsset(projectId: string, designId: string, assetId: string) {
    return this.request<{ id: string; type: string; url: string; name: string; metadata: Record<string, unknown> }>(
      'GET', `/tenants/${this.tenantId}/projects/${projectId}/designs/${designId}/assets/${assetId}`
    );
  }

  // -----------------------------------------------------------------------
  // Webhooks Management
  // -----------------------------------------------------------------------

  async listWebhooks() {
    return this.request<{ id: string; url: string; events: string[]; active: boolean }[]>(
      'GET', `/tenants/${this.tenantId}/webhooks`
    );
  }

  async createWebhook(data: { url: string; events: string[]; secret?: string }) {
    return this.request<{ id: string; url: string; events: string[]; secret: string; active: boolean }>(
      'POST', `/tenants/${this.tenantId}/webhooks`, data
    );
  }

  async deleteWebhook(webhookId: string) {
    return this.request<void>('DELETE', `/tenants/${this.tenantId}/webhooks/${webhookId}`);
  }

  // -----------------------------------------------------------------------
  // Sync Helper: Aurora → GoldenDoor CRM
  // -----------------------------------------------------------------------

  /**
   * Fetches a project + its latest design + proposals from Aurora
   * and returns a normalized object ready to upsert into Supabase.
   */
  async fetchFullProjectBundle(projectId: string) {
    const [projectRes, designsRes, proposalsRes, consumptionRes] = await Promise.all([
      this.getProject(projectId),
      this.listDesigns(projectId),
      this.listProposals(projectId),
      this.getConsumptionProfile(projectId),
    ]);

    if (!projectRes.success || !projectRes.data) {
      return { success: false, error: projectRes.error || 'Project not found' };
    }

    const project = projectRes.data;
    const designs = designsRes.data || [];
    const proposals = proposalsRes.data || [];
    const consumption = consumptionRes.data;

    // Pick the latest design
    const latestDesign = designs.length > 0
      ? designs.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0]
      : null;

    // Pick the latest active proposal
    const activeProposal = proposals.find(p => p.status === 'published' || p.status === 'signed')
      || (proposals.length > 0 ? proposals[0] : null);

    return {
      success: true,
      data: {
        aurora_project_id: project.id,
        name: project.name,
        address: project.address?.street,
        city: project.address?.city,
        state: project.address?.state,
        zip: project.address?.zip_code,
        latitude: project.address?.latitude,
        longitude: project.address?.longitude,
        customer_first_name: project.customer?.first_name,
        customer_last_name: project.customer?.last_name,
        customer_email: project.customer?.email,
        customer_phone: project.customer?.phone,
        // Design data
        system_size_kw: latestDesign?.system_size_stc || null,
        panel_count: latestDesign?.module_count || null,
        panel_type: latestDesign?.module ? `${latestDesign.module.manufacturer} ${latestDesign.module.model}` : null,
        inverter_type: latestDesign?.inverter ? `${latestDesign.inverter.manufacturer} ${latestDesign.inverter.model}` : null,
        annual_production_kwh: latestDesign?.annual_production || null,
        offset_percentage: latestDesign?.offset_percentage || null,
        aurora_design_id: latestDesign?.id || null,
        // Proposal data
        contract_amount: activeProposal?.pricing?.system_cost || null,
        net_cost: activeProposal?.pricing?.net_cost || null,
        price_per_watt: activeProposal?.pricing?.ppw || null,
        monthly_payment: activeProposal?.pricing?.monthly_payment || null,
        year1_savings: activeProposal?.savings?.year_1 || null,
        lifetime_savings: activeProposal?.savings?.lifetime_25yr || null,
        proposal_url: activeProposal?.url || null,
        proposal_status: activeProposal?.status || null,
        aurora_proposal_id: activeProposal?.id || null,
        // Consumption
        annual_usage_kwh: consumption?.annual_kwh || null,
        avg_monthly_bill: consumption?.avg_monthly_bill || null,
        utility_company: consumption?.utility_name || null,
        // Meta
        aurora_status: project.status,
        aurora_synced_at: new Date().toISOString(),
      },
    };
  }
}

// Singleton for server-side usage
let _client: AuroraSolarAPI | null = null;
export function getAuroraSolarClient(): AuroraSolarAPI {
  if (!_client) _client = new AuroraSolarAPI();
  return _client;
}
