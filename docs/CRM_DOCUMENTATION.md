---
title: "OTECH Native Sales CRM — Technical & User Documentation"
doc_id: "CRM-DOC-006"
task_id: "TASK-CRM-006"
spec_id: "SPEC-CRM-2026-01"
qc_gate: "PASS"
verified_commit: "480bb04"
branch: "feat/sales-crm-ui"
author: "Technical Writer (Development, OTECH — Amman, Jordan)"
date: "2026-11-28"
status: "Delivered"
---

# OTECH Native Sales CRM — Technical & User Documentation

- **Document ID:** CRM-DOC-006
- **Task ID:** TASK-CRM-006
- **Spec:** SPEC-CRM-2026-01 — Lightweight Native Sales CRM for OTECH
- **QC Gate:** PASS (verified across 42 automated tests, 100% build pass, RLS compliance, Jordanian phone normalization, mandatory lost_reason guard, OTTY branding compliance)
- **Verified Commit:** `480bb04` on branch `feat/sales-crm-ui`
- **Author:** Technical Writer (Development, OTECH — Amman, Jordan)
- **Date:** 2026-11-28
- **Status:** Delivered

---

## 1. Purpose and Scope

### 1.1 Purpose

This document is the master technical and user documentation for the **OTECH Native Sales CRM** module (`/admin/crm`), the internal sales pipeline application built for OTECH Software & AI Development Company (Amman, Jordan).

It consolidates:

1. **Technical Architecture and Database Documentation** — the four core CRM entities, their constraints, and the full server-side data layer (Server Actions and REST API routes under `/api/crm/*`).
2. **End-User and Admin Guide (Bilingual / Arabic First)** — operating instructions for sales reps and admins using the `/admin/crm` interface.

### 1.2 Scope

In scope for this master document:

- Module context and architecture (frontend, API layer, data layer, database).
- Entity relationship and field-level database documentation for `crm_companies`, `crm_contacts`, `crm_deals`, and `crm_activities`.
- Business rules and validation logic (including the mandatory lost-reason guard and Jordanian phone normalization).
- REST API reference for all `/api/crm/*` endpoints: methods, parameters, request/response payloads, authentication, and status codes.
- KPI computation logic backing the CRM overview dashboard.
- End-user and admin operating guide for sales reps and admins.

### 1.3 Out of Scope

- OTECH Monster (`OTECH.exe`) product features — the CRM is an internal tool living in the OTECH Corporate Website codebase.
- Deployment execution (owned by DevOps) and release management (owned by Project Owner).
- Code implementation details beyond what is needed to document behavior accurately.

---

## 2. Architecture Overview

### 2.1 Stack

| Concern | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| UI / Styling | Tailwind CSS 3.4, PostCSS, Lucide Icons, Glassmorphism |
| Internationalization | `next-intl` (Arabic RTL default, English LTR) |
| Backend / Database | Supabase (PostgreSQL, Row-Level Security) |
| Hosting | Vercel |
| Mascot / Branding | OTTY (sole official mascot) |

### 2.2 Layering and Data Flow

The CRM module follows a layered server-first architecture:

1. **Presentation (Client Components):** `src/components/crm/**` — including `CrmContext` (`src/components/crm/CrmContext.tsx`) which owns shared CRM state, modal/drawer state, and optimistic action handlers.
2. **Server Layer:** `src/lib/crm/server.ts` — server-only data access built on the Supabase server client (`@supabase/ssr`, request-scoped, anon key + caller auth cookies). Every function enforces an authenticated user via `supabase.auth.getUser()`; Row Level Security (`TO authenticated`) is not bypassed; no service-role key is used.
3. **Server Actions:** `src/lib/actions/crm.ts` — typed `"use server"` wrappers that convert `CrmError` throws into a serializable result envelope `CrmActionResult<T>`.
4. **REST API:** Next.js route handlers under `src/app/api/crm/**` — wrap server functions with the `crmRoute` / `crmErrorResponse` helpers from `src/lib/crm/http.ts`.
5. **Browser Client:** `src/lib/crm/client.ts` — safe, typed fetch wrappers that call `/api/crm/*` and interpret the `{ success, data, error, code }` envelope.

Data flow for reads and writes:

```
Client Component
  → Server Action  (src/lib/actions/crm.ts)        OR
  → REST Route     (src/app/api/crm/**)            OR
  → Server Action → src/lib/crm/server.ts → Supabase → PostgreSQL
```

