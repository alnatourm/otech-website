import type { NextRequest } from "next/server";
import { getContacts, createContact } from "@/lib/crm/server";
import { crmRoute } from "@/lib/crm/http";
import type { CreateContactInput, LeadSource, LeadStatus } from "@/lib/crm/types";

export const dynamic = "force-dynamic";

/** GET /api/crm/contacts — list contacts. 401 for anonymous (RLS `authenticated`). */
export async function GET(request: NextRequest) {
  return crmRoute(async () => {
    const sp = request.nextUrl.searchParams;
    return getContacts({
      lead_status: (sp.get("lead_status") as LeadStatus | null) ?? undefined,
      lead_source: (sp.get("lead_source") as LeadSource | null) ?? undefined,
      search: sp.get("search") ?? undefined,
      limit: sp.has("limit") ? Number(sp.get("limit")) : undefined,
      offset: sp.has("offset") ? Number(sp.get("offset")) : undefined,
    });
  });
}

/** POST /api/crm/contacts — create a contact (Jordanian phone enforced). */
export async function POST(request: NextRequest) {
  return crmRoute(async () => {
    const body = (await request.json()) as CreateContactInput;
    return createContact(body);
  });
}
