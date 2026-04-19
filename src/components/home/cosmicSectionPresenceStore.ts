import {
  HOME_BG_SECTION_ORDER,
  readHomeSectionLayouts,
  type HomeBgSectionId,
} from "./homeBackgroundSections";
import { getCosmicRouteAnchorLayoutKey } from "@/lib/cosmicRouteAnchorStore";
import { getHeroBallEntranceProgress, isHomeAnchorsSurfaceReady } from "./homeAnchorScreenBridge";

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / Math.max(edge1 - edge0, 0.0001)));
  return t * t * (3 - 2 * t);
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function chapterSpanVh(reduced: boolean) {
  return reduced ? 0.86 : 1.04;
}

function chapterOverlapVh(reduced: boolean) {
  return reduced ? 0.2 : 0.28;
}

function ensureLayoutMap() {
  const layouts = readHomeSectionLayouts();
  return new Map(layouts.map((l) => [l.id, l]));
}

function chapterProgressForSection(
  sectionId: HomeBgSectionId,
  index: number,
  scrollY: number,
  vh: number,
  reduced: boolean,
  layoutMap: Map<HomeBgSectionId, { top: number; height: number }>
) {
  const layout = layoutMap.get(sectionId);
  const sectionTop = layout?.top ?? index * vh;
  const sectionHeight = layout?.height ?? vh;
  const chapterHeight = Math.max(sectionHeight, vh * chapterSpanVh(reduced));
  const overlap = vh * chapterOverlapVh(reduced);
  const start = sectionTop - vh * 0.46 - overlap;
  const end = sectionTop + chapterHeight - vh * 0.24 + overlap;
  const total = Math.max(end - start, vh * 0.42);
  return clamp01((scrollY - start) / total);
}

function presenceFromChapterProgress(progress: number) {
  const enter = smoothstep(0.04, 0.34, progress);
  const exit = smoothstep(0.66, 0.96, progress);
  return clamp01(enter * (1 - exit));
}

function heroPresenceBias(p: number, scrollY: number) {
  if (scrollY < 40) return Math.max(p, 0.995);
  if (scrollY < 96) return Math.max(p, lerp(0.995, 0.86, scrollY / 96));
  return p;
}

/** Smallest plate scale when a section is “at” its anchor ball (10–12% matches art direction). */
const PLATE_SCALE_AT_BALL = 0.11;

let presenceCache: Map<HomeBgSectionId, number> = new Map();
/** Literal CSS scale factor (ball → full). Same keys as presence; home uses ball choreography. */
let plateScaleCache: Map<HomeBgSectionId, number> = new Map();
const listeners = new Set<() => void>();

function layoutCenterY(
  id: HomeBgSectionId,
  index: number,
  layoutMap: Map<HomeBgSectionId, { top: number; height: number }>,
  vh: number
) {
  const layout = layoutMap.get(id);
  if (layout) return layout.top + Math.max(96, layout.height) * 0.34;
  return index * vh * 0.92 + vh * 0.28;
}

/**
 * Scroll-driven scales for `/`: current section shrinks toward its ball while the next grows from
 * its ball, with overlap so the incoming plate starts before the outgoing hits ~ball size.
 */
