"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Bot,
  Send,
  Square,
  Trash2,
  RotateCcw,
  MapPin,
  ShieldCheck,
  ExternalLink,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Clock,
  Info,
  Lock,
} from "lucide-react";
import { PH_LOCATIONS } from "@/lib/constants/philippine-data";
import {
  SUGGESTED_STARTING_QUESTIONS,
  type GroundedCitation,
} from "@/lib/ai/retrieval";
import { useCitizenState } from "@/components/providers/citizen-state-provider";
import { useThemeAndToast } from "@/components/providers/theme-provider";
import { StatusIndicator } from "@/components/ui/design-system";
import { CopyButton } from "@/components/ui/copy-button";
import type { ModuleType } from "@/types/database";

export interface AssistantChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  displayedContent?: string;
  isStreaming?: boolean;
  disclaimer?: string;
  providerUsed?: string;
  modelUsed?: string;
  isEmergencyResponse?: boolean;
  isBlockedInjectionOrAbuse?: boolean;
  hasConflictWarning?: boolean;
  conflictExplanation?: string;
  hasUnverifiedOrStaleWarning?: boolean;
  sources?: GroundedCitation[];
  createdAt: string;
}

const STORAGE_KEY_AUTH_HISTORY = "gabayph_ai_auth_chat_v1";

