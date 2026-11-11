"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  FileCheck2,
  Printer,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  CheckSquare,
  Square,
  Building2,
  Phone,
  Clock,
  Banknote,
} from "lucide-react";
import {
  VERIFIED_ORGANIZATIONS,
  VERIFIED_RESOURCES,
} from "@/lib/constants/philippine-data";
import { SourceCitationBar, VerificationBadge } from "@/components/trust/verification-badge";
import { CopyButton } from "@/components/ui/copy-button";
import { useCitizenState } from "@/components/providers/citizen-state-provider";

function SerbisyoContent() {
  const searchParams = useSearchParams();
  const initialSlug = searchParams.get("item") || "";
  const serbisyoGuides = VERIFIED_RESOURCES.filter(
    (r) => r.module === "serbisyo"
  );

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [keyword, setKeyword] = useState<string>("");
  const [activeSlug, setActiveSlug] = useState<string>(
    initialSlug || serbisyoGuides[0]?.slug || ""
  );

  const {
    completedChecklistIds,
    toggleChecklistStep,
    toggleBookmark,
    isBookmarked,
  } = useCitizenState();

  const filteredGuides = serbisyoGuides.filter((g) => {
    if (selectedCategory !== "all" && g.categorySlug !== selectedCategory) {
      return false;
    }
    if (!keyword.trim()) return true;
    const hay = `${g.title} ${g.organizationAcronym} ${g.organizationName} ${g.summary}`.toLowerCase();
    return hay.includes(keyword.trim().toLowerCase());
  });

  const selectedGuide =
    filteredGuides.find((g) => g.slug === activeSlug) || filteredGuides[0];

  const handlePrintChecklist = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6">
      {/* Module Header */}
      <div className="mb-6 flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded bg-blue-50 px-2.5 py-0.5 text-xs font-bold uppercase text-[#17365D]">
            <FileCheck2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Module B · Serbisyo</span>
          </div>
          <h1 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Government Service Directory & Interactive Document Checklists
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            Verified requirements, step-by-step application procedures, statutory fees, processing times, and official <code>.gov.ph</code> agency links.
          </p>
        </div>

        <div className="no-print flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrintChecklist}
            className="inline-flex items-center gap-1.5 rounded border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100"
          >
            <Printer className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Print / Save Checklist as PDF</span>
          </button>
        </div>
      </div>

      {/* Category & Keyword Filter Strip */}
      <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">Category:</span>
          {[
            { slug: "all", label: "All Services" },
            {
              slug: "civil-registry-ids",
              label: "Civil Registration & IDs (PSA, NBI, PhilSys)",
            },
            {
              slug: "social-security-health",
              label: "Health & Social Insurance (PhilHealth, SSS)",
            },
            {
              slug: "housing-pagibig",
              label: "Housing (Pag-IBIG)",
            },
            {
              slug: "lgu-business-registration",
              label: "LGU & Business Registration (DTI, BMBE)",
            },
          ].map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={`rounded border px-3 py-1.5 text-xs font-medium ${
                selectedCategory === cat.slug
                  ? "border-[#17365D] bg-[#17365D] text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <input
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search agency or document (e.g., PSA, NBI, DTI)..."
          aria-label="Search government services"
          className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-xs sm:w-64"
        />
      </div>

      {/* Mobile Guide Quick Selector Track (< lg) */}
      <div className="no-print mb-4 lg:hidden">
        <label htmlFor="mobile-guide-selector" className="mb-1.5 block text-xs font-semibold text-slate-700">
          Select Government Service Guide:
        </label>
        <div className="no-scrollbar flex gap-2 overflow-x-auto whitespace-nowrap pb-2">
          {filteredGuides.map((guide) => {
            const isSelected = selectedGuide?.slug === guide.slug;
            return (
              <button
                key={guide.id}
                type="button"
                onClick={() => setActiveSlug(guide.slug)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold shadow-xs transition ${
                  isSelected
                    ? "border-[#17365D] bg-[#17365D] text-white"
                    : "border-slate-200 bg-white text-slate-800 hover:border-slate-300"
                }`}
              >
                <span className={`rounded px-1.5 py-0.2 font-mono text-[10px] font-bold ${
                  isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
                }`}>
                  {guide.organizationAcronym}
                </span>
                <span>{guide.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Master-Detail Split Layout (Clean Cardless Editorial Style) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left List of Services (Desktop Only) */}
        <aside
          aria-label="Government Services List"
          className="no-print hidden lg:col-span-4 lg:block"
        >
          <div className="sticky top-20 space-y-1">
            <div className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Verified Service Guides ({filteredGuides.length})
            </div>
            {filteredGuides.length === 0 ? (
              <div className="py-4 text-xs text-slate-500">
                No government service guide matches your search.
              </div>
            ) : (
              <div className="space-y-1">
                {filteredGuides.map((guide) => {
                  const isSelected = selectedGuide?.slug === guide.slug;
                  const checkedCount =
                    (completedChecklistIds[guide.slug] || []).length;
                  return (
                    <button
                      key={guide.id}
                      type="button"
                      onClick={() => setActiveSlug(guide.slug)}
                      className={`group flex w-full flex-col rounded-xl px-3 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#17365D] ${
                        isSelected
                          ? "border-l-2 border-[#17365D] bg-blue-50/80 font-semibold text-[#17365D]"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded bg-slate-100 px-1.5 py-0.2 font-mono text-[10px] font-bold text-slate-700">
                          {guide.organizationAcronym}
                        </span>
                        {checkedCount > 0 && (
                          <span className="text-[10.5px] font-medium text-emerald-700">
                            {checkedCount}/{guide.requirementsChecklist.length} ready
                          </span>
                        )}
                      </div>
                      <span className="mt-1 text-xs leading-snug">
                        {guide.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* Right Detailed Guide (Cardless Open Reading Surface) */}
        <div className="lg:col-span-8">
          {selectedGuide && (
            <article className="space-y-6">
              {/* Header Lockup */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-800">
                    {selectedGuide.organizationAcronym}
                  </span>
                  <span className="text-xs text-slate-500">
                    {selectedGuide.organizationName}
                  </span>
                  <span className="text-slate-300">·</span>
                  <VerificationBadge
                    status={selectedGuide.verificationStatus}
                    lastVerifiedAt={selectedGuide.lastVerifiedAt}
                  />
                </div>

                <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                  {selectedGuide.title}
                </h2>

                <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                  {selectedGuide.summary}
                </p>

                {/* Direct Action Links */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <a
                    href={`/serbisyo/${selectedGuide.slug}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-[#17365D] hover:bg-slate-50"
                  >
                    <span>Standalone Guide Page</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      toggleBookmark({
                        targetType: "resource",
                        targetId: selectedGuide.id,
                        targetSlug: selectedGuide.slug,
                        targetTitle: selectedGuide.title,
                        targetModule: "serbisyo",
                        href: `/serbisyo/${selectedGuide.slug}`,
                      })
                    }
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-semibold transition ${
                      isBookmarked(selectedGuide.id)
                        ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {isBookmarked(selectedGuide.id) ? (
                      <>
                        <BookmarkCheck className="h-3.5 w-3.5 text-emerald-700" />
                        <span>Saved to Bookmarks</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-3.5 w-3.5" />
                        <span>Bookmark Guide</span>
                      </>
                    )}
                  </button>

                  <CopyButton
                    textToCopy={`Checklist for ${selectedGuide.title}:\n${selectedGuide.requirementsChecklist
                      .map((r, i) => `${i + 1}. ${r.label}${r.isMandatory ? " [Required]" : ""}`)
                      .join("\n")}`}
                    label="Copy Checklist"
                    copiedLabel="Checklist Copied!"
                  />
                </div>
              </div>

              {/* Statutory Metadata Row (Open, airy, NO gray boxed card enclosure) */}
              <div className="grid grid-cols-1 gap-4 border-y border-slate-200/80 py-4 text-xs sm:grid-cols-3">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <Banknote className="h-3.5 w-3.5 text-[#17365D]" />
                    <span>Statutory Fee</span>
                  </div>
                  <div className="mt-1 text-sm font-bold text-slate-900">
                    {selectedGuide.feesSummary}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <Clock className="h-3.5 w-3.5 text-[#17365D]" />
                    <span>Processing Time</span>
                  </div>
                  <div className="mt-1 text-sm font-bold text-slate-900">
                    {selectedGuide.processingTime}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <Phone className="h-3.5 w-3.5 text-[#17365D]" />
                    <span>Official Hotline &amp; Hours</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 font-mono text-sm font-bold text-slate-900">
                    <span>{selectedGuide.contactInfo.hotline || "See portal"}</span>
                    {selectedGuide.contactInfo.hotline && (
                      <CopyButton
                        textToCopy={selectedGuide.contactInfo.hotline}
                        label="Copy"
                        className="py-0.5 text-[10px]"
                      />
                    )}
                  </div>
                  {selectedGuide.contactInfo.hours && (
                    <span className="block text-[11px] text-slate-500">
                      {selectedGuide.contactInfo.hours}
                    </span>
                  )}
                </div>
              </div>

              {/* Eligibility */}
              <div className="space-y-1 text-xs">
                <h3 className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">
                  Who Can Apply (Eligibility)
                </h3>
                <p className="leading-relaxed text-slate-700">
                  {selectedGuide.eligibilitySummary}
                </p>
              </div>

              {/* Section 1: Interactive Document Requirements Checklist */}
              <section className="space-y-3">
                {(() => {
                  const checkedCount = (completedChecklistIds[selectedGuide.slug] || []).length;
                  const totalReqs = selectedGuide.requirementsChecklist.length;
                  const pct = totalReqs > 0 ? Math.round((checkedCount / totalReqs) * 100) : 0;

                  return (
                    <div>
                      <div className="flex items-center justify-between pb-1.5">
                        <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                          1. Document Requirements Checklist
                        </h3>
                        <span className="font-mono text-xs font-semibold text-[#17365D]">
                          {checkedCount} of {totalReqs} ready ({pct}%)
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full transition-all duration-300 ${
                            pct === 100 ? "bg-emerald-600" : "bg-[#17365D]"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })()}

                <div className="divide-y divide-slate-100 border-y border-slate-200">
                  {selectedGuide.requirementsChecklist.map((req) => {
                    const checked = (
                      completedChecklistIds[selectedGuide.slug] || []
                    ).includes(req.id);
                    return (
                      <label
                        key={req.id}
                        className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-3 transition hover:bg-slate-50/60"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            toggleChecklistStep(selectedGuide.slug, req.id)
                          }
                          className="mt-0.5 h-4 w-4 rounded text-[#17365D] accent-[#17365D] focus:ring-[#17365D]"
                        />
                        <div className="flex-1 text-xs">
                          <span
                            className={`font-semibold ${
                              checked
                                ? "text-slate-400 line-through"
                                : "text-slate-900"
                            }`}
                          >
                            {req.label}
                          </span>
                          {req.isMandatory ? (
                            <span className="ml-2 rounded bg-blue-50 px-1.5 py-0.2 text-[10px] font-bold uppercase text-[#17365D]">
                              Required
                            </span>
                          ) : (
                            <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-500">
                              Conditional
                            </span>
                          )}
                          {req.notes && (
                            <p className="mt-0.5 text-[11px] text-slate-500">
                              {req.notes}
                            </p>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </section>

              {/* Section 2: Connected Vertical Stepper (Step-by-Step Procedure) */}
              <section className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                  2. Step-by-Step Official Procedure
                </h3>

                <div className="relative space-y-6 pl-6 before:absolute before:bottom-2 before:left-2.5 before:top-2 before:w-0.5 before:bg-slate-200">
                  {selectedGuide.steps.map((step, idx) => {
                    const isLast = idx === selectedGuide.steps.length - 1;
                    return (
                      <div key={step.stepNumber} className="relative">
                        <span
                          className={`absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ${
                            isLast ? "bg-emerald-600" : "bg-[#17365D]"
                          }`}
                        >
                          {step.stepNumber}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 sm:text-sm">
                            {step.title}
                          </h4>
                          <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
                            {step.description}
                          </p>
                          {step.officialPortalLink && (
                            <a
                              href={step.officialPortalLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-[#17365D] hover:underline"
                            >
                              <span>Open Official Portal</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Transparency Source Citation Bar */}
              <SourceCitationBar
                sourceName={selectedGuide.sourceName}
                sourceUrl={selectedGuide.sourceUrl}
                regionName={selectedGuide.regionName}
                lastVerifiedAt={selectedGuide.lastVerifiedAt}
                verificationStatus={selectedGuide.verificationStatus}
                targetId={selectedGuide.id}
                targetTitle={selectedGuide.title}
                targetType="resource"
              />
            </article>
          )}
        </div>
      </div>

      {/* Verified Government Agency Directory Table */}
      <section
        aria-labelledby="agency-directory-heading"
        className="no-print mt-10"
      >
        <div className="mb-3 flex items-center gap-2">
          <Building2 className="h-4 w-4 text-[#17365D]" aria-hidden="true" />
          <h2
            id="agency-directory-heading"
            className="text-base font-bold text-slate-900"
          >
            Official Philippine Government Agencies & Portals Directory
          </h2>
        </div>

        <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <th className="px-4 py-2.5 font-semibold">Agency</th>
                <th className="px-4 py-2.5 font-semibold">Mandate & Services</th>
                <th className="px-4 py-2.5 font-semibold">Hotline</th>
                <th className="px-4 py-2.5 font-semibold">Status</th>
                <th className="px-4 py-2.5 font-semibold">Official Website</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {VERIFIED_ORGANIZATIONS.filter(
                (o) => o.orgType === "gov_agency"
              ).map((org) => (
                <tr key={org.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    <span className="mr-1.5 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px]">
                      {org.acronym}
                    </span>
                    {org.name}
                  </td>
                  <td className="max-w-md px-4 py-3 text-slate-600">
                    {org.description}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-800">
                    {org.hotline || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <VerificationBadge status={org.verificationStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={org.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-[#17365D] hover:underline"
                    >
                      <span>{org.officialWebsite.replace("https://", "")}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default function SerbisyoPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8 text-xs text-slate-600">
          Loading Serbisyo Government Directory...
        </div>
      }
    >
      <SerbisyoContent />
    </Suspense>
  );
}
