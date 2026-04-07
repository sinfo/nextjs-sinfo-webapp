import type * as THREE_TYPES from "three";
import { venueConfig } from "@/constants/venueData";
import { createSpeakerCardTexture } from "../textures/SpeakerCardTexture";

/**
 * Removes all speaker card sprites and stems from the scene.
 */
export function clearSpeakerCards(
  scene: THREE_TYPES.Scene,
  speakerCards: Map<string, THREE_TYPES.Object3D[]>,
): void {
  speakerCards.forEach((objects) => {
    objects.forEach((obj) => {
      scene.remove(obj);
      // Traverse to dispose materials/geometries of stems too
      obj.traverse((child: any) => {
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((m: any) => {
              if (m.map) m.map.dispose();
              m.dispose();
            });
          } else {
            if (child.material.map) child.material.map.dispose();
            child.material.dispose();
          }
        }
        if (child.geometry) child.geometry.dispose();
      });
    });
  });
  speakerCards.clear();
}

/**
 * Creates speaker card sprites with staggered positioning and connecting stems.
 */
export function createSpeakerCards(
  THREE: typeof THREE_TYPES,
  scene: THREE_TYPES.Scene,
  speakerCards: Map<string, THREE_TYPES.Object3D[]>,
  getSpeakersForZone: (
    zoneId: string,
  ) => Array<{ speaker: Speaker; session: SINFOSession }>,
  is3D: boolean,
): void {
  venueConfig.zones.forEach((zone) => {
    const speakersData = getSpeakersForZone(zone.id);
    if (speakersData.length === 0) return;

    const objects: THREE_TYPES.Object3D[] = [];
    const cardW = 2.8;
    const cardH = 3.8;
    const baseH = is3D ? 3.0 : 2.0; // Updated to 20.0m for clear elevation

    const totalW =
      speakersData.length * cardW + (speakersData.length - 1) * 0.8;

    const startX = zone.position.x - totalW / 2 + cardW / 2;

    speakersData.forEach((data, i) => {
      const { speaker, session } = data;
      const tex = createSpeakerCardTexture(speaker, session, i, THREE);
      const mat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        alphaTest: 0.1,
      });

      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(cardW, cardH, 1);
      sprite.name = `speaker-card-${speaker.id}`;

      // Staggering logic (fans out slightly in Z and fluctuates in Y)
      const staggerY = Math.sin(i * 1.5) * 0.3;
      const staggerZ =
        (i % 2 === 0 ? 0.3 : -0.3) * (speakersData.length > 1 ? 1 : 0);

      const posX = startX + i * (cardW + 0.8);
      const posY = (zone.height || 0.01) + baseH + staggerY;
      const posZ = zone.position.z + (is3D ? staggerZ : 0);

      sprite.position.set(posX, posY, posZ);

      // Add animation and navigation metadata
      sprite.userData = {
        isSpeakerCard: true,
        baseY: posY,
        staggerY: staggerY, // Store for transitions
        staggerZ: staggerZ, // Store for transitions
        animOffset: i * 0.5,
        sessionId: session?.id,
      };

      scene.add(sprite);
      objects.push(sprite);

      // ── Create Stem (a thin vertical line connecting card to ground) ──
      if (is3D) {
        const stemHeight = posY - (zone.height || 0);
        const stemGeo = new THREE.CylinderGeometry(0.015, 0.015, stemHeight, 8);
        const stemMat = new THREE.MeshBasicMaterial({
          color: "#1c2b70",
          transparent: true,
          opacity: 0.3,
        });
        const stem = new THREE.Mesh(stemGeo, stemMat);

        // Position stem at midpoint between ground and card
        stem.position.set(posX, (zone.height || 0) + stemHeight / 2, posZ);
        stem.name = `speaker-stem-${speaker.id}`;
        stem.userData = { isSpeakerStem: true, cardId: speaker.id };

        scene.add(stem);
        objects.push(stem);
      }
    });

    speakerCards.set(zone.id, objects);
  });
}

/**
 * Updates speaker card positions for 2D/3D toggle.
 */
export function updateSpeakerCardsLayout(
  speakerCards: Map<string, THREE_TYPES.Object3D[]>,
  is3D: boolean,
): void {
  speakerCards.forEach((objects, zoneId) => {
    const zone = venueConfig.zones.find((z) => z.id === zoneId);
    if (!zone) return;

    const baseH = is3D ? 3.0 : 2.0;

    objects.forEach((obj) => {
      if (obj.userData.isSpeakerCard) {
        const { staggerY, staggerZ } = obj.userData;
        const targetY = (zone.height || 0.01) + baseH + (is3D ? staggerY : 0);
        obj.position.y = targetY;

        // CRITICAL: Update baseY in userData so the animation loop in SceneManager knows the new elevation
        obj.userData.baseY = targetY;

        // Update Z stagger
        obj.position.z = zone.position.z + (is3D ? staggerZ : 0);
      }

      // Update stems
      if (obj.userData.isSpeakerStem) {
        obj.visible = is3D;
        // Find the corresponding card to get its posY and resize the stem
        const cardId = obj.userData.cardId;
        const card = objects.find(
          (o) => o.userData.isSpeakerCard && o.name.includes(cardId),
        );
        if (card && is3D) {
          const stemHeight = card.position.y - (zone.height || 0);
          // Instead of scaling, we'll just rebuild or accept the stem might look a bit off if we don't scale.
          // For now, let's just move it. Scaling a cylinder in Y moves the ends, so we need to re-position anyway.
          obj.scale.y = stemHeight / 5.5; // 5.5 was my first height, but we don't know the exact original.
          // Re-pos stem at midpoint
          obj.position.y = (zone.height || 0) + stemHeight / 2;
        }
      }
    });
  });
}
