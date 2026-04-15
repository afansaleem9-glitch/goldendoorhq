/*
 * ABC SUPPLY PRICING API v2 INTEGRATION
 * Connects to ABC Supply's partner pricing API for roofing materials.
 *
 * Production: https://partners.abcsupply.com/api/pricing/v2/prices
 * Sandbox:    https://partners-sb.abcsupply.com/api/pricing/v2/prices
 *
 * Auth: OAuth 2.0 Bearer token with pricing.read scope
 * Docs: ABC Supply Partner Portal
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PricingPurpose = 'estimating' | 'quoting' | 'ordering';

export interface ABCPricingLineItem {
  id: string;
  itemNumber: string;
  quantity: number;
  uom: string;
  length?: {
    value: number;
    uom: 'ft' | 'feet' | 'Feet' | 'in' | 'inch' | 'Inch' | 'inches' | 'Inches';
  };
}

export interface ABCPricingRequest {
  requestId?: string;
  shipToNumber: string;
  branchNumber: string;
  purpose: PricingPurpose;
  lines: ABCPricingLineItem[];
}

export interface ABCPricedLineItem extends ABCPricingLineItem {
  unitPrice: number;
  currency: {
    code: string;
    symbol: string;
  };
  status: {
    code: string;
    message: string;
  };
}

export interface ABCPricingResponse {
  requestId?: string;
  shipToNumber: string;
  branchNumber: string;
  purpose: PricingPurpose;
  lines: ABCPricedLineItem[];
}

interface Result<T> { success: boolean; data?: T; error?: string; }

// ---------------------------------------------------------------------------
// ABC Supply Pricing Client
// ---------------------------------------------------------------------------

export class ABCSupplyAPI {
  private token: string;
  private baseUrl: string;

  constructor(token?: string) {
    this.token = token || process.env.ABC_SUPPLY_API_TOKEN || '';
    this.baseUrl = process.env.ABC_SUPPLY_API_URL || 'https://partners.abcsupply.com';
  }

  private headers(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  // -----------------------------------------------------------------------
  // Core Pricing Method
  // -----------------------------------------------------------------------

  async priceItems(request: ABCPricingRequest): Promise<Result<ABCPricingResponse>> {
    try {
      const res = await fetch(`${this.baseUrl}/api/pricing/v2/prices`, {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify(request),
      });

      if (res.status === 401) {
        return { success: false, error: 'Unauthorized — check ABC Supply API token and ship-to access' };
      }
      if (res.status === 403) {
        return { success: false, error: 'Forbidden — pricing.read scope required' };
      }
      if (!res.ok) {
        const errBody = await res.text();
        return { success: false, error: `ABC Supply API ${res.status}: ${errBody}` };
      }

      const data: ABCPricingResponse = await res.json();

      // Check for line-level errors (API returns 200 even with item errors)
      const errors = data.lines.filter(l => l.status?.code !== 'OK');
      if (errors.length > 0 && errors.length === data.lines.length) {
        return { success: false, error: `All items failed: ${errors.map(e => e.status.message).join('; ')}`, data };
      }

      return { success: true, data };
    } catch (err) {
      return { success: false, error: `ABC Supply API error: ${err instanceof Error ? err.message : String(err)}` };
    }
  }

  // -----------------------------------------------------------------------
  // Convenience Methods
  // -----------------------------------------------------------------------

  /**
   * Quick pricing for a roofing estimate — pass items with just number + qty.
   */
  async priceEstimate(
    shipToNumber: string,
    branchNumber: string,
    items: { itemNumber: string; quantity: number; uom: string; length?: { value: number; uom: string } }[],
    requestId?: string,
  ): Promise<Result<ABCPricingResponse>> {
    return this.priceItems({
      requestId: requestId || `estimate-${Date.now()}`,
      shipToNumber,
      branchNumber,
      purpose: 'estimating',
      lines: items.map((item, i) => ({
        id: String(i + 1),
        itemNumber: item.itemNumber,
        quantity: item.quantity,
        uom: item.uom,
        ...(item.length ? { length: item.length as ABCPricingLineItem['length'] } : {}),
      })),
    });
  }

  /**
   * Price a single item — simplest use case.
   */
  async priceSingleItem(
    shipToNumber: string,
    branchNumber: string,
    itemNumber: string,
    quantity: number,
    uom: string,
    purpose: PricingPurpose = 'estimating',
  ): Promise<Result<{ unitPrice: number; total: number; currency: string; status: string }>> {
    const res = await this.priceItems({
      requestId: `single-${Date.now()}`,
      shipToNumber,
      branchNumber,
      purpose,
      lines: [{ id: '1', itemNumber, quantity, uom }],
    });

    if (!res.success || !res.data) return { success: false, error: res.error };

    const line = res.data.lines[0];
    if (line.status.code !== 'OK') {
      return { success: false, error: line.status.message };
    }

    return {
      success: true,
      data: {
        unitPrice: line.unitPrice,
        total: line.unitPrice * quantity,
        currency: line.currency.code,
        status: line.status.message,
      },
    };
  }

  // -----------------------------------------------------------------------
  // Roofing Material Helpers
  // -----------------------------------------------------------------------

  /**
   * Price a full roofing materials list for a job.
   * Common UOMs: SQ (square), BD (bundle), BX (box), PC (piece), RL (roll)
   */
  async priceRoofingJob(
    shipToNumber: string,
    branchNumber: string,
    materials: {
      itemNumber: string;
      quantity: number;
      uom: string;
      description?: string;
    }[],
    jobName?: string,
  ): Promise<Result<{
    items: { itemNumber: string; description?: string; quantity: number; uom: string; unitPrice: number; totalPrice: number; status: string }[];
    totalCost: number;
    successCount: number;
    errorCount: number;
  }>> {
    const res = await this.priceItems({
      requestId: jobName || `roof-job-${Date.now()}`,
      shipToNumber,
      branchNumber,
      purpose: 'ordering',
      lines: materials.map((m, i) => ({
        id: String(i + 1),
        itemNumber: m.itemNumber,
        quantity: m.quantity,
        uom: m.uom,
      })),
    });

    if (!res.success || !res.data) return { success: false, error: res.error };

    const items = res.data.lines.map((line, i) => ({
      itemNumber: line.itemNumber,
      description: materials[i]?.description,
      quantity: line.quantity,
      uom: line.uom,
      unitPrice: line.unitPrice || 0,
      totalPrice: (line.unitPrice || 0) * line.quantity,
      status: line.status.message,
    }));

    const successItems = items.filter(i => i.unitPrice > 0);

    return {
      success: true,
      data: {
        items,
        totalCost: successItems.reduce((s, i) => s + i.totalPrice, 0),
        successCount: successItems.length,
        errorCount: items.length - successItems.length,
      },
    };
  }
}

// Singleton
let _abcClient: ABCSupplyAPI | null = null;
export function getABCSupplyClient(): ABCSupplyAPI {
  if (!_abcClient) _abcClient = new ABCSupplyAPI();
  return _abcClient;
}
