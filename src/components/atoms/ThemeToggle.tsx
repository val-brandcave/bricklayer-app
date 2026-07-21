"use client";

import { Moon, Sun } from "lucide-react";
import { useUIStore } from "@/store/ui.store";

export function ThemeToggle() {
  const theme = useUIStore((s) => s.theme);
  const toggle = useUIStore((s) => s.toggleTheme);
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light mode" : "Dark mode"}
      style={{
        display: "inline-grid",
        placeItems: "center",
        width: 36,
        height: 36,
        borderRadius: "var(--r-md)",
        border: "1px solid var(--hairline)",
        background: "var(--surface)",
        color: "var(--muted)",
        cursor: "pointer",
        transition: "background var(--dur), color var(--dur), border-color var(--dur)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--surface-3)";
        e.currentTarget.style.color = "var(--ink)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--surface)";
        e.currentTarget.style.color = "var(--muted)";
      }}
    >
      {isDark ? <Sun size={17} strokeWidth={2} /> : <Moon size={17} strokeWidth={2} />}
    </button>
  );
}
