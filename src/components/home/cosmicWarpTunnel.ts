import * as THREE from "three";

export type CosmicWarpTunnel = {
  points: THREE.Points;
  update: (warp: number, delta: number) => void;
  dispose: () => void;
};

const Z_NEAR = 26;
const Z_FAR = -520;
/** XY half-extent when recycling tunnel stars — larger = particles spawn farther from the forward axis (wider “emitter” on screen). */
const BASE_SPREAD = 280;

/**
 * Blend hyperspace vs idle motion across this **warp** band so we never snap from “fast rush” to
 * slow drift in one frame (that read as snappy even when final idle speed felt right).
 */
const WARP_BLEND_TO_IDLE_LO = 0.008;
const WARP_BLEND_TO_IDLE_HI = 0.062;

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / Math.max(edge1 - edge0, 1e-6)));
  return t * t * (3 - 2 * t);
}

/**
 * Tunnel **brightness** uses this synthetic `w` into `tunnelOpacityFromWarp` so opacity does **not**
 * track the real `warp` during decel (that was dimming stars then popping bright in idle — see graph).
 * Motion (speed, spread, spin) still uses the real `w`.
 */
const TUNNEL_BRIGHTNESS_EQUIV_WARP = 1;

/** Forward drift speed in idle (world-ish units × delta) — keep very low so “cosmos at rest” reads calm. */
const IDLE_TUNNEL_SPEED = 18;
const IDLE_TUNNEL_ROT = 0.000009;

/** Second cap inside the tunnel so a caller bug cannot spike `delta` in one integration step. */
const MAX_TUNNEL_DELTA_S = 1 / 55;

function tunnelOpacityFromWarp(w: number) {
  return Math.min(1, 0.55 + Math.min(1, Math.max(0, w)) * 1.05);
}

function randomStarColor(out: Float32Array, i: number) {
  const w = Math.random();
  const bright = 1.6 + Math.random() * 0.6;
  out[i * 3] = bright;
  out[i * 3 + 1] = bright * (0.992 - w * 0.06);
  out[i * 3 + 2] = bright * (1 - w * 0.14);
}

/** Shared soft-disk sprite for tunnel stars and route “anchor” bodies (same visual language). */
export function createRoundStarTexture() {
  const size = 96;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const center = size / 2;
  const grad = ctx.createRadialGradient(center, center, 0, center, center, center);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.16, "rgba(255,255,255,1)");
  grad.addColorStop(0.34, "rgba(245,248,255,0.98)");
  grad.addColorStop(0.58, "rgba(220,232,255,0.7)");
  grad.addColorStop(0.78, "rgba(170,190,255,0.28)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createCosmicWarpTunnel(reducedMotion: boolean): CosmicWarpTunnel {
  const starCount = reducedMotion ? 1200 : 4800;
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);

  const recycleStar = (i: number, spreadMul = 1) => {
    const spread = BASE_SPREAD * spreadMul;
    positions[i * 3] = (Math.random() - 0.5) * spread * 2;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 1.15;
    positions[i * 3 + 2] = Z_FAR - Math.random() * 260;
    randomStarColor(colors, i);
  };

  for (let i = 0; i < starCount; i++) recycleStar(i);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const sprite = createRoundStarTexture();
  const material = new THREE.PointsMaterial({
    size: reducedMotion ? 0.3 : 0.46,
    transparent: true,
    opacity: 0,
    vertexColors: true,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    map: sprite ?? undefined,
    alphaTest: 0.01,
  });

  const points = new THREE.Points(geometry, material);

  return {
    points,
    update: (warp, delta) => {
      const dt = Math.min(MAX_TUNNEL_DELTA_S, Math.max(0, delta));
      const w = Math.min(1, Math.max(0, warp));
      /** 0 = idle-like motion, 1 = full hyperspace motion — eased so the tail into rest is long. */
      const hs = smoothstep(WARP_BLEND_TO_IDLE_LO, WARP_BLEND_TO_IDLE_HI, w);
      points.visible = true;

      let colorsDirty = false;

      material.opacity = reducedMotion
        ? hs > 0.02
          ? tunnelOpacityFromWarp(0.52)
          : 0
        : tunnelOpacityFromWarp(TUNNEL_BRIGHTNESS_EQUIV_WARP);

      const idleSpeed = reducedMotion ? 12 : IDLE_TUNNEL_SPEED;
      const hyperSpeed =
        (reducedMotion ? 0.25 : 0.45) + (reducedMotion ? 90 : 720) * (0.08 + w * 2.85);
      const speed = idleSpeed + (hyperSpeed - idleSpeed) * hs;

      const spreadMul = 1 + hs * w * 1.05;

      const idleRot = IDLE_TUNNEL_ROT;
      const hyperRot = 0.00008 + 0.025 * w;
      const rotZ = idleRot + (hyperRot - idleRot) * hs;

      for (let i = 0; i < starCount; i++) {
        positions[i * 3 + 2] += speed * dt;

        if (positions[i * 3 + 2] > Z_NEAR) {
          recycleStar(i, spreadMul);
          colorsDirty = true;
        }
      }

      points.rotation.z += dt * rotZ;

      geometry.attributes.position.needsUpdate = true;
      if (colorsDirty) geometry.attributes.color.needsUpdate = true;
    },
    dispose: () => {
      geometry.dispose();
      material.dispose();
      sprite?.dispose();
    },
  };
}
