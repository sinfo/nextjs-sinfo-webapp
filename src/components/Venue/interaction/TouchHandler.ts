import * as THREE from "three";

/**
 * Custom touch handler to supplement MapControls with Google Maps-like
 * two-finger panning while preserving tilt/rotate.
 */
export function setupTouchHandler(
  container: HTMLElement,
  controls: any, // MapControls
): () => void {
  let touchStates = [
    { id: -1, start: { x: 0, y: 0 }, prev: { x: 0, y: 0 } },
    { id: -1, start: { x: 0, y: 0 }, prev: { x: 0, y: 0 } },
  ];
  let isTwoFinger = false;

  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      isTwoFinger = true;
      for (let i = 0; i < 2; i++) {
        touchStates[i] = {
          id: e.touches[i].identifier,
          start: { x: e.touches[i].clientX, y: e.touches[i].clientY },
          prev: { x: e.touches[i].clientX, y: e.touches[i].clientY },
        };
      }
    }
  };

  const onTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2 && isTwoFinger) {
      // 1. Get current touches and calculate deltas for both
      const t1 = e.touches[0];
      const t2 = e.touches[1];

      const d1 = {
        x: t1.clientX - touchStates[0].prev.x,
        y: t1.clientY - touchStates[0].prev.y,
      };
      const d2 = {
        x: t2.clientX - touchStates[1].prev.x,
        y: t2.clientY - touchStates[1].prev.y,
      };

      // 2. Calculate parallelism
      const v1 = new THREE.Vector2(d1.x, d1.y);
      const v2 = new THREE.Vector2(d2.x, d2.y);

      const len1 = v1.length();
      const len2 = v2.length();

      if (len1 > 0.5 && len2 > 0.5) {
        const dot = v1.clone().normalize().dot(v2.clone().normalize());

        // If fingers are moving in the same direction (dot > 0.7)
        if (dot > 0.7) {
          const camera = controls.object as THREE.Camera;
          if (camera) {
            // Midpoint delta
            const midDx = (d1.x + d2.x) / 2;
            const midDy = (d1.y + d2.y) / 2;

            const distance = camera.position.distanceTo(controls.target);
            const factor = (distance * 0.001) / (controls.object.zoom || 1);

            const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(
              camera.quaternion,
            );
            forward.y = 0;
            forward.normalize();

            const right = new THREE.Vector3()
              .crossVectors(forward, new THREE.Vector3(0, 1, 0))
              .normalize();

            const moveVec = new THREE.Vector3()
              .addScaledVector(right, -midDx * factor)
              .addScaledVector(forward, midDy * factor);

            controls.target.add(moveVec);
            camera.position.add(moveVec);
            controls.update();
          }
        }
      }

      // Update previous states
      touchStates[0].prev = { x: t1.clientX, y: t1.clientY };
      touchStates[1].prev = { x: t2.clientX, y: t2.clientY };
    }
  };

  const onTouchEnd = () => {
    isTwoFinger = false;
  };

  container.addEventListener("touchstart", onTouchStart, { passive: false });
  container.addEventListener("touchmove", onTouchMove, { passive: false });
  container.addEventListener("touchend", onTouchEnd);

  return () => {
    container.removeEventListener("touchstart", onTouchStart);
    container.removeEventListener("touchmove", onTouchMove);
    container.removeEventListener("touchend", onTouchEnd);
  };
}
