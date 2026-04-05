/**
 * Venue data model for the 3D venue viewer.
 *
 * Positions use a coordinate system where:
 * - X axis = left-right (positive = right)
 * - Z axis = top-bottom (positive = down / towards viewer)
 * - Y axis = up (height)
 *
 * All dimensions are in **real meters**, based on the annotated floor plan.
 * Origin (0,0) is placed at the centre of the booth area for easy framing.
 */

import { MOCK_SPEAKERS } from "@/mocks/data";

// ─── Types ───────────────────────────────────────────────────────────

export interface Stand {
  id: string;
  label: string;
  position: { x: number; z: number };
  size: { w: number; d: number };
  height: number;
  quadGroup?: string;
  doubleGroup?: string;
  rotation?: number;
}

export interface StandAssignment {
  standId: string;
  company: Company;
}

export interface ZoneSchedule {
  zoneId: string;
  speakers: Speaker[];
}

export interface DayConfig {
  date: string;
  label: string;
  longLabel: string;
  standAssignments: StandAssignment[];
  zoneSchedules: ZoneSchedule[];
}

export interface Zone {
  id: string;
  label: string;
  type: "stage" | "stands" | "networking" | "coffee";
  position: { x: number; z: number };
  size: { w: number; d: number };
  color: string;
  height?: number;
}

export interface Entrance {
  label: string;
  position: { x: number; z: number };
  rotation?: number;
}

export interface VenueConfig {
  floor: { width: number; depth: number };
  zones: Zone[];
  stands: Stand[];
  entrances: Entrance[];
  days: DayConfig[];
}

// ─── Coordinate reference ────────────────────────────────────────────
// Origin (0, 0) = centre of the booth grid.
//
// Top row of rooms sits at Z ≈ -15  (north)
// Bottom zone sits at Z ≈ +18       (south)
// Left edge ≈ X -27, Right edge ≈ X +24
//
// From the annotated plan (all in metres):
//
// TOP ROW (left→right):
//   Main Stage:       17.50 w × 11.25 d
//   (gap 0.50)
//   Room 1:            5.00 w × 8.75 d
//   Breakfast Zone:    4.00 w × 8.75 d
//   Room 2:            5.00 w × 8.75 d
//   Coffee-break:      6.50 w × 8.75 d
//
// MIDDLE (booths):
//   Each booth 2.50 × 2.50, height 2.50
//   Centre-to-centre within a pair: 2.50 (touching edges)
//   Row spacing: 5.00 m centre-to-centre vertically
//   Column group spacing: 3.20 m gap between groups
//
// BOTTOM ROW:
//   Startup/Lounge/Gaming combined: ~30.00 w × 8.00 d
//   Connect Stage: 7.00 w × 3.00 d (south of lounge)
//   Far-right section: 10.00 w × 11.00 d

// ─── Zone definitions ────────────────────────────────────────────────

const zones: Zone[] = [
  // ── Top Row ──
  {
    id: "main-stage",
    label: "Main Stage",
    type: "stage",
    position: { x: -13.35, z: -15.625 },
    size: { w: 17.5, d: 11.25 },
    color: "#1a1a2e",
    height: 0.15,
  },
  {
    id: "room-1",
    label: "Room 1",
    type: "stage",
    position: { x: -1.6, z: -15.5 },
    size: { w: 5, d: 11 },
    color: "#1c2b70",
    height: 0.15,
  },
  {
    id: "breakfast-zone",
    label: "Breakfast Zone",
    type: "coffee",
    position: { x: 2.9, z: -15.5 },
    size: { w: 4, d: 11 },
    color: "#3d2b1f",
    height: 0.05,
  },
  {
    id: "room-2",
    label: "Room 2",
    type: "stage",
    position: { x: 7.4, z: -15.5 },
    size: { w: 5, d: 11 },
    color: "#1c2b70",
    height: 0.15,
  },
  {
    id: "coffee-break",
    label: "Coffee-break",
    type: "coffee",
    position: { x: 13.15, z: -15.5 },
    size: { w: 6.5, d: 11 },
    color: "#3d2b1f",
    height: 0.05,
  },

  // ── Bottom Row (unified 30m section aligned with Room 2 middle) ──
  {
    id: "showcase-zone",
    label: "Showcase Zone",
    type: "stands",
    position: { x: -17.6, z: 12 },
    size: { w: 10, d: 8 },
    color: "#1c2b70",
  },
  {
    id: "lounge",
    label: "Lounge",
    type: "networking",
    position: { x: -7.6, z: 12 },
    size: { w: 10, d: 8 },
    color: "#1c2b70",
  },
  {
    id: "gaming-zone",
    label: "Gaming Zone",
    type: "networking",
    position: { x: 2.4, z: 12 },
    size: { w: 10, d: 8 },
    color: "#1c2b70",
  },
  {
    id: "connect-stage",
    label: "Connect Stage",
    type: "stage",
    position: { x: -7.6, z: 14.5 },
    size: { w: 7, d: 3 },
    color: "#ffcc00",
    height: 0.4,
  },
];

// ─── Stand definitions ───────────────────────────────────────────────
// Booths are 2.50 × 2.50 m, height 2.50 m.
// Layout follows the annotated plan exactly.
//
// Columns (X centres):
//   Col A: x = -16       (stands 1, 2 — separated vertically)
//   Col B: x = -7.5, -5  (pair columns for 3-4, 5-6, 7-8)
//   Col C: x =  0,  2.5  (pair columns for 9-10, 11-12, 13-14)
//   Col D: x =  7.5, 10  (pair columns for 15-16, 17-18, 19-20)
//   Col E: x = 17.5      (stands 21-24 — vertical column)
//
// Rows (Z centres):
//   Row 1: z = -7
//   Row 2: z = -2
//   Row 3: z =  3
//   Stand 1: z = -3, Stand 2: z = 3 (Col A, wider spacing)

