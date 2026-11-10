import React from "react";
import Link from "next/link";
import {
  FileCheck2,
  Briefcase,
  Wallet,
  HeartHandshake,
  GraduationCap,
  ShieldAlert,
  ArrowUpRight,
  AlertTriangle,
  Info,
  PhoneCall,
  CheckCircle2,
  Calculator,
  FileText,
} from "lucide-react";
import { UniversalSearchHero } from "@/components/search/universal-search-bar";
import { VerificationBadge } from "@/components/trust/verification-badge";
import {
  ACTIVE_ANNOUNCEMENTS,
  VERIFIED_ASSISTANCE_PROGRAMS,
  VERIFIED_EMERGENCY_HOTLINES,
  VERIFIED_OPPORTUNITIES,
  VERIFIED_RESOURCES,
} from "@/lib/constants/philippine-data";

const SIX_MODULES = [
  {
    code: "SERBISYO",
    name: "Serbisyo",
    href: "/serbisyo",
    icon: FileCheck2,
    summary:
      "Step-by-step government ID & civil registry checklists, fees, processing times, and official agency portals.",
    highlights: ["PSA Birth Certificate", "NBI Clearance (RA 11261)", "PhilSys Digital ID", "PhilHealth & SSS"],
  },
  {
    code: "TRABAHO",
    name: "Trabaho",
    href: "/trabaho",
    icon: Briefcase,
    summary:
      "Verified CSC & DOLE PhilJobNet openings, interactive printable Resume Builder, TESDA skills training, and Job Scam Reporting.",
    highlights: ["Verified Gov & Private Jobs", "Interactive Resume Builder", "RA 11261 Free Requirements", "Scam Reporting"],
  },
  {
    code: "PERA",
    name: "Pera",
    href: "/pera",
    icon: Wallet,
    summary:
      "DSWD AICS, Malasakit Centers, and DOLE TUPAD aid directory plus interactive Budget, Savings, and Debt Repayment calculators.",
    highlights: ["DSWD AICS & Malasakit Guide", "Monthly Budget Calculator", "MP2 & Emergency Savings Planner", "Debt Payoff Tool"],
  },
  {
    code: "BAYANIHAN",
    name: "Bayanihan",
    href: "/bayanihan",
    icon: HeartHandshake,
    summary:
      "Moderated community donation hubs, Red Cross 143 & DSWD NROC volunteer opportunities, and verified local relief requests.",
    highlights: ["DSWD NROC Relief Volunteering", "Red Cross 143 Network", "Community Aid Requests", "Verified NGOs & LGUs"],
  },
  {
    code: "ARAL",
    name: "Aral",
    href: "/aral",
    icon: GraduationCap,
    summary:
      "150+ free TESDA Online Program courses, CHED Merit & UniFAST scholarships, and personal learning progress tracker.",
    highlights: ["Free e-TESDA Courses", "CHED Merit Scholarships", "Skills Certification Guide", "Progress Tracker"],
  },
  {
    code: "KALIGTASAN",
    name: "Kaligtasan",
    href: "/kaligtasan",
    icon: ShieldAlert,
    summary:
      "National 911, Red Cross 143, NDRRMC, and NCMH 1553 hotlines, LGU evacuation center directory, and 72-hour Go-Bag checklists.",
    highlights: ["24/7 Emergency Hotlines", "Evacuation Center Directory", "72-Hour Go-Bag Checklist", "First-Aid Protocols"],
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8">
      {/* Hero & Universal Search Section */}
      <section aria-labelledby="hero-heading" className="mb-8">
        <div className="mb-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#0B3D91]">
            <span>Public Service & Citizen Resource Platform</span>
          </div>
          <h1
            id="hero-heading"
            className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            GabayPH: Your Everyday Guide to a Better Life
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
            Find verified Philippine government requirements, employment opportunities, medical and financial assistance, free skills training, community relief, and emergency hotlines in one accessible place.
          </p>
        </div>

        <UniversalSearchHero />
      </section>

      {/* Active Verified Public Advisories */}
      <section aria-labelledby="advisories-heading" className="mb-8">
        <div className="mb-2.5 flex items-center justify-between">
          <h2
            id="advisories-heading"
            className="text-sm font-bold uppercase tracking-wider text-slate-800"
          >
            Active Verified Public Advisories
          </h2>
          <span className="text-xs text-slate-500">
            Automatically archived upon expiry
          </span>
        </div>

        <div className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
          {ACTIVE_ANNOUNCEMENTS.map((ann) => (
            <div
              key={ann.id}
              className="flex flex-col justify-between gap-2 p-3.5 sm:flex-row sm:items-center"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  {ann.severity === "emergency" ? (
                    <span className="inline-flex items-center gap-1 rounded bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-900">
                      <AlertTriangle className="h-3 w-3 text-red-700" aria-hidden="true" />
                      <span>Public Safety Advisory</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-[#0B3D91]">
                      <Info className="h-3 w-3" aria-hidden="true" />
                      <span>Citizen Rights & Directive</span>
                    </span>
                  )}
                  <VerificationBadge status={ann.verificationStatus} />
                  <span className="text-xs text-slate-500">
                    Source: {ann.sourceName}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {ann.title}
                </h3>
                <p className="text-xs leading-relaxed text-slate-600">
                  {ann.summary}
                </p>
              </div>
              <div className="shrink-0">
                <a
                  href={ann.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-100"
                >
                  <span>Official Advisory</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Six Core Platform Modules Directory (Structured Civic Index) */}
      <section aria-labelledby="modules-heading" className="mb-8">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2
              id="modules-heading"
              className="text-lg font-bold tracking-tight text-slate-900"
            >
              Browse by Service Module
            </h2>
            <p className="text-xs text-slate-600">
              Direct access to verified checklists, interactive tools, and official directories — no account required.
            </p>
          </div>
          <Link
            href="/search"
            className="text-xs font-semibold text-[#0B3D91] hover:underline"
          >
            View all indexed records →
          </Link>
        </div>

        <div className="grid grid-cols-1 divide-y divide-slate-200 overflow-hidden rounded-md border border-slate-200 bg-white md:grid-cols-2 md:divide-x md:divide-y">
          {SIX_MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.code}
                className="flex flex-col justify-between p-4 transition-colors hover:bg-slate-50/80 sm:p-5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      href={mod.href}
                      className="group inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B3D91]"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded border border-blue-200 bg-blue-50 text-[#0B3D91]">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div>
                        <span className="text-base font-bold text-slate-900 group-hover:text-[#0B3D91] group-hover:underline">
                          {mod.name}
                        </span>
                        <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600">
                          MODULE
                        </span>
                      </div>
                    </Link>

                    <Link
                      href={mod.href}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#0B3D91] hover:underline"
                    >
                      <span>Open</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {mod.summary}
                  </p>
                </div>

                <div className="mt-3.5 flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
                  {mod.highlights.map((item) => (
                    <Link
                      key={item}
                      href={mod.href}
                      className="inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:border-[#0B3D91] hover:text-[#0B3D91]"
                    >
                      <CheckCircle2 className="h-3 w-3 text-emerald-700" aria-hidden="true" />
                      <span>{item}</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Two-Column Essential Civic Access: Essential Checklists + Interactive Tools & Hotlines */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left 7 Columns: Most Requested Government Checklists & Assistance */}
        <section
          aria-labelledby="essential-guides-heading"
          className="lg:col-span-7"
        >
          <div className="rounded-md border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div>
                <h2
                  id="essential-guides-heading"
                  className="text-sm font-bold text-slate-900"
                >
                  Most Requested Government Services & Financial Aid
                </h2>
                <p className="text-xs text-slate-500">
                  Verified document checklists, statutory fees, and official links
                </p>
              </div>
              <Link
                href="/serbisyo"
                className="text-xs font-semibold text-[#0B3D91] hover:underline"
              >
                All Serbisyo Guides →
              </Link>
            </div>

            <div className="divide-y divide-slate-200">
              {VERIFIED_RESOURCES.slice(0, 5).map((res) => (
                <div key={res.id} className="p-3.5 hover:bg-slate-50">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-800">
                      {res.organizationAcronym}
                    </span>
                    <VerificationBadge
                      status={res.verificationStatus}
                      lastVerifiedAt={res.lastVerifiedAt}
                    />
                  </div>
                  <Link
                    href={`/${res.module}?item=${encodeURIComponent(res.slug)}`}
                    className="mt-1.5 block text-sm font-semibold text-[#0B3D91] hover:underline"
                  >
                    {res.title}
                  </Link>
                  <p className="mt-1 text-xs text-slate-600">{res.summary}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                    <span>
                      <strong>Fee:</strong> {res.feesSummary}
                    </span>
                    <span>
                      <strong>Processing:</strong> {res.processingTime}
                    </span>
                  </div>
                </div>
              ))}

              {VERIFIED_ASSISTANCE_PROGRAMS.slice(0, 2).map((aid) => (
                <div key={aid.id} className="p-3.5 hover:bg-slate-50">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-900">
                      FINANCIAL & MEDICAL AID
                    </span>
                    <VerificationBadge
                      status={aid.verificationStatus}
                      lastVerifiedAt={aid.lastVerifiedAt}
                    />
                  </div>
                  <Link
                    href={`/pera?item=${encodeURIComponent(aid.slug)}`}
                    className="mt-1.5 block text-sm font-semibold text-[#0B3D91] hover:underline"
                  >
                    {aid.programName}
                  </Link>
                  <p className="mt-1 text-xs text-slate-600">
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
            className="rounded-md border border-slate-200 bg-white"
          >
            <div className="border-b border-slate-200 px-4 py-3">
              <h2
                id="interactive-tools-heading"
                className="text-sm font-bold text-slate-900"
              >
                Free Citizen Self-Service Tools
              </h2>
              <p className="text-xs text-slate-500">
                Runs privately in your browser — no sign-up required
              </p>
            </div>
            <div className="divide-y divide-slate-200 text-xs">
              <Link
                href="/pera#calculators"
                className="flex items-start justify-between gap-3 p-3.5 hover:bg-slate-50"
              >
                <div className="flex items-start gap-2.5">
                  <Calculator
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#0B3D91]"
                    aria-hidden="true"
                  />
                  <div>
                    <span className="font-semibold text-slate-900">
                      Household Budget, Savings & Debt Calculators
                    </span>
                    <p className="mt-0.5 text-slate-600">
                      Compute 50/30/20 allocation, Pag-IBIG MP2 / emergency fund goals, and debt payoff schedules.
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>

              <Link
                href="/trabaho#resume-builder"
                className="flex items-start justify-between gap-3 p-3.5 hover:bg-slate-50"
              >
                <div className="flex items-start gap-2.5">
                  <FileText
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#0B3D91]"
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
            className="rounded-md border border-slate-200 bg-white"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <h2
                id="latest-opportunities-heading"
                className="text-sm font-bold text-slate-900"
              >
                Verified Jobs, Scholarships & Training
              </h2>
              <Link
                href="/trabaho"
                className="text-xs font-semibold text-[#0B3D91] hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="divide-y divide-slate-200 text-xs">
              {VERIFIED_OPPORTUNITIES.map((opp) => (
                <div key={opp.id} className="p-3.5 hover:bg-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold uppercase text-slate-500">
                      {opp.type} · {opp.organizationName}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">
                      {opp.regionCode}
                    </span>
                  </div>
                  <Link
                    href={
                      opp.type === "scholarship"
                        ? `/aral?item=${encodeURIComponent(opp.slug)}`
                        : `/trabaho?item=${encodeURIComponent(opp.slug)}`
                    }
                    className="mt-1 block font-semibold text-[#0B3D91] hover:underline"
                  >
                    {opp.title}
                  </Link>
                  <p className="mt-0.5 text-slate-600">
                    {opp.compensationOrBenefit}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Emergency Hotlines Box */}
          <section
            aria-labelledby="quick-hotlines-heading"
            className="rounded-md border border-red-200 bg-white"
          >
            <div className="flex items-center justify-between border-b border-red-200 bg-red-50 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-red-700" aria-hidden="true" />
                <h2
                  id="quick-hotlines-heading"
                  className="text-sm font-bold text-red-950"
                >
                  24/7 Emergency & Crisis Hotlines
                </h2>
              </div>
              <Link
                href="/kaligtasan"
                className="text-xs font-semibold text-red-800 hover:underline"
              >
                Full Directory →
              </Link>
            </div>
            <div className="divide-y divide-slate-200 text-xs">
              {VERIFIED_EMERGENCY_HOTLINES.slice(0, 5).map((hot) => (
                <div
                  key={hot.id}
                  className="flex items-center justify-between px-4 py-2.5"
                >
                  <div>
                    <span className="font-semibold text-slate-900">
                      {hot.agencyName}
                    </span>
                    <span className="block text-[11px] text-slate-500">
                      {hot.coverage}
                    </span>
                  </div>
                  <a
                    href={`tel:${hot.primaryNumber.replace(/[^0-9+]/g, "")}`}
                    className="rounded border border-red-200 bg-red-50 px-2.5 py-1 font-mono text-xs font-bold text-red-800 hover:bg-red-100"
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
