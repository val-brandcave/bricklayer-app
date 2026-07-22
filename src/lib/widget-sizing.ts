import type { Report } from "@/types";

type WidgetType = Report["widgetType"];

/* Per-widget grid sizing on the 12-column dashboard grid.
   - `min`  → the smallest [w, h] the tile may be resized to (RGL enforces it),
              chosen so each visualization stays legible at its floor.
   - `def`  → the size a tile is created at when added to a dashboard.
   One source of truth for the grid constraints AND the add-report flow. */

export interface WidgetSize {
  /** minimum [w, h] in grid units */
  min: [number, number];
  /** default [w, h] when first placed */
  def: [number, number];
}

const DEFAULT_SIZE: WidgetSize = { min: [3, 2], def: [6, 3] };

const SIZING: Partial<Record<WidgetType, WidgetSize>> = {
  // compact figures — can go small, but keep room for the label + count-up
  kpi: { min: [2, 2], def: [3, 2] },
  gauge: { min: [2, 2], def: [3, 2] },
  // dial + legend need horizontal room or the legend degrades
  pie: { min: [3, 3], def: [4, 3] },
  donut: { min: [3, 3], def: [4, 3] },
  // series charts read poorly below ~4 cols
  bar: { min: [3, 2], def: [6, 3] },
  hbar: { min: [4, 3], def: [6, 3] },
  line: { min: [4, 2], def: [6, 3] },
  area: { min: [4, 2], def: [6, 3] },
  scatter: { min: [4, 3], def: [6, 4] },
  // a 6-row correlation matrix + header needs 4 rows of height or the last row
  // and the provenance footer collide when shrunk
  heatmap: { min: [4, 4], def: [6, 4] },
  // dense, data-heavy surfaces need width + height
  table: { min: [5, 3], def: [12, 4] },
  watchlist: { min: [4, 3], def: [6, 4] },
  scenario: { min: [5, 4], def: [6, 4] },
  map: { min: [5, 3], def: [8, 5] },
};

export function widgetSize(type: WidgetType): WidgetSize {
  return SIZING[type] ?? DEFAULT_SIZE;
}
