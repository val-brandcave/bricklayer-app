"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GridLayout, type Layout, type LayoutItem } from "react-grid-layout";
import { Check, GripVertical, Loader2, MoreHorizontal, Pencil, RefreshCw, Trash2 } from "lucide-react";
import { Menu } from "@/components/molecules/Menu";
import { useElementSize } from "@/hooks/useElementSize";
import { useUIStore } from "@/store/ui.store";
import { widgetSize } from "@/lib/widget-sizing";
import { fade, fadeUp, staggerContainer } from "@/lib/motion";
import type { ResolvedTile } from "@/hooks/useDashboards";
import type { Tile } from "@/types";
import { Widget } from "./Widget";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./dashboard-grid.css";

export interface DashboardGridProps {
  tiles: ResolvedTile[];
  loading?: boolean;
  onRemoveTile?: (reportId: string) => void;
  onEditTile?: (reportId: string) => void;
  /** Persist a new arrangement after a drag/resize (debounced by the grid). */
  onTilesChange?: (tiles: Tile[]) => void;
  /** Drop a report dragged from the co-working chat onto the grid → new tile. */
  onDropReport?: (reportId: string, x: number, y: number, w: number, h: number) => void;
}

const COLS = 12;
const ROW_HEIGHT = 88;
const GAP = 16;
/** Below this container width, drag/resize is disabled and tiles stack (phone). */
const STACK_BREAKPOINT = 680;
const SAVE_DEBOUNCE = 650;

/* DashboardGrid — a dashboard's Tiles on a draggable, resizable 12-column grid.
   react-grid-layout is the engine (collision, compaction, snap); the visible
   surface is our own: hover-revealed drag grip (top-left) + resize grip
   (bottom-right), a faint grid-cell overlay during interaction, a tokenized
   drop-target, and debounced autosave. Each Tile is a fill-mode Widget so its
   visualization sizes to the cell. Narrow widths stack read-only. */
