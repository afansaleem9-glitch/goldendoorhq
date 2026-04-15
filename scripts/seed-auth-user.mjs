#!/usr/bin/env node
// Seed (or upsert) the single allowed auth user.
//
// Usage:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... SEED_USER_EMAIL=afan@goldendoorhq.com SEED_USER_PASSWORD=... \
//     node scripts/seed-auth-user.mjs
//
// The script is idempotent: if the user exists, it updates the password; otherwise it creates them.
// Never hardcode credentials. Run once, then rotate the password via the Supabase dashboard.

import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.SEED_USER_EMAIL;
const password = process.env.SEED_USER_PASSWORD;

if (!url || !serviceRole || !email || !password) {
  console.error('Missing required env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SEED_USER_EMAIL, SEED_USER_PASSWORD');
  process.exit(1);
}

const admin = createClient(url, serviceRole, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Look up by email via listUsers (Supabase admin API doesn't have a direct "get by email").
async function findUserByEmail(e) {
  let page = 1;
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const match = data.users.find((u) => u.email?.toLowerCase() === e.toLowerCase());
    if (match) return match;
    if (data.users.length < 200) return null;
    page += 1;
  }
}

const existing = await findUserByEmail(email);

if (existing) {
  const { error } = await admin.auth.admin.updateUserById(existing.id, {
    password,
    email_confirm: true,
  });
  if (error) throw error;
  console.log(`Updated password for existing user ${email} (id=${existing.id})`);
} else {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) throw error;
  console.log(`Created user ${email} (id=${data.user?.id})`);
}
