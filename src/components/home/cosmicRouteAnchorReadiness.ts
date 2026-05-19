import { cosmicDriver, ROUTE_DECEL_MS } from "@/lib/cosmicDriver";
import { getCosmicRouteAnchorLayoutKey, getCosmicRouteSectionAnchorCount } from "@/lib/cosmicRouteAnchorStore";
import { markRouteAnchorsSurfaceReady } from "./routeAnchorScreenBridge";

/**
 * Drives when route “anchors” are considered ready for DOM (hero grow-from-ball, section shells).
 * The old **visible** black-hole sprites were removed; this keeps the same timing gates only.
 */
export type CosmicRouteAnchorReadiness = {
  update: (delta: number, streakVisual: number, streakRaw: number) => void;
  dispose: () => void;
};

const OUTRO_BASE_S = 0.78;
const ANCHOR_LEAD_BEFORE_IDLE_MS = 300;

type AnchorPhase = "stable" | "outro" | "incoming";

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / Math.max(edge1 - edge0, 1e-5)));
  return t * t * (3 - 2 * t);
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function anchorDecelLatePhase(routeDecelProgress01: number): number {
  const d = ROUTE_DECEL_MS;
  const lead = ANCHOR_LEAD_BEFORE_IDLE_MS;
  if (d <= lead) return routeDecelProgress01;
  return clamp01((routeDecelProgress01 * d - (d - lead)) / lead);
}

function anchorRevealFromStreak(streakVisual: number): number {
  const hi = 0.078;
  const lo = 0.014;
  if (streakVisual >= hi) return 0;
  if (streakVisual <= lo) return 1;
  return smoothstep(0, 1, (hi - streakVisual) / (hi - lo));
}

function routeIncomingAnchorProgress(routeDecel01: number, streakVisual: number): number {
  const tail = anchorRevealFromStreak(streakVisual);
  if (routeDecel01 > 0.001) {
    return Math.min(anchorDecelLatePhase(routeDecel01), tail);
  }
  return tail;
}

export function createCosmicRouteAnchorReadiness(reducedMotion: boolean): CosmicRouteAnchorReadiness {
  let visualKey = "";
  let visualN = 0;
  let phase: AnchorPhase = "stable";
  let outT = 0;
  let arrivalA = 0;

  const snapVisualToStore = (storeKey: string, storeN: number) => {
    visualKey = storeKey;
    visualN = storeN;
    outT = 0;
    if (storeN > 0) {
      const instant = reducedMotion;
      arrivalA = instant ? 1 : 0;
      phase = arrivalA >= 1 ? "stable" : "incoming";
    } else {
      arrivalA = 0;
      phase = "stable";
    }
  };

  const update = (delta: number, streakVisual: number, streakRaw: number) => {
    const dt = Math.max(0, delta);
    const storeKey = getCosmicRouteAnchorLayoutKey();
    const storeN = getCosmicRouteSectionAnchorCount();
    const rh = cosmicDriver.routeHyperspace;
    const tDecel = cosmicDriver.routeDecelProgress;
    const serial = cosmicDriver.routeFlightSerial;

    if (reducedMotion) {
      phase = "stable";
      snapVisualToStore(storeKey, storeN);
      return;
    }

    const mismatch = storeKey !== visualKey || storeN !== visualN;
    if (mismatch && visualN > 0 && phase !== "outro") {
      phase = "outro";
      outT = 0;
    } else if (mismatch && visualN === 0) {
      snapVisualToStore(storeKey, storeN);
    }

    if (phase === "outro") {
      if (outT < 1 - 1e-5) {
        const pace = 0.42 + rh * 1.05;
        outT = Math.min(1, outT + (dt / OUTRO_BASE_S) * pace);
        return;
      }
      snapVisualToStore(storeKey, storeN);
    }

    if (phase === "incoming") {
      if (serial === 0 && visualN > 0) {
        if (cosmicDriver.bootIntroPulsed) {
          const revealStreak = Math.max(streakVisual, streakRaw);
          arrivalA = Math.max(arrivalA, anchorRevealFromStreak(revealStreak));
        }
        if (arrivalA >= 0.96) {
          arrivalA = 1;
          phase = "stable";
        }
      } else if (serial > 0) {
        arrivalA = Math.max(arrivalA, routeIncomingAnchorProgress(tDecel, streakVisual));
        if (arrivalA >= 0.97) {
          arrivalA = 1;
          phase = "stable";
        }
      }
    }

    if (!reducedMotion && phase === "stable" && visualN > 0) {
      markRouteAnchorsSurfaceReady(visualKey);
    }
  };

  const dispose = () => {};

  return { update, dispose };
}
