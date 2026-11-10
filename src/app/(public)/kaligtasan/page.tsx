"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  PhoneCall,
  MapPin,
  HeartPulse,
  CheckSquare,
  Square,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import {
  PH_LOCATIONS,
  VERIFIED_EMERGENCY_HOTLINES,
  VERIFIED_EVACUATION_CENTERS,
  VERIFIED_RESOURCES,
} from "@/lib/constants/philippine-data";
import { SourceCitationBar, VerificationBadge } from "@/components/trust/verification-badge";
import { useCitizenState } from "@/components/providers/citizen-state-provider";

const FIRST_AID_GUIDES = [
  {
    id: "fa-bleeding",
    title: "Severe Bleeding & Wound Care (Red Cross Protocol)",
    steps: [
      "Call 911 or Philippine Red Cross 143 immediately if bleeding is rapid or arterial.",
      "Apply firm, direct pressure over the wound using a sterile gauze pad or clean cloth.",
      "Keep the injured limb elevated above the level of the heart if no fracture is suspected.",
      "Do not remove embedded objects; pad around the object and maintain pressure until EMS arrives.",
    ],
    sourceName: "Philippine Red Cross Safety Services",
    sourceUrl: "https://redcross.org.ph",
  },
  {
    id: "fa-heatstroke",
    title: "Heat Exhaustion & Heat Stroke Response (DOH Advisory)",
    steps: [
      "Move the person immediately to a shaded, cool, or air-conditioned area.",
      "Loosen tight clothing and apply cool, wet cloths to the neck, armpits, and groin.",
      "If conscious and able to swallow safely, provide small sips of cool water or Oral Rehydration Solution (ORS).",
      "If the person is confused, unconscious, or has hot dry skin, call 911 / 143 immediately — heat stroke is a medical emergency.",
    ],
    sourceName: "Department of Health (DOH)",
    sourceUrl: "https://doh.gov.ph",
  },
  {
    id: "fa-leptospirosis",
    title: "Floodwater Exposure & Leptospirosis Prevention",
    steps: [
      "Avoid wading in floodwaters whenever possible; wear protective boots if evacuation requires crossing water.",
      "Wash feet and legs thoroughly with clean water and soap immediately after flood exposure.",
      "Consult your Barangay Health Station or rural health unit within 24–48 hours after exposure for free post-exposure prophylaxis assessment.",
      "Seek immediate hospital care if fever, calf pain, headache, or reddish eyes develop after flood exposure.",
    ],
    sourceName: "Department of Health (DOH)",
    sourceUrl: "https://doh.gov.ph",
  },
];

