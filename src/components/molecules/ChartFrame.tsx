"use client";

import { motion } from "framer-motion";
import { ProvenanceLine } from "@/components/atoms/ProvenanceLine";
import { Skeleton } from "@/components/atoms/Skeleton";
import { useElementSize } from "@/hooks/useElementSize";
import { fadeUp } from "@/lib/motion";
import type { Provenance } from "@/types";

export type FrameKind = "tile" | "mcp" | "bare";

/** Body content: a static node, or a function given the body's measured pixel
    height (used in `fill` mode so a visualization sizes to a resizable tile). */
export type ChartFrameChildren = React.ReactNode | ((bodyHeight: number) => React.ReactNode);

export interface ChartFrameProps {
  title: string;
  subtitle?: string;
  provenance?: Provenance;
  /** header-right controls (menu, filters). Falls to actions slot in the header. */
  actions?: React.ReactNode;
  /** footer controls — used by the MCP frame for Save / Edit in chat. */
  footer?: React.ReactNode;
  /** "tile" = on a dashboard; "mcp" = same report rendered in chat; "bare" = no chrome. */
  frame?: FrameKind;
  loading?: boolean;
  /** min body height so skeleton and chart occupy the same space (no shift). */
  bodyHeight?: number;
  /** Fill the parent's height (resizable dashboard tile): the frame stretches to
      100% and the body flexes; children get the measured body height. */
  fill?: boolean;
  inStagger?: boolean;
  children?: ChartFrameChildren;
  className?: string;
}

/* ChartFrame — the shared chrome around every widget. A Report rendered on a
   dashboard is a Tile (frame="tile"); the SAME report rendered in chat is an
   MCP app (frame="mcp") with Save/Edit in the footer. One component, two
   frames — never fork the widget (see CLAUDE.md vocabulary). */
export function ChartFrame({
  title,
  subtitle,
  provenance,
  actions,
  footer,
  frame = "tile",
  loading = false,
  bodyHeight = 240,
  fill = false,
  inStagger = false,
  children,
  className,
}: ChartFrameProps) {
  const isMcp = frame === "mcp";
  const bare = frame === "bare";
  const [bodyRef, { height: measuredHeight }] = useElementSize<HTMLDivElement>();

  // In fill mode the body flexes and we feed children its measured height; the
  // skeleton uses the same height so there's no shift when data arrives.
  const childHeight = fill ? measuredHeight : bodyHeight;
  const renderChildren = () => {
    if (typeof children === "function") return childHeight > 0 || !fill ? children(childHeight) : null;
    return children;
  };

  return (
    <motion.section
      variants={fadeUp}
      initial={inStagger ? undefined : "hidden"}
      animate={inStagger ? undefined : "visible"}
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        height: fill ? "100%" : undefined,
        background: bare ? "transparent" : "var(--surface)",
        border: bare ? "none" : `1px solid ${isMcp ? "var(--primary-soft)" : "var(--hairline)"}`,
        borderRadius: bare ? 0 : "var(--r-lg)",
        boxShadow: bare ? "none" : "var(--shadow-sm)",
        overflow: "hidden",
        minWidth: 0,
      }}
    >
      {/* header */}
      {!bare && (
        <header
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "var(--s-3)",
            padding: "var(--s-4) var(--s-4) var(--s-3)",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: 15, fontWeight: 650, lineHeight: 1.25, margin: 0 }}>{title}</h3>
            {subtitle && (
              <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "3px 0 0", lineHeight: 1.4 }}>{subtitle}</p>
            )}
          </div>
          {actions && <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 6 }}>{actions}</div>}
        </header>
      )}

      {/* body */}
      <div
        ref={bodyRef}
        style={{
          padding: bare ? 0 : "0 var(--s-4)",
          position: "relative",
          ...(fill ? { flex: 1, minHeight: 0 } : { minHeight: bodyHeight }),
        }}
      >
        {loading ? <ChartSkeleton height={fill ? "100%" : bodyHeight} /> : renderChildren()}
      </div>

      {/* footer — single row for tiles (provenance ellipsizes); the MCP frame
          with actions stacks provenance above the buttons so a narrow chat app
          keeps the source readable and never crowds Save/Edit onto two lines. */}
      {(provenance || footer) && !loading && (
        <footer
          style={{
            display: "flex",
            flexDirection: isMcp && footer ? "column" : "row",
            alignItems: isMcp && footer ? "stretch" : "center",
            justifyContent: "space-between",
            gap: "var(--s-2)",
            padding: "var(--s-3) var(--s-4)",
            marginTop: "var(--s-3)",
            borderTop: bare ? "none" : "1px solid var(--hairline-2)",
          }}
        >
          {provenance ? (
            <div style={{ flex: isMcp && footer ? "none" : 1, minWidth: 0 }}>
              <ProvenanceLine provenance={provenance} />
            </div>
          ) : (
            !(isMcp && footer) && <span />
          )}
          {footer && <div style={{ display: "flex", gap: 8, flexShrink: 0, justifyContent: "flex-end" }}>{footer}</div>}
        </footer>
      )}
    </motion.section>
  );
}

/* A chart-shaped shimmer: axis + rising bars. Used while a widget's data loads.
   Bars stagger in for a "drawing" feel; heights are static (deterministic) to
   avoid layout randomness. */
export function ChartSkeleton({ height = 240 }: { height?: number | string }) {
  const bars = [40, 62, 48, 78, 55, 88, 70, 95];
  return (
    <div
      aria-hidden
      style={{ display: "flex", flexDirection: "column", height, minHeight: 0, paddingBottom: "var(--s-4)", gap: "var(--s-3)" }}
    >
      <Skeleton width={90} height={12} shape="text" />
      <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 10 }}>
        {bars.map((h, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0.4, opacity: 0.5, transformOrigin: "bottom" }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: i * 0.05, repeat: Infinity, repeatType: "mirror", repeatDelay: 0.4 }}
            style={{ flex: 1, height: `${h}%`, minWidth: 0 }}
          >
            <Skeleton height="100%" radius="var(--r-sm)" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
