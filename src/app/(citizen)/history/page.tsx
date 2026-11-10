"use client";

import React, { useState } from "react";
import Link from "next/link";
import { History, Trash2, Shield, Search } from "lucide-react";
import { useCitizenState } from "@/components/providers/citizen-state-provider";

export default function SearchHistoryPage() {
  const { user, searchHistory, clearSearchHistory, updateProfile } =
    useCitizenState();
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded bg-blue-50 px-2.5 py-0.5 text-xs font-bold uppercase text-[#17365D]">
            <History className="h-3.5 w-3.5" />
            <span>Search History & Privacy Controls</span>
          </div>
          <h1 className="mt-1.5 text-xl font-bold text-slate-900">
            Your Recent Searches & Privacy Settings
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            You have complete control over your search history. Search history is never shared with third parties.
          </p>
        </div>

        {searchHistory.length > 0 && !confirmClear && (
          <button
            type="button"
            onClick={() => setConfirmClear(true)}
            className="inline-flex items-center gap-1.5 rounded border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-800 hover:bg-red-100"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear All History</span>
          </button>
        )}
      </div>

      {confirmClear && (
        <div
          role="alertdialog"
          aria-labelledby="clear-history-title"
          className="mb-6 rounded border border-red-300 bg-red-50 p-4 text-xs text-red-950"
        >
          <h2 id="clear-history-title" className="font-bold">
            Clear All Saved Search Queries?
          </h2>
          <p className="mt-1">
            This will permanently remove all {searchHistory.length} recorded search entries from your device and account.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => {
                clearSearchHistory();
                setConfirmClear(false);
              }}
              className="rounded bg-red-700 px-3 py-1.5 font-semibold text-white hover:bg-red-800"
            >
              Confirm Clear History
            </button>
            <button
              type="button"
              onClick={() => setConfirmClear(false)}
              className="rounded border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {user && (
        <div className="mb-6 flex items-center justify-between rounded-md border border-slate-200 bg-white p-4 text-xs">
          <div className="flex items-start gap-2.5">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#17365D]" />
            <div>
              <strong className="text-slate-900">
                Search History Recording Preference
              </strong>
              <p className="text-slate-600">
                When paused, GabayPH will not record any future search queries on your profile.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              updateProfile({ saveSearchHistory: !user.saveSearchHistory })
            }
            className={`rounded border px-3 py-1.5 font-semibold ${
              user.saveSearchHistory
                ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                : "border-slate-300 bg-slate-100 text-slate-700"
            }`}
          >
            {user.saveSearchHistory ? "Recording: ON" : "Recording: PAUSED"}
          </button>
        </div>
      )}

      {searchHistory.length === 0 ? (
        <div className="rounded-md border border-slate-200 bg-white p-8 text-center text-xs text-slate-600">
          No recent search queries recorded.
        </div>
      ) : (
        <div className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white text-xs">
          {searchHistory.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-2 p-3.5 hover:bg-slate-50"
            >
              <div className="flex items-center gap-2.5">
                <Search className="h-3.5 w-3.5 text-slate-400" />
                <div>
                  <span className="font-semibold text-slate-900">
                    {item.query}
                  </span>
                  <span className="ml-2 text-slate-500">
                    Module: {item.moduleFilter} · Region: {item.regionFilter}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-slate-400">{item.timestamp}</span>
                <Link
                  href={`/search?q=${encodeURIComponent(item.query)}&module=${item.moduleFilter}&region=${item.regionFilter}`}
                  className="font-semibold text-[#17365D] hover:underline"
                >
                  Run Search Again →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
