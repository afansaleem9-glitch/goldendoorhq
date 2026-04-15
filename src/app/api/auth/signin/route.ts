import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { ALLOWED_EMAIL } from '@/lib/auth-config';

type Bucket = { count: number; resetAt: number };
const attempts = new Map<string, Bucket>();
const WINDOW_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const bucket = attempts.get(ip);
  if (!bucket || now > bucket.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (bucket.count >= MAX_ATTEMPTS) return false;
  bucket.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  let email: string, password: string;
  try {
    const body = await req.json();
    email = String(body.email || '').trim().toLowerCase();
    password = String(body.password || '');
  } catch {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }
  if (!email || !password) {
    return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
  }

  if (email !== ALLOWED_EMAIL) {
    return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
  }

  const supabase = await createServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
