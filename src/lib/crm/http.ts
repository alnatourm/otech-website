/**
 * Map CRM errors to HTTP responses for Next.js API route handlers.
 */

import { NextResponse } from "next/server";
import { CrmError } from "./errors";

export function crmErrorResponse(err: unknown): NextResponse {
  if (err instanceof CrmError) {
    const status =
      err.code === "UNAUTHORIZED"
        ? 401
        : err.code === "VALIDATION_ERROR"
          ? 400
          : err.code === "LOST_REASON_REQUIRED"
            ? 422
            : err.code === "NOT_FOUND"
              ? 404
              : 500;
    return NextResponse.json(
      { success: false, error: err.message, code: err.code },
      { status }
    );
  }
  const message = err instanceof Error ? err.message : "Unknown error";
  return NextResponse.json(
    { success: false, error: message, code: "UNKNOWN" },
    { status: 500 }
  );
}

/** Wrap a route handler body, converting thrown CrmError into a JSON response. */
export async function crmRoute<T>(fn: () => Promise<T>): Promise<NextResponse> {
  try {
    const data = await fn();
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return crmErrorResponse(err);
  }
}
