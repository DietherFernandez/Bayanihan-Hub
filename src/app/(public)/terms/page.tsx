import React from "react";
import { FileText } from "lucide-react";

export const metadata = {
  title: "Terms of Service — GabayPH",
};

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 border-b border-slate-200 pb-4">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-[#17365D]/10 px-2.5 py-0.5 text-[12px] font-semibold text-[#17365D]">
          <FileText className="h-3.5 w-3.5 text-[#087F8C]" aria-hidden="true" />
          <span>Platform Terms</span>
        </span>
        <h1 className="gabay-page-title mt-2">Terms of Service</h1>
        <p className="gabay-body mt-1">
          Guidelines for using the GabayPH public information and community guide.
        </p>
      </div>

      <div className="space-y-5 rounded-lg border border-slate-200 bg-white p-5 text-[14px] leading-relaxed text-slate-700">
        <section>
          <h2 className="gabay-section-title">1. Informational Purpose &amp; Non-Affiliation</h2>
          <p className="mt-1">
            GabayPH provides structured guides and links to official Philippine government agencies and verified humanitarian organizations for public convenience. GabayPH is not a government entity and never guarantees application approval or financial grant disbursement.
          </p>
        </section>

        <section>
          <h2 className="gabay-section-title">2. Always Verify at Official Portals</h2>
          <p className="mt-1">
            Agency requirements, statutory fees, and schedules may change by official memorandum. Users should always confirm final instructions using the official <code>.gov.ph</code> source links provided on every listing.
          </p>
        </section>

        <section>
          <h2 className="gabay-section-title">3. Community Submissions &amp; Anti-Scam Policy</h2>
          <p className="mt-1">
            Submitting fraudulent job offers, fixer solicitations, or unverified payment demands is strictly prohibited. All community submissions undergo moderation and verification labeling.
          </p>
        </section>
      </div>
    </div>
  );
}
