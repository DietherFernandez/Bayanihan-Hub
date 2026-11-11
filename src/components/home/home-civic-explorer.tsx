"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AlertTriangle, ExternalLink } from "lucide-react";
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
    <section className="border-t border-[#E2E8F0] pt-6">
      <div className="flex items-center justify-between pb-2.5">
        <h2 className="text-[16px] sm:text-[18px] font-bold tracking-tight text-[#172B45]">
          Public Assistance &amp; Opportunities
        </h2>
      </div>

      {/* Segmented Tab Switcher (Editorial style, no boxes) */}
      <div className="no-scrollbar mb-4 flex gap-4 overflow-x-auto whitespace-nowrap border-b border-[#E2E8F0] pb-0 text-[13px] font-semibold text-[#64748B]">
        <button
          type="button"
          onClick={() => setActiveTab("aid")}
          className={`pb-2.5 transition ${
            activeTab === "aid"
              ? "border-b-2 border-[#173B67] font-bold text-[#173B67]"
              : "hover:text-[#172B45]"
          }`}
        >
          Financial &amp; Medical Aid ({assistancePrograms.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("jobs")}
          className={`pb-2.5 transition ${
            activeTab === "jobs"
              ? "border-b-2 border-[#173B67] font-bold text-[#173B67]"
              : "hover:text-[#172B45]"
          }`}
        >
          Jobs &amp; Scholarships ({opportunities.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("alert")}
          className={`pb-2.5 transition ${
            activeTab === "alert"
              ? "border-b-2 border-[#173B67] font-bold text-[#173B67]"
              : "hover:text-[#172B45]"
          }`}
        >
          Public Advisories &amp; Hotlines
        </button>
      </div>

      {/* Tab 1: Financial & Medical Aid */}
      {activeTab === "aid" && (
        <div className="space-y-2.5">
          {assistancePrograms.slice(0, 4).map((prog) => (
            <div
              key={prog.id}
              className="rounded-xl border border-[#E2E8F0] bg-white p-3 sm:p-3.5 transition hover:border-slate-300 shadow-2xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase text-[#16866B]">
                  {prog.programType} · {prog.organizationName}
                </span>
                <span className="text-[11px] text-[#64748B]">{prog.regionName}</span>
              </div>
              <Link
                href={`/pera?item=${encodeURIComponent(prog.slug)}`}
                className="mt-1 block text-[13px] sm:text-[14px] font-bold text-[#172B45] hover:text-[#173B67] hover:underline"
              >
                {prog.programName}
              </Link>
              <p className="mt-0.5 text-[12.5px] sm:text-[13px] text-[#64748B] line-clamp-2 leading-relaxed">
                {prog.benefitSummary}
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#E2E8F0] pt-2 text-[11.5px]">
                <span className="text-[#64748B]">
                  Required: <strong className="font-medium text-[#172B45]">{prog.requiredDocuments[0]}</strong>
                </span>
                <Link
                  href={`/pera?item=${encodeURIComponent(prog.slug)}`}
                  className="font-semibold text-[#173B67] hover:underline"
                >
                  View requirements checklist →
                </Link>
              </div>
            </div>
          ))}
          <div className="pt-2 text-center">
            <Link
              href="/pera"
              className="text-[13px] font-semibold text-[#173B67] hover:underline"
            >
              Explore all financial assistance programs →
            </Link>
          </div>
        </div>
      )}

      {/* Tab 2: Jobs & Scholarships */}
      {activeTab === "jobs" && (
        <div className="space-y-2.5">
          {opportunities.slice(0, 4).map((opp) => (
            <div
              key={opp.id}
              className="rounded-xl border border-[#E2E8F0] bg-white p-3 sm:p-3.5 transition hover:border-slate-300 shadow-2xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase text-[#173B67]">
                  {opp.type} · {opp.organizationName}
                </span>
                <span className="text-[11px] text-[#64748B]">{opp.regionCode}</span>
              </div>
              <a
                href={opp.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex items-center gap-1 text-[13px] sm:text-[14px] font-bold text-[#172B45] hover:text-[#173B67] hover:underline"
              >
                <span>{opp.title}</span>
                <ExternalLink className="h-3 w-3 text-[#64748B]" />
              </a>
              <p className="mt-0.5 text-[12.5px] sm:text-[13px] text-[#64748B] line-clamp-2 leading-relaxed">
                {opp.description}
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#E2E8F0] pt-2 text-[11.5px]">
                <span className="font-semibold text-[#16866B]">
                  {opp.compensationOrBenefit}
                </span>
                <Link
                  href="/trabaho"
                  className="font-semibold text-[#173B67] hover:underline"
                >
                  Apply via Official Portal →
                </Link>
              </div>
            </div>
          ))}
          <div className="pt-2 text-center">
            <Link
              href="/trabaho"
              className="text-[13px] font-semibold text-[#173B67] hover:underline"
            >
              Explore all jobs &amp; scholarships directory →
            </Link>
          </div>
        </div>
      )}

      {/* Tab 3: Advisories & Hotlines */}
      {activeTab === "alert" && (
        <div className="space-y-2.5">
          {announcements.slice(0, 2).map((ann) => (
            <div
              key={ann.id}
              className="rounded-xl border border-red-200 bg-red-50/40 p-3 sm:p-3.5"
            >
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-800">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>{ann.severity === "emergency" ? "Emergency Advisory" : "Citizen Advisory"}</span>
              </div>
              <h3 className="mt-1 text-[13px] sm:text-[14px] font-bold text-[#172B45]">
                {ann.title}
              </h3>
              <p className="mt-0.5 text-[12.5px] text-[#64748B] leading-relaxed">{ann.summary}</p>
              <div className="mt-2 flex items-center justify-between text-[11.5px] text-[#64748B]">
                <span>Source: {ann.sourceName}</span>
                <a
                  href={ann.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#173B67] hover:underline"
                >
                  Official notice →
                </a>
              </div>
            </div>
          ))}

          {/* Emergency Hotlines Quick Strip */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-3 sm:p-3.5 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
              <span className="text-[13px] font-bold text-[#172B45]">
                24/7 Emergency Hotlines
              </span>
              <Link
                href="/kaligtasan#hotlines"
                className="text-[11.5px] font-semibold text-[#B83A3A] hover:underline"
              >
                Full directory →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2.5 sm:grid-cols-4">
              {hotlines.slice(0, 4).map((hot) => (
                <a
                  key={hot.id}
                  href={`tel:${hot.primaryNumber.replace(/[^0-9+]/g, "")}`}
                  className="flex flex-col rounded-lg border border-[#E2E8F0] bg-[#F5F7FA] p-2 text-center transition hover:border-red-200 hover:bg-red-50/50"
                >
                  <span className="font-mono text-sm font-bold text-red-800">
                    {hot.primaryNumber}
                  </span>
                  <span className="truncate text-[10.5px] text-[#64748B]">
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
