/*
 * EAGLEVIEW AERIAL IMAGERY INTEGRATION
 * Roof measurement reports for solar panel layout planning
 */

interface ApiResult<T> { success: boolean; data?: T; error?: string; }

interface EagleViewOrder { orderId: string; status: string; estimatedDelivery: string; }
interface EagleViewReport { orderId: string; status: string; roofArea: number; pitch: number; facets: number; reportUrl: string; }

const BASE_URL = 'https://api.eagleview.com/v2';

async function eagleviewRequest<T>(endpoint: string, method: string, body?: Record<string, unknown>): Promise<ApiResult<T>> {
  try {
    const apiKey = process.env.EAGLEVIEW_API_KEY;
    const sourceId = process.env.EAGLEVIEW_SOURCE_ID;
    if (!apiKey) return { success: false, error: 'EagleView key not configured' };

    const options: RequestInit = {
      method,
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'X-Source-Id': sourceId || '' },
    };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`${BASE_URL}${endpoint}`, options);
    if (!res.ok) return { success: false, error: `EagleView error: ${res.status}` };
    return { success: true, data: (await res.json()) as T };
  } catch (err) {
    return { success: false, error: `EagleView failed: ${err instanceof Error ? err.message : 'Unknown'}` };
  }
}

export async function orderReport(address: string, reportType = 'SunSiteReport'): Promise<ApiResult<EagleViewOrder>> {
  return eagleviewRequest<EagleViewOrder>('/orders', 'POST', { address, reportType, deliveryProduct: 'XML_JSON' });
}

export async function getReportStatus(orderId: string): Promise<ApiResult<EagleViewOrder>> {
  return eagleviewRequest<EagleViewOrder>(`/orders/${orderId}`, 'GET');
}

export async function getReportResults(orderId: string): Promise<ApiResult<EagleViewReport>> {
  return eagleviewRequest<EagleViewReport>(`/orders/${orderId}/results`, 'GET');
}

export async function getRoofMeasurements(orderId: string): Promise<ApiResult<Record<string, unknown>>> {
  return eagleviewRequest<Record<string, unknown>>(`/orders/${orderId}/measurements`, 'GET');
}
