/**
 * Handles 2D mode manual pan, scroll-wheel zoom, and pinch-to-zoom.
 */

import type * as THREE_TYPES from "three";

/**
 * Sets up 2D pan & zoom controls on the container.
 * Returns a cleanup function.
 */
export function setupPanZoom(
  container: HTMLElement,
  orthoCamera: THREE_TYPES.OrthographicCamera,
): () => void {
  let isPanning = false;
  let startX = 0;
  let startY = 0;
  let startCamX = 0;
  let startCamZ = 0;

  // For pinch-to-zoom
  const activePointers = new Map<number, PointerEvent>();
  let startDistance = 0;
  let startZoom = 1;

  function onWheel(e: WheelEvent) {
    e.preventDefault();
    orthoCamera.zoom = Math.max(
      0.3,
      Math.min(5, orthoCamera.zoom - e.deltaY * 0.002),
    );
    orthoCamera.updateProjectionMatrix();
  }

  function onPointerDown(e: PointerEvent) {
    activePointers.set(e.pointerId, e);

    if (activePointers.size === 1 && e.button === 0) {
      isPanning = true;
      startX = e.clientX;
      startY = e.clientY;
      startCamX = orthoCamera.position.x;
      startCamZ = orthoCamera.position.z;
      container.style.cursor = "grabbing";
    } else if (activePointers.size === 2) {
      isPanning = false;
      const pointers = Array.from(activePointers.values());
      startDistance = Math.hypot(
        pointers[0].clientX - pointers[1].clientX,
        pointers[0].clientY - pointers[1].clientY,
      );
      startZoom = orthoCamera.zoom;
    }
  }

  function onPointerMoveHandler(e: PointerEvent) {
    activePointers.set(e.pointerId, e);

    if (activePointers.size === 2) {
      const pointers = Array.from(activePointers.values());
      const currentDistance = Math.hypot(
        pointers[0].clientX - pointers[1].clientX,
        pointers[0].clientY - pointers[1].clientY,
      );
      const zoomDelta = currentDistance / startDistance;
      orthoCamera.zoom = Math.max(0.3, Math.min(5, startZoom * zoomDelta));
      orthoCamera.updateProjectionMatrix();
    } else if (isPanning && activePointers.size === 1) {
      const dx = ((e.clientX - startX) * 0.05) / orthoCamera.zoom;
      const dy = ((e.clientY - startY) * 0.05) / orthoCamera.zoom;
      orthoCamera.position.x = startCamX - dx;
      orthoCamera.position.z = startCamZ - dy;
      orthoCamera.lookAt(orthoCamera.position.x, 0, orthoCamera.position.z);
    }
  }

  function onPointerUp(e: PointerEvent) {
    activePointers.delete(e.pointerId);

    if (activePointers.size === 0) {
      isPanning = false;
      container.style.cursor = "default";
    } else if (activePointers.size === 1) {
      const remaining = Array.from(activePointers.values())[0];
      startX = remaining.clientX;
      startY = remaining.clientY;
      startCamX = orthoCamera.position.x;
      startCamZ = orthoCamera.position.z;
      isPanning = true;
    }
  }

  container.addEventListener("wheel", onWheel, { passive: false });
  container.addEventListener("pointerdown", onPointerDown);
  container.addEventListener("pointermove", onPointerMoveHandler);
  container.addEventListener("pointerup", onPointerUp);
  container.addEventListener("pointercancel", onPointerUp);
  container.addEventListener("pointerleave", onPointerUp);

  return () => {
    container.removeEventListener("wheel", onWheel);
    container.removeEventListener("pointerdown", onPointerDown);
    container.removeEventListener("pointermove", onPointerMoveHandler);
    container.removeEventListener("pointerup", onPointerUp);
    container.removeEventListener("pointercancel", onPointerUp);
    container.removeEventListener("pointerleave", onPointerUp);
  };
}
