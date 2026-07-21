export type UUID = string;
export type Timestamp = number; // epoch milliseconds

/** Generate a random UUID v4 (browser + node 19+). */
export function generateId(): UUID {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Fallback for older runtimes
  return "id-" + Math.abs(hashString(String(performance.now()))).toString(36);
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

/** Base fields shared by all entities. */
export interface BaseEntity {
  id: UUID;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

/** The three RBAC lenses, set at provisioning. */
export type Lens = "portfolio-manager" | "credit-officer" | "chief-appraiser";

/** Provenance pointer — every number should be traceable to a source. */
export interface Provenance {
  label: string; // e.g. "Derived from 3,935 appraisals"
  sourceId?: UUID; // appraisal / property reference
  sourceRef?: string; // e.g. "Appraisal #A-2291, p.14"
  asOf?: Timestamp;
}
