"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  GraduationCap,
  CheckSquare,
  Square,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Award,
} from "lucide-react";
import {
  VERIFIED_OPPORTUNITIES,
  VERIFIED_RESOURCES,
} from "@/lib/constants/philippine-data";
import { SourceCitationBar } from "@/components/trust/verification-badge";
import { useCitizenState } from "@/components/providers/citizen-state-provider";

const FREE_LEARNING_TRACKS = [
  {
    id: "trk-web-dev",
    title: "ICT & Digital Literacy: Web Development & Computer Systems Servicing (NC II Prep)",
    provider: "TESDA Online Program (e-TESDA)",
    duration: "Self-Paced (Approx. 40 hours)",
    portalUrl: "https://e-tesda.gov.ph",
    modules: [
      "Installing and Configuring Computer Systems",
      "Setting Up Computer Networks & Wi-Fi Security",
      "HTML5, CSS3 & Responsive Web Fundamentals",
      "Digital Citizenship & Online Freelancing Ethics",
    ],
  },
  {
    id: "trk-entrepreneurship",
    title: "Small Business & MSME Financial Management (Start and Improve Your Business)",
    provider: "TESDA & DTI Negosyo Center Open Courseware",
    duration: "Self-Paced (Approx. 24 hours)",
    portalUrl: "https://e-tesda.gov.ph",
    modules: [
      "Generating & Validating a Barangay/Community Business Idea",
      "Basic Bookkeeping, Costing, and Pricing",
      "BMBE & DTI Business Name Registration Requirements",
      "Separating Personal and Business Cash Flow",
    ],
  },
  {
    id: "trk-caregiving-health",
    title: "Healthcare & Community Caregiving Fundamentals",
    provider: "TESDA Online Program",
    duration: "Self-Paced (Approx. 36 hours)",
    portalUrl: "https://e-tesda.gov.ph",
    modules: [
      "Providing Care and Support to Infants, Toddlers, and Senior Citizens",
      "Infection Control, Vital Signs Monitoring, and Safe Mobility",
      "Household Nutrition and Emergency First-Aid Readiness",
    ],
  },
];

