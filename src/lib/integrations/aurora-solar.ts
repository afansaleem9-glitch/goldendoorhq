interface Result<T> { success: boolean; data?: T; error?: string; }

interface ProjectData {
  id: string;
  name: string;
  address: string;
  status: "active" | "archived" | "deleted";
  created_at: string;
  updated_at: string;
  latitude: number;
  longitude: number;
  irradiance: number;
  roof_area: number;
}

interface ProposalData {
  id: string;
  project_id: string;
  name: string;
  status: "draft" | "sent" | "signed" | "declined" | "cancelled";
  estimated_production: number;
  system_size_kw: number;
  price: number;
  created_at: string;
  updated_at: string;
}

interface DesignData {
  id: string;
  project_id: string;
  panels_count: number;
  array_area: number;
  estimated_ac_output: number;
  estimated_dc_output: number;
  panel_model: string;
  inverter_model: string;
  tilt: number;
  azimuth: number;
}

interface SiteData {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
  roof_pitch: number;
  imagery_date: string;
  irradiance_annual: number;
}

export class AuroraSolarAPI {
  private apiKey: string;
  private baseUrl = "https://api.aurorasolar.com/api";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getHeaders(): Record<string, string> {
    return {
      "Authorization": `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };
  }

  async createProject(
    address: string,
    latitude: number,
    longitude: number,
    roofArea?: number
  ): Promise<Result<ProjectData>> {
    try {
      const payload = {
        address,
        latitude,
        longitude,
        roof_area: roofArea,
      };

      const response = await fetch(`${this.baseUrl}/v1/projects`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Aurora Solar API error: ${response.statusText}`,
        };
      }

      const data = (await response.json()) as ProjectData;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: `Failed to create project: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  async getProject(projectId: string): Promise<Result<ProjectData>> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/projects/${projectId}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Aurora Solar API error: ${response.statusText}`,
        };
      }

      const data = (await response.json()) as ProjectData;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch project: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  async createProposal(
    projectId: string,
    name: string,
    systemSizeKw: number,
    price: number
  ): Promise<Result<ProposalData>> {
    try {
      const payload = {
        name,
        system_size_kw: systemSizeKw,
        price,
      };

      const response = await fetch(
        `${this.baseUrl}/v1/projects/${projectId}/proposals`,
        {
          method: "POST",
          headers: this.getHeaders(),
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        return {
          success: false,
          error: `Aurora Solar API error: ${response.statusText}`,
        };
      }

      const data = (await response.json()) as ProposalData;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: `Failed to create proposal: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  async getProposal(
    projectId: string,
    proposalId: string
  ): Promise<Result<ProposalData>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/projects/${projectId}/proposals/${proposalId}`,
        { headers: this.getHeaders() }
      );

      if (!response.ok) {
        return {
          success: false,
          error: `Aurora Solar API error: ${response.statusText}`,
        };
      }

      const data = (await response.json()) as ProposalData;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch proposal: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  async listProposals(projectId: string): Promise<Result<ProposalData[]>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/projects/${projectId}/proposals`,
        { headers: this.getHeaders() }
      );

      if (!response.ok) {
        return {
          success: false,
          error: `Aurora Solar API error: ${response.statusText}`,
        };
      }

      const data = (await response.json()) as { data: ProposalData[] };
      return { success: true, data: data.data || [] };
    } catch (error) {
      return {
        success: false,
        error: `Failed to list proposals: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  async getDesign(projectId: string): Promise<Result<DesignData>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/projects/${projectId}/designs`,
        { headers: this.getHeaders() }
      );

      if (!response.ok) {
        return {
          success: false,
          error: `Aurora Solar API error: ${response.statusText}`,
        };
      }

      const data = (await response.json()) as DesignData;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch design: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  async getSiteData(projectId: string): Promise<Result<SiteData>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/projects/${projectId}/site`,
        { headers: this.getHeaders() }
      );

      if (!response.ok) {
        return {
          success: false,
          error: `Aurora Solar API error: ${response.statusText}`,
        };
      }

      const data = (await response.json()) as SiteData;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch site data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }
}
