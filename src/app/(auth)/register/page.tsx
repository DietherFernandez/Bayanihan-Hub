"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, AlertCircle, ShieldCheck } from "lucide-react";
import { authRegisterSchema } from "@/lib/validations/schemas";
import { PH_LOCATIONS } from "@/lib/constants/philippine-data";
import { useCitizenState } from "@/components/providers/citizen-state-provider";

export default function RegisterPage() {
  const router = useRouter();
  const { loginDemoUser } = useCitizenState();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [regionCode, setRegionCode] = useState("NCR");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saveSearchHistory, setSaveSearchHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = authRegisterSchema.safeParse({
      fullName,
      email,
      regionCode,
      password,
      confirmPassword,
      saveSearchHistory,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Please check your inputs.");
      return;
    }

    loginDemoUser({
      email: parsed.data.email,
      fullName: parsed.data.fullName,
      role: "citizen",
      regionCode: parsed.data.regionCode,
      saveSearchHistory: parsed.data.saveSearchHistory,
    });

    router.push("/profile");
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-md border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#17365D]">
          <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Data-Minimal Citizen Registration</span>
        </div>
        <h1 className="mt-1.5 text-xl font-bold text-slate-900">
          Create a Free GabayPH Account
        </h1>
        <p className="mt-1 text-xs text-slate-600">
          We collect only the minimum information needed to save your checklists and regional preferences.
        </p>

        {error && (
          <div
            role="alert"
            className="mt-4 flex items-center gap-2 rounded border border-red-300 bg-red-50 p-2.5 text-xs text-red-900"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-red-700" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
          <div>
            <label
              htmlFor="reg-name"
              className="block font-semibold text-slate-800"
            >
              Full Name or Display Name
            </label>
            <input
              id="reg-name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Juan Dela Cruz"
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="reg-email"
              className="block font-semibold text-slate-800"
            >
              Email Address
            </label>
            <input
              id="reg-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="juan.delacruz@example.ph"
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="reg-region"
              className="block font-semibold text-slate-800"
            >
              Primary Philippine Region
            </label>
            <select
              id="reg-region"
              value={regionCode}
              onChange={(e) => setRegionCode(e.target.value)}
              className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2"
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
              htmlFor="reg-pass"
              className="block font-semibold text-slate-800"
            >
              Password (8+ chars, 1 uppercase, 1 number)
            </label>
            <input
              id="reg-pass"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="reg-confirm"
              className="block font-semibold text-slate-800"
            >
              Confirm Password
            </label>
            <input
              id="reg-confirm"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            />
          </div>

          <div className="flex items-start gap-2 rounded border border-slate-200 bg-slate-50 p-2.5">
            <input
              id="reg-history-optin"
              type="checkbox"
              checked={saveSearchHistory}
              onChange={(e) => setSaveSearchHistory(e.target.checked)}
              className="mt-0.5"
            />
            <label htmlFor="reg-history-optin" className="text-slate-700">
              <strong>Opt-in to Search History:</strong> Save my recent searches so I can quickly revisit guides. (Disabled by default for privacy).
            </label>
          </div>

          <button
            type="submit"
            className="w-full rounded bg-[#17365D] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#102847]"
          >
            Create Account
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 text-xs text-slate-600">
          <span>Already have an account?</span>
          <Link
            href="/login"
            className="font-semibold text-[#17365D] hover:underline"
          >
            Sign In →
          </Link>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
          <span>You can delete your account and all saved data at any time.</span>
        </div>
      </div>
    </div>
  );
}
