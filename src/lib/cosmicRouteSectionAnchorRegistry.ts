import { HOME_BG_SECTION_ORDER } from "@/components/home/homeBackgroundSections";

/**
 * Wheel stars for home: hero (0) + body shells 1…N−1. The blue CTA shell uses index N but has **no**
 * projected point (same as About `anchorIndex={4}` with count 4).
 */
const HOME_ROUTE_WHEEL_ANCHOR_COUNT = HOME_BG_SECTION_ORDER.length - 1;

/**
 * Static anchor counts for **top-level** routes (how many sprites we show).
 * World-space positions still come from `getRouteAnchorWorldPosition(layoutKey, index)` — that
 * function hashes the **full** normalized pathname, so `/about` and `/pricing` never share coords.
 */
const ROUTE_SECTION_ANCHOR_COUNTS: Record<string, number> = {
  "/about": 4,
  /** Four service plates + hero; CTA shell index 5 has no wheel point (About pattern). */
  "/services": 5,
  "/pricing": 5,
  "/contact": 4,
  "/blog": 5,
  "/projects": 1,
};

/** Blog posts under `/blog/[slug]` — slug is part of `layoutKey`, so each article’s layout differs. */
const BLOG_POST_ANCHOR_COUNT = 4;
/** Case study: preview (1), story block (2), blue CTA at 3 (no wheel point). */
const PROJECT_SLUG_ANCHOR_COUNT = 2;
/** Any other localized route still gets markers; tune per page when you add one. */
const FALLBACK_ROUTE_ANCHOR_COUNT = 4;

/**
 * Canonical route key for stable anchor layouts (next-intl pathname without locale).
 * Same string every time the user visits that logical page.
 */
export function normalizeRouteAnchorLayoutKey(pathname: string): string {
  const p = pathname.replace(/\/+$/, "") || "/";
  return p === "" ? "/" : p;
}

/**
 * How many “section anchor” stars the route-flight decel should show for a pathname.
 * next-intl `usePathname()` returns the path **without** the locale prefix (e.g. `/` for home,
 * `/about` for about) — see https://next-intl.dev/docs/routing/navigation#usepathname
 */
export function resolveRouteSectionAnchorCount(pathname: string): number {
  const p = normalizeRouteAnchorLayoutKey(pathname);
  if (p === "/") return HOME_ROUTE_WHEEL_ANCHOR_COUNT;
  const exact = ROUTE_SECTION_ANCHOR_COUNTS[p];
  if (exact !== undefined) return exact;
  if (p.startsWith("/blog/")) return BLOG_POST_ANCHOR_COUNT;
  if (p.startsWith("/projects/")) return PROJECT_SLUG_ANCHOR_COUNT;
  return FALLBACK_ROUTE_ANCHOR_COUNT;
}
