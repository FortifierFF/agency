"use client";

/**
 * Single full-site WebGL backdrop (procedural star dome + warp streaks). Three.js sets
 * `data-engine="three.js …"` on the renderer canvas — that is this layer, not a duplicate.
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { cosmicDriver, tickCosmicDriver, tickRouteFlightEnvelope } from "@/lib/cosmicDriver";
import { APEX_INTRO_HYPERSPACE_SETTLED } from "@/lib/cosmicBootEvents";
import { createCosmicWarpTunnel } from "./cosmicWarpTunnel";
import { createCosmicRouteAnchorReadiness } from "./cosmicRouteAnchorReadiness";
import { getCosmicRouteAnchorLayoutKey, getCosmicRouteSectionAnchorCount } from "@/lib/cosmicRouteAnchorStore";
import { getRouteAnchorWorldPosition } from "@/lib/cosmicRouteAnchorLayoutPositions";
import { setRouteAnchorViewportPixels } from "./routeAnchorScreenBridge";

/** Fog tint — warp streaks read against this; no procedural dome anymore. */
const COL = { fog: 0x030510 };

/**
 * Boot-only punch on the streak curve (does **not** apply to route flights — those use
 * `routeHyperspace`; route flights use the driver’s trapezoid + decel power curve.
 */
const INTRO_STREAK_CURVE = 3.6;

/** How strongly `streak` (0..1) pushes parallax — raise for more “speed” at the same driver value. */
const STREAK_STAR_GROUP_Z = 76;
const STREAK_LOOK_Z = 22;
const STREAK_CAM_Y_BOB = 0.22;

/**
 * Raw `streak` snaps its slope to zero when the route envelope hits exactly 0 — that reads as a
 * tiny depth “kick”. We drive the camera / parallax from `streakVisual`, which **eases down** more
 * slowly than it **chases up** so cruise + accel stay crisp.
 */
const STREAK_VISUAL_TAU_UP_S = 0.05;
/**
 * Ease toward rest after hyperspace. **Shorter** than before so the camera/warp tail matches a
 * shorter route trapezoid; paired with `ROUTE_CONTENT_READY_MAX_EXTEND_MS` in `cosmicDriver`.
 */
const STREAK_VISUAL_TAU_DOWN_S = 0.26;

/**
 * Long hitches (tab in background, heavy route like Home) must not integrate warp as one giant
 * step. `performance.now()` deltas are capped; warp also caps internally.
 */
const MAX_SIM_DELTA_S = 1 / 60;
/** If the tab was asleep / devtools paused, ignore the huge gap and use a normal frame instead. */
const STALE_FRAME_SKIP_S = 0.22;

