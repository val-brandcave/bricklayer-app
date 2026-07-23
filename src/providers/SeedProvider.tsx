"use client";

import { useEffect, useState } from "react";
import { adapter } from "@/data/adapters";
import { useUIStore } from "@/store/ui.store";
import type { Lens } from "@/types";
import { EmblemMark } from "@/components/atoms/EmblemMark";

/* Minimum time the loader stays on screen, so it reads as a considered
   "preparing your book" moment in the demo rather than flashing by. */
const MIN_LOADER_MS = 1500;

/* Seeds the mock adapter (localStorage) on mount and gates the app behind a
   calm loader until adapter.seed() resolves. Also restores the saved lens. */
export function SeedProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const setLens = useUIStore((s) => s.setLens);

  useEffect(() => {
    let alive = true;
    (async () => {
      const saved = (typeof localStorage !== "undefined" &&
        localStorage.getItem("bricklayer:lens")) as Lens | null;
      if (saved) useUIStore.setState({ lens: saved });
      const linger = new Promise((resolve) => setTimeout(resolve, MIN_LOADER_MS));
      await Promise.all([adapter.seed(), linger]);
      if (alive) setReady(true);
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          background: "var(--canvas)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <EmblemMark size={44} animation="build" />
          <span style={{ color: "var(--muted)", fontSize: 13, letterSpacing: "0.02em" }}>
            Assembling your book…
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
