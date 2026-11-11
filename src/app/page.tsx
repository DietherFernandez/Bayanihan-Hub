import React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  AlertTriangle,
  Info,
  PhoneCall,
  Calculator,
  FileText,
  ShieldCheck,
  ExternalLink,
  Flag,
  CheckCircle2,
  MapPin,
  Clock,
  Briefcase,
  FileCheck2,
  Wallet,
  GraduationCap,
  HeartHandshake,
  ShieldAlert,
} from "lucide-react";
import { ServicePreviewRow } from "@/components/home/service-preview-row";
import { UniversalSearchHero } from "@/components/search/universal-search-bar";
import { VerificationBadge } from "@/components/trust/verification-badge";
import {
  EmptyState,
  OpportunityListingRow,
} from "@/components/ui/design-system";
import {
  ACTIVE_ANNOUNCEMENTS,
  VERIFIED_ASSISTANCE_PROGRAMS,
  VERIFIED_BAYANIHAN_POSTS,
  VERIFIED_EMERGENCY_HOTLINES,
  VERIFIED_OPPORTUNITIES,
  VERIFIED_RESOURCES,
} from "@/lib/constants/philippine-data";
import { formatVerifiedDate } from "@/lib/utils";

/** Launcher order: Trabaho, Serbisyo, Pera, Aral, Bayanihan, Kaligtasan. */
const LAUNCHER_ITEMS = [
  { name: "Trabaho", href: "/trabaho", icon: Briefcase },
  { name: "Serbisyo", href: "/serbisyo", icon: FileCheck2 },
  { name: "Pera", href: "/pera", icon: Wallet },
  { name: "Aral", href: "/aral", icon: GraduationCap },
  { name: "Bayanihan", href: "/bayanihan", icon: HeartHandshake },
  { name: "Kaligtasan", href: "/kaligtasan", icon: ShieldAlert },
];

