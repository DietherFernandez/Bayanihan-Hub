-- ============================================================================
-- GABAYPH — PHASE 7 ADDITIVE MIGRATION: AI ASSISTANT CONVERSATIONS & SETTINGS
-- Strictly additive migration (no DROP TABLE or TRUNCATE).
-- Enforces user ownership via Row Level Security (RLS), 30-day retention
-- defaults, and administrator-only AI governance settings.
-- ============================================================================

-- 1. Authenticated Citizen AI Conversations Table
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'GabayPH AI Consultation',
  preferred_language TEXT NOT NULL DEFAULT 'fil' CHECK (preferred_language IN ('en', 'fil', 'taglish')),
  region_code TEXT DEFAULT 'NATIONAL',
  province TEXT DEFAULT '',
  city_municipality TEXT DEFAULT '',
  barangay TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days')
);

CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_updated
  ON public.ai_conversations (user_id, updated_at DESC);

ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own AI conversations" ON public.ai_conversations;
CREATE POLICY "Users can view own AI conversations"
  ON public.ai_conversations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own AI conversations" ON public.ai_conversations;
CREATE POLICY "Users can insert own AI conversations"
  ON public.ai_conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own AI conversations" ON public.ai_conversations;
CREATE POLICY "Users can update own AI conversations"
  ON public.ai_conversations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own AI conversations" ON public.ai_conversations;
CREATE POLICY "Users can delete own AI conversations"
  ON public.ai_conversations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 2. Authenticated Citizen AI Messages Table
CREATE TABLE IF NOT EXISTS public.ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL CHECK (char_length(content) <= 8000),
  citations JSONB NOT NULL DEFAULT '[]'::jsonb,
  grounding_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation_created
  ON public.ai_messages (conversation_id, created_at ASC);

ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own AI messages" ON public.ai_messages;
CREATE POLICY "Users can view own AI messages"
  ON public.ai_messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own AI messages" ON public.ai_messages;
CREATE POLICY "Users can insert own AI messages"
  ON public.ai_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own AI messages" ON public.ai_messages;
CREATE POLICY "Users can delete own AI messages"
  ON public.ai_messages
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 3. Administrator AI Governance Settings Table (Never stores API keys)
CREATE TABLE IF NOT EXISTS public.ai_admin_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  ai_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  provider_mode TEXT NOT NULL DEFAULT 'auto_gemini_with_rag_fallback'
    CHECK (provider_mode IN ('auto_gemini_with_rag_fallback', 'grounded_local_rag_only')),
  model_name TEXT NOT NULL DEFAULT 'gemini-2.5-flash'
    CHECK (model_name IN ('gemini-2.5-flash', 'gemini-1.5-flash', 'grounded-local-rag')),
  max_requests_per_minute INTEGER NOT NULL DEFAULT 20 CHECK (max_requests_per_minute BETWEEN 5 AND 120),
  max_input_chars INTEGER NOT NULL DEFAULT 500 CHECK (max_input_chars BETWEEN 100 AND 1200),
  max_output_tokens INTEGER NOT NULL DEFAULT 700 CHECK (max_output_tokens BETWEEN 200 AND 2048),
  strict_grounding_enforced BOOLEAN NOT NULL DEFAULT TRUE,
  prompt_injection_shield BOOLEAN NOT NULL DEFAULT TRUE,
  emergency_triage_priority BOOLEAN NOT NULL DEFAULT TRUE,
  retention_days INTEGER NOT NULL DEFAULT 30 CHECK (retention_days BETWEEN 7 AND 90),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.ai_admin_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read non-sensitive AI availability settings" ON public.ai_admin_settings;
CREATE POLICY "Public can read non-sensitive AI availability settings"
  ON public.ai_admin_settings
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Only administrators can update AI settings" ON public.ai_admin_settings;
CREATE POLICY "Only administrators can update AI settings"
  ON public.ai_admin_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'administrator'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'administrator'
    )
  );
