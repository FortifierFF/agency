/** Client pixel coordinates (viewport / visual viewport space, same as `getBoundingClientRect`). */
export type AnchorViewportPoint = { x: number; y: number };

const listeners = new Set<() => void>();
let routeAnchorVersion = 0;

/** Last route key written by WebGL projection step. */
let projectedLayoutKey = "/";
let projectedPoints: AnchorViewportPoint[] = [];

/** Layout key whose anchor set has finished incoming and is now stable/visible. */
let stableLayoutKey: string | null = null;

function notify() {
  routeAnchorVersion += 1;
  listeners.forEach((fn) => fn());
}

/** Clears projected route-anchor points + stable marker on pathname changes. */
export function resetRouteAnchorScreenBridge() {
  projectedLayoutKey = "/";
  projectedPoints = [];
  stableLayoutKey = null;
  notify();
}

/**
 * WebGL rAF: pushes projected screen points for the active layout key.
 * Do **not** `notify()` on every call — that was forcing every `CosmicRouteSectionShell` (and the
 * hero shell) to re-render at display rate; long pages like home stacked many shells and melted
 * scroll performance. Consumers read `getRouteAnchorViewportPoint` inside their own scroll/resize
 * (or imperative) ticks instead of subscribing to per-frame pixel churn.
 */
export function setRouteAnchorViewportPixels(layoutKey: string, points: readonly AnchorViewportPoint[]) {
  const keyChanged = projectedLayoutKey !== layoutKey;
  projectedLayoutKey = layoutKey;
  projectedPoints = points.length ? [...points] : [];
  if (keyChanged) notify();
}

/** Called once when route anchors finish incoming and stay visible on the destination page. */
export function markRouteAnchorsSurfaceReady(layoutKey: string) {
  if (stableLayoutKey === layoutKey) return;
  stableLayoutKey = layoutKey;
  notify();
}

export function isRouteAnchorsSurfaceReady(layoutKey: string) {
  return stableLayoutKey === layoutKey;
}

export function getRouteAnchorViewportPoint(layoutKey: string, index: number): AnchorViewportPoint | null {
  if (projectedLayoutKey !== layoutKey) return null;
  if (index < 0 || index >= projectedPoints.length) return null;
  return projectedPoints[index] ?? null;
}

export function subscribeRouteAnchorScreen(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Monotonic version for `useSyncExternalStore` stable snapshots. */
export function getRouteAnchorScreenVersion() {
  return routeAnchorVersion;
}
