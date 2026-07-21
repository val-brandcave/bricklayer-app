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
        .sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] || Number(b.isSurprisingLink) - Number(a.isSurprisingLink)),
    [insights, lens],
  );

  const focused = useMemo<Insight | null>(() => {
    if (focusedId) {
      const found = lensInsights.find((i) => i.id === focusedId);
      if (found) return found;
    }
    return lensInsights[0] ?? null;
  }, [focusedId, lensInsights]);

  const tally = useMemo(() => {
    const t = { high: 0, watch: 0, info: 0, surprising: 0 };
    lensInsights.forEach((i) => {
      t[i.severity]++;
      if (i.isSurprisingLink) t.surprising++;
    });
    return t;
  }, [lensInsights]);

  return {
    isLoading: !loaded,
    lensInsights,
    focused,
    tally,
    focusInsight: setFocusedId,
    dismissInsight,
  };
}
