import type { Property } from "@/types";

const T = 1_767_225_600_000; // 2026-01-01

/* Representative drill-down sample of the book. Cross-referenced to
   appraisals by `latestAppraisalId`. Risk scores / staleness are tuned to
   the discovery narrative (a stale, mispriced office asset leads the watchlist). */
export const seedProperties: Property[] = [
  {
    id: "prop-001", name: "1400 Market St", address: "1400 Market St", city: "San Francisco", state: "CA",
    lat: 37.7767, lng: -122.4172, assetClass: "office", yearBuilt: 1998, sfArea: 412_000,
    bookValue: 54_200_000, capRate: 11.4, pricePerSF: 131, occupancy: 68, noi: 4_820_000,
    floodZone: "X", zoning: "C-3-G", valuationStatus: "stale", monthsSinceValuation: 31,
    riskScore: 92, latestAppraisalId: "appr-001", createdAt: T,
  },
  {
    id: "prop-002", name: "88 Harborview", address: "88 Harborview Dr", city: "Seattle", state: "WA",
    lat: 47.6032, lng: -122.3303, assetClass: "retail", yearBuilt: 2006, sfArea: 96_400,
    bookValue: 22_140_000, capRate: 7.1, pricePerSF: 230, occupancy: 84, noi: 2_140_000,
    floodZone: "AE", zoning: "NC-3", valuationStatus: "aging", monthsSinceValuation: 19,
    riskScore: 74, latestAppraisalId: "appr-002", createdAt: T,
  },
  {
    id: "prop-003", name: "Cedar Industrial Park", address: "500 Cedar Logistics Way", city: "Denver", state: "CO",
    lat: 39.7392, lng: -104.9903, assetClass: "industrial", yearBuilt: 2015, sfArea: 318_000,
    bookValue: 52_800_000, capRate: 5.9, pricePerSF: 166, occupancy: 96, noi: 3_310_000,
    floodZone: "X", zoning: "I-B", valuationStatus: "aging", monthsSinceValuation: 21,
    riskScore: 61, latestAppraisalId: "appr-003", createdAt: T,
  },
  {
    id: "prop-004", name: "Northgate Apartments", address: "210 Northgate Blvd", city: "Austin", state: "TX",
    lat: 30.2672, lng: -97.7431, assetClass: "multifamily", yearBuilt: 2019, sfArea: 264_000,
    bookValue: 61_500_000, capRate: 5.2, pricePerSF: 233, occupancy: 94, noi: 3_198_000,
    floodZone: "X", zoning: "MF-4", valuationStatus: "fresh", monthsSinceValuation: 7,
    riskScore: 38, latestAppraisalId: "appr-004", createdAt: T,
  },
  {
    id: "prop-005", name: "The Beacon Hotel", address: "77 Ocean Pkwy", city: "Miami", state: "FL",
    lat: 25.7617, lng: -80.1918, assetClass: "hospitality", yearBuilt: 2011, sfArea: 148_000,
    bookValue: 44_900_000, capRate: 8.6, pricePerSF: 303, occupancy: 71, noi: 3_861_000,
    floodZone: "VE", zoning: "T6-8", valuationStatus: "stale", monthsSinceValuation: 28,
    riskScore: 83, latestAppraisalId: "appr-005", createdAt: T,
  },
  {
    id: "prop-006", name: "Riverside Commons", address: "1200 Riverside Ave", city: "Portland", state: "OR",
    lat: 45.5152, lng: -122.6784, assetClass: "office", yearBuilt: 2003, sfArea: 187_000,
    bookValue: 38_200_000, capRate: 7.8, pricePerSF: 204, occupancy: 79, noi: 2_980_000,
    floodZone: "X", zoning: "CX", valuationStatus: "aging", monthsSinceValuation: 22,
    riskScore: 66, latestAppraisalId: "appr-006", createdAt: T,
  },
  {
    id: "prop-007", name: "Elmwood Residences", address: "45 Elmwood Ln", city: "Chicago", state: "IL",
    lat: 41.8781, lng: -87.6298, assetClass: "residential", yearBuilt: 2016, sfArea: 122_000,
    bookValue: 29_600_000, capRate: 5.5, pricePerSF: 243, occupancy: 97, noi: 1_628_000,
    floodZone: "X", zoning: "RM-5", valuationStatus: "fresh", monthsSinceValuation: 9,
    riskScore: 29, latestAppraisalId: "appr-007", createdAt: T,
  },
  {
    id: "prop-008", name: "Gateway Logistics", address: "3400 Gateway Dr", city: "Atlanta", state: "GA",
    lat: 33.749, lng: -84.388, assetClass: "industrial", yearBuilt: 2018, sfArea: 402_000,
    bookValue: 47_100_000, capRate: 5.4, pricePerSF: 117, occupancy: 99, noi: 2_543_000,
    floodZone: "X", zoning: "I-1", valuationStatus: "fresh", monthsSinceValuation: 5,
    riskScore: 24, latestAppraisalId: "appr-008", createdAt: T,
  },
  {
    id: "prop-009", name: "Sunset Plaza", address: "9000 Sunset Blvd", city: "Los Angeles", state: "CA",
    lat: 34.0901, lng: -118.3859, assetClass: "retail", yearBuilt: 2001, sfArea: 141_000,
    bookValue: 33_400_000, capRate: 7.1, pricePerSF: 237, occupancy: 88, noi: 2_371_000,
    floodZone: "X", zoning: "C4", valuationStatus: "aging", monthsSinceValuation: 20,
    riskScore: 57, latestAppraisalId: "appr-009", createdAt: T,
  },
  {
    id: "prop-010", name: "Harbor Point Tower", address: "1 Harbor Point", city: "Boston", state: "MA",
    lat: 42.3601, lng: -71.0589, assetClass: "office", yearBuilt: 2009, sfArea: 356_000,
    bookValue: 88_700_000, capRate: 6.1, pricePerSF: 249, occupancy: 91, noi: 5_410_000,
    floodZone: "AE", zoning: "D-8", valuationStatus: "fresh", monthsSinceValuation: 6,
    riskScore: 41, latestAppraisalId: "appr-010", createdAt: T,
  },
  {
    id: "prop-011", name: "Willow Creek Estates", address: "700 Willow Creek Rd", city: "Nashville", state: "TN",
    lat: 36.1627, lng: -86.7816, assetClass: "residential", yearBuilt: 2020, sfArea: 198_000,
    bookValue: 41_200_000, capRate: 5.3, pricePerSF: 208, occupancy: 96, noi: 2_184_000,
    floodZone: "X", zoning: "RS-7.5", valuationStatus: "fresh", monthsSinceValuation: 8,
    riskScore: 31, latestAppraisalId: "appr-011", createdAt: T,
  },
  {
    id: "prop-012", name: "Metro Center Mall", address: "250 Metro Center", city: "Phoenix", state: "AZ",
    lat: 33.4484, lng: -112.074, assetClass: "retail", yearBuilt: 1996, sfArea: 288_000,
    bookValue: 39_800_000, capRate: 8.9, pricePerSF: 138, occupancy: 63, noi: 3_542_000,
    floodZone: "X", zoning: "C-2", valuationStatus: "stale", monthsSinceValuation: 34,
    riskScore: 88, latestAppraisalId: "appr-012", createdAt: T,
  },
  {
    id: "prop-013", name: "Lakeshore Multifamily", address: "480 Lakeshore Dr", city: "Minneapolis", state: "MN",
    lat: 44.9778, lng: -93.265, assetClass: "multifamily", yearBuilt: 2017, sfArea: 231_000,
    bookValue: 52_300_000, capRate: 5.6, pricePerSF: 226, occupancy: 93, noi: 2_929_000,
    floodZone: "X", zoning: "R6", valuationStatus: "aging", monthsSinceValuation: 18,
    riskScore: 44, latestAppraisalId: "appr-013", createdAt: T,
  },
  {
    id: "prop-014", name: "Pioneer Square Office", address: "310 Pioneer Sq", city: "Seattle", state: "WA",
    lat: 47.6015, lng: -122.3343, assetClass: "office", yearBuilt: 1994, sfArea: 164_000,
    bookValue: 31_100_000, capRate: 8.2, pricePerSF: 190, occupancy: 72, noi: 2_550_000,
    floodZone: "X", zoning: "PSM", valuationStatus: "stale", monthsSinceValuation: 27,
    riskScore: 79, latestAppraisalId: "appr-014", createdAt: T,
  },
  {
    id: "prop-015", name: "Trade Winds Industrial", address: "620 Trade Winds Blvd", city: "Dallas", state: "TX",
    lat: 32.7767, lng: -96.797, assetClass: "industrial", yearBuilt: 2021, sfArea: 486_000,
    bookValue: 58_400_000, capRate: 5.7, pricePerSF: 120, occupancy: 98, noi: 3_329_000,
    floodZone: "X", zoning: "IM", valuationStatus: "fresh", monthsSinceValuation: 4,
    riskScore: 22, latestAppraisalId: "appr-015", createdAt: T,
  },
  {
    id: "prop-016", name: "Magnolia Retail Row", address: "88 Magnolia St", city: "Charlotte", state: "NC",
    lat: 35.2271, lng: -80.8431, assetClass: "retail", yearBuilt: 2008, sfArea: 112_000,
    bookValue: 24_900_000, capRate: 6.9, pricePerSF: 222, occupancy: 90, noi: 1_718_000,
    floodZone: "AE", zoning: "B-1", valuationStatus: "aging", monthsSinceValuation: 23,
    riskScore: 63, latestAppraisalId: "appr-016", createdAt: T,
  },
  {
    id: "prop-017", name: "Summit View Apartments", address: "1500 Summit View", city: "Denver", state: "CO",
    lat: 39.7294, lng: -104.9814, assetClass: "multifamily", yearBuilt: 2018, sfArea: 209_000,
    bookValue: 48_700_000, capRate: 5.4, pricePerSF: 233, occupancy: 95, noi: 2_630_000,
    floodZone: "X", zoning: "G-MU-5", valuationStatus: "fresh", monthsSinceValuation: 10,
    riskScore: 35, latestAppraisalId: "appr-017", createdAt: T,
  },
  {
    id: "prop-018", name: "Oldtown Mixed-Use", address: "24 Oldtown Ave", city: "Alexandria", state: "VA",
    lat: 38.8048, lng: -77.0469, assetClass: "office", yearBuilt: 2005, sfArea: 143_000,
    bookValue: 36_600_000, capRate: 6.7, pricePerSF: 256, occupancy: 86, noi: 2_452_000,
    floodZone: "AE", zoning: "CD", valuationStatus: "aging", monthsSinceValuation: 17,
    riskScore: 52, latestAppraisalId: "appr-018", createdAt: T,
  },
  {
    id: "prop-019", name: "Coastal Palms Resort", address: "5 Coastal Palms Way", city: "San Diego", state: "CA",
    lat: 32.7157, lng: -117.1611, assetClass: "hospitality", yearBuilt: 2013, sfArea: 176_000,
    bookValue: 67_200_000, capRate: 7.9, pricePerSF: 382, occupancy: 78, noi: 5_309_000,
    floodZone: "VE", zoning: "CV", valuationStatus: "aging", monthsSinceValuation: 22,
    riskScore: 69, latestAppraisalId: "appr-019", createdAt: T,
  },
  {
    id: "prop-020", name: "Greenfield Land Parcel", address: "Parcel 44, Route 9", city: "Columbus", state: "OH",
    lat: 39.9612, lng: -82.9988, assetClass: "land", yearBuilt: 0, sfArea: 1_742_000,
    bookValue: 12_400_000, capRate: 0, pricePerSF: 7, occupancy: 0, noi: 0,
    floodZone: "A", zoning: "AR-1", valuationStatus: "stale", monthsSinceValuation: 41,
    riskScore: 71, latestAppraisalId: "appr-020", createdAt: T,
  },
];
