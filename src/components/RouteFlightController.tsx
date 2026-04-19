"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "@/i18n/navigation";
import { useCosmicExperience } from "@/context/CosmicExperienceContext";
import { getRouteFlightScheduledEndMs, markRouteContentReady } from "@/lib/cosmicDriver";

/**
 * Keeps `routeTransitionActive` aligned with the WebGL trapezoid flight end time.
 * `CosmicRouteSync` starts the flight in `useLayoutEffect`; we extend the cruise phase here
 * when the shell is still catching up (`markRouteContentReady`).
 */
export function RouteFlightController() {
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cosmic = useCosmicExperience();

  const scheduleEnd = useCallback(() => {
    const endMs = getRouteFlightScheduledEndMs();
    if (endMs == null) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    const delay = Math.max(0, endMs - performance.now());
    timerRef.current = setTimeout(() => {
      cosmic.endRouteTransition();
    }, delay);
  }, [cosmic]);

  useLayoutEffect(() => {
    markRouteContentReady();
    scheduleEnd();
  }, [pathname, scheduleEnd]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      markRouteContentReady();
      scheduleEnd();
    });
    return () => cancelAnimationFrame(id);
  }, [pathname, scheduleEnd]);

  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;
    scheduleEnd();
  }, [pathname, scheduleEnd]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return null;
}
