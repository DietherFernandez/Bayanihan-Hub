"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import {
  GraduationCap,
  CheckSquare,
  Square,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Search,
  Building2,
  Laptop,
  TrendingUp,
  HeartPulse,
  Info,
} from "lucide-react";
import {
  PH_LOCATIONS,
  VERIFIED_OPPORTUNITIES,
  VERIFIED_ORGANIZATIONS,
  VERIFIED_RESOURCES,
} from "@/lib/constants/philippine-data";
import {
  SourceCitationBar,
  VerificationBadge,
} from "@/components/trust/verification-badge";
import { useCitizenState } from "@/components/providers/citizen-state-provider";

const FREE_LEARNING_TRACKS = [
  {
    id: "trk-web-dev",
    topic: "ICT & Digital",
    providerTag: "TESDA",
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
    topic: "Business & Entrepreneurship",
    providerTag: "TESDA",
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
    topic: "Healthcare & Caregiving",
    providerTag: "TESDA",
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
  const [searchQuery, setSearchQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState<string>("all");
  const [learningTypeFilter, setLearningTypeFilter] = useState<
    "all" | "scholarship" | "training" | "online_course"
  >("all");
  const [providerFilter, setProviderFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("ALL");

  const {
    completedChecklistIds,
    toggleChecklistStep,
    toggleBookmark,
    isBookmarked,
  } = useCitizenState();

  const scholarshipsAndTraining = VERIFIED_OPPORTUNITIES.filter((o) => {
    if (o.type !== "scholarship" && o.type !== "training") return false;
    if (
      learningTypeFilter !== "all" &&
      learningTypeFilter !== "online_course" &&
      o.type !== learningTypeFilter
    ) {
      return false;
    }
    if (learningTypeFilter === "online_course") return false;
    if (
      regionFilter !== "ALL" &&
      o.regionCode !== "NATIONAL" &&
      o.regionCode !== regionFilter
    ) {
      return false;
    }
    if (providerFilter !== "all") {
      const orgLower = `${o.organizationName} ${o.sourceName}`.toLowerCase();
      if (!orgLower.includes(providerFilter.toLowerCase())) return false;
    }
    if (topicFilter !== "all") {
      const hay = `${o.title} ${o.description}`.toLowerCase();
      if (topicFilter === "ICT & Digital" && !hay.includes("ict") && !hay.includes("digital") && !hay.includes("web")) {
        return false;
      }
      if (topicFilter === "STEM & College" && !hay.includes("science") && !hay.includes("undergraduate") && !hay.includes("college")) {
        return false;
      }
    }
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const hay = `${o.title} ${o.organizationName} ${o.description}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const filteredTracks = FREE_LEARNING_TRACKS.filter((track) => {
    if (
      learningTypeFilter !== "all" &&
      learningTypeFilter !== "online_course" &&
      learningTypeFilter !== "training"
    ) {
      return false;
    }
    if (topicFilter !== "all" && track.topic !== topicFilter) return false;
    if (
      providerFilter !== "all" &&
      !track.provider.toLowerCase().includes(providerFilter.toLowerCase())
    ) {
      return false;
    }
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const hay = `${track.title} ${track.provider} ${track.modules.join(" ")}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const aralResources = VERIFIED_RESOURCES.filter((r) => r.module === "aral");
  const educationalOrgs = VERIFIED_ORGANIZATIONS.filter(
    (org) =>
      org.acronym === "TESDA" ||
      org.acronym === "DOST-SEI" ||
      org.acronym === "DICT"
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10 space-y-8 sm:space-y-10">
      {/* Header & Page Title (Cardless Editorial Style) */}
      <div className="space-y-2 border-b border-slate-200 pb-5">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-indigo-800">
          <GraduationCap className="h-4 w-4 text-indigo-700" aria-hidden="true" />
          <span>Module E · Aral at Edukasyon</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Free Online Learning, Scholarships &amp; Skills Progress Tracker
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
          Verified CHED merit scholarships, DOST-SEI undergraduate grants, free TESDA technical-vocational NC-II training, and self-paced courseware.
        </p>
      </div>

      {/* Quick Topic Chips (Lucide SVG Icons, Zero Emojis) */}
      <div className="space-y-3">
        <div className="no-scrollbar flex gap-2 overflow-x-auto whitespace-nowrap pb-1">
          {[
            { id: "all", label: "All Learning Grants", icon: null },
            { id: "ICT & Digital", label: "ICT & Web Development", icon: Laptop },
            { id: "STEM & College", label: "College Scholarships", icon: GraduationCap },
            { id: "Business & Entrepreneurship", label: "Negosyo & MSME", icon: TrendingUp },
            { id: "Healthcare & Caregiving", label: "Caregiving & Health", icon: HeartPulse },
          ].map((chip) => {
            const Icon = chip.icon;
            const isSelected = topicFilter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setTopicFilter(chip.id)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-2xs transition ${
                  isSelected
                    ? "border-[#17365D] bg-[#17365D] text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Multi-Faceted Filters (Clean Editorial, No Box Card) */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search TESDA courses, DOST scholarships, web development..."
              aria-label="Filter learning resources and scholarships"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#17365D] focus:ring-1 focus:ring-[#17365D] transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs shrink-0">
            <select
              value={learningTypeFilter}
              onChange={(e) =>
                setLearningTypeFilter(
                  e.target.value as "all" | "scholarship" | "training" | "online_course"
                )
              }
              aria-label="Filter by learning type"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#17365D]"
            >
              <option value="all">All Types</option>
              <option value="scholarship">Degree Scholarships</option>
              <option value="training">Free Skills Training (NC-II)</option>
              <option value="online_course">Self-Paced e-TESDA</option>
            </select>

            <select
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              aria-label="Filter by provider"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#17365D]"
            >
              <option value="all">All Providers</option>
              <option value="TESDA">TESDA / e-TESDA</option>
              <option value="DOST">DOST-SEI</option>
              <option value="CHED">CHED</option>
              <option value="DICT">DICT</option>
            </select>

            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              aria-label="Filter by region"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#17365D]"
            >
              <option value="ALL">Nationwide (All Regions)</option>
              {PH_LOCATIONS.filter((l) => !l.isNational).map((loc) => (
                <option key={loc.id} value={loc.regionCode}>
                  {loc.regionCode} — {loc.regionName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 1: Scholarship & Free Training Grants Directory (Cardless) */}
      <section aria-labelledby="scholarships-heading" className="space-y-4">
        <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-2">
          <h2 id="scholarships-heading" className="font-bold text-slate-900 text-sm sm:text-base">
            1. Verified Government Scholarships &amp; Skills Grants ({scholarshipsAndTraining.length})
          </h2>
          <span className="text-slate-400">Direct Agency Guidelines</span>
        </div>

        {scholarshipsAndTraining.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No scholarships or training grants matched your filter criteria.{" "}
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setTopicFilter("all");
                setLearningTypeFilter("all");
                setProviderFilter("all");
                setRegionFilter("ALL");
              }}
              className="font-semibold text-[#17365D] underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 border-y border-slate-200 text-xs">
            {scholarshipsAndTraining.map((item) => {
              return (
                <div
                  key={item.id}
                  className="py-4 space-y-2 group hover:bg-slate-50/60 -mx-2 px-2 rounded-lg transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded bg-indigo-50 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase text-indigo-800">
                          {item.organizationName.split(" ")[0]} · {item.type}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {item.regionName}
                        </span>
                        {item.deadlineAt && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span className="text-[11px] text-amber-700 font-medium">
                              Deadline: {item.deadlineAt}
                            </span>
                          </>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 group-hover:text-[#17365D] text-sm sm:text-base transition">
                        <Link href={`/aral/${item.slug}`}>
                          {item.title}
                        </Link>
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() =>
                          toggleBookmark({
                            targetType: "opportunity",
                            targetId: item.id,
                            targetSlug: item.slug,
                            targetTitle: item.title,
                            targetModule: "aral",
                            href: `/aral/${item.slug}`,
                          })
                        }
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-[#17365D] transition"
                        title="Save grant"
                      >
                        {isBookmarked(item.id) ? (
                          <BookmarkCheck className="h-4 w-4 text-emerald-700" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </button>
                      <Link
                        href={`/aral/${item.slug}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#17365D] text-white text-xs font-semibold hover:bg-[#102847] shadow-2xs transition"
                      >
                        <span>Full Details</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>

                  <p className="text-slate-600 leading-relaxed text-[11.5px]">
                    {item.description}
                  </p>

                  <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-2 pt-1 border-t border-slate-50">
                    <span className="font-semibold text-emerald-800">
                      Benefit: {item.compensationOrBenefit}
                    </span>
                    <span>·</span>
                    <span>{item.requirements.slice(0, 2).join(" · ")}</span>
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
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* SECTION 2: Interactive Self-Paced Learning Progress Tracker (Cardless) */}
      <section aria-labelledby="learning-progress-heading" className="space-y-4 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
          <div>
            <h2 id="learning-progress-heading" className="text-sm sm:text-base font-bold text-slate-900">
              2. Interactive Self-Paced Learning Tracks ({filteredTracks.length})
            </h2>
            <p className="text-xs text-slate-500">
              Check off modules as you complete them online at e-TESDA.
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 font-bold">Free Certifications</span>
        </div>

        <div className="divide-y divide-slate-100 border-y border-slate-200 text-xs">
          {filteredTracks.map((track) => {
            const completed = completedChecklistIds[track.id] || [];
            const pct = Math.round(
              (completed.length / track.modules.length) * 100
            );
            return (
              <div key={track.id} className="py-4 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-indigo-50 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase text-indigo-800">
                        {track.providerTag}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">
                        {track.title}
                      </span>
                    </div>
                    <span className="block text-[11px] text-slate-500">
                      {track.provider} · {track.duration} · Topic: {track.topic}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                    <span className="font-mono text-xs font-bold text-emerald-700">
                      {pct}% Complete
                    </span>
                    <a
                      href={track.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#17365D] text-white text-xs font-semibold hover:bg-[#102847] shadow-2xs transition"
                    >
                      <span>Open e-TESDA Course</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Modules Checklist */}
                <div className="space-y-1.5 pt-1">
                  {track.modules.map((modName, idx) => {
                    const stepId = `${track.id}-m${idx}`;
                    const isDone = completed.includes(stepId);
                    return (
                      <button
                        key={stepId}
                        type="button"
                        onClick={() => toggleChecklistStep(track.id, stepId)}
                        className="flex w-full items-start gap-2.5 py-1 text-left text-slate-700 hover:text-slate-900 group transition"
                      >
                        {isDone ? (
                          <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                        ) : (
                          <Square className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-600" />
                        )}
                        <span className={isDone ? "line-through text-slate-400" : "text-slate-800"}>
                          {modName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: Official Enrollment Guides (Cardless) */}
      <section aria-labelledby="aral-guides-heading" className="space-y-4 pt-2">
        <h2 id="aral-guides-heading" className="text-sm sm:text-base font-bold text-slate-900 border-b border-slate-200 pb-2">
          3. Official Enrollment Guides
        </h2>
        <div className="divide-y divide-slate-100 border-y border-slate-200 text-xs">
          {aralResources.map((res) => (
            <div key={res.id} className="py-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bold text-slate-900 text-sm">
                  <Link href={`/aral/${res.slug}`} className="hover:text-[#17365D] hover:underline">
                    {res.title}
                  </Link>
                </h3>
                <Link
                  href={`/aral/${res.slug}`}
                  className="inline-flex items-center gap-1 text-[#17365D] font-semibold hover:underline"
                >
                  <span>Open Dedicated Enrollment Guide</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11.5px]">{res.summary}</p>
              <ol className="list-decimal space-y-1 pl-4 text-slate-700 pt-1">
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
        </div>
      </section>

      {/* SECTION 4: Verified Educational Agencies (Cardless) */}
      <section aria-labelledby="aral-orgs-heading" className="space-y-3 pt-2">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <Building2 className="h-4 w-4 text-[#17365D]" aria-hidden="true" />
          <h2 id="aral-orgs-heading" className="text-sm sm:text-base font-bold text-slate-900">
            4. Verified Educational &amp; Scholarship Agencies
          </h2>
        </div>
        <div className="divide-y divide-slate-100 border-y border-slate-200 text-xs">
          {educationalOrgs.map((org) => (
            <div key={org.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-indigo-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#17365D]">
                    {org.acronym}
                  </span>
                  <span className="font-bold text-slate-900">{org.name}</span>
                  <VerificationBadge
                    status={org.verificationStatus}
                    lastVerifiedAt={org.lastVerifiedAt}
                  />
                </div>
                <span className="block text-[11px] text-slate-500">
                  Hotline: {org.hotline} · Verified Agency
                </span>
              </div>
              <a
                href={org.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-[#17365D] hover:underline shrink-0"
              >
                <span>Official Agency Portal</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Statutory Disclosure (Open Civic Text, No Box Card) */}
      <div className="pt-4 text-xs text-slate-500 space-y-1.5 border-t border-slate-200/80">
        <div className="flex items-center gap-1.5 font-bold text-slate-700">
          <Info className="h-4 w-4 text-[#17365D]" aria-hidden="true" />
          <span>Scholarship Eligibility &amp; Testing Notice</span>
        </div>
        <p className="leading-relaxed">
          GabayPH provides verified statutory information for free public education and skills training. We do not evaluate exam results or award scholarships. Official application processing and qualifying examinations are administered directly by CHED, DOST-SEI, and accredited TESDA centers.
        </p>
      </div>
    </div>
  );
}

export default function AralPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-4 py-8 text-xs text-slate-600">
          Loading Aral Scholarships &amp; Free Courses...
        </div>
      }
    >
      <AralContent />
    </Suspense>
  );
}
