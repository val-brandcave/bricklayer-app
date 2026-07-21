"use client";

import { useEffect, useMemo, useState } from "react";
import { usePropertyStore } from "@/store";
import type { Appraisal, AssetClass, FloodZone, Property, ValuationStatus, WatchlistItem } from "@/types";

export type ClassFilter = AssetClass | "all";
export type StatusFilter = ValuationStatus | "all";
export type FloodFilter = FloodZone | "all";

export interface PropertyFilters {
  query: string;
  assetClass: ClassFilter;
  status: StatusFilter;
  floodZone: FloodFilter;
}

export type PropertySort = "risk" | "value" | "cap" | "stale" | "name";

/** A property joined to everything the workspace needs: its latest appraisal
    and its watchlist entry (if it's on the list). */
export interface PropertyRow {
  property: Property;
  appraisal: Appraisal | null;
  watch: WatchlistItem | null;
}

const EMPTY: PropertyFilters = { query: "", assetClass: "all", status: "all", floodZone: "all" };

const SORTERS: Record<PropertySort, (a: PropertyRow, b: PropertyRow) => number> = {
  risk: (a, b) => b.property.riskScore - a.property.riskScore,
  value: (a, b) => b.property.bookValue - a.property.bookValue,
  cap: (a, b) => b.property.capRate - a.property.capRate,
  stale: (a, b) => b.property.monthsSinceValuation - a.property.monthsSinceValuation,
  name: (a, b) => a.property.name.localeCompare(b.property.name),
};

/* Page hook for the Properties screen — the individual-asset altitude. Fetches
   the property book (with its appraisals + watchlist) through the store, holds
   the filter/sort/selection state, and derives the joined, filtered rows plus
   the fully-resolved selected property for the drill-down workspace.
   Store-only imports (never the adapter). */
export function useProperties() {
  const properties = usePropertyStore((s) => s.properties);
  const appraisals = usePropertyStore((s) => s.appraisals);
  const watchlist = usePropertyStore((s) => s.watchlist);
  const loaded = usePropertyStore((s) => s.loaded);
  const fetchAll = usePropertyStore((s) => s.fetchAll);

  const [filters, setFilters] = useState<PropertyFilters>(EMPTY);
  const [sort, setSort] = useState<PropertySort>("risk");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!loaded) fetchAll();
  }, [loaded, fetchAll]);

  const appraisalById = useMemo(() => {
    const m = new Map<string, Appraisal>();
    appraisals.forEach((a) => m.set(a.id, a));
    return m;
  }, [appraisals]);

  const watchByProperty = useMemo(() => {
    const m = new Map<string, WatchlistItem>();
    watchlist.forEach((w) => m.set(w.propertyId, w));
    return m;
  }, [watchlist]);

  const rows = useMemo<PropertyRow[]>(
    () =>
      properties.map((property) => ({
        property,
        appraisal: appraisalById.get(property.latestAppraisalId) ?? null,
        watch: watchByProperty.get(property.id) ?? null,
      })),
    [properties, appraisalById, watchByProperty],
  );

  const classes = useMemo(() => Array.from(new Set(properties.map((p) => p.assetClass))) as AssetClass[], [properties]);
  const floodZones = useMemo(() => Array.from(new Set(properties.map((p) => p.floodZone))) as FloodZone[], [properties]);

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return rows
      .filter(({ property: p }) => {
        if (filters.assetClass !== "all" && p.assetClass !== filters.assetClass) return false;
        if (filters.status !== "all" && p.valuationStatus !== filters.status) return false;
        if (filters.floodZone !== "all" && p.floodZone !== filters.floodZone) return false;
        if (q && !(p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.state.toLowerCase().includes(q) || p.address.toLowerCase().includes(q))) return false;
        return true;
      })
      .sort(SORTERS[sort]);
  }, [rows, filters, sort]);

  const selected = useMemo<PropertyRow | null>(() => rows.find((r) => r.property.id === selectedId) ?? null, [rows, selectedId]);

  const patch = (p: Partial<PropertyFilters>) => setFilters((f) => ({ ...f, ...p }));
  const reset = () => setFilters(EMPTY);

  return {
    isLoading: !loaded,
    rows,
    filtered,
    classes,
    floodZones,
    filters,
    sort,
    setSort,
    patch,
    reset,
    selectedId,
    select: setSelectedId,
    selected,
    totalCount: properties.length,
  } as const;
}

export type UseProperties = ReturnType<typeof useProperties>;