Anonymous callers are rejected with `UnauthorizedError` (mapped to HTTP `401`).

### 2.3 Database

- Migration source of truth: `supabase/migrations/008_crm_schema.sql` (Supabase project `rsmevpbbilqtjoccayla`).
- Applied by hand via the Supabase dashboard SQL editor, in filename order (e.g. `006` before `008` when re-creating storage policies).
- Related earlier migration: `supabase/migrations/006_website_leads.sql`.

---

## 3. Entity Model and Database Schema

### 3.1 Overview

The CRM consists of four core entities:

| Entity | Table | Purpose |
|---|---|---|
| 1 | `crm_companies` | Company / organization records |
| 2 | `crm_contacts` | Leads and individual contacts (customer representatives) |
| 3 | `crm_deals` | Sales opportunities / pipeline deals |
| 4 | `crm_activities` | Interaction timeline (calls, WhatsApp, meetings, notes, emails) |

### 3.2 `crm_companies`

| Field | Type | Constraints / Default |
|---|---|---|
| `id` | UUID (PK) | `DEFAULT gen_random_uuid()` |
| `name` | TEXT | NOT NULL |
| `industry` | TEXT | NULL |
| `website` | TEXT | NULL |
| `country` | TEXT | DEFAULT `'Jordan'` |
| `city` | TEXT | DEFAULT `'Amman'` |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT now |
| `updated_at` | TIMESTAMPTZ | NOT NULL DEFAULT now |

### 3.3 `crm_contacts`

| Field | Type | Constraints / Default |
|---|---|---|
| `id` | UUID (PK) | `DEFAULT gen_random_uuid()` |
| `company_id` | UUID (FK → `crm_companies.id`) | `ON DELETE SET NULL` |
| `full_name` | TEXT | NOT NULL |
| `phone` | TEXT | NOT NULL — stored normalized as Jordanian E.164 `+9627XXXXXXXX` |
| `email` | TEXT | NULL |
| `company_name` | TEXT | NULL — denormalized company name when no `crm_companies` row is linked |
| `country` | TEXT | DEFAULT `'Jordan'` |
| `city` | TEXT | DEFAULT `'Amman'` |
| `lead_source` | TEXT | NOT NULL DEFAULT `'website'` — CHECK IN (`website`, `whatsapp`, `phone`, `referral`, `ads`, `social_media`, `other`) |
| `lead_status` | TEXT | NOT NULL DEFAULT `'new'` — CHECK IN (`new`, `contacted`, `qualified`, `unqualified`) |
| `assigned_to` | UUID (FK → `auth.users.id`) | `ON DELETE SET NULL` — sales rep assignment |
| `notes` | TEXT | NULL |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT now |
| `updated_at` | TIMESTAMPTZ | NOT NULL DEFAULT now |

### 3.4 `crm_deals`

| Field | Type | Constraints / Default |
|---|---|---|
| `id` | UUID (PK) | `DEFAULT gen_random_uuid()` |
| `contact_id` | UUID (FK → `crm_contacts.id`) | `ON DELETE CASCADE` |
| `company_id` | UUID (FK → `crm_companies.id`) | `ON DELETE SET NULL` |
| `title` | TEXT | NOT NULL |
| `value` | NUMERIC(12,2) | NOT NULL DEFAULT `0.00` |
| `currency` | TEXT | NOT NULL DEFAULT `'JOD'` — `JOD` default, `USD` supported |
| `stage` | TEXT | NOT NULL DEFAULT `'new_lead'` — CHECK IN (`new_lead`, `contacted`, `proposal_sent`, `won`, `lost`) |
| `probability` | INTEGER | NOT NULL DEFAULT `10` — CHECK (`0`–`100`) |
| `expected_close_date` | DATE | NULL — `YYYY-MM-DD` |
| `lost_reason` | TEXT | NULL — required when `stage = 'lost'` |
| `assigned_to` | UUID (FK → `auth.users.id`) | `ON DELETE SET NULL` |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT now |
| `updated_at` | TIMESTAMPTZ | NOT NULL DEFAULT now |

**Mandatory constraint — `chk_lost_reason`:**

```sql
CONSTRAINT chk_lost_reason
CHECK (stage != 'lost' OR (lost_reason IS NOT NULL AND length(trim(lost_reason)) > 0))
```