export function DashboardGrid({ tiles, loading = false, onRemoveTile, onEditTile, onTilesChange, onDropReport }: DashboardGridProps) {
  const [wrapRef, { width }] = useElementSize<HTMLDivElement>();
  const dragReport = useUIStore((s) => s.dragReport);
  const [layout, setLayout] = useState<LayoutItem[]>(() => toLayout(tiles));
  const [interacting, setInteracting] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [refreshing, setRefreshing] = useState<Set<string>>(new Set());
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reportById = useMemo(() => {
    const m = new Map<string, ResolvedTile>();
    tiles.forEach((t) => m.set(t.tile.reportId, t));
    return m;
  }, [tiles]);

  // Re-seed the layout only when the SET of tiles changes (dashboard switch,
  // add/remove) — not on coordinate changes we persisted ourselves.
  const idSignature = useMemo(() => tiles.map((t) => t.tile.reportId).sort().join("|"), [tiles]);
  useEffect(() => {
    setLayout(toLayout(tiles));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idSignature]);

  useEffect(() => () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    if (savedTimer.current) clearTimeout(savedTimer.current);
  }, []);

  const scheduleSave = useCallback(
    (next: Layout) => {
      if (!onTilesChange) return;
      setSaveState("saving");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        onTilesChange(fromLayout(next));
        setSaveState("saved");
        if (savedTimer.current) clearTimeout(savedTimer.current);
        savedTimer.current = setTimeout(() => setSaveState("idle"), 1800);
      }, SAVE_DEBOUNCE);
    },
    [onTilesChange],
  );

  const refreshTile = useCallback((reportId: string) => {
    setRefreshing((prev) => new Set(prev).add(reportId));
    setTimeout(() => {
      setRefreshing((prev) => {
        const next = new Set(prev);
        next.delete(reportId);
        return next;
      });
    }, 900);
  }, []);

  // Stable per-tile callbacks so memoized tiles don't re-render (and their
  // charts don't replay their entrance) when the layout changes during a drag.
  const handleEdit = useCallback((id: string) => onEditTile?.(id), [onEditTile]);
  const handleRemove = useCallback((id: string) => onRemoveTile?.(id), [onRemoveTile]);

  const stacked = width > 0 && width < STACK_BREAKPOINT;
  const overlayRows = useMemo(() => Math.max(...layout.map((l) => l.y + l.h), 4) + 2, [layout]);

  if (loading) {
    return (
      <div ref={wrapRef}>
        <div style={SKELETON_GRID_STYLE}>
          {SKELETON_LAYOUT.map((w, i) => (
            <div key={i} style={{ gridColumn: `span ${w}` }}>
              <Widget report={SKELETON_REPORT} frame="tile" loading />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Phone: stacked, read-only (no engine, natural heights).
  if (stacked) {
    return (
      <div ref={wrapRef}>
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: "flex", flexDirection: "column", gap: GAP }}>
          {tiles.map(({ tile, report }) => (
            <motion.div key={tile.reportId} variants={fadeUp}>
              {report ? (
                <Widget
                  report={report}
                  frame="tile"
                  inStagger
                  loading={refreshing.has(tile.reportId)}
                  actions={<TileMenu id={tile.reportId} onRefresh={refreshTile} onEdit={onEditTile ? handleEdit : undefined} onRemove={onRemoveTile ? handleRemove : undefined} />}
                />
              ) : (
                <MissingTile reportId={tile.reportId} onRemove={onRemoveTile} />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="bl-grid">
      <SaveIndicator state={saveState} />

      {/* Region wraps the overlay + grid so the overlay's top:0 is the grid's
          top:0 — the SaveIndicator above must NOT offset the cell alignment. */}
      <div className="bl-grid-region">
        {/* faint grid cells, only while dragging/resizing */}
        <AnimatePresence>
          {interacting && width > 0 && (
            <motion.div
              className="bl-grid-overlay"
              variants={fade}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridAutoRows: `${ROW_HEIGHT}px`, gap: GAP }}
            >
              {Array.from({ length: COLS * overlayRows }).map((_, i) => (
                <div key={i} className="bl-grid-overlay-cell" />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {width > 0 && (
          <GridLayout
            layout={layout}
            width={width}
            gridConfig={{ cols: COLS, rowHeight: ROW_HEIGHT, margin: [GAP, GAP], containerPadding: [0, 0] }}
            dragConfig={{ handle: ".bl-tile-grip" }}
            resizeConfig={{ handles: ["se"] }}
            dropConfig={onDropReport ? { enabled: true, defaultItem: { w: dragReport?.w ?? 6, h: dragReport?.h ?? 3 } } : undefined}
            onDropDragOver={() => (dragReport ? { w: dragReport.w, h: dragReport.h } : undefined)}
            onDrop={(_l: Layout, item, e: Event) => {
              const drag = useUIStore.getState().dragReport;
              const id = drag?.reportId || (e as DragEvent).dataTransfer?.getData("text/plain") || "";
              if (id && item && onDropReport) onDropReport(id, item.x, item.y, drag?.w ?? item.w, drag?.h ?? item.h);
              useUIStore.getState().setDragReport(null);
            }}
            onLayoutChange={(l: Layout) => setLayout([...l])}
            onDragStart={() => setInteracting(true)}
            onDragStop={(l: Layout) => {
              setInteracting(false);
              scheduleSave(l);
            }}
            onResizeStart={() => setInteracting(true)}
            onResizeStop={(l: Layout) => {
              setInteracting(false);
              scheduleSave(l);
            }}
          >
            {layout.map((item) => (
              <div key={item.i} className="bl-tile">
                <DashboardTile
                  id={item.i}
                  report={reportById.get(item.i)?.report ?? null}
                  loading={refreshing.has(item.i)}
                  onRefresh={refreshTile}
                  onEdit={onEditTile ? handleEdit : undefined}
                  onRemove={onRemoveTile ? handleRemove : undefined}
                />
              </div>
            ))}
          </GridLayout>
        )}
      </div>
    </div>
  );
}

/* ---------- layout <-> tiles ---------- */

function toLayout(tiles: ResolvedTile[]): LayoutItem[] {
  return tiles.map(({ tile, report }) => {
    const { min } = widgetSize(report?.widgetType ?? "bar");
    return { i: tile.reportId, x: tile.x, y: tile.y, w: tile.w, h: tile.h, minW: min[0], minH: min[1] };
  });
}

function fromLayout(layout: Layout): Tile[] {
  return layout.map((l) => ({ reportId: l.i, x: l.x, y: l.y, w: l.w, h: l.h }));
}

/* ---------- pieces ---------- */

function SaveIndicator({ state }: { state: "idle" | "saving" | "saved" }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", height: 22, marginBottom: 6 }}>
      <AnimatePresence>
        {state !== "idle" && (
          <motion.span
            variants={fade}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 550, color: "var(--muted)" }}
          >
            {state === "saving" ? (
              <>
                <Loader2 size={13} strokeWidth={2.4} className="bl-spin" aria-hidden />
                Saving…
              </>
            ) : (
              <>
                <Check size={13} strokeWidth={2.6} style={{ color: "var(--success)" }} aria-hidden />
                Layout saved
              </>
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Memoized tile — its charts only re-render when this tile's own report/loading
   changes, NOT when the layout churns during someone else's drag. */
interface DashboardTileProps {
  id: string;
  report: ResolvedTile["report"];
  loading: boolean;
  onRefresh: (id: string) => void;
  onEdit?: (id: string) => void;
  onRemove?: (id: string) => void;
}

const DashboardTile = memo(function DashboardTile({ id, report, loading, onRefresh, onEdit, onRemove }: DashboardTileProps) {
  return (
    <>
      <button type="button" className="bl-tile-grip" aria-label={`Move ${report?.title ?? "tile"}`} title="Drag to move">
        <GripVertical size={15} strokeWidth={2} aria-hidden />
      </button>
      {report ? (
        <Widget
          report={report}
          frame="tile"
          fill
          loading={loading}
          className="bl-tile-card"
          actions={<TileMenu id={id} onRefresh={onRefresh} onEdit={onEdit} onRemove={onRemove} />}
        />
      ) : (
        <MissingTile reportId={id} onRemove={onRemove ? () => onRemove(id) : undefined} />
      )}
    </>
  );
});

function TileMenu({ id, onRefresh, onEdit, onRemove }: { id: string; onRefresh: (id: string) => void; onEdit?: (id: string) => void; onRemove?: (id: string) => void }) {
  return (
    <Menu
      width={188}
      items={[
        { label: "Refresh", icon: RefreshCw, onClick: () => onRefresh(id) },
        { label: "Edit", icon: Pencil, onClick: onEdit ? () => onEdit(id) : undefined, disabled: !onEdit },
        { label: "Remove", icon: Trash2, danger: true, onClick: onRemove ? () => onRemove(id) : undefined, disabled: !onRemove, dividerBefore: true },
      ]}
      trigger={({ onClick, ref, ...aria }) => (
        <button
          ref={ref}
          type="button"
          onClick={onClick}
          aria-label="Tile actions"
          {...aria}
          style={{
            display: "grid",
            placeItems: "center",
            width: 28,
            height: 28,
            borderRadius: "var(--r-sm)",
            border: "none",
            background: "transparent",
            color: "var(--muted)",
            cursor: "pointer",
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
          <MoreHorizontal size={17} strokeWidth={2} />
        </button>
      )}
    />
  );
}

function MissingTile({ reportId, onRemove }: { reportId: string; onRemove?: (id: string) => void }) {
  return (
    <div
      className="bl-tile-card"
      style={{
        display: "grid",
        placeItems: "center",
        gap: 8,
        height: "100%",
        minHeight: 160,
        padding: "var(--s-5)",
        borderRadius: "var(--r-lg)",
        border: "1px dashed var(--border-strong)",
        background: "var(--surface-2)",
        color: "var(--muted)",
        fontSize: 13,
        textAlign: "center",
      }}
    >
      <span>This report is no longer available.</span>
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(reportId)}
          style={{ border: "none", background: "transparent", color: "var(--primary)", cursor: "pointer", font: "inherit", fontSize: 13, fontWeight: 600 }}
        >
          Remove tile
        </button>
      )}
    </div>
  );
}

const SKELETON_GRID_STYLE: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
  gridAutoFlow: "row dense",
  alignItems: "start",
  gap: GAP,
};

/* Skeleton board mimics a realistic layout so first paint doesn't shift. */
const SKELETON_LAYOUT = [3, 3, 6, 6, 6, 6, 6];
const SKELETON_REPORT = {
  id: "skeleton",
  title: "",
  widgetType: "bar" as const,
  dimensions: [],
  measures: [],
  dataKey: "valueByClass" as const,
  ownerId: "",
  ownerName: "",
  origin: "starter" as const,
  tags: [],
  provenance: { label: "" },
  createdAt: 0,
};
