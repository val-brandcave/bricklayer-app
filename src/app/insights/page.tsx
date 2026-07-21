"use client";

import { useCallback, useMemo, useState } from "react";
import { InsightsTemplate } from "@/templates/InsightsTemplate";
import { ReportPreviewModal } from "@/components/organisms/ReportPreviewModal";
import { useInsights } from "@/hooks/useInsights";
import { useReports } from "@/hooks/useReports";
import { useDashboards } from "@/hooks/useDashboards";
import { useUIStore } from "@/store";
import type { Report, Tile } from "@/types";

/* Insights — the per-lens opinion layer. Master-detail of findings with
   Bricklayer's self-critique. Follow-ups hand off to the co-working assistant;
   a finding can open its related report as a live preview. */
export default function InsightsPage() {
  const lens = useUIStore((s) => s.lens);
  const openChat = useUIStore((s) => s.openChat);
  const { isLoading, lensInsights, focused, tally, focusInsight, dismissInsight } = useInsights();
  const { reports } = useReports();
  const { lensDashboards, addTile } = useDashboards();

  const [preview, setPreview] = useState<Report | null>(null);

  const onOpenReport = useCallback(
    (reportId: string) => {
      const report = reports.find((r) => r.id === reportId);
      if (report) setPreview(report);
    },
    [reports],
  );

  const onFollowUp = useCallback((prompt: string) => openChat(prompt), [openChat]);

  const containingIds = useMemo(() => {
    if (!preview) return new Set<string>();
    return new Set(lensDashboards.filter((d) => d.tiles.some((t) => t.reportId === preview.id)).map((d) => d.id));
  }, [preview, lensDashboards]);

  const handleAddToDashboard = useCallback(
    (dashboardId: string) => {
      if (!preview) return;
      const dash = lensDashboards.find((d) => d.id === dashboardId);
      const w = preview.widgetType === "kpi" || preview.widgetType === "gauge" ? 3 : 6;
      const h = preview.widgetType === "scenario" ? 4 : 3;
      const nextY = dash ? dash.tiles.reduce((max, t) => Math.max(max, t.y + t.h), 0) : 0;
      const tile: Tile = { reportId: preview.id, x: 0, y: nextY, w, h };
      addTile(dashboardId, tile);
    },
    [preview, lensDashboards, addTile],
  );

  return (
    <>
      <InsightsTemplate
        isLoading={isLoading}
        lens={lens}
        lensInsights={lensInsights}
        focused={focused}
        tally={tally}
        onFocus={focusInsight}
        onFollowUp={onFollowUp}
        onOpenReport={onOpenReport}
        onDismiss={dismissInsight}
      />
      <ReportPreviewModal
        report={preview}
        onClose={() => setPreview(null)}
        dashboards={lensDashboards}
        containingIds={containingIds}
        onAddToDashboard={handleAddToDashboard}
        onEdit={() => {}}
      />
    </>
  );
}
