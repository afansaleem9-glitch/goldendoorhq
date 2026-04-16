/**
 * PandaDoc template catalog + routing brain.
 *
 * Static map of known template UUIDs. `resolveTemplate(doc_type, ctx)` returns
 * the right template for a deal, or a `MissingMappingError` with an error code
 * the API surface can turn into a 422.
 *
 * Tokens listed per template were inventoried via
 *   GET /public/v1/templates/{id}/details
 * on 2026-04-16. Tokens the template doesn't declare are silently ignored by
 * PandaDoc, so `DEFAULT_PROJECT_TOKENS` in the send route is always safe to
 * pass — the map below is for documentation / DeltaOps consumers.
 */

export type Vertical = 'alarm' | 'solar' | 'roofing';
export type Financing = 'wells_fargo' | 'cash' | 'other';
export type Language = 'en' | 'es';
export type CameraCount = 3 | 4 | 5 | 6 | 7 | 8;

export type DocType =
  | 'psa'
  | 'certificate_of_completion'
  | 'smart_home_agreement'
  | 'solar_bundle_psa'
  | 'nda'
  | 'sales_commission_agreement';

export type DealContext = {
  vertical?: Vertical;
  state?: string;
  financing?: Financing;
  language?: Language;
  camera_count?: CameraCount;
};

export type TemplateEntry = {
  id: string;
  name: string;
  tokens: string[];
  notes?: string;
};

/**
 * Every PandaDoc template we know about, keyed by a stable local slug.
 * Duplicate-name templates (PandaDoc allows them) are disambiguated by slug.
 */
