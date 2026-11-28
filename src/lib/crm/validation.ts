/**
 * Pure validation helpers for the CRM. No I/O — safe to use on both
 * server and client, and unit-testable.
 */

import {
  ACTIVITY_TYPES,
  DEAL_STAGES,
  LEAD_SOURCES,
  LEAD_STATUSES,
  type ActivityType,
  type DealStage,
  type LeadSource,
  type LeadStatus,
} from "./types";
import { LostReasonRequiredError, ValidationError } from "./errors";

// ---------------------------------------------------------------------------
// Jordanian phone — required format `+962 7X XXX XXXX`
// ---------------------------------------------------------------------------

/** Jordanian mobile, normalized E.164: `+962` + `7` + 8 digits. */
export const JORDANIAN_PHONE_REGEX = /^\+9627\d{8}$/;
export const JORDAN_PHONE_PREFIX = "+962";

const ARABIC_INDIC_DIGITS = "٠١٢٣٤٥٦٧٨٩"; // U+0660..U+0669
const EXTENDED_ARABIC_INDIC_DIGITS = "۰۱۲۳۴۵۶۷۸۹"; // U+06F0..U+06F9

/** Convert Arabic-Indic / Persian digits to ASCII. */
function toAsciiDigits(input: string): string {
  return input
    .replace(/[٠-٩]/g, (d) => String(ARABIC_INDIC_DIGITS.indexOf(d)))
    .replace(/[۰-۹]/g, (d) => String(EXTENDED_ARABIC_INDIC_DIGITS.indexOf(d)));
}

/**
 * Normalize a Jordanian phone number to E.164 `+9627XXXXXXXX`.
 *
 * Accepts:
 *   - `+962 7X XXX XXXX`, `+9627XXXXXXXX`, `+962-7X-XXX-XXXX`
 *   - `00962 7X XXX XXXX` (international `00` prefix)
 *   - `962 7X XXX XXXX`
 *   - local `07X XXX XXXX` / `07XXXXXXXX`
 *   - bare `7X XXX XXXX` / `7XXXXXXXX`
 *   - Arabic-Indic digits
 *
 * Returns `null` if the number is not a valid Jordanian mobile (`+962 7X XXX XXXX`).
 */
export function normalizeJordanianPhone(raw: string | null | undefined): string | null {
  if (raw == null) return null;
  let s = toAsciiDigits(String(raw).trim());
  if (s.length === 0) return null;

  // Strip formatting noise (spaces, dashes, dots, parentheses, slashes).
  s = s.replace(/[\s\-()./\\]/g, "");
  // Also drop a leading Unicode plus variant.
  s = s.replace(/^＋/, "+");

  if (s.startsWith("00962")) {
    s = "+962" + s.slice(5);
  }

  let national: string;
  if (s.startsWith("+962")) {
    national = s.slice(4);
  } else if (s.startsWith("962")) {
    national = s.slice(3);
  } else if (s.startsWith("+0")) {
    national = s.slice(2); // e.g. +07X... (not standard, tolerated)
  } else if (s.startsWith("0")) {
    national = s.slice(1); // local `07X XXX XXXX`
  } else {
    national = s; // bare `7X XXX XXXX`
  }

  // National significant number: `7` + 8 digits (Jordanian mobile `7X`).
  if (!/^7\d{8}$/.test(national)) return null;
  return JORDAN_PHONE_PREFIX + national;
}

/** True if `raw` is a valid Jordanian mobile in `+962 7X XXX XXXX` form. */
export function isValidJordanianPhone(raw: string | null | undefined): boolean {
  return normalizeJordanianPhone(raw) !== null;
}

/** Validate + normalize a required Jordanian phone, throwing `ValidationError`. */
export function requireJordanianPhone(raw: string | null | undefined, field = "phone"): string {
  if (raw == null || String(raw).trim() === "") {
    throw new ValidationError(`\`${field}\` is required.`);
  }
  const normalized = normalizeJordanianPhone(raw);
  if (!normalized) {
    throw new ValidationError(
      `\`${field}\` must be a valid Jordanian phone in +962 7X XXX XXXX format.`
    );
  }
  return normalized;
}

// ---------------------------------------------------------------------------
// Email
// ---------------------------------------------------------------------------

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(raw: string | null | undefined): boolean {
  if (raw == null) return false;
  return EMAIL_REGEX.test(raw.trim());
}

/** Returns a trimmed lowercase email or `null` when empty; throws on invalid. */
export function normalizeEmail(raw: string | null | undefined): string | null {
  if (raw == null) return null;
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  if (!EMAIL_REGEX.test(trimmed)) {
    throw new ValidationError("`email` must be a valid email address.");
  }
  return trimmed.toLowerCase();
}

// ---------------------------------------------------------------------------
// Required strings
// ---------------------------------------------------------------------------

export function requireNonEmpty(value: string | null | undefined, field: string): string {
  if (value == null || String(value).trim() === "") {
    throw new ValidationError(`\`${field}\` is required and must be non-empty.`);
  }
  return String(value).trim();
}

// ---------------------------------------------------------------------------
// Enumerations
// ---------------------------------------------------------------------------

export function isDealStage(value: unknown): value is DealStage {
  return typeof value === "string" && (DEAL_STAGES as readonly string[]).includes(value);
}

export function requireDealStage(value: unknown, field = "stage"): DealStage {
  if (!isDealStage(value)) {
    throw new ValidationError(`\`${field}\` must be one of: ${DEAL_STAGES.join(", ")}.`);
  }
  return value;
}

export function isActivityType(value: unknown): value is ActivityType {
  return typeof value === "string" && (ACTIVITY_TYPES as readonly string[]).includes(value);
}

export function requireActivityType(value: unknown, field = "type"): ActivityType {
  if (!isActivityType(value)) {
    throw new ValidationError(`\`${field}\` must be one of: ${ACTIVITY_TYPES.join(", ")}.`);
  }
  return value;
}

export function isLeadSource(value: unknown): value is LeadSource {
  return typeof value === "string" && (LEAD_SOURCES as readonly string[]).includes(value);
}

export function isLeadStatus(value: unknown): value is LeadStatus {
  return typeof value === "string" && (LEAD_STATUSES as readonly string[]).includes(value);
}

// ---------------------------------------------------------------------------
// Deal stage / lost reason invariant
// ---------------------------------------------------------------------------

/**
 * Core business rule: a non-empty `lost_reason` is required whenever
 * `stage === "lost"`. (Mirrors DB constraint `chk_lost_reason`.)
 */
export function assertLostReason(
  stage: DealStage,
  lostReason: string | null | undefined
): void {
  if (stage === "lost" && (lostReason == null || String(lostReason).trim() === "")) {
    throw new LostReasonRequiredError();
  }
}

// ---------------------------------------------------------------------------
// Numbers
// ---------------------------------------------------------------------------

/** Parse a finite number or throw. */
export function requireFiniteNumber(value: unknown, field: string): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) {
    throw new ValidationError(`\`${field}\` must be a finite number.`);
  }
  return n;
}

/** Clamp probability to `0..100`. */
export function normalizeProbability(value: number | undefined, fallback = 10): number {
  if (value == null) return fallback;
  const n = requireFiniteNumber(value, "probability");
  if (n < 0 || n > 100) {
    throw new ValidationError("`probability` must be between 0 and 100.");
  }
  return Math.round(n);
}
