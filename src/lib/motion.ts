/* ============================================================
   Bricklayer — motion system (single source of truth for animation)
   Framer Motion variants, durations, and easings that MIRROR the CSS
   motion tokens in tokens.css. Components animate through these — never
   with ad-hoc durations/easings — so one edit re-times the whole app.

   Reduced motion is handled globally by <MotionConfig reducedMotion="user">
   in the root layout, plus the CSS @media guard in globals.css. Do not
   branch on prefers-reduced-motion inside components.
   ============================================================ */

import type { Transition, Variants } from "framer-motion";

/* ---- durations (seconds — Framer's unit; the CSS tokens are ms) ---- */
export const DUR = {
  fast: 0.12, // --dur-fast: micro state (hover, press)
  base: 0.16, // --dur: default UI transition
  med: 0.28, // panels, cards entering
  slow: 0.44, // hero / route-level moments
} as const;

/* ---- easings ---- */
export const EASE = {
  standard: [0.4, 0, 0.2, 1], // --ease: everyday motion
  out: [0.16, 1, 0.3, 1], // decisive entrances (expo-out feel)
  inOut: [0.65, 0, 0.35, 1], // symmetrical, for reversible moves
} as const;

/* ---- spring presets (for gestures & things that should feel physical) ---- */
export const SPRING = {
  soft: { type: "spring", stiffness: 260, damping: 30 } as Transition,
  snappy: { type: "spring", stiffness: 420, damping: 32 } as Transition,
  gentle: { type: "spring", stiffness: 170, damping: 26 } as Transition,
} as const;

/* ---- shared transitions ---- */
export const T_BASE: Transition = { duration: DUR.base, ease: EASE.standard };
export const T_ENTER: Transition = { duration: DUR.med, ease: EASE.out };

/* ============================================================
   Reusable variants. Import these instead of re-declaring motion.
   ============================================================ */

/** Fade + rise. The house entrance for cards, tiles, sections. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: T_ENTER },
  exit: { opacity: 0, y: 4, transition: T_BASE },
};

/** Plain fade — for overlays, text swaps, low-key elements. */
export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: T_ENTER },
  exit: { opacity: 0, transition: T_BASE },
};

/** Scale-in from 96% — modals, popovers, KPI reveals. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: T_ENTER },
  exit: { opacity: 0, scale: 0.98, transition: T_BASE },
};

/** Right-docked panel (co-working assistant). */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: DUR.med, ease: EASE.out } },
  exit: { opacity: 0, x: 24, transition: T_BASE },
};

/**
 * Stagger container — parent orchestrates child entrances.
 * Pair with `staggerItem` (or any *-with-`hidden`/`visible` variant) on children.
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
  },
};

/** A child of `staggerContainer`. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: T_ENTER },
};

/** Route/page-level transition (used by PageTransition). */
export const pageVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: DUR.med, ease: EASE.out } },
  exit: { opacity: 0, y: -6, transition: { duration: DUR.fast, ease: EASE.standard } },
};

/* ---- standard hover/press gestures for interactive surfaces ---- */
export const pressable = {
  whileHover: { y: -1 },
  whileTap: { scale: 0.97 },
  transition: SPRING.snappy,
} as const;

export const liftable = {
  whileHover: { y: -3 },
  transition: SPRING.soft,
} as const;
