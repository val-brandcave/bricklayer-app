"use client";

import { create } from "zustand";
import { adapter } from "@/data/adapters";
import { Collections } from "@/data/collections";
import type { Appraisal, Property, WatchlistItem } from "@/types";
import { latency, LATENCY } from "./latency";

/* The individual-asset altitude — properties, their latest appraisals, and the
   scored watchlist. One store because the property workspace joins all three.
   Adapter access + latency live here (not the page). */

interface PropertyState {
  properties: Property[];
  appraisals: Appraisal[];
  watchlist: WatchlistItem[];
  isLoading: boolean;
  loaded: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
}

export const usePropertyStore = create<PropertyState>((set) => ({
  properties: [],
  appraisals: [],
  watchlist: [],
  isLoading: false,
  loaded: false,
  error: null,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      await latency(LATENCY.read);
      const [properties, appraisals, watchlist] = await Promise.all([
        adapter.getAll<Property>(Collections.PROPERTIES),
        adapter.getAll<Appraisal>(Collections.APPRAISALS),
        adapter.getAll<WatchlistItem>(Collections.WATCHLIST),
      ]);
      set({ properties, appraisals, watchlist, isLoading: false, loaded: true });
    } catch (err) {
      set({ isLoading: false, error: (err as Error).message });
    }
  },
}));
