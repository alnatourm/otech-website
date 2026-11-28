import type { NextRequest } from "next/server";
import { getActivities, logActivity } from "@/lib/crm/server";
import { crmRoute } from "@/lib/crm/http";
import type { ActivityType, LogActivityInput } from "@/lib/crm/types";

export const dynamic = "force-dynamic";

/** GET /api/crm/activities — list activities. 401 for anonymous. */
export async function GET(request: NextRequest) {
  return crmRoute(async () => {
    const sp = request.nextUrl.searchParams;
    return getActivities({
      contact_id: sp.get("contact_id") ?? undefined,
      deal_id: sp.get("deal_id") ?? undefined,
      type: (sp.get("type") as ActivityType | null) ?? undefined,
      limit: sp.has("limit") ? Number(sp.get("limit")) : undefined,
      offset: sp.has("offset") ? Number(sp.get("offset")) : undefined,
    });
  });
}

/** POST /api/crm/activities — log an interaction. */
export async function POST(request: NextRequest) {
  return crmRoute(async () => {
    const body = (await request.json()) as LogActivityInput;
    return logActivity(body);
  });
}
