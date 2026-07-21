/* ============================================================
   Simulated latency for the demo. Every store call resolves after a
   short, slightly-randomized delay so data surfaces show their skeletons
   before the (localStorage-instant) mock data arrives — the app feels
   like it's talking to a real backend. Kept in the STORE layer (not the
   component) per CLAUDE.md's motion/loading rules.

   When the API adapter replaces the mock, delete these awaits — the real
   network provides the latency.
   ============================================================ */

/** Resolve after `ms` (± jitter). Reads are quick; writes feel a touch heavier. */
export function latency(ms = 460, jitter = 180): Promise<void> {
  const d = Math.max(0, ms + (deterministicJitter() - 0.5) * 2 * jitter);
  return new Promise((resolve) => setTimeout(resolve, d));
}

/* A tiny non-crypto pseudo-jitter. We avoid Math.random() at module scope for
   determinism-friendliness, but here it's fine to use it lazily at call time. */
function deterministicJitter(): number {
  return Math.random();
}

/** Typical latency bands so intent reads clearly at call sites. */
export const LATENCY = {
  read: 480,
  quick: 260,
  write: 620,
} as const;
