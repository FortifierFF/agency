"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCosmicExperience } from "@/context/CosmicExperienceContext";

/**
 * Full-viewport boot UI: animated 0–100% track, then hands off to hyperspace + navbar.
 * Shown only while `landingPhase === 'loading'` on first SPA mount.
 */
export function SiteBootOverlay() {
  const cosmic = useCosmicExperience();
  const cosmicRef = useRef(cosmic);
  cosmicRef.current = cosmic;
  const raf = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      cosmicRef.current.skipBootMinimal();
      return;
    }

    const minMs = 2500;
    const maxMs = 6000;

    const tick = (now: number) => {
      const c = cosmicRef.current;
      if (startRef.current === null) startRef.current = now;
      const t0 = startRef.current;
      const elapsed = now - t0;

      let loadFactor = 0;
      if (document.readyState === "complete") loadFactor = 1;
      else if (document.readyState === "interactive") loadFactor = 0.76;
      else loadFactor = 0.34;

      const timeFactor = Math.min(1, elapsed / minMs);
      const easedTime = 1 - Math.pow(1 - timeFactor, 2.1);

      let blended = 0;
      if (timeFactor < 0.18) {
        blended = Math.floor(timeFactor * 85);
      } else if (document.readyState !== "complete") {
        blended = Math.min(93, Math.floor((loadFactor * 0.58 + easedTime * 0.42) * 100));
      } else {
        blended = Math.min(99, Math.floor((loadFactor * 0.7 + easedTime * 0.3) * 100));
      }

      c.setLoaderProgress(blended);

      const done =
        document.readyState === "complete" &&
        elapsed >= minMs &&
        blended >= 97;

      if (done) {
        c.completeBootLoader();
        return;
      }

      if (elapsed > maxMs) {
        c.setLoaderProgress(100);
        c.completeBootLoader();
        return;
      }

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    const onLoad = () => cosmicRef.current.setLoaderProgress(92);
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const visible = cosmic.landingPhase === "loading";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="site-boot"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#02040a] text-foreground"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }}
          aria-busy
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={cosmic.loaderProgress}
          role="progressbar"
        >
          {/* Soft nebula wash, restrained and mostly monochrome in phase 1 */}
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(ellipse 80% 55% at 50% 40%, rgba(140,160,220,0.18), transparent 60%), radial-gradient(ellipse 60% 40% at 70% 70%, rgba(120,135,180,0.08), transparent 55%), radial-gradient(ellipse 45% 28% at 20% 78%, rgba(255,255,255,0.05), transparent 65%)",
            }}
          />
          <div className="relative z-10 flex w-[min(92vw,460px)] flex-col items-stretch gap-7 px-6">
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-[0.38em] text-primary/90">apex</p>
              <p className="mt-2 text-[11px] text-muted-foreground/90">Calibrating navigation, motion, and content surfaces</p>
            </div>

            {/* Track + soft scan line — reads “instrument panel” without extra WebGL. */}
            <div className="relative h-2 overflow-hidden rounded-full bg-white/[0.07] ring-1 ring-white/15 shadow-[0_0_40px_rgba(80,120,255,0.18)]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary via-sky-400 to-violet-400"
                style={{ width: `${cosmic.loaderProgress}%` }}
                layout
              />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 w-14 bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-70"
                animate={{ x: ["-30%", "130%"] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
              />
            </div>

            <div className="flex items-end justify-between gap-4">
              <div className="text-xs text-muted-foreground">
                <p className="font-medium text-foreground/90">Sequence</p>
                <p className="mt-1 max-w-[220px] leading-relaxed">Loader → hyperspace → staged navbar → hero arrival</p>
              </div>
              <div className="text-right tabular-nums">
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Progress</p>
                <p className="mt-1 text-4xl font-semibold tracking-tight text-foreground drop-shadow-[0_0_22px_rgba(120,160,255,0.35)]">
                  {cosmic.loaderProgress}
                  <span className="text-lg align-top text-primary/90">%</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
