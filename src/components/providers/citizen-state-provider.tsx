"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type {
  AccountStatus,
  BookmarkItem,
  ReportSubmission,
  UserProfile,
  UserRole,
} from "@/types/database";
import { INITIAL_REPORTS } from "@/lib/constants/philippine-data";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { normalizeToCanonicalRole } from "@/lib/auth/rbac";

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
  setAuthenticatedUser: (profile: UserProfile | null) => void;
  loginDemoUser: (params: {
    id?: string;
    email: string;
    fullName?: string;
    username?: string;
    phoneNumber?: string;
    role?: UserRole;
    regionCode?: string;
    province?: string;
    cityMunicipality?: string;
    barangay?: string;
    accountStatus?: AccountStatus;
    saveSearchHistory?: boolean;
    emailVerified?: boolean;
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

    // Synchronize with Supabase Auth session when configured
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    const syncSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) return;

      const [{ data: profileRow }, { data: roleRows }] = await Promise.all([
        supabase
          .from("profiles")
          .select(
            "id, full_name, username, avatar_url, phone_number, role, region, province, city_municipality, barangay, account_status, save_search_history, preferred_language, created_at"
          )
          .eq("id", session.user.id)
          .maybeSingle(),
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id),
      ]);

      const roles = Array.isArray(roleRows)
        ? roleRows.map((r: { role: string }) => normalizeToCanonicalRole(r.role))
        : [];
      const primaryRole: UserRole = roles.includes("administrator")
        ? "administrator"
        : roles.includes("content_manager")
          ? "content_manager"
          : roles.includes("moderator")
            ? "moderator"
            : profileRow?.role || "user";

      const syncedUser: UserProfile = {
        id: session.user.id,
        email: session.user.email || "",
        fullName:
          profileRow?.full_name ||
          session.user.user_metadata?.full_name ||
          session.user.email?.split("@")[0] ||
          "Citizen",
        username: profileRow?.username || undefined,
        avatarUrl: profileRow?.avatar_url || undefined,
        phoneNumber: profileRow?.phone_number || undefined,
        role: primaryRole,
        regionCode: profileRow?.region || "NCR",
        province: profileRow?.province || undefined,
        cityMunicipality: profileRow?.city_municipality || undefined,
        barangay: profileRow?.barangay || undefined,
        accountStatus: profileRow?.account_status || "active",
        saveSearchHistory: Boolean(profileRow?.save_search_history),
        preferredLanguage:
          profileRow?.preferred_language === "fil" ? "fil" : "en",
        emailVerified: Boolean(session.user.email_confirmed_at),
        createdAt:
          profileRow?.created_at?.split("T")[0] ||
          new Date().toISOString().split("T")[0],
      };

      setUser(syncedUser);
      try {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(syncedUser));
      } catch {
        // no-op
      }
    };

    void syncSession();

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        try {
          localStorage.removeItem(STORAGE_KEYS.USER);
        } catch {
          // no-op
        }
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        void syncSession();
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const setAuthenticatedUser = (profile: UserProfile | null) => {
    setUser(profile);
    try {
      if (profile) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(profile));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch {
      // no-op
    }
  };

  const loginDemoUser: CitizenStateContextValue["loginDemoUser"] = ({
    id,
    email,
    fullName,
    username,
    phoneNumber,
    role = "user",
    regionCode = "NCR",
    province,
    cityMunicipality,
    barangay,
    accountStatus = "active",
    saveSearchHistory = false,
    emailVerified = true,
  }) => {
    const nextUser: UserProfile = {
      id: id || `usr-${Date.now()}`,
      email: email.trim().toLowerCase(),
      fullName: fullName?.trim() || email.split("@")[0] || "Juan Dela Cruz",
      username: username?.trim() || undefined,
      phoneNumber: phoneNumber?.trim() || undefined,
      role,
      regionCode,
      province: province?.trim() || undefined,
      cityMunicipality: cityMunicipality?.trim() || undefined,
      barangay: barangay?.trim() || undefined,
      accountStatus,
      saveSearchHistory,
      preferredLanguage: "en",
      emailVerified,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setAuthenticatedUser(nextUser);
  };

  const logoutUser = () => {
    const supabase = createSupabaseBrowserClient();
    if (supabase) {
      void supabase.auth.signOut();
    }
    setAuthenticatedUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      // Never allow client-side updateProfile to mutate role or accountStatus
      const safeUpdates = { ...updates };
      delete safeUpdates.role;
      delete safeUpdates.accountStatus;
      const updated = {
        ...prev,
        ...safeUpdates,
        updatedAt: new Date().toISOString().split("T")[0],
      };
      try {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
      } catch {
        // no-op
      }
      return updated;
    });
  };

  const deleteAccount = () => {
    const supabase = createSupabaseBrowserClient();
    if (supabase) {
      void supabase.auth.signOut();
    }
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
        setAuthenticatedUser,
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
