-- ============================================================================
-- Migration 0003: Row Level Security (RLS) Policies & Helper Functions
-- ============================================================================

-- Helper function to retrieve current user's role safely
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Helper function to check if user is an admin or moderator
CREATE OR REPLACE FUNCTION public.is_staff_or_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND is_suspended = FALSE
      AND role IN ('super_admin', 'content_admin', 'regional_moderator')
  );
$$;

-- Enable RLS on all tables
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assistance_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bayanihan_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. LOCATIONS & CATEGORIES: Publicly readable, Admin writable
CREATE POLICY "Locations are viewable by everyone"
  ON public.locations FOR SELECT USING (TRUE);

CREATE POLICY "Locations manageable by admins"
  ON public.locations FOR ALL
  USING (public.current_user_role() IN ('super_admin', 'content_admin'));

CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT USING (TRUE);

CREATE POLICY "Categories manageable by admins"
  ON public.categories FOR ALL
  USING (public.current_user_role() IN ('super_admin', 'content_admin'));

-- 2. PROFILES: Strict self-access; Super Admin can manage roles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.current_user_role() = 'super_admin');

CREATE POLICY "Users can update their own profile details"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
  );

CREATE POLICY "Super admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.current_user_role() = 'super_admin');

CREATE POLICY "Users can delete their own profile"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

-- 3. ORGANIZATIONS: Published orgs viewable by all; staff can manage
CREATE POLICY "Published organizations are viewable by everyone"
  ON public.organizations FOR SELECT
  USING (status = 'published' OR owner_id = auth.uid() OR public.is_staff_or_admin());

CREATE POLICY "Staff can manage organizations"
  ON public.organizations FOR ALL
  USING (public.is_staff_or_admin());

-- 4. RESOURCES: Published viewable by all; staff can manage all
CREATE POLICY "Published resources are viewable by everyone"
  ON public.resources FOR SELECT
  USING (status = 'published' OR public.is_staff_or_admin());

CREATE POLICY "Admins can manage resources"
  ON public.resources FOR ALL
  USING (public.current_user_role() IN ('super_admin', 'content_admin'));

-- 5. OPPORTUNITIES: Published viewable by all; organizations can submit drafts
CREATE POLICY "Published opportunities are viewable by everyone"
  ON public.opportunities FOR SELECT
  USING (status = 'published' OR created_by = auth.uid() OR public.is_staff_or_admin());

CREATE POLICY "Staff and verified orgs can insert opportunities"
  ON public.opportunities FOR INSERT
  WITH CHECK (
    public.is_staff_or_admin()
    OR (
      public.current_user_role() = 'organization'
      AND status = 'under_review'
      AND verification_status = 'verification_pending'
    )
  );

CREATE POLICY "Staff can update or delete opportunities"
  ON public.opportunities FOR UPDATE
  USING (public.is_staff_or_admin());

-- 6. ASSISTANCE PROGRAMS: Published viewable by all; admins manage
CREATE POLICY "Published assistance programs are viewable by everyone"
  ON public.assistance_programs FOR SELECT
  USING (status = 'published' OR public.is_staff_or_admin());

CREATE POLICY "Admins can manage assistance programs"
  ON public.assistance_programs FOR ALL
  USING (public.current_user_role() IN ('super_admin', 'content_admin'));

-- 7. BAYANIHAN POSTS: Published viewable by all; authenticated users can submit for moderation
CREATE POLICY "Published bayanihan posts are viewable by everyone"
  ON public.bayanihan_posts FOR SELECT
  USING (status = 'published' OR created_by = auth.uid() OR public.is_staff_or_admin());

CREATE POLICY "Authenticated users can submit bayanihan posts for review"
  ON public.bayanihan_posts FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND created_by = auth.uid()
    AND status = 'under_review'
  );

CREATE POLICY "Moderators and admins can manage bayanihan posts"
  ON public.bayanihan_posts FOR UPDATE
  USING (public.is_staff_or_admin());

-- 8. BOOKMARKS, SEARCH_HISTORY, LEARNING_PROGRESS: Strictly private to owner
CREATE POLICY "Users manage own bookmarks"
  ON public.bookmarks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own search history"
  ON public.search_history FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own learning progress"
  ON public.learning_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 9. REPORTS: Anyone can submit (rate-limited at edge/API); reporters see own; staff resolves
CREATE POLICY "Anyone can submit a report"
  ON public.reports FOR INSERT
  WITH CHECK (
    reporter_id IS NULL OR reporter_id = auth.uid()
  );

CREATE POLICY "Reporters can view their own reports and staff can view all"
  ON public.reports FOR SELECT
  USING (
    (auth.uid() IS NOT NULL AND reporter_id = auth.uid())
    OR public.is_staff_or_admin()
  );

CREATE POLICY "Staff can update report resolution"
  ON public.reports FOR UPDATE
  USING (public.is_staff_or_admin());

-- 10. ANNOUNCEMENTS: Active non-expired viewable by all; admins manage
CREATE POLICY "Active non-expired announcements are viewable by everyone"
  ON public.announcements FOR SELECT
  USING (
    (is_active = TRUE AND expires_at > NOW())
    OR public.is_staff_or_admin()
  );

CREATE POLICY "Admins can manage announcements"
  ON public.announcements FOR ALL
  USING (public.current_user_role() IN ('super_admin', 'content_admin'));

-- 11. VERIFICATION LOGS: Public transparency trail, append-only by staff
CREATE POLICY "Verification logs are viewable by everyone"
  ON public.verification_logs FOR SELECT USING (TRUE);

CREATE POLICY "Staff can append verification logs"
  ON public.verification_logs FOR INSERT
  WITH CHECK (public.is_staff_or_admin());

-- 12. AUDIT LOGS: Super Admin read-only; staff insert
CREATE POLICY "Super admins can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.current_user_role() = 'super_admin');

CREATE POLICY "Staff and system can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (public.is_staff_or_admin());