i.e. a deal may only be moved to the `lost` stage when a non-empty lost reason is supplied. The application layer enforces the same rule via `assertLostReason` before insert/update, and moving to `lost` without a reason fails with error code `LOST_REASON_REQUIRED` (HTTP `422`).

### 3.5 `crm_activities`

| Field | Type | Constraints / Default |
|---|---|---|
| `id` | UUID (PK) | `DEFAULT gen_random_uuid()` |
| `contact_id` | UUID (FK → `crm_contacts.id`) | `ON DELETE CASCADE` |
| `deal_id` | UUID (FK → `crm_deals.id`) | `ON DELETE SET NULL` |
| `type` | TEXT | NOT NULL — CHECK IN (`call`, `whatsapp`, `meeting`, `note`, `email`) |
| `description` | TEXT | NOT NULL |
| `next_follow_up` | TIMESTAMPTZ | NULL — follow-up reminder timestamp |
| `created_by` | UUID (FK → `auth.users.id`) | `ON DELETE SET NULL` — authenticated user who logged the activity |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT now |

### 3.6 Relationships

- `crm_companies` → `crm_contacts` : one company to many contacts (`company_id ON DELETE SET NULL`).
- `crm_contacts` → `crm_deals` : one contact to many deals (`contact_id ON DELETE CASCADE`).
- `crm_companies` → `crm_deals` : one company to many deals (`company_id ON DELETE SET NULL`).
- `crm_contacts` → `crm_activities` : one contact to many activities (`contact_id ON DELETE CASCADE`).
- `crm_deals` → `crm_activities` : one deal to many activities (`deal_id ON DELETE SET NULL`).

### 3.7 Constraints, Indexes and Triggers

- CHECK constraints: `lead_source`, `lead_status`, `stage`, `type`, `probability (0–100)`.
- Performance indexes: `idx_crm_contacts_phone`, `idx_crm_contacts_status`, `idx_crm_contacts_assigned`, `idx_crm_deals_stage`, `idx_crm_deals_contact`, `idx_crm_activities_contact`, `idx_crm_activities_deal`.
- Trigger: `public.set_updated_at_timestamp()` — `BEFORE UPDATE` on `crm_companies`, `crm_contacts`, `crm_deals` to refresh `updated_at`.

### 3.8 Row Level Security

RLS enabled on all four CRM tables:

