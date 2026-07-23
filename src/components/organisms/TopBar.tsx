"use client";

import { ChevronRight, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/store/ui.store";
import { ThemeToggle } from "@/components/atoms/ThemeToggle";
import { SearchSpark } from "@/components/atoms/SearchSpark";
import { HEADER_H } from "@/lib/layout";
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
  const navCollapsed = useUIStore((s) => s.navCollapsed);
  const toggleNav = useUIStore((s) => s.toggleNav);
  const chatNavExpanded = useUIStore((s) => s.chatNavExpanded);
  const toggleChatNav = useUIStore((s) => s.toggleChatNav);
  const crumb = useUIStore((s) => s.crumb);
  const crumbBack = useUIStore((s) => s.crumbBack);
  const pathname = usePathname();
  const base = ROUTE_LABEL[Object.keys(ROUTE_LABEL).find((r) => pathname.startsWith(r)) ?? ""] ?? "";

  // On /chat the main nav is route-collapsed; the toggle flips the session
  // override there instead of the persisted global preference.
  const isChat = pathname.startsWith("/chat");
  const collapsed = isChat ? !chatNavExpanded : navCollapsed;
  const onToggleNav = isChat ? toggleChatNav : toggleNav;

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        display: "flex",
        alignItems: "center",
        gap: "var(--s-3)",
        height: HEADER_H,
        padding: "0 var(--s-6)",
        background: "color-mix(in srgb, var(--surface) 86%, transparent)",
        backdropFilter: "saturate(1.4) blur(10px)",
        borderBottom: "1px solid var(--hairline)",
      }}
    >
      {/* collapse toggle — plain icon button, sits against the rail */}
      <button
        type="button"
        onClick={onToggleNav}
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

      {/* breadcrumb / current page — doubles as the drill-down trail. In a
          drill-down (crumb set) the base label becomes the way back. */}
      {base && (
        <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: 4, minWidth: 0, flex: "0 1 auto" }}>
          {crumb && crumbBack ? (
            <button
              type="button"
              onClick={crumbBack}
              style={{
                fontSize: 14.5,
                fontWeight: 500,
                color: "var(--muted)",
                whiteSpace: "nowrap",
                border: "none",
                background: "transparent",
                padding: 0,
                font: "inherit",
                cursor: "pointer",
                transition: "color var(--dur)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
            >
              {base}
            </button>
          ) : (
            <span style={{ fontSize: 14.5, fontWeight: 650, color: "var(--ink)", whiteSpace: "nowrap" }}>{base}</span>
          )}
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

      {/* compact search affordance — reads as a button, not an input; opens the
          command palette (⌘K). The sparkle marks it as AI-aware. */}
      <button
        type="button"
        onClick={() => setCommandOpen(true)}
        aria-label="Search or ask Bricklayer"
        title="Search  ·  ⌘K"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 9,
          height: 34,
          padding: "0 13px 0 12px",
          borderRadius: "var(--r-pill)",
          border: "1px solid var(--hairline)",
          background: "var(--surface-2)",
          color: "var(--muted)",
          cursor: "pointer",
          font: "inherit",
          fontSize: 13.5,
          fontWeight: 500,
          transition: "background var(--dur), color var(--dur), border-color var(--dur)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--surface-3)";
          e.currentTarget.style.color = "var(--ink)";
          e.currentTarget.style.borderColor = "color-mix(in srgb, var(--primary) 32%, var(--hairline))";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--surface-2)";
          e.currentTarget.style.color = "var(--muted)";
          e.currentTarget.style.borderColor = "var(--hairline)";
        }}
      >
        <SearchSpark size={16} />
        <span>Search</span>
      </button>

      <ThemeToggle />
      <ProfileMenu />
    </header>
  );
}
