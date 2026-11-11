"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Wallet,
  Calculator,
  PiggyBank,
  TrendingDown,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ExternalLink,
  Search,
  Info,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import {
  VERIFIED_ASSISTANCE_PROGRAMS,
  VERIFIED_RESOURCES,
} from "@/lib/constants/philippine-data";
import { SourceCitationBar } from "@/components/trust/verification-badge";
import { formatCurrencyPHP } from "@/lib/utils";
import { useCitizenState } from "@/components/providers/citizen-state-provider";

const AID_CATEGORIES = [
  { id: "all", label: "All Aid Programs" },
  { id: "medical", label: "Medical & Hospital (AICS / Malasakit)" },
  { id: "livelihood", label: "Emergency Employment (TUPAD)" },
  { id: "calamity", label: "Calamity Loans (SSS / Pag-IBIG)" },
];

function PeraContent() {
  const searchParams = useSearchParams();
  const initialSlug = searchParams.get("item") || "";

  const [programTypeFilter, setProgramTypeFilter] = useState<string>("all");
  const [keyword, setKeyword] = useState<string>("");
  const [selectedSlug, setSelectedSlug] = useState<string>(
    initialSlug || VERIFIED_ASSISTANCE_PROGRAMS[0]?.slug || ""
  );
  const [activeCalcTab, setActiveCalcTab] = useState<
    "budget" | "savings" | "debt"
  >("budget");

  const { toggleBookmark, isBookmarked } = useCitizenState();

  // 1. Budget Calculator State
  const [monthlyIncome, setMonthlyIncome] = useState<number>(25000);
  const [housingCost, setHousingCost] = useState<number>(7500);
  const [foodCost, setFoodCost] = useState<number>(7000);
  const [transportCost, setTransportCost] = useState<number>(2500);
  const [contributionsCost, setContributionsCost] = useState<number>(1800);
  const [familyEducationCost, setFamilyEducationCost] = useState<number>(2000);
  const [debtPaymentCost, setDebtPaymentCost] = useState<number>(1500);

  const totalExpenses =
    housingCost +
    foodCost +
    transportCost +
    contributionsCost +
    familyEducationCost +
    debtPaymentCost;
  const remainingSurplus = monthlyIncome - totalExpenses;
  const recommendedEmergencyFundMin = totalExpenses * 3;
  const recommendedEmergencyFundTarget = totalExpenses * 6;

  // 2. Savings & MP2 Planner State
  const [savingsGoalAmount, setSavingsGoalAmount] = useState<number>(60000);
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(2500);
  const [annualDividendRate, setAnnualDividendRate] = useState<number>(6.5);

  const monthsToGoalSimple =
    monthlyDeposit > 0 ? Math.ceil(savingsGoalAmount / monthlyDeposit) : 0;
  const fiveYearPrincipal = monthlyDeposit * 60;
  const estimatedFiveYearWithYield =
    fiveYearPrincipal * (1 + (annualDividendRate / 100) * 2.6);

  // 3. Debt Repayment Calculator State
  const [totalDebtBalance, setTotalDebtBalance] = useState<number>(30000);
  const [annualInterestRate, setAnnualInterestRate] = useState<number>(12);
  const [monthlyDebtPayment, setMonthlyDebtPayment] = useState<number>(3000);

  const monthlyInterestRate = annualInterestRate / 100 / 12;
  const firstMonthInterest = totalDebtBalance * monthlyInterestRate;
  const isPaymentSufficient = monthlyDebtPayment > firstMonthInterest;
  const estimatedMonthsToPayoff = isPaymentSufficient
    ? Math.ceil(
        -Math.log(
          1 - (totalDebtBalance * monthlyInterestRate) / monthlyDebtPayment
        ) / Math.log(1 + monthlyInterestRate)
      )
    : 0;
  const totalInterestPaid = isPaymentSufficient
    ? Math.max(0, estimatedMonthsToPayoff * monthlyDebtPayment - totalDebtBalance)
    : 0;

  const filteredPrograms = VERIFIED_ASSISTANCE_PROGRAMS.filter((p) => {
    if (programTypeFilter !== "all" && p.programType !== programTypeFilter) {
      return false;
    }
    if (!keyword.trim()) return true;
    const hay = `${p.programName} ${p.organizationName} ${p.description} ${p.benefitSummary}`.toLowerCase();
    return hay.includes(keyword.trim().toLowerCase());
  });

  const activeProgram =
    filteredPrograms.find((p) => p.slug === selectedSlug) ||
    filteredPrograms[0];

  const peraGuides = VERIFIED_RESOURCES.filter((r) => r.module === "pera");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10 space-y-8 sm:space-y-10">
      {/* Header & Page Title (Cardless Editorial Style) */}
      <div className="space-y-2 border-b border-slate-200 pb-5">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-emerald-800">
          <Wallet className="h-4 w-4 text-emerald-700" aria-hidden="true" />
          <span>Module C · Pera at Ayuda</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Financial &amp; Medical Assistance Directory + Planning Tools
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
          Verified statutory guidelines for DSWD AICS, Malasakit Centers, DOLE TUPAD emergency wages, and SSS/Pag-IBIG calamity loans, paired with private client-side calculators.
        </p>
      </div>

      {/* Part 1: Financial & Medical Assistance Directory */}
      <section aria-labelledby="aid-directory-heading" className="space-y-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2
                id="aid-directory-heading"
                className="text-base sm:text-lg font-bold text-slate-900"
              >
                1. Verified Government Financial &amp; Medical Assistance
              </h2>
              <p className="text-xs text-slate-500">
                Official criteria, required supporting documents, and social worker evaluation steps.
              </p>
            </div>
          </div>

          {/* Search Bar (Clean inline, no boxed container) */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search AICS, Malasakit hospital subsidy, TUPAD, funeral aid, calamity loans..."
              aria-label="Search financial assistance programs"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#17365D] focus:ring-1 focus:ring-[#17365D] transition"
            />
          </div>

          {/* Category Tabs (Civic Underline Tabs) */}
          <div className="no-scrollbar flex gap-4 overflow-x-auto whitespace-nowrap border-b border-slate-200 pt-1 text-xs font-semibold text-slate-500">
            {AID_CATEGORIES.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setProgramTypeFilter(tab.id)}
                className={`pb-2.5 transition ${
                  programTypeFilter === tab.id
                    ? "border-b-2 border-[#17365D] font-bold text-[#17365D]"
                    : "hover:text-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Programs List & Detail View */}
        {filteredPrograms.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No verified assistance program matches your current filter.
          </div>
        ) : (
          <div className="space-y-6">
            {/* Program Selector Bar (Clean horizontal scroll or direct click) */}
            <div className="no-scrollbar flex gap-2 overflow-x-auto whitespace-nowrap pb-1 text-xs">
              {filteredPrograms.map((prog) => {
                const isSelected = activeProgram?.slug === prog.slug;
                return (
                  <button
                    key={prog.id}
                    type="button"
                    onClick={() => setSelectedSlug(prog.slug)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                      isSelected
                        ? "border-[#17365D] bg-[#17365D] text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <span className="capitalize">{prog.organizationName.split(" ")[0]}</span> · {prog.programName}
                  </button>
                );
              })}
            </div>

            {/* Active Program Cardless Detail View */}
            {activeProgram && (
              <div className="space-y-5 border-y border-slate-200 py-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-emerald-800">
                        {activeProgram.organizationName}
                      </span>
                      <span className="text-[11px] text-slate-400 capitalize">
                        {activeProgram.programType} Program · {activeProgram.regionName}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                      {activeProgram.programName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        toggleBookmark({
                          targetType: "assistance_program",
                          targetId: activeProgram.id,
                          targetSlug: activeProgram.slug,
                          targetTitle: activeProgram.programName,
                          targetModule: "pera",
                          href: `/pera/${activeProgram.slug}`,
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition"
                    >
                      {isBookmarked(activeProgram.id) ? (
                        <>
                          <BookmarkCheck className="h-3.5 w-3.5 text-emerald-700" />
                          <span>Saved</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="h-3.5 w-3.5" />
                          <span>Save Program</span>
                        </>
                      )}
                    </button>
                    <Link
                      href={`/pera/${activeProgram.slug}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#17365D] text-white text-xs font-semibold hover:bg-[#102847] shadow-2xs transition"
                    >
                      <span>Standalone Guide</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Benefit Highlight Row (Editorial text, no heavy card) */}
                <div className="border-l-2 border-emerald-600 pl-3 py-1 text-xs text-slate-700 bg-emerald-50/40 rounded-r">
                  <span className="font-bold text-slate-900">Benefit Coverage:</span>{" "}
                  {activeProgram.benefitSummary}
                </div>

                <p className="text-xs leading-relaxed text-slate-600">
                  {activeProgram.description}
                </p>

                {/* Eligibility & Requirements Editorial Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 text-xs">
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-1">
                      Eligibility Criteria
                    </h4>
                    <ul className="space-y-2 text-slate-600">
                      {activeProgram.eligibilityCriteria.map((el, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700" />
                          <span className="leading-snug">{el}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-1">
                      Required Supporting Documents
                    </h4>
                    <ul className="space-y-2 text-slate-600">
                      {activeProgram.requiredDocuments.map((doc, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#17365D]" />
                          <span className="leading-snug">{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Step-by-Step Procedure */}
                <div className="space-y-2 pt-2 text-xs">
                  <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-1">
                    How to Apply (Official Step-by-Step Procedure)
                  </h4>
                  <ol className="space-y-2 text-slate-600 pt-1">
                    {activeProgram.howToApply.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-snug pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <SourceCitationBar
                  sourceName={activeProgram.sourceName}
                  sourceUrl={activeProgram.sourceUrl}
                  regionName={activeProgram.regionName}
                  lastVerifiedAt={activeProgram.lastVerifiedAt}
                  verificationStatus={activeProgram.verificationStatus}
                  targetId={activeProgram.id}
                  targetTitle={activeProgram.programName}
                  targetType="assistance_program"
                />
              </div>
            )}
          </div>
        )}
      </section>

      {/* Part 2: Interactive Financial Calculators (Cardless) */}
      <section id="calculators" aria-labelledby="calculators-heading" className="space-y-4 pt-2">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
            <div>
              <h2
                id="calculators-heading"
                className="text-base sm:text-lg font-bold text-slate-900"
              >
                2. Household Budget, MP2 Savings &amp; Debt Calculators
              </h2>
              <p className="text-xs text-slate-500">
                Calculations execute entirely client-side in your browser. No financial data is uploaded to servers.
              </p>
            </div>
            <span className="text-[11px] font-mono text-emerald-700 font-bold">100% Client-Side</span>
          </div>

          {/* Calculator Tabs (Civic Underline Tabs) */}
          <div className="no-scrollbar flex gap-4 overflow-x-auto whitespace-nowrap text-xs font-semibold text-slate-500 border-b border-slate-100">
            <button
              type="button"
              onClick={() => setActiveCalcTab("budget")}
              className={`pb-2.5 flex items-center gap-1.5 transition ${
                activeCalcTab === "budget"
                  ? "border-b-2 border-[#17365D] font-bold text-[#17365D]"
                  : "hover:text-slate-800"
              }`}
            >
              <Calculator className="h-3.5 w-3.5" />
              <span>Budget Calculator</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCalcTab("savings")}
              className={`pb-2.5 flex items-center gap-1.5 transition ${
                activeCalcTab === "savings"
                  ? "border-b-2 border-[#17365D] font-bold text-[#17365D]"
                  : "hover:text-slate-800"
              }`}
            >
              <PiggyBank className="h-3.5 w-3.5" />
              <span>Savings &amp; MP2 Planner</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCalcTab("debt")}
              className={`pb-2.5 flex items-center gap-1.5 transition ${
                activeCalcTab === "debt"
                  ? "border-b-2 border-[#17365D] font-bold text-[#17365D]"
                  : "hover:text-slate-800"
              }`}
            >
              <TrendingDown className="h-3.5 w-3.5" />
              <span>Debt Repayment Schedule</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Budget Calculator */}
        {activeCalcTab === "budget" && (
          <div className="space-y-5 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="sm:col-span-2 lg:col-span-3 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <label htmlFor="calc-income" className="font-bold text-slate-800">
                    Monthly Take-Home Income (PHP)
                  </label>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <span>Presets:</span>
                    <button
                      type="button"
                      onClick={() => setMonthlyIncome(15000)}
                      className="px-2 py-0.5 rounded border border-slate-200 bg-white hover:bg-slate-50"
                    >
                      ₱15K (Min Wage)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMonthlyIncome(25000)}
                      className="px-2 py-0.5 rounded border border-slate-200 bg-white hover:bg-slate-50"
                    >
                      ₱25K (Avg)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMonthlyIncome(45000)}
                      className="px-2 py-0.5 rounded border border-slate-200 bg-white hover:bg-slate-50"
                    >
                      ₱45K (Family)
                    </button>
                  </div>
                </div>
                <input
                  id="calc-income"
                  type="number"
                  min={0}
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono text-sm font-bold text-slate-900 focus:outline-none focus:border-[#17365D]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="calc-housing" className="font-semibold text-slate-700">
                  Housing, Electricity &amp; Water (PHP)
                </label>
                <input
                  id="calc-housing"
                  type="number"
                  min={0}
                  value={housingCost}
                  onChange={(e) => setHousingCost(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono text-xs focus:outline-none focus:border-[#17365D]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="calc-food" className="font-semibold text-slate-700">
                  Food, Rice &amp; Groceries (PHP)
                </label>
                <input
                  id="calc-food"
                  type="number"
                  min={0}
                  value={foodCost}
                  onChange={(e) => setFoodCost(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono text-xs focus:outline-none focus:border-[#17365D]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="calc-transport" className="font-semibold text-slate-700">
                  Transportation &amp; Data (PHP)
                </label>
                <input
                  id="calc-transport"
                  type="number"
                  min={0}
                  value={transportCost}
                  onChange={(e) => setTransportCost(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono text-xs focus:outline-none focus:border-[#17365D]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="calc-contrib" className="font-semibold text-slate-700">
                  SSS / PhilHealth / Pag-IBIG (PHP)
                </label>
                <input
                  id="calc-contrib"
                  type="number"
                  min={0}
                  value={contributionsCost}
                  onChange={(e) => setContributionsCost(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono text-xs focus:outline-none focus:border-[#17365D]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="calc-edu" className="font-semibold text-slate-700">
                  Tuition &amp; Family Support (PHP)
                </label>
                <input
                  id="calc-edu"
                  type="number"
                  min={0}
                  value={familyEducationCost}
                  onChange={(e) => setFamilyEducationCost(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono text-xs focus:outline-none focus:border-[#17365D]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="calc-debt-item" className="font-semibold text-slate-700">
                  Monthly Loan Repayments (PHP)
                </label>
                <input
                  id="calc-debt-item"
                  type="number"
                  min={0}
                  value={debtPaymentCost}
                  onChange={(e) => setDebtPaymentCost(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono text-xs focus:outline-none focus:border-[#17365D]"
                />
              </div>
            </div>

            {/* Budget Summary Result (Editorial Strip) */}
            <div className="py-4 border-y border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block">Total Monthly Expenses</span>
                <span className="font-mono text-base font-bold text-slate-900">
                  {formatCurrencyPHP(totalExpenses)}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 block">Net Surplus / (Deficit)</span>
                <span
                  className={`font-mono text-lg font-black ${
                    remainingSurplus >= 0 ? "text-emerald-700" : "text-red-700"
                  }`}
                >
                  {formatCurrencyPHP(remainingSurplus)}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 block">Recommended Emergency Fund (3–6 Mos)</span>
                <span className="font-mono text-sm font-bold text-[#17365D]">
                  {formatCurrencyPHP(recommendedEmergencyFundMin)} – {formatCurrencyPHP(recommendedEmergencyFundTarget)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Savings & MP2 Planner */}
        {activeCalcTab === "savings" && (
          <div className="space-y-5 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <label htmlFor="sav-goal" className="font-semibold text-slate-700">
                  Savings Goal (PHP)
                </label>
                <input
                  id="sav-goal"
                  type="number"
                  min={500}
                  value={savingsGoalAmount}
                  onChange={(e) => setSavingsGoalAmount(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono text-xs focus:outline-none focus:border-[#17365D]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="sav-monthly" className="font-semibold text-slate-700">
                  Planned Monthly Deposit (PHP)
                </label>
                <input
                  id="sav-monthly"
                  type="number"
                  min={100}
                  value={monthlyDeposit}
                  onChange={(e) => setMonthlyDeposit(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono text-xs focus:outline-none focus:border-[#17365D]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="sav-rate" className="font-semibold text-slate-700">
                  Est. Annual Dividend (% p.a.)
                </label>
                <input
                  id="sav-rate"
                  type="number"
                  step="0.1"
                  min={0}
                  max={20}
                  value={annualDividendRate}
                  onChange={(e) => setAnnualDividendRate(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono text-xs focus:outline-none focus:border-[#17365D]"
                />
              </div>
            </div>

            {/* Savings Projection Strip */}
            <div className="py-4 border-y border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block">Time to Reach Target Goal</span>
                <span className="font-mono text-base font-bold text-[#17365D]">
                  {monthsToGoalSimple} months (~{(monthsToGoalSimple / 12).toFixed(1)} yrs)
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 block">5-Yr Total Principal (60 mos)</span>
                <span className="font-mono text-base font-semibold text-slate-800">
                  {formatCurrencyPHP(fiveYearPrincipal)}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 block">Est. 5-Yr Maturity Value ({annualDividendRate}% p.a.)</span>
                <span className="font-mono text-lg font-black text-emerald-700">
                  {formatCurrencyPHP(estimatedFiveYearWithYield)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Debt Repayment Calculator */}
        {activeCalcTab === "debt" && (
          <div className="space-y-5 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <label htmlFor="debt-bal" className="font-semibold text-slate-700">
                  Total Outstanding Balance (PHP)
                </label>
                <input
                  id="debt-bal"
                  type="number"
                  min={0}
                  value={totalDebtBalance}
                  onChange={(e) => setTotalDebtBalance(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono text-xs focus:outline-none focus:border-[#17365D]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="debt-rate" className="font-semibold text-slate-700">
                  Annual Interest Rate (% p.a.)
                </label>
                <input
                  id="debt-rate"
                  type="number"
                  step="0.5"
                  min={0}
                  max={100}
                  value={annualInterestRate}
                  onChange={(e) => setAnnualInterestRate(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono text-xs focus:outline-none focus:border-[#17365D]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="debt-pay" className="font-semibold text-slate-700">
                  Planned Monthly Repayment (PHP)
                </label>
                <input
                  id="debt-pay"
                  type="number"
                  min={100}
                  value={monthlyDebtPayment}
                  onChange={(e) => setMonthlyDebtPayment(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono text-xs focus:outline-none focus:border-[#17365D]"
                />
              </div>
            </div>

            {/* Debt Schedule Strip */}
            <div className="py-4 border-y border-slate-200 text-xs">
              {!isPaymentSufficient ? (
                <div className="text-red-700">
                  Your monthly payment ({formatCurrencyPHP(monthlyDebtPayment)}) is lower than the monthly interest charge ({formatCurrencyPHP(firstMonthInterest)}). Increase your monthly payment above {formatCurrencyPHP(firstMonthInterest + 100)} to amortize the debt.
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Est. Time to Debt-Free</span>
                    <span className="font-mono text-base font-bold text-[#17365D]">
                      {estimatedMonthsToPayoff} months (~{(estimatedMonthsToPayoff / 12).toFixed(1)} yrs)
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-500 block">Total Est. Interest Cost</span>
                    <span className="font-mono text-base font-semibold text-amber-800">
                      {formatCurrencyPHP(totalInterestPaid)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-500 block">Total Amount Repaid</span>
                    <span className="font-mono text-base font-bold text-slate-900">
                      {formatCurrencyPHP(totalDebtBalance + totalInterestPaid)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Part 3: Government Savings & Literacy Guides */}
      <section aria-labelledby="financial-ed-heading" className="space-y-3 pt-2">
        <h2 id="financial-ed-heading" className="text-sm sm:text-base font-bold text-slate-900 border-b border-slate-200 pb-2">
          3. Verified Government Savings &amp; Financial Literacy Guides
        </h2>
        <div className="divide-y divide-slate-100 border-y border-slate-200 text-xs">
          {peraGuides.map((guide) => (
            <div key={guide.id} className="py-3.5 space-y-1">
              <h3 className="font-bold text-slate-900">{guide.title}</h3>
              <p className="text-slate-600">{guide.summary}</p>
              <SourceCitationBar
                sourceName={guide.sourceName}
                sourceUrl={guide.sourceUrl}
                regionName={guide.regionName}
                lastVerifiedAt={guide.lastVerifiedAt}
                verificationStatus={guide.verificationStatus}
                targetId={guide.id}
                targetTitle={guide.title}
                targetType="resource"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Statutory Advice & Scope Disclaimer (Open Civic Text, No Box Card) */}
      <div className="pt-4 text-xs text-slate-500 space-y-1.5 border-t border-slate-200/80">
        <div className="flex items-center gap-1.5 font-bold text-slate-700">
          <Info className="h-4 w-4 text-emerald-800" aria-hidden="true" />
          <span>Financial Advice &amp; Disbursement Scope Notice</span>
        </div>
        <p className="leading-relaxed">
          Information and calculators on GabayPH are published for public civic education and do not constitute licensed financial or investment advice. GabayPH does not disburse funds or guarantee assistance approval. Qualification and grant releases are decided solely by authorized social workers from DSWD, DOH, DOLE, SSS, or Pag-IBIG Fund.
        </p>
      </div>
    </div>
  );
}

export default function PeraPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-4 py-8 text-xs text-slate-600">
          Loading Financial Assistance &amp; Calculators...
        </div>
      }
    >
      <PeraContent />
    </Suspense>
  );
}
