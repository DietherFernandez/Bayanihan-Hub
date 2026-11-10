"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export type ThemeMode = "light" | "dark";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: "success" | "warning" | "danger" | "info";
}

interface ThemeAndToastContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, "id">) => void;
  dismissToast: (id: string) => void;
}

const ThemeAndToastContext = createContext<
  ThemeAndToastContextValue | undefined
>(undefined);

const THEME_STORAGE_KEY = "gabayph_theme_v1";

export function ThemeAndToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (saved === "dark" || saved === "light") {
        setThemeState(saved);
        document.documentElement.classList.toggle("dark", saved === "dark");
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", mode === "dark");
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // no-op
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showToast = (toast: Omit<ToastMessage, "id">) => {
    const id = `tst-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const entry: ToastMessage = { id, variant: "info", ...toast };
    setToasts((prev) => [entry, ...prev].slice(0, 4));
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  return (
    <ThemeAndToastContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
      {/* Accessible Toast Notification Stack */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="no-print pointer-events-none fixed bottom-16 right-4 z-50 flex w-full max-w-sm flex-col gap-2 sm:bottom-5"
      >
        {toasts.map((t) => {
          const isSuccess = t.variant === "success";
          const isWarn = t.variant === "warning";
          const isDanger = t.variant === "danger";

          return (
            <div
              key={t.id}
              role="status"
              className="pointer-events-auto flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3.5 shadow-lg transition-all duration-180"
            >
              <div className="flex items-start gap-2.5">
                {isSuccess ? (
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#16A36A]"
                    aria-hidden="true"
                  />
                ) : isWarn ? (
                  <AlertTriangle
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#D99A28]"
                    aria-hidden="true"
                  />
                ) : isDanger ? (
                  <AlertCircle
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#D94B4B]"
                    aria-hidden="true"
                  />
                ) : (
                  <Info
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#087F8C]"
                    aria-hidden="true"
                  />
                )}
                <div className="text-xs">
                  <p className="font-semibold text-slate-900">{t.title}</p>
                  {t.description && (
                    <p className="mt-0.5 text-slate-600">{t.description}</p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => dismissToast(t.id)}
                aria-label="Dismiss notification"
                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ThemeAndToastContext.Provider>
  );
}

export function useThemeAndToast() {
  const ctx = useContext(ThemeAndToastContext);
  if (!ctx) {
    throw new Error(
      "useThemeAndToast must be used within ThemeAndToastProvider"
    );
  }
  return ctx;
}
