/**
 * Manages the Three.js scene lifecycle:
 * renderer, cameras, lighting, animation loop, resize, and disposal.
 */

import type * as THREE_TYPES from "three";
import type { SceneContext } from "./types";
import {
  CLEAR_COLOR,
  FOG_NEAR,
  FOG_FAR,
  AMBIENT_INTENSITY,
  DIR_LIGHT_INTENSITY,
  DIR_LIGHT_POSITION,
  FILL_LIGHT_COLOR,
  FILL_LIGHT_INTENSITY,
  FILL_LIGHT_POSITION,
  SHADOW_MAP_SIZE,
  SHADOW_CAMERA_EXTENT,
  PERSP_FOV,
  PERSP_NEAR,
  PERSP_FAR,
  PERSP_INITIAL_POSITION,
  PERSP_INITIAL_ZOOM,
  ORTHO_FRUSTUM_SIZE,
  ORTHO_NEAR,
  ORTHO_FAR,
  ORTHO_INITIAL_POSITION,
  ORTHO_INITIAL_ZOOM,
  CONTROLS_DAMPING_FACTOR,
  CONTROLS_ROTATE_SPEED,
  CONTROLS_MAX_POLAR_ANGLE,
  CONTROLS_MIN_DISTANCE,
  CONTROLS_MAX_DISTANCE,
  CONTROLS_TARGET,
} from "./constants";

/**
 * Initializes the full Three.js scene.
 * Returns a SceneContext with everything needed to render and interact.
 */
