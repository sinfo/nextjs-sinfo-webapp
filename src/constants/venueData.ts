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

// ─── Types ───────────────────────────────────────────────────────────

export interface Company {
  name: string;
  logoUrl?: string;
  siteUrl?: string;
  description?: string;
}

export interface Speaker {
  name: string;
  title: string;
  description: string;
  imgUrl?: string;
  companyName?: string;
  time?: string;
}

export interface Stand {
  id: string;
  label: string;
  position: { x: number; z: number };
  size: { w: number; d: number };
  height: number;
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
    id: "startup-zone",
    label: "Startup Zone",
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
  },
  {
    id: "4",
    label: "4",
    position: { x: -6.95, z: -5.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
  },
  // Quad (z = -0.75, 1.75)
  {
    id: "5",
    label: "5",
    position: { x: -9.45, z: -0.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
  },
  {
    id: "6",
    label: "6",
    position: { x: -6.95, z: -0.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
  },
  {
    id: "7",
    label: "7",
    position: { x: -9.45, z: 1.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
  },
  {
    id: "8",
    label: "8",
    position: { x: -6.95, z: 1.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
  },

  // ── Column C (quad top, pair bottom) ──
  // Quad (z = -5.75, -3.25)
  {
    id: "9",
    label: "9",
    position: { x: -1.25, z: -5.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
  },
  {
    id: "10",
    label: "10",
    position: { x: 1.25, z: -5.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
  },
  {
    id: "11",
    label: "11",
    position: { x: -1.25, z: -3.25 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
  },
  {
    id: "12",
    label: "12",
    position: { x: 1.25, z: -3.25 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
  },
  // Bottom pair (z = 1.75)
  {
    id: "13",
    label: "13",
    position: { x: -1.25, z: 1.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
  },
  {
    id: "14",
    label: "14",
    position: { x: 1.25, z: 1.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
  },

  // ── Column D (pair top, quad bottom) ──
  // Top pair (z = -5.75)
  {
    id: "15",
    label: "15",
    position: { x: 6.95, z: -5.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
  },
  {
    id: "16",
    label: "16",
    position: { x: 9.45, z: -5.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
  },
  // Quad (z = -0.75, 1.75)
  {
    id: "17",
    label: "17",
    position: { x: 6.95, z: -0.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
  },
  {
    id: "18",
    label: "18",
    position: { x: 9.45, z: -0.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
  },
  {
    id: "19",
    label: "19",
    position: { x: 6.95, z: 1.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
  },
  {
    id: "20",
    label: "20",
    position: { x: 9.45, z: 1.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
  },

  // ── Column E (far right, vertical stack) ──
  {
    id: "21",
    label: "21",
    position: { x: 15.15, z: -5.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
  },
  {
    id: "22",
    label: "22",
    position: { x: 15.15, z: -3.25 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
  },
  {
    id: "23",
    label: "23",
    position: { x: 15.15, z: -0.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
  },
  {
    id: "24",
    label: "24",
    position: { x: 15.15, z: 1.75 },
    size: { w: 2.5, d: 2.5 },
    height: 2.5,
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
    standAssignments: [
      {
        standId: "1",
        company: {
          name: "Cloudflare",
          logoUrl: "/images/companies/plats/cloudflare.svg",
          description: "Web security and performance",
          siteUrl: "https://cloudflare.com",
        },
      },
      {
        standId: "2",
        company: {
          name: "Axians",
          logoUrl: "/images/companies/plats/axians.svg",
          description: "ICT solutions and services",
          siteUrl: "https://axians.com",
        },
      },
      {
        standId: "3",
        company: {
          name: "Premium Minds",
          logoUrl: "/images/companies/plats/premium-minds.svg",
          description: "Software engineering for critical systems",
          siteUrl: "https://premium-minds.com",
        },
      },
      {
        standId: "4",
        company: {
          name: "Dremio",
          logoUrl: "/images/companies/plats/dremio.png",
          description: "The data lakehouse platform",
          siteUrl: "https://dremio.com",
        },
      },
      {
        standId: "5",
        company: {
          name: "Freiheit",
          logoUrl: "/images/companies/plats/freiheit.svg",
          description: "Digital product engineering",
          siteUrl: "https://freiheit.com",
        },
      },
      {
        standId: "6",
        company: {
          name: "CNN",
          logoUrl: "/images/companies/partners/cnn.png",
          description: "Global news and information",
          siteUrl: "https://cnn.com",
        },
      },
      {
        standId: "7",
        company: {
          name: "Oracle",
          logoUrl: "/images/companies/partners/oracle.svg",
          description: "Integrated cloud applications and platform services",
          siteUrl: "https://oracle.com",
        },
      },
      {
        standId: "8",
        company: {
          name: "Elgato",
          logoUrl: "/images/companies/partners/elgato.svg",
          description: "AV technology for content creators",
          siteUrl: "https://elgato.com",
        },
      },
      {
        standId: "9",
        company: {
          name: "Single Store",
          logoUrl: "/images/companies/plats/single-store.svg",
          description: "The database for data-intensive apps",
          siteUrl: "https://singlestore.com",
        },
      },
      {
        standId: "10",
        company: {
          name: "Corsair",
          logoUrl: "/images/companies/partners/corsair.png",
          description: "High-performance gear for gamers and creators",
          siteUrl: "https://corsair.com",
        },
      },
      {
        standId: "11",
        company: {
          name: "American Corner",
          logoUrl: "/images/companies/partners/american-corner.png",
          description: "A bridge between the US and the local community",
          siteUrl: "https://www.facebook.com/AmericanCornerPortugal/",
        },
      },
      {
        standId: "12",
        company: {
          name: "Ducky",
          logoUrl: "/images/companies/partners/ducky.png",
          description: "Mechanical keyboards and high-end peripherals",
          siteUrl: "https://duckychannel.com.tw",
        },
      },
      {
        standId: "13",
        company: {
          name: "Noblechairs",
          logoUrl: "/images/companies/partners/noblechairs.png",
          description: "Premium ergonomic gaming chairs",
          siteUrl: "https://noblechairs.com",
        },
      },
      {
        standId: "14",
        company: {
          name: "Next Big Idea",
          logoUrl: "/images/companies/partners/the-next-big-idea.png",
          description: "Ecosystem of technology, innovation and startups",
          siteUrl: "https://thenextbigidea.pt/",
        },
      },
      {
        standId: "15",
        company: {
          name: "Sky",
          logoUrl: "/images/companies/plats/sky.svg",
          description: "Entertainment and communications",
          siteUrl: "https://sky.com",
        },
      },
      {
        standId: "16",
        company: {
          name: "Repeated Premium Minds",
          logoUrl: "/images/companies/plats/premium-minds.svg",
          description: "Software engineering for critical systems",
          siteUrl: "https://premium-minds.com",
        },
      },
      {
        standId: "17",
        company: {
          name: "Repeated Axians",
          logoUrl: "/images/companies/plats/axians.svg",
          description: "ICT solutions and services",
          siteUrl: "https://axians.com",
        },
      },
      {
        standId: "18",
        company: {
          name: "Repeated Cloudflare",
          logoUrl: "/images/companies/plats/cloudflare.svg",
          description: "Web security and performance",
          siteUrl: "https://cloudflare.com",
        },
      },
      {
        standId: "19",
        company: {
          name: "Repeated Freiheit",
          logoUrl: "/images/companies/plats/freiheit.svg",
          description: "Digital product engineering",
          siteUrl: "https://freiheit.com",
        },
      },
      {
        standId: "20",
        company: {
          name: "Repeated Single Store",
          logoUrl: "/images/companies/plats/single-store.svg",
          description: "The database for data-intensive apps",
          siteUrl: "https://singlestore.com",
        },
      },
      {
        standId: "21",
        company: {
          name: "Start Campus",
          logoUrl: "/images/companies/plats/start-campus.svg",
          description: "Sustainable hyperscale data centers",
          siteUrl: "https://startcampus.pt",
        },
      },
      {
        standId: "22",
        company: {
          name: "Repeated Start Campus",
          logoUrl: "/images/companies/plats/start-campus.svg",
          description: "Sustainable hyperscale data centers",
          siteUrl: "https://startcampus.pt",
        },
      },
      {
        standId: "23",
        company: {
          name: "Repeated Dremio",
          logoUrl: "/images/companies/plats/dremio.png",
          description: "The data lakehouse platform",
          siteUrl: "https://dremio.com",
        },
      },
      {
        standId: "24",
        company: {
          name: "Repeated Sky",
          logoUrl: "/images/companies/plats/sky.svg",
          description: "Entertainment and communications",
          siteUrl: "https://sky.com",
        },
      },
    ],
    zoneSchedules: [
      {
        zoneId: "main-stage",
        speakers: [
          {
            name: "Ana Silva",
            title: "Keynote: The Future of AI in Portugal",
            description:
              "Exploring how AI is reshaping the Portuguese tech ecosystem.",
            companyName: "Cloudflare",
            time: "10:00",
          },
        ],
      },
    ],
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
