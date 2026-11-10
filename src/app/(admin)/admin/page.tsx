"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  FileCheck2,
  Briefcase,
  GraduationCap,
  Wallet,
  Building2,
  HeartHandshake,
  Flag,
  Megaphone,
  ShieldCheck,
  ScrollText,
  Settings,
  Lock,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { useCitizenState } from "@/components/providers/citizen-state-provider";
import {
  canAccessAdminDashboard,
  canManageUsersAndAuditLogs,
  formatRoleLabel,
} from "@/lib/auth/rbac";
import {
  ACTIVE_ANNOUNCEMENTS,
  INITIAL_AUDIT_LOGS,
  VERIFIED_ASSISTANCE_PROGRAMS,
  VERIFIED_BAYANIHAN_POSTS,
  VERIFIED_OPPORTUNITIES,
  VERIFIED_ORGANIZATIONS,
  VERIFIED_RESOURCES,
} from "@/lib/constants/philippine-data";
import { VerificationBadge } from "@/components/trust/verification-badge";
import type { UserRole, VerificationStatus } from "@/types/database";

type AdminModuleId =
  | "overview"
  | "users"
  | "resources"
  | "jobs"
  | "scholarships"
  | "assistance"
  | "organizations"
  | "moderation"
  | "reports"
  | "announcements"
  | "verification"
  | "audit_logs"
  | "settings";

const ADMIN_MODULES: {
  id: AdminModuleId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  superAdminOnly?: boolean;
}[] = [
  { id: "overview", label: "1. Overview", icon: LayoutDashboard },
  { id: "verification", label: "2. Content Verification", icon: ShieldCheck },
  { id: "resources", label: "3. Resource Management", icon: FileCheck2 },
  { id: "jobs", label: "4. Job Management", icon: Briefcase },
  { id: "scholarships", label: "5. Scholarship Management", icon: GraduationCap },
  { id: "assistance", label: "6. Assistance Programs", icon: Wallet },
  { id: "organizations", label: "7. Organization Verification", icon: Building2 },
  { id: "moderation", label: "8. Community Moderation", icon: HeartHandshake },
  { id: "reports", label: "9. Reports Management", icon: Flag },
  { id: "announcements", label: "10. Announcements", icon: Megaphone },
  { id: "users", label: "11. User Management", icon: Users, superAdminOnly: true },
  { id: "audit_logs", label: "12. Audit Logs", icon: ScrollText, superAdminOnly: true },
  { id: "settings", label: "13. System Settings", icon: Settings, superAdminOnly: true },
];

