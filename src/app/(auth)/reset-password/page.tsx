"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { passwordResetSchema } from "@/lib/validations/schemas";
import { resetPasswordAction } from "@/lib/auth/actions";
import { useThemeAndToast } from "@/components/providers/theme-provider";

export default function ResetPasswordPage() {
  const { showToast } = useThemeAndToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedMessage, setCompletedMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = passwordResetSchema.safeParse({
      password,
      confirmPassword,
    });
    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message || "Please check your new password."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await resetPasswordAction(parsed.data);
      if (!result.ok) {
        setError(result.message);
        return;
      }

      setCompletedMessage(result.message);
      showToast({ title: "Password updated.", variant: "success" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-md border border-[var(--gabay-border)] bg-[var(--gabay-surface)] p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#17365D] dark:text-teal-300">
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Set New Account Password</span>
        </div>
        <h1 className="gabay-page-title mt-1.5 text-[var(--gabay-text)]">
          Choose a New Password
        </h1>
        <p className="mt-1 text-xs text-[var(--gabay-neutral)]">
          Enter a strong password of at least 8 characters including an uppercase letter and a number.
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

        {completedMessage ? (
          <div
            role="status"
            className="mt-4 space-y-3 rounded border border-emerald-300 bg-emerald-50 p-4 text-xs text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200"
          >
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400" />
              <p>{completedMessage}</p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Link
                href="/profile"
                className="rounded bg-[#17365D] px-3.5 py-2 font-semibold text-white hover:bg-[#102847]"
              >
                Go to My Profile
              </Link>
              <Link
                href="/login"
                className="rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-3.5 py-2 font-semibold text-[var(--gabay-text)] hover:bg-[var(--gabay-surface-muted)]"
              >
                Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
            <div>
              <label
                htmlFor="reset-new-password"
                className="block font-semibold text-[var(--gabay-text)]"
              >
                New Password (8+ chars, 1 uppercase, 1 number)
              </label>
              <input
                id="reset-new-password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 min-h-[40px] w-full rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-3 py-2 text-xs text-[var(--gabay-text)]"
              />
            </div>

            <div>
              <label
                htmlFor="reset-confirm-password"
                className="block font-semibold text-[var(--gabay-text)]"
              >
                Confirm New Password
              </label>
              <input
                id="reset-confirm-password"
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 min-h-[40px] w-full rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-3 py-2 text-xs text-[var(--gabay-text)]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-[42px] w-full rounded bg-[#17365D] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#102847] disabled:opacity-60"
            >
              {isSubmitting ? "Updating Password..." : "Update Password"}
            </button>
          </form>
        )}

        <div className="mt-4 flex items-center gap-1.5 text-[11px] text-[var(--gabay-neutral)]">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
          <span>Passwords are encrypted and managed directly by Supabase Auth.</span>
        </div>
      </div>
    </div>
  );
}
