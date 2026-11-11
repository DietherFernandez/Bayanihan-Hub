-- =============================================================================
-- GABAYPH PHASE 8 FINAL SECURITY CLOSURE (MIGRATION 0009 — REVISED)
-- =============================================================================
-- Narrowly scoped, additive, non-destructive remediation for:
-- 1. Fail-closed positive EXISTS profile validation (id = auth.uid(),
--    is_suspended IS FALSE, account_status = 'active') across all owner-side
--    Storage INSERT, UPDATE, and DELETE policies.
-- 2. Complete, least-privilege legacy & canonical role compatibility in
--    public.has_role(TEXT), including 'user' and 'verified_contributor', while
--    strictly preventing 'content_admin' or 'content_manager' from gaining
--    'administrator' privileges.
-- 3. Accurate, non-falsified actor_role attribution in public.audit_logs by
--    extending enum public.user_role with 'service_role' and 'db_bootstrap'
--    and recording the true execution context in public.assign_user_role().
-- 4. Fail-closed authorization in public.assign_user_role(UUID, TEXT),
--    explicit target_user_id validation, and explicit EXECUTE privilege
--    revocations from PUBLIC and anon.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. EXTEND public.user_role ENUM FOR ACCURATE SYSTEM/BOOTSTRAP AUDIT ATTRIBUTION
-- -----------------------------------------------------------------------------
-- public.audit_logs.actor_role is typed as `public.user_role NOT NULL` (from 0002).
-- Adding 'service_role' and 'db_bootstrap' prevents falsely attributing automated
-- service-role or database-owner bootstrap operations to a human 'super_admin'.
-- Keep enum additions at top level. Do not swallow failures: later
-- role-assignment statements require these labels to exist.
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'service_role';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'db_bootstrap';

-- -----------------------------------------------------------------------------
-- 2. HARDEN public.has_role(TEXT) — FAIL-CLOSED & COMPLETE LEGACY ROLE MAPPING
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.has_role(required_role TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- 1. Reject unauthenticated or empty role queries immediately
  IF auth.uid() IS NULL OR required_role IS NULL OR btrim(required_role) = '' THEN
    RETURN FALSE;
  END IF;

  -- 2. Fail-closed positive profile check:
  --    A matching row in public.profiles MUST exist with is_suspended IS FALSE
  --    and account_status = 'active'. Missing profiles or NULL columns fail closed.
  IF NOT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.is_suspended IS FALSE
      AND p.account_status = 'active'
  ) THEN
    RETURN FALSE;
  END IF;

  -- 3. Check normalized public.user_roles table (joined with positive active profile check)
  IF EXISTS (
    SELECT 1
    FROM public.user_roles ur
    INNER JOIN public.profiles p ON p.id = ur.user_id
    WHERE ur.user_id = auth.uid()
      AND p.is_suspended IS FALSE
      AND p.account_status = 'active'
      AND (
        ur.role = required_role
        OR (required_role = 'administrator' AND ur.role = 'administrator')
        OR (required_role = 'content_manager' AND ur.role IN ('administrator', 'content_manager'))
        OR (required_role = 'moderator' AND ur.role IN ('administrator', 'moderator'))
        OR (required_role = 'user' AND ur.role IN ('administrator', 'content_manager', 'moderator', 'user'))
      )
  ) THEN
    RETURN TRUE;
  END IF;

  -- 4. Backwards compatibility with public.profiles.role enum:
  --    Strictly enforces least privilege: 'content_admin' and 'content_manager'
  --    NEVER match required_role = 'administrator'.
  IF EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.is_suspended IS FALSE
      AND p.account_status = 'active'
      AND (
        p.role::text = required_role
        OR (
          required_role = 'administrator'
          AND p.role::text IN ('super_admin', 'administrator')
        )
        OR (
          required_role = 'content_manager'
          AND p.role::text IN (
            'super_admin',
            'administrator',
            'content_admin',
            'content_manager',
            'agency_editor'
          )
        )
        OR (
          required_role = 'moderator'
          AND p.role::text IN (
            'super_admin',
            'administrator',
            'moderator',
            'regional_moderator'
          )
        )
        OR (
          required_role = 'verified_contributor'
          AND p.role::text = 'verified_partner'
        )
        OR (
          required_role = 'user'
          AND p.role::text IN (
            'citizen',
            'user',
            'organization',
            'verified_partner',
            'regional_moderator',
            'moderator',
            'agency_editor',
            'content_admin',
            'content_manager',
            'super_admin',
            'administrator'
          )
        )
      )
  ) THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$;

