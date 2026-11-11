"use client";

import React from "react";
import Link from "next/link";
import { Bookmark, Trash2, ArrowUpRight, Printer } from "lucide-react";
import { useState } from "react";
import { useCitizenState } from "@/components/providers/citizen-state-provider";

export default function BookmarksPage() {
  const { bookmarks, toggleBookmark } = useCitizenState();
  const [activeModule, setActiveModule] = useState<string>("all");

  const filteredBookmarks = bookmarks.filter((b) => activeModule === "all" || b.targetModule === activeModule);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 border-b border-slate-200 pb-4">
        <div className="inline-flex items-center gap-1.5 rounded bg-blue-50 px-2.5 py-0.5 text-xs font-bold uppercase text-[#17365D]">
          <Bookmark className="h-3.5 w-3.5" />
          <span>Saved Resources & Checklists</span>
        </div>
        <h1 className="mt-1.5 text-xl font-bold text-slate-900">
          Your Bookmarked Guides, Opportunities & Aid Programs
        </h1>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="mt-1 text-xs text-slate-600">
            Quickly return to saved government document checklists, scholarship deadlines, and financial assistance guides.
          </p>
          {bookmarks.length > 0 && (
            <button
              type="button"
              onClick={() => typeof window !== "undefined" && window.print()}
              className="no-print inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-2xs hover:bg-slate-50"
            >
              <Printer className="h-3.5 w-3.5 text-[#17365D]" />
              <span>Print Saved Checklist Pack</span>
            </button>
          )}
        </div>

        {bookmarks.length > 0 && (
          <div className="no-print mt-4 flex flex-wrap gap-1.5 text-xs">
            {["all", "serbisyo", "trabaho", "pera", "aral", "kaligtasan"].map((mod) => {
              const count = mod === "all" ? bookmarks.length : bookmarks.filter((b) => b.targetModule === mod).length;
              if (mod !== "all" && count === 0) return null;
              return (
                <button
                  key={mod}
                  type="button"
                  onClick={() => setActiveModule(mod)}
                  className={`rounded-full border px-3 py-1 font-semibold transition ${
                    activeModule === mod
                      ? "border-[#17365D] bg-[#17365D] text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <span className="capitalize">{mod}</span> ({count})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <div className="rounded-md border border-slate-200 bg-white p-8 text-center">
          <p className="text-sm font-semibold text-slate-900">
            No saved bookmarks yet
          </p>
          <p className="mt-1 text-xs text-slate-600">
            Click the &quot;Save&quot; or &quot;Bookmark Guide&quot; button on any Serbisyo, Trabaho, Pera, Aral, or Universal Search item to keep it here for offline/quick reference.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link
              href="/serbisyo"
              className="rounded bg-[#17365D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#102847]"
            >
              Browse Serbisyo Guides
            </Link>
            <Link
              href="/search"
              className="rounded border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
            >
              Open Universal Search
            </Link>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
          {filteredBookmarks.map((bm) => (
            <div
              key={bm.id}
              className="flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-slate-50"
            >
              <div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-[#17365D]">
                    {bm.targetModule}
                  </span>
                  <span className="text-slate-500">Saved on {bm.createdAt}</span>
                </div>
                <Link
                  href={bm.href}
                  className="mt-1 block text-sm font-bold text-[#17365D] hover:underline"
                >
                  {bm.targetTitle}
                </Link>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <Link
                  href={bm.href}
                  className="inline-flex items-center gap-1 rounded border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-800 hover:bg-slate-100"
                >
                  <span>Open Guide</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => toggleBookmark(bm)}
                  aria-label={`Remove ${bm.targetTitle} from bookmarks`}
                  className="inline-flex items-center gap-1 rounded border border-red-200 bg-red-50 px-2.5 py-1.5 font-medium text-red-800 hover:bg-red-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
