"use client";

import type { ReactNode } from "react";
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { CosmicSurfaceProvider } from "@/components/home/CosmicSurfaceContext";
import { usePathname } from "@/i18n/navigation";
import {
  getRouteAnchorScreenVersion,
  getRouteAnchorViewportPoint,
  isRouteAnchorsSurfaceReady,
  subscribeRouteAnchorScreen,
} from "@/components/home/routeAnchorScreenBridge";

/**
 * Inner-route hero “plate”: same glass / depth language as `CosmicSectionFrame` on the home page,
 * but **without** scroll presence (those values only exist for `data-home-bg-section` blocks).
 *
 * `CosmicMainRouteReveal` already handles the coarse “fly in from space” on navigations; this shell
 * is the premium frame the user reads against the global WebGL backdrop.
 *
 * Frosted glass is a **behind-content** layer only (see `CosmicSectionFrame`) so type stays sharp.
 */
const COSMIC_PERSPECTIVE_PX = 14000;
const Z_AT_REST = -46;
const Z_FROM_BALL = -170;
/** Keep at 1: subpixel `scale()` on the glass layer makes headings/body type look soft in Chrome. */
const SCALE_AT_REST = 1;
const SCALE_FROM_BALL = 0.12;
const SHADOW_SPREAD = 72;
const SHADOW_LIFT = 0.42;
const HERO_REVEAL_DELAY_MS = 80;
const HERO_REVEAL_MS = 880;

type CosmicPageHeroShellProps = {
  children: ReactNode;
  /** Optional width / spacing on the perspective root (e.g. `max-w-4xl mx-auto`). */
  className?: string;
  /** Horizontal padding inside the glass for `container`-less layouts. */
  pad?: "none" | "sm" | "md";
};

const padClass: Record<NonNullable<CosmicPageHeroShellProps["pad"]>, string> = {
  none: "",
  sm: "px-4 py-7 sm:px-6 sm:py-10",
  md: "px-5 py-12 sm:px-8 sm:py-12",
};

export function CosmicPageHeroShell({ children, className, pad = "md" }: CosmicPageHeroShellProps) {
  const pathname = usePathname();
  const layoutKey = pathname.replace(/\/+$/, "") || "/";
  const shellRef = useRef<HTMLDivElement | null>(null);
  const readyAtRef = useRef<number | null>(null);
  const [originCss, setOriginCss] = useState("50% 50%");
  const [revealT, setRevealT] = useState(0);
  const [scrollPhase, setScrollPhase] = useState(0);
  // Keep snapshot primitive/stable; derive objects separately to avoid infinite update loops.
  useSyncExternalStore(
    subscribeRouteAnchorScreen,
    getRouteAnchorScreenVersion,
    () => 0
  );
  const ready = isRouteAnchorsSurfaceReady(layoutKey);
  const point = getRouteAnchorViewportPoint(layoutKey, 0);

  const innerPad = padClass[pad];
  useEffect(() => {
    readyAtRef.current = null;
    setRevealT(0);
    setScrollPhase(0);
  }, [layoutKey]);

  useEffect(() => {
    if (!ready) {
      readyAtRef.current = null;
      setRevealT(0);
      return;
    }
    if (readyAtRef.current == null) readyAtRef.current = performance.now();
    let raf = 0;
    const tick = () => {
      const start = readyAtRef.current;
      if (start == null) return;
      const raw = (performance.now() - start - HERO_REVEAL_DELAY_MS) / HERO_REVEAL_MS;
      const t = Math.max(0, Math.min(1, raw));
      setRevealT(t);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ready]);

  useLayoutEffect(() => {
    const el = shellRef.current;
    if (!el || !point) {
      setOriginCss("50% 50%");
      return;
    }
    const rect = el.getBoundingClientRect();
    if (rect.width < 4 || rect.height < 4) return;
    setOriginCss(`${point.x - rect.left}px ${point.y - rect.top}px`);
  }, [point, revealT]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = shellRef.current;
      if (!el || !ready) {
        setScrollPhase(0);
        return;
      }
      const rect = el.getBoundingClientRect();
      const vh = Math.max(1, window.innerHeight);
      const enter = Math.max(0, Math.min(1, (vh * 0.92 - rect.top) / (vh * 0.72)));
      const exit = Math.max(0, Math.min(1, (rect.bottom - vh * 0.08) / (vh * 0.72)));
      setScrollPhase(Math.min(enter, exit));
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
  }, [ready, layoutKey]);

  const revealEased = revealT >= 1 ? 1 : 1 - Math.pow(1 - revealT, 2.4);
  const scrollEased = scrollPhase >= 1 ? 1 : 1 - Math.pow(1 - scrollPhase, 2.2);
  const motion = Math.min(revealEased, scrollEased);
  const scale = SCALE_FROM_BALL + (SCALE_AT_REST - SCALE_FROM_BALL) * motion;
  const z = Z_FROM_BALL + (Z_AT_REST - Z_FROM_BALL) * motion;
  const opacity = ready ? Math.max(0, Math.pow(motion, 0.78)) : 0;
  const shellPointer = motion > 0.92 ? "auto" : "none";

  return (
    <div
      ref={shellRef}
      className={["mx-auto w-full max-w-[100vw]", className ?? ""]
        .filter(Boolean)
        .join(" ")}
      style={{
        perspective: `${COSMIC_PERSPECTIVE_PX}px`,
        perspectiveOrigin: "50% 45%",
      }}
    >
      <div
        className={[
          "relative w-full min-h-[320px] md:min-h-[560px] overflow-hidden rounded-2xl border p-[1px] shadow-2xl",
          "border-primary/35 dark:border-primary/25",
          "ring-1 ring-inset ring-primary/25",
          "transition-shadow duration-500",
        ].join(" ")}
        data-cosmic-page-hero="true"
        style={{
          transform: `translate3d(0, 0, ${z}px) scale(${scale})`,
          transformOrigin: originCss,
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          opacity,
          pointerEvents: shellPointer,
          boxShadow: `0 0 0 1px rgba(255,255,255,0.06) inset, 0 ${SHADOW_SPREAD}px 110px rgba(0,0,0,${SHADOW_LIFT}), 0 0 90px rgba(80,120,255,0.14)`,
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl bg-white/12 backdrop-blur-lg dark:bg-slate-950/50"
          style={{ zIndex: 0 }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-2xl opacity-95 flex"
          style={{
            filter: "brightness(1) saturate(1.12)",
          }}
        >
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.2) 0%, transparent 42%, rgba(140,100,255,0.14) 100%)",
            }}
          />
        </div>
        <div
          className={[
            "relative z-10 flex min-h-[318px] md:min-h-[558px] items-center rounded-[0.95rem] bg-gradient-to-b from-white/18 to-white/5 dark:from-white/10 dark:to-slate-950/40 [transform:translateZ(0)]",
            innerPad,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <CosmicSurfaceProvider>{children}</CosmicSurfaceProvider>
        </div>
      </div>
    </div>
  );
}
