import type { NextRequest } from "next/server";
import { updateContact, deleteContact } from "@/lib/crm/server";
import { crmRoute } from "@/lib/crm/http";
import type { UpdateContactInput } from "@/lib/crm/types";

export const dynamic = "force-dynamic";

/** PATCH /api/crm/contacts/[id] — partial update. */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return crmRoute(async () => {
    const { id } = await params;
    const body = (await request.json()) as UpdateContactInput;
    return updateContact(id, body);
  });
}

/** DELETE /api/crm/contacts/[id] — delete. */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return crmRoute(async () => {
    const { id } = await params;
    return deleteContact(id);
  });
}
