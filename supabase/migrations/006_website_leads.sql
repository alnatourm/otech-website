-- Migration 006: Website Leads Capture
-- Project: OTECH Corporate Website (rsmevpbbilqtjoccayla)
-- Scope: OTECH Software Engineering & Enterprise AI Development Company

CREATE TABLE IF NOT EXISTS public.website_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    full_name TEXT NOT NULL,
    company_name TEXT,
    email TEXT NOT NULL,
    phone_number TEXT,
    country_code TEXT DEFAULT '+962',
    service_interest TEXT NOT NULL, -- 'enterprise_ai', 'custom_software', 'system_automation', 'technical_consulting'
    message TEXT,
    locale TEXT NOT NULL DEFAULT 'ar',
    ip_address TEXT,
    user_agent TEXT,
    status TEXT NOT NULL DEFAULT 'new' -- 'new', 'contacted', 'qualified', 'closed'
);

-- Index for querying by creation date and status
CREATE INDEX IF NOT EXISTS idx_website_leads_status ON public.website_leads(status);
CREATE INDEX IF NOT EXISTS idx_website_leads_created_at ON public.website_leads(created_at DESC);

-- Row Level Security (RLS)
ALTER TABLE public.website_leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous public submissions from the website
CREATE POLICY "Allow public insert to website_leads"
    ON public.website_leads
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Restrict read/update to authenticated staff only
CREATE POLICY "Allow staff to view website_leads"
    ON public.website_leads
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow staff to update website_leads"
    ON public.website_leads
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);
