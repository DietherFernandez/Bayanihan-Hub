import {
  VERIFIED_ASSISTANCE_PROGRAMS,
  VERIFIED_BAYANIHAN_POSTS,
  VERIFIED_EMERGENCY_HOTLINES,
  VERIFIED_EVACUATION_CENTERS,
  VERIFIED_OPPORTUNITIES,
  VERIFIED_RESOURCES,
} from "@/lib/constants/philippine-data";
import {
  classifySourceUrl,
  evaluateRecordFreshness,
  resolveEffectiveVerificationStatus,
} from "@/components/trust/verification-badge";
import type { ModuleType, VerificationStatus } from "@/types/database";

export type AssistantLanguage = "fil" | "en" | "taglish";

export interface AssistantLocationContext {
  regionCode?: string;
  province?: string;
  cityMunicipality?: string;
  barangay?: string;
}

export interface GroundedCitation {
  id: string;
  slug: string;
  title: string;
  module: ModuleType;
  categoryLabel: string;
  organizationName: string;
  sourceName: string;
  sourceUrl: string;
  sourceTier: "official_gov_ph" | "secondary_partner";
  internalHref: string;
  regionCode: string;
  regionName: string;
  verificationStatus: VerificationStatus;
  effectiveVerificationStatus: VerificationStatus;
  lastVerifiedAt: string;
  isStale: boolean;
  isExpired: boolean;
}

export interface GroundedKnowledgeDocument extends GroundedCitation {
  summary: string;
  eligibilitySummary?: string;
  requirementsList: string[];
  stepsList: string[];
  feesOrBenefitSummary?: string;
  processingTimeOrDeadline?: string;
  contactSummary?: string;
  relevanceScore: number;
}

export interface RetrievalResult {
  query: string;
  detectedLanguage: AssistantLanguage;
  normalizedTerms: string[];
  expandedTerms: string[];
  isEmergencyQuery: boolean;
  isBlockedInjectionOrAbuse: boolean;
  blockReason?: string;
  hasConflictWarning: boolean;
  conflictExplanation?: string;
  hasUnverifiedOrStaleRecords: boolean;
  locationApplied: AssistantLocationContext;
  documents: GroundedKnowledgeDocument[];
}

export const SUGGESTED_STARTING_QUESTIONS: {
  question: string;
  module: ModuleType;
  label: string;
}[] = [
  {
    question: "Paano kumuha ng NBI Clearance?",
    module: "serbisyo",
    label: "NBI Clearance Guide",
  },
  {
    question: "May scholarship ba para sa college students?",
    module: "aral",
    label: "College Scholarships",
  },
  {
    question: "Saan ako makakahanap ng libreng training?",
    module: "aral",
    label: "Free Skills Training",
  },
  {
    question: "Anong government assistance ang puwede kong tingnan?",
    module: "pera",
    label: "Government Assistance",
  },
  {
    question: "Ano ang dapat ihanda kapag may bagyo?",
    module: "kaligtasan",
    label: "Typhoon & Go-Bag Prep",
  },
];

const STOP_WORDS = new Set([
  // Filipino / Taglish conversational stop words
  "paano",
  "pano",
  "kumuha",
  "mag-apply",
  "magapply",
  "apply",
  "ng",
  "na",
  "sa",
  "ang",
  "mga",
  "ba",
  "bang",
  "po",
  "ho",
  "para",
  "saan",
  "san",
  "ako",
  "kami",
  "tayo",
  "makakahanap",
  "makakuha",
  "mahanap",
  "anong",
  "ano",
  "anu",
  "alin",
  "puwede",
  "pwede",
  "pwedeng",
  "puwedeng",
  "kong",
  "ko",
  "mo",
  "niyo",
  "namin",
  "tingnan",
  "tignan",
  "dapat",
  "kailangan",
  "ihanda",
  "kapag",
  "pag",
  "kung",
  "may",
  "meron",
  "mayroon",
  "wala",
  "yung",
  "ung",
  "ito",
  "iyan",
  "doon",
  "dito",
  "ba",
  "at",
  "o",
  // English stop words
  "how",
  "to",
  "get",
  "where",
  "can",
  "i",
  "we",
  "find",
  "what",
  "is",
  "are",
  "the",
  "for",
  "in",
  "of",
  "and",
  "or",
  "a",
  "an",
  "do",
  "does",
  "need",
  "should",
  "prepare",
  "when",
  "there",
  "available",
  "check",
  "look",
  "with",
  "my",
  "our",
  "please",
  "help",
]);

