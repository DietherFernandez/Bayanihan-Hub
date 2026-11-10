-- =============================================================================
-- GABAYPH PHASE 8 FINAL SECURITY CLOSURE (MIGRATION 0009)
-- =============================================================================
-- Narrowly scoped, additive remediation for:
-- 1. Fail-closed authorization in public.assign_user_role() when JWT role claims
--    are NULL or missing, plus target_user_id existence validation.
-- 2. Explicit EXECUTE privilege revocation from PUBLIC and anon on
--    public.assign_user_role(UUID, TEXT).
-- 3. Strict separation of 'administrator' vs 'content_admin' in public.has_role().
-- 4. Active/non-suspended profile enforcement on storage.objects UPDATE/DELETE.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. FIX public.has_role() ADMINISTRATOR MAPPING (STRICT LEAST PRIVILEGE)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.has_role(required_role TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Block immediately if user profile is suspended or not active
  IF EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND (p.is_suspended = TRUE OR p.account_status <> 'active')
  ) THEN
    RETURN FALSE;
  END IF;

  -- Check normalized user_roles table first (joined with active profile verification)
  IF EXISTS (
    SELECT 1
    FROM public.user_roles ur
    INNER JOIN public.profiles p ON p.id = ur.user_id
    WHERE ur.user_id = auth.uid()
      AND ur.role = required_role
      AND p.is_suspended = FALSE
      AND p.account_status = 'active'
  ) THEN
    RETURN TRUE;
  END IF;

  -- Backwards compatibility with profiles.role enum (strictly separating administrator from content_admin)
  IF EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.is_suspended = FALSE
      AND p.account_status = 'active'
      AND (
        p.role::text = required_role
        OR (required_role = 'administrator' AND p.role::text IN ('super_admin', 'administrator'))
        OR (required_role = 'content_manager' AND p.role::text IN ('super_admin', 'administrator', 'content_admin', 'content_manager', 'agency_editor'))
        OR (required_role = 'moderator' AND p.role::text IN ('super_admin', 'administrator', 'moderator', 'regional_moderator'))
        OR (required_role = 'verified_contributor' AND p.role::text IN ('super_admin', 'administrator', 'content_admin', 'content_manager', 'agency_editor', 'moderator', 'regional_moderator', 'verified_partner'))
      )
  ) THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$;

-- -----------------------------------------------------------------------------
-- 2. FAIL-CLOSED public.assign_user_role() WITH EXPLICIT GRANTS/REVOCATIONS
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
  v_jwt_role TEXT;
  v_is_authorized BOOLEAN := FALSE;
BEGIN
  -- 1. Validate role allowlist
  IF new_role IS NULL OR new_role NOT IN ('user', 'content_manager', 'moderator', 'administrator') THEN
    RAISE EXCEPTION 'Invalid role: %', COALESCE(new_role, 'NULL');
  END IF;

  -- 2. Validate target UUID exists in auth.users
  IF target_user_id IS NULL OR NOT EXISTS (
    SELECT 1 FROM auth.users u WHERE u.id = target_user_id
  ) THEN
    RAISE EXCEPTION 'Invalid target_user_id: user does not exist.';
  END IF;

  -- 3. Resolve JWT role claim safely (never NULL)
  v_jwt_role := COALESCE(
    NULLIF(current_setting('request.jwt.claim.role', true), ''),
    NULLIF((NULLIF(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role'), ''),
    ''
  );

  -- 4. Fail-closed authorization check:
  --    Only service_role, direct DB owner (postgres/supabase_admin for one-time bootstrap),
  --    or an active, non-suspended administrator (via public.is_administrator()) may proceed.
  v_is_authorized := (
    v_jwt_role = 'service_role'
    OR session_user IN ('postgres', 'supabase_admin')
    OR (
      v_jwt_role = 'authenticated'
      AND public.is_administrator() IS TRUE
    )
  );

  IF v_is_authorized IS NOT TRUE THEN
    RAISE EXCEPTION 'Forbidden: Only active administrators or service_role can assign roles.';
  END IF;

  -- 5. Assign role idempotently
  INSERT INTO public.user_roles (user_id, role, assigned_by)
  VALUES (target_user_id, new_role, auth.uid())
  ON CONFLICT (user_id, role) DO NOTHING;

  -- 6. Write immutable audit log
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
    jsonb_build_object(
      'assigned_role', new_role,
      'jwt_role', v_jwt_role,
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
-- 3. HARDEN STORAGE UPDATE/DELETE POLICIES AGAINST SUSPENDED ACCOUNTS
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'storage'
      AND table_name = 'objects'
  ) THEN
    DROP POLICY IF EXISTS "avatars_owner_update" ON storage.objects;
    CREATE POLICY "avatars_owner_update"
      ON storage.objects FOR UPDATE
      USING (
        bucket_id = 'avatars'
        AND auth.uid() IS NOT NULL
        AND (storage.foldername(name))[1] = auth.uid()::text
        AND NOT EXISTS (
          SELECT 1 FROM public.profiles p
          WHERE p.id = auth.uid() AND (p.is_suspended = TRUE OR p.account_status <> 'active')
        )
      )
      WITH CHECK (
        bucket_id = 'avatars'
        AND auth.uid() IS NOT NULL
        AND (storage.foldername(name))[1] = auth.uid()::text
        AND NOT EXISTS (
          SELECT 1 FROM public.profiles p
          WHERE p.id = auth.uid() AND (p.is_suspended = TRUE OR p.account_status <> 'active')
        )
      );

    DROP POLICY IF EXISTS "avatars_owner_delete" ON storage.objects;
    CREATE POLICY "avatars_owner_delete"
      ON storage.objects FOR DELETE
      USING (
        bucket_id = 'avatars'
        AND (
          (
            auth.uid() IS NOT NULL
            AND (storage.foldername(name))[1] = auth.uid()::text
            AND NOT EXISTS (
              SELECT 1 FROM public.profiles p
              WHERE p.id = auth.uid() AND (p.is_suspended = TRUE OR p.account_status <> 'active')
            )
          )
          OR public.has_role('administrator')
        )
      );

    DROP POLICY IF EXISTS "verification_docs_delete" ON storage.objects;
    CREATE POLICY "verification_docs_delete"
      ON storage.objects FOR DELETE
      USING (
        bucket_id = 'verification-documents'
        AND (
          (
            auth.uid() IS NOT NULL
            AND (storage.foldername(name))[1] = auth.uid()::text
            AND NOT EXISTS (
              SELECT 1 FROM public.profiles p
              WHERE p.id = auth.uid() AND (p.is_suspended = TRUE OR p.account_status <> 'active')
            )
          )
          OR public.has_role('administrator')
        )
      );
  END IF;
END
$$;
