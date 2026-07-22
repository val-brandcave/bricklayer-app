"use client";

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { KpiValue } from "@/components/atoms/KpiValue";

export type KpiDelta = { direction: "up" | "down" | "flat"; value: string; goodWhenUp?: boolean };

export interface KpiVizProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delta?: KpiDelta;
  caption?: string;
  height?: number;
}

const DELTA_ICON: Record<KpiDelta["direction"], LucideIcon> = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: Minus,
};

function deltaColor(d: KpiDelta): string {
  if (d.direction === "flat") return "var(--muted)";
  const goodWhenUp = d.goodWhenUp ?? true;
  const isGood = d.direction === "up" ? goodWhenUp : !goodWhenUp;
  return isGood ? "var(--up)" : "var(--down)";
}

/* KPI widget — the headline single figure rendered inside a widget frame
   (as opposed to StatTile, which is its own card). Big count-up number,
   optional delta chip and caption. */
export function KpiViz({ value, prefix, suffix, decimals = 0, delta, caption, height = 240 }: KpiVizProps) {
  return (
    <div
      data-kind="number"
      data-name={caption || undefined}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "var(--s-3)",
        // Size to the tile's measured body (not a min that can grow past it):
        // clip rather than bleed over the footer when a tile is resized short.
        height,
        overflow: "hidden",
        paddingBottom: "var(--s-2)",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
        <KpiValue value={value} prefix={prefix} suffix={suffix} decimals={decimals} size={46} />
        {delta && (
          <span
            className="tnum"
            style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 14, fontWeight: 650, color: deltaColor(delta) }}
          >
            {(() => {
              const DI = DELTA_ICON[delta.direction];
              return <DI size={16} strokeWidth={2.5} aria-hidden />;
            })()}
            {delta.value}
          </span>
        )}
      </div>
      {caption && <span style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.45 }}>{caption}</span>}
    </div>
  );
}
