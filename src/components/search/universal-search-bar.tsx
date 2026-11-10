"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, MapPin, Filter } from "lucide-react";
import { PH_LOCATIONS } from "@/lib/constants/philippine-data";
import { useCitizenState } from "@/components/providers/citizen-state-provider";

const QUICK_SUGGESTIONS = [
  { label: "PSA Birth Certificate", query: "PSA Birth Certificate", module: "serbisyo" },
  { label: "NBI Clearance (RA 11261 Free)", query: "NBI Clearance", module: "serbisyo" },
  { label: "DSWD AICS Medical Aid", query: "DSWD AICS", module: "pera" },
  { label: "Malasakit Center Hospital Aid", query: "Malasakit Center", module: "pera" },
  { label: "TESDA Free Online Courses", query: "TESDA", module: "aral" },
  { label: "CHED Merit Scholarship", query: "CHED Scholarship", module: "aral" },
  { label: "DOLE TUPAD & Jobs", query: "DOLE", module: "trabaho" },
  { label: "911 & Red Cross 143 Hotlines", query: "911", module: "kaligtasan" },
];

export function UniversalSearchHero({
  initialQuery = "",
  initialModule = "all",
  initialRegion = "ALL",
  compact = false,
}: {
  initialQuery?: string;
  initialModule?: string;
  initialRegion?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const { recordSearchQuery } = useCitizenState();
  const [query, setQuery] = useState(initialQuery);
  const [moduleFilter, setModuleFilter] = useState(initialModule);
  const [regionFilter, setRegionFilter] = useState(initialRegion);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordSearchQuery(query, moduleFilter, regionFilter);
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (moduleFilter !== "all") params.set("module", moduleFilter);
    if (regionFilter !== "ALL") params.set("region", regionFilter);
    router.push(`/search?${params.toString()}`);
  };

  const handleSuggestionClick = (suggestion: {
    query: string;
    module: string;
  }) => {
    recordSearchQuery(suggestion.query, suggestion.module, regionFilter);
    const params = new URLSearchParams();
    params.set("q", suggestion.query);
    params.set("module", suggestion.module);
    if (regionFilter !== "ALL") params.set("region", regionFilter);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div
      className={`rounded-md border border-slate-200 bg-white ${
        compact ? "p-3.5" : "p-4 sm:p-6"
      } shadow-xs`}
    >
      <form onSubmit={handleSubmit} role="search" aria-label="Universal Public Resource Search">
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-12">
          <div className="relative md:col-span-6">
            <label htmlFor="universal-search-input" className="sr-only">
              Search services, jobs, financial aid, scholarships, or emergency hotlines
            </label>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              id="universal-search-input"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search PSA, NBI, DSWD AICS, PhilHealth, TESDA, jobs, or 911..."
              className="min-h-[42px] w-full rounded border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0B3D91] focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/20"
            />
          </div>

          <div className="relative md:col-span-3">
            <label htmlFor="universal-search-module" className="sr-only">
              Filter by platform module
            </label>
            <Filter
              className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
              aria-hidden="true"
            />
            <select
              id="universal-search-module"
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="min-h-[42px] w-full rounded border border-slate-300 bg-slate-50 pl-8 pr-2.5 py-2 text-xs font-medium text-slate-800 focus:border-[#0B3D91] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/20"
            >
              <option value="all">All Categories (6 Modules)</option>
              <option value="serbisyo">Serbisyo (Gov IDs & Guides)</option>
              <option value="trabaho">Trabaho (Jobs & Training)</option>
              <option value="pera">Pera (Financial & Medical Aid)</option>
              <option value="bayanihan">Bayanihan (Community & Relief)</option>
              <option value="aral">Aral (Scholarships & Courses)</option>
              <option value="kaligtasan">Kaligtasan (Hotlines & Evac)</option>
            </select>
          </div>

          <div className="relative md:col-span-2">
            <label htmlFor="universal-search-region" className="sr-only">
              Filter by region
            </label>
            <MapPin
              className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
              aria-hidden="true"
            />
            <select
              id="universal-search-region"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="min-h-[42px] w-full rounded border border-slate-300 bg-slate-50 pl-8 pr-2 py-2 text-xs font-medium text-slate-800 focus:border-[#0B3D91] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/20"
            >
              <option value="ALL">All PH Regions</option>
              {PH_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.regionCode}>
                  {loc.regionCode}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-1">
            <button
              type="submit"
              className="inline-flex min-h-[42px] w-full items-center justify-center gap-1.5 rounded bg-[#0B3D91] px-3 py-2 text-xs font-semibold text-white hover:bg-[#082d6b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B3D91]"
            >
              <span>Search</span>
              <ArrowRight className="h-3.5 w-3.5 md:hidden lg:inline" aria-hidden="true" />
            </button>
          </div>
        </div>
      </form>

      {!compact && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="font-medium text-slate-500">Frequent searches:</span>
          {QUICK_SUGGESTIONS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleSuggestionClick(item)}
              className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700 hover:border-[#0B3D91] hover:bg-blue-50 hover:text-[#0B3D91] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B3D91]"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