export async function initScene(
  container: HTMLElement,
): Promise<SceneContext | null> {
  const THREE = await import("three");
  const { OrbitControls } =
    await import("three/examples/jsm/controls/OrbitControls.js");

  if (!container) return null;

  const w = container.clientWidth;
  const h = container.clientHeight;

  // ── Renderer ──
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(CLEAR_COLOR);
  container.appendChild(renderer.domElement);

  // ── Scene ──
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(CLEAR_COLOR, FOG_NEAR, FOG_FAR);

  // ── Cameras ──
  const aspect = w / h;

  const perspCamera = new THREE.PerspectiveCamera(
    PERSP_FOV,
    aspect,
    PERSP_NEAR,
    PERSP_FAR,
  );
  perspCamera.position.set(
    PERSP_INITIAL_POSITION.x,
    PERSP_INITIAL_POSITION.y,
    PERSP_INITIAL_POSITION.z,
  );
  perspCamera.zoom = PERSP_INITIAL_ZOOM;

  const orthoCamera = new THREE.OrthographicCamera(
    (-ORTHO_FRUSTUM_SIZE * aspect) / 2,
    (ORTHO_FRUSTUM_SIZE * aspect) / 2,
    ORTHO_FRUSTUM_SIZE / 2,
    -ORTHO_FRUSTUM_SIZE / 2,
    ORTHO_NEAR,
    ORTHO_FAR,
  );
  orthoCamera.position.set(
    ORTHO_INITIAL_POSITION.x,
    ORTHO_INITIAL_POSITION.y,
    ORTHO_INITIAL_POSITION.z,
  );
  orthoCamera.lookAt(ORTHO_INITIAL_POSITION.x, 0, ORTHO_INITIAL_POSITION.z);
  orthoCamera.zoom = ORTHO_INITIAL_ZOOM;
  orthoCamera.updateProjectionMatrix();

  // ── Controls ──
  const { MapControls } =
    await import("three/examples/jsm/controls/MapControls.js");

  const controls = new MapControls(perspCamera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = CONTROLS_DAMPING_FACTOR;
  controls.rotateSpeed = CONTROLS_ROTATE_SPEED;
  controls.maxPolarAngle = CONTROLS_MAX_POLAR_ANGLE;
  controls.minDistance = CONTROLS_MIN_DISTANCE;
  controls.maxDistance = CONTROLS_MAX_DISTANCE;
  controls.target.set(CONTROLS_TARGET.x, CONTROLS_TARGET.y, CONTROLS_TARGET.z);
  controls.enabled = false; // starts in 2D mode

  // Google Maps style: Left = Pan, Right = Rotate
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.ROTATE,
  };

  // Google Maps style: One finger = Pan, Two fingers = Rotate/Zoom
  // MapControls natively handles these gestures well
  controls.touches = {
    ONE: THREE.TOUCH.PAN,
    TWO: THREE.TOUCH.DOLLY_ROTATE,
  };

  // Restrict panning to ground plane (X/Z)
  controls.screenSpacePanning = false;

  // ── Raycaster ──
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // ── Lighting ──
  scene.add(new THREE.AmbientLight(0xffffff, AMBIENT_INTENSITY));

  const dirLight = new THREE.DirectionalLight(0xffffff, DIR_LIGHT_INTENSITY);
  dirLight.position.set(
    DIR_LIGHT_POSITION.x,
    DIR_LIGHT_POSITION.y,
    DIR_LIGHT_POSITION.z,
  );
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.set(SHADOW_MAP_SIZE, SHADOW_MAP_SIZE);
  dirLight.shadow.camera.left = -SHADOW_CAMERA_EXTENT;
  dirLight.shadow.camera.right = SHADOW_CAMERA_EXTENT;
  dirLight.shadow.camera.top = SHADOW_CAMERA_EXTENT;
  dirLight.shadow.camera.bottom = -SHADOW_CAMERA_EXTENT;
  scene.add(dirLight);

  scene
    .add(new THREE.DirectionalLight(FILL_LIGHT_COLOR, FILL_LIGHT_INTENSITY))
    .position.set(
      FILL_LIGHT_POSITION.x,
      FILL_LIGHT_POSITION.y,
      FILL_LIGHT_POSITION.z,
    );

  // ── Resize observer ──
  const resizeObserver = new ResizeObserver(() => {
    if (!container) return;
    const nw = container.clientWidth;
    const nh = container.clientHeight;
    renderer.setSize(nw, nh);
    const a = nw / nh;

    perspCamera.aspect = a;
    perspCamera.updateProjectionMatrix();

    orthoCamera.left = (-ORTHO_FRUSTUM_SIZE * a) / 2;
    orthoCamera.right = (ORTHO_FRUSTUM_SIZE * a) / 2;
    orthoCamera.top = ORTHO_FRUSTUM_SIZE / 2;
    orthoCamera.bottom = -ORTHO_FRUSTUM_SIZE / 2;
    orthoCamera.updateProjectionMatrix();
  });
  resizeObserver.observe(container);

  // ── Cleanup ──
  const cleanup = () => {
    resizeObserver.disconnect();
    renderer.dispose();
    renderer.domElement.remove();
    controls.dispose();
  };

  return {
    THREE,
    renderer,
    scene,
    perspCamera,
    orthoCamera,
    controls,
    raycaster,
    mouse,
    cleanup,
  };
}

/**
 * Starts the render loop. Returns a stop function.
 */
export function startAnimationLoop(
  ctx: SceneContext,
  is3DRef: { current: boolean },
  debugEl?: HTMLDivElement | null,
): () => void {
  let frameId = 0;

  function animate() {
    frameId = requestAnimationFrame(animate);
    const camera = is3DRef.current ? ctx.perspCamera : ctx.orthoCamera;

    ctx.controls.update();
    ctx.renderer.render(ctx.scene, camera);

    if (debugEl) {
      const pos = camera.position;
      const target = ctx.controls.target;
      const zoom = (camera as any).zoom || 1;
      const { triangles, calls } = ctx.renderer.info.render;
      debugEl.innerText = `Pos: ${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)} | Target: ${target.x.toFixed(2)}, ${target.y.toFixed(2)}, ${target.z.toFixed(2)} | Zoom: ${zoom.toFixed(2)} | Tris: ${triangles.toLocaleString()} | Calls: ${calls}`;
    }
  }

  animate();

  return () => {
    if (frameId) cancelAnimationFrame(frameId);
  };
}