export function GabayAiAssistantView() {
  const { user } = useCitizenState();
  const { showToast } = useThemeAndToast();

  const [messages, setMessages] = useState<AssistantChatMessage[]>([]);
  const [questionInput, setQuestionInput] = useState("");
  const [languageMode, setLanguageMode] = useState<"auto" | "fil" | "en">(
    "auto"
  );
  const [moduleFilter, setModuleFilter] = useState<ModuleType | "all">("all");

  // Optional Location-Aware Filter State (Never requires street address)
  const [regionCode, setRegionCode] = useState<string>(
    user?.regionCode || "ALL"
  );
  const [province, setProvince] = useState<string>("");
  const [cityMunicipality, setCityMunicipality] = useState<string>("");
  const [barangay, setBarangay] = useState<string>("");
  const [showLocationPanel, setShowLocationPanel] = useState<boolean>(false);

  // Request & Streaming State
  const [isLoading, setIsLoading] = useState(false);
  const [isStreamingText, setIsStreamingText] = useState(false);
  const [errorState, setErrorState] = useState<{
    message: string;
    lastQuestion: string;
  } | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const streamIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load saved conversation history ONLY for authenticated users
  useEffect(() => {
    if (!user) return;
    try {
      const raw = window.localStorage.getItem(
        `${STORAGE_KEY_AUTH_HISTORY}:${user.id}`
      );
      if (raw) {
        const parsed = JSON.parse(raw) as AssistantChatMessage[];
        if (Array.isArray(parsed)) {
          setMessages(parsed);
        }
      }
    } catch {
      // ignore storage parse error
    }
  }, [user]);

  // Persist conversation history ONLY for authenticated users
  useEffect(() => {
    if (!user) return;
    try {
      window.localStorage.setItem(
        `${STORAGE_KEY_AUTH_HISTORY}:${user.id}`,
        JSON.stringify(
          messages.map((m) => ({
            ...m,
            displayedContent: m.content,
            isStreaming: false,
          }))
        )
      );
    } catch {
      // ignore storage quota errors
    }
  }, [messages, user]);

  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
    setIsLoading(false);
    setIsStreamingText(false);
    setMessages((prev) =>
      prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m))
    );
    showToast({
      title: "Response generation stopped",
      variant: "info",
    });
  };

  const clearConversation = () => {
    stopGeneration();
    setMessages([]);
    setErrorState(null);
    if (user) {
      try {
        window.localStorage.removeItem(
          `${STORAGE_KEY_AUTH_HISTORY}:${user.id}`
        );
      } catch {
        // ignore
      }
    }
    showToast({
      title: user
        ? "Conversation history deleted from your account"
        : "Conversation cleared",
      variant: "success",
    });
  };

  const sendQuestion = async (rawQuestion: string) => {
    const trimmed = rawQuestion.trim();
    if (!trimmed || isLoading) return;

    if (trimmed.length < 3) {
      setErrorState({
        message: "Maglagay ng tanong na may hindi bababa sa 3 karakter.",
        lastQuestion: trimmed,
      });
      return;
    }

    setErrorState(null);
    const userMsg: AssistantChatMessage = {
      id: `msg-u-${Date.now()}`,
      role: "user",
      content: trimmed,
      displayedContent: trimmed,
      createdAt: new Date().toLocaleTimeString("en-PH", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuestionInput("");
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          question: trimmed,
          language: languageMode,
          moduleFilter,
          location: {
            regionCode,
            province: province.trim(),
            cityMunicipality: cityMunicipality.trim(),
            barangay: barangay.trim(),
          },
        }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
        answer?: string;
        disclaimer?: string;
        providerUsed?: string;
        modelUsed?: string;
        isEmergencyResponse?: boolean;
        isBlockedInjectionOrAbuse?: boolean;
        hasConflictWarning?: boolean;
        conflictExplanation?: string;
        hasUnverifiedOrStaleWarning?: boolean;
        sources?: GroundedCitation[];
      };

      if (!response.ok || payload.ok === false) {
        setIsLoading(false);
        setErrorState({
          message:
            payload.error ||
            "Hindi naproseso ang iyong tanong sa ngayon. Subukan muli.",
          lastQuestion: trimmed,
        });
        return;
      }

      const fullAnswer = payload.answer || "";
      const assistantMsgId = `msg-a-${Date.now()}`;

      // Progressive streaming effect with Stop Generation support
      const initialAssistantMsg: AssistantChatMessage = {
        id: assistantMsgId,
        role: "assistant",
        content: fullAnswer,
        displayedContent: "",
        isStreaming: true,
        disclaimer: payload.disclaimer,
        providerUsed: payload.providerUsed,
        modelUsed: payload.modelUsed,
        isEmergencyResponse: payload.isEmergencyResponse,
        isBlockedInjectionOrAbuse: payload.isBlockedInjectionOrAbuse,
        hasConflictWarning: payload.hasConflictWarning,
        conflictExplanation: payload.conflictExplanation,
        hasUnverifiedOrStaleWarning: payload.hasUnverifiedOrStaleWarning,
        sources: payload.sources || [],
        createdAt: new Date().toLocaleTimeString("en-PH", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, initialAssistantMsg]);
      setIsLoading(false);
      setIsStreamingText(true);

      let charIndex = 0;
      const chunkSize = Math.max(24, Math.ceil(fullAnswer.length / 18));

      streamIntervalRef.current = setInterval(() => {
        charIndex += chunkSize;
        if (charIndex >= fullAnswer.length) {
          if (streamIntervalRef.current) {
            clearInterval(streamIntervalRef.current);
            streamIntervalRef.current = null;
          }
          setIsStreamingText(false);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? { ...m, displayedContent: fullAnswer, isStreaming: false }
                : m
            )
          );
        } else {
          const sliceText = fullAnswer.slice(0, charIndex);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? { ...m, displayedContent: sliceText }
                : m
            )
          );
        }
      }, 28);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }
      setIsLoading(false);
      setIsStreamingText(false);
      setErrorState({
        message:
          "Nagkaroon ng problema sa koneksyon. Maaari mong ulitin ang tanong o gamitin ang Universal Search (/search).",
        lastQuestion: trimmed,
      });
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-3 py-6 sm:px-6">
      {/* Header Banner */}
      <div className="mb-5 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 rounded bg-[#17365D] px-2.5 py-0.5 text-xs font-bold uppercase text-white">
            <Bot className="h-3.5 w-3.5 text-[#087F8C]" aria-hidden="true" />
            <span>GabayPH Source-Grounded AI Assistant</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setShowLocationPanel(!showLocationPanel)}
              className="inline-flex items-center gap-1.5 rounded border border-slate-300 bg-white px-2.5 py-1 font-semibold text-slate-700 hover:border-[#087F8C]"
            >
              <MapPin
                className="h-3.5 w-3.5 text-[#087F8C]"
                aria-hidden="true"
              />
              <span>
                Location:{" "}
                {regionCode === "ALL" ? "Nationwide" : regionCode}
                {cityMunicipality ? ` · ${cityMunicipality}` : ""}
              </span>
            </button>

            {messages.length > 0 && (
              <button
                type="button"
                onClick={clearConversation}
                className="inline-flex items-center gap-1 rounded border border-red-200 bg-red-50 px-2.5 py-1 font-semibold text-red-800 hover:bg-red-100"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>
                  {user ? "Delete Saved Conversation" : "Clear Conversation"}
                </span>
              </button>
            )}
          </div>
        </div>

        <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          GabayAI — Gabay sa Serbisyo, Trabaho, Tulong Pinansyal, Aral at Kaligtasan
        </h1>
        <p className="mt-1 text-xs text-slate-600">
          Magtanong sa Filipino, English, o Taglish. Lahat ng sagot ay direktang nakabatay sa mga na-verify na opisyal na sanggunian sa GabayPH.
        </p>
      </div>

      {/* Safety & Non-Government Disclosure Strip */}
      <div className="mb-4 flex items-start gap-2.5 rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-700">
        <Info
          className="mt-0.5 h-4 w-4 shrink-0 text-[#087F8C]"
          aria-hidden="true"
        />
        <div className="space-y-1">
          <p>
            <strong>Mahalagang Paalala (Safety &amp; Grounding Notice):</strong>{" "}
            Ang GabayAI ay gumagamit lamang ng mga na-verify na tala sa GabayPH at opisyal na <code>.gov.ph</code> links. Hindi ito ahensya ng gobyerno, doktor, abogado, o emergency responder, at hindi nag-aapruba ng aplikasyon.
          </p>
          <p className="text-[11px] text-slate-500">
            {user ? (
              <span className="inline-flex items-center gap-1">
                <Lock className="h-3 w-3 text-emerald-700" />
                <span>
                  Naka-sign in bilang <strong>{user.fullName}</strong>: Ang iyong chat history ay pribado (RLS-protected) at maaaring burahin anumang oras.
                </span>
              </span>
            ) : (
              <span>
                Guest Session: Maaari mong gamitin ang GabayAI nang walang account. Hindi namin sine-save sa server ang iyong usapan.
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Optional Location-Aware Filter Panel */}
      {showLocationPanel && (
        <section
          aria-label="Optional Geographic Filter for AI Recommendations"
          className="mb-4 rounded-md border border-slate-200 bg-white p-3.5 text-xs"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
            <strong className="text-slate-900">
              Optional Location-Aware Filter (Hindi kailangan ng eksaktong street address)
            </strong>
            <button
              type="button"
              onClick={() => {
                setRegionCode("ALL");
                setProvince("");
                setCityMunicipality("");
                setBarangay("");
              }}
              className="text-[11px] font-semibold text-[#087F8C] hover:underline"
            >
              Reset to Nationwide
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-4">
            <div>
              <label
                htmlFor="ai-region"
                className="block text-[11px] font-semibold text-slate-600"
              >
                Region
              </label>
              <select
                id="ai-region"
                value={regionCode}
                onChange={(e) => setRegionCode(e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900"
              >
                <option value="ALL">Nationwide (All Regions)</option>
                {PH_LOCATIONS.filter((l) => !l.isNational).map((loc) => (
                  <option key={loc.id} value={loc.regionCode}>
                    {loc.regionCode} — {loc.regionName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="ai-province"
                className="block text-[11px] font-semibold text-slate-600"
              >
                Province (Optional)
              </label>
              <input
                id="ai-province"
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                placeholder="e.g. Cebu, Cavite"
                className="mt-1 w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900"
              />
            </div>
            <div>
              <label
                htmlFor="ai-city"
                className="block text-[11px] font-semibold text-slate-600"
              >
                City / Municipality (Optional)
              </label>
              <input
                id="ai-city"
                type="text"
                value={cityMunicipality}
                onChange={(e) => setCityMunicipality(e.target.value)}
                placeholder="e.g. Quezon City, Cebu City"
                className="mt-1 w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900"
              />
            </div>
            <div>
              <label
                htmlFor="ai-barangay"
                className="block text-[11px] font-semibold text-slate-600"
              >
                Barangay (Optional)
              </label>
              <input
                id="ai-barangay"
                type="text"
                value={barangay}
                onChange={(e) => setBarangay(e.target.value)}
                placeholder="e.g. Brgy. Commonwealth"
                className="mt-1 w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900"
              />
            </div>
          </div>
        </section>
      )}

      {/* Suggested Starting Questions (Always visible or quick-pickable) */}
      <section
        aria-label="Suggested Starting Questions"
        className="mb-4 rounded-md border border-slate-200 bg-white p-3.5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <Sparkles className="h-3.5 w-3.5 text-[#087F8C]" />
            <span>Mga Halimbawang Tanong (Suggested Starting Questions):</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Example prompts for exploring verified guides
          </span>
        </div>

        <div className="mt-2.5 flex flex-wrap gap-2">
          {SUGGESTED_STARTING_QUESTIONS.map((item) => (
            <button
              key={item.question}
              type="button"
              disabled={isLoading || isStreamingText}
              onClick={() => sendQuestion(item.question)}
              className="rounded-md border border-slate-300 bg-[#F7F9FC] px-3 py-1.5 text-left text-xs font-medium text-slate-800 transition-colors hover:border-[#087F8C] hover:bg-blue-50/40 disabled:opacity-50"
            >
              “{item.question}”
            </button>
          ))}
        </div>
      </section>

      {/* Main Conversation Stream */}
      <div
        aria-live="polite"
        className="mb-4 min-h-[340px] space-y-4 rounded-md border border-slate-200 bg-white p-4"
      >
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#17365D]/10 text-[#17365D]">
              <Bot className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="mt-3 text-sm font-bold text-slate-900">
              Paano kita matutulungan ngayon?
            </h2>
            <p className="mt-1 max-w-md text-xs text-slate-600">
              Pumili sa mga halimbawang tanong sa itaas o mag-type ng sarili mong tanong tungkol sa NBI, PSA, PhilHealth, TESDA, DOST/CHED scholarships, DSWD AICS, o emergency preparedness.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <article
            key={msg.id}
            className={`rounded-md border p-3.5 text-xs ${
              msg.role === "user"
                ? "ml-auto max-w-2xl border-[#17365D]/20 bg-[#17365D]/5 text-slate-900"
                : msg.isEmergencyResponse
                ? "border-red-300 bg-red-50/40 text-slate-900"
                : "border-slate-200 bg-[#F7F9FC] text-slate-900"
            }`}
          >
            <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
              <span className="font-bold uppercase tracking-wider text-[#17365D]">
                {msg.role === "user"
                  ? user?.fullName || "Ikaw (Citizen)"
                  : "GabayPH Grounded Assistant"}
              </span>
              <div className="flex items-center gap-2">
                {msg.role === "assistant" && msg.modelUsed && (
                  <span className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
                    Engine: {msg.modelUsed}
                  </span>
                )}
                <span>{msg.createdAt}</span>
              </div>
            </div>

            <div className="whitespace-pre-line leading-relaxed text-slate-800">
              {msg.displayedContent ?? msg.content}
            </div>

            {msg.role === "assistant" && (
              <div className="mt-2.5 flex items-center justify-end">
                <CopyButton
                  textToCopy={msg.content}
                  label="Copy Response"
                  copiedLabel="Response Copied!"
                  className="bg-white/80 py-0.5 text-[11px]"
                />
              </div>
            )}

            {/* Source Citations Block */}
            {msg.role === "assistant" &&
              msg.sources &&
              msg.sources.length > 0 && (
                <div className="mt-4 border-t border-slate-200 pt-3">
                  <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#17365D]">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#16A36A]" />
                    <span>
                      Verified Source References ({msg.sources.length})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {msg.sources.map((src) => (
                      <div
                        key={src.id}
                        className="flex flex-col justify-between rounded border border-slate-200 bg-white p-2.5 text-[11.5px]"
                      >
                        <div>
                          <div className="flex flex-wrap items-center justify-between gap-1.5">
                            <StatusIndicator
                              status={src.effectiveVerificationStatus}
                            />
                            <span
                              className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
                                src.sourceTier === "official_gov_ph"
                                  ? "bg-blue-50 text-[#17365D]"
                                  : "bg-teal-50 text-[#087F8C]"
                              }`}
                            >
                              {src.sourceTier === "official_gov_ph"
                                ? "Official .gov.ph"
                                : "Verified Partner"}
                            </span>
                          </div>

                          <Link
                            href={src.internalHref}
                            className="mt-1.5 block font-bold text-slate-900 hover:text-[#087F8C] hover:underline"
                          >
                            {src.title}
                          </Link>
                          <p className="mt-0.5 text-[11px] text-slate-600">
                            Agency: <strong>{src.organizationName}</strong> ·{" "}
                            {src.regionName}
                          </p>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-1.5 text-[10.5px] text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Verified: {src.lastVerifiedAt}</span>
                          </span>
                          <div className="flex items-center gap-2">
                            <Link
                              href={src.internalHref}
                              className="font-semibold text-[#17365D] hover:underline"
                            >
                              GabayPH Guide
                            </Link>
                            <a
                              href={src.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-0.5 font-semibold text-[#087F8C] hover:underline"
                            >
                              <span>Official Link</span>
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Disclaimer Footer */}
            {msg.role === "assistant" && msg.disclaimer && (
              <p className="mt-3 rounded border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] text-slate-600">
                <CheckCircle2 className="mr-1 inline h-3 w-3 text-[#087F8C]" />
                {msg.disclaimer}
              </p>
            )}
          </article>
        ))}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#17365D] border-t-transparent" />
              <span>
                Naghahanap sa mga na-verify na tala ng GabayPH (Trabaho, Serbisyo, Pera, Bayanihan, Aral, Kaligtasan)...
              </span>
            </div>
            <button
              type="button"
              onClick={stopGeneration}
              className="inline-flex items-center gap-1 rounded border border-red-300 bg-white px-2.5 py-1 font-semibold text-red-700 hover:bg-red-50"
            >
              <Square className="h-3 w-3" />
              <span>Stop</span>
            </button>
          </div>
        )}

        {/* Error & Retry State */}
        {errorState && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-xs text-red-900"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-700" />
              <span>{errorState.message}</span>
            </div>
            <button
              type="button"
              onClick={() => sendQuestion(errorState.lastQuestion)}
              className="inline-flex items-center gap-1 rounded border border-red-300 bg-white px-2.5 py-1 font-semibold text-red-800 hover:bg-red-100"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Retry Question</span>
            </button>
          </div>
        )}
      </div>

      {/* Input Composer & Filter Controls */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendQuestion(questionInput);
        }}
        className="rounded-md border border-slate-300 bg-white p-3"
      >
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="ai-lang-select" className="font-semibold text-slate-700">
              Language:
            </label>
            <select
              id="ai-lang-select"
              value={languageMode}
              onChange={(e) =>
                setLanguageMode(e.target.value as "auto" | "fil" | "en")
              }
              className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-900"
            >
              <option value="auto">Auto (Filipino / English / Taglish)</option>
              <option value="fil">Filipino / Taglish</option>
              <option value="en">English</option>
            </select>

            <label htmlFor="ai-mod-select" className="font-semibold text-slate-700">
              Module Scope:
            </label>
            <select
              id="ai-mod-select"
              value={moduleFilter}
              onChange={(e) =>
                setModuleFilter(e.target.value as ModuleType | "all")
              }
              className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-900"
            >
              <option value="all">All 6 Modules</option>
              <option value="trabaho">1. Trabaho</option>
              <option value="serbisyo">2. Serbisyo</option>
              <option value="pera">3. Pera</option>
              <option value="bayanihan">4. Bayanihan</option>
              <option value="aral">5. Aral</option>
              <option value="kaligtasan">6. Kaligtasan</option>
            </select>
          </div>

          <span className="font-mono text-[11px] text-slate-500">
            {questionInput.length} / 500 chars
          </span>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            maxLength={500}
            placeholder="Magtanong dito (hal. Paano kumuha ng NBI Clearance? May scholarship ba sa college?)..."
            aria-label="Ask the GabayPH grounded assistant"
            className="flex-1 rounded border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-[#087F8C] focus:outline-none"
          />

          <div className="flex items-center gap-2">
            {(isLoading || isStreamingText) && (
              <button
                type="button"
                onClick={stopGeneration}
                className="inline-flex items-center justify-center gap-1.5 rounded border border-red-300 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-800 hover:bg-red-100"
              >
                <Square className="h-3.5 w-3.5" />
                <span>Stop</span>
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading || questionInput.trim().length < 3}
              className="inline-flex items-center justify-center gap-1.5 rounded bg-[#17365D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#102847] disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
