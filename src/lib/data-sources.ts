import type { DataSeriesKey } from "@/types";

/* Human labels for each bound data source, shown in the report editor's
   data-source picker. Some widget types (watchlist/scenario/map/table) read
   their collection directly and ignore the selected key. */
export const DATA_SOURCES: { key: DataSeriesKey; label: string }[] = [
  { key: "valueByClass", label: "Book value by asset class" },
  { key: "capRateByVintage", label: "Avg cap rate by vintage" },
  { key: "bookValueTrend", label: "Book value trend & at-risk" },
  { key: "valuationApproachMix", label: "Valuation approach mix" },
  { key: "pricePerSfByClass", label: "Price / SF by class" },
  { key: "valueVsCapByClass", label: "Value vs. cap rate (scatter)" },
  { key: "flightRiskByFloodZone", label: "Exposure by flood zone" },
  { key: "appraiserWorkload", label: "Appraiser workload" },
  { key: "stalenessByClassAge", label: "Staleness by class × age (matrix)" },
  { key: "correlationMatrix", label: "Correlation matrix" },
  { key: "extractionQa", label: "Extraction confidence" },
  { key: "riskWatchlist", label: "Risk watchlist (collection)" },
  { key: "directCapReprice", label: "Direct-cap reprice (scenario)" },
  { key: "propertyDistribution", label: "Property distribution (map)" },
];
