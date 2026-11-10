"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  Flag,
  CheckCircle2,
  AlertCircle,
  Share2,
  Building2,
} from "lucide-react";
import type { VerificationStatus } from "@/types/database";
import { reportSubmissionSchema } from "@/lib/validations/schemas";
import { useCitizenState } from "@/components/providers/citizen-state-provider";
import { useThemeAndToast } from "@/components/providers/theme-provider";
import {
  Button,
  CompactDialog,
  FormField,
  Input,
  SelectDropdown,
  StatusIndicator,
} from "@/components/ui/design-system";

/**
 * Evaluates whether a resource or opportunity record is fresh, stale (>180 days since
 * last verification), or past its application/advisory expiration date.
 * Ensures stale or expired information is never silently presented as current.
 */
export function evaluateRecordFreshness(
  lastVerifiedAt?: string,
  deadlineOrExpiresAt?: string,
  referenceDate: Date = new Date("2026-11-10T00:00:00Z")
): {
  isExpired: boolean;
  isStale: boolean;
  daysSinceVerified: number;
  sourceClassification: "official_gov_ph" | "secondary_partner";
} {
  let isExpired = false;
  if (deadlineOrExpiresAt) {
    const exp = new Date(deadlineOrExpiresAt);
    if (!Number.isNaN(exp.getTime()) && exp.getTime() < referenceDate.getTime()) {
      isExpired = true;
    }
  }

  let daysSinceVerified = 0;
  let isStale = false;
  if (lastVerifiedAt) {
    const ver = new Date(lastVerifiedAt);
    if (!Number.isNaN(ver.getTime())) {
      daysSinceVerified = Math.floor(
        (referenceDate.getTime() - ver.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceVerified > 270) {
        isStale = true;
      }
    }
  }

  return {
    isExpired,
    isStale,
    daysSinceVerified,
    sourceClassification: "official_gov_ph",
  };
}

export function classifySourceUrl(
  sourceUrl: string
): "official_gov_ph" | "secondary_partner" {
  try {
    const parsed = new URL(sourceUrl);
    if (
      parsed.hostname.endsWith(".gov.ph") ||
      parsed.hostname === "gov.ph" ||
      parsed.hostname.endsWith(".edu.ph")
    ) {
      return "official_gov_ph";
    }
  } catch {
    // ignore malformed URL
  }
  return "secondary_partner";
}

export function resolveEffectiveVerificationStatus(
  status: VerificationStatus,
  lastVerifiedAt?: string,
  deadlineOrExpiresAt?: string
): VerificationStatus {
  const { isExpired, isStale } = evaluateRecordFreshness(
    lastVerifiedAt,
    deadlineOrExpiresAt
  );
  if (isExpired) return "archived";
  if (status === "officially_verified" && isStale) return "needs_review";
  return status;
}

export function VerificationBadge({
  status,
  lastVerifiedAt,
  deadlineOrExpiresAt,
}: {
  status: VerificationStatus;
  lastVerifiedAt?: string;
  deadlineOrExpiresAt?: string;
}) {
  const effectiveStatus = resolveEffectiveVerificationStatus(
    status,
    lastVerifiedAt,
    deadlineOrExpiresAt
  );
  return (
    <StatusIndicator status={effectiveStatus} lastVerifiedAt={lastVerifiedAt} />
  );
}

export function SourceCitationBar({
  sourceName,
  sourceUrl,
  regionName,
  lastVerifiedAt,
  verificationStatus,
  targetId,
  targetTitle,
  targetType = "resource",
  shareHref,
  deadlineOrExpiresAt,
}: {
  sourceName: string;
  sourceUrl: string;
  regionName: string;
  lastVerifiedAt: string;
  verificationStatus: VerificationStatus;
  targetId: string;
  targetTitle: string;
  targetType?:
    | "resource"
    | "opportunity"
    | "assistance_program"
    | "organization"
    | "bayanihan_post";
  shareHref?: string;
  deadlineOrExpiresAt?: string;
}) {
  const [reportOpen, setReportOpen] = useState(false);
  const { showToast } = useThemeAndToast();
  const sourceKind = classifySourceUrl(sourceUrl);

  const handleShare = async () => {
    const targetPath =
      shareHref ||
      (typeof window !== "undefined" ? window.location.href : sourceUrl);
    const fullUrl =
      typeof window !== "undefined" && targetPath.startsWith("/")
        ? `${window.location.origin}${targetPath}`
        : targetPath;

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(fullUrl);
      }
      showToast({
        title: "Resource link copied to clipboard",
        description: `${targetTitle} (${fullUrl})`,
        variant: "info",
      });
    } catch {
      showToast({
        title: "Share link ready",
        description: fullUrl,
        variant: "info",
      });
    }
  };

  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--gabay-border)] pt-2.5 text-[12px] text-[var(--gabay-neutral)]">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <VerificationBadge
          status={verificationStatus}
          lastVerifiedAt={lastVerifiedAt}
          deadlineOrExpiresAt={deadlineOrExpiresAt}
        />
        <span className="inline-flex items-center gap-1 rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface-muted)] px-1.5 py-0.5 text-[11px] font-semibold text-[var(--gabay-text)]">
          <Building2 className="h-3 w-3 text-[#17365D] dark:text-teal-300" aria-hidden="true" />
          <span>
            {sourceKind === "official_gov_ph"
              ? "Official .gov.ph Source"
              : "Verified Humanitarian / Partner Source"}
          </span>
        </span>
        <span>
          Source:{" "}
          <strong className="font-semibold text-[var(--gabay-text)]">
            {sourceName}
          </strong>
        </span>
        <span>Coverage: {regionName}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-[#087F8C] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C] dark:text-teal-300"
        >
          <span>Official Source</span>
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>

        <button
          type="button"
          onClick={handleShare}
          className="gabay-interactive inline-flex items-center gap-1 rounded px-2 py-1 text-[var(--gabay-neutral)] hover:bg-[var(--gabay-surface-muted)] hover:text-[var(--gabay-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]"
          aria-label={`Share ${targetTitle}`}
        >
          <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Share</span>
        </button>

        <button
          type="button"
          onClick={() => setReportOpen(true)}
          className="gabay-interactive inline-flex items-center gap-1 rounded px-2 py-1 text-[var(--gabay-neutral)] hover:bg-[var(--gabay-surface-muted)] hover:text-[var(--gabay-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]"
        >
          <Flag className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Report Issue</span>
        </button>
      </div>

      <ReportIssueDialog
        open={reportOpen}
        targetId={targetId}
        targetTitle={targetTitle}
        targetType={targetType}
        onClose={() => setReportOpen(false)}
      />
    </div>
  );
}

