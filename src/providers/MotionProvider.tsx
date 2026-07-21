"use client";

import { MotionConfig } from "framer-motion";
import { T_BASE } from "@/lib/motion";

/* App-wide motion configuration.
   `reducedMotion="user"` makes Framer Motion honor the OS
   prefers-reduced-motion setting for every animation in the tree —
   so components never branch on it themselves. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={T_BASE}>
      {children}
    </MotionConfig>
  );
}
