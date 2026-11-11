import React from "react";
import Link from "next/link";
import {
  Briefcase,
  FileCheck2,
  Wallet,
  GraduationCap,
  HeartHandshake,
  ShieldAlert,
  ShieldCheck,
  Flag,
} from "lucide-react";
import { ServicePreviewRow } from "@/components/home/service-preview-row";
import { HomeCivicExplorer } from "@/components/home/home-civic-explorer";
import { UniversalSearchHero } from "@/components/search/universal-search-bar";
import { EmptyState } from "@/components/ui/design-system";
import {
  ACTIVE_ANNOUNCEMENTS,
  VERIFIED_ASSISTANCE_PROGRAMS,
  VERIFIED_EMERGENCY_HOTLINES,
  VERIFIED_OPPORTUNITIES,
  VERIFIED_RESOURCES,
} from "@/lib/constants/philippine-data";

/** Launcher order: Trabaho, Serbisyo, Pera, Aral, Bayanihan, Kaligtasan. */
const LAUNCHER_ITEMS = [
  { name: "Trabaho", href: "/trabaho", icon: Briefcase, color: "text-[#17365D] bg-blue-50" },
  { name: "Serbisyo", href: "/serbisyo", icon: FileCheck2, color: "text-teal-800 bg-teal-50" },
  { name: "Pera", href: "/pera", icon: Wallet, color: "text-emerald-800 bg-emerald-50" },
  { name: "Aral", href: "/aral", icon: GraduationCap, color: "text-indigo-800 bg-indigo-50" },
  { name: "Bayanihan", href: "/bayanihan", icon: HeartHandshake, color: "text-amber-800 bg-amber-50" },
  { name: "Kaligtasan", href: "/kaligtasan", icon: ShieldAlert, color: "text-red-700 bg-red-50" },
];

export default function HomePage() {
  const popularGovernmentServices = VERIFIED_RESOURCES.filter(
    (res) => res.module === "serbisyo" || res.organizationSlug === "pag-ibig"
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-7 space-y-7">
      {/* =====================================================================
          SECTION B: HERO & SEARCH (Compact, High-Trust, iPhone-Inspired)
          ===================================================================== */}
      <section aria-labelledby="hero-heading" className="space-y-2.5">
        <div>
          <h1
            id="hero-heading"
            className="text-[23px] sm:text-[26px] font-bold tracking-tight text-[#172B45] leading-snug"
          >
            Ano ang kailangan mong tulong ngayon?
          </h1>
          <p className="mt-1 text-[13px] sm:text-[14px] text-[#64748B] leading-relaxed">
            Official Philippine government procedures, emergency assistance, and citizen guides.
          </p>
        </div>

        <UniversalSearchHero />
      </section>

      {/* =====================================================================
          SECTION C: 6 CORE CATEGORIES (3-Column Mobile / 6-Column Desktop)
          ===================================================================== */}
      <section id="explore-modules" aria-labelledby="modules-heading" className="pt-0.5">
        <div className="flex items-center justify-between pb-2.5">
          <h2
            id="modules-heading"
            className="text-[16px] sm:text-[18px] font-bold tracking-tight text-[#172B45]"
          >
            Services &amp; Programs
          </h2>
          <Link
            href="/search"
            className="text-[13px] font-semibold text-[#173B67] hover:underline"
          >
            Explore all →
          </Link>
        </div>

        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-2.5">
          {LAUNCHER_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex flex-col items-center justify-center rounded-xl border border-[#E2E8F0] bg-white p-2.5 sm:p-3 text-center transition hover:border-slate-300 hover:bg-slate-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173B67]"
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition group-hover:scale-105 ${item.color}`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="mt-1.5 text-[12px] sm:text-[13px] font-semibold text-[#172B45]">
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* =====================================================================
          SECTION D: POPULAR GOVERNMENT SERVICES (Open Editorial List)
          ===================================================================== */}
      <section
        aria-labelledby="popular-services-heading"
        className="border-t border-[#E2E8F0] pt-6"
      >
        <div className="flex items-center justify-between pb-2.5">
          <h2
            id="popular-services-heading"
            className="text-[16px] sm:text-[18px] font-bold tracking-tight text-[#172B45]"
          >
            Popular Government Services
          </h2>
          <span className="text-[11.5px] sm:text-[12px] text-[#64748B]">Official verified checklists</span>
        </div>

        {popularGovernmentServices.length === 0 ? (
          <EmptyState
            title="No verified government services available"
            description="Verified service guides are currently being updated."
          />
        ) : (
          <div className="divide-y divide-[#E2E8F0] border-y border-[#E2E8F0]">
            {popularGovernmentServices.slice(0, 6).map((res) => (
              <ServicePreviewRow key={res.id} resource={res} />
            ))}
          </div>
        )}

        <div className="pt-2.5 text-center">
          <Link
            href="/serbisyo"
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#173B67] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173B67]"
          >
            View all services (50+) <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* =====================================================================
          SECTION E: TABBED CIVIC EXPLORER (Opportunities + Financial Aid)
          ===================================================================== */}
      <div className="sr-only">
        <h2>Opportunities: Jobs, Scholarships &amp; Free Training</h2>
        <h2>Financial &amp; Medical Assistance Programs</h2>
      </div>

      <HomeCivicExplorer
        assistancePrograms={VERIFIED_ASSISTANCE_PROGRAMS}
        opportunities={VERIFIED_OPPORTUNITIES}
        announcements={ACTIVE_ANNOUNCEMENTS}
        hotlines={VERIFIED_EMERGENCY_HOTLINES}
      />

      {/* =====================================================================
          SECTION F: INSTITUTIONAL TRUST & PUBLIC INFORMATION
          ===================================================================== */}
      <section
        aria-labelledby="trust-verification-heading"
        className="border-t border-[#E2E8F0] pt-6 text-[12.5px] text-[#64748B] space-y-3"
      >
        <div className="flex items-center gap-1.5 font-bold text-[#173B67]">
          <ShieldCheck className="h-4 w-4 text-[#16866B]" aria-hidden="true" />
          <h2 id="trust-verification-heading" className="text-[14px] sm:text-[15px] font-bold text-[#172B45]">
            How GabayPH Verifies Public Information
          </h2>
        </div>

        <p className="leading-relaxed text-[12.5px] sm:text-[13px]">
          <strong className="text-[#172B45]">Public Service Guarantee:</strong> GabayPH is an independent civic information platform and is <strong>not a government agency</strong>. Every service guide is cross-referenced with Republic Acts, official Citizen&apos;s Charters, and official <code>.gov.ph</code> portals. We distinguish strictly between officially verified agency processes and community-submitted mutual aid. We never charge fees or process government documents.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1 text-[12px] font-semibold text-[#64748B]">
          <Link href="/about" className="hover:text-[#173B67] hover:underline">
            About GabayPH Standards
          </Link>
          <span>·</span>
          <Link href="/reports" className="inline-flex items-center gap-1 hover:underline text-[#B83A3A]">
            <Flag className="h-3 w-3" />
            <span>Report Incorrect Information</span>
          </Link>
          <span>·</span>
          <Link href="/privacy" className="hover:text-[#173B67] hover:underline">
            Privacy Policy
          </Link>
          <span>·</span>
          <Link href="/terms" className="hover:text-[#173B67] hover:underline">
            Terms of Service
          </Link>
        </div>
      </section>
    </div>
  );
}
