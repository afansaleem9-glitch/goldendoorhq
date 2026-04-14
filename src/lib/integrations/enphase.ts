interface Result<T> { success: boolean; data?: T; error?: string; }

interface SystemSummary {
  system_id: number;
  modules_count: number;
  status: "normal" | "warning" | "critical";
  last_report_at: string;
  modules: Array<{
    serial_number: string;
    model: string;
    status: "normal" | "warning" | "critical";
  }>;
}

interface SystemStatistics {
  system_id: number;
  lifetime_energy: number;
  current_power: number;
  modules: Array<{
    serial_number: string;
    last_report_date: string;
    ac_energy: number;
    ac_power: number;
  }>;
}

interface EnvoyData {
  envoy_serial: string;
  software_build_epoch: number;
  db_size: number;
  db_percent_full: number;
  timezone: string;
  current_date: string;
  current_time: string;
}

interface AlertData {
  alert_id: string;
  system_id: number;
  timestamp: string;
  alert_type: string;
  description: string;
  severity: "info" | "warning" | "error";
}

export class EnphaseAPI {
  private apiKey: string;
  private userId: string;
  private baseUrl = "https://api.enphaseenergy.com/api/v4";

  constructor(apiKey: string, userId: string) {
    this.apiKey = apiKey;
    this.userId = userId;
  }

  private getHeaders(): Record<string, string> {
    return {
      "Authorization": `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };
  }

  async getSystemSummary(
    systemId: string
  ): Promise<Result<SystemSummary>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/systems/${systemId}/summary`,
        { headers: this.getHeaders() }
      );

      if (!response.ok) {
        return {
          success: false,
          error: `Enphase API error: ${response.statusText}`,
        };
      }

      const data = (await response.json()) as SystemSummary;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch system summary: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  async getSystemStatistics(
    systemId: string,
    startDate?: string,
    endDate?: string
  ): Promise<Result<SystemStatistics>> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);

      const url = `${this.baseUrl}/systems/${systemId}/stats${
        params.toString() ? `?${params}` : ""
      }`;

      const response = await fetch(url, { headers: this.getHeaders() });

      if (!response.ok) {
        return {
          success: false,
          error: `Enphase API error: ${response.statusText}`,
        };
      }

      const data = (await response.json()) as SystemStatistics;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch system statistics: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  async getEnvoyData(envoySerial: string): Promise<Result<EnvoyData>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/info/envoy_json?serial_num=${envoySerial}`,
        { headers: this.getHeaders() }
      );

      if (!response.ok) {
        return {
          success: false,
          error: `Enphase API error: ${response.statusText}`,
        };
      }

      const data = (await response.json()) as EnvoyData;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch Envoy data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  async getAlerts(
    systemId: string,
    limit: number = 100
  ): Promise<Result<AlertData[]>> {
    try {
      const params = new URLSearchParams({
        limit: String(limit),
      });

      const response = await fetch(
        `${this.baseUrl}/systems/${systemId}/alerts?${params}`,
        { headers: this.getHeaders() }
      );

      if (!response.ok) {
        return {
          success: false,
          error: `Enphase API error: ${response.statusText}`,
        };
      }

      const data = (await response.json()) as { alerts: AlertData[] };
      return { success: true, data: data.alerts || [] };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch alerts: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  async getUserSystems(): Promise<Result<Array<{ system_id: number; system_name: string }>>> {
    try {
      const response = await fetch(`${this.baseUrl}/systems`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Enphase API error: ${response.statusText}`,
        };
      }

      const data = (await response.json()) as {
        systems: Array<{ system_id: number; system_name: string }>;
      };
      return { success: true, data: data.systems || [] };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch user systems: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }
}
