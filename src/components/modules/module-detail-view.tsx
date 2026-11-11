"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  CheckSquare,
  Square,
  ExternalLink,
  Printer,
  ShieldAlert,
  Building2,
  MapPin,
  Clock,
  Banknote,
} from "lucide-react";
import {
  VERIFIED_ASSISTANCE_PROGRAMS,
  VERIFIED_BAYANIHAN_POSTS,
  VERIFIED_OPPORTUNITIES,
  VERIFIED_ORGANIZATIONS,
  VERIFIED_RESOURCES,
} from "@/lib/constants/philippine-data";
import type { ModuleType } from "@/types/database";
import {
  evaluateRecordFreshness,
  SourceCitationBar,
  VerificationBadge,
} from "@/components/trust/verification-badge";
import { useCitizenState } from "@/components/providers/citizen-state-provider";
import { useThemeAndToast } from "@/components/providers/theme-provider";
import { EmptyState } from "@/components/ui/design-system";
import { CopyButton } from "@/components/ui/copy-button";

const MODULE_META: Record<
  ModuleType,
  { label: string; href: string; disclaimer: string }
> = {
  trabaho: {
    label: "Trabaho (Employment, Scholarships & Skills)",
    href: "/trabaho",
    disclaimer:
      "Important Notice: GabayPH is an independent public information directory and is NOT the employer or recruitment agency. We never charge placement fees or guarantee employment. Verify all job openings directly on the official employer or .gov.ph portal.",
  },
  serbisyo: {
    label: "Serbisyo (Government Services & Checklists)",
    href: "/serbisyo",
    disclaimer:
      "Important Notice: GabayPH is an independent civic guide and is NOT a government agency. Requirements, statutory fees, and processing times are compiled from official agency charters and must be completed directly at the official .gov.ph portal or agency office.",
  },
  pera: {
    label: "Pera (Financial Assistance & Household Tools)",
    href: "/pera",
    disclaimer:
      "Important Notice: This guide is for general informational purposes only and does NOT constitute licensed financial advice. GabayPH does not process applications, disburse funds, or guarantee assistance approval.",
  },
  bayanihan: {
    label: "Bayanihan (Community Support & Volunteering)",
    href: "/bayanihan",
    disclaimer:
      "Safety & Privacy Notice: GabayPH does not collect monetary donations or process payments. Coordinate only at verified LGU / Barangay halls or official NGO desks, and never share private financial credentials.",
  },
  aral: {
    label: "Aral (Free Courses, Scholarships & Learning)",
    href: "/aral",
    disclaimer:
      "Important Notice: Enrollment, scholarship selection, and National Certification (NC) assessments are administered directly by TESDA, CHED-UniFAST, DOST-SEI, or the respective educational institution.",
  },
  kaligtasan: {
    label: "Kaligtasan (Emergency Hotlines & Preparedness)",
    href: "/kaligtasan",
    disclaimer:
      "Emergency Notice: This guide provides static preparedness and first-aid reference information and does not replace emergency responders, medical professionals, or official PAGASA/NDRRMC/PHIVOLCS live warnings. In a life-threatening emergency, dial 911 or 143 immediately.",
  },
};

