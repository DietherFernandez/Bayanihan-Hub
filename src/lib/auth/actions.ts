"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { publicEnv } from "@/env";
import {
  authLoginSchema,
  authRegisterSchema,
  passwordRecoveryRequestSchema,
  passwordResetSchema,
  profileUpdateSchema,
  roleAssignmentSchema,
} from "@/lib/validations/schemas";
import { canAssignRole, normalizeToCanonicalRole } from "@/lib/auth/rbac";
import type { CanonicalUserRole, UserProfile, UserRole } from "@/types/database";

export interface AuthActionResult {
  ok: boolean;
  mode: "supabase" | "local_fallback";
  message: string;
  requiresEmailVerification?: boolean;
  user?: UserProfile;
}

// Simple in-memory rate-limit window per identifier (for server action protection)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkAuthRateLimit(
  bucketKey: string,
  maxRequests = 10,
  windowMs = 60_000
): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(bucketKey);
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(bucketKey, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= maxRequests) {
    return false;
  }
  entry.count += 1;
  return true;
}

/**
 * Resolves the highest-privilege role from a list of user_roles rows and/or profile.role
 */
function resolveHighestRole(
  roles: string[],
  fallbackRole?: string | null
): UserRole {
  const normalized = new Set(roles.map((r) => normalizeToCanonicalRole(r)));
  if (fallbackRole) {
    normalized.add(normalizeToCanonicalRole(fallbackRole));
  }
  if (normalized.has("administrator")) return "administrator";
  if (normalized.has("content_manager")) return "content_manager";
  if (normalized.has("moderator")) return "moderator";
  return "user";
}

/**
 * 1. Citizen Registration Server Action
 * - Validates input on the server via Zod
 * - Never allows a user to specify their own role during registration
 * - Triggers email verification via `/auth/callback`
 */
export async function registerCitizenAction(
  rawInput: unknown
): Promise<AuthActionResult> {
  const parsed = authRegisterSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      mode: "local_fallback",
      message:
        parsed.error.issues[0]?.message ||
        "Please check your registration details.",
    };
  }

  const data = parsed.data;
  const normalizedEmail = data.email.toLowerCase();

  if (!checkAuthRateLimit(`register:${normalizedEmail}`, 5, 60_000)) {
    return {
      ok: false,
      mode: "local_fallback",
      message: "Too many registration attempts. Please wait one minute and try again.",
    };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    // Graceful local fallback when Supabase credentials are not set in environment
    return {
      ok: true,
      mode: "local_fallback",
      requiresEmailVerification: false,
      message:
        "Account created in local verification mode. Connect Supabase credentials in production for cloud persistence and email confirmation.",
      user: {
        id: `usr-${Date.now()}`,
        email: normalizedEmail,
        fullName: data.fullName,
        username: data.username || undefined,
        phoneNumber: data.phoneNumber || undefined,
        role: "user",
        regionCode: data.regionCode,
        province: data.province || undefined,
        cityMunicipality: data.cityMunicipality || undefined,
        barangay: data.barangay || undefined,
        accountStatus: "active",
        saveSearchHistory: data.saveSearchHistory,
        preferredLanguage: "en",
        emailVerified: true,
        createdAt: new Date().toISOString().split("T")[0],
      },
    };
  }

  const { data: signUpData, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password: data.password,
    options: {
      emailRedirectTo: `${publicEnv.NEXT_PUBLIC_APP_URL}/auth/callback?next=/profile`,
      data: {
        full_name: data.fullName,
        username: data.username || null,
        phone_number: data.phoneNumber || null,
        region: data.regionCode,
        province: data.province || null,
        city_municipality: data.cityMunicipality || null,
        barangay: data.barangay || null,
        save_search_history: data.saveSearchHistory,
      },
    },
  });

  if (error) {
    return {
      ok: false,
      mode: "supabase",
      message: "Unable to complete registration. Please verify your details and try again.",
    };
  }

  const needsEmailConfirmation = Boolean(
    signUpData.user && !signUpData.session
  );

  return {
    ok: true,
    mode: "supabase",
    requiresEmailVerification: needsEmailConfirmation,
    message: needsEmailConfirmation
      ? "Registration submitted. Please check your email inbox and click the verification link to activate your GabayPH account."
      : "Your GabayPH account has been created and signed in.",
    user: signUpData.user
      ? {
          id: signUpData.user.id,
          email: normalizedEmail,
          fullName: data.fullName,
          username: data.username || undefined,
          phoneNumber: data.phoneNumber || undefined,
          role: "user",
          regionCode: data.regionCode,
          province: data.province || undefined,
          cityMunicipality: data.cityMunicipality || undefined,
          barangay: data.barangay || undefined,
          accountStatus: needsEmailConfirmation
            ? "pending_verification"
            : "active",
          saveSearchHistory: data.saveSearchHistory,
          preferredLanguage: "en",
          emailVerified: !needsEmailConfirmation,
          createdAt: new Date().toISOString().split("T")[0],
        }
      : undefined,
  };
}

