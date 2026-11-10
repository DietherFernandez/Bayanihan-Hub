-- ============================================================================
-- Migration 0001: Extensions and Custom Enum Types for GabayPH
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- User Role Hierarchy
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM (
    'super_admin',
    'content_admin',
    'regional_moderator',
    'organization',
    'citizen'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Content Trust & Verification Status
DO $$ BEGIN
  CREATE TYPE verification_status AS ENUM (
    'officially_verified',
    'verification_pending',
    'archived'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Publication Lifecycle Status
DO $$ BEGIN
  CREATE TYPE record_status AS ENUM (
    'draft',
    'published',
    'under_review',
    'rejected',
    'archived'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Six Core Platform Modules
DO $$ BEGIN
  CREATE TYPE module_type AS ENUM (
    'trabaho',
    'serbisyo',
    'pera',
    'bayanihan',
    'aral',
    'kaligtasan'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Opportunity Classifications
DO $$ BEGIN
  CREATE TYPE opportunity_type AS ENUM (
    'job',
    'scholarship',
    'training',
    'volunteer'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Bayanihan Community Post Types
DO $$ BEGIN
  CREATE TYPE bayanihan_type AS ENUM (
    'donation_offer',
    'assistance_request',
    'volunteer_call'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Public Inaccuracy & Scam Report Reasons
DO $$ BEGIN
  CREATE TYPE report_reason AS ENUM (
    'outdated_info',
    'incorrect_requirements',
    'broken_link',
    'suspected_scam',
    'abusive_content',
    'other'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
