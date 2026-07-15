/* ============================================================
   GENERIC HELPERS
============================================================ */

/** Formats a number with locale thousands separators (3200 -> "3,200"). */
export const formatNumber = (value) => Math.round(value).toLocaleString('en-US');

/** Ease-out-expo — the site's standard motion curve (see Phase 2 blueprint). */
export const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
