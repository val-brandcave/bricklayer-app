"use client";

import { useEffect } from "react";
import { useUIStore } from "@/store/ui.store";
import type { Theme } from "@/store/ui.store";

/* Syncs the Zustand theme with the DOM stamp set pre-paint by ThemeScript,
   and with saved / OS preference. Components never branch on theme — they
   style through tokens defined for both. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const setTheme = useUIStore((s) => s.setTheme);

  useEffect(() => {
    const current = (document.documentElement.getAttribute("data-theme") as Theme) || "light";
    // Reflect the pre-paint value into the store without re-writing storage churn.
    useUIStore.setState({ theme: current });

    // Follow OS changes only when the user hasn't explicitly chosen.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem("bricklayer:theme");
      if (!saved) setTheme(e.matches ? "dark" : "light");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [setTheme]);

  return <>{children}</>;
}
