-- ============================================================================
-- Migration 0005: Phase 4 Database Architecture, RBAC user_roles,
-- Additive Profile/Location/Resource Extensions, and Anti-Escalation Triggers
--
-- MIGRATION SAFETY NOTES:
-- 1. Strictly additive and non-destructive (no DROP TABLE, no TRUNCATE, no
--    destructive column removals).
-- 2. Preserves all Phase 1-3 tables, enums, indexes, and policies.
-- 3. Adds Phase 4 canonical `user_roles` table, extended `profiles` columns,
--    barangay support in `locations`, and anti-privilege-escalation triggers.
-- ============================================================================

-- 1. Extend user_role enum safely with Phase 4 canonical role values
-- Keep enum changes at migration top level: PostgreSQL can reject
-- ALTER TYPE ADD VALUE inside a DO-block/subtransaction, and errors must not
-- be swallowed because later statements depend on these labels.
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'user';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'content_manager';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'moderator';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'administrator';

-- 2. Extend public.profiles with Phase 4 citizen & location columns
-- Note: Precise residential street address is intentionally NOT required.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS phone_number TEXT,
  ADD COLUMN IF NOT EXISTS region TEXT DEFAULT 'NCR',
  ADD COLUMN IF NOT EXISTS province TEXT,
  ADD COLUMN IF NOT EXISTS city_municipality TEXT,
  ADD COLUMN IF NOT EXISTS barangay TEXT,
  ADD COLUMN IF NOT EXISTS account_status TEXT NOT NULL DEFAULT 'active'
    CHECK (account_status IN ('active', 'pending_verification', 'suspended', 'deactivated'));

-- 3. Create public.user_roles table for strict RBAC separation
-- Supports: 'user', 'content_manager', 'moderator', 'administrator'
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user'
    CHECK (role IN ('user', 'content_manager', 'moderator', 'administrator')),
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- 4. Extend public.locations to support barangay-level geographic coverage
ALTER TABLE public.locations
  ADD COLUMN IF NOT EXISTS barangay TEXT;

-- 5. Extend public.resources with Phase 4 canonical aliases
ALTER TABLE public.resources
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS official_source_url TEXT,
  ADD COLUMN IF NOT EXISTS geographic_coverage TEXT NOT NULL DEFAULT 'National',
  ADD COLUMN IF NOT EXISTS publication_status record_status NOT NULL DEFAULT 'draft';

-- Keep resources description/official_source_url/publication_status synchronized
CREATE OR REPLACE FUNCTION public.sync_resources_phase4_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.description IS NULL AND NEW.summary IS NOT NULL THEN
    NEW.description := NEW.summary;
  ELSIF NEW.summary IS NULL AND NEW.description IS NOT NULL THEN
    NEW.summary := NEW.description;
  END IF;

  IF NEW.official_source_url IS NULL AND NEW.source_url IS NOT NULL THEN
    NEW.official_source_url := NEW.source_url;
  ELSIF NEW.source_url IS NULL AND NEW.official_source_url IS NOT NULL THEN
    NEW.source_url := NEW.official_source_url;
  END IF;

  IF NEW.publication_status IS DISTINCT FROM NEW.status THEN
    IF TG_OP = 'INSERT' AND NEW.publication_status <> 'draft' AND NEW.status = 'draft' THEN
      NEW.status := NEW.publication_status;
    ELSE
      NEW.publication_status := NEW.status;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_resources_phase4_columns ON public.resources;
CREATE TRIGGER trg_sync_resources_phase4_columns
  BEFORE INSERT OR UPDATE ON public.resources
  FOR EACH ROW EXECUTE FUNCTION public.sync_resources_phase4_columns();

-- ============================================================================
-- 6. RBAC Helper Functions (Non-Recursive SECURITY DEFINER)
-- ============================================================================

-- Check if the current authenticated user holds a specific Phase 4 role
CREATE OR REPLACE FUNCTION public.has_role(required_role TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = required_role
  )
  OR EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.is_suspended = FALSE
      AND p.account_status = 'active'
      AND (
        (required_role = 'administrator' AND p.role::text IN ('super_admin', 'administrator'))
        OR (required_role = 'content_manager' AND p.role::text IN ('content_admin', 'content_manager', 'super_admin', 'administrator'))
        OR (required_role = 'moderator' AND p.role::text IN ('regional_moderator', 'moderator', 'super_admin', 'administrator'))
        OR (required_role = 'user' AND p.role::text IN ('citizen', 'user', 'organization', 'regional_moderator', 'moderator', 'content_admin', 'content_manager', 'super_admin', 'administrator'))
      )
  );
$$;

-- Helper: Is the current user an administrator?
CREATE OR REPLACE FUNCTION public.is_administrator()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role('administrator');
$$;

-- Helper: Can the current user manage content (administrator or content_manager)?
CREATE OR REPLACE FUNCTION public.can_manage_content()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role('administrator') OR public.has_role('content_manager');
$$;

-- Helper: Can the current user moderate reports/community posts (administrator or moderator)?
CREATE OR REPLACE FUNCTION public.can_moderate()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role('administrator') OR public.has_role('moderator');
$$;

