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
    presenters: [MOCK_COMPANIES[11]],
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
    presenters: [MOCK_COMPANIES[11]],
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
    presenters: [MOCK_COMPANIES[9]],
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
    img: "https://media.licdn.com/dms/image/v2/D5603AQH5kR-KsoQnYA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1710492770943?e=1739404800&v=beta&t=04t380W5KVYBf6HGEoncTCO77XuzTQW-UFmqc3Ss95U",
    place: "Auditorium",
    description:
      "A deep dive into crafting effective and powerful prompts to unlock AI's potential in creative workflows.",
    presenters: [MOCK_SPEAKERS[4]],
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
    presenters: [MOCK_COMPANIES[6]],
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
    presenters: [MOCK_COMPANIES[9]],
    date: "2025-02-19T11:00:00Z",
    duration: 20,
    event: "31",
    tickets: {},
  },
];
