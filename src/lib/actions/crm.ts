"use server";

/**
 * OTECH Native Sales CRM — Next.js **server actions** ("CRUD API actions").
 *
 * Thin, typed wrappers over the server-only data access layer
 * (`@/lib/crm/server`), which uses the project's existing Supabase server
 * client with RLS + an explicit authenticated-user check. Every action
 * returns a serializable `CrmActionResult<T>` instead of throwing, so
 * client components can render validation errors (incl. `lost_reason`,
 * Jordanian phone, and `UNAUTHORIZED`) without crashing.
 */

import * as crm from "@/lib/crm/server";
import { CrmError } from "@/lib/crm/errors";
import type {
  CrmActionResult,
  CreateContactInput,
  CreateDealInput,
  DealStage,
  LogActivityInput,
  UpdateContactInput,
  UpdateDealInput,
} from "@/lib/crm/types";

async function wrap<T>(fn: () => Promise<T>): Promise<CrmActionResult<T>> {
  try {
    return { success: true, data: await fn() };
  } catch (err) {
    if (err instanceof CrmError) {
      return { success: false, error: err.message, code: err.code };
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message, code: "UNKNOWN" };
  }
}

// --------------------------- Contacts ---------------------------

export async function getContacts(
  options?: crm.GetContactsOptions
): Promise<CrmActionResult<Awaited<ReturnType<typeof crm.getContacts>>>> {
  return wrap(() => crm.getContacts(options ?? {}));
}

export async function createContact(
  input: CreateContactInput
): Promise<CrmActionResult<Awaited<ReturnType<typeof crm.createContact>>>> {
  return wrap(() => crm.createContact(input));
}

export async function updateContact(
  id: string,
  input: UpdateContactInput
): Promise<CrmActionResult<Awaited<ReturnType<typeof crm.updateContact>>>> {
  return wrap(() => crm.updateContact(id, input));
}

export async function deleteContact(
  id: string
): Promise<CrmActionResult<{ id: string }>> {
  return wrap(() => crm.deleteContact(id));
}

// --------------------------- Deals ------------------------------

export async function getDeals(
  options?: crm.GetDealsOptions
): Promise<CrmActionResult<Awaited<ReturnType<typeof crm.getDeals>>>> {
  return wrap(() => crm.getDeals(options ?? {}));
}

export async function createDeal(
  input: CreateDealInput
): Promise<CrmActionResult<Awaited<ReturnType<typeof crm.createDeal>>>> {
  return wrap(() => crm.createDeal(input));
}

export async function updateDealStage(
  dealId: string,
  stage: DealStage,
  lostReason?: string | null
): Promise<CrmActionResult<Awaited<ReturnType<typeof crm.updateDealStage>>>> {
  return wrap(() => crm.updateDealStage(dealId, stage, lostReason));
}

export async function updateDeal(
  dealId: string,
  input: UpdateDealInput
): Promise<CrmActionResult<Awaited<ReturnType<typeof crm.updateDeal>>>> {
  return wrap(() => crm.updateDeal(dealId, input));
}

// --------------------------- Activities -------------------------

export async function getActivities(
  options?: crm.GetActivitiesOptions
): Promise<CrmActionResult<Awaited<ReturnType<typeof crm.getActivities>>>> {
  return wrap(() => crm.getActivities(options ?? {}));
}

export async function logActivity(
  input: LogActivityInput
): Promise<CrmActionResult<Awaited<ReturnType<typeof crm.logActivity>>>> {
  return wrap(() => crm.logActivity(input));
}

// --------------------------- KPIs -------------------------------

export async function getCRMOverviewStats(): Promise<
  CrmActionResult<Awaited<ReturnType<typeof crm.getCRMOverviewStats>>>
> {
  return wrap(() => crm.getCRMOverviewStats());
}