const stands: Stand[] = [
  // ── Column A (far left, vertical pair) ──
  {
    id: "1",
    label: "1",
    position: { x: -15.15, z: -3.25 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
    rotation: Math.PI,
  },
  {
    id: "2",
    label: "2",
    position: { x: -15.15, z: -0.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
  },

  // ── Column B (pair top, quad bottom) ──
  // Top pair (z = -5.75)
  {
    id: "3",
    label: "3",
    position: { x: -9.45, z: -5.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
    doubleGroup: "B-Top",
  },
  {
    id: "4",
    label: "4",
    position: { x: -6.95, z: -5.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
    doubleGroup: "B-Top",
  },
  // Quad (z = -0.75, 1.75)
  {
    id: "5",
    label: "5",
    position: { x: -9.45, z: -0.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
    quadGroup: "B",
  },
  {
    id: "6",
    label: "6",
    position: { x: -6.95, z: -0.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
    quadGroup: "B",
  },
  {
    id: "7",
    label: "7",
    position: { x: -9.45, z: 1.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
    quadGroup: "B",
  },
  {
    id: "8",
    label: "8",
    position: { x: -6.95, z: 1.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
    quadGroup: "B",
  },

  // ── Column C (quad top, pair bottom) ──
  // Quad (z = -5.75, -3.25)
  {
    id: "9",
    label: "9",
    position: { x: -1.25, z: -5.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
    quadGroup: "C",
  },
  {
    id: "10",
    label: "10",
    position: { x: 1.25, z: -5.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
    quadGroup: "C",
  },
  {
    id: "11",
    label: "11",
    position: { x: -1.25, z: -3.25 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
    quadGroup: "C",
  },
  {
    id: "12",
    label: "12",
    position: { x: 1.25, z: -3.25 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
    quadGroup: "C",
  },
  // Bottom pair (z = 1.75)
  {
    id: "13",
    label: "13",
    position: { x: -1.25, z: 1.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
    doubleGroup: "C-Bot",
  },
  {
    id: "14",
    label: "14",
    position: { x: 1.25, z: 1.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
    doubleGroup: "C-Bot",
  },

  // ── Column D (pair top, quad bottom) ──
  // Top pair (z = -5.75)
  {
    id: "15",
    label: "15",
    position: { x: 6.95, z: -5.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
    doubleGroup: "D-Top",
  },
  {
    id: "16",
    label: "16",
    position: { x: 9.45, z: -5.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
    doubleGroup: "D-Top",
  },
  // Quad (z = -0.75, 1.75)
  {
    id: "17",
    label: "17",
    position: { x: 6.95, z: -0.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
    quadGroup: "D",
  },
  {
    id: "18",
    label: "18",
    position: { x: 9.45, z: -0.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
    quadGroup: "D",
  },
  {
    id: "19",
    label: "19",
    position: { x: 6.95, z: 1.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
    quadGroup: "D",
  },
  {
    id: "20",
    label: "20",
    position: { x: 9.45, z: 1.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
    quadGroup: "D",
  },

  // ── Column E (far right, vertical stack) ──
  {
    id: "21",
    label: "21",
    position: { x: 15.15, z: -5.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
    rotation: -Math.PI / 2,
  },
  {
    id: "22",
    label: "22",
    position: { x: 15.15, z: -3.25 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
    rotation: -Math.PI / 2,
  },
  {
    id: "23",
    label: "23",
    position: { x: 15.15, z: -0.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
    rotation: -Math.PI / 2,
  },
  {
    id: "24",
    label: "24",
    position: { x: 15.15, z: 1.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
    rotation: -Math.PI / 2,
  },
];

// ─── Entrances ───────────────────────────────────────────────────────
const entrances: Entrance[] = [
  { label: "Entrance", position: { x: -24, z: -5 }, rotation: 90 },
  { label: "Entrance", position: { x: -24, z: 5 }, rotation: 90 },
  { label: "Entrance", position: { x: 13, z: 15.4 } },
];

// ─── Per-day data ────────────────────────────────────────────────────
// Edit these to assign companies and speakers per day.

const days: DayConfig[] = [
  {
    date: "2026-04-20",
    label: "Apr 20",
    longLabel: "Sunday, April 20",
    standAssignments: [],
    zoneSchedules: [],
  },
  {
    date: "2026-04-21",
    label: "Apr 21",
    longLabel: "Sunday, April 21",
    standAssignments: [],
    zoneSchedules: [],
  },
  {
    date: "2026-04-22",
    label: "Apr 22",
    longLabel: "Sunday, April 22",
    standAssignments: [],
    zoneSchedules: [],
  },
  {
    date: "2026-04-23",
    label: "Apr 23",
    longLabel: "Sunday, April 23",
    standAssignments: [],
    zoneSchedules: [],
  },
  {
    date: "2026-04-24",
    label: "Apr 24",
    longLabel: "Sunday, April 24",
    standAssignments: [],
    zoneSchedules: [],
  },
];

// ─── Full venue config ───────────────────────────────────────────────
export const venueConfig: VenueConfig = {
  floor: { width: 44.5, depth: 40 },
  zones,
  stands,
  entrances,
  days,
};
