/**
 * Shared viewport scroll bands for cosmic plates (`CosmicRouteSectionShell`, `CosmicPageHeroShell`).
 *
 * Tuned vs the original 0.92 / 0.08 / 0.72 bands:
 * - Later enter line → incoming sections start sliding in after a short “gap” (starfield).
 * - Higher exit line + narrower exit band → leaving sections shrink out faster.
 */

/** Section top must pass this viewport fraction before enter begins (lower line = delayed enter). */
export const COSMIC_PLATE_ENTER_LINE = 0.84;

/** Section bottom below this line → exit leg is 0 (higher = leave animation starts sooner). */
export const COSMIC_PLATE_EXIT_LINE = 0.14;

/** Viewport-height span for enter 0→1 (after the enter line). */
export const COSMIC_PLATE_ENTER_BAND_VH = 0.78;

/** Viewport-height span for exit 1→0 — narrower than enter = faster slide-out. */
export const COSMIC_PLATE_EXIT_BAND_VH = 0.5;

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

export function computeCosmicPlateEnterLeg(rectTop: number, vh: number): number {
  return clamp01(
    (vh * COSMIC_PLATE_ENTER_LINE - rectTop) / (vh * COSMIC_PLATE_ENTER_BAND_VH)
  );
}

export function computeCosmicPlateExitLeg(rectBottom: number, vh: number): number {
  return clamp01(
    (rectBottom - vh * COSMIC_PLATE_EXIT_LINE) / (vh * COSMIC_PLATE_EXIT_BAND_VH)
  );
}

/** Combined scroll phase used by shells (min of asymmetric enter / exit legs). */
export function computeCosmicPlateScrollPhase(rect: DOMRect, vh: number): number {
  const enter = computeCosmicPlateEnterLeg(rect.top, vh);
  const exit = computeCosmicPlateExitLeg(rect.bottom, vh);
  return Math.min(enter, exit);
}