export default function KaligtasanPage() {
  const [regionFilter, setRegionFilter] = useState<string>("ALL");
  const [hotlineCategory, setHotlineCategory] = useState<string>("all");
  const { completedChecklistIds, toggleChecklistStep } = useCitizenState();

  const goBagGuide = VERIFIED_RESOURCES.find(
    (r) => r.slug === "ndrrmc-72-hour-emergency-go-bag-and-first-aid"
  );

  const filteredHotlines = VERIFIED_EMERGENCY_HOTLINES.filter((h) =>
    hotlineCategory === "all" ? true : h.category === hotlineCategory
  );

  const filteredEvacCenters = VERIFIED_EVACUATION_CENTERS.filter((e) =>
    regionFilter === "ALL" ? true : e.regionCode === regionFilter
  );

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6">
      {/* Header */}
      <div className="mb-6 border-b border-slate-200 pb-4">
        <div className="inline-flex items-center gap-1.5 rounded bg-red-100 px-2.5 py-0.5 text-xs font-bold uppercase text-red-900">
          <ShieldAlert className="h-3.5 w-3.5 text-red-700" aria-hidden="true" />
          <span>Module F · Kaligtasan</span>
        </div>
        <h1 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Emergency Hotlines, Evacuation Centers & Disaster Preparedness
        </h1>
        <p className="mt-1 text-xs text-slate-600">
          Verified 24/7 national emergency numbers, LGU evacuation center directory, NDRRMC 72-hour Go-Bag checklist, and first-aid protocols.
        </p>
      </div>

      {/* Emergency Top Banner */}
      <div className="mb-6 flex flex-col justify-between gap-3 rounded-md border border-red-300 bg-red-50 p-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <AlertTriangle
            className="mt-0.5 h-5 w-5 shrink-0 text-red-700"
            aria-hidden="true"
          />
          <div className="text-xs text-red-950">
            <strong className="text-sm font-bold">
              In an Immediate Life-Threatening Emergency:
            </strong>
            <p className="mt-0.5">
              Dial <strong>911</strong> (National Emergency Hotline) or{" "}
              <strong>143</strong> (Philippine Red Cross) immediately. Calls to 911 are free on mobile and landline nationwide.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href="tel:911"
            className="inline-flex items-center gap-1.5 rounded bg-red-700 px-3.5 py-2 font-mono text-xs font-bold text-white hover:bg-red-800"
          >
            <PhoneCall className="h-3.5 w-3.5" />
            <span>Call 911</span>
          </a>
          <a
            href="tel:143"
            className="inline-flex items-center gap-1.5 rounded border border-red-700 bg-white px-3.5 py-2 font-mono text-xs font-bold text-red-800 hover:bg-red-100"
          >
            <PhoneCall className="h-3.5 w-3.5" />
            <span>Call 143 (Red Cross)</span>
          </a>
        </div>
      </div>

      {/* Section 1: Emergency Hotlines Directory */}
      <section id="hotlines" aria-labelledby="hotlines-heading" className="mb-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2
            id="hotlines-heading"
            className="text-base font-bold text-slate-900"
          >
            1. Verified National Emergency & Crisis Hotlines
          </h2>

          <div className="flex flex-wrap gap-1.5 text-xs">
            {[
              { id: "all", label: "All Hotlines" },
              { id: "national_emergency", label: "911 Emergency" },
              { id: "medical_red_cross", label: "Medical & Mental Health" },
              { id: "disaster_weather", label: "NDRRMC & Coast Guard" },
              { id: "law_enforcement", label: "Cybercrime & Scam" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setHotlineCategory(cat.id)}
                className={`rounded border px-2.5 py-1 font-medium ${
                  hotlineCategory === cat.id
                    ? "border-[#17365D] bg-[#17365D] text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <th className="px-4 py-2.5 font-semibold">Agency / Service</th>
                <th className="px-4 py-2.5 font-semibold">Primary Hotline</th>
                <th className="px-4 py-2.5 font-semibold">Alternate Numbers</th>
                <th className="px-4 py-2.5 font-semibold">Coverage & Hours</th>
                <th className="px-4 py-2.5 font-semibold">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredHotlines.map((hot) => (
                <tr key={hot.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {hot.agencyName}
                    <a
                      href={hot.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 inline-flex items-center gap-0.5 text-[11px] font-normal text-[#17365D] hover:underline"
                    >
                      <span>Source</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`tel:${hot.primaryNumber.replace(/[^0-9+]/g, "")}`}
                      className="inline-flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-2.5 py-1 font-mono text-xs font-bold text-red-800 hover:bg-red-100"
                    >
                      <PhoneCall className="h-3 w-3" />
                      <span>{hot.primaryNumber}</span>
                    </a>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-700">
                    {hot.secondaryNumbers.join(" · ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <div>{hot.coverage}</div>
                    <div className="text-[11px] text-slate-500">
                      {hot.operatingHours}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <VerificationBadge
                      status={hot.verificationStatus}
                      lastVerifiedAt={hot.lastVerifiedAt}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 2: Evacuation Center Directory */}
      <section aria-labelledby="evac-heading" className="mb-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#17365D]" aria-hidden="true" />
            <h2 id="evac-heading" className="text-base font-bold text-slate-900">
              2. Verified Regional & LGU Evacuation Center Directory
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <label htmlFor="evac-region-select" className="font-medium text-slate-700">
              Filter Region:
            </label>
            <select
              id="evac-region-select"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900"
            >
              <option value="ALL">All Regions</option>
              {PH_LOCATIONS.filter((l) => !l.isNational).map((loc) => (
                <option key={loc.id} value={loc.regionCode}>
                  {loc.regionCode} — {loc.regionName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredEvacCenters.map((evac) => (
            <article
              key={evac.id}
              className="rounded-md border border-slate-200 bg-white p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-[11px] font-bold text-[#17365D]">
                  {evac.regionCode} · {evac.cityMunicipality}
                </span>
                <VerificationBadge
                  status={evac.verificationStatus}
                  lastVerifiedAt={evac.lastVerifiedAt}
                />
              </div>

              <h3 className="mt-2 text-sm font-bold text-slate-900">
                {evac.name}
              </h3>
              <p className="mt-1 text-xs text-slate-600">
                <strong>Address:</strong> {evac.address} ({evac.barangay})
              </p>
              <p className="mt-1 text-xs text-slate-600">
                <strong>Capacity:</strong> {evac.capacityEstimate}
              </p>

              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {evac.facilities.map((fac) => (
                  <span
                    key={fac}
                    className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-700"
                  >
                    {fac}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5 text-xs text-slate-600">
                <span>
                  LGU Desk: <strong>{evac.managingLgu}</strong> ({evac.contactNumber})
                </span>
                <a
                  href={evac.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-[#17365D] hover:underline"
                >
                  <span>LGU DRRMO Link</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Section 3: 72-Hour Emergency Go-Bag Checklist & First Aid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {goBagGuide && (
          <section
            aria-labelledby="gobag-heading"
            className="rounded-md border border-slate-200 bg-white p-4 sm:p-5 lg:col-span-6"
          >
            <h2 id="gobag-heading" className="text-base font-bold text-slate-900">
              3. Interactive 72-Hour Family Emergency Go-Bag Checklist
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              {goBagGuide.summary}
            </p>

            <div className="mt-3 divide-y divide-slate-200 rounded border border-slate-200">
              {goBagGuide.requirementsChecklist.map((item) => {
                const checked = (
                  completedChecklistIds[goBagGuide.slug] || []
                ).includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-2.5 p-3 text-xs"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        toggleChecklistStep(goBagGuide.slug, item.id)
                      }
                      aria-pressed={checked}
                      className="mt-0.5 text-[#17365D]"
                    >
                      {checked ? (
                        <CheckSquare className="h-4 w-4 text-emerald-700" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-400" />
                      )}
                    </button>
                    <span
                      className={
                        checked
                          ? "line-through text-slate-500"
                          : "font-medium text-slate-900"
                      }
                    >
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <SourceCitationBar
              sourceName={goBagGuide.sourceName}
              sourceUrl={goBagGuide.sourceUrl}
              regionName={goBagGuide.regionName}
              lastVerifiedAt={goBagGuide.lastVerifiedAt}
              verificationStatus={goBagGuide.verificationStatus}
              targetId={goBagGuide.id}
              targetTitle={goBagGuide.title}
              targetType="resource"
            />
          </section>
        )}

        <section
          aria-labelledby="firstaid-heading"
          className="rounded-md border border-slate-200 bg-white p-4 sm:p-5 lg:col-span-6"
        >
          <div className="flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-red-700" aria-hidden="true" />
            <h2
              id="firstaid-heading"
              className="text-base font-bold text-slate-900"
            >
              4. Essential First-Aid & Health Emergency Guides
            </h2>
          </div>

          <div className="mt-3 space-y-3">
            {FIRST_AID_GUIDES.map((guide) => (
              <div
                key={guide.id}
                className="rounded border border-slate-200 bg-slate-50/70 p-3 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-slate-900">{guide.title}</h3>
                  <a
                    href={guide.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-[#17365D] hover:underline"
                  >
                    <span>{guide.sourceName}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <ol className="mt-2 list-decimal space-y-1 pl-4 text-slate-700">
                  {guide.steps.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
