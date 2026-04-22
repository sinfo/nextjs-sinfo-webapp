import type * as THREE_TYPES from "three";
// @ts-ignore - GLTFLoader is in Three.js examples but may not have types resolve in this environment
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader";

const glbCache: Record<string, Promise<THREE_TYPES.Group>> = {};
const textureCache: Record<string, Promise<THREE_TYPES.Texture>> = {};

let gltfLoader: GLTFLoader | null = null;

/**
 * Helper to fetch and cache an asset using the browser's Cache API.
 * This guarantees the asset is stored on the local disk without relying on HTTP headers,
 * drastically speeding up subsequent refreshes.
 */
async function getAssetUrl(url: string): Promise<{ assetUrl: string; cleanup: () => void }> {
  if (typeof window === "undefined" || !("caches" in window)) {
    return { assetUrl: url, cleanup: () => {} };
  }

  const cacheName = "sinfo-venue-assets-v1";
  try {
    const cache = await caches.open(cacheName);
    let response = await cache.match(url);

    if (!response) {
      response = await fetch(url);
      if (response.ok) {
        // Store a clone of the response in Cache API so we can also read it below
        await cache.put(url, response.clone());
      } else {
        return { assetUrl: url, cleanup: () => {} };
      }
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    return {
      assetUrl: blobUrl,
      cleanup: () => URL.revokeObjectURL(blobUrl),
    };
  } catch (err) {
    console.warn("Failed to use Cache Storage API, falling back:", err);
    return { assetUrl: url, cleanup: () => {} };
  }
}

/**
 * Loads a GLTF model from the given URL and caches its scene hierarchy natively.
 */
export function loadCachedModel(url: string): Promise<THREE_TYPES.Group> {
  if (!gltfLoader) {
    gltfLoader = new GLTFLoader();
  }

  if (glbCache[url]) {
    return glbCache[url].then((scene) => scene.clone(true) as THREE_TYPES.Group);
  }

  const promise = (async () => {
    const { assetUrl, cleanup } = await getAssetUrl(url);

    return new Promise<THREE_TYPES.Group>((resolve, reject) => {
      gltfLoader!.load(
        assetUrl,
        (gltf: GLTF) => {
          cleanup();
          resolve(gltf.scene);
        },
        undefined,
        (error: ErrorEvent | unknown) => {
          cleanup();
          console.error(`Error loading model ${url}:`, error);
          reject(error);
        }
      );
    });
  })();

  glbCache[url] = promise;
  return promise.then((scene) => scene.clone(true) as THREE_TYPES.Group);
}

/**
 * Loads a texture from the given URL and caches it securely.
 */
export function loadCachedTexture(
  url: string,
  THREE: typeof THREE_TYPES
): Promise<THREE_TYPES.Texture> {
  if (textureCache[url]) {
    return textureCache[url].then((tex) => tex.clone());
  }

  const textureLoader = new THREE.TextureLoader();
  const promise = (async () => {
    const { assetUrl, cleanup } = await getAssetUrl(url);

    return new Promise<THREE_TYPES.Texture>((resolve, reject) => {
      textureLoader.load(
        assetUrl,
        (texture) => {
          cleanup();
          resolve(texture);
        },
        undefined,
        (error) => {
          cleanup();
          reject(error);
        }
      );
    });
  })();

  textureCache[url] = promise;
  return promise.then((tex) => tex.clone());
}
