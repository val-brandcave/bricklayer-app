"use client";

import { useCallback, useState } from "react";
import { DashboardTemplate } from "@/templates/DashboardTemplate";
import { AddReportModal } from "@/components/organisms/AddReportModal";
import { useDashboards } from "@/hooks/useDashboards";
import { useUIStore } from "@/store";
import { LENSES } from "@/lib/lenses";
import { widgetSize } from "@/lib/widget-sizing";
import type { Tile } from "@/types";

/* Dashboards — a saved collection of reports on a grid, scoped to the active
   lens. Page composes the DashboardTemplate with the useDashboards hook and
   owns the add-report flow + new-dashboard creation. */
export default function DashboardsPage() {
  const lens = useUIStore((s) => s.lens);
  const { isLoading, active, lensDashboards, tiles, reports, selectDashboard, toggleFavorite, addTile, removeTile, updateTiles, createDashboard } = useDashboards();
  const [pickerOpen, setPickerOpen] = useState(false);

  const presentIds = new Set(active?.tiles.map((t) => t.reportId) ?? []);

  const handleNewDashboard = useCallback(async () => {
    const meta = LENSES[lens];
    const created = await createDashboard({
      name: "Untitled dashboard",
      description: "",
      lens,
      ownerId: meta.userId,
      ownerName: meta.userName,
      access: "private",
      isDefault: false,
      favorite: false,
      ephemeral: false,
      origin: "user",
      tiles: [],
    });
    selectDashboard(created.id);
  }, [lens, createDashboard, selectDashboard]);

  const handleAddTile = useCallback(
    (reportId: string) => {
      if (!active) return;
      const report = reports.find((r) => r.id === reportId);
      const [w, h] = widgetSize(report?.widgetType ?? "bar").def;
      const nextY = active.tiles.reduce((max, t) => Math.max(max, t.y + t.h), 0);
      const tile: Tile = { reportId, x: 0, y: nextY, w, h };
      addTile(active.id, tile);
    },
    [active, reports, addTile],
  );

  return (
    <>
      <DashboardTemplate
        isLoading={isLoading}
        active={active}
        lensDashboards={lensDashboards}
        tiles={tiles}
        onSelect={selectDashboard}
        onToggleFavorite={toggleFavorite}
        onRemoveTile={(reportId) => active && removeTile(active.id, reportId)}
        onTilesChange={(tiles) => active && updateTiles(active.id, tiles)}
        onAddReport={() => setPickerOpen(true)}
        onNewDashboard={handleNewDashboard}
      />
      <AddReportModal open={pickerOpen} onClose={() => setPickerOpen(false)} reports={reports} presentIds={presentIds} onAdd={handleAddTile} />
    </>
  );
}
