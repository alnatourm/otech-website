/**
 * OTECH Native Sales CRM — **client data layer**.
 *
 * Browser-safe typed wrappers over the REST API routes
 * (`/api/crm/*`, which run on the server and enforce Supabase RLS +
 * authenticated-only access). For Server Components / Server Actions,
 * prefer `@/lib/crm/server` or `@/lib/actions/crm` directly.
 *
 * SAFE FOR CLIENT COMPONENTS — no Supabase keys, no server-only imports.
 */

import { CrmError, type CrmErrorCode } from "./errors";
import type {
  Activity,
  Contact,
  CreateContactInput,
  CreateDealInput,
  CrmOverviewStats,
  Deal,
  DealStage,
  LogActivityInput,
  UpdateContactInput,
  UpdateDealInput,
} from "./types";

const BASE = "/api/crm";

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: CrmErrorCode;
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  let json: ApiEnvelope<T> | null = null;
  try {
    json = (await res.json()) as ApiEnvelope<T>;
  } catch {
    json = null;
  }

  if (!res.ok || !json || json.success !== true) {
    throw new CrmError(
      json?.error ?? `CRM request failed (${res.status})`,
      json?.code ?? "UNKNOWN"
    );
  }
  return json.data as T;
}

function qs(params: Record<string, string | number | undefined | null>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

// --------------------------- Contacts ---------------------------

export interface GetContactsOptions {
  lead_status?: Contact["lead_status"];
  lead_source?: Contact["lead_source"];
  search?: string;
  limit?: number;
  offset?: number;
}

export function getContacts(options: GetContactsOptions = {}): Promise<Contact[]> {
  return api<Contact[]>(`/contacts${qs({ ...options })}`);
}

export function createContact(input: CreateContactInput): Promise<Contact> {
  return api<Contact>("/contacts", { method: "POST", body: JSON.stringify(input) });
}

export function updateContact(id: string, input: UpdateContactInput): Promise<Contact> {
  return api<Contact>(`/contacts/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteContact(id: string): Promise<{ id: string }> {
  return api<{ id: string }>(`/contacts/${encodeURIComponent(id)}`, { method: "DELETE" });
}

// --------------------------- Deals ------------------------------

export interface GetDealsOptions {
  stage?: DealStage;
  contact_id?: string;
  company_id?: string;
  limit?: number;
  offset?: number;
}

export function getDeals(options: GetDealsOptions = {}): Promise<Deal[]> {
  return api<Deal[]>(`/deals${qs({ ...options })}`);
}

export function createDeal(input: CreateDealInput): Promise<Deal> {
  return api<Deal>("/deals", { method: "POST", body: JSON.stringify(input) });
}

export function updateDealStage(
  dealId: string,
  stage: DealStage,
  lostReason?: string | null
): Promise<Deal> {
  return api<Deal>(`/deals/${encodeURIComponent(dealId)}/stage`, {
    method: "PATCH",
    body: JSON.stringify({ stage, lost_reason: lostReason }),
  });
}

export function updateDeal(dealId: string, input: UpdateDealInput): Promise<Deal> {
  return api<Deal>(`/deals/${encodeURIComponent(dealId)}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

// --------------------------- Activities -------------------------

export interface GetActivitiesOptions {
  contact_id?: string;
  deal_id?: string;
  type?: Activity["type"];
  limit?: number;
  offset?: number;
}

export function getActivities(options: GetActivitiesOptions = {}): Promise<Activity[]> {
  return api<Activity[]>(`/activities${qs({ ...options })}`);
}

export function logActivity(input: LogActivityInput): Promise<Activity> {
  return api<Activity>("/activities", { method: "POST", body: JSON.stringify(input) });
}

// --------------------------- KPIs -------------------------------

export function getCRMOverviewStats(): Promise<CrmOverviewStats> {
  return api<CrmOverviewStats>("/overview");
}
