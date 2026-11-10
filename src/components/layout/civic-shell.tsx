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
  UserPlus,
  Compass,
  Info,
} from "lucide-react";
import { useCitizenState } from "@/components/providers/citizen-state-provider";
import { useThemeAndToast } from "@/components/providers/theme-provider";
import { canAccessAdminDashboard } from "@/lib/auth/rbac";
import { CompactDrawer } from "@/components/ui/design-system";

export const PLATFORM_MODULE_LINKS = [
  {
    href: "/trabaho",
    label: "Trabaho",
    sublabel: "Jobs, Resume & Training",
    icon: Briefcase,
  },
  {
    href: "/serbisyo",
    label: "Serbisyo",
    sublabel: "Gov Guides & IDs",
    icon: FileCheck2,
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
    sublabel: "Donations & Volunteering",
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
      aria-label="Primary Platform Navigation"
      className="hidden lg:flex lg:items-center lg:gap-1"
    >
      <Link
        href="/#explore-modules"
        className={`gabay-interactive inline-flex min-h-[36px] items-center gap-1.5 rounded-md px-2.5 py-1 text-[13px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C] ${
          pathname === "/"
            ? "bg-[#17365D]/10 text-[#17365D]"
            : "text-slate-700 hover:bg-slate-100 hover:text-[#17365D]"
        }`}
      >
        <Compass className="h-3.5 w-3.5 text-[#087F8C]" aria-hidden="true" />
        <span>Explore</span>
      </Link>

      {PLATFORM_MODULE_LINKS.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`gabay-interactive inline-flex min-h-[36px] items-center gap-1.5 rounded-md px-2.5 py-1 text-[13px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C] ${
              isActive
                ? "bg-[#17365D] text-white"
                : "text-slate-700 hover:bg-slate-100 hover:text-[#17365D]"
            }`}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        );
      })}

      <Link
        href="/about"
        className={`gabay-interactive inline-flex min-h-[36px] items-center gap-1.5 rounded-md px-2.5 py-1 text-[13px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C] ${
          pathname === "/about"
            ? "bg-[#17365D] text-white"
            : "text-slate-700 hover:bg-slate-100 hover:text-[#17365D]"
        }`}
      >
        <Info className="h-3.5 w-3.5" aria-hidden="true" />
        <span>About</span>
      </Link>
    </nav>
  );
}

