"use client";

import { create } from "zustand";
import type { Lens } from "@/types";

/* UI-only state (not persisted through the data adapter):
   the active lens (dev switcher), theme, and co-working chat panel.
   Data stores live separately and are the only layer that touches the adapter. */

export type Theme = "light" | "dark";

interface UIState {
  lens: Lens;
  setLens: (lens: Lens) => void;

  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // right-docked co-working assistant
  chatOpen: boolean;
  chatContext: string | null; // page-aware context label
  openChat: (context?: string) => void;
  closeChat: () => void;
  toggleChat: () => void;

  // command palette / summon
  commandOpen: boolean;
  setCommandOpen: (open: boolean) => void;

  // left-nav collapse (icon-only rail)
  navCollapsed: boolean;
  toggleNav: () => void;
  setNavCollapsed: (collapsed: boolean) => void;

  // app settings modal
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;

  // top-bar breadcrumb sub-crumb (e.g. the property name in a drill-down);
  // the base page label is derived from the route in the TopBar.
  crumb: string | null;
  setCrumb: (crumb: string | null) => void;
}

function readNavCollapsed(): boolean {
  if (typeof localStorage === "undefined") return false;
  try {
    return localStorage.getItem("bricklayer:nav-collapsed") === "1";
  } catch {
    return false;
  }
}

function persistNavCollapsed(collapsed: boolean) {
  try {
    localStorage.setItem("bricklayer:nav-collapsed", collapsed ? "1" : "0");
  } catch {
    /* ignore */
  }
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("bricklayer:theme", theme);
  } catch {
    /* ignore */
  }
}

export const useUIStore = create<UIState>((set, get) => ({
  lens: "portfolio-manager",
  setLens: (lens) => {
    try {
      localStorage.setItem("bricklayer:lens", lens);
    } catch {
      /* ignore */
    }
    set({ lens });
  },

  theme: "light",
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    applyTheme(next);
    set({ theme: next });
  },

  chatOpen: false,
  chatContext: null,
  openChat: (context) => set({ chatOpen: true, chatContext: context ?? null }),
  closeChat: () => set({ chatOpen: false }),
  toggleChat: () => set((s) => ({ chatOpen: !s.chatOpen })),

  commandOpen: false,
  setCommandOpen: (commandOpen) => set({ commandOpen }),

  navCollapsed: readNavCollapsed(),
  toggleNav: () => {
    const next = !get().navCollapsed;
    persistNavCollapsed(next);
    set({ navCollapsed: next });
  },
  setNavCollapsed: (navCollapsed) => {
    persistNavCollapsed(navCollapsed);
    set({ navCollapsed });
  },

  settingsOpen: false,
  setSettingsOpen: (settingsOpen) => set({ settingsOpen }),

  crumb: null,
  setCrumb: (crumb) => set({ crumb }),
}));
