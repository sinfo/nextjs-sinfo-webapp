/**
 * Loads and places the 3D 'Hacky' humanoid model in the Gaming Zone.
 */

import type * as THREE_TYPES from "three";
// @ts-ignore - GLTFLoader is in Three.js examples
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { venueConfig } from "@/constants/venueData";

async function loadModel(
  loader: GLTFLoader,
  url: string,
): Promise<THREE_TYPES.Group> {
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf: GLTF) => {
        resolve(gltf.scene);
      },
      undefined,
      (error: ErrorEvent | unknown) => {
        console.error(`Error loading model ${url}:`, error);
        reject(error);
      },
    );
  });
}

export async function buildGamingZone(
  THREE: typeof THREE_TYPES,
  scene: THREE_TYPES.Scene,
): Promise<void> {
  const loader = new GLTFLoader();

  const gamingZone = venueConfig.zones.find((z) => z.id === "gaming-zone");
  if (!gamingZone) return;

  try {
    const hackyModel = await loadModel(loader, "/models/characters/hacky.glb");

    hackyModel.traverse((child) => {
      if ((child as THREE_TYPES.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    const gamingGroup = new THREE.Group();
    gamingGroup.name = "gaming-group";
    scene.add(gamingGroup);

    // Initial scale adjustment for a humanoid
    // Assuming 1 unit = 1 meter, we'll start with 1.8 for a 1.8m human.
    const s = 2.0;
    hackyModel.scale.set(s, s, s);

    // Position it in the gaming area
    hackyModel.position.set(
      gamingZone.position.x - 2,
      1, // On the floor
      gamingZone.position.z - 2,
    );

    // Rotate it to face the center/north
    hackyModel.rotation.y = Math.PI * 1.3;

    gamingGroup.add(hackyModel);
  } catch (err) {
    console.error("Failed to build gaming zone decorations:", err);
  }
}