export const TEMPLATES: Record<string, TemplateEntry> = {
  // ----- Camera PSAs (Delta PSA 2025 series) -----
  psa_alarm_3cam: {
    id: 'x7sD8bmARvDMG9JpeZ2wRa',
    name: 'Delta PSA 2025 (3 Cameras)',
    tokens: [
      'Document.Signed.date',
      'Sales Rep.FirstName',
      'Sales Rep.LastName',
      'Salesperson.name',
      'Sender.Company',
      'Sender.FirstName',
      'Sender.LastName',
    ],
  },
  psa_alarm_4cam: {
    id: 'cRUtQeTU3BXEAXnzFX6sK7',
    name: 'Delta PSA 2025 (4 Cameras)',
    tokens: [],
    notes: 'Tokens TBD — same family as 3-cam, inventory before wiring.',
  },
  psa_alarm_5cam: {
    id: 'GX5UXzRMz6DAGGYpJJhDA3',
    name: 'Delta PSA 2025 (5 Cameras)',
    tokens: [],
    notes: 'Tokens TBD — same family as 3-cam, inventory before wiring.',
  },
  psa_alarm_6cam: {
    id: 'jt952y8fvEvdL6hR5aNube',
    name: 'Delta PSA 2025 (6 Cameras)',
    tokens: [],
    notes: 'Tokens TBD — same family as 3-cam, inventory before wiring.',
  },
  psa_alarm_7cam: {
    id: 'FdTsszxQbmJi99LczatMLF',
    name: 'Delta PSA 2025 (7 Cameras)',
    tokens: [],
    notes: 'Tokens TBD — same family as 3-cam, inventory before wiring.',
  },
  psa_alarm_8cam: {
    id: 'TjoLutXJ6Q67Xns5NqmfEo',
    name: 'Delta PSA 2025 (8 Cameras)',
    tokens: [],
    notes: 'Tokens TBD — same family as 3-cam, inventory before wiring.',
  },

  // ----- Solar bundle PSA -----
  psa_solar_bundle: {
    id: 'okjwHGbmeu4AsiMejuZVKQ',
    name: 'Delta Smart-home PSA (Solar Bundle)',
    tokens: [
      'Client.City',
      'Client.Email',
      'Client.FirstName',
      'Client.LastName',
      'Client.Phone',
      'Client.PostalCode',
      'Client.State',
      'Client.StreetAddress',
    ],
    notes: 'A near-duplicate "Delta Smarthome PSA (Solar Bundle).pdf" (3n5DXGFu7JLc46tEQAxDMk) exists — confirm with Afan which is canonical.',
  },

  // ----- Smart Home Agreement -----
  smart_home_agreement: {
    id: 'JnPPKAujaDo3e6qNAm7arj',
    name: 'Smart Home Agreement',
    tokens: [],
    notes: 'No tokens/fields declared on template — confirm with Afan this is the right one.',
  },

  // ----- Certificate of Completion -----
  certificate_of_completion: {
    id: 'QQ59tYkpvoeJHXznjnhr8Q',
    name: 'Certificate of Completion',
    tokens: [],
    notes: 'Duplicate template "Certificate of Completion" (5oiCZrxEVtbgCDyqfW2KEH) also exists — confirm which is canonical.',
  },

  // ----- NDA -----
  nda: {
    id: '3BPdVMJBbRSRAJmW4bGAXe',
    name: 'NDA',
    tokens: [],
    notes: 'Duplicate NDA template (zGZnssLDkGRTG7in4o9BJ8) also exists — confirm canonical.',
  },

  // ----- Sales Commission Agreement -----
  sales_commission_agreement: {
    id: 'cGLnAbhFXKtsMofw7VBqzb',
    name: 'Sales Commission Agreement Template',
    tokens: [
      'Employer.Company',
      'Employer.FirstName',
      'Employer.LastName',
      'Representative.Company',
      'Representative.FirstName',
      'Representative.LastName',
      'Representative.State',
      'Representative.Title',
    ],
  },

  // ----- Unrouted-but-catalogued (not reachable via resolveTemplate yet) -----
  // Kept here so the map is complete; routing rules to be added as Afan confirms.
  affidavit_project_completion_lien_waiver: {
    id: 'ybMq7zqLXtxNivWY8NUyMA',
    name: 'Affidavit of Project Completion & Lien Waiver',
    tokens: [],
    notes: 'Possible match for state-specific NOC routing — needs confirmation.',
  },
  installer_contract: {
    id: 'GFaFKztXUDuwH7WPuVzZCD',
    name: 'Installer Contract template',
    tokens: [],
  },
  delta_tech_employment_2026: {
    id: '5ZBGnXfRFm8poHpBjck7xY',
    name: 'Delta Technician Employment Agreement 2026',
    tokens: [],
  },
  post_install_survey: {
    id: 'N9k7ZLU2d7PABEfCFUAuDP',
    name: 'Post Install Survey',
    tokens: [],
  },
  home_automation_invoice: {
    id: 'U9TFAubsCnTX7DRuTkxm5M',
    name: 'Home Automation Invoice',
    tokens: [],
  },
  pre_pto_payment_request: {
    id: 'Gv87Y6AqAhmNgdPRRfRT3S',
    name: 'Pre PTO Payment Request template',
    tokens: [],
    notes: 'Three near-duplicates exist (BjFcvJXXiGWANkzbKpyPRJ, eJbB2ZrqpGYjeUBTVmuWWd, BAXfNahdMWUw2ZjbHYXiP3) — confirm canonical.',
  },
};

// -------------------------------------------------------------------------

export class MissingMappingError extends Error {
  code: 'template_mapping_missing';
  detail: string;
  constructor(detail: string) {
    super(`template_mapping_missing: ${detail}`);
    this.code = 'template_mapping_missing';
    this.detail = detail;
  }
}

/**
 * Resolve a template from doc_type + deal context. Throws MissingMappingError
 * when we know about the routing rule conceptually but no template has been
 * mapped yet (TODOs below). Unknown doc_type falls through to the same error.
 */
