"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Wallet,
  Calculator,
  PiggyBank,
  TrendingDown,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
} from "lucide-react";
import {
  VERIFIED_ASSISTANCE_PROGRAMS,
  VERIFIED_RESOURCES,
} from "@/lib/constants/philippine-data";
import { SourceCitationBar } from "@/components/trust/verification-badge";
import { formatCurrencyPHP } from "@/lib/utils";
import { useCitizenState } from "@/components/providers/citizen-state-provider";

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
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6">
      {/* Header */}
      <div className="mb-6 border-b border-slate-200 pb-4">
        <div className="inline-flex items-center gap-1.5 rounded bg-emerald-100 px-2.5 py-0.5 text-xs font-bold uppercase text-emerald-900">
          <Wallet className="h-3.5 w-3.5 text-emerald-800" aria-hidden="true" />
          <span>Module C · Pera</span>
        </div>
        <h1 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Financial & Medical Assistance Directory + Household Financial Calculators
        </h1>
        <p className="mt-1 text-xs text-slate-600">
          Verified eligibility guides for DSWD AICS, Malasakit Centers, DOLE TUPAD, and SSS/Pag-IBIG calamity loans, paired with practical budget, savings, and debt repayment calculators.
        </p>
        <div className="mt-3 rounded border border-amber-200 bg-amber-50/80 px-3 py-2 text-[11px] text-amber-950">
          <strong>Financial & Eligibility Disclosure:</strong> Information and calculators on GabayPH are for educational reference only and do <strong>not</strong> constitute licensed financial advice. GabayPH does not process applications, disburse funds, or guarantee assistance approval. Assessment and benefit release are determined solely by DSWD, DOH Malasakit Centers, DOLE, SSS, or Pag-IBIG Fund.
        </div>
      </div>

      {/* Part 1: Financial Assistance Directory */}
      <section aria-labelledby="aid-directory-heading" className="mb-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2
            id="aid-directory-heading"
            className="text-base font-bold text-slate-900"
          >
            1. Verified Government Financial & Medical Assistance Directory
          </h2>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <input
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search AICS, Malasakit, TUPAD..."
              aria-label="Search financial assistance programs"
              className="rounded border border-slate-300 bg-white px-2.5 py-1 text-xs"
            />
            {[
              { id: "all", label: "All Aid Programs" },
              { id: "medical", label: "Medical & Hospital (AICS / Malasakit)" },
              { id: "livelihood", label: "Emergency Employment (TUPAD)" },
              { id: "calamity", label: "Calamity Loans (SSS / Pag-IBIG)" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setProgramTypeFilter(tab.id)}
                className={`rounded border px-2.5 py-1 font-medium ${
                  programTypeFilter === tab.id
                    ? "border-[#17365D] bg-[#17365D] text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white lg:col-span-4">
            {filteredPrograms.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-600">
                No verified assistance program matches your search.
              </div>
            ) : (
              filteredPrograms.map((prog) => {
                const isSelected = activeProgram?.slug === prog.slug;
                return (
                  <button
                    key={prog.id}
                    type="button"
                    onClick={() => setSelectedSlug(prog.slug)}
                    className={`w-full p-3.5 text-left ${
                      isSelected
                        ? "border-l-4 border-l-[#17365D] bg-blue-50/80"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-900">
                      {prog.programType}
                    </span>
                    <h3 className="mt-1.5 text-xs font-bold text-slate-900">
                      {prog.programName}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-[11px] text-slate-600">
                      {prog.benefitSummary}
                    </p>
                  </button>
                );
              })
            )}
          </div>

          <div className="lg:col-span-8">
            {activeProgram && (
              <article className="rounded-md border border-slate-200 bg-white p-4 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-xs font-semibold text-slate-500">
                      {activeProgram.organizationName}
                    </span>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">
                      {activeProgram.programName}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`/pera/${activeProgram.slug}`}
                      className="inline-flex items-center gap-1 rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-[#17365D] hover:bg-slate-50"
                    >
                      <span>Standalone Program Page →</span>
                    </a>
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
                      className="inline-flex items-center gap-1.5 rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50"
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
                  </div>
                </div>

                <div className="mt-3 rounded border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-950">
                  <strong>Benefit Coverage:</strong>{" "}
                  {activeProgram.benefitSummary}
                </div>

                <p className="mt-3 text-xs leading-relaxed text-slate-700">
                  {activeProgram.description}
                </p>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded border border-slate-200 bg-slate-50 p-3 text-xs">
                    <h4 className="font-bold text-slate-900">
                      Eligibility Criteria
                    </h4>
                    <ul className="mt-2 space-y-1.5 text-slate-700">
                      {activeProgram.eligibilityCriteria.map((el, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700" />
                          <span>{el}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded border border-slate-200 bg-slate-50 p-3 text-xs">
                    <h4 className="font-bold text-slate-900">
                      Required Documents
                    </h4>
                    <ul className="mt-2 space-y-1.5 text-slate-700">
                      {activeProgram.requiredDocuments.map((doc, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#17365D]" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 text-xs">
                  <h4 className="font-bold text-slate-900">
                    How to Apply (Official Step-by-Step)
                  </h4>
                  <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-slate-700">
                    {activeProgram.howToApply.map((step, idx) => (
                      <li key={idx}>{step}</li>
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
              </article>
            )}
          </div>
        </div>
      </section>

      {/* Part 2: Interactive Financial Calculators */}
      <section
        id="calculators"
        aria-labelledby="calculators-heading"
        className="mb-10 rounded-md border border-slate-200 bg-white p-4 sm:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h2
              id="calculators-heading"
              className="text-base font-bold text-slate-900"
            >
              2. Interactive Household Budget, Savings & Debt Calculators
            </h2>
            <p className="text-xs text-slate-600">
              All numbers are calculated locally on your device and never stored on external servers.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 text-xs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeCalcTab === "budget"}
              onClick={() => setActiveCalcTab("budget")}
              className={`inline-flex items-center gap-1.5 rounded border px-3 py-1.5 font-semibold ${
                activeCalcTab === "budget"
                  ? "border-[#17365D] bg-[#17365D] text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Calculator className="h-3.5 w-3.5" />
              <span>Budget Calculator</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeCalcTab === "savings"}
              onClick={() => setActiveCalcTab("savings")}
              className={`inline-flex items-center gap-1.5 rounded border px-3 py-1.5 font-semibold ${
                activeCalcTab === "savings"
                  ? "border-[#17365D] bg-[#17365D] text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <PiggyBank className="h-3.5 w-3.5" />
              <span>Savings & MP2 Planner</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeCalcTab === "debt"}
              onClick={() => setActiveCalcTab("debt")}
              className={`inline-flex items-center gap-1.5 rounded border px-3 py-1.5 font-semibold ${
                activeCalcTab === "debt"
                  ? "border-[#17365D] bg-[#17365D] text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <TrendingDown className="h-3.5 w-3.5" />
              <span>Debt Repayment Calculator</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Budget Calculator */}
        {activeCalcTab === "budget" && (
          <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 lg:col-span-7">
              <div className="sm:col-span-2">
                <label
                  htmlFor="calc-income"
                  className="block font-semibold text-slate-800"
                >
                  Monthly Household Take-Home Income (PHP)
                </label>
                <input
                  id="calc-income"
                  type="number"
                  min={0}
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value) || 0)}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900"
                />
              </div>

              <div>
                <label
                  htmlFor="calc-housing"
                  className="block font-medium text-slate-700"
                >
                  Rent / Housing, Electricity & Water (PHP)
                </label>
                <input
                  id="calc-housing"
                  type="number"
                  min={0}
                  value={housingCost}
                  onChange={(e) => setHousingCost(Number(e.target.value) || 0)}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-1.5 font-mono text-xs"
                />
              </div>

              <div>
                <label
                  htmlFor="calc-food"
                  className="block font-medium text-slate-700"
                >
                  Food, Rice & Groceries (PHP)
                </label>
                <input
                  id="calc-food"
                  type="number"
                  min={0}
                  value={foodCost}
                  onChange={(e) => setFoodCost(Number(e.target.value) || 0)}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-1.5 font-mono text-xs"
                />
              </div>

              <div>
                <label
                  htmlFor="calc-transport"
                  className="block font-medium text-slate-700"
                >
                  Commute / Transportation & Load (PHP)
                </label>
                <input
                  id="calc-transport"
                  type="number"
                  min={0}
                  value={transportCost}
                  onChange={(e) => setTransportCost(Number(e.target.value) || 0)}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-1.5 font-mono text-xs"
                />
              </div>

              <div>
                <label
                  htmlFor="calc-contrib"
                  className="block font-medium text-slate-700"
                >
                  SSS, PhilHealth, Pag-IBIG & Healthcare (PHP)
                </label>
                <input
                  id="calc-contrib"
                  type="number"
                  min={0}
                  value={contributionsCost}
                  onChange={(e) =>
                    setContributionsCost(Number(e.target.value) || 0)
                  }
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-1.5 font-mono text-xs"
                />
              </div>

              <div>
                <label
                  htmlFor="calc-edu"
                  className="block font-medium text-slate-700"
                >
                  Schooling & Family Support (PHP)
                </label>
                <input
                  id="calc-edu"
                  type="number"
                  min={0}
                  value={familyEducationCost}
                  onChange={(e) =>
                    setFamilyEducationCost(Number(e.target.value) || 0)
                  }
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-1.5 font-mono text-xs"
                />
              </div>

              <div>
                <label
                  htmlFor="calc-debt-item"
                  className="block font-medium text-slate-700"
                >
                  Monthly Loan / Debt Amortizations (PHP)
                </label>
                <input
                  id="calc-debt-item"
                  type="number"
                  min={0}
                  value={debtPaymentCost}
                  onChange={(e) =>
                    setDebtPaymentCost(Number(e.target.value) || 0)
                  }
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-1.5 font-mono text-xs"
                />
              </div>
            </div>

            <div className="rounded border border-slate-200 bg-slate-50 p-4 text-xs lg:col-span-5">
              <h3 className="font-bold uppercase tracking-wider text-slate-800">
                Monthly Budget Summary
              </h3>
              <dl className="mt-3 space-y-2 border-b border-slate-200 pb-3">
                <div className="flex justify-between">
                  <dt className="text-slate-600">Net Monthly Income:</dt>
                  <dd className="font-mono font-semibold text-slate-900">
                    {formatCurrencyPHP(monthlyIncome)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">Total Monthly Expenses:</dt>
                  <dd className="font-mono font-semibold text-slate-900">
                    {formatCurrencyPHP(totalExpenses)}
                  </dd>
                </div>
                <div className="flex justify-between pt-1 text-sm">
                  <dt className="font-bold text-slate-900">
                    Monthly Surplus / (Deficit):
                  </dt>
                  <dd
                    className={`font-mono font-bold ${
                      remainingSurplus >= 0 ? "text-emerald-700" : "text-red-700"
                    }`}
                  >
                    {formatCurrencyPHP(remainingSurplus)}
                  </dd>
                </div>
              </dl>

              <div className="mt-3 space-y-1.5 text-slate-700">
                <p>
                  <strong>Recommended Emergency Fund (3–6 months):</strong>{" "}
                  <span className="font-mono font-semibold text-slate-900">
                    {formatCurrencyPHP(recommendedEmergencyFundMin)} –{" "}
                    {formatCurrencyPHP(recommendedEmergencyFundTarget)}
                  </span>
                </p>
                <p className="text-[11px] text-slate-600">
                  Tip: Keep at least 1 month of essential expenses in liquid cash/bank account and build the rest via Pag-IBIG Regular/MP2 or high-yield PDIC-insured bank accounts.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Savings & MP2 Planner */}
        {activeCalcTab === "savings" && (
          <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-3 text-xs lg:col-span-6">
              <div>
                <label
                  htmlFor="sav-goal"
                  className="block font-semibold text-slate-800"
                >
                  Target Emergency or Tuition Savings Goal (PHP)
                </label>
                <input
                  id="sav-goal"
                  type="number"
                  min={500}
                  value={savingsGoalAmount}
                  onChange={(e) =>
                    setSavingsGoalAmount(Number(e.target.value) || 0)
                  }
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-mono text-xs"
                />
              </div>

              <div>
                <label
                  htmlFor="sav-monthly"
                  className="block font-semibold text-slate-800"
                >
                  Planned Monthly Savings Deposit (PHP — Min PHP 500 for Pag-IBIG MP2)
                </label>
                <input
                  id="sav-monthly"
                  type="number"
                  min={100}
                  value={monthlyDeposit}
                  onChange={(e) =>
                    setMonthlyDeposit(Number(e.target.value) || 0)
                  }
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-mono text-xs"
                />
              </div>

              <div>
                <label
                  htmlFor="sav-rate"
                  className="block font-semibold text-slate-800"
                >
                  Estimated Annual Dividend / Interest Rate (% p.a.)
                </label>
                <input
                  id="sav-rate"
                  type="number"
                  step="0.1"
                  min={0}
                  max={20}
                  value={annualDividendRate}
                  onChange={(e) =>
                    setAnnualDividendRate(Number(e.target.value) || 0)
                  }
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-mono text-xs"
                />
              </div>
            </div>

            <div className="rounded border border-slate-200 bg-slate-50 p-4 text-xs lg:col-span-6">
              <h3 className="font-bold uppercase tracking-wider text-slate-800">
                Savings Projection
              </h3>
              <dl className="mt-3 space-y-2.5">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <dt className="text-slate-600">Time to Reach Target Goal:</dt>
                  <dd className="font-mono font-bold text-[#17365D]">
                    {monthsToGoalSimple} months (~
                    {(monthsToGoalSimple / 12).toFixed(1)} years)
                  </dd>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <dt className="text-slate-600">
                    5-Year Total Principal Contributed (60 mos):
                  </dt>
                  <dd className="font-mono font-semibold text-slate-900">
                    {formatCurrencyPHP(fiveYearPrincipal)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-semibold text-slate-800">
                    Est. 5-Year Maturity Value (at {annualDividendRate}% p.a.):
                  </dt>
                  <dd className="font-mono text-sm font-bold text-emerald-700">
                    {formatCurrencyPHP(estimatedFiveYearWithYield)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {/* Tab 3: Debt Repayment Calculator */}
        {activeCalcTab === "debt" && (
          <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-3 text-xs lg:col-span-6">
              <div>
                <label
                  htmlFor="debt-bal"
                  className="block font-semibold text-slate-800"
                >
                  Total Outstanding Loan / Credit Balance (PHP)
                </label>
                <input
                  id="debt-bal"
                  type="number"
                  min={0}
                  value={totalDebtBalance}
                  onChange={(e) =>
                    setTotalDebtBalance(Number(e.target.value) || 0)
                  }
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-mono text-xs"
                />
              </div>

              <div>
                <label
                  htmlFor="debt-rate"
                  className="block font-semibold text-slate-800"
                >
                  Annual Interest Rate (% per year)
                </label>
                <input
                  id="debt-rate"
                  type="number"
                  step="0.5"
                  min={0}
                  max={100}
                  value={annualInterestRate}
                  onChange={(e) =>
                    setAnnualInterestRate(Number(e.target.value) || 0)
                  }
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-mono text-xs"
                />
              </div>

              <div>
                <label
                  htmlFor="debt-pay"
                  className="block font-semibold text-slate-800"
                >
                  Planned Monthly Repayment Amount (PHP)
                </label>
                <input
                  id="debt-pay"
                  type="number"
                  min={100}
                  value={monthlyDebtPayment}
                  onChange={(e) =>
                    setMonthlyDebtPayment(Number(e.target.value) || 0)
                  }
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-mono text-xs"
                />
              </div>
            </div>

            <div className="rounded border border-slate-200 bg-slate-50 p-4 text-xs lg:col-span-6">
              <h3 className="font-bold uppercase tracking-wider text-slate-800">
                Debt Payoff Schedule
              </h3>
              {!isPaymentSufficient ? (
                <p className="mt-3 rounded border border-red-200 bg-red-50 p-3 text-red-900">
                  Your monthly payment ({formatCurrencyPHP(monthlyDebtPayment)}) is lower than the monthly interest charge (
                  {formatCurrencyPHP(firstMonthInterest)}). Increase your monthly payment above {formatCurrencyPHP(firstMonthInterest + 100)} to reduce the principal.
                </p>
              ) : (
                <dl className="mt-3 space-y-2.5">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <dt className="text-slate-600">Estimated Months to Debt-Free:</dt>
                    <dd className="font-mono font-bold text-[#17365D]">
                      {estimatedMonthsToPayoff} months
                    </dd>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <dt className="text-slate-600">Total Estimated Interest Cost:</dt>
                    <dd className="font-mono font-semibold text-amber-800">
                      {formatCurrencyPHP(totalInterestPaid)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-semibold text-slate-800">
                      Total Amount Repaid (Principal + Interest):
                    </dt>
                    <dd className="font-mono font-bold text-slate-900">
                      {formatCurrencyPHP(totalDebtBalance + totalInterestPaid)}
                    </dd>
                  </div>
                </dl>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Part 3: Financial Literacy & Pag-IBIG MP2 Guide */}
      <section aria-labelledby="financial-ed-heading">
        <h2
          id="financial-ed-heading"
          className="mb-3 text-base font-bold text-slate-900"
        >
          3. Verified Government Savings & Financial Literacy Guides
        </h2>
        <div className="space-y-4">
          {peraGuides.map((guide) => (
            <div
              key={guide.id}
              className="rounded-md border border-slate-200 bg-white p-4"
            >
              <h3 className="text-sm font-bold text-slate-900">{guide.title}</h3>
              <p className="mt-1 text-xs text-slate-600">{guide.summary}</p>
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
    </div>
  );
}

export default function PeraPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8 text-xs text-slate-600">
          Loading Pera Financial Assistance & Calculators...
        </div>
      }
    >
      <PeraContent />
    </Suspense>
  );
}
