"use client";

import { useEffect, useMemo, useState } from "react";
import { useDashboardStore, useReportStore, useUIStore } from "@/store";
import type { Dashboard, Report, Tile } from "@/types";

export interface ResolvedTile {
  tile: Tile;
  report: Report | null;
}

/* Page hook for the Dashboards screen. Bridges the dashboards + reports stores
   to the page: kicks off both fetches, scopes dashboards to the active lens,
   tracks the selected dashboard, and joins its tiles to their reports.
   Imports stores only — never the adapter (see adapter guide). */
export function useDashboards() {
  const lens = useUIStore((s) => s.lens);

  const dashboards = useDashboardStore((s) => s.dashboards);
  const dashLoaded = useDashboardStore((s) => s.loaded);
  const fetchDashboards = useDashboardStore((s) => s.fetchDashboards);
  const toggleFavorite = useDashboardStore((s) => s.toggleFavorite);
  const addTile = useDashboardStore((s) => s.addTile);
  const removeTile = useDashboardStore((s) => s.removeTile);
  const updateTiles = useDashboardStore((s) => s.updateTiles);
  const createDashboard = useDashboardStore((s) => s.createDashboard);

  const reports = useReportStore((s) => s.reports);
  const repLoaded = useReportStore((s) => s.loaded);
  const fetchReports = useReportStore((s) => s.fetchReports);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!dashLoaded) fetchDashboards();
    if (!repLoaded) fetchReports();
  }, [dashLoaded, repLoaded, fetchDashboards, fetchReports]);

  const isLoading = !dashLoaded || !repLoaded;

  // dashboards visible for the active lens (favorites/default first, then recent)
  const lensDashboards = useMemo(
    () =>
      dashboards
        .filter((d) => d.lens === lens)
        .sort((a, b) => Number(b.isDefault) - Number(a.isDefault) || Number(b.favorite) - Number(a.favorite) || b.createdAt - a.createdAt),
    [dashboards, lens],
  );

  // resolve the active dashboard: explicit selection → lens default → first
  const active = useMemo<Dashboard | null>(() => {
    if (selectedId) {
      const found = lensDashboards.find((d) => d.id === selectedId);
      if (found) return found;
    }
    return lensDashboards.find((d) => d.isDefault) ?? lensDashboards[0] ?? null;
  }, [selectedId, lensDashboards]);

  const reportById = useMemo(() => {
    const m = new Map<string, Report>();
    reports.forEach((r) => m.set(r.id, r));
    return m;
  }, [reports]);

  const tiles = useMemo<ResolvedTile[]>(() => {
    if (!active) return [];
    return [...active.tiles]
      .sort((a, b) => a.y - b.y || a.x - b.x)
      .map((tile) => ({ tile, report: reportById.get(tile.reportId) ?? null }));
  }, [active, reportById]);

  return {
    isLoading,
    lensDashboards,
    active,
    tiles,
    reports,
    selectDashboard: setSelectedId,
    toggleFavorite,
    addTile,
    removeTile,
    updateTiles,
    createDashboard,
  };
}
