/**
 * Updates 3D sign textures on top of booths when the selected day changes.
 */

import type * as THREE_TYPES from "three";
import { venueConfig } from "@/constants/venueData";
import { createTextCanvas } from "../textures/TextCanvasFactory";

/**
 * Updates all stand 3D sign textures with the company name.
 */
export function updateSigns(
  THREE: typeof THREE_TYPES,
  standSigns: Map<string, THREE_TYPES.Mesh>,
  getStandCompany: (standId: string) => Company | undefined,
): void {
  venueConfig.stands.forEach((stand) => {
    const company = getStandCompany(stand.id);
    const sign = standSigns.get(stand.id);

    if (sign && company) {
      const nameCanvas = createTextCanvas(company.name, {
        fontSize: 36,
        color: "#1c2b70",
        bgColor: "#ffffff",
        width: 512,
        height: 64,
      });
      const nameTex = new THREE.CanvasTexture(nameCanvas);
      nameTex.minFilter = THREE.LinearFilter;
      nameTex.colorSpace = THREE.SRGBColorSpace;
      const oldMat = sign.material as THREE_TYPES.MeshStandardMaterial;
      oldMat.map?.dispose();
      sign.material = new THREE.MeshStandardMaterial({
        map: nameTex,
        roughness: 0.3,
      });
      oldMat.dispose();
    } else if (sign) {
      const oldMat = sign.material as THREE_TYPES.MeshStandardMaterial;
      oldMat.map?.dispose();
      sign.material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.3,
      });
      oldMat.dispose();
    }
  });
}
