"use client";

import type { ReactNode } from "react";
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "@/i18n/navigation";
import {
  getRouteAnchorScreenVersion,
  getRouteAnchorViewportPoint,
  isRouteAnchorsSurfaceReady,
  subscribeRouteAnchorScreen,
} from "@/components/home/routeAnchorScreenBridge";

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

type CosmicRouteSectionShellProps = {
  anchorIndex: number;
  children: ReactNode;
};

/**
 * Route page sections (non-home): hidden until route anchors are ready, then each section scales
 * from/to its assigned anchor index as it enters/leaves the viewport.
 */
export function CosmicRouteSectionShell({ anchorIndex, children }: CosmicRouteSectionShellProps) {
  const pathname = usePathname();
  const layoutKey = pathname.replace(/\/+$/, "") || "/";
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [originCss, setOriginCss] = useState("50% 50%");
  const [phase, setPhase] = useState(0);

  useSyncExternalStore(subscribeRouteAnchorScreen, getRouteAnchorScreenVersion, () => 0);
  const ready = isRouteAnchorsSurfaceReady(layoutKey);
  const point = getRouteAnchorViewportPoint(layoutKey, anchorIndex);

  useEffect(() => {
    setPhase(0);
  }, [layoutKey, anchorIndex]);

  useLayoutEffect(() => {
    const el = hostRef.current;
    if (!el || !point) {
      setOriginCss("50% 50%");
      return;
    }
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) return;
    setOriginCss(`${point.x - r.left}px ${point.y - r.top}px`);
  }, [point, phase]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = hostRef.current;
      if (!el || !ready) {
        setPhase(0);
        return;
      }
      const rect = el.getBoundingClientRect();
      const vh = Math.max(1, window.innerHeight);
      // 0 below viewport, rises near center, falls after passing above.
      const enter = clamp01((vh * 0.92 - rect.top) / (vh * 0.72));
      const exit = clamp01((rect.bottom - vh * 0.08) / (vh * 0.72));
      setPhase(Math.min(enter, exit));
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
  }, [ready, layoutKey, anchorIndex]);

  const eased = phase >= 1 ? 1 : 1 - Math.pow(1 - phase, 2.2);
  const scale = 0.11 + (1 - 0.11) * eased;
  const z = -170 + 124 * eased;
  const opacity = ready ? Math.max(0, Math.pow(phase, 0.78)) : 0;

  return (
    <div
      ref={hostRef}
      className="w-full"
      style={{
        perspective: "2000px",
        perspectiveOrigin: "50% 50%",
      }}
    >
      <div
        style={{
          transform: `translate3d(0, 0, ${z}px) scale(${scale})`,
          transformOrigin: originCss,
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          opacity,
          pointerEvents: phase > 0.08 ? "auto" : "none",
          willChange: "transform, opacity",
        }}
      >
        {children}
      </div>
    </div>
  );
}
