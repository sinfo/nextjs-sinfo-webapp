/**
 * Builds entrance meshes and labels.
 */

import type * as THREE_TYPES from "three";
import { venueConfig } from "@/constants/venueData";
import { createTextCanvas } from "../textures/TextCanvasFactory";

export function buildEntrances(
  THREE: typeof THREE_TYPES,
  scene: THREE_TYPES.Scene,
): void {
  venueConfig.entrances.forEach((ent) => {
    // Entrance mesh
    const entGeo = new THREE.PlaneGeometry(4.5, 1.8);
    const entMat = new THREE.MeshStandardMaterial({
      color: 0x444444,
      roughness: 0.5,
      transparent: true,
      opacity: 0.8,
    });
    const entMesh = new THREE.Mesh(entGeo, entMat);
    entMesh.rotation.x = -Math.PI / 2;
    if (ent.rotation) {
      entMesh.rotation.z = (ent.rotation * Math.PI) / 180;
    }
    entMesh.position.set(ent.position.x, 0.03, ent.position.z);
    scene.add(entMesh);

    // Entrance label sprite
    const labelCanvas = createTextCanvas(ent.label, {
      fontSize: 32,
      color: "#ffffff",
      width: 256,
      height: 64,
    });
    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    const labelMat = new THREE.SpriteMaterial({
      map: labelTexture,
      transparent: true,
    });
    const labelSprite = new THREE.Sprite(labelMat);
    labelSprite.position.set(ent.position.x, 0.2, ent.position.z);
    labelSprite.scale.set(2.0, 0.5, 1);
    scene.add(labelSprite);
  });
}
