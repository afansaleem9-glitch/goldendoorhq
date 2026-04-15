import { NextRequest } from 'next/server';
import { requireAuth, UnauthorizedError } from '@/lib/require-auth';
import { createServerClient } from '@/lib/supabase';
import { apiError } from '@/lib/api-helpers';
import { downloadDocumentResponse } from '@/lib/pandadoc';

function isUuid(v: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
  } catch (err) {
    if (err instanceof UnauthorizedError) return err.response;
    throw err;
  }

  const { id } = await ctx.params;
  if (!isUuid(id)) return apiError('Invalid document id', 400);

  const supabase = createServerClient();
  const { data: doc, error } = await supabase
    .from('documents')
    .select('signature_request_id, title')
    .eq('id', id)
    .is('deleted_at', null)
    .maybeSingle();

  if (error) {
    console.error('[documents/download] lookup failed', error);
    return apiError('Lookup failed', 500);
  }
  if (!doc) return apiError('Document not found', 404);
  if (!doc.signature_request_id) return apiError('No PandaDoc document linked', 409);

  const upstream = await downloadDocumentResponse(doc.signature_request_id);
  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => '');
    console.error('[documents/download] PandaDoc download failed', upstream.status, text);
    return apiError(upstream.status >= 500 ? 'Document provider unavailable' : 'Download failed', upstream.status >= 500 ? 502 : 400);
  }

  const filename = `${(doc.title || 'document').replace(/[^a-z0-9\-_\s.]/gi, '_').slice(0, 120)}.pdf`;
  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
