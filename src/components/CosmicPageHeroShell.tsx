"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CosmicSurfaceProvider } from "@/components/home/CosmicSurfaceContext";
import { usePathname } from "@/i18n/navigation";
import {
  getRouteAnchorScreenVersion,
  getRouteAnchorViewportPoint,
  isRouteAnchorsSurfaceReady,
  subscribeRouteAnchorScreen,
} from "@/components/home/routeAnchorScreenBridge";
import { computeHeroPlateScrollPhase } from "@/lib/cosmicPlateScrollBand";
import { computeCosmicPlateOpacity } from "@/lib/cosmicPlateViewportOpacity";

/**
 * Inner-route hero “plate”: shared glass / depth language with the home hero (also uses this shell).
 *
 * `CosmicMainRouteReveal` already handles the coarse “fly in from space” on navigations; this shell
 * is the premium frame the user reads against the global WebGL backdrop.
 *
 * Frosted glass is a **behind-content** layer only so type stays sharp.
 */
const COSMIC_PERSPECTIVE_PX = 14000;
const Z_AT_REST = -46;
const Z_FROM_BALL = -170;
/** At rest use `scale(1)` via `transform: none` — fractional scale blurs text in Chromium (see comment on SCALE_AT_REST). */
const SCALE_AT_REST = 1;
const SCALE_FROM_BALL = 0.12;
const SHADOW_SPREAD = 72;
const SHADOW_LIFT = 0.42;
const HERO_REVEAL_DELAY_MS = 80;
const HERO_REVEAL_MS = 880;
/** When hero motion is almost 1, use `transform: none` so type is not softened by ~0.999 scale. */
const HERO_SHARP_MOTION_THRESHOLD = 0.997;

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
  /** Glass layer that carries 3D transform — origin updated imperatively (no per‑frame React). */
  const plateRef = useRef<HTMLDivElement | null>(null);
  const readyAtRef = useRef<number | null>(null);
  const [revealT, setRevealT] = useState(0);
  const [scrollPhase, setScrollPhase] = useState(0);
  const lastPublishedScrollPhase = useRef(-1);
  // Keep snapshot primitive/stable; derive objects separately to avoid infinite update loops.
  useSyncExternalStore(
    subscribeRouteAnchorScreen,
    getRouteAnchorScreenVersion,
    () => 0
  );
  const ready = isRouteAnchorsSurfaceReady(layoutKey);

  const innerPad = padClass[pad];
  useEffect(() => {
    readyAtRef.current = null;
    setRevealT(0);
    setScrollPhase(0);
    lastPublishedScrollPhase.current = -1;
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

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = shellRef.current;
      const plate = plateRef.current;
      if (!el || !plate) return;

      if (!isRouteAnchorsSurfaceReady(layoutKey)) {
        plate.style.transformOrigin = "";
        if (lastPublishedScrollPhase.current !== 0) {
          lastPublishedScrollPhase.current = 0;
          setScrollPhase(0);
        }
        return;
      }

      const rect = el.getBoundingClientRect();
      const point = getRouteAnchorViewportPoint(layoutKey, 0);
      if (point && rect.width >= 4 && rect.height >= 4) {
        plate.style.transformOrigin = `${point.x - rect.left}px ${point.y - rect.top}px`;
      } else {
        plate.style.transformOrigin = "";
      }

      const vh = Math.max(1, window.innerHeight);
      const sp = computeHeroPlateScrollPhase(rect, vh, window.scrollY);
      if (Math.abs(sp - lastPublishedScrollPhase.current) > 0.004) {
        lastPublishedScrollPhase.current = sp;
        setScrollPhase(sp);
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
  }, [ready, layoutKey]);

  const revealEased = revealT >= 1 ? 1 : 1 - Math.pow(1 - revealT, 2.4);
  const scrollEased = scrollPhase >= 1 ? 1 : 1 - Math.pow(1 - scrollPhase, 2.2);
  const motion = Math.min(revealEased, scrollEased);
  const motionForTransform = motion >= HERO_SHARP_MOTION_THRESHOLD ? 1 : motion;
  const scale = SCALE_FROM_BALL + (SCALE_AT_REST - SCALE_FROM_BALL) * motionForTransform;
  const z = Z_FROM_BALL + (Z_AT_REST - Z_FROM_BALL) * motionForTransform;
  const heroSharpRest = motionForTransform >= 1;
  const opacity = computeCosmicPlateOpacity(motion, ready);
  const shellPointer = motion > 0.92 ? "auto" : "none";

  return (
    <div
      ref={shellRef}
      className={["mx-auto w-full max-w-[100vw]", className ?? ""]
        .filter(Boolean)
        .join(" ")}
      style={{
        perspective: heroSharpRest ? undefined : `${COSMIC_PERSPECTIVE_PX}px`,
        perspectiveOrigin: "50% 45%",
      }}
    >
      <div
        ref={plateRef}
        className={[
          "relative w-full min-h-[320px] md:min-h-[560px] overflow-hidden rounded-2xl border p-[1px] shadow-2xl antialiased text-foreground",
          "border-primary/35 dark:border-primary/25",
          "ring-1 ring-inset ring-primary/25",
          "transition-shadow duration-500",
        ].join(" ")}
        data-cosmic-page-hero="true"
        style={{
          transform: heroSharpRest ? "none" : `translate3d(0, 0, ${z}px) scale(${scale})`,
          transformStyle: heroSharpRest ? undefined : ("preserve-3d" as const),
          backfaceVisibility: heroSharpRest ? undefined : "hidden",
          opacity,
          pointerEvents: shellPointer,
          boxShadow: `0 0 0 1px rgba(255,255,255,0.06) inset, 0 ${SHADOW_SPREAD}px 110px rgba(0,0,0,${SHADOW_LIFT}), 0 0 90px rgba(80,120,255,0.14)`,
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl bg-white/12 backdrop-blur-md dark:bg-slate-950/50"
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
