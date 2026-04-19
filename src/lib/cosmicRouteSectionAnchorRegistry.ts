import { HOME_BG_SECTION_ORDER } from "@/components/home/homeBackgroundSections";

/** Matches `app/[locale]/page.tsx` section shells — bump when home sections change. */
const HOME_SECTION_COUNT = HOME_BG_SECTION_ORDER.length;

/**
 * Static anchor counts for **top-level** routes (how many sprites we show).
 * World-space positions still come from `getRouteAnchorWorldPosition(layoutKey, index)` — that
 * function hashes the **full** normalized pathname, so `/about` and `/pricing` never share coords.
 */
const ROUTE_SECTION_ANCHOR_COUNTS: Record<string, number> = {
  "/about": 4,
  "/services": 6,
  "/pricing": 5,
  "/contact": 4,
  "/blog": 5,
  "/projects": 6,
};

/** Blog posts under `/blog/[slug]` — slug is part of `layoutKey`, so each article’s layout differs. */
const BLOG_POST_ANCHOR_COUNT = 4;
/** Project case studies under `/projects/[slug]`. */
const PROJECT_SLUG_ANCHOR_COUNT = 5;
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
  if (p === "/") return HOME_SECTION_COUNT;
  const exact = ROUTE_SECTION_ANCHOR_COUNTS[p];
  if (exact !== undefined) return exact;
  if (p.startsWith("/blog/")) return BLOG_POST_ANCHOR_COUNT;
  if (p.startsWith("/projects/")) return PROJECT_SLUG_ANCHOR_COUNT;
  return FALLBACK_ROUTE_ANCHOR_COUNT;
}
