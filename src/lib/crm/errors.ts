/**
 * CRM-specific error types. Server actions map these to
 * `CrmActionResult`; API routes map them to HTTP status codes.
 */

export type CrmErrorCode =
  | "UNAUTHORIZED"
  | "VALIDATION_ERROR"
  | "LOST_REASON_REQUIRED"
  | "NOT_FOUND"
  | "DATABASE_ERROR"
  | "UNKNOWN";

export class CrmError extends Error {
  readonly code: CrmErrorCode;
  constructor(message: string, code: CrmErrorCode = "UNKNOWN") {
    super(message);
    this.name = "CrmError";
    this.code = code;
  }
}

/** Thrown when there is no authenticated Supabase user (RLS requires `authenticated`). */
export class UnauthorizedError extends CrmError {
  constructor(message = "Authentication required. CRM data is restricted to authenticated users.") {
    super(message, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

/** Thrown on invalid input (bad phone, unknown enum, missing required field, ...). */
export class ValidationError extends CrmError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

/** Thrown when `stage === "lost"` but `lost_reason` is missing/blank. */
export class LostReasonRequiredError extends CrmError {
  constructor(message = "A non-empty `lost_reason` is required when `stage` is `lost`.") {
    super(message, "LOST_REASON_REQUIRED");
    this.name = "LostReasonRequiredError";
  }
}

/** Thrown when a referenced row does not exist. */
export class NotFoundError extends CrmError {
  constructor(message = "Record not found.") {
    super(message, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

/** Thrown when Supabase/Postgres returns an error. */
export class DatabaseError extends CrmError {
  constructor(message: string) {
    super(message, "DATABASE_ERROR");
    this.name = "DatabaseError";
  }
}
