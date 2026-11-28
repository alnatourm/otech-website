/**
 * OTECH Native Sales CRM — server-side data access layer.
 *
 * Uses the project's existing Supabase **server** client
 * (`@/lib/supabase/server`, `@supabase/ssr` request-scoped, anon key +
 * the caller's auth cookies). No service-role key: Row Level Security is
 * NOT bypassed. Every function additionally enforces, in code, that there
 * is an **authenticated** user (`supabase.auth.getUser()`), matching the
 * RLS policies `TO authenticated` in migration 008. Anonymous callers are
 * rejected with `UnauthorizedError`.
 *
 * SERVER ONLY — never import this module from a Client Component.
 */

import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "../supabase/server";
import {
  DatabaseError,
  LostReasonRequiredError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "./errors";
import {
  assertLostReason,
  isLeadSource,
  isLeadStatus,
  normalizeEmail,
  normalizeProbability,
  requireActivityType,
  requireDealStage,
  requireFiniteNumber,
  requireJordanianPhone,
  requireNonEmpty,
} from "./validation";
import {
  DEFAULT_CURRENCY,
  type Activity,
  type Contact,
  type CreateContactInput,
  type CreateDealInput,
  type CrmOverviewStats,
  type Deal,
  type DealStage,
  type DealsByStage,
  type LogActivityInput,
  type UpdateContactInput,
  type UpdateDealInput,
} from "./types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CRM_CONTACTS = "crm_contacts";
const CRM_DEALS = "crm_deals";
const CRM_ACTIVITIES = "crm_activities";
const CRM_COMPANIES = "crm_companies";

// ---------------------------------------------------------------------------
// Auth + helpers
// ---------------------------------------------------------------------------

/** Create a request-scoped server client and require an authenticated user (RLS `authenticated`). */
async function getAuthedClient(): Promise<{ supabase: SupabaseClient; user: User }> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    throw new UnauthorizedError();
  }
  return { supabase, user: data.user };
}

/** Strip `undefined` values so PATCH-style updates only touch provided fields. */
function definedOnly<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Partial<T> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) (out as Record<string, unknown>)[k] = v;
  }
  return out;
}

function dbError(context: string, error: { message?: string } | null): never {
  throw new DatabaseError(`${context}: ${error?.message ?? "unknown database error"}`);
}

// ---------------------------------------------------------------------------
// Contacts (crm_contacts)
// ---------------------------------------------------------------------------

export interface GetContactsOptions {
  lead_status?: Contact["lead_status"];
  lead_source?: Contact["lead_source"];
  /** Substring match on full_name / email / phone / company_name. */
  search?: string;
  limit?: number;
  offset?: number;
}

/** `getContacts()` — list contacts (RLS-scoped, newest first). */
export async function getContacts(options: GetContactsOptions = {}): Promise<Contact[]> {
  const { supabase } = await getAuthedClient();

  let query = supabase.from(CRM_CONTACTS).select("*");

  if (options.lead_status) query = query.eq("lead_status", options.lead_status);
  if (options.lead_source) query = query.eq("lead_source", options.lead_source);
  if (options.search && options.search.trim() !== "") {
    const term = options.search.trim().replace(/[%_,()]/g, "");
    query = query.or(
      `full_name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%,company_name.ilike.%${term}%`
    );
  }

  query = query.order("created_at", { ascending: false });

  if (options.limit != null) {
    const from = options.offset ?? 0;
    query = query.range(from, from + Math.max(0, options.limit) - 1);
  } else if (options.offset != null) {
    query = query.range(options.offset, options.offset + 999);
  }

  const { data, error } = await query;
  if (error) dbError("getContacts", error);
  return (data ?? []) as Contact[];
}

