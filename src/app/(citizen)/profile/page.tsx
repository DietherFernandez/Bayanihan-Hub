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
  KeyRound,
  AlertCircle,
  MapPin,
} from "lucide-react";
import { useCitizenState } from "@/components/providers/citizen-state-provider";
import { useThemeAndToast } from "@/components/providers/theme-provider";
import { PH_LOCATIONS } from "@/lib/constants/philippine-data";
import {
  canAccessAdminDashboard,
  formatRoleLabel,
  normalizeToCanonicalRole,
  ROLE_PERMISSION_MATRIX,
} from "@/lib/auth/rbac";
import {
  logoutCitizenAction,
  updateCitizenProfileAction,
} from "@/lib/auth/actions";

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateProfile, logoutUser, deleteAccount } = useCitizenState();
  const { showToast } = useThemeAndToast();

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10">
        <div className="rounded-md border border-[var(--gabay-border)] bg-[var(--gabay-surface)] p-6 text-center">
          <h1 className="gabay-page-title text-[var(--gabay-text)]">
            Not Currently Signed In
          </h1>
          <p className="mt-1 text-xs text-[var(--gabay-neutral)]">
            You can browse all GabayPH public services, checklists, and calculators without an account, or sign in to manage your profile and cloud bookmarks.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link
              href="/login"
              className="rounded bg-[#17365D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#102847]"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-4 py-2 text-xs font-semibold text-[var(--gabay-text)] hover:bg-[var(--gabay-surface-muted)]"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const canonicalRole = normalizeToCanonicalRole(user.role);
  const permissions = ROLE_PERMISSION_MATRIX[canonicalRole];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice(null);
    setSavedNotice(null);
    setIsSaving(true);

    try {
      const result = await updateCitizenProfileAction({
        fullName: user.fullName,
        username: user.username || "",
        phoneNumber: user.phoneNumber || "",
        regionCode: user.regionCode,
        province: user.province || "",
        cityMunicipality: user.cityMunicipality || "",
        barangay: user.barangay || "",
        preferredLanguage: user.preferredLanguage,
        saveSearchHistory: user.saveSearchHistory,
      });

      if (!result.ok) {
        setErrorNotice(result.message);
        return;
      }

      setSavedNotice(result.message);
      showToast({ title: "Profile updated.", variant: "success" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logoutCitizenAction();
    logoutUser();
    showToast({
      title: "Signed out of your GabayPH account.",
      variant: "info",
    });
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--gabay-border)] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded bg-blue-50 px-2.5 py-0.5 text-xs font-bold uppercase text-[#17365D] dark:bg-slate-800 dark:text-teal-300">
            <User className="h-3.5 w-3.5" />
            <span>Citizen Profile, RBAC & Privacy Settings</span>
          </div>
          <h1 className="gabay-page-title mt-1.5 text-[var(--gabay-text)]">
            {user.fullName}
          </h1>
          <p className="text-xs text-[var(--gabay-neutral)]">
            Role: <strong>{formatRoleLabel(user.role)}</strong> (
            <code>{canonicalRole}</code>) · Status:{" "}
            <strong className="capitalize">
              {user.accountStatus || "active"}
            </strong>{" "}
            · Email: {user.email}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canAccessAdminDashboard(user.role) && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded bg-[#17365D] px-3 py-2 text-xs font-semibold text-white hover:bg-[#102847]"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Open Admin Dashboard</span>
            </Link>
          )}
          <Link
            href="/reset-password"
            className="inline-flex items-center gap-1.5 rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-3 py-2 text-xs font-semibold text-[var(--gabay-text)] hover:bg-[var(--gabay-surface-muted)]"
          >
            <KeyRound className="h-3.5 w-3.5" />
            <span>Change Password</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-3 py-2 text-xs font-semibold text-[var(--gabay-text)] hover:bg-[var(--gabay-surface-muted)]"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {savedNotice && (
        <div
          role="status"
          className="mb-4 flex items-center gap-2 rounded border border-emerald-300 bg-emerald-50 p-3 text-xs text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
          <span>{savedNotice}</span>
        </div>
      )}

      {errorNotice && (
        <div
          role="alert"
          className="mb-4 flex items-center gap-2 rounded border border-red-300 bg-red-50 p-3 text-xs text-red-900 dark:border-red-800 dark:bg-red-950/60 dark:text-red-200"
        >
          <AlertCircle className="h-4 w-4 text-red-700 dark:text-red-400" />
          <span>{errorNotice}</span>
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="space-y-4 rounded-md border border-[var(--gabay-border)] bg-[var(--gabay-surface)] p-5 text-xs"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label
              htmlFor="prof-name"
              className="block font-semibold text-[var(--gabay-text)]"
            >
              Full Name / Display Name *
            </label>
            <input
              id="prof-name"
              type="text"
              required
              value={user.fullName}
              onChange={(e) => updateProfile({ fullName: e.target.value })}
              className="mt-1 min-h-[38px] w-full rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-3 py-2 text-[var(--gabay-text)]"
            />
          </div>

          <div>
            <label
              htmlFor="prof-username"
              className="block font-semibold text-[var(--gabay-text)]"
            >
              Username (Optional)
            </label>
            <input
              id="prof-username"
              type="text"
              value={user.username || ""}
              onChange={(e) => updateProfile({ username: e.target.value })}
              placeholder="juandelacruz"
              className="mt-1 min-h-[38px] w-full rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-3 py-2 text-[var(--gabay-text)]"
            />
          </div>

          <div>
            <label
              htmlFor="prof-phone"
              className="block font-semibold text-[var(--gabay-text)]"
            >
              Mobile Number (Optional)
            </label>
            <input
              id="prof-phone"
              type="tel"
              value={user.phoneNumber || ""}
              onChange={(e) => updateProfile({ phoneNumber: e.target.value })}
              placeholder="09171234567"
              className="mt-1 min-h-[38px] w-full rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-3 py-2 text-[var(--gabay-text)]"
            />
          </div>
        </div>

        <div className="rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface-muted)] p-3.5">
          <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase text-[#17365D] dark:text-teal-300">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Geographic Coverage (Region, Province, City/Municipality, Barangay)</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="prof-region"
                className="block font-semibold text-[var(--gabay-text)]"
              >
                Default Region Filter
              </label>
              <select
                id="prof-region"
                value={user.regionCode}
                onChange={(e) => updateProfile({ regionCode: e.target.value })}
                className="mt-1 min-h-[38px] w-full rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-3 py-2 text-[var(--gabay-text)]"
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
                htmlFor="prof-province"
                className="block font-semibold text-[var(--gabay-text)]"
              >
                Province (Optional)
              </label>
              <input
                id="prof-province"
                type="text"
                value={user.province || ""}
                onChange={(e) => updateProfile({ province: e.target.value })}
                placeholder="e.g., Cebu, Cavite"
                className="mt-1 min-h-[38px] w-full rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-3 py-2 text-[var(--gabay-text)]"
              />
            </div>

            <div>
              <label
                htmlFor="prof-city"
                className="block font-semibold text-[var(--gabay-text)]"
              >
                City / Municipality (Optional)
              </label>
              <input
                id="prof-city"
                type="text"
                value={user.cityMunicipality || ""}
                onChange={(e) =>
                  updateProfile({ cityMunicipality: e.target.value })
                }
                placeholder="e.g., Quezon City"
                className="mt-1 min-h-[38px] w-full rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-3 py-2 text-[var(--gabay-text)]"
              />
            </div>

            <div>
              <label
                htmlFor="prof-barangay"
                className="block font-semibold text-[var(--gabay-text)]"
              >
                Barangay (Optional)
              </label>
              <input
                id="prof-barangay"
                type="text"
                value={user.barangay || ""}
                onChange={(e) => updateProfile({ barangay: e.target.value })}
                placeholder="e.g., Barangay Commonwealth"
                className="mt-1 min-h-[38px] w-full rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-3 py-2 text-[var(--gabay-text)]"
              />
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="prof-lang"
            className="block font-semibold text-[var(--gabay-text)]"
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
            className="mt-1 min-h-[38px] w-full rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-3 py-2 text-[var(--gabay-text)]"
          >
            <option value="en">English (with Filipino terms)</option>
            <option value="fil">Filipino / Tagalog</option>
          </select>
        </div>

        <div className="flex items-start gap-2.5 rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface-muted)] p-3">
          <input
            id="prof-history"
            type="checkbox"
            checked={user.saveSearchHistory}
            onChange={(e) =>
              updateProfile({ saveSearchHistory: e.target.checked })
            }
            className="mt-0.5"
          />
          <label htmlFor="prof-history" className="text-[var(--gabay-text)]">
            <strong>Save My Search History:</strong> Keep a private list of my search queries on this account. You can view or clear your history at any time in{" "}
            <Link
              href="/history"
              className="text-[#17365D] underline dark:text-teal-300"
            >
              Search History Controls
            </Link>
            .
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded bg-[#17365D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#102847] disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </form>

      {/* Role-Based Access Control (RBAC) Summary */}
      <section
        aria-labelledby="rbac-summary-heading"
        className="mt-6 rounded-md border border-[var(--gabay-border)] bg-[var(--gabay-surface)] p-5 text-xs"
      >
        <h2
          id="rbac-summary-heading"
          className="text-sm font-bold text-[var(--gabay-text)]"
        >
          Server-Enforced Role Permissions ({canonicalRole.toUpperCase()})
        </h2>
        <p className="mt-1 text-[var(--gabay-neutral)]">
          Permissions are enforced by PostgreSQL Row Level Security (RLS) and server actions. Users cannot modify their own roles.
        </p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {permissions.map((perm) => (
            <span
              key={perm}
              className="rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface-muted)] px-2.5 py-1 font-mono text-[11px] text-[var(--gabay-text)]"
            >
              {perm}
            </span>
          ))}
        </div>
      </section>

      {/* Account Deletion Section (Accessible Inline Confirmation — No Browser confirm()) */}
      <section
        aria-labelledby="delete-account-heading"
        className="mt-6 rounded-md border border-red-200 bg-[var(--gabay-surface)] p-5 text-xs dark:border-red-900/60"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="delete-account-heading"
              className="flex items-center gap-1.5 text-sm font-bold text-red-900 dark:text-red-300"
            >
              <Shield className="h-4 w-4 text-red-700 dark:text-red-400" />
              <span>Data Privacy & Account Deletion</span>
            </h2>
            <p className="mt-1 text-[var(--gabay-neutral)]">
              Permanently delete your GabayPH profile, saved bookmarks, checklist progress, and search history.
            </p>
          </div>

          {!confirmDeleteOpen && (
            <button
              type="button"
              onClick={() => setConfirmDeleteOpen(true)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded border border-red-300 bg-red-50 px-3 py-2 font-semibold text-red-800 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/60 dark:text-red-300"
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
            className="mt-4 rounded border border-red-300 bg-red-50 p-4 text-red-950 dark:border-red-800 dark:bg-red-950/80 dark:text-red-200"
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
                className="rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-3.5 py-1.5 font-semibold text-[var(--gabay-text)] hover:bg-[var(--gabay-surface-muted)]"
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
