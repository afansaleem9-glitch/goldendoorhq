import { NextResponse } from 'next/server';

// Standard API response shape — consistent across the platform
export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  meta?: { total?: number; page?: number; limit?: number };
};

export function apiSuccess<T>(data: T, meta?: ApiResponse<T>['meta']) {
  return NextResponse.json({ success: true, data, meta });
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

// Validate required fields
export function validateRequired(body: Record<string, unknown>, fields: string[]): string | null {
  for (const field of fields) {
    if (!body[field] && body[field] !== 0 && body[field] !== false) {
      return `Missing required field: ${field}`;
    }
  }
  return null;
}

// Parse pagination from URL search params
export function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '25')));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

// Emit event to n8n webhook for automation
export async function emitEvent(event: string, payload: Record<string, unknown>) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) return;
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, timestamp: new Date().toISOString(), ...payload }),
    });
  } catch {
    console.error(`[Event] Failed to emit ${event}`);
  }
}

// Sync data to goldendoorapp.com
export async function syncToGoldenDoorApp(endpoint: string, data: Record<string, unknown>) {
  const appUrl = process.env.GOLDENDOORAPP_API_URL || 'https://goldendoorapp.com/api';
  const apiKey = process.env.GOLDENDOORAPP_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch(`${appUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-Source': 'goldendoorhq-crm',
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.error(`[Sync] Failed to sync to goldendoorapp.com${endpoint}:`, err);
    return null;
  }
}
