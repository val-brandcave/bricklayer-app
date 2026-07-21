"use client";

import { create } from "zustand";
import { adapter } from "@/data/adapters";
import { Collections } from "@/data/collections";
import { generateId } from "@/types";
import type { Report } from "@/types";
import { latency, LATENCY } from "./latency";

/* Reports = saved, data-bound instances of a widget (see CLAUDE.md vocabulary).
   The store is the only layer that touches the adapter; it also owns IDs,
   timestamps, loading/error, and the simulated latency for the demo. */

interface ReportState {
  reports: Report[];
  isLoading: boolean;
  loaded: boolean;
  error: string | null;

  fetchReports: () => Promise<void>;
  createReport: (data: Omit<Report, "id" | "createdAt">) => Promise<Report>;
  updateReport: (id: string, data: Partial<Report>) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
}

export const useReportStore = create<ReportState>((set, get) => ({
  reports: [],
  isLoading: false,
  loaded: false,
  error: null,

  fetchReports: async () => {
    set({ isLoading: true, error: null });
    try {
      await latency(LATENCY.read);
      const reports = await adapter.getAll<Report>(Collections.REPORTS);
      set({ reports, isLoading: false, loaded: true });
    } catch (err) {
      set({ isLoading: false, error: (err as Error).message });
    }
  },

  createReport: async (data) => {
    const now = Date.now();
    const report: Report = { ...data, id: generateId(), createdAt: now, updatedAt: now };
    await latency(LATENCY.write);
    await adapter.create(Collections.REPORTS, report);
    set({ reports: [report, ...get().reports] });
    return report;
  },

  updateReport: async (id, data) => {
    await latency(LATENCY.write);
    const updated = await adapter.update<Report>(Collections.REPORTS, id, { ...data, updatedAt: Date.now() });
    set({ reports: get().reports.map((r) => (r.id === id ? updated : r)) });
  },

  deleteReport: async (id) => {
    await latency(LATENCY.quick);
    await adapter.remove(Collections.REPORTS, id);
    set({ reports: get().reports.filter((r) => r.id !== id) });
  },
}));
