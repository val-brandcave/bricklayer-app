"use client";

import { useEffect, useMemo, useState } from "react";
import { useReportStore } from "@/store";
import type { Report, WidgetType } from "@/types";

export type OriginFilter = "all" | "starter" | "ai" | "user";

export interface ReportFilters {
  query: string;
  origin: OriginFilter;
  type: WidgetType | "all";
  owner: string | "all";
}

const EMPTY: ReportFilters = { query: "", origin: "all", type: "all", owner: "all" };

/* Page hook for the Reports library. Fetches reports, holds the filter/search
   state, and derives the filtered + sorted view plus the facet lists (owners,
   types) the toolbar needs. Store-only imports. */
export function useReports() {
  const reports = useReportStore((s) => s.reports);
  const loaded = useReportStore((s) => s.loaded);
  const fetchReports = useReportStore((s) => s.fetchReports);
  const createReport = useReportStore((s) => s.createReport);
  const updateReport = useReportStore((s) => s.updateReport);
  const deleteReport = useReportStore((s) => s.deleteReport);

  const [filters, setFilters] = useState<ReportFilters>(EMPTY);

  useEffect(() => {
    if (!loaded) fetchReports();
  }, [loaded, fetchReports]);

  const owners = useMemo(() => {
    const set = new Map<string, string>();
    reports.forEach((r) => set.set(r.ownerId, r.ownerName));
    return Array.from(set, ([id, name]) => ({ id, name }));
  }, [reports]);

  const types = useMemo(() => Array.from(new Set(reports.map((r) => r.widgetType))) as WidgetType[], [reports]);

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return reports
      .filter((r) => {
        if (filters.origin !== "all" && r.origin !== filters.origin) return false;
        if (filters.type !== "all" && r.widgetType !== filters.type) return false;
        if (filters.owner !== "all" && r.ownerId !== filters.owner) return false;
        if (q && !(r.title.toLowerCase().includes(q) || r.tags.some((t) => t.includes(q)) || (r.subtitle ?? "").toLowerCase().includes(q))) return false;
        return true;
      })
      .sort((a, b) => b.createdAt - a.createdAt || a.title.localeCompare(b.title));
  }, [reports, filters]);

  const patch = (p: Partial<ReportFilters>) => setFilters((f) => ({ ...f, ...p }));
  const reset = () => setFilters(EMPTY);

  return {
    isLoading: !loaded,
    reports,
    filtered,
    owners,
    types,
    filters,
    patch,
    reset,
    createReport,
    updateReport,
    deleteReport,
  } as const;
}

export type UseReports = ReturnType<typeof useReports>;
export type { Report };
