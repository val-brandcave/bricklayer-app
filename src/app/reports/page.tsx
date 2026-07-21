"use client";

import { useCallback, useMemo, useState } from "react";
import { ReportsTemplate } from "@/templates/ReportsTemplate";
import { ReportPreviewModal } from "@/components/organisms/ReportPreviewModal";
import { ReportBuilderModal } from "@/components/organisms/ReportBuilderModal";
import type { ReportDraft } from "@/components/organisms/ReportBuilderModal";
import type { ReportLayout } from "@/components/molecules/ReportCard";
import { useReports } from "@/hooks/useReports";
import { useDashboards } from "@/hooks/useDashboards";
import { useUIStore } from "@/store";
import { LENSES } from "@/lib/lenses";
import type { Report, Tile } from "@/types";

/* Reports — the library. Browse/filter/search saved reports, preview any as a
   live Widget, add it to a dashboard, or open the shared editor to create/edit. */
export default function ReportsPage() {
  const lens = useUIStore((s) => s.lens);
  const { isLoading, filtered, reports, owners, types, filters, patch, reset, createReport, updateReport } = useReports();
  const { lensDashboards, addTile } = useDashboards();

  const [preview, setPreview] = useState<Report | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Report | null>(null);
  const [view, setView] = useState<ReportLayout>("grid");

  const containingIds = useMemo(() => {
    if (!preview) return new Set<string>();
    return new Set(lensDashboards.filter((d) => d.tiles.some((t) => t.reportId === preview.id)).map((d) => d.id));
  }, [preview, lensDashboards]);

  const openNew = useCallback(() => {
    setEditing(null);
    setEditorOpen(true);
  }, []);

  const openEdit = useCallback((report: Report) => {
    setPreview(null);
    setEditing(report);
    setEditorOpen(true);
  }, []);

  const handleSave = useCallback(
    (draft: ReportDraft, existingId: string | null) => {
      if (existingId) {
        updateReport(existingId, { title: draft.title, subtitle: draft.subtitle || undefined, widgetType: draft.widgetType, dataKey: draft.dataKey, tags: draft.tags });
      } else {
        const meta = LENSES[lens];
        createReport({
          title: draft.title,
          subtitle: draft.subtitle || undefined,
          widgetType: draft.widgetType,
          dimensions: [],
          measures: [],
          dataKey: draft.dataKey,
          ownerId: meta.userId,
          ownerName: meta.userName,
          origin: "user",
          tags: draft.tags,
          lens,
          provenance: { label: "Built in the report editor" },
        });
      }
      setEditorOpen(false);
    },
    [lens, createReport, updateReport],
  );

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
      <ReportsTemplate
        isLoading={isLoading}
        filtered={filtered}
        totalCount={reports.length}
        owners={owners}
        types={types}
        filters={filters}
        patch={patch}
        reset={reset}
        view={view}
        onViewChange={setView}
        onOpen={setPreview}
        onNew={openNew}
      />
      <ReportPreviewModal
        report={preview}
        onClose={() => setPreview(null)}
        dashboards={lensDashboards}
        containingIds={containingIds}
        onAddToDashboard={handleAddToDashboard}
        onEdit={openEdit}
      />
      <ReportBuilderModal open={editorOpen} onClose={() => setEditorOpen(false)} report={editing} lens={lens} onSave={handleSave} />
    </>
  );
}
