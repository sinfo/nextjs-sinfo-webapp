/**
 * Loads and places the 3D 'Hacky' humanoid model in the Gaming Zone.
 */

import type * as THREE_TYPES from "three";
// @ts-ignore - GLTFLoader is in Three.js examples
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { venueConfig } from "@/constants/venueData";

async function loadModel(
  loader: GLTFLoader,
  url: string,
): Promise<THREE_TYPES.Group> {
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf: GLTF) => {
        resolve(gltf.scene);
      },
      undefined,
      (error: ErrorEvent | unknown) => {
        console.error(`Error loading model ${url}:`, error);
        reject(error);
      },
    );
  });
}

/**
 * Creates a procedurally generated computer monitor.
 */
function createMonitor(THREE: typeof THREE_TYPES): THREE_TYPES.Group {
  const monitor = new THREE.Group();
  monitor.name = "computer-monitor";

  const monitorColor = 0x1a1a1a;
  const standMaterial = new THREE.MeshStandardMaterial({
    color: monitorColor,
    roughness: 0.8,
  });
  const textureLoader = new THREE.TextureLoader();
  const desktopTexture = textureLoader.load("/models/backgrounds/desktop.png");
  desktopTexture.colorSpace = THREE.SRGBColorSpace;

  const screenMaterial = new THREE.MeshStandardMaterial({
    map: desktopTexture,
    roughness: 0.1,
    metalness: 0.2,
  });

  // Stand base
  const baseMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.02, 0.15),
    standMaterial,
  );
  baseMesh.position.set(0, 0.01, 0);

  // Stand neck
  const neckMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.15, 0.04),
    standMaterial,
  );
  neckMesh.position.set(0, 0.08, 0);

  // Screen enclosure
  const screenEnclosure = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.35, 0.04),
    standMaterial,
  );
  screenEnclosure.position.set(0, 0.22, 0);

  // Display
  const displayMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.58, 0.33),
    screenMaterial,
  );
  displayMesh.position.set(0, 0.22, 0.021);

  // Enable shadows for monitor parts
  [baseMesh, neckMesh, screenEnclosure].forEach((mesh) => {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  });

  monitor.add(baseMesh, neckMesh, screenEnclosure, displayMesh);

  return monitor;
}

/**
 * Creates a complete gaming setup by grouping keyboard, mouse, PC, and sim models.
 */
