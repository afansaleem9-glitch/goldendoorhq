import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiSuccess, apiError, parsePagination, validateRequired, emitEvent } from '@/lib/api-helpers';

/*
 * MARKETING API
 * Manages email campaigns, templates, sends, and sequences.
 * Integrates with:
 * - SendGrid / Resend for actual email delivery
 * - n8n for automation triggers
 * - goldendoorapp.com for rep notifications
 */

// GET /api/marketing — List campaigns with filtering
export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const params = req.nextUrl.searchParams;
    const { page, limit, offset } = parsePagination(params);
    const type = params.get('type') || 'campaigns'; // campaigns | templates | sequences
    const status = params.get('status');

    if (type === 'campaigns') {
      let query = supabase
        .from('email_campaigns')
        .select('*, email_templates(name), contact_lists(name, member_count)', { count: 'exact' })
        .is('deleted_at', null)
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      if (status) query = query.eq('status', status);

      const { data, error, count } = await query;
      if (error) return apiError(error.message, 500);
      return apiSuccess(data, { total: count || 0, page, limit });
    }

    if (type === 'templates') {
      const { data, error, count } = await supabase
        .from('email_templates')
        .select('*', { count: 'exact' })
        .is('deleted_at', null)
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      if (error) return apiError(error.message, 500);
      return apiSuccess(data, { total: count || 0, page, limit });
    }

    if (type === 'sequences') {
      let query = supabase
        .from('sequences')
        .select('*', { count: 'exact' })
        .is('deleted_at', null)
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      if (status) query = query.eq('status', status);

      const { data, error, count } = await query;
      if (error) return apiError(error.message, 500);
      return apiSuccess(data, { total: count || 0, page, limit });
    }

    return apiError('Invalid type. Must be campaigns, templates, or sequences');
  } catch {
    return apiError('Internal server error', 500);
  }
}

// POST /api/marketing — Create campaign, template, or sequence
export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();
    const type = body.type || 'campaign';

    if (type === 'campaign') {
      const missing = validateRequired(body, ['name', 'subject']);
      if (missing) return apiError(missing);

      const { data, error } = await supabase
        .from('email_campaigns')
        .insert({
          name: body.name,
          subject: body.subject,
          from_name: body.from_name || 'GoldenDoor',
          from_email: body.from_email || 'hello@goldendoorhq.com',
          reply_to: body.reply_to,
          template_id: body.template_id,
          html_content: body.html_content,
          plain_content: body.plain_content,
          status: 'draft',
          list_id: body.list_id,
          segment_filters: body.segment_filters || {},
          send_at: body.send_at,
          organization_id: body.organization_id,
          created_by: body.created_by,
        })
        .select()
        .single();

      if (error) return apiError(error.message, 500);

      await emitEvent('marketing.campaign_created', {
        campaignId: data.id,
        name: data.name,
        subject: data.subject,
      });

      return apiSuccess(data);
    }

    if (type === 'template') {
      const missing = validateRequired(body, ['name', 'subject']);
      if (missing) return apiError(missing);

      const { data, error } = await supabase
        .from('email_templates')
        .insert({
          name: body.name,
          subject: body.subject,
          body_html: body.body_html,
          body_text: body.body_text,
          category: body.category || 'general',
          organization_id: body.organization_id,
          created_by: body.created_by,
        })
        .select()
        .single();

      if (error) return apiError(error.message, 500);
      return apiSuccess(data);
    }

    if (type === 'sequence') {
      const missing = validateRequired(body, ['name']);
      if (missing) return apiError(missing);

      const { data, error } = await supabase
        .from('sequences')
        .insert({
          name: body.name,
          description: body.description,
          steps: body.steps || [],
          settings: body.settings || {},
          organization_id: body.organization_id,
          created_by: body.created_by,
        })
        .select()
        .single();

      if (error) return apiError(error.message, 500);
      return apiSuccess(data);
    }

    return apiError('Invalid type');
  } catch {
    return apiError('Internal server error', 500);
  }
}

// PATCH /api/marketing — Update campaign, send campaign, enroll in sequence
export async function PATCH(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();
    const action = body.action; // 'update' | 'send' | 'pause' | 'cancel' | 'enroll'

    if (action === 'send' && body.campaign_id) {
      // Schedule campaign for immediate send
      const { data, error } = await supabase
        .from('email_campaigns')
        .update({ status: 'sending', send_at: new Date().toISOString() })
        .eq('id', body.campaign_id)
        .select()
        .single();

      if (error) return apiError(error.message, 500);

      // Trigger n8n to process the actual email sends
      await emitEvent('marketing.campaign_send', {
        campaignId: data.id,
        listId: data.list_id,
        subject: data.subject,
      });

      return apiSuccess(data);
    }

    if (action === 'pause' && body.campaign_id) {
      const { data, error } = await supabase
        .from('email_campaigns')
        .update({ status: 'paused' })
        .eq('id', body.campaign_id)
        .select()
        .single();

      if (error) return apiError(error.message, 500);
      return apiSuccess(data);
    }

    if (action === 'enroll' && body.sequence_id && body.contact_ids) {
      // Enroll contacts in a sequence
      const enrollments = (body.contact_ids as string[]).map(contactId => ({
        sequence_id: body.sequence_id,
        contact_id: contactId,
        organization_id: body.organization_id,
        enrolled_by: body.enrolled_by,
        next_step_at: new Date().toISOString(),
      }));

      const { data, error } = await supabase
        .from('sequence_enrollments')
        .insert(enrollments)
        .select();

      if (error) return apiError(error.message, 500);

      // Update enrolled count
      await supabase.rpc('increment_sequence_enrolled', {
        seq_id: body.sequence_id,
        count: enrollments.length,
      });

      await emitEvent('marketing.sequence_enrollment', {
        sequenceId: body.sequence_id,
        contactCount: enrollments.length,
      });

      return apiSuccess(data);
    }

    // Generic update
    if (body.campaign_id) {
      const updates: Record<string, unknown> = {};
      const fields = ['name', 'subject', 'from_name', 'from_email', 'html_content',
        'plain_content', 'list_id', 'segment_filters', 'send_at', 'template_id'];
      for (const f of fields) {
        if (body[f] !== undefined) updates[f] = body[f];
      }

      const { data, error } = await supabase
        .from('email_campaigns')
        .update(updates)
        .eq('id', body.campaign_id)
        .select()
        .single();

      if (error) return apiError(error.message, 500);
      return apiSuccess(data);
    }

    return apiError('Missing campaign_id or sequence_id');
  } catch {
    return apiError('Internal server error', 500);
  }
}
