/**
 * Builds the customized Main Stage setup with platform, branded backdrop, lounge chairs, and plants.
 */

import type * as THREE_TYPES from "three";
import { venueConfig } from "@/constants/venueData";
import { DIR } from "../core/utils";
import { createTextCanvas } from "../textures/TextCanvasFactory";

export function buildMainStage(
  THREE: typeof THREE_TYPES,
  scene: THREE_TYPES.Scene,
): void {
  const mainStageZone = venueConfig.zones.find((z) => z.id === "main-stage");
  if (!mainStageZone) return;

  const stageGroup = new THREE.Group();
  stageGroup.name = "main-stage-setup";
  scene.add(stageGroup);

  const zoneHeight = mainStageZone.height || 0.15;
  const stageWidth = 10;
  const stageDepth = 4.5;
  const stageElevation = 0.35;

  // Position at the West edge of the zone (where the chairs are facing)
  const centerX =
    mainStageZone.position.x - mainStageZone.size.w / 2 + stageDepth / 2 + 1.0;
  const centerZ = mainStageZone.position.z;

  // 1. Platform
  const platformGeo = new THREE.BoxGeometry(
    stageDepth,
    stageElevation,
    stageWidth,
  );
  const platformMat = new THREE.MeshStandardMaterial({
    color: 0x1c2b70, // SINFO Navy
    roughness: 0.9,
  });
  const platform = new THREE.Mesh(platformGeo, platformMat);
  platform.position.set(centerX, zoneHeight + stageElevation / 2, centerZ);
  platform.castShadow = true;
  platform.receiveShadow = true;
  stageGroup.add(platform);

  // 2. Backdrop Wall
  const backdropWidth = stageWidth - 0.5;
  const backdropHeight = 3.5;
  const backdropDepth = 0.1;
  const backdropGeo = new THREE.BoxGeometry(
    backdropDepth,
    backdropHeight,
    backdropWidth,
  );

  // Backdrop texture with text
  const canvas = createTextCanvas("SINFO 33", {
    width: 1024,
    height: 512,
    fontSize: 64,
    bgColor: "#2980b9",
    color: "#ffffff",
  });
  const backdropTex = new THREE.CanvasTexture(canvas);

  const backdropMat = new THREE.MeshStandardMaterial({
    map: backdropTex,
    color: 0xffffff,
  });
  const backdrop = new THREE.Mesh(backdropGeo, backdropMat);
  backdrop.position.set(
    centerX - stageDepth / 2 + 0.1,
    zoneHeight + stageElevation + backdropHeight / 2,
    centerZ,
  );
  backdrop.castShadow = true;
  stageGroup.add(backdrop);

  // 3. Steps (Subtle blocks in front)
  const stepGeo = new THREE.BoxGeometry(0.8, stageElevation / 2, 2.0);
  const stepMat = new THREE.MeshStandardMaterial({
    color: 0x1c2b70,
    roughness: 1,
  });
  const stepL = new THREE.Mesh(stepGeo, stepMat);
  stepL.position.set(
    centerX + stageDepth / 2 + 0.4,
    zoneHeight + stageElevation / 4,
    centerZ - 2.5,
  );
  stageGroup.add(stepL);

  const stepR = new THREE.Mesh(stepGeo, stepMat);
  stepR.position.set(
    centerX + stageDepth / 2 + 0.4,
    zoneHeight + stageElevation / 4,
    centerZ + 2.5,
  );
  stageGroup.add(stepR);

  // 4. Stage Furniture (Lounge Chairs)
  const createLoungeChair = (x: number, z: number, rotationY: number) => {
    const chairGroup = new THREE.Group();

    // Seat
    const seatGeo = new THREE.SphereGeometry(
      0.4,
      16,
      16,
      0,
      Math.PI * 2,
      0,
      Math.PI / 2,
    );
    const seatMat = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.8,
    });
    const seat = new THREE.Mesh(seatGeo, seatMat);
    seat.scale.y = 0.6;
    chairGroup.add(seat);

    // Leg
    const legGeo = new THREE.CylinderGeometry(0.02, 0.2, 0.4, 12);
    const leg = new THREE.Mesh(legGeo, seatMat);
    leg.position.y = -0.2;
    chairGroup.add(leg);

    chairGroup.position.set(x, zoneHeight + stageElevation + 0.3, z);
    chairGroup.rotation.y = rotationY;
    stageGroup.add(chairGroup);
  };

  createLoungeChair(centerX, centerZ - 1.2, DIR.EAST - Math.PI / 4);
  createLoungeChair(centerX, centerZ + 1.2, DIR.EAST + Math.PI / 4);

  // Side Table
  const tableGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
  const tableMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const table = new THREE.Mesh(tableGeo, tableMat);
  table.position.set(centerX, zoneHeight + stageElevation + 0.2, centerZ);
  stageGroup.add(table);
}
