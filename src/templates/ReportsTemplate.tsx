"use client";

import { motion } from "framer-motion";
import { ChevronDown, FilePlus2, LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { SearchField } from "@/components/molecules/SearchField";
import { Menu } from "@/components/molecules/Menu";
import { PageHeader, PAGE_GUTTER } from "@/components/molecules/PageHeader";
import { ReportCard } from "@/components/molecules/ReportCard";
import type { ReportLayout } from "@/components/molecules/ReportCard";
import { Skeleton } from "@/components/atoms/Skeleton";
import { Tooltip } from "@/components/atoms/Tooltip";
import { WIDGET_GLYPH } from "@/lib/widget-glyphs";
import { staggerContainer } from "@/lib/motion";
import { fmtCount } from "@/lib/format";
import type { Report, WidgetType } from "@/types";
import type { OriginFilter, ReportFilters } from "@/hooks/useReports";

export interface ReportsTemplateProps {
  isLoading: boolean;
  filtered: Report[];
  totalCount: number;
  owners: { id: string; name: string }[];
  types: WidgetType[];
  filters: ReportFilters;
  patch: (p: Partial<ReportFilters>) => void;
  reset: () => void;
  view: ReportLayout;
  onViewChange: (v: ReportLayout) => void;
  onOpen: (report: Report) => void;
  onNew: () => void;
}

const ORIGINS: { id: OriginFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "starter", label: "Starter" },
  { id: "ai", label: "AI-made" },
  { id: "user", label: "Yours" },
];

/* ReportsTemplate — the library: an attached header strip (title · view toggle
   + New report) over a filter toolbar and a responsive card grid or list. */
