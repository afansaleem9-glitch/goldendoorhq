import { NextResponse } from 'next/server';
import type { User } from '@supabase/supabase-js';
import { createServerClient } from './supabase-server';
import { ALLOWED_EMAIL } from './auth-config';

export class UnauthorizedError extends Error {
  response: NextResponse;
  constructor() {
    super('unauthorized');
    this.response = NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
}

export async function requireAuth(): Promise<{ user: User }> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ALLOWED_EMAIL) {
    throw new UnauthorizedError();
  }
  return { user };
}
