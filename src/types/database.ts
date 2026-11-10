export type CanonicalUserRole =
  | "user"
  | "content_manager"
  | "moderator"
  | "administrator";

export type UserRole =
  | CanonicalUserRole
  | "super_admin"
  | "content_admin"
  | "regional_moderator"
  | "organization"
  | "citizen";

export type AccountStatus =
  | "active"
  | "pending_verification"
  | "suspended"
  | "deactivated";

export type VerificationStatus =
  | "officially_verified"
  | "verification_pending"
  | "archived";

export type RecordStatus =
  | "draft"
  | "published"
  | "under_review"
  | "rejected"
  | "archived";

export type ModuleType =
  | "trabaho"
  | "serbisyo"
  | "pera"
  | "bayanihan"
  | "aral"
  | "kaligtasan";

export type OpportunityType = "job" | "scholarship" | "training" | "volunteer";

export type BayanihanPostType =
  | "donation_offer"
  | "assistance_request"
  | "volunteer_call";

export type ReportReason =
  | "outdated_info"
  | "incorrect_requirements"
  | "broken_link"
  | "suspected_scam"
  | "abusive_content"
  | "other";

export interface ChecklistItem {
  id: string;
  label: string;
  notes?: string;
  isMandatory: boolean;
}

export interface StepInstruction {
  stepNumber: number;
  title: string;
  description: string;
  officialPortalLink?: string;
}

export interface LocationRecord {
  id: string;
  psgcCode: string;
  regionCode: string;
  regionName: string;
  province?: string;
  cityMunicipality?: string;
  isNational: boolean;
}

export interface OrganizationRecord {
  id: string;
  name: string;
  acronym: string;
  slug: string;
  orgType: "gov_agency" | "lgu" | "ngo" | "employer" | "school";
  description: string;
  officialWebsite: string;
  verifiedEmailDomain?: string;
  hotline?: string;
  address?: string;
  verificationStatus: VerificationStatus;
  status: RecordStatus;
  regionCode: string;
  lastVerifiedAt: string;
}

export interface ResourceRecord {
  id: string;
  module: ModuleType;
  categorySlug: string;
  categoryName: string;
  organizationSlug: string;
  organizationName: string;
  organizationAcronym: string;
  regionCode: string;
  regionName: string;
  slug: string;
  title: string;
  summary: string;
  requirementsChecklist: ChecklistItem[];
  steps: StepInstruction[];
  eligibilitySummary: string;
  processingTime: string;
  feesSummary: string;
  sourceName: string;
  sourceUrl: string;
  contactInfo: {
    hotline?: string;
    email?: string;
    hours?: string;
  };
  verificationStatus: VerificationStatus;
  status: RecordStatus;
  lastVerifiedAt: string;
}

export interface OpportunityRecord {
  id: string;
  type: OpportunityType;
  categorySlug: string;
  organizationSlug: string;
  organizationName: string;
  regionCode: string;
  regionName: string;
  slug: string;
  title: string;
  description: string;
  requirements: string[];
  compensationOrBenefit: string;
  employmentType: string;
  applicationUrl: string;
  deadlineAt?: string;
  isRemote: boolean;
  sourceName: string;
  sourceUrl: string;
  verificationStatus: VerificationStatus;
  status: RecordStatus;
  lastVerifiedAt: string;
}

export interface AssistanceProgramRecord {
  id: string;
  organizationSlug: string;
  organizationName: string;
  regionCode: string;
  regionName: string;
  slug: string;
  programName: string;
  programType:
    | "medical"
    | "educational"
    | "burial"
    | "cash_aid"
    | "calamity"
    | "livelihood"
    | "housing";
  description: string;
  benefitSummary: string;
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  howToApply: string[];
  sourceName: string;
  sourceUrl: string;
  verificationStatus: VerificationStatus;
  status: RecordStatus;
  lastVerifiedAt: string;
}

export interface BayanihanPostRecord {
  id: string;
  postType: BayanihanPostType;
  organizationName: string;
  regionCode: string;
  regionName: string;
  cityMunicipality: string;
  slug: string;
  title: string;
  summary: string;
  urgencyLevel: "normal" | "high" | "critical";
  itemsOrSkillsNeeded: string[];
  dropOffOrMeetingPoint: string;
  contactChannel: string;
  sourceName: string;
  sourceUrl: string;
  verificationStatus: VerificationStatus;
  status: RecordStatus;
  lastVerifiedAt: string;
}

export interface EmergencyHotlineRecord {
  id: string;
  agencyName: string;
  acronym: string;
  category: "national_emergency" | "disaster_weather" | "medical_red_cross" | "law_enforcement" | "social_welfare" | "utilities_transport";
  primaryNumber: string;
  secondaryNumbers: string[];
  coverage: string;
  operatingHours: string;
  sourceUrl: string;
  verificationStatus: VerificationStatus;
  lastVerifiedAt: string;
}

export interface EvacuationCenterRecord {
  id: string;
  name: string;
  regionCode: string;
  cityMunicipality: string;
  barangay: string;
  address: string;
  capacityEstimate: string;
  facilities: string[];
  managingLgu: string;
  contactNumber: string;
  sourceUrl: string;
  verificationStatus: VerificationStatus;
  lastVerifiedAt: string;
}

export interface AnnouncementRecord {
  id: string;
  title: string;
  summary: string;
  severity: "info" | "warning" | "emergency";
  relatedModule: ModuleType;
  regionCode: string;
  sourceName: string;
  sourceUrl: string;
  verificationStatus: VerificationStatus;
  startsAt: string;
  expiresAt: string;
  isActive: boolean;
}

export interface UniversalSearchResult {
  id: string;
  slug: string;
  title: string;
  summary: string;
  module: ModuleType;
  recordKind: "resource" | "opportunity" | "assistance_program" | "bayanihan" | "hotline";
  href: string;
  regionCode: string;
  regionName: string;
  sourceName: string;
  sourceUrl: string;
  verificationStatus: VerificationStatus;
  lastVerifiedAt: string;
  badgeLabel: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  username?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  role: UserRole;
  regionCode: string;
  province?: string;
  cityMunicipality?: string;
  barangay?: string;
  accountStatus?: AccountStatus;
  saveSearchHistory: boolean;
  preferredLanguage: "en" | "fil";
  emailVerified?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface UserRoleRecord {
  id: string;
  userId: string;
  role: CanonicalUserRole;
  assignedBy?: string | null;
  createdAt: string;
}

export interface BookmarkItem {
  id: string;
  targetType: "resource" | "opportunity" | "assistance_program" | "bayanihan_post";
  targetId: string;
  targetSlug: string;
  targetTitle: string;
  targetModule: ModuleType;
  href: string;
  notes?: string;
  createdAt: string;
}

export interface ReportSubmission {
  id: string;
  targetType: "resource" | "opportunity" | "assistance_program" | "organization" | "bayanihan_post";
  targetId: string;
  targetTitle: string;
  reason: ReportReason;
  details: string;
  officialReferenceUrl?: string;
  resolutionStatus: "open" | "investigating" | "resolved" | "dismissed";
  resolutionNotes?: string;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  summary: string;
  createdAt: string;
}
