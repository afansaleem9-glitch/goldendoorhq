interface Result<T> { success: boolean; data?: T; error?: string; }

interface PVWattsInput {
  system_capacity: number;
  module_type: number; // 0=Standard, 1=Premium, 2=Thin Film
  losses: number;
  array_type: number; // 0=Fixed, 1=1-Axis, 2=2-Axis
  tilt: number;
  azimuth: number;
  gcr: number;
  inv_eff: number;
}

interface PVWattsOutput {
  ac_monthly: number[];
  poa_monthly: number[];
  solrad_monthly: number[];
  dc_monthly: number[];
  ac_annual: number;
  solrad_annual: number;
  capacity_factor: number;
}

interface UtilityRateData {
  utility_id: string;
  utility_name: string;
  residential_rate: number;
  commercial_rate: number;
  rates_year: number;
}

export class NRELApi {
  private apiKey: string;
  private baseUrl = "https://pvwatts.nrel.gov/api/pvwatts/v8";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async calculatePVWatts(
    latitude: number,
    longitude: number,
    systemCapacityKw: number,
    inputs: Partial<PVWattsInput> = {}
  ): Promise<Result<PVWattsOutput>> {
    try {
      const defaultInputs: PVWattsInput = {
        system_capacity: systemCapacityKw,
        module_type: 0,
        losses: 14.08,
        array_type: 0,
        tilt: Math.max(0, Math.min(90, latitude)),
        azimuth: 180,
        gcr: 0.4,
        inv_eff: 96,
        ...inputs,
      };

      const params = new URLSearchParams({
        api_key: this.apiKey,
        lat: String(latitude),
        lon: String(longitude),
        system_capacity: String(defaultInputs.system_capacity),
        module_type: String(defaultInputs.module_type),
        losses: String(defaultInputs.losses),
        array_type: String(defaultInputs.array_type),
        tilt: String(defaultInputs.tilt),
        azimuth: String(defaultInputs.azimuth),
        gcr: String(defaultInputs.gcr),
        inv_eff: String(defaultInputs.inv_eff),
      });

      const response = await fetch(
        `${this.baseUrl}.json?${params}`
      );

      if (!response.ok) {
        return {
          success: false,
          error: `NREL PVWatts API error: ${response.statusText}`,
        };
      }

      const data = (await response.json()) as { outputs: PVWattsOutput };
      return { success: true, data: data.outputs };
    } catch (error) {
      return {
        success: false,
        error: `Failed to calculate PVWatts: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  async getUtilityRates(
    zipcode: string
  ): Promise<Result<UtilityRateData>> {
    try {
      const params = new URLSearchParams({
        api_key: this.apiKey,
        zipcode,
      });

      const response = await fetch(
        `https://developer.nrel.gov/api/utility_rates/v3.json?${params}`
      );

      if (!response.ok) {
        return {
          success: false,
          error: `NREL Utility Rates API error: ${response.statusText}`,
        };
      }

      const data = (await response.json()) as {
        result: UtilityRateData;
      };

      if (!data.result) {
        return {
          success: false,
          error: "No utility rate data found for zipcode",
        };
      }

      return { success: true, data: data.result };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch utility rates: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  calculateEnergyYield(
    pvWattsOutput: PVWattsOutput,
    systemDegradationRate: number = 0.005
  ): Result<{
    year1Production: number;
    year25Production: number;
    averageAnnualDegradation: number;
  }> {
    try {
      const year1Production = pvWattsOutput.ac_annual;
      const degradationFactor = Math.pow(1 - systemDegradationRate, 25);
      const year25Production = year1Production * degradationFactor;
      const averageAnnualDegradation = systemDegradationRate * 100;

      return {
        success: true,
        data: {
          year1Production,
          year25Production,
          averageAnnualDegradation,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to calculate energy yield: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }
}
