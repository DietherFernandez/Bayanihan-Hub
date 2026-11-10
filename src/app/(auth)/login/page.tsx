"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, AlertCircle, Lock, KeyRound } from "lucide-react";
import { authLoginSchema } from "@/lib/validations/schemas";
import { loginCitizenAction } from "@/lib/auth/actions";
import { canAccessAdminDashboard } from "@/lib/auth/rbac";
import { useCitizenState } from "@/components/providers/citizen-state-provider";
import { useThemeAndToast } from "@/components/providers/theme-provider";
import type { UserRole } from "@/types/database";

export default function LoginPage() {
  const router = useRouter();
  const { setAuthenticatedUser, loginDemoUser } = useCitizenState();
  const { showToast } = useThemeAndToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("user");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = authLoginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Invalid email or password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await loginCitizenAction({
        email: parsed.data.email,
        password: parsed.data.password,
      });

      if (!result.ok) {
        setError(result.message);
        return;
      }

      if (result.mode === "supabase" && result.user) {
        setAuthenticatedUser(result.user);
        showToast({
          title: "Signed in to your GabayPH account.",
          variant: "success",
        });
        if (canAccessAdminDashboard(result.user.role)) {
          router.push("/admin");
        } else {
          router.push("/profile");
        }
        return;
      }

      // Local fallback mode when Supabase environment variables are not configured
      loginDemoUser({
        email: parsed.data.email,
        role: selectedRole,
        regionCode: "NCR",
      });
      showToast({ title: result.message, variant: "info" });

      if (canAccessAdminDashboard(selectedRole)) {
        router.push("/admin");
      } else {
        router.push("/profile");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-md border border-[var(--gabay-border)] bg-[var(--gabay-surface)] p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#17365D] dark:text-teal-300">
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Citizen & Staff Authentication</span>
        </div>
        <h1 className="gabay-page-title mt-1.5 text-[var(--gabay-text)]">
          Sign In to GabayPH
        </h1>
        <p className="mt-1 text-xs text-[var(--gabay-neutral)]">
          Public directories, checklists, and calculators remain 100% accessible without an account. Sign in to sync saved bookmarks, manage your regional profile, or access authorized RBAC tools.
        </p>

        {error && (
          <div
            role="alert"
            className="mt-4 flex items-center gap-2 rounded border border-red-300 bg-red-50 p-2.5 text-xs text-red-900 dark:border-red-800 dark:bg-red-950/60 dark:text-red-200"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-red-700 dark:text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label
              htmlFor="login-email"
              className="block font-semibold text-[var(--gabay-text)]"
            >
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="juan.delacruz@example.ph"
              className="mt-1 min-h-[40px] w-full rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-3 py-2 text-xs text-[var(--gabay-text)]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="login-password"
                className="block font-semibold text-[var(--gabay-text)]"
              >
                Password (minimum 8 characters)
              </label>
              <Link
                href="/forgot-password"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#17365D] hover:underline dark:text-teal-300"
              >
                <KeyRound className="h-3 w-3" aria-hidden="true" />
                <span>Forgot password?</span>
              </Link>
            </div>
            <input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 min-h-[40px] w-full rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-3 py-2 text-xs text-[var(--gabay-text)]"
            />
          </div>

          <details className="rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface-muted)] p-2.5">
            <summary className="cursor-pointer text-[11px] font-semibold text-[var(--gabay-text)]">
              Local RBAC Test Role Selector (Offline Verification Mode Only)
            </summary>
            <p className="mt-1 text-[11px] text-[var(--gabay-neutral)]">
              In production Supabase mode, roles are strictly verified on the server from <code>public.user_roles</code> and cannot be chosen by the client.
            </p>
            <label
              htmlFor="login-role"
              className="mt-2 block text-[11px] font-semibold text-[var(--gabay-text)]"
            >
              Simulated Role
            </label>
            <select
              id="login-role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="mt-1 w-full rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-2.5 py-1.5 text-xs text-[var(--gabay-text)]"
            >
              <option value="user">USER (Standard Citizen Account)</option>
              <option value="content_manager">
                CONTENT MANAGER (Manage & Submit Authorized Content)
              </option>
              <option value="moderator">
                MODERATOR (Review Reports & Community Moderation)
              </option>
              <option value="administrator">
                ADMINISTRATOR (Manage Content, Roles & Audit Logs)
              </option>
            </select>
          </details>

          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-[42px] w-full rounded bg-[#17365D] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#102847] disabled:opacity-60"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between border-t border-[var(--gabay-border)] pt-4 text-xs text-[var(--gabay-neutral)]">
          <span>New to GabayPH?</span>
          <Link
            href="/register"
            className="font-semibold text-[#17365D] hover:underline dark:text-teal-300"
          >
            Create a free Citizen Account →
          </Link>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[var(--gabay-neutral)]">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
          <span>
            Protected by Supabase Auth, server-side validation, and Row Level Security (RLS)
          </span>
        </div>
      </div>
    </div>
  );
}
