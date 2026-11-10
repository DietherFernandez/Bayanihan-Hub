"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  PhoneCall,
  Search,
  Briefcase,
  FileCheck2,
  Wallet,
  HeartHandshake,
  GraduationCap,
  ShieldAlert,
  Bookmark,
  User,
  LayoutDashboard,
  Home,
} from "lucide-react";
import { useCitizenState } from "@/components/providers/citizen-state-provider";
import { canAccessAdminDashboard } from "@/lib/auth/rbac";

const MODULE_LINKS = [
  {
    href: "/serbisyo",
    label: "Serbisyo",
    sublabel: "Gov Guides & IDs",
    icon: FileCheck2,
  },
  {
    href: "/trabaho",
    label: "Trabaho",
    sublabel: "Jobs & Resume",
    icon: Briefcase,
  },
  {
    href: "/pera",
    label: "Pera",
    sublabel: "Aid & Calculators",
    icon: Wallet,
  },
  {
    href: "/bayanihan",
    label: "Bayanihan",
    sublabel: "Community & Relief",
    icon: HeartHandshake,
  },
  {
    href: "/aral",
    label: "Aral",
    sublabel: "Free Courses & Grants",
    icon: GraduationCap,
  },
  {
    href: "/kaligtasan",
    label: "Kaligtasan",
    sublabel: "Hotlines & Evac",
    icon: ShieldAlert,
  },
];

