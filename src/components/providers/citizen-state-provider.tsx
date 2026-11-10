"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type {
  BookmarkItem,
  ReportSubmission,
  UserProfile,
  UserRole,
} from "@/types/database";
import { INITIAL_REPORTS } from "@/lib/constants/philippine-data";

export interface SearchHistoryEntry {
  id: string;
  query: string;
  moduleFilter: string;
  regionFilter: string;
  timestamp: string;
}

interface CitizenStateContextValue {
  user: UserProfile | null;
  bookmarks: BookmarkItem[];
  searchHistory: SearchHistoryEntry[];
  reports: ReportSubmission[];
  completedChecklistIds: Record<string, string[]>;
  loginDemoUser: (params: {
    email: string;
    fullName?: string;
    role?: UserRole;
    regionCode?: string;
    saveSearchHistory?: boolean;
  }) => void;
  logoutUser: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  deleteAccount: () => void;
  toggleBookmark: (item: Omit<BookmarkItem, "id" | "createdAt">) => boolean;
  isBookmarked: (targetId: string) => boolean;
  recordSearchQuery: (
    query: string,
    moduleFilter?: string,
    regionFilter?: string
  ) => void;
  clearSearchHistory: () => void;
  submitPublicReport: (
    report: Omit<ReportSubmission, "id" | "resolutionStatus" | "createdAt">
  ) => ReportSubmission;
  updateReportStatus: (
    reportId: string,
    status: ReportSubmission["resolutionStatus"],
    notes: string
  ) => void;
  toggleChecklistStep: (resourceSlug: string, itemId: string) => void;
}

const CitizenStateContext = createContext<CitizenStateContextValue | undefined>(
  undefined
);

const STORAGE_KEYS = {
  USER: "gabayph_user_v1",
  BOOKMARKS: "gabayph_bookmarks_v1",
  HISTORY: "gabayph_search_history_v1",
  REPORTS: "gabayph_reports_v1",
  CHECKLISTS: "gabayph_checklists_v1",
};

export function CitizenStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryEntry[]>([]);
  const [reports, setReports] = useState<ReportSubmission[]>(INITIAL_REPORTS);
  const [completedChecklistIds, setCompletedChecklistIds] = useState<
    Record<string, string[]>
  >({});

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (savedUser) setUser(JSON.parse(savedUser));

      const savedBookmarks = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));

      const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (savedHistory) setSearchHistory(JSON.parse(savedHistory));

      const savedReports = localStorage.getItem(STORAGE_KEYS.REPORTS);
      if (savedReports) setReports(JSON.parse(savedReports));

      const savedChecklists = localStorage.getItem(STORAGE_KEYS.CHECKLISTS);
      if (savedChecklists) setCompletedChecklistIds(JSON.parse(savedChecklists));
    } catch {
      // Ignore storage access errors in restricted modes
    }
  }, []);

  const loginDemoUser: CitizenStateContextValue["loginDemoUser"] = ({
    email,
    fullName,
    role = "citizen",
    regionCode = "NCR",
    saveSearchHistory = false,
  }) => {
    const nextUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email: email.trim().toLowerCase(),
      fullName: fullName?.trim() || email.split("@")[0] || "Juan Dela Cruz",
      role,
      regionCode,
      saveSearchHistory,
      preferredLanguage: "en",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setUser(nextUser);
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(nextUser));
    } catch {
      // no-op
    }
  };

  const logoutUser = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch {
      // no-op
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
      } catch {
        // no-op
      }
      return updated;
    });
  };

  const deleteAccount = () => {
    setUser(null);
    setBookmarks([]);
    setSearchHistory([]);
    setCompletedChecklistIds({});
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
      localStorage.removeItem(STORAGE_KEYS.CHECKLISTS);
    } catch {
      // no-op
    }
  };

  const toggleBookmark: CitizenStateContextValue["toggleBookmark"] = (item) => {
    let added = false;
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.targetId === item.targetId);
      let next: BookmarkItem[];
      if (exists) {
        next = prev.filter((b) => b.targetId !== item.targetId);
        added = false;
      } else {
        const created: BookmarkItem = {
          ...item,
          id: `bm-${Date.now()}`,
          createdAt: new Date().toISOString().split("T")[0],
        };
        next = [created, ...prev];
        added = true;
      }
      try {
        localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(next));
      } catch {
        // no-op
      }
      return next;
    });
    return added;
  };

  const isBookmarked = (targetId: string) =>
    bookmarks.some((b) => b.targetId === targetId);

  const recordSearchQuery = (
    query: string,
    moduleFilter = "all",
    regionFilter = "ALL"
  ) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    if (user && !user.saveSearchHistory) return;

    setSearchHistory((prev) => {
      const filtered = prev.filter(
        (h) => h.query.toLowerCase() !== trimmed.toLowerCase()
      );
      const entry: SearchHistoryEntry = {
        id: `sh-${Date.now()}`,
        query: trimmed,
        moduleFilter,
        regionFilter,
        timestamp: new Date().toLocaleString("en-PH"),
      };
      const next = [entry, ...filtered].slice(0, 25);
      try {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(next));
      } catch {
        // no-op
      }
      return next;
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch {
      // no-op
    }
  };

  const submitPublicReport: CitizenStateContextValue["submitPublicReport"] = (
    report
  ) => {
    const created: ReportSubmission = {
      ...report,
      id: `rep-${Math.floor(1000 + Math.random() * 9000)}`,
      resolutionStatus: "open",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setReports((prev) => {
      const next = [created, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(next));
      } catch {
        // no-op
      }
      return next;
    });
    return created;
  };

  const updateReportStatus: CitizenStateContextValue["updateReportStatus"] = (
    reportId,
    status,
    notes
  ) => {
    setReports((prev) => {
      const next = prev.map((r) =>
        r.id === reportId
          ? { ...r, resolutionStatus: status, resolutionNotes: notes }
          : r
      );
      try {
        localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(next));
      } catch {
        // no-op
      }
      return next;
    });
  };

  const toggleChecklistStep = (resourceSlug: string, itemId: string) => {
    setCompletedChecklistIds((prev) => {
      const current = prev[resourceSlug] || [];
      const exists = current.includes(itemId);
      const nextForSlug = exists
        ? current.filter((id) => id !== itemId)
        : [...current, itemId];
      const next = { ...prev, [resourceSlug]: nextForSlug };
      try {
        localStorage.setItem(STORAGE_KEYS.CHECKLISTS, JSON.stringify(next));
      } catch {
        // no-op
      }
      return next;
    });
  };

  return (
    <CitizenStateContext.Provider
      value={{
        user,
        bookmarks,
        searchHistory,
        reports,
        completedChecklistIds,
        loginDemoUser,
        logoutUser,
        updateProfile,
        deleteAccount,
        toggleBookmark,
        isBookmarked,
        recordSearchQuery,
        clearSearchHistory,
        submitPublicReport,
        updateReportStatus,
        toggleChecklistStep,
      }}
    >
      {children}
    </CitizenStateContext.Provider>
  );
}

export function useCitizenState() {
  const ctx = useContext(CitizenStateContext);
  if (!ctx) {
    throw new Error("useCitizenState must be used within CitizenStateProvider");
  }
  return ctx;
}
