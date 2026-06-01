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
import {
  computeCosmicPlateEnterLeg,
  computeCosmicPlateExitLeg,
} from "@/lib/cosmicPlateScrollBand";
import { computeCosmicPlateOpacity } from "@/lib/cosmicPlateViewportOpacity";
import { COSMIC_SECTION_MIN_VIEWPORT_CLASS } from "@/lib/cosmicSectionLayout";
import { cn } from "@/lib/utils";

/** Starfield gap between card plates — not used on blue CTA (`tone="primary"`) so it can meet the footer. */
const SECTION_SHELL_GAP_CLASS = "mb-10";

/** Past this eased value, use `transform: none` so text is not rasterized at ~0.999 scale (soft in Chrome). */
const PLATE_SHARP_EASE_THRESHOLD = 0.997;

/** Blue CTA plate — same as dark `bg-primary` / `--primary`; always painted, opacity ramps on scroll. */
const PRIMARY_PLATE_BG = "#3c83f6";
/** Peak opacity on the blue strip (slightly below 1 to soften compositing over the starfield). */
const PRIMARY_PLATE_MAX_OPACITY = 0.99;

/** Solid surface behind section content (About “What we believe” uses `card`). */
export type CosmicRouteSectionTone = "card" | "primary";

const toneClassName: Record<CosmicRouteSectionTone, string> = {
  card: "bg-card text-foreground",
  primary: "text-primary-foreground",
};

type CosmicRouteSectionShellProps = {
  anchorIndex: number;
  children: ReactNode;
  /** Opaque plate — default matches About values section (`bg-card`). */
  tone?: CosmicRouteSectionTone;
};

/**
 * Section plates: hidden until route anchors are ready, then each section scales from/to its
 * assigned anchor index as it enters/leaves the viewport.
 *
 * Blue CTA (`tone="primary"`): no wheel anchor for its index (registry count excludes it) → scales
 * from plate center like About. Other shells use projected star origins when available.
 */
export function CosmicRouteSectionShell({
  anchorIndex,
  children,
  tone = "card",
}: CosmicRouteSectionShellProps) {
  const pathname = usePathname();
  const layoutKey = pathname.replace(/\/+$/, "") || "/";
  const hostRef = useRef<HTMLDivElement | null>(null);
  const plateRef = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState(0);
  const [lastSectionPin, setLastSectionPin] = useState(false);
  const pinRefs = useRef(createCosmicLastSectionPinRefs(0));
  const lastPublishedPhase = useRef(-1);
  const lastPublishedPin = useRef(false);

  useSyncExternalStore(subscribeCosmicRouteSectionShellMount, getCosmicRouteSectionShellMountVersion, () => 0);
  const maxMountedAnchor = getMaxMountedRouteSectionShellAnchor(layoutKey);
  const isLastSection = anchorIndex === maxMountedAnchor && maxMountedAnchor >= 0;

  useLayoutEffect(() => {
    return registerCosmicRouteSectionShellAnchor(layoutKey, anchorIndex);
  }, [layoutKey, anchorIndex]);

  useSyncExternalStore(subscribeRouteAnchorScreen, getRouteAnchorScreenVersion, () => 0);
  const ready = isRouteAnchorsSurfaceReady(layoutKey);

  const plateFullWidth = tone === "primary";

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
      const enter = computeCosmicPlateEnterLeg(rect.top, vh);
      const exit = computeCosmicPlateExitLeg(rect.bottom, vh);
      const { phase: p, pinActive } = computeLastSectionViewportPhase(
        isLastSection,
        enter,
        exit,
        window.scrollY,
        pinRefs.current
      );

      if (!plateFullWidth) {
        const point = getRouteAnchorViewportPoint(layoutKey, anchorIndex);
        if (point && rect.width >= 4 && rect.height >= 4) {
          plate.style.transformOrigin = `${point.x - rect.left}px ${point.y - rect.top}px`;
        } else {
          plate.style.transformOrigin = "";
        }
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
  }, [layoutKey, anchorIndex, isLastSection, ready, plateFullWidth]);

  const eased = phase >= 1 ? 1 : 1 - Math.pow(1 - phase, 2.2);
  const easedForTransform = eased >= PLATE_SHARP_EASE_THRESHOLD ? 1 : eased;
  const plateOpacity = computeCosmicPlateOpacity(phase, ready);

  const scale = 0.11 + (1 - 0.11) * easedForTransform;
  const z = -170 + 124 * easedForTransform;
  const atSharpRest = easedForTransform >= 1;

  const plateTransform = atSharpRest
    ? "none"
    : `translate3d(0, 0, ${z}px) scale(${scale})`;

  return (
    <div
      ref={hostRef}
      className={cn(
        "w-full",
        !plateFullWidth && SECTION_SHELL_GAP_CLASS,
        !plateFullWidth && "flex justify-center"
      )}
      style={{
        perspective: !atSharpRest ? "2000px" : undefined,
        perspectiveOrigin: "50% 50%",
        zIndex: lastSectionPin ? 28 : undefined,
      }}
    >
      <div
        ref={plateRef}
        className={cn(
          "antialiased",
          plateFullWidth ? "w-full" : "container overflow-hidden rounded-2xl",
          toneClassName[tone]
        )}
        style={{
          transform: plateTransform,
          transformStyle: !atSharpRest ? "preserve-3d" : undefined,
          backfaceVisibility: !atSharpRest ? "hidden" : undefined,
          backgroundColor: plateFullWidth ? PRIMARY_PLATE_BG : undefined,
          opacity: plateFullWidth
            ? Math.min(plateOpacity, PRIMARY_PLATE_MAX_OPACITY)
            : plateOpacity,
          pointerEvents: phase > 0.08 ? "auto" : "none",
        }}
      >
        <div className={cn(!plateFullWidth && COSMIC_SECTION_MIN_VIEWPORT_CLASS)}>
          {children}
        </div>
      </div>
    </div>
  );
}
