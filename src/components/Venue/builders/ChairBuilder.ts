/**
 * Loads and places chair models in the 3D venue scene.
 * Adjusted to place chairs INSIDE stages/rooms and correct orientations.
 */

import type * as THREE_TYPES from "three";
import { loadCachedModel } from "../core/ModelLoader";
import { venueConfig } from "@/constants/venueData";
import { DIR } from "../core/utils";

export async function buildChairs(
  THREE: typeof THREE_TYPES,
  scene: THREE_TYPES.Scene,
): Promise<void> {
  try {
    const metalChairScene = await loadCachedModel(
      "/models/chair/metal_folding_chair.glb",
    );

    metalChairScene.traverse((child) => {
      if ((child as THREE_TYPES.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    const chairsGroup = new THREE.Group();
    chairsGroup.name = "chairs-group";
    scene.add(chairsGroup);

    // ─────────────────────────────────────────────────────────────────────────────
    // 1. Main Stage (Facing Left/West)
    // ─────────────────────────────────────────────────────────────────────────────
    const mainStage = venueConfig.zones.find((z) => z.id === "main-stage");
    if (mainStage) {
      const h = mainStage.height || 0.15;
      const s = 1.0;
      // Facing Left means rotation is 3*PI/2 (West)
      // We'll place 6 rows and 10 chairs per row, oriented West.
      // Rows will start from the right (+X) and move left (-X).
      const rows = 6;
      const chairsPerRow = 10;
      const spacingX = 1.0;
      const spacingZ = 0.8;

      const startX = mainStage.position.x + mainStage.size.w / 2 - 2.5;
      const startZ = mainStage.position.z - ((chairsPerRow - 1) * spacingZ) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < chairsPerRow; c++) {
          const chair = metalChairScene.clone();
          chair.scale.set(s, s, s);
          chair.position.set(startX - r * spacingX, h, startZ + c * spacingZ);
          chair.rotation.y = DIR.WEST;
          chairsGroup.add(chair);
        }
      }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // 2. Room 1 (Facing Top/North)
    // ─────────────────────────────────────────────────────────────────────────────
    const room1 = venueConfig.zones.find((z) => z.id === "room-1");
    if (room1) {
      const h = room1.height || 0.15;
      const s = 1.0;
      const rows = 5;
      const chairsPerRow = 4;
      const spacingX = 0.8;
      const spacingZ = 1.0;

      const startX = room1.position.x - ((chairsPerRow - 1) * spacingX) / 2;
      const startZ = room1.position.z + room1.size.d / 2 - 2.0;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < chairsPerRow; c++) {
          const chair = metalChairScene.clone();
          chair.scale.set(s, s, s);
          chair.position.set(startX + c * spacingX, h, startZ - r * spacingZ);
          chair.rotation.y = DIR.NORTH;
          chairsGroup.add(chair);
        }
      }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // 3. Room 2 (Facing Top/North)
    // ─────────────────────────────────────────────────────────────────────────────
    const room2 = venueConfig.zones.find((z) => z.id === "room-2");
    if (room2) {
      const h = room2.height || 0.15;
      const s = 1.0;
      const rows = 5;
      const chairsPerRow = 4;
      const spacingX = 0.8;
      const spacingZ = 1.0;

      const startX = room2.position.x - ((chairsPerRow - 1) * spacingX) / 2;
      const startZ = room2.position.z + room2.size.d / 2 - 2.0;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < chairsPerRow; c++) {
          const chair = metalChairScene.clone();
          chair.scale.set(s, s, s);
          chair.position.set(startX + c * spacingX, h, startZ - r * spacingZ);
          chair.rotation.y = DIR.NORTH;
          chairsGroup.add(chair);
        }
      }
    }
  } catch (err) {
    console.error("Failed to build chairs:", err);
  }
}
