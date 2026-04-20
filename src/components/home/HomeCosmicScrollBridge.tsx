"use client";

import { useEffect, useLayoutEffect } from "react";
import { invalidateHomeScrollBandSnap, tickCosmicSectionPresenceStore } from "./cosmicSectionPresenceStore";

/**
 * One scroll/resize listener for all cosmic sections — updates the shared presence store
 * so sections can chain off the previous block’s shrink (next star appears ~70% through exit).
 */
export function HomeCosmicScrollBridge() {
  // Defer the first read until after the browser paints Home — avoids sync layout fighting WebGL
  // the same frame you land on `/` (can feel like the starfield “hiccups”).
  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => tickCosmicSectionPresenceStore());
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    let raf = 0;
    const flush = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        tickCosmicSectionPresenceStore();
      });
    };
    const onScroll = () => flush();
    const onResize = () => {
      // Viewport height shifts band math; drop frozen centers so the next tick re-snaps cleanly.
      invalidateHomeScrollBandSnap();
      flush();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
