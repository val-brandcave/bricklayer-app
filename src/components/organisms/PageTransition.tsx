"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { pageVariants } from "@/lib/motion";

/* PageTransition — animates the main content on every route change. Keyed on
   pathname so each destination re-enters with a fade-up. Enter-only (no exit)
   because the App Router swaps route subtrees synchronously; a keyed remount
   is the reliable, jank-free pattern. Reduced motion is honored globally via
   MotionConfig. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <motion.div
      key={pathname}
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      style={{ minHeight: "100%" }}
    >
      {children}
    </motion.div>
  );
}
