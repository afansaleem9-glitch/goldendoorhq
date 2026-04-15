import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import type { User } from '@supabase/supabase-js';
import { createServerClient } from './supabase-server';
import { ALLOWED_EMAIL, isValidBearer } from './auth-config';

export class UnauthorizedError extends Error {
  response: NextResponse;
  constructor() {
    super('unauthorized');
    this.response = NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
}

export type AuthContext =
  | { kind: 'session'; user: User }
  | { kind: 'bearer' };

export async function requireAuth(): Promise<AuthContext> {
  const hdrs = await headers();
  if (isValidBearer(hdrs.get('authorization'))) {
    return { kind: 'bearer' };
  }
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ALLOWED_EMAIL) {
    throw new UnauthorizedError();
  }
  return { kind: 'session', user };
}