-- -----------------------------------------------------------------------------
-- 3. FAIL-CLOSED public.assign_user_role() WITH ACCURATE AUDIT ATTRIBUTION
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.assign_user_role(
  target_user_id UUID,
  new_role TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_jwt_role TEXT := '';
  v_claims_raw TEXT := '';
  v_is_service_role BOOLEAN := FALSE;
  v_is_db_bootstrap BOOLEAN := FALSE;
  v_is_active_admin BOOLEAN := FALSE;
  v_is_authorized BOOLEAN := FALSE;
  v_actor_id UUID := NULL;
  v_actor_role public.user_role;
  v_execution_context TEXT;
BEGIN
  -- 1. Validate target role against canonical allowlist
  IF new_role IS NULL OR new_role NOT IN ('user', 'content_manager', 'moderator', 'administrator') THEN
    RAISE EXCEPTION 'Invalid role: %', COALESCE(new_role, 'NULL');
  END IF;

  -- 2. Validate target_user_id is non-null and exists in auth.users
  IF target_user_id IS NULL OR NOT EXISTS (
    SELECT 1 FROM auth.users u WHERE u.id = target_user_id
  ) THEN
    RAISE EXCEPTION 'Invalid target_user_id: user does not exist.';
  END IF;

  -- 3. Safely extract JWT role claim (fail-closed if missing, empty, or malformed JSON)
  v_jwt_role := COALESCE(NULLIF(btrim(current_setting('request.jwt.claim.role', true)), ''), '');
  IF v_jwt_role = '' THEN
    v_claims_raw := COALESCE(NULLIF(btrim(current_setting('request.jwt.claims', true)), ''), '');
    IF v_claims_raw <> '' THEN
      BEGIN
        v_jwt_role := COALESCE(NULLIF(btrim(v_claims_raw::jsonb ->> 'role'), ''), '');
      EXCEPTION
        WHEN others THEN
          v_jwt_role := '';
      END;
    END IF;
  END IF;

  -- 4. Evaluate distinct caller contexts explicitly (never NULL):
  --    (a) Service-role API call: JWT role claim is 'service_role'
  v_is_service_role := (v_jwt_role = 'service_role');

  --    (b) Trusted DB owner bootstrap (e.g., initial admin setup in SQL Editor):
  --        Only when no PostgREST JWT role is active (v_jwt_role = '') AND the
  --        direct session_user is 'postgres' or 'supabase_admin'.
  v_is_db_bootstrap := (
    v_jwt_role = ''
    AND session_user IN ('postgres', 'supabase_admin')
  );

  --    (c) Authenticated human Administrator:
  --        JWT role claim is 'authenticated', auth.uid() is present, and
  --        public.is_administrator() (which calls hardened public.has_role('administrator'))
  --        confirms an existing, active, non-suspended administrator profile.
  IF v_jwt_role = 'authenticated' AND auth.uid() IS NOT NULL THEN
    v_is_active_admin := (public.is_administrator() IS TRUE);
  ELSE
    v_is_active_admin := FALSE;
  END IF;

  v_is_authorized := (
    v_is_service_role IS TRUE
    OR v_is_db_bootstrap IS TRUE
    OR v_is_active_admin IS TRUE
  );

  -- 5. Fail-closed rejection for all other callers (anon, ordinary user, content_admin,
  --    moderator, suspended admin, missing profile, or missing JWT claim under authenticator)
  IF v_is_authorized IS NOT TRUE THEN
    RAISE EXCEPTION 'Forbidden: Only active administrators or service_role can assign roles.';
  END IF;

  -- 6. Resolve accurate audit actor_id and actor_role without falsifying human attribution
  IF v_is_active_admin IS TRUE THEN
    v_actor_id := auth.uid();
    SELECT CASE
      WHEN p.role IN ('super_admin', 'administrator') THEN p.role
      ELSE 'administrator'::public.user_role
    END
    INTO v_actor_role
    FROM public.profiles p
    WHERE p.id = auth.uid();

    v_actor_role := COALESCE(v_actor_role, 'administrator'::public.user_role);
    v_execution_context := 'authenticated_administrator';
  ELSIF v_is_service_role IS TRUE THEN
    -- Service-role operation: only link actor_id if auth.uid() actually exists in public.profiles
    IF auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid()) THEN
      v_actor_id := auth.uid();
    ELSE
      v_actor_id := NULL;
    END IF;
    v_actor_role := 'service_role'::public.user_role;
    v_execution_context := 'service_role_api';
  ELSE
    -- Trusted database bootstrap operation (actor_id is NULL unless auth.uid() matches a profile)
    IF auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid()) THEN
      v_actor_id := auth.uid();
    ELSE
      v_actor_id := NULL;
    END IF;
    v_actor_role := 'db_bootstrap'::public.user_role;
    v_execution_context := 'database_bootstrap';
  END IF;

  -- 7. Assign role idempotently
  INSERT INTO public.user_roles (user_id, role, assigned_by)
  VALUES (target_user_id, new_role, v_actor_id)
  ON CONFLICT (user_id, role) DO NOTHING;

  -- 8. Write accurate, immutable audit log entry
  INSERT INTO public.audit_logs (
    actor_id,
    actor_role,
    action,
    entity_type,
    entity_id,
    metadata
  )
  VALUES (
    v_actor_id,
    v_actor_role,
    'ASSIGN_USER_ROLE',
    'user_roles',
    target_user_id::text,
    jsonb_build_object(
      'assigned_role', new_role,
      'execution_context', v_execution_context,
      'jwt_role', NULLIF(v_jwt_role, ''),
      'session_user', session_user
    )
  );
