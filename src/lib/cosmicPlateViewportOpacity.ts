/**
 * Scroll band for cosmic plates (matches `CosmicRouteSectionShell` / `CosmicPageHeroShell`):
 * - enter: (vh * 0.92 - rect.top) / (vh * 0.72)
 * - exit:  (rect.bottom - vh * 0.08) / (vh * 0.72)
 * - phase ≈ min(enter, exit) after easing / last-section pin
 *
 * In the center band (high phase), content stays fully opaque so cards/backdrop-blur
 * do not look see-through over the starfield. Edges still fade with scroll.
 */

/** `min(enter, exit)` at or above this = “on stage” in the viewport → plate opacity 1. */
export const COSMIC_PLATE_FULL_OPACITY_PHASE = 0.88;

const PLATE_EDGE_OPACITY_POWER = 0.78;

export function computeCosmicPlateOpacity(phase: number, ready: boolean): number {
  if (!ready || phase <= 0) return 0;
  if (phase >= COSMIC_PLATE_FULL_OPACITY_PHASE) return 1;
  return Math.pow(phase, PLATE_EDGE_OPACITY_POWER);
}
