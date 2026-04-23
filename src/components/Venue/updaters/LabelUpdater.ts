/**
 * Updates 2D floating label sprites when the selected day changes.
 */

import type * as THREE_TYPES from "three";
import { getAssetUrl } from "../core/ModelLoader";
import { venueConfig } from "@/constants/venueData";
import { FONT_FAMILY, BRAND_NAVY } from "../core/constants";

/**
 * Updates all stand label sprites with the current company logo or name.
 */
export function updateLabels(
  THREE: typeof THREE_TYPES,
  labelSprites: Map<string, THREE_TYPES.Sprite>,
  getStandCompany: (standId: string) => Company | undefined,
  isLogisticsMode: boolean = false,
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

    if (isLogisticsMode && company) {
      const details = company.standDetails || {
        chairs: 0,
        table: false,
        lettering: false,
      };

      const renderLogistics = (img?: HTMLImageElement) => {
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.roundRect(0, 0, cw, ch, 16);
        ctx.fill();

        if (img) {
          const maxLogoH = 110;
          const ratio = Math.min(220 / img.width, maxLogoH / img.height);
          const dw = img.width * ratio;
          const dh = img.height * ratio;
          ctx.drawImage(img, (cw - dw) / 2, 15, dw, dh);
        } else {
          ctx.fillStyle = BRAND_NAVY;
          ctx.font = `bold 24px ${FONT_FAMILY}`;
          ctx.textAlign = "center";
          ctx.fillText(company.name, cw / 2, 60);
        }

        ctx.fillStyle = BRAND_NAVY;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const tStr = `Table: ${details.table ? "✅" : "❌"}`;
        const cStr = `Chairs: ${details.chairs}`;
        const lStr = `Lettering: ${details.lettering ? "✅" : "❌"}`;

        ctx.font = `bold 24px ${FONT_FAMILY}`;
        ctx.fillText(tStr, cw / 2, ch / 2 + 35);
        ctx.fillText(cStr, cw / 2, ch / 2 + 70);
        ctx.fillText(lStr, cw / 2, ch / 2 + 105);
        tex.needsUpdate = true;
      };

      if (company.img) {
        getAssetUrl(company.img).then((assetUrl) => {
          const img = new window.Image();
          img.crossOrigin = "anonymous";
          img.src = assetUrl;
          img.onload = () => renderLogistics(img);
          img.onerror = () => renderLogistics();
        });
      } else {
        renderLogistics();
      }
      return;
    }

    if (company?.img) {
      // Load logo image securely via Cache API
      getAssetUrl(company.img).then((assetUrl) => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = assetUrl;
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
      });
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

/**
 * Updates zone label sprites dynamically for dynamic zones like the showcase zone.
 */
export function updateZoneLabels(
  THREE: typeof THREE_TYPES,
  zoneSprites: Map<string, THREE_TYPES.Sprite>,
  selectedDay: number,
): void {
  const showcaseSprite = zoneSprites.get("showcase-zone");
  if (showcaseSprite) {
    let newLabel = "Showcase Zone";
    if (selectedDay === 0 || selectedDay === 1) newLabel = "Startups";
    else if (selectedDay === 2) newLabel = "Lusófona Games";
    else if (selectedDay === 3) newLabel = "ONGs";
    else if (selectedDay === 4) newLabel = "Research Institutes";

    const cw = 512;
    const ch = 96;
    const canvas = document.createElement("canvas");
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext("2d")!;

    // Transparent background
    ctx.clearRect(0, 0, cw, ch);

    ctx.font = `bold 40px ${FONT_FAMILY}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";

    ctx.fillText(newLabel, cw / 2, ch / 2);

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.colorSpace = THREE.SRGBColorSpace;

    const mat = showcaseSprite.material as THREE_TYPES.SpriteMaterial;
    mat.map?.dispose();
    mat.map = tex;
    mat.needsUpdate = true;
  }
}
