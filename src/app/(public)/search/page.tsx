"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import {
  PH_LOCATIONS,
  queryUniversalSearch,
} from "@/lib/constants/philippine-data";
import { VerificationBadge } from "@/components/trust/verification-badge";
import { useCitizenState } from "@/components/providers/citizen-state-provider";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toggleBookmark, isBookmarked, recordSearchQuery } = useCitizenState();

  const initialQ = searchParams.get("q") || "";
  const initialModule = searchParams.get("module") || "all";
  const initialRegion = searchParams.get("region") || "ALL";
  const initialVerification = searchParams.get("verification") || "all";

  const [q, setQ] = useState(initialQ);
  const [moduleFilter, setModuleFilter] = useState(initialModule);
  const [regionFilter, setRegionFilter] = useState(initialRegion);
  const [verificationFilter, setVerificationFilter] =
    useState(initialVerification);

  const results = useMemo(() => {
    return queryUniversalSearch({
      q,
      module: moduleFilter,
      region: regionFilter,
      verification: verificationFilter,
    });
  }, [q, moduleFilter, regionFilter, verificationFilter]);

  const handleApplyUrlFilters = (e: React.FormEvent) => {
    e.preventDefault();
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
    router.replace("/search");
  };

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6">
      <div className="mb-5 border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Universal Public Service & Resource Search
        </h1>
        <p className="mt-1 text-xs text-slate-600">
          Search across government IDs & services, jobs, scholarships, financial aid, community relief, and emergency hotlines. No login required.
        </p>
      </div>

      {/* Search & Multi-Faceted Filter Bar */}
      <form
        onSubmit={handleApplyUrlFilters}
        className="mb-6 rounded-md border border-slate-200 bg-white p-4 shadow-xs"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
          <div className="sm:col-span-2 lg:col-span-5">
            <label
              htmlFor="search-page-q"
              className="block text-xs font-semibold text-slate-800"
            >
              Keyword or Agency Name
            </label>
            <div className="relative mt-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                id="search-page-q"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="e.g., PSA Birth Certificate, NBI, DSWD AICS, TESDA, 911..."
                className="min-h-[40px] w-full rounded border border-slate-300 bg-white pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:border-[#0B3D91] focus:outline-none focus:ring-1 focus:ring-[#0B3D91]"
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <label
              htmlFor="search-page-module"
              className="block text-xs font-semibold text-slate-800"
            >
              Platform Module
            </label>
            <select
              id="search-page-module"
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="mt-1 min-h-[40px] w-full rounded border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-900 focus:border-[#0B3D91] focus:bg-white focus:outline-none"
            >
              <option value="all">All Modules</option>
              <option value="serbisyo">Serbisyo (Gov Guides)</option>
              <option value="trabaho">Trabaho (Jobs & Training)</option>
              <option value="pera">Pera (Financial Aid)</option>
              <option value="bayanihan">Bayanihan (Community)</option>
              <option value="aral">Aral (Learning & Grants)</option>
              <option value="kaligtasan">Kaligtasan (Emergency)</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label
              htmlFor="search-page-region"
              className="block text-xs font-semibold text-slate-800"
            >
              Geographic Coverage
            </label>
            <select
              id="search-page-region"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="mt-1 min-h-[40px] w-full rounded border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-900 focus:border-[#0B3D91] focus:bg-white focus:outline-none"
            >
              <option value="ALL">All Regions (Nationwide)</option>
              {PH_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.regionCode}>
                  {loc.regionCode}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-3">
            <label
              htmlFor="search-page-verification"
              className="block text-xs font-semibold text-slate-800"
            >
              Verification Status
            </label>
            <div className="mt-1 flex gap-1.5">
              <select
                id="search-page-verification"
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value)}
                className="min-h-[40px] flex-1 rounded border border-slate-300 bg-slate-50 px-2 py-1.5 text-xs text-slate-900 focus:border-[#0B3D91] focus:bg-white focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="officially_verified">Officially Verified Only</option>
                <option value="verification_pending">Verification Pending</option>
              </select>
              <button
                type="submit"
                className="inline-flex min-h-[40px] items-center gap-1 rounded bg-[#0B3D91] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#082d6b]"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Apply</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5 text-xs text-slate-600">
          <span>
            Showing <strong>{results.length}</strong> verified directory records
            {q.trim() ? ` matching "${q.trim()}"` : ""}
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 font-medium text-slate-600 hover:text-slate-900"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            <span>Reset all filters</span>
          </button>
        </div>
      </form>

      {/* Search Results List */}
      {results.length === 0 ? (
        <div className="rounded-md border border-slate-200 bg-white p-8 text-center">
          <p className="text-sm font-semibold text-slate-900">
            No matching verified records found
          </p>
          <p className="mt-1 text-xs text-slate-600">
            Try clearing one of the module or region filters, or search by agency acronym (e.g., PSA, NBI, DSWD, TESDA, PhilHealth, 911).
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-4 inline-flex items-center gap-1.5 rounded bg-[#0B3D91] px-4 py-2 text-xs font-semibold text-white hover:bg-[#082d6b]"
          >
            Show All Directory Records
          </button>
        </div>
      ) : (
        <div className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
          {results.map((item) => {
            const saved = isBookmarked(item.id);
            return (
              <article
                key={item.id}
                className="p-4 transition-colors hover:bg-slate-50/70"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-[#0B3D91]/10 px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-[#0B3D91]">
                      {item.module}
                    </span>
                    <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                      {item.badgeLabel}
                    </span>
                    <VerificationBadge
                      status={item.verificationStatus}
                      lastVerifiedAt={item.lastVerifiedAt}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      toggleBookmark({
                        targetType:
                          item.recordKind === "bayanihan"
                            ? "bayanihan_post"
                            : item.recordKind === "hotline"
                            ? "resource"
                            : item.recordKind,
                        targetId: item.id,
                        targetSlug: item.slug,
                        targetTitle: item.title,
                        targetModule: item.module,
                        href: item.href,
                      })
                    }
                    className={`inline-flex items-center gap-1 rounded border px-2.5 py-1 text-xs font-medium ${
                      saved
                        ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {saved ? (
                      <>
                        <BookmarkCheck className="h-3.5 w-3.5 text-emerald-700" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-3.5 w-3.5" />
                        <span>Save</span>
                      </>
                    )}
                  </button>
                </div>

                <h2 className="mt-2 text-base font-bold text-slate-900">
                  <Link
                    href={item.href}
                    className="text-[#0B3D91] hover:underline"
                  >
                    {item.title}
                  </Link>
                </h2>

                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  {item.summary}
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5 text-xs text-slate-500">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span>
                      Source Organization:{" "}
                      <strong className="text-slate-800">{item.sourceName}</strong>
                    </span>
                    <span>Coverage: {item.regionName}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={item.href}
                      className="font-semibold text-[#0B3D91] hover:underline"
                    >
                      View Guide & Checklist →
                    </Link>
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-slate-700 hover:text-[#0B3D91] hover:underline"
                    >
                      <span>Official Link</span>
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function UniversalSearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8 text-xs text-slate-600">
          Loading Universal Search Directory...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