/** `createContact()` — insert a contact after validation. Jordanian phone enforced. */
export async function createContact(input: CreateContactInput): Promise<Contact> {
  const { supabase } = await getAuthedClient();

  const full_name = requireNonEmpty(input?.full_name, "full_name");
  const phone = requireJordanianPhone(input?.phone); // +962 7X XXX XXXX
  const email = normalizeEmail(input?.email ?? null);

  if (input.lead_source !== undefined && !isLeadSource(input.lead_source)) {
    throw new ValidationError(`Invalid lead_source: ${String(input.lead_source)}`);
  }
  if (input.lead_status !== undefined && !isLeadStatus(input.lead_status)) {
    throw new ValidationError(`Invalid lead_status: ${String(input.lead_status)}`);
  }

  const row = definedOnly({
    full_name,
    phone,
    email,
    company_id: input.company_id ?? null,
    company_name: input.company_name?.trim() || null,
    country: input.country?.trim() || null,
    city: input.city?.trim() || null,
    lead_source: input.lead_source ?? "website",
    lead_status: input.lead_status ?? "new",
    assigned_to: input.assigned_to ?? null,
    notes: input.notes ?? null,
  });

  const { data, error } = await supabase.from(CRM_CONTACTS).insert(row).select("*").single();
  if (error) dbError("createContact", error);
  return data as Contact;
}

/** `updateContact()` — partial update. Re-validates phone/email/enums when present. */
export async function updateContact(id: string, input: UpdateContactInput): Promise<Contact> {
  const { supabase } = await getAuthedClient();
  requireNonEmpty(id, "id");

  const patch: Record<string, unknown> = {};

  if (input.full_name !== undefined) patch.full_name = requireNonEmpty(input.full_name, "full_name");
  if (input.phone !== undefined) patch.phone = requireJordanianPhone(input.phone);
  if (input.email !== undefined) patch.email = normalizeEmail(input.email);
  if (input.company_id !== undefined) patch.company_id = input.company_id;
  if (input.company_name !== undefined) patch.company_name = input.company_name?.trim() || null;
  if (input.country !== undefined) patch.country = input.country?.trim() || null;
  if (input.city !== undefined) patch.city = input.city?.trim() || null;
  if (input.lead_source !== undefined) {
    if (!isLeadSource(input.lead_source)) {
      throw new ValidationError(`Invalid lead_source: ${String(input.lead_source)}`);
    }
    patch.lead_source = input.lead_source;
  }
  if (input.lead_status !== undefined) {
    if (!isLeadStatus(input.lead_status)) {
      throw new ValidationError(`Invalid lead_status: ${String(input.lead_status)}`);
    }
    patch.lead_status = input.lead_status;
  }
  if (input.assigned_to !== undefined) patch.assigned_to = input.assigned_to;
  if (input.notes !== undefined) patch.notes = input.notes;

  if (Object.keys(patch).length === 0) {
    throw new ValidationError("updateContact requires at least one field to update.");
  }

  const { data, error } = await supabase
    .from(CRM_CONTACTS)
    .update(patch)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) dbError("updateContact", error);
  if (!data) throw new NotFoundError(`Contact ${id} not found.`);
  return data as Contact;
}

/** `deleteContact()` — delete a contact (RLS-scoped). Returns the deleted id. */
export async function deleteContact(id: string): Promise<{ id: string }> {
  const { supabase } = await getAuthedClient();
  requireNonEmpty(id, "id");

  const { data, error } = await supabase
    .from(CRM_CONTACTS)
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) dbError("deleteContact", error);
  if (!data) throw new NotFoundError(`Contact ${id} not found.`);
  return { id: (data as { id: string }).id };
}

// ---------------------------------------------------------------------------
// Deals (crm_deals)
// ---------------------------------------------------------------------------

export interface GetDealsOptions {
  stage?: DealStage;
  contact_id?: string;
  company_id?: string;
  limit?: number;
  offset?: number;
}

