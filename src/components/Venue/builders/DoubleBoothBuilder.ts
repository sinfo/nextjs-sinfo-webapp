/**
 * Builds a double booth (two single booths back-to-back with a shared junction).
 */

import type * as THREE_TYPES from "three";
import type { Stand } from "@/constants/venueData";
import { FRAME_COLOR } from "../core/constants";
import { buildSingleBooth } from "./SingleBoothBuilder";

export interface DoubleBoothRefs {
  logoPanels: Map<string, THREE_TYPES.Mesh>;
  standSigns: Map<string, THREE_TYPES.Mesh>;
}

/**
 * Builds all double booth groups and adds them to the scene.
 * @returns Maps of logo panels and signs keyed by stand ID.
 */
export function buildDoubleBooths(
  THREE: typeof THREE_TYPES,
  scene: THREE_TYPES.Scene,
  stands: Stand[],
): DoubleBoothRefs {
  const logoPanels = new Map<string, THREE_TYPES.Mesh>();
  const standSigns = new Map<string, THREE_TYPES.Mesh>();

  // Group stands by doubleGroup key
  const doubleGroups = new Map<string, Stand[]>();
  stands.forEach((s) => {
    if (s.doubleGroup) {
      if (!doubleGroups.has(s.doubleGroup)) doubleGroups.set(s.doubleGroup, []);
      doubleGroups.get(s.doubleGroup)!.push(s);
    }
  });

  doubleGroups.forEach((members) => {
    const xs = members.map((m) => m.position.x);
    const zs = members.map((m) => m.position.z);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    const cz = (Math.min(...zs) + Math.max(...zs)) / 2;
    const h = members[0].height || 2.5;
    const isVertical =
      Math.abs(members[0].position.z - members[1].position.z) > 0.1;

    const doubleGroup = new THREE.Group();
    doubleGroup.position.set(cx, 0, cz);

    if (isVertical) {
      doubleGroup.rotation.y = -Math.PI / 2;
    }

    const sortedMembers = [...members].sort((a, b) =>
      isVertical ? a.position.z - b.position.z : a.position.x - b.position.x,
    );

    // Left booth (faces West)
    const left = buildSingleBooth(THREE, 2.5, 2.5, h, true);
    left.boothGroup.position.set(-1.25, 0, 0);
    left.boothGroup.rotation.y = -Math.PI / 2;
    doubleGroup.add(left.boothGroup);
    if (sortedMembers[0]) {
      logoPanels.set(sortedMembers[0].id, left.logoPanel);
      standSigns.set(sortedMembers[0].id, left.sign);
    }

    // Right booth (faces East)
    const right = buildSingleBooth(THREE, 2.5, 2.5, h, true);
    right.boothGroup.position.set(1.25, 0, 0);
    right.boothGroup.rotation.y = Math.PI / 2;
    doubleGroup.add(right.boothGroup);
    if (sortedMembers[1]) {
      logoPanels.set(sortedMembers[1].id, right.logoPanel);
      standSigns.set(sortedMembers[1].id, right.sign);
    }

    // Shared junction pillar
    const junctionPillar = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, h, 0.12),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(FRAME_COLOR),
        roughness: 0.5,
        metalness: 0.3,
      }),
    );
    junctionPillar.position.set(0, h / 2, 0);
    junctionPillar.castShadow = true;
    doubleGroup.add(junctionPillar);

    scene.add(doubleGroup);
  });

  return { logoPanels, standSigns };
}
