/**
 * Updates 2D floating label sprites when the selected day changes.
 */

import type * as THREE_TYPES from "three";
import { venueConfig } from "@/constants/venueData";
import { FONT_FAMILY, BRAND_NAVY } from "../core/constants";

/**
 * Updates all stand label sprites with the current company logo or name.
 */
export function updateLabels(
  THREE: typeof THREE_TYPES,
  labelSprites: Map<string, THREE_TYPES.Sprite>,
  getStandCompany: (standId: string) => Company | undefined,
): void {
  venueConfig.stands.forEach((stand) => {
    const company = getStandCompany(stand.id);
    const label = company?.name || stand.label;

    const sprite = labelSprites.get(stand.id);
    if (!sprite) return;

    const cw = 256;
    const ch = 256;
    const canvas = document.createElement("canvas");
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext("2d")!;
    const bg = company
      ? "rgba(255, 255, 255, 0.95)"
      : "rgba(255, 255, 255, 0.7)";

    // Fill background (rounded)
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.roundRect(0, 0, cw, ch, 16);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.colorSpace = THREE.SRGBColorSpace;
    (sprite.material as THREE_TYPES.SpriteMaterial).map?.dispose();
    (sprite.material as THREE_TYPES.SpriteMaterial).map = tex;
    (sprite.material as THREE_TYPES.SpriteMaterial).needsUpdate = true;

    if (company?.img) {
      // Load logo image
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = company.img;
      img.onload = () => {
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.roundRect(0, 0, cw, ch, 16);
        ctx.fill();
        const maxW = 220;
        const maxH = 220;
        const ratio = Math.min(maxW / img.width, maxH / img.height);
        const dw = img.width * ratio;
        const dh = img.height * ratio;
        ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
        tex.needsUpdate = true;
      };
      img.onerror = () => {
        ctx.fillStyle = BRAND_NAVY;
        ctx.font = `bold 28px ${FONT_FAMILY}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, cw / 2, ch / 2);
        tex.needsUpdate = true;
      };
    } else {
      // No logo — draw text label
      ctx.fillStyle = BRAND_NAVY;
      ctx.font = `bold ${company ? 28 : 38}px ${FONT_FAMILY}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, cw / 2, ch / 2);
      tex.needsUpdate = true;
    }
  });
}
