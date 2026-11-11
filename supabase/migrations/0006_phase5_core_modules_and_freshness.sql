-- ============================================================================
-- Migration 0006: Phase 5 Core Service Modules, 'needs_review' Verification
-- Status, Content Freshness Evaluation, and Module Query Indexes
--
-- MIGRATION SAFETY:
-- Strictly additive and non-destructive. Does not drop tables or modify
-- production records destructively.
-- ============================================================================

-- 1. Extend verification_status enum with 'needs_review'
-- Apply enum additions at top level and surface any failure.
ALTER TYPE public.verification_status ADD VALUE IF NOT EXISTS 'needs_review';

-- 2. Add optional expires_at to resources and assistance_programs for automatic expiration handling
ALTER TABLE public.resources
  ADD COLUMN IF NOT EXISTS is_official_gov_source BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

ALTER TABLE public.assistance_programs
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- 3. Helper function to evaluate whether verified content is stale (>180 days since last verification)
CREATE OR REPLACE FUNCTION public.is_verification_stale(
  last_verified TIMESTAMPTZ,
  max_days INT DEFAULT 180
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT CASE
    WHEN last_verified IS NULL THEN TRUE
    WHEN last_verified < (NOW() - make_interval(days => max_days)) THEN TRUE
    ELSE FALSE
  END;
$$;

-- 4. Indexes for module-level category, provider, and geographic filtering
CREATE INDEX IF NOT EXISTS idx_resources_category_location
  ON public.resources (module, category_id, location_id, status);

CREATE INDEX IF NOT EXISTS idx_opportunities_deadline
  ON public.opportunities (type, status, deadline_at);

CREATE INDEX IF NOT EXISTS idx_assistance_location_status
  ON public.assistance_programs (program_type, location_id, status);