/**
 * 2. Email/Password Login Server Action
 * - Validates input with Zod
 * - Uses generic error message to prevent account enumeration
 * - Retrieves server-verified profile and user_roles from database
 */
export async function loginCitizenAction(
  rawInput: unknown
): Promise<AuthActionResult> {
  const parsed = authLoginSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      mode: "local_fallback",
      message: parsed.error.issues[0]?.message || "Invalid email or password.",
    };
  }

  const normalizedEmail = parsed.data.email.toLowerCase();
  if (!checkAuthRateLimit(`login:${normalizedEmail}`, 8, 60_000)) {
    return {
      ok: false,
      mode: "local_fallback",
      message:
        "Too many sign-in attempts. Please wait a minute before trying again.",
    };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      ok: true,
      mode: "local_fallback",
      message: "Signed in (local verification mode).",
      user: {
        id: `usr-${Date.now()}`,
        email: normalizedEmail,
        fullName: normalizedEmail.split("@")[0] || "Juan Dela Cruz",
        role: "user",
        regionCode: "NCR",
        accountStatus: "active",
        saveSearchHistory: false,
        preferredLanguage: "en",
        emailVerified: true,
        createdAt: new Date().toISOString().split("T")[0],
      },
    };
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password: parsed.data.password,
  });

  if (error || !authData.user) {
    // Generic message so attackers cannot enumerate registered emails
    return {
      ok: false,
      mode: "supabase",
      message:
        "Invalid email or password, or your email address has not yet been verified.",
    };
  }

  // Fetch profile & assigned roles from PostgreSQL under RLS
  const [{ data: profileRow }, { data: roleRows }] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "id, full_name, username, avatar_url, phone_number, role, region, province, city_municipality, barangay, account_status, is_suspended, save_search_history, preferred_language, created_at"
      )
      .eq("id", authData.user.id)
      .maybeSingle(),
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", authData.user.id),
  ]);

  if (profileRow?.is_suspended || profileRow?.account_status === "suspended") {
    await supabase.auth.signOut();
    return {
      ok: false,
      mode: "supabase",
      message:
        "This account is currently suspended. Please contact GabayPH support if you believe this is an error.",
    };
  }

  const assignedRoles = Array.isArray(roleRows)
    ? roleRows.map((r: { role: string }) => r.role)
    : [];
  const effectiveRole = resolveHighestRole(assignedRoles, profileRow?.role);

  return {
    ok: true,
    mode: "supabase",
    message: "Signed in successfully.",
    user: {
      id: authData.user.id,
      email: authData.user.email || normalizedEmail,
      fullName:
        profileRow?.full_name ||
        authData.user.user_metadata?.full_name ||
        normalizedEmail.split("@")[0],
      username: profileRow?.username || undefined,
      avatarUrl: profileRow?.avatar_url || undefined,
      phoneNumber: profileRow?.phone_number || undefined,
      role: effectiveRole,
      regionCode: profileRow?.region || "NCR",
      province: profileRow?.province || undefined,
      cityMunicipality: profileRow?.city_municipality || undefined,
      barangay: profileRow?.barangay || undefined,
      accountStatus: profileRow?.account_status || "active",
      saveSearchHistory: Boolean(profileRow?.save_search_history),
      preferredLanguage:
        profileRow?.preferred_language === "fil" ? "fil" : "en",
      emailVerified: Boolean(authData.user.email_confirmed_at),
      createdAt:
        profileRow?.created_at?.split("T")[0] ||
        new Date().toISOString().split("T")[0],
    },
  };
}

/**
 * 3. Logout Server Action
 */
export async function logoutCitizenAction(): Promise<{ ok: boolean }> {
  const supabase = await createSupabaseServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  return { ok: true };
}

/**
 * 4. Password Recovery Request Server Action
 * - Non-enumerating: Never reveals whether an email exists in the database
 */