```sql
ALTER TABLE public.<table> ENABLE ROW LEVEL SECURITY;
-- Policies: "Staff full access on <table>"
--   FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

Anonymous clients never reach CRM data: the application additionally requires an authenticated user before issuing queries, and the Supabase access key used is the anon key with caller auth cookies (no service-role bypass).

---

## 4. Business Rules and Validation

### 4.1 Deal Lifecycle

Deal stages: `new_lead`, `contacted`, `proposal_sent`, `won`, `lost`.

- `new_lead` → `contacted` → `proposal_sent` → `won` / `lost` progression.
- Moving a deal to `lost` requires a non-empty `lost_reason` (DB constraint + application guard).
- Moving a deal to `won` sets win state / high confidence handling per application flow (probability `100` on win in UI flow).

### 4.2 Lead Model

- Lead statuses: `new`, `contacted`, `qualified`, `unqualified`.
- Lead sources: `website`, `whatsapp`, `phone`, `referral`, `ads`, `social_media`, `other`.
- New contacts default to `lead_status = 'new'` and `lead_source = 'website'`.

### 4.3 Activity Types

`call`, `whatsapp`, `meeting`, `note`, `email` — used for the multi-channel interaction timeline and follow-up tracking.

### 4.4 Numeric and Currency Rules

- Deal `value` is `NUMERIC(12,2)`, NOT NULL, default `0`, must not be negative.
- Deal `probability` is an integer `0–100`, default `10`.
- Deal `currency` defaults to `JOD`; `USD` is also supported (per-deal, surfaced via `valueByCurrency`).

### 4.5 Jordanian Phone Normalization

- Valid format: `+962 7X XXX XXXX` → normalized E.164 `+9627XXXXXXXX`.
- Accepted inputs include `+962 7X XXX XXXX`, `+9627XXXXXXXX`, `+962-7X-XXX-XXXX`, `00962 7X XXX XXXX`, `962 7X XXX XXXX`, local `07X XXX XXXX`, bare `7X XXX XXXX`, and Arabic-Indic digit variants.
- Invalid numbers throw `ValidationError` (`VALIDATION_ERROR`, HTTP `400`).

---

## 5. Server Layer, Server Actions and REST API

### 5.1 Server Actions

All server actions live in `src/lib/actions/crm.ts` and delegate to `src/lib/crm/server.ts`. Each action returns a `CrmActionResult<T>` envelope:

```ts
type CrmActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };
```

Actions cover: contacts (get/create/update/delete), deals (get/create/update/update stage), activities (get/log), and CRM overview stats (get).

### 5.2 REST API Reference

Base path: `/api/crm`. All endpoints require an authenticated Supabase user (RLS `authenticated`); unauthenticated requests receive `401`.

#### 5.2.1 Conventions

- Success envelope: `{ "success": true, "data": ... }`.
- Error envelope: `{ "success": false, "error": "...", "code": "CRM_ERROR_CODE" }`.
- Error codes: `UNAUTHORIZED`, `VALIDATION_ERROR`, `LOST_REASON_REQUIRED`, `NOT_FOUND`, `DATABASE_ERROR`, `UNKNOWN`.

#### 5.2.2 Endpoints

| Method | Path | Purpose | Success | Errors |
|---|---|---|---|---|
| GET | `/api/crm/overview` | CRM KPI aggregates | `200 CrmOverviewStats` | `401`, `500` |
| GET | `/api/crm/contacts` | List contacts | `200 Contact[]` | `401`, `400`, `500` |
| POST | `/api/crm/contacts` | Create contact | `200 Contact` | `401`, `400`, `500` |
| PATCH | `/api/crm/contacts/{id}` | Partial update contact | `200 Contact` | `401`, `400`, `404`, `500` |
| DELETE | `/api/crm/contacts/{id}` | Delete contact | `200 { id }` | `401`, `404`, `500` |
| GET | `/api/crm/deals` | List deals | `200 Deal[]` | `401`, `400`, `500` |
| POST | `/api/crm/deals` | Create deal | `200 Deal` | `401`, `400`, `422`, `500` |
| PATCH | `/api/crm/deals/{id}` | Partial update deal | `200 Deal` | `401`, `400`, `422`, `404`, `500` |
| PATCH | `/api/crm/deals/{id}/stage` | Move deal stage | `200 Deal` | `401`, `400`, `422`, `404`, `500` |
| GET | `/api/crm/activities` | List activities | `200 Activity[]` | `401`, `400`, `500` |
| POST | `/api/crm/activities` | Log activity | `200 Activity` | `401`, `400`, `500` |

#### 5.2.3 Endpoint Details

**1. `GET /api/crm/overview`**

Returns the KPI snapshot used by the CRM overview dashboard.

- Response data: `CrmOverviewStats` — counts (`totalContacts`, `totalCompanies`, `totalDeals`, `totalActivities`, `openDeals`, `wonDeals`, `lostDeals`, `newLeads`), monetary aggregates (`totalPipelineValue`, `wonValue`, `lostValue`, `weightedPipelineValue`), `conversionRate`, `dealsByStage`, and `valueByCurrency`.

**2. `GET /api/crm/contacts`**

Query parameters: `lead_status`, `lead_source`, `search`, `limit`, `offset`.

- `search` performs substring matching across `full_name`, `email`, `phone`, and `company_name`.

**3. `POST /api/crm/contacts`**

Body (`CreateContactInput`): `full_name` (required, non-empty), `phone` (required, Jordanian `+962 7X XXX XXXX`), optional `email`, `company_id`, `company_name`, `country`, `city`, `lead_source`, `lead_status`, `assigned_to`, `notes`.

**4. `PATCH /api/crm/contacts/{id}`**

Body (`UpdateContactInput`): partial update; at least one field required; immutable: `id`, `created_at`, `updated_at`.

**5. `DELETE /api/crm/contacts/{id}`**

Deletes the contact; returns deleted record id.

**6. `GET /api/crm/deals`**

Query parameters: `stage`, `contact_id`, `company_id`, `limit`, `offset`.

**7. `POST /api/crm/deals`**

Body (`CreateDealInput`): `title` (required), `contact_id`, `company_id`, `value`, `currency`, `stage`, `probability`, `expected_close_date`, `lost_reason`, `assigned_to`.

Rules: `value` defaults to `0`, must not be negative; `currency` defaults to `JOD`; `stage` defaults to `new_lead`; `probability` defaults to `10` (0–100).

**8. `PATCH /api/crm/deals/{id}`**

Body (`UpdateDealInput`): partial update; at least one field required; lost-reason invariant enforced on merged state.

**9. `PATCH /api/crm/deals/{id}/stage`**

Body: `{ "stage": DealStage, "lost_reason"?: string | null }`.

Behavior: moving to `lost` requires a non-empty `lost_reason` (422 `LOST_REASON_REQUIRED`); leaving `lost` allows clearing the reason.

**10. `GET /api/crm/activities`**

Query parameters: `contact_id`, `deal_id`, `type`, `limit`, `offset`.

**11. `POST /api/crm/activities`**

Body (`LogActivityInput`): `type` (required: `call` | `whatsapp` | `meeting` | `note` | `email`), `description` (required, non-empty), `contact_id`, `deal_id`, `next_follow_up`, `created_by` (defaults to authenticated user).

#### 5.3 Error Handling Summary

| Code | Meaning | HTTP |
|---|---|---|
| `UNAUTHORIZED` | No authenticated user | `401` |
| `VALIDATION_ERROR` | Invalid input (bad phone, enum, required field) | `400` |
| `LOST_REASON_REQUIRED` | `stage = lost` without reason | `422` |
| `NOT_FOUND` | Referenced record missing | `404` |
| `DATABASE_ERROR` | Supabase/Postgres failure | `500` |
| `UNKNOWN` | Unhandled error | `500` |

Example error response:

```json
{
  "success": false,
  "error": "A non-empty `lost_reason` is required when `stage` is `lost`.",
  "code": "LOST_REASON_REQUIRED"
}
```

---

## 6. KPI Computation

`getCRMOverviewStats()` computes the dashboard snapshot from live CRM tables:

- `openDeals` = deals in stages `new_lead`, `contacted`, `proposal_sent`.
- `totalPipelineValue` = Σ deal `value` over open deals.
- `weightedPipelineValue` = Σ (`value` × `probability` / 100) over open deals.
- `wonValue` / `lostValue` = Σ values for `won` / `lost` deals.
- `conversionRate` = `won / (won + lost) × 100`, `0` when no closed deals.
- `dealsByStage` = deal counts per stage.
- `valueByCurrency` = per-currency `{ pipeline, won, lost }` buckets for mixed JOD/USD pipelines.

---

## 7. End-User and Admin Guide (Bilingual / Arabic First)

Audience: sales reps and admins operating the internal CRM at `/admin/crm`.

### 7.1 Access and Navigation

- Route prefix: `/admin/crm` (localized under the `[locale]` segment; Arabic default with Arabic/English language toggle via `next-intl`).
- Access: authenticated staff only (RLS `authenticated`); anonymous access rejected.
- Primary sections (Arabic-first labels):

| Route | Arabic UI Label | Icon |
|---|---|---|
| `/admin/crm` | نظرة عامة والمؤشرات | LayoutDashboard |
| `/admin/crm/contacts` | جهات الاتصال | Users |
| `/admin/crm/deals` | مسار الصفقات (كانبان) | Kanban |
| `/admin/crm/activities` | سجل التفاعلات والأنشطة | History |

### 7.2 Overview and KPI Summary

The overview screen (`KpiSummaryGrid` + pipeline panel + recent activities):

1. **Total Leads (إجمالي جهات الاتصال):** count of CRM contacts; tile includes a comparative indicator.
2. **Pipeline Value (قيمة مسار الصفقات النشطة):** Σ value of open deals, displayed in JOD (`د.أ`).
3. **Won Deals (الصفقات المغلقة بنجاح):** won deal count and won value.
4. **Win Rate (نسبة تحويل الصفقات):** won / closed × 100.

Below the tiles: **Sales Pipeline by stage** — progress bars per stage (`new_lead`, `contacted`, `proposal_sent`, `won`, `lost`) showing deal count and total value (JOD), plus **Recent Activities** (latest interactions).

### 7.3 Contacts Directory and Contact 360

- **Contacts directory:** searchable, filterable table (search across name/company/phone/email; filters by lead status, lead source, city; CSV export of filtered view).
- **Add Contact:** modal capturing full name, Jordanian phone (validated + normalized), email, company, city, lead source, initial lead status, notes.
- **Contact 360 drawer:** slide-over panel with:
  - Contact identity block (name, company, phone, email, location, registration date).
  - Notes / requirements block.
  - Quick note composer (logs an activity of type `note`).
  - Tabs: **Overview** (`نظرة عامة`), **Deals** (`الصفقات` — related deals with stage, value, expected close), **Timeline** (`الخط الزمني` — interaction history).
  - Direct action shortcuts: **WhatsApp** deep link (`wa.me/<phone>?text=...`) and **Phone** call link (`tel:<phone>`).

### 7.4 Deals and the 5-Stage Kanban

- **Kanban columns:** `new_lead` (عميل جديد / New), `contacted` (تم التواصل / Contacted), `proposal_sent` (تقديم العرض / Proposal), `won` (فوز بالصفقة / Won), `lost` (خسارة / Lost).
- **Drag & drop:** cards move between columns; quick stage switch available on card (touch/mobile friendly).
- **Add Deal:** modal with title, value (JOD), linked contact, initial stage, expected close date.
- **Win flow:** moving a deal to `won` triggers the **OTTY Won Celebration** modal (mascot celebration, deal value, title, follow-up CTA).
- **Lost flow:** moving a deal to `lost` triggers the **mandatory Lost Reason modal** — reason is required (budget, competitor, postponement, no-response, out-of-scope technical, other) plus optional notes; persisted via deal stage update with `lost_reason`.
- **Urgency:** flagged deals surface a `تنبيه 24h` (24h alert) badge on the deal card.

### 7.5 Interaction Log and Timeline

- **Activity composer:** type selector (`call` مكالمة هاتفية, `whatsapp` محادثة وتساب, `meeting` اجتماع حضوري, `note` ملاحظة داخلية, `email` بريد إلكتروني), target contact, subject, interaction notes (required), optional next follow-up datetime.
- **Timeline:** activities list per contact / deal, surfaced on the Contact 360 timeline tab and the overview recent activities panel.

### 7.6 OTTY Assistant and Modals

- `OttyHelpModal` provides sales guidance: first-15-minute contact window (70% conversion lift), 24h follow-up alerts, call/note logging discipline.

---

## 8. Security and Compliance

- Supabase RLS: `FOR ALL TO authenticated` on CRM tables; no service-role usage in CRM data access.
- Application-level auth enforcement via `supabase.auth.getUser()`; anonymous → `401`.
- Phone normalization to E.164 before storage (privacy/format integrity).
- OTTY branding compliance: mascot usage restricted to official OTTY; bilingual (Arabic RTL + English LTR) is a first-class standard.

---

## 9. Frontend Component Map

```
src/components/crm/
├── CrmContext.tsx
├── layout/        CrmHeader, CrmNavigation, CrmBreadcrumb
├── overview/      WelcomeOttyBanner, KpiSummaryGrid, RecentActivitiesList
├── contacts/      ContactsTable, ContactDrawer
├── deals/         KanbanBoard, DealCard
├── activities/   ActivityComposer, ActivityTimeline
├── shared/        StatusBadge, SourceBadge, OttyEmptyState
└── modals/        CreateContactModal, CreateDealModal, LostReasonModal, WonCelebrationModal, OttyHelpModal
```

Plus `src/app/[locale]/admin/crm/**` route group and `src/app/api/crm/**` API routes.

---

## 10. Known Limitations

- The client context may fall back to rich demo/mock data when the authenticated API returns empty or fails; production sync replaces demo data when server data exists.
- Some display labels (e.g., activity `created_by` display name) fall back to the acting sales representative during demo mapping.

## 11. Documentation Deliverables Mapping

TASK-CRM-006 deliverables — all complete:

- [x] **Technical Architecture & Database Document:** entities, constraints, server actions, REST API (auth + status codes).
- [x] **End-User & Admin Guide (Bilingual / Arabic focused):** overview/KPI, contacts + 360 drawer, Kanban, timeline, lost-reason workflow, OTTY celebration.
- [x] **Master documentation file saved in the repository:** `docs/CRM_DOCUMENTATION.md`.

## 12. Task Trail and Related Documents

- Task chain: `TASK-CRM-001` / `TASK-CRM-003` (CRM UI), `TASK-CRM-004` (CRM backend), `TASK-CRM-005` (QC verification), `TASK-CRM-006` (this documentation).
- Spec: `SPEC-CRM-2026-01`.
- Verified implementation commit: `480bb04` (branch `feat/sales-crm-ui`).
- Governing process: **AI Software Development SOP v1.0** (Technical Writer responsibilities: maintain living documentation in `docs/`, write developer READMEs / `.env.example` / deployment guides / bilingual user guides; communicate via `TASK_ACCEPTED`, `PROGRESS_UPDATE`, `TASK_COMPLETED`).
