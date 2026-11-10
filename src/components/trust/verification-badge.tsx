"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Clock,
  Archive,
  ExternalLink,
  Flag,
  CheckCircle2,
  X,
  AlertCircle,
} from "lucide-react";
import type { VerificationStatus } from "@/types/database";
import { formatVerifiedDate } from "@/lib/utils";
import { reportSubmissionSchema } from "@/lib/validations/schemas";
import { useCitizenState } from "@/components/providers/citizen-state-provider";

export function VerificationBadge({
  status,
  lastVerifiedAt,
}: {
  status: VerificationStatus;
  lastVerifiedAt?: string;
}) {
  if (status === "officially_verified") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-900">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
        <span>Officially verified</span>
        {lastVerifiedAt && (
          <span className="text-emerald-700">
            · {formatVerifiedDate(lastVerifiedAt)}
          </span>
        )}
      </span>
    );
  }

  if (status === "verification_pending") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-900">
        <Clock className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />
        <span>Source available, verification pending</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded border border-slate-300 bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
      <Archive className="h-3.5 w-3.5 text-slate-600" aria-hidden="true" />
      <span>Archived or outdated</span>
    </span>
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
}) {
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-2.5 text-xs text-slate-600">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <VerificationBadge
          status={verificationStatus}
          lastVerifiedAt={lastVerifiedAt}
        />
        <span>
          Source: <strong className="font-medium text-slate-800">{sourceName}</strong>
        </span>
        <span>Coverage: {regionName}</span>
      </div>

      <div className="flex items-center gap-3">
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-[#0B3D91] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B3D91]"
        >
          <span>Official Source</span>
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>

        <button
          type="button"
          onClick={() => setReportOpen(true)}
          className="inline-flex items-center gap-1 rounded px-2 py-1 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B3D91]"
        >
          <Flag className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Report Issue</span>
        </button>
      </div>

      {reportOpen && (
        <ReportIssueDialog
          targetId={targetId}
          targetTitle={targetTitle}
          targetType={targetType}
          onClose={() => setReportOpen(false)}
        />
      )}
    </div>
  );
}

export function ReportIssueDialog({
  targetId,
  targetTitle,
  targetType,
  onClose,
}: {
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
      setErrorMsg(parsed.error.issues[0]?.message || "Please check your input.");
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
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
    >
      <div className="w-full max-w-lg rounded-md border border-slate-200 bg-white p-5 shadow-lg">
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <h2
              id="report-dialog-title"
              className="text-base font-semibold text-slate-900"
            >
              Report Incorrect Information or Suspected Scam
            </h2>
            <p className="mt-0.5 text-xs text-slate-600">
              Item: <span className="font-medium text-slate-800">{targetTitle}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B3D91]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {submittedId ? (
          <div className="py-5 text-sm text-slate-700">
            <div className="flex items-center gap-2 font-semibold text-emerald-800">
              <CheckCircle2 className="h-5 w-5 text-emerald-700" aria-hidden="true" />
              <span>Report Received (Ref #{submittedId})</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Thank you for helping keep GabayPH accurate and trustworthy. Our content verification team will cross-check this entry against official agency sources.
            </p>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded bg-[#0B3D91] px-4 py-2 text-xs font-medium text-white hover:bg-[#082d6b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B3D91]"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
            {errorMsg && (
              <div
                role="alert"
                className="flex items-center gap-2 rounded border border-red-300 bg-red-50 p-2.5 text-red-900"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-red-700" aria-hidden="true" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="report-reason"
                className="block font-medium text-slate-800"
              >
                Reason for Report
              </label>
              <select
                id="report-reason"
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value as typeof reason)
                }
                className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-[#0B3D91] focus:outline-none focus:ring-1 focus:ring-[#0B3D91]"
              >
                <option value="outdated_info">Outdated fee, schedule, or procedure</option>
                <option value="incorrect_requirements">Incorrect document requirements</option>
                <option value="broken_link">Broken official agency link</option>
                <option value="suspected_scam">Suspected job scam or illegal fee</option>
                <option value="abusive_content">Inappropriate or misleading post</option>
                <option value="other">Other correction</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="report-details"
                className="block font-medium text-slate-800"
              >
                What needs to be corrected or investigated? (Required)
              </label>
              <textarea
                id="report-details"
                rows={3}
                required
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe the updated requirement, fee change, or scam warning (minimum 15 characters)..."
                className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-[#0B3D91] focus:outline-none focus:ring-1 focus:ring-[#0B3D91]"
              />
            </div>

            <div>
              <label
                htmlFor="report-ref-url"
                className="block font-medium text-slate-800"
              >
                Official Reference Link (Optional, e.g., .gov.ph advisory URL)
              </label>
              <input
                id="report-ref-url"
                type="url"
                value={officialReferenceUrl}
                onChange={(e) => setOfficialReferenceUrl(e.target.value)}
                placeholder="https://..."
                className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-[#0B3D91] focus:outline-none focus:ring-1 focus:ring-[#0B3D91]"
              />
            </div>

            <div className="rounded border border-slate-200 bg-slate-50 p-2.5 text-[11px] text-slate-600">
              Protected by Cloudflare Turnstile anti-abuse verification. Do not include sensitive personal IDs or passwords in this report.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded bg-[#0B3D91] px-4 py-2 text-xs font-medium text-white hover:bg-[#082d6b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B3D91]"
              >
                Submit Verification Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
