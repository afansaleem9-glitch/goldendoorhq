// Supabase Edge Function: Solar Estimate Calculator
// Orchestrates Google Solar API + NREL PVWatts for comprehensive solar estimates
// Deploy: supabase functions deploy solar-estimate

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EstimateRequest {
  address: string;
  monthly_bill: number;
  roof_type?: string;
  electricity_rate?: number;
  organization_id?: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body: EstimateRequest = await req.json();
    if (!body.address || !body.monthly_bill) {
      return new Response(JSON.stringify({ error: 'address and monthly_bill required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const GOOGLE_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY') || '';
    const NREL_KEY = Deno.env.get('NREL_API_KEY') || '';
    const rate = body.electricity_rate || 0.13;

    // Step 1: Geocode address
    const geoRes = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(body.address)}&key=${GOOGLE_KEY}`);
    const geoData = await geoRes.json();
    if (!geoData.results?.length) {
      return new Response(JSON.stringify({ error: 'Address not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const { lat, lng } = geoData.results[0].geometry.location;

    // Step 2: Google Solar buildingInsights
    const solarRes = await fetch(`https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=HIGH&key=${GOOGLE_KEY}`);
    const solarData = solarRes.ok ? await solarRes.json() : null;

    // Step 3: NREL PVWatts estimation
    const annualUsage = (body.monthly_bill / rate) * 12;
    const systemCapacity = Math.ceil(annualUsage / 1400 * 10) / 10; // Rough sizing

    const pvRes = await fetch(`https://developer.nrel.gov/api/pvwatts/v8.json?api_key=${NREL_KEY}&system_capacity=${systemCapacity}&lat=${lat}&lon=${lng}&azimuth=180&tilt=${Math.round(lat)}&array_type=1&module_type=1&losses=14&timeframe=monthly`);
    const pvData = pvRes.ok ? await pvRes.json() : null;

    // Step 4: Calculate estimate
    const panelWatts = 400;
    const panelCount = solarData?.solarPotential ? Math.min(Math.ceil(systemCapacity * 1000 / panelWatts), solarData.solarPotential.maxArrayPanelsCount) : Math.ceil(systemCapacity * 1000 / panelWatts);
    const finalSystemSize = (panelCount * panelWatts) / 1000;
    const annualProduction = pvData?.outputs?.ac_annual || finalSystemSize * 1400;
    const monthlyProduction = pvData?.outputs?.ac_monthly || Array(12).fill(annualProduction / 12);
    const annualSavings = Math.min(annualProduction, annualUsage) * rate;
    const systemCost = finalSystemSize * 2800;
    const federalItc = systemCost * 0.30;
    const netCost = systemCost - federalItc;
    const paybackYears = netCost / annualSavings;

    const estimate = {
      address: geoData.results[0].formatted_address,
      coordinates: { lat, lng },
      system: {
        size_kw: Math.round(finalSystemSize * 100) / 100,
        panel_count: panelCount,
        panel_watts: panelWatts,
        annual_production_kwh: Math.round(annualProduction),
        monthly_production_kwh: Array.isArray(monthlyProduction) ? monthlyProduction.map(Math.round) : [Math.round(annualProduction / 12)],
        estimated_offset: Math.min(1, Math.round((annualProduction / annualUsage) * 100) / 100),
      },
      financial: {
        system_cost: Math.round(systemCost),
        federal_itc: Math.round(federalItc),
        net_cost: Math.round(netCost),
        annual_savings: Math.round(annualSavings),
        monthly_savings: Math.round(annualSavings / 12),
        payback_years: Math.round(paybackYears * 10) / 10,
        savings_25yr: Math.round(annualSavings * 25 * 1.03), // 3% escalator
      },
      solar_potential: solarData?.solarPotential ? {
        max_panels: solarData.solarPotential.maxArrayPanelsCount,
        max_area_sqft: Math.round(solarData.solarPotential.maxArrayAreaMeters2 * 10.764),
        sunshine_hours: solarData.solarPotential.maxSunshineHoursPerYear,
      } : null,
      solar_resource: pvData?.outputs ? {
        solrad_annual: pvData.outputs.solrad_annual,
        capacity_factor: pvData.outputs.capacity_factor,
      } : null,
    };

    // Optional: Save to Supabase
    if (body.organization_id) {
      const supabase = createClient(Deno.env.get('SUPABASE_URL') || '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '');
      await supabase.from('audit_log').insert({
        organization_id: body.organization_id,
        action: 'solar_estimate_calculated',
        details: { address: body.address, system_size: finalSystemSize, savings: annualSavings },
      });
    }

    return new Response(JSON.stringify({ success: true, data: estimate }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: `Estimate failed: ${(err as Error).message}` }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
