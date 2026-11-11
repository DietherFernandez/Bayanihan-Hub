"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  PhoneCall,
  MapPin,
  HeartPulse,
  CheckSquare,
  Square,
  ExternalLink,
  AlertTriangle,
  Info,
  Search,
  Printer,
  Radio,
} from "lucide-react";
import {
  ACTIVE_ANNOUNCEMENTS,
  PH_LOCATIONS,
  VERIFIED_EMERGENCY_HOTLINES,
  VERIFIED_EVACUATION_CENTERS,
  VERIFIED_RESOURCES,
} from "@/lib/constants/philippine-data";
import { SourceCitationBar, VerificationBadge } from "@/components/trust/verification-badge";
import { CopyButton } from "@/components/ui/copy-button";
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

const HOTLINE_CATEGORIES = [
  { id: "all", label: "All Hotlines" },
  { id: "national_emergency", label: "911 Emergency" },
  { id: "medical_red_cross", label: "Medical & Mental Health" },
  { id: "disaster_weather", label: "NDRRMC & Coast Guard" },
  { id: "law_enforcement", label: "Cybercrime & Safety" },
];

export default function KaligtasanPage() {
  const [regionFilter, setRegionFilter] = useState<string>("ALL");
  const [hotlineCategory, setHotlineCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { completedChecklistIds, toggleChecklistStep } = useCitizenState();

  const goBagGuide = VERIFIED_RESOURCES.find(
    (r) => r.slug === "ndrrmc-72-hour-emergency-go-bag-and-first-aid"
  );

  const filteredHotlines = VERIFIED_EMERGENCY_HOTLINES.filter((h) => {
    const matchesCategory =
      hotlineCategory === "all" ? true : h.category === hotlineCategory;
    const matchesSearch =
      searchQuery.trim().length === 0 ||
      `${h.agencyName} ${h.primaryNumber} ${h.coverage} ${h.acronym}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredEvacCenters = VERIFIED_EVACUATION_CENTERS.filter((e) => {
    const matchesRegion =
      regionFilter === "ALL" ? true : e.regionCode === regionFilter;
    const matchesSearch =
      searchQuery.trim().length === 0 ||
      `${e.name} ${e.cityMunicipality} ${e.barangay} ${e.address} ${e.managingLgu}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const totalGoBagItems = goBagGuide?.requirementsChecklist.length || 0;
  const packedGoBagItems = (
    goBagGuide ? completedChecklistIds[goBagGuide.slug] || [] : []
  ).length;
  const goBagPercent = totalGoBagItems > 0 ? Math.round((packedGoBagItems / totalGoBagItems) * 100) : 0;

  const handlePrintGoBag = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10 space-y-8 sm:space-y-10">

      {/* Immediate Life-Threatening Emergency Top Alert Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-red-700 text-white px-4 py-3 rounded-xl shadow-xs">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="h-5 w-5 text-red-200 shrink-0" aria-hidden="true" />
          <div className="text-xs">
            <span className="font-bold">Life-Threatening Emergency?</span> Dial{" "}
            <strong className="underline underline-offset-2 font-black">911</strong> (National Emergency) or{" "}
            <strong className="underline underline-offset-2 font-black">143</strong> (Red Cross) immediately. Calls are toll-free nationwide.
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <a
            href="tel:911"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-red-800 text-xs font-black uppercase tracking-wide hover:bg-red-50 shadow-2xs transition"
          >
            <PhoneCall className="h-3.5 w-3.5" />
            <span>Call 911</span>
          </a>
          <a
            href="tel:143"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-800 text-white text-xs font-bold hover:bg-red-900 border border-red-600 transition"
          >
            <span>143 Red Cross</span>
          </a>
        </div>
      </div>

      {/* Header & Page Title (Cardless Editorial Style) */}
      <div className="space-y-2 border-b border-slate-200 pb-5">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-red-700">
          <ShieldAlert className="h-4 w-4 text-red-700" aria-hidden="true" />
          <span>Module F · Kaligtasan at Emergency</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Emergency Hotlines, Evacuation &amp; Disaster Preparedness
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
          Verified 24/7 national emergency hotlines, LGU evacuation centers, NDRRMC 72-hour family go-bag checklist, and Red Cross first-aid procedures.
        </p>
      </div>

      {/* Priority 4-Hotlines Grid (Open Civic Typography, No Card Clutter) */}
      <div className="space-y-2">
        <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Priority Direct Hotlines (24/7 Nationwide)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <a
            href="tel:911"
            className="p-3.5 rounded-xl bg-red-50/80 border border-red-200/80 hover:bg-red-100/80 transition group"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xl sm:text-3xl font-black text-red-700 tracking-tight">
                911
              </span>
              <PhoneCall className="h-4 w-4 text-red-600 group-hover:scale-110 transition" />
            </div>
            <span className="block text-xs font-bold text-slate-900 mt-1">National Emergency</span>
            <span className="block text-[11px] text-slate-500">Police · Fire · Medical</span>
          </a>

          <a
            href="tel:143"
            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition group"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xl sm:text-3xl font-black text-red-600 tracking-tight">
                143
              </span>
              <PhoneCall className="h-4 w-4 text-slate-500 group-hover:scale-110 transition" />
            </div>
            <span className="block text-xs font-bold text-slate-900 mt-1">Red Cross PH</span>
            <span className="block text-[11px] text-slate-500">Disaster &amp; Blood Rescue</span>
          </a>

          <a
            href="tel:8888"
            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition group"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xl sm:text-3xl font-black text-[#17365D] tracking-tight">
                8888
              </span>
              <PhoneCall className="h-4 w-4 text-slate-500 group-hover:scale-110 transition" />
            </div>
            <span className="block text-xs font-bold text-slate-900 mt-1">Citizen Complaint</span>
            <span className="block text-[11px] text-slate-500">Govt Service Desk</span>
          </a>

          <a
            href="tel:1343"
            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition group"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xl sm:text-3xl font-black text-[#17365D] tracking-tight">
                1343
              </span>
              <PhoneCall className="h-4 w-4 text-slate-500 group-hover:scale-110 transition" />
            </div>
            <span className="block text-xs font-bold text-slate-900 mt-1">Anti-Trafficking</span>
            <span className="block text-[11px] text-slate-500">OFW &amp; Women Safety</span>
          </a>
        </div>
      </div>

      {/* Search & Region Filter (Clean Editorial, No Outer Card Enclosure) */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hotlines or evacuation centers by agency, city, or keyword..."
            aria-label="Filter emergency hotlines and evacuation centers"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#17365D] focus:ring-1 focus:ring-[#17365D] transition"
          />
        </div>
        <div className="flex items-center gap-2 text-xs shrink-0">
          <label htmlFor="evac-region-select" className="font-semibold text-slate-600">
            Region:
          </label>
          <select
            id="evac-region-select"
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#17365D]"
          >
            <option value="ALL">All Regions (Nationwide)</option>
            {PH_LOCATIONS.filter((l) => !l.isNational).map((loc) => (
              <option key={loc.id} value={loc.regionCode}>
                {loc.regionCode} — {loc.regionName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SECTION 1: Emergency Hotlines Directory (Cardless Editorial Divide-Y) */}
      <section id="hotlines" aria-labelledby="hotlines-heading" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <h2 id="hotlines-heading" className="text-sm sm:text-base font-bold text-slate-900">
              Verified Emergency &amp; Crisis Hotlines ({filteredHotlines.length})
            </h2>
          </div>

          {/* Category Tabs (Civic Underline Tabs) */}
          <div className="no-scrollbar flex gap-3 overflow-x-auto whitespace-nowrap text-xs font-semibold text-slate-500">
            {HOTLINE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setHotlineCategory(cat.id)}
                className={`pb-1.5 transition ${
                  hotlineCategory === cat.id
                    ? "border-b-2 border-[#17365D] font-bold text-[#17365D]"
                    : "hover:text-slate-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hotlines List */}
        {filteredHotlines.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No hotlines found matching your filter criteria.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 border-y border-slate-200 text-xs">
            {filteredHotlines.map((hot) => {
              const cleanNumber = hot.primaryNumber.replace(/[^0-9+]/g, "");
              return (
                <div
                  key={hot.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-slate-50/60 -mx-2 px-2 rounded-lg transition"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                        {hot.acronym || "GOV"}
                      </span>
                      <span className="font-bold text-slate-900 group-hover:text-[#17365D] transition">
                        {hot.agencyName}
                      </span>
                      <a
                        href={hot.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 text-[11px] text-[#17365D] hover:underline"
                      >
                        <span>Official Source</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>

                    <div className="text-slate-500 flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="font-mono font-semibold text-slate-800">{hot.primaryNumber}</span>
                      {hot.secondaryNumbers.length > 0 && (
                        <>
                          <span>·</span>
                          <span className="font-mono text-slate-500">
                            Alt: {hot.secondaryNumbers.join(" · ")}
                          </span>
                        </>
                      )}
                      <span>·</span>
                      <span>{hot.coverage}</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-medium">{hot.operatingHours}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                    <a
                      href={`tel:${cleanNumber}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-800 text-xs font-bold hover:bg-red-100 border border-red-200 shadow-2xs transition"
                    >
                      <PhoneCall className="h-3.5 w-3.5 text-red-700" />
                      <span>Dial {hot.primaryNumber}</span>
                    </a>
                    <CopyButton
                      textToCopy={hot.primaryNumber}
                      label="Copy Number"
                      showText={false}
                      className="h-8 w-8 p-0 border border-slate-200 text-slate-500 hover:bg-slate-50"
                    />
                    <VerificationBadge
                      status={hot.verificationStatus}
                      lastVerifiedAt={hot.lastVerifiedAt}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* SECTION 2: 72-Hour Family Emergency Go-Bag Checklist (Cardless) */}
      {goBagGuide && (
        <section aria-labelledby="gobag-heading" className="space-y-4 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-500">
                <span>NDRRMC Official Standard</span>
              </div>
              <h2 id="gobag-heading" className="text-sm sm:text-base font-bold text-slate-900">
                Interactive 72-Hour Family Emergency Go-Bag Checklist
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={handlePrintGoBag}
                className="no-print inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 font-semibold hover:bg-slate-50 shadow-2xs transition"
              >
                <Printer className="h-3.5 w-3.5 text-[#17365D]" />
                <span>Print Go-Bag Checklist</span>
              </button>
              <Link
                href={`/kaligtasan/${goBagGuide.slug}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#17365D] text-white font-semibold hover:bg-[#102847] shadow-2xs transition"
              >
                <span>Full Guide</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            {goBagGuide.summary} Keep this bag packed in an accessible spot near your main exit door.
          </p>

          {/* Progress Tracker Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700">
                {packedGoBagItems} of {totalGoBagItems} essential items packed ({goBagPercent}%)
              </span>
              <span className="text-[11px] text-emerald-700 font-bold">Offline Stored</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${goBagPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Checklist Items (Cardless Open List) */}
          <div className="divide-y divide-slate-100 border-y border-slate-200 text-xs">
            {goBagGuide.requirementsChecklist.map((item) => {
              const checked = (
                completedChecklistIds[goBagGuide.slug] || []
              ).includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistStep(goBagGuide.slug, item.id)}
                  className="py-3 flex items-start gap-3 cursor-pointer group hover:bg-slate-50/60 -mx-2 px-2 rounded-lg transition"
                >
                  <button
                    type="button"
                    aria-pressed={checked}
                    className="mt-0.5 text-[#17365D] shrink-0"
                  >
                    {checked ? (
                      <CheckSquare className="h-4 w-4 text-emerald-700" />
                    ) : (
                      <Square className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
                    )}
                  </button>
                  <div className="min-w-0 space-y-0.5">
                    <span
                      className={`block font-medium transition ${
                        checked ? "line-through text-slate-400" : "text-slate-900 group-hover:text-[#17365D]"
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.notes && (
                      <span className="block text-[11px] text-slate-500">{item.notes}</span>
                    )}
                  </div>
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

      {/* SECTION 3: Evacuation Center Directory (Cardless Layout) */}
      <section aria-labelledby="evac-heading" className="space-y-3 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#17365D]" aria-hidden="true" />
            <h2 id="evac-heading" className="text-sm sm:text-base font-bold text-slate-900">
              Verified Regional &amp; LGU Evacuation Facilities ({filteredEvacCenters.length})
            </h2>
          </div>
          <span className="text-xs text-slate-500">Pre-designated LGU &amp; DRRMO sites</span>
        </div>

        {filteredEvacCenters.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No evacuation centers matched your current filter.{" "}
            <button
              type="button"
              onClick={() => {
                setRegionFilter("ALL");
                setSearchQuery("");
              }}
              className="font-semibold text-[#17365D] underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 border-y border-slate-200 text-xs">
            {filteredEvacCenters.map((evac) => (
              <div
                key={evac.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-slate-50/60 -mx-2 px-2 rounded-lg transition"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-blue-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#17365D]">
                      {evac.regionCode} · {evac.cityMunicipality}
                    </span>
                    <span className="font-bold text-slate-900 group-hover:text-[#17365D] transition">
                      {evac.name}
                    </span>
                    <VerificationBadge
                      status={evac.verificationStatus}
                      lastVerifiedAt={evac.lastVerifiedAt}
                    />
                  </div>

                  <div className="text-slate-500 flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span>{evac.address} ({evac.barangay})</span>
                    <span>·</span>
                    <span className="font-medium text-slate-700">Capacity: {evac.capacityEstimate}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {evac.facilities.map((fac) => (
                      <span
                        key={fac}
                        className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-600"
                      >
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-xs self-start sm:self-auto">
                  <div className="text-right">
                    <span className="block text-[11px] text-slate-400">LGU Desk: {evac.managingLgu}</span>
                    <a
                      href={`tel:${evac.contactNumber.replace(/[^0-9+]/g, "")}`}
                      className="font-mono font-bold text-[#17365D] hover:underline"
                    >
                      {evac.contactNumber}
                    </a>
                  </div>
                  <a
                    href={evac.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-[#17365D] hover:border-blue-200 transition"
                    title="Open LGU DRRMO Source Link"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 4: Essential First-Aid Guides (Cardless Editorial Step List) */}
      <section aria-labelledby="firstaid-heading" className="space-y-3 pt-2">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <HeartPulse className="h-4 w-4 text-red-700" aria-hidden="true" />
          <h2 id="firstaid-heading" className="text-sm sm:text-base font-bold text-slate-900">
            Essential First-Aid &amp; Health Emergency Protocols
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
          {FIRST_AID_GUIDES.map((guide) => (
            <div key={guide.id} className="space-y-2 text-xs">
              <div className="border-b border-slate-100 pb-1.5">
                <h3 className="font-bold text-slate-900">{guide.title}</h3>
                <a
                  href={guide.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-[11px] text-[#17365D] hover:underline mt-0.5"
                >
                  <span>{guide.sourceName}</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
              <ol className="space-y-2 text-slate-600">
                {guide.steps.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: Official Agency Bulletins (Cardless) */}
      <section aria-labelledby="official-advisories-heading" className="space-y-3 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-amber-600" />
            <h2 id="official-advisories-heading" className="text-sm sm:text-base font-bold text-slate-900">
              Official Agency Weather &amp; Disaster Bulletins
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <a
              href="https://bagong.pagasa.dost.gov.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#17365D] font-semibold hover:underline"
            >
              <span>DOST-PAGASA</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <span className="text-slate-300">·</span>
            <a
              href="https://www.phivolcs.dost.gov.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#17365D] font-semibold hover:underline"
            >
              <span>DOST-PHIVOLCS</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="divide-y divide-slate-100 border-y border-slate-200 text-xs">
          {ACTIVE_ANNOUNCEMENTS.map((ann) => (
            <div key={ann.id} className="py-3 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] font-bold uppercase text-[#17365D]">
                  {ann.sourceName}
                </span>
                <span className="text-[11px] text-slate-400">Effective: {ann.startsAt}</span>
              </div>
              <h3 className="font-bold text-slate-900">{ann.title}</h3>
              <p className="text-slate-600">{ann.summary}</p>
              <a
                href={ann.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#17365D] font-medium hover:underline pt-0.5"
              >
                <span>Read Official Bulletin on Agency Portal</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Scope Disclaimer (Open Civic Text, No Box Card) */}
      <div className="pt-4 text-xs text-slate-500 space-y-1.5 border-t border-slate-200/80">
        <div className="flex items-center gap-1.5 font-bold text-slate-700">
          <Info className="h-4 w-4 text-[#17365D]" aria-hidden="true" />
          <span>Emergency Information Scope &amp; Official Advisory Notice</span>
        </div>
        <p className="leading-relaxed">
          GabayPH publishes verified emergency contact directories and static educational preparedness/first-aid procedures. It does <strong>not</strong> replace emergency first responders (911/143) or municipal sirens, and does not provide real-time seismic or radar telemetry. Always follow live directives from your Barangay DRRMO, NDRRMC, PAGASA, and PHIVOLCS.
        </p>
      </div>

    </div>
  );
}
