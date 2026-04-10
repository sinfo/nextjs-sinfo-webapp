/**
 * Shared TypeScript types for the Venue 3D system.
 */

import type * as THREE from "three";

// ── Mutable refs held by VenueViewer ──

export interface VenueRefs {
  renderer: THREE.WebGLRenderer | null;
  scene: THREE.Scene | null;
  perspCamera: THREE.PerspectiveCamera | null;
  orthoCamera: THREE.OrthographicCamera | null;
  controls: any; // OrbitControls
  raycaster: THREE.Raycaster | null;
  mouse: THREE.Vector2 | null;
  three: typeof THREE | null;

  /** Stand root group, keyed by stand ID */
  standMeshes: Map<string, THREE.Object3D>;
  /** 2D floating label sprite, keyed by stand ID */
  labelSprites: Map<string, THREE.Sprite>;
  /** 3D sign mesh on top of the booth, keyed by stand ID */
  standSigns: Map<string, THREE.Mesh>;
  /** Logo panel mesh on booth side, keyed by stand ID */
  standLogoPanels: Map<string, THREE.Mesh>;
  /** Speaker card sprites per zone, keyed by zone ID */
  speakerCards: Map<string, THREE.Mesh[]>;

  animFrame: number;
  is3D: boolean;
}

// ── Context returned by SceneManager.init() ──

export interface SceneContext {
  THREE: typeof THREE;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  perspCamera: THREE.PerspectiveCamera;
  orthoCamera: THREE.OrthographicCamera;
  controls: any; // OrbitControls
  raycaster: THREE.Raycaster;
  mouse: THREE.Vector2;
  cleanup: () => void;
}

// ── Builder results ──

export interface BoothResult {
  boothGroup: THREE.Group;
  logoPanel: THREE.Mesh;
  sign: THREE.Mesh;
}
