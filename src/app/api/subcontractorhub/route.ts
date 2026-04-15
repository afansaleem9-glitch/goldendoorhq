import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// SubcontractorHub API — bridges MCP connector to CRM
// Connected via Zapier MCP: create_customer, create_project, get_project, update_customer, update_project, update_stages, create_lead, add_materials

const ORG_ID = 'a97d1a8b-3691-42a3-b116-d131e085b00f';

function json(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

// GET /api/subcontractorhub?action=status
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const action = params.get('action') || 'status';

  try {
    switch (action) {
      case 'status':
        return json({
          connected: true,
          provider: 'SubcontractorHub',
          description: 'Subcontractor management, work orders, material tracking, project stages, and customer CRM for Delta Power Group',
          actions: {
            read: [
              'get_project — Fetch a project by unique ID',
            ],
            write: [
              'create_customer — Create a new customer record',
              'create_project — Create a new solar/roofing project',
              'create_lead — Create a lead in SubHub CRM',
              'update_customer — Update customer info',
              'update_project — Update project details',
              'update_stages — Update project stage fields',
              'add_materials — Add materials to a project',
              'add_material_type — Add a material type category',
            ],
          },
          sync_status: 'Use the sync endpoint to import SubHub projects into GoldenDoor CRM',
        });

      case 'customers':
        // List customers already synced into Supabase
        const supabase = createServerClient();
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('organization_id', ORG_ID)
          .is('deleted_at', null)
          .order('created_at', { ascending: false });
        if (error) return json({ error: error.message }, 500);
        return json({ customers: data, count: data?.length || 0 });

      default:
        return json({ error: `Unknown action: ${action}` }, 400);
    }
  } catch (err: any) {
    return json({ error: err.message }, 500);
  }
}

// POST /api/subcontractorhub — sync data to Supabase
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ...data } = body;
    const supabase = createServerClient();

    switch (action) {
      case 'import_customer': {
        // Insert a customer record from SubHub data into Supabase
        const { first_name, last_name, email, phone, street, city, state, postal_code, lead_source, job_type, notes } = data;
        const { data: inserted, error } = await supabase.from('customers').insert([{
          organization_id: ORG_ID,
          first_name,
          last_name,
          email,
          phone,
          address_line1: street,
          city,
          state,
          zip: postal_code,
          source: lead_source || 'SubcontractorHub',
          customer_type: job_type || 'solar',
          notes: notes || `Imported from SubcontractorHub`,
        }]).select();
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, customer: inserted?.[0] });
      }

      case 'import_project': {
        // Insert a project as a deal + contact into Supabase
        const { first_name, last_name, email, phone, street, city, state, postal_code, system_size_kw, contract_amount, finance_partner, current_stage, sales_rep, module_manufacturer, inverter_manufacturer, job_type } = data;

        // Create contact first
        const { data: contact, error: contactErr } = await supabase.from('contacts').insert([{
          organization_id: ORG_ID,
          first_name,
          last_name,
          email,
          phone,
          address: street,
          city,
          state,
          zip: postal_code,
          lead_status: 'open',
          lifecycle_stage: 'customer',
          source: 'SubcontractorHub',
        }]).select();
        if (contactErr) return json({ error: contactErr.message }, 500);

        // Create deal
        const dealName = `${first_name} ${last_name} — ${system_size_kw || '?'}kW ${job_type || 'Solar'}`;
        const { data: deal, error: dealErr } = await supabase.from('deals').insert([{
          organization_id: ORG_ID,
          deal_name: dealName,
          amount: parseFloat(contract_amount) || 0,
          deal_type: job_type || 'solar',
          source: 'SubcontractorHub',
          contact_id: contact?.[0]?.id,
          probability: 80,
        }]).select();
        if (dealErr) return json({ error: dealErr.message }, 500);

        return json({
          success: true,
          contact: contact?.[0],
          deal: deal?.[0],
          message: `Imported ${first_name} ${last_name} as contact + deal from SubcontractorHub`,
        });
      }

      case 'bulk_import': {
        // Import multiple records at once
        const { records } = data;
        if (!records || !Array.isArray(records)) return json({ error: 'records array required' }, 400);

        const results = [];
        for (const record of records) {
          const { first_name, last_name, email, phone, street, city, state, postal_code, system_size_kw, contract_amount, job_type } = record;

          const { data: contact } = await supabase.from('contacts').insert([{
            organization_id: ORG_ID,
            first_name,
            last_name,
            email,
            phone,
            address: street,
            city,
            state,
            zip: postal_code,
            lead_status: 'open',
            lifecycle_stage: 'customer',
            source: 'SubcontractorHub',
          }]).select();

          if (contact?.[0]) {
            const dealName = `${first_name} ${last_name} — ${system_size_kw || '?'}kW ${job_type || 'Solar'}`;
            await supabase.from('deals').insert([{
              organization_id: ORG_ID,
              deal_name: dealName,
              amount: parseFloat(contract_amount) || 0,
              deal_type: job_type || 'solar',
              source: 'SubcontractorHub',
              contact_id: contact[0].id,
            }]);
            results.push({ name: `${first_name} ${last_name}`, status: 'imported' });
          }
        }

        return json({ success: true, imported: results.length, results });
      }

      default:
        return json({ error: `Unknown action: ${action}` }, 400);
    }
  } catch (err: any) {
    return json({ error: err.message }, 500);
  }
}
