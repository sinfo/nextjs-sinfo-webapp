/**
 * Dynamically switches OrbitControls between PAN and ROTATE modes
 * based on whether a modifier key (Shift, Ctrl, Meta, Alt) is held
 * when the pointer is pressed down.
 */
export function setupModifierHandler(
  container: HTMLElement,
  THREE: any,
  controls: any,
): () => void {
  const onPointerDown = (e: PointerEvent) => {
    // If Cmd (Mac) or Ctrl (Windows) is held during the click, switch to Rotate
    if (e.metaKey || e.ctrlKey) {
      controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
    } else {
      // Regular click = Pan
      controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
    }
  };

  container.addEventListener("pointerdown", onPointerDown, true);

  return () => {
    container.removeEventListener("pointerdown", onPointerDown, true);
  };
}
