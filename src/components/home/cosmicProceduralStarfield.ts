import * as THREE from "three";

/**
 * GPU procedural star dome: many apparent “stars” from layered 3D hashes on view rays.
 * Replaces tens of thousands of `THREE.Points` particles with one draw call.
 *
 * `uStreak` should mirror the hyperspace envelope so streaking reads like forward motion.
 */
export type CosmicProceduralStarfield = {
  mesh: THREE.Mesh;
  uniforms: {
    uTime: THREE.IUniform<number>;
    uStreak: THREE.IUniform<number>;
    uDrift: THREE.IUniform<number>;
    uReduced: THREE.IUniform<number>;
  };
  dispose: () => void;
};

const VERT = /* glsl */ `
// View-space direction so fragment math can widen the star disk on screen (not in arbitrary world axes).
varying vec3 vViewDir;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewDir = mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const FRAG = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uStreak;
uniform float uDrift;
uniform float uReduced;

varying vec3 vViewDir;

float hash3(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.zyx + 31.32);
  return fract((p.x + p.y) * p.z);
}

float starLayer(vec3 rd, float scale, float gate, float anim) {
  vec3 q = rd * scale + anim * 0.018;
  vec3 cell = floor(q);
  vec3 f = fract(q) - 0.5;
  float h = hash3(cell);
  if (h < gate) {
    return 0.0;
  }
  vec2 j = vec2(hash3(cell + vec3(3.141, 0.0, 0.0)), hash3(cell + vec3(0.0, 2.718, 0.0))) - 0.5;
  f.xy -= j * 0.64;
  float d = length(f.xy);
  float soft = 0.26 * (0.9 + 0.1 * uStreak);
  return smoothstep(soft, 0.0, d) * (0.38 + 0.62 * h);
}

void main() {
  vec3 rd = normalize(vViewDir);
  // ~2x wider source on the image: pull directions toward the view axis before hashing (matches doubled warp spread).
  rd = normalize(vec3(rd.xy * 0.5, rd.z));

  if (uReduced > 0.5) {
    vec3 dim = vec3(0.05, 0.08, 0.14) * 0.55;
    gl_FragColor = vec4(dim, 1.0);
    return;
  }

  float drift = uDrift * (1.1 + uStreak * 5.8);
  float t = uTime * (0.0009 + 0.0046 * drift);
  float centerBias = pow(max(0.001, abs(rd.z)), 0.34);
  float streak = 1.0 + uStreak * 18.0 * centerBias;

  float acc = 0.0;
  acc += starLayer(rd, 120.0, 0.938, t) * 1.05;
  acc += starLayer(rd, 220.0, 0.968, t * 1.14) * 0.88;
  acc += starLayer(rd, 400.0, 0.982, t * 0.9) * 0.62;
  acc += starLayer(rd, 720.0, 0.9915, t * 0.68) * 0.44;
  acc += starLayer(rd, 1180.0, 0.9965, t * 0.5) * 0.3;
  acc += starLayer(rd, 1900.0, 0.9988, t * 0.36) * 0.2;

  acc *= streak * (0.72 + uStreak * 3.8);

  vec3 tint = mix(vec3(0.7, 0.84, 1.0), vec3(1.0, 0.88, 0.76), hash3(floor(rd * 110.0 + t * 0.4)) * 0.36);
  vec3 nebula = mix(vec3(0.018, 0.028, 0.08), vec3(0.048, 0.018, 0.1), smoothstep(-0.4, 0.55, rd.y));

  vec3 col = nebula * 0.86 + tint * acc;
  float a = clamp(acc * 1.06 + length(nebula) * 0.22, 0.0, 1.0);
  gl_FragColor = vec4(col, a);
}
`;

export function createCosmicProceduralStarfield(reducedMotion: boolean): CosmicProceduralStarfield {
  const uniforms = {
    uTime: { value: 0 },
    uStreak: { value: 0 },
    uDrift: { value: 0 },
    uReduced: { value: reducedMotion ? 1 : 0 },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: VERT,
    fragmentShader: FRAG,
    side: THREE.BackSide,
    depthWrite: false,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });

  const segs = reducedMotion ? 28 : 44;
  const geometry = new THREE.SphereGeometry(560, segs, Math.max(18, Math.floor(segs * 0.55)));
  const mesh = new THREE.Mesh(geometry, material);

  return {
    mesh,
    uniforms,
    dispose: () => {
      geometry.dispose();
      material.dispose();
    },
  };
}
