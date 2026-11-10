"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  Flag,
  CheckCircle2,
  AlertCircle,
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

export function VerificationBadge({
  status,
  lastVerifiedAt,
}: {
  status: VerificationStatus;
  lastVerifiedAt?: string;
}) {
  return (
    <StatusIndicator status={status} lastVerifiedAt={lastVerifiedAt} />
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
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-2.5 text-[12px] text-[#64748B]">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <VerificationBadge
          status={verificationStatus}
          lastVerifiedAt={lastVerifiedAt}
        />
        <span>
          Source:{" "}
          <strong className="font-semibold text-slate-800">{sourceName}</strong>
        </span>
        <span>Coverage: {regionName}</span>
      </div>

      <div className="flex items-center gap-3">
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-[#087F8C] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]"
        >
          <span>Official Source</span>
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>

        <button
          type="button"
          onClick={() => setReportOpen(true)}
          className="gabay-interactive inline-flex items-center gap-1 rounded px-2 py-1 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]"
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
    showToast({
      title: `Verification Report #${created.id} Submitted`,
      description:
        "Queued for our Content Verification team to cross-check against official agency records.",
      variant: "success",
    });
  };

  return (
    <CompactDialog
      open={open}
      title="Report Incorrect Information or Scam"
      subtitle={`Record: ${targetTitle}`}
      onClose={onClose}
    >
      {submittedId ? (
        <div className="py-2 text-xs text-slate-700">
          <div className="flex items-center gap-2 font-semibold text-[#16A36A]">
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            <span>Report Received (Ref #{submittedId})</span>
          </div>
          <p className="mt-2 leading-relaxed text-slate-600">
            Thank you for helping keep GabayPH accurate and trustworthy. Our content verification team will cross-check this entry against official agency sources.
          </p>
          <div className="mt-4 flex justify-end">
            <Button variant="primary" size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {errorMsg && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-md border border-[#D94B4B]/40 bg-[#D94B4B]/10 p-2.5 text-[#D94B4B]"
            >
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{errorMsg}</span>
            </div>
          )}

          <FormField id="report-reason" label="Reason for Report" required>
            <SelectDropdown
              id="report-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value as typeof reason)}
            >
              <option value="outdated_info">
                Outdated fee, schedule, or procedure
              </option>
              <option value="incorrect_requirements">
                Incorrect document requirements
              </option>
              <option value="broken_link">Broken official agency link</option>
              <option value="suspected_scam">
                Suspected job scam or illegal fee
              </option>
              <option value="abusive_content">
                Inappropriate or misleading post
              </option>
              <option value="other">Other correction</option>
            </SelectDropdown>
          </FormField>

          <FormField
            id="report-details"
            label="What needs to be corrected or investigated?"
            required
            hint="Minimum 15 characters"
          >
            <textarea
              id="report-details"
              rows={3}
              required
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe the updated requirement, fee change, or scam warning..."
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-[#087F8C] focus:outline-none focus:ring-2 focus:ring-[#087F8C]/20"
            />
          </FormField>

          <FormField
            id="report-ref-url"
            label="Official Reference Link (Optional, e.g., .gov.ph URL)"
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
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
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
