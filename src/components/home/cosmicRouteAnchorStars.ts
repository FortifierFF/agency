import * as THREE from "three";
import { cosmicDriver, ROUTE_DECEL_MS } from "@/lib/cosmicDriver";
import { getCosmicRouteAnchorLayoutKey, getCosmicRouteSectionAnchorCount } from "@/lib/cosmicRouteAnchorStore";
import { getRouteAnchorWorldPosition } from "@/lib/cosmicRouteAnchorLayoutPositions";
import { markHomeRouteAnchorsSurfaceReady } from "./homeAnchorScreenBridge";

export type CosmicRouteAnchorStars = {
  group: THREE.Group;
  /**
   * `streakRaw` matches the same 0..1 mix as the camera driver (`introStreak + route`) **before**
   * `streakVisual` smoothing. Required so the first rAF tick (`delta === 0`) does not treat
   * `streakVisual === 0` as “idle” while intro is already non-zero.
   */
  update: (delta: number, streakVisual: number, streakRaw: number) => void;
  dispose: () => void;
};

const MAX_ANCHORS = 32;
const ANCHOR_SIZE_MUL_MAX = 7.2;

/** Base wall time to finish outro; sped up while `routeHyperspace` is high. */
const OUTRO_BASE_S = 0.78;

/** Anchors should finish ramping ~this many ms before the smoothed streak hits “fully idle”. */
const ANCHOR_LEAD_BEFORE_IDLE_MS = 300;

type AnchorPhase = "stable" | "outro" | "incoming";

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / Math.max(edge1 - edge0, 1e-5)));
  return t * t * (3 - 2 * t);
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

/**
 * Radial sprite: **opaque black** core with a thin **cool-white** rim (photon-sphere / lensing hint).
 * Kept separate from warp tunnel billboards so we do not change starfield particles.
 */