END;
$$;

-- Restrict EXECUTE permissions: revoke from PUBLIC and anon, grant only to authenticated and service_role
REVOKE ALL ON FUNCTION public.assign_user_role(UUID, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.assign_user_role(UUID, TEXT) FROM anon;
GRANT EXECUTE ON FUNCTION public.assign_user_role(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.assign_user_role(UUID, TEXT) TO service_role;

-- -----------------------------------------------------------------------------
-- 4. FAIL-CLOSED POSITIVE PROFILE VALIDATION FOR STORAGE POLICIES
-- -----------------------------------------------------------------------------
-- Every owner-side INSERT, UPDATE, and DELETE check now uses a positive EXISTS
-- subquery requiring:
--   p.id = auth.uid() AND p.is_suspended IS FALSE AND p.account_status = 'active'
-- If a user has no row in public.profiles, or account_status is NULL/non-active,
-- or is_suspended is TRUE/NULL, the check fails closed.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'storage'
      AND table_name = 'objects'
  ) THEN
    -- 1. Avatars INSERT: owner folder + positive active profile check
    DROP POLICY IF EXISTS "avatars_owner_insert" ON storage.objects;
    CREATE POLICY "avatars_owner_insert"
      ON storage.objects FOR INSERT
      WITH CHECK (
        bucket_id = 'avatars'
        AND auth.uid() IS NOT NULL
        AND (storage.foldername(name))[1] = auth.uid()::text
        AND EXISTS (
          SELECT 1
          FROM public.profiles p
          WHERE p.id = auth.uid()
            AND p.is_suspended IS FALSE
            AND p.account_status = 'active'
        )
      );

    -- 2. Avatars UPDATE: owner folder + positive active profile check in both USING and WITH CHECK
    DROP POLICY IF EXISTS "avatars_owner_update" ON storage.objects;
    CREATE POLICY "avatars_owner_update"
      ON storage.objects FOR UPDATE
      USING (
        bucket_id = 'avatars'
        AND auth.uid() IS NOT NULL
        AND (storage.foldername(name))[1] = auth.uid()::text
        AND EXISTS (
          SELECT 1
          FROM public.profiles p
          WHERE p.id = auth.uid()
            AND p.is_suspended IS FALSE
            AND p.account_status = 'active'
        )
      )
      WITH CHECK (
        bucket_id = 'avatars'
        AND auth.uid() IS NOT NULL
        AND (storage.foldername(name))[1] = auth.uid()::text
        AND EXISTS (
          SELECT 1
          FROM public.profiles p
          WHERE p.id = auth.uid()
            AND p.is_suspended IS FALSE
            AND p.account_status = 'active'
        )
      );

    -- 3. Avatars DELETE: owner branch requires positive active profile check; admin branch uses hardened has_role('administrator')
    DROP POLICY IF EXISTS "avatars_owner_delete" ON storage.objects;
    CREATE POLICY "avatars_owner_delete"
      ON storage.objects FOR DELETE
      USING (
        bucket_id = 'avatars'
        AND (
          (
            auth.uid() IS NOT NULL
            AND (storage.foldername(name))[1] = auth.uid()::text
            AND EXISTS (
              SELECT 1
              FROM public.profiles p
              WHERE p.id = auth.uid()
                AND p.is_suspended IS FALSE
                AND p.account_status = 'active'
            )
          )
          OR public.has_role('administrator')
        )
      );

    -- 4. Verification Documents INSERT: owner folder + positive active profile check
    DROP POLICY IF EXISTS "verification_docs_insert" ON storage.objects;
    CREATE POLICY "verification_docs_insert"
      ON storage.objects FOR INSERT
      WITH CHECK (
        bucket_id = 'verification-documents'
        AND auth.uid() IS NOT NULL
        AND (storage.foldername(name))[1] = auth.uid()::text
        AND EXISTS (
          SELECT 1
          FROM public.profiles p
          WHERE p.id = auth.uid()
            AND p.is_suspended IS FALSE
            AND p.account_status = 'active'
        )
      );

    -- 5. Verification Documents SELECT: owners must have an active profile;
    -- moderators/administrators are checked through hardened has_role().
    DROP POLICY IF EXISTS "verification_docs_select" ON storage.objects;
    CREATE POLICY "verification_docs_select"
      ON storage.objects FOR SELECT
      USING (
        bucket_id = 'verification-documents'
        AND (
          (
            auth.uid() IS NOT NULL
            AND (storage.foldername(name))[1] = auth.uid()::text
            AND EXISTS (
              SELECT 1
              FROM public.profiles p
              WHERE p.id = auth.uid()
                AND p.is_suspended IS FALSE
                AND p.account_status = 'active'
            )
          )
          OR public.has_role('moderator')
          OR public.has_role('administrator')
        )
      );

    -- 6. Verification Documents DELETE: owner branch requires positive active profile check; admin branch uses hardened has_role('administrator')
    DROP POLICY IF EXISTS "verification_docs_delete" ON storage.objects;
    CREATE POLICY "verification_docs_delete"
      ON storage.objects FOR DELETE
      USING (
        bucket_id = 'verification-documents'
        AND (
          (
            auth.uid() IS NOT NULL
            AND (storage.foldername(name))[1] = auth.uid()::text
            AND EXISTS (
              SELECT 1
              FROM public.profiles p
              WHERE p.id = auth.uid()
                AND p.is_suspended IS FALSE
                AND p.account_status = 'active'
            )
          )
          OR public.has_role('administrator')
        )
      );
  END IF;
END
$$;

-- -----------------------------------------------------------------------------
-- 5. REMOVE SELF-REFERENTIAL PROFILES UPDATE POLICY
-- -----------------------------------------------------------------------------
-- The old WITH CHECK subquery reads public.profiles from a policy on the same
-- table, which can trigger infinite-recursion errors under RLS. The dedicated
-- BEFORE UPDATE anti-escalation trigger from migration 0005 remains responsible
-- for protecting role/suspension/account-status columns.
DROP POLICY IF EXISTS "Users can update their own profile details" ON public.profiles;
CREATE POLICY "Users can update their own profile details"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
