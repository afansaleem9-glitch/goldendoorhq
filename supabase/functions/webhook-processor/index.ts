// Supabase Edge Function: Webhook Processor
// Receives, verifies, and routes inbound webhooks from all integrations

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-source, x-webhook-signature',
};

async function verifyHmacSignature(payload: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  const computed = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
  return computed === signature.replace('sha256=', '');
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabase = createClient(Deno.env.get('SUPABASE_URL') || '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '');

  try {
    const source = req.headers.get('x-webhook-source') || 'unknown';
    const signature = req.headers.get('x-webhook-signature') || '';
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);

    // Verify signature if configured
    const secret = Deno.env.get(`WEBHOOK_SECRET_${source.toUpperCase()}`);
    if (secret && signature) {
      const valid = await verifyHmacSignature(rawBody, signature, secret);
      if (!valid) {
        return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    // Log the webhook
    await supabase.from('integration_logs').insert({
      organization_id: body.organization_id || null,
      direction: 'inbound',
      endpoint: `/webhooks/${source}`,
      method: 'POST',
      request_body: body,
      response_status: 200,
      created_at: new Date().toISOString(),
    });

    // Route by source
    let processed = false;
    if (source === 'stripe') {
      // Handle Stripe webhook events
      if (body.type === 'payment_intent.succeeded') {
        await supabase.from('payments').update({ status: 'completed', processed_at: new Date().toISOString() }).eq('stripe_payment_id', body.data?.object?.id);
        processed = true;
      }
    } else if (source === 'enphase' || source === 'solaredge') {
      // Handle monitoring alerts
      if (body.alert_type) {
        await supabase.from('system_alerts').insert({
          organization_id: body.organization_id, system_id: body.system_id,
          alert_type: body.alert_type, severity: body.severity || 'warning',
          title: body.title || body.alert_type, description: body.message,
          metadata: body,
        });
        processed = true;
      }
    } else if (source === 'goldendoorapp') {
      // Handle events from mobile app
      if (body.event === 'lead.created') {
        await supabase.from('contacts').insert({ ...body.data, lifecycle_stage: 'lead' });
        processed = true;
      }
    }

    // Forward to n8n for additional processing
    const n8nUrl = Deno.env.get('N8N_WEBHOOK_URL');
    if (n8nUrl) {
      await fetch(n8nUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, event: body.event || body.type, data: body, processed }),
      });
    }

    return new Response(JSON.stringify({ success: true, processed }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
