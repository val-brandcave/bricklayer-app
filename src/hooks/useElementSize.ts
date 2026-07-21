"use client";

import { useEffect, useRef, useState } from "react";

export interface ElementSize {
  width: number;
  height: number;
}

/* Measures an element's content box via ResizeObserver. Used to feed a tile's
   real pixel height/width to its visualization so charts fill the resizable
   grid cell (both dimensions) instead of a fixed height. Updates are
   rAF-batched and rounded so a live resize doesn't thrash Recharts re-renders. */
export function useElementSize<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    let frame = 0;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const box = entry.contentRect;
      const width = Math.round(box.width);
      const height = Math.round(box.height);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // skip sub-2px noise to keep chart re-renders to a minimum
        setSize((prev) => (Math.abs(prev.width - width) < 2 && Math.abs(prev.height - height) < 2 ? prev : { width, height }));
      });
    });

    ro.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, []);

  return [ref, size] as const;
}
