"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Briefcase,
  FileText,
  ShieldAlert,
  Printer,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  PH_LOCATIONS,
  VERIFIED_OPPORTUNITIES,
} from "@/lib/constants/philippine-data";
import { SourceCitationBar } from "@/components/trust/verification-badge";
import { CopyButton } from "@/components/ui/copy-button";
import { jobScamReportSchema } from "@/lib/validations/schemas";
import { useCitizenState } from "@/components/providers/citizen-state-provider";

function TrabahoContent() {
  const searchParams = useSearchParams();
  const initialSlug = searchParams.get("item") || "";

  const [regionFilter, setRegionFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<
    "all" | "job" | "scholarship" | "training"
  >("all");
  const [keyword, setKeyword] = useState<string>("");

  const { toggleBookmark, isBookmarked, submitPublicReport } = useCitizenState();

  // Resume Template Presets
  const applyResumeTemplate = (type: "admin" | "bpo" | "trade" | "graduate") => {
    if (type === "admin") {
      setResumeFullName("Maria L. Santos");
      setResumeTitle("Administrative & Operations Assistant");
      setResumeLocation("Manila, Philippines");
      setResumePhone("0917-123-4567");
      setResumeEmail("maria.santos@email.ph");
      setResumeSummary("Proactive and detail-oriented Administrative Assistant with 2+ years of experience managing records, public inquiry desks, and office procurement. Proficient in MS Office, Google Workspace, and official document filing.");
      setResumeExperience("Administrative Assistant — Barangay Operations (2023 – Present)\n• Handled official correspondence and daily resident inquiries with 98% positive satisfaction.\n• Managed records inventory and digitized 1,200+ municipal civil documents.");
      setResumeEducation("Bachelor of Science in Office Administration\nPamantasan ng Lungsod ng Maynila (Graduated 2023)");
      setResumeSkills("Office Administration, MS Word/Excel, Customer Relations, Fast 60 WPM Typing, Civil Service Sub-Professional Eligible");
    } else if (type === "bpo") {
      setResumeFullName("Mark Christian Reyes");
      setResumeTitle("Customer Support Specialist (Inbound & Chat)");
      setResumeLocation("Quezon City, Metro Manila");
      setResumePhone("0918-987-6543");
      setResumeEmail("mark.reyes@email.ph");
      setResumeSummary("Customer Service Representative with 1.5+ years of voice and non-voice experience in e-commerce and technical support. Dedicated to achieving high CSAT scores, rapid first-call resolution, and empathetic customer communication.");
      setResumeExperience("Customer Service Representative — Teleperformance (2023 – 2024)\n• Handled 50+ inbound customer interactions daily maintaining a 94% CSAT rating.\n• Resolved customer order and billing inquiries following strict SLA guidelines.");
      setResumeEducation("Associate in Information Technology / Senior High School TVL Track\nSTI College (2022)");
      setResumeSkills("Active Listening, CRM Tools (Zendesk, Salesforce), English & Filipino Fluency, Conflict Resolution, 55 WPM Typing");
    } else if (type === "trade") {
      setResumeFullName("Eduardo D. Garcia");
      setResumeTitle("Electrical Technician / Installation & Maintenance");
      setResumeLocation("Cebu City, Central Visayas");
      setResumePhone("0920-555-0192");
      setResumeEmail("eduardo.garcia@email.ph");
      setResumeSummary("TESDA National Certificate (NC II) Certified Electrical Installation and Maintenance technician with 3 years of residential and commercial wiring experience. Strict adherence to Philippine Electrical Code and OSH safety standards.");
      setResumeExperience("Electrician Assistant — Metro Builders & Contractors (2022 – Present)\n• Installed conduit piping, breaker panels, and lighting fixtures for 20+ commercial units.\n• Conducted routine preventive maintenance and circuit testing without workplace injury.");
      setResumeEducation("TESDA NC II in Electrical Installation and Maintenance\nTESDA Regional Training Center (2022)");
      setResumeSkills("Blueprint Reading, Conduit Bending, Panel Board Wiring, Safety Compliance (DOLE BOSH), Power Tools Operation");
    } else {
      setResumeFullName("Angela Rose Bautista");
      setResumeTitle("Entry-Level Junior Associate");
      setResumeLocation("Davao City, Davao del Sur");
      setResumePhone("0929-333-8821");
      setResumeEmail("angela.bautista@email.ph");
      setResumeSummary("Motivated and adaptive recent graduate with strong leadership, communication, and digital research abilities. Eager to contribute disciplined work ethic, creative problem solving, and technical adaptability to a collaborative team.");
      setResumeExperience("Student Council Public Relations Officer — University of Mindanao (2023 – 2024)\n• Coordinated event logistics and digital marketing for 4 campus-wide student seminars.\n• Created infographics and social media updates reaching 5,000+ student followers.");
      setResumeEducation("Bachelor of Science in Business Management\nUniversity of Mindanao (Graduated Magna Cum Laude, 2024)");
      setResumeSkills("Project Coordination, Canva & MS Office, Social Media Management, Public Speaking, Tagalog & English Fluency");
    }
  };


  // Resume Builder State
  const [resumeFullName, setResumeFullName] = useState("Juan M. Dela Cruz");
  const [resumeTitle, setResumeTitle] = useState(
    "Administrative & Customer Operations Associate"
  );
  const [resumeLocation, setResumeLocation] = useState("Quezon City, Metro Manila");
  const [resumePhone, setResumePhone] = useState("0917-000-0000");
  const [resumeEmail, setResumeEmail] = useState("juan.delacruz@example.ph");
  const [resumeSummary, setResumeSummary] = useState(
    "Detail-oriented Filipino professional with experience in office administration, document processing, and customer support. Equipped with TESDA NC II certification and complete pre-employment statutory credentials (SSS, PhilHealth, Pag-IBIG, NBI)."
  );
  const [resumeExperience, setResumeExperience] = useState(
    "Administrative Staff — Barangay / Local Service Desk (2024 – Present)\n• Assisted 50+ residents daily with document verification and appointment scheduling.\n• Maintained organized digital and physical logs with 99% accuracy."
  );
  const [resumeEducation, setResumeEducation] = useState(
    "Bachelor of Science in Business Administration / Senior High School Graduate\nPolytechnic University / Public Stand-Alone Senior High School"
  );
  const [resumeSkills, setResumeSkills] = useState(
    "MS Office / Google Workspace, Customer Service (English & Filipino), Bookkeeping, TESDA NC II Certified, Civil Service Sub-Professional Eligible"
  );

  // Job Scam Report Form State
  const [scamCompany, setScamCompany] = useState("");
  const [scamJobTitle, setScamJobTitle] = useState("");
  const [scamPlatform, setScamPlatform] = useState("SMS / Text Message");
  const [scamFeeAsked, setScamFeeAsked] = useState(true);
  const [scamAmount, setScamAmount] = useState<number>(0);
  const [scamDetails, setScamDetails] = useState("");
  const [scamRefLink, setScamRefLink] = useState("");
  const [scamError, setScamError] = useState<string | null>(null);
  const [scamSubmittedRef, setScamSubmittedRef] = useState<string | null>(null);

  const jobsAndTraining = VERIFIED_OPPORTUNITIES.filter(
    (o) =>
      o.type === "job" || o.type === "training" || o.type === "scholarship"
  ).filter((o) => {
    if (typeFilter !== "all" && o.type !== typeFilter) return false;
    if (
      regionFilter !== "ALL" &&
      o.regionCode !== regionFilter &&
      o.regionCode !== "NATIONAL"
    )
      return false;
    if (!keyword.trim()) return true;
    const hay = `${o.title} ${o.organizationName} ${o.description} ${o.employmentType}`.toLowerCase();
    return hay.includes(keyword.trim().toLowerCase());
  });

  const handleScamReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScamError(null);

    const parsed = jobScamReportSchema.safeParse({
      companyOrRecruiterName: scamCompany,
      jobTitleOffered: scamJobTitle,
      platformOrChannel: scamPlatform,
      illegalFeeRequested: scamFeeAsked,
      amountRequestedPHP: scamAmount,
      incidentDescription: scamDetails,
      referenceLink: scamRefLink,
    });

    if (!parsed.success) {
      setScamError(parsed.error.issues[0]?.message || "Please check your inputs.");
      return;
    }

    const report = submitPublicReport({
      targetType: "opportunity",
      targetId: `scam-${Date.now()}`,
      targetTitle: `Job Scam Report: ${parsed.data.companyOrRecruiterName} (${parsed.data.jobTitleOffered})`,
      reason: "suspected_scam",
      details: `Channel: ${parsed.data.platformOrChannel} | Illegal Fee Asked: ${
        parsed.data.illegalFeeRequested ? `Yes (PHP ${parsed.data.amountRequestedPHP || 0})` : "No"
      } | Details: ${parsed.data.incidentDescription}`,
      officialReferenceUrl: parsed.data.referenceLink || undefined,
    });

    setScamSubmittedRef(report.id);
    setScamCompany("");
    setScamJobTitle("");
    setScamDetails("");
  };

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6">
      {/* Header */}
      <div className="no-print mb-6 border-b border-slate-200 pb-4">
        <div className="inline-flex items-center gap-1.5 rounded bg-blue-50 px-2.5 py-0.5 text-xs font-bold uppercase text-[#17365D]">
          <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Module A · Trabaho</span>
        </div>
        <h1 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Verified Employment, Scholarships, Skills Training, Resume Builder & Anti-Scam Center
        </h1>
        <p className="mt-1 text-xs text-slate-600">
          Explore vetted government and DOLE PhilJobNet career portals, DOST/CHED scholarships, free TESDA skills grants, build a printable resume, or report illegal recruitment and task scams.
        </p>
        <div className="mt-3 rounded border border-amber-200 bg-amber-50/80 px-3 py-2 text-[11px] text-amber-950">
          <strong>Employer & Recruitment Disclosure:</strong> GabayPH is an independent public directory and is <strong>not</strong> the employer or recruitment agency. We do not invent job vacancies, charge placement fees, or guarantee employment. All applications are submitted directly on the official employer or <code>.gov.ph</code> portal.
        </div>

        {/* Trabaho 3-Section Jump Bar */}
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href="#jobs-directory"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-2xs hover:border-[#17365D] hover:text-[#17365D]"
          >
            <Briefcase className="h-3.5 w-3.5 text-[#17365D]" />
            <span>1. Jobs & Scholarships ({jobsAndTraining.length})</span>
          </a>
          <a
            href="#resume-builder"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-2xs hover:border-[#17365D] hover:text-[#17365D]"
          >
            <FileText className="h-3.5 w-3.5 text-[#17365D]" />
            <span>2. Free Printable Resume Builder</span>
          </a>
          <a
            href="#scam-report"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-2xs hover:border-[#17365D] hover:text-[#17365D]"
          >
            <ShieldAlert className="h-3.5 w-3.5 text-red-600" />
            <span>3. Anti-Scam Reporting Center</span>
          </a>
        </div>
      </div>

      {/* Section 1: Verified Job, Scholarship & Training Listings */}
      <section
        aria-labelledby="jobs-directory-heading"
        className="no-print mb-10"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2
            id="jobs-directory-heading"
            className="text-base font-bold text-slate-900"
          >
            1. Verified Job Portals, Scholarships & Free Skills Training ({jobsAndTraining.length})
          </h2>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <input
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Filter by job title, agency, or skill..."
              aria-label="Filter jobs, scholarships, and training by keyword"
              className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs"
            />

            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(
                  e.target.value as "all" | "job" | "scholarship" | "training"
                )
              }
              aria-label="Filter by opportunity type"
              className="rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs"
            >
              <option value="all">All (Jobs, Scholarships & Training)</option>
              <option value="job">Employment Openings</option>
              <option value="scholarship">Scholarship Directory</option>
              <option value="training">TESDA & DICT Skills Training</option>
            </select>

            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              aria-label="Filter by region"
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
        </div>

        {jobsAndTraining.length === 0 ? (
          <div className="rounded-md border border-slate-200 bg-white p-6 text-center text-xs text-slate-600">
            <p className="font-semibold text-slate-900">
              No verified opportunities match your current filters.
            </p>
            <p className="mt-1">
              We never fabricate job vacancies. Try clearing your keyword or selecting &quot;All Regions&quot;.
            </p>
            <button
              type="button"
              onClick={() => {
                setKeyword("");
                setTypeFilter("all");
                setRegionFilter("ALL");
              }}
              className="mt-3 rounded bg-[#17365D] px-3 py-1.5 font-semibold text-white hover:bg-[#102847]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobsAndTraining.map((opp) => {
              const isHighlighted = initialSlug === opp.slug;
              return (
                <article
                  key={opp.id}
                  className={`rounded-md border bg-white p-4 sm:p-5 ${
                    isHighlighted
                      ? "border-[#17365D] ring-2 ring-[#17365D]/20"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-[#17365D]">
                          {opp.type}
                        </span>
                        <span className="text-xs font-semibold text-slate-700">
                          {opp.organizationName}
                        </span>
                        <span className="text-xs text-slate-500">
                          · {opp.employmentType}
                        </span>
                        {opp.deadlineAt && (
                          <span className="rounded bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-900">
                            Deadline: {opp.deadlineAt}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-1.5 text-base font-bold text-slate-900">
                        <a
                          href={`/trabaho/${opp.slug}`}
                          className="hover:text-[#17365D] hover:underline"
                        >
                          {opp.title}
                        </a>
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={`/trabaho/${opp.slug}`}
                        className="inline-flex items-center gap-1 rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-[#17365D] hover:bg-slate-50"
                      >
                        <span>Full Details</span>
                      </a>

                      <button
                        type="button"
                        onClick={() =>
                          toggleBookmark({
                            targetType: "opportunity",
                            targetId: opp.id,
                            targetSlug: opp.slug,
                            targetTitle: opp.title,
                            targetModule: "trabaho",
                            href: `/trabaho/${opp.slug}`,
                          })
                        }
                        className="inline-flex items-center gap-1 rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        {isBookmarked(opp.id) ? (
                          <>
                            <BookmarkCheck className="h-3.5 w-3.5 text-emerald-700" />
                            <span>Saved</span>
                          </>
                        ) : (
                          <>
                            <Bookmark className="h-3.5 w-3.5" />
                            <span>Save</span>
                          </>
                        )}
                      </button>

                      <a
                        href={opp.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded bg-[#17365D] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#102847]"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-slate-700">
                    {opp.description}
                  </p>

                  <div className="mt-3 rounded border border-slate-200 bg-slate-50 p-3 text-xs">
                    <div className="font-semibold text-slate-900">
                      Compensation / Grant Benefit:{" "}
                      <span className="font-normal text-emerald-900">
                        {opp.compensationOrBenefit}
                      </span>
                    </div>
                    <div className="mt-2 font-semibold text-slate-800">
                      Documentary & Qualification Requirements:
                    </div>
                    <ul className="mt-1 grid grid-cols-1 gap-1 sm:grid-cols-2">
                      {opp.requirements.map((req, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-1.5 text-slate-600"
                        >
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#17365D]" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <SourceCitationBar
                    sourceName={opp.sourceName}
                    sourceUrl={opp.sourceUrl}
                    regionName={opp.regionName}
                    lastVerifiedAt={opp.lastVerifiedAt}
                    verificationStatus={opp.verificationStatus}
                    targetId={opp.id}
                    targetTitle={opp.title}
                    targetType="opportunity"
                    shareHref={`/trabaho/${opp.slug}`}
                    deadlineOrExpiresAt={opp.deadlineAt}
                  />
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Section 2: Interactive Printable Resume Builder */}
      <section
        id="resume-builder"
        aria-labelledby="resume-builder-heading"
        className="mb-10 rounded-md border border-slate-200 bg-white p-4 sm:p-6"
      >
        <div className="no-print flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#17365D]" aria-hidden="true" />
            <div>
              <h2
                id="resume-builder-heading"
                className="text-base font-bold text-slate-900"
              >
                2. Free Printable Resume Builder (Philippine Standard Format)
              </h2>
              <p className="text-xs text-slate-600">
                Choose a pre-filled Philippine industry template below or fill in your details to print a clean, employer-ready resume.
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-500">Industry Templates:</span>
                <button
                  type="button"
                  onClick={() => applyResumeTemplate("admin")}
                  className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                >
                  Admin & Office
                </button>
                <button
                  type="button"
                  onClick={() => applyResumeTemplate("bpo")}
                  className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                >
                  BPO & Support
                </button>
                <button
                  type="button"
                  onClick={() => applyResumeTemplate("trade")}
                  className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                >
                  TESDA Skilled Trade
                </button>
                <button
                  type="button"
                  onClick={() => applyResumeTemplate("graduate")}
                  className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                >
                  Fresh Graduate
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => typeof window !== "undefined" && window.print()}
            className="inline-flex items-center gap-1.5 rounded bg-[#17365D] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#102847]"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print / Save Resume as PDF</span>
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Form Editor (Hidden when printing) */}
          <div className="no-print space-y-3 text-xs lg:col-span-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="res-name" className="block font-semibold text-slate-800">
                  Full Name
                </label>
                <input
                  id="res-name"
                  type="text"
                  value={resumeFullName}
                  onChange={(e) => setResumeFullName(e.target.value)}
                  className="mt-1 w-full rounded border border-slate-300 px-2.5 py-1.5"
                />
              </div>
              <div>
                <label htmlFor="res-title" className="block font-semibold text-slate-800">
                  Target Role / Headline
                </label>
                <input
                  id="res-title"
                  type="text"
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                  className="mt-1 w-full rounded border border-slate-300 px-2.5 py-1.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label htmlFor="res-loc" className="block font-semibold text-slate-800">
                  City / Province
                </label>
                <input
                  id="res-loc"
                  type="text"
                  value={resumeLocation}
                  onChange={(e) => setResumeLocation(e.target.value)}
                  className="mt-1 w-full rounded border border-slate-300 px-2.5 py-1.5"
                />
              </div>
              <div>
                <label htmlFor="res-phone" className="block font-semibold text-slate-800">
                  Mobile Number
                </label>
                <input
                  id="res-phone"
                  type="text"
                  value={resumePhone}
                  onChange={(e) => setResumePhone(e.target.value)}
                  className="mt-1 w-full rounded border border-slate-300 px-2.5 py-1.5"
                />
              </div>
              <div>
                <label htmlFor="res-email" className="block font-semibold text-slate-800">
                  Email Address
                </label>
                <input
                  id="res-email"
                  type="email"
                  value={resumeEmail}
                  onChange={(e) => setResumeEmail(e.target.value)}
                  className="mt-1 w-full rounded border border-slate-300 px-2.5 py-1.5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="res-summary" className="block font-semibold text-slate-800">
                Professional Summary
              </label>
              <textarea
                id="res-summary"
                rows={2}
                value={resumeSummary}
                onChange={(e) => setResumeSummary(e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-2.5 py-1.5"
              />
            </div>

            <div>
              <label htmlFor="res-exp" className="block font-semibold text-slate-800">
                Work Experience / OJT / Volunteer Service
              </label>
              <textarea
                id="res-exp"
                rows={3}
                value={resumeExperience}
                onChange={(e) => setResumeExperience(e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-2.5 py-1.5"
              />
            </div>

            <div>
              <label htmlFor="res-edu" className="block font-semibold text-slate-800">
                Education & Training
              </label>
              <textarea
                id="res-edu"
                rows={2}
                value={resumeEducation}
                onChange={(e) => setResumeEducation(e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-2.5 py-1.5"
              />
            </div>

            <div>
              <label htmlFor="res-skills" className="block font-semibold text-slate-800">
                Skills, TESDA NC & Statutory Readiness
              </label>
              <input
                id="res-skills"
                type="text"
                value={resumeSkills}
                onChange={(e) => setResumeSkills(e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-2.5 py-1.5"
              />
            </div>
          </div>

          {/* Right Live Printable Resume Sheet */}
          <div className="rounded border border-slate-300 bg-white p-6 shadow-xs lg:col-span-6">
            <div className="border-b-2 border-slate-900 pb-3">
              <h3 className="text-lg font-bold uppercase tracking-tight text-slate-900">
                {resumeFullName}
              </h3>
              <p className="text-xs font-semibold text-[#17365D]">
                {resumeTitle}
              </p>
              <p className="mt-1 text-[11px] text-slate-600">
                {resumeLocation} · {resumePhone} · {resumeEmail}
              </p>
            </div>

            <div className="mt-3 space-y-3 text-xs text-slate-800">
              <div>
                <h4 className="font-bold uppercase tracking-wider text-slate-900">
                  Professional Summary
                </h4>
                <p className="mt-1 leading-relaxed">{resumeSummary}</p>
              </div>

              <div>
                <h4 className="font-bold uppercase tracking-wider text-slate-900">
                  Relevant Experience & Community Service
                </h4>
                <pre className="mt-1 whitespace-pre-wrap font-sans leading-relaxed">
                  {resumeExperience}
                </pre>
              </div>

              <div>
                <h4 className="font-bold uppercase tracking-wider text-slate-900">
                  Education
                </h4>
                <pre className="mt-1 whitespace-pre-wrap font-sans leading-relaxed">
                  {resumeEducation}
                </pre>
              </div>

              <div>
                <h4 className="font-bold uppercase tracking-wider text-slate-900">
                  Core Competencies & Certifications
                </h4>
                <p className="mt-1 leading-relaxed">{resumeSkills}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Job Scam Reporting Center */}
      <section
        id="scam-report"
        aria-labelledby="scam-report-heading"
        className="no-print rounded-md border border-red-200 bg-white p-4 sm:p-6"
      >
        <div className="flex items-start gap-3 border-b border-slate-200 pb-4">
          <ShieldAlert
            className="mt-0.5 h-5 w-5 shrink-0 text-red-700"
            aria-hidden="true"
          />
          <div>
            <h2
              id="scam-report-heading"
              className="text-base font-bold text-slate-900"
            >
              3. Report a Suspected Job Scam or Illegal Recruitment Offer
            </h2>
            <p className="mt-0.5 text-xs text-slate-600">
              Under Philippine labor laws (DOLE & DMW), legitimate employers and licensed agencies do not charge placement fees for domestic jobs or require &quot;task recharge deposits&quot; via e-wallets. Report suspicious offers below to alert moderators and CICC 1326.
            </p>
          </div>
        </div>

        {scamSubmittedRef ? (
          <div className="mt-4 rounded border border-emerald-300 bg-emerald-50 p-4 text-xs text-emerald-950">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              <span>Scam Report Logged (Reference #{scamSubmittedRef})</span>
            </div>
            <p className="mt-1">
              Your report has been added to the GabayPH Moderation & Anti-Scam queue. For immediate cybercrime assistance or financial recovery, also call the CICC Hotline at <strong>1326</strong> or PNP-ACG at <strong>(02) 8723-0401</strong>.
            </p>
            <button
              type="button"
              onClick={() => setScamSubmittedRef(null)}
              className="mt-3 rounded bg-[#17365D] px-3 py-1.5 font-semibold text-white"
            >
              Submit Another Report
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleScamReportSubmit}
            className="mt-4 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2"
          >
            {scamError && (
              <div
                role="alert"
                className="flex items-center gap-2 rounded border border-red-300 bg-red-50 p-2.5 text-red-900 sm:col-span-2"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-red-700" />
                <span>{scamError}</span>
              </div>
            )}

            <div>
              <label htmlFor="scam-comp" className="block font-semibold text-slate-800">
                Company, Agency, or Recruiter Name Used
              </label>
              <input
                id="scam-comp"
                type="text"
                required
                value={scamCompany}
                onChange={(e) => setScamCompany(e.target.value)}
                placeholder="e.g., Fake DOLE Task Group / Unlicensed Agency"
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="scam-role" className="block font-semibold text-slate-800">
                Job Title or Offer Promised
              </label>
              <input
                id="scam-role"
                type="text"
                required
                value={scamJobTitle}
                onChange={(e) => setScamJobTitle(e.target.value)}
                placeholder="e.g., Online Data Encoder / Part-Time App Reviewer"
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="scam-platform" className="block font-semibold text-slate-800">
                Platform Where Contact Occurred
              </label>
              <select
                id="scam-platform"
                value={scamPlatform}
                onChange={(e) => setScamPlatform(e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2"
              >
                <option value="SMS / Text Message">SMS / Text Message</option>
                <option value="Telegram / WhatsApp / Viber">
                  Telegram / WhatsApp / Viber
                </option>
                <option value="Facebook Page / Group">
                  Facebook Page / Messenger
                </option>
                <option value="Email / Fake Website">Email / Fake Website</option>
                <option value="Walk-in Unlicensed Office">
                  Walk-in Unlicensed Office
                </option>
              </select>
            </div>

            <div>
              <label htmlFor="scam-amount" className="block font-semibold text-slate-800">
                Illegal Fee / Deposit Requested (PHP, if any)
              </label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  id="scam-amount"
                  type="number"
                  min={0}
                  value={scamAmount}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 0;
                    setScamAmount(val);
                    setScamFeeAsked(val > 0);
                  }}
                  className="w-full rounded border border-slate-300 px-3 py-2 font-mono"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="scam-desc" className="block font-semibold text-slate-800">
                Red Flags & Incident Description (Minimum 20 characters)
              </label>
              <textarea
                id="scam-desc"
                rows={3}
                required
                value={scamDetails}
                onChange={(e) => setScamDetails(e.target.value)}
                placeholder="Describe what happened, the phone number or handle used, and any payment demands..."
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="scam-url" className="block font-semibold text-slate-800">
                Suspicious Link or Reference URL (Optional)
              </label>
              <input
                id="scam-url"
                type="url"
                value={scamRefLink}
                onChange={(e) => setScamRefLink(e.target.value)}
                placeholder="https://..."
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end pt-2">
              <button
                type="submit"
                className="rounded bg-red-700 px-4 py-2 text-xs font-semibold text-white hover:bg-red-800"
              >
                Submit Job Scam Report
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}

export default function TrabahoPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8 text-xs text-slate-600">
          Loading Trabaho Employment & Resume Module...
        </div>
      }
    >
      <TrabahoContent />
    </Suspense>
  );
}