const BILINGUAL_SYNONYM_MAP: Record<string, string[]> = {
  nbi: ["nbi", "clearance", "multi-purpose", "ra 11261", "serbisyo"],
  clearance: ["nbi", "clearance", "barangay", "dti", "serbisyo"],
  psa: ["psa", "birth", "certificate", "civil", "philsys", "serbisyo"],
  birth: ["psa", "birth", "certificate", "civil"],
  national: ["philsys", "national", "id", "digital"],
  passport: ["dfa", "passport", "consular", "serbisyo"],
  philhealth: ["philhealth", "konsulta", "pmrf", "health", "medical"],
  pagibig: ["pag-ibig", "housing", "mp2", "loan"],
  "pag-ibig": ["pag-ibig", "housing", "mp2", "loan"],
  bahay: ["pag-ibig", "housing", "loan", "serbisyo"],
  housing: ["pag-ibig", "housing", "loan", "serbisyo"],
  negosyo: ["dti", "business", "bmbe", "barangay", "clearance", "entrepreneurship"],
  business: ["dti", "business", "bmbe", "barangay", "clearance"],
  scholarship: ["scholarship", "dost", "sei", "ched", "unifast", "college", "undergraduate", "aral"],
  scholarships: ["scholarship", "dost", "sei", "ched", "unifast", "college", "undergraduate", "aral"],
  iskolar: ["scholarship", "dost", "ched", "college", "aral"],
  college: ["scholarship", "dost", "ched", "undergraduate", "students", "aral"],
  students: ["scholarship", "dost", "ched", "undergraduate", "first-time", "aral"],
  estudyante: ["scholarship", "dost", "ched", "undergraduate", "aral"],
  training: ["tesda", "training", "course", "nc", "skills", "dict", "aral", "trabaho"],
  libreng: ["tesda", "free", "training", "course", "scholarship", "aral", "ra 11261"],
  free: ["tesda", "free", "training", "course", "scholarship", "ra 11261"],
  kurso: ["tesda", "course", "training", "aral"],
  courses: ["tesda", "course", "training", "aral"],
  tesda: ["tesda", "e-tesda", "training", "nc", "aral", "trabaho"],
  trabaho: ["job", "trabaho", "employment", "hiring", "peso", "dole", "first-time", "jobseeker"],
  jobs: ["job", "trabaho", "employment", "hiring", "peso", "dole"],
  job: ["job", "trabaho", "employment", "hiring", "peso", "dole"],
  hanapbuhay: ["job", "trabaho", "tupad", "dole", "livelihood"],
  resume: ["trabaho", "job", "first-time", "jobseeker", "ra 11261"],
  assistance: ["assistance", "aics", "dswd", "pcso", "tupad", "sss", "medical", "financial", "pera"],
  tulong: ["assistance", "aics", "dswd", "pcso", "tupad", "bayanihan", "pera"],
  ayuda: ["assistance", "aics", "dswd", "tupad", "financial", "pera"],
  pinansyal: ["assistance", "aics", "dswd", "pcso", "tupad", "financial", "pera"],
  financial: ["assistance", "aics", "dswd", "pcso", "tupad", "financial", "pera"],
  gamot: ["pcso", "aics", "dswd", "philhealth", "medical", "hospital", "pera"],
  medical: ["pcso", "aics", "dswd", "philhealth", "medical", "hospital", "pera"],
  bagyo: ["72-hour", "go-bag", "ndrrmc", "evacuation", "pagasa", "hotline", "911", "143", "kaligtasan"],
  typhoon: ["72-hour", "go-bag", "ndrrmc", "evacuation", "pagasa", "hotline", "911", "143", "kaligtasan"],
  baha: ["72-hour", "go-bag", "ndrrmc", "evacuation", "red cross", "143", "kaligtasan"],
  flood: ["72-hour", "go-bag", "ndrrmc", "evacuation", "red cross", "143", "kaligtasan"],
  lindol: ["72-hour", "go-bag", "ndrrmc", "evacuation", "phivolcs", "911", "kaligtasan"],
  earthquake: ["72-hour", "go-bag", "ndrrmc", "evacuation", "phivolcs", "911", "kaligtasan"],
  sakuna: ["72-hour", "go-bag", "ndrrmc", "evacuation", "911", "143", "kaligtasan"],
  emergency: ["911", "143", "hotline", "red cross", "ndrrmc", "go-bag", "evacuation", "kaligtasan"],
  hotline: ["911", "143", "8888", "1326", "1553", "hotline", "kaligtasan"],
  evacuation: ["evacuation", "center", "drrmo", "ndrrmc", "kaligtasan"],
  volunteer: ["volunteer", "bayanihan", "relief", "red cross", "dswd", "nroc"],
  donasyon: ["donation", "bayanihan", "relief", "red cross", "dswd"],
  donation: ["donation", "bayanihan", "relief", "red cross", "dswd"],
  bayanihan: ["bayanihan", "volunteer", "donation", "relief", "community"],
};

