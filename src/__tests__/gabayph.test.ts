import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  authLoginSchema,
  authRegisterSchema,
  bayanihanSubmissionSchema,
  jobScamReportSchema,
  passwordRecoveryRequestSchema,
  passwordResetSchema,
  profileUpdateSchema,
  reportSubmissionSchema,
  roleAssignmentSchema,
  universalSearchSchema,
} from "../lib/validations/schemas";
import {
  canAccessAdminDashboard,
  canAssignRole,
  canManageUsersAndAuditLogs,
  canModerateBayanihan,
  canReviewReportedContent,
  canVerifyOfficialResources,
  hasPermission,
  normalizeToCanonicalRole,
} from "../lib/auth/rbac";
import {
  assignUserRoleServerAction,
  loginCitizenAction,
  registerCitizenAction,
  requestPasswordRecoveryAction,
  resetPasswordAction,
  updateCitizenProfileAction,
} from "../lib/auth/actions";
import {
  ACTIVE_ANNOUNCEMENTS,
  VERIFIED_ASSISTANCE_PROGRAMS,
  VERIFIED_BAYANIHAN_POSTS,
  VERIFIED_OPPORTUNITIES,
  VERIFIED_RESOURCES,
  queryUniversalSearch,
} from "../lib/constants/philippine-data";
import { PLATFORM_MODULE_LINKS } from "../components/layout/civic-shell";

