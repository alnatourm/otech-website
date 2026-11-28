/**
 * OTECH Native Sales CRM — TypeScript models
 *
 * Mirrors the live Supabase schema in `supabase/migrations/008_crm_schema.sql`
 * (project rsmevpbbilqtjoccayla). All timestamps are ISO-8601 strings
 * (`timestamptz` in Postgres); UUIDs are strings.
 */

// ---------------------------------------------------------------------------
// Enumerations
// ---------------------------------------------------------------------------

/** Pipeline stages for `crm_deals.stage`. */
export type DealStage =
  | "new_lead"
  | "contacted"
  | "proposal_sent"
  | "won"
  | "lost";

export const DEAL_STAGES: readonly DealStage[] = [
  "new_lead",
  "contacted",
  "proposal_sent",
  "won",
  "lost",
] as const;

/** Interaction types for `crm_activities.type`. */
export type ActivityType = "call" | "whatsapp" | "meeting" | "note" | "email";

export const ACTIVITY_TYPES: readonly ActivityType[] = [
  "call",
  "whatsapp",
  "meeting",
  "note",
  "email",
] as const;

/** `crm_contacts.lead_source` allowed values. */
export type LeadSource =
  | "website"
  | "whatsapp"
  | "phone"
  | "referral"
  | "ads"
  | "social_media"
  | "other";

export const LEAD_SOURCES: readonly LeadSource[] = [
  "website",
  "whatsapp",
  "phone",
  "referral",
  "ads",
  "social_media",
  "other",
] as const;

/** `crm_contacts.lead_status` allowed values. */
export type LeadStatus = "new" | "contacted" | "qualified" | "unqualified";

export const LEAD_STATUSES: readonly LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "unqualified",
] as const;

/** ISO-4217 currency code. DB default is `JOD`; `USD` is also supported. */
export type CurrencyCode = "JOD" | "USD" | (string & {});

/** Default currency for CRM deals (Jordanian Dinar). */
export const DEFAULT_CURRENCY: CurrencyCode = "JOD";

// ---------------------------------------------------------------------------
// Core entities
// ---------------------------------------------------------------------------

/** `crm_companies` row. */
export interface Company {
  id: string;
  name: string;
  industry: string | null;
  website: string | null;
  /** Defaults to `Jordan` in the DB. */
  country: string | null;
  /** Defaults to `Amman` in the DB. */
  city: string | null;
  created_at: string;
  updated_at: string;
}

/** `crm_contacts` row. */
export interface Contact {
  id: string;
  company_id: string | null;
  full_name: string;
  /** NOT NULL in DB; stored normalized as E.164 Jordanian `+9627XXXXXXXX`. */
  phone: string;
  email: string | null;
  company_name: string | null;
  /** Defaults to `Jordan`. */
  country: string | null;
  /** Defaults to `Amman`. */
  city: string | null;
  lead_source: LeadSource;
  lead_status: LeadStatus;
  /** `auth.users.id` of the assigned sales rep. */
  assigned_to: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/** `crm_deals` row. */
export interface Deal {
  id: string;
  contact_id: string | null;
  company_id: string | null;
  title: string;
  /** `numeric(12,2)`; NOT NULL, defaults to `0`. */
  value: number;
  /** NOT NULL, defaults to `JOD`. */
  currency: CurrencyCode;
  stage: DealStage;
  /** Win probability `0..100`, defaults to `10`. */
  probability: number;
  /** `date` (`YYYY-MM-DD`). */
  expected_close_date: string | null;
  /** Required (non-empty) whenever `stage === "lost"`. */
  lost_reason: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

/** `crm_activities` row. */
export interface Activity {
  id: string;
  contact_id: string | null;
  deal_id: string | null;
  type: ActivityType;
  /** NOT NULL in DB. */
  description: string;
  next_follow_up: string | null;
  /** `auth.users.id` of who logged it. */
  created_by: string | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Input payloads (writes)
// ---------------------------------------------------------------------------

/** Fields accepted when creating a contact. `full_name` + `phone` are required. */
export interface CreateContactInput {
  full_name: string;
  /** Jordanian mobile `+962 7X XXX XXXX`; normalized before storage. */
  phone: string;
  email?: string | null;
  company_id?: string | null;
  company_name?: string | null;
  country?: string | null;
  city?: string | null;
  lead_source?: LeadSource;
  lead_status?: LeadStatus;
  assigned_to?: string | null;
  notes?: string | null;
}

/** Partial contact update. `id`, `created_at`, `updated_at` are immutable. */
export type UpdateContactInput = Partial<CreateContactInput>;

/** Fields accepted when creating a deal. `title` is required. */
export interface CreateDealInput {
  title: string;
  contact_id?: string | null;
  company_id?: string | null;
  value?: number;
  currency?: CurrencyCode;
  stage?: DealStage;
  probability?: number;
  expected_close_date?: string | null;
  /** Required (non-empty) if `stage === "lost"`. */
  lost_reason?: string | null;
  assigned_to?: string | null;
}

/** Partial deal update. `id`, `created_at`, `updated_at` are immutable. */
export type UpdateDealInput = Partial<CreateDealInput>;

/** Fields accepted when logging an activity. `type` + `description` required. */
export interface LogActivityInput {
  type: ActivityType;
  description: string;
  contact_id?: string | null;
  deal_id?: string | null;
  next_follow_up?: string | null;
  /** Defaults to the authenticated user. */
  created_by?: string | null;
}

// ---------------------------------------------------------------------------
// KPI aggregates
// ---------------------------------------------------------------------------

/** Counts of deals per pipeline stage. */
export type DealsByStage = Record<DealStage, number>;

/** KPI snapshot returned by `getCRMOverviewStats()`. */
export interface CrmOverviewStats {
  totalContacts: number;
  totalCompanies: number;
  totalDeals: number;
  totalActivities: number;
  /** Deals not in `won`/`lost`. */
  openDeals: number;
  wonDeals: number;
  lostDeals: number;
  /** Count of `new` contacts. */
  newLeads: number;
  /** Sum of `value` for open deals (raw; see `valueByCurrency`). */
  totalPipelineValue: number;
  /** Sum of `value` for `won` deals. */
  wonValue: number;
  /** Sum of `value` for `lost` deals. */
  lostValue: number;
  /** Σ `value × probability / 100` for open deals. */
  weightedPipelineValue: number;
  /** `won / (won + lost) × 100`, 0 when no closed deals. */
  conversionRate: number;
  dealsByStage: DealsByStage;
  /** Per-currency totals so mixed JOD/USD pipelines stay honest. */
  valueByCurrency: Record<string, { pipeline: number; won: number; lost: number }>;
}

// ---------------------------------------------------------------------------
// Result wrapper for server actions
// ---------------------------------------------------------------------------

export type CrmActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };
