"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import {
  HeartHandshake,
  MapPin,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ExternalLink,
  Info,
  ShieldCheck,
  Search,
} from "lucide-react";
import {
  PH_LOCATIONS,
  VERIFIED_BAYANIHAN_POSTS,
} from "@/lib/constants/philippine-data";
import type { BayanihanPostRecord } from "@/types/database";
import { SourceCitationBar } from "@/components/trust/verification-badge";
import {
  bayanihanSubmissionSchema,
  containsSensitivePersonalData,
} from "@/lib/validations/schemas";

function BayanihanContent() {
  const [posts, setPosts] = useState<BayanihanPostRecord[]>(
    VERIFIED_BAYANIHAN_POSTS
  );
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<"list" | "submit">("list");

  // Submission Form State
  const [postType, setPostType] = useState<
    "donation_offer" | "assistance_request" | "volunteer_call"
  >("volunteer_call");
  const [title, setTitle] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [regionCode, setRegionCode] = useState("NCR");
  const [cityMunicipality, setCityMunicipality] = useState("");
  const [urgencyLevel, setUrgencyLevel] = useState<
    "normal" | "high" | "critical"
  >("normal");
  const [summary, setSummary] = useState("");
  const [itemsNeeded, setItemsNeeded] = useState("");
  const [meetingPoint, setMeetingPoint] = useState("");
  const [contactChannel, setContactChannel] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const filteredPosts = posts.filter((p) => {
    if (typeFilter !== "all" && p.postType !== typeFilter) return false;
    if (
      regionFilter !== "ALL" &&
      p.regionCode !== regionFilter &&
      p.regionCode !== "NATIONAL"
    )
      return false;
    return true;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmittedSuccess(false);

    const parsed = bayanihanSubmissionSchema.safeParse({
      postType,
      title,
      organizationName,
      regionCode,
      cityMunicipality,
      urgencyLevel,
      summary,
      itemsOrSkillsNeeded: itemsNeeded,
      dropOffOrMeetingPoint: meetingPoint,
      contactChannel,
      sourceUrl,
    });

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message || "Please check your inputs.");
      return;
    }

    const piiGuard = containsSensitivePersonalData(
      `${parsed.data.title} ${parsed.data.summary} ${parsed.data.dropOffOrMeetingPoint}`
    );
    if (piiGuard.flagged) {
      setFormError(
        piiGuard.reason ||
          "Do not include sensitive personal identifiers or residential street addresses."
      );
      return;
    }

    const newRecord: BayanihanPostRecord = {
      id: `bay-${Date.now()}`,
      postType: parsed.data.postType,
      organizationName: parsed.data.organizationName,
      regionCode: parsed.data.regionCode,
      regionName: parsed.data.regionCode,
      cityMunicipality: parsed.data.cityMunicipality,
      slug: `community-${Date.now()}`,
      title: parsed.data.title,
      summary: parsed.data.summary,
      urgencyLevel: parsed.data.urgencyLevel,
      itemsOrSkillsNeeded: parsed.data.itemsOrSkillsNeeded
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      dropOffOrMeetingPoint: parsed.data.dropOffOrMeetingPoint,
      contactChannel: parsed.data.contactChannel,
      sourceName: parsed.data.organizationName,
      sourceUrl: parsed.data.sourceUrl || "https://ndrrmc.gov.ph",
      verificationStatus: "verification_pending",
      status: "under_review",
      lastVerifiedAt: new Date().toISOString().split("T")[0],
    };

    setPosts((prev) => [newRecord, ...prev]);
    setSubmittedSuccess(true);
    setTitle("");
    setSummary("");
    setItemsNeeded("");
    setMeetingPoint("");
    setContactChannel("");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10 space-y-8 sm:space-y-10">
      {/* Header & Page Title (Cardless Editorial Style) */}
      <div className="space-y-2 border-b border-slate-200 pb-5">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-rose-800">
          <HeartHandshake className="h-4 w-4 text-rose-700" aria-hidden="true" />
          <span>Module D · Bayanihan at Komunidad</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Community Relief, Volunteer Operations &amp; Mutual Aid Hub
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
          Connect with verified DSWD NROC family food pack repacking shifts, Philippine Red Cross 143 community volunteer drives, and LGU calamity relief hubs.
        </p>

        {/* Section Navigation Tabs (Civic Underline Tabs) */}
        <div className="no-scrollbar flex gap-4 overflow-x-auto whitespace-nowrap pt-3 text-xs font-semibold text-slate-500">
          <button
            type="button"
            onClick={() => {
              setActiveTab("list");
              setTypeFilter("all");
            }}
            className={`pb-2.5 transition ${
              activeTab === "list" && typeFilter === "all"
                ? "border-b-2 border-[#17365D] font-bold text-[#17365D]"
                : "hover:text-slate-800"
            }`}
          >
            All Initiatives ({posts.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("list");
              setTypeFilter("volunteer_call");
            }}
            className={`pb-2.5 transition ${
              activeTab === "list" && typeFilter === "volunteer_call"
                ? "border-b-2 border-[#17365D] font-bold text-[#17365D]"
                : "hover:text-slate-800"
            }`}
          >
            Volunteer Calls
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("list");
              setTypeFilter("donation_offer");
            }}
            className={`pb-2.5 transition ${
              activeTab === "list" && typeFilter === "donation_offer"
                ? "border-b-2 border-[#17365D] font-bold text-[#17365D]"
                : "hover:text-slate-800"
            }`}
          >
            Food Repacking &amp; In-Kind Hubs
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("submit")}
            className={`pb-2.5 transition ${
              activeTab === "submit"
                ? "border-b-2 border-rose-700 font-bold text-rose-700"
                : "hover:text-rose-700"
            }`}
          >
            + Submit Community Drive
          </button>
        </div>
      </div>

      {/* SECTION 1: Community Initiatives Directory (Cardless) */}
      {activeTab === "list" && (
        <section aria-labelledby="bayanihan-list-heading" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="text-xs">
              <span className="font-bold text-slate-900">
                Verified Community Initiatives ({filteredPosts.length})
              </span>
              <span className="text-slate-400 block text-[11px]">
                Physical volunteering &amp; in-kind goods only. No cash solicitations permitted.
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs shrink-0">
              <label htmlFor="bay-region" className="font-semibold text-slate-600">Region:</label>
              <select
                id="bay-region"
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                aria-label="Filter Bayanihan listings by region"
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#17365D]"
              >
                <option value="ALL">All Regions (Nationwide)</option>
                {PH_LOCATIONS.map((l) => (
                  <option key={l.id} value={l.regionCode}>
                    {l.regionCode} — {l.regionName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No community initiatives found matching your selected region filter.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 border-y border-slate-200 text-xs">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="py-4 space-y-2 group hover:bg-slate-50/60 -mx-2 px-2 rounded-lg transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded bg-rose-50 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase text-rose-800">
                          {post.postType.replace(/_/g, " ")}
                        </span>
                        {post.urgencyLevel === "critical" && (
                          <span className="rounded bg-red-100 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase text-red-900">
                            Urgent Relief
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">
                          {post.cityMunicipality} ({post.regionCode})
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 group-hover:text-[#17365D] text-sm sm:text-base transition">
                        <Link href={`/bayanihan/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Organizing Group: <strong className="text-slate-700">{post.organizationName}</strong>
                      </p>
                    </div>

                    <Link
                      href={`/bayanihan/${post.slug}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#17365D] text-white text-xs font-semibold hover:bg-[#102847] shadow-2xs transition shrink-0 self-start sm:self-auto"
                    >
                      <span>View Coordination Details</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  <p className="text-slate-600 leading-relaxed text-[11.5px]">
                    {post.summary}
                  </p>

                  <div className="text-[11px] text-slate-500 space-y-1 pt-1 border-t border-slate-50">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-semibold text-slate-700">Needed Roles / Goods:</span>
                      {post.itemsOrSkillsNeeded.map((skill, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-700 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-slate-600">
                      <span>Drop-off / Assembly: <strong>{post.dropOffOrMeetingPoint}</strong></span>
                      <span>·</span>
                      <span>Desk: <strong>{post.contactChannel}</strong></span>
                    </div>
                  </div>

                  <SourceCitationBar
                    sourceName={post.sourceName}
                    sourceUrl={post.sourceUrl}
                    regionName={post.regionName}
                    lastVerifiedAt={post.lastVerifiedAt}
                    verificationStatus={post.verificationStatus}
                    targetId={post.id}
                    targetTitle={post.title}
                    targetType="bayanihan_post"
                    shareHref={`/bayanihan/${post.slug}`}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* SECTION 2: Submit Community Initiative (Cardless Form) */}
      {activeTab === "submit" && (
        <section aria-labelledby="submit-heading" className="space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h2 id="submit-heading" className="text-sm sm:text-base font-bold text-slate-900">
              Submit a Community Relief Drive or Volunteer Call
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              New submissions are reviewed by regional moderators. Only accredited in-kind drop-off points (Barangay Hall, DSWD NROC, or Red Cross) are accepted.
            </p>
          </div>

          {submittedSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 text-emerald-950 border border-emerald-200 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Initiative Queued for Moderation</strong>
                <span>Your listing has been submitted for verification. It will appear on the public feed once confirmed.</span>
              </div>
            </div>
          )}

          {formError && (
            <div className="p-3 rounded-lg bg-red-50 text-red-900 border border-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-700" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Type of Initiative</label>
                <select
                  value={postType}
                  onChange={(e) => setPostType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#17365D]"
                >
                  <option value="volunteer_call">Volunteer Call (Repacking / Logistics)</option>
                  <option value="donation_offer">In-Kind Donation &amp; Relief Hub</option>
                  <option value="assistance_request">Community In-Kind Request</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Urgency Level</label>
                <select
                  value={urgencyLevel}
                  onChange={(e) => setUrgencyLevel(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#17365D]"
                >
                  <option value="normal">Normal / Scheduled Operation</option>
                  <option value="high">High Priority</option>
                  <option value="critical">Critical / Disaster Emergency</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Initiative Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Typhoon Relief Food Repacking Volunteers"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#17365D]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Organizing Group / LGU Agency</label>
                <input
                  type="text"
                  required
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="e.g. Barangay San Isidro DRRM / Red Cross Chapter"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#17365D]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Region</label>
                <select
                  value={regionCode}
                  onChange={(e) => setRegionCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#17365D]"
                >
                  {PH_LOCATIONS.map((l) => (
                    <option key={l.id} value={l.regionCode}>
                      {l.regionCode} — {l.regionName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">City / Municipality</label>
                <input
                  type="text"
                  required
                  value={cityMunicipality}
                  onChange={(e) => setCityMunicipality(e.target.value)}
                  placeholder="e.g. Pasay City"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#17365D]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Operational Summary &amp; Shifts</label>
              <textarea
                rows={3}
                required
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Describe the volunteer shift schedules, nature of work, or in-kind relief needs..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#17365D]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Items or Skills Needed (comma-separated)</label>
                <input
                  type="text"
                  required
                  value={itemsNeeded}
                  onChange={(e) => setItemsNeeded(e.target.value)}
                  placeholder="e.g. Canned goods, Bottled water, Pallet loading, Triage"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#17365D]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Official Drop-off or Assembly Point</label>
                <input
                  type="text"
                  required
                  value={meetingPoint}
                  onChange={(e) => setMeetingPoint(e.target.value)}
                  placeholder="e.g. Barangay Hall Gymnasium / Multi-purpose center"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#17365D]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Official Contact Channel</label>
                <input
                  type="text"
                  required
                  value={contactChannel}
                  onChange={(e) => setContactChannel(e.target.value)}
                  placeholder="e.g. Barangay Landline / Official Facebook Page"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#17365D]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Official Source or Verification Link (Optional)</label>
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#17365D]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#17365D] text-white font-bold text-xs hover:bg-[#102847] shadow-2xs transition"
              >
                Submit for Regional Verification
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Community Privacy & Anti-Money Laundering Notice (Open Civic Text) */}
      <div className="pt-4 text-xs text-slate-500 space-y-1.5 border-t border-slate-200/80">
        <div className="flex items-center gap-1.5 font-bold text-slate-700">
          <Info className="h-4 w-4 text-[#17365D]" aria-hidden="true" />
          <span>Community Privacy &amp; Anti-Money Laundering Notice</span>
        </div>
        <p className="leading-relaxed">
          GabayPH does not handle money or private crowdfunding accounts. All relief initiatives must route physical goods through accredited public institutions, LGU barangay disaster desks, DSWD NROC, or the Philippine Red Cross. Never post personal banking or private residential street addresses.
        </p>
      </div>
    </div>
  );
}

export default function BayanihanPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-4 py-8 text-xs text-slate-600">
          Loading Bayanihan Community Relief Hub...
        </div>
      }
    >
      <BayanihanContent />
    </Suspense>
  );
}
