/**
 * Procedurally creates and places TV models with floor stands in the 3D venue.
 */

import type * as THREE_TYPES from "three";
import { venueConfig } from "@/constants/venueData";
import { DIR, rotateCW } from "../core/utils";

/**
 * Creates a TV model with a floor stand using basic geometries.
 */
function createTelevisionModel(
  THREE: typeof THREE_TYPES,
  width: number = 1.2,
  height: number = 0.7,
): THREE_TYPES.Group {
  const tvGroup = new THREE.Group();

  // 1. Stand Base
  const baseGeo = new THREE.BoxGeometry(0.5, 0.02, 0.5);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x222222,
    roughness: 0.5,
  });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = 0.01;
  base.castShadow = true;
  base.receiveShadow = true;
  tvGroup.add(base);

  // 2. Stand Post
  const postGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 12);
  const postMat = new THREE.MeshStandardMaterial({
    color: 0x444444,
    metalness: 0.8,
    roughness: 0.2,
  });
  const post = new THREE.Mesh(postGeo, postMat);
  post.position.y = 0.75;
  post.castShadow = true;
  post.receiveShadow = true;
  tvGroup.add(post);

  // 3. TV Frame/Back
  const frameGeo = new THREE.BoxGeometry(width + 0.04, height + 0.04, 0.05);
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.8,
  });
  const frame = new THREE.Mesh(frameGeo, frameMat);
  frame.position.y = 1.2; // roughly center of screen height
  frame.castShadow = true;
  frame.receiveShadow = true;
  tvGroup.add(frame);

  // 4. TV Screen
  const screenGeo = new THREE.PlaneGeometry(width, height);
  const screenMat = new THREE.MeshStandardMaterial({
    color: 0x000000,
    roughness: 0.1,
    emissive: 0x111122,
    emissiveIntensity: 0.2,
  });
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.set(0, 1.2, 0.026); // slightly in front of the frame
  tvGroup.add(screen);

  return tvGroup;
}

export function buildTVs(
  THREE: typeof THREE_TYPES,
  scene: THREE_TYPES.Scene,
): void {
  const tvsGroup = new THREE.Group();
  tvsGroup.name = "tvs-group";
  scene.add(tvsGroup);

  // TVs are now only placed in Rooms 1 & 2. Main Stage uses StageBuilder.

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. Room 1 (TV at North/Top edge, facing South/Bottom)
  // ─────────────────────────────────────────────────────────────────────────────
  const room1 = venueConfig.zones.find((z) => z.id === "room-1");
  if (room1) {
    const tv = createTelevisionModel(THREE, 1.8, 1.0);
    tv.position.set(
      room1.position.x,
      room1.height || 0.15,
      room1.position.z - room1.size.d / 2 + 1.2,
    );
    tv.rotation.y = rotateCW(DIR.SOUTH);
    tvsGroup.add(tv);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. Room 2 (TV at North/Top edge, facing South/Bottom)
  // ─────────────────────────────────────────────────────────────────────────────
  const room2 = venueConfig.zones.find((z) => z.id === "room-2");
  if (room2) {
    const tv = createTelevisionModel(THREE, 1.8, 1.0);
    tv.position.set(
      room2.position.x,
      room2.height || 0.15,
      room2.position.z - room2.size.d / 2 + 1.2,
    );
    tv.rotation.y = rotateCW(DIR.SOUTH);
    tvsGroup.add(tv);
  }
}
