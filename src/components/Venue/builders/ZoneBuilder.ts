/**
 * Builds zone meshes (stages, networking areas, etc.) and their labels.
 */

import type * as THREE_TYPES from "three";
import { venueConfig } from "@/constants/venueData";
import { createTextCanvas } from "../textures/TextCanvasFactory";

export function buildZones(
  THREE: typeof THREE_TYPES,
  scene: THREE_TYPES.Scene,
): void {
  venueConfig.zones.forEach((zone) => {
    const h = zone.height || 0.01;
    const isBox = zone.height && zone.height > 0.05;

    const zoneGeo = isBox
      ? new THREE.BoxGeometry(zone.size.w, h, zone.size.d)
      : new THREE.PlaneGeometry(zone.size.w, zone.size.d);

    const isStage = zone.type === "stage" || isBox;
    const zoneMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(zone.color),
      roughness: 0.8,
      transparent: !isStage,
      opacity: isStage ? 1.0 : 0.85,
    });

    const zoneMesh = new THREE.Mesh(zoneGeo, zoneMat);

    if (isBox) {
      zoneMesh.position.set(zone.position.x, h / 2, zone.position.z);
    } else {
      zoneMesh.rotation.x = -Math.PI / 2;
      zoneMesh.position.set(zone.position.x, 0.02, zone.position.z);
    }

    zoneMesh.receiveShadow = true;
    scene.add(zoneMesh);

    // Zone label sprite
    const labelCanvas = createTextCanvas(zone.label, {
      fontSize: 40,
      color: "#ffffff",
      width: 512,
      height: 96,
      borderRadius: 16,
    });
    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    labelTexture.minFilter = THREE.LinearFilter;
    labelTexture.colorSpace = THREE.SRGBColorSpace;
    const labelMat = new THREE.SpriteMaterial({
      map: labelTexture,
      transparent: true,
      depthTest: false,
    });
    const labelSprite = new THREE.Sprite(labelMat);

    let labelZ = zone.position.z;
    if (zone.id === "main-stage") {
      labelZ = zone.position.z + zone.size.d / 2 - 1.5;
    }

    labelSprite.position.set(zone.position.x, h + 0.5, labelZ);
    labelSprite.scale.set(6, 1.5, 1);
    scene.add(labelSprite);
  });
}
