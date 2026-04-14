import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client (for API routes)
// Uses SUPABASE_SERVICE_ROLE_KEY if available (bypasses RLS),
// falls back to anon key with permissive RLS policies
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

// Client-side Supabase client (for frontend, with RLS)
export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}