export function resolveTemplate(docType: DocType, ctx: DealContext): TemplateEntry {
  switch (docType) {
    case 'psa': {
      // TODO(Afan): Spanish PSA variant. No Spanish template is currently
      // visible in the PandaDoc account. Until one is uploaded, fail loud
      // rather than silently falling back to English — otherwise Spanish-
      // speaking clients get an English contract.
      if (ctx.language === 'es') {
        throw new MissingMappingError(
          'Spanish-language PSA template not mapped. Need from Afan: upload Spanish variants (per camera count?) or confirm English fallback is OK.'
        );
      }

      // TODO(Afan): Wells Fargo split-PSA variant. Brief mentions a WF-specific
      // variant but no template with "Wells Fargo" in its name exists in the
      // account. Fail loud.
      if (ctx.financing === 'wells_fargo') {
        throw new MissingMappingError(
          'Wells Fargo PSA variant not mapped. Need from Afan: template UUID for the Wells Fargo split-PSA, or confirm the regular camera-count PSA is used with a token.'
        );
      }

      if (ctx.vertical === 'solar') {
        return TEMPLATES.psa_solar_bundle;
      }

      if (ctx.vertical === 'alarm') {
        const n = ctx.camera_count;
        if (!n) {
          throw new MissingMappingError(
            'Alarm PSA requires camera_count (3–8). Need from Afan: default behaviour when camera count is unknown? (Today we 422.)'
          );
        }
        const slug = `psa_alarm_${n}cam` as keyof typeof TEMPLATES;
        const entry = TEMPLATES[slug];
        if (!entry) {
          throw new MissingMappingError(
            `No template for alarm PSA with ${n} cameras. Need from Afan: confirm camera counts outside 3–8 exist.`
          );
        }
        return entry;
      }

      if (ctx.vertical === 'roofing') {
        throw new MissingMappingError(
          'Roofing PSA not mapped. Need from Afan: is there a roofing-specific PSA template, or should we reuse another doc type?'
        );
      }

      throw new MissingMappingError(
        `PSA routing needs vertical. Got vertical=${ctx.vertical ?? 'null'}.`
      );
    }

    case 'solar_bundle_psa':
      return TEMPLATES.psa_solar_bundle;

    case 'smart_home_agreement':
      return TEMPLATES.smart_home_agreement;

    case 'certificate_of_completion': {
      // TODO(Afan): state-specific NOC routing. "Affidavit of Project
      // Completion & Lien Waiver" may be the FL/TX NOC — unconfirmed. For
      // now we always return the generic CoC and log the state.
      //
      // Need from Afan: which states require the Affidavit/Lien-Waiver variant
      // vs the generic Certificate of Completion?
      return TEMPLATES.certificate_of_completion;
    }

    case 'nda':
      return TEMPLATES.nda;

    case 'sales_commission_agreement':
      return TEMPLATES.sales_commission_agreement;

    default: {
      const exhaustive: never = docType;
      throw new MissingMappingError(`Unknown doc_type: ${String(exhaustive)}`);
    }
  }
}

/**
 * Reverse-lookup: a template UUID → its catalog slug. Useful for
 * storing a human-readable breadcrumb alongside the UUID in
 * `documents.metadata`.
 */
export function slugForTemplateId(templateId: string): string | null {
  for (const [slug, entry] of Object.entries(TEMPLATES)) {
    if (entry.id === templateId) return slug;
  }
  return null;
}

// -------------------------------------------------------------------------
// Catalog view — drives the /documents/templates page. Lists ALL 27 templates
// visible in the PandaDoc account, including duplicates and unrouted ones.
// Status mirrors the "Unresolved routing TODOs" section of
// status-2026-04-16.md.

export type TemplateCategory = 'PSA' | 'Certificate' | 'NDA' | 'Commission' | 'Smart Home' | 'Solar' | 'Pre-PTO' | 'Employment' | 'Survey' | 'Invoice' | 'Other';
export type TemplateCatalogStatus = 'wired' | 'need_input' | 'not_mapped';

export type CatalogEntry = {
  id: string;
  name: string;
  category: TemplateCategory;
  status: TemplateCatalogStatus;
  needFromAfan?: string;
};

