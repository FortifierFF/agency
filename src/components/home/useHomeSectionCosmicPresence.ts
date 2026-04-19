"use client";

import { useSyncExternalStore } from "react";
import type { HomeBgSectionId } from "./homeBackgroundSections";
import { useCosmicExperienceOptional } from "@/context/CosmicExperienceContext";
import { getCosmicSectionPresenceSnapshot, subscribeCosmicSectionPresence } from "./cosmicSectionPresenceStore";

/**
 * Scroll + ball-linked presence for `CosmicSectionFrame` (see `cosmicSectionPresenceStore` + WebGL
 * anchor projection on `/`).
 */
export function useHomeSectionCosmicPresence(sectionId: HomeBgSectionId) {
  const cosmic = useCosmicExperienceOptional();
  const landingPhase = cosmic?.landingPhase ?? "landed";

  const scrollP = useSyncExternalStore(
    subscribeCosmicSectionPresence,
    () => getCosmicSectionPresenceSnapshot().get(sectionId) ?? 0,
    () => 0
  );

  if (landingPhase === "loading") return 0;

  return scrollP;
}
