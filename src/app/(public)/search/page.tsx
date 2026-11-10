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
import { useThemeAndToast } from "@/components/providers/theme-provider";
import {
  Button,
  EmptyState,
  FormField,
  Input,
  Pagination,
  SelectDropdown,
  SkeletonLoader,
} from "@/components/ui/design-system";

const PAGE_SIZE = 8;

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
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6">
      <div className="mb-5 border-b border-slate-200 pb-4">
        <h1 className="gabay-page-title">
          Universal Public Service & Resource Search
        </h1>
        <p className="gabay-body mt-1">
          Search across government IDs & services, jobs, scholarships, financial aid, community relief, and emergency hotlines. No login required.
        </p>
      </div>

      {/* Search & Multi-Faceted Filter Bar */}
      <form
        onSubmit={handleApplyUrlFilters}
        className="mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow-2xs"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
          <div className="sm:col-span-2 lg:col-span-5">
            <FormField id="search-page-q" label="Keyword or Agency Name">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]"
                  aria-hidden="true"
                />
                <Input
                  id="search-page-q"
                  type="search"
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="e.g., PSA Birth Certificate, NBI, DSWD AICS, TESDA, 911..."
                  className="pl-9"
                />
              </div>
            </FormField>
          </div>

          <div className="lg:col-span-2">
            <FormField id="search-page-module" label="Platform Module">
              <SelectDropdown
                id="search-page-module"
                value={moduleFilter}
                onChange={(e) => {
                  setModuleFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Modules</option>
                <option value="serbisyo">Serbisyo (Gov Guides)</option>
                <option value="trabaho">Trabaho (Jobs & Training)</option>
                <option value="pera">Pera (Financial Aid)</option>
                <option value="bayanihan">Bayanihan (Community)</option>
                <option value="aral">Aral (Learning & Grants)</option>
                <option value="kaligtasan">Kaligtasan (Emergency)</option>
              </SelectDropdown>
            </FormField>
          </div>

          <div className="lg:col-span-2">
            <FormField id="search-page-region" label="Geographic Coverage">
              <SelectDropdown
                id="search-page-region"
                value={regionFilter}
                onChange={(e) => {
                  setRegionFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="ALL">All Regions (Nationwide)</option>
                {PH_LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.regionCode}>
                    {loc.regionCode}
                  </option>
                ))}
              </SelectDropdown>
            </FormField>
          </div>

          <div className="lg:col-span-3">
            <FormField id="search-page-verification" label="Verification Status">
              <div className="flex gap-1.5">
                <SelectDropdown
                  id="search-page-verification"
                  value={verificationFilter}
                  onChange={(e) => {
                    setVerificationFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="flex-1"
                >
                  <option value="all">All Statuses</option>
                  <option value="officially_verified">
                    Officially Verified Only
                  </option>
                  <option value="verification_pending">
                    Verification Pending
                  </option>
                </SelectDropdown>
                <Button type="submit" variant="primary">
                  <SlidersHorizontal
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  />
                  <span>Apply</span>
                </Button>
              </div>
            </FormField>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5 text-[12.5px] text-[#64748B]">
          <span>
            Showing <strong className="text-slate-900">{results.length}</strong>{" "}
            verified directory records
            {q.trim() ? ` matching "${q.trim()}"` : ""}
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="gabay-interactive inline-flex items-center gap-1 font-semibold text-[#087F8C] hover:underline"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            <span>Reset all filters</span>
          </button>
        </div>
      </form>

      {/* Search Results List */}
      {results.length === 0 ? (
        <EmptyState
          title="No matching verified records found"
          description="Try clearing one of the module or region filters, or search by agency acronym (e.g., PSA, NBI, DSWD, TESDA, PhilHealth, 911)."
          actionLabel="Show All Directory Records"
          onAction={handleReset}
        />
      ) : (
        <>
          <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
            {paginatedResults.map((item) => {
              const saved = isBookmarked(item.id);
              return (
                <article
                  key={item.id}
                  className="gabay-interactive p-4 hover:bg-slate-50/70"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded bg-[#17365D]/10 px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-[#17365D]">
                        {item.module}
                      </span>
                      <span className="rounded border border-slate-200 bg-[#F7F9FC] px-2 py-0.5 text-[11.5px] font-medium text-slate-700">
                        {item.badgeLabel}
                      </span>
                      <VerificationBadge
                        status={item.verificationStatus}
                        lastVerifiedAt={item.lastVerifiedAt}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const added = toggleBookmark({
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
                        });
                        showToast({
                          title: added
                            ? "Saved to Bookmarks"
                            : "Removed from Bookmarks",
                          description: item.title,
                          variant: added ? "success" : "info",
                        });
                      }}
                      className={`gabay-interactive inline-flex min-h-[34px] items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-semibold ${
                        saved
                          ? "border-[#16A36A]/40 bg-[#16A36A]/10 text-[#065F46]"
                          : "border-slate-300 bg-white text-slate-700 hover:border-[#087F8C]"
                      }`}
                    >
                      {saved ? (
                        <>
                          <BookmarkCheck className="h-3.5 w-3.5 text-[#16A36A]" />
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

                  <h2 className="mt-2 text-[16px] font-bold text-slate-900">
                    <Link
                      href={item.href}
                      className="text-[#17365D] hover:text-[#087F8C] hover:underline"
                    >
                      {item.title}
                    </Link>
                  </h2>

                  <p className="mt-1 text-[13.5px] leading-relaxed text-slate-600">
                    {item.summary}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5 text-[12px] text-[#64748B]">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span>
                        Source Organization:{" "}
                        <strong className="text-slate-800">
                          {item.sourceName}
                        </strong>
                      </span>
                      <span>Coverage: {item.regionName}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        href={item.href}
                        className="font-semibold text-[#17365D] hover:text-[#087F8C] hover:underline"
                      >
                        View Guide & Checklist →
                      </Link>
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-[#087F8C] hover:underline"
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

          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={results.length}
            pageSize={PAGE_SIZE}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}
    </div>
  );
}

export default function UniversalSearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8">
          <SkeletonLoader rows={5} />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
