-- GabayPH migration 0009: add audit attribution enum labels.
-- Keep this migration separate: PostgreSQL requires ALTER TYPE ADD VALUE
-- to commit before the new labels can be used by migration 0010.
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'service_role';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'db_bootstrap';
