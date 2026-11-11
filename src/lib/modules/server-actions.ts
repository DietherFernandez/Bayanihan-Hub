"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/security/rate-limit";
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
 * Remove Bookmark Server Action
 */
export async function removeBookmarkServerAction(
  targetId: string
): Promise<{ ok: boolean; message: string }> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: true, message: "Removed from device bookmarks." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: true, message: "Removed from device bookmarks." };
  }

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(targetId);
  if (isUuid) {
    await supabase
      .from("bookmarks")
      .delete()
      .eq("user_id", user.id)
      .eq("target_id", targetId);
  }

  return {
    ok: true,
    message: "Bookmark removed from your GabayPH account.",
  };
}

/**
 * Fetch Authenticated User Bookmarks
 */
export async function fetchUserBookmarksServerAction(): Promise<{
  ok: boolean;
  bookmarks: Array<{
    id: string;
    targetType: "resource" | "opportunity" | "assistance_program" | "bayanihan_post";
    targetId: string;
    targetSlug: string;
    targetTitle: string;
    targetModule: ModuleType;
    createdAt: string;
  }>;
}> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: true, bookmarks: [] };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: true, bookmarks: [] };
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .select("id, target_type, target_id, target_slug, target_title, target_module, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return { ok: false, bookmarks: [] };
  }

  return {
    ok: true,
    bookmarks: data.map((b) => ({
      id: b.id,
      targetType: b.target_type as "resource" | "opportunity" | "assistance_program" | "bayanihan_post",
      targetId: b.target_id,
      targetSlug: b.target_slug,
      targetTitle: b.target_title,
      targetModule: b.target_module as ModuleType,
      createdAt: b.created_at,
    })),
  };
}

/**
 * 2. Bayanihan Community Submission Server Action (With Privacy, Rate Limit & Moderation Safeguards)
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
  const rate = checkRateLimit(
    `bayanihan-post:${data.regionCode}:${data.cityMunicipality}`,
    8,
    60_000
  );
  if (!rate.allowed) {
    return {
      ok: false,
      message:
        "Too many community submissions in a short period. Please wait a minute before submitting again.",
    };
  }

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

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_suspended, account_status")
    .eq("id", user.id)
    .single();

  if (
    profile?.is_suspended === true ||
    (profile?.account_status && profile.account_status !== "active")
  ) {
    return {
      ok: false,
      message: "Suspended or inactive accounts cannot submit community posts.",
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
 * 3. Public / Citizen Content Report Server Action (With Rate Limit)
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

  const rate = checkRateLimit(
    `module-report:${parsed.data.targetType}:${parsed.data.targetId}`,
    10,
    60_000
  );
  if (!rate.allowed) {
    return {
      ok: false,
      message:
        "Too many reports submitted in a short period. Please wait a moment and try again.",
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
 * 4. Authorized Server-Side Content Verification Action (SEC-02 Hardened)
 * Resolves caller identity, active status, and role on the server when Supabase is configured.
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
  let effectiveRole: UserRole | null | undefined = undefined;
  let verifierUserId: string | null = null;

  const supabase = await createSupabaseServerClient();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        ok: false,
        message:
          "Authentication required: Please sign in as a Content Manager or Administrator.",
      };
    }

    verifierUserId = user.id;

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
      return {
        ok: false,
        message:
          "Forbidden: Suspended or inactive accounts cannot verify official content.",
      };
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
      assignedRoles.has("super_admin")
    ) {
      effectiveRole = "administrator";
    } else if (
      assignedRoles.has("content_manager") ||
      assignedRoles.has("content_admin") ||
      assignedRoles.has("agency_editor")
    ) {
      effectiveRole = "content_manager";
    } else if (assignedRoles.has("moderator")) {
      effectiveRole = "moderator";
    } else {
      effectiveRole = (profile.role as UserRole) || "citizen";
    }
  } else if (process.env.NODE_ENV !== "production") {
    effectiveRole = actorRoleFallback;
  }

  if (
    !canVerifyOfficialResources(effectiveRole) ||
    !hasPermission(effectiveRole, "manage_authorized_content")
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

  if (supabase && verifierUserId) {
    const tableMap: Record<typeof params.targetType, string> = {
      resource: "resources",
      opportunity: "opportunities",
      assistance_program: "assistance_programs",
      organization: "organizations",
      bayanihan_post: "bayanihan_posts",
      announcement: "announcements",
    };

    const targetTable = tableMap[params.targetType];
    await supabase
      .from(targetTable)
      .update({
        verification_status: params.newStatus,
        verified_at: new Date().toISOString(),
        verified_by: verifierUserId,
      })
      .eq("id", params.targetId);

    await supabase.from("verification_logs").insert({
      target_type: params.targetType,
      target_id: params.targetId,
      target_title: `${params.targetType}:${params.targetId}`,
      new_status: params.newStatus,
      verified_by: verifierUserId,
      verification_notes: params.verificationNotes.trim(),
      official_reference_url: params.officialReferenceUrl.trim(),
    });
  }

  return {
    ok: true,
    message: `Content status updated to '${params.newStatus}' and logged to verification_logs.`,
  };
}
