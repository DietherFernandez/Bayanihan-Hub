import { z } from "zod";

export const universalSearchSchema = z.object({
  q: z
    .string()
    .trim()
    .max(120, "Search query must be 120 characters or less.")
    .optional()
    .default(""),
  module: z
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
  region: z.string().trim().max(40).optional().default("ALL"),
  verification: z
    .enum(["all", "officially_verified", "verification_pending"])
    .optional()
    .default("all"),
});

export const reportSubmissionSchema = z.object({
  targetType: z.enum([
    "resource",
    "opportunity",
    "assistance_program",
    "organization",
    "bayanihan_post",
  ]),
  targetId: z.string().min(1, "Target ID is required."),
  targetTitle: z.string().min(2).max(200),
  reason: z.enum([
    "outdated_info",
    "incorrect_requirements",
    "broken_link",
    "suspected_scam",
    "abusive_content",
    "other",
  ]),
  details: z
    .string()
    .trim()
    .min(15, "Please provide at least 15 characters explaining the issue.")
    .max(1500, "Details cannot exceed 1,500 characters."),
  officialReferenceUrl: z
    .string()
    .trim()
    .url("Please enter a valid https:// official reference URL.")
    .optional()
    .or(z.literal("")),
  turnstileToken: z.string().optional(),
});

export const jobScamReportSchema = z.object({
  companyOrRecruiterName: z
    .string()
    .trim()
    .min(2, "Enter the employer, agency, or recruiter name.")
    .max(150),
  jobTitleOffered: z
    .string()
    .trim()
    .min(2, "Enter the job title or offer description.")
    .max(150),
  platformOrChannel: z
    .string()
    .trim()
    .min(2, "Specify where you encountered the offer (e.g., SMS, Facebook, Email).")
    .max(120),
  illegalFeeRequested: z.boolean().default(false),
  amountRequestedPHP: z.number().min(0).max(10000000).optional(),
  incidentDescription: z
    .string()
    .trim()
    .min(20, "Describe red flags or what happened in at least 20 characters.")
    .max(2000),
  referenceLink: z
    .string()
    .trim()
    .url("Must be a valid URL if provided.")
    .optional()
    .or(z.literal("")),
});

export const bayanihanSubmissionSchema = z.object({
  postType: z.enum(["donation_offer", "assistance_request", "volunteer_call"]),
  title: z
    .string()
    .trim()
    .min(8, "Title must be at least 8 characters.")
    .max(140, "Title must not exceed 140 characters."),
  organizationName: z
    .string()
    .trim()
    .min(2, "Specify organization or barangay/community group name.")
    .max(120),
  regionCode: z.string().min(2, "Select a valid Philippine region."),
  cityMunicipality: z
    .string()
    .trim()
    .min(2, "Specify city or municipality.")
    .max(100),
  urgencyLevel: z.enum(["normal", "high", "critical"]),
  summary: z
    .string()
    .trim()
    .min(25, "Provide a clear summary of at least 25 characters.")
    .max(1200),
  itemsOrSkillsNeeded: z
    .string()
    .trim()
    .min(3, "List the needed items, skills, or resources.")
    .max(500),
  dropOffOrMeetingPoint: z
    .string()
    .trim()
    .min(5, "Provide the verified coordination point or barangay hall.")
    .max(250),
  contactChannel: z
    .string()
    .trim()
    .min(5, "Provide an official contact number or verified page.")
    .max(180),
  sourceUrl: z
    .string()
    .trim()
    .url("Provide a valid reference link if available.")
    .optional()
    .or(z.literal("")),
});

