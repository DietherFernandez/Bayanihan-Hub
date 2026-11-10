"use client";

import React, { Suspense, useState } from "react";
import {
  HeartHandshake,
  MapPin,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
} from "lucide-react";
import {
  PH_LOCATIONS,
  VERIFIED_BAYANIHAN_POSTS,
} from "@/lib/constants/philippine-data";
import type { BayanihanPostRecord } from "@/types/database";
import { SourceCitationBar } from "@/components/trust/verification-badge";
import { bayanihanSubmissionSchema } from "@/lib/validations/schemas";

function BayanihanContent() {
  const [posts, setPosts] = useState<BayanihanPostRecord[]>(
    VERIFIED_BAYANIHAN_POSTS
  );
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("ALL");

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
      status: "published",
      lastVerifiedAt: new Date().toISOString().split("T")[0],
    };

    setPosts((prev) => [newRecord, ...prev]);
    setSubmittedSuccess(true);
    setTitle("");
    setSummary("");
    setItemsNeeded("");
  };

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6">
      {/* Header */}
      <div className="mb-6 border-b border-slate-200 pb-4">
        <div className="inline-flex items-center gap-1.5 rounded bg-blue-50 px-2.5 py-0.5 text-xs font-bold uppercase text-[#17365D]">
          <HeartHandshake className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Module D · Bayanihan</span>
        </div>
        <h1 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Community Relief, Volunteer Opportunities & Verified Local Initiatives
        </h1>
        <p className="mt-1 text-xs text-slate-600">
          Connect with verified DSWD NROC, Philippine Red Cross 143, LGU relief operations, and community assistance drives. All community submissions undergo verification labeling.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5 text-xs">
          {[
            { id: "all", label: "All Bayanihan Listings" },
            { id: "volunteer_call", label: "Volunteer Calls" },
            { id: "donation_offer", label: "Donation & Repacking Hubs" },
            { id: "assistance_request", label: "Community Assistance Requests" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTypeFilter(tab.id)}
              className={`rounded border px-3 py-1.5 font-medium ${
                typeFilter === tab.id
                  ? "border-[#17365D] bg-[#17365D] text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          aria-label="Filter Bayanihan listings by region"
          className="rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs"
        >
          <option value="ALL">All Regions</option>
          {PH_LOCATIONS.map((l) => (
            <option key={l.id} value={l.regionCode}>
              {l.regionCode}
            </option>
          ))}
        </select>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="rounded-md border border-slate-200 bg-white p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-[#17365D]">
                    {post.postType.replace("_", " ")}
                  </span>
                  {post.urgencyLevel === "critical" && (
                    <span className="rounded bg-red-100 px-2 py-0.5 text-[11px] font-bold uppercase text-red-900">
                      Urgent / Critical
                    </span>
                  )}
                </div>
                <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                  <MapPin className="h-3.5 w-3.5 text-[#17365D]" />
                  <span>
                    {post.cityMunicipality} ({post.regionCode})
                  </span>
                </span>
              </div>

              <h2 className="mt-2 text-base font-bold text-slate-900">
                {post.title}
              </h2>
              <p className="mt-0.5 text-xs font-medium text-slate-600">
                Lead Organization: {post.organizationName}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-700">
                {post.summary}
              </p>

              <div className="mt-3 rounded border border-slate-200 bg-slate-50 p-3 text-xs">
                <div className="font-semibold text-slate-900">
                  Items / Volunteer Roles Needed:
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {post.itemsOrSkillsNeeded.map((skill, idx) => (
                    <span
                      key={idx}
                      className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="mt-2.5 text-slate-700">
                  <strong>Coordination / Drop-off Point:</strong>{" "}
                  {post.dropOffOrMeetingPoint}
                </div>
                <div className="mt-1 text-slate-700">
                  <strong>Official Contact Channel:</strong> {post.contactChannel}
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
              />
            </article>
          ))}
        </div>

        {/* Right Column: Submit Community Initiative for Moderation */}
        <aside className="lg:col-span-5">
          <div className="rounded-md border border-slate-200 bg-white p-4 sm:p-5">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <PlusCircle className="h-4 w-4 text-[#17365D]" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Submit a Community Drive or Assistance Request
                </h2>
                <p className="text-[11px] text-slate-500">
                  New submissions are labeled &quot;Verification pending&quot; until vetted by a Regional Moderator.
                </p>
              </div>
            </div>

            {submittedSuccess && (
              <div className="mt-3 flex items-start gap-2 rounded border border-emerald-300 bg-emerald-50 p-3 text-xs text-emerald-950">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                <span>
                  Your Bayanihan listing has been added with status{" "}
                  <strong>Source available, verification pending</strong> and queued for moderator review.
                </span>
              </div>
            )}

            {formError && (
              <div
                role="alert"
                className="mt-3 flex items-center gap-2 rounded border border-red-300 bg-red-50 p-2.5 text-xs text-red-900"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-red-700" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreatePost} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label htmlFor="bay-type" className="block font-semibold text-slate-800">
                    Listing Type
                  </label>
                  <select
                    id="bay-type"
                    value={postType}
                    onChange={(e) =>
                      setPostType(e.target.value as typeof postType)
                    }
                    className="mt-1 w-full rounded border border-slate-300 bg-white px-2.5 py-1.5"
                  >
                    <option value="volunteer_call">Volunteer Opportunity</option>
                    <option value="donation_offer">Donation / Relief Hub</option>
                    <option value="assistance_request">Assistance Request</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="bay-urgency" className="block font-semibold text-slate-800">
                    Urgency Level
                  </label>
                  <select
                    id="bay-urgency"
                    value={urgencyLevel}
                    onChange={(e) =>
                      setUrgencyLevel(e.target.value as typeof urgencyLevel)
                    }
                    className="mt-1 w-full rounded border border-slate-300 bg-white px-2.5 py-1.5"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High Priority</option>
                    <option value="critical">Critical / Calamity</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="bay-title" className="block font-semibold text-slate-800">
                  Initiative Title
                </label>
                <input
                  id="bay-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Barangay San Roque Weekend Reading & Feeding Drive"
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-1.5"
                />
              </div>

              <div>
                <label htmlFor="bay-org" className="block font-semibold text-slate-800">
                  Lead Organization / LGU / Barangay Council
                </label>
                <input
                  id="bay-org"
                  type="text"
                  required
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="e.g., Sangguniang Kabataan / Accredited NGO"
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label htmlFor="bay-reg" className="block font-semibold text-slate-800">
                    Region
                  </label>
                  <select
                    id="bay-reg"
                    value={regionCode}
                    onChange={(e) => setRegionCode(e.target.value)}
                    className="mt-1 w-full rounded border border-slate-300 bg-white px-2.5 py-1.5"
                  >
                    {PH_LOCATIONS.map((l) => (
                      <option key={l.id} value={l.regionCode}>
                        {l.regionCode}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="bay-city" className="block font-semibold text-slate-800">
                    City / Municipality
                  </label>
                  <input
                    id="bay-city"
                    type="text"
                    required
                    value={cityMunicipality}
                    onChange={(e) => setCityMunicipality(e.target.value)}
                    placeholder="e.g., Pasig City"
                    className="mt-1 w-full rounded border border-slate-300 px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bay-sum" className="block font-semibold text-slate-800">
                  Summary & Verification Details (Min 25 chars)
                </label>
                <textarea
                  id="bay-sum"
                  rows={2}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Describe the objective, dates, and beneficiaries..."
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-1.5"
                />
              </div>

              <div>
                <label htmlFor="bay-items" className="block font-semibold text-slate-800">
                  Specific Items or Volunteer Skills Needed (Comma-separated)
                </label>
                <input
                  id="bay-items"
                  type="text"
                  required
                  value={itemsNeeded}
                  onChange={(e) => setItemsNeeded(e.target.value)}
                  placeholder="e.g., Bottled water, Hygiene kits, Volunteer packers"
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-1.5"
                />
              </div>

              <div>
                <label htmlFor="bay-point" className="block font-semibold text-slate-800">
                  Verified Drop-Off or Meeting Point
                </label>
                <input
                  id="bay-point"
                  type="text"
                  required
                  value={meetingPoint}
                  onChange={(e) => setMeetingPoint(e.target.value)}
                  placeholder="e.g., Barangay Covered Court / CSWDO Desk"
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-1.5"
                />
              </div>

              <div>
                <label htmlFor="bay-contact" className="block font-semibold text-slate-800">
                  Official Contact Number or Desk
                </label>
                <input
                  id="bay-contact"
                  type="text"
                  required
                  value={contactChannel}
                  onChange={(e) => setContactChannel(e.target.value)}
                  placeholder="e.g., (02) 8000-0000 / Official LGU Page"
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-1.5"
                />
              </div>

              <div>
                <label htmlFor="bay-url" className="block font-semibold text-slate-800">
                  Official Reference Link (Optional)
                </label>
                <input
                  id="bay-url"
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://..."
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-1.5"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded bg-[#17365D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#102847]"
              >
                Submit for Community Moderation
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function BayanihanPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8 text-xs text-slate-600">
          Loading Bayanihan Community Hub...
        </div>
      }
    >
      <BayanihanContent />
    </Suspense>
  );
}
