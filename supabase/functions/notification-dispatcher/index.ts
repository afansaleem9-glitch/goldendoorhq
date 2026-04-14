// Supabase Edge Function: Notification Dispatcher
// Routes notifications to email (SendGrid), SMS (Twilio), push, or Slack

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  type: 'email' | 'sms' | 'push' | 'slack';
  recipient: string;
  subject?: string;
  body: string;
  template?: string;
  data?: Record<string, string>;
}

async function sendEmail(to: string, subject: string, body: string): Promise<boolean> {
  const apiKey = Deno.env.get('SENDGRID_API_KEY');
  if (!apiKey) return false;
  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: Deno.env.get('FROM_EMAIL') || 'hello@goldendoorhq.com', name: 'GoldenDoor' },
      subject,
      content: [{ type: 'text/html', value: body }],
    }),
  });
  return res.ok;
}

async function sendSMS(to: string, body: string): Promise<boolean> {
  const sid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const token = Deno.env.get('TWILIO_AUTH_TOKEN');
  const from = Deno.env.get('TWILIO_PHONE_NUMBER');
  if (!sid || !token || !from) return false;

  const params = new URLSearchParams({ To: to, From: from, Body: body });
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`${sid}:${token}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });
  return res.ok;
}

async function sendSlack(webhookUrl: string, body: string): Promise<boolean> {
  const url = webhookUrl || Deno.env.get('SLACK_WEBHOOK_URL');
  if (!url) return false;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: body }),
  });
  return res.ok;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const notification: NotificationRequest = await req.json();
    let sent = false;

    // Template substitution
    let finalBody = notification.body;
    if (notification.data) {
      for (const [key, val] of Object.entries(notification.data)) {
        finalBody = finalBody.replace(new RegExp(`{{${key}}}`, 'g'), val);
      }
    }

    switch (notification.type) {
      case 'email':
        sent = await sendEmail(notification.recipient, notification.subject || 'GoldenDoor Notification', finalBody);
        break;
      case 'sms':
        sent = await sendSMS(notification.recipient, finalBody);
        break;
      case 'slack':
        sent = await sendSlack(notification.recipient, finalBody);
        break;
      case 'push':
        // Placeholder for push notifications (future: Firebase FCM or OneSignal)
        sent = false;
        break;
    }

    return new Response(JSON.stringify({ success: true, sent, type: notification.type }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
