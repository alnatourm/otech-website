import type { NextRequest } from "next/server";
import { updateDeal } from "@/lib/crm/server";
import { crmRoute } from "@/lib/crm/http";
import type { UpdateDealInput } from "@/lib/crm/types";

export const dynamic = "force-dynamic";

/** PATCH /api/crm/deals/[id] — partial update. `lost` requires `lost_reason`. */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return crmRoute(async () => {
    const { id } = await params;
    const body = (await request.json()) as UpdateDealInput;
    return updateDeal(id, body);
  });
}
