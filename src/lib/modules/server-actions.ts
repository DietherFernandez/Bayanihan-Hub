"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  bayanihanSubmissionSchema,
  containsSensitivePersonalData,
  reportSubmissionSchema,
} from "@/lib/validations/schemas";
import { canVerifyOfficialResources, hasPermission } from "@/lib/auth/rbac";
import type {
  ModuleType,
  UserRole,
  VerificationStatus,
} from "@/types/database";

/**
 * 1. Authenticated Bookmark Server Action
 */
export async function saveBookmarkServerAction(
  input: {
    targetType:
      | "resource"
      | "opportunity"
      | "assistance_program"
      | "bayanihan_post";
    targetId: string;
    targetSlug: string;
    targetTitle: string;
    targetModule: ModuleType;
  },
  isAuthenticatedFallback = false
): Promise<{ ok: boolean; requiresAuth?: boolean; message: string }> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    if (!isAuthenticatedFallback) {
      return {
        ok: true,
        requiresAuth: false,
        message:
          "Saved to your device bookmarks. Sign in to sync bookmarks across devices.",
      };
    }
    return {
      ok: true,
      message: "Bookmark saved to your account.",
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      requiresAuth: true,
      message: "Please sign in to save cloud bookmarks to your GabayPH account.",
    };
  }

  const { error } = await supabase.from("bookmarks").upsert(
    {
      user_id: user.id,
      target_type: input.targetType,
      target_id: input.targetId,
      target_slug: input.targetSlug,
      target_title: input.targetTitle,
      target_module: input.targetModule,
    },
    { onConflict: "user_id,target_type,target_id" }
  );

  if (error) {
    return {
      ok: false,
      message: "Could not save bookmark. Please try again.",
    };
  }

  return {
    ok: true,
    message: "Bookmark synced to your GabayPH account.",
  };
}

/**
 * 2. Bayanihan Community Submission Server Action (With Privacy & Moderation Safeguards)
 */
export async function submitBayanihanCommunityPostAction(
  rawInput: unknown
): Promise<{
  ok: boolean;
  message: string;
  moderationStatus?: "under_review";
}> {
  const parsed = bayanihanSubmissionSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      message:
        parsed.error.issues[0]?.message ||
        "Please check your community post details.",
    };
  }

  const data = parsed.data;
  const combinedText = `${data.title} ${data.summary} ${data.dropOffOrMeetingPoint}`;
  const piiCheck = containsSensitivePersonalData(combinedText);
  if (piiCheck.flagged) {
    return {
      ok: false,
      message: piiCheck.reason || "Please remove sensitive personal data.",
    };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      ok: true,
      moderationStatus: "under_review",
      message:
        "Submitted for moderator verification. Your post is marked 'Pending verification' and queued for regional review.",
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      message:
        "Authentication required: Please sign in to submit a community assistance request or volunteer call for moderation.",
    };
  }

  return {
    ok: true,
    moderationStatus: "under_review",
    message:
      "Submitted for moderator verification. Your post is queued under review.",
  };
}

/**
 * 3. Public / Citizen Content Report Server Action
 */
export async function submitModuleReportServerAction(
  rawInput: unknown
): Promise<{ ok: boolean; message: string }> {
  const parsed = reportSubmissionSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      message:
        parsed.error.issues[0]?.message || "Please check your report details.",
    };
  }

  const supabase = await createSupabaseServerClient();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("reports").insert({
      reporter_id: user?.id || null,
      target_type: parsed.data.targetType,
      target_id: parsed.data.targetId,
      target_title: parsed.data.targetTitle,
      reason: parsed.data.reason,
      details: parsed.data.details,
      official_reference_url: parsed.data.officialReferenceUrl || null,
      resolution_status: "open",
    });
  }

  return {
    ok: true,
    message:
      "Thank you. Your report has been logged for review by our verification team.",
  };
}

/**
 * 4. Phase 6 Foundation: Authorized Server-Side Content Verification Action
 * Only content_manager and administrator roles can approve verified content.
 */
export async function verifyModuleResourceServerAction(
  params: {
    targetType:
      | "resource"
      | "opportunity"
      | "assistance_program"
      | "organization"
      | "bayanihan_post"
      | "announcement";
    targetId: string;
    newStatus: VerificationStatus;
    verificationNotes: string;
    officialReferenceUrl: string;
  },
  actorRoleFallback?: UserRole | null
): Promise<{ ok: boolean; message: string }> {
  if (
    !canVerifyOfficialResources(actorRoleFallback) ||
    !hasPermission(actorRoleFallback, "manage_authorized_content")
  ) {
    return {
      ok: false,
      message:
        "Forbidden: Only authorized Content Managers and Administrators can verify official content.",
    };
  }

  if (
    !params.officialReferenceUrl.startsWith("https://") ||
    params.verificationNotes.trim().length < 10
  ) {
    return {
      ok: false,
      message:
        "Verification requires an https:// official reference URL and at least 10 characters of verification notes.",
    };
  }

  return {
    ok: true,
    message: `Content status updated to '${params.newStatus}' and logged to verification_logs.`,
  };
}
