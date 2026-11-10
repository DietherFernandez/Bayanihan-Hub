-- ============================================================================
-- Migration 0002: Normalized Core Tables for GabayPH
-- Includes: locations, categories, profiles, organizations, resources,
-- opportunities, assistance_programs, bayanihan_posts, bookmarks,
-- search_history, learning_progress, reports, announcements,
-- verification_logs, audit_logs
-- ============================================================================

-- 1. LOCATIONS (Philippine Geographic Coverage)
CREATE TABLE IF NOT EXISTS public.locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  psgc_code TEXT UNIQUE NOT NULL,
  region_code TEXT NOT NULL,
  region_name TEXT NOT NULL,
  province TEXT,
  city_municipality TEXT,
  is_national BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module module_type NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_fil TEXT NOT NULL,
  description TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PROFILES (1:1 with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'citizen',
  full_name TEXT,
  location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  save_search_history BOOLEAN NOT NULL DEFAULT FALSE,
  preferred_language TEXT NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'fil')),
  is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ORGANIZATIONS (Agencies, LGUs, NGOs, Employers, Schools)
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  acronym TEXT,
  slug TEXT UNIQUE NOT NULL,
  org_type TEXT NOT NULL CHECK (org_type IN ('gov_agency', 'lgu', 'ngo', 'employer', 'school')),
  description TEXT NOT NULL,
  official_website TEXT NOT NULL,
  verified_email_domain TEXT,
  hotline TEXT,
  address TEXT,
  verification_status verification_status NOT NULL DEFAULT 'verification_pending',
  status record_status NOT NULL DEFAULT 'published',
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  last_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. RESOURCES (Serbisyo, Pera, Aral, Kaligtasan guides & directories)
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module module_type NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE RESTRICT,
  location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  requirements_checklist JSONB NOT NULL DEFAULT '[]'::jsonb,
  steps_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  eligibility_summary TEXT NOT NULL,
  processing_time TEXT,
  fees_summary TEXT,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  contact_info JSONB NOT NULL DEFAULT '{}'::jsonb,
  verification_status verification_status NOT NULL DEFAULT 'verification_pending',
  status record_status NOT NULL DEFAULT 'draft',
  last_verified_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  search_vector TSVECTOR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. OPPORTUNITIES (Jobs, Scholarships, Training, Volunteer Opportunities)
CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type opportunity_type NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE RESTRICT,
  location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
  compensation_or_benefit TEXT,
  employment_type TEXT,
  application_url TEXT NOT NULL,
  deadline_at TIMESTAMPTZ,
  is_remote BOOLEAN NOT NULL DEFAULT FALSE,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  verification_status verification_status NOT NULL DEFAULT 'verification_pending',
  status record_status NOT NULL DEFAULT 'draft',
  last_verified_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  search_vector TSVECTOR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. ASSISTANCE_PROGRAMS (Medical, Educational, Burial, Calamity, Livelihood Aid)
CREATE TABLE IF NOT EXISTS public.assistance_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE RESTRICT,
  location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  program_name TEXT NOT NULL,
  program_type TEXT NOT NULL CHECK (program_type IN ('medical', 'educational', 'burial', 'cash_aid', 'calamity', 'livelihood', 'housing')),
  description TEXT NOT NULL,
  benefit_summary TEXT NOT NULL,
  eligibility_criteria JSONB NOT NULL DEFAULT '[]'::jsonb,
  required_documents JSONB NOT NULL DEFAULT '[]'::jsonb,
  how_to_apply JSONB NOT NULL DEFAULT '[]'::jsonb,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  verification_status verification_status NOT NULL DEFAULT 'verification_pending',
  status record_status NOT NULL DEFAULT 'draft',
  last_verified_at TIMESTAMPTZ,
  search_vector TSVECTOR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. BAYANIHAN_POSTS (Community Donations, Volunteer Calls, Assistance Requests)
CREATE TABLE IF NOT EXISTS public.bayanihan_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_type bayanihan_type NOT NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  location_id UUID REFERENCES public.locations(id) ON DELETE RESTRICT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  Urgency_level TEXT NOT NULL DEFAULT 'normal' CHECK (urgency_level IN ('normal', 'high', 'critical')),
  items_or_skills_needed JSONB NOT NULL DEFAULT '[]'::jsonb,
  drop_off_or_meeting_point TEXT,
  contact_channel TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_url TEXT,
  verification_status verification_status NOT NULL DEFAULT 'verification_pending',
  status record_status NOT NULL DEFAULT 'under_review',
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  moderated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  last_verified_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. BOOKMARKS (User Saved Items)
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('resource', 'opportunity', 'assistance_program', 'bayanihan_post')),
  target_id UUID NOT NULL,
  target_slug TEXT NOT NULL,
  target_title TEXT NOT NULL,
  target_module module_type NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);

-- 10. SEARCH_HISTORY (Opt-in User Search History)
CREATE TABLE IF NOT EXISTS public.search_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  module_filter TEXT,
  region_filter TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. LEARNING_PROGRESS (User Progress on Aral & Checklist Steps)
CREATE TABLE IF NOT EXISTS public.learning_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  completed_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, resource_id)
);

-- 12. REPORTS (Inaccuracy, Outdated Info, and Scam Reports)
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('resource', 'opportunity', 'assistance_program', 'organization', 'bayanihan_post')),
  target_id UUID NOT NULL,
  target_title TEXT NOT NULL,
  reason report_reason NOT NULL,
  details TEXT NOT NULL,
  official_reference_url TEXT,
  resolution_status TEXT NOT NULL DEFAULT 'open' CHECK (resolution_status IN ('open', 'investigating', 'resolved', 'dismissed')),
  resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. ANNOUNCEMENTS (Advisories, Deadlines, Disaster Warnings)
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'emergency')),
  related_module module_type NOT NULL,
  location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  verification_status verification_status NOT NULL DEFAULT 'officially_verified',
  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. VERIFICATION_LOGS (Public Content Verification Trail)
CREATE TABLE IF NOT EXISTS public.verification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  target_type TEXT NOT NULL CHECK (target_type IN ('resource', 'opportunity', 'assistance_program', 'organization', 'bayanihan_post', 'announcement')),
  target_id UUID NOT NULL,
  previous_status verification_status,
  new_status verification_status NOT NULL,
  verification_notes TEXT NOT NULL,
  official_reference_url TEXT NOT NULL,
  verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. AUDIT_LOGS (Immutable Security & Admin Action Trail)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  actor_role user_role NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
