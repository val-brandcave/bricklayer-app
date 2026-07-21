"use client";

import { ChevronDown, LayoutDashboard, Plus, Sparkles, Star, TimerReset } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Pill } from "@/components/atoms/Pill";
import { Menu } from "@/components/molecules/Menu";
import { PageHeader, PAGE_GUTTER } from "@/components/molecules/PageHeader";
import { DashboardGrid } from "@/components/organisms/DashboardGrid";
import type { Dashboard, Tile } from "@/types";
import type { ResolvedTile } from "@/hooks/useDashboards";

export interface DashboardTemplateProps {
  isLoading: boolean;
  active: Dashboard | null;
  lensDashboards: Dashboard[];
  tiles: ResolvedTile[];
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onRemoveTile: (reportId: string) => void;
  onEditTile?: (reportId: string) => void;
  onTilesChange?: (tiles: Tile[]) => void;
  onAddReport: () => void;
  onNewDashboard: () => void;
}

/* DashboardTemplate — the Dashboards screen: an attached header strip (switcher
   + badges · actions) over the tile grid. Structure only; the page hook feeds
   it data and callbacks. */
export function DashboardTemplate({
  isLoading,
  active,
  lensDashboards,
  tiles,
  onSelect,
  onToggleFavorite,
  onRemoveTile,
  onEditTile,
  onTilesChange,
  onAddReport,
  onNewDashboard,
}: DashboardTemplateProps) {
  return (
    <>
      <PageHeader
        left={
          <>
            <DashboardSwitcher active={active} lensDashboards={lensDashboards} onSelect={onSelect} onNewDashboard={onNewDashboard} loading={isLoading} />
            {active?.origin === "ai" && (
              <Pill tone="primary" size="sm">
                <Sparkles size={11} strokeWidth={2.5} style={{ marginRight: 1 }} aria-hidden />
                AI-assembled
              </Pill>
            )}
            {active?.ephemeral && (
              <Pill tone="warning" size="sm">
                <TimerReset size={11} strokeWidth={2.5} style={{ marginRight: 1 }} aria-hidden />
                Ephemeral
              </Pill>
            )}
          </>
        }
        right={
          <>
            {active && (
              <button
                type="button"
                aria-label={active.favorite ? "Unfavorite dashboard" : "Favorite dashboard"}
                aria-pressed={active.favorite}
                onClick={() => onToggleFavorite(active.id)}
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: 38,
                  height: 38,
                  borderRadius: "var(--r-md)",
                  border: "1px solid var(--hairline)",
                  background: "var(--surface)",
                  color: active.favorite ? "var(--warning)" : "var(--muted)",
                  cursor: "pointer",
                  transition: "color var(--dur), background var(--dur)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-3)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface)")}
              >
                <Star size={17} strokeWidth={2} fill={active.favorite ? "currentColor" : "none"} />
              </button>
            )}
            <Button variant="secondary" size="md" iconLeft={Plus} onClick={onAddReport} disabled={!active}>
              Add report
            </Button>
            <Button variant="primary" size="md" iconLeft={LayoutDashboard} onClick={onNewDashboard}>
              New dashboard
            </Button>
          </>
        }
      />

      <div style={{ padding: `var(--s-5) ${PAGE_GUTTER} var(--s-12)` }}>
        {!isLoading && active && active.tiles.length === 0 ? (
          <EmptyBoard onAddReport={onAddReport} />
        ) : (
          <DashboardGrid tiles={tiles} loading={isLoading} onRemoveTile={onRemoveTile} onEditTile={onEditTile} onTilesChange={onTilesChange} />
        )}
      </div>
    </>
  );
}

function DashboardSwitcher({
  active,
  lensDashboards,
  onSelect,
  onNewDashboard,
  loading,
}: {
  active: Dashboard | null;
  lensDashboards: Dashboard[];
  onSelect: (id: string) => void;
  onNewDashboard: () => void;
  loading: boolean;
}) {
  return (
    <Menu
      align="start"
      width={300}
      items={[
        ...lensDashboards.map((d) => ({
          label: d.name,
          icon: d.isDefault ? Star : LayoutDashboard,
          onClick: () => onSelect(d.id),
        })),
        { label: "New dashboard…", icon: Plus, onClick: onNewDashboard, dividerBefore: true },
      ]}
      trigger={({ onClick, ref, ...aria }) => (
        <button
          ref={ref}
          type="button"
          onClick={onClick}
          {...aria}
          disabled={loading}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 8px 6px 10px",
            borderRadius: "var(--r-md)",
            border: "1px solid transparent",
            background: "transparent",
            color: "var(--ink)",
            cursor: loading ? "default" : "pointer",
            font: "inherit",
            maxWidth: "52vw",
          }}
          onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "var(--surface-3)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <h1 style={{ fontSize: 21, fontWeight: 680, lineHeight: 1.15, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {loading ? "Loading…" : active?.name ?? "No dashboards"}
          </h1>
          <ChevronDown size={19} strokeWidth={2.2} style={{ color: "var(--muted)", flexShrink: 0 }} aria-hidden />
        </button>
      )}
    />
  );
}

function EmptyBoard({ onAddReport }: { onAddReport: () => void }) {
  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        gap: 14,
        minHeight: 320,
        padding: "var(--s-12)",
        borderRadius: "var(--r-xl)",
        border: "1px dashed var(--border-strong)",
        background: "var(--surface-2)",
        textAlign: "center",
      }}
    >
      <span style={{ display: "grid", placeItems: "center", width: 56, height: 56, borderRadius: "var(--r-lg)", background: "var(--primary-soft)", color: "var(--primary)" }}>
        <LayoutDashboard size={26} strokeWidth={1.8} />
      </span>
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 650, margin: "0 0 4px" }}>This dashboard is empty</h3>
        <p style={{ fontSize: 14, color: "var(--muted)", margin: 0, maxWidth: "44ch" }}>Add a saved report as a tile, or ask Bricklayer to build one for you.</p>
      </div>
      <Button variant="primary" size="md" iconLeft={Plus} onClick={onAddReport}>
        Add a report
      </Button>
    </div>
  );
}
