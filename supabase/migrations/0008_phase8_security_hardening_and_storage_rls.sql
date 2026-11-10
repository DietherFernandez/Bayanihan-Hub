-- =============================================================================
-- GABAYPH PHASE 8: SECURITY HARDENING, SUSPENSION ENFORCEMENT & STORAGE RLS
-- =============================================================================
-- Additive, non-destructive security hardening migration:
-- 1. SEC-03: Ensure public.has_role() and public.current_user_role() check
--    profile account_status = 'active' and is_suspended = FALSE on all branches.
-- 2. SEC-04: Configure Supabase Storage buckets ('avatars', 'verification-documents')
--    with explicit file_size_limit, allowed_mime_types, and strict storage.objects RLS.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. HARDEN ROLE EVALUATION FUNCTIONS AGAINST SUSPENDED ACCOUNTS (SEC-03)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (
      SELECT p.role
      FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.is_suspended = FALSE
        AND p.account_status = 'active'
    ),
    'citizen'::public.user_role
  );
$$;

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

  -- Backwards compatibility with profiles.role enum
  IF EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.is_suspended = FALSE
      AND p.account_status = 'active'
      AND (
        p.role::text = required_role
        OR (required_role = 'administrator' AND p.role::text IN ('super_admin', 'content_admin'))
        OR (required_role = 'content_manager' AND p.role::text IN ('super_admin', 'content_admin', 'agency_editor'))
        OR (required_role = 'moderator' AND p.role::text IN ('super_admin', 'content_admin', 'moderator'))
        OR (required_role = 'verified_contributor' AND p.role::text IN ('super_admin', 'content_admin', 'agency_editor', 'moderator', 'verified_partner'))
      )
  ) THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$;

-- -----------------------------------------------------------------------------
-- 2. SUPABASE STORAGE BUCKET & OBJECT RLS HARDENING (SEC-04)
-- -----------------------------------------------------------------------------

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'storage'
      AND table_name = 'buckets'
  ) THEN
    -- Public avatars bucket (2 MB limit, safe raster image MIME types only)
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'avatars',
      'avatars',
      TRUE,
      2097152,
      ARRAY['image/jpeg', 'image/png', 'image/webp']
    )
    ON CONFLICT (id) DO UPDATE
    SET
      public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

    -- Private verification documents bucket (5 MB limit, PDF and safe images only)
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'verification-documents',
      'verification-documents',
      FALSE,
      5242880,
      ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
    )
    ON CONFLICT (id) DO UPDATE
    SET
      public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;
  END IF;
END
$$;

-- Create granular storage.objects policies if storage.objects exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'storage'
      AND table_name = 'objects'
  ) THEN
    -- Avatars: public read
    DROP POLICY IF EXISTS "avatars_public_select" ON storage.objects;
    CREATE POLICY "avatars_public_select"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'avatars');

    -- Avatars: authenticated active user can upload only into their own UID folder
    DROP POLICY IF EXISTS "avatars_owner_insert" ON storage.objects;
    CREATE POLICY "avatars_owner_insert"
      ON storage.objects FOR INSERT
      WITH CHECK (
        bucket_id = 'avatars'
        AND auth.uid() IS NOT NULL
        AND (storage.foldername(name))[1] = auth.uid()::text
        AND NOT EXISTS (
          SELECT 1 FROM public.profiles p
          WHERE p.id = auth.uid() AND (p.is_suspended = TRUE OR p.account_status <> 'active')
        )
      );

    -- Avatars: owner can update/delete only their own files
    DROP POLICY IF EXISTS "avatars_owner_update" ON storage.objects;
    CREATE POLICY "avatars_owner_update"
      ON storage.objects FOR UPDATE
      USING (
        bucket_id = 'avatars'
        AND auth.uid() IS NOT NULL
        AND (storage.foldername(name))[1] = auth.uid()::text
      )
      WITH CHECK (
        bucket_id = 'avatars'
        AND auth.uid() IS NOT NULL
        AND (storage.foldername(name))[1] = auth.uid()::text
      );

    DROP POLICY IF EXISTS "avatars_owner_delete" ON storage.objects;
    CREATE POLICY "avatars_owner_delete"
      ON storage.objects FOR DELETE
      USING (
        bucket_id = 'avatars'
        AND (
          (auth.uid() IS NOT NULL AND (storage.foldername(name))[1] = auth.uid()::text)
          OR public.has_role('administrator')
        )
      );

    -- Verification Documents: only owner or moderator/administrator can read
    DROP POLICY IF EXISTS "verification_docs_select" ON storage.objects;
    CREATE POLICY "verification_docs_select"
      ON storage.objects FOR SELECT
      USING (
        bucket_id = 'verification-documents'
        AND (
          (auth.uid() IS NOT NULL AND (storage.foldername(name))[1] = auth.uid()::text)
          OR public.has_role('moderator')
          OR public.has_role('administrator')
        )
      );

    -- Verification Documents: authenticated active user can upload into own UID folder
    DROP POLICY IF EXISTS "verification_docs_insert" ON storage.objects;
    CREATE POLICY "verification_docs_insert"
      ON storage.objects FOR INSERT
      WITH CHECK (
        bucket_id = 'verification-documents'
        AND auth.uid() IS NOT NULL
        AND (storage.foldername(name))[1] = auth.uid()::text
        AND NOT EXISTS (
          SELECT 1 FROM public.profiles p
          WHERE p.id = auth.uid() AND (p.is_suspended = TRUE OR p.account_status <> 'active')
        )
      );

    -- Verification Documents: only owner or administrator can delete
    DROP POLICY IF EXISTS "verification_docs_delete" ON storage.objects;
    CREATE POLICY "verification_docs_delete"
      ON storage.objects FOR DELETE
      USING (
        bucket_id = 'verification-documents'
        AND (
          (auth.uid() IS NOT NULL AND (storage.foldername(name))[1] = auth.uid()::text)
          OR public.has_role('administrator')
        )
      );
  END IF;
END
$$;
