/**
 * Shared constants for the Venue 3D system.
 * All colors stored as hex numbers for direct use with THREE.Color.
 */

// ── Booth material colors ──

export const OSB_COLOR = 0xc9a96e;
export const FRAME_COLOR = 0x2a2a2a;
export const CARPET_COLOR = 0x1c2b70;
export const LOGO_PLACEHOLDER_COLOR = 0xffffff;

// ── Scene ──

export const CLEAR_COLOR = 0xf0f2f5;
export const FOG_NEAR = 60;
export const FOG_FAR = 120;

// ── Lighting ──

export const AMBIENT_INTENSITY = 0.4;
export const DIR_LIGHT_INTENSITY = 1.0;
export const DIR_LIGHT_POSITION = { x: 20, y: 35, z: 15 } as const;
export const FILL_LIGHT_COLOR = 0xb0c4de;
export const FILL_LIGHT_INTENSITY = 0.3;
export const FILL_LIGHT_POSITION = { x: -15, y: 20, z: -10 } as const;
export const SHADOW_MAP_SIZE = 2048;
export const SHADOW_CAMERA_EXTENT = 40;

// ── Cameras ──

export const PERSP_FOV = 50;
export const PERSP_NEAR = 0.1;
export const PERSP_FAR = 250;
export const PERSP_INITIAL_POSITION = { x: -30, y: 25, z: -1.97 } as const;
export const PERSP_INITIAL_ZOOM = 1.0;

export const ORTHO_FRUSTUM_SIZE = 30;
export const ORTHO_NEAR = 0.1;
export const ORTHO_FAR = 200;
export const ORTHO_INITIAL_POSITION = { x: -18.3, y: 50, z: -11.97 } as const;
export const ORTHO_INITIAL_ZOOM = 1.2;

// ── Controls ──

export const CONTROLS_DAMPING_FACTOR = 0.08;
export const CONTROLS_ROTATE_SPEED = 1.5;
export const CONTROLS_MAX_POLAR_ANGLE = Math.PI / 2.5;
export const CONTROLS_MIN_DISTANCE = 5;
export const CONTROLS_MAX_DISTANCE = 50;
export const CONTROLS_TARGET = { x: -18.3, y: 20, z: -11.97 } as const;

// ── Ground ──

export const GROUND_POSITION = { x: -3.1, y: 0, z: -2.6 } as const;

// ── Speaker card colors ──

export const BLOB_COLORS = [
  "#c0392b",
  "#2980b9",
  "#27ae60",
  "#f39c12",
  "#8e44ad",
] as const;

// ── Brand ──

export const BRAND_NAVY = "#1c2b70";
export const FONT_FAMILY = '"Montserrat", Arial, sans-serif';
