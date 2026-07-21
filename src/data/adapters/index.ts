import type { DataAdapter } from "./types";
import { mockAdapter } from "./mock-adapter";
import { apiAdapter } from "./api-adapter";

/* Next.js: env comes from process.env.NEXT_PUBLIC_*.
   Default falls back to 'api' so mock must be set explicitly (.env.local). */
const source = process.env.NEXT_PUBLIC_DATA_SOURCE ?? "api";

export const adapter: DataAdapter = source === "mock" ? mockAdapter : apiAdapter;

export type { DataAdapter } from "./types";
