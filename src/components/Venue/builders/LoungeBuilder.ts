/**
 * Builds decorations for the Lounge and Connect Stage areas.
 * Includes cube seats, small tables, high tables, and potted plants.
 */

import type * as THREE_TYPES from "three";
import { venueConfig } from "@/constants/venueData";

export function buildLoungeDecorations(
  THREE: typeof THREE_TYPES,
  scene: THREE_TYPES.Scene,
): void {
  const loungeZone = venueConfig.zones.find((z) => z.id === "lounge");
  const connectStage = venueConfig.zones.find((z) => z.id === "connect-stage");

  if (!loungeZone || !connectStage) return;

  const loungeGroup = new THREE.Group();
  loungeGroup.name = "lounge-decorations";
  scene.add(loungeGroup);

  // ── Colors ──
  const colorTable = 0xffffff;
  const colorCube = 0x999999;
  const colorPot = 0xd2b48c; // Tan/Wood
  const colorLeaf = 0x27ae60;

  // ── Factories ──

  const createCubeSeat = (x: number, z: number, y: number = 0.02) => {
    const size = 0.45;
    const geo = new THREE.BoxGeometry(size, size, size);
    const mat = new THREE.MeshStandardMaterial({
      color: colorCube,
      roughness: 0.8,
    });
    const cube = new THREE.Mesh(geo, mat);
    cube.position.set(x, y + size / 2, z);
    cube.castShadow = true;
    cube.receiveShadow = true;
    loungeGroup.add(cube);
  };

  const createSmallTable = (x: number, z: number, y: number = 0.02) => {
    const tableGroup = new THREE.Group();
    const size = 0.7;
    const height = 0.45;

    // Table top
    const topGeo = new THREE.BoxGeometry(size, 0.05, size);
    const topMat = new THREE.MeshStandardMaterial({ color: colorTable });
    const top = new THREE.Mesh(topGeo, topMat);
    top.position.set(0, height, 0);
    tableGroup.add(top);

    // Legs (Simplified central base)
    const baseGeo = new THREE.BoxGeometry(0.1, height, 0.1);
    const base = new THREE.Mesh(baseGeo, topMat);
    base.position.y = height / 2;
    tableGroup.add(base);

    tableGroup.position.set(x, y, z);
    loungeGroup.add(tableGroup);
  };

  const createHighTable = (x: number, z: number, y: number = 0.02) => {
    const tableGroup = new THREE.Group();
    const radius = 0.35;
    const height = 1.1;

    // Top
    const topGeo = new THREE.CylinderGeometry(radius, radius, 0.04, 24);
    const mat = new THREE.MeshStandardMaterial({ color: colorTable });
    const top = new THREE.Mesh(topGeo, mat);
    top.position.y = height;
    tableGroup.add(top);

    // Stem
    const stemGeo = new THREE.CylinderGeometry(0.04, 0.04, height, 8);
    const stem = new THREE.Mesh(stemGeo, mat);
    stem.position.y = height / 2;
    tableGroup.add(stem);

    // Base
    const baseGeo = new THREE.CylinderGeometry(
      radius * 0.6,
      radius * 0.6,
      0.04,
      16,
    );
    const base = new THREE.Mesh(baseGeo, mat);
    base.position.y = 0.02;
    tableGroup.add(base);

    tableGroup.position.set(x, y, z);
    loungeGroup.add(tableGroup);
  };

  // ── Placement ──

  // 1. Plants on Connect Stage corners (Enlarged to 6m width)
  const stageTop = connectStage.height || 0.4;
  const stageX = connectStage.position.x;
  const stageZ = connectStage.position.z;
  const stageW = connectStage.size.w;
  const stageD = connectStage.size.d;

  // 2. High Tables (Row on the NORTH edge)
  const northZ = loungeZone.position.z - loungeZone.size.d / 2 + 1.2;
  const startX = loungeZone.position.x - 3.0;
  for (let i = 0; i < 4; i++) {
    createHighTable(startX + i * 2.0, northZ);
  }

  // 3. Pod Group 1 (West side, centered in lounge)
  const pod1X = loungeZone.position.x - 2.0;
  const pod1Z = loungeZone.position.z - 0.5;
  createSmallTable(pod1X, pod1Z);
  createCubeSeat(pod1X - 0.8, pod1Z, 0.02);
  createCubeSeat(pod1X + 0.8, pod1Z, 0.02);
  createCubeSeat(pod1X, pod1Z - 0.8, 0.02);
  createCubeSeat(pod1X, pod1Z + 0.8, 0.02);

  // 4. Pod Group 2 (Center/East side, moved South to clear high tables)
  const pod2X = loungeZone.position.x + 2.0;
  const pod2Z = loungeZone.position.z - 0.2;
  createSmallTable(pod2X, pod2Z);
  createCubeSeat(pod2X - 0.8, pod2Z, 0.02);
  createCubeSeat(pod2X + 0.8, pod2Z, 0.02);
  createCubeSeat(pod2X, pod2Z - 0.8, 0.02);
  createCubeSeat(pod2X, pod2Z + 0.8, 0.02);

  // 5. Showcase Cubes (3 on each side of the Showcase Zone)
  const showcaseZone = venueConfig.zones.find((z) => z.id === "showcase-zone");
  if (showcaseZone) {
    const createShowcaseCube = (x: number, z: number) => {
      // 0.5m wide, 1m tall, 1m deep (rectangular oriented along the Z-axis walkway)
      const geo = new THREE.BoxGeometry(0.5, 1, 1);
      const mat = new THREE.MeshStandardMaterial({
        color: 0xc9a96e, // OSB_COLOR
        roughness: 0.85,
      });
      const cube = new THREE.Mesh(geo, mat);
      // Half-height in Y, sitting flush on the floor
      cube.position.set(x, 0.5, z);
      cube.castShadow = true;
      cube.receiveShadow = true;
      loungeGroup.add(cube);
    };

    const leftX = showcaseZone.position.x - 3.5;
    const rightX = showcaseZone.position.x + 3.5;

    const zPositions = [
      showcaseZone.position.z - 1.8,
      showcaseZone.position.z,
      showcaseZone.position.z + 1.8,
    ];

    zPositions.forEach((zPos) => {
      createShowcaseCube(leftX, zPos);
      createShowcaseCube(rightX, zPos);
    });
  }
}
