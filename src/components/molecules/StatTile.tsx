"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { KpiValue } from "@/components/atoms/KpiValue";
import { ProvenanceLine } from "@/components/atoms/ProvenanceLine";
import { Skeleton } from "@/components/atoms/Skeleton";
import { fadeUp } from "@/lib/motion";
import type { Provenance } from "@/types";

export type DeltaDirection = "up" | "down" | "flat";

export interface StatTileProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  icon?: LucideIcon;
  caption?: string;
  delta?: { direction: DeltaDirection; value: string; /** up=good by default; set false to invert coloring */ goodWhenUp?: boolean };
  provenance?: Provenance;
  loading?: boolean;
  /** opt this tile into a parent stagger container instead of animating solo */
  inStagger?: boolean;
}

const DELTA_ICON: Record<DeltaDirection, LucideIcon> = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: Minus,
};

function deltaColor(d: NonNullable<StatTileProps["delta"]>): string {
  if (d.direction === "flat") return "var(--muted)";
  const goodWhenUp = d.goodWhenUp ?? true;
  const isGood = d.direction === "up" ? goodWhenUp : !goodWhenUp;
  return isGood ? "var(--up)" : "var(--down)";
}

/* StatTile — a single headline metric on a card. The KPI number counts up on
   mount; while `loading`, it shows shimmer skeletons in the same layout so
   there's no shift when data arrives. */
export function StatTile({
  label,
  value,
  prefix,
  suffix,
  decimals = 0,
  icon: Icon,
  caption,
  delta,
  provenance,
  loading = false,
  inStagger = false,
}: StatTileProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial={inStagger ? undefined : "hidden"}
      animate={inStagger ? undefined : "visible"}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--hairline)",
        borderRadius: "var(--r-lg)",
        padding: "var(--s-5)",
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--s-3)",
        minWidth: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", letterSpacing: "0.01em" }}>{label}</span>
        {Icon && (
          <span
            style={{
              display: "grid",
              placeItems: "center",
              width: 30,
              height: 30,
              borderRadius: "var(--r-sm)",
              background: "var(--primary-soft)",
              color: "var(--primary)",
              flexShrink: 0,
            }}
          >
            <Icon size={16} strokeWidth={2} aria-hidden />
          </span>
        )}
      </div>

      {loading ? (
        <Skeleton width="55%" height={30} radius="var(--r-sm)" />
      ) : (
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
          <KpiValue value={value} prefix={prefix} suffix={suffix} decimals={decimals} size={30} />
          {delta && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 2,
                fontSize: 12.5,
                fontWeight: 600,
                color: deltaColor(delta),
              }}
              className="tnum"
            >
              {(() => {
                const DI = DELTA_ICON[delta.direction];
                return <DI size={14} strokeWidth={2.5} aria-hidden />;
              })()}
              {delta.value}
            </span>
          )}
        </div>
      )}

      {loading ? (
        <Skeleton width="72%" height={11} shape="text" />
      ) : (
        caption && <span style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.45 }}>{caption}</span>
      )}

      {!loading && provenance && <ProvenanceLine provenance={provenance} />}
    </motion.div>
  );
}
