import {
  HOME_BG_SECTION_ORDER,
  readHomeSectionLayouts,
  type HomeBgSectionId,
} from "./homeBackgroundSections";

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

let cache: Map<HomeBgSectionId, number> = new Map();
const listeners = new Set<() => void>();

function recomputePresences() {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const vh = typeof window !== "undefined" ? window.innerHeight : 900;
  const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
  const layoutMap = ensureLayoutMap();

  const next = new Map<HomeBgSectionId, number>();

  for (let i = 0; i < HOME_BG_SECTION_ORDER.length; i++) {
    const id = HOME_BG_SECTION_ORDER[i]!;
    const progress = chapterProgressForSection(id, i, scrollY, vh, reduced, layoutMap);
    let presence = presenceFromChapterProgress(progress);

    if (id === "hero") {
      presence = heroPresenceBias(presence, scrollY);
    }

    // Small tail overlap so adjacent sections can coexist during transitions,
    // but without the one-way clipping behavior from the old chain-gate approach.
    if (i > 0) {
      const prevId = HOME_BG_SECTION_ORDER[i - 1]!;
      const prevPresence = next.get(prevId) ?? 0;
      if (prevPresence > 0.08) {
        presence = Math.max(presence, smoothstep(0.18, 0.74, 1 - prevPresence) * 0.92);
      }
    }

    next.set(id, clamp01(presence));
  }

  cache = next;
  listeners.forEach((fn) => fn());
}

export function getCosmicSectionPresenceSnapshot(): Map<HomeBgSectionId, number> {
  return cache;
}

export function subscribeCosmicSectionPresence(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function tickCosmicSectionPresenceStore() {
  recomputePresences();
}

export function getSectionPresenceForWebGL(id: HomeBgSectionId): number {
  return cache.get(id) ?? 0;
}
