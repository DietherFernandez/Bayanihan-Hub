"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
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
  Search,
  Building2,
  Calendar,
  AlertTriangle,
  Info,
  DollarSign,
} from "lucide-react";
import {
  PH_LOCATIONS,
  VERIFIED_OPPORTUNITIES,
} from "@/lib/constants/philippine-data";
import { SourceCitationBar } from "@/components/trust/verification-badge";
import { jobScamReportSchema } from "@/lib/validations/schemas";
import { useCitizenState } from "@/components/providers/citizen-state-provider";

function TrabahoContent() {
  const searchParams = useSearchParams();
  const initialSlug = searchParams.get("item") || "";

  const [activeSection, setActiveSection] = useState<"jobs" | "resume" | "scam">(
    "jobs"
  );
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
      setResumeSummary(
        "Proactive and detail-oriented Administrative Assistant with 2+ years of experience managing records, public inquiry desks, and office procurement. Proficient in MS Office, Google Workspace, and official document filing."
      );
      setResumeExperience(
        "Administrative Assistant — Barangay Operations (2023 – Present)\n• Handled official correspondence and daily resident inquiries with 98% positive satisfaction.\n• Managed records inventory and digitized 1,200+ municipal civil documents."
      );
      setResumeEducation(
        "Bachelor of Science in Office Administration\nPamantasan ng Lungsod ng Maynila (Graduated 2023)"
      );
      setResumeSkills(
        "Office Administration, MS Word/Excel, Customer Relations, Fast 60 WPM Typing, Civil Service Sub-Professional Eligible"
      );
    } else if (type === "bpo") {
      setResumeFullName("Mark Christian Reyes");
      setResumeTitle("Customer Support Specialist (Inbound & Chat)");
      setResumeLocation("Quezon City, Metro Manila");
      setResumePhone("0918-987-6543");
      setResumeEmail("mark.reyes@email.ph");
      setResumeSummary(
        "Customer Service Representative with 1.5+ years of voice and non-voice experience in e-commerce and technical support. Dedicated to achieving high CSAT scores, rapid first-call resolution, and empathetic customer communication."
      );
      setResumeExperience(
        "Customer Service Representative — Teleperformance (2023 – 2024)\n• Handled 50+ inbound customer interactions daily maintaining a 94% CSAT rating.\n• Resolved customer order and billing inquiries following strict SLA guidelines."
      );
      setResumeEducation(
        "Associate in Information Technology / Senior High School TVL Track\nSTI College (2022)"
      );
      setResumeSkills(
        "Active Listening, CRM Tools (Zendesk, Salesforce), English & Filipino Fluency, Conflict Resolution, 55 WPM Typing"
      );
    } else if (type === "trade") {
      setResumeFullName("Eduardo D. Garcia");
      setResumeTitle("Electrical Technician / Installation & Maintenance");
      setResumeLocation("Cebu City, Central Visayas");
      setResumePhone("0920-555-0192");
      setResumeEmail("eduardo.garcia@email.ph");
      setResumeSummary(
        "TESDA National Certificate (NC II) Certified Electrical Installation and Maintenance technician with 3 years of residential and commercial wiring experience. Strict adherence to Philippine Electrical Code and OSH safety standards."
      );
      setResumeExperience(
        "Electrician Assistant — Metro Builders & Contractors (2022 – Present)\n• Installed conduit piping, breaker panels, and lighting fixtures for 20+ commercial units.\n• Conducted routine preventive maintenance and circuit testing without workplace injury."
      );
      setResumeEducation(
        "TESDA NC II in Electrical Installation and Maintenance\nTESDA Regional Training Center (2022)"
      );
      setResumeSkills(
        "Blueprint Reading, Conduit Bending, Panel Board Wiring, Safety Compliance (DOLE BOSH), Power Tools Operation"
      );
    } else {
      setResumeFullName("Angela Rose Bautista");
      setResumeTitle("Entry-Level Junior Associate");
      setResumeLocation("Davao City, Davao del Sur");
      setResumePhone("0929-333-8821");
      setResumeEmail("angela.bautista@email.ph");
      setResumeSummary(
        "Motivated and adaptive recent graduate with strong leadership, communication, and digital research abilities. Eager to contribute disciplined work ethic, creative problem solving, and technical adaptability to a collaborative team."
      );
      setResumeExperience(
        "Student Council Public Relations Officer — University of Mindanao (2023 – 2024)\n• Coordinated event logistics and digital marketing for 4 campus-wide student seminars.\n• Created infographics and social media updates reaching 5,000+ student followers."
      );
      setResumeEducation(
        "Bachelor of Science in Business Management\nUniversity of Mindanao (Graduated Magna Cum Laude, 2024)"
      );
      setResumeSkills(
        "Project Coordination, Canva & MS Office, Social Media Management, Public Speaking, Tagalog & English Fluency"
      );
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
        parsed.data.illegalFeeRequested
          ? `Yes (PHP ${parsed.data.amountRequestedPHP || 0})`
          : "No"
      } | Details: ${parsed.data.incidentDescription}`,
      officialReferenceUrl: parsed.data.referenceLink || undefined,
    });

    setScamSubmittedRef(report.id);
    setScamCompany("");
    setScamJobTitle("");
    setScamDetails("");
  };

  const handlePrintResume = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10 space-y-8 sm:space-y-10">
      {/* Header & Page Title (Cardless Editorial Style) */}
      <div className="no-print space-y-2 border-b border-slate-200 pb-5">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-[#17365D]">
          <Briefcase className="h-4 w-4 text-[#17365D]" aria-hidden="true" />
          <span>Module A · Trabaho at Kabuhayan</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Verified Careers, Free Skills Grants &amp; Resume Builder
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
          Official civil service vacancies, PhilJobNet openings, TESDA NC-II skills grants, printable Philippine standard resume generator, and anti-scam reporting.
        </p>

        {/* Section Navigation Tabs (Civic Underline Tabs, No Heavy Pills) */}
        <div className="no-scrollbar flex gap-4 overflow-x-auto whitespace-nowrap pt-3 text-xs font-semibold text-slate-500">
          <button
            type="button"
            onClick={() => setActiveSection("jobs")}
            className={`pb-2.5 transition ${
              activeSection === "jobs"
                ? "border-b-2 border-[#17365D] font-bold text-[#17365D]"
                : "hover:text-slate-800"
            }`}
          >
            1. Career &amp; Training Directory ({jobsAndTraining.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("resume")}
            className={`pb-2.5 transition ${
              activeSection === "resume"
                ? "border-b-2 border-[#17365D] font-bold text-[#17365D]"
                : "hover:text-slate-800"
            }`}
          >
            2. Printable Resume Builder
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("scam")}
            className={`pb-2.5 transition ${
              activeSection === "scam"
                ? "border-b-2 border-red-700 font-bold text-red-700"
                : "hover:text-red-700"
            }`}
          >
            3. Anti-Scam Reporting Center
          </button>
        </div>
      </div>

      {/* SECTION 1: Career & Training Directory */}
      {activeSection === "jobs" && (
        <section aria-labelledby="jobs-heading" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Filter by position, agency, skill, or qualification..."
                aria-label="Filter jobs, scholarships, and training by keyword"
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#17365D] focus:ring-1 focus:ring-[#17365D] transition"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs shrink-0">
              <select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(
                    e.target.value as "all" | "job" | "scholarship" | "training"
                  )
                }
                aria-label="Filter by opportunity type"
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#17365D]"
              >
                <option value="all">All Opportunities</option>
                <option value="job">Plantilla &amp; Corporate Jobs</option>
                <option value="scholarship">Scholarship Programs</option>
                <option value="training">TESDA Skills Training</option>
              </select>

              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                aria-label="Filter by region"
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

          {/* Opportunities List (Open Editorial Dividers, No Boxed Cards) */}
          {jobsAndTraining.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-500 space-y-2">
              <p className="font-semibold text-slate-900">
                No verified opportunities matched your filter criteria.
              </p>
              <p className="text-slate-500">
                GabayPH only lists verified civil service and PhilJobNet vacancies. Try clearing your keyword or selecting &quot;All Regions&quot;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setKeyword("");
                  setTypeFilter("all");
                  setRegionFilter("ALL");
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#17365D] text-white font-semibold text-xs hover:bg-[#102847]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 border-y border-slate-200 text-xs">
              {jobsAndTraining.map((opp) => (
                <div
                  key={opp.id}
                  className="py-4 space-y-2 group hover:bg-slate-50/60 -mx-2 px-2 rounded-lg transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded bg-blue-50 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase text-[#17365D]">
                          {opp.organizationName.split(" ")[0]} · {opp.type}
                        </span>
                        <span className="text-[11px] text-slate-400 capitalize">
                          {opp.employmentType} · {opp.regionName}
                        </span>
                        {opp.deadlineAt && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span className="text-[11px] text-amber-700 font-medium">
                              Deadline: {opp.deadlineAt}
                            </span>
                          </>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 group-hover:text-[#17365D] text-sm sm:text-base transition">
                        <Link href={`/trabaho/${opp.slug}`}>
                          {opp.title}
                        </Link>
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
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
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-[#17365D] transition"
                        title="Save opportunity"
                      >
                        {isBookmarked(opp.id) ? (
                          <BookmarkCheck className="h-4 w-4 text-emerald-700" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </button>
                      <a
                        href={opp.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#17365D] text-white font-semibold hover:bg-[#102847] shadow-2xs transition"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>

                  <p className="text-slate-600 leading-relaxed text-[11.5px]">
                    {opp.description}
                  </p>

                  <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-2 pt-1 border-t border-slate-50">
                    <span className="font-semibold text-slate-800">
                      {opp.compensationOrBenefit}
                    </span>
                    <span>·</span>
                    <span>{opp.requirements.slice(0, 2).join(" · ")}</span>
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
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* SECTION 2: Free Printable Resume Builder */}
      {activeSection === "resume" && (
        <section id="resume-builder" aria-labelledby="resume-heading" className="space-y-4">
          <div className="no-print flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <h2 id="resume-heading" className="text-sm sm:text-base font-bold text-slate-900">
                Philippine Standard Resume Generator
              </h2>
              <p className="text-xs text-slate-500">
                Fill in your details or pick an industry template below to preview and print a clean 1-page CV.
              </p>
            </div>
            <button
              type="button"
              onClick={handlePrintResume}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#17365D] text-white text-xs font-semibold hover:bg-[#102847] shadow-2xs transition"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>

          {/* Industry Template Presets */}
          <div className="no-print flex flex-wrap items-center gap-1.5 text-xs">
            <span className="font-semibold text-slate-500">Industry Presets:</span>
            <button
              type="button"
              onClick={() => applyResumeTemplate("admin")}
              className="px-2.5 py-1 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            >
              Admin &amp; Office
            </button>
            <button
              type="button"
              onClick={() => applyResumeTemplate("bpo")}
              className="px-2.5 py-1 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            >
              BPO &amp; Customer Support
            </button>
            <button
              type="button"
              onClick={() => applyResumeTemplate("trade")}
              className="px-2.5 py-1 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            >
              TESDA NC-II Trade
            </button>
            <button
              type="button"
              onClick={() => applyResumeTemplate("graduate")}
              className="px-2.5 py-1 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            >
              Fresh Graduate
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
            {/* Editor Form (Cardless, No Print) */}
            <div className="no-print space-y-3 text-xs lg:col-span-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="res-name" className="font-semibold text-slate-700">Full Name</label>
                  <input
                    id="res-name"
                    type="text"
                    value={resumeFullName}
                    onChange={(e) => setResumeFullName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#17365D]"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="res-title" className="font-semibold text-slate-700">Target Role / Headline</label>
                  <input
                    id="res-title"
                    type="text"
                    value={resumeTitle}
                    onChange={(e) => setResumeTitle(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#17365D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label htmlFor="res-loc" className="font-semibold text-slate-700">Location</label>
                  <input
                    id="res-loc"
                    type="text"
                    value={resumeLocation}
                    onChange={(e) => setResumeLocation(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#17365D]"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="res-phone" className="font-semibold text-slate-700">Phone</label>
                  <input
                    id="res-phone"
                    type="text"
                    value={resumePhone}
                    onChange={(e) => setResumePhone(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#17365D]"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="res-email" className="font-semibold text-slate-700">Email</label>
                  <input
                    id="res-email"
                    type="email"
                    value={resumeEmail}
                    onChange={(e) => setResumeEmail(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#17365D]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="res-summary" className="font-semibold text-slate-700">Professional Summary</label>
                <textarea
                  id="res-summary"
                  rows={2}
                  value={resumeSummary}
                  onChange={(e) => setResumeSummary(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#17365D]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="res-exp" className="font-semibold text-slate-700">Work Experience / OJT / Volunteer</label>
                <textarea
                  id="res-exp"
                  rows={3}
                  value={resumeExperience}
                  onChange={(e) => setResumeExperience(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#17365D]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="res-edu" className="font-semibold text-slate-700">Education &amp; Training</label>
                <textarea
                  id="res-edu"
                  rows={2}
                  value={resumeEducation}
                  onChange={(e) => setResumeEducation(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#17365D]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="res-skills" className="font-semibold text-slate-700">Skills &amp; Statutory Certifications</label>
                <input
                  id="res-skills"
                  type="text"
                  value={resumeSkills}
                  onChange={(e) => setResumeSkills(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#17365D]"
                />
              </div>
            </div>

            {/* Printable Paper Sheet View */}
            <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-2xs lg:col-span-6 space-y-3 text-xs">
              <div className="border-b-2 border-slate-900 pb-2">
                <h3 className="text-base font-bold uppercase tracking-tight text-slate-900">
                  {resumeFullName}
                </h3>
                <p className="font-semibold text-[#17365D] text-xs">
                  {resumeTitle}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {resumeLocation} · {resumePhone} · {resumeEmail}
                </p>
              </div>

              <div className="space-y-2.5 text-slate-800">
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-slate-900 text-[11px]">
                    Professional Summary
                  </h4>
                  <p className="mt-0.5 leading-relaxed text-slate-600 text-[11px]">{resumeSummary}</p>
                </div>

                <div>
                  <h4 className="font-bold uppercase tracking-wider text-slate-900 text-[11px]">
                    Experience &amp; Community Service
                  </h4>
                  <pre className="mt-0.5 whitespace-pre-wrap font-sans leading-relaxed text-slate-600 text-[11px]">
                    {resumeExperience}
                  </pre>
                </div>

                <div>
                  <h4 className="font-bold uppercase tracking-wider text-slate-900 text-[11px]">
                    Education
                  </h4>
                  <pre className="mt-0.5 whitespace-pre-wrap font-sans leading-relaxed text-slate-600 text-[11px]">
                    {resumeEducation}
                  </pre>
                </div>

                <div>
                  <h4 className="font-bold uppercase tracking-wider text-slate-900 text-[11px]">
                    Core Competencies
                  </h4>
                  <p className="mt-0.5 text-slate-600 text-[11px]">{resumeSkills}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 3: Anti-Scam Reporting Center */}
      {activeSection === "scam" && (
        <section id="scam-report" aria-labelledby="scam-heading" className="space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-700" aria-hidden="true" />
              <h2 id="scam-heading" className="text-sm sm:text-base font-bold text-slate-900">
                Report Illegal Recruitment or Online Job Scam
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Under RA 8042 (Migrant Workers Act) and DOLE Department Orders, legitimate employers do not charge placement fees for local work or require &quot;task deposits&quot; via GCash or Maya.
            </p>
          </div>

          {scamSubmittedRef ? (
            <div className="py-6 text-center space-y-2 text-xs">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                Report Logged Successfully (Ref #{scamSubmittedRef})
              </h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Your report has been forwarded to the GabayPH civic safety moderation queue. For urgent financial recovery, also report to the Cybercrime Investigation and Coordinating Center (CICC) at Hotline <strong>1326</strong>.
              </p>
              <button
                type="button"
                onClick={() => setScamSubmittedRef(null)}
                className="mt-2 px-3.5 py-1.5 rounded-lg bg-[#17365D] text-white font-semibold text-xs"
              >
                Submit Another Report
              </button>
            </div>
          ) : (
            <form onSubmit={handleScamReportSubmit} className="space-y-4 text-xs">
              {scamError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-900 border border-red-200">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-700" />
                  <span>{scamError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="scam-comp" className="font-semibold text-slate-700">
                    Company, Agency, or Recruiter Handle
                  </label>
                  <input
                    id="scam-comp"
                    type="text"
                    required
                    value={scamCompany}
                    onChange={(e) => setScamCompany(e.target.value)}
                    placeholder="e.g. Unregistered FB Group, Telegram Recruiter"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-red-600"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="scam-role" className="font-semibold text-slate-700">
                    Job Title or Work Promised
                  </label>
                  <input
                    id="scam-role"
                    type="text"
                    required
                    value={scamJobTitle}
                    onChange={(e) => setScamJobTitle(e.target.value)}
                    placeholder="e.g. Online Typist, E-commerce App Reviewer"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-red-600"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="scam-platform" className="font-semibold text-slate-700">
                    Platform Where Contact Occurred
                  </label>
                  <select
                    id="scam-platform"
                    value={scamPlatform}
                    onChange={(e) => setScamPlatform(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-red-600"
                  >
                    <option value="SMS / Text Message">SMS / Text Message</option>
                    <option value="Telegram / WhatsApp / Viber">Telegram / WhatsApp / Viber</option>
                    <option value="Facebook Page / Group">Facebook Page / Messenger</option>
                    <option value="Email / Fake Website">Email / Fake Website</option>
                    <option value="Walk-in Unlicensed Office">Walk-in Unlicensed Office</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="scam-amount" className="font-semibold text-slate-700">
                    Illegal Fee / Task Deposit Requested (PHP)
                  </label>
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
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono text-xs focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="scam-desc" className="font-semibold text-slate-700">
                  Incident Description &amp; Red Flags
                </label>
                <textarea
                  id="scam-desc"
                  rows={3}
                  required
                  value={scamDetails}
                  onChange={(e) => setScamDetails(e.target.value)}
                  placeholder="Describe the scam method, phone numbers or usernames used, and how money was solicited..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-red-700 text-white font-bold text-xs hover:bg-red-800 transition shadow-2xs"
                >
                  Submit Anti-Scam Report
                </button>
              </div>
            </form>
          )}
        </section>
      )}

      {/* Statutory Recruitment Disclosure (Open Civic Text, No Box Card) */}
      <div className="no-print pt-4 text-xs text-slate-500 space-y-1.5 border-t border-slate-200/80">
        <div className="flex items-center gap-1.5 font-bold text-slate-700">
          <Info className="h-4 w-4 text-[#17365D]" aria-hidden="true" />
          <span>Employer &amp; Recruitment Transparency Notice</span>
        </div>
        <p className="leading-relaxed">
          GabayPH publishes verified career portals and official government vacancies. We do not act as an employer or private recruitment agency. Applications must be completed on official employer or <code>.gov.ph</code> portals.
        </p>
      </div>
    </div>
  );
}

export default function TrabahoPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-4 py-8 text-xs text-slate-600">
          Loading Trabaho Careers &amp; Resume Module...
        </div>
      }
    >
      <TrabahoContent />
    </Suspense>
  );
}
