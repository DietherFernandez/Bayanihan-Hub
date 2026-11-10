"use client";

import React from "react";
import { Flag, CheckCircle2, Clock } from "lucide-react";
import { useCitizenState } from "@/components/providers/citizen-state-provider";

export default function CitizenReportsPage() {
  const { reports } = useCitizenState();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 border-b border-slate-200 pb-4">
        <div className="inline-flex items-center gap-1.5 rounded bg-blue-50 px-2.5 py-0.5 text-xs font-bold uppercase text-[#0B3D91]">
          <Flag className="h-3.5 w-3.5" />
          <span>Public Verification & Scam Reports</span>
        </div>
        <h1 className="mt-1.5 text-xl font-bold text-slate-900">
          Submitted Content Correction & Anti-Scam Reports
        </h1>
        <p className="mt-1 text-xs text-slate-600">
          Track the verification status of reported document requirements, outdated fees, or suspected job scams.
        </p>
      </div>

      <div className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white text-xs">
        {reports.map((rep) => (
          <div key={rep.id} className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-700">
                  #{rep.id}
                </span>
                <span className="rounded bg-slate-100 px-2 py-0.5 font-semibold uppercase text-slate-800">
                  {rep.reason.replace("_", " ")}
                </span>
                <span className="text-slate-500">Submitted {rep.createdAt}</span>
              </div>

              {rep.resolutionStatus === "resolved" ? (
                <span className="inline-flex items-center gap-1 rounded border border-emerald-300 bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-900">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                  <span>Resolved & Verified</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded border border-amber-300 bg-amber-50 px-2 py-0.5 font-semibold text-amber-900">
                  <Clock className="h-3.5 w-3.5 text-amber-700" />
                  <span className="uppercase">{rep.resolutionStatus}</span>
                </span>
              )}
            </div>

            <h2 className="mt-2 text-sm font-bold text-slate-900">
              {rep.targetTitle}
            </h2>
            <p className="mt-1 text-slate-700">{rep.details}</p>

            {rep.resolutionNotes && (
              <div className="mt-2.5 rounded border border-slate-200 bg-slate-50 p-2.5 text-slate-700">
                <strong>Verification Team Resolution Note:</strong>{" "}
                {rep.resolutionNotes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