function createRouteAnchorBlackHoleTexture(): THREE.CanvasTexture | null {
  const size = 128;
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const c = size * 0.5;
  const grad = ctx.createRadialGradient(c, c, 0, c, c, c);
  // Event horizon — black disk; bright band is **narrow** (thin photon ring vs wide glow).
  grad.addColorStop(0, "rgba(0,0,0,1)");
  grad.addColorStop(0.275, "rgba(0,0,0,1)");
  // Tight peak then quick falloff so the limb reads as a slim ring at full sprite scale.
  grad.addColorStop(0.292, "rgba(250,252,255,0.96)");
  grad.addColorStop(0.308, "rgba(215,232,255,0.42)");
  grad.addColorStop(0.38, "rgba(120,165,235,0.09)");
  grad.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Last ~`ANCHOR_LEAD_BEFORE_IDLE_MS` of the **route decel** segment only (0 until then, then 0→1).
 */
function anchorDecelLatePhase(routeDecelProgress01: number): number {
  const d = ROUTE_DECEL_MS;
  const lead = ANCHOR_LEAD_BEFORE_IDLE_MS;
  if (d <= lead) return routeDecelProgress01;
  return clamp01((routeDecelProgress01 * d - (d - lead)) / lead);
}

/**
 * 0 while `streakVisual` is still “up”; eases 0→1 on the final approach to idle (shared with WebGL
 * camera/warp settle — matches “don’t show balls until we’re near rest”).
 */
function anchorRevealFromStreak(streakVisual: number): number {
  const hi = 0.078;
  const lo = 0.014;
  if (streakVisual >= hi) return 0;
  if (streakVisual <= lo) return 1;
  return smoothstep(0, 1, (hi - streakVisual) / (hi - lo));
}

/** In-app navigation: combine late decel window + streak tail so markers don’t pop at slow start. */
function routeIncomingAnchorProgress(routeDecel01: number, streakVisual: number): number {
  const tail = anchorRevealFromStreak(streakVisual);
  if (routeDecel01 > 0.001) {
    return Math.min(anchorDecelLatePhase(routeDecel01), tail);
  }
  return tail;
}

/**
 * Section anchors stay **fully visible** at **fixed scene positions** while you remain on that
 * route. Incoming scale-in is gated by **`streakVisual`** (near-idle) and, on navigations, the
 * **last ~300ms of route decel** — not at the first moment the camera slows.
 */
export function createCosmicRouteAnchorStars(reducedMotion: boolean): CosmicRouteAnchorStars {
  const group = new THREE.Group();
  group.renderOrder = 10;

  const texture = createRouteAnchorBlackHoleTexture();
  const sprites: THREE.Sprite[] = [];
  // ~30% larger on screen than the first black-hole pass (rim stays thin via texture, not scale).
  const baseScale = reducedMotion ? 0.286 : 0.468;

  for (let i = 0; i < MAX_ANCHORS; i++) {
    const mat = new THREE.SpriteMaterial({
      map: texture ?? undefined,
      // Slight cool lift so the rim reads on near-black cosmic fog (core stays black in the map).
      color: new THREE.Color(1.06, 1.08, 1.12),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      depthTest: false,
      // Normal blend: additive would erase the black silhouette (0+background = background).
      blending: THREE.NormalBlending,
      toneMapped: false,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.center.set(0.5, 0.5);
    sprite.renderOrder = 11;
    sprite.position.set(0, 0, -500);
    sprite.scale.setScalar(baseScale);
    sprite.visible = false;
    group.add(sprite);
    sprites.push(sprite);
  }

  const tmp = new THREE.Vector3();

  let visualKey = "";
  let visualN = 0;
  let phase: AnchorPhase = "stable";
  let outT = 0;
  let arrivalA = 0;

  const applyLayoutPositions = (layoutKey: string) => {
    for (let i = 0; i < MAX_ANCHORS; i++) {
      getRouteAnchorWorldPosition(layoutKey, i, tmp);
      sprites[i]!.position.copy(tmp);
    }
  };

  const snapVisualToStore = (storeKey: string, storeN: number) => {
    visualKey = storeKey;
    visualN = storeN;
    applyLayoutPositions(visualKey);
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
      for (const s of sprites) {
        s.visible = false;
        (s.material as THREE.SpriteMaterial).opacity = 0;
      }
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
        const shrink = 1 - smoothstep(0, 1, outT);

        for (let i = 0; i < MAX_ANCHORS; i++) {
          const s = sprites[i]!;
          const mat = s.material as THREE.SpriteMaterial;
          if (i >= visualN) {
            s.visible = false;
            mat.opacity = 0;
            continue;
          }
          getRouteAnchorWorldPosition(visualKey, i, tmp);
          s.position.copy(tmp);
          s.visible = true;
          const sizeEase = shrink;
          const sizeMul = 1 + (ANCHOR_SIZE_MUL_MAX - 1) * sizeEase;
          mat.opacity = 0.92 * shrink * smoothstep(0, 0.15, shrink);
          s.scale.setScalar(baseScale * sizeMul * shrink);
        }
        return;
      }
      snapVisualToStore(storeKey, storeN);
    }

    if (phase === "incoming") {
      // Boot: wait for `bootIntroPulsed`, then gate on **both** smoothed and raw streak. The first
      // rAF often has `delta === 0`, so `streakVisual` does not move yet even when `streakRaw` is
      // already high — `anchorRevealFromStreak(0)` alone would flash the markers “idle”.
      // In-app navigations use `serial > 0` + route decel (still keyed on `streakVisual`).
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

    const v = phase === "stable" && visualN > 0 ? 1 : arrivalA;
    // Homepage: once anchors settle, let the DOM hero plate start its timed “grow from ball” choreo.
    if (!reducedMotion && phase === "stable" && visualKey === "/" && visualN > 0) {
      markHomeRouteAnchorsSurfaceReady();
    }
    const opacityGate = smoothstep(0, 0.12, v);
    const sizeEase = 1 - Math.pow(1 - v, 2.25);
    const sizeMul = 1 + (ANCHOR_SIZE_MUL_MAX - 1) * sizeEase;
    const visualScale = baseScale * sizeMul;

    for (let i = 0; i < MAX_ANCHORS; i++) {
      const s = sprites[i]!;
      const mat = s.material as THREE.SpriteMaterial;
      if (visualN <= 0 || i >= visualN || v < 0.001) {
        s.visible = false;
        mat.opacity = 0;
        continue;
      }
      if (phase !== "outro") {
        getRouteAnchorWorldPosition(visualKey, i, tmp);
        s.position.copy(tmp);
      }
      s.visible = true;
      mat.opacity = 0.92 * opacityGate * Math.min(1, v * 1.12);
      s.scale.setScalar(visualScale);
    }
  };

  const dispose = () => {
    for (const s of sprites) {
      s.material.dispose();
    }
    texture?.dispose();
  };

  return { group, update, dispose };
}
