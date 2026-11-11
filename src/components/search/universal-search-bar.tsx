"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, ExternalLink } from "lucide-react";
import { queryUniversalSearch } from "@/lib/constants/philippine-data";
import { useCitizenState } from "@/components/providers/citizen-state-provider";
import { StatusIndicator } from "@/components/ui/design-system";

const POPULAR_SEARCH_EXAMPLES = [
  {
    label: "PSA Birth Certificate",
    query: "PSA Birth Certificate",
    module: "serbisyo",
  },
  {
    label: "NBI Clearance",
    query: "NBI Clearance",
    module: "serbisyo",
  },
  { label: "PhilHealth Konsulta", query: "PhilHealth", module: "serbisyo" },
  { label: "SSS Number", query: "SSS", module: "serbisyo" },
  { label: "Pag-IBIG MP2", query: "Pag-IBIG", module: "pera" },
  { label: "DSWD AICS", query: "DSWD AICS", module: "pera" },
  { label: "TESDA Courses", query: "TESDA", module: "aral" },
  { label: "DOLE TUPAD", query: "DOLE", module: "trabaho" },
  { label: "911 Hotlines", query: "911", module: "kaligtasan" },
];


export function UniversalSearchHero({
  initialQuery = "",
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

  const liveSuggestions = useMemo(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return [];
    return queryUniversalSearch({
      q: trimmed,
      module: "all",
      region: "ALL",
    }).slice(0, 4);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    recordSearchQuery(trimmed, "all", "ALL");
    const params = new URLSearchParams();
    if (trimmed) params.set("q", trimmed);
    router.push(`/search?${params.toString()}`);
  };

  const handleSuggestionClick = (suggestion: {
    query: string;
    module: string;
  }) => {
    setQuery(suggestion.query);
    recordSearchQuery(suggestion.query, suggestion.module, "ALL");
    const params = new URLSearchParams();
    params.set("q", suggestion.query);
    params.set("module", suggestion.module);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        role="search"
        aria-label="Universal Public Resource Search"
      >
        <label htmlFor="universal-search-input" className="sr-only">
          Search government services, IDs, hotlines, or benefits
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]"
            aria-hidden="true"
          />
          <input
            id="universal-search-input"
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search government services, IDs, hotlines, or benefits..."
            className="min-h-[46px] sm:min-h-[48px] w-full rounded-xl border border-[#E2E8F0] bg-white pl-10 pr-10 text-[13.5px] sm:text-[14px] text-[#172B45] placeholder:text-[#64748B] shadow-2xs focus:border-[#173B67] focus:outline-none focus:ring-2 focus:ring-[#173B67]/20 [&::-webkit-search-cancel-button]:hidden"
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search query"
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#64748B] hover:text-[#172B45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173B67]"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </form>

      {query.trim().length >= 2 && (
        <div
          aria-live="polite"
          className="mt-2.5 rounded-xl border border-[#E2E8F0] bg-white p-3 text-[12px] shadow-2xs"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
            <span className="font-semibold text-[#172B45]">
              Verified results for &ldquo;{query.trim()}&rdquo;
            </span>
            <Link
              href={`/search?q=${encodeURIComponent(query.trim())}`}
              className="font-semibold text-[#173B67] hover:underline"
            >
              See all →
            </Link>
          </div>

          {liveSuggestions.length === 0 ? (
            <p className="py-2 text-[#64748B]">
              No verified entry found for &ldquo;{query.trim()}&rdquo;. We only
              show verified records and never fabricate government
              requirements. Try an agency acronym (PSA, NBI, SSS, PhilHealth).
            </p>
          ) : (
            <ul className="divide-y divide-[#E2E8F0]">
              {liveSuggestions.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-2 py-1.5"
                >
                  <Link
                    href={item.href}
                    className="flex min-h-[40px] min-w-0 flex-1 flex-col justify-center"
                  >
                    <span className="truncate text-[13px] font-semibold text-[#173B67] hover:underline">
                      {item.title}
                    </span>
                    <span className="truncate text-[11px] text-[#64748B]">
                      {item.sourceName}
                    </span>
                  </Link>
                  <div className="flex shrink-0 items-center gap-2">
                    <StatusIndicator status={item.verificationStatus} />
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Official source for ${item.title}`}
                      className="inline-flex h-8 w-8 items-center justify-center text-[#173B67] hover:text-[#16866B]"
                    >
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {!compact && (
        <ul
          aria-label="Popular searches"
          className="no-scrollbar -mx-3 mt-2.5 flex flex-nowrap gap-1.5 overflow-x-auto whitespace-nowrap px-3 pb-0.5 sm:mx-0 sm:px-0"
        >
          {POPULAR_SEARCH_EXAMPLES.map((item) => (
            <li key={item.label} className="shrink-0">
              <button
                type="button"
                onClick={() => handleSuggestionClick(item)}
                className="inline-flex min-h-[34px] sm:min-h-[36px] items-center rounded-full border border-[#E2E8F0] bg-white px-3.5 text-[12px] font-medium text-[#172B45] hover:border-[#173B67] hover:text-[#173B67] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173B67]"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
