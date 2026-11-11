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
  Eye,
  EyeOff,
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
  const [showPassword, setShowPassword] = useState(false);
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
      <div className="mx-auto max-w-md px-4 py-8 sm:py-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <MailCheck className="h-4 w-4" aria-hidden="true" />
            <span>Verify Your Email Address</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight dark:text-slate-100">
            Check Your Inbox
          </h1>
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {verificationSentMessage}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Once confirmed, you will be redirected to your GabayPH Citizen Profile with the default <code>user</code> role.
          </p>
          <div className="pt-2 flex flex-wrap gap-2">
            <Link
              href="/login"
              className="rounded-lg bg-[#17365D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#102847]"
            >
              Proceed to Sign In
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:py-12">
      <div className="space-y-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#17365D] dark:text-teal-300">
            <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Data-Minimal Citizen Registration</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight dark:text-slate-100">
            Create a Free GabayPH Account
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed dark:text-slate-400">
            We collect only the information needed to personalize regional guides and save your checklists. <strong>We never require a residential street address.</strong>
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="reg-name"
                className="block font-semibold text-slate-700 dark:text-slate-300"
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
                className="mt-1 min-h-[40px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#17365D] focus:outline-none focus:ring-1 focus:ring-[#17365D] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="reg-username"
                className="block font-semibold text-slate-700 dark:text-slate-300"
              >
                Username (Optional)
              </label>
              <input
                id="reg-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="juandelacruz"
                className="mt-1 min-h-[40px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#17365D] focus:outline-none focus:ring-1 focus:ring-[#17365D] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="reg-email"
                className="block font-semibold text-slate-700 dark:text-slate-300"
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
                className="mt-1 min-h-[40px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#17365D] focus:outline-none focus:ring-1 focus:ring-[#17365D] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="reg-phone"
                className="block font-semibold text-slate-700 dark:text-slate-300"
              >
                Mobile Number (Optional)
              </label>
              <input
                id="reg-phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="09171234567"
                className="mt-1 min-h-[40px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#17365D] focus:outline-none focus:ring-1 focus:ring-[#17365D] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Geographic Coverage Preferences (No street address required) */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase text-[#17365D] dark:text-teal-300">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Geographic Coverage Preferences (Street Address Not Required)</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="reg-region"
                  className="block font-semibold text-slate-700 dark:text-slate-300"
                >
                  Region *
                </label>
                <select
                  id="reg-region"
                  value={regionCode}
                  onChange={(e) => setRegionCode(e.target.value)}
                  className="mt-1 min-h-[38px] w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-slate-900 focus:border-[#17365D] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
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
                  className="block font-semibold text-slate-700 dark:text-slate-300"
                >
                  Province (Optional)
                </label>
                <input
                  id="reg-province"
                  type="text"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  placeholder="e.g., Cavite, Cebu, Davao del Sur"
                  className="mt-1 min-h-[38px] w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-slate-900 placeholder:text-slate-400 focus:border-[#17365D] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="reg-city"
                  className="block font-semibold text-slate-700 dark:text-slate-300"
                >
                  City / Municipality (Optional)
                </label>
                <input
                  id="reg-city"
                  type="text"
                  value={cityMunicipality}
                  onChange={(e) => setCityMunicipality(e.target.value)}
                  placeholder="e.g., Quezon City"
                  className="mt-1 min-h-[38px] w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-slate-900 placeholder:text-slate-400 focus:border-[#17365D] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="reg-barangay"
                  className="block font-semibold text-slate-700 dark:text-slate-300"
                >
                  Barangay (Optional)
                </label>
                <input
                  id="reg-barangay"
                  type="text"
                  value={barangay}
                  onChange={(e) => setBarangay(e.target.value)}
                  placeholder="e.g., Barangay Commonwealth"
                  className="mt-1 min-h-[38px] w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-slate-900 placeholder:text-slate-400 focus:border-[#17365D] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="reg-pass"
                className="block font-semibold text-slate-700 dark:text-slate-300"
              >
                Password (8+ chars, 1 uppercase, 1 number) *
              </label>
              <div className="relative mt-1">
                <input
                  id="reg-pass"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="min-h-[40px] w-full rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-10 text-slate-900 focus:border-[#17365D] focus:outline-none focus:ring-1 focus:ring-[#17365D] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
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

            <div>
              <label
                htmlFor="reg-confirm"
                className="block font-semibold text-slate-700 dark:text-slate-300"
              >
                Confirm Password *
              </label>
              <div className="relative mt-1">
                <input
                  id="reg-confirm"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="min-h-[40px] w-full rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-10 text-slate-900 focus:border-[#17365D] focus:outline-none focus:ring-1 focus:ring-[#17365D] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
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
          </div>

          <div className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-900/50">
            <input
              id="reg-history-optin"
              type="checkbox"
              checked={saveSearchHistory}
              onChange={(e) => setSaveSearchHistory(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-[#17365D] focus:ring-[#17365D]"
            />
            <label
              htmlFor="reg-history-optin"
              className="text-slate-700 dark:text-slate-300"
            >
              <strong>Opt-in to Search History:</strong> Save my recent searches so I can quickly revisit guides. (Disabled by default for privacy).
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-[42px] w-full rounded-lg bg-[#17365D] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#102847] disabled:opacity-60 shadow-2xs"
          >
            {isSubmitting ? "Creating Account..." : "Create Free Account"}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Already have an account?</span>
          <Link
            href="/login"
            className="font-bold text-[#17365D] hover:underline dark:text-teal-300"
          >
            Sign In Instead →
          </Link>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span>Data-Minimal &amp; Least-Privilege Architecture</span>
          </div>
          <p className="leading-relaxed">
            New accounts are provisioned with least-privilege <code>user</code> access and can be deleted at any time in compliance with RA 10173.
          </p>
        </div>
      </div>
    </div>
  );
}
