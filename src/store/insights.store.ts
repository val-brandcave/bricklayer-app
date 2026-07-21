"use client";

import { create } from "zustand";
import { adapter } from "@/data/adapters";
import { Collections } from "@/data/collections";
import type { Insight } from "@/types";
import { latency, LATENCY } from "./latency";

/* Insights = the per-lens opinion / critique layer (claim → evidence →
   Bricklayer's Read → follow-ups). The store owns adapter access + latency. */

interface InsightState {
  insights: Insight[];
  isLoading: boolean;
  loaded: boolean;
  error: string | null;

  fetchInsights: () => Promise<void>;
  dismissInsight: (id: string) => Promise<void>;
}

export const useInsightStore = create<InsightState>((set, get) => ({
  insights: [],
  isLoading: false,
  loaded: false,
  error: null,

  fetchInsights: async () => {
    set({ isLoading: true, error: null });
    try {
      await latency(LATENCY.read);
      const insights = await adapter.getAll<Insight>(Collections.INSIGHTS);
      set({ insights, isLoading: false, loaded: true });
    } catch (err) {
      set({ isLoading: false, error: (err as Error).message });
    }
  },

  dismissInsight: async (id) => {
    // optimistic — the card animates out immediately
    set({ insights: get().insights.map((i) => (i.id === id ? { ...i, dismissed: true } : i)) });
    await adapter.update<Insight>(Collections.INSIGHTS, id, { dismissed: true, updatedAt: Date.now() });
  },
}));
