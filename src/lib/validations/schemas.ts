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
    email: z.string().trim().email("Enter a valid email address."),
    regionCode: z.string().min(2, "Please select your region."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Must include at least one uppercase letter.")
      .regex(/[0-9]/, "Must include at least one number."),
    confirmPassword: z.string(),
    saveSearchHistory: z.boolean().default(false),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
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
