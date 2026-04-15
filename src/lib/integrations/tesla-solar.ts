/*
 * TESLA SOLAREDGE / SOLARDESIGNER INTEGRATION
 * Connects to Tesla's SolarDesigner via Aurora Solar's app integration.
 *
 * Tesla SolarDesigner Access Scopes:
 *   read_users, read_tenants, read_projects, read_designs,
 *   write_designs, read_design_assets, write_design_assets, read_components
 *
 * This integration allows:
 * - Building racking systems in Tesla SolarDesigner
 * - Auto-retrieving Bill of Materials (BOM) from Tesla
 * - Syncing Tesla Powerwall / battery configs
 * - Pulling Tesla-specific design assets back into Aurora & GoldenDoor CRM
 *
 * Auth: Uses Aurora Solar API Client App OAuth flow.
 * Ref: https://help.aurorasolar.com/hc/en-us/articles/30585800908563-Aurora-API-Client-App
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TeslaBatteryConfig {
  id: string;
  model: 'powerwall_3' | 'powerwall_2' | 'powerwall_plus';
  quantity: number;
  total_capacity_kwh: number;
  backup_percentage: number;
  gateway_model: string;
}

export interface TeslaRackingSystem {
  id: string;
  design_id: string;
  racking_type: 'rail' | 'rail_less' | 'ground_mount' | 'flat_roof';
  manufacturer: string;
  model: string;
  attachment_type: string;
  components: {
    name: string;
    part_number: string;
    quantity: number;
    unit_cost: number;
  }[];
  total_cost: number;
}

export interface TeslaDesignSync {
  aurora_project_id: string;
  aurora_design_id: string;
  tesla_design_id: string;
  racking_system: TeslaRackingSystem;
  battery_config?: TeslaBatteryConfig;
  bom_items: {
    category: string;
    name: string;
    part_number: string;
    quantity: number;
    unit_cost: number;
    total_cost: number;
    source: 'tesla' | 'aurora';
  }[];
  synced_at: string;
}

interface Result<T> { success: boolean; data?: T; error?: string; }

// ---------------------------------------------------------------------------
// Tesla Solar Client (via Aurora API Client App)
// ---------------------------------------------------------------------------

export class TeslaSolarAPI {
  private auroraToken: string;
  private tenantId: string;
  private baseUrl = process.env.AURORA_SOLAR_API_URL || 'https://api.aurorasolar.com';

  constructor(auroraToken?: string, tenantId?: string) {
    this.auroraToken = auroraToken || process.env.AURORA_SOLAR_API_KEY || '';
    this.tenantId = tenantId || process.env.AURORA_SOLAR_TENANT_ID || '';
  }

  private headers(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.auroraToken}`,
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
        return { success: false, error: `Tesla/Aurora API ${res.status}: ${errBody}` };
      }
      if (res.status === 204) return { success: true } as Result<T>;
      const json = await res.json();
      return { success: true, data: (json.data ?? json) as T };
    } catch (err) {
      return { success: false, error: `Tesla API error: ${err instanceof Error ? err.message : String(err)}` };
    }
  }

  // -----------------------------------------------------------------------
  // Tesla Racking / BOM via Aurora Design
  // -----------------------------------------------------------------------

  /**
   * Trigger Tesla SolarDesigner BOM generation for an Aurora design.
   * This calls Aurora's integration endpoint that communicates with Tesla.
   */
  async generateTeslaBOM(projectId: string, designId: string) {
    return this.request<TeslaRackingSystem>(
      'POST',
      `/tenants/${this.tenantId}/projects/${projectId}/designs/${designId}/integrations/tesla/bom`
    );
  }

  /**
   * Get the Tesla racking system for a design (after BOM generation).
   */
  async getTeslaRacking(projectId: string, designId: string) {
    return this.request<TeslaRackingSystem>(
      'GET',
      `/tenants/${this.tenantId}/projects/${projectId}/designs/${designId}/integrations/tesla/racking`
    );
  }

  /**
   * Configure Tesla Powerwall for a project design.
   */
  async configureBattery(projectId: string, designId: string, config: {
    model: TeslaBatteryConfig['model'];
    quantity: number;
    backup_percentage?: number;
  }) {
    return this.request<TeslaBatteryConfig>(
      'POST',
      `/tenants/${this.tenantId}/projects/${projectId}/designs/${designId}/battery`,
      config
    );
  }

  async getBatteryConfig(projectId: string, designId: string) {
    return this.request<TeslaBatteryConfig>(
      'GET',
      `/tenants/${this.tenantId}/projects/${projectId}/designs/${designId}/battery`
    );
  }

  // -----------------------------------------------------------------------
  // Components (Tesla-specific panels, inverters, batteries)
  // -----------------------------------------------------------------------

  async listTeslaModules() {
    return this.request<{ id: string; manufacturer: string; model: string; wattage: number }[]>(
      'GET', `/tenants/${this.tenantId}/components/modules?manufacturer=Tesla`
    );
  }

  async listTeslaInverters() {
    return this.request<{ id: string; manufacturer: string; model: string; power_rating: number }[]>(
      'GET', `/tenants/${this.tenantId}/components/inverters?manufacturer=Tesla`
    );
  }

  async listTeslaBatteries() {
    return this.request<{ id: string; model: string; capacity_kwh: number; power_kw: number }[]>(
      'GET', `/tenants/${this.tenantId}/components/batteries?manufacturer=Tesla`
    );
  }

  // -----------------------------------------------------------------------
  // Design Assets (Tesla renders, shade reports)
  // -----------------------------------------------------------------------

  async getTeslaDesignAssets(projectId: string, designId: string) {
    return this.request<{ id: string; type: string; url: string; name: string }[]>(
      'GET',
      `/tenants/${this.tenantId}/projects/${projectId}/designs/${designId}/assets?source=tesla`
    );
  }

  // -----------------------------------------------------------------------
  // Full Sync: Tesla → GoldenDoor CRM
  // -----------------------------------------------------------------------

  async syncDesignToGoldenDoor(projectId: string, designId: string): Promise<Result<TeslaDesignSync>> {
    try {
      const [rackingRes, batteryRes, bomRes] = await Promise.all([
        this.getTeslaRacking(projectId, designId),
        this.getBatteryConfig(projectId, designId),
        this.generateTeslaBOM(projectId, designId),
      ]);

      const racking = rackingRes.data;
      const battery = batteryRes.data;

      // Combine Tesla BOM items
      const bomItems = racking?.components?.map(c => ({
        category: 'racking',
        name: c.name,
        part_number: c.part_number,
        quantity: c.quantity,
        unit_cost: c.unit_cost,
        total_cost: c.quantity * c.unit_cost,
        source: 'tesla' as const,
      })) || [];

      return {
        success: true,
        data: {
          aurora_project_id: projectId,
          aurora_design_id: designId,
          tesla_design_id: racking?.id || designId,
          racking_system: racking!,
          battery_config: battery || undefined,
          bom_items: bomItems,
          synced_at: new Date().toISOString(),
        },
      };
    } catch (err) {
      return { success: false, error: `Tesla sync error: ${err instanceof Error ? err.message : String(err)}` };
    }
  }
}

// Singleton
let _teslaClient: TeslaSolarAPI | null = null;
export function getTeslaSolarClient(): TeslaSolarAPI {
  if (!_teslaClient) _teslaClient = new TeslaSolarAPI();
  return _teslaClient;
}