export function ImmersiveThreeBackground() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const readViewportCssPixels = () => {
      const vv = window.visualViewport;
      if (vv && vv.width > 32 && vv.height > 32) {
        return { w: vv.width, h: vv.height };
      }
      return { w: window.innerWidth, h: window.innerHeight };
    };

    const mount = mountRef.current;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(COL.fog, reducedMotion ? 0.0016 : 0.00105);

    const { w: vpW, h: vpH } = readViewportCssPixels();
    const camera = new THREE.PerspectiveCamera(55, vpW / Math.max(1, vpH), 0.1, 2500);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, reducedMotion ? 1.25 : 1.75));
    renderer.setSize(vpW, vpH);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const starGroup = new THREE.Group();
    scene.add(starGroup);

    const warpTunnel = createCosmicWarpTunnel(reducedMotion);
    scene.add(warpTunnel.points);

    const routeAnchorReadiness = createCosmicRouteAnchorReadiness(reducedMotion);

    /** Project route anchor world positions to CSS pixels for home section `transform-origin`. */
    const projVec = new THREE.Vector3();

    const nebulaGeo = new THREE.SphereGeometry(380, 40, 32);
    const nebulaMat = new THREE.MeshBasicMaterial({
      color: 0x273060,
      transparent: true,
      opacity: 0.0,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const nebula = new THREE.Mesh(nebulaGeo, nebulaMat);
    nebula.visible = false;
    nebula.position.set(0, 0, -140);
    starGroup.add(nebula);

    const nebula2Geo = new THREE.SphereGeometry(220, 28, 24);
    const nebula2Mat = new THREE.MeshBasicMaterial({
      color: 0x46306f,
      transparent: true,
      opacity: 0.0,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const nebula2 = new THREE.Mesh(nebula2Geo, nebula2Mat);
    nebula2.visible = false;
    nebula2.position.set(45, -28, -95);
    starGroup.add(nebula2);

    const key = new THREE.DirectionalLight(0xffffff, 0.46);
    key.position.set(8, 10, 12);
    const fill = new THREE.PointLight(0x8aa4ff, 1.65, 120);
    fill.position.set(-6, -4, 8);
    const rim = new THREE.PointLight(0xb292ff, 1.05, 100);
    rim.position.set(4, 2, -4);
    scene.add(key, fill, rim);

    let mouseX = 0;
    let mouseY = 0;

    const handlePointerMove = (event: PointerEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    let resizeRaf = 0;
    const applyViewportToRenderer = () => {
      const { w, h } = readViewportCssPixels();
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, reducedMotion ? 1.25 : 1.75));
    };

    const scheduleResize = () => {
      if (resizeRaf) return;
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0;
        applyViewportToRenderer();
      });
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("resize", scheduleResize);
    window.visualViewport?.addEventListener("resize", scheduleResize);
    applyViewportToRenderer();

    let rafId = 0;
    let lastFrameTime = performance.now();
    /** Smoothed streak for depth/camera (see `STREAK_VISUAL_TAU_*`). */
    let streakVisual = 0;
    /** Tracks boot intro envelope so we can fire exactly one “camera settled” signal for React. */
    let prevIntroHyperspace = 0;
    let introBootSettledDispatched = false;
    const animate = () => {
      const now = performance.now();
      let rawDelta = (now - lastFrameTime) / 1000;
      lastFrameTime = now;
      if (rawDelta > STALE_FRAME_SKIP_S) rawDelta = MAX_SIM_DELTA_S;
      const delta = Math.min(MAX_SIM_DELTA_S, Math.max(0, rawDelta));
      const time = now / 1000;
      // Sample route trapezoid first so `routeHyperspace` never shares a frame with stale decay.
      tickRouteFlightEnvelope(performance.now(), reducedMotion);
      tickCosmicDriver(delta, reducedMotion);

      const introH = cosmicDriver.introHyperspace;
      if (!reducedMotion && !introBootSettledDispatched && prevIntroHyperspace > 0.14 && introH < 0.03) {
        introBootSettledDispatched = true;
        cosmicDriver.introHyperspace = 0;
        window.dispatchEvent(new CustomEvent(APEX_INTRO_HYPERSPACE_SETTLED));
      }
      prevIntroHyperspace = cosmicDriver.introHyperspace;

      // Boot intro keeps a punchy curve; **route** uses `routeHyperspace` directly (trapezoid speed).
      const introStreak =
        cosmicDriver.introHyperspace > 0
          ? 1 - Math.pow(1 - Math.min(1, cosmicDriver.introHyperspace), INTRO_STREAK_CURVE)
          : 0;
      const streak = Math.min(1, introStreak + cosmicDriver.routeHyperspace);
      const drift = reducedMotion ? 0 : 0.028;

      if (reducedMotion) {
        streakVisual = streak;
      } else {
        const tau = streak > streakVisual ? STREAK_VISUAL_TAU_UP_S : STREAK_VISUAL_TAU_DOWN_S;
        const k = tau > 1e-5 ? 1 - Math.exp(-delta / tau) : 1;
        streakVisual += (streak - streakVisual) * k;
      }

      camera.position.z = 9;
      camera.position.y = mouseY * 0.5 + Math.sin(time * 0.1) * 0.07 + streakVisual * STREAK_CAM_Y_BOB;
      camera.position.x = mouseX * 0.75 + Math.cos(time * 0.08) * 0.05;

      const lookZ = -19 - streakVisual * STREAK_LOOK_Z + mouseY * 0.35;
      const lookY = Math.sin(time * 0.09) * 0.1;
      camera.lookAt(mouseX * 0.32, lookY + mouseY * 0.2, lookZ);
      starGroup.position.z = -streakVisual * STREAK_STAR_GROUP_Z;
      nebula.position.z = -140 - streakVisual * 30;
      nebula2.position.z = -95 - streakVisual * 24;

      // Use the same smoothed value so particle depth cues stay glued to the camera motion.
      warpTunnel.update(streakVisual, delta);
      routeAnchorReadiness.update(delta, streakVisual, streak);

      // Subtle idle sway on the (mostly empty) depth group — nebulae stay invisible unless re-enabled.
      const idleYaw = time * 0.00038 * drift;
      starGroup.rotation.y = idleYaw;
      starGroup.rotation.x = Math.sin(time * 0.045) * 0.002;

      renderer.render(scene, camera);

      // Project logical anchor positions (same math as before sprites were removed) so DOM plates
      // can use `transform-origin` at matching screen coordinates (camera sway included).
      if (!reducedMotion) {
        const layoutKey = getCosmicRouteAnchorLayoutKey();
        const anchorN = getCosmicRouteSectionAnchorCount();
        if (anchorN > 0) {
          const rect = renderer.domElement.getBoundingClientRect();
          const pts: { x: number; y: number }[] = [];
          for (let i = 0; i < anchorN; i++) {
            getRouteAnchorWorldPosition(layoutKey, i, projVec);
            projVec.project(camera);
            pts.push({
              x: rect.left + (projVec.x * 0.5 + 0.5) * rect.width,
              y: rect.top + (-projVec.y * 0.5 + 0.5) * rect.height,
            });
          }
          setRouteAnchorViewportPixels(layoutKey, pts);
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", scheduleResize);
      window.visualViewport?.removeEventListener("resize", scheduleResize);
      mount.removeChild(renderer.domElement);

      warpTunnel.dispose();
      routeAnchorReadiness.dispose();
      nebulaGeo.dispose();
      nebulaMat.dispose();
      nebula2Geo.dispose();
      nebula2Mat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      aria-hidden
      data-cosmos="immersive-webgl"
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.92] [mask-image:linear-gradient(to_bottom,black_0%,black_92%,transparent_100%)]"
    >
      <div ref={mountRef} className="h-full w-full" />
    </div>
  );
}
