import { Collections } from "../collections";
import type { DataAdapter } from "../adapters/types";
import { seedUsers } from "./users.seed";
import { seedProperties } from "./properties.seed";
import { seedAppraisals } from "./appraisals.seed";
import { seedReports } from "./reports.seed";
import { seedDashboards } from "./dashboards.seed";
import { seedInsights } from "./insights.seed";
import { seedWatchlist } from "./watchlist.seed";

/** Populate all collections. Order matters — parents before children. */
export async function seedAll(adapter: DataAdapter): Promise<void> {
  await adapter.createMany(Collections.USERS, seedUsers);
  await adapter.createMany(Collections.PROPERTIES, seedProperties);
  await adapter.createMany(Collections.APPRAISALS, seedAppraisals);
  await adapter.createMany(Collections.REPORTS, seedReports);
  await adapter.createMany(Collections.DASHBOARDS, seedDashboards);
  await adapter.createMany(Collections.INSIGHTS, seedInsights);
  await adapter.createMany(Collections.WATCHLIST, seedWatchlist);
}
