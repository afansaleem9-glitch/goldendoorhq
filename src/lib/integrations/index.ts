/*
 * GOLDENDOOR CRM — INTEGRATION REGISTRY
 * Central hub for all 77+ tool/API integrations
 */

export * from './google-solar';
export * from './nrel';
export * from './enphase';
export * from './solaredge';
export * from './aurora-solar';
export * from './tesla-solar';
export * from './quickbooks';
export * from './stripe-billing';
export * from './eagleview';
export * from './twilio-comms';
export * from './abc-supply';

// Provider registry for dynamic integration lookup
export const INTEGRATION_PROVIDERS = {
  // Solar
  google_solar: { name: 'Google Solar API', category: 'solar', module: 'google-solar' },
  nrel: { name: 'NREL PVWatts', category: 'solar', module: 'nrel' },
  enphase: { name: 'Enphase', category: 'solar', module: 'enphase' },
  solaredge: { name: 'SolarEdge', category: 'solar', module: 'solaredge' },
  aurora: { name: 'Aurora Solar', category: 'solar', module: 'aurora-solar' },
  eagleview: { name: 'EagleView', category: 'solar', module: 'eagleview' },
  tesla: { name: 'Tesla SolarDesigner', category: 'solar', module: 'tesla-solar' },
  opensolar: { name: 'OpenSolar', category: 'solar', module: null },

  // Financial
  stripe: { name: 'Stripe', category: 'financial', module: 'stripe-billing' },
  quickbooks: { name: 'QuickBooks Online', category: 'financial', module: 'quickbooks' },
  goodleap: { name: 'GoodLeap', category: 'financial', module: null },
  mosaic: { name: 'Mosaic', category: 'financial', module: null },
  sunlight: { name: 'Sunlight Financial', category: 'financial', module: null },
  wells_fargo: { name: 'Wells Fargo', category: 'financial', module: null },

  // Communication
  twilio: { name: 'Twilio', category: 'communication', module: 'twilio-comms' },
  sendgrid: { name: 'SendGrid', category: 'communication', module: null },
  elevenlabs: { name: 'ElevenLabs', category: 'communication', module: null },
  deepgram: { name: 'Deepgram', category: 'communication', module: null },
  ringcentral: { name: 'RingCentral', category: 'communication', module: null },

  // Storage
  supabase_storage: { name: 'Supabase Storage', category: 'storage', module: null },
  companycam: { name: 'CompanyCam', category: 'storage', module: null },
  sitecapture: { name: 'SiteCapture', category: 'storage', module: null },
  google_drive: { name: 'Google Drive', category: 'storage', module: null },
  onedrive: { name: 'OneDrive', category: 'storage', module: null },

  // Automation
  n8n: { name: 'n8n', category: 'automation', module: null },
  zapier: { name: 'Zapier', category: 'automation', module: null },
  hubspot: { name: 'HubSpot', category: 'automation', module: null },
  clerk: { name: 'Clerk', category: 'automation', module: null },
  subcontractorhub: { name: 'SubcontractorHub', category: 'automation', module: null },

  // Data
  corelogic: { name: 'CoreLogic', category: 'data', module: null },
  batchdata: { name: 'BatchData', category: 'data', module: null },
  google_maps: { name: 'Google Maps', category: 'data', module: 'google-solar' },
  apollo: { name: 'Apollo', category: 'data', module: null },
  common_room: { name: 'Common Room', category: 'data', module: null },

  // Suppliers
  abc_supply: { name: 'ABC Supply', category: 'supplier', module: 'abc-supply' },
} as const;

export type IntegrationProvider = keyof typeof INTEGRATION_PROVIDERS;
