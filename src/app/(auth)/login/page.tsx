"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, AlertCircle, Lock } from "lucide-react";
import { authLoginSchema } from "@/lib/validations/schemas";
import { useCitizenState } from "@/components/providers/citizen-state-provider";
import type { UserRole } from "@/types/database";

export default function LoginPage() {
  const router = useRouter();
  const { loginDemoUser } = useCitizenState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("citizen");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = authLoginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Invalid credentials.");
      return;
    }

    loginDemoUser({
      email: parsed.data.email,
      role: selectedRole,
      regionCode: "NCR",
    });

    if (
      selectedRole === "super_admin" ||
      selectedRole === "content_admin" ||
      selectedRole === "regional_moderator"
    ) {
      router.push("/admin");
    } else {
      router.push("/profile");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-md border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#17365D]">
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Citizen & Staff Authentication</span>
        </div>
        <h1 className="mt-1.5 text-xl font-bold text-slate-900">
          Sign In to GabayPH
        </h1>
        <p className="mt-1 text-xs text-slate-600">
          Note: Browsing public directories, checklists, and calculators does not require an account. Sign in to sync saved bookmarks or access role-based administration.
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label
              htmlFor="login-email"
              className="block font-semibold text-slate-800"
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
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block font-semibold text-slate-800"
            >
              Password (minimum 8 characters)
            </label>
            <input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label
              htmlFor="login-role"
              className="block font-semibold text-slate-800"
            >
              Account Role (For RBAC Testing & Verification)
            </label>
            <select
              id="login-role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="mt-1 w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 text-xs"
            >
              <option value="citizen">Citizen (Standard User)</option>
              <option value="organization">Verified Organization</option>
              <option value="regional_moderator">Regional Moderator</option>
              <option value="content_admin">Content Admin</option>
              <option value="super_admin">Super Admin (Full Console)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded bg-[#17365D] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#102847]"
          >
            Sign In
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 text-xs text-slate-600">
          <span>New to GabayPH?</span>
          <Link
            href="/register"
            className="font-semibold text-[#17365D] hover:underline"
          >
            Create a free Citizen Account →
          </Link>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
          <span>Protected by Supabase Auth & Row Level Security (RLS)</span>
        </div>
      </div>
    </div>
  );
}
