import { MOCK_USER } from ".";
import { MOCK_COMPANIES } from "./company";
import { MOCK_SPEAKERS } from "./speaker";

export const MOCK_SESSIONS: SINFOSession[] = [
  {
    id: "session_1",
    name: "Five Tips to Master Live Coding Interviews",
    kind: "Workshop",
    img: "https://sinfo.ams3.cdn.digitaloceanspaces.com/static/24-sinfo/companies/noesis.png",
    place: "Room 1",
    description:
      "Learn practical strategies and tips to excel in live coding interviews, hosted by industry experts.",
    company: MOCK_COMPANIES[11],
    date: "2024-12-01T12:00:00Z",
    duration: 90,
    event: "31",
    tickets: {
      needed: true,
      start: "2024-03-25T12:00:00Z",
      end: "2024-03-28T12:00:00Z",
      max: 10,
    },
  },
  {
    id: "session_2",
    name: "Get to Know Noesis",
    kind: "Presentation",
    img: "https://sinfo.ams3.cdn.digitaloceanspaces.com/static/24-sinfo/companies/noesis.png",
    place: "Room 2",
    description:
      "Discover what makes Noesis a leader in technology consulting and innovation.",
    company: MOCK_COMPANIES[11],
    date: "2025-02-17T08:00:00Z",
    duration: 20,
    event: "31",
    tickets: {},
  },
  {
    id: "session_3",
    name: "Deploy a Node.js App with Cloudflare Workers",
    kind: "Workshop",
    img: "https://static.sinfo.org/static%2F30-sinfo%2FcompanyLogos%2FCloudFlare-01.webp",
    place: "Room 1",
    description:
      "Hands-on session to learn how to deploy a scalable Node.js application using Cloudflare Workers.",
    company: MOCK_COMPANIES[9],
    date: "2025-02-18T09:00:00Z",
    duration: 90,
    event: "31",
    tickets: {
      needed: true,
      start: "2024-04-07T22:00:00Z",
      end: "2024-04-08T10:00:00Z",
      max: 31,
    },
  },
  {
    id: "session_4",
    name: "Prompt Like an Absolute Pro",
    kind: "Keynote",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png",
    place: "Auditorium",
    description:
      "A deep dive into crafting effective and powerful prompts to unlock AI's potential in creative workflows.",
    speakers: [MOCK_SPEAKERS[4]],
    date: "2025-02-18T08:00:00Z",
    duration: 120,
    event: "31",
    tickets: {
      needed: true,
      start: "2024-04-08T07:50:00Z",
      end: "2024-04-08T10:00:00Z",
      max: 20,
    },
  },
  {
    id: "session_5",
    name: "Git Basics",
    kind: "Workshop",
    img: "https://sinfo.ams3.cdn.digitaloceanspaces.com/static/24-sinfo/companies/bliss.png",
    place: "Room 2",
    description:
      "Master the fundamentals of Git version control to improve your collaboration and code management.",
    company: MOCK_COMPANIES[6],
    date: "2025-02-18T10:00:00Z",
    duration: 90,
    event: "31",
    tickets: {
      needed: true,
      start: "2024-04-09T07:10:00Z",
      end: "2024-04-10T22:00:00Z",
      max: 30,
    },
  },
  {
    id: "session_6",
    name: "Introducing Cloudflare",
    kind: "Presentation",
    img: "https://static.sinfo.org/static%2F30-sinfo%2FcompanyLogos%2FCloudFlare-01.webp",
    place: "Room 1",
    description:
      "Learn about Cloudflare's mission, services, and how it's shaping the future of the internet.",
    company: MOCK_COMPANIES[9],
    date: "2025-02-19T11:00:00Z",
    duration: 20,
    event: "31",
    tickets: {},
  },
];

export const MOCK_SESSION_WORKSHOP: SINFOSession = {
  id: "session_3",
  name: "Deploy a Node.js App with Cloudflare Workers",
  kind: "Workshop",
  place: "Room 1",
  description:
    "Hands-on session to learn how to deploy a scalable Node.js application using Cloudflare Workers.",
  company: MOCK_COMPANIES[9],
  date: "2025-02-18T09:00:00Z",
  duration: 90,
  event: "31",
  tickets: {
    needed: true,
    start: "2024-04-07T22:00:00Z",
    end: "2024-04-08T10:00:00Z",
    max: 31,
  },
  prize: {
    name: "FNAC Gift Card - 25€",
    img: "https://storemedia.repsolmove.com/s3fs-public/images/IMAGENS%20CATREPSOL%20MOVE-22.jpg?VersionId=84cwT8GJSRgvMaVlhCHB1uQh5riQSq9d",
  },
  extraInformation: [
    {
      type: "warning",
      title: "Requirements",
      content: "Bring your computer",
    },
  ],
};

export const MOCK_SESSION_KEYNOTE: SINFOSession = {
  id: "session_4",
  name: "Prompt Like an Absolute Pro",
  kind: "Keynote",
  img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png",
  place: "Auditorium",
  description:
    "A deep dive into crafting effective and powerful prompts to unlock AI's potential in creative workflows.",
  speakers: [MOCK_SPEAKERS[4]],
  date: "2025-02-18T08:00:00Z",
  duration: 120,
  event: "31",
  tickets: {
    needed: true,
    start: "2024-04-08T07:50:00Z",
    end: "2024-04-08T10:00:00Z",
    max: 20,
  },
  prize: {
    name: "Corsair Keyboard",
    img: "https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Gaming-Keyboards/CH-910941A-NA/Gallery/K70_PRO_OPX_PBT_01.webp",
  },
  participants: [MOCK_USER],
  unauthenticatedParticipants: 3,
};

export const MOCK_SESSION: SINFOSession = MOCK_SESSION_KEYNOTE;

export const MOCK_SESSION_STATUS: SINFOSessionStatus = {
  status: "success",
  participantsNumber: 25,
  unauthenticatedParticipantsNumber: 12,
};
