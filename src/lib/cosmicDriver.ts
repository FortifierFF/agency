/**
 * Mutable bridge between React (boot + route transitions) and the Three.js rAF loop.
 * We mutate plain fields here so the renderer never waits on React re-renders.
 */
import { APEX_ROUTE_HYPERSPACE_SETTLED } from "@/lib/cosmicBootEvents";

export type CosmicDriver = {
  /** 0..1 — camera “hyperspace” dash on first boot after the loader hits 100%. */
  introHyperspace: number;
  /** 0..1 — in-app route flight envelope (trapezoid: fast accel, long cruise, smooth decel). */
  routeHyperspace: number;
  /**
   * Idle multiplier for starfield rotation after the jump settles.
   * Starts elevated so motion reads as energetic, then eases down to a very slow drift.
   */
  idleDriftMul: number;
};

export const cosmicDriver: CosmicDriver = {
  introHyperspace: 0,
  routeHyperspace: 0,
  idleDriftMul: 1,
};

/**
 * Trapezoid “speed vs time” for in-app route flights (tune these first).
 *
 * - `ROUTE_MIN_FLIGHT_MS` — minimum wall time from nav start until decel ends.
 * - `ROUTE_ACCEL_MS` — linear ramp **0 → 1** on `routeHyperspace` (constant acceleration segment).
 * - `ROUTE_DECEL_MS` — linear ramp **1 → 0** (constant deceleration segment).
 * - Plateau length is implied: `ROUTE_MIN_FLIGHT_MS - ROUTE_ACCEL_MS - ROUTE_DECEL_MS` (extended by
 *   `markRouteContentReady()` when the page shell is still loading).
 */
export const ROUTE_MIN_FLIGHT_MS = 2000;
export const ROUTE_ACCEL_MS = 520;
export const ROUTE_DECEL_MS = 480;

const ROUTE_MIN_PLATEAU_MS = Math.max(0, ROUTE_MIN_FLIGHT_MS - ROUTE_ACCEL_MS - ROUTE_DECEL_MS);

type RouteFlightState = {
  navStart: number;
  cruiseEnd: number;
  flightEnd: number;
  /** Prevents firing the settle event twice if two rAF ticks land past `flightEnd`. */
  settleDispatched: boolean;
};

let routeFlight: RouteFlightState | null = null;

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function beginRouteFlightWindow(now: number) {
  const cruiseEnd = now + ROUTE_ACCEL_MS + ROUTE_MIN_PLATEAU_MS;
  const flightEnd = cruiseEnd + ROUTE_DECEL_MS;
  routeFlight = { navStart: now, cruiseEnd, flightEnd, settleDispatched: false };
  // Start each flight from a hard zero so no decay residue feeds the first paint as “instant max”.
  cosmicDriver.routeHyperspace = 0;
}

/**
 * If the next route is still mounting (slow RSC, large trees), call this so `cruiseEnd` moves
 * with `performance.now()` — the ship stays at full thrust until work catches up, then decels.
 */
export function markRouteContentReady() {
  if (!routeFlight) return;
  const now = performance.now();
  routeFlight.cruiseEnd = Math.max(routeFlight.cruiseEnd, now);
  routeFlight.flightEnd = routeFlight.cruiseEnd + ROUTE_DECEL_MS;
}

/** Absolute `performance.now()` when the current flight’s decel segment ends (or null). */
export function getRouteFlightScheduledEndMs(): number | null {
  return routeFlight ? routeFlight.flightEnd : null;
}

/**
 * Samples the trapezoid envelope and writes `cosmicDriver.routeHyperspace`.
 * Call once per rAF after `tickCosmicDriver` (which skips route decay while a flight is active).
 */
export function tickRouteFlightEnvelope(nowMs: number, reducedMotion: boolean) {
  if (reducedMotion) {
    routeFlight = null;
    cosmicDriver.routeHyperspace = 0;
    return;
  }

  if (!routeFlight) {
    return;
  }

  const { navStart, cruiseEnd, flightEnd } = routeFlight;
  const accelEnd = navStart + ROUTE_ACCEL_MS;

  if (nowMs < accelEnd) {
    // Linear rise = trapezoid **velocity** rising edge (no cubic “late kick” into cruise).
    cosmicDriver.routeHyperspace = clamp01((nowMs - navStart) / ROUTE_ACCEL_MS);
    return;
  }

  if (nowMs < cruiseEnd) {
    cosmicDriver.routeHyperspace = 1;
    return;
  }

  if (nowMs < flightEnd) {
    // Linear fall = trapezoid velocity falling edge.
    cosmicDriver.routeHyperspace = clamp01(1 - (nowMs - cruiseEnd) / ROUTE_DECEL_MS);
    return;
  }

  cosmicDriver.routeHyperspace = 0;
  if (!routeFlight.settleDispatched && typeof window !== "undefined") {
    routeFlight.settleDispatched = true;
    window.dispatchEvent(new CustomEvent(APEX_ROUTE_HYPERSPACE_SETTLED));
  }
  routeFlight = null;
}

/** Fire once right after the percentage loader completes (first visit in this SPA session). */
export function pulseIntroHyperspace() {
  cosmicDriver.introHyperspace = 1;
  cosmicDriver.idleDriftMul = 4.5;
}

/** Fire on pathname change (client navigation): starts a wall-clock trapezoid flight. */
export function pulseRouteHyperspace() {
  cosmicDriver.idleDriftMul = Math.max(cosmicDriver.idleDriftMul, 3.2);
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    routeFlight = null;
    cosmicDriver.routeHyperspace = 0;
    return;
  }
  beginRouteFlightWindow(performance.now());
}

/**
 * Per-frame decay called from the WebGL animate loop (not React).
 * Keeps envelopes smooth and independent of frame rate.
 */
export function tickCosmicDriver(elapsed: number, reducedMotion: boolean) {
  if (reducedMotion) {
    cosmicDriver.introHyperspace = 0;
    cosmicDriver.routeHyperspace = 0;
    cosmicDriver.idleDriftMul = 1;
    routeFlight = null;
    return;
  }

  const introDecay = Math.exp(-elapsed * 1.45);
  cosmicDriver.introHyperspace *= introDecay;

  // Timed route flights own `routeHyperspace`; fall back to exponential decay between pulses.
  if (!routeFlight) {
    const routeDecay = Math.exp(-elapsed * 2.05);
    cosmicDriver.routeHyperspace *= routeDecay;
  }

  const targetIdle = 0.028;
  cosmicDriver.idleDriftMul += (targetIdle - cosmicDriver.idleDriftMul) * Math.min(1, elapsed * 0.85);
}

/**
 * Where “speed” hits the pixels (after this file):
 *
 * - `ImmersiveThreeBackground.tsx` — `INTRO_STREAK_CURVE`, `STREAK_STAR_GROUP_Z`, `STREAK_LOOK_Z`,
 *   `STREAK_CAM_Y_BOB`, and how `streak` mixes intro vs route.
 * - `cosmicWarpTunnel.ts` — base speed `(0.45 + 720 * (0.08 + w * 2.85))` and spread multiplier.
 */
