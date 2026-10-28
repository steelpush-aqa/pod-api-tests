// Test thresholds chosen by qa engineer. NOT from the spec: Pod publishes no freshness requirement.
// Basis: observed lag 0.3–0.8 s on Oct 28 2026, with an NTP-synced clock.

/** solution_now may trail the current time by at most this much */
export const SOLUTION_TIME_MAX_LAG_MS = 10_000;

/** solution_now may lead the current time by at most this much (clock differences) */
export const SOLUTION_TIME_MAX_AHEAD_MS = 2_000;