export function MobileBottomNavigation({ pathname }: { pathname: string }) {
  return (
    <nav
      aria-label="Quick Mobile Bottom Navigation"
      className="no-print fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-slate-200 bg-white py-1 md:hidden"
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
      <div className="border-b border-slate-200/20 bg-[#17365D] px-3 py-1 text-[11.5px] text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck
              className="h-3.5 w-3.5 text-[#16A36A]"
              aria-hidden="true"
            />
            <span>
              <strong>GabayPH</strong> · Independent Public-Service &amp; Community Guide
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/kaligtasan#hotlines"
              className="gabay-interactive inline-flex items-center gap-1 rounded bg-[#D94B4B] px-2 py-0.5 text-[11px] font-semibold text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <PhoneCall className="h-3 w-3" aria-hidden="true" />
              <span>Emergency: 911 / 143</span>
            </Link>
            {isStaff && (
              <Link
                href="/admin"
                className="gabay-interactive inline-flex items-center gap-1 rounded border border-white/25 bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white hover:bg-white/20"
              >
                <LayoutDashboard className="h-3 w-3" aria-hidden="true" />
                <span>Admin</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Compact Main Navigation Row */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2 sm:px-6">
        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#17365D] text-xs font-bold tracking-tight text-white">
              PH
            </div>
            <div>
              <span className="block text-[15px] font-bold leading-none tracking-tight text-slate-900">
                GabayPH
              </span>
              <span className="hidden text-[11px] text-[#64748B] sm:block">
                Your Everyday Guide to a Better Life.
              </span>
            </div>
          </Link>

          <DesktopNavigation pathname={pathname} />
        </div>

        {/* Right Utility Actions: Search, Bookmarks, Theme, Login & Register */}
        <div className="flex items-center gap-1.5">
          <Link
            href="/assistant"
            aria-label="GabayAI Grounded Assistant"
            className={`gabay-interactive inline-flex min-h-[36px] items-center gap-1.5 rounded-md border px-2.5 py-1 text-[12px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C] ${
              pathname === "/assistant"
                ? "border-[#087F8C] bg-[#087F8C]/10 text-[#087F8C]"
                : "border-slate-300 bg-[#F7F9FC] text-[#17365D] hover:border-[#087F8C]"
            }`}
          >
            <Compass className="h-3.5 w-3.5 text-[#087F8C]" aria-hidden="true" />
            <span className="hidden sm:inline">GabayAI</span>
          </Link>

          <Link
            href="/search"
            aria-label="Universal Search"
            className={`gabay-interactive inline-flex min-h-[36px] items-center gap-1.5 rounded-md border px-2.5 py-1 text-[12px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C] ${
              pathname === "/search"
                ? "border-[#087F8C] bg-[#087F8C]/10 text-[#087F8C]"
                : "border-slate-300 bg-[#F7F9FC] text-slate-700 hover:border-[#087F8C]"
            }`}
          >
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden xl:inline">Search</span>
          </Link>

          <Link
            href="/bookmarks"
            aria-label={`Saved Bookmarks (${bookmarks.length})`}
            className={`gabay-interactive inline-flex min-h-[36px] items-center gap-1 rounded-md border px-2 py-1 text-[12px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C] ${
              pathname === "/bookmarks"
                ? "border-[#087F8C] bg-[#087F8C]/10 text-[#087F8C]"
                : "border-slate-300 bg-white text-slate-700 hover:border-[#087F8C]"
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
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
            className="gabay-interactive inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 hover:border-[#087F8C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]"
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
              className="gabay-interactive inline-flex min-h-[36px] items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-[12px] font-semibold text-slate-800 hover:border-[#087F8C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]"
            >
              <User className="h-3.5 w-3.5 text-[#087F8C]" aria-hidden="true" />
              <span className="max-w-[90px] truncate">{user.fullName}</span>
            </Link>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link
                href="/login"
                className="gabay-interactive inline-flex min-h-[36px] items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-[12px] font-semibold text-slate-800 hover:border-[#087F8C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]"
              >
                <User className="h-3.5 w-3.5 text-[#17365D]" aria-hidden="true" />
                <span>Login</span>
              </Link>
              <Link
                href="/register"
                className="gabay-interactive hidden min-h-[36px] items-center gap-1 rounded-md bg-[#17365D] px-2.5 py-1 text-[12px] font-semibold text-white hover:bg-[#102847] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C] sm:inline-flex"
              >
                <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Register</span>
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
            className="gabay-interactive inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 lg:hidden"
          >
            <Menu className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Compact Slide-over Mobile Drawer */}
      <CompactDrawer
        open={drawerOpen}
        title="GabayPH Navigation"
        onClose={() => setDrawerOpen(false)}
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <p className="gabay-label uppercase tracking-wider text-[#64748B]">
              Explore Modules
            </p>
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

          <div className="space-y-1.5 border-t border-slate-200 pt-3">
            <p className="gabay-label uppercase tracking-wider text-[#64748B]">
              Platform &amp; Account
            </p>
            <Link
              href="/about"
              onClick={() => setDrawerOpen(false)}
              className="block rounded-md px-2.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100"
            >
              About GabayPH
            </Link>
            <Link
              href="/reports"
              onClick={() => setDrawerOpen(false)}
              className="block rounded-md px-2.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100"
            >
              Report Incorrect Information
            </Link>
            {!user && (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-md border border-slate-300 bg-white py-2 text-center text-xs font-semibold text-slate-800"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-md bg-[#17365D] py-2 text-center text-xs font-semibold text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
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
            <p className="mt-1 text-[12px] font-semibold text-slate-700">
              Your Everyday Guide to a Better Life.
            </p>
            <p className="mt-2 leading-relaxed">
              Free, mobile-first public service directory, employment guide, financial calculators, and emergency resource platform for every Filipino.
            </p>
            <p className="mt-2 text-[11px]">
              Independent Platform Notice: GabayPH is not a government agency. We link directly to official <code>.gov.ph</code> portals and never charge fees or approve applications.
            </p>
          </div>

          <div>
            <h3 className="gabay-label uppercase tracking-wider text-slate-900">
              Explore Categories
            </h3>
            <ul className="mt-2.5 space-y-1.5">
              <li>
                <Link
                  href="/trabaho"
                  className="hover:text-[#087F8C] hover:underline"
                >
                  Trabaho (Jobs, Resume &amp; Training)
                </Link>
              </li>
              <li>
                <Link
                  href="/serbisyo"
                  className="hover:text-[#087F8C] hover:underline"
                >
                  Serbisyo (Government Guides &amp; Checklists)
                </Link>
              </li>
              <li>
                <Link
                  href="/pera"
                  className="hover:text-[#087F8C] hover:underline"
                >
                  Pera (Financial Aid &amp; Calculators)
                </Link>
              </li>
              <li>
                <Link
                  href="/bayanihan"
                  className="hover:text-[#087F8C] hover:underline"
                >
                  Bayanihan (Donations &amp; Volunteering)
                </Link>
              </li>
              <li>
                <Link
                  href="/aral"
                  className="hover:text-[#087F8C] hover:underline"
                >
                  Aral (Free Courses &amp; Scholarships)
                </Link>
              </li>
              <li>
                <Link
                  href="/kaligtasan"
                  className="hover:text-[#087F8C] hover:underline"
                >
                  Kaligtasan (Hotlines &amp; Evacuation Directory)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="gabay-label uppercase tracking-wider text-slate-900">
              Information &amp; Governance
            </h3>
            <ul className="mt-2.5 space-y-1.5">
              <li>
                <Link
                  href="/about"
                  className="hover:text-[#087F8C] hover:underline"
                >
                  About GabayPH
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-[#087F8C] hover:underline"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-[#087F8C] hover:underline"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#087F8C] hover:underline"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/reports"
                  className="hover:text-[#087F8C] hover:underline"
                >
                  Report Incorrect Information
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
            © {new Date().getFullYear()} GabayPH — Your Everyday Guide to a Better Life. All rights reserved.
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
