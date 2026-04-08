/**
 * Updates logo panel textures on booth sides when the selected day changes.
 */

import type * as THREE_TYPES from "three";
import { venueConfig } from "@/constants/venueData";

/**
 * Updates all stand logo panels with the company logo image.
 */
export function updateLogoPanels(
  THREE: typeof THREE_TYPES,
  standLogoPanels: Map<string, THREE_TYPES.Mesh>,
  getStandCompany: (standId: string) => Company | undefined,
): void {
  venueConfig.stands.forEach((stand) => {
    const company = getStandCompany(stand.id);
    const logoPanel = standLogoPanels.get(stand.id);

    const setFallbackWhite = () => {
      if (!logoPanel) return;
      const oldMat = logoPanel.material as THREE_TYPES.MeshStandardMaterial;
      oldMat.map?.dispose();
      logoPanel.material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.6,
      });
      oldMat.dispose();
    };

    if (logoPanel && company?.img) {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = company.img;
      img.onload = () => {
        const cw = 512;
        const ch = 512;
        const canvas = document.createElement("canvas");
        canvas.width = cw;
        canvas.height = ch;
        const ctx = canvas.getContext("2d")!;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, cw, ch);

        const padding = 32;
        const maxW = cw - padding * 2;
        const maxH = ch - padding * 2;
        const ratio = Math.min(maxW / img.width, maxH / img.height);
        const dw = img.width * ratio;
        const dh = img.height * ratio;
        ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);

        const logoTex = new THREE.CanvasTexture(canvas);
        logoTex.minFilter = THREE.LinearFilter;
        logoTex.colorSpace = THREE.SRGBColorSpace;
        logoTex.generateMipmaps = true;

        const oldMat = logoPanel.material as THREE_TYPES.MeshStandardMaterial;
        oldMat.map?.dispose();
        logoPanel.material = new THREE.MeshStandardMaterial({
          map: logoTex,
          roughness: 0.4,
          color: 0xffffff,
        });
        oldMat.dispose();
      };
      img.onerror = setFallbackWhite;
    } else if (logoPanel) {
      setFallbackWhite();
    }
  });
}
