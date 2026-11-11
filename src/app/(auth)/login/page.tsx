"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, AlertCircle, Lock, KeyRound, Eye, EyeOff } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="mx-auto max-w-md px-4 py-8 sm:py-12">
      <div className="space-y-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#17365D] dark:text-teal-300">
            <Lock className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Citizen &amp; Staff Authentication</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight dark:text-slate-100">
            Sign In to GabayPH
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed dark:text-slate-400">
            Public directories, checklists, and calculators remain 100% accessible without an account. Sign in to sync saved bookmarks, manage your regional profile, or access authorized RBAC tools.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 p-2.5 text-xs text-red-900 dark:border-red-800 dark:bg-red-950/60 dark:text-red-200"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-red-700 dark:text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label
              htmlFor="login-email"
              className="block font-semibold text-slate-700 dark:text-slate-300"
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
              className="mt-1 min-h-[40px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#17365D] focus:outline-none focus:ring-1 focus:ring-[#17365D] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="login-password"
                className="block font-semibold text-slate-700 dark:text-slate-300"
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
            <div className="relative mt-1">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="min-h-[40px] w-full rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-10 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#17365D] focus:outline-none focus:ring-1 focus:ring-[#17365D] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <details className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-900/50">
            <summary className="cursor-pointer text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Local RBAC Test Role Selector (Offline Verification Mode Only)
            </summary>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              In production Supabase mode, roles are strictly verified on the server from <code>public.user_roles</code> and cannot be chosen by the client.
            </p>
            <label
              htmlFor="login-role"
              className="mt-2 block text-[11px] font-semibold text-slate-700 dark:text-slate-300"
            >
              Simulated Role
            </label>
            <select
              id="login-role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-[#17365D] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              <option value="user">USER (Standard Citizen Account)</option>
              <option value="content_manager">
                CONTENT MANAGER (Manage &amp; Submit Authorized Content)
              </option>
              <option value="moderator">
                MODERATOR (Review Reports &amp; Community Moderation)
              </option>
              <option value="administrator">
                ADMINISTRATOR (Manage Content, Roles &amp; Audit Logs)
              </option>
            </select>
          </details>

          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-[42px] w-full rounded-lg bg-[#17365D] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#102847] disabled:opacity-60 shadow-2xs"
          >
            {isSubmitting ? "Signing In..." : "Sign In to Citizen Portal"}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>New to GabayPH?</span>
          <Link
            href="/register"
            className="font-bold text-[#17365D] hover:underline dark:text-teal-300"
          >
            Create a Free Account →
          </Link>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span>Republic Act 10173 &amp; RLS Protection</span>
          </div>
          <p className="leading-relaxed">
            Protected by Supabase Auth, server-side validation, and Row Level Security (RLS). We never sell personal contact data to third parties.
          </p>
        </div>
      </div>
    </div>
  );
}