export function CivicHeader() {
  const pathname = usePathname();
  const { user, bookmarks } = useCitizenState();
  const isStaff = canAccessAdminDashboard(user?.role);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      {/* Top Civic Trust & Emergency Strip */}
      <div className="border-b border-slate-200 bg-slate-900 px-3 py-1.5 text-xs text-slate-100">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
            <span>
              <strong>GabayPH</strong> · Free Public Information & Community Guide · Verified Official Sources
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/kaligtasan#hotlines"
              className="inline-flex items-center gap-1 rounded bg-red-700 px-2 py-0.5 font-semibold text-white hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <PhoneCall className="h-3 w-3" aria-hidden="true" />
              <span>Emergency: 911 / Red Cross 143</span>
            </Link>
            {isStaff && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1 rounded border border-slate-600 bg-slate-800 px-2 py-0.5 text-slate-100 hover:bg-slate-700"
              >
                <LayoutDashboard className="h-3 w-3" aria-hidden="true" />
                <span>Admin Console</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-2.5 sm:px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B3D91]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#0B3D91] text-sm font-bold tracking-tight text-white">
              PH
            </div>
            <div>
              <span className="block text-base font-bold leading-none tracking-tight text-slate-900">
                GabayPH
              </span>
              <span className="block text-[11px] text-slate-600">
                Your Everyday Guide to a Better Life
              </span>
            </div>
          </Link>

          <nav
            aria-label="Primary Platform Modules"
            className="hidden lg:flex lg:items-center lg:gap-1"
          >
            {MODULE_LINKS.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B3D91] ${
                    isActive
                      ? "bg-[#0B3D91] text-white"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/search"
            className={`inline-flex min-h-[38px] items-center gap-1.5 rounded border px-2.5 py-1.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B3D91] ${
              pathname === "/search"
                ? "border-[#0B3D91] bg-blue-50 text-[#0B3D91]"
                : "border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Universal Search</span>
            <span className="sm:hidden">Search</span>
          </Link>

          <Link
            href="/bookmarks"
            aria-label={`Saved Bookmarks (${bookmarks.length})`}
            className={`inline-flex min-h-[38px] items-center gap-1.5 rounded border px-2.5 py-1.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B3D91] ${
              pathname === "/bookmarks"
                ? "border-[#0B3D91] bg-blue-50 text-[#0B3D91]"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden md:inline">Saved</span>
            {bookmarks.length > 0 && (
              <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] font-semibold text-slate-800">
                {bookmarks.length}
              </span>
            )}
          </Link>

          {user ? (
            <Link
              href="/profile"
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B3D91]"
            >
              <User className="h-3.5 w-3.5 text-[#0B3D91]" aria-hidden="true" />
              <span className="max-w-[100px] truncate">{user.fullName}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded bg-[#0B3D91] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#082d6b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B3D91]"
            >
              <User className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>

      {/* Tablet / Compact Horizontal Module Strip (No Full-Screen Mobile Modal) */}
      <div className="border-t border-slate-200 bg-slate-50 px-3 py-1.5 lg:hidden">
        <nav
          aria-label="Mobile Module Bar"
          className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto pb-0.5"
        >
          {MODULE_LINKS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium ${
                  isActive
                    ? "bg-[#0B3D91] text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export function CivicFooter() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white pb-20 text-xs text-slate-600 md:pb-8">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-[#0B3D91] text-xs text-white">
                PH
              </span>
              <span>GabayPH</span>
            </div>
            <p className="mt-2 leading-relaxed text-slate-600">
              Your Everyday Guide to a Better Life. Free, mobile-first public service directory, employment guide, financial calculators, and emergency resource platform for every Filipino.
            </p>
            <p className="mt-2 text-[11px] text-slate-500">
              Disclaimer: GabayPH links directly to verified `.gov.ph` agencies and humanitarian institutions. We never charge fees or process government applications on your behalf.
            </p>
          </div>

          <div>
            <h3 className="font-semibold uppercase tracking-wider text-slate-900">
              Platform Modules
            </h3>
            <ul className="mt-2.5 space-y-1.5">
              <li>
                <Link href="/serbisyo" className="hover:text-[#0B3D91] hover:underline">
                  Serbisyo (Government Guides & Checklists)
                </Link>
              </li>
              <li>
                <Link href="/trabaho" className="hover:text-[#0B3D91] hover:underline">
                  Trabaho (Jobs, Resume Builder & Scam Report)
                </Link>
              </li>
              <li>
                <Link href="/pera" className="hover:text-[#0B3D91] hover:underline">
                  Pera (Financial Aid & Budget Calculators)
                </Link>
              </li>
              <li>
                <Link href="/bayanihan" className="hover:text-[#0B3D91] hover:underline">
                  Bayanihan (Donations, Volunteering & Orgs)
                </Link>
              </li>
              <li>
                <Link href="/aral" className="hover:text-[#0B3D91] hover:underline">
                  Aral (Free Courses & Scholarships)
                </Link>
              </li>
              <li>
                <Link href="/kaligtasan" className="hover:text-[#0B3D91] hover:underline">
                  Kaligtasan (911 Hotlines & Evacuation Directory)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold uppercase tracking-wider text-slate-900">
              Citizen Tools & Privacy
            </h3>
            <ul className="mt-2.5 space-y-1.5">
              <li>
                <Link href="/search" className="hover:text-[#0B3D91] hover:underline">
                  Universal Search Directory
                </Link>
              </li>
              <li>
                <Link href="/bookmarks" className="hover:text-[#0B3D91] hover:underline">
                  Saved Resources & Checklists
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-[#0B3D91] hover:underline">
                  Search History & Privacy Controls
                </Link>
              </li>
              <li>
                <Link href="/reports" className="hover:text-[#0B3D91] hover:underline">
                  Submitted Correction & Scam Reports
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#0B3D91] hover:underline">
                  Admin & Content Verification Console
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold uppercase tracking-wider text-slate-900">
              National Emergency Hotlines
            </h3>
            <dl className="mt-2.5 space-y-1.5 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <dt className="font-sans text-slate-600">National Emergency:</dt>
                <dd className="font-bold text-red-700">911</dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <dt className="font-sans text-slate-600">Philippine Red Cross:</dt>
                <dd className="font-bold text-red-700">143</dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <dt className="font-sans text-slate-600">Citizens&apos; Complaint:</dt>
                <dd className="font-semibold text-slate-900">8888</dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <dt className="font-sans text-slate-600">CICC Anti-Scam:</dt>
                <dd className="font-semibold text-slate-900">1326</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-sans text-slate-600">NCMH Crisis Line:</dt>
                <dd className="font-semibold text-slate-900">1553</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-4 text-[11px] text-slate-500">
          <span>
            © {new Date().getFullYear()} GabayPH Public Service Platform. Built for accessibility, privacy, and civic trust.
          </span>
          <span>No browsing account required · Data Privacy Act of 2012 (RA 10173) aligned</span>
        </div>
      </div>

      {/* Compact Sticky Bottom Bar for Small Mobile Screens (< 768px) */}
      <nav
        aria-label="Quick Mobile Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-slate-200 bg-white py-1.5 md:hidden"
      >
        <Link
          href="/"
          className="flex min-w-[60px] flex-col items-center gap-0.5 py-1 text-[11px] font-medium text-slate-700 hover:text-[#0B3D91]"
        >
          <Home className="h-4 w-4" aria-hidden="true" />
          <span>Home</span>
        </Link>
        <Link
          href="/search"
          className="flex min-w-[60px] flex-col items-center gap-0.5 py-1 text-[11px] font-medium text-slate-700 hover:text-[#0B3D91]"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span>Search</span>
        </Link>
        <Link
          href="/serbisyo"
          className="flex min-w-[60px] flex-col items-center gap-0.5 py-1 text-[11px] font-medium text-slate-700 hover:text-[#0B3D91]"
        >
          <FileCheck2 className="h-4 w-4" aria-hidden="true" />
          <span>Serbisyo</span>
        </Link>
        <Link
          href="/kaligtasan"
          className="flex min-w-[60px] flex-col items-center gap-0.5 py-1 text-[11px] font-medium text-red-700"
        >
          <PhoneCall className="h-4 w-4" aria-hidden="true" />
          <span>911 / Evac</span>
        </Link>
        <Link
          href="/bookmarks"
          className="flex min-w-[60px] flex-col items-center gap-0.5 py-1 text-[11px] font-medium text-slate-700 hover:text-[#0B3D91]"
        >
          <Bookmark className="h-4 w-4" aria-hidden="true" />
          <span>Saved</span>
        </Link>
      </nav>
    </footer>
  );
}
