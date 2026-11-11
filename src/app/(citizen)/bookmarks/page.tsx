"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  Trash2,
  ArrowUpRight,
  Printer,
  ShieldCheck,
  Search,
  BookOpen,
} from "lucide-react";
import { useCitizenState } from "@/components/providers/citizen-state-provider";
import type { ModuleType } from "@/types/database";

const MODULE_LABELS: Record<ModuleType, string> = {
  serbisyo: "Serbisyo",
  trabaho: "Trabaho",
  pera: "Pera",
  aral: "Aral",
  kaligtasan: "Kaligtasan",
  bayanihan: "Bayanihan",
};

export default function BookmarksPage() {
  const { bookmarks, toggleBookmark, completedChecklistIds } = useCitizenState();
  const [activeModule, setActiveModule] = useState<string>("all");

  const filteredBookmarks = bookmarks.filter(
    (b) => activeModule === "all" || b.targetModule === activeModule
  );

  const availableModules: ModuleType[] = [
    "serbisyo",
    "trabaho",
    "pera",
    "aral",
    "kaligtasan",
    "bayanihan",
  ];

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Recently";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-10 space-y-6 sm:space-y-8">
      {/* Header & Page Title (Cardless Editorial Style) */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#17365D]">
              <Bookmark className="h-4 w-4 text-[#17365D]" />
              <span>Saved Resources &amp; Checklists</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              My Saved Resources &amp; Checklists
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl">
              Saved locally on this device. Accessible anytime even without cellular data for quick reference at government offices.
            </p>
          </div>

          {bookmarks.length > 0 && (
            <button
              type="button"
              onClick={handlePrint}
              className="no-print inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 hover:bg-slate-50 shadow-2xs transition"
            >
              <Printer className="h-3.5 w-3.5 text-[#17365D]" />
              <span>Print Application Pack</span>
            </button>
          )}
        </div>

        {/* Category Tabs (Editorial Horizontal Underline, No Boxes) */}
        {bookmarks.length > 0 && (
          <div className="no-print no-scrollbar flex gap-4 overflow-x-auto whitespace-nowrap border-b border-slate-200 pt-3 text-xs font-semibold text-slate-500">
            <button
              type="button"
              onClick={() => setActiveModule("all")}
              className={`pb-2.5 transition ${
                activeModule === "all"
                  ? "border-b-2 border-[#17365D] font-bold text-[#17365D]"
                  : "hover:text-slate-800"
              }`}
            >
              All Saved ({bookmarks.length})
            </button>
            {availableModules.map((mod) => {
              const count = bookmarks.filter((b) => b.targetModule === mod).length;
              if (count === 0) return null;
              return (
                <button
                  key={mod}
                  type="button"
                  onClick={() => setActiveModule(mod)}
                  className={`pb-2.5 transition ${
                    activeModule === mod
                      ? "border-b-2 border-[#17365D] font-bold text-[#17365D]"
                      : "hover:text-slate-800"
                  }`}
                >
                  {MODULE_LABELS[mod] || mod} ({count})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {bookmarks.length === 0 ? (
        /* Empty State (Open, Cardless) */
        <div className="py-14 sm:py-16 text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Bookmark className="h-6 w-6 stroke-[1.5]" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h2 className="text-base font-bold text-slate-900">
              No saved guides or checklists yet
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Click the bookmark icon on any government service guide, scholarship, or financial assistance program to keep it here for quick offline reference.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap justify-center gap-2.5 text-xs">
            <Link
              href="/serbisyo"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#17365D] text-white font-semibold hover:bg-[#102847] transition shadow-2xs"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Browse Serbisyo Guides</span>
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 font-semibold hover:bg-slate-50 transition shadow-2xs"
            >
              <Search className="h-3.5 w-3.5 text-slate-500" />
              <span>Universal Search</span>
            </Link>
          </div>
        </div>
      ) : filteredBookmarks.length === 0 ? (
        /* Empty Filter State */
        <div className="py-12 text-center text-xs text-slate-500">
          <p>No saved bookmarks under this category.</p>
          <button
            type="button"
            onClick={() => setActiveModule("all")}
            className="mt-2 text-xs font-semibold text-[#17365D] hover:underline"
          >
            Show all saved items ({bookmarks.length})
          </button>
        </div>
      ) : (
        /* Bookmarks List (Open Editorial Dividers, NO Boxed Cards) */
        <div className="divide-y divide-slate-100 border-y border-slate-200">
          {filteredBookmarks.map((bm) => {
            const completedCount = completedChecklistIds[bm.targetId]?.length || 0;
            return (
              <div
                key={bm.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-slate-50/60 -mx-2 px-2 rounded-lg transition"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase text-slate-700">
                      {MODULE_LABELS[bm.targetModule] || bm.targetModule}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Saved {formatDate(bm.createdAt)}
                    </span>
                    {completedCount > 0 && (
                      <>
                        <span className="text-slate-300">·</span>
                        <span className="text-[11px] text-emerald-700 font-medium">
                          {completedCount} requirement{completedCount > 1 ? "s" : ""} checked
                        </span>
                      </>
                    )}
                  </div>

                  <Link
                    href={bm.href}
                    className="block text-sm font-bold text-slate-900 group-hover:text-[#17365D] transition"
                  >
                    {bm.targetTitle}
                  </Link>

                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5">
                    <span className="capitalize">{bm.targetType.replace(/_/g, " ")}</span>
                    <span>·</span>
                    <span>Official Civic Guide</span>
                    {bm.notes && (
                      <>
                        <span>·</span>
                        <span className="italic">{bm.notes}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 text-xs">
                  <Link
                    href={bm.href}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#17365D] text-white font-semibold hover:bg-[#102847] transition shadow-2xs"
                  >
                    <span>Open Guide</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleBookmark(bm)}
                    aria-label={`Remove ${bm.targetTitle} from bookmarks`}
                    title="Remove from bookmarks"
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-red-700 hover:border-red-200 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Data Privacy & Offline Storage Notice (Open text, no card box) */}
      <div className="pt-4 text-xs text-slate-500 space-y-1.5 border-t border-slate-200/80">
        <div className="flex items-center gap-1.5 font-bold text-slate-700">
          <ShieldCheck className="h-4 w-4 text-[#17365D]" />
          <span>Data Privacy &amp; Offline Storage Notice</span>
        </div>
        <p className="leading-relaxed">
          Your saved items and completed checklist requirements are stored directly on your device. They are not transmitted to or tracked by third-party advertisers. Sign in if you want to securely sync your saved public service guides across all your devices.
        </p>
      </div>
    </div>
  );
}
