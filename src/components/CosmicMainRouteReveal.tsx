"use client";

import { usePathname } from "@/i18n/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { useCosmicExperienceOptional } from "@/context/CosmicExperienceContext";

/**
 * Wraps routed page content so in-app navigations feel like the first load:
 * hidden during the route hyperspace pulse, then a short “arrive from deep space” motion.
 *
 * The home page (`/`) already uses scroll-linked `CosmicSectionFrame` plates — we skip the
 * extra whole-page motion there to avoid double depth cues.
 */
export function CosmicMainRouteReveal({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
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

  const isHome = pathname === "/";
  if (routeArrivalGeneration === 0 || isHome) {
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
