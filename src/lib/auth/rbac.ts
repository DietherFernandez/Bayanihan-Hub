import type {
  CanonicalUserRole,
  UserProfile,
  UserRole,
} from "@/types/database";

export type PlatformPermission =
  | "view_public_content"
  | "manage_own_profile"
  | "manage_own_bookmarks"
  | "submit_reports"
  | "manage_authorized_content"
  | "submit_for_verification"
  | "review_reports"
  | "moderate_content"
  | "manage_users"
  | "assign_roles"
  | "view_audit_logs";

/**
 * Normalizes any role identifier (including Phase 1-3 aliases) into the
 * four canonical Phase 4 roles:
 * - 'user'
 * - 'content_manager'
 * - 'moderator'
 * - 'administrator'
 */
export function normalizeToCanonicalRole(
  role?: UserRole | string | null
): CanonicalUserRole {
  switch (role) {
    case "administrator":
    case "super_admin":
      return "administrator";
    case "content_manager":
    case "content_admin":
      return "content_manager";
    case "moderator":
    case "regional_moderator":
      return "moderator";
    case "user":
    case "citizen":
    case "organization":
    default:
      return "user";
  }
}

export const ROLE_PERMISSION_MATRIX: Readonly<
  Record<CanonicalUserRole, readonly PlatformPermission[]>
> = {
  user: [
    "view_public_content",
    "manage_own_profile",
    "manage_own_bookmarks",
    "submit_reports",
  ],
  content_manager: [
    "view_public_content",
    "manage_own_profile",
    "manage_own_bookmarks",
    "submit_reports",
    "manage_authorized_content",
    "submit_for_verification",
  ],
  moderator: [
    "view_public_content",
    "manage_own_profile",
    "manage_own_bookmarks",
    "submit_reports",
    "review_reports",
    "moderate_content",
  ],
  administrator: [
    "view_public_content",
    "manage_own_profile",
    "manage_own_bookmarks",
    "submit_reports",
    "manage_authorized_content",
    "submit_for_verification",
    "review_reports",
    "moderate_content",
    "manage_users",
    "assign_roles",
    "view_audit_logs",
  ],
};

export function hasPermission(
  role: UserRole | string | null | undefined,
  permission: PlatformPermission
): boolean {
  const canonical = normalizeToCanonicalRole(role);
  return ROLE_PERMISSION_MATRIX[canonical].includes(permission);
}

export function canAccessAdminDashboard(role?: UserRole | null): boolean {
  if (!role) return false;
  const canonical = normalizeToCanonicalRole(role);
  return (
    canonical === "administrator" ||
    canonical === "content_manager" ||
    canonical === "moderator"
  );
}

export function canManageUsersAndAuditLogs(role?: UserRole | null): boolean {
  return (
    hasPermission(role, "manage_users") &&
    hasPermission(role, "assign_roles") &&
    hasPermission(role, "view_audit_logs")
  );
}

export function canVerifyOfficialResources(role?: UserRole | null): boolean {
  return hasPermission(role, "manage_authorized_content");
}

export function canReviewReportedContent(role?: UserRole | null): boolean {
  return hasPermission(role, "review_reports");
}

export function canModerateBayanihan(
  user: Pick<UserProfile, "role" | "regionCode"> | null,
  targetRegionCode: string
): boolean {
  if (!user) return false;
  const canonical = normalizeToCanonicalRole(user.role);
  if (canonical === "administrator" || canonical === "content_manager") {
    return true;
  }
  if (canonical === "moderator") {
    return (
      user.regionCode === "NATIONAL" ||
      targetRegionCode === "NATIONAL" ||
      user.regionCode === targetRegionCode
    );
  }
  return false;
}

export function canAssignRole(
  actorRole: UserRole | string | null | undefined,
  targetRole: CanonicalUserRole
): boolean {
  if (!targetRole) return false;
  // Strictly enforce that ONLY administrators can assign any role (especially administrator)
  return normalizeToCanonicalRole(actorRole) === "administrator";
}

export function formatRoleLabel(role: UserRole): string {
  switch (role) {
    case "administrator":
    case "super_admin":
      return "Administrator";
    case "content_manager":
    case "content_admin":
      return "Content Manager";
    case "moderator":
    case "regional_moderator":
      return "Moderator";
    case "organization":
      return "Verified Organization";
    case "user":
    case "citizen":
    default:
      return "Citizen (User)";
  }
}
