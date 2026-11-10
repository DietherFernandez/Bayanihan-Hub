import type { UserProfile, UserRole } from "@/types/database";

const STAFF_ROLES: readonly UserRole[] = [
  "super_admin",
  "content_admin",
  "regional_moderator",
];

export function canAccessAdminDashboard(role?: UserRole | null): boolean {
  if (!role) return false;
  return STAFF_ROLES.includes(role);
}

export function canManageUsersAndAuditLogs(role?: UserRole | null): boolean {
  return role === "super_admin";
}

export function canVerifyOfficialResources(role?: UserRole | null): boolean {
  return role === "super_admin" || role === "content_admin";
}

export function canModerateBayanihan(
  user: Pick<UserProfile, "role" | "regionCode"> | null,
  targetRegionCode: string
): boolean {
  if (!user) return false;
  if (user.role === "super_admin" || user.role === "content_admin") {
    return true;
  }
  if (user.role === "regional_moderator") {
    return (
      user.regionCode === "NATIONAL" ||
      targetRegionCode === "NATIONAL" ||
      user.regionCode === targetRegionCode
    );
  }
  return false;
}

export function formatRoleLabel(role: UserRole): string {
  switch (role) {
    case "super_admin":
      return "Super Admin";
    case "content_admin":
      return "Content Verification Admin";
    case "regional_moderator":
      return "Regional Moderator";
    case "organization":
      return "Verified Organization";
    case "citizen":
    default:
      return "Citizen";
  }
}
