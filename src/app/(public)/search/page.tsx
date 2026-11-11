"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  RotateCcw,
  Compass,
} from "lucide-react";
import {
  PH_LOCATIONS,
  queryUniversalSearch,
} from "@/lib/constants/philippine-data";
import { VerificationBadge } from "@/components/trust/verification-badge";
import { useCitizenState } from "@/components/providers/citizen-state-provider";
import { useThemeAndToast } from "@/components/providers/theme-provider";

const PAGE_SIZE = 8;

const MODULE_OPTIONS = [
  { id: "all", label: "All Modules" },
  { id: "serbisyo", label: "Serbisyo" },
  { id: "trabaho", label: "Trabaho" },
  { id: "pera", label: "Pera" },
  { id: "aral", label: "Aral" },
  { id: "kaligtasan", label: "Kaligtasan" },
  { id: "bayanihan", label: "Bayanihan" },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toggleBookmark, isBookmarked, recordSearchQuery } = useCitizenState();
  const { showToast } = useThemeAndToast();

  const initialQ = searchParams.get("q") || "";
  const initialModule = searchParams.get("module") || "all";
  const initialRegion = searchParams.get("region") || "ALL";
  const initialVerification = searchParams.get("verification") || "all";

  const [q, setQ] = useState(initialQ);
  const [moduleFilter, setModuleFilter] = useState(initialModule);
  const [regionFilter, setRegionFilter] = useState(initialRegion);
  const [verificationFilter, setVerificationFilter] =
    useState(initialVerification);
  const [currentPage, setCurrentPage] = useState(1);

  const results = useMemo(() => {
    return queryUniversalSearch({
      q,
      module: moduleFilter,
      region: regionFilter,
      verification: verificationFilter,
    });
  }, [q, moduleFilter, regionFilter, verificationFilter]);

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedResults = results.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const handleApplyUrlFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    recordSearchQuery(q, moduleFilter, regionFilter);
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (moduleFilter !== "all") params.set("module", moduleFilter);
    if (regionFilter !== "ALL") params.set("region", regionFilter);
    if (verificationFilter !== "all")
      params.set("verification", verificationFilter);
    router.replace(`/search?${params.toString()}`);
  };

  const handleReset = () => {
    setQ("");
    setModuleFilter("all");
    setRegionFilter("ALL");
    setVerificationFilter("all");
    setCurrentPage(1);
    router.replace("/search");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10 space-y-8 sm:space-y-10">
      {/* Header & Page Title (Cardless Editorial Style) */}
      <div className="space-y-2 border-b border-slate-200 pb-5">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-[#17365D]">
          <Compass className="h-4 w-4 text-[#17365D]" aria-hidden="true" />
          <span>Universal Civic Search</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Public Service &amp; Resource Directory Search
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
          Search across government IDs, civil certificates, scholarships, medical assistance, community aid, and 24/7 emergency hotlines. No account or login required.
        </p>
      </div>

      {/* Search Input & Filter Controls (Clean Editorial, No Box Card Enclosure) */}
      <form onSubmit={handleApplyUrlFilters} className="space-y-4">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            id="search-page-q"
            type="search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search PSA Birth Certificate, NBI, DSWD AICS, PhilHealth, 911, TESDA..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#17365D] focus:ring-1 focus:ring-[#17365D] transition"
          />
        </div>

        {/* Filter Bar Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Module Selector (Civic Underline Tabs) */}
          <div className="no-scrollbar flex gap-3 overflow-x-auto whitespace-nowrap text-xs font-semibold text-slate-500 border-b border-slate-200 pb-1 w-full sm:w-auto">
            {MODULE_OPTIONS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setModuleFilter(m.id);
                  setCurrentPage(1);
                }}
                className={`pb-1.5 transition ${
                  moduleFilter === m.id
                    ? "border-b-2 border-[#17365D] font-bold text-[#17365D]"
                    : "hover:text-slate-800"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 self-end">
            <select
              value={regionFilter}
              onChange={(e) => {
                setRegionFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#17365D]"
            >
              <option value="ALL">All Regions</option>
              {PH_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.regionCode}>
                  {loc.regionCode}
                </option>
              ))}
            </select>

            {(q.trim() || moduleFilter !== "all" || regionFilter !== "ALL") && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 font-semibold text-[#17365D] hover:underline px-2 py-1"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        <div className="text-[11.5px] text-slate-500">
          Showing <strong className="text-slate-900">{results.length}</strong> verified directory records
          {q.trim() ? ` matching "${q.trim()}"` : ""}
        </div>
      </form>

      {/* Search Results (Open Editorial Dividers, No Box Cards) */}
      {results.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-500 space-y-2">
          <p className="font-semibold text-slate-900">No verified civic records matched your query.</p>
          <p className="text-slate-400">
            Try searching by agency acronym (e.g. PSA, NBI, DSWD, TESDA, PhilHealth, 911) or clear the module filter.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#17365D] text-white text-xs font-semibold hover:bg-[#102847]"
          >
            Show All Directory Records
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="divide-y divide-slate-100 border-y border-slate-200 text-xs">
            {paginatedResults.map((item) => {
              const saved = isBookmarked(item.id);
              return (
                <div
                  key={item.id}
                  className="py-4 space-y-1.5 group hover:bg-slate-50/60 -mx-2 px-2 rounded-lg transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase text-slate-700">
                          {item.module}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {item.badgeLabel}
                        </span>
                        <VerificationBadge
                          status={item.verificationStatus}
                          lastVerifiedAt={item.lastVerifiedAt}
                        />
                      </div>
                      <h3 className="font-bold text-slate-900 group-hover:text-[#17365D] text-sm sm:text-base transition">
                        <Link href={item.href}>
                          {item.title}
                        </Link>
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => {
                          const targetType =
                            item.recordKind === "bayanihan"
                              ? "bayanihan_post"
                              : item.recordKind === "hotline"
                              ? "resource"
                              : item.recordKind;
                          toggleBookmark({
                            targetType,
                            targetId: item.id,
                            targetSlug: item.slug,
                            targetTitle: item.title,
                            targetModule: item.module,
                            href: item.href,
                          });
                          showToast({
                            title: saved ? "Removed from bookmarks" : "Saved to bookmarks",
                            variant: "info",
                          });
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-[#17365D] transition"
                        title={saved ? "Saved" : "Save guide"}
                      >
                        {saved ? (
                          <BookmarkCheck className="h-4 w-4 text-emerald-700" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </button>
                      <Link
                        href={item.href}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#17365D] text-white text-xs font-semibold hover:bg-[#102847] shadow-2xs transition"
                      >
                        <span>Open Guide</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>

                  <p className="text-slate-600 leading-relaxed text-[11.5px]">
                    {item.summary}
                  </p>

                  <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-2 pt-1 border-t border-slate-50">
                    <span>Region: {item.regionCode}</span>
                    <span>·</span>
                    <span>Verified Source: {item.sourceName}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination (Clean text links) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
              <span>Page {safePage} of {totalPages}</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded-md border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1 rounded-md border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-4 py-8 text-xs text-slate-600">
          Loading Universal Public Service Search...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