/** `getDeals()` — list deals (RLS-scoped, newest first). */
export async function getDeals(options: GetDealsOptions = {}): Promise<Deal[]> {
  const { supabase } = await getAuthedClient();

  let query = supabase.from(CRM_DEALS).select("*");

  if (options.stage) query = query.eq("stage", requireDealStage(options.stage));
  if (options.contact_id) query = query.eq("contact_id", options.contact_id);
  if (options.company_id) query = query.eq("company_id", options.company_id);

  query = query.order("created_at", { ascending: false });

  if (options.limit != null) {
    const from = options.offset ?? 0;
    query = query.range(from, from + Math.max(0, options.limit) - 1);
  } else if (options.offset != null) {
    query = query.range(options.offset, options.offset + 999);
  }

  const { data, error } = await query;
  if (error) dbError("getDeals", error);
  return (data ?? []) as Deal[];
}

/** `createDeal()` — insert a deal. Enforces `lost_reason` when `stage === "lost"`. */
export async function createDeal(input: CreateDealInput): Promise<Deal> {
  const { supabase } = await getAuthedClient();

  const title = requireNonEmpty(input?.title, "title");
  const stage: DealStage = input.stage !== undefined ? requireDealStage(input.stage) : "new_lead";
  const value = input.value !== undefined ? requireFiniteNumber(input.value, "value") : 0;
  if (value < 0) throw new ValidationError("`value` must not be negative.");
  const probability = normalizeProbability(input.probability, 10);
  const lost_reason = input.lost_reason?.trim() || null;

  // Business rule + DB constraint `chk_lost_reason`.
  assertLostReason(stage, lost_reason);

  const row = definedOnly({
    title,
    contact_id: input.contact_id ?? null,
    company_id: input.company_id ?? null,
    value,
    currency: (input.currency?.trim() || DEFAULT_CURRENCY) as string,
    stage,
    probability,
    expected_close_date: input.expected_close_date ?? null,
    lost_reason,
    assigned_to: input.assigned_to ?? null,
  });

  const { data, error } = await supabase.from(CRM_DEALS).insert(row).select("*").single();
  if (error) dbError("createDeal", error);
  return data as Deal;
}

/** `updateDealStage()` — move a deal to a new pipeline stage. `lost` requires `lost_reason`. */
export async function updateDealStage(
  dealId: string,
  stage: DealStage,
  lostReason?: string | null
): Promise<Deal> {
  const { supabase } = await getAuthedClient();
  requireNonEmpty(dealId, "dealId");
  const nextStage = requireDealStage(stage);

  // Fetch current row to compute the effective invariant + confirm existence.
  const { data: existing, error: readError } = await supabase
    .from(CRM_DEALS)
    .select("*")
    .eq("id", dealId)
    .maybeSingle();
  if (readError) dbError("updateDealStage", readError);
  if (!existing) throw new NotFoundError(`Deal ${dealId} not found.`);

  const current = existing as Deal;
  const patch: Record<string, unknown> = { stage: nextStage };

  let effectiveLostReason: string | null = current.lost_reason ?? null;
  if (lostReason !== undefined) {
    effectiveLostReason = lostReason?.trim() || null;
    patch.lost_reason = effectiveLostReason;
  }

  // Strictly: moving to `lost` requires a non-empty reason on the resulting row.
  if (nextStage === "lost" && (effectiveLostReason == null || effectiveLostReason.trim() === "")) {
    throw new LostReasonRequiredError();
  }
  assertLostReason(nextStage, effectiveLostReason);

  // Clearing lost_reason when leaving `lost` is allowed; stale text on a
  // non-lost deal never violates the DB constraint.
  const { data, error } = await supabase
    .from(CRM_DEALS)
    .update(patch)
    .eq("id", dealId)
    .select("*")
    .single();

  if (error) dbError("updateDealStage", error);
  return data as Deal;
}