describe("GabayPH Security, Validation, RBAC & Universal Search Suite", () => {
  it("validates universal search filters and strips whitespace", () => {
    const parsed = universalSearchSchema.safeParse({
      q: "  PSA Birth Certificate  ",
      module: "serbisyo",
      region: "NCR",
      verification: "officially_verified",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.q).toBe("PSA Birth Certificate");
      expect(parsed.data.module).toBe("serbisyo");
    }
  });

  it("returns verified Philippine government records via Universal Search", () => {
    const psaResults = queryUniversalSearch({ q: "PSA", module: "serbisyo" });
    expect(psaResults.length).toBeGreaterThan(0);
    expect(psaResults[0].verificationStatus).toBe("officially_verified");
    expect(psaResults[0].sourceUrl).toContain("gov.ph");
  });

  it("returns an honest empty array when a search query has no verified match", () => {
    const noMatch = queryUniversalSearch({
      q: "nonexistent-fictional-agency-99999",
    });
    expect(noMatch).toEqual([]);
  });

  it("enforces minimum detail length on public inaccuracy reports", () => {
    const invalid = reportSubmissionSchema.safeParse({
      targetType: "resource",
      targetId: "res-psa-birth-cert",
      targetTitle: "PSA Birth Certificate",
      reason: "outdated_info",
      details: "Too short",
    });
    expect(invalid.success).toBe(false);

    const valid = reportSubmissionSchema.safeParse({
      targetType: "resource",
      targetId: "res-psa-birth-cert",
      targetTitle: "PSA Birth Certificate",
      reason: "outdated_info",
      details:
        "Updated appointment link verified on official psa.gov.ph portal.",
      officialReferenceUrl: "https://psa.gov.ph",
    });
    expect(valid.success).toBe(true);
  });

  it("validates job scam reports and Bayanihan moderation submissions", () => {
    const scamValid = jobScamReportSchema.safeParse({
      companyOrRecruiterName: "Fake Task Recruiter",
      jobTitleOffered: "App Optimizer",
      platformOrChannel: "Telegram",
      illegalFeeRequested: true,
      amountRequestedPHP: 1500,
      incidentDescription:
        "Asked for PHP 1,500 deposit before releasing commission.",
    });
    expect(scamValid.success).toBe(true);

    const bayanihanValid = bayanihanSubmissionSchema.safeParse({
      postType: "volunteer_call",
      title: "Barangay Relief Repacking Drive",
      organizationName: "LGU Social Welfare Desk",
      regionCode: "NCR",
      cityMunicipality: "Quezon City",
      urgencyLevel: "high",
      summary:
        "Need 30 volunteers for weekend Family Food Pack sorting and repacking.",
      itemsOrSkillsNeeded: "Volunteers, bottled water",
      dropOffOrMeetingPoint: "Quezon City Hall Covered Court",
      contactChannel: "(02) 8988-4242",
    });
    expect(bayanihanValid.success).toBe(true);
  });

  it("enforces strong password and privacy-first defaults on registration without requiring street address", () => {
    const weakPass = authRegisterSchema.safeParse({
      fullName: "Juan Dela Cruz",
      email: "juan@example.ph",
      regionCode: "NCR",
      password: "weakpassword",
      confirmPassword: "weakpassword",
    });
    expect(weakPass.success).toBe(false);

    const strongPass = authRegisterSchema.safeParse({
      fullName: "Juan Dela Cruz",
      username: "juandelacruz",
      email: "juan@example.ph",
      phoneNumber: "09171234567",
      regionCode: "NCR",
      province: "Metro Manila",
      cityMunicipality: "Quezon City",
      barangay: "Barangay Commonwealth",
      password: "SecurePassword123",
      confirmPassword: "SecurePassword123",
    });
    expect(strongPass.success).toBe(true);
    if (strongPass.success) {
      expect(strongPass.data.saveSearchHistory).toBe(false);
      expect(strongPass.data.cityMunicipality).toBe("Quezon City");
      expect(strongPass.data.barangay).toBe("Barangay Commonwealth");
    }
  });

  it("enforces strict role-based access control (RBAC) across Phase 4 canonical roles and legacy aliases", () => {
    // Canonical role normalization
    expect(normalizeToCanonicalRole("user")).toBe("user");
    expect(normalizeToCanonicalRole("citizen")).toBe("user");
    expect(normalizeToCanonicalRole("content_manager")).toBe("content_manager");
    expect(normalizeToCanonicalRole("content_admin")).toBe("content_manager");
    expect(normalizeToCanonicalRole("moderator")).toBe("moderator");
    expect(normalizeToCanonicalRole("regional_moderator")).toBe("moderator");
    expect(normalizeToCanonicalRole("administrator")).toBe("administrator");
    expect(normalizeToCanonicalRole("super_admin")).toBe("administrator");

    // Dashboard access
    expect(canAccessAdminDashboard("user")).toBe(false);
    expect(canAccessAdminDashboard("citizen")).toBe(false);
    expect(canAccessAdminDashboard("organization")).toBe(false);
    expect(canAccessAdminDashboard("moderator")).toBe(true);
    expect(canAccessAdminDashboard("content_manager")).toBe(true);
    expect(canAccessAdminDashboard("administrator")).toBe(true);

    // Content Manager permissions (can manage content, CANNOT assign roles or view audit logs)
    expect(canVerifyOfficialResources("content_manager")).toBe(true);
    expect(hasPermission("content_manager", "submit_for_verification")).toBe(true);
    expect(canAssignRole("content_manager", "administrator")).toBe(false);
    expect(canAssignRole("content_manager", "user")).toBe(false);
    expect(canManageUsersAndAuditLogs("content_manager")).toBe(false);

    // Moderator permissions (can review reports, CANNOT assign roles or view audit logs)
    expect(canReviewReportedContent("moderator")).toBe(true);
    expect(canAssignRole("moderator", "administrator")).toBe(false);
    expect(canManageUsersAndAuditLogs("moderator")).toBe(false);

    // Administrator permissions
    expect(canAssignRole("administrator", "administrator")).toBe(true);
    expect(canAssignRole("administrator", "content_manager")).toBe(true);
    expect(canManageUsersAndAuditLogs("administrator")).toBe(true);

    // Regional moderation scoping
    expect(
      canModerateBayanihan(
        { role: "moderator", regionCode: "NCR" },
        "NCR"
      )
    ).toBe(true);
    expect(
      canModerateBayanihan(
        { role: "moderator", regionCode: "NCR" },
        "Region VII"
      )
    ).toBe(false);
  });

  it("validates Phase 4 server actions, password recovery non-enumeration, and privilege-escalation prevention", async () => {
    // 1. Registration server action assigns least-privilege 'user' role
    const regResult = await registerCitizenAction({
      fullName: "Maria Santos",
      username: "mariasantos",
      email: "maria.santos@example.ph",
      phoneNumber: "09181234567",
      regionCode: "Region VII",
      province: "Cebu",
      cityMunicipality: "Cebu City",
      barangay: "Lahug",
      password: "StrongPassword123",
      confirmPassword: "StrongPassword123",
      saveSearchHistory: false,
    });
    expect(regResult.ok).toBe(true);
    expect(regResult.user?.role).toBe("user");
    expect(regResult.user?.regionCode).toBe("Region VII");

    // 2. Login server action rejects invalid credentials
    const badLogin = await loginCitizenAction({
      email: "not-an-email",
      password: "short",
    });
    expect(badLogin.ok).toBe(false);

    // 3. Password recovery returns non-enumerating message regardless of email existence
    const rec1 = await requestPasswordRecoveryAction({
      email: "existing.citizen@example.ph",
    });
    const rec2 = await requestPasswordRecoveryAction({
      email: "nonexistent.random.9999@example.ph",
    });
    expect(rec1.ok).toBe(true);
    expect(rec2.ok).toBe(true);
    expect(rec1.message).toBe(rec2.message);

    // 4. Password reset validates strong password
    const badReset = await resetPasswordAction({
      password: "weak",
      confirmPassword: "weak",
    });
    expect(badReset.ok).toBe(false);

    const goodReset = await resetPasswordAction({
      password: "NewSecurePassword99",
      confirmPassword: "NewSecurePassword99",
    });
    expect(goodReset.ok).toBe(true);

    // 5. Profile update strips any attempt to inject role or accountStatus
    const profileParsed = profileUpdateSchema.safeParse({
      fullName: "Maria Santos Updated",
      regionCode: "Region VII",
      preferredLanguage: "fil",
      saveSearchHistory: true,
      role: "administrator",
      accountStatus: "suspended",
    });
    expect(profileParsed.success).toBe(true);
    if (profileParsed.success) {
      expect("role" in profileParsed.data).toBe(false);
      expect("accountStatus" in profileParsed.data).toBe(false);
    }

    const updateRes = await updateCitizenProfileAction({
      fullName: "Maria Santos Updated",
      regionCode: "Region VII",
      preferredLanguage: "fil",
      saveSearchHistory: true,
    });
    expect(updateRes.ok).toBe(true);

    // 6. Role assignment blocks non-administrators on the server
    const targetUuid = "550e8400-e29b-41d4-a716-446655440000";
    const blockedByUser = await assignUserRoleServerAction(
      { targetUserId: targetUuid, newRole: "administrator" },
      "user"
    );
    expect(blockedByUser.ok).toBe(false);

    const blockedByContentManager = await assignUserRoleServerAction(
      { targetUserId: targetUuid, newRole: "administrator" },
      "content_manager"
    );
    expect(blockedByContentManager.ok).toBe(false);

    const blockedByModerator = await assignUserRoleServerAction(
      { targetUserId: targetUuid, newRole: "administrator" },
      "moderator"
    );
    expect(blockedByModerator.ok).toBe(false);

    const allowedByAdmin = await assignUserRoleServerAction(
      { targetUserId: targetUuid, newRole: "content_manager" },
      "administrator"
    );
    expect(allowedByAdmin.ok).toBe(true);

    // Verify schemas
    expect(
      authLoginSchema.safeParse({
        email: "user@example.ph",
        password: "Password123",
      }).success
    ).toBe(true);
    expect(
      passwordRecoveryRequestSchema.safeParse({ email: "user@example.ph" })
        .success
    ).toBe(true);
    expect(
      passwordResetSchema.safeParse({
        password: "Password123",
        confirmPassword: "Password123",
      }).success
    ).toBe(true);
    expect(
      roleAssignmentSchema.safeParse({
        targetUserId: targetUuid,
        newRole: "moderator",
      }).success
    ).toBe(true);
  });

  it("verifies Phase 4 additive database migration safety, RLS policies, and anti-escalation triggers", () => {
    const mig0005Path = path.resolve(
      __dirname,
      "../../supabase/migrations/0005_phase4_auth_rbac_and_schema_extensions.sql"
    );
    const mig0005Sql = fs.readFileSync(mig0005Path, "utf-8");
    const executableSql = mig0005Sql
      .split("\n")
      .filter((line) => !line.trim().startsWith("--"))
      .join("\n");

    // Verify executable SQL is strictly additive (no DROP TABLE or TRUNCATE)
    expect(executableSql).not.toMatch(/DROP\s+TABLE/i);
    expect(executableSql).not.toMatch(/TRUNCATE/i);

    // Verify user_roles table and RLS policies
    expect(mig0005Sql).toContain("CREATE TABLE IF NOT EXISTS public.user_roles");
    expect(mig0005Sql).toContain(
      "ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY"
    );
    expect(mig0005Sql).toContain("Only administrators can insert user roles");
    expect(mig0005Sql).toContain("Only administrators can update user roles");
    expect(mig0005Sql).toContain("Only administrators can delete user roles");

    // Verify anti-privilege-escalation and audit immutability triggers
    expect(mig0005Sql).toContain("prevent_profile_privilege_escalation");
    expect(mig0005Sql).toContain("prevent_audit_log_mutation");
    expect(mig0005Sql).toContain("handle_new_auth_user");
    expect(mig0005Sql).toContain("assign_user_role");
  });

  it("verifies Phase 3 Homepage structure, Filipino hero copy, 6 ordered categories, and non-government disclosure", () => {
    const homepagePath = path.resolve(__dirname, "../app/page.tsx");
    const homepageSource = fs.readFileSync(homepagePath, "utf-8");

    expect(homepageSource).toContain("Ano ang kailangan mong tulong ngayon?");
    expect(homepageSource).toContain(
      "Hanapin ang trabaho, serbisyo, tulong pinansyal, edukasyon, at mahahalagang impormasyon para sa iyong pang-araw-araw na pangangailangan."
    );
    expect(homepageSource).toContain("Popular Government Services");
    expect(homepageSource).toContain(
      "Opportunities: Jobs, Scholarships &amp; Free Training"
    );
    expect(homepageSource).toContain(
      "Financial &amp; Medical Assistance Programs"
    );
    expect(homepageSource).toContain("How GabayPH Verifies Public Information");
    expect(homepageSource).toContain("not a government agency");

    // Verify navigation order matches: Trabaho, Serbisyo, Pera, Bayanihan, Aral, Kaligtasan
    expect(PLATFORM_MODULE_LINKS.map((m) => m.label)).toEqual([
      "Trabaho",
      "Serbisyo",
      "Pera",
      "Bayanihan",
      "Aral",
      "Kaligtasan",
    ]);

    // Verify every public record on homepage has official source URL and verification date
    for (const res of VERIFIED_RESOURCES) {
      expect(res.sourceUrl).toMatch(/^https:\/\//);
      expect(res.lastVerifiedAt.length).toBeGreaterThanOrEqual(8);
    }
    for (const opp of VERIFIED_OPPORTUNITIES) {
      expect(opp.sourceUrl).toMatch(/^https:\/\//);
    }
    for (const aid of VERIFIED_ASSISTANCE_PROGRAMS) {
      expect(aid.sourceUrl).toMatch(/^https:\/\//);
    }
    for (const post of VERIFIED_BAYANIHAN_POSTS) {
      expect(post.sourceUrl).toMatch(/^https:\/\//);
    }
    for (const ann of ACTIVE_ANNOUNCEMENTS) {
      expect(ann.sourceUrl).toMatch(/^https:\/\//);
    }
  });
});
