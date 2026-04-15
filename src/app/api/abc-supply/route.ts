import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-helpers';
import { ABCSupplyAPI } from '@/lib/integrations/abc-supply';

/*
 * ABC SUPPLY PRICING API
 *
 * GET  /api/abc-supply?action=price&shipTo=X&branch=Y&item=Z&qty=N&uom=SQ
 * POST /api/abc-supply  — Full pricing request with multiple items
 */

function getClient() {
  return new ABCSupplyAPI(process.env.ABC_SUPPLY_API_TOKEN);
}

// GET — Quick single-item pricing
export async function GET(req: NextRequest) {
  try {
    const abc = getClient();
    const sp = req.nextUrl.searchParams;
    const action = sp.get('action') || 'price';

    if (action === 'price') {
      const shipTo = sp.get('shipTo') || sp.get('ship_to');
      const branch = sp.get('branch');
      const item = sp.get('item') || sp.get('itemNumber');
      const qty = parseInt(sp.get('qty') || sp.get('quantity') || '1', 10);
      const uom = sp.get('uom') || 'SQ';
      const purpose = (sp.get('purpose') as 'estimating' | 'quoting' | 'ordering') || 'estimating';

      if (!shipTo || !branch || !item) {
        return apiError('Required: shipTo, branch, item', 400);
      }

      const result = await abc.priceSingleItem(shipTo, branch, item, qty, uom, purpose);
      if (!result.success) return apiError(result.error || 'Pricing failed', 502);
      return apiSuccess(result.data);
    }

    return apiError(`Unknown action: ${action}`, 400);
  } catch (err) {
    return apiError(`ABC Supply error: ${err instanceof Error ? err.message : String(err)}`, 500);
  }
}

// POST — Full pricing request
export async function POST(req: NextRequest) {
  try {
    const abc = getClient();
    const body = await req.json();
    const { action } = body;

    if (action === 'price_job' || action === 'roofing_job') {
      // Roofing job pricing
      const { shipToNumber, branchNumber, materials, jobName } = body;
      if (!shipToNumber || !branchNumber || !materials?.length) {
        return apiError('Required: shipToNumber, branchNumber, materials[]', 400);
      }
      const result = await abc.priceRoofingJob(shipToNumber, branchNumber, materials, jobName);
      if (!result.success) return apiError(result.error || 'Pricing failed', 502);
      return apiSuccess(result.data);
    }

    if (action === 'estimate') {
      // Quick estimate
      const { shipToNumber, branchNumber, items, requestId } = body;
      if (!shipToNumber || !branchNumber || !items?.length) {
        return apiError('Required: shipToNumber, branchNumber, items[]', 400);
      }
      const result = await abc.priceEstimate(shipToNumber, branchNumber, items, requestId);
      if (!result.success) return apiError(result.error || 'Pricing failed', 502);
      return apiSuccess(result.data);
    }

    // Default: full pricing request passthrough
    const { requestId, shipToNumber, branchNumber, purpose, lines } = body;
    if (!shipToNumber || !branchNumber || !lines?.length) {
      return apiError('Required: shipToNumber, branchNumber, lines[]', 400);
    }

    const result = await abc.priceItems({
      requestId,
      shipToNumber,
      branchNumber,
      purpose: purpose || 'estimating',
      lines,
    });
    if (!result.success) return apiError(result.error || 'Pricing failed', 502);
    return apiSuccess(result.data);
  } catch (err) {
    return apiError(`ABC Supply error: ${err instanceof Error ? err.message : String(err)}`, 500);
  }
}
