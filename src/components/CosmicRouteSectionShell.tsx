"use client";

import type { ReactNode } from "react";
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "@/i18n/navigation";
import {
  computeLastSectionViewportPhase,
  createCosmicLastSectionPinRefs,
} from "@/lib/cosmicLastSectionViewportPin";
import {
  getCosmicRouteSectionShellMountVersion,
  getMaxMountedRouteSectionShellAnchor,
  registerCosmicRouteSectionShellAnchor,
  subscribeCosmicRouteSectionShellMount,
} from "@/components/home/cosmicRouteSectionShellMount";
import {
  getRouteAnchorScreenVersion,
  getRouteAnchorViewportPoint,
  isRouteAnchorsSurfaceReady,
  subscribeRouteAnchorScreen,
} from "@/components/home/routeAnchorScreenBridge";
import { computeCosmicPlateOpacity } from "@/lib/cosmicPlateViewportOpacity";

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

/** Past this eased value, use `transform: none` so text is not rasterized at ~0.999 scale (soft in Chrome). */
const PLATE_SHARP_EASE_THRESHOLD = 0.997;

type CosmicRouteSectionShellProps = {
  anchorIndex: number;
  children: ReactNode;
};

/**
 * Section plates: hidden until route anchors are ready, then each section scales from/to its
 * assigned anchor index as it enters/leaves the viewport (home and inner routes use the same shell).
 */
export function CosmicRouteSectionShell({ anchorIndex, children }: CosmicRouteSectionShellProps) {
  const pathname = usePathname();
  const layoutKey = pathname.replace(/\/+$/, "") || "/";
  const hostRef = useRef<HTMLDivElement | null>(null);
  /** Imperative origin — avoids React render + layout on every WebGL anchor push. */
  const plateRef = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState(0);
  const [lastSectionPin, setLastSectionPin] = useState(false);
  const pinRefs = useRef(createCosmicLastSectionPinRefs(0));
  /** Throttle React commits: scroll can fire many times per frame; phase rarely needs sub‑1‰ precision. */
  const lastPublishedPhase = useRef(-1);
  const lastPublishedPin = useRef(false);

  useSyncExternalStore(subscribeCosmicRouteSectionShellMount, getCosmicRouteSectionShellMountVersion, () => 0);
  const maxMountedAnchor = getMaxMountedRouteSectionShellAnchor(layoutKey);
  const isLastSection = anchorIndex === maxMountedAnchor && maxMountedAnchor >= 0;

  useLayoutEffect(() => {
    return registerCosmicRouteSectionShellAnchor(layoutKey, anchorIndex);
  }, [layoutKey, anchorIndex]);

  // Only re-render when the bridge signals layout/readiness changes — not on every projected pixel tick.
  useSyncExternalStore(subscribeRouteAnchorScreen, getRouteAnchorScreenVersion, () => 0);
  const ready = isRouteAnchorsSurfaceReady(layoutKey);

  useEffect(() => {
    setPhase(0);
    setLastSectionPin(false);
    lastPublishedPhase.current = -1;
    lastPublishedPin.current = false;
    pinRefs.current.lastScrollY.current = typeof window !== "undefined" ? window.scrollY : 0;
    pinRefs.current.didShowFull.current = false;
  }, [layoutKey, anchorIndex]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = hostRef.current;
      const plate = plateRef.current;
      if (!el || !plate) return;

      if (!isRouteAnchorsSurfaceReady(layoutKey)) {
        plate.style.transformOrigin = "";
        if (lastPublishedPhase.current !== 0 || lastPublishedPin.current) {
          lastPublishedPhase.current = 0;
          lastPublishedPin.current = false;
          setPhase(0);
          setLastSectionPin(false);
        }
        return;
      }

      const rect = el.getBoundingClientRect();
      const vh = Math.max(1, window.innerHeight);
      const enter = clamp01((vh * 0.92 - rect.top) / (vh * 0.72));
      const exit = clamp01((rect.bottom - vh * 0.08) / (vh * 0.72));
      const { phase: p, pinActive } = computeLastSectionViewportPhase(
        isLastSection,
        enter,
        exit,
        window.scrollY,
        pinRefs.current
      );

      const point = getRouteAnchorViewportPoint(layoutKey, anchorIndex);
      if (point && rect.width >= 4 && rect.height >= 4) {
        plate.style.transformOrigin = `${point.x - rect.left}px ${point.y - rect.top}px`;
      } else {
        plate.style.transformOrigin = "";
      }

      const phaseChanged = Math.abs(p - lastPublishedPhase.current) > 0.004;
      const pinChanged = pinActive !== lastPublishedPin.current;
      if (phaseChanged || pinChanged) {
        lastPublishedPhase.current = p;
        lastPublishedPin.current = pinActive;
        setPhase(p);
        setLastSectionPin(pinActive);
      }
    };
    const queueTick = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        tick();
      });
    };
    tick();
    window.addEventListener("scroll", queueTick, { passive: true });
    window.addEventListener("resize", queueTick);
    return () => {
      window.removeEventListener("scroll", queueTick);
      window.removeEventListener("resize", queueTick);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [layoutKey, anchorIndex, isLastSection, ready]);

  const eased = phase >= 1 ? 1 : 1 - Math.pow(1 - phase, 2.2);
  const easedForTransform = eased >= PLATE_SHARP_EASE_THRESHOLD ? 1 : eased;
  const scale = 0.11 + (1 - 0.11) * easedForTransform;
  const z = -170 + 124 * easedForTransform;
  const atSharpRest = easedForTransform >= 1;
  const opacity = computeCosmicPlateOpacity(phase, ready);

  return (
    <div
      ref={hostRef}
      className="w-full"
      style={{
        perspective: atSharpRest ? undefined : "2000px",
        perspectiveOrigin: "50% 50%",
        // Pinned last plate should paint above neighbors while scrolling toward the footer.
        zIndex: lastSectionPin ? 28 : undefined,
      }}
    >
      <div
        ref={plateRef}
        className="antialiased text-foreground"
        style={{
          transform: atSharpRest ? "none" : `translate3d(0, 0, ${z}px) scale(${scale})`,
          transformStyle: atSharpRest ? undefined : ("preserve-3d" as const),
          backfaceVisibility: atSharpRest ? undefined : "hidden",
          opacity,
          pointerEvents: phase > 0.08 ? "auto" : "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}
