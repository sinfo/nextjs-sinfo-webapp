/**
 * Helper utilities for the Venue 3D system.
 */

/**
 * Degrees to Radians helper.
 */
export const degToRad = (deg: number) => (deg * Math.PI) / 180;

/**
 * Standard orientations (looking from top):
 * 0 = East (+X)
 * PI/2 = North (-Z)
 * PI = West (-X)
 * 3*PI/2 = South (+Z)
 */
export const DIR = {
  EAST: 0,
  NORTH: Math.PI / 2,
  WEST: Math.PI,
  SOUTH: (3 * Math.PI) / 2,
} as const;

/**
 * Direction derived from user-defined constants in ChairBuilder.ts.
 */
export type Direction = keyof typeof DIR;

/**
 * Rotate a direction 90 degrees clockwise.
 */
export const rotateCW = (rad: number) =>
  (rad - Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI);

/**
 * Rotate a direction 90 degrees anti-clockwise.
 */
export const rotateCCW = (rad: number) => (rad + Math.PI / 2) % (2 * Math.PI);
