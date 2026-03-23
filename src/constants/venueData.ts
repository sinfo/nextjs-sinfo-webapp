/**
 * Venue data model for the 3D venue viewer.
 *
 * Positions use a coordinate system where:
 * - X axis = left-right (positive = right)
 * - Z axis = top-bottom (positive = down / towards viewer)
 * - Y axis = up (height)
 *
 * Units are in meters, matching the real venue dimensions.
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
}

export interface VenueConfig {
  floor: { width: number; depth: number };
  zones: Zone[];
  stands: Stand[];
  days: DayConfig[];
}

// ─── Zone definitions ────────────────────────────────────────────────
const zones: Zone[] = [
  {
    id: "main-stage",
    label: "Main Stage",
    type: "stage",
    position: { x: 12, z: -12 },
    size: { w: 16, d: 12 },
    color: "#1a1a2e",
  },
  {
    id: "networking-lounge",
    label: "Networking Lounge",
    type: "networking",
    position: { x: 8, z: 12 },
    size: { w: 14, d: 8 },
    color: "#1c2b70",
  },
  {
    id: "coffee-corner",
    label: "Coffee Corner",
    type: "coffee",
    position: { x: -14, z: -10 },
    size: { w: 8, d: 6 },
    color: "#3d2b1f",
  },
];

// ─── Stand definitions ───────────────────────────────────────────────
const STAND_W = 2.5;
const STAND_D = 2.5;
const STAND_H = 2.5;

const stands: Stand[] = [
  // ── Row 1 (back row, closer to main stage) ──
  {
    id: "A1",
    label: "A1",
    position: { x: -4, z: -3 },
    size: { w: STAND_W, d: STAND_D },
    height: STAND_H,
  },
  {
    id: "A2",
    label: "A2",
    position: { x: 0, z: -3 },
    size: { w: STAND_W, d: STAND_D },
    height: STAND_H,
  },
  {
    id: "A3",
    label: "A3",
    position: { x: 4, z: -3 },
    size: { w: STAND_W, d: STAND_D },
    height: STAND_H,
  },
  {
    id: "A4",
    label: "A4",
    position: { x: 8, z: -3 },
    size: { w: STAND_W, d: STAND_D },
    height: STAND_H,
  },
  {
    id: "A5",
    label: "A5",
    position: { x: 12, z: -3 },
    size: { w: STAND_W, d: STAND_D },
    height: STAND_H,
  },

  // ── Row 2 (middle row) ──
  {
    id: "B1",
    label: "B1",
    position: { x: -4, z: 1 },
    size: { w: STAND_W, d: STAND_D },
    height: STAND_H,
  },
  {
    id: "B2",
    label: "B2",
    position: { x: 0, z: 1 },
    size: { w: STAND_W, d: STAND_D },
    height: STAND_H,
  },
  {
    id: "B3",
    label: "B3",
    position: { x: 4, z: 1 },
    size: { w: STAND_W, d: STAND_D },
    height: STAND_H,
  },
  {
    id: "B4",
    label: "B4",
    position: { x: 8, z: 1 },
    size: { w: STAND_W, d: STAND_D },
    height: STAND_H,
  },
  {
    id: "B5",
    label: "B5",
    position: { x: 12, z: 1 },
    size: { w: STAND_W, d: STAND_D },
    height: STAND_H,
  },

  // ── Row 3 (front row, closer to networking lounge) ──
  {
    id: "C1",
    label: "C1",
    position: { x: -2, z: 5 },
    size: { w: STAND_W, d: STAND_D },
    height: STAND_H,
  },
  {
    id: "C2",
    label: "C2",
    position: { x: 2, z: 5 },
    size: { w: STAND_W, d: STAND_D },
    height: STAND_H,
  },
  {
    id: "C3",
    label: "C3",
    position: { x: 6, z: 5 },
    size: { w: STAND_W, d: STAND_D },
    height: STAND_H,
  },
  {
    id: "C4",
    label: "C4",
    position: { x: 10, z: 5 },
    size: { w: STAND_W, d: STAND_D },
    height: STAND_H,
  },
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
        standId: "A1",
        company: {
          name: "Cloudflare",
          logoUrl: "/images/companies/plats/cloudflare.svg",
          description: "Web security and performance",
          siteUrl: "https://cloudflare.com",
        },
      },
      {
        standId: "A2",
        company: {
          name: "Premium Minds",
          logoUrl: "/images/companies/plats/premium-minds.svg",
          description: "Software engineering for critical systems",
          siteUrl: "https://premium-minds.com",
        },
      },
      {
        standId: "A3",
        company: {
          name: "Single Store",
          logoUrl: "/images/companies/plats/single-store.svg",
          description: "The database for data-intensive apps",
          siteUrl: "https://singlestore.com",
        },
      },
      {
        standId: "B1",
        company: {
          name: "Sky",
          logoUrl: "/images/companies/plats/sky.svg",
          description: "Entertainment and communications",
          siteUrl: "https://sky.com",
        },
      },
      {
        standId: "B2",
        company: {
          name: "Start Campus",
          logoUrl: "/images/companies/plats/start-campus.svg",
          description: "Sustainable hyperscale data centers",
          siteUrl: "https://startcampus.pt",
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
          {
            name: "João Ferreira",
            title: "Building Scalable Systems",
            description:
              "Architecture patterns for millions of requests per second.",
            companyName: "Premium Minds",
            time: "14:00",
          },
          {
            name: "Maria Santos",
            title: "Panel: Open Source in Enterprise",
            description: "How open source is driving enterprise innovation.",
            companyName: "Single Store",
            time: "16:00",
          },
        ],
      },
      {
        zoneId: "networking-lounge",
        speakers: [
          {
            name: "Pedro Alves",
            title: "Workshop: Cloud Security 101",
            description: "Hands-on fundamentals of cloud security.",
            companyName: "Sky",
            time: "11:00",
          },
        ],
      },
    ],
  },
  {
    date: "2026-04-21",
    label: "Apr 21",
    longLabel: "Monday, April 21",
    standAssignments: [
      {
        standId: "A1",
        company: {
          name: "Dremio",
          logoUrl: "/images/companies/plats/dremio.png",
          description: "The easy and open data lakehouse",
          siteUrl: "https://dremio.com",
        },
      },
      {
        standId: "A4",
        company: {
          name: "Freiheit",
          logoUrl: "/images/companies/plats/freiheit.svg",
          description: "Software engineering company",
          siteUrl: "https://freiheit.com",
        },
      },
      {
        standId: "B3",
        company: {
          name: "Axians",
          logoUrl: "/images/companies/plats/axians.svg",
          description: "ICT solutions and services",
          siteUrl: "https://axians.com",
        },
      },
      {
        standId: "C1",
        company: {
          name: "Cloudflare",
          logoUrl: "/images/companies/plats/cloudflare.svg",
          description: "Web security and performance",
          siteUrl: "https://cloudflare.com",
        },
      },
      {
        standId: "C2",
        company: {
          name: "Premium Minds",
          logoUrl: "/images/companies/plats/premium-minds.svg",
          description: "Software engineering for critical systems",
          siteUrl: "https://premium-minds.com",
        },
      },
    ],
    zoneSchedules: [
      {
        zoneId: "main-stage",
        speakers: [
          {
            name: "Carlos Mendes",
            title: "Designing for Accessibility",
            description: "Making products work for everyone.",
            companyName: "Axians",
            time: "10:00",
          },
          {
            name: "Sofia Costa",
            title: "Panel: Women in Tech",
            description: "Leading women in tech share their journeys.",
            companyName: "Freiheit",
            time: "15:00",
          },
        ],
      },
      {
        zoneId: "networking-lounge",
        speakers: [
          {
            name: "Tiago Lima",
            title: "Workshop: Data Lakehouses",
            description: "Building modern data architectures.",
            companyName: "Dremio",
            time: "11:00",
          },
        ],
      },
    ],
  },
  {
    date: "2026-04-22",
    label: "Apr 22",
    longLabel: "Tuesday, April 22",
    standAssignments: [
      {
        standId: "A1",
        company: {
          name: "Sky",
          logoUrl: "/images/companies/plats/sky.svg",
          description: "Entertainment and communications",
          siteUrl: "https://sky.com",
        },
      },
      {
        standId: "A3",
        company: {
          name: "Start Campus",
          logoUrl: "/images/companies/plats/start-campus.svg",
          description: "Sustainable hyperscale data centers",
          siteUrl: "https://startcampus.pt",
        },
      },
      {
        standId: "A5",
        company: {
          name: "Single Store",
          logoUrl: "/images/companies/plats/single-store.svg",
          description: "The database for data-intensive apps",
          siteUrl: "https://singlestore.com",
        },
      },
      {
        standId: "B2",
        company: {
          name: "Cloudflare",
          logoUrl: "/images/companies/plats/cloudflare.svg",
          description: "Web security and performance",
          siteUrl: "https://cloudflare.com",
        },
      },
      {
        standId: "B4",
        company: {
          name: "Premium Minds",
          logoUrl: "/images/companies/plats/premium-minds.svg",
          description: "Software engineering for critical systems",
          siteUrl: "https://premium-minds.com",
        },
      },
      {
        standId: "C3",
        company: {
          name: "Dremio",
          logoUrl: "/images/companies/plats/dremio.png",
          description: "The easy and open data lakehouse",
          siteUrl: "https://dremio.com",
        },
      },
    ],
    zoneSchedules: [
      {
        zoneId: "main-stage",
        speakers: [
          {
            name: "Inês Rodrigues",
            title: "The Open Source Revolution",
            description:
              "Why contributing to open source is the best career move.",
            companyName: "Start Campus",
            time: "10:00",
          },
          {
            name: "Bruno Dias",
            title: "Edge Computing: Next Frontier",
            description: "Bringing processing closer to users.",
            companyName: "Cloudflare",
            time: "14:30",
          },
        ],
      },
      {
        zoneId: "networking-lounge",
        speakers: [
          {
            name: "Rita Neves",
            title: "Workshop: Design Systems at Scale",
            description: "Building and maintaining design systems.",
            companyName: "Premium Minds",
            time: "11:30",
          },
        ],
      },
    ],
  },
  {
    date: "2026-04-23",
    label: "Apr 23",
    longLabel: "Wednesday, April 23",
    standAssignments: [
      {
        standId: "A2",
        company: {
          name: "Axians",
          logoUrl: "/images/companies/plats/axians.svg",
          description: "ICT solutions and services",
          siteUrl: "https://axians.com",
        },
      },
      {
        standId: "A4",
        company: {
          name: "Sky",
          logoUrl: "/images/companies/plats/sky.svg",
          description: "Entertainment and communications",
          siteUrl: "https://sky.com",
        },
      },
      {
        standId: "B1",
        company: {
          name: "Freiheit",
          logoUrl: "/images/companies/plats/freiheit.svg",
          description: "Software engineering company",
          siteUrl: "https://freiheit.com",
        },
      },
      {
        standId: "B5",
        company: {
          name: "Dremio",
          logoUrl: "/images/companies/plats/dremio.png",
          description: "The easy and open data lakehouse",
          siteUrl: "https://dremio.com",
        },
      },
      {
        standId: "C4",
        company: {
          name: "Start Campus",
          logoUrl: "/images/companies/plats/start-campus.svg",
          description: "Sustainable hyperscale data centers",
          siteUrl: "https://startcampus.pt",
        },
      },
    ],
    zoneSchedules: [
      {
        zoneId: "main-stage",
        speakers: [
          {
            name: "Ricardo Lopes",
            title: "GPU Computing and the AI Revolution",
            description: "How GPU architecture powers modern AI.",
            companyName: "Freiheit",
            time: "10:00",
          },
          {
            name: "Laura Martins",
            title: "Data Lakehouse Architecture",
            description: "Bridging lakes and warehouses.",
            companyName: "Dremio",
            time: "14:00",
          },
        ],
      },
      {
        zoneId: "networking-lounge",
        speakers: [
          {
            name: "André Sousa",
            title: "Workshop: Real-time Communications",
            description: "Building real-time features into your apps.",
            companyName: "Axians",
            time: "11:00",
          },
        ],
      },
    ],
  },
  {
    date: "2026-04-24",
    label: "Apr 24",
    longLabel: "Thursday, April 24",
    standAssignments: [
      {
        standId: "A1",
        company: {
          name: "Cloudflare",
          logoUrl: "/images/companies/plats/cloudflare.svg",
          description: "Web security and performance",
          siteUrl: "https://cloudflare.com",
        },
      },
      {
        standId: "A3",
        company: {
          name: "Freiheit",
          logoUrl: "/images/companies/plats/freiheit.svg",
          description: "Software engineering company",
          siteUrl: "https://freiheit.com",
        },
      },
      {
        standId: "A5",
        company: {
          name: "Single Store",
          logoUrl: "/images/companies/plats/single-store.svg",
          description: "The database for data-intensive apps",
          siteUrl: "https://singlestore.com",
        },
      },
      {
        standId: "B2",
        company: {
          name: "Axians",
          logoUrl: "/images/companies/plats/axians.svg",
          description: "ICT solutions and services",
          siteUrl: "https://axians.com",
        },
      },
      {
        standId: "B4",
        company: {
          name: "Start Campus",
          logoUrl: "/images/companies/plats/start-campus.svg",
          description: "Sustainable hyperscale data centers",
          siteUrl: "https://startcampus.pt",
        },
      },
      {
        standId: "C1",
        company: {
          name: "Dremio",
          logoUrl: "/images/companies/plats/dremio.png",
          description: "The easy and open data lakehouse",
          siteUrl: "https://dremio.com",
        },
      },
      {
        standId: "C3",
        company: {
          name: "Premium Minds",
          logoUrl: "/images/companies/plats/premium-minds.svg",
          description: "Software engineering for critical systems",
          siteUrl: "https://premium-minds.com",
        },
      },
    ],
    zoneSchedules: [
      {
        zoneId: "main-stage",
        speakers: [
          {
            name: "Diana Ribeiro",
            title: "Closing Keynote: Building the Future",
            description: "A vision for immersive computing.",
            companyName: "Cloudflare",
            time: "10:00",
          },
          {
            name: "Hugo Oliveira",
            title: "Edge Computing: The Next Frontier",
            description: "Infrastructure powering the modern web.",
            companyName: "Start Campus",
            time: "14:00",
          },
          {
            name: "Marta Ferreira",
            title: "Panel: Sustainability in Tech",
            description:
              "How tech companies can lead the sustainability movement.",
            companyName: "Freiheit",
            time: "16:30",
          },
        ],
      },
      {
        zoneId: "networking-lounge",
        speakers: [
          {
            name: "Rita Neves",
            title: "Workshop: Design Systems at Scale",
            description: "Tokens, components, and governance.",
            companyName: "Premium Minds",
            time: "11:00",
          },
        ],
      },
    ],
  },
];

// ─── Full venue config ───────────────────────────────────────────────
export const venueConfig: VenueConfig = {
  floor: { width: 50, depth: 40 },
  zones,
  stands,
  days,
};