/**
 * Detects whether a user question is primarily Filipino, English, or Taglish.
 */
export function detectQueryLanguage(question: string): AssistantLanguage {
  const lower = question.toLowerCase();
  const filMarkers = [
    "paano",
    "pano",
    "saan",
    "anong",
    "ano",
    "may",
    "meron",
    "para",
    "sa",
    "ng",
    "mga",
    "ba",
    "po",
    "kumuha",
    "makakahanap",
    "libreng",
    "puwede",
    "pwede",
    "dapat",
    "ihanda",
    "kapag",
    "bagyo",
    "tulong",
    "trabaho",
  ];
  const enMarkers = [
    "how",
    "where",
    "what",
    "can",
    "apply",
    "requirements",
    "eligibility",
    "government",
    "assistance",
    "emergency",
    "students",
    "for",
    "the",
    "with",
  ];

  const filHits = filMarkers.filter((w) =>
    new RegExp(`\\b${w}\\b`, "i").test(lower)
  ).length;
  const enHits = enMarkers.filter((w) =>
    new RegExp(`\\b${w}\\b`, "i").test(lower)
  ).length;

  if (filHits > 0 && enHits > 0) return "taglish";
  if (filHits > 0) return "fil";
  return "en";
}

/**
 * Detects prompt injection, system prompt extraction, unauthorized admin escalation,
 * or private data exfiltration attempts.
 */
export function detectPromptInjectionOrAbuse(input: string): {
  blocked: boolean;
  reason?: string;
} {
  const lower = input.toLowerCase();

  const injectionPatterns: { pattern: RegExp; reason: string }[] = [
    {
      pattern:
        /ignore\s+(all\s+|previous\s+|prior\s+|system\s+)*(instructions|rules|prompts|guardrails)/i,
      reason:
        "Prompt injection attempt detected: system safety and grounding instructions cannot be overridden.",
    },
    {
      pattern:
        /(reveal|print|show|output|dump)\s+(your\s+|the\s+)*(system\s+prompt|secret\s+key|api\s+key|service_role|supabase_service_role|environment\s+variables|\.env)/i,
      reason:
        "Security boundary enforced: system prompts, API keys, and server environment variables are strictly confidential.",
    },
    {
      pattern:
        /(grant|make|assign|promote|set)\s+(me|my\s+account|user)\s+(to\s+|as\s+)*(admin|administrator|super_admin|moderator|content_manager)/i,
      reason:
        "Authorization boundary enforced: the AI assistant cannot execute administrative actions or modify user roles.",
    },
    {
      pattern:
        /(list|dump|show|export|select\s+\*\s+from)\s+(all\s+)*(users|profiles|private\s+reports|audit_logs|unpublished\s+drafts|passwords|emails)/i,
      reason:
        "Privacy boundary enforced: the AI assistant has zero access to private user profiles, unpublished drafts, moderation reports, or audit logs.",
    },
    {
      pattern:
        /(approve\s+my\s+application|guarantee\s+my\s+payout|confirm\s+my\s+aics\s+release|issue\s+my\s+clearance)/i,
      reason:
        "Scope boundary enforced: GabayPH is an informational public-service guide and cannot approve government applications or guarantee payouts.",
    },
  ];

  for (const item of injectionPatterns) {
    if (item.pattern.test(lower)) {
      return { blocked: true, reason: item.reason };
    }
  }

  return { blocked: false };
}

/**
 * Sanitizes retrieved record text so embedded instructions inside untrusted data
 * can never hijack the LLM prompt.
 */
export function sanitizeRetrievedRecordText(text: string): string {
  return text
    .replace(
      /ignore\s+(all\s+|previous\s+|system\s+)*(instructions|rules|prompts)/gi,
      "[REDACTED_UNTRUSTED_DIRECTIVE]"
    )
    .replace(/<\s*\/?\s*(system|instruction|prompt)\s*>/gi, "")
    .trim();
}

/**
 * Detects whether a user question describes an active medical, disaster, or life-safety emergency.
 */
export function detectEmergencyIntent(question: string): boolean {
  return /\b(911|143|emergency|saklolo|tulong\s+agad|nasusunog|sunog|fire|baha\s+ngayon|stranded|rescue|bleeding|dugo|unconscious|walang\s+malay|heart\s+attack|stroke|suicide|magpakamatay|crisis\s+hotline|bagyo|lindol|evacuate)\b/i.test(
    question
  );
}

