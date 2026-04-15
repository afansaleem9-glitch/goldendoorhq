export const ALLOWED_EMAIL = 'afan@goldendoorhq.com';

export const PUBLIC_API_PATHS = [
  '/api/auth',
  '/api/aurora/webhooks',
  '/api/sync',
  '/api/webhooks',
  '/api/documents/pandadoc-webhook',
] as const;

export function isPublicApiPath(pathname: string): boolean {
  return PUBLIC_API_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );
}

// Server-to-server bearer token. When Authorization: Bearer <token> matches
// GOLDENDOORHQ_API_KEY, treat the request as authenticated (skip Supabase
// session). Additive — cookie/session path still works in parallel.
export function isValidBearer(authHeader: string | null | undefined): boolean {
  const expected = process.env.GOLDENDOORHQ_API_KEY;
  if (!expected || expected.length < 16) return false;
  if (!authHeader) return false;
  const m = /^Bearer\s+(.+)$/i.exec(authHeader.trim());
  if (!m) return false;
  const provided = m[1].trim();
  if (provided.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < provided.length; i++) {
    diff |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}
