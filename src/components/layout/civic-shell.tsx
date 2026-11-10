"use client";

import React, { useState } from "react";
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
  Sun,
  Moon,
  Menu,
} from "lucide-react";
import { useCitizenState } from "@/components/providers/citizen-state-provider";
import { useThemeAndToast } from "@/components/providers/theme-provider";
import { canAccessAdminDashboard } from "@/lib/auth/rbac";
import { CompactDrawer } from "@/components/ui/design-system";

export const PLATFORM_MODULE_LINKS = [
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

export function DesktopNavigation({ pathname }: { pathname: string }) {
  return (
    <nav
      aria-label="Primary Platform Modules"
      className="hidden lg:flex lg:items-center lg:gap-1"
    >
      {PLATFORM_MODULE_LINKS.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`gabay-interactive inline-flex min-h-[38px] items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C] ${
              isActive
                ? "bg-[#17365D] text-white"
                : "text-slate-700 hover:bg-slate-100 hover:text-[#17365D]"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileBottomNavigation({ pathname }: { pathname: string }) {
  return (
    <nav
      aria-label="Quick Mobile Bottom Navigation"
      className="no-print fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-slate-200 bg-white py-1.5 md:hidden"
    >
      <Link
        href="/"
        className={`flex min-h-[44px] min-w-[60px] flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${
          pathname === "/"
            ? "text-[#087F8C]"
            : "text-slate-600 hover:text-[#17365D]"
        }`}
      >
        <Home className="h-4 w-4" aria-hidden="true" />
        <span>Home</span>
      </Link>
      <Link
        href="/search"
        className={`flex min-h-[44px] min-w-[60px] flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${
          pathname === "/search"
            ? "text-[#087F8C]"
            : "text-slate-600 hover:text-[#17365D]"
        }`}
      >
        <Search className="h-4 w-4" aria-hidden="true" />
        <span>Search</span>
      </Link>
      <Link
        href="/serbisyo"
        className={`flex min-h-[44px] min-w-[60px] flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${
          pathname.startsWith("/serbisyo")
            ? "text-[#087F8C]"
            : "text-slate-600 hover:text-[#17365D]"
        }`}
      >
        <FileCheck2 className="h-4 w-4" aria-hidden="true" />
        <span>Serbisyo</span>
      </Link>
      <Link
        href="/kaligtasan"
        className="flex min-h-[44px] min-w-[60px] flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-[#D94B4B]"
      >
        <PhoneCall className="h-4 w-4" aria-hidden="true" />
        <span>911 / Evac</span>
      </Link>
      <Link
        href="/bookmarks"
        className={`flex min-h-[44px] min-w-[60px] flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${
          pathname === "/bookmarks"
            ? "text-[#087F8C]"
            : "text-slate-600 hover:text-[#17365D]"
        }`}
      >
        <Bookmark className="h-4 w-4" aria-hidden="true" />
        <span>Saved</span>
      </Link>
    </nav>
  );
}

export function CivicHeader() {
  const pathname = usePathname();
  const { user, bookmarks } = useCitizenState();
  const { theme, toggleTheme } = useThemeAndToast();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isStaff = canAccessAdminDashboard(user?.role);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      {/* Top Civic Trust & Emergency Strip */}
      <div className="border-b border-slate-200/20 bg-[#17365D] px-3 py-1.5 text-[12px] text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck
              className="h-3.5 w-3.5 text-[#16A36A]"
              aria-hidden="true"
            />
            <span>
              <strong>GabayPH</strong> · Official Public Information & Community Guide
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              href="/kaligtasan#hotlines"
              className="gabay-interactive inline-flex items-center gap-1 rounded bg-[#D94B4B] px-2 py-0.5 text-[11px] font-semibold text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <PhoneCall className="h-3 w-3" aria-hidden="true" />
              <span>Emergency: 911 / Red Cross 143</span>
            </Link>
            {isStaff && (
              <Link
                href="/admin"
                className="gabay-interactive inline-flex items-center gap-1 rounded border border-white/25 bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white hover:bg-white/20"
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
            className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#17365D] text-sm font-bold tracking-tight text-white">
              PH
            </div>
            <div>
              <span className="block text-[16px] font-bold leading-none tracking-tight text-slate-900">
                GabayPH
              </span>
              <span className="block text-[11.5px] text-[#64748B]">
                Your Everyday Guide to a Better Life
              </span>
            </div>
          </Link>

          <DesktopNavigation pathname={pathname} />
        </div>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/search"
            className={`gabay-interactive inline-flex min-h-[38px] items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[12.5px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C] ${
              pathname === "/search"
                ? "border-[#087F8C] bg-[#087F8C]/10 text-[#087F8C]"
                : "border-slate-300 bg-[#F7F9FC] text-slate-700 hover:border-[#087F8C]"
            }`}
          >
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Search</span>
          </Link>

          <Link
            href="/bookmarks"
            aria-label={`Saved Bookmarks (${bookmarks.length})`}
            className={`gabay-interactive inline-flex min-h-[38px] items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[12.5px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C] ${
              pathname === "/bookmarks"
                ? "border-[#087F8C] bg-[#087F8C]/10 text-[#087F8C]"
                : "border-slate-300 bg-white text-slate-700 hover:border-[#087F8C]"
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden md:inline">Saved</span>
            {bookmarks.length > 0 && (
              <span className="rounded-full bg-[#087F8C] px-1.5 py-0.2 text-[10px] font-bold text-white">
                {bookmarks.length}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            className="gabay-interactive inline-flex min-h-[38px] min-w-[38px] items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 hover:border-[#087F8C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-[#D99A28]" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4 text-[#17365D]" aria-hidden="true" />
            )}
          </button>

          {user ? (
            <Link
              href="/profile"
              className="gabay-interactive inline-flex min-h-[38px] items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-[12.5px] font-semibold text-slate-800 hover:border-[#087F8C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]"
            >
              <User className="h-3.5 w-3.5 text-[#087F8C]" aria-hidden="true" />
              <span className="max-w-[96px] truncate">{user.fullName}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="gabay-interactive inline-flex min-h-[38px] items-center gap-1.5 rounded-md bg-[#17365D] px-3 py-1.5 text-[12.5px] font-semibold text-white hover:bg-[#102847] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]"
            >
              <User className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Sign In</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open quick modules drawer"
            className="gabay-interactive inline-flex min-h-[38px] min-w-[38px] items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 lg:hidden"
          >
            <Menu className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Tablet / Compact Horizontal Module Strip */}
      <div className="border-t border-slate-200 bg-[#F7F9FC] px-3 py-1.5 lg:hidden">
        <nav
          aria-label="Mobile Module Bar"
          className="mx-auto flex max-w-7xl items-center gap-1.5 overflow-x-auto pb-0.5"
        >
          {PLATFORM_MODULE_LINKS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`gabay-interactive inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-semibold ${
                  isActive
                    ? "bg-[#17365D] text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-[#087F8C]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Compact Slide-over Drawer (Not a full-screen modal) */}
      <CompactDrawer
        open={drawerOpen}
        title="GabayPH Modules & Tools"
        onClose={() => setDrawerOpen(false)}
      >
        <div className="space-y-1.5">
          {PLATFORM_MODULE_LINKS.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.href}
                href={mod.href}
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 rounded-md border border-slate-200 bg-[#F7F9FC] p-2.5 text-xs hover:border-[#087F8C]"
              >
                <Icon
                  className="h-4 w-4 shrink-0 text-[#17365D]"
                  aria-hidden="true"
                />
                <div>
                  <div className="font-bold text-slate-900">{mod.label}</div>
                  <div className="text-[11px] text-[#64748B]">
                    {mod.sublabel}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </CompactDrawer>
    </header>
  );
}

export function CivicFooter() {
  const pathname = usePathname();
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white pb-20 text-[12.5px] text-[#64748B] md:pb-8">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-[#17365D] text-xs text-white">
                PH
              </span>
              <span>GabayPH</span>
            </div>
            <p className="mt-2 leading-relaxed">
              Your Everyday Guide to a Better Life. Free, mobile-first public service directory, employment guide, financial calculators, and emergency resource platform for every Filipino.
            </p>
            <p className="mt-2 text-[11px]">
              Disclaimer: GabayPH links directly to verified `.gov.ph` agencies and humanitarian institutions. We never charge fees or process government applications on your behalf.
            </p>
          </div>

          <div>
            <h3 className="gabay-label uppercase tracking-wider text-slate-900">
              Platform Modules
            </h3>
            <ul className="mt-2.5 space-y-1.5">
              <li>
                <Link
                  href="/serbisyo"
                  className="hover:text-[#087F8C] hover:underline"
                >
                  Serbisyo (Government Guides & Checklists)
                </Link>
              </li>
              <li>
                <Link
                  href="/trabaho"
                  className="hover:text-[#087F8C] hover:underline"
                >
                  Trabaho (Jobs, Resume Builder & Scam Report)
                </Link>
              </li>
              <li>
                <Link
                  href="/pera"
                  className="hover:text-[#087F8C] hover:underline"
                >
                  Pera (Financial Aid & Budget Calculators)
                </Link>
              </li>
              <li>
                <Link
                  href="/bayanihan"
                  className="hover:text-[#087F8C] hover:underline"
                >
                  Bayanihan (Donations, Volunteering & Orgs)
                </Link>
              </li>
              <li>
                <Link
                  href="/aral"
                  className="hover:text-[#087F8C] hover:underline"
                >
                  Aral (Free Courses & Scholarships)
                </Link>
              </li>
              <li>
                <Link
                  href="/kaligtasan"
                  className="hover:text-[#087F8C] hover:underline"
                >
                  Kaligtasan (911 Hotlines & Evacuation Directory)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="gabay-label uppercase tracking-wider text-slate-900">
              Citizen Tools & Privacy
            </h3>
            <ul className="mt-2.5 space-y-1.5">
              <li>
                <Link
                  href="/search"
                  className="hover:text-[#087F8C] hover:underline"
                >
                  Universal Search Directory
                </Link>
              </li>
              <li>
                <Link
                  href="/bookmarks"
                  className="hover:text-[#087F8C] hover:underline"
                >
                  Saved Resources & Checklists
                </Link>
              </li>
              <li>
                <Link
                  href="/history"
                  className="hover:text-[#087F8C] hover:underline"
                >
                  Search History & Privacy Controls
                </Link>
              </li>
              <li>
                <Link
                  href="/reports"
                  className="hover:text-[#087F8C] hover:underline"
                >
                  Submitted Correction & Scam Reports
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="hover:text-[#087F8C] hover:underline"
                >
                  Admin & Content Verification Console
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="gabay-label uppercase tracking-wider text-slate-900">
              National Emergency Hotlines
            </h3>
            <dl className="mt-2.5 space-y-1.5 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <dt className="font-sans">National Emergency:</dt>
                <dd className="font-bold text-[#D94B4B]">911</dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <dt className="font-sans">Philippine Red Cross:</dt>
                <dd className="font-bold text-[#D94B4B]">143</dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <dt className="font-sans">Citizens&apos; Complaint:</dt>
                <dd className="font-semibold text-slate-900">8888</dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <dt className="font-sans">CICC Anti-Scam:</dt>
                <dd className="font-semibold text-slate-900">1326</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-sans">NCMH Crisis Line:</dt>
                <dd className="font-semibold text-slate-900">1553</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-4 text-[11.5px]">
          <span>
            © {new Date().getFullYear()} GabayPH Public Service Platform. Unified Civic Design System.
          </span>
          <span>
            No browsing account required · Data Privacy Act of 2012 (RA 10173) aligned
          </span>
        </div>
      </div>

      <MobileBottomNavigation pathname={pathname} />
    </footer>
  );
}