function computeHomePlateScalesFromScroll(
  scrollY: number,
  vh: number,
  layoutMap: Map<HomeBgSectionId, { top: number; height: number }>,
  nowMs: number
): number[] {
  const n = HOME_BG_SECTION_ORDER.length;
  const scales = new Array<number>(n).fill(PLATE_SCALE_AT_BALL);
  const centers = HOME_BG_SECTION_ORDER.map((id, idx) => layoutCenterY(id, idx, layoutMap, vh));

  if (!isHomeAnchorsSurfaceReady()) {
    return scales;
  }

  const entranceT = getHeroBallEntranceProgress(nowMs);
  if (entranceT < 1) {
    const e = 1 - Math.pow(1 - entranceT, 2.55);
    scales[0] = lerp(PLATE_SCALE_AT_BALL, 1, e);
    return scales;
  }

  const s = scrollY + vh * 0.38;
  const S0 = centers[0]!;

  if (s < S0) {
    scales[0] = 1;
    return scales;
  }

  const lastC = centers[n - 1]!;
  if (s >= lastC) {
    scales[n - 1] = 1;
    return scales;
  }

  for (let i = 0; i < n - 1; i++) {
    const c0 = centers[i]!;
    const c1 = centers[i + 1]!;
    if (s >= c0 && s < c1) {
      const u = (s - c0) / Math.max(c1 - c0, 1e-4);
      // Outgoing eases down first; incoming eases up on a slightly delayed window (~10–15% overlap).
      scales[i] = lerp(1, PLATE_SCALE_AT_BALL, smoothstep(0, 0.78, u));
      scales[i + 1] = lerp(PLATE_SCALE_AT_BALL, 1, smoothstep(0.52, 1, u));
      return scales;
    }
  }

  scales[0] = 1;
  return scales;
}

function recomputePresences() {
  const reduced =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const vh = typeof window !== "undefined" ? window.innerHeight : 900;
  const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
  const layoutMap = ensureLayoutMap();
  const layoutKey = typeof window !== "undefined" ? getCosmicRouteAnchorLayoutKey() : "/";

  const nextPresence = new Map<HomeBgSectionId, number>();
  const nextPlate = new Map<HomeBgSectionId, number>();

  const onHome = layoutKey === "/";

  if (onHome && !reduced) {
    const nowMs = typeof performance !== "undefined" ? performance.now() : 0;
    const plateScales = computeHomePlateScalesFromScroll(scrollY, vh, layoutMap, nowMs);
    for (let i = 0; i < HOME_BG_SECTION_ORDER.length; i++) {
      const id = HOME_BG_SECTION_ORDER[i]!;
      const sc = plateScales[i] ?? PLATE_SCALE_AT_BALL;
      nextPlate.set(id, sc);
      // Normalize into 0..1 for legacy consumers (blur curves) without crushing the ball state.
      const p = clamp01((sc - PLATE_SCALE_AT_BALL) / (1 - PLATE_SCALE_AT_BALL + 1e-5));
      nextPresence.set(id, Math.max(0.015, p));
    }
  } else {
    for (let i = 0; i < HOME_BG_SECTION_ORDER.length; i++) {
      const id = HOME_BG_SECTION_ORDER[i]!;
      const progress = chapterProgressForSection(id, i, scrollY, vh, reduced, layoutMap);
      let presence = presenceFromChapterProgress(progress);

      if (id === "hero") {
        presence = heroPresenceBias(presence, scrollY);
      }

      if (i > 0) {
        const prevId = HOME_BG_SECTION_ORDER[i - 1]!;
        const prevPresence = nextPresence.get(prevId) ?? 0;
        if (prevPresence > 0.08) {
          presence = Math.max(presence, smoothstep(0.18, 0.74, 1 - prevPresence) * 0.92);
        }
      }

      presence = clamp01(presence);
      nextPresence.set(id, presence);
      // Reduced / non-home: plates stay at readable scale; motion comes from opacity/depth only.
      nextPlate.set(id, reduced || !onHome ? 1 : lerp(PLATE_SCALE_AT_BALL, 1, presence));
    }
  }

  presenceCache = nextPresence;
  plateScaleCache = nextPlate;
  listeners.forEach((fn) => fn());
}

export function getCosmicSectionPresenceSnapshot(): Map<HomeBgSectionId, number> {
  return presenceCache;
}

/** Plate scale used by `CosmicSectionFrame` (literal `scale()` factor, ball → 1). */
export function getSectionPlateScale(sectionId: HomeBgSectionId): number {
  return plateScaleCache.get(sectionId) ?? 1;
}

export function subscribeCosmicSectionPresence(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function tickCosmicSectionPresenceStore() {
  recomputePresences();
}

export function getSectionPresenceForWebGL(id: HomeBgSectionId): number {
  return presenceCache.get(id) ?? 0;
}