function AralContent() {
  const searchParams = useSearchParams();
  const initialSlug = searchParams.get("item") || "";

  const {
    completedChecklistIds,
    toggleChecklistStep,
    toggleBookmark,
    isBookmarked,
  } = useCitizenState();

  const scholarshipsAndTraining = VERIFIED_OPPORTUNITIES.filter(
    (o) => o.type === "scholarship" || o.type === "training"
  );
  const aralResources = VERIFIED_RESOURCES.filter((r) => r.module === "aral");

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6">
      {/* Header */}
      <div className="mb-6 border-b border-slate-200 pb-4">
        <div className="inline-flex items-center gap-1.5 rounded bg-blue-50 px-2.5 py-0.5 text-xs font-bold uppercase text-[#17365D]">
          <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Module E · Aral</span>
        </div>
        <h1 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Free Online Learning, Scholarships & Personal Progress Tracker
        </h1>
        <p className="mt-1 text-xs text-slate-600">
          Verified CHED & UniFAST college scholarships, TESDA free technical-vocational grants, and interactive self-paced learning tracks.
        </p>
      </div>

      {/* Section 1: Scholarship & Free Training Grants Directory */}
      <section aria-labelledby="scholarships-heading" className="mb-10">
        <h2
          id="scholarships-heading"
          className="mb-3 text-base font-bold text-slate-900"
        >
          1. Verified Government Scholarships & Free Skills Grants
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {scholarshipsAndTraining.map((item) => {
            const isHighlighted = initialSlug === item.slug;
            return (
              <article
                key={item.id}
                className={`flex flex-col justify-between rounded-md border bg-white p-4 sm:p-5 ${
                  isHighlighted
                    ? "border-[#17365D] ring-2 ring-[#17365D]/20"
                    : "border-slate-200"
                }`}
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-[#17365D]">
                      {item.type}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        toggleBookmark({
                          targetType: "opportunity",
                          targetId: item.id,
                          targetSlug: item.slug,
                          targetTitle: item.title,
                          targetModule: "aral",
                          href: `/aral?item=${item.slug}`,
                        })
                      }
                      className="inline-flex items-center gap-1 rounded border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      {isBookmarked(item.id) ? (
                        <>
                          <BookmarkCheck className="h-3.5 w-3.5 text-emerald-700" />
                          <span>Saved</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="h-3.5 w-3.5" />
                          <span>Save</span>
                        </>
                      )}
                    </button>
                  </div>

                  <h3 className="mt-2 text-base font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600">
                    {item.description}
                  </p>

                  <div className="mt-3 rounded border border-emerald-200 bg-emerald-50/70 p-2.5 text-xs text-emerald-950">
                    <strong>Grant Benefit:</strong> {item.compensationOrBenefit}
                  </div>

                  <div className="mt-3 text-xs">
                    <strong className="text-slate-800">Key Requirements:</strong>
                    <ul className="mt-1 list-disc space-y-1 pl-4 text-slate-600">
                      {item.requirements.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <SourceCitationBar
                  sourceName={item.sourceName}
                  sourceUrl={item.sourceUrl}
                  regionName={item.regionName}
                  lastVerifiedAt={item.lastVerifiedAt}
                  verificationStatus={item.verificationStatus}
                  targetId={item.id}
                  targetTitle={item.title}
                  targetType="opportunity"
                />
              </article>
            );
          })}
        </div>
      </section>

      {/* Section 2: Interactive Learning Progress Tracker */}
      <section aria-labelledby="learning-progress-heading" className="mb-10">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-[#17365D]" aria-hidden="true" />
            <h2
              id="learning-progress-heading"
              className="text-base font-bold text-slate-900"
            >
              2. Free Self-Paced Learning Tracks & Progress Tracker
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Check off modules as you complete them on e-TESDA
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {FREE_LEARNING_TRACKS.map((track) => {
            const completed = completedChecklistIds[track.id] || [];
            const pct = Math.round(
              (completed.length / track.modules.length) * 100
            );
            return (
              <div
                key={track.id}
                className="flex flex-col justify-between rounded-md border border-slate-200 bg-white p-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-[#17365D]">
                      {track.provider}
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-800">
                      {pct}% Complete
                    </span>
                  </div>

                  <h3 className="mt-1.5 text-sm font-bold text-slate-900">
                    {track.title}
                  </h3>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {track.duration}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full bg-emerald-600 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="mt-3 divide-y divide-slate-100 border-t border-slate-100 pt-2 text-xs">
                    {track.modules.map((modName, idx) => {
                      const stepId = `${track.id}-m${idx}`;
                      const isDone = completed.includes(stepId);
                      return (
                        <button
                          key={stepId}
                          type="button"
                          onClick={() => toggleChecklistStep(track.id, stepId)}
                          className="flex w-full items-start gap-2 py-2 text-left hover:bg-slate-50"
                        >
                          {isDone ? (
                            <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                          ) : (
                            <Square className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                          )}
                          <span
                            className={
                              isDone
                                ? "line-through text-slate-400"
                                : "text-slate-800"
                            }
                          >
                            {modName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-3 border-t border-slate-100 pt-3">
                  <a
                    href={track.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded bg-[#17365D] px-3 py-2 text-xs font-semibold text-white hover:bg-[#102847]"
                  >
                    <span>Open Official e-TESDA Courseware</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3: Detailed e-TESDA Enrollment Guide */}
      <section aria-labelledby="aral-guides-heading">
        <h2
          id="aral-guides-heading"
          className="mb-3 text-base font-bold text-slate-900"
        >
          3. Official Enrollment Guide
        </h2>
        {aralResources.map((res) => (
          <div
            key={res.id}
            className="rounded-md border border-slate-200 bg-white p-4 sm:p-5"
          >
            <h3 className="text-sm font-bold text-slate-900">{res.title}</h3>
            <p className="mt-1 text-xs text-slate-600">{res.summary}</p>
            <ol className="mt-3 list-decimal space-y-1.5 pl-4 text-xs text-slate-700">
              {res.steps.map((s) => (
                <li key={s.stepNumber}>
                  <strong>{s.title}:</strong> {s.description}
                </li>
              ))}
            </ol>
            <SourceCitationBar
              sourceName={res.sourceName}
              sourceUrl={res.sourceUrl}
              regionName={res.regionName}
              lastVerifiedAt={res.lastVerifiedAt}
              verificationStatus={res.verificationStatus}
              targetId={res.id}
              targetTitle={res.title}
              targetType="resource"
            />
          </div>
        ))}
      </section>
    </div>
  );
}

export default function AralPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8 text-xs text-slate-600">
          Loading Aral Scholarships & Free Courses...
        </div>
      }
    >
      <AralContent />
    </Suspense>
  );
}