export function ModuleDetailView({
  module,
  slug,
}: {
  module: ModuleType;
  slug: string;
}) {
  const {
    completedChecklistIds,
    toggleChecklistStep,
    toggleBookmark,
    isBookmarked,
  } = useCitizenState();
  const { showToast } = useThemeAndToast();

  const meta = MODULE_META[module];

  // Lookup across all 4 core catalog collections
  const resource = VERIFIED_RESOURCES.find((r) => r.slug === slug);
  const opportunity = VERIFIED_OPPORTUNITIES.find((o) => o.slug === slug);
  const assistance = VERIFIED_ASSISTANCE_PROGRAMS.find((a) => a.slug === slug);
  const bayanihan = VERIFIED_BAYANIHAN_POSTS.find((b) => b.slug === slug);

  if (!resource && !opportunity && !assistance && !bayanihan) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <EmptyState
          title="Resource Not Found"
          description={`No verified record matching "${slug}" was found in ${meta.label}. It may have been archived or moved.`}
          actionLabel={`Back to ${meta.label}`}
          onAction={() => {
            if (typeof window !== "undefined") {
              window.location.href = meta.href;
            }
          }}
        />
      </div>
    );
  }

  // 1. Render ResourceRecord Detail
  if (resource) {
    const org = VERIFIED_ORGANIZATIONS.find(
      (o) => o.slug === resource.organizationSlug
    );
    const saved = isBookmarked(resource.id);
    const completedList = completedChecklistIds[resource.slug] || [];
    const freshness = evaluateRecordFreshness(resource.lastVerifiedAt);

    return (
      <div className="mx-auto max-w-4xl px-3 py-6 sm:px-6">
        <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-2">
          <Link
            href={meta.href}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#17365D] hover:underline dark:text-teal-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Back to {meta.label}</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") window.print();
              }}
              className="inline-flex items-center gap-1.5 rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--gabay-text)] hover:bg-[var(--gabay-surface-muted)]"
            >
              <Printer className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const added = toggleBookmark({
                  targetType: "resource",
                  targetId: resource.id,
                  targetSlug: resource.slug,
                  targetTitle: resource.title,
                  targetModule: resource.module,
                  href: `/${module}/${resource.slug}`,
                });
                showToast({
                  title: added ? "Saved to Bookmarks" : "Removed from Bookmarks",
                  description: resource.title,
                  variant: "info",
                });
              }}
              className="inline-flex items-center gap-1.5 rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--gabay-text)] hover:bg-[var(--gabay-surface-muted)]"
            >
              {saved ? (
                <>
                  <BookmarkCheck className="h-3.5 w-3.5 text-[#17365D] dark:text-teal-300" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="h-3.5 w-3.5" />
                  <span>Bookmark Guide</span>
                </>
              )}
            </button>
          </div>
        </div>

        <article className="rounded-md border border-[var(--gabay-border)] bg-[var(--gabay-surface)] p-5 shadow-2xs sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-[#17365D] px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-white">
              {resource.organizationAcronym}
            </span>
            <span className="text-xs font-medium text-[var(--gabay-neutral)]">
              {resource.categoryName}
            </span>
            <VerificationBadge
              status={resource.verificationStatus}
              lastVerifiedAt={resource.lastVerifiedAt}
            />
          </div>

          <h1 className="gabay-page-title mt-2 text-[var(--gabay-text)]">
            {resource.title}
          </h1>
          <p className="mt-1.5 text-xs leading-relaxed text-[var(--gabay-neutral)]">
            {resource.summary}
          </p>

          {(freshness.isStale || freshness.isExpired) && (
            <div className="mt-3 rounded border border-amber-300 bg-amber-50 p-3 text-xs text-amber-950">
              <strong>Re-verification Notice:</strong> This record is due for periodic verification review. Always confirm the latest circular directly on the official agency link below.
            </div>
          )}

          {/* Key Metadata Grid */}
          <div className="mt-4 grid grid-cols-1 gap-3 rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface-muted)] p-3.5 text-xs sm:grid-cols-3">
            <div>
              <div className="flex items-center gap-1 font-semibold text-[var(--gabay-neutral)]">
                <Banknote className="h-3.5 w-3.5 text-[#17365D] dark:text-teal-300" />
                <span>Verified Statutory Fees</span>
              </div>
              <p className="mt-1 font-semibold text-[var(--gabay-text)]">
                {resource.feesSummary}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-1 font-semibold text-[var(--gabay-neutral)]">
                <Clock className="h-3.5 w-3.5 text-[#17365D] dark:text-teal-300" />
                <span>Processing Time</span>
              </div>
              <p className="mt-1 font-semibold text-[var(--gabay-text)]">
                {resource.processingTime}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-1 font-semibold text-[var(--gabay-neutral)]">
                <MapPin className="h-3.5 w-3.5 text-[#17365D] dark:text-teal-300" />
                <span>Geographic Coverage</span>
              </div>
              <p className="mt-1 font-semibold text-[var(--gabay-text)]">
                {resource.regionName}
              </p>
            </div>
          </div>

          {/* Interactive Documentary Requirements Checklist */}
          <section className="mt-6">
            {(() => {
              const checkedCount = completedList.length;
              const totalReqs = resource.requirementsChecklist.length;
              const pct = totalReqs > 0 ? Math.round((checkedCount / totalReqs) * 100) : 0;
              const allReqsText = resource.requirementsChecklist
                .map((r, i) => `${i + 1}. ${r.label}${r.isMandatory ? " [Required]" : ""} ${r.notes ? `(${r.notes})` : ""}`)
                .join("\n");

              return (
                <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900/50">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
                    <span className="text-slate-800 dark:text-slate-200">Application Readiness Tracker</span>
                    <span className={pct === 100 ? "font-bold text-emerald-600 dark:text-emerald-400" : "text-[#17365D] dark:text-teal-300"}>
                      {checkedCount} of {totalReqs} prepared ({pct}%)
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className={`h-full transition-all duration-300 ${pct === 100 ? "bg-emerald-600" : "bg-[#17365D] dark:bg-teal-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Tap any checkbox to track your document preparation.
                    </span>
                    <CopyButton
                      textToCopy={`Checklist for ${resource.title}:\n${allReqsText}`}
                      label="Copy All Requirements"
                      copiedLabel="Checklist Copied!"
                      className="text-[11px]"
                    />
                  </div>
                </div>
              );
            })()}

            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[var(--gabay-text)]">
                1. Required Documents
              </h2>
              <span className="font-mono text-xs text-[var(--gabay-neutral)]">
                {completedList.length} / {resource.requirementsChecklist.length} ready
              </span>
            </div>
            <div className="mt-2.5 space-y-2">
              {resource.requirementsChecklist.map((item) => {
                const isDone = completedList.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklistStep(resource.slug, item.id)}
                    role="checkbox"
                    aria-checked={isDone}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === " " || e.key === "Enter") {
                        e.preventDefault();
                        toggleChecklistStep(resource.slug, item.id);
                      }
                    }}
                    className={`flex cursor-pointer items-start gap-2.5 rounded border p-3 text-xs transition-colors ${
                      isDone
                        ? "border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/30"
                        : "border-[var(--gabay-border)] bg-[var(--gabay-surface)] hover:bg-[var(--gabay-surface-muted)]"
                    }`}
                  >
                    {isDone ? (
                      <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400" />
                    ) : (
                      <Square className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gabay-neutral)]" />
                    )}
                    <div className="flex-1">
                      <span
                        className={`font-semibold ${
                          isDone
                            ? "line-through text-[var(--gabay-neutral)]"
                            : "text-[var(--gabay-text)]"
                        }`}
                      >
                        {item.label}
                      </span>
                      {item.notes && (
                        <p className="mt-0.5 text-[11px] text-[var(--gabay-neutral)]">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Step-by-Step Guide */}
          <section className="mt-6">
            <h2 className="text-sm font-bold text-[var(--gabay-text)]">
              2. Step-by-Step Official Procedure
            </h2>
            <ol className="mt-2.5 space-y-2.5">
              {resource.steps.map((step) => (
                <li
                  key={step.stepNumber}
                  className="rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface-muted)] p-3.5 text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#17365D] font-mono text-[11px] font-bold text-white">
                      {step.stepNumber}
                    </span>
                    <div>
                      <h3 className="font-bold text-[var(--gabay-text)]">
                        {step.title}
                      </h3>
                      <p className="mt-1 leading-relaxed text-[var(--gabay-neutral)]">
                        {step.description}
                      </p>
                      {step.officialPortalLink && (
                        <a
                          href={step.officialPortalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 font-semibold text-[#087F8C] underline dark:text-teal-300"
                        >
                          <span>Open Official Portal: {step.officialPortalLink}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Responsible Agency Info */}
          {org && (
            <section className="mt-6 rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface-muted)] p-3.5 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[var(--gabay-text)]">
                <Building2 className="h-4 w-4 text-[#17365D] dark:text-teal-300" />
                <span>
                  Responsible Agency: {org.name} ({org.acronym})
                </span>
              </div>
              <p className="mt-1 text-[var(--gabay-neutral)]">{org.description}</p>
            </section>
          )}

          {/* Module Trust Disclaimer */}
          <div className="mt-5 flex items-start gap-2 rounded border border-amber-200 bg-amber-50/70 p-3 text-[11px] text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400" />
            <span>{meta.disclaimer}</span>
          </div>

          <SourceCitationBar
            sourceName={resource.sourceName}
            sourceUrl={resource.sourceUrl}
            regionName={resource.regionName}
            lastVerifiedAt={resource.lastVerifiedAt}
            verificationStatus={resource.verificationStatus}
            targetId={resource.id}
            targetTitle={resource.title}
            targetType="resource"
            shareHref={`/${module}/${resource.slug}`}
          />
        </article>
      </div>
    );
  }

  // 2. Render OpportunityRecord Detail (Trabaho / Aral)
  if (opportunity) {
    const saved = isBookmarked(opportunity.id);
    return (
      <div className="mx-auto max-w-4xl px-3 py-6 sm:px-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <Link
            href={meta.href}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#17365D] hover:underline dark:text-teal-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Back to {meta.label}</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              const added = toggleBookmark({
                targetType: "opportunity",
                targetId: opportunity.id,
                targetSlug: opportunity.slug,
                targetTitle: opportunity.title,
                targetModule: module,
                href: `/${module}/${opportunity.slug}`,
              });
              showToast({
                title: added ? "Opportunity Saved" : "Removed from Bookmarks",
                description: opportunity.title,
                variant: "info",
              });
            }}
            className="inline-flex items-center gap-1.5 rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--gabay-text)] hover:bg-[var(--gabay-surface-muted)]"
          >
            {saved ? (
              <>
                <BookmarkCheck className="h-3.5 w-3.5 text-[#17365D] dark:text-teal-300" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Bookmark className="h-3.5 w-3.5" />
                <span>Save Opportunity</span>
              </>
            )}
          </button>
        </div>

        <article className="rounded-md border border-[var(--gabay-border)] bg-[var(--gabay-surface)] p-5 shadow-2xs sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-[#17365D] px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-white">
              {opportunity.type}
            </span>
            <span className="text-xs font-semibold text-[var(--gabay-neutral)]">
              {opportunity.organizationName}
            </span>
            <VerificationBadge
              status={opportunity.verificationStatus}
              lastVerifiedAt={opportunity.lastVerifiedAt}
              deadlineOrExpiresAt={opportunity.deadlineAt}
            />
          </div>

          <h1 className="gabay-page-title mt-2 text-[var(--gabay-text)]">
            {opportunity.title}
          </h1>
          <p className="mt-1.5 text-xs leading-relaxed text-[var(--gabay-neutral)]">
            {opportunity.description}
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface-muted)] p-3.5 text-xs sm:grid-cols-3">
            <div>
              <span className="font-semibold text-[var(--gabay-neutral)]">
                Compensation / Grant Benefit
              </span>
              <p className="mt-1 font-semibold text-emerald-800 dark:text-emerald-300">
                {opportunity.compensationOrBenefit}
              </p>
            </div>
            <div>
              <span className="font-semibold text-[var(--gabay-neutral)]">
                Schedule / Modality
              </span>
              <p className="mt-1 font-semibold text-[var(--gabay-text)]">
                {opportunity.employmentType}{" "}
                {opportunity.isRemote ? "(Online / Remote Available)" : ""}
              </p>
            </div>
            <div>
              <span className="font-semibold text-[var(--gabay-neutral)]">
                Location & Deadline
              </span>
              <p className="mt-1 font-semibold text-[var(--gabay-text)]">
                {opportunity.regionName} ·{" "}
                {opportunity.deadlineAt
                  ? `Deadline: ${opportunity.deadlineAt}`
                  : "Rolling Official Portal Intake"}
              </p>
            </div>
          </div>

          <section className="mt-5">
            <h2 className="text-sm font-bold text-[var(--gabay-text)]">
              Qualifications & Documentary Requirements
            </h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs text-[var(--gabay-text)]">
              {opportunity.requirements.map((req) => (
                <li key={req}>{req}</li>
              ))}
            </ul>
          </section>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href={opportunity.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded bg-[#17365D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#102847]"
            >
              <span>Apply / Enroll on Official Source Portal</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="mt-5 flex items-start gap-2 rounded border border-amber-200 bg-amber-50/70 p-3 text-[11px] text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400" />
            <span>{meta.disclaimer}</span>
          </div>

          <SourceCitationBar
            sourceName={opportunity.sourceName}
            sourceUrl={opportunity.sourceUrl}
            regionName={opportunity.regionName}
            lastVerifiedAt={opportunity.lastVerifiedAt}
            verificationStatus={opportunity.verificationStatus}
            targetId={opportunity.id}
            targetTitle={opportunity.title}
            targetType="opportunity"
            shareHref={`/${module}/${opportunity.slug}`}
            deadlineOrExpiresAt={opportunity.deadlineAt}
          />
        </article>
      </div>
    );
  }

  // 3. Render AssistanceProgramRecord Detail (Pera)
  if (assistance) {
    const saved = isBookmarked(assistance.id);
    return (
      <div className="mx-auto max-w-4xl px-3 py-6 sm:px-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <Link
            href={meta.href}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#17365D] hover:underline dark:text-teal-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Back to {meta.label}</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              const added = toggleBookmark({
                targetType: "assistance_program",
                targetId: assistance.id,
                targetSlug: assistance.slug,
                targetTitle: assistance.programName,
                targetModule: "pera",
                href: `/pera/${assistance.slug}`,
              });
              showToast({
                title: added ? "Program Saved" : "Removed from Bookmarks",
                description: assistance.programName,
                variant: "info",
              });
            }}
            className="inline-flex items-center gap-1.5 rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--gabay-text)] hover:bg-[var(--gabay-surface-muted)]"
          >
            {saved ? (
              <>
                <BookmarkCheck className="h-3.5 w-3.5 text-[#17365D] dark:text-teal-300" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Bookmark className="h-3.5 w-3.5" />
                <span>Save Program</span>
              </>
            )}
          </button>
        </div>

        <article className="rounded-md border border-[var(--gabay-border)] bg-[var(--gabay-surface)] p-5 shadow-2xs sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-emerald-100 px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-emerald-900">
              {assistance.programType.replace("_", " ")}
            </span>
            <span className="text-xs font-semibold text-[var(--gabay-neutral)]">
              {assistance.organizationName}
            </span>
            <VerificationBadge
              status={assistance.verificationStatus}
              lastVerifiedAt={assistance.lastVerifiedAt}
            />
          </div>

          <h1 className="gabay-page-title mt-2 text-[var(--gabay-text)]">
            {assistance.programName}
          </h1>
          <p className="mt-1.5 text-xs leading-relaxed text-[var(--gabay-neutral)]">
            {assistance.description}
          </p>

          <div className="mt-4 rounded border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs text-emerald-950 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">
            <strong>Verified Benefit Coverage:</strong>{" "}
            {assistance.benefitSummary}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <section className="rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface-muted)] p-4 text-xs">
              <h2 className="font-bold text-[var(--gabay-text)]">
                1. Who Is Eligible?
              </h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-4 text-[var(--gabay-text)]">
                {assistance.eligibilityCriteria.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </section>

            <section className="rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface-muted)] p-4 text-xs">
              <h2 className="font-bold text-[var(--gabay-text)]">
                2. Required Documents
              </h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-4 text-[var(--gabay-text)]">
                {assistance.requiredDocuments.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </section>
          </div>

          <section className="mt-5 rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface-muted)] p-4 text-xs">
            <h2 className="font-bold text-[var(--gabay-text)]">
              3. Step-by-Step Application Procedure
            </h2>
            <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-[var(--gabay-text)]">
              {assistance.howToApply.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </section>

          <div className="mt-5 flex items-start gap-2 rounded border border-amber-200 bg-amber-50/70 p-3 text-[11px] text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400" />
            <span>{meta.disclaimer}</span>
          </div>

          <SourceCitationBar
            sourceName={assistance.sourceName}
            sourceUrl={assistance.sourceUrl}
            regionName={assistance.regionName}
            lastVerifiedAt={assistance.lastVerifiedAt}
            verificationStatus={assistance.verificationStatus}
            targetId={assistance.id}
            targetTitle={assistance.programName}
            targetType="assistance_program"
            shareHref={`/pera/${assistance.slug}`}
          />
        </article>
      </div>
    );
  }

  // 4. Render BayanihanPostRecord Detail
  if (bayanihan) {
    return (
      <div className="mx-auto max-w-4xl px-3 py-6 sm:px-6">
        <div className="mb-4">
          <Link
            href={meta.href}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#17365D] hover:underline dark:text-teal-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Back to {meta.label}</span>
          </Link>
        </div>

        <article className="rounded-md border border-[var(--gabay-border)] bg-[var(--gabay-surface)] p-5 shadow-2xs sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-[#17365D] px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-white">
              {bayanihan.postType.replace("_", " ")}
            </span>
            <span className="text-xs font-semibold text-[var(--gabay-neutral)]">
              {bayanihan.organizationName} · {bayanihan.cityMunicipality},{" "}
              {bayanihan.regionCode}
            </span>
            <VerificationBadge
              status={bayanihan.verificationStatus}
              lastVerifiedAt={bayanihan.lastVerifiedAt}
            />
          </div>

          <h1 className="gabay-page-title mt-2 text-[var(--gabay-text)]">
            {bayanihan.title}
          </h1>
          <p className="mt-1.5 text-xs leading-relaxed text-[var(--gabay-neutral)]">
            {bayanihan.summary}
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface-muted)] p-4 text-xs sm:grid-cols-2">
            <div>
              <strong className="text-[var(--gabay-text)]">
                Coordination / Drop-Off Point:
              </strong>
              <p className="mt-1 text-[var(--gabay-neutral)]">
                {bayanihan.dropOffOrMeetingPoint}
              </p>
            </div>
            <div>
              <strong className="text-[var(--gabay-text)]">
                Verified Contact Channel:
              </strong>
              <p className="mt-1 font-mono text-[var(--gabay-neutral)]">
                {bayanihan.contactChannel}
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-2 rounded border border-amber-200 bg-amber-50/70 p-3 text-[11px] text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400" />
            <span>{meta.disclaimer}</span>
          </div>

          <SourceCitationBar
            sourceName={bayanihan.sourceName}
            sourceUrl={bayanihan.sourceUrl}
            regionName={bayanihan.regionName}
            lastVerifiedAt={bayanihan.lastVerifiedAt}
            verificationStatus={bayanihan.verificationStatus}
            targetId={bayanihan.id}
            targetTitle={bayanihan.title}
            targetType="bayanihan_post"
            shareHref={`/bayanihan/${bayanihan.slug}`}
          />
        </article>
      </div>
    );
  }

  return null;
}
