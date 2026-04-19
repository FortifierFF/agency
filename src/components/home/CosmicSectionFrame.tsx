"use client";

import type { ReactNode } from "react";
import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { HOME_BG_SECTION_ORDER, type HomeBgSectionId } from "./homeBackgroundSections";
import { useHomeSectionCosmicPresence } from "./useHomeSectionCosmicPresence";
import { CosmicSurfaceProvider } from "./CosmicSurfaceContext";
import { getSectionPlateScale, subscribeCosmicSectionPresence } from "./cosmicSectionPresenceStore";
import { getBallViewportForSection, subscribeHomeAnchorScreen } from "./homeAnchorScreenBridge";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function depthTFromPresence(presence: number) {
  return Math.pow(clamp01(presence), 0.52);
}

function opacityFromPresence(presence: number) {
  if (presence <= 0.022) return 0;
  const t = clamp01((presence - 0.022) / (1 - 0.022));
  return Math.pow(t, 0.65);
}

/** DOM + WebGL share the same subscribe so `transform-origin` tracks projected balls each rAF. */
function subscribePresenceAndAnchors(cb: () => void) {
  const a = subscribeCosmicSectionPresence(cb);
  const b = subscribeHomeAnchorScreen(cb);
  return () => {
    a();
    b();
  };
}

/**
 * Ball-linked plates: **only `scale()`** from the projected anchor (no `translateZ` / no
 * `perspective`) so shrinking does not read as flying toward the browser chrome / vanishing point.
 *
 * `transform-origin` is measured against a **wrapper that has no transform** — using the plate’s
 * own `getBoundingClientRect()` while it is scaled skews the AABB and pins the origin to the wrong
 * side of the screen (often left / up).
 */
interface CosmicSectionFrameProps {
  sectionId: HomeBgSectionId;
  children: ReactNode;
}

export function CosmicSectionFrame({ sectionId, children }: CosmicSectionFrameProps) {
  const presence = useHomeSectionCosmicPresence(sectionId);
  /** Layout box of the plate **before** any CSS transform — stable rect for ball-relative origin. */
  const layoutMeasureRef = useRef<HTMLDivElement>(null);
  const [originCss, setOriginCss] = useState("50% 50%");

  const plateScale = useSyncExternalStore(
    subscribePresenceAndAnchors,
    () => getSectionPlateScale(sectionId),
    () => 0.11
  );

  const t = depthTFromPresence(presence);
  const isHero = sectionId === "hero";
  const sectionIndex = Math.max(0, HOME_BG_SECTION_ORDER.indexOf(sectionId));

  const scaleGeo = plateScale;

  const opacity = isHero ? opacityFromPresence(presence) : Math.min(1, opacityFromPresence(presence) * 1.14);

  const blurDecorPx = isHero ? lerp(7.5, 0, t) : lerp(7, 0, t);
  const brightDecor = lerp(0.76, 1, t);
  const satDecor = isHero ? lerp(0.78, 1.08, t) : lerp(0.82, 1.15, t);
  const decorOpacity = isHero ? lerp(0.42, 0.98, t) : lerp(0.32, 0.95, t);

  const shadowSpread = isHero ? lerp(36, 88, t) : lerp(34, 84, t);
  const shadowLift = isHero ? lerp(0.16, 0.48, t) : lerp(0.14, 0.46, t);

  useLayoutEffect(() => {
    const box = layoutMeasureRef.current;
    const pt = getBallViewportForSection(sectionId);
    if (!box || !pt) {
      setOriginCss(isHero ? "50% 44%" : "50% 50%");
      return;
    }
    // Untransformed border box in viewport space — same coordinate system as WebGL `setHomeAnchorViewportPixels`.
    const r = box.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) return;
    const ox = pt.x - r.left;
    const oy = pt.y - r.top;
    setOriginCss(`${ox}px ${oy}px`);
  }, [sectionId, isHero, plateScale, presence]);

  return (
    <div className="mx-auto w-full max-w-[100vw] px-0 sm:px-0">
      <div ref={layoutMeasureRef} className="relative w-full">
        <div
          className={[
            "relative overflow-hidden rounded-2xl border p-[1px] shadow-2xl",
            isHero
              ? "border-white/18 dark:border-white/12 ring-white/14"
              : "border-white/25 dark:border-white/15 ring-white/20 dark:ring-white/10",
            "ring-1 ring-inset",
            "transition-shadow duration-500",
          ].join(" ")}
          data-cosmic-depth={presence.toFixed(4)}
          data-cosmic-plate-scale={plateScale.toFixed(4)}
          data-cosmic-section-index={sectionIndex}
          style={{
            transform: `scale(${scaleGeo})`,
            transformOrigin: originCss,
            backfaceVisibility: "hidden",
            opacity,
            pointerEvents: opacity < 0.03 ? "none" : "auto",
            willChange: "transform, opacity",
            boxShadow: isHero
              ? `0 0 0 1px rgba(255,255,255,0.07) inset, 0 ${shadowSpread}px 120px rgba(0,0,0,${shadowLift}), 0 0 110px rgba(110,130,220,${0.08 + t * 0.12})`
              : `0 0 0 1px rgba(255,255,255,0.06) inset, 0 ${shadowSpread}px 110px rgba(0,0,0,${shadowLift}), 0 0 90px rgba(80,120,255,${0.05 + t * 0.1})`,
          }}
        >
          <div
            aria-hidden
            className={[
              "pointer-events-none absolute inset-0 rounded-2xl backdrop-blur-lg",
              isHero ? "bg-white/10 dark:bg-[#060913]/58" : "bg-white/12 dark:bg-slate-950/50",
            ].join(" ")}
            style={{ zIndex: 0 }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-2xl"
            style={{
              opacity: decorOpacity,
              filter: `blur(${blurDecorPx}px) brightness(${brightDecor}) saturate(${satDecor})`,
              willChange: "filter, opacity",
            }}
          >
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                background:
                  isHero
                    ? "linear-gradient(145deg, rgba(255,255,255,0.16) 0%, transparent 40%, rgba(120,135,200,0.12) 100%)"
                    : "linear-gradient(145deg, rgba(255,255,255,0.2) 0%, transparent 42%, rgba(140,100,255,0.14) 100%)",
              }}
            />
          </div>
          <div
            className={[
              isHero
                ? "relative z-10 rounded-[1.45rem] bg-gradient-to-b from-white/16 to-white/[0.045] p-1.5 dark:from-white/8 dark:to-[#050811]/44 sm:p-2.5"
                : "relative z-10 rounded-[0.95rem] bg-gradient-to-b from-white/18 to-white/5 p-1 dark:from-white/10 dark:to-slate-950/40 sm:p-2",
              "[transform:translateZ(0)]",
            ].join(" ")}
          >
            <CosmicSurfaceProvider>{children}</CosmicSurfaceProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
