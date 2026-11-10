import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/security/rate-limit";
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
  return NextResponse.json({
    ok: true,
    aiEnabled: snapshot.settings.aiEnabled,
    maxInputChars: snapshot.settings.maxInputChars,
    suggestedQuestions: SUGGESTED_STARTING_QUESTIONS,
    adminSnapshot: snapshot,
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

  const { actorRole, ...updates } = parsed.data;
  const updated = updateAiAdminSettings(updates, actorRole);

  if (!updated.ok) {
    return NextResponse.json(
      { ok: false, error: updated.message },
      { status: 403 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: updated.message,
    adminSnapshot: updated.snapshot,
  });
}
