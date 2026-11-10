"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  AlertCircle,
  ShieldCheck,
  MailCheck,
  MapPin,
} from "lucide-react";
import { authRegisterSchema } from "@/lib/validations/schemas";
import { registerCitizenAction } from "@/lib/auth/actions";
import { PH_LOCATIONS } from "@/lib/constants/philippine-data";
import { useCitizenState } from "@/components/providers/citizen-state-provider";
import { useThemeAndToast } from "@/components/providers/theme-provider";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuthenticatedUser } = useCitizenState();
  const { showToast } = useThemeAndToast();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [regionCode, setRegionCode] = useState("NCR");
  const [province, setProvince] = useState("");
  const [cityMunicipality, setCityMunicipality] = useState("");
  const [barangay, setBarangay] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saveSearchHistory, setSaveSearchHistory] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationSentMessage, setVerificationSentMessage] = useState<
    string | null
  >(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload = {
      fullName,
      username,
      email,
      phoneNumber,
      regionCode,
      province,
      cityMunicipality,
      barangay,
      password,
      confirmPassword,
      saveSearchHistory,
    };

    const parsed = authRegisterSchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Please check your inputs.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await registerCitizenAction(parsed.data);
      if (!result.ok) {
        setError(result.message);
        return;
      }

      if (result.requiresEmailVerification) {
        setVerificationSentMessage(result.message);
        showToast({
          title: "Verification email sent. Please check your inbox.",
          variant: "info",
        });
        return;
      }

      if (result.user) {
        setAuthenticatedUser(result.user);
      }
      showToast({ title: result.message, variant: "success" });
      router.push("/profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (verificationSentMessage) {
    return (
      <div className="mx-auto max-w-md px-4 py-10">
        <div className="rounded-md border border-emerald-300 bg-[var(--gabay-surface)] p-6 shadow-xs">
          <div className="inline-flex items-center gap-2 rounded bg-emerald-50 px-2.5 py-1 text-xs font-bold uppercase text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <MailCheck className="h-4 w-4" aria-hidden="true" />
            <span>Verify Your Email Address</span>
          </div>
          <h1 className="gabay-page-title mt-2 text-[var(--gabay-text)]">
            Check Your Inbox
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-[var(--gabay-neutral)]">
            {verificationSentMessage}
          </p>
          <p className="mt-2 text-xs text-[var(--gabay-neutral)]">
            Once confirmed, you will be redirected to your GabayPH Citizen Profile with the default <code>user</code> role.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/login"
              className="rounded bg-[#17365D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#102847]"
            >
              Proceed to Sign In
            </Link>
            <Link
              href="/"
              className="rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-4 py-2 text-xs font-semibold text-[var(--gabay-text)] hover:bg-[var(--gabay-surface-muted)]"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <div className="rounded-md border border-[var(--gabay-border)] bg-[var(--gabay-surface)] p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#17365D] dark:text-teal-300">
          <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Data-Minimal Citizen Registration</span>
        </div>
        <h1 className="gabay-page-title mt-1.5 text-[var(--gabay-text)]">
          Create a Free GabayPH Account
        </h1>
        <p className="mt-1 text-xs text-[var(--gabay-neutral)]">
          We collect only the information needed to personalize regional guides and save your checklists. <strong>We never require a residential street address.</strong>
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="reg-name"
                className="block font-semibold text-[var(--gabay-text)]"
              >
                Full Name or Display Name *
              </label>
              <input
                id="reg-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Juan Dela Cruz"
                className="mt-1 min-h-[40px] w-full rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-3 py-2 text-[var(--gabay-text)]"
              />
            </div>

            <div>
              <label
                htmlFor="reg-username"
                className="block font-semibold text-[var(--gabay-text)]"
              >
                Username (Optional)
              </label>
              <input
                id="reg-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="juandelacruz"
                className="mt-1 min-h-[40px] w-full rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-3 py-2 text-[var(--gabay-text)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="reg-email"
                className="block font-semibold text-[var(--gabay-text)]"
              >
                Email Address *
              </label>
              <input
                id="reg-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan.delacruz@example.ph"
                className="mt-1 min-h-[40px] w-full rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-3 py-2 text-[var(--gabay-text)]"
              />
            </div>

            <div>
              <label
                htmlFor="reg-phone"
                className="block font-semibold text-[var(--gabay-text)]"
              >
                Mobile Number (Optional)
              </label>
              <input
                id="reg-phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="09171234567"
                className="mt-1 min-h-[40px] w-full rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-3 py-2 text-[var(--gabay-text)]"
              />
            </div>
          </div>

          {/* Geographic Coverage Preferences (No street address required) */}
          <div className="rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface-muted)] p-3">
            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase text-[#17365D] dark:text-teal-300">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Geographic Coverage Preferences (Street Address Not Required)</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="reg-region"
                  className="block font-semibold text-[var(--gabay-text)]"
                >
                  Region *
                </label>
                <select
                  id="reg-region"
                  value={regionCode}
                  onChange={(e) => setRegionCode(e.target.value)}
                  className="mt-1 min-h-[38px] w-full rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-2.5 py-1.5 text-[var(--gabay-text)]"
                >
                  {PH_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.regionCode}>
                      {loc.regionCode} — {loc.regionName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="reg-province"
                  className="block font-semibold text-[var(--gabay-text)]"
                >
                  Province (Optional)
                </label>
                <input
                  id="reg-province"
                  type="text"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  placeholder="e.g., Cavite, Cebu, Davao del Sur"
                  className="mt-1 min-h-[38px] w-full rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-2.5 py-1.5 text-[var(--gabay-text)]"
                />
              </div>

              <div>
                <label
                  htmlFor="reg-city"
                  className="block font-semibold text-[var(--gabay-text)]"
                >
                  City / Municipality (Optional)
                </label>
                <input
                  id="reg-city"
                  type="text"
                  value={cityMunicipality}
                  onChange={(e) => setCityMunicipality(e.target.value)}
                  placeholder="e.g., Quezon City"
                  className="mt-1 min-h-[38px] w-full rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-2.5 py-1.5 text-[var(--gabay-text)]"
                />
              </div>

              <div>
                <label
                  htmlFor="reg-barangay"
                  className="block font-semibold text-[var(--gabay-text)]"
                >
                  Barangay (Optional)
                </label>
                <input
                  id="reg-barangay"
                  type="text"
                  value={barangay}
                  onChange={(e) => setBarangay(e.target.value)}
                  placeholder="e.g., Barangay Commonwealth"
                  className="mt-1 min-h-[38px] w-full rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-2.5 py-1.5 text-[var(--gabay-text)]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="reg-pass"
                className="block font-semibold text-[var(--gabay-text)]"
              >
                Password (8+ chars, 1 uppercase, 1 number) *
              </label>
              <input
                id="reg-pass"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 min-h-[40px] w-full rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-3 py-2 text-[var(--gabay-text)]"
              />
            </div>

            <div>
              <label
                htmlFor="reg-confirm"
                className="block font-semibold text-[var(--gabay-text)]"
              >
                Confirm Password *
              </label>
              <input
                id="reg-confirm"
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 min-h-[40px] w-full rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface)] px-3 py-2 text-[var(--gabay-text)]"
              />
            </div>
          </div>

          <div className="flex items-start gap-2 rounded border border-[var(--gabay-border)] bg-[var(--gabay-surface-muted)] p-2.5">
            <input
              id="reg-history-optin"
              type="checkbox"
              checked={saveSearchHistory}
              onChange={(e) => setSaveSearchHistory(e.target.checked)}
              className="mt-0.5"
            />
            <label
              htmlFor="reg-history-optin"
              className="text-[var(--gabay-text)]"
            >
              <strong>Opt-in to Search History:</strong> Save my recent searches so I can quickly revisit guides. (Disabled by default for privacy).
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-[42px] w-full rounded bg-[#17365D] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#102847] disabled:opacity-60"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between border-t border-[var(--gabay-border)] pt-3 text-xs text-[var(--gabay-neutral)]">
          <span>Already have an account?</span>
          <Link
            href="/login"
            className="font-semibold text-[#17365D] hover:underline dark:text-teal-300"
          >
            Sign In →
          </Link>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[var(--gabay-neutral)]">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
          <span>
            New accounts are provisioned with least-privilege <code>user</code> access and can be deleted at any time.
          </span>
        </div>
      </div>
    </div>
  );
}
