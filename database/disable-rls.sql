-- ============================================
-- DISABLE RLS ON ALL TABLES
-- ============================================
-- This script disables Row Level Security (RLS) on all tables
-- in the public schema. This is useful for development but
-- NOT RECOMMENDED for production.
-- 
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop all existing RLS policies first (optional cleanup)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- Disable RLS on all tables in public schema
ALTER TABLE IF EXISTS public.cities DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tenants DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tenant_domains DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tenant_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.menu_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.menus DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.item_variants DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.custom_texts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.qr_codes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ads DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ad_targets DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled (should return all false)
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ RLS has been disabled on all tables in the public schema';
    RAISE NOTICE '⚠️  WARNING: This is NOT secure for production environments!';
END $$;

