/**
 * Builds quad booth islands (4 booths sharing a cross-wall junction).
 */

import type * as THREE_TYPES from "three";
import type { Stand } from "@/constants/venueData";
import {
  OSB_COLOR,
  FRAME_COLOR,
  CARPET_COLOR,
  LOGO_PLACEHOLDER_COLOR,
} from "../core/constants";

export interface QuadBoothRefs {
  logoPanels: Map<string, THREE_TYPES.Mesh>;
  standSigns: Map<string, THREE_TYPES.Mesh>;
}

/**
 * Builds all quad booth groups and adds them to the scene.
 * @returns Maps of logo panels and signs keyed by stand ID.
 */
export function buildQuadBooths(
  THREE: typeof THREE_TYPES,
  scene: THREE_TYPES.Scene,
  stands: Stand[],
): QuadBoothRefs {
  const logoPanels = new Map<string, THREE_TYPES.Mesh>();
  const standSigns = new Map<string, THREE_TYPES.Mesh>();

  // Group stands by quadGroup key
  const quadGroups = new Map<string, Stand[]>();
  stands.forEach((s) => {
    if (s.quadGroup) {
      if (!quadGroups.has(s.quadGroup)) quadGroups.set(s.quadGroup, []);
      quadGroups.get(s.quadGroup)!.push(s);
    }
  });

  const osbColor = new THREE.Color(OSB_COLOR);
  const frameColor = new THREE.Color(FRAME_COLOR);
  const carpetColor = new THREE.Color(CARPET_COLOR);
  const logoPlaceholderColor = new THREE.Color(LOGO_PLACEHOLDER_COLOR);

  quadGroups.forEach((members) => {
    const xs = members.map((m) => m.position.x);
    const zs = members.map((m) => m.position.z);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    const cz = (Math.min(...zs) + Math.max(...zs)) / 2;
    const totalW = 5.0;
    const totalD = 5.0;
    const h = members[0].height;

    const quadGroup = new THREE.Group();
    quadGroup.position.set(cx, 0, cz);

    // ── Shared carpet ──
    const qCarpet = new THREE.Mesh(
      new THREE.PlaneGeometry(totalW + 0.4, totalD + 0.4),
      new THREE.MeshStandardMaterial({ color: carpetColor, roughness: 0.95 }),
    );
    qCarpet.rotation.x = -Math.PI / 2;
    qCarpet.position.y = 0.02;
    qCarpet.receiveShadow = true;
    quadGroup.add(qCarpet);

    const wallMat = new THREE.MeshStandardMaterial({
      color: osbColor,
      roughness: 0.85,
      metalness: 0.05,
    });

    // ── Shared crossing back walls ──
    const wallX = new THREE.Mesh(
      new THREE.BoxGeometry(totalW, h, 0.08),
      wallMat,
    );
    wallX.position.set(0, h / 2, 0);
    wallX.castShadow = true;
    wallX.receiveShadow = true;
    quadGroup.add(wallX);

    const wallZ = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, h, totalD),
      wallMat.clone(),
    );
    wallZ.position.set(0, h / 2, 0);
    wallZ.castShadow = true;
    wallZ.receiveShadow = true;
    quadGroup.add(wallZ);

    // ── Frame strips ──
    const qFrameGeo = new THREE.BoxGeometry(0.06, h, 0.1);
    const qFrameMat = new THREE.MeshStandardMaterial({
      color: frameColor,
      roughness: 0.5,
      metalness: 0.3,
    });

    // Horizontal wall bars (along X axis)
    [-2.5, -1.25, 0, 1.25, 2.5].forEach((xPos) => {
      const f1 = new THREE.Mesh(qFrameGeo, qFrameMat);
      f1.position.set(xPos, h / 2, 0);
      f1.castShadow = true;
      quadGroup.add(f1);
    });

    // Vertical wall bars (along Z axis)
    [-2.5, -1.25, 0, 1.25, 2.5].forEach((zPos) => {
      const f2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, h, 0.06), qFrameMat);
      f2.position.set(0, h / 2, zPos);
      f2.castShadow = true;
      quadGroup.add(f2);
    });

    // Central Junction Pillar
    const centralPillar = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, h, 0.12),
      qFrameMat.clone(),
    );
    centralPillar.position.set(0, h / 2, 0);
    centralPillar.castShadow = true;
    quadGroup.add(centralPillar);

    // ── Perimeter Sidewalls (50cm) ──
    // North & South edges
    [-2.5, 2.5].forEach((zVal) => {
      [-0.25, 0.25].forEach((xVal) => {
        const wall = new THREE.Mesh(
          new THREE.BoxGeometry(0.5, 1, 0.08),
          wallMat.clone(),
        );
        wall.position.set(xVal, 0.5, zVal);
        wall.castShadow = true;
        quadGroup.add(wall);
      });
    });
    // West & East edges
    [-2.5, 2.5].forEach((xVal) => {
      [-0.25, 0.25].forEach((zVal) => {
        const wall = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, 1, 0.5),
          wallMat.clone(),
        );
        wall.position.set(xVal, 0.5, zVal);
        wall.castShadow = true;
        quadGroup.add(wall);
      });
    });

    // ── Corner logo cubes ──
    const cubeSide = 1;
    const corners = [
      { x: -totalW / 2 + cubeSide / 2, z: -totalD / 2 + cubeSide / 2 },
      { x: totalW / 2 - cubeSide / 2, z: -totalD / 2 + cubeSide / 2 },
      { x: -totalW / 2 + cubeSide / 2, z: totalD / 2 - cubeSide / 2 },
      { x: totalW / 2 - cubeSide / 2, z: totalD / 2 - cubeSide / 2 },
    ];

    const sortedMembers = [...members].sort((a, b) => {
      if (Math.abs(a.position.z - b.position.z) > 0.1)
        return a.position.z - b.position.z;
      return a.position.x - b.position.x;
    }); // 0: Top-Left, 1: Top-Right, 2: Bot-Left, 3: Bot-Right

    corners.forEach((corner, i) => {
      const faceX = corner.x < 0 ? -1 : 1;
      const rectCubeCenter = faceX * (totalW / 2 - 0.15);

      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 1, 1),
        wallMat.clone(),
      );
      cube.position.set(rectCubeCenter, 0.5, corner.z);
      cube.castShadow = true;
      quadGroup.add(cube);

      const logoPanel = new THREE.Mesh(
        new THREE.PlaneGeometry(0.96, 0.96),
        new THREE.MeshStandardMaterial({
          color: logoPlaceholderColor,
          roughness: 0.4,
        }),
      );
      logoPanel.position.set(rectCubeCenter + faceX * 0.16, 0.5, corner.z);
      logoPanel.rotation.y = faceX < 0 ? -Math.PI / 2 : Math.PI / 2;
      quadGroup.add(logoPanel);

      if (sortedMembers[i]) {
        logoPanels.set(sortedMembers[i].id, logoPanel);
      }
    });

    // ── Diagonal signs on top ──
    const signGeo = new THREE.BoxGeometry(0.05, 0.3, 1.8);
    const signMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
    });

    sortedMembers.forEach((member) => {
      const sign = new THREE.Mesh(signGeo, signMat.clone());
      const faceX = member.position.x < cx ? -1 : 1;
      const faceZ = member.position.z < cz ? -1 : 1;

      sign.position.set(faceX * 0.625, h - 0.15, faceZ * 0.625);
      sign.rotation.y = faceX === faceZ ? -Math.PI / 4 : Math.PI / 4;

      quadGroup.add(sign);
      standSigns.set(member.id, sign);
    });

    scene.add(quadGroup);
  });

  return { logoPanels, standSigns };
}
