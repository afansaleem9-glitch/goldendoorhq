import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiSuccess, apiError, emitEvent } from '@/lib/api-helpers';
import crypto from 'crypto';

/*
 * WEBHOOK RECEIVER API
 * Receives inbound webhooks from:
 * - goldendoorapp.com (rep actions: new lead, appointment set, contract signed)
 * - HubSpot (contact/deal updates)
 * - Stripe (payment events)
 * - CompanyCam (photo uploads)
 * - SiteCapture (survey completions)
 * - n8n (workflow callbacks)
 *
 * Each webhook is:
 * 1. Verified (signature check if available)
 * 2. Logged in webhook_log table
 * 3. Processed based on source + event type
 * 4. Re-emitted to n8n for further automation
 */

// Verify webhook signature (HMAC-SHA256)
function verifySignature(payload: string, signature: string, secret: string): boolean {
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

// POST /api/webhooks — Receive inbound webhooks
export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);

    const source = req.nextUrl.searchParams.get('source') || body.source || 'unknown';
    const event = body.event || body.type || body.event_type || 'unknown';
    const signature = req.headers.get('x-webhook-signature') || req.headers.get('x-hub-signature-256') || '';

    // Verify signature if secret is configured for this source
    const secretEnvKey = `WEBHOOK_SECRET_${source.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`;
    const secret = process.env[secretEnvKey];
    if (secret && signature) {
      const isValid = verifySignature(rawBody, signature.replace('sha256=', ''), secret);
      if (!isValid) return apiError('Invalid webhook signature', 401);
    }

    // Log the webhook
    const { data: log } = await supabase
      .from('audit_log')
      .insert({
        entity_type: 'webhook',
        entity_id: body.id || null,
        action: `webhook.${source}.${event}`,
        changes: {
          source,
          event,
          payload: body,
          headers: {
            'content-type': req.headers.get('content-type'),
            'user-agent': req.headers.get('user-agent'),
          },
        },
        organization_id: body.organization_id || null,
      })
      .select('id')
      .single();

    // Process based on source
    let processed = false;
    let result: Record<string, unknown> = {};

    switch (source) {
      case 'goldendoorapp': {
        result = await processGoldenDoorAppWebhook(supabase, event, body);
        processed = true;
        break;
      }

      case 'hubspot': {
        result = await processHubSpotWebhook(supabase, event, body);
        processed = true;
        break;
      }

      case 'stripe': {
        result = await processStripeWebhook(supabase, event, body);
        processed = true;
        break;
      }

      case 'companycam': {
        result = await processCompanyCamWebhook(supabase, event, body);
        processed = true;
        break;
      }

      case 'sitecapture': {
        result = await processSiteCaptureWebhook(supabase, event, body);
        processed = true;
        break;
      }

      case 'n8n': {
        // n8n callback — just log and acknowledge
        processed = true;
        result = { action: 'acknowledged', workflow_id: body.workflow_id };
        break;
      }
    }

    // Re-emit to n8n for further automation chaining
    await emitEvent(`webhook.${source}.${event}`, {
      webhookLogId: log?.id,
      source,
      event,
      processed,
      result,
      payload: body,
    });

    return apiSuccess({ received: true, source, event, processed, result });
  } catch {
    return apiError('Internal server error', 500);
  }
}

// --- Source-specific processors ---

