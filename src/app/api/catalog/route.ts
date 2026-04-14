import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiSuccess, apiError, parsePagination, validateRequired, emitEvent } from '@/lib/api-helpers';

// GET /api/catalog — Equipment, pricebook, or material orders
export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const params = req.nextUrl.searchParams;
    const { page, limit, offset } = parsePagination(params);
    const type = params.get('type') || 'equipment';
    const category = params.get('category');
    const search = params.get('search');

    if (type === 'equipment') {
      let query = supabase
        .from('equipment_catalog')
        .select('*', { count: 'exact' })
        .is('deleted_at', null)
        .range(offset, offset + limit - 1)
        .order('name');
      if (category) query = query.eq('category', category);
      if (params.get('active') === 'true') query = query.eq('is_active', true);
      if (search) query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%,manufacturer.ilike.%${search}%`);
      const { data, error, count } = await query;
      if (error) return apiError(error.message, 500);
      return apiSuccess(data, { total: count || 0, page, limit });
    }

    if (type === 'pricebook') {
      let query = supabase
        .from('price_book_entries')
        .select('*', { count: 'exact' })
        .is('deleted_at', null)
        .range(offset, offset + limit - 1)
        .order('name');
      if (category) query = query.eq('category', category);
      const { data, error, count } = await query;
      if (error) return apiError(error.message, 500);
      return apiSuccess(data, { total: count || 0, page, limit });
    }

    if (type === 'orders') {
      let query = supabase
        .from('material_orders')
        .select('*', { count: 'exact' })
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });
      const status = params.get('status');
      if (status) query = query.eq('status', status);
      const { data, error, count } = await query;
      if (error) return apiError(error.message, 500);
      return apiSuccess(data, { total: count || 0, page, limit });
    }

    return apiError('Invalid type');
  } catch {
    return apiError('Internal server error', 500);
  }
}

// POST /api/catalog — Create equipment, price entry, or order
export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();
    const type = body.type || 'equipment';

    if (type === 'equipment') {
      const missing = validateRequired(body, ['name', 'category', 'cost_price']);
      if (missing) return apiError(missing);

      const markupPct = body.markup_pct || 30;
      const retailPrice = body.retail_price || Number(body.cost_price) * (1 + markupPct / 100);

      const { data, error } = await supabase
        .from('equipment_catalog')
        .insert({
          organization_id: body.organization_id, sku: body.sku, name: body.name,
          category: body.category, manufacturer: body.manufacturer, model: body.model,
          description: body.description, specifications: body.specifications || {},
          cost_price: body.cost_price, retail_price: retailPrice, markup_pct: markupPct,
          unit: body.unit || 'each', in_stock_qty: body.in_stock_qty || 0,
          reorder_point: body.reorder_point || 5, supplier_name: body.supplier_name,
          supplier_sku: body.supplier_sku, image_url: body.image_url,
        })
        .select().single();
      if (error) return apiError(error.message, 500);
      await emitEvent('catalog.item_created', { itemId: data.id, name: data.name });
      return apiSuccess(data);
    }

    if (type === 'pricebook') {
      const missing = validateRequired(body, ['name', 'category']);
      if (missing) return apiError(missing);
      const { data, error } = await supabase
        .from('price_book_entries')
        .insert({
          organization_id: body.organization_id, name: body.name, category: body.category,
          description: body.description, unit_cost: body.unit_cost, unit_price: body.unit_price,
          markup_pct: body.markup_pct, labor_hours: body.labor_hours, labor_rate: body.labor_rate,
          total_price: body.total_price, is_addon: body.is_addon || false,
          effective_from: body.effective_from, effective_to: body.effective_to,
          applies_to: body.applies_to || 'both',
        })
        .select().single();
      if (error) return apiError(error.message, 500);
      return apiSuccess(data);
    }

    if (type === 'order') {
      const missing = validateRequired(body, ['supplier']);
      if (missing) return apiError(missing);
      const now = new Date();
      const orderNumber = `MO-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${Date.now().toString(36).toUpperCase()}`;
      const { data, error } = await supabase
        .from('material_orders')
        .insert({
          organization_id: body.organization_id, project_id: body.project_id,
          order_number: orderNumber, supplier: body.supplier, status: 'draft',
          items: body.items || [], subtotal: body.subtotal, tax: body.tax,
          shipping: body.shipping, total: body.total, expected_delivery: body.expected_delivery,
          notes: body.notes, created_by: body.created_by,
        })
        .select().single();
      if (error) return apiError(error.message, 500);
      await emitEvent('catalog.order_placed', { orderId: data.id, orderNumber });
      return apiSuccess(data);
    }

    return apiError('Invalid type');
  } catch {
    return apiError('Internal server error', 500);
  }
}

// PATCH /api/catalog — Update item, deactivate, update stock
export async function PATCH(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();
    if (!body.id) return apiError('Missing id');
    const action = body.action;
    const table = body.entity === 'pricebook' ? 'price_book_entries' : body.entity === 'order' ? 'material_orders' : 'equipment_catalog';

    if (action === 'deactivate') {
      const { data, error } = await supabase.from(table).update({ is_active: false }).eq('id', body.id).select().single();
      if (error) return apiError(error.message, 500);
      return apiSuccess(data);
    }

    if (action === 'update_stock') {
      const { data, error } = await supabase.from('equipment_catalog')
        .update({ in_stock_qty: body.in_stock_qty }).eq('id', body.id).select().single();
      if (error) return apiError(error.message, 500);
      return apiSuccess(data);
    }

    // Generic update
    const updates: Record<string, unknown> = {};
    const fields = table === 'equipment_catalog'
      ? ['name', 'category', 'manufacturer', 'model', 'description', 'specifications', 'cost_price', 'retail_price', 'markup_pct', 'in_stock_qty', 'supplier_name', 'image_url', 'is_active']
      : table === 'material_orders'
      ? ['status', 'tracking_number', 'delivered_at', 'notes']
      : ['name', 'unit_cost', 'unit_price', 'labor_hours', 'labor_rate', 'total_price', 'is_active', 'effective_from', 'effective_to'];
    for (const f of fields) { if (body[f] !== undefined) updates[f] = body[f]; }
    const { data, error } = await supabase.from(table).update(updates).eq('id', body.id).select().single();
    if (error) return apiError(error.message, 500);
    return apiSuccess(data);
  } catch {
    return apiError('Internal server error', 500);
  }
}

// DELETE /api/catalog — Soft delete
export async function DELETE(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const { id, entity } = await req.json();
    if (!id) return apiError('Missing id');
    const table = entity === 'pricebook' ? 'price_book_entries' : 'equipment_catalog';
    const { error } = await supabase.from(table).update({ deleted_at: new Date().toISOString() }).eq('id', id);
    if (error) return apiError(error.message, 500);
    return apiSuccess({ deleted: true });
  } catch {
    return apiError('Internal server error', 500);
  }
}
