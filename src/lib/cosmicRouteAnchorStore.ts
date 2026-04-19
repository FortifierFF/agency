/**
 * Mutable bridge: React commits the current route before WebGL reads it each rAF.
 * Avoids coupling `ImmersiveThreeBackground` to the router while keeping zero React↔Three churn.
 */
import {
  normalizeRouteAnchorLayoutKey,
  resolveRouteSectionAnchorCount,
} from "@/lib/cosmicRouteSectionAnchorRegistry";

let routeSectionAnchorCount = 0;
/** Locale-stripped pathname — drives stable per-page anchor positions. */
let routeAnchorLayoutKey = "/";

export function syncCosmicRouteAnchorFromPathname(pathname: string) {
  routeAnchorLayoutKey = normalizeRouteAnchorLayoutKey(pathname);
  routeSectionAnchorCount = resolveRouteSectionAnchorCount(pathname);
}

export function getCosmicRouteSectionAnchorCount(): number {
  return routeSectionAnchorCount;
}

export function getCosmicRouteAnchorLayoutKey(): string {
  return routeAnchorLayoutKey;
}
