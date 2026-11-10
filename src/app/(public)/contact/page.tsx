import React from "react";
import Link from "next/link";
import { PhoneCall, Flag, ShieldAlert, ExternalLink } from "lucide-react";
import { VERIFIED_EMERGENCY_HOTLINES } from "@/lib/constants/philippine-data";

export const metadata = {
  title: "Contact & Official Channels — GabayPH",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 border-b border-slate-200 pb-4">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-[#17365D]/10 px-2.5 py-0.5 text-[12px] font-semibold text-[#17365D]">
          <PhoneCall className="h-3.5 w-3.5 text-[#087F8C]" aria-hidden="true" />
          <span>Contact &amp; Reporting Channels</span>
        </span>
        <h1 className="gabay-page-title mt-2">
          Contact, Feedback &amp; Official Hotlines
        </h1>
        <p className="gabay-body mt-1">
          Report outdated information on GabayPH or reach verified national government and emergency hotlines directly.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2">
            <Flag className="h-4 w-4 text-[#087F8C]" aria-hidden="true" />
            <h2 className="gabay-section-title">Report Incorrect Information</h2>
          </div>
          <p className="gabay-body mt-2">
            Found an outdated requirement, fee change, broken agency link, or suspected scam? Submit a verification report directly through our public reporting queue.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <Link
              href="/reports"
              className="gabay-interactive inline-flex items-center gap-1.5 rounded-md bg-[#17365D] px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-[#102847]"
            >
              <span>Open Verification Reports Queue</span>
            </Link>
            <Link
              href="/trabaho#scam-report"
              className="gabay-interactive inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-800 hover:border-[#087F8C]"
            >
              <span>Report a Job Scam</span>
            </Link>
          </div>
        </section>

        <section className="rounded-lg border border-[#D94B4B]/30 bg-white p-5">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-[#D94B4B]" aria-hidden="true" />
            <h2 className="gabay-section-title">Official National Hotlines</h2>
          </div>
          <p className="gabay-body mt-2">
            For immediate emergencies, government red tape complaints (8888), or cybercrime reporting (1326), contact the official agencies directly:
          </p>
          <ul className="mt-3 space-y-2 text-[13px]">
            {VERIFIED_EMERGENCY_HOTLINES.slice(0, 4).map((hot) => (
              <li
                key={hot.id}
                className="flex items-center justify-between border-b border-slate-100 pb-1.5"
              >
                <span className="font-medium text-slate-800">
                  {hot.agencyName}
                </span>
                <a
                  href={`tel:${hot.primaryNumber.replace(/[^0-9+]/g, "")}`}
                  className="font-mono font-bold text-[#D94B4B] hover:underline"
                >
                  {hot.primaryNumber}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <Link
              href="/kaligtasan#hotlines"
              className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#087F8C] hover:underline"
            >
              <span>View complete Kaligtasan Hotline Directory</span>
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
