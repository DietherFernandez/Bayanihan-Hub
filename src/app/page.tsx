import React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  AlertTriangle,
  Info,
  PhoneCall,
  Calculator,
  FileText,
} from "lucide-react";
import { UniversalSearchHero } from "@/components/search/universal-search-bar";
import { VerificationBadge } from "@/components/trust/verification-badge";
import {
  OpportunityListingRow,
  ResourceListingRow,
  ServiceCategoryShortcuts,
  type ServiceCategoryShortcutItem,
} from "@/components/ui/design-system";
import {
  ACTIVE_ANNOUNCEMENTS,
  VERIFIED_ASSISTANCE_PROGRAMS,
  VERIFIED_EMERGENCY_HOTLINES,
  VERIFIED_OPPORTUNITIES,
  VERIFIED_RESOURCES,
} from "@/lib/constants/philippine-data";

const SIX_MODULES: ServiceCategoryShortcutItem[] = [
  {
    code: "SERBISYO",
    name: "Serbisyo",
    href: "/serbisyo",
    summary:
      "Step-by-step government ID & civil registry checklists, fees, processing times, and official agency portals.",
    highlights: ["PSA Birth Certificate", "NBI Clearance", "PhilSys Digital ID"],
  },
  {
    code: "TRABAHO",
    name: "Trabaho",
    href: "/trabaho",
    summary:
      "Verified CSC & DOLE PhilJobNet openings, interactive printable Resume Builder, TESDA skills training, and Job Scam Reporting.",
    highlights: ["Verified Gov Jobs", "Resume Builder", "Scam Reporting"],
  },
  {
    code: "PERA",
    name: "Pera",
    href: "/pera",
    summary:
      "DSWD AICS, Malasakit Centers, and DOLE TUPAD aid directory plus interactive Budget, Savings, and Debt Repayment calculators.",
    highlights: ["DSWD AICS & Malasakit", "Budget Calculator", "MP2 Planner"],
  },
  {
    code: "BAYANIHAN",
    name: "Bayanihan",
    href: "/bayanihan",
    summary:
      "Moderated community donation hubs, Red Cross 143 & DSWD NROC volunteer opportunities, and verified local relief requests.",
    highlights: ["DSWD NROC Relief", "Red Cross 143", "Community Aid"],
  },
  {
    code: "ARAL",
    name: "Aral",
    href: "/aral",
    summary:
      "150+ free TESDA Online Program courses, CHED Merit & UniFAST scholarships, and personal learning progress tracker.",
    highlights: ["Free e-TESDA", "CHED Scholarships", "Progress Tracker"],
  },
  {
    code: "KALIGTASAN",
    name: "Kaligtasan",
    href: "/kaligtasan",
    summary:
      "National 911, Red Cross 143, NDRRMC, and NCMH 1553 hotlines, LGU evacuation center directory, and 72-hour Go-Bag checklists.",
    highlights: ["24/7 Hotlines", "Evacuation Centers", "72-Hour Go-Bag"],
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-7">
      {/* Hero & Universal Search Section */}
      <section aria-labelledby="hero-heading" className="mb-7">
        <div className="mb-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-md border border-[#087F8C]/25 bg-[#087F8C]/10 px-2.5 py-0.5 text-[12px] font-semibold text-[#087F8C]">
            <span>Public Service & Citizen Resource Platform</span>
          </div>
          <h1 id="hero-heading" className="gabay-page-title mt-2">
            GabayPH: Your Everyday Guide to a Better Life
          </h1>
          <p className="gabay-body mt-1.5">
            Find verified Philippine government requirements, employment opportunities, medical and financial assistance, free skills training, community relief, and emergency hotlines in one accessible place.
          </p>
        </div>

        <UniversalSearchHero />
      </section>

      {/* Six Core Platform Modules Directory (Mobile Two-Column Service Shortcuts) */}
      <section aria-labelledby="modules-heading" className="mb-8">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 id="modules-heading" className="gabay-section-title">
              Service Category Shortcuts
            </h2>
            <p className="text-[13px] text-[#64748B]">
              Direct access to verified checklists, interactive tools, and official directories — no account required.
            </p>
          </div>
          <Link
            href="/search"
            className="text-[13px] font-semibold text-[#087F8C] hover:underline"
          >
            View all indexed records →
          </Link>
        </div>

        <ServiceCategoryShortcuts items={SIX_MODULES} />
      </section>

      {/* Active Verified Public Advisories */}
      <section aria-labelledby="advisories-heading" className="mb-8">
        <div className="mb-2.5 flex items-center justify-between">
          <h2 id="advisories-heading" className="gabay-section-title">
            Active Verified Public Advisories
          </h2>
          <span className="text-[12px] text-[#64748B]">
            Automatically archived upon expiry
          </span>
        </div>

        <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
          {ACTIVE_ANNOUNCEMENTS.map((ann) => (
            <div
              key={ann.id}
              className="flex flex-col justify-between gap-2.5 p-3.5 sm:flex-row sm:items-center sm:p-4"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  {ann.severity === "emergency" ? (
                    <span className="inline-flex items-center gap-1 rounded bg-[#D94B4B]/15 px-2 py-0.5 text-[11.5px] font-semibold text-[#D94B4B]">
                      <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                      <span>Public Safety Advisory</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded bg-[#17365D]/10 px-2 py-0.5 text-[11.5px] font-semibold text-[#17365D]">
                      <Info className="h-3 w-3" aria-hidden="true" />
                      <span>Citizen Rights & Directive</span>
                    </span>
                  )}
                  <VerificationBadge status={ann.verificationStatus} />
                  <span className="text-[12px] text-[#64748B]">
                    Source: {ann.sourceName}
                  </span>
                </div>
                <h3 className="text-[15px] font-semibold text-slate-900">
                  {ann.title}
                </h3>
                <p className="text-[13.5px] leading-relaxed text-slate-600">
                  {ann.summary}
                </p>
              </div>
              <div className="shrink-0">
                <a
                  href={ann.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gabay-interactive inline-flex items-center gap-1 rounded-md border border-slate-300 bg-[#F7F9FC] px-3 py-1.5 text-[12.5px] font-semibold text-slate-800 hover:border-[#087F8C]"
                >
                  <span>Official Advisory</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Two-Column Essential Civic Access: Essential Checklists + Interactive Tools & Hotlines */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left 7 Columns: Most Requested Government Checklists & Assistance */}
        <section
          aria-labelledby="essential-guides-heading"
          className="lg:col-span-7"
        >
          <div className="rounded-lg border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div>
                <h2
                  id="essential-guides-heading"
                  className="gabay-section-title"
                >
                  Essential Government Services & Financial Aid
                </h2>
                <p className="text-[12.5px] text-[#64748B]">
                  Verified document checklists, statutory fees, and official links
                </p>
              </div>
              <Link
                href="/serbisyo"
                className="text-[12.5px] font-semibold text-[#087F8C] hover:underline"
              >
                All Serbisyo Guides →
              </Link>
            </div>

            <div className="divide-y divide-slate-200">
              {VERIFIED_RESOURCES.slice(0, 5).map((res) => (
                <ResourceListingRow key={res.id} resource={res} />
              ))}

              {VERIFIED_ASSISTANCE_PROGRAMS.slice(0, 2).map((aid) => (
                <div
                  key={aid.id}
                  className="gabay-interactive p-3.5 hover:bg-slate-50/80 sm:p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded bg-[#16A36A]/10 px-2 py-0.5 text-[11px] font-semibold text-[#065F46]">
                      FINANCIAL & MEDICAL AID
                    </span>
                    <VerificationBadge
                      status={aid.verificationStatus}
                      lastVerifiedAt={aid.lastVerifiedAt}
                    />
                  </div>
                  <Link
                    href={`/pera?item=${encodeURIComponent(aid.slug)}`}
                    className="mt-1.5 block text-[15px] font-semibold text-[#17365D] hover:text-[#087F8C] hover:underline"
                  >
                    {aid.programName}
                  </Link>
                  <p className="mt-1 text-[13px] text-slate-600">
                    {aid.benefitSummary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right 5 Columns: Interactive Citizen Tools, Opportunities & Emergency Hotlines */}
        <div className="space-y-6 lg:col-span-5">
          {/* Interactive Tools Box */}
          <section
            aria-labelledby="interactive-tools-heading"
            className="rounded-lg border border-slate-200 bg-white"
          >
            <div className="border-b border-slate-200 px-4 py-3">
              <h2
                id="interactive-tools-heading"
                className="gabay-section-title"
              >
                Free Citizen Self-Service Tools
              </h2>
              <p className="text-[12.5px] text-[#64748B]">
                Runs privately in your browser — no sign-up required
              </p>
            </div>
            <div className="divide-y divide-slate-200 text-[13px]">
              <Link
                href="/pera#calculators"
                className="gabay-interactive flex items-start justify-between gap-3 p-3.5 hover:bg-slate-50"
              >
                <div className="flex items-start gap-2.5">
                  <Calculator
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#087F8C]"
                    aria-hidden="true"
                  />
                  <div>
                    <span className="font-semibold text-slate-900">
                      Household Budget, Savings & Debt Calculators
                    </span>
                    <p className="mt-0.5 text-slate-600">
                      Compute monthly allocation, Pag-IBIG MP2 / emergency fund goals, and debt payoff schedules.
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>

              <Link
                href="/trabaho#resume-builder"
                className="gabay-interactive flex items-start justify-between gap-3 p-3.5 hover:bg-slate-50"
              >
                <div className="flex items-start gap-2.5">
                  <FileText
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#087F8C]"
                    aria-hidden="true"
                  />
                  <div>
                    <span className="font-semibold text-slate-900">
                      Printable Resume & PDS Helper
                    </span>
                    <p className="mt-0.5 text-slate-600">
                      Build a clean, employer-ready resume formatted for Philippine job applications and print to PDF.
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
            </div>
          </section>

          {/* Latest Verified Opportunities */}
          <section
            aria-labelledby="latest-opportunities-heading"
            className="rounded-lg border border-slate-200 bg-white"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <h2
                id="latest-opportunities-heading"
                className="gabay-section-title"
              >
                Verified Jobs, Scholarships & Training
              </h2>
              <Link
                href="/trabaho"
                className="text-[12.5px] font-semibold text-[#087F8C] hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="divide-y divide-slate-200">
              {VERIFIED_OPPORTUNITIES.map((opp) => (
                <OpportunityListingRow key={opp.id} opportunity={opp} />
              ))}
            </div>
          </section>

          {/* Quick Emergency Hotlines Box */}
          <section
            aria-labelledby="quick-hotlines-heading"
            className="rounded-lg border border-[#D94B4B]/30 bg-white"
          >
            <div className="flex items-center justify-between border-b border-[#D94B4B]/25 bg-[#D94B4B]/10 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <PhoneCall
                  className="h-4 w-4 text-[#D94B4B]"
                  aria-hidden="true"
                />
                <h2
                  id="quick-hotlines-heading"
                  className="text-[15px] font-bold text-[#991B1B]"
                >
                  24/7 Emergency & Crisis Hotlines
                </h2>
              </div>
              <Link
                href="/kaligtasan"
                className="text-[12.5px] font-semibold text-[#D94B4B] hover:underline"
              >
                Full Directory →
              </Link>
            </div>
            <div className="divide-y divide-slate-200 text-[13px]">
              {VERIFIED_EMERGENCY_HOTLINES.slice(0, 5).map((hot) => (
                <div
                  key={hot.id}
                  className="flex items-center justify-between px-4 py-2.5"
                >
                  <div>
                    <span className="font-semibold text-slate-900">
                      {hot.agencyName}
                    </span>
                    <span className="block text-[11.5px] text-[#64748B]">
                      {hot.coverage}
                    </span>
                  </div>
                  <a
                    href={`tel:${hot.primaryNumber.replace(/[^0-9+]/g, "")}`}
                    className="gabay-interactive rounded-md border border-[#D94B4B]/30 bg-[#D94B4B]/10 px-2.5 py-1 font-mono text-xs font-bold text-[#D94B4B] hover:bg-[#D94B4B] hover:text-white"
                  >
                    {hot.primaryNumber}
                  </a>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
