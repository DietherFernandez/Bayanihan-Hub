"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Clock,
  Archive,
  AlertCircle,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Inbox,
  RotateCcw,
  FileCheck2,
  Briefcase,
  Wallet,
  HeartHandshake,
  GraduationCap,
  ShieldAlert,
} from "lucide-react";
import { cn, formatVerifiedDate } from "@/lib/utils";
import type {
  ModuleType,
  OpportunityRecord,
  ResourceRecord,
  VerificationStatus,
} from "@/types/database";

/* ============================================================================
   1. BUTTONS
   ============================================================================ */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "teal" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "bg-[#17365D] text-white hover:bg-[#102847] border border-transparent focus-visible:ring-[#087F8C]",
    teal: "bg-[#087F8C] text-white hover:bg-[#06636D] border border-transparent focus-visible:ring-[#17365D]",
    secondary:
      "bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-200 focus-visible:ring-[#087F8C]",
    outline:
      "bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 focus-visible:ring-[#087F8C]",
    danger:
      "bg-[#D94B4B] text-white hover:bg-red-700 border border-transparent focus-visible:ring-red-700",
    ghost:
      "bg-transparent text-slate-700 hover:bg-slate-100 border border-transparent focus-visible:ring-[#087F8C]",
  };

  const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "min-h-[34px] px-2.5 py-1 text-xs",
    md: "min-h-[40px] px-3.5 py-2 text-[13px]",
    lg: "min-h-[44px] px-4 py-2.5 text-sm",
  };

  return (
    <button
      className={cn(
        "gabay-interactive inline-flex items-center justify-center gap-1.5 rounded-md font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/* ============================================================================
   2. FORMS & DROPDOWNS (Inputs, Selects, Textareas with Inline Validation)
   ============================================================================ */
export function FormField({
  id,
  label,
  hint,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string | null;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="gabay-label block text-slate-800">
        <span>{label}</span>
        {required && (
          <span className="ml-1 text-[#D94B4B]" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p className="text-[12px] text-[#64748B]">{hint}</p>
      )}
      {error && (
        <p
          role="alert"
          className="flex items-center gap-1 text-[12px] font-medium text-[#D94B4B]"
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

export function Input({
  className,
  hasError,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }) {
  return (
    <input
      className={cn(
        "gabay-interactive min-h-[40px] w-full rounded-md border bg-white px-3 py-2 text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2",
        hasError
          ? "border-[#D94B4B] focus:border-[#D94B4B] focus:ring-[#D94B4B]/20"
          : "border-slate-300 focus:border-[#087F8C] focus:ring-[#087F8C]/20",
        className
      )}
      {...props}
    />
  );
}

export function SelectDropdown({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "gabay-interactive min-h-[40px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-[13px] font-medium text-slate-900 focus:border-[#087F8C] focus:outline-none focus:ring-2 focus:ring-[#087F8C]/20",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

/* ============================================================================
   3. STATUS INDICATORS
   ============================================================================ */
export function StatusIndicator({
  status,
  lastVerifiedAt,
}: {
  status: VerificationStatus;
  lastVerifiedAt?: string;
}) {
  if (status === "officially_verified") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-[#16A36A]/30 bg-[#16A36A]/10 px-2 py-0.5 text-[12px] font-semibold text-[#065F46]">
        <ShieldCheck className="h-3.5 w-3.5 text-[#16A36A]" aria-hidden="true" />
        <span>Officially verified</span>
        {lastVerifiedAt && (
          <span className="font-normal opacity-85">
            · {formatVerifiedDate(lastVerifiedAt)}
          </span>
        )}
      </span>
    );
  }

  if (status === "verification_pending") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-[#D99A28]/40 bg-[#D99A28]/10 px-2 py-0.5 text-[12px] font-semibold text-[#92400E]">
        <Clock className="h-3.5 w-3.5 text-[#D99A28]" aria-hidden="true" />
        <span>Pending verification</span>
      </span>
    );
  }

  if (status === "needs_review") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-400/50 bg-amber-50 px-2 py-0.5 text-[12px] font-semibold text-amber-900">
        <Clock className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />
        <span>Needs review (Re-verification due)</span>
        {lastVerifiedAt && (
          <span className="font-normal opacity-85">
            · Last checked {formatVerifiedDate(lastVerifiedAt)}
          </span>
        )}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-slate-100 px-2 py-0.5 text-[12px] font-semibold text-[#64748B]">
      <Archive className="h-3.5 w-3.5 text-[#64748B]" aria-hidden="true" />
      <span>Archived or outdated</span>
    </span>
  );
}

/* ============================================================================
   4. SERVICE CATEGORY SHORTCUTS (Mobile Two-Column Compact Grid)
   ============================================================================ */
export interface ServiceCategoryShortcutItem {
  code: string;
  name: string;
  href: string;
  summary: string;
  highlights: string[];
}

const MODULE_ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  SERBISYO: FileCheck2,
  TRABAHO: Briefcase,
  PERA: Wallet,
  BAYANIHAN: HeartHandshake,
  ARAL: GraduationCap,
  KALIGTASAN: ShieldAlert,
};

export function ServiceCategoryShortcuts({
  items,
}: {
  items: ServiceCategoryShortcutItem[];
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 lg:grid-cols-3">
      {items.map((mod) => {
        const Icon = MODULE_ICON_MAP[mod.code] || FileCheck2;
        return (
          <div
            key={mod.code}
            className="gabay-interactive flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-[#087F8C] sm:p-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <Link
                  href={mod.href}
                  className="group inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#17365D]/15 bg-[#17365D]/8 text-[#17365D]">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-[15px] font-bold tracking-tight text-slate-900 group-hover:text-[#17365D] group-hover:underline">
                    {mod.name}
                  </span>
                </Link>
              </div>
              <p className="mt-2 line-clamp-3 text-[13px] leading-snug text-slate-600 sm:line-clamp-none">
                {mod.summary}
              </p>
            </div>

            <div className="mt-3 hidden flex-wrap gap-1 border-t border-slate-100 pt-2.5 sm:flex">
              {mod.highlights.slice(0, 3).map((tag) => (
                <Link
                  key={tag}
                  href={mod.href}
                  className="inline-flex items-center gap-1 rounded border border-slate-200 bg-[#F7F9FC] px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:border-[#087F8C] hover:text-[#087F8C]"
                >
                  <CheckCircle2
                    className="h-3 w-3 text-[#16A36A]"
                    aria-hidden="true"
                  />
                  <span>{tag}</span>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================================
   5. RESOURCE LISTING ROW & OPPORTUNITY LISTING ROW
   ============================================================================ */
export function ResourceListingRow({
  resource,
  isSaved,
  onToggleSave,
}: {
  resource: ResourceRecord;
  isSaved?: boolean;
  onToggleSave?: () => void;
}) {
  return (
    <div className="gabay-interactive p-3.5 hover:bg-slate-50/80 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="rounded bg-[#17365D]/10 px-2 py-0.5 font-mono text-[11px] font-bold text-[#17365D]">
            {resource.organizationAcronym}
          </span>
          <StatusIndicator
            status={resource.verificationStatus}
            lastVerifiedAt={resource.lastVerifiedAt}
          />
        </div>

        {onToggleSave && (
          <button
            type="button"
            onClick={onToggleSave}
            className="gabay-interactive inline-flex min-h-[32px] items-center gap-1 rounded border border-slate-200 bg-white px-2.5 py-1 text-[12px] font-medium text-slate-700 hover:border-[#087F8C]"
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="h-3.5 w-3.5 text-[#16A36A]" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Bookmark className="h-3.5 w-3.5" />
                <span>Save</span>
              </>
            )}
          </button>
        )}
      </div>

      <Link
        href={`/${resource.module}?item=${encodeURIComponent(resource.slug)}`}
        className="mt-1.5 block text-[15px] font-semibold text-[#17365D] hover:text-[#087F8C] hover:underline"
      >
        {resource.title}
      </Link>
      <p className="mt-1 text-[13px] text-slate-600">{resource.summary}</p>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[12px] text-[#64748B]">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <span>
            <strong className="text-slate-700">Fee:</strong>{" "}
            {resource.feesSummary}
          </span>
          <span>
            <strong className="text-slate-700">Processing:</strong>{" "}
            {resource.processingTime}
          </span>
        </div>
        <a
          href={resource.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-[#087F8C] hover:underline"
        >
          <span>{resource.sourceName}</span>
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

export function OpportunityListingRow({
  opportunity,
}: {
  opportunity: OpportunityRecord;
}) {
  const targetModule: ModuleType =
    opportunity.type === "scholarship" ? "aral" : "trabaho";
  return (
    <div className="gabay-interactive p-3.5 hover:bg-slate-50/80">
      <div className="flex items-center justify-between gap-2 text-[12px]">
        <span className="font-semibold uppercase tracking-wide text-[#087F8C]">
          {opportunity.type} · {opportunity.organizationName}
        </span>
        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] font-medium text-slate-700">
          {opportunity.regionCode}
        </span>
      </div>
      <Link
        href={`/${targetModule}?item=${encodeURIComponent(opportunity.slug)}`}
        className="mt-1 block text-[14px] font-semibold text-[#17365D] hover:text-[#087F8C] hover:underline"
      >
        {opportunity.title}
      </Link>
      <p className="mt-0.5 text-[13px] text-slate-600">
        {opportunity.compensationOrBenefit}
      </p>
    </div>
  );
}

/* ============================================================================
   6. DIALOGS & DRAWERS (Compact Centered Dialog & Slide-over Drawer)
   ============================================================================ */
export function CompactDialog({
  open,
  title,
  subtitle,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="compact-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[1px]"
    >
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-xl transition-all duration-180">
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <h2
              id="compact-dialog-title"
              className="text-[16px] font-semibold text-slate-900"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 text-[12px] text-[#64748B]">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

export function CompactDrawer({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/40"
    >
      <div className="flex h-full w-full max-w-xs flex-col border-l border-slate-200 bg-white p-4 shadow-xl transition-transform duration-200">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="text-[15px] font-bold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-3 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

/* ============================================================================
   7. EMPTY STATES & SKELETON LOADERS
   ============================================================================ */
export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-[#64748B]">
        <Inbox className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="mt-3 text-[16px] font-semibold text-slate-900">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-[13px] text-[#64748B]">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button variant="primary" size="md" onClick={onAction}>
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{actionLabel}</span>
          </Button>
        </div>
      )}
    </div>
  );
}

export function SkeletonLoader({ rows = 3 }: { rows?: number }) {
  return (
    <div
      role="status"
      aria-label="Loading verified content"
      className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white"
    >
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="animate-pulse space-y-2.5 p-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 rounded bg-slate-200" />
            <div className="h-4 w-32 rounded bg-slate-100" />
          </div>
          <div className="h-5 w-3/4 rounded bg-slate-200" />
          <div className="h-3.5 w-full rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

/* ============================================================================
   8. PAGINATION & FILTER PILLS
   ============================================================================ */
export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, currentPage * pageSize);

  return (
    <nav
      aria-label="Directory Pagination"
      className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[13px]"
    >
      <span className="text-[#64748B]">
        Showing <strong className="text-slate-900">{startItem}</strong>–
        <strong className="text-slate-900">{endItem}</strong> of{" "}
        <strong className="text-slate-900">{totalItems}</strong> records
      </span>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Prev</span>
        </Button>

        {Array.from({ length: totalPages }).map((_, i) => {
          const page = i + 1;
          const active = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "gabay-interactive min-h-[34px] min-w-[34px] rounded-md border px-2.5 text-xs font-semibold",
                active
                  ? "border-[#17365D] bg-[#17365D] text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              )}
            >
              {page}
            </button>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <span>Next</span>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
      </div>
    </nav>
  );
}

export function FilterBar({
  options,
  activeValue,
  onSelect,
  label = "Filter:",
}: {
  options: { value: string; label: string }[];
  activeValue: string;
  onSelect: (value: string) => void;
  label?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="gabay-label mr-1 text-[#64748B]">{label}</span>
      {options.map((opt) => {
        const active = opt.value === activeValue;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            className={cn(
              "gabay-interactive min-h-[36px] rounded-md border px-3 py-1.5 text-[12.5px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]",
              active
                ? "border-[#17365D] bg-[#17365D] text-white"
                : "border-slate-300 bg-white text-slate-700 hover:border-[#087F8C] hover:text-[#17365D]"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
