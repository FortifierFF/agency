"use client";

import { useEffect } from "react";
import { useCosmicExperience } from "@/context/CosmicExperienceContext";

/**
 * First-load cosmic sequence without a blocking progress overlay.
 * Mirrors the old `SiteBootOverlay` exit: intro hyperspace, then navbar/hero handoff.
 * Reduced motion skips the intro camera pulse (same as before).
 */
export function CosmicBootInit() {
  const { completeBootLoader, skipBootMinimal } = useCosmicExperience();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      skipBootMinimal();
    } else {
      completeBootLoader();
    }
  }, [completeBootLoader, skipBootMinimal]);

  return null;
}
