/**
 * Single import point for the site's core content, as requested
 * in Phase 11. This is deliberately a thin re-export layer, not a
 * second copy of the data — the actual arrays still live in their
 * own focused files (pricing.ts, trainers.ts, classes.ts,
 * testimonials.ts) so each stays independently readable and there
 * is exactly one source of truth per data set.
 *
 * Prefer importing directly from the specific file inside a
 * component that only needs one data set (e.g.
 * `import { TRAINERS } from "@/constants/trainers"`). Reach for
 * `gymData` when a piece of code genuinely wants "all of it" at
 * once (a future admin view, a search index, a sitemap generator).
 */
export { PRICING_PLANS } from "./pricing";
export { TRAINERS } from "./trainers";
export { CLASSES } from "./classes";
export { TESTIMONIALS } from "./testimonials";
export { FEATURES } from "./features";
export { STATS } from "./stats";
export { FAQ_ITEMS } from "./faq";
export { GALLERY_IMAGES } from "./gallery";
export { NAV_LINKS, CONTACT_LINK } from "./navigation";
export { siteConfig } from "./site";
