"use client";

import React, { useState } from "react";
import Link from "next/link";
import { KeyRound, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { passwordRecoveryRequestSchema } from "@/lib/validations/schemas";
import { requestPasswordRecoveryAction } from "@/lib/auth/actions";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const parsed = passwordRecoveryRequestSchema.safeParse({ email });
    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message || "Enter a valid email address."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await requestPasswordRecoveryAction({
        email: parsed.data.email,
      });

      if (!result.ok) {
        setError(result.message);
        return;
      }

      setSuccessMessage(result.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-md border border-[var(--gabay-border)] bg-[var(--gabay-surface)] p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#17365D] dark:text-teal-300">
          <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Account Password Recovery</span>
        </div>
        <h1 className="gabay-page-title mt-1.5 text-[var(--gabay-text)]">
          Reset Your Password
        </h1>
        <p className="mt-1 text-xs text-[var(--gabay-neutral)]">
          Enter the email address associated with your GabayPH account. For your security, we will send a single-use password reset link if an account exists.
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

        {successMessage ? (
          <div
            role="status"
            className="mt-4 space-y-3 rounded border border-emerald-300 bg-emerald-50 p-4 text-xs text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200"
          >
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400" />
              <p className="leading-relaxed">{successMessage}</p>
            </div>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded bg-[#17365D] px-3.5 py-2 font-semibold text-white hover:bg-[#102847]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
            <div>
              <label
                htmlFor="recover-email"
                className="block font-semibold text-[var(--gabay-text)]"
              >
                Registered Email Address
              </label>
              <input
                id="recover-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan.delacruz@example.ph"
                className="mt-1 min-h-[40px] w-full rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-3 py-2 text-xs text-[var(--gabay-text)]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-[42px] w-full rounded bg-[#17365D] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#102847] disabled:opacity-60"
            >
              {isSubmitting ? "Sending Reset Link..." : "Send Password Reset Link"}
            </button>
          </form>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-[var(--gabay-border)] pt-4 text-xs text-[var(--gabay-neutral)]">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 font-semibold text-[#17365D] hover:underline dark:text-teal-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Sign In</span>
          </Link>
          <Link
            href="/register"
            className="font-semibold text-[#17365D] hover:underline dark:text-teal-300"
          >
            Create Account →
          </Link>
        </div>
      </div>
    </div>
  );
}
