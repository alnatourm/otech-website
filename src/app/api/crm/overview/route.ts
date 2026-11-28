import { getCRMOverviewStats } from "@/lib/crm/server";
import { crmRoute } from "@/lib/crm/http";

export const dynamic = "force-dynamic";

/** GET /api/crm/overview — CRM KPI aggregates. 401 for anonymous. */
export async function GET() {
  return crmRoute(() => getCRMOverviewStats());
}
