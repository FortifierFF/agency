import * as THREE from "three";

/**
 * 32-bit FNV-1a — deterministic from string + salt so each page gets its own fixed “constellation”.
 * Same `(layoutKey, index)` always yields the same numbers across sessions and builds.
 */
function fnv1aHash32(str: string, salt: number): number {
  let h = (2166136261 ^ (salt | 0)) >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

function u01(h: number): number {
  return (h & 0xfffffff) / 0xfffffff;
}

/**
 * World-space position for anchor sprite `index` on `layoutKey` (e.g. `/`, `/about`).
 * **Not random per frame** — purely a function of those inputs.
 */
export function getRouteAnchorWorldPosition(layoutKey: string, index: number, target: THREE.Vector3): THREE.Vector3 {
  const key = layoutKey.replace(/\/+$/, "") || "/";
  const hx = fnv1aHash32(`${key}#anchor:x#${index}`, index * 7919);
  const hy = fnv1aHash32(`${key}#anchor:y#${index}`, index * 7933);
  const hz = fnv1aHash32(`${key}#anchor:z#${index}`, index * 7949);

  const u = u01(hx);
  const v = u01(hy);
  const w = u01(hz);

  // Tighter XY spread than the warp field so section anchors read nearer the **screen center**
  // (still deterministic per `layoutKey` + `index`). Z band kept modest so they stay a compact group.
  const x = (u - 0.5) * 64;
  const y = (v - 0.5) * 42;
  const z = -72 - w * 48;
  return target.set(x, y, z);
}
