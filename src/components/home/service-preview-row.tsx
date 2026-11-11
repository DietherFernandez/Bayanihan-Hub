import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ResourceRecord } from "@/types/database";

/**
 * Derives a compact fee badge from the verified free-text fee summary.
 * Returns null when no reliable figure can be extracted (never guesses).
 */
export function compactFeeLabel(feesSummary?: string | null): string | null {
  if (!feesSummary) return null;
  const phpMatch = /(?:PHP|₱)\s?([\d,]+(?:\.\d+)?)/i.exec(feesSummary);
  const freeIdx = feesSummary.search(/\bfree\b/i);
  const phpIdx = phpMatch ? phpMatch.index : -1;
  if (phpMatch && (freeIdx === -1 || phpIdx < freeIdx)) {
    const amount = Number(phpMatch[1].replace(/,/g, ""));
    if (amount > 0) return `₱${amount.toLocaleString("en-PH")}`;
  }
  if (freeIdx !== -1) return "Free";
  return null;
}

/** Derives a compact processing-time badge from the verified free-text summary. */
export function compactTimeLabel(processingTime?: string | null): string | null {
  if (!processingTime) return null;
  const m =
    /(\d+(?:\s?[–-]\s?\d+)?)\s*(minutes?|hours?|working days?|days?)/i.exec(
      processingTime
    );
  if (m) {
    const unit = m[2].toLowerCase();
    const short = unit.startsWith("minute")
      ? "min"
      : unit.startsWith("hour")
        ? "hr"
        : unit.startsWith("working")
          ? "working days"
          : "days";
    return `${m[1].replace(/\s/g, "")} ${short}`;
  }
  if (/instant/i.test(processingTime)) return "Instant";
  if (/same day/i.test(processingTime)) return "Same day";
  return null;
}

export function ServicePreviewRow({ resource }: { resource: ResourceRecord }) {
  const fee = compactFeeLabel(resource.feesSummary);
  const time = compactTimeLabel(resource.processingTime);
  return (
    <Link
      href={`/${resource.module}/${resource.slug}`}
      className="flex min-h-[64px] items-center gap-3 px-4 py-3 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#17365D]"
    >
      <span className="inline-flex h-7 min-w-[52px] shrink-0 items-center justify-center rounded-md bg-[#17365D]/10 px-2 text-[11px] font-bold tracking-wide text-[#17365D]">
        {resource.organizationAcronym}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-semibold text-slate-900">
          {resource.title}
        </span>
        {(fee || time) && (
          <span className="mt-1 flex flex-wrap gap-1.5">
            {fee && (
              <span className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] font-semibold text-slate-700">
                {fee}
              </span>
            )}
            {time && (
              <span className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] font-medium text-slate-600">
                {time}
              </span>
            )}
          </span>
        )}
      </span>
      <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
    </Link>
  );
}