export default function HomePage() {
  const popularGovernmentServices = VERIFIED_RESOURCES.filter(
    (res) => res.module === "serbisyo" || res.organizationSlug === "pag-ibig"
  );

  return (
    <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-7">
      {/* =====================================================================
          SECTION B: HERO AND UNIVERSAL SEARCH
          ===================================================================== */}
      <section aria-labelledby="hero-heading" className="mb-7">
        <h1
          id="hero-heading"
          className="gabay-page-title mb-3 text-[24px] leading-tight text-[#17365D] sm:text-[30px]"
        >
          Ano ang kailangan mong tulong ngayon?
        </h1>
        <UniversalSearchHero />
      </section>

      {/* =====================================================================
          SECTION C: MAIN CATEGORIES (3-COLUMN LAUNCHER GRID)
          ===================================================================== */}
      <section
        id="explore-modules"
        aria-labelledby="modules-heading"
        className="mb-8"
      >
        <h2 id="modules-heading" className="gabay-section-title mb-3">
          Categories
        </h2>
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {LAUNCHER_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-[#17365D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#17365D]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#17365D]/10 text-[#17365D]">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="text-[13px] font-semibold text-slate-900">
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* =====================================================================
          SECTION D: POPULAR GOVERNMENT SERVICES (compact previews)
          ===================================================================== */}
      <section
        aria-labelledby="popular-services-heading"
        className="mb-8"
      >
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 id="popular-services-heading" className="gabay-section-title">
              Popular Government Services
            </h2>
          </div>

          {popularGovernmentServices.length === 0 ? (
            <div className="p-4">
              <EmptyState
                title="No verified government services available"
                description="Verified service guides are currently being updated."
              />
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {popularGovernmentServices.slice(0, 6).map((res) => (
                <ServicePreviewRow key={res.id} resource={res} />
              ))}
            </div>
          )}
          <Link
            href="/serbisyo"
            className="flex min-h-[48px] items-center justify-center gap-1 border-t border-slate-200 bg-slate-50 text-[14px] font-semibold text-[#17365D] hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#17365D]"
          >
            View all services (50+) <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* =====================================================================
          SECTION E & SECTION F: OPPORTUNITIES + FINANCIAL ASSISTANCE
          ===================================================================== */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* SECTION E: OPPORTUNITIES (Jobs, Scholarships, Free Training, Learning) */}
        <section
          aria-labelledby="opportunities-heading"
          className="lg:col-span-6"
        >
          <div className="flex h-full flex-col justify-between rounded-lg border border-slate-200 bg-white">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
                <div>
                  <h2
                    id="opportunities-heading"
                    className="gabay-section-title"
                  >
                    Opportunities: Jobs, Scholarships &amp; Free Training
                  </h2>
                  <p className="text-[12.5px] text-[#64748B]">
                    Verified CSC &amp; DOLE PhilJobNet openings, CHED scholarships, and free TESDA courses
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[12.5px] font-semibold">
                  <Link
                    href="/trabaho"
                    className="text-[#087F8C] hover:underline"
                  >
                    Trabaho →
                  </Link>
                  <Link
                    href="/aral"
                    className="text-[#087F8C] hover:underline"
                  >
                    Aral →
                  </Link>
                </div>
              </div>

              {VERIFIED_OPPORTUNITIES.length === 0 ? (
                <div className="p-4">
                  <EmptyState
                    title="No verified opportunities listed right now"
                    description="We only display verified employment, scholarship, and training opportunities with official source links."
                  />
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {VERIFIED_OPPORTUNITIES.map((opp) => (
                    <OpportunityListingRow key={opp.id} opportunity={opp} />
                  ))}
                </div>
              )}
            </div>

            {/* Citizen Career & Financial Self-Service Tools Bar */}
            <div className="border-t border-slate-200 bg-[#F7F9FC] p-3.5 text-[12.5px]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-slate-800">
                  Self-Service Tools:
                </span>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/trabaho#resume-builder"
                    className="gabay-interactive inline-flex items-center gap-1 rounded border border-slate-300 bg-white px-2.5 py-1 font-semibold text-[#17365D] hover:border-[#087F8C]"
                  >
                    <FileText className="h-3.5 w-3.5 text-[#087F8C]" aria-hidden="true" />
                    <span>Printable Resume Builder</span>
                  </Link>
                  <Link
                    href="/pera#calculators"
                    className="gabay-interactive inline-flex items-center gap-1 rounded border border-slate-300 bg-white px-2.5 py-1 font-semibold text-[#17365D] hover:border-[#087F8C]"
                  >
                    <Calculator className="h-3.5 w-3.5 text-[#087F8C]" aria-hidden="true" />
                    <span>Budget &amp; MP2 Calculators</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION F: FINANCIAL ASSISTANCE */}
        <section
          aria-labelledby="financial-assistance-heading"
          className="lg:col-span-6"
        >
          <div className="h-full rounded-lg border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
              <div>
                <h2
                  id="financial-assistance-heading"
                  className="gabay-section-title"
                >
                  Financial &amp; Medical Assistance Programs
                </h2>
                <p className="text-[12.5px] text-[#64748B]">
                  Eligibility, required documents, and application instructions from official sources
                </p>
              </div>
              <Link
                href="/pera"
                className="text-[12.5px] font-semibold text-[#087F8C] hover:underline"
              >
                All Pera Programs →
              </Link>
            </div>

            {VERIFIED_ASSISTANCE_PROGRAMS.length === 0 ? (
              <div className="p-4">
                <EmptyState
                  title="No verified assistance programs available"
                  description="We never fabricate financial assistance programs or promise approval."
                />
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {VERIFIED_ASSISTANCE_PROGRAMS.map((prog) => (
                  <article
                    key={prog.id}
                    className="gabay-interactive p-3.5 hover:bg-slate-50/80 sm:p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded bg-[#16A36A]/10 px-2 py-0.5 text-[11px] font-bold uppercase text-[#065F46]">
                        {prog.programType} · {prog.organizationName}
                      </span>
                      <VerificationBadge
                        status={prog.verificationStatus}
                        lastVerifiedAt={prog.lastVerifiedAt}
                      />
                    </div>

                    <Link
                      href={`/pera?item=${encodeURIComponent(prog.slug)}`}
                      className="mt-1.5 block text-[14.5px] font-semibold text-[#17365D] hover:text-[#087F8C] hover:underline"
                    >
                      {prog.programName}
                    </Link>

                    <p className="mt-1 text-[13px] text-slate-600">
                      {prog.benefitSummary}
                    </p>

                    <dl className="mt-2 grid grid-cols-1 gap-1 text-[12px] text-[#64748B] sm:grid-cols-2">
                      <div>
                        <dt className="inline font-semibold text-slate-700">
                          Eligibility:{" "}
                        </dt>
                        <dd className="inline">
                          {prog.eligibilityCriteria[0]}
                        </dd>
                      </div>
                      <div>
                        <dt className="inline font-semibold text-slate-700">
                          Key Requirement:{" "}
                        </dt>
                        <dd className="inline">{prog.requiredDocuments[0]}</dd>
                      </div>
                    </dl>

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[12px] text-[#64748B]">
                      <span>Coverage: {prog.regionName}</span>
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/pera?item=${encodeURIComponent(prog.slug)}`}
                          className="font-semibold text-[#17365D] hover:text-[#087F8C] hover:underline"
                        >
                          Application Steps →
                        </Link>
                        <a
                          href={prog.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-[#087F8C] hover:underline"
                        >
                          <span>Official Source</span>
                          <ExternalLink className="h-3 w-3" aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* =====================================================================
          SECTION G: COMMUNITY AND ANNOUNCEMENTS (BAYANIHAN & ADVISORIES)
          ===================================================================== */}
      <section
        aria-labelledby="community-announcements-heading"
        className="mb-8"
      >
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2
              id="community-announcements-heading"
              className="gabay-section-title"
            >
              Community Support, Volunteer Drives &amp; Official Advisories
            </h2>
            <p className="text-[13px] text-[#64748B]">
              Verified public announcements, volunteer opportunities, local organizations, and community assistance requests.
            </p>
          </div>
          <Link
            href="/bayanihan"
            className="text-[13px] font-semibold text-[#087F8C] hover:underline"
          >
            Open Bayanihan Hub →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Public Advisories & Announcements */}
          <div className="rounded-lg border border-slate-200 bg-white lg:col-span-6">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <h3 className="text-[15px] font-bold text-slate-900">
                Active Public Advisories
              </h3>
              <span className="text-[11.5px] text-[#64748B]">
                Auto-archived upon expiry
              </span>
            </div>

            {ACTIVE_ANNOUNCEMENTS.length === 0 ? (
              <div className="p-4">
                <EmptyState
                  title="No active announcements"
                  description="There are currently no active public advisories."
                />
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {ACTIVE_ANNOUNCEMENTS.map((ann) => (
                  <div key={ann.id} className="p-3.5 sm:p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {ann.severity === "emergency" ? (
                        <span className="inline-flex items-center gap-1 rounded bg-[#D94B4B]/15 px-2 py-0.5 text-[11px] font-semibold text-[#D94B4B]">
                          <AlertTriangle
                            className="h-3 w-3"
                            aria-hidden="true"
                          />
                          <span>Public Safety Advisory</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-[#17365D]/10 px-2 py-0.5 text-[11px] font-semibold text-[#17365D]">
                          <Info className="h-3 w-3" aria-hidden="true" />
                          <span>Citizen Advisory</span>
                        </span>
                      )}
                      <VerificationBadge status={ann.verificationStatus} />
                    </div>
                    <h4 className="mt-1.5 text-[14.5px] font-semibold text-slate-900">
                      {ann.title}
                    </h4>
                    <p className="mt-1 text-[13px] leading-relaxed text-slate-600">
                      {ann.summary}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[12px] text-[#64748B]">
                      <span>Source: {ann.sourceName}</span>
                      <a
                        href={ann.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-[#087F8C] hover:underline"
                      >
                        <span>Official Notice</span>
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bayanihan Community Drives & Emergency Hotlines */}
          <div className="space-y-6 lg:col-span-6">
            <div className="rounded-lg border border-slate-200 bg-white">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <h3 className="text-[15px] font-bold text-slate-900">
                  Verified Volunteer &amp; Community Drives
                </h3>
                <Link
                  href="/bayanihan"
                  className="text-[12px] font-semibold text-[#087F8C] hover:underline"
                >
                  Submit / View All →
                </Link>
              </div>

              {VERIFIED_BAYANIHAN_POSTS.length === 0 ? (
                <div className="p-4">
                  <EmptyState
                    title="No community drives listed"
                    description="Community assistance requests and volunteer drives will appear here once verified by moderators."
                  />
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {VERIFIED_BAYANIHAN_POSTS.map((post) => (
                    <div key={post.id} className="p-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11.5px]">
                        <span className="rounded bg-[#17365D]/10 px-2 py-0.5 font-mono font-bold uppercase text-[#17365D]">
                          {post.postType.replace("_", " ")}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[#64748B]">
                          <MapPin className="h-3 w-3 text-[#087F8C]" aria-hidden="true" />
                          <span>
                            {post.cityMunicipality} ({post.regionCode})
                          </span>
                        </span>
                      </div>
                      <Link
                        href={`/bayanihan?item=${encodeURIComponent(post.slug)}`}
                        className="mt-1 block text-[14px] font-semibold text-[#17365D] hover:text-[#087F8C] hover:underline"
                      >
                        {post.title}
                      </Link>
                      <p className="mt-0.5 text-[12.5px] text-slate-600">
                        {post.organizationName} · Contact: {post.contactChannel}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Emergency Hotlines Quick Bar */}
            <div className="rounded-lg border border-[#D94B4B]/30 bg-white">
              <div className="flex items-center justify-between border-b border-[#D94B4B]/20 bg-[#D94B4B]/10 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <PhoneCall
                    className="h-4 w-4 text-[#D94B4B]"
                    aria-hidden="true"
                  />
                  <h3 className="text-[14.5px] font-bold text-[#991B1B]">
                    24/7 Emergency &amp; Crisis Hotlines
                  </h3>
                </div>
                <Link
                  href="/kaligtasan#hotlines"
                  className="text-[12px] font-semibold text-[#D94B4B] hover:underline"
                >
                  Full Directory →
                </Link>
              </div>
              <div className="divide-y divide-slate-200 text-[13px]">
                {VERIFIED_EMERGENCY_HOTLINES.slice(0, 4).map((hot) => (
                  <div
                    key={hot.id}
                    className="flex items-center justify-between px-4 py-2"
                  >
                    <div>
                      <span className="font-semibold text-slate-900">
                        {hot.agencyName}
                      </span>
                      <span className="block text-[11px] text-[#64748B]">
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
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION H: TRUST AND VERIFICATION
          ===================================================================== */}
      <section
        aria-labelledby="trust-verification-heading"
        className="rounded-lg border border-slate-200 bg-white p-4 sm:p-6"
      >
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-[#087F8C]">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              <span>Content Trust, Sources &amp; Verification Standards</span>
            </div>
            <h2
              id="trust-verification-heading"
              className="gabay-section-title mt-1"
            >
              How GabayPH Verifies Public Information
            </h2>
            <p className="mt-1 text-[13px] text-slate-600">
              <strong>Important Disclosure:</strong> GabayPH is an independent civic guide and is <strong>not a government agency</strong>. We never charge fees, collect personal government applications, or claim authority to approve benefits.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <Link
              href="/reports"
              className="gabay-interactive inline-flex items-center gap-1.5 rounded-md bg-[#17365D] px-3.5 py-2 text-[12.5px] font-semibold text-white hover:bg-[#102847]"
            >
              <Flag className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Report Incorrect Information</span>
            </Link>
            <Link
              href="/about"
              className="gabay-interactive inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-[#F7F9FC] px-3.5 py-2 text-[12.5px] font-semibold text-slate-800 hover:border-[#087F8C]"
            >
              <span>About Our Standards</span>
            </Link>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 text-[13px] sm:grid-cols-3">
          <div className="rounded-md border border-slate-200 bg-[#F7F9FC] p-3.5">
            <div className="flex items-center gap-2 font-semibold text-slate-900">
              <CheckCircle2
                className="h-4 w-4 text-[#16A36A]"
                aria-hidden="true"
              />
              <span>1. Official Source Links Only</span>
            </div>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-600">
              Every service checklist, assistance guide, and hotline cites its responsible agency and links directly to the official <code>.gov.ph</code> or institutional portal.
            </p>
          </div>

          <div className="rounded-md border border-slate-200 bg-[#F7F9FC] p-3.5">
            <div className="flex items-center gap-2 font-semibold text-slate-900">
              <Clock className="h-4 w-4 text-[#087F8C]" aria-hidden="true" />
              <span>2. Transparent Verification Status</span>
            </div>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-600">
              Records clearly display whether they are <em>Officially verified</em> (last checked {formatVerifiedDate("2026-11-01")}), <em>Verification pending</em>, or <em>Archived</em>.
            </p>
          </div>

          <div className="rounded-md border border-slate-200 bg-[#F7F9FC] p-3.5">
            <div className="flex items-center gap-2 font-semibold text-slate-900">
              <Flag className="h-4 w-4 text-[#D99A28]" aria-hidden="true" />
              <span>3. Community Correction Queue</span>
            </div>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-600">
              Citizens can flag outdated fees, changed requirements, broken links, or suspected scams on any listing for immediate review by moderators.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
