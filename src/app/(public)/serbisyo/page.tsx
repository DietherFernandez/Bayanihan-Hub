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
import { useCitizenState } from "@/components/providers/citizen-state-provider";

function SerbisyoContent() {
  const searchParams = useSearchParams();
  const initialSlug = searchParams.get("item") || "";
  const serbisyoGuides = VERIFIED_RESOURCES.filter(
    (r) => r.module === "serbisyo"
  );

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeSlug, setActiveSlug] = useState<string>(
    initialSlug || serbisyoGuides[0]?.slug || ""
  );

  const {
    completedChecklistIds,
    toggleChecklistStep,
    toggleBookmark,
    isBookmarked,
  } = useCitizenState();

  const filteredGuides = serbisyoGuides.filter((g) =>
    selectedCategory === "all" ? true : g.categorySlug === selectedCategory
  );

  const selectedGuide =
    serbisyoGuides.find((g) => g.slug === activeSlug) || filteredGuides[0];

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
          <div className="inline-flex items-center gap-1.5 rounded bg-blue-50 px-2.5 py-0.5 text-xs font-bold uppercase text-[#0B3D91]">
            <FileCheck2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Module B · Serbisyo</span>
          </div>
          <h1 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Government Service Directory & Interactive Document Checklists
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            Verified requirements, step-by-step application procedures, statutory fees, and official agency links. Check off items as you prepare your documents.
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

      {/* Category Filter Strip */}
      <div className="no-print mb-5 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-700">Filter:</span>
        {[
          { slug: "all", label: "All Government Guides" },
          { slug: "civil-registry-ids", label: "Civil Registry & National IDs (PSA, NBI, PhilSys)" },
          { slug: "social-security-health", label: "Health & Social Security (PhilHealth, SSS)" },
        ].map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => setSelectedCategory(cat.slug)}
            className={`rounded border px-3 py-1.5 text-xs font-medium ${
              selectedCategory === cat.slug
                ? "border-[#0B3D91] bg-[#0B3D91] text-white"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Master-Detail Split Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left List of Services */}
        <aside
          aria-label="Government Services List"
          className="no-print lg:col-span-4"
        >
          <div className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
            {filteredGuides.map((guide) => {
              const isSelected = selectedGuide?.slug === guide.slug;
              const checkedCount =
                (completedChecklistIds[guide.slug] || []).length;
              return (
                <button
                  key={guide.id}
                  type="button"
                  onClick={() => setActiveSlug(guide.slug)}
                  className={`w-full p-3.5 text-left transition-colors ${
                    isSelected
                      ? "bg-blue-50/90 border-l-4 border-l-[#0B3D91]"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] font-bold text-slate-800">
                      {guide.organizationAcronym}
                    </span>
                    <span className="text-[11px] font-medium text-emerald-800">
                      {checkedCount}/{guide.requirementsChecklist.length} checked
                    </span>
                  </div>
                  <h2 className="mt-1.5 text-xs font-bold text-slate-900">
                    {guide.title}
                  </h2>
                  <p className="mt-1 line-clamp-2 text-[11px] text-slate-600">
                    {guide.summary}
                  </p>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Detailed Guide & Interactive Checklist */}
        <div className="lg:col-span-8">
          {selectedGuide && (
            <article className="rounded-md border border-slate-200 bg-white p-4 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-[#0B3D91] px-2 py-0.5 font-mono text-xs font-bold text-white">
                      {selectedGuide.organizationAcronym}
                    </span>
                    <span className="text-xs font-medium text-slate-600">
                      {selectedGuide.organizationName}
                    </span>
                  </div>
                  <h2 className="mt-2 text-lg font-bold text-slate-900 sm:text-xl">
                    {selectedGuide.title}
                  </h2>
                </div>

                <div className="no-print flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      toggleBookmark({
                        targetType: "resource",
                        targetId: selectedGuide.id,
                        targetSlug: selectedGuide.slug,
                        targetTitle: selectedGuide.title,
                        targetModule: "serbisyo",
                        href: `/serbisyo?item=${selectedGuide.slug}`,
                      })
                    }
                    className={`inline-flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs font-semibold ${
                      isBookmarked(selectedGuide.id)
                        ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                        : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
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
                </div>
              </div>

              {/* Key Statutory Metadata Grid */}
              <dl className="mt-4 grid grid-cols-1 gap-3 rounded border border-slate-200 bg-slate-50 p-3.5 text-xs sm:grid-cols-3">
                <div>
                  <dt className="flex items-center gap-1 font-semibold text-slate-700">
                    <Banknote className="h-3.5 w-3.5 text-[#0B3D91]" />
                    <span>Official Fee</span>
                  </dt>
                  <dd className="mt-1 text-slate-900">
                    {selectedGuide.feesSummary}
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1 font-semibold text-slate-700">
                    <Clock className="h-3.5 w-3.5 text-[#0B3D91]" />
                    <span>Processing Time</span>
                  </dt>
                  <dd className="mt-1 text-slate-900">
                    {selectedGuide.processingTime}
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1 font-semibold text-slate-700">
                    <Phone className="h-3.5 w-3.5 text-[#0B3D91]" />
                    <span>Official Hotline & Hours</span>
                  </dt>
                  <dd className="mt-1 font-mono text-slate-900">
                    {selectedGuide.contactInfo.hotline || "See portal"}
                    {selectedGuide.contactInfo.hours && (
                      <span className="block font-sans text-[11px] text-slate-600">
                        {selectedGuide.contactInfo.hours}
                      </span>
                    )}
                  </dd>
                </div>
              </dl>

              {/* Eligibility */}
              <div className="mt-4 text-xs">
                <h3 className="font-bold uppercase tracking-wider text-slate-700">
                  Who Can Apply (Eligibility)
                </h3>
                <p className="mt-1 leading-relaxed text-slate-700">
                  {selectedGuide.eligibilitySummary}
                </p>
              </div>

              {/* Interactive Document Requirements Checklist */}
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    1. Document Requirements Checklist (Interactive)
                  </h3>
                  <span className="text-xs text-slate-500">
                    Click items to mark as prepared
                  </span>
                </div>

                <div className="mt-2.5 divide-y divide-slate-200 rounded border border-slate-200">
                  {selectedGuide.requirementsChecklist.map((req) => {
                    const checked = (
                      completedChecklistIds[selectedGuide.slug] || []
                    ).includes(req.id);
                    return (
                      <div
                        key={req.id}
                        className={`flex items-start gap-3 p-3 text-xs ${
                          checked ? "bg-emerald-50/50" : "bg-white"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            toggleChecklistStep(selectedGuide.slug, req.id)
                          }
                          aria-pressed={checked}
                          className="mt-0.5 text-[#0B3D91] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B3D91]"
                        >
                          {checked ? (
                            <CheckSquare className="h-4 w-4 text-emerald-700" />
                          ) : (
                            <Square className="h-4 w-4 text-slate-400" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`font-semibold ${
                                checked
                                  ? "line-through text-slate-500"
                                  : "text-slate-900"
                              }`}
                            >
                              {req.label}
                            </span>
                            {req.isMandatory ? (
                              <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-[#0B3D91]">
                                Required
                              </span>
                            ) : (
                              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
                                Conditional / If Applicable
                              </span>
                            )}
                          </div>
                          {req.notes && (
                            <p className="mt-1 text-slate-600">{req.notes}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="mt-6">
                <h3 className="text-sm font-bold text-slate-900">
                  2. Step-by-Step Official Procedure
                </h3>
                <ol className="mt-2.5 space-y-2.5">
                  {selectedGuide.steps.map((step) => (
                    <li
                      key={step.stepNumber}
                      className="rounded border border-slate-200 bg-slate-50/60 p-3 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-900">
                          Step {step.stepNumber}: {step.title}
                        </span>
                        {step.officialPortalLink && (
                          <a
                            href={step.officialPortalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex shrink-0 items-center gap-1 font-semibold text-[#0B3D91] hover:underline"
                          >
                            <span>Official Portal</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                      <p className="mt-1 leading-relaxed text-slate-600">
                        {step.description}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

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
          <Building2 className="h-4 w-4 text-[#0B3D91]" aria-hidden="true" />
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
                      className="inline-flex items-center gap-1 font-semibold text-[#0B3D91] hover:underline"
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
