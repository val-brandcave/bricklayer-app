"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LayoutGrid, SlidersHorizontal, Table2, X } from "lucide-react";
import { SearchField } from "@/components/molecules/SearchField";
import { Menu } from "@/components/molecules/Menu";
import { PageHeader, PAGE_GUTTER } from "@/components/molecules/PageHeader";
import { PropertyCard } from "@/components/molecules/PropertyCard";
import { PropertyTable } from "@/components/organisms/PropertyTable";
import { PropertyDetail } from "@/components/organisms/PropertyDetail";
import { Skeleton } from "@/components/atoms/Skeleton";
import { Tooltip } from "@/components/atoms/Tooltip";
import { Button } from "@/components/atoms/Button";
import { staggerContainer } from "@/lib/motion";
import { fmtCount, fmtUsd } from "@/lib/format";
import { CLASS_LABEL, FLOOD_LABEL, STATUS_META } from "@/lib/property-meta";
import type { AssetClass, FloodZone, ValuationStatus } from "@/types";
import type { UseProperties } from "@/hooks/useProperties";

export type PropertyView = "table" | "grid";

export interface PropertyWorkspaceTemplateProps {
  data: UseProperties;
  view: PropertyView;
  onViewChange: (v: PropertyView) => void;
  onAskAbout: (context: string) => void;
}

const STATUSES: ValuationStatus[] = ["fresh", "aging", "stale"];

/* PropertyWorkspaceTemplate — the Properties screen. Shows the book browser
   (filter toolbar + sortable table or card grid) and, when a property is
   selected, swaps to the full-width property workspace. One template, two
   states, cross-faded. */
export function PropertyWorkspaceTemplate({ data, view, onViewChange, onAskAbout }: PropertyWorkspaceTemplateProps) {
  const { isLoading, filtered, classes, floodZones, filters, sort, setSort, patch, reset, selected, select, totalCount } = data;

  // detail view
  if (selected) {
    return (
      <AnimatePresence mode="wait">
        <motion.div key={selected.property.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }}>
          <PropertyDetail row={selected} onBack={() => select(null)} onAskAbout={onAskAbout} />
        </motion.div>
      </AnimatePresence>
    );
  }

  const filtersActive = filters.assetClass !== "all" || filters.status !== "all" || filters.floodZone !== "all" || filters.query.trim() !== "";
  const bookValue = filtered.reduce((s, r) => s + r.property.bookValue, 0);

  return (
    <>
      <PageHeader
        left={
          <>
            <div style={{ flex: 1, minWidth: 200 }}>
              <SearchField value={filters.query} onChange={(q) => patch({ query: q })} placeholder="Search by name or location…" size="sm" ariaLabel="Search properties" />
            </div>

            <FilterMenu
              label={filters.assetClass === "all" ? "Any class" : CLASS_LABEL[filters.assetClass]}
              active={filters.assetClass !== "all"}
              items={[{ label: "Any class", onClick: () => patch({ assetClass: "all" }) }, ...classes.map((c) => ({ label: CLASS_LABEL[c], onClick: () => patch({ assetClass: c as AssetClass }) }))]}
            />
            <FilterMenu
              label={filters.status === "all" ? "Any valuation" : STATUS_META[filters.status].label}
              active={filters.status !== "all"}
              items={[{ label: "Any valuation", onClick: () => patch({ status: "all" }) }, ...STATUSES.map((s) => ({ label: STATUS_META[s].label, onClick: () => patch({ status: s }) }))]}
            />
            <FilterMenu
              label={filters.floodZone === "all" ? "Any flood zone" : FLOOD_LABEL[filters.floodZone]}
              active={filters.floodZone !== "all"}
              items={[{ label: "Any flood zone", onClick: () => patch({ floodZone: "all" }) }, ...floodZones.map((z) => ({ label: FLOOD_LABEL[z], onClick: () => patch({ floodZone: z as FloodZone }) }))]}
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
              {isLoading ? "Loading…" : `${fmtCount(filtered.length)} of ${fmtCount(totalCount)} · ${fmtUsd(bookValue)}`}
            </span>
            <ViewToggle view={view} onChange={onViewChange} />
          </>
        }
      />

      <div style={{ padding: `var(--s-5) ${PAGE_GUTTER} var(--s-12)` }}>
        {/* results */}
        {isLoading ? (
          view === "table" ? <TableSkeleton /> : <GridSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyProperties onClear={reset} />
        ) : view === "table" ? (
          <PropertyTable rows={filtered} sort={sort} onSort={setSort} onSelect={select} />
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={GRID}>
            {filtered.map((r) => (
              <PropertyCard key={r.property.id} row={r} onSelect={select} inStagger />
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
}

function ViewToggle({ view, onChange }: { view: PropertyView; onChange: (v: PropertyView) => void }) {
  return (
    <div style={{ display: "inline-flex", padding: 3, gap: 2, borderRadius: "var(--r-md)", background: "var(--surface-2)", border: "1px solid var(--hairline)" }}>
      {([["table", Table2, "Table view"], ["grid", LayoutGrid, "Card view"]] as const).map(([id, Icon, label]) => {
        const active = view === id;
        return (
          <Tooltip key={id} label={label} side="bottom">
            <button
              type="button"
              aria-label={label}
              aria-pressed={active}
              onClick={() => onChange(id)}
              style={{ display: "grid", placeItems: "center", width: 32, height: 30, borderRadius: "var(--r-sm)", border: "none", background: active ? "var(--surface)" : "transparent", boxShadow: active ? "var(--shadow-sm)" : "none", color: active ? "var(--primary)" : "var(--muted)", cursor: "pointer" }}
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

function EmptyProperties({ onClear }: { onClear: () => void }) {
  return (
    <div style={{ display: "grid", placeItems: "center", gap: 12, minHeight: 280, borderRadius: "var(--r-xl)", border: "1px dashed var(--border-strong)", background: "var(--surface-2)", textAlign: "center" }}>
      <p style={{ fontSize: 15, color: "var(--muted)", margin: 0 }}>No properties match your filters.</p>
      <Button variant="secondary" size="sm" onClick={onClear}>Clear filters</Button>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div style={{ border: "1px solid var(--hairline)", borderRadius: "var(--r-lg)", overflow: "hidden", background: "var(--surface)" }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 16px", borderBottom: "1px solid var(--hairline-2)" }}>
          <div style={{ flex: 2 }}><Skeleton width="55%" height={14} shape="text" /></div>
          <div style={{ flex: 1 }}><Skeleton width="70%" height={12} shape="text" /></div>
          <div style={{ flex: 1 }}><Skeleton width="60%" height={12} shape="text" /></div>
          <div style={{ flex: 1 }}><Skeleton width="50%" height={12} shape="text" /></div>
        </div>
      ))}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div style={GRID}>
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} style={{ padding: "var(--s-5)", background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--r-lg)", display: "flex", flexDirection: "column", gap: 14 }}>
          <Skeleton width="70%" height={16} shape="text" />
          <Skeleton width="45%" height={12} shape="text" />
          <div style={{ display: "flex", gap: 10 }}>
            <Skeleton width="30%" height={24} />
            <Skeleton width="30%" height={24} />
            <Skeleton width="30%" height={24} />
          </div>
        </div>
      ))}
    </div>
  );
}

const GRID: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "var(--s-4)", alignItems: "stretch" };
