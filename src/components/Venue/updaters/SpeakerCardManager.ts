/**
 * Manages speaker card sprites in zones (create/remove on day change).
 */

import type * as THREE_TYPES from "three";
import { venueConfig } from "@/constants/venueData";
import { createSpeakerCardTexture } from "../textures/SpeakerCardTexture";

/**
 * Removes all speaker card sprites from the scene and disposes their resources.
 */
export function clearSpeakerCards(
  scene: THREE_TYPES.Scene,
  speakerCards: Map<string, THREE_TYPES.Mesh[]>,
): void {
  speakerCards.forEach((cards) => {
    cards.forEach((c) => {
      scene.remove(c);
      if ((c as any).material.map) (c as any).material.map.dispose();
      if ((c as any).material) (c as any).material.dispose();
    });
  });
  speakerCards.clear();
}

/**
 * Creates speaker card sprites for all zones and adds them to the scene.
 * Returns the populated cards map.
 */
export function createSpeakerCards(
  THREE: typeof THREE_TYPES,
  scene: THREE_TYPES.Scene,
  speakerCards: Map<string, THREE_TYPES.Mesh[]>,
  getSpeakersForZone: (
    zoneId: string,
  ) => Array<{ speaker: Speaker; session: SINFOSession }>,
  is3D: boolean,
): void {
  venueConfig.zones.forEach((zone) => {
    const speakersData = getSpeakersForZone(zone.id);
    if (speakersData.length === 0) return;

    const cards: THREE_TYPES.Sprite[] = [];
    const cardW = 2.8;
    const cardH = 3.8;

    const totalW =
      speakersData.length * cardW + (speakersData.length - 1) * 0.5;
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

      if (is3D) {
        sprite.position.set(
          startX + i * (cardW + 0.5),
          (zone.height || 0.01) + cardH / 2 + 0.5,
          zone.position.z,
        );
      } else {
        sprite.position.set(
          startX + i * (cardW + 0.5),
          (zone.height || 0.01) + 2.0,
          zone.position.z,
        );
      }
      sprite.scale.set(cardW, cardH, 1);

      scene.add(sprite);
      cards.push(sprite);
    });

    speakerCards.set(zone.id, cards as any);
  });
}

/**
 * Updates speaker card positions/scales for 2D/3D toggle.
 */
export function updateSpeakerCardsLayout(
  speakerCards: Map<string, THREE_TYPES.Mesh[]>,
  is3D: boolean,
): void {
  speakerCards.forEach((cards, zoneId) => {
    const zone = venueConfig.zones.find((z) => z.id === zoneId);
    if (!zone) return;

    const cardW = 2.8;
    const cardH = 3.8;

    cards.forEach((sprite) => {
      if (is3D) {
        sprite.position.y = (zone.height || 0.01) + cardH / 2 + 0.5;
        sprite.scale.set(cardW, cardH, 1);
      } else {
        sprite.position.y = (zone.height || 0.01) + 2.0;
        sprite.scale.set(cardW, cardH, 1);
      }
    });
  });
}
