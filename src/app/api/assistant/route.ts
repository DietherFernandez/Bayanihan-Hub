import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  SUGGESTED_STARTING_QUESTIONS,
} from "@/lib/ai/retrieval";
import {
  generateGroundedAssistantResponse,
  getAiAdminRuntimeState,
  recordRateLimitHit,
  updateAiAdminSettings,
} from "@/lib/ai/provider";
import type { ModuleType } from "@/types/database";

const assistantQuerySchema = z.object({
  question: z
    .string()
    .trim()
    .min(3, "Please enter a question of at least 3 characters.")
    .max(500, "Questions must not exceed 500 characters."),
  language: z.enum(["en", "fil", "auto"]).optional().default("auto"),
  moduleFilter: z
    .enum([
      "all",
      "trabaho",
      "serbisyo",
      "pera",
      "bayanihan",
      "aral",
      "kaligtasan",
    ])
    .optional()
    .default("all"),
  location: z
    .object({
      regionCode: z.string().max(32).optional().default("ALL"),
      province: z.string().max(80).optional().default(""),
      cityMunicipality: z.string().max(80).optional().default(""),
      barangay: z.string().max(80).optional().default(""),
    })
    .optional(),
});

const adminSettingsPatchSchema = z.object({
  actorRole: z.string().optional(),
  aiEnabled: z.boolean().optional(),
  providerMode: z
    .enum(["auto_gemini_with_rag_fallback", "grounded_local_rag_only"])
    .optional(),
  modelName: z
    .enum(["gemini-2.5-flash", "gemini-1.5-flash", "grounded-local-rag"])
    .optional(),
  maxRequestsPerMinute: z.number().min(5).max(120).optional(),
  maxInputChars: z.number().min(100).max(1200).optional(),
  strictGroundingEnforced: z.boolean().optional(),
  promptInjectionShield: z.boolean().optional(),
  emergencyTriagePriority: z.boolean().optional(),
});

/**
 * GET /api/assistant
 * Returns public assistant availability, suggested starter questions, and
 * non-sensitive runtime status (never exposes API keys).
 */
export async function GET() {
  const snapshot = getAiAdminRuntimeState();
  const supabase = await createSupabaseServerClient();
  let aiEnabled = snapshot.settings.aiEnabled;
  let maxInputChars = snapshot.settings.maxInputChars;

  if (supabase) {
    const { data: dbSettings } = await supabase
      .from("ai_admin_settings")
      .select("ai_enabled, max_input_chars, provider_mode, model_name, strict_grounding_enforced, prompt_injection_shield, emergency_triage_priority, max_requests_per_minute")
      .eq("id", "default")
      .maybeSingle();

    if (dbSettings) {
      aiEnabled = dbSettings.ai_enabled ?? aiEnabled;
      maxInputChars = dbSettings.max_input_chars ?? maxInputChars;
      updateAiAdminSettings({
        aiEnabled: dbSettings.ai_enabled,
        maxInputChars: dbSettings.max_input_chars,
        providerMode: dbSettings.provider_mode,
        modelName: dbSettings.model_name,
        strictGroundingEnforced: dbSettings.strict_grounding_enforced,
        promptInjectionShield: dbSettings.prompt_injection_shield,
        emergencyTriagePriority: dbSettings.emergency_triage_priority,
        maxRequestsPerMinute: dbSettings.max_requests_per_minute,
      }, "administrator");
    }
  }

  return NextResponse.json({
    ok: true,
    aiEnabled,
    maxInputChars,
    suggestedQuestions: SUGGESTED_STARTING_QUESTIONS,
    adminSnapshot: getAiAdminRuntimeState(),
  });
}

/**
 * POST /api/assistant
 * Source-Grounded Bilingual (Filipino/English/Taglish) Civic Assistant Endpoint
 */
