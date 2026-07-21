import type { AssetClass, FloodZone, ValuationStatus } from "@/types";
import type { PillTone } from "@/components/atoms/Pill";

/* Display metadata for the property domain — labels + token tones shared by the
   Properties table, cards and workspace so the vocabulary stays consistent.
   Colors resolve through tokens only (no literals). */

export const CLASS_LABEL: Record<AssetClass, string> = {
  residential: "Residential",
  office: "Office",
  retail: "Retail",
  industrial: "Industrial",
  multifamily: "Multifamily",
  hospitality: "Hospitality",
  land: "Land",
};

export const STATUS_META: Record<ValuationStatus, { label: string; tone: PillTone }> = {
  fresh: { label: "Fresh", tone: "success" },
  aging: { label: "Aging", tone: "warning" },
  stale: { label: "Stale", tone: "danger" },
};

export const FLOOD_LABEL: Record<FloodZone, string> = {
  X: "Zone X",
  AE: "Zone AE",
  A: "Zone A",
  VE: "Zone VE",
  none: "No zone",
};

/** High-risk FEMA zones worth flagging (vs. the minimal-hazard X / none). */
export function isFloodHazard(zone: FloodZone): boolean {
  return zone === "AE" || zone === "A" || zone === "VE";
}

/** Risk band → token tone, for the 0–100 score badge. */
export function riskTone(score: number): PillTone {
  if (score >= 70) return "danger";
  if (score >= 50) return "warning";
  return "success";
}

/** A token color string for a risk score (used for accents / bar fills). */
export function riskColor(score: number): string {
  if (score >= 70) return "var(--danger)";
  if (score >= 50) return "var(--warning)";
  return "var(--success)";
}
