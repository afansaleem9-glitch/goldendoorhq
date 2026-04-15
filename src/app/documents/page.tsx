import { createServerClient } from '@/lib/supabase-server';
import { DocumentsTable, type DocumentRow } from './DocumentsTable';

export const dynamic = 'force-dynamic';

export default async function DocumentsPage() {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('documents')
    .select(
      'id, doc_type, title, status, signature_request_id, signed_at, signed_by, created_at, metadata, project_id, projects(customer_first_name, customer_last_name, project_number)'
    )
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(100);

  const rows: DocumentRow[] = (data ?? []).map((r) => {
    const p = Array.isArray(r.projects) ? r.projects[0] : r.projects;
    const meta = (r.metadata && typeof r.metadata === 'object') ? (r.metadata as Record<string, unknown>) : {};
    return {
      id: r.id as string,
      doc_type: (r.doc_type as string) ?? '',
      title: (r.title as string) ?? '',
      status: (r.status as string) ?? 'pending',
      signature_request_id: (r.signature_request_id as string | null) ?? null,
      signed_at: (r.signed_at as string | null) ?? null,
      signed_by: (r.signed_by as string | null) ?? null,
      created_at: (r.created_at as string | null) ?? null,
      recipient_email: typeof meta.recipient_email === 'string' ? meta.recipient_email : null,
      project: p
        ? {
            project_number: (p.project_number as string | null) ?? null,
            customer_first_name: (p.customer_first_name as string | null) ?? null,
            customer_last_name: (p.customer_last_name as string | null) ?? null,
          }
        : null,
    };
  });

  return <DocumentsTable rows={rows} loadError={error?.message ?? null} />;
}
