"use client";

import { create } from "zustand";
import { adapter } from "@/data/adapters";
import { Collections } from "@/data/collections";
import { generateId } from "@/types";
import type { Dashboard, Tile } from "@/types";
import { latency, LATENCY } from "./latency";

/* Dashboards = saved collections of reports on a grid (never "board").
   A report rendered on a dashboard is a Tile. The store owns adapter access,
   IDs/timestamps, loading/error and simulated latency. */

interface DashboardState {
  dashboards: Dashboard[];
  isLoading: boolean;
  loaded: boolean;
  error: string | null;

  fetchDashboards: () => Promise<void>;
  createDashboard: (data: Omit<Dashboard, "id" | "createdAt">) => Promise<Dashboard>;
  updateDashboard: (id: string, data: Partial<Dashboard>) => Promise<void>;
  deleteDashboard: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  addTile: (dashboardId: string, tile: Tile) => Promise<void>;
  removeTile: (dashboardId: string, reportId: string) => Promise<void>;
  /** Persist a new tile arrangement (drag/resize autosave). Optimistic +
      debounced by the caller; writes the whole tiles array through the adapter. */
  updateTiles: (dashboardId: string, tiles: Tile[]) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  dashboards: [],
  isLoading: false,
  loaded: false,
  error: null,

  fetchDashboards: async () => {
    set({ isLoading: true, error: null });
    try {
      await latency(LATENCY.read);
      const dashboards = await adapter.getAll<Dashboard>(Collections.DASHBOARDS);
      set({ dashboards, isLoading: false, loaded: true });
    } catch (err) {
      set({ isLoading: false, error: (err as Error).message });
    }
  },

  createDashboard: async (data) => {
    const now = Date.now();
    const dashboard: Dashboard = { ...data, id: generateId(), createdAt: now, updatedAt: now };
    await latency(LATENCY.write);
    await adapter.create(Collections.DASHBOARDS, dashboard);
    set({ dashboards: [dashboard, ...get().dashboards] });
    return dashboard;
  },

  updateDashboard: async (id, data) => {
    await latency(LATENCY.write);
    const updated = await adapter.update<Dashboard>(Collections.DASHBOARDS, id, { ...data, updatedAt: Date.now() });
    set({ dashboards: get().dashboards.map((d) => (d.id === id ? updated : d)) });
  },

  deleteDashboard: async (id) => {
    await latency(LATENCY.quick);
    await adapter.remove(Collections.DASHBOARDS, id);
    set({ dashboards: get().dashboards.filter((d) => d.id !== id) });
  },

  toggleFavorite: async (id) => {
    const current = get().dashboards.find((d) => d.id === id);
    if (!current) return;
    const favorite = !current.favorite;
    // optimistic
    set({ dashboards: get().dashboards.map((d) => (d.id === id ? { ...d, favorite } : d)) });
    await adapter.update<Dashboard>(Collections.DASHBOARDS, id, { favorite, updatedAt: Date.now() });
  },

  addTile: async (dashboardId, tile) => {
    const current = get().dashboards.find((d) => d.id === dashboardId);
    if (!current) return;
    const tiles = [...current.tiles.filter((t) => t.reportId !== tile.reportId), tile];
    await get().updateDashboard(dashboardId, { tiles });
  },

  removeTile: async (dashboardId, reportId) => {
    const current = get().dashboards.find((d) => d.id === dashboardId);
    if (!current) return;
    const tiles = current.tiles.filter((t) => t.reportId !== reportId);
    await get().updateDashboard(dashboardId, { tiles });
  },

  updateTiles: async (dashboardId, tiles) => {
    const current = get().dashboards.find((d) => d.id === dashboardId);
    if (!current) return;
    // optimistic: reflect the new arrangement immediately so the grid is the
    // source of truth mid-interaction; then persist through the adapter.
    set({ dashboards: get().dashboards.map((d) => (d.id === dashboardId ? { ...d, tiles, updatedAt: Date.now() } : d)) });
    await adapter.update<Dashboard>(Collections.DASHBOARDS, dashboardId, { tiles, updatedAt: Date.now() });
  },
}));
