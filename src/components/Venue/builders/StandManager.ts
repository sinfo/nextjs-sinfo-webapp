/**
 * Orchestrates stand creation by delegating to Single/Double/Quad builders.
 * Returns all populated ref maps needed by the updaters.
 */

import type * as THREE_TYPES from "three";
import { venueConfig } from "@/constants/venueData";
import { buildSingleBooth } from "./SingleBoothBuilder";
import { buildDoubleBooths } from "./DoubleBoothBuilder";
import { buildQuadBooths } from "./QuadBoothBuilder";

export interface StandRefs {
  standMeshes: Map<string, THREE_TYPES.Object3D>;
  labelSprites: Map<string, THREE_TYPES.Sprite>;
  standSigns: Map<string, THREE_TYPES.Mesh>;
  standLogoPanels: Map<string, THREE_TYPES.Mesh>;
}

/**
 * Builds all stands (single, double, and quad) and their 2D label sprites.
 */
export function buildAllStands(
  THREE: typeof THREE_TYPES,
  scene: THREE_TYPES.Scene,
): StandRefs {
  const standMeshes = new Map<string, THREE_TYPES.Object3D>();
  const labelSprites = new Map<string, THREE_TYPES.Sprite>();
  const standSigns = new Map<string, THREE_TYPES.Mesh>();
  const standLogoPanels = new Map<string, THREE_TYPES.Mesh>();

  // ── Individual stands (single or invisible hitbox for grouped) ──
  venueConfig.stands.forEach((stand) => {
    const group = new THREE.Group();
    group.position.set(stand.position.x, 0, stand.position.z);
    group.userData = { standId: stand.id };

    const w = stand.size?.w || 2.5;
    const d = stand.size?.d || 2.5;
    const h = stand.height || 2.5;

    if (!stand.quadGroup && !stand.doubleGroup) {
      // ── SINGLE BOOTH ──
      const { boothGroup, logoPanel, sign } = buildSingleBooth(
        THREE,
        w,
        d,
        h,
        false,
      );

      if (stand.rotation !== undefined) {
        boothGroup.rotation.y = stand.rotation;
      }

      group.add(boothGroup);
      standLogoPanels.set(stand.id, logoPanel);
      standSigns.set(stand.id, sign);
    } else {
      // ── QUAD/DOUBLE — invisible mesh for raycasting ──
      const invisibleBox = new THREE.Mesh(
        new THREE.BoxGeometry(w, 0.5, d),
        new THREE.MeshBasicMaterial({ visible: false }),
      );
      invisibleBox.position.y = 0.25;
      group.add(invisibleBox);
    }

    scene.add(group);
    standMeshes.set(stand.id, group);

    // ── 2D label sprite ──
    const labelMat = new THREE.SpriteMaterial({
      transparent: true,
      depthTest: false,
    });
    const labelSprite = new THREE.Sprite(labelMat);
    labelSprite.position.set(stand.position.x, 4, stand.position.z);
    labelSprite.scale.set(2, 2, 1);
    scene.add(labelSprite);
    labelSprites.set(stand.id, labelSprite);
  });

  // ── Double booths ──
  const doubleRefs = buildDoubleBooths(THREE, scene, venueConfig.stands);
  doubleRefs.logoPanels.forEach((v, k) => standLogoPanels.set(k, v));
  doubleRefs.standSigns.forEach((v, k) => standSigns.set(k, v));

  // ── Quad booths ──
  const quadRefs = buildQuadBooths(THREE, scene, venueConfig.stands);
  quadRefs.logoPanels.forEach((v, k) => standLogoPanels.set(k, v));
  quadRefs.standSigns.forEach((v, k) => standSigns.set(k, v));

  return { standMeshes, labelSprites, standSigns, standLogoPanels };
}
