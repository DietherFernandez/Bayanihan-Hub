import React from "react";
import Link from "next/link";
import { Shield } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — GabayPH",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 border-b border-slate-200 pb-4">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-[#17365D]/10 px-2.5 py-0.5 text-[12px] font-semibold text-[#17365D]">
          <Shield className="h-3.5 w-3.5 text-[#087F8C]" aria-hidden="true" />
          <span>Data Privacy &amp; Citizen Protection</span>
        </span>
        <h1 className="gabay-page-title mt-2">Privacy Policy</h1>
        <p className="gabay-body mt-1">
          Aligned with the Philippine Data Privacy Act of 2012 (Republic Act No. 10173).
        </p>
      </div>

      <div className="space-y-5 rounded-lg border border-slate-200 bg-white p-5 text-[14px] leading-relaxed text-slate-700">
        <section>
          <h2 className="gabay-section-title">1. Browse Without Registration</h2>
          <p className="mt-1">
            You can search and read all public directories, government service checklists, emergency hotlines, and financial calculators on GabayPH without registering an account or providing personal information.
          </p>
        </section>

        <section>
          <h2 className="gabay-section-title">2. Data Minimization</h2>
          <p className="mt-1">
            When you optionally create a Citizen Account, we collect only your display name, email address, and preferred region. Interactive tools such as the Household Budget Calculator and Printable Resume Builder compute data locally in your browser.
          </p>
        </section>

        <section>
          <h2 className="gabay-section-title">3. Opt-In Search History &amp; Full Deletion</h2>
          <p className="mt-1">
            Search history is disabled by default for registered accounts. You may opt in, pause, clear your history, or permanently delete your account at any time via{" "}
            <Link href="/profile" className="font-semibold text-[#087F8C] underline">
              Profile &amp; Privacy Settings
            </Link>{" "}
            or{" "}
            <Link href="/history" className="font-semibold text-[#087F8C] underline">
              Search History Controls
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
