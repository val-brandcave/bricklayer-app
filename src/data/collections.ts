/** localStorage key prefix for this project. */
export const STORAGE_PREFIX = "bricklayer";

/** Collection name constants — single source of truth for both adapters. */
export const Collections = {
  USERS: "users",
  PROPERTIES: "properties",
  APPRAISALS: "appraisals",
  REPORTS: "reports",
  DASHBOARDS: "dashboards",
  INSIGHTS: "insights",
  WATCHLIST: "watchlist",
} as const;

export type CollectionName = (typeof Collections)[keyof typeof Collections];