export default function AdminDashboardPage() {
  const { user, loginDemoUser, reports, updateReportStatus } =
    useCitizenState();
  const [activeTab, setActiveTab] = useState<AdminModuleId>("overview");

  // Interactive Admin State for Verification & Moderation
  const [resourcesState, setResourcesState] = useState(VERIFIED_RESOURCES);
  const [orgsState, setOrgsState] = useState(VERIFIED_ORGANIZATIONS);
  const [bayanihanState, setBayanihanState] = useState(VERIFIED_BAYANIHAN_POSTS);
  const [announcementsState, setAnnouncementsState] =
    useState(ACTIVE_ANNOUNCEMENTS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [staffAccounts, setStaffAccounts] = useState<
    { id: string; name: string; email: string; role: UserRole; region: string }[]
  >([
    {
      id: "u-1",
      name: "Maria Santos",
      email: "m.santos@gabayph.org",
      role: "super_admin",
      region: "NATIONAL",
    },
    {
      id: "u-2",
      name: "Carlo Reyes",
      email: "c.reyes@gabayph.org",
      role: "content_admin",
      region: "NATIONAL",
    },
    {
      id: "u-3",
      name: "Liza Bautista",
      email: "l.bautista@gabayph.org",
      role: "regional_moderator",
      region: "NCR",
    },
    {
      id: "u-4",
      name: "DSWD DRMB Liaison",
      email: "drmb@dswd.gov.ph",
      role: "organization",
      region: "NATIONAL",
    },
  ]);

  // System settings state
  const [turnstileEnabled, setTurnstileEnabled] = useState(true);
  const [aiAssistantEnabled, setAiAssistantEnabled] = useState(false);
  const [strictExpiryArchive, setStrictExpiryArchive] = useState(true);

  const appendAudit = (action: string, entityType: string, entityId: string, summary: string) => {
    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        actorName: user?.fullName || "Admin Session",
        actorRole: user?.role || "super_admin",
        action,
        entityType,
        entityId,
        summary,
        createdAt: new Date().toLocaleString("en-PH"),
      },
      ...prev,
    ]);
  };

  // Enforce RBAC Guard
  if (!user || !canAccessAdminDashboard(user.role)) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12">
        <div className="rounded-md border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-red-800">
            <Lock className="h-4 w-4 text-red-700" />
            <span>Protected Role-Based Administration Console</span>
          </div>
          <h1 className="mt-2 text-lg font-bold text-slate-900">
            Staff or Moderator Authorization Required
          </h1>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            Access to <code>/admin</code> is restricted to{" "}
            <strong>Super Admin</strong>, <strong>Content Admin</strong>, and{" "}
            <strong>Regional Moderator</strong> roles, enforced via server RBAC and Supabase Row Level Security.
          </p>

          <div className="mt-4 rounded border border-slate-200 bg-slate-50 p-3.5 text-xs">
            <p className="font-semibold text-slate-900">
              Quick Role Elevation for QA & Review:
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  loginDemoUser({
                    email: "superadmin@gabayph.org",
                    fullName: "GabayPH Super Admin",
                    role: "super_admin",
                    regionCode: "NATIONAL",
                  })
                }
                className="rounded bg-[#0B3D91] px-3 py-1.5 font-semibold text-white hover:bg-[#082d6b]"
              >
                Sign In as Super Admin
              </button>
              <button
                type="button"
                onClick={() =>
                  loginDemoUser({
                    email: "contentadmin@gabayph.org",
                    fullName: "Content Verification Admin",
                    role: "content_admin",
                    regionCode: "NATIONAL",
                  })
                }
                className="rounded border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-800 hover:bg-slate-100"
              >
                Sign In as Content Admin
              </button>
              <button
                type="button"
                onClick={() =>
                  loginDemoUser({
                    email: "moderator.ncr@gabayph.org",
                    fullName: "NCR Regional Moderator",
                    role: "regional_moderator",
                    regionCode: "NCR",
                  })
                }
                className="rounded border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-800 hover:bg-slate-100"
              >
                Sign In as Regional Moderator
              </button>
            </div>
          </div>

          <div className="mt-4">
            <Link
              href="/"
              className="text-xs font-semibold text-[#0B3D91] hover:underline"
            >
              ← Return to Public Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isSuperAdmin = canManageUsersAndAuditLogs(user.role);

  const handleResourceVerificationChange = (
    id: string,
    newStatus: VerificationStatus
  ) => {
    setResourcesState((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              verificationStatus: newStatus,
              lastVerifiedAt: new Date().toISOString().split("T")[0],
            }
          : r
      )
    );
    appendAudit(
      "resource.verify_status",
      "resource",
      id,
      `Updated resource verification status to ${newStatus}`
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6">
      {/* Top Admin Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded bg-slate-900 px-2.5 py-0.5 text-xs font-bold uppercase text-white">
            <LayoutDashboard className="h-3.5 w-3.5 text-emerald-400" />
            <span>GabayPH Admin & Verification Console</span>
          </div>
          <h1 className="mt-1.5 text-xl font-bold text-slate-900">
            Governance, Content Verification & Community Moderation
          </h1>
          <p className="text-xs text-slate-600">
            Active Session: <strong>{user.fullName}</strong> (
            {formatRoleLabel(user.role)} · Coverage: {user.regionCode})
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 text-xs">
          {(
            ["super_admin", "content_admin", "regional_moderator"] as UserRole[]
          ).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() =>
                loginDemoUser({
                  email: user.email,
                  fullName: user.fullName,
                  role: r,
                  regionCode: user.regionCode,
                })
              }
              className={`rounded border px-2.5 py-1 font-medium ${
                user.role === r
                  ? "border-[#0B3D91] bg-[#0B3D91] text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              Role: {formatRoleLabel(r)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Layout: 13 Modules Sidebar + Active Workspace */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <aside
          aria-label="Admin Console Modules"
          className="lg:col-span-3"
        >
          <nav className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white text-xs">
            {ADMIN_MODULES.map((mod) => {
              const Icon = mod.icon;
              const isSelected = activeTab === mod.id;
              const isLocked = mod.superAdminOnly && !isSuperAdmin;
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => setActiveTab(mod.id)}
                  className={`flex w-full items-center justify-between px-3.5 py-2.5 text-left font-medium transition-colors ${
                    isSelected
                      ? "bg-[#0B3D91] text-white"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span>{mod.label}</span>
                  </span>
                  {isLocked && (
                    <Lock className="h-3 w-3 opacity-60" aria-label="Super Admin Only" />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="lg:col-span-9">
          <div className="rounded-md border border-slate-200 bg-white p-4 sm:p-6">
            {/* 1. OVERVIEW */}
            {activeTab === "overview" && (
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  1. Platform Trust & Operations Overview
                </h2>
                <p className="mt-0.5 text-xs text-slate-600">
                  Real-time summary of verified public records, citizen inaccuracy reports, and moderation queues.
                </p>

                <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded border border-slate-200 bg-slate-50 p-3">
                    <dt className="text-xs text-slate-600">Verified Resources</dt>
                    <dd className="mt-1 font-mono text-xl font-bold text-[#0B3D91]">
                      {resourcesState.length}
                    </dd>
                  </div>
                  <div className="rounded border border-slate-200 bg-slate-50 p-3">
                    <dt className="text-xs text-slate-600">Jobs & Scholarships</dt>
                    <dd className="mt-1 font-mono text-xl font-bold text-[#0B3D91]">
                      {VERIFIED_OPPORTUNITIES.length}
                    </dd>
                  </div>
                  <div className="rounded border border-slate-200 bg-slate-50 p-3">
                    <dt className="text-xs text-slate-600">Open Citizen Reports</dt>
                    <dd className="mt-1 font-mono text-xl font-bold text-amber-800">
                      {reports.filter((r) => r.resolutionStatus !== "resolved").length}
                    </dd>
                  </div>
                  <div className="rounded border border-slate-200 bg-slate-50 p-3">
                    <dt className="text-xs text-slate-600">Audit Log Entries</dt>
                    <dd className="mt-1 font-mono text-xl font-bold text-emerald-800">
                      {auditLogs.length}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Recent Security & Content Verification Activity
                  </h3>
                  <div className="mt-2 divide-y divide-slate-200 rounded border border-slate-200 text-xs">
                    {auditLogs.slice(0, 4).map((log) => (
                      <div
                        key={log.id}
                        className="flex flex-wrap items-center justify-between gap-2 p-3"
                      >
                        <div>
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] font-semibold">
                            {log.action}
                          </span>
                          <span className="ml-2 font-medium text-slate-900">
                            {log.summary}
                          </span>
                        </div>
                        <span className="text-slate-500">
                          {log.actorName} · {log.createdAt}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. CONTENT VERIFICATION */}
            {activeTab === "verification" && (
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  2. Official Source Content Verification Queue
                </h2>
                <p className="mt-0.5 text-xs text-slate-600">
                  Cross-check each guide against its official `.gov.ph` URL and update its verification badge.
                </p>

                <div className="mt-4 divide-y divide-slate-200 rounded border border-slate-200 text-xs">
                  {resourcesState.map((res) => (
                    <div key={res.id} className="p-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="font-bold text-slate-900">
                            {res.title}
                          </span>
                          <div className="mt-0.5 flex items-center gap-2 text-slate-500">
                            <span>Source: {res.sourceName}</span>
                            <a
                              href={res.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-0.5 text-[#0B3D91] underline"
                            >
                              <span>Inspect Source</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                        <VerificationBadge
                          status={res.verificationStatus}
                          lastVerifiedAt={res.lastVerifiedAt}
                        />
                      </div>

                      <div className="mt-2.5 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleResourceVerificationChange(
                              res.id,
                              "officially_verified"
                            )
                          }
                          className="rounded border border-emerald-300 bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-900 hover:bg-emerald-100"
                        >
                          Mark Officially Verified Today
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleResourceVerificationChange(
                              res.id,
                              "verification_pending"
                            )
                          }
                          className="rounded border border-amber-300 bg-amber-50 px-2.5 py-1 font-semibold text-amber-900 hover:bg-amber-100"
                        >
                          Flag Verification Pending
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleResourceVerificationChange(res.id, "archived")
                          }
                          className="rounded border border-slate-300 bg-slate-100 px-2.5 py-1 font-semibold text-slate-700 hover:bg-slate-200"
                        >
                          Archive Outdated Guide
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. RESOURCE MANAGEMENT */}
            {activeTab === "resources" && (
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  3. Public Service Resource Management
                </h2>
                <p className="mt-0.5 text-xs text-slate-600">
                  Directory of all Serbisyo, Pera, Aral, and Kaligtasan service guides.
                </p>

                <div className="mt-4 overflow-x-auto rounded border border-slate-200">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-3 py-2 font-semibold">Module</th>
                        <th className="px-3 py-2 font-semibold">Title</th>
                        <th className="px-3 py-2 font-semibold">Agency</th>
                        <th className="px-3 py-2 font-semibold">Checklist Items</th>
                        <th className="px-3 py-2 font-semibold">Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {resourcesState.map((r) => (
                        <tr key={r.id}>
                          <td className="px-3 py-2.5 font-mono uppercase text-[#0B3D91]">
                            {r.module}
                          </td>
                          <td className="px-3 py-2.5 font-semibold text-slate-900">
                            {r.title}
                          </td>
                          <td className="px-3 py-2.5 text-slate-600">
                            {r.organizationAcronym}
                          </td>
                          <td className="px-3 py-2.5 font-mono">
                            {r.requirementsChecklist.length} items
                          </td>
                          <td className="px-3 py-2.5">
                            <VerificationBadge
                              status={r.verificationStatus}
                              lastVerifiedAt={r.lastVerifiedAt}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. JOB MANAGEMENT */}
            {activeTab === "jobs" && (
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  4. Employment & Job Portal Listings Management
                </h2>
                <div className="mt-4 divide-y divide-slate-200 rounded border border-slate-200 text-xs">
                  {VERIFIED_OPPORTUNITIES.filter((o) => o.type === "job").map(
                    (job) => (
                      <div key={job.id} className="p-3.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">
                            {job.title}
                          </span>
                          <VerificationBadge
                            status={job.verificationStatus}
                            lastVerifiedAt={job.lastVerifiedAt}
                          />
                        </div>
                        <p className="mt-1 text-slate-600">
                          {job.organizationName} · {job.compensationOrBenefit}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* 5. SCHOLARSHIP MANAGEMENT */}
            {activeTab === "scholarships" && (
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  5. Scholarship & Free Skills Training Management
                </h2>
                <div className="mt-4 divide-y divide-slate-200 rounded border border-slate-200 text-xs">
                  {VERIFIED_OPPORTUNITIES.filter(
                    (o) => o.type === "scholarship" || o.type === "training"
                  ).map((sch) => (
                    <div key={sch.id} className="p-3.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          {sch.title}
                        </span>
                        <VerificationBadge
                          status={sch.verificationStatus}
                          lastVerifiedAt={sch.lastVerifiedAt}
                        />
                      </div>
                      <p className="mt-1 text-slate-600">
                        {sch.organizationName} · {sch.compensationOrBenefit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. ASSISTANCE PROGRAM MANAGEMENT */}
            {activeTab === "assistance" && (
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  6. Financial & Medical Assistance Programs Management
                </h2>
                <div className="mt-4 divide-y divide-slate-200 rounded border border-slate-200 text-xs">
                  {VERIFIED_ASSISTANCE_PROGRAMS.map((aid) => (
                    <div key={aid.id} className="p-3.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          {aid.programName}
                        </span>
                        <VerificationBadge
                          status={aid.verificationStatus}
                          lastVerifiedAt={aid.lastVerifiedAt}
                        />
                      </div>
                      <p className="mt-1 text-slate-600">{aid.benefitSummary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. ORGANIZATION VERIFICATION */}
            {activeTab === "organizations" && (
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  7. Government Agency, NGO & Employer Verification
                </h2>
                <div className="mt-4 divide-y divide-slate-200 rounded border border-slate-200 text-xs">
                  {orgsState.map((org) => (
                    <div
                      key={org.id}
                      className="flex flex-wrap items-center justify-between gap-2 p-3.5"
                    >
                      <div>
                        <span className="font-bold text-slate-900">
                          {org.name} ({org.acronym})
                        </span>
                        <span className="block text-slate-500">
                          Domain: {org.verifiedEmailDomain} · Website:{" "}
                          {org.officialWebsite}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <VerificationBadge status={org.verificationStatus} />
                        <button
                          type="button"
                          onClick={() => {
                            const nextStatus =
                              org.verificationStatus === "officially_verified"
                                ? "verification_pending"
                                : "officially_verified";
                            setOrgsState((prev) =>
                              prev.map((o) =>
                                o.id === org.id
                                  ? { ...o, verificationStatus: nextStatus }
                                  : o
                              )
                            );
                            appendAudit(
                              "organization.verify",
                              "organization",
                              org.id,
                              `Set ${org.acronym} verification status to ${nextStatus}`
                            );
                          }}
                          className="rounded border border-slate-300 bg-slate-50 px-2.5 py-1 font-medium hover:bg-slate-100"
                        >
                          Toggle Status
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. COMMUNITY MODERATION */}
            {activeTab === "moderation" && (
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  8. Bayanihan Community Moderation Queue
                </h2>
                <p className="mt-0.5 text-xs text-slate-600">
                  Verify community donation hubs, volunteer drives, and assistance requests.
                </p>

                <div className="mt-4 divide-y divide-slate-200 rounded border border-slate-200 text-xs">
                  {bayanihanState.map((post) => (
                    <div key={post.id} className="p-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="font-bold text-slate-900">
                            {post.title}
                          </span>
                          <span className="ml-2 text-slate-500">
                            ({post.regionCode} · {post.organizationName})
                          </span>
                        </div>
                        <VerificationBadge status={post.verificationStatus} />
                      </div>
                      <p className="mt-1 text-slate-600">{post.summary}</p>
                      <div className="mt-2.5 flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setBayanihanState((prev) =>
                              prev.map((p) =>
                                p.id === post.id
                                  ? {
                                      ...p,
                                      verificationStatus: "officially_verified",
                                    }
                                  : p
                              )
                            );
                            appendAudit(
                              "bayanihan.verify",
                              "bayanihan_post",
                              post.id,
                              `Verified Bayanihan post: ${post.title}`
                            );
                          }}
                          className="rounded bg-emerald-700 px-2.5 py-1 font-semibold text-white hover:bg-emerald-800"
                        >
                          Verify & Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setBayanihanState((prev) =>
                              prev.map((p) =>
                                p.id === post.id
                                  ? { ...p, verificationStatus: "archived" }
                                  : p
                              )
                            );
                            appendAudit(
                              "bayanihan.archive",
                              "bayanihan_post",
                              post.id,
                              `Archived Bayanihan post: ${post.title}`
                            );
                          }}
                          className="rounded border border-slate-300 bg-white px-2.5 py-1 font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Archive
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. REPORTS MANAGEMENT */}
            {activeTab === "reports" && (
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  9. Citizen Inaccuracy & Anti-Scam Reports Triage
                </h2>
                <div className="mt-4 divide-y divide-slate-200 rounded border border-slate-200 text-xs">
                  {reports.map((rep) => (
                    <div key={rep.id} className="p-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-bold text-slate-900">
                          #{rep.id} · {rep.targetTitle}
                        </span>
                        <span className="rounded bg-slate-100 px-2 py-0.5 font-mono uppercase">
                          {rep.resolutionStatus}
                        </span>
                      </div>
                      <p className="mt-1 text-slate-700">{rep.details}</p>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            updateReportStatus(
                              rep.id,
                              "resolved",
                              "Verified against official agency advisory and updated record."
                            );
                            appendAudit(
                              "report.resolve",
                              "report",
                              rep.id,
                              `Resolved report #${rep.id}`
                            );
                          }}
                          className="inline-flex items-center gap-1 rounded bg-emerald-700 px-2.5 py-1 font-semibold text-white hover:bg-emerald-800"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Mark Resolved</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateReportStatus(
                              rep.id,
                              "investigating",
                              "Escalated to Content Verification & Anti-Scam desk."
                            )
                          }
                          className="rounded border border-amber-300 bg-amber-50 px-2.5 py-1 font-semibold text-amber-900"
                        >
                          Set Investigating
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 10. ANNOUNCEMENTS */}
            {activeTab === "announcements" && (
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  10. Time-Bound Public Advisories & Announcements
                </h2>
                <p className="mt-0.5 text-xs text-slate-600">
                  All advisories carry a mandatory expiration date so outdated announcements are never shown as current.
                </p>

                <div className="mt-4 divide-y divide-slate-200 rounded border border-slate-200 text-xs">
                  {announcementsState.map((ann) => (
                    <div
                      key={ann.id}
                      className="flex flex-wrap items-center justify-between gap-2 p-3.5"
                    >
                      <div>
                        <span className="font-bold text-slate-900">
                          {ann.title}
                        </span>
                        <span className="block text-slate-500">
                          Source: {ann.sourceName} · Expires: {ann.expiresAt}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setAnnouncementsState((prev) =>
                            prev.map((a) =>
                              a.id === ann.id
                                ? { ...a, isActive: !a.isActive }
                                : a
                            )
                          );
                          appendAudit(
                            "announcement.toggle",
                            "announcement",
                            ann.id,
                            `Toggled active state for announcement ${ann.id}`
                          );
                        }}
                        className={`rounded border px-2.5 py-1 font-semibold ${
                          ann.isActive
                            ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                            : "border-slate-300 bg-slate-100 text-slate-600"
                        }`}
                      >
                        {ann.isActive ? "Active" : "Archived"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 11. USER MANAGEMENT (Super Admin Only) */}
            {activeTab === "users" && (
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  11. Role-Based User & Staff Management
                </h2>
                {!isSuperAdmin ? (
                  <p className="mt-3 rounded border border-amber-300 bg-amber-50 p-3 text-xs text-amber-950">
                    Restricted: Only <strong>Super Admin</strong> accounts can modify user roles. Use the Role switcher in the top header to test Super Admin permissions.
                  </p>
                ) : (
                  <div className="mt-4 overflow-x-auto rounded border border-slate-200">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <th className="px-3 py-2 font-semibold">Name</th>
                          <th className="px-3 py-2 font-semibold">Email</th>
                          <th className="px-3 py-2 font-semibold">Region</th>
                          <th className="px-3 py-2 font-semibold">Role</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {staffAccounts.map((acc) => (
                          <tr key={acc.id}>
                            <td className="px-3 py-2.5 font-semibold text-slate-900">
                              {acc.name}
                            </td>
                            <td className="px-3 py-2.5 font-mono text-slate-600">
                              {acc.email}
                            </td>
                            <td className="px-3 py-2.5">{acc.region}</td>
                            <td className="px-3 py-2.5">
                              <select
                                value={acc.role}
                                aria-label={`Role for ${acc.name}`}
                                onChange={(e) => {
                                  const nextRole = e.target.value as UserRole;
                                  setStaffAccounts((prev) =>
                                    prev.map((u) =>
                                      u.id === acc.id
                                        ? { ...u, role: nextRole }
                                        : u
                                    )
                                  );
                                  appendAudit(
                                    "user.role_change",
                                    "profile",
                                    acc.id,
                                    `Changed role for ${acc.email} to ${nextRole}`
                                  );
                                }}
                                className="rounded border border-slate-300 bg-white px-2 py-1 text-xs"
                              >
                                <option value="super_admin">Super Admin</option>
                                <option value="content_admin">Content Admin</option>
                                <option value="regional_moderator">
                                  Regional Moderator
                                </option>
                                <option value="organization">Organization</option>
                                <option value="citizen">Citizen</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 12. AUDIT LOGS (Super Admin Only) */}
            {activeTab === "audit_logs" && (
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  12. Immutable Security & Governance Audit Logs
                </h2>
                {!isSuperAdmin ? (
                  <p className="mt-3 rounded border border-amber-300 bg-amber-50 p-3 text-xs text-amber-950">
                    Restricted: Audit logs are accessible only to{" "}
                    <strong>Super Admin</strong>.
                  </p>
                ) : (
                  <div className="mt-4 divide-y divide-slate-200 rounded border border-slate-200 text-xs">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="rounded bg-slate-100 px-2 py-0.5 font-mono font-bold text-slate-800">
                            {log.action}
                          </span>
                          <span className="font-mono text-slate-500">
                            {log.createdAt}
                          </span>
                        </div>
                        <p className="mt-1 font-medium text-slate-900">
                          {log.summary}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Actor: {log.actorName} ({log.actorRole}) · Entity:{" "}
                          {log.entityType}/{log.entityId}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 13. SYSTEM SETTINGS (Super Admin Only) */}
            {activeTab === "settings" && (
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  13. Platform Security & Feature Flag Settings
                </h2>
                {!isSuperAdmin ? (
                  <p className="mt-3 rounded border border-amber-300 bg-amber-50 p-3 text-xs text-amber-950">
                    Restricted: System settings require{" "}
                    <strong>Super Admin</strong> privileges.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3 text-xs">
                    <div className="flex items-center justify-between rounded border border-slate-200 p-3.5">
                      <div>
                        <strong className="text-slate-900">
                          Cloudflare Turnstile Anti-Abuse Protection
                        </strong>
                        <p className="text-slate-600">
                          Enforce Turnstile verification on public inaccuracy reports and Bayanihan submissions.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setTurnstileEnabled(!turnstileEnabled)}
                        className={`rounded border px-3 py-1.5 font-semibold ${
                          turnstileEnabled
                            ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                            : "border-slate-300 bg-slate-100 text-slate-700"
                        }`}
                      >
                        {turnstileEnabled ? "ENABLED" : "DISABLED"}
                      </button>
                    </div>

                    <div className="flex items-center justify-between rounded border border-slate-200 p-3.5">
                      <div>
                        <strong className="text-slate-900">
                          Auto-Archive Expired Public Announcements
                        </strong>
                        <p className="text-slate-600">
                          Prevent outdated disaster or agency advisories from appearing as current.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setStrictExpiryArchive(!strictExpiryArchive)
                        }
                        className={`rounded border px-3 py-1.5 font-semibold ${
                          strictExpiryArchive
                            ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                            : "border-slate-300 bg-slate-100 text-slate-700"
                        }`}
                      >
                        {strictExpiryArchive ? "ENABLED" : "DISABLED"}
                      </button>
                    </div>

                    <div className="flex items-center justify-between rounded border border-slate-200 p-3.5">
                      <div>
                        <strong className="text-slate-900">
                          Optional Source-Grounded AI Assistant (/api/assistant)
                        </strong>
                        <p className="text-slate-600">
                          Feature flag for bilingual (Filipino/English) resource assistant. Core platform operates without AI dependency.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setAiAssistantEnabled(!aiAssistantEnabled)
                        }
                        className={`rounded border px-3 py-1.5 font-semibold ${
                          aiAssistantEnabled
                            ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                            : "border-slate-300 bg-slate-100 text-slate-700"
                        }`}
                      >
                        {aiAssistantEnabled ? "ENABLED" : "OPTIONAL / STANDBY"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