async function processGoldenDoorAppWebhook(
  supabase: ReturnType<typeof createServerClient>,
  event: string,
  body: Record<string, unknown>
) {
  switch (event) {
    case 'lead.created': {
      // Rep knocked a door and created a lead in the sales app
      const { data } = await supabase
        .from('contacts')
        .insert({
          first_name: body.first_name as string,
          last_name: body.last_name as string,
          email: body.email as string,
          phone: body.phone as string,
          address_line1: body.address as string,
          city: body.city as string,
          state: body.state as string,
          zip: body.zip as string,
          lifecycle_stage: 'lead',
          lead_status: 'new',
          lead_source: 'door_knock',
          owner_id: body.rep_id as string,
          external_id: body.app_lead_id as string,
          organization_id: body.organization_id as string,
        })
        .select('id')
        .single();
      return { action: 'contact_created', contact_id: data?.id };
    }

    case 'appointment.set': {
      // Rep set an appointment
      const { data } = await supabase
        .from('tasks')
        .insert({
          title: `Appointment: ${body.customer_name}`,
          type: 'call',
          priority: 'high',
          status: 'not_started',
          due_date: body.appointment_date as string,
          assigned_to: body.rep_id as string,
          contact_id: body.crm_contact_id as string,
          organization_id: body.organization_id as string,
        })
        .select('id')
        .single();
      return { action: 'task_created', task_id: data?.id };
    }

    case 'contract.signed': {
      // Contract signed in the field — update deal stage
      if (body.crm_deal_id) {
        await supabase
          .from('deals')
          .update({
            stage_id: body.closed_won_stage_id as string,
            last_stage_change_at: new Date().toISOString(),
          })
          .eq('id', body.crm_deal_id as string);
      }
      return { action: 'deal_updated', deal_id: body.crm_deal_id };
    }

    case 'rep.location_update': {
      // Track rep location for territory management (just log it)
      return { action: 'location_logged', rep_id: body.rep_id };
    }

    default:
      return { action: 'unhandled', event };
  }
}

async function processHubSpotWebhook(
  supabase: ReturnType<typeof createServerClient>,
  event: string,
  body: Record<string, unknown>
) {
  // HubSpot sends arrays of subscription events
  const events = Array.isArray(body.events) ? body.events : [body];

  for (const evt of events as Record<string, unknown>[]) {
    const objectType = evt.objectType || evt.object_type;
    const objectId = evt.objectId || evt.object_id;

    if (objectType === 'contact' && objectId) {
      // Sync HubSpot contact update to CRM
      await supabase
        .from('contacts')
        .update({ hubspot_synced_at: new Date().toISOString() })
        .eq('external_id', `hubspot_${objectId}`);
    }
  }

  return { action: 'hubspot_processed', event_count: (events as unknown[]).length };
}

async function processStripeWebhook(
  supabase: ReturnType<typeof createServerClient>,
  event: string,
  body: Record<string, unknown>
) {
  const stripeEvent = body.data as Record<string, unknown> | undefined;
  const object = stripeEvent?.object as Record<string, unknown> | undefined;

  if (event === 'payment_intent.succeeded' && object) {
    // Log payment activity
    await supabase.from('activities').insert({
      type: 'payment',
      subject: `Payment received: $${(Number(object.amount) / 100).toFixed(2)}`,
      body: `Stripe payment ${object.id} succeeded`,
      contact_id: object.metadata ? (object.metadata as Record<string, unknown>).crm_contact_id as string : null,
      organization_id: object.metadata ? (object.metadata as Record<string, unknown>).organization_id as string : null,
    });

    return { action: 'payment_logged', amount: object.amount, stripe_id: object.id };
  }

  return { action: 'stripe_event_logged', event };
}

async function processCompanyCamWebhook(
  supabase: ReturnType<typeof createServerClient>,
  event: string,
  body: Record<string, unknown>
) {
  if (event === 'photo.created') {
    // Link photo to solar project if project_id is in tags
    const projectId = body.project_tag as string;
    if (projectId) {
      await supabase.from('activities').insert({
        type: 'note',
        subject: 'New site photo uploaded',
        body: `CompanyCam photo uploaded: ${body.photo_url}`,
        organization_id: body.organization_id as string,
      });
    }
    return { action: 'photo_logged', photo_url: body.photo_url };
  }

  return { action: 'companycam_logged', event };
}

async function processSiteCaptureWebhook(
  supabase: ReturnType<typeof createServerClient>,
  event: string,
  body: Record<string, unknown>
) {
  if (event === 'survey.completed') {
    // Auto-advance solar project stage
    const solarProjectId = body.crm_project_id as string;
    if (solarProjectId) {
      await supabase
        .from('solar_projects')
        .update({
          current_stage: 'site_survey_completed',
          site_survey_completed_at: new Date().toISOString(),
          survey_notes: body.survey_notes as string,
          survey_photos_url: body.report_url as string,
        })
        .eq('id', solarProjectId);

      return { action: 'solar_stage_advanced', project_id: solarProjectId, new_stage: 'site_survey_completed' };
    }
  }

  return { action: 'sitecapture_logged', event };
}
