import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import type { ResourceRecord } from "@/types/database";
import { formatVerifiedDate } from "@/lib/utils";

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
      title={resource.title}
      className="group -mx-2 flex min-h-[50px] items-center justify-between gap-3 rounded-lg px-2.5 py-2.5 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173B67]"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-700">
            {resource.organizationAcronym}
          </span>
          <span className="truncate text-[13px] font-semibold text-[#172B45] group-hover:text-[#173B67] sm:text-[14px]">
            {resource.title}
          </span>
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-[#64748B] sm:text-[12px]">
          {fee && <span className="font-semibold text-[#16866B]">{fee}</span>}
          {fee && time && <span className="text-slate-300">·</span>}
          {time && <span>{time}</span>}
          <span className="text-slate-300">·</span>
          <span className="inline-flex items-center gap-1 text-slate-400">
            <ShieldCheck className="h-3 w-3 text-[#16866B]" aria-hidden="true" />
            <span>Verified {formatVerifiedDate(resource.lastVerifiedAt)}</span>
          </span>
        </div>
      </div>
      <ChevronRight
        className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#173B67]"
        aria-hidden="true"
      />
    </Link>
  );
}
