"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, PhoneCall, AlertTriangle, ExternalLink } from "lucide-react";
import type {
  AssistanceProgramRecord,
  OpportunityRecord,
  AnnouncementRecord,
  EmergencyHotlineRecord,
} from "@/types/database";

export function HomeCivicExplorer({
  assistancePrograms,
  opportunities,
  announcements,
  hotlines,
}: {
  assistancePrograms: AssistanceProgramRecord[];
  opportunities: OpportunityRecord[];
  announcements: AnnouncementRecord[];
  hotlines: EmergencyHotlineRecord[];
}) {
  const [activeTab, setActiveTab] = useState<"aid" | "jobs" | "alert">("aid");

  return (
    <section className="border-t border-slate-200/80 pt-6">
      <div className="flex items-center justify-between pb-3">
        <h2 className="text-sm font-bold tracking-tight text-slate-900 sm:text-base">
          Public Assistance &amp; Opportunities
        </h2>
      </div>

      {/* Segmented Tab Switcher (Editorial style, no boxes) */}
      <div className="no-scrollbar mb-4 flex gap-4 overflow-x-auto whitespace-nowrap border-b border-slate-200 pb-0 text-xs font-semibold text-slate-500">
        <button
          type="button"
          onClick={() => setActiveTab("aid")}
          className={`pb-2.5 transition ${
            activeTab === "aid"
              ? "border-b-2 border-[#17365D] font-bold text-[#17365D]"
              : "hover:text-slate-800"
          }`}
        >
          Financial &amp; Medical Aid ({assistancePrograms.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("jobs")}
          className={`pb-2.5 transition ${
            activeTab === "jobs"
              ? "border-b-2 border-[#17365D] font-bold text-[#17365D]"
              : "hover:text-slate-800"
          }`}
        >
          Jobs &amp; Scholarships ({opportunities.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("alert")}
          className={`pb-2.5 transition ${
            activeTab === "alert"
              ? "border-b-2 border-[#17365D] font-bold text-[#17365D]"
              : "hover:text-slate-800"
          }`}
        >
          Public Advisories &amp; Hotlines
        </button>
      </div>

      {/* Tab 1: Financial & Medical Aid */}
      {activeTab === "aid" && (
        <div className="space-y-3">
          {assistancePrograms.slice(0, 4).map((prog) => (
            <div
              key={prog.id}
              className="rounded-xl border border-slate-200/80 p-3.5 transition hover:border-slate-300 sm:p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-800">
                  {prog.programType} · {prog.organizationName}
                </span>
                <span className="text-[11px] text-slate-500">{prog.regionName}</span>
              </div>
              <Link
                href={`/pera?item=${encodeURIComponent(prog.slug)}`}
                className="mt-1 block text-xs font-bold text-slate-900 hover:text-[#17365D] hover:underline sm:text-sm"
              >
                {prog.programName}
              </Link>
              <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                {prog.benefitSummary}
              </p>
              <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
                <span className="text-[11px] text-slate-500">
                  Key: {prog.requiredDocuments[0]}
                </span>
                <Link
                  href={`/pera?item=${encodeURIComponent(prog.slug)}`}
                  className="font-semibold text-[#17365D] hover:underline"
                >
                  View requirements checklist →
                </Link>
              </div>
            </div>
          ))}
          <div className="pt-2 text-center">
            <Link
              href="/pera"
              className="text-xs font-semibold text-[#17365D] hover:underline"
            >
              Explore all financial assistance programs →
            </Link>
          </div>
        </div>
      )}

      {/* Tab 2: Jobs & Scholarships */}
      {activeTab === "jobs" && (
        <div className="space-y-3">
          {opportunities.slice(0, 4).map((opp) => (
            <div
              key={opp.id}
              className="rounded-xl border border-slate-200/80 p-3.5 transition hover:border-slate-300 sm:p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-800">
                  {opp.type} · {opp.organizationName}
                </span>
                <span className="text-[11px] text-slate-500">{opp.regionCode}</span>
              </div>
              <a
                href={opp.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-[#17365D] hover:underline sm:text-sm"
              >
                <span>{opp.title}</span>
                <ExternalLink className="h-3 w-3 text-slate-400" />
              </a>
              <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                {opp.description}
              </p>
              <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
                <span className="text-[11px] font-medium text-emerald-800">
                  {opp.compensationOrBenefit}
                </span>
                <Link
                  href="/trabaho"
                  className="font-semibold text-[#17365D] hover:underline"
                >
                  Apply via Official Portal →
                </Link>
              </div>
            </div>
          ))}
          <div className="pt-2 text-center">
            <Link
              href="/trabaho"
              className="text-xs font-semibold text-[#17365D] hover:underline"
            >
              Explore all jobs &amp; scholarships directory →
            </Link>
          </div>
        </div>
      )}

      {/* Tab 3: Advisories & Hotlines */}
      {activeTab === "alert" && (
        <div className="space-y-3">
          {announcements.slice(0, 2).map((ann) => (
            <div
              key={ann.id}
              className="rounded-xl border border-red-200 bg-red-50/40 p-3.5"
            >
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-800">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>{ann.severity === "emergency" ? "Emergency Advisory" : "Citizen Advisory"}</span>
              </div>
              <h3 className="mt-1 text-xs font-bold text-slate-900 sm:text-sm">
                {ann.title}
              </h3>
              <p className="mt-0.5 text-xs text-slate-600">{ann.summary}</p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>Source: {ann.sourceName}</span>
                <a
                  href={ann.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#17365D] hover:underline"
                >
                  Official notice →
                </a>
              </div>
            </div>
          ))}

          {/* Emergency Hotlines Quick Strip */}
          <div className="rounded-xl border border-slate-200 bg-white p-3.5">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-bold text-slate-900">
                24/7 Emergency Numbers
              </span>
              <Link
                href="/kaligtasan#hotlines"
                className="text-[11px] font-semibold text-[#B83A3A] hover:underline"
              >
                Full directory →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {hotlines.slice(0, 4).map((hot) => (
                <a
                  key={hot.id}
                  href={`tel:${hot.primaryNumber.replace(/[^0-9+]/g, "")}`}
                  className="flex flex-col rounded-lg border border-slate-100 bg-slate-50 p-2 text-center hover:border-red-200 hover:bg-red-50/50"
                >
                  <span className="font-mono text-sm font-bold text-red-800">
                    {hot.primaryNumber}
                  </span>
                  <span className="truncate text-[10px] text-slate-500">
                    {hot.agencyName}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