export function ReportIssueDialog({
  open = true,
  targetId,
  targetTitle,
  targetType,
  onClose,
}: {
  open?: boolean;
  targetId: string;
  targetTitle: string;
  targetType:
    | "resource"
    | "opportunity"
    | "assistance_program"
    | "organization"
    | "bayanihan_post";
  onClose: () => void;
}) {
  const { submitPublicReport } = useCitizenState();
  const { showToast } = useThemeAndToast();
  const [reason, setReason] = useState<
    | "outdated_info"
    | "incorrect_requirements"
    | "broken_link"
    | "suspected_scam"
    | "abusive_content"
    | "other"
  >("outdated_info");
  const [details, setDetails] = useState("");
  const [officialReferenceUrl, setOfficialReferenceUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const parsed = reportSubmissionSchema.safeParse({
      targetType,
      targetId,
      targetTitle,
      reason,
      details,
      officialReferenceUrl,
    });

    if (!parsed.success) {
      setErrorMsg(
        parsed.error.issues[0]?.message || "Please check your report details."
      );
      return;
    }

    const created = submitPublicReport({
      targetType: parsed.data.targetType,
      targetId: parsed.data.targetId,
      targetTitle: parsed.data.targetTitle,
      reason: parsed.data.reason,
      details: parsed.data.details,
      officialReferenceUrl: parsed.data.officialReferenceUrl || undefined,
    });

    setSubmittedId(created.id);
    showToast({
      title: "Report submitted for verification",
      description: `Reference ID: ${created.id}. Thank you for keeping GabayPH accurate.`,
      variant: "success",
    });
  };

  return (
    <CompactDialog
      open={open}
      onClose={onClose}
      title="Report Outdated or Incorrect Information"
      subtitle={`Record: ${targetTitle}`}
    >
      {submittedId ? (
        <div className="space-y-3 rounded-md border border-[#16A36A]/30 bg-[#16A36A]/10 p-3.5 text-slate-900">
          <div className="flex items-center gap-2 font-semibold text-[#065F46]">
            <CheckCircle2
              className="h-4 w-4 text-[#16A36A]"
              aria-hidden="true"
            />
            <span>Thank you. Your report has been logged for review.</span>
          </div>
          <p className="text-[12px] text-slate-700">
            Reference ID: <code className="font-mono font-bold">{submittedId}</code>.
            Our content verification moderators will check the official agency circular and update this entry.
          </p>
          <Button variant="primary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {errorMsg && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-md border border-[#D94B4B]/40 bg-[#D94B4B]/10 p-2.5 text-[12px] text-[#991B1B]"
            >
              <AlertCircle
                className="h-4 w-4 shrink-0 text-[#D94B4B]"
                aria-hidden="true"
              />
              <span>{errorMsg}</span>
            </div>
          )}

          <FormField id="report-reason" label="What is the issue?">
            <SelectDropdown
              id="report-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value as typeof reason)}
            >
              <option value="outdated_info">
                Outdated fees, schedule, or rules
              </option>
              <option value="incorrect_requirements">
                Incorrect documentary requirements
              </option>
              <option value="broken_link">
                Broken or changed official .gov.ph link
              </option>
              <option value="suspected_scam">
                Suspected scam, fixer, or unauthorized fee
              </option>
              <option value="abusive_content">
                Inappropriate or misleading post
              </option>
              <option value="other">Other correction</option>
            </SelectDropdown>
          </FormField>

          <FormField
            id="report-details"
            label="Correction Details (minimum 15 characters)"
          >
            <textarea
              id="report-details"
              rows={3}
              required
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe what changed (e.g., new memorandum circular, updated fee, or relocated office)..."
              className="gabay-interactive w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-900 placeholder:text-[#64748B] focus:border-[#087F8C] focus:outline-none focus:ring-2 focus:ring-[#087F8C]/20"
            />
          </FormField>

          <FormField
            id="report-ref-url"
            label="Official Reference URL (Optional)"
            hint="Provide the official .gov.ph link or announcement if available."
          >
            <Input
              id="report-ref-url"
              type="url"
              value={officialReferenceUrl}
              onChange={(e) => setOfficialReferenceUrl(e.target.value)}
              placeholder="https://..."
            />
          </FormField>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Submit Report
            </Button>
          </div>
        </form>
      )}
    </CompactDialog>
  );
}