export const authLoginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const authRegisterSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters.")
      .max(100),
    username: z
      .string()
      .trim()
      .regex(
        /^[a-zA-Z0-9_.-]{3,30}$/,
        "Username must be 3–30 alphanumeric characters, dots, underscores, or hyphens."
      )
      .optional()
      .or(z.literal("")),
    email: z.string().trim().email("Enter a valid email address."),
    phoneNumber: z
      .string()
      .trim()
      .regex(
        /^(\+63|0)?9\d{9}$/,
        "Enter a valid Philippine mobile number (e.g., 09171234567 or +639171234567)."
      )
      .optional()
      .or(z.literal("")),
    regionCode: z.string().min(2, "Please select your region."),
    province: z.string().trim().max(80).optional().default(""),
    cityMunicipality: z.string().trim().max(80).optional().default(""),
    barangay: z.string().trim().max(80).optional().default(""),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(128, "Password must not exceed 128 characters.")
      .regex(/[A-Z]/, "Must include at least one uppercase letter.")
      .regex(/[0-9]/, "Must include at least one number."),
    confirmPassword: z.string(),
    saveSearchHistory: z.boolean().default(false),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const passwordRecoveryRequestSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
});

export const passwordResetSchema = z
  .object({
    password: z
      .string()
      .min(8, "New password must be at least 8 characters.")
      .max(128, "Password must not exceed 128 characters.")
      .regex(/[A-Z]/, "Must include at least one uppercase letter.")
      .regex(/[0-9]/, "Must include at least one number."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

/**
 * Profile update schema: strictly whitelists user-editable profile fields.
 * Never accepts `role`, `accountStatus`, or `isSuspended` from client requests.
 */
export const profileUpdateSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(100),
  username: z
    .string()
    .trim()
    .regex(
      /^[a-zA-Z0-9_.-]{3,30}$/,
      "Username must be 3–30 alphanumeric characters, dots, underscores, or hyphens."
    )
    .optional()
    .or(z.literal("")),
  phoneNumber: z
    .string()
    .trim()
    .regex(
      /^(\+63|0)?9\d{9}$/,
      "Enter a valid Philippine mobile number (e.g., 09171234567)."
    )
    .optional()
    .or(z.literal("")),
  regionCode: z.string().min(2, "Select a valid Philippine region."),
  province: z.string().trim().max(80).optional().default(""),
  cityMunicipality: z.string().trim().max(80).optional().default(""),
  barangay: z.string().trim().max(80).optional().default(""),
  preferredLanguage: z.enum(["en", "fil"]).default("en"),
  saveSearchHistory: z.boolean().default(false),
});

export const roleAssignmentSchema = z.object({
  targetUserId: z.string().uuid("Target user ID must be a valid UUID."),
  newRole: z.enum(["user", "content_manager", "moderator", "administrator"]),
});

export const budgetCalculatorSchema = z.object({
  monthlyNetIncome: z.number().min(0).max(10000000),
  housingAndUtilities: z.number().min(0).max(10000000),
  foodAndGroceries: z.number().min(0).max(10000000),
  transportation: z.number().min(0).max(10000000),
  healthAndContributions: z.number().min(0).max(10000000),
  educationAndFamily: z.number().min(0).max(10000000),
  debtPayments: z.number().min(0).max(10000000),
  personalAndOther: z.number().min(0).max(10000000),
});

/**
 * Checks whether a public submission accidentally includes sensitive personal
 * identifiers (such as 12-digit PhilSys/SSS/TIN/bank numbers or street/house numbers)
 * so we do not expose sensitive PII of people requesting community help.
 */
export function containsSensitivePersonalData(text: string): {
  flagged: boolean;
  reason?: string;
} {
  if (/\b(?:\d[-\s]?){12,16}\b/.test(text)) {
    return {
      flagged: true,
      reason:
        "For your privacy and security, do not include government ID numbers, bank account numbers, or 12+ digit personal identifiers in public posts.",
    };
  }

  if (
    /\b(blk\s*\d+\s*lot\s*\d+|house\s*(no\.?|#)\s*\d+|apt\.?\s*\d+)\b/i.test(
      text
    )
  ) {
    return {
      flagged: true,
      reason:
        "For safety, do not post exact residential house/block/lot numbers publicly. Specify only the Barangay Hall, LGU desk, or public coordination point.",
    };
  }

  return { flagged: false };
}
