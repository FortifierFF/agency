/**
 * Tracks which `anchorIndex` values are actually mounted in `CosmicRouteSectionShell` for a
 * layout key. Registry `resolveRouteSectionAnchorCount` is WebGL anchor **count**, not the max
 * section index (pages use hero @0 separately and often number body shells `1..N` with `N === count`).
 * We need the **maximum mounted** index so the last DOM shell can enable footer pin behavior.
 */

const anchorsByLayout = new Map<string, Set<number>>();
let version = 0;
const listeners = new Set<() => void>();

function notify() {
  version += 1;
  listeners.forEach((fn) => fn());
}

/** Call from `CosmicRouteSectionShell` on mount; returned cleanup runs on unmount. */
export function registerCosmicRouteSectionShellAnchor(layoutKey: string, anchorIndex: number) {
  let set = anchorsByLayout.get(layoutKey);
  if (!set) {
    set = new Set();
    anchorsByLayout.set(layoutKey, set);
  }
  set.add(anchorIndex);
  notify();
  return () => {
    const s = anchorsByLayout.get(layoutKey);
    if (!s) return;
    s.delete(anchorIndex);
    if (s.size === 0) anchorsByLayout.delete(layoutKey);
    notify();
  };
}

export function subscribeCosmicRouteSectionShellMount(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getCosmicRouteSectionShellMountVersion() {
  return version;
}

/** -1 if nothing registered yet (first paint). */
export function getMaxMountedRouteSectionShellAnchor(layoutKey: string): number {
  const set = anchorsByLayout.get(layoutKey);
  if (!set || set.size === 0) return -1;
  return Math.max(...set);
}
