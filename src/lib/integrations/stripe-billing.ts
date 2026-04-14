/*
 * STRIPE BILLING INTEGRATION
 * Payment processing, invoicing, subscriptions for GoldenDoor CRM
 */

interface ApiResult<T> { success: boolean; data?: T; error?: string; }

interface StripeCustomer { id: string; email: string; name: string; }
interface StripePaymentIntent { id: string; amount: number; status: string; clientSecret: string; }
interface StripeInvoice { id: string; number: string; total: number; status: string; hostedUrl: string; }

async function stripeRequest<T>(endpoint: string, method: string, body?: Record<string, unknown>): Promise<ApiResult<T>> {
  try {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) return { success: false, error: 'Stripe key not configured' };

    const options: RequestInit = {
      method,
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    };

    if (body) {
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(body)) {
        if (v !== undefined && v !== null) params.append(k, String(v));
      }
      options.body = params.toString();
    }

    const res = await fetch(`https://api.stripe.com/v1${endpoint}`, options);
    if (!res.ok) {
      const err = await res.json();
      return { success: false, error: err.error?.message || `Stripe error: ${res.status}` };
    }
    return { success: true, data: (await res.json()) as T };
  } catch (err) {
    return { success: false, error: `Stripe failed: ${err instanceof Error ? err.message : 'Unknown'}` };
  }
}

export async function createCustomer(email: string, name: string, metadata?: Record<string, string>): Promise<ApiResult<StripeCustomer>> {
  const body: Record<string, unknown> = { email, name };
  if (metadata) { for (const [k, v] of Object.entries(metadata)) body[`metadata[${k}]`] = v; }
  return stripeRequest<StripeCustomer>('/customers', 'POST', body);
}

export async function createPaymentIntent(amount: number, customerId: string, metadata?: Record<string, string>): Promise<ApiResult<StripePaymentIntent>> {
  const body: Record<string, unknown> = { amount: Math.round(amount * 100), currency: 'usd', customer: customerId };
  if (metadata) { for (const [k, v] of Object.entries(metadata)) body[`metadata[${k}]`] = v; }
  return stripeRequest<StripePaymentIntent>('/payment_intents', 'POST', body);
}

export async function createInvoice(customerId: string, description: string, amount: number): Promise<ApiResult<StripeInvoice>> {
  const inv = await stripeRequest<StripeInvoice>('/invoices', 'POST', { customer: customerId, auto_advance: 'true' });
  if (!inv.success || !inv.data) return inv;
  await stripeRequest('/invoiceitems', 'POST', { customer: customerId, invoice: inv.data.id, amount: Math.round(amount * 100), currency: 'usd', description });
  return stripeRequest<StripeInvoice>(`/invoices/${inv.data.id}/finalize`, 'POST');
}

export async function getPaymentStatus(paymentIntentId: string): Promise<ApiResult<StripePaymentIntent>> {
  return stripeRequest<StripePaymentIntent>(`/payment_intents/${paymentIntentId}`, 'GET');
}

export async function processRefund(paymentIntentId: string, amount?: number): Promise<ApiResult<Record<string, unknown>>> {
  const body: Record<string, unknown> = { payment_intent: paymentIntentId };
  if (amount) body.amount = Math.round(amount * 100);
  return stripeRequest('/refunds', 'POST', body);
}

export async function listPayments(customerId: string, limit = 10): Promise<ApiResult<Record<string, unknown>>> {
  return stripeRequest(`/payment_intents?customer=${customerId}&limit=${limit}`, 'GET');
}