export function ReportsTemplate({ isLoading, filtered, totalCount, owners, types, filters, patch, reset, view, onViewChange, onOpen, onNew }: ReportsTemplateProps) {
  const filtersActive = filters.origin !== "all" || filters.type !== "all" || filters.owner !== "all" || filters.query.trim() !== "";
  const ownerName = owners.find((o) => o.id === filters.owner)?.name;

  return (
    <>
      <PageHeader
        left={
          <>
            <div style={{ flex: 1, minWidth: 200 }}>
              <SearchField value={filters.query} onChange={(q) => patch({ query: q })} placeholder="Search reports…" size="sm" ariaLabel="Search reports" />
            </div>

            <div role="tablist" aria-label="Filter by origin" style={{ display: "inline-flex", padding: 3, gap: 2, borderRadius: "var(--r-md)", background: "var(--surface-2)", border: "1px solid var(--hairline)", flexShrink: 0 }}>
              {ORIGINS.map((o) => {
                const active = filters.origin === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => patch({ origin: o.id })}
                    style={{ position: "relative", padding: "5px 12px", borderRadius: "var(--r-sm)", border: "none", background: "transparent", color: active ? "var(--ink)" : "var(--muted)", font: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                  >
                    {active && <motion.span layoutId="reports-origin-pill" transition={{ type: "spring", stiffness: 420, damping: 34 }} style={{ position: "absolute", inset: 0, borderRadius: "var(--r-sm)", background: "var(--surface)", boxShadow: "var(--shadow-sm)", zIndex: 0 }} />}
                    <span style={{ position: "relative", zIndex: 1 }}>{o.label}</span>
                  </button>
                );
              })}
            </div>

            <FilterMenu
              label={filters.type === "all" ? "Any type" : WIDGET_GLYPH[filters.type].label}
              active={filters.type !== "all"}
              items={[{ label: "Any type", onClick: () => patch({ type: "all" }) }, ...types.map((t) => ({ label: WIDGET_GLYPH[t].label, icon: WIDGET_GLYPH[t].icon, onClick: () => patch({ type: t }) }))]}
            />

            <FilterMenu
              label={filters.owner === "all" ? "Any owner" : ownerName ?? "Owner"}
              active={filters.owner !== "all"}
              items={[{ label: "Any owner", onClick: () => patch({ owner: "all" }) }, ...owners.map((o) => ({ label: o.name, onClick: () => patch({ owner: o.id }) }))]}
            />

            {filtersActive && (
              <button type="button" onClick={reset} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 10px", border: "none", background: "transparent", color: "var(--primary)", font: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>
                <X size={14} strokeWidth={2.5} /> Clear
              </button>
            )}
          </>
        }
        right={
          <>
            <span style={{ fontSize: 12.5, color: "var(--muted)", whiteSpace: "nowrap" }} className="tnum">
              {isLoading ? "Loading…" : `${fmtCount(filtered.length)} of ${fmtCount(totalCount)}`}
            </span>
            <ViewToggle view={view} onChange={onViewChange} />
            <Button variant="primary" size="md" iconLeft={FilePlus2} onClick={onNew}>
              New report
            </Button>
          </>
        }
      />

      <div style={{ padding: `var(--s-5) ${PAGE_GUTTER} var(--s-12)` }}>
        {/* results */}
        {isLoading ? (
          <div style={GRID}>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} style={{ padding: "var(--s-5)", background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--r-lg)", display: "flex", flexDirection: "column", gap: 12 }}>
                <Skeleton width={40} height={40} radius="var(--r-md)" />
                <Skeleton width="80%" height={16} shape="text" />
                <Skeleton width="55%" height={12} shape="text" />
                <Skeleton width="40%" height={11} shape="text" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyReports onClear={reset} />
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={view === "grid" ? GRID : LIST}>
            {filtered.map((r) => (
              <ReportCard key={r.id} report={r} onOpen={onOpen} layout={view} inStagger />
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
}

function ViewToggle({ view, onChange }: { view: ReportLayout; onChange: (v: ReportLayout) => void }) {
  return (
    <div style={{ display: "inline-flex", padding: 3, gap: 2, borderRadius: "var(--r-md)", background: "var(--surface-2)", border: "1px solid var(--hairline)" }}>
      {([["grid", LayoutGrid, "Grid view"], ["list", List, "List view"]] as const).map(([id, Icon, label]) => {
        const active = view === id;
        return (
          <Tooltip key={id} label={label} side="bottom">
            <button
              type="button"
              aria-label={label}
              aria-pressed={active}
              onClick={() => onChange(id)}
              style={{
                display: "grid",
                placeItems: "center",
                width: 32,
                height: 30,
                borderRadius: "var(--r-sm)",
                border: "none",
                background: active ? "var(--surface)" : "transparent",
                boxShadow: active ? "var(--shadow-sm)" : "none",
                color: active ? "var(--primary)" : "var(--muted)",
                cursor: "pointer",
              }}
            >
              <Icon size={16} strokeWidth={2} />
            </button>
          </Tooltip>
        );
      })}
    </div>
  );
}

function FilterMenu({ label, active, items }: { label: string; active: boolean; items: import("@/components/molecules/Menu").MenuItem[] }) {
  return (
    <Menu
      align="start"
      width={220}
      items={items}
      trigger={({ onClick, ref, ...aria }) => (
        <button
          ref={ref}
          type="button"
          onClick={onClick}
          {...aria}
          style={{ display: "inline-flex", alignItems: "center", gap: 7, height: 34, padding: "0 12px", borderRadius: "var(--r-md)", border: `1px solid ${active ? "var(--primary)" : "var(--hairline)"}`, background: active ? "var(--primary-soft)" : "var(--surface)", color: active ? "var(--primary)" : "var(--body)", font: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
        >
          <SlidersHorizontal size={14} strokeWidth={2} />
          {label}
          <ChevronDown size={15} strokeWidth={2} style={{ color: active ? "var(--primary)" : "var(--muted)" }} />
        </button>
      )}
    />
  );
}

function EmptyReports({ onClear }: { onClear: () => void }) {
  return (
    <div style={{ display: "grid", placeItems: "center", gap: 12, minHeight: 280, borderRadius: "var(--r-xl)", border: "1px dashed var(--border-strong)", background: "var(--surface-2)", textAlign: "center" }}>
      <p style={{ fontSize: 15, color: "var(--muted)", margin: 0 }}>No reports match your filters.</p>
      <Button variant="secondary" size="sm" onClick={onClear}>Clear filters</Button>
    </div>
  );
}

const GRID: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--s-4)", alignItems: "stretch" };
const LIST: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "var(--s-2)" };
