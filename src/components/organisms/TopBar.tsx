"use client";

import { ChevronRight, PanelLeftClose, PanelLeftOpen, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/store/ui.store";
import { ThemeToggle } from "@/components/atoms/ThemeToggle";
import { ProfileMenu } from "./ProfileMenu";

const ROUTE_LABEL: Record<string, string> = {
  "/insights": "Insights",
  "/dashboards": "Dashboards",
  "/reports": "Reports",
  "/properties": "Properties",
  "/chat": "Chat",
};

export function TopBar() {
  const setCommandOpen = useUIStore((s) => s.setCommandOpen);
  const collapsed = useUIStore((s) => s.navCollapsed);
  const toggleNav = useUIStore((s) => s.toggleNav);
  const crumb = useUIStore((s) => s.crumb);
  const pathname = usePathname();
  const base = ROUTE_LABEL[Object.keys(ROUTE_LABEL).find((r) => pathname.startsWith(r)) ?? ""] ?? "";

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        display: "flex",
        alignItems: "center",
        gap: "var(--s-3)",
        height: 60,
        padding: "0 var(--s-6)",
        background: "color-mix(in srgb, var(--surface) 86%, transparent)",
        backdropFilter: "saturate(1.4) blur(10px)",
        borderBottom: "1px solid var(--hairline)",
      }}
    >
      {/* collapse toggle — plain icon button, sits against the rail */}
      <button
        type="button"
        onClick={toggleNav}
        aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
        aria-pressed={collapsed}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        style={{
          display: "inline-grid",
          placeItems: "center",
          width: 34,
          height: 34,
          flex: "none",
          borderRadius: "var(--r-md)",
          border: "none",
          background: "transparent",
          color: "var(--muted)",
          cursor: "pointer",
          transition: "background var(--dur), color var(--dur)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--surface-3)";
          e.currentTarget.style.color = "var(--ink)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--muted)";
        }}
      >
        {collapsed ? <PanelLeftOpen size={18} strokeWidth={2} /> : <PanelLeftClose size={18} strokeWidth={2} />}
      </button>

      {/* breadcrumb / current page — doubles as the drill-down trail */}
      {base && (
        <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: 4, minWidth: 0, flex: "0 1 auto" }}>
          <span
            style={{
              fontSize: 14.5,
              fontWeight: crumb ? 500 : 650,
              color: crumb ? "var(--muted)" : "var(--ink)",
              whiteSpace: "nowrap",
            }}
          >
            {base}
          </span>
          {crumb && (
            <>
              <ChevronRight size={15} strokeWidth={2.2} style={{ color: "var(--faint)", flexShrink: 0 }} aria-hidden />
              <span style={{ fontSize: 14.5, fontWeight: 650, color: "var(--ink)", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {crumb}
              </span>
            </>
          )}
        </nav>
      )}

      {/* everything else pushed to the right */}
      <span style={{ flex: 1 }} />

      <button
        type="button"
        onClick={() => setCommandOpen(true)}
        aria-label="Search"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "min(360px, 34vw)",
          height: 38,
          padding: "0 12px",
          borderRadius: "var(--r-md)",
          border: "1px solid var(--hairline)",
          background: "var(--surface-2)",
          color: "var(--muted)",
          cursor: "pointer",
          font: "inherit",
          fontSize: 13.5,
          textAlign: "left",
        }}
      >
        <Search size={16} style={{ flexShrink: 0 }} />
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          Search reports, properties, dashboards…
        </span>
        <kbd
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--muted)",
            background: "var(--surface)",
            border: "1px solid var(--hairline)",
            borderRadius: "var(--r-xs)",
            padding: "2px 6px",
            flexShrink: 0,
          }}
        >
          ⌘K
        </kbd>
      </button>

      <ThemeToggle />
      <ProfileMenu />
    </header>
  );
}
