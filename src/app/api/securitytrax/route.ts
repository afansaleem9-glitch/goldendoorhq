import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// SecurityTrax API — receives customer data from n8n workflow and imports as deals
// SecurityTrax is Delta's alarm/security customer management platform
// n8n workflow handles: Auth → Pull customers → Transform → POST here

const ORG_ID = 'a97d1a8b-3691-42a3-b116-d131e085b00f';

function json(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

// GET /api/securitytrax?action=status
export async function GET(req: NextRequest) {
  const action = req.nextUrl.searchParams.get('action') || 'status';

  try {
    switch (action) {
      case 'status':
        return json({
          connected: true,
          provider: 'SecurityTrax',
          description: 'Security/alarm customer management — active paying customers imported as deals via n8n',
          import_method: 'n8n workflow → this endpoint',
          actions: {
            read: ['status — Check connection status', 'customers — List imported SecurityTrax customers'],
            write: ['import_customer — Import a single customer as deal', 'bulk_import — Bulk import customers as deals'],
          },
        });

      case 'customers': {
        const supabase = createServerClient();
        const { data, error } = await supabase
          .from('deals')
          .select('*')
          .eq('organization_id', ORG_ID)
          .eq('source', 'SecurityTrax')
          .is('deleted_at', null)
          .order('created_at', { ascending: false });
        if (error) return json({ error: error.message }, 500);
        return json({ deals: data, count: data?.length || 0 });
      }

      default:
        return json({ error: `Unknown action: ${action}` }, 400);
    }
  } catch (err: any) {
    return json({ error: err.message }, 500);
  }
}

// POST /api/securitytrax — receive data from n8n and insert into Supabase
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ...data } = body;
    const supabase = createServerClient();

    switch (action) {
      case 'import_customer': {
        // Single customer → contact + deal
        const {
          first_name, last_name, email, phone,
          street, city, state, zip,
          account_number, monthly_rate, contract_length,
          alarm_company, panel_type, monitoring_type,
          sales_rep, status: custStatus, notes,
        } = data;

        // Create contact
        const { data: contact, error: contactErr } = await supabase.from('contacts').insert([{
          organization_id: ORG_ID,
          first_name,
          last_name,
          email: email || null,
          phone: phone || null,
          address: street || null,
          city: city || null,
          state: state || null,
          zip: zip || null,
          lead_status: 'open',
          lifecycle_stage: 'customer',
          source: 'SecurityTrax',
        }]).select();
        if (contactErr) return json({ error: contactErr.message }, 500);

        // Create deal
        const mmr = parseFloat(monthly_rate) || 0;
        const months = parseInt(contract_length) || 36;
        const dealAmount = mmr * months; // Total contract value
        const dealName = `${first_name} ${last_name} — ${monitoring_type || 'Alarm'} ${account_number ? `#${account_number}` : ''}`.trim();

        const { data: deal, error: dealErr } = await supabase.from('deals').insert([{
          organization_id: ORG_ID,
          deal_name: dealName,
          amount: dealAmount,
          deal_type: 'security',
          source: 'SecurityTrax',
          contact_id: contact?.[0]?.id,
          probability: custStatus === 'active' ? 100 : 50,
        }]).select();
        if (dealErr) return json({ error: dealErr.message }, 500);

        return json({
          success: true,
          contact: contact?.[0],
          deal: deal?.[0],
          message: `Imported ${first_name} ${last_name} — $${mmr}/mo × ${months}mo = $${dealAmount} deal`,
        });
      }

      case 'bulk_import': {
        // Array of customers from n8n
        const { records } = data;
        if (!records || !Array.isArray(records)) return json({ error: 'records array required' }, 400);

        const results = [];
        let totalValue = 0;

        for (const record of records) {
          const {
            first_name, last_name, email, phone,
            street, city, state, zip,
            account_number, monthly_rate, contract_length,
            monitoring_type, status: custStatus,
          } = record;

          // Create contact
          const { data: contact } = await supabase.from('contacts').insert([{
            organization_id: ORG_ID,
            first_name: first_name || 'Unknown',
            last_name: last_name || 'Customer',
            email: email || null,
            phone: phone || null,
            address: street || null,
            city: city || null,
            state: state || null,
            zip: zip || null,
            lead_status: 'open',
            lifecycle_stage: 'customer',
            source: 'SecurityTrax',
          }]).select();

          if (contact?.[0]) {
            const mmr = parseFloat(monthly_rate) || 0;
            const months = parseInt(contract_length) || 36;
            const dealAmount = mmr * months;
            totalValue += dealAmount;
            const dealName = `${first_name || 'Unknown'} ${last_name || 'Customer'} — ${monitoring_type || 'Alarm'} ${account_number ? `#${account_number}` : ''}`.trim();

            await supabase.from('deals').insert([{
              organization_id: ORG_ID,
              deal_name: dealName,
              amount: dealAmount,
              deal_type: 'security',
              source: 'SecurityTrax',
              contact_id: contact[0].id,
              probability: custStatus === 'active' ? 100 : 50,
            }]);

            results.push({ name: `${first_name} ${last_name}`, amount: dealAmount, status: 'imported' });
          }
        }

        return json({
          success: true,
          imported: results.length,
          total_value: totalValue,
          results,
        });
      }

      default:
        return json({ error: `Unknown action: ${action}` }, 400);
    }
  } catch (err: any) {
    return json({ error: err.message }, 500);
  }
}
