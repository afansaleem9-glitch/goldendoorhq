interface Result<T> { success: boolean; data?: T; error?: string; }

interface SiteData {
  site_id: number;
  site_name: string;
  account_id: number;
  status: string;
  peak_power: number;
  currency: string;
  install_date: string;
  notes: string;
}

interface OverviewData {
  measurement_time: number;
  system_power: {
    current_power: number;
  };
  energy: {
    this_day: number;
    this_month: number;
    this_year: number;
    lifetime: number;
  };
  last_update_time: number;
}

interface InverterData {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  serial_number: string;
  connected_optimizers: number;
}

interface MeterData {
  type: string;
  serial_number: string;
  connected_to: string;
  power: number;
  current: number;
  voltage: number;
  energy_exported: number;
  energy_imported: number;
}

interface EnvironmentalBenefit {
  trees_planted: number;
  tons_of_co2_prevented: number;
  lightbulbs_equivalent: number;
}

export class SolarEdgeAPI {
  private apiKey: string;
  private baseUrl = "https://monitoringapi.solaredge.com";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getSiteData(siteId: string): Promise<Result<SiteData>> {
    try {
      const params = new URLSearchParams({
        api_key: this.apiKey,
      });

      const response = await fetch(
        `${this.baseUrl}/site/${siteId}/details.json?${params}`
      );

      if (!response.ok) {
        return {
          success: false,
          error: `SolarEdge API error: ${response.statusText}`,
        };
      }

      const data = (await response.json()) as { site: SiteData };
      return { success: true, data: data.site };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch site data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  async getOverview(siteId: string): Promise<Result<OverviewData>> {
    try {
      const params = new URLSearchParams({
        api_key: this.apiKey,
      });

      const response = await fetch(
        `${this.baseUrl}/site/${siteId}/overview.json?${params}`
      );

      if (!response.ok) {
        return {
          success: false,
          error: `SolarEdge API error: ${response.statusText}`,
        };
      }

      const data = (await response.json()) as { overview: OverviewData };
      return { success: true, data: data.overview };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch overview: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  async getInverters(siteId: string): Promise<Result<InverterData[]>> {
    try {
      const params = new URLSearchParams({
        api_key: this.apiKey,
      });

      const response = await fetch(
        `${this.baseUrl}/site/${siteId}/inverters.json?${params}`
      );

      if (!response.ok) {
        return {
          success: false,
          error: `SolarEdge API error: ${response.statusText}`,
        };
      }

      const data = (await response.json()) as { inverters: InverterData[] };
      return { success: true, data: data.inverters || [] };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch inverters: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  async getMeters(siteId: string): Promise<Result<MeterData[]>> {
    try {
      const params = new URLSearchParams({
        api_key: this.apiKey,
      });

      const response = await fetch(
        `${this.baseUrl}/site/${siteId}/meters.json?${params}`
      );

      if (!response.ok) {
        return {
          success: false,
          error: `SolarEdge API error: ${response.statusText}`,
        };
      }

      const data = (await response.json()) as { meters: MeterData[] };
      return { success: true, data: data.meters || [] };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch meters: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  async getEnvironmentalBenefit(
    siteId: string,
    startDate?: string,
    endDate?: string
  ): Promise<Result<EnvironmentalBenefit>> {
    try {
      const params = new URLSearchParams({
        api_key: this.apiKey,
      });
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await fetch(
        `${this.baseUrl}/site/${siteId}/envBenefits.json?${params}`
      );

      if (!response.ok) {
        return {
          success: false,
          error: `SolarEdge API error: ${response.statusText}`,
        };
      }

      const data = (await response.json()) as {
        envBenefits: EnvironmentalBenefit;
      };
      return { success: true, data: data.envBenefits };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch environmental benefit: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  async getEnergyDetails(
    siteId: string,
    startDate: string,
    endDate: string,
    timeUnit: "QUARTER_OF_AN_HOUR" | "HOUR" | "DAY" | "WEEK" | "MONTH" | "YEAR"
  ): Promise<Result<{ energy_details: Array<{ date: string; value: number }> }>> {
    try {
      const params = new URLSearchParams({
        api_key: this.apiKey,
        startDate,
        endDate,
        timeUnit,
      });

      const response = await fetch(
        `${this.baseUrl}/site/${siteId}/energyDetails.json?${params}`
      );

      if (!response.ok) {
        return {
          success: false,
          error: `SolarEdge API error: ${response.statusText}`,
        };
      }

      const data = (await response.json()) as {
        energyDetails: { timeUnit: string; unit: string; values: Array<{ date: string; value: number | null }> };
      };

      return {
        success: true,
        data: {
          energy_details: data.energyDetails.values
            .filter((v) => v.value !== null)
            .map((v) => ({ date: v.date, value: v.value || 0 })),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch energy details: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }
}
