"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { InsightsTemplate } from "@/templates/InsightsTemplate";
import { useInsights } from "@/hooks/useInsights";
import { useReports } from "@/hooks/useReports";
import { useDashboards } from "@/hooks/useDashboards";
import { useUIStore } from "@/store";
import type { Insight, Tile } from "@/types";

/* Insights — the per-lens opinion layer. Master-detail of the two insight
   tiers (curated findings + discovered surprising links) with Bricklayer's
   self-critique over a live chart. Follow-ups and the free-form ask hand off to
   the co-working assistant; a finding can Pin its chart to the lens board or
   open the full board; a surprising link only opens the board (scrutinise, not
   operationalise — see the type model). */
export default function InsightsPage() {
  const router = useRouter();
  const lens = useUIStore((s) => s.lens);
  const openChat = useUIStore((s) => s.openChat);
  const { isLoading, findings, links, focused, tally, focusInsight, dismissInsight } = useInsights();
  const { reports } = useReports();
  const { lensDashboards, addTile } = useDashboards();

  // The chart the focused insight's Read reasons over.
  const focusedReport = useMemo(
    () => reports.find((r) => r.id === focused?.relatedReportId) ?? null,
    [reports, focused],
  );

  const onFollowUp = useCallback((prompt: string) => openChat(prompt), [openChat]);
  const onAsk = useCallback((prompt: string) => openChat(prompt), [openChat]);

  // "Open full board" → the lens's default dashboard.
  const onOpenBoard = useCallback(() => router.push("/dashboards"), [router]);

  // "Pin to board" (curated findings only) → append the insight's chart as a
  // tile on the lens's default board, sizing by widget type as the grid does.
  const onPin = useCallback(
    (insight: Insight) => {
      const board = lensDashboards.find((d) => d.isDefault) ?? lensDashboards[0];
      const report = reports.find((r) => r.id === insight.relatedReportId);
      if (!board || !report) return;
      const w = report.widgetType === "kpi" || report.widgetType === "gauge" ? 3 : 6;
      const h = report.widgetType === "scenario" ? 4 : 3;
      const nextY = board.tiles.reduce((max, t) => Math.max(max, t.y + t.h), 0);
      const tile: Tile = { reportId: report.id, x: 0, y: nextY, w, h };
      addTile(board.id, tile);
    },
    [lensDashboards, reports, addTile],
  );

  return (
    <InsightsTemplate
      isLoading={isLoading}
      lens={lens}
      findings={findings}
      links={links}
      focused={focused}
      focusedReport={focusedReport}
      tally={tally}
      onFocus={focusInsight}
      onFollowUp={onFollowUp}
      onAsk={onAsk}
      onOpenBoard={onOpenBoard}
      onPin={onPin}
      onDismiss={dismissInsight}
    />
  );
}
