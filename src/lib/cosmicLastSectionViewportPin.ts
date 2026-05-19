/**
 * Last cosmic plate on a page: after it has fully opened, scrolling **down** toward the footer
 * normally shrinks it (the viewport “exit” leg wins). We pin phase to **1** until the user
 * scrolls **up**, then the usual tent curve applies again.
 */

export type CosmicLastSectionPinRefs = {
  lastScrollY: { current: number };
  didShowFull: { current: boolean };
};

export function createCosmicLastSectionPinRefs(initialScrollY: number): CosmicLastSectionPinRefs {
  return {
    lastScrollY: { current: initialScrollY },
    didShowFull: { current: false },
  };
}

/** Pixels scrollY must drop before we treat the gesture as “up” — avoids pin flapping on noise. */
const SCROLL_UP_DELTA_PX = 10;

/**
 * After unpin on scroll-up, keep phase at **1** while geometry still says “mostly full”.
 * Otherwise `raw = min(enter, exit)` can dip for a frame (subpixel / layout) and the plate
 * flashes smaller then snaps back — bad UX.
 */
const SCROLL_UP_FULL_HOLD_RAW = 0.93;

export function computeLastSectionViewportPhase(
  enabled: boolean,
  enter: number,
  exit: number,
  scrollY: number,
  refs: CosmicLastSectionPinRefs
): { phase: number; pinActive: boolean } {
  const raw = Math.min(enter, exit);
  if (!enabled) {
    refs.lastScrollY.current = scrollY;
    return { phase: raw, pinActive: false };
  }

  // Latch once the plate has opened enough; threshold slightly low so tall sections still qualify.
  if (raw >= 0.88) refs.didShowFull.current = true;

  const scrollUp = scrollY < refs.lastScrollY.current - SCROLL_UP_DELTA_PX;
  refs.lastScrollY.current = scrollY;

  // Pin while scrolling down and the **exit** leg would shrink the plate (toward footer). Do not
  // require `exit < enter - margin` — with wide bands `enter` can fall with `exit` and miss the gap.
  const exitWouldShrink = exit < enter;
  const pinActive =
    refs.didShowFull.current && !scrollUp && raw < 0.998 && exitWouldShrink;

  if (pinActive) return { phase: 1, pinActive: true };

  // Scroll-up release: stay visually full until the viewport band actually leaves “open” territory.
  if (refs.didShowFull.current && scrollUp && raw >= SCROLL_UP_FULL_HOLD_RAW) {
    return { phase: 1, pinActive: false };
  }

  return { phase: raw, pinActive: false };
}
