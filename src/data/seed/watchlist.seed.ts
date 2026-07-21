import type { WatchlistItem } from "@/types";

const T = 1_767_225_600_000;

/* Scored 0-100 risk watchlist with a WHY column, per the POC.
   Lens tags let the Insights landing surface the relevant subset. */
export const seedWatchlist: WatchlistItem[] = [
  { id: "wl-001", propertyId: "prop-001", propertyName: "1400 Market St", location: "Office · San Francisco, CA", assetClass: "office", score: 92, severity: "high", reasons: ["Cap rate 180bps below class avg", "Valuation stale 31mo", "Thin comps (4, CoV 28%)"], lens: "credit-officer", createdAt: T },
  { id: "wl-002", propertyId: "prop-012", propertyName: "Metro Center Mall", location: "Retail · Phoenix, AZ", assetClass: "retail", score: 88, severity: "high", reasons: ["Occupancy 63%", "Valuation stale 34mo", "Cap rate 8.9% rising"], lens: "credit-officer", createdAt: T },
  { id: "wl-003", propertyId: "prop-005", propertyName: "The Beacon Hotel", location: "Hospitality · Miami, FL", assetClass: "hospitality", score: 83, severity: "high", reasons: ["Coastal flood zone VE", "Valuation stale 28mo", "Occupancy 71%"], lens: "portfolio-manager", createdAt: T },
  { id: "wl-004", propertyId: "prop-014", propertyName: "Pioneer Square Office", location: "Office · Seattle, WA", assetClass: "office", score: 79, severity: "high", reasons: ["Occupancy 72%", "Valuation stale 27mo", "Sales-comp heavy, CoV 20%"], lens: "credit-officer", createdAt: T },
  { id: "wl-005", propertyId: "prop-002", propertyName: "88 Harborview", location: "Retail · Seattle, WA", assetClass: "retail", score: 74, severity: "watch", reasons: ["Flood zone AE", "Thin comps", "Aging valuation 19mo"], lens: "chief-appraiser", createdAt: T },
  { id: "wl-006", propertyId: "prop-020", propertyName: "Greenfield Land Parcel", location: "Land · Columbus, OH", assetClass: "land", score: 71, severity: "watch", reasons: ["Valuation stale 41mo", "Cost approach only", "Extraction confidence 70%"], lens: "chief-appraiser", createdAt: T },
  { id: "wl-007", propertyId: "prop-019", propertyName: "Coastal Palms Resort", location: "Hospitality · San Diego, CA", assetClass: "hospitality", score: 69, severity: "watch", reasons: ["Coastal flood zone VE", "Occupancy 78%", "Aging 22mo"], lens: "portfolio-manager", createdAt: T },
  { id: "wl-008", propertyId: "prop-006", propertyName: "Riverside Commons", location: "Office · Portland, OR", assetClass: "office", score: 66, severity: "watch", reasons: ["Occupancy 79%", "Aging 22mo", "Cap rate 7.8%"], lens: "portfolio-manager", createdAt: T },
  { id: "wl-009", propertyId: "prop-016", propertyName: "Magnolia Retail Row", location: "Retail · Charlotte, NC", assetClass: "retail", score: 63, severity: "watch", reasons: ["Flood zone AE", "Aging 23mo"], lens: "chief-appraiser", createdAt: T },
  { id: "wl-010", propertyId: "prop-003", propertyName: "Cedar Industrial Park", location: "Industrial · Denver, CO", assetClass: "industrial", score: 61, severity: "watch", reasons: ["Valuation approach variance", "Aging 21mo"], lens: "portfolio-manager", createdAt: T },
  { id: "wl-011", propertyId: "prop-009", propertyName: "Sunset Plaza", location: "Retail · Los Angeles, CA", assetClass: "retail", score: 57, severity: "watch", reasons: ["Sales-comp reliance", "Aging 20mo"], lens: "chief-appraiser", createdAt: T },
  { id: "wl-012", propertyId: "prop-018", propertyName: "Oldtown Mixed-Use", location: "Office · Alexandria, VA", assetClass: "office", score: 52, severity: "watch", reasons: ["Flood zone AE", "Occupancy 86%"], lens: "credit-officer", createdAt: T },
];
