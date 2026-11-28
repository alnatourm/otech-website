import type { NextRequest } from "next/server";
import { getDeals, createDeal } from "@/lib/crm/server";
import { crmRoute } from "@/lib/crm/http";
import type { CreateDealInput, DealStage } from "@/lib/crm/types";

export const dynamic = "force-dynamic";

/** GET /api/crm/deals — list deals. 401 for anonymous. */
export async function GET(request: NextRequest) {
  return crmRoute(async () => {
    const sp = request.nextUrl.searchParams;
    return getDeals({
      stage: (sp.get("stage") as DealStage | null) ?? undefined,
      contact_id: sp.get("contact_id") ?? undefined,
      company_id: sp.get("company_id") ?? undefined,
      limit: sp.has("limit") ? Number(sp.get("limit")) : undefined,
      offset: sp.has("offset") ? Number(sp.get("offset")) : undefined,
    });
  });
}

/** POST /api/crm/deals — create a deal. `lost` requires non-empty `lost_reason`. */
export async function POST(request: NextRequest) {
  return crmRoute(async () => {
    const body = (await request.json()) as CreateDealInput;
    return createDeal(body);
  });
}
