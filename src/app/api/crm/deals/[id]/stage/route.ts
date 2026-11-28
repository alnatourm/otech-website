import type { NextRequest } from "next/server";
import { updateDealStage } from "@/lib/crm/server";
import { crmRoute } from "@/lib/crm/http";
import type { DealStage } from "@/lib/crm/types";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/crm/deals/[id]/stage
 * Body: { "stage": DealStage, "lost_reason"?: string }
 * Moving to `lost` requires a non-empty `lost_reason`.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return crmRoute(async () => {
    const { id } = await params;
    const body = (await request.json()) as { stage: DealStage; lost_reason?: string | null };
    return updateDealStage(id, body.stage, body.lost_reason);
  });
}