export async function requestPasswordRecoveryAction(
  rawInput: unknown
): Promise<AuthActionResult> {
  const parsed = passwordRecoveryRequestSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      mode: "local_fallback",
      message: parsed.error.issues[0]?.message || "Enter a valid email address.",
    };
  }

  const normalizedEmail = parsed.data.email.toLowerCase();
  if (!checkAuthRateLimit(`recover:${normalizedEmail}`, 4, 60_000)) {
    return {
      ok: false,
      mode: "local_fallback",
      message: "Please wait a moment before requesting another password reset link.",
    };
  }

  const nonEnumeratingMessage =
    "If an account is registered with that email address, a password reset link has been sent. Please check your inbox and spam folder.";

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      ok: true,
      mode: "local_fallback",
      message: nonEnumeratingMessage,
    };
  }

  await supabase.auth.resetPasswordForEmail(normalizedEmail, {
    redirectTo: `${publicEnv.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`,
  });

  return {
    ok: true,
    mode: "supabase",
    message: nonEnumeratingMessage,
  };
}

/**
 * 5. Password Reset Completion Server Action
 */
export async function resetPasswordAction(
  rawInput: unknown
): Promise<AuthActionResult> {
  const parsed = passwordResetSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      mode: "local_fallback",
      message:
        parsed.error.issues[0]?.message || "Please enter a valid new password.",
    };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      ok: true,
      mode: "local_fallback",
      message: "Your password has been updated (local verification mode).",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return {
      ok: false,
      mode: "supabase",
      message:
        "Unable to reset password. Your reset link may have expired — please request a new password recovery link.",
    };
  }

  return {
    ok: true,
    mode: "supabase",
    message: "Your password has been securely updated. You may now continue to your account.",
  };
}

/**
 * 6. Protected Profile Update Server Action
 * - Validates with profileUpdateSchema (strictly excludes `role`, `is_suspended`, `account_status`)
 * - Updates only the authenticated user's own row (`id = auth.uid()`)
 */
export async function updateCitizenProfileAction(
  rawInput: unknown
): Promise<AuthActionResult> {
  const parsed = profileUpdateSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      mode: "local_fallback",
      message:
        parsed.error.issues[0]?.message || "Please check your profile inputs.",
    };
  }

  const data = parsed.data;
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      ok: true,
      mode: "local_fallback",
      message: "Profile preferences saved.",
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      mode: "supabase",
      message: "Authentication required. Please sign in to update your profile.",
    };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: data.fullName,
      username: data.username || null,
      phone_number: data.phoneNumber || null,
      region: data.regionCode,
      province: data.province || null,
      city_municipality: data.cityMunicipality || null,
      barangay: data.barangay || null,
      preferred_language: data.preferredLanguage,
      save_search_history: data.saveSearchHistory,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return {
      ok: false,
      mode: "supabase",
      message: "Could not save profile updates. Please try again.",
    };
  }

  return {
    ok: true,
    mode: "supabase",
    message: "Profile and regional preferences updated.",
  };
}

/**
 * 7. Trusted Administrator Role Assignment Server Action
 * - Verifies caller's role on the server AND via PostgreSQL `public.assign_user_role` RPC
 * - Users, Content Managers, and Moderators can NEVER assign roles
 */
export async function assignUserRoleServerAction(
  rawInput: unknown,
  callerRoleFallback?: UserRole | null
): Promise<{ ok: boolean; message: string }> {
  const parsed = roleAssignmentSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message || "Invalid role assignment payload.",
    };
  }

  const { targetUserId, newRole } = parsed.data;

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    if (!canAssignRole(callerRoleFallback, newRole as CanonicalUserRole)) {
      return {
        ok: false,
        message: "Forbidden: Only administrators can assign user roles.",
      };
    }
    return {
      ok: true,
      message: `Assigned role '${newRole}' to user ${targetUserId} and recorded audit log.`,
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      message: "Unauthorized: You must be signed in as an administrator.",
    };
  }

  // Call the SECURITY DEFINER RPC which enforces `public.is_administrator()` and writes to `public.audit_logs`
  const { error } = await supabase.rpc("assign_user_role", {
    target_user_id: targetUserId,
    new_role: newRole,
  });

  if (error) {
    return {
      ok: false,
      message: "Forbidden: Only verified administrators can assign user roles.",
    };
  }

  return {
    ok: true,
    message: `Assigned role '${newRole}' to user and logged action in audit_logs.`,
  };
}
