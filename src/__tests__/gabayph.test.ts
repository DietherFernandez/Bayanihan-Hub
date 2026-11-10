import { describe, expect, it } from "vitest";
import {
  authRegisterSchema,
  bayanihanSubmissionSchema,
  jobScamReportSchema,
  reportSubmissionSchema,
  universalSearchSchema,
} from "../lib/validations/schemas";
import {
  canAccessAdminDashboard,
  canManageUsersAndAuditLogs,
  canModerateBayanihan,
} from "../lib/auth/rbac";
import { queryUniversalSearch } from "../lib/constants/philippine-data";

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
      details: "Updated appointment link verified on official psa.gov.ph portal.",
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

  it("enforces strong password and privacy-first defaults on registration", () => {
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
      email: "juan@example.ph",
      regionCode: "NCR",
      password: "SecurePassword123",
      confirmPassword: "SecurePassword123",
    });
    expect(strongPass.success).toBe(true);
    if (strongPass.success) {
      expect(strongPass.data.saveSearchHistory).toBe(false);
    }
  });

  it("enforces strict role-based access control (RBAC) across citizen and admin roles", () => {
    expect(canAccessAdminDashboard("citizen")).toBe(false);
    expect(canAccessAdminDashboard("organization")).toBe(false);
    expect(canAccessAdminDashboard("regional_moderator")).toBe(true);
    expect(canAccessAdminDashboard("content_admin")).toBe(true);
    expect(canAccessAdminDashboard("super_admin")).toBe(true);

    expect(canManageUsersAndAuditLogs("content_admin")).toBe(false);
    expect(canManageUsersAndAuditLogs("super_admin")).toBe(true);

    expect(
      canModerateBayanihan(
        { role: "regional_moderator", regionCode: "NCR" },
        "NCR"
      )
    ).toBe(true);
    expect(
      canModerateBayanihan(
        { role: "regional_moderator", regionCode: "NCR" },
        "Region VII"
      )
    ).toBe(false);
  });
});
