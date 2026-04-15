import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tnnksprdlinfetnqkpgd.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRubmtzcHJkbGluZmV0bnFrcGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NDY2MTYsImV4cCI6MjA5MDEyMjYxNn0.YzIHZVtiA37hjGDBtxB8i0tlw-wuEN8hfULAsp8TdFI';

// Organization ID for Delta Power Group
export const ORG_ID = 'a97d1a8b-3691-42a3-b116-d131e085b00f';

// Singleton client for browser use
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Server-side Supabase client (for API routes)
export function createServerClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
  return createClient(SUPABASE_URL, key, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

// Client-side Supabase client (for frontend, with RLS)
export function createBrowserClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
