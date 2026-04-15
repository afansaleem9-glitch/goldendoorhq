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
