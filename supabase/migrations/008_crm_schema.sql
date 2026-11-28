-- Migration 008: OTECH In-House Sales CRM
-- Author: Database Engineer / Dev Lead
-- Project: rsmevpbbilqtjoccayla (Supabase)
-- Target Module: o-tech.space/admin/crm

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CRM Companies table
CREATE TABLE IF NOT EXISTS public.crm_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    industry TEXT,
    website TEXT,
    country TEXT DEFAULT 'Jordan',
    city TEXT DEFAULT 'Amman',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. CRM Contacts table
CREATE TABLE IF NOT EXISTS public.crm_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.crm_companies(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    company_name TEXT,
    country TEXT DEFAULT 'Jordan',
    city TEXT DEFAULT 'Amman',
    lead_source TEXT NOT NULL DEFAULT 'website' CHECK (lead_source IN ('website', 'whatsapp', 'phone', 'referral', 'ads', 'social_media', 'other')),
    lead_status TEXT NOT NULL DEFAULT 'new' CHECK (lead_status IN ('new', 'contacted', 'qualified', 'unqualified')),
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. CRM Deals table
CREATE TABLE IF NOT EXISTS public.crm_deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.crm_companies(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    value NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'JOD',
    stage TEXT NOT NULL DEFAULT 'new_lead' CHECK (stage IN ('new_lead', 'contacted', 'proposal_sent', 'won', 'lost')),
    probability INTEGER NOT NULL DEFAULT 10 CHECK (probability >= 0 AND probability <= 100),
    expected_close_date DATE,
    lost_reason TEXT,
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT chk_lost_reason CHECK (stage != 'lost' OR (lost_reason IS NOT NULL AND length(trim(lost_reason)) > 0))
);

-- 5. CRM Activities table (Timeline & Interactions)
CREATE TABLE IF NOT EXISTS public.crm_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
    deal_id UUID REFERENCES public.crm_deals(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('call', 'whatsapp', 'meeting', 'note', 'email')),
    description TEXT NOT NULL,
    next_follow_up TIMESTAMPTZ,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_crm_contacts_phone ON public.crm_contacts(phone);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_status ON public.crm_contacts(lead_status);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_assigned ON public.crm_contacts(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_deals_stage ON public.crm_deals(stage);
CREATE INDEX IF NOT EXISTS idx_crm_deals_contact ON public.crm_deals(contact_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_contact ON public.crm_activities(contact_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_deal ON public.crm_activities(deal_id);

-- 7. Trigger for updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_crm_companies_updated_at ON public.crm_companies;
CREATE TRIGGER trigger_crm_companies_updated_at
BEFORE UPDATE ON public.crm_companies
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trigger_crm_contacts_updated_at ON public.crm_contacts;
CREATE TRIGGER trigger_crm_contacts_updated_at
BEFORE UPDATE ON public.crm_contacts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trigger_crm_deals_updated_at ON public.crm_deals;
CREATE TRIGGER trigger_crm_deals_updated_at
BEFORE UPDATE ON public.crm_deals
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

-- 8. Row Level Security (RLS) Policies
ALTER TABLE public.crm_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff full access on crm_companies" ON public.crm_companies;
CREATE POLICY "Staff full access on crm_companies" ON public.crm_companies
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Staff full access on crm_contacts" ON public.crm_contacts;
CREATE POLICY "Staff full access on crm_contacts" ON public.crm_contacts
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Staff full access on crm_deals" ON public.crm_deals;
CREATE POLICY "Staff full access on crm_deals" ON public.crm_deals
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Staff full access on crm_activities" ON public.crm_activities;
CREATE POLICY "Staff full access on crm_activities" ON public.crm_activities
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
