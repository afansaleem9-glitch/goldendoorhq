/*
 * TWILIO COMMUNICATIONS INTEGRATION
 * SMS, WhatsApp, Voice for customer and rep communications
 */

interface ApiResult<T> { success: boolean; data?: T; error?: string; }
interface TwilioMessage { sid: string; status: string; to: string; body: string; }
interface TwilioCall { sid: string; status: string; to: string; duration: string; }

async function twilioRequest<T>(endpoint: string, body: Record<string, string>): Promise<ApiResult<T>> {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    if (!accountSid || !authToken) return { success: false, error: 'Twilio not configured' };

    const params = new URLSearchParams(body);
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}${endpoint}.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    if (!res.ok) return { success: false, error: `Twilio error: ${res.status}` };
    return { success: true, data: (await res.json()) as T };
  } catch (err) {
    return { success: false, error: `Twilio failed: ${err instanceof Error ? err.message : 'Unknown'}` };
  }
}

export async function sendSMS(to: string, body: string, from?: string): Promise<ApiResult<TwilioMessage>> {
  return twilioRequest<TwilioMessage>('/Messages', {
    To: to, Body: body, From: from || process.env.TWILIO_PHONE_NUMBER || '',
  });
}

export async function sendWhatsApp(to: string, body: string): Promise<ApiResult<TwilioMessage>> {
  return twilioRequest<TwilioMessage>('/Messages', {
    To: `whatsapp:${to}`, Body: body, From: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER || ''}`,
  });
}

export async function makeCall(to: string, twimlUrl: string): Promise<ApiResult<TwilioCall>> {
  return twilioRequest<TwilioCall>('/Calls', {
    To: to, From: process.env.TWILIO_PHONE_NUMBER || '', Url: twimlUrl,
  });
}

export async function sendBulkSMS(recipients: Array<{ to: string; body: string }>): Promise<ApiResult<TwilioMessage[]>> {
  const results: TwilioMessage[] = [];
  for (const r of recipients) {
    const res = await sendSMS(r.to, r.body);
    if (res.success && res.data) results.push(res.data);
  }
  return { success: true, data: results };
}

export async function lookupPhoneNumber(phoneNumber: string): Promise<ApiResult<Record<string, unknown>>> {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const res = await fetch(`https://lookups.twilio.com/v2/PhoneNumbers/${encodeURIComponent(phoneNumber)}?Fields=line_type_intelligence`, {
      headers: { Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}` },
    });
    if (!res.ok) return { success: false, error: `Lookup error: ${res.status}` };
    return { success: true, data: await res.json() };
  } catch (err) {
    return { success: false, error: `Lookup failed: ${err instanceof Error ? err.message : 'Unknown'}` };
  }
}
