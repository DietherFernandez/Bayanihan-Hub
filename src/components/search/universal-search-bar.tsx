"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  MapPin,
  Filter,
  X,
  ExternalLink,
} from "lucide-react";
import {
  PH_LOCATIONS,
  queryUniversalSearch,
} from "@/lib/constants/philippine-data";
import { useCitizenState } from "@/components/providers/citizen-state-provider";
import {
  Button,
  Input,
  SelectDropdown,
  StatusIndicator,
} from "@/components/ui/design-system";

const POPULAR_SEARCH_EXAMPLES = [
  {
    label: "PSA Birth Certificate",
    query: "PSA Birth Certificate",
    module: "serbisyo",
  },
  {
    label: "NBI Clearance (RA 11261)",
    query: "NBI Clearance",
    module: "serbisyo",
  },
  { label: "PhilHealth Konsulta", query: "PhilHealth", module: "serbisyo" },
  { label: "SSS Number Online", query: "SSS", module: "serbisyo" },
  { label: "Pag-IBIG MP2 Savings", query: "Pag-IBIG", module: "pera" },
  { label: "DSWD AICS Medical Aid", query: "DSWD AICS", module: "pera" },
  { label: "TESDA Free Courses", query: "TESDA", module: "aral" },
  { label: "DOLE Jobs & TUPAD", query: "DOLE", module: "trabaho" },
  { label: "911 & Red Cross 143", query: "911", module: "kaligtasan" },
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const liveSuggestions = useMemo(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return [];
    return queryUniversalSearch({
      q: trimmed,
      module: moduleFilter,
      region: regionFilter,
    }).slice(0, 4);
  }, [query, moduleFilter, regionFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
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
    setQuery(suggestion.query);
    setModuleFilter(suggestion.module);
    recordSearchQuery(suggestion.query, suggestion.module, regionFilter);
    const params = new URLSearchParams();
    params.set("q", suggestion.query);
    params.set("module", suggestion.module);
    if (regionFilter !== "ALL") params.set("region", regionFilter);
    router.push(`/search?${params.toString()}`);
  };

  const handleClearQuery = () => {
    setQuery("");
  };

  return (
    <div
      className={`rounded-lg border border-slate-200 bg-white ${
        compact ? "p-3.5" : "p-4 sm:p-5"
      } shadow-2xs`}
    >
      <form
        onSubmit={handleSubmit}
        role="search"
        aria-label="Universal Public Resource Search"
      >
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-12">
          <div className="relative md:col-span-6">
            <label htmlFor="universal-search-input" className="sr-only">
              Maghanap ng trabaho, serbisyo ng gobyerno, tulong pinansyal, kurso, o emergency hotline
            </label>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]"
              aria-hidden="true"
            />
            <Input
              id="universal-search-input"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Halimbawa: PSA, NBI Clearance, PhilHealth, SSS, DSWD AICS, TESDA, 911..."
              className="min-h-[42px] pl-9 pr-9"
            />
            {query.length > 0 && (
              <button
                type="button"
                onClick={handleClearQuery}
                aria-label="Clear search query"
                className="gabay-interactive absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="relative md:col-span-3">
            <label htmlFor="universal-search-module" className="sr-only">
              Filter by platform module
            </label>
            <Filter
              className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#64748B]"
              aria-hidden="true"
            />
            <SelectDropdown
              id="universal-search-module"
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="min-h-[42px] bg-[#F7F9FC] pl-8"
            >
              <option value="all">All Categories (6 Modules)</option>
              <option value="trabaho">Trabaho (Jobs &amp; Training)</option>
              <option value="serbisyo">Serbisyo (Gov IDs &amp; Guides)</option>
              <option value="pera">Pera (Financial &amp; Medical Aid)</option>
              <option value="bayanihan">Bayanihan (Community &amp; Relief)</option>
              <option value="aral">Aral (Scholarships &amp; Courses)</option>
              <option value="kaligtasan">Kaligtasan (Hotlines &amp; Evac)</option>
            </SelectDropdown>
          </div>

          <div className="relative md:col-span-2">
            <label htmlFor="universal-search-region" className="sr-only">
              Filter by region
            </label>
            <MapPin
              className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#64748B]"
              aria-hidden="true"
            />
            <SelectDropdown
              id="universal-search-region"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="min-h-[42px] bg-[#F7F9FC] pl-8"
            >
              <option value="ALL">All PH Regions</option>
              {PH_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.regionCode}>
                  {loc.regionCode}
                </option>
              ))}
            </SelectDropdown>
          </div>

          <div className="md:col-span-1">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="min-h-[42px] w-full"
            >
              <span>{isSubmitting ? "..." : "Search"}</span>
              <ArrowRight
                className="h-3.5 w-3.5 md:hidden lg:inline"
                aria-hidden="true"
              />
            </Button>
          </div>
        </div>
      </form>

      {/* Instant Verified Search Suggestions or Honest Empty State */}
      {query.trim().length >= 2 && (
        <div
          aria-live="polite"
          className="mt-3 rounded-md border border-slate-200 bg-[#F7F9FC] p-3 text-xs"
        >
          <div className="flex items-center justify-between pb-2">
            <span className="font-semibold text-slate-800">
              Suggested verified records for &ldquo;{query.trim()}&rdquo;
            </span>
            <Link
              href={`/search?q=${encodeURIComponent(query.trim())}&module=${moduleFilter}&region=${regionFilter}`}
              className="font-semibold text-[#087F8C] hover:underline"
            >
              Open full search results →
            </Link>
          </div>

          {liveSuggestions.length === 0 ? (
            <p className="py-1 text-slate-600">
              No exact verified entry found in our current index for &ldquo;
              {query.trim()}&rdquo;. We only display verified records and never fabricate government requirements. Try searching by agency acronym (e.g., PSA, NBI, PhilHealth, SSS, Pag-IBIG, DSWD, TESDA, 911).
            </p>
          ) : (
            <ul className="divide-y divide-slate-200 rounded border border-slate-200 bg-white">
              {liveSuggestions.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 hover:bg-slate-50"
                >
                  <div>
                    <Link
                      href={item.href}
                      className="font-semibold text-[#17365D] hover:text-[#087F8C] hover:underline"
                    >
                      {item.title}
                    </Link>
                    <span className="ml-2 text-[11px] text-[#64748B]">
                      ({item.sourceName})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIndicator status={item.verificationStatus} />
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-[#087F8C] hover:underline"
                    >
                      <span>Source</span>
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {!compact && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-1 text-[12px]">
          <span className="font-semibold text-[#64748B]">
            Popular searches:
          </span>
          {POPULAR_SEARCH_EXAMPLES.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleSuggestionClick(item)}
              className="gabay-interactive rounded-md border border-slate-200 bg-[#F7F9FC] px-2.5 py-1 text-[12px] font-medium text-slate-700 hover:border-[#087F8C] hover:text-[#17365D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
