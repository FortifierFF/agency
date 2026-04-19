"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { pulseIntroHyperspace, pulseRouteHyperspace } from "@/lib/cosmicDriver";
import { APEX_INTRO_HYPERSPACE_SETTLED, APEX_ROUTE_HYPERSPACE_SETTLED } from "@/lib/cosmicBootEvents";

/**
 * High-level phases for HTML choreography (navbar + hero fly-in).
 * The WebGL layer reads `cosmicDriver` directly for camera motion.
 */
export type CosmicLandingPhase = "loading" | "hyperspace" | "landed";

type CosmicExperienceValue = {
  landingPhase: CosmicLandingPhase;
  /** 0–100 while the boot overlay is driving fake progress. */
  loaderProgress: number;
  /** True once the user has finished the first boot in this SPA lifetime (no reload). */
  bootFinished: boolean;
  /**
   * During client navigations: hide the next page’s DOM until the route hyperspace pulse settles,
   * so the user sees stars first, then the new page “flies in from a star”.
   */
  routeVisualHold: boolean;
  /** Increments on each settled route hyperspace (used as a motion key for page arrivals). */
  routeArrivalGeneration: number;
  /** True while a route transition is flying through space. */
  routeTransitionActive: boolean;
  /** Mark progress during boot (fonts, images, etc.). */
  setLoaderProgress: (n: number) => void;
  /** Called when the overlay reaches 100% — starts hyperspace + navbar reveal. */
  completeBootLoader: () => void;
  /** Skip boot (e.g. reduced motion fast path). */
  skipBootMinimal: () => void;
  /** Triggers route hyperspace without the percentage loader. */
  triggerRouteHyperspace: () => void;
  /** Called synchronously on pathname change (before paint) so the incoming route can stay hidden. */
  beginRouteVisualHold: () => void;
  /** Start a timed route transition flight. */
  beginRouteTransition: () => void;
  /** Mark the active route transition as done. */
  endRouteTransition: () => void;
};

const CosmicExperienceContext = createContext<CosmicExperienceValue | null>(null);

export function CosmicExperienceProvider({ children }: { children: ReactNode }) {
  const [landingPhase, setLandingPhase] = useState<CosmicLandingPhase>("loading");
  const [loaderProgress, setLoaderProgressState] = useState(0);
  const [bootFinished, setBootFinished] = useState(false);
  const [routeVisualHold, setRouteVisualHold] = useState(false);
  const [routeArrivalGeneration, setRouteArrivalGeneration] = useState(0);
  const [routeTransitionActive, setRouteTransitionActive] = useState(false);
  const bootTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setLoaderProgress = useCallback((n: number) => {
    setLoaderProgressState((prev) => Math.max(prev, Math.min(100, Math.round(n))));
  }, []);

  const completeBootLoader = useCallback(() => {
    if (typeof window !== "undefined") window.scrollTo(0, 0);
    setLoaderProgressState(100);
    setLandingPhase("hyperspace");
    setBootFinished(true);
    pulseIntroHyperspace();
    if (bootTimer.current) clearTimeout(bootTimer.current);
    // Fallback if WebGL never mounts or the settle signal is missed (should be rare).
    bootTimer.current = setTimeout(() => {
      setLandingPhase((phase) => (phase === "hyperspace" ? "landed" : phase));
    }, 5200);
  }, []);

  const skipBootMinimal = useCallback(() => {
    if (typeof window !== "undefined") window.scrollTo(0, 0);
    setLoaderProgressState(100);
    setLandingPhase("landed");
    setBootFinished(true);
  }, []);

  const beginRouteVisualHold = useCallback(() => {
    setRouteVisualHold(true);
  }, []);

  const beginRouteTransition = useCallback(() => {
    setRouteTransitionActive(true);
    setRouteVisualHold(true);
  }, []);

  const endRouteTransition = useCallback(() => {
    setRouteTransitionActive(false);
  }, []);

  const triggerRouteHyperspace = useCallback(() => {
    pulseRouteHyperspace();
    // WebGL `tickCosmicDriver` zeros envelopes immediately when reduced motion is on —
    // the rAF “threshold crossing” never happens, so we fire the same handoff event here.
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      queueMicrotask(() => {
        window.dispatchEvent(new CustomEvent(APEX_ROUTE_HYPERSPACE_SETTLED));
        // No timed flight exists, so `RouteFlightController` has nothing to schedule against.
        endRouteTransition();
      });
    }
  }, [endRouteTransition]);

  useEffect(() => {
    return () => {
      if (bootTimer.current) clearTimeout(bootTimer.current);
    };
  }, []);

  // Hero / DOM “arrive from a star” starts only after the boot hyperspace camera has nearly stopped
  // (see `ImmersiveThreeBackground` dispatch). Avoids the handoff fighting forward camera motion.
  useEffect(() => {
    const onIntroHyperspaceSettled = () => {
      setLandingPhase((phase) => (phase === "hyperspace" ? "landed" : phase));
    };
    window.addEventListener(APEX_INTRO_HYPERSPACE_SETTLED, onIntroHyperspaceSettled);
    return () => window.removeEventListener(APEX_INTRO_HYPERSPACE_SETTLED, onIntroHyperspaceSettled);
  }, []);

  useEffect(() => {
    const onRouteHyperspaceSettled = () => {
      setRouteVisualHold(false);
      setRouteArrivalGeneration((g) => g + 1);
    };
    window.addEventListener(APEX_ROUTE_HYPERSPACE_SETTLED, onRouteHyperspaceSettled);
    return () => window.removeEventListener(APEX_ROUTE_HYPERSPACE_SETTLED, onRouteHyperspaceSettled);
  }, []);

  const value = useMemo(
    () => ({
      landingPhase,
      loaderProgress,
      bootFinished,
      routeVisualHold,
      routeArrivalGeneration,
      routeTransitionActive,
      setLoaderProgress,
      completeBootLoader,
      skipBootMinimal,
      triggerRouteHyperspace,
      beginRouteVisualHold,
      beginRouteTransition,
      endRouteTransition,
    }),
    [
      landingPhase,
      loaderProgress,
      bootFinished,
      routeVisualHold,
      routeArrivalGeneration,
      routeTransitionActive,
      setLoaderProgress,
      completeBootLoader,
      skipBootMinimal,
      triggerRouteHyperspace,
      beginRouteVisualHold,
      beginRouteTransition,
      endRouteTransition,
    ]
  );

  return <CosmicExperienceContext.Provider value={value}>{children}</CosmicExperienceContext.Provider>;
}

export function useCosmicExperience() {
  const ctx = useContext(CosmicExperienceContext);
  if (!ctx) {
    throw new Error("useCosmicExperience must be used within CosmicExperienceProvider");
  }
  return ctx;
}

/** Safe for components that may render outside the provider (returns null). */
export function useCosmicExperienceOptional() {
  return useContext(CosmicExperienceContext);
}
