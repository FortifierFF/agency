"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCosmicExperienceOptional } from "@/context/CosmicExperienceContext";

/**
 * Wraps routed page content so in-app navigations feel like the first load:
 * hidden during the route hyperspace pulse, then a short “arrive from deep space” motion.
 *
 * Home uses the same shells and the same whole-page arrival motion as inner routes (e.g. About).
 */
export function CosmicMainRouteReveal({ children }: { children: React.ReactNode }) {
  const cosmic = useCosmicExperienceOptional();
  const reduceMotion = useReducedMotion();

  if (!cosmic) return <>{children}</>;

  const { routeVisualHold, routeArrivalGeneration, routeTransitionActive } = cosmic;

  if (reduceMotion) {
    return <>{children}</>;
  }

  // While the camera is “jumping”, keep the next route off-screen (stars read first).
  if (routeVisualHold || routeTransitionActive) {
    return (
      <div className="pointer-events-none invisible min-h-[50vh]" aria-hidden>
        {children}
      </div>
    );
  }

  // Same post-navigation motion on every route (including `/`) so home and About feel identical.
  if (routeArrivalGeneration === 0) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={routeArrivalGeneration}
      initial={{
        opacity: 0.12,
        scale: 0.82,
        rotateX: 11,
        y: 36,
        filter: "blur(10px)",
      }}
      animate={{
        opacity: 1,
        scale: 1,
        rotateX: 0,
        y: 0,
        filter: "blur(0px)",
      }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: "50% 38%", perspective: 1400 }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
}
