"use client";

import { usePathname } from "@/i18n/navigation";
import { useLayoutEffect, useRef } from "react";
import { useCosmicExperience } from "@/context/CosmicExperienceContext";
import { syncCosmicRouteAnchorFromPathname } from "@/lib/cosmicRouteAnchorStore";
import { resetHomeAnchorScreenBridge } from "@/components/home/homeAnchorScreenBridge";

/**
 * In-app navigations: start the route transition + trapezoid WebGL flight before paint so the
 * next segment does not flash ahead of the starfield (see `APEX_ROUTE_HYPERSPACE_SETTLED`).
 */
export function CosmicRouteSync() {
  const pathname = usePathname();
  const prev = useRef<string | null>(null);
  const { triggerRouteHyperspace, bootFinished, beginRouteTransition } = useCosmicExperience();

  useLayoutEffect(() => {
    // Commit before `beginRouteTransition` so WebGL decel reads destination count + layout key.
    syncCosmicRouteAnchorFromPathname(pathname);

    if (prev.current !== null && prev.current !== pathname) {
      resetHomeAnchorScreenBridge();
    }

    if (prev.current === null) {
      prev.current = pathname;
      return;
    }
    if (prev.current !== pathname) {
      prev.current = pathname;
      if (bootFinished) {
        // Same tick as the new segment commit: hold DOM + start the timed trapezoid flight.
        beginRouteTransition();
        triggerRouteHyperspace();
      }
    }
  }, [pathname, bootFinished, beginRouteTransition, triggerRouteHyperspace]);

  return null;
}