/** `updateDeal()` — partial deal update. Re-validates `stage`/`lost_reason` invariant on merged state. */
export async function updateDeal(dealId: string, input: UpdateDealInput): Promise<Deal> {
  const { supabase } = await getAuthedClient();
  requireNonEmpty(dealId, "dealId");

  const { data: existing, error: readError } = await supabase
    .from(CRM_DEALS)
    .select("*")
    .eq("id", dealId)
    .maybeSingle();
  if (readError) dbError("updateDeal", readError);
  if (!existing) throw new NotFoundError(`Deal ${dealId} not found.`);
  const current = existing as Deal;

  const patch: Record<string, unknown> = {};

  if (input.title !== undefined) patch.title = requireNonEmpty(input.title, "title");
  if (input.contact_id !== undefined) patch.contact_id = input.contact_id;
  if (input.company_id !== undefined) patch.company_id = input.company_id;
  if (input.value !== undefined) {
    const v = requireFiniteNumber(input.value, "value");
    if (v < 0) throw new ValidationError("`value` must not be negative.");
    patch.value = v;
  }
  if (input.currency !== undefined) patch.currency = requireNonEmpty(input.currency, "currency");
  if (input.stage !== undefined) patch.stage = requireDealStage(input.stage);
  if (input.probability !== undefined) patch.probability = normalizeProbability(input.probability, current.probability);
  if (input.expected_close_date !== undefined) patch.expected_close_date = input.expected_close_date;
  if (input.lost_reason !== undefined) patch.lost_reason = input.lost_reason?.trim() || null;
  if (input.assigned_to !== undefined) patch.assigned_to = input.assigned_to;

  if (Object.keys(patch).length === 0) {
    throw new ValidationError("updateDeal requires at least one field to update.");
  }

  // Merged-state invariant: stage==='lost' requires non-empty lost_reason.
  const mergedStage: DealStage = (patch.stage as DealStage | undefined) ?? current.stage;
  const mergedLostReason: string | null =
    (patch.lost_reason as string | null | undefined) !== undefined
      ? (patch.lost_reason as string | null)
      : current.lost_reason ?? null;
  assertLostReason(mergedStage, mergedLostReason);

  const { data, error } = await supabase
    .from(CRM_DEALS)
    .update(patch)
    .eq("id", dealId)
    .select("*")
    .single();

  if (error) dbError("updateDeal", error);
  return data as Deal;
}

// ---------------------------------------------------------------------------
// Activities (crm_activities)
// ---------------------------------------------------------------------------

export interface GetActivitiesOptions {
  contact_id?: string;
  deal_id?: string;
  type?: Activity["type"];
  limit?: number;
  offset?: number;
}

/** `getActivities()` — list activities (RLS-scoped, newest first). */
export async function getActivities(options: GetActivitiesOptions = {}): Promise<Activity[]> {
  const { supabase } = await getAuthedClient();

  let query = supabase.from(CRM_ACTIVITIES).select("*");

  if (options.contact_id) query = query.eq("contact_id", options.contact_id);
  if (options.deal_id) query = query.eq("deal_id", options.deal_id);
  if (options.type) query = query.eq("type", requireActivityType(options.type));

  query = query.order("created_at", { ascending: false });

  if (options.limit != null) {
    const from = options.offset ?? 0;
    query = query.range(from, from + Math.max(0, options.limit) - 1);
  } else if (options.offset != null) {
    query = query.range(options.offset, options.offset + 999);
  }

  const { data, error } = await query;
  if (error) dbError("getActivities", error);
  return (data ?? []) as Activity[];
}

/** `logActivity()` — record an interaction. `created_by` defaults to the authenticated user. */
export async function logActivity(input: LogActivityInput): Promise<Activity> {
  const { supabase, user } = await getAuthedClient();

  const type = requireActivityType(input?.type);
  const description = requireNonEmpty(input?.description, "description");

  const row = definedOnly({
    type,
    description,
    contact_id: input.contact_id ?? null,
    deal_id: input.deal_id ?? null,
    next_follow_up: input.next_follow_up ?? null,
    created_by: input.created_by ?? user.id,
  });

  const { data, error } = await supabase.from(CRM_ACTIVITIES).insert(row).select("*").single();
  if (error) dbError("logActivity", error);
  return data as Activity;
}

// ---------------------------------------------------------------------------
// KPI aggregates
// ---------------------------------------------------------------------------

const OPEN_STAGES: readonly DealStage[] = ["new_lead", "contacted", "proposal_sent"];

