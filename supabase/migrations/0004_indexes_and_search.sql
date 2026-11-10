-- ============================================================================
-- Migration 0004: Full-Text Search Triggers & Performance Indexes
-- ============================================================================

-- Trigger to auto-update updated_at column
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Trigger to maintain search_vector on resources
CREATE OR REPLACE FUNCTION public.resources_search_vector_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('simple', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(NEW.summary, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(NEW.source_name, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(NEW.eligibility_summary, '')), 'C');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_resources_search_vector
  BEFORE INSERT OR UPDATE ON public.resources
  FOR EACH ROW EXECUTE FUNCTION public.resources_search_vector_trigger();

-- Trigger to maintain search_vector on opportunities
CREATE OR REPLACE FUNCTION public.opportunities_search_vector_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('simple', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(NEW.source_name, '')), 'B');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_opportunities_search_vector
  BEFORE INSERT OR UPDATE ON public.opportunities
  FOR EACH ROW EXECUTE FUNCTION public.opportunities_search_vector_trigger();

-- Trigger to maintain search_vector on assistance_programs
CREATE OR REPLACE FUNCTION public.assistance_search_vector_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('simple', coalesce(NEW.program_name, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(NEW.source_name, '')), 'B');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_assistance_search_vector
  BEFORE INSERT OR UPDATE ON public.assistance_programs
  FOR EACH ROW EXECUTE FUNCTION public.assistance_search_vector_trigger();

-- Indexes for fast Universal Search & Filtering
CREATE INDEX IF NOT EXISTS idx_resources_search ON public.resources USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_resources_module_status ON public.resources (module, status, verification_status);
CREATE INDEX IF NOT EXISTS idx_resources_location ON public.resources (location_id);

CREATE INDEX IF NOT EXISTS idx_opportunities_search ON public.opportunities USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_opportunities_type_status ON public.opportunities (type, status, verification_status);
CREATE INDEX IF NOT EXISTS idx_opportunities_location ON public.opportunities (location_id);

CREATE INDEX IF NOT EXISTS idx_assistance_search ON public.assistance_programs USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_assistance_type_status ON public.assistance_programs (program_type, status, verification_status);

CREATE INDEX IF NOT EXISTS idx_bayanihan_type_status ON public.bayanihan_posts (post_type, status, location_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports (resolution_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_active ON public.announcements (is_active, expires_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs (created_at DESC);
