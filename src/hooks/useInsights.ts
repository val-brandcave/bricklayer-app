"use client";

import { useEffect, useMemo, useState } from "react";
import { useInsightStore, useUIStore } from "@/store";
import type { Insight, Severity } from "@/types";

const SEVERITY_RANK: Record<Severity, number> = { high: 0, watch: 1, info: 2 };

/* Page hook for the Insights landing. Fetches insights, scopes them to the
   active lens, drops dismissed ones, orders by severity, and tracks the
   focused finding. Also derives the "today" severity tally for the header. */
export function useInsights() {
  const lens = useUIStore((s) => s.lens);
  const insights = useInsightStore((s) => s.insights);
  const loaded = useInsightStore((s) => s.loaded);
  const fetchInsights = useInsightStore((s) => s.fetchInsights);
  const dismissInsight = useInsightStore((s) => s.dismissInsight);

  const [focusedId, setFocusedId] = useState<string | null>(null);

  useEffect(() => {
    if (!loaded) fetchInsights();
  }, [loaded, fetchInsights]);

  const lensInsights = useMemo(
    () =>
      insights
        .filter((i) => i.lens === lens && !i.dismissed)
        .sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]),
    [insights, lens],
  );

  // Two tiers, segregated by trust: curated findings ("what stands out") and
  // discovered surprising links (the provisional, LLM-found tier). The focus
  // panel is shared; the list keeps the boundary visible.
  const findings = useMemo(() => lensInsights.filter((i) => i.origin === "curated"), [lensInsights]);
  const links = useMemo(() => lensInsights.filter((i) => i.origin === "discovered"), [lensInsights]);

  // Focus defaults to the first finding, then falls back to the first link.
  const focusOrder = useMemo(() => [...findings, ...links], [findings, links]);

  const focused = useMemo<Insight | null>(() => {
    if (focusedId) {
      const found = focusOrder.find((i) => i.id === focusedId);
      if (found) return found;
    }
    return focusOrder[0] ?? null;
  }, [focusedId, focusOrder]);

  const tally = useMemo(() => {
    const t = { high: 0, watch: 0, info: 0, surprising: links.length };
    findings.forEach((i) => t[i.severity]++);
    return t;
  }, [findings, links]);

  return {
    isLoading: !loaded,
    findings,
    links,
    focused,
    tally,
    focusInsight: setFocusedId,
    dismissInsight,
  };
}
