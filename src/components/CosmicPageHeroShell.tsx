"use client";

import type { ReactNode } from "react";
import { CosmicSurfaceProvider } from "@/components/home/CosmicSurfaceContext";

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
/** Keep at 1: subpixel `scale()` on the glass layer makes headings/body type look soft in Chrome. */
const SCALE_AT_REST = 1;
const SHADOW_SPREAD = 72;
const SHADOW_LIFT = 0.42;

type CosmicPageHeroShellProps = {
  children: ReactNode;
  /** Optional width / spacing on the perspective root (e.g. `max-w-4xl mx-auto`). */
  className?: string;
  /** Horizontal padding inside the glass for `container`-less layouts. */
  pad?: "none" | "sm" | "md";
};

const padClass: Record<NonNullable<CosmicPageHeroShellProps["pad"]>, string> = {
  none: "",
  sm: "px-4 py-5 sm:px-6 sm:py-7",
  md: "px-5 py-7 sm:px-8 sm:py-9",
};

export function CosmicPageHeroShell({ children, className, pad = "md" }: CosmicPageHeroShellProps) {
  const innerPad = padClass[pad];

  return (
    <div
      className={["mx-auto w-full max-w-[100vw]", className ?? ""].filter(Boolean).join(" ")}
      style={{
        perspective: `${COSMIC_PERSPECTIVE_PX}px`,
        perspectiveOrigin: "50% 45%",
      }}
    >
      <div
        className={[
          "relative overflow-hidden rounded-2xl border p-[1px] shadow-2xl",
          "border-primary/35 dark:border-primary/25",
          "ring-1 ring-inset ring-primary/25",
          "transition-shadow duration-500",
        ].join(" ")}
        data-cosmic-page-hero="true"
        style={{
          transform: `translate3d(0, 0, ${Z_AT_REST}px) scale(${SCALE_AT_REST})`,
          transformOrigin: "center center",
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
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
          className="pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-2xl opacity-95"
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
            "relative z-10 rounded-[0.95rem] bg-gradient-to-b from-white/18 to-white/5 dark:from-white/10 dark:to-slate-950/40 [transform:translateZ(0)]",
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
