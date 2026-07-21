"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { DUR, EASE } from "@/lib/motion";

export interface KpiValueProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  /** disable the count-up (e.g. inside a dense table) */
  animate?: boolean;
  size?: number; // px
  weight?: number;
  color?: string; // token var(); defaults to --ink
  className?: string;
}

function fmt(n: number, decimals: number) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/* The headline number. Always tabular-nums (Geist Sans — no mono, ever).
   Counts up from 0 on mount for a live, "just-computed" feel; honors
   prefers-reduced-motion by rendering the final value immediately. */
export function KpiValue({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  animate: doAnimate = true,
  size = 34,
  weight = 680,
  color = "var(--ink)",
  className,
}: KpiValueProps) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(reduce || !doAnimate ? value : 0);
  const text = useTransform(mv, (v) => `${prefix}${fmt(v, decimals)}${suffix}`);

  useEffect(() => {
    if (reduce || !doAnimate) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, {
      duration: DUR.slow + 0.3,
      ease: EASE.out,
    });
    return () => controls.stop();
  }, [value, doAnimate, reduce, mv]);

  return (
    <motion.span
      className={`tnum ${className ?? ""}`}
      style={{
        fontSize: size,
        fontWeight: weight,
        lineHeight: 1.05,
        letterSpacing: "-0.02em",
        color,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {text}
    </motion.span>
  );
}