/**
 * Tokenizes a Filipino/English/Taglish query and expands domain synonyms.
 */
export function expandBilingualQueryTerms(question: string): {
  normalizedTerms: string[];
  expandedTerms: string[];
} {
  const cleaned = question
    .toLowerCase()
    .replace(/[?!.,;:"'()[\]{}/\\]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const rawTokens = cleaned.split(" ").filter((t) => t.length >= 2);
  const normalizedTerms = rawTokens.filter((t) => !STOP_WORDS.has(t));

  const expandedSet = new Set<string>(normalizedTerms);
  for (const term of normalizedTerms) {
    const mapped = BILINGUAL_SYNONYM_MAP[term];
    if (mapped) {
      for (const m of mapped) {
        expandedSet.add(m);
      }
    }
  }

  // Also check multi-word phrases in the cleaned string
  if (cleaned.includes("nbi clearance")) {
    expandedSet.add("nbi");
    expandedSet.add("clearance");
  }
  if (cleaned.includes("birth certificate")) {
    expandedSet.add("psa");
    expandedSet.add("birth");
  }
  if (cleaned.includes("national id")) {
    expandedSet.add("philsys");
    expandedSet.add("national");
  }
  if (
    cleaned.includes("government assistance") ||
    cleaned.includes("tulong pinansyal")
  ) {
    expandedSet.add("aics");
    expandedSet.add("dswd");
    expandedSet.add("pcso");
    expandedSet.add("tupad");
  }
  if (cleaned.includes("libreng training") || cleaned.includes("free training")) {
    expandedSet.add("tesda");
    expandedSet.add("training");
  }

  return {
    normalizedTerms,
    expandedTerms: Array.from(expandedSet),
  };
}

/**
 * Builds the unified corpus of ONLY public, published GabayPH records across all 6 modules.
 * Unpublished drafts, private user records, moderation reports, and admin logs are strictly excluded.
 */
export function buildPublicGroundedCorpus(
  extraRecords?: Partial<GroundedKnowledgeDocument>[]
): GroundedKnowledgeDocument[] {
  const docs: GroundedKnowledgeDocument[] = [];

  // 1. Resources (Serbisyo, Trabaho, Aral, Kaligtasan) — ONLY status === "published"
  for (const res of VERIFIED_RESOURCES) {
    if (res.status !== "published") continue;
    const freshness = evaluateRecordFreshness(res.lastVerifiedAt);
    const effectiveStatus = resolveEffectiveVerificationStatus(
      res.verificationStatus,
      res.lastVerifiedAt
    );

    docs.push({
      id: res.id,
      slug: res.slug,
      title: sanitizeRetrievedRecordText(res.title),
      module: res.module,
      categoryLabel: res.categoryName,
      organizationName: `${res.organizationName} (${res.organizationAcronym})`,
      sourceName: res.sourceName,
      sourceUrl: res.sourceUrl,
      sourceTier: classifySourceUrl(res.sourceUrl),
      internalHref: `/${res.module}/${res.slug}`,
      regionCode: res.regionCode,
      regionName: res.regionName,
      verificationStatus: res.verificationStatus,
      effectiveVerificationStatus: effectiveStatus,
      lastVerifiedAt: res.lastVerifiedAt,
      isStale: freshness.isStale,
      isExpired: freshness.isExpired,
      summary: sanitizeRetrievedRecordText(res.summary),
      eligibilitySummary: sanitizeRetrievedRecordText(res.eligibilitySummary),
      requirementsList: res.requirementsChecklist.map((r) =>
        sanitizeRetrievedRecordText(
          `${r.label}${r.isMandatory ? " (Mandatory)" : " (If applicable)"} — ${r.notes}`
        )
      ),
      stepsList: res.steps.map((s) =>
        sanitizeRetrievedRecordText(
          `Step ${s.stepNumber}: ${s.title} — ${s.description}`
        )
      ),
      feesOrBenefitSummary: sanitizeRetrievedRecordText(res.feesSummary),
      processingTimeOrDeadline: sanitizeRetrievedRecordText(res.processingTime),
      contactSummary: res.contactInfo.hotline
        ? `Hotline: ${res.contactInfo.hotline} (${res.contactInfo.hours})`
        : res.contactInfo.hours,
      relevanceScore: 0,
    });
  }

  // 2. Opportunities (Trabaho Jobs, Aral Scholarships & Free Training) — ONLY status === "published"
  for (const opp of VERIFIED_OPPORTUNITIES) {
    if (opp.status !== "published") continue;
    const targetModule: ModuleType =
      opp.type === "scholarship" ? "aral" : "trabaho";
    const freshness = evaluateRecordFreshness(
      opp.lastVerifiedAt,
      opp.deadlineAt
    );
    const effectiveStatus = resolveEffectiveVerificationStatus(
      opp.verificationStatus,
      opp.lastVerifiedAt
    );

    docs.push({
      id: opp.id,
      slug: opp.slug,
      title: sanitizeRetrievedRecordText(opp.title),
      module: targetModule,
      categoryLabel:
        opp.type === "job"
          ? "Verified Job Vacancy"
          : opp.type === "scholarship"
          ? "Government Scholarship Grant"
          : "Free Technical-Vocational Training",
      organizationName: opp.organizationName,
      sourceName: opp.sourceName,
      sourceUrl: opp.sourceUrl,
      sourceTier: classifySourceUrl(opp.sourceUrl),
      internalHref: `/${targetModule}/${opp.slug}`,
      regionCode: opp.regionCode,
      regionName: opp.regionName,
      verificationStatus: opp.verificationStatus,
      effectiveVerificationStatus: effectiveStatus,
      lastVerifiedAt: opp.lastVerifiedAt,
      isStale: freshness.isStale,
      isExpired: freshness.isExpired,
      summary: sanitizeRetrievedRecordText(opp.description),
      requirementsList: opp.requirements.map((r) =>
        sanitizeRetrievedRecordText(r)
      ),
      stepsList: [
        `Apply directly via the official ${opp.sourceName} portal (${opp.sourceUrl}). Never pay placement or processing fees.`,
      ],
      feesOrBenefitSummary: sanitizeRetrievedRecordText(
        `Benefit / Compensation: ${opp.compensationOrBenefit} (No application fee)`
      ),
      processingTimeOrDeadline: opp.deadlineAt
        ? `Schedule / Window: ${opp.deadlineAt}`
        : `Employment / Grant Type: ${opp.employmentType}`,
      relevanceScore: 0,
    });
  }

  // 3. Financial & Medical Assistance Programs (Pera) — ONLY status === "published"
  for (const aid of VERIFIED_ASSISTANCE_PROGRAMS) {
    if (aid.status !== "published") continue;
    const freshness = evaluateRecordFreshness(aid.lastVerifiedAt);
    const effectiveStatus = resolveEffectiveVerificationStatus(
      aid.verificationStatus,
      aid.lastVerifiedAt
    );

    docs.push({
      id: aid.id,
      slug: aid.slug,
      title: sanitizeRetrievedRecordText(aid.programName),
      module: "pera",
      categoryLabel: "Financial & Medical Assistance",
      organizationName: aid.organizationName,
      sourceName: aid.sourceName,
      sourceUrl: aid.sourceUrl,
      sourceTier: classifySourceUrl(aid.sourceUrl),
      internalHref: `/pera/${aid.slug}`,
      regionCode: aid.regionCode,
      regionName: aid.regionName,
      verificationStatus: aid.verificationStatus,
      effectiveVerificationStatus: effectiveStatus,
      lastVerifiedAt: aid.lastVerifiedAt,
      isStale: freshness.isStale,
      isExpired: freshness.isExpired,
      summary: sanitizeRetrievedRecordText(aid.description),
      eligibilitySummary: sanitizeRetrievedRecordText(
        aid.eligibilityCriteria.join("; ")
      ),
      requirementsList: aid.requiredDocuments.map((r) =>
        sanitizeRetrievedRecordText(r)
      ),
      stepsList: aid.howToApply.map((s, idx) =>
        sanitizeRetrievedRecordText(`Step ${idx + 1}: ${s}`)
      ),
      feesOrBenefitSummary: sanitizeRetrievedRecordText(
        `Assistance Benefit: ${aid.benefitSummary} (Application is FREE)`
      ),
      relevanceScore: 0,
    });
  }

  // 4. Bayanihan Community & Volunteer Posts — ONLY status === "published"
  for (const post of VERIFIED_BAYANIHAN_POSTS) {
    if (post.status !== "published") continue;
    const freshness = evaluateRecordFreshness(post.lastVerifiedAt);
    const effectiveStatus = resolveEffectiveVerificationStatus(
      post.verificationStatus,
      post.lastVerifiedAt
    );

    docs.push({
      id: post.id,
      slug: post.slug,
      title: sanitizeRetrievedRecordText(post.title),
      module: "bayanihan",
      categoryLabel:
        post.postType === "volunteer_call"
          ? "Volunteer Call"
          : post.postType === "donation_offer"
          ? "In-Kind Donation Hub"
          : "Community Assistance Coordination",
      organizationName: post.organizationName,
      sourceName: post.sourceName,
      sourceUrl: post.sourceUrl,
      sourceTier: classifySourceUrl(post.sourceUrl),
      internalHref: `/bayanihan/${post.slug}`,
      regionCode: post.regionCode,
      regionName: `${post.cityMunicipality}, ${post.regionName}`,
      verificationStatus: post.verificationStatus,
      effectiveVerificationStatus: effectiveStatus,
      lastVerifiedAt: post.lastVerifiedAt,
      isStale: freshness.isStale,
      isExpired: freshness.isExpired,
      summary: sanitizeRetrievedRecordText(post.summary),
      requirementsList: post.itemsOrSkillsNeeded.map((i) =>
        sanitizeRetrievedRecordText(i)
      ),
      stepsList: [
        `Coordination Point: ${post.dropOffOrMeetingPoint}`,
        `Official Contact Desk: ${post.contactChannel}`,
      ],
      contactSummary: post.contactChannel,
      relevanceScore: 0,
    });
  }

  // 5. Kaligtasan Emergency Hotlines & Evacuation Centers
  for (const hot of VERIFIED_EMERGENCY_HOTLINES) {
    const freshness = evaluateRecordFreshness(hot.lastVerifiedAt);
    const effectiveStatus = resolveEffectiveVerificationStatus(
      hot.verificationStatus,
      hot.lastVerifiedAt
    );

    docs.push({
      id: hot.id,
      slug: hot.acronym.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: `${hot.agencyName} (${hot.acronym}) — Hotline ${hot.primaryNumber}`,
      module: "kaligtasan",
      categoryLabel: "24/7 Emergency Hotline",
      organizationName: `${hot.agencyName} (${hot.acronym})`,
      sourceName: hot.agencyName,
      sourceUrl: hot.sourceUrl,
      sourceTier: classifySourceUrl(hot.sourceUrl),
      internalHref: "/kaligtasan#hotlines",
      regionCode: "NATIONAL",
      regionName: hot.coverage,
      verificationStatus: hot.verificationStatus,
      effectiveVerificationStatus: effectiveStatus,
      lastVerifiedAt: hot.lastVerifiedAt,
      isStale: freshness.isStale,
      isExpired: freshness.isExpired,
      summary: `Primary Hotline: ${hot.primaryNumber}. Alternate Numbers: ${
        hot.secondaryNumbers.join(", ") || "None"
      }. Coverage: ${hot.coverage} (${hot.operatingHours}).`,
      requirementsList: [],
      stepsList: [
        `Dial ${hot.primaryNumber} immediately during an emergency (${hot.operatingHours}).`,
      ],
      contactSummary: `Primary: ${hot.primaryNumber}`,
      relevanceScore: 0,
    });
  }

  for (const evac of VERIFIED_EVACUATION_CENTERS) {
    const freshness = evaluateRecordFreshness(evac.lastVerifiedAt);
    const effectiveStatus = resolveEffectiveVerificationStatus(
      evac.verificationStatus,
      evac.lastVerifiedAt
    );

    docs.push({
      id: evac.id,
      slug: evac.id,
      title: `${evac.name} (${evac.cityMunicipality})`,
      module: "kaligtasan",
      categoryLabel: "LGU Evacuation Center",
      organizationName: evac.managingLgu,
      sourceName: evac.managingLgu,
      sourceUrl: evac.sourceUrl,
      sourceTier: classifySourceUrl(evac.sourceUrl),
      internalHref: "/kaligtasan",
      regionCode: evac.regionCode,
      regionName: `${evac.barangay}, ${evac.cityMunicipality} (${evac.regionCode})`,
      verificationStatus: evac.verificationStatus,
      effectiveVerificationStatus: effectiveStatus,
      lastVerifiedAt: evac.lastVerifiedAt,
      isStale: freshness.isStale,
      isExpired: freshness.isExpired,
      summary: `Evacuation facility at ${evac.address} (${evac.barangay}, ${evac.cityMunicipality}). Capacity: ${evac.capacityEstimate}.`,
      requirementsList: evac.facilities,
      stepsList: [
        `Coordinate with ${evac.managingLgu} (${evac.contactNumber}) before or during evacuation.`,
      ],
      contactSummary: `${evac.managingLgu}: ${evac.contactNumber}`,
      relevanceScore: 0,
    });
  }

  // Optional test-injected records (used in automated test suites for conflict/staleness/unverified scenarios)
  if (extraRecords && extraRecords.length > 0) {
    for (const extra of extraRecords) {
      if (!extra.id || !extra.title || !extra.sourceUrl) continue;
      const lastVer = extra.lastVerifiedAt || "2026-11-01";
      const verStatus = extra.verificationStatus || "officially_verified";
      const freshness = evaluateRecordFreshness(lastVer);
      const effectiveStatus = resolveEffectiveVerificationStatus(
        verStatus,
        lastVer
      );
      docs.push({
        id: extra.id,
        slug: extra.slug || extra.id,
        title: sanitizeRetrievedRecordText(extra.title),
        module: extra.module || "serbisyo",
        categoryLabel: extra.categoryLabel || "Public Record",
        organizationName: extra.organizationName || "Philippine Agency",
        sourceName: extra.sourceName || "Official Source",
        sourceUrl: extra.sourceUrl,
        sourceTier: classifySourceUrl(extra.sourceUrl),
        internalHref: extra.internalHref || `/serbisyo/${extra.slug || extra.id}`,
        regionCode: extra.regionCode || "NATIONAL",
        regionName: extra.regionName || "Nationwide",
        verificationStatus: verStatus,
        effectiveVerificationStatus: effectiveStatus,
        lastVerifiedAt: lastVer,
        isStale: freshness.isStale,
        isExpired: freshness.isExpired,
        summary: sanitizeRetrievedRecordText(extra.summary || ""),
        eligibilitySummary: extra.eligibilitySummary,
        requirementsList: (extra.requirementsList || []).map(
          sanitizeRetrievedRecordText
        ),
        stepsList: (extra.stepsList || []).map(sanitizeRetrievedRecordText),
        feesOrBenefitSummary: extra.feesOrBenefitSummary,
        processingTimeOrDeadline: extra.processingTimeOrDeadline,
        contactSummary: extra.contactSummary,
        relevanceScore: 0,
      });
    }
  }

  return docs;
}

/**
 * Detects whether retrieved documents contain conflicting fee, benefit, or requirement claims
 * for the same agency/topic so the assistant can transparently disclose the conflict.
 */
export function detectSourceConflicts(docs: GroundedKnowledgeDocument[]): {
  hasConflict: boolean;
  explanation?: string;
} {
  if (docs.length < 2) return { hasConflict: false };

  // Check if two documents share the same slug Prefix or identical title/topic but different feesOrBenefitSummary or verificationStatus
  for (let i = 0; i < docs.length; i++) {
    for (let j = i + 1; j < docs.length; j++) {
      const a = docs[i];
      const b = docs[j];
      const sameTopic =
        a.organizationName === b.organizationName &&
        a.categoryLabel === b.categoryLabel &&
        a.title.toLowerCase().split(" ")[0] ===
          b.title.toLowerCase().split(" ")[0];

      if (
        sameTopic &&
        a.feesOrBenefitSummary &&
        b.feesOrBenefitSummary &&
        a.feesOrBenefitSummary !== b.feesOrBenefitSummary
      ) {
        return {
          hasConflict: true,
          explanation: `Note on Differing Records: "${a.title}" (${a.lastVerifiedAt}, ${a.effectiveVerificationStatus}) lists "${a.feesOrBenefitSummary}", while "${b.title}" (${b.lastVerifiedAt}, ${b.effectiveVerificationStatus}) lists "${b.feesOrBenefitSummary}". Please verify the latest circular directly on ${a.sourceUrl}.`,
        };
      }
    }
  }

  return { hasConflict: false };
}

/**
 * Main Phase 7 Grounded Retrieval Function.
 * Searches across all 6 GabayPH modules using bilingual keyword/synonym matching,
 * geographic filtering, and verification metadata.
 */
export function retrieveGroundedGabayRecords(params: {
  question: string;
  location?: AssistantLocationContext;
  moduleFilter?: ModuleType | "all";
  limit?: number;
  extraCorpusRecords?: Partial<GroundedKnowledgeDocument>[];
}): RetrievalResult {
  const question = params.question.trim();
  const detectedLanguage = detectQueryLanguage(question);
  const locationApplied: AssistantLocationContext = {
    regionCode: params.location?.regionCode || "ALL",
    province: params.location?.province || "",
    cityMunicipality: params.location?.cityMunicipality || "",
    barangay: params.location?.barangay || "",
  };

  // 1. Check prompt injection / abuse first
  const abuseCheck = detectPromptInjectionOrAbuse(question);
  if (abuseCheck.blocked) {
    return {
      query: question,
      detectedLanguage,
      normalizedTerms: [],
      expandedTerms: [],
      isEmergencyQuery: false,
      isBlockedInjectionOrAbuse: true,
      blockReason: abuseCheck.reason,
      hasConflictWarning: false,
      hasUnverifiedOrStaleRecords: false,
      locationApplied,
      documents: [],
    };
  }

  const isEmergencyQuery = detectEmergencyIntent(question);
  const { normalizedTerms, expandedTerms } = expandBilingualQueryTerms(question);
  const corpus = buildPublicGroundedCorpus(params.extraCorpusRecords);

  // If the query has no meaningful terms after stop-word removal, return empty
  if (expandedTerms.length === 0) {
    return {
      query: question,
      detectedLanguage,
      normalizedTerms,
      expandedTerms,
      isEmergencyQuery,
      isBlockedInjectionOrAbuse: false,
      hasConflictWarning: false,
      hasUnverifiedOrStaleRecords: false,
      locationApplied,
      documents: [],
    };
  }

  const scored: GroundedKnowledgeDocument[] = [];

  for (const doc of corpus) {
    if (
      params.moduleFilter &&
      params.moduleFilter !== "all" &&
      doc.module !== params.moduleFilter
    ) {
      continue;
    }

    // Location filter: include NATIONAL records and records matching the requested region
    const regFilter = locationApplied.regionCode;
    if (
      regFilter &&
      regFilter !== "ALL" &&
      regFilter !== "NATIONAL" &&
      doc.regionCode !== "NATIONAL" &&
      doc.regionCode !== regFilter
    ) {
      continue;
    }

    const titleLower = doc.title.toLowerCase();
    const orgLower = `${doc.organizationName} ${doc.sourceName}`.toLowerCase();
    const summaryLower = `${doc.summary} ${doc.categoryLabel} ${doc.module}`.toLowerCase();
    const detailsLower = [
      doc.eligibilitySummary || "",
      doc.feesOrBenefitSummary || "",
      ...doc.requirementsList,
      ...doc.stepsList,
    ]
      .join(" ")
      .toLowerCase();

    let score = 0;

    // Score direct normalized user terms higher than expanded synonyms
    for (const term of normalizedTerms) {
      if (titleLower.includes(term)) score += 12;
      if (orgLower.includes(term)) score += 10;
      if (summaryLower.includes(term)) score += 6;
      if (detailsLower.includes(term)) score += 3;
    }

    for (const syn of expandedTerms) {
      if (normalizedTerms.includes(syn)) continue;
      if (titleLower.includes(syn)) score += 5;
      if (orgLower.includes(syn)) score += 4;
      if (summaryLower.includes(syn)) score += 3;
      if (detailsLower.includes(syn)) score += 1;
    }

    // Boost regional match if user provided a specific region or city
    if (
      regFilter &&
      regFilter !== "ALL" &&
      regFilter !== "NATIONAL" &&
      doc.regionCode === regFilter
    ) {
      score += 6;
    }
    if (
      locationApplied.cityMunicipality &&
      doc.regionName
        .toLowerCase()
        .includes(locationApplied.cityMunicipality.toLowerCase())
    ) {
      score += 8;
    }

    // Boost emergency hotlines and Go-Bag guide when emergency intent is detected
    if (isEmergencyQuery && doc.module === "kaligtasan" && score > 0) {
      score += 10;
    }

    if (score > 0) {
      scored.push({
        ...doc,
        relevanceScore: score,
      });
    }
  }

  scored.sort((a, b) => {
    if (b.relevanceScore !== a.relevanceScore) {
      return b.relevanceScore - a.relevanceScore;
    }
    // Prefer officially_verified over pending/stale when relevance is tied
    if (
      a.effectiveVerificationStatus === "officially_verified" &&
      b.effectiveVerificationStatus !== "officially_verified"
    ) {
      return -1;
    }
    return 0;
  });

  const maxResults = params.limit ?? 4;
  const topDocs = scored.slice(0, maxResults);

  const conflictCheck = detectSourceConflicts(topDocs);
  const hasUnverifiedOrStaleRecords = topDocs.some(
    (d) =>
      d.effectiveVerificationStatus !== "officially_verified" ||
      d.isStale ||
      d.isExpired
  );

  return {
    query: question,
    detectedLanguage,
    normalizedTerms,
    expandedTerms,
    isEmergencyQuery,
    isBlockedInjectionOrAbuse: false,
    hasConflictWarning: conflictCheck.hasConflict,
    conflictExplanation: conflictCheck.explanation,
    hasUnverifiedOrStaleRecords,
    locationApplied,
    documents: topDocs,
  };
}
