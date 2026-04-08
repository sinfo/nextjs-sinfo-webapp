/**
 * Handles pointer-based raycasting for stand hover and click interactions.
 */

import type * as THREE_TYPES from "three";
import { venueConfig } from "@/constants/venueData";

/**
 * Finds the object ID under the pointer via raycasting.
 * Returns either { type: 'stand', id: string } or { type: 'card', id: string }
 */
function getIntersectedData(
  e: PointerEvent | MouseEvent,
  container: HTMLElement,
  raycaster: THREE_TYPES.Raycaster,
  mouse: THREE_TYPES.Vector2,
  camera: THREE_TYPES.Camera,
  standMeshes: Map<string, THREE_TYPES.Object3D>,
  speakerCards: Map<string, THREE_TYPES.Object3D[]>,
): { type: "stand" | "card"; id: string; sessionId?: string } | null {
  const rect = container.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  // Collect all potential targets
  const targets: THREE_TYPES.Object3D[] = [];
  standMeshes.forEach((m) => m.traverse((c) => targets.push(c)));
  speakerCards.forEach((cards) => cards.forEach((c) => targets.push(c)));

  const intersects = raycaster.intersectObjects(targets, true);
  if (intersects.length > 0) {
    let obj: THREE_TYPES.Object3D | null = intersects[0].object;
    while (obj) {
      if (obj.userData?.standId) {
        return { type: "stand", id: obj.userData.standId };
      }
      if (obj.userData?.isSpeakerCard) {
        // Find speaker ID from name speaker-card-[id]
        const speakerId = obj.name.replace("speaker-card-", "");
        return {
          type: "card",
          id: speakerId,
          sessionId: obj.userData.sessionId,
        };
      }
      obj = obj.parent;
    }
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
  speakerCards: Map<string, THREE_TYPES.Object3D[]>;
  is3DRef: { current: boolean };
  getStandCompany: (standId: string) => Company | undefined;
  onNavigateToCompany: (companyId: string) => void;
  onNavigateToSession: (sessionId: string) => void;
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
    speakerCards,
    is3DRef,
    getStandCompany,
    onNavigateToCompany,
    onNavigateToSession,
  } = config;

  let pointerStart: { x: number; y: number } | null = null;

  function getCamera(): THREE_TYPES.Camera {
    return is3DRef.current ? perspCamera : orthoCamera;
  }

  function onPointerMove(e: PointerEvent) {
    const data = getIntersectedData(
      e,
      container,
      raycaster,
      mouse,
      getCamera(),
      standMeshes,
      speakerCards,
    );
    container.style.cursor = data
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

    const data = getIntersectedData(
      e,
      container,
      raycaster,
      mouse,
      getCamera(),
      standMeshes,
      speakerCards,
    );

    if (!data) return;

    if (data.type === "stand") {
      const company = getStandCompany(data.id);
      if (company) {
        onNavigateToCompany(company.id);
      }
    } else if (data.type === "card" && data.sessionId) {
      onNavigateToSession(data.sessionId);
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
