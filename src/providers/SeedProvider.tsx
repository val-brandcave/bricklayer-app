"use client";

import { useEffect, useState } from "react";
import { adapter } from "@/data/adapters";
import { useUIStore } from "@/store/ui.store";
import type { Lens } from "@/types";
import { EmblemMark } from "@/components/atoms/EmblemMark";

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
      await adapter.seed();
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
            Preparing your book…
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