export async function createGamingSetup(
  THREE: typeof THREE_TYPES,
  loader: GLTFLoader,
): Promise<THREE_TYPES.Group> {
  const group = new THREE.Group();
  group.name = "gaming-setup-component";

  try {
    const [pc, table, keyboard, mouse] = await Promise.all([
      loadModel(loader, "/models/gaming/pc.glb"),
      loadModel(loader, "/models/gaming/table.glb"),
      loadModel(loader, "/models/gaming/keyboard.glb"),
      loadModel(loader, "/models/gaming/mouse.glb"),
    ]);

    // Enable shadows for all parts
    const enableShadows = (model: THREE_TYPES.Group) => {
      model.traverse((child) => {
        if ((child as THREE_TYPES.Mesh).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    };

    [pc, table].forEach(enableShadows);

    // Lighten the table's material to increase contrast with the dark keyboard/mouse
    table.traverse((child) => {
      const mesh = child as THREE_TYPES.Mesh;
      if (mesh.isMesh) {
        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
        materials.forEach((mat) => {
          const standardMat = mat as THREE_TYPES.MeshStandardMaterial;
          // Clear any dark texture maps that override the color
          if (standardMat.map) {
            standardMat.map = null;
          }
          // Set to a mid-grey for balanced contrast
          if (standardMat.color) {
            standardMat.color.setHex(0x777777);
          }
          standardMat.needsUpdate = true;
        });
      }
    });

    table.scale.set(1, 1, 1);
    pc.scale.set(0.28, 0.28, 0.28);
    keyboard.scale.set(0.1, 0.1, 0.1);
    mouse.scale.set(0.05, 0.05, 0.05);

    table.position.set(0, 0, 0);

    pc.position.set(0.8, -0.6, 0);

    keyboard.position.set(0, 0, -0.1);
    mouse.position.set(-0.4, 0, -0.1);

    table.rotation.y = Math.PI;
    keyboard.rotation.y = Math.PI;
    mouse.rotation.y = -Math.PI / 2;
    pc.rotation.y = Math.PI / 2;

    const monitor = createMonitor(THREE);

    // Position monitor on the table
    monitor.position.set(0, 0, 0.1);
    monitor.rotation.y = Math.PI;

    group.add(table, pc, keyboard, mouse, monitor);
  } catch (err) {
    console.error("Failed to build gaming setup component:", err);
  }

  return group;
}

export async function buildGamingZone(
  THREE: typeof THREE_TYPES,
  scene: THREE_TYPES.Scene,
): Promise<void> {
  const loader = new GLTFLoader();

  const gamingZone = venueConfig.zones.find((z) => z.id === "gaming-zone");
  if (!gamingZone) return;

  try {
    const hackyModel = await loadModel(loader, "/models/characters/hacky.glb");

    hackyModel.traverse((child) => {
      if ((child as THREE_TYPES.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    const gamingGroup = new THREE.Group();
    gamingGroup.name = "gaming-group";
    scene.add(gamingGroup);

    // Initial scale adjustment for a humanoid
    // Assuming 1 unit = 1 meter, we'll start with 1.8 for a 1.8m human.
    const s = 2.0;
    hackyModel.scale.set(s, s, s);

    // Position it in the gaming area
    hackyModel.position.set(
      gamingZone.position.x - 2,
      1, // On the floor
      gamingZone.position.z - 2,
    );

    // Rotate it to face the center/north
    hackyModel.rotation.y = -Math.PI * 1.3;

    gamingGroup.add(hackyModel);

    // HP Zone Setups
    const hpZone = venueConfig.zones.find((z) => z.id === "hp-zone");
    if (hpZone) {
      const [hpSetup1, hpSetup2, simModel] = await Promise.all([
        createGamingSetup(THREE, loader),
        createGamingSetup(THREE, loader),
        loadModel(loader, "/models/gaming/sim.glb"),
      ]);

      // Enable shadows on the simulator component
      simModel.traverse((child) => {
        if ((child as THREE_TYPES.Mesh).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      simModel.scale.set(0.8, 0.8, 0.8);

      // Setup 1 (Facing forward/North)
      hpSetup1.position.set(
        hpZone.position.x - 1,
        0.8,
        hpZone.position.z - 2.3,
      );
      hpSetup1.rotation.y = 0;

      // Setup 2 (Facing backward/South) - Back to back with Setup 1
      hpSetup2.position.set(
        hpZone.position.x - 1,
        0.8,
        hpZone.position.z - 1.7,
      );
      hpSetup2.rotation.y = Math.PI;

      // Position racing/flight simulator
      simModel.position.set(hpZone.position.x + 1.2, 0, hpZone.position.z - 2);
      simModel.rotation.y = Math.PI; // Facing center of the zone

      gamingGroup.add(hpSetup1, hpSetup2, simModel);
    }

    // Load and position Arcades
    const arcadeModel = await loadModel(loader, "/models/gaming/arcade.glb");
    arcadeModel.traverse((child) => {
      if ((child as THREE_TYPES.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    arcadeModel.scale.set(0.004, 0.004, 0.004);

    // Add 7 arcades evenly spaced across the back of both zones
    if (gamingZone && hpZone) {
      const totalArcades = 7;
      const spacingX = 1.0; // Slightly larger interval
      // Center the 6.0m span (7 arcades at 1.0m spacing) over the boundary at x=2.4
      const startX = -0.6;
      const backZ = gamingZone.position.z + 2.5;

      for (let i = 0; i < totalArcades; i++) {
        const arcade = arcadeModel.clone();
        const posX = startX + i * spacingX;

        arcade.position.set(posX, 0, backZ);
        arcade.rotation.y = Math.PI;

        gamingGroup.add(arcade);
      }
    }
  } catch (err) {
    console.error("Failed to build gaming zone decorations:", err);
  }
}
