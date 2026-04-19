import type { HomeBgSectionId } from "./homeBackgroundSections";
import { HOME_BG_SECTION_ORDER } from "./homeBackgroundSections";

/** Client pixel coordinates (viewport / visual viewport space, same as `getBoundingClientRect`). */
export type AnchorViewportPoint = { x: number; y: number };

const listeners = new Set<() => void>();

/** Latest projected ball centers for each home section index (same order as `HOME_BG_SECTION_ORDER`). */
let viewportPoints: AnchorViewportPoint[] = [];

/** True once route anchors on `/` have reached stable visibility (after intro / decel gates). */
let surfaceReady = false;

/** Fires once when `markHomeRouteAnchorsSurfaceReady()` runs — drives timed hero “grow from ball”. */
let heroEntranceStartedAt: number | null = null;

/** Wall time for the hero plate to expand from ball scale to full after balls appear. */
const HERO_ENTRANCE_MS = 980;

let didMarkSurface = false;

function notify() {
  listeners.forEach((fn) => fn());
}

/**
 * Clears projected points and surface flags. Call when leaving `/` so a later return replays
 * entrance + avoids stale origins.
 */
export function resetHomeAnchorScreenBridge() {
  viewportPoints = [];
  surfaceReady = false;
  heroEntranceStartedAt = null;
  didMarkSurface = false;
  notify();
}

/** WebGL rAF: push fresh screen positions (length should match section anchor count on home). */
export function setHomeAnchorViewportPixels(points: readonly AnchorViewportPoint[]) {
  viewportPoints = points.length ? [...points] : [];
  notify();
}

/**
 * Route anchors became stable on the homepage — start the hero entrance clock once per session
 * until `resetHomeAnchorScreenBridge`.
 */
export function markHomeRouteAnchorsSurfaceReady() {
  if (didMarkSurface) return;
  didMarkSurface = true;
  surfaceReady = true;
  heroEntranceStartedAt = typeof performance !== "undefined" ? performance.now() : null;
  notify();
}

export function subscribeHomeAnchorScreen(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getHomeAnchorViewportPoints(): readonly AnchorViewportPoint[] {
  return viewportPoints;
}

export function isHomeAnchorsSurfaceReady() {
  return surfaceReady;
}

/** 0..1 timed ease for hero-only expansion after balls surface (before scroll handoff dominates). */
export function getHeroBallEntranceProgress(nowMs: number): number {
  if (!surfaceReady || heroEntranceStartedAt == null) return 0;
  return Math.min(1, Math.max(0, (nowMs - heroEntranceStartedAt) / HERO_ENTRANCE_MS));
}

export function getBallViewportForSection(sectionId: HomeBgSectionId): AnchorViewportPoint | null {
  const i = HOME_BG_SECTION_ORDER.indexOf(sectionId);
  if (i < 0 || i >= viewportPoints.length) return null;
  return viewportPoints[i] ?? null;
}
