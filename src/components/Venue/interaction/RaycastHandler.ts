/**
 * Handles pointer-based raycasting for stand hover and click interactions.
 */

import type * as THREE_TYPES from "three";
import { venueConfig } from "@/constants/venueData";

/**
 * Finds the stand ID under the pointer via raycasting.
 */
function getIntersectedStandId(
  e: MouseEvent,
  container: HTMLElement,
  raycaster: THREE_TYPES.Raycaster,
  mouse: THREE_TYPES.Vector2,
  camera: THREE_TYPES.Camera,
  standMeshes: Map<string, THREE_TYPES.Object3D>,
): string | null {
  const rect = container.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const allChildren: THREE_TYPES.Object3D[] = [];
  standMeshes.forEach((m) => m.traverse((c) => allChildren.push(c)));

  const intersects = raycaster.intersectObjects(allChildren, false);
  if (intersects.length > 0) {
    let obj: THREE_TYPES.Object3D | null = intersects[0].object;
    while (obj && !obj.userData?.standId) obj = obj.parent;
    return obj?.userData?.standId ?? null;
  }
  return null;
}

export interface RaycastHandlerConfig {
  container: HTMLElement;
  raycaster: THREE_TYPES.Raycaster;
  mouse: THREE_TYPES.Vector2;
  perspCamera: THREE_TYPES.PerspectiveCamera;
  orthoCamera: THREE_TYPES.OrthographicCamera;
  standMeshes: Map<string, THREE_TYPES.Object3D>;
  is3DRef: { current: boolean };
  getStandCompany: (standId: string) => Company | undefined;
  onNavigateToCompany: (companyId: string) => void;
}

/**
 * Sets up pointer interaction (hover cursor + click navigation).
 * Returns a cleanup function.
 */
export function setupRaycastHandler(config: RaycastHandlerConfig): () => void {
  const {
    container,
    raycaster,
    mouse,
    perspCamera,
    orthoCamera,
    standMeshes,
    is3DRef,
    getStandCompany,
    onNavigateToCompany,
  } = config;

  let pointerStart: { x: number; y: number } | null = null;

  function getCamera(): THREE_TYPES.Camera {
    return is3DRef.current ? perspCamera : orthoCamera;
  }

  function onPointerMove(e: PointerEvent) {
    const standId = getIntersectedStandId(
      e,
      container,
      raycaster,
      mouse,
      getCamera(),
      standMeshes,
    );
    container.style.cursor = standId
      ? "pointer"
      : is3DRef.current
        ? "grab"
        : "default";
  }

  function onPointerDown(e: PointerEvent) {
    pointerStart = { x: e.clientX, y: e.clientY };
  }

  function onClick(e: MouseEvent) {
    if (!pointerStart) return;
    const dx = Math.abs(e.clientX - pointerStart.x);
    const dy = Math.abs(e.clientY - pointerStart.y);
    if (dx > 10 || dy > 10) return; // Drag tolerance

    const standId = getIntersectedStandId(
      e,
      container,
      raycaster,
      mouse,
      getCamera(),
      standMeshes,
    );
    if (standId) {
      const stand = venueConfig.stands.find((s) => s.id === standId);
      if (stand) {
        const company = getStandCompany(standId);
        if (company) {
          onNavigateToCompany(company.id);
        }
      }
    }
  }

  container.addEventListener("pointermove", onPointerMove);
  container.addEventListener("pointerdown", onPointerDown);
  container.addEventListener("click", onClick);

  return () => {
    container.removeEventListener("pointermove", onPointerMove);
    container.removeEventListener("pointerdown", onPointerDown);
    container.removeEventListener("click", onClick);
  };
}