export async function POST(request: NextRequest) {
  const snapshot = getAiAdminRuntimeState();
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "anonymous";

  // 1. Per-IP Rate Limit
  const rate = checkRateLimit(
    `assistant:${clientIp}`,
    snapshot.settings.maxRequestsPerMinute,
    60_000
  );
  if (!rate.allowed) {
    recordRateLimitHit();
    return NextResponse.json(
      {
        ok: false,
        error:
          "Rate limit reached. Please wait a moment or use Universal Search (/search) directly.",
      },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  // Enforce dynamic maxInputChars from admin settings before schema parsing
  if (
    typeof body === "object" &&
    body !== null &&
    "question" in body &&
    typeof (body as { question?: unknown }).question === "string" &&
    (body as { question: string }).question.trim().length >
      snapshot.settings.maxInputChars
  ) {
    return NextResponse.json(
      {
        ok: false,
        error: `Question exceeds the maximum allowed length of ${snapshot.settings.maxInputChars} characters.`,
      },
      { status: 400 }
    );
  }

  const parsed = assistantQuerySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error:
          parsed.error.issues[0]?.message ||
          "Please enter a valid question (3 to 500 characters).",
      },
      { status: 400 }
    );
  }

  const { question, language, moduleFilter, location } = parsed.data;

  // 2. Duplicate rapid-fire request protection (same IP + identical normalized question within 3 seconds)
  const dedupeKey = `assistant-dedupe:${clientIp}:${question
    .toLowerCase()
    .slice(0, 64)}`;
  const dedupeCheck = checkRateLimit(dedupeKey, 3, 3_000);
  if (!dedupeCheck.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Duplicate request detected. Please wait a few seconds before resending the same question.",
      },
      { status: 429 }
    );
  }

  const result = await generateGroundedAssistantResponse({
    question,
    language,
    location,
    moduleFilter: moduleFilter as ModuleType | "all",
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: result.answer,
        disclaimer: result.disclaimer,
        sources: [],
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    ok: true,
    answer: result.answer,
    disclaimer: result.disclaimer,
    detectedLanguage: result.detectedLanguage,
    providerUsed: result.providerUsed,
    modelUsed: result.modelUsed,
    isEmergencyResponse: result.isEmergencyResponse,
    isBlockedInjectionOrAbuse: result.isBlockedInjectionOrAbuse,
    hasConflictWarning: result.hasConflictWarning,
    conflictExplanation: result.conflictExplanation,
    hasUnverifiedOrStaleWarning: result.hasUnverifiedOrStaleWarning,
    locationApplied: result.locationApplied,
    sources: result.sources.map((src) => ({
      ...src,
      href: src.internalHref,
    })),
  });
}

/**
 * PATCH /api/assistant
 * Admin-only endpoint to update AI governance settings without exposing secrets.
 */
export async function PATCH(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const parsed = adminSettingsPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid AI settings payload." },
      { status: 400 }
    );
  }

  const { actorRole: clientRoleFallback, ...updates } = parsed.data;
  let verifiedRole: string | undefined;

  const supabase = await createSupabaseServerClient();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Authentication required: Please sign in as an Administrator to modify AI governance settings.",
        },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_suspended, account_status")
      .eq("id", user.id)
      .single();

    if (
      !profile ||
      profile.is_suspended === true ||
      (profile.account_status && profile.account_status !== "active")
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Forbidden: Suspended or inactive accounts cannot modify AI governance settings.",
        },
        { status: 403 }
      );
    }

    const { data: roleRows } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    const assignedRoles = new Set<string>([
      ...(roleRows?.map((r) => String(r.role)) ?? []),
      ...(profile.role ? [String(profile.role)] : []),
    ]);

    if (
      assignedRoles.has("administrator") ||
      assignedRoles.has("super_admin") ||
      assignedRoles.has("content_admin")
    ) {
      verifiedRole = "administrator";
    } else {
      verifiedRole = profile.role ? String(profile.role) : "citizen";
    }
  } else if (process.env.NODE_ENV !== "production") {
    verifiedRole = clientRoleFallback;
  }

  const updated = updateAiAdminSettings(updates, verifiedRole);

  if (!updated.ok) {
    return NextResponse.json(
      { ok: false, error: updated.message },
      { status: 403 }
    );
  }

  if (supabase && verifiedRole === "administrator" && updated.snapshot) {
    try {
      await supabase.from("ai_admin_settings").upsert({
        id: "default",
        ai_enabled: updated.snapshot.settings.aiEnabled,
        provider_mode: updated.snapshot.settings.providerMode,
        model_name: updated.snapshot.settings.modelName,
        max_requests_per_minute: updated.snapshot.settings.maxRequestsPerMinute,
        max_input_chars: updated.snapshot.settings.maxInputChars,
        strict_grounding_enforced: updated.snapshot.settings.strictGroundingEnforced,
        prompt_injection_shield: updated.snapshot.settings.promptInjectionShield,
        emergency_triage_priority: updated.snapshot.settings.emergencyTriagePriority,
        updated_at: new Date().toISOString(),
      });
    } catch {
      // In-memory update succeeded; DB sync is best-effort
    }
  }

  return NextResponse.json({
    ok: true,
    message: updated.message,
    adminSnapshot: updated.snapshot,
  });
}
