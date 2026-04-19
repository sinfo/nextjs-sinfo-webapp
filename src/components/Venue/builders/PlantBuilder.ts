/**
 * Loads and places the 3D plant GLB model across the venue.
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

export async function buildPlants(
  THREE: typeof THREE_TYPES,
  scene: THREE_TYPES.Scene,
): Promise<void> {
  const loader = new GLTFLoader();

  try {
    const plantModel = await loadModel(loader, "/models/plant/plant.glb");

    plantModel.traverse((child) => {
      if ((child as THREE_TYPES.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    const plantsGroup = new THREE.Group();
    plantsGroup.name = "plants-group";
    scene.add(plantsGroup);

    const s = 0.6; // Starting scale

    // ─────────────────────────────────────────────────────────────────────────────
    // 1. Main Stage (x: -24.4, z: -1.0)
    // ─────────────────────────────────────────────────────────────────────────────
    const mainStage = venueConfig.zones.find((z) => z.id === "main-stage");
    if (mainStage) {
      const stageDepth = 4.5;
      const stageElevation = 0.35;
      const zoneHeight = mainStage.height || 0.15;
      const h = zoneHeight + stageElevation;

      const centerX =
        mainStage.position.x - mainStage.size.w / 2 + stageDepth / 2 + 1.0;
      const centerZ = mainStage.position.z;

      // Back corners (West side)
      const p1 = { x: centerX - stageDepth / 2 + 0.6, z: centerZ - 4.5 };
      const p2 = { x: centerX - stageDepth / 2 + 0.6, z: centerZ + 4.5 };

      [p1, p2].forEach((p) => {
        const plant = plantModel.clone();
        plant.scale.set(1.2, 1.2, 1.2); // 2x larger (was 0.6)
        plant.position.set(p.x, h, p.z);
        plantsGroup.add(plant);
      });
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // 2. Connect Stage (x: -7.6, z: 14.75)
    // ─────────────────────────────────────────────────────────────────────────────
    const connectStage = venueConfig.zones.find(
      (z) => z.id === "connect-stage",
    );
    if (connectStage) {
      const h = connectStage.height || 0.4;
      const stageX = connectStage.position.x;
      const stageZ = connectStage.position.z;
      const stageW = connectStage.size.w;
      const stageD = connectStage.size.d;

      // Front corners
      const pos1 = {
        x: stageX - stageW / 2 + 0.5,
        z: stageZ + stageD / 2 - 0.4,
      };
      const pos2 = {
        x: stageX + stageW / 2 - 0.5,
        z: stageZ + stageD / 2 - 0.4,
      };

      [pos1, pos2].forEach((p) => {
        const plant = plantModel.clone();
        plant.scale.set(0.9, 0.9, 0.9); // 1.5x larger (was 0.6)
        plant.position.set(p.x, h, p.z);
        plantsGroup.add(plant);
      });
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // 3. Showcase Zone (x: -18.6, z: 12)
    // ─────────────────────────────────────────────────────────────────────────────
    const showcaseZone = venueConfig.zones.find(
      (z) => z.id === "showcase-zone",
    );
    if (showcaseZone) {
      const h = showcaseZone.height || 0.01;
      const x = showcaseZone.position.x;
      const z = showcaseZone.position.z;
      const w = showcaseZone.size.w;
      const d = showcaseZone.size.d;

      // 4 corners, offset by 0.5m inwards so they bracket the OSB cubes nicely
      const positions = [
        { x: x - w / 2 + 0.5, z: z - d / 2 + 0.5 }, // Top-Left
        { x: x + w / 2 - 0.5, z: z - d / 2 + 0.5 }, // Top-Right
        { x: x - w / 2 + 0.5, z: z + d / 2 - 0.5 }, // Bottom-Left
        { x: x + w / 2 - 0.5, z: z + d / 2 - 0.5 }, // Bottom-Right
      ];

      positions.forEach((p) => {
        const plant = plantModel.clone();
        plant.scale.set(0.7, 0.7, 0.7);
        plant.position.set(p.x, h, p.z);
        plantsGroup.add(plant);
      });
    }
  } catch (err) {
    console.error("Failed to build plants:", err);
  }
}