function emptyDealsByStage(): DealsByStage {
  return { new_lead: 0, contacted: 0, proposal_sent: 0, won: 0, lost: 0 };
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** `getCRMOverviewStats()` — KPI aggregates across contacts, deals, activities. */
export async function getCRMOverviewStats(): Promise<CrmOverviewStats> {
  const { supabase } = await getAuthedClient();

  const [
    contactsRes,
    newLeadsRes,
    companiesRes,
    activitiesRes,
    dealsRes,
  ] = await Promise.all([
    supabase.from(CRM_CONTACTS).select("*", { count: "exact", head: true }),
    supabase.from(CRM_CONTACTS).select("*", { count: "exact", head: true }).eq("lead_status", "new"),
    supabase.from(CRM_COMPANIES).select("*", { count: "exact", head: true }),
    supabase.from(CRM_ACTIVITIES).select("*", { count: "exact", head: true }),
    supabase
      .from(CRM_DEALS)
      .select("stage,value,currency,probability"),
  ]);

  if (contactsRes.error) dbError("getCRMOverviewStats(contacts)", contactsRes.error);
  if (newLeadsRes.error) dbError("getCRMOverviewStats(newLeads)", newLeadsRes.error);
  if (companiesRes.error) dbError("getCRMOverviewStats(companies)", companiesRes.error);
  if (activitiesRes.error) dbError("getCRMOverviewStats(activities)", activitiesRes.error);
  if (dealsRes.error) dbError("getCRMOverviewStats(deals)", dealsRes.error);

  const totalContacts = contactsRes.count ?? 0;
  const newLeads = newLeadsRes.count ?? 0;
  const totalCompanies = companiesRes.count ?? 0;
  const totalActivities = activitiesRes.count ?? 0;

  const deals = (dealsRes.data ?? []) as Array<{
    stage: DealStage;
    value: number | string | null;
    currency: string | null;
    probability: number | null;
  }>;

  const dealsByStage = emptyDealsByStage();
  const valueByCurrency: CrmOverviewStats["valueByCurrency"] = {};

  let totalPipelineValue = 0;
  let wonValue = 0;
  let lostValue = 0;
  let weightedPipelineValue = 0;

  for (const d of deals) {
    const stage: DealStage = d.stage;
    const value = Number(d.value ?? 0) || 0;
    const probability = Number(d.probability ?? 0) || 0;
    const currency = (d.currency ?? DEFAULT_CURRENCY) as string;

    if (stage in dealsByStage) dealsByStage[stage] += 1;

    const bucket = (valueByCurrency[currency] ??= { pipeline: 0, won: 0, lost: 0 });

    if (stage === "won") {
      wonValue += value;
      bucket.won += value;
    } else if (stage === "lost") {
      lostValue += value;
      bucket.lost += value;
    } else if ((OPEN_STAGES as readonly string[]).includes(stage)) {
      totalPipelineValue += value;
      weightedPipelineValue += (value * probability) / 100;
      bucket.pipeline += value;
    }
  }

  const totalDeals = deals.length;
  const openDeals =
    dealsByStage.new_lead + dealsByStage.contacted + dealsByStage.proposal_sent;
  const wonDeals = dealsByStage.won;
  const lostDeals = dealsByStage.lost;
  const closed = wonDeals + lostDeals;
  const conversionRate = closed > 0 ? round2((wonDeals / closed) * 100) : 0;

  // Round per-currency buckets.
  for (const key of Object.keys(valueByCurrency)) {
    const b = valueByCurrency[key];
    b.pipeline = round2(b.pipeline);
    b.won = round2(b.won);
    b.lost = round2(b.lost);
  }

  return {
    totalContacts,
    totalCompanies,
    totalDeals,
    totalActivities,
    openDeals,
    wonDeals,
    lostDeals,
    newLeads,
    totalPipelineValue: round2(totalPipelineValue),
    wonValue: round2(wonValue),
    lostValue: round2(lostValue),
    weightedPipelineValue: round2(weightedPipelineValue),
    conversionRate,
    dealsByStage,
    valueByCurrency,
  };
}
