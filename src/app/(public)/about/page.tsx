import React from "react";
import Link from "next/link";
import { ShieldCheck, ExternalLink, Flag, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "About GabayPH — Independent Public-Service & Community Guide",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 border-b border-slate-200 pb-4">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-[#17365D]/10 px-2.5 py-0.5 text-[12px] font-semibold text-[#17365D]">
          <ShieldCheck className="h-3.5 w-3.5 text-[#087F8C]" aria-hidden="true" />
          <span>About GabayPH</span>
        </span>
        <h1 className="gabay-page-title mt-2">
          Your Everyday Guide to a Better Life
        </h1>
        <p className="gabay-body mt-1.5">
          GabayPH is an independent, free, mobile-first public-information and community-resource platform built to help ordinary Filipinos navigate essential services, employment, financial assistance, education, community support, and emergency preparedness.
        </p>
      </div>

      <div className="space-y-6">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="gabay-section-title">Independent Civic Platform Disclosure</h2>
          <p className="gabay-body mt-2">
            <strong>GabayPH is not a government agency</strong> and does not process applications, collect statutory fees, or issue official approvals on behalf of any government office. Instead, GabayPH organizes publicly available requirements and links citizens directly to official <code>.gov.ph</code> portals and verified humanitarian organizations.
          </p>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="gabay-section-title">How We Verify Information</h2>
          <ul className="mt-3 space-y-2 text-[14px] text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16A36A]" aria-hidden="true" />
              <span>
                <strong>Official Source Links:</strong> Every public service guide cites the responsible agency and provides a direct link to its official portal.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16A36A]" aria-hidden="true" />
              <span>
                <strong>Verification Status &amp; Timestamps:</strong> Entries display clear status indicators (<em>Officially verified</em>, <em>Source available, verification pending</em>, or <em>Archived or outdated</em>) along with the last verified date.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16A36A]" aria-hidden="true" />
              <span>
                <strong>Citizen Correction Reports:</strong> Anyone can report outdated requirements, broken links, or suspected scams without creating an account.
              </span>
            </li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-3 pt-2">
            <Link
              href="/reports"
              className="gabay-interactive inline-flex items-center gap-1.5 rounded-md bg-[#17365D] px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-[#102847]"
            >
              <Flag className="h-3.5 w-3.5" aria-hidden="true" />
              <span>View &amp; Submit Correction Reports</span>
            </Link>
            <Link
              href="/search"
              className="gabay-interactive inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-800 hover:border-[#087F8C]"
            >
              <span>Explore Universal Search</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