export const TEMPLATE_CATALOG: CatalogEntry[] = [
  // 🟢 Wired — reachable via resolveTemplate, tokens inventoried
  { id: 'x7sD8bmARvDMG9JpeZ2wRa', name: 'Delta PSA 2025 (3 Cameras)', category: 'PSA', status: 'wired' },
  { id: 'okjwHGbmeu4AsiMejuZVKQ', name: 'Delta Smart-home PSA (Solar Bundle)', category: 'Solar', status: 'wired' },
  { id: 'cGLnAbhFXKtsMofw7VBqzb', name: 'Sales Commission Agreement Template', category: 'Commission', status: 'wired' },

  // 🟡 Need Afan input — wired but with caveats
  {
    id: 'cRUtQeTU3BXEAXnzFX6sK7',
    name: 'Delta PSA 2025 (4 Cameras)',
    category: 'PSA',
    status: 'need_input',
    needFromAfan: 'Token inventory not done for 4-cam variant. Confirm same shape as 3-cam, or share template structure.',
  },
  {
    id: 'GX5UXzRMz6DAGGYpJJhDA3',
    name: 'Delta PSA 2025 (5 Cameras)',
    category: 'PSA',
    status: 'need_input',
    needFromAfan: 'Token inventory not done for 5-cam variant. Confirm same shape as 3-cam, or share template structure.',
  },
  {
    id: 'jt952y8fvEvdL6hR5aNube',
    name: 'Delta PSA 2025 (6 Cameras)',
    category: 'PSA',
    status: 'need_input',
    needFromAfan: 'Token inventory not done for 6-cam variant. Confirm same shape as 3-cam, or share template structure.',
  },
  {
    id: 'FdTsszxQbmJi99LczatMLF',
    name: 'Delta PSA 2025 (7 Cameras)',
    category: 'PSA',
    status: 'need_input',
    needFromAfan: 'Token inventory not done for 7-cam variant. Confirm same shape as 3-cam, or share template structure.',
  },
  {
    id: 'TjoLutXJ6Q67Xns5NqmfEo',
    name: 'Delta PSA 2025 (8 Cameras)',
    category: 'PSA',
    status: 'need_input',
    needFromAfan: 'Token inventory not done for 8-cam variant. Confirm same shape as 3-cam, or share template structure.',
  },
  {
    id: 'JnPPKAujaDo3e6qNAm7arj',
    name: 'Smart Home Agreement',
    category: 'Smart Home',
    status: 'need_input',
    needFromAfan: 'Template declares no tokens or fields. Confirm this is the right template, and what tokens (if any) it should expose.',
  },
  {
    id: 'QQ59tYkpvoeJHXznjnhr8Q',
    name: 'Certificate of Completion',
    category: 'Certificate',
    status: 'need_input',
    needFromAfan: 'A duplicate "Certificate of Completion" (5oiCZrxEVtbgCDyqfW2KEH) also exists. Confirm which is canonical, plus which states require the Affidavit/Lien-Waiver variant.',
  },
  {
    id: '3BPdVMJBbRSRAJmW4bGAXe',
    name: 'NDA',
    category: 'NDA',
    status: 'need_input',
    needFromAfan: 'A duplicate NDA template (zGZnssLDkGRTG7in4o9BJ8) exists. Confirm canonical version.',
  },
  {
    id: 'ybMq7zqLXtxNivWY8NUyMA',
    name: 'Affidavit of Project Completion & Lien Waiver',
    category: 'Certificate',
    status: 'need_input',
    needFromAfan: 'Possible match for state-specific NOC routing. Which states require this variant instead of the generic Certificate of Completion?',
  },

  // 🟡 Duplicates of wired templates — pick canonical
  {
    id: '5oiCZrxEVtbgCDyqfW2KEH',
    name: 'Certificate of Completion (duplicate)',
    category: 'Certificate',
    status: 'need_input',
    needFromAfan: 'Duplicate of QQ59tYkpvoeJHXznjnhr8Q. Confirm which is canonical or delete one.',
  },
  {
    id: 'zGZnssLDkGRTG7in4o9BJ8',
    name: 'NDA (duplicate)',
    category: 'NDA',
    status: 'need_input',
    needFromAfan: 'Duplicate of 3BPdVMJBbRSRAJmW4bGAXe. Confirm canonical or delete one.',
  },
  {
    id: '3n5DXGFu7JLc46tEQAxDMk',
    name: 'Delta Smarthome PSA (Solar Bundle).pdf',
    category: 'Solar',
    status: 'need_input',
    needFromAfan: 'Near-duplicate of okjwHGbmeu4AsiMejuZVKQ. Confirm which is canonical (the .pdf one looks like a source upload).',
  },
  {
    id: 'tPPb5r7tcNJjTXdVR7mAv3',
    name: 'Delta Technician Employment Agreement 2026.docx',
    category: 'Employment',
    status: 'need_input',
    needFromAfan: 'Duplicate of 5ZBGnXfRFm8poHpBjck7xY (.docx vs primary). Confirm canonical.',
  },
  {
    id: 'w7MfYVB9CD7DgUpyUBXrwi',
    name: 'Delta PSA 2025 (6 Cameras) copy 3',
    category: 'PSA',
    status: 'need_input',
    needFromAfan: 'Looks like a leftover scratch copy of jt952y8fvEvdL6hR5aNube. Safe to delete?',
  },

  // ⚪ Not mapped — exists in PandaDoc, no routing rule yet
  {
    id: 'GFaFKztXUDuwH7WPuVzZCD',
    name: 'Installer Contract template',
    category: 'Employment',
    status: 'not_mapped',
  },
  {
    id: '5ZBGnXfRFm8poHpBjck7xY',
    name: 'Delta Technician Employment Agreement 2026',
    category: 'Employment',
    status: 'not_mapped',
  },
  {
    id: 'N9k7ZLU2d7PABEfCFUAuDP',
    name: 'Post Install Survey',
    category: 'Survey',
    status: 'not_mapped',
  },
  {
    id: 'U9TFAubsCnTX7DRuTkxm5M',
    name: 'Home Automation Invoice',
    category: 'Invoice',
    status: 'not_mapped',
  },
  {
    id: 'Gv87Y6AqAhmNgdPRRfRT3S',
    name: 'Pre PTO Payment Request template',
    category: 'Pre-PTO',
    status: 'not_mapped',
  },
  {
    id: 'BjFcvJXXiGWANkzbKpyPRJ',
    name: 'Pre PTO Payment Request template copy',
    category: 'Pre-PTO',
    status: 'need_input',
    needFromAfan: 'One of four near-duplicate Pre-PTO templates. Confirm canonical version (Gv87Y6AqAhmNgdPRRfRT3S is current default).',
  },
  {
    id: 'eJbB2ZrqpGYjeUBTVmuWWd',
    name: 'Pre-PTO_Payment_Request copy',
    category: 'Pre-PTO',
    status: 'need_input',
    needFromAfan: 'One of four near-duplicate Pre-PTO templates. Confirm canonical version.',
  },
  {
    id: 'BAXfNahdMWUw2ZjbHYXiP3',
    name: 'Pre-PTO_Payment_Request',
    category: 'Pre-PTO',
    status: 'need_input',
    needFromAfan: 'One of four near-duplicate Pre-PTO templates. Confirm canonical version.',
  },
  {
    id: 'X2uHVMj5pVm736pCqQcGYL',
    name: 'New template',
    category: 'Other',
    status: 'not_mapped',
  },
  {
    id: 'VFNEP9jg2yxQzfwfPUkNxJ',
    name: 'E07EC826 2',
    category: 'Other',
    status: 'not_mapped',
  },
];

export const DOC_TYPES: DocType[] = [
  'psa',
  'certificate_of_completion',
  'smart_home_agreement',
  'solar_bundle_psa',
  'nda',
  'sales_commission_agreement',
];
