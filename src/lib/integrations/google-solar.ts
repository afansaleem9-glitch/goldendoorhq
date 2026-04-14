interface Result<T> { success: boolean; data?: T; error?: string; }

interface SolarPanelConfig {
  azimuthDegrees: number;
  pitchDegrees: number;
}

interface BuildingInsight {
  imageryDate: string;
  postalCode: string;
  administrativeArea: string;
  statisticalArea: string;
  regionCode: string;
}

interface SolarEstimate {
  monthlyKwhEstimates: number[];
  rooftopArea: number;
  maxArrayLengthMeters: number;
  maxArrayWidthMeters: number;
  panelCapacityWatts: number;
  yearlyEnergyDcKwh: number;
  yearlyEnergyAcKwh: number;
}

interface DataLayer {
  mask: string;
  monthlyFlux: number[];
  yearlyFlux: number;
}

interface GeocodeResult {
  latitude: number;
  longitude: number;
  accuracy: "ROOFTOP" | "APPROXIMATE";
}

interface StreetViewConfig {
  size: string;
  pitch: number;
  heading: number;
  fov: number;
}

export class GoogleSolarAPI {
  private apiKey: string;
  private baseUrl = "https://solar.googleapis.com/v1";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getBuildingInsights(
    latitude: number,
    longitude: number
  ): Promise<Result<BuildingInsight>> {
    try {
      const url = `${this.baseUrl}/buildingInsights:findClosest`;
      const params = new URLSearchParams({
        location: JSON.stringify({ latitude, longitude }),
        requiredQuality: "HIGH",
      });

      const response = await fetch(`${url}?${params}&key=${this.apiKey}`);
      if (!response.ok) {
        return {
          success: false,
          error: `Google Solar API error: ${response.statusText}`,
        };
      }

      const data = (await response.json()) as BuildingInsight;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch building insights: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  async getSolarEstimate(
    buildingId: string,
    panelConfig?: SolarPanelConfig
  ): Promise<Result<SolarEstimate>> {
    try {
      const url = `${this.baseUrl}/buildingInsights/${buildingId}/solarEstimate`;
      const params: Record<string, string> = {};

      if (panelConfig) {
        params.panelCapacityWatts = String(panelConfig.pitchDegrees);
        params.azimuthDegrees = String(panelConfig.azimuthDegrees);
      }

      const queryString = new URLSearchParams({
        ...params,
        key: this.apiKey,
      }).toString();

      const response = await fetch(`${url}?${queryString}`);
      if (!response.ok) {
        return {
          success: false,
          error: `Google Solar API error: ${response.statusText}`,
        };
      }

      const data = (await response.json()) as SolarEstimate;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch solar estimate: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  async getDataLayers(
    latitude: number,
    longitude: number,
    radiusMeters: number = 100
  ): Promise<Result<DataLayer[]>> {
    try {
      const url = `${this.baseUrl}/dataLayers:get`;
      const params = new URLSearchParams({
        location: JSON.stringify({ latitude, longitude }),
        radiusMeters: String(radiusMeters),
        requiredQuality: "HIGH",
      });

      const response = await fetch(`${url}?${params}&key=${this.apiKey}`);
      if (!response.ok) {
        return {
          success: false,
          error: `Google Solar API error: ${response.statusText}`,
        };
      }

      const data = (await response.json()) as { dataLayers: DataLayer[] };
      return { success: true, data: data.dataLayers };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch data layers: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  async geocodeAddress(address: string): Promise<Result<GeocodeResult>> {
    try {
      const url = "https://maps.googleapis.com/maps/api/geocode/json";
      const params = new URLSearchParams({
        address,
        key: this.apiKey,
      });

      const response = await fetch(`${url}?${params}`);
      if (!response.ok) {
        return {
          success: false,
          error: `Google Geocoding API error: ${response.statusText}`,
        };
      }

      const data = (await response.json()) as {
        results: Array<{
          geometry: { location: { lat: number; lng: number } };
          geometry_location_type: string;
        }>;
      };

      if (!data.results || data.results.length === 0) {
        return { success: false, error: "Address not found" };
      }

      const location = data.results[0].geometry.location;
      const accuracy = data.results[0].geometry_location_type === "ROOFTOP"
        ? "ROOFTOP"
        : "APPROXIMATE";

      return {
        success: true,
        data: {
          latitude: location.lat,
          longitude: location.lng,
          accuracy,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to geocode address: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  getStreetViewUrl(
    latitude: number,
    longitude: number,
    config: Partial<StreetViewConfig> = {}
  ): string {
    const defaultConfig: StreetViewConfig = {
      size: "400x400",
      pitch: 0,
      heading: 0,
      fov: 90,
      ...config,
    };

    const params = new URLSearchParams({
      location: `${latitude},${longitude}`,
      size: defaultConfig.size,
      pitch: String(defaultConfig.pitch),
      heading: String(defaultConfig.heading),
      fov: String(defaultConfig.fov),
      key: this.apiKey,
    });

    return `https://maps.googleapis.com/maps/api/streetview?${params}`;
  }

  async calculateSolarPotential(
    monthlyBillDollars: number,
    yearlyEnergyAcKwh: number,
    costPerKwh: number = 0.13
  ): Promise<Result<{
    monthlyProduction: number;
    annualSavings: number;
    paybackYears: number;
  }>> {
    try {
      if (yearlyEnergyAcKwh <= 0 || monthlyBillDollars <= 0) {
        return {
          success: false,
          error: "Invalid input values for solar potential calculation",
        };
      }

      const monthlyProduction = yearlyEnergyAcKwh / 12;
      const monthlySavings = monthlyProduction * costPerKwh;
      const annualSavings = monthlySavings * 12;

      const systemCostEstimate = yearlyEnergyAcKwh * 2.5; // $2.50 per annual kWh typical
      const paybackYears = annualSavings > 0 ? systemCostEstimate / annualSavings : 0;

      return {
        success: true,
        data: {
          monthlyProduction,
          annualSavings,
          paybackYears,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to calculate solar potential: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }
}
