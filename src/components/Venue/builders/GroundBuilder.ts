/**
 * Builds the ground plane for the venue.
 */

import type * as THREE_TYPES from "three";
import { venueConfig } from "@/constants/venueData";
import { GROUND_POSITION } from "../core/constants";

export function buildGround(
  THREE: typeof THREE_TYPES,
  scene: THREE_TYPES.Scene,
): void {
  const groundGeo = new THREE.PlaneGeometry(
    venueConfig.floor.width,
    venueConfig.floor.depth,
  );
  const ground = new THREE.Mesh(
    groundGeo,
    new THREE.MeshStandardMaterial({ color: 0xffffff, opacity: 0.5 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(GROUND_POSITION.x, GROUND_POSITION.y, GROUND_POSITION.z);
  ground.receiveShadow = true;
  scene.add(ground);
}
