# OTECH Corporate Website (`o-tech.space`)

Official Next.js 16 App Router repository for **OTECH Software & AI Development Company** (Amman, Jordan).

---

## 1. Project Overview & Scope

- **Company:** OTECH Software & AI Development Company (`شركة OTECH لتطوير البرمجيات وحلول الذكاء الاصطناعي`)
- **Headquarters:** Amman, Jordan (`عَمّان، المملكة الأردنية الهاشمية`)
- **Domain:** `o-tech.space`
- **Scope Restriction:** Strictly corporate engineering, enterprise AI solutions, bespoke cloud software, and system automation. **ABSOLUTELY NO OTECH Monster / OTECH.exe references, downloads, or links.**

---

## 2. Tech Stack

- **Framework:** Next.js 16 (App Router with Turbopack)
- **Language:** TypeScript 5
- **UI & Styling:** Tailwind CSS 3.4, PostCSS, Lucide Icons, Glassmorphism
- **Internationalization (i18n):** `next-intl` (Arabic RTL default, English LTR toggle)
- **Typography:**
  - Arabic: `Cairo` (Headings) & `Tajawal` (Body) via `next/font/google`
  - English: `Inter`
  - Telemetry: `JetBrains Mono`
- **Backend & Database:** Supabase (`@supabase/ssr`, PostgreSQL, Row-Level Security)
- **Lead Intake:** Next.js Server Action (`submitLeadAction`) storing inquiries directly in `public.website_leads`

---

## 3. Bilingual Routing Structure

- Arabic default at `/` and `/ar` (`dir="rtl"`)
- English at `/en` (`dir="ltr"`)
- Seamless language toggle via `@/i18n/navigation`
- Dictionary strings maintained in `messages/ar.json` and `messages/en.json`

---

## 4. Supabase Schema (`website_leads`)

Table created via migration `006_website_leads.sql`:
- `id` (UUID, primary key)
- `created_at` (TIMESTAMPTZ)
- `full_name` (TEXT)
- `company_name` (TEXT)
- `email` (TEXT)
- `phone_number` (TEXT)
- `country_code` (TEXT, default `+962`)
- `service_interest` (TEXT: `enterprise_ai`, `custom_software`, `system_automation`, `technical_consulting`)
- `message` (TEXT)
- `locale` (TEXT)
- `ip_address` (TEXT)
- `user_agent` (TEXT)
- `status` (TEXT, default `'new'`)

---

## 5. Development & Build

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Production build
npm run build
```