-- ============================================================================
-- 7. Automatic Profile & Default 'user' Role Provisioning on Registration
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    role,
    full_name,
    username,
    region,
    province,
    city_municipality,
    barangay,
    save_search_history,
    account_status
  )
  VALUES (
    NEW.id,
    'citizen',
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NULLIF(TRIM(COALESCE(NEW.raw_user_meta_data->>'username', '')), ''),
    COALESCE(NEW.raw_user_meta_data->>'region', 'NCR'),
    NULLIF(TRIM(COALESCE(NEW.raw_user_meta_data->>'province', '')), ''),
    NULLIF(TRIM(COALESCE(NEW.raw_user_meta_data->>'city_municipality', '')), ''),
    NULLIF(TRIM(COALESCE(NEW.raw_user_meta_data->>'barangay', '')), ''),
    COALESCE((NEW.raw_user_meta_data->>'save_search_history')::boolean, FALSE),
    CASE WHEN NEW.email_confirmed_at IS NOT NULL THEN 'active' ELSE 'pending_verification' END
  )
  ON CONFLICT (id) DO NOTHING;

  -- Always assign only the least-privileged 'user' role upon registration
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- ============================================================================
-- 8. Anti-Privilege-Escalation Trigger on public.profiles
-- Users must NEVER be able to elevate their own role or unsuspended status.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.prevent_profile_privilege_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow trusted service_role or verified administrators to update administrative columns
  IF current_setting('request.jwt.claim.role', true) = 'service_role'
     OR public.is_administrator() THEN
    RETURN NEW;
  END IF;

  -- For non-administrators updating their own profile, lock privileged columns
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Unauthorized: Users cannot modify their own role.';
  END IF;

  IF NEW.is_suspended IS DISTINCT FROM OLD.is_suspended THEN
    RAISE EXCEPTION 'Unauthorized: Users cannot modify suspension status.';
  END IF;

  IF NEW.account_status IS DISTINCT FROM OLD.account_status
     AND NEW.account_status NOT IN ('active', 'deactivated') THEN
    RAISE EXCEPTION 'Unauthorized: Invalid account status transition.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_profile_privilege_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_profile_privilege_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_privilege_escalation();

-- ============================================================================
-- 9. Trusted Server-Side Role Assignment Function with Immutable Audit Trail
-- ============================================================================
CREATE OR REPLACE FUNCTION public.assign_user_role(
  target_user_id UUID,
  new_role TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF new_role NOT IN ('user', 'content_manager', 'moderator', 'administrator') THEN
    RAISE EXCEPTION 'Invalid role: %', new_role;
  END IF;

  IF current_setting('request.jwt.claim.role', true) <> 'service_role'
     AND NOT public.is_administrator() THEN
    RAISE EXCEPTION 'Forbidden: Only administrators can assign roles.';
  END IF;

  INSERT INTO public.user_roles (user_id, role, assigned_by)
  VALUES (target_user_id, new_role, auth.uid())
  ON CONFLICT (user_id, role) DO NOTHING;

  INSERT INTO public.audit_logs (
    actor_id,
    actor_role,
    action,
    entity_type,
    entity_id,
    metadata
  )
  VALUES (
    auth.uid(),
    'super_admin',
    'ASSIGN_USER_ROLE',
    'user_roles',
    target_user_id::text,
    jsonb_build_object('assigned_role', new_role)
  );
END;
$$;

-- ============================================================================
-- 10. Audit Log Immutability Trigger (Prevent UPDATE or DELETE on audit_logs)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.prevent_audit_log_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Security violation: audit_logs records are immutable and cannot be modified or deleted.';
END;
$$;

DROP TRIGGER IF EXISTS trg_audit_logs_immutable ON public.audit_logs;
CREATE TRIGGER trg_audit_logs_immutable
  BEFORE UPDATE OR DELETE ON public.audit_logs
  FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_log_mutation();

-- ============================================================================
-- 11. Row Level Security (RLS) for user_roles & Phase 4 Policy Refinements
-- ============================================================================
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own roles and admins can view all" ON public.user_roles;
CREATE POLICY "Users can view own roles and admins can view all"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id OR public.is_administrator());

DROP POLICY IF EXISTS "Only administrators can insert user roles" ON public.user_roles;
CREATE POLICY "Only administrators can insert user roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.is_administrator());

DROP POLICY IF EXISTS "Only administrators can update user roles" ON public.user_roles;
CREATE POLICY "Only administrators can update user roles"
  ON public.user_roles FOR UPDATE
  USING (public.is_administrator())
  WITH CHECK (public.is_administrator());

DROP POLICY IF EXISTS "Only administrators can delete user roles" ON public.user_roles;
CREATE POLICY "Only administrators can delete user roles"
  ON public.user_roles FOR DELETE
  USING (public.is_administrator());

-- Allow content_manager role (via user_roles) to manage resources & assistance_programs
DROP POLICY IF EXISTS "Content managers and admins can manage resources" ON public.resources;
CREATE POLICY "Content managers and admins can manage resources"
  ON public.resources FOR ALL
  USING (public.can_manage_content())
  WITH CHECK (public.can_manage_content());

DROP POLICY IF EXISTS "Moderators and admins can review reports" ON public.reports;
CREATE POLICY "Moderators and admins can review reports"
  ON public.reports FOR UPDATE
  USING (public.can_moderate())
  WITH CHECK (public.can_moderate());

-- ============================================================================
-- 12. Performance Indexes for Phase 4 Tables & Columns
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles (user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles (role);
CREATE INDEX IF NOT EXISTS idx_profiles_region_city ON public.profiles (region, city_municipality);
CREATE INDEX IF NOT EXISTS idx_profiles_account_status ON public.profiles (account_status);
CREATE INDEX IF NOT EXISTS idx_locations_hierarchy ON public.locations (region_code, province, city_municipality, barangay);
CREATE INDEX IF NOT EXISTS idx_resources_pub_status_verified ON public.resources (publication_status, verification_status, last_verified_at DESC);
CREATE INDEX IF NOT EXISTS idx_verification_logs_target ON public.verification_logs (target_type, target_id, created_at DESC);
