"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  LogOut,
  Trash2,
  CheckCircle2,
  Shield,
  LayoutDashboard,
} from "lucide-react";
import { useCitizenState } from "@/components/providers/citizen-state-provider";
import { PH_LOCATIONS } from "@/lib/constants/philippine-data";
import {
  canAccessAdminDashboard,
  formatRoleLabel,
} from "@/lib/auth/rbac";

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateProfile, logoutUser, deleteAccount } = useCitizenState();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10">
        <div className="rounded-md border border-slate-200 bg-white p-6 text-center">
          <h1 className="text-lg font-bold text-slate-900">
            Not Currently Signed In
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            You can browse all GabayPH public services, checklists, and calculators without an account, or sign in to manage your profile and cloud bookmarks.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link
              href="/login"
              className="rounded bg-[#0B3D91] px-4 py-2 text-xs font-semibold text-white hover:bg-[#082d6b]"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded bg-blue-50 px-2.5 py-0.5 text-xs font-bold uppercase text-[#0B3D91]">
            <User className="h-3.5 w-3.5" />
            <span>Citizen Profile & Privacy Settings</span>
          </div>
          <h1 className="mt-1.5 text-xl font-bold text-slate-900">
            {user.fullName}
          </h1>
          <p className="text-xs text-slate-600">
            Role: <strong>{formatRoleLabel(user.role)}</strong> · Email:{" "}
            {user.email}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canAccessAdminDashboard(user.role) && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded bg-[#0B3D91] px-3 py-2 text-xs font-semibold text-white hover:bg-[#082d6b]"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Open Admin Dashboard</span>
            </Link>
          )}
          <button
            type="button"
            onClick={() => {
              logoutUser();
              router.push("/");
            }}
            className="inline-flex items-center gap-1.5 rounded border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="mb-4 flex items-center gap-2 rounded border border-emerald-300 bg-emerald-50 p-3 text-xs text-emerald-950">
          <CheckCircle2 className="h-4 w-4 text-emerald-700" />
          <span>Profile preferences updated.</span>
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="space-y-4 rounded-md border border-slate-200 bg-white p-5 text-xs"
      >
        <div>
          <label
            htmlFor="prof-name"
            className="block font-semibold text-slate-800"
          >
            Full Name / Display Name
          </label>
          <input
            id="prof-name"
            type="text"
            value={user.fullName}
            onChange={(e) => updateProfile({ fullName: e.target.value })}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="prof-region"
              className="block font-semibold text-slate-800"
            >
              Default Region Filter
            </label>
            <select
              id="prof-region"
              value={user.regionCode}
              onChange={(e) => updateProfile({ regionCode: e.target.value })}
              className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2"
            >
              {PH_LOCATIONS.map((l) => (
                <option key={l.id} value={l.regionCode}>
                  {l.regionCode} — {l.regionName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="prof-lang"
              className="block font-semibold text-slate-800"
            >
              Preferred Guide Language
            </label>
            <select
              id="prof-lang"
              value={user.preferredLanguage}
              onChange={(e) =>
                updateProfile({
                  preferredLanguage: e.target.value as "en" | "fil",
                })
              }
              className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2"
            >
              <option value="en">English (with Filipino terms)</option>
              <option value="fil">Filipino / Tagalog</option>
            </select>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded border border-slate-200 bg-slate-50 p-3">
          <input
            id="prof-history"
            type="checkbox"
            checked={user.saveSearchHistory}
            onChange={(e) =>
              updateProfile({ saveSearchHistory: e.target.checked })
            }
            className="mt-0.5"
          />
          <label htmlFor="prof-history" className="text-slate-700">
            <strong>Save My Search History:</strong> Keep a private list of my search queries on this account. You can view or clear your history at any time in{" "}
            <Link href="/history" className="text-[#0B3D91] underline">
              Search History Controls
            </Link>
            .
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded bg-[#0B3D91] px-4 py-2 text-xs font-semibold text-white hover:bg-[#082d6b]"
          >
            Save Preferences
          </button>
        </div>
      </form>

      {/* Account Deletion Section (Accessible Inline Confirmation — No Browser confirm()) */}
      <section
        aria-labelledby="delete-account-heading"
        className="mt-8 rounded-md border border-red-200 bg-white p-5 text-xs"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="delete-account-heading"
              className="flex items-center gap-1.5 text-sm font-bold text-red-900"
            >
              <Shield className="h-4 w-4 text-red-700" />
              <span>Data Privacy & Account Deletion</span>
            </h2>
            <p className="mt-1 text-slate-600">
              Permanently delete your GabayPH profile, saved bookmarks, checklist progress, and search history.
            </p>
          </div>

          {!confirmDeleteOpen && (
            <button
              type="button"
              onClick={() => setConfirmDeleteOpen(true)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded border border-red-300 bg-red-50 px-3 py-2 font-semibold text-red-800 hover:bg-red-100"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete Account</span>
            </button>
          )}
        </div>

        {confirmDeleteOpen && (
          <div
            role="alertdialog"
            aria-labelledby="confirm-delete-title"
            className="mt-4 rounded border border-red-300 bg-red-50 p-4 text-red-950"
          >
            <h3 id="confirm-delete-title" className="font-bold">
              Confirm Permanent Account Deletion
            </h3>
            <p className="mt-1">
              Are you sure you want to permanently remove your profile, bookmarks, and checklist progress? This action cannot be undone.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  deleteAccount();
                  router.push("/");
                }}
                className="rounded bg-red-700 px-3.5 py-1.5 font-semibold text-white hover:bg-red-800"
              >
                Yes, Permanently Delete My Account
              </button>
              <button
                type="button"
                onClick={() => setConfirmDeleteOpen(false)}
                className="rounded border border-slate-300 bg-white px-3.5 py-1.5 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
