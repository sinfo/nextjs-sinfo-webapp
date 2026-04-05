/**
 * Builds a single booth unit (carpet, back wall, frame strips, side walls, logo cube, sign).
 * This is the fundamental building block used by double and quad builders too.
 */

import type * as THREE_TYPES from "three";
import type { BoothResult } from "../core/types";
import {
  OSB_COLOR,
  FRAME_COLOR,
  CARPET_COLOR,
  LOGO_PLACEHOLDER_COLOR,
} from "../core/constants";

/**
 * Creates a single booth group.
 * @param THREE      - Three.js module
 * @param w          - Booth width
 * @param d          - Booth depth
 * @param h          - Booth height
 * @param isSharedBack - If true, back wall is thinner / slightly offset (for double/quad sharing)
 */
export function buildSingleBooth(
  THREE: typeof THREE_TYPES,
  w: number,
  d: number,
  h: number,
  isSharedBack: boolean = false,
): BoothResult {
  const group = new THREE.Group();

  // ── Colors ──
  const osbColor = new THREE.Color(OSB_COLOR);
  const frameColor = new THREE.Color(FRAME_COLOR);
  const carpetColor = new THREE.Color(CARPET_COLOR);
  const logoPlaceholderColor = new THREE.Color(LOGO_PLACEHOLDER_COLOR);

  // ── Carpet ──
  const carpet = new THREE.Mesh(
    new THREE.PlaneGeometry(w + 0.4, d + 0.4),
    new THREE.MeshStandardMaterial({ color: carpetColor, roughness: 0.95 }),
  );
  carpet.rotation.x = -Math.PI / 2;
  carpet.position.y = 0.03;
  carpet.receiveShadow = true;
  group.add(carpet);

  // ── Materials ──
  const wallMat = new THREE.MeshStandardMaterial({
    color: osbColor,
    roughness: 0.85,
    metalness: 0.05,
  });
  const frameMat = new THREE.MeshStandardMaterial({
    color: frameColor,
    roughness: 0.5,
    metalness: 0.3,
  });

  // ── Back wall ──
  const zOff = isSharedBack ? 0.02 : 0;
  const thck = isSharedBack ? 0.04 : 0.08;
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(w, h, thck), wallMat);
  backWall.position.set(0, h / 2, -d / 2 + zOff);
  backWall.castShadow = true;
  backWall.receiveShadow = true;
  group.add(backWall);

  // ── Frame strips ──
  const frameGeo = new THREE.BoxGeometry(0.06, h, 0.1);
  [-w / 2, 0, w / 2].forEach((xPos) => {
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.set(xPos, h / 2, -d / 2 + zOff);
    frame.castShadow = true;
    group.add(frame);
  });

  // ── Side walls (100cm from back wall) ──
  const sideMat = wallMat.clone();
  const sideGeo = new THREE.BoxGeometry(0.08, 1, 1);

  const rightWall = new THREE.Mesh(sideGeo, sideMat);
  rightWall.position.set(w / 2, 0.5, -d / 2 + 0.5);
  rightWall.castShadow = true;
  group.add(rightWall);

  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1, 1), sideMat);
  leftWall.position.set(-w / 2, 0.5, -d / 2 + 0.5);
  leftWall.castShadow = true;
  group.add(leftWall);

  // ── Front-Left Logo Cube ──
  const leftCube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 0.3),
    wallMat.clone(),
  );
  leftCube.position.set(-w / 2 + 0.5, 0.5, d / 2 - 0.15);
  leftCube.castShadow = true;
  group.add(leftCube);

  // ── Logo panel facing front ──
  const logoPanel = new THREE.Mesh(
    new THREE.PlaneGeometry(0.96, 0.96),
    new THREE.MeshStandardMaterial({
      color: logoPlaceholderColor,
      roughness: 0.4,
    }),
  );
  logoPanel.position.set(
    -w / 2 + 0.5,
    0.5,
    d / 2 - 0.15 + 0.16, // Half of 0.3 depth + 0.01 gap
  );
  group.add(logoPanel);

  // ── Top sign ──
  const sign = new THREE.Mesh(
    new THREE.BoxGeometry(w * 0.7, 0.3, 0.05),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 }),
  );
  sign.position.set(0, h - 0.15, -d / 2 + zOff + 0.05 + 0.026);
  group.add(sign);

  return { boothGroup: group, logoPanel, sign };
}
