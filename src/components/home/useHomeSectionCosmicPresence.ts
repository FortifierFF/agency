"use client";

import { useEffect, useLayoutEffect, useState, useSyncExternalStore } from "react";
import type { HomeBgSectionId } from "./homeBackgroundSections";
import { useCosmicExperienceOptional } from "@/context/CosmicExperienceContext";
import {
  getCosmicSectionPresenceSnapshot,
  subscribeCosmicSectionPresence,
  tickCosmicSectionPresenceStore,
} from "./cosmicSectionPresenceStore";

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

/**
 * Hero timed intro + shared scroll store (see `HomeCosmicScrollBridge` + `cosmicSectionPresenceStore`).
 */
export function useHomeSectionCosmicPresence(sectionId: HomeBgSectionId) {
  const cosmic = useCosmicExperienceOptional();
  const landingPhase = cosmic?.landingPhase ?? "landed";
  const isHero = sectionId === "hero";

  const scrollP = useSyncExternalStore(
    subscribeCosmicSectionPresence,
    () => getCosmicSectionPresenceSnapshot().get(sectionId) ?? 0,
    () => 0
  );

  const [introFly, setIntroFly] = useState(isHero ? 0 : 1);

  useEffect(() => {
    if (!isHero) return;
    if (landingPhase !== "landed") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setIntroFly(1);
      return;
    }
    const start = performance.now();
    // Slightly longer so the hero plate reads like it crosses real distance after hyperspace settles.
    const dur = 1000;
    let raf = 0;
    const tick = (now: number) => {
      const t = clamp01((now - start) / dur);
      const eased = t >= 1 ? 1 : 1 - Math.pow(1 - t, 2.9);
      setIntroFly(eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isHero, landingPhase]);

  useLayoutEffect(() => {
    if (!isHero || introFly < 1) return;
    tickCosmicSectionPresenceStore();
  }, [introFly, isHero]);

  if (landingPhase === "loading") return 0;

  if (isHero && introFly < 1) return introFly;

  if (isHero && introFly >= 1 && typeof window !== "undefined" && window.scrollY < 96) {
    return Math.max(scrollP, 0.985);
  }

  return scrollP;
}
