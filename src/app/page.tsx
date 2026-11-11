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
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 space-y-8">
      {/* =====================================================================
          SECTION B: HERO & SEARCH (Open, Minimalist, No Card Enclosure)
          ===================================================================== */}
      <section aria-labelledby="hero-heading" className="space-y-3">
        <div>
          <h1
            id="hero-heading"
            className="text-2xl font-extrabold tracking-tight text-[#17365D] sm:text-3xl"
          >
            Ano ang kailangan mong tulong ngayon?
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Official government procedures, emergency numbers, and financial assistance.
          </p>
        </div>

        <UniversalSearchHero />
      </section>

      {/* =====================================================================
          SECTION C: 6 CORE CATEGORIES (Open 3-Column / 6-Column Launcher)
          ===================================================================== */}
      <section id="explore-modules" aria-labelledby="modules-heading" className="pt-1">
        <div className="flex items-center justify-between pb-2.5">
          <h2
            id="modules-heading"
            className="text-xs font-bold uppercase tracking-wider text-slate-400"
          >
            Services &amp; Programs
          </h2>
          <Link
            href="/search"
            className="text-xs font-semibold text-[#17365D] hover:underline"
          >
            Explore all →
          </Link>
        </div>

        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
          {LAUNCHER_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex flex-col items-center justify-center rounded-xl border border-slate-100 p-3 text-center transition hover:border-slate-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#17365D]"
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition group-hover:scale-105 ${item.color}`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="mt-1.5 text-xs font-semibold text-slate-800">
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
        className="border-t border-slate-200/80 pt-6"
      >
        <div className="flex items-center justify-between pb-3">
          <h2
            id="popular-services-heading"
            className="text-sm font-bold tracking-tight text-slate-900 sm:text-base"
          >
            Popular Government Services
          </h2>
          <span className="text-[11px] text-slate-500">Official checklists</span>
        </div>

        {popularGovernmentServices.length === 0 ? (
          <EmptyState
            title="No verified government services available"
            description="Verified service guides are currently being updated."
          />
        ) : (
          <div className="divide-y divide-slate-100 border-y border-slate-200">
            {popularGovernmentServices.slice(0, 6).map((res) => (
              <ServicePreviewRow key={res.id} resource={res} />
            ))}
          </div>
        )}

        <div className="pt-3 text-center">
          <Link
            href="/serbisyo"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#17365D] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#17365D]"
          >
            View all services (50+) <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* =====================================================================
          SECTION E & F: TABBED CIVIC EXPLORER (Opportunities + Financial Aid)
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
          SECTION G: INSTITUTIONAL TRUST & NON-GOVERNMENT DISCLOSURE
          ===================================================================== */}
      <section
        aria-labelledby="trust-verification-heading"
        className="border-t border-slate-200/80 pt-6 text-xs text-slate-500 space-y-3"
      >
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#17365D]">
          <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          <h2 id="trust-verification-heading" className="text-xs font-bold text-slate-900">
            How GabayPH Verifies Public Information
          </h2>
        </div>

        <p className="leading-relaxed">
          <strong className="text-slate-800">Public Service Notice:</strong> GabayPH is an independent civic portal and is <strong>not a government agency</strong>. We link directly to official <code>.gov.ph</code> portals and never charge fees or approve applications. Every record is verified against published government charters.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11.5px] font-semibold text-slate-600">
          <Link href="/about" className="hover:underline">
            About GabayPH Standards
          </Link>
          <span>·</span>
          <Link href="/reports" className="inline-flex items-center gap-1 hover:underline text-[#B83A3A]">
            <Flag className="h-3 w-3" />
            <span>Report Incorrect Information</span>
          </Link>
          <span>·</span>
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <span>·</span>
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>
        </div>
      </section>
    </div>
  );
}
