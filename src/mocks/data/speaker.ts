import { MOCK_SESSIONS } from "./session";

export const MOCK_SPEAKERS: Speaker[] = [
  {
    id: "speaker_1",
    name: "Amy Hennig",
    description:
      "30 years’ experience in the interactive industry as a writer and director of award-winning AAA narrative game experiences, most notably Sony Computer Entertainment’s acclaimed, billion-dollar Uncharted franchise.\n\nSpecialties: Creative Direction, Worldbuilding and Narrative Design, Story and Screenwriting, Game Design, Performance Capture Direction and Virtual Production, Casting, VO Direction",
    title: "Creative Director and Writer",
    img: "https://cdn.mos.cms.futurecdn.net/vx2SDJK7S3SLNiq8RUJ2LA-1200-80.png",
    company: {
      name: "Bliss",
      img: "https://sinfo.ams3.cdn.digitaloceanspaces.com/static/24-sinfo/companies/bliss.png",
    },
  },
  {
    id: "speaker_2",
    name: "Ben Vandenberghe",
    description:
      "CEO at Skyline Communications. Specialties: Open end-to-end multi-vendor network management solutions for the IPTV, HFC broadband, satellite and broadcast industry.",
    title: "CEO, Skyline Communications",
    img: "https://pbs.twimg.com/profile_images/1030128786438729728/LI44Gg77_400x400.jpg",
  },
  {
    id: "speaker_3",
    name: "Bill Gates",
    description:
      "Philanthropist, entrepreneur, and co-founder of Microsoft. Known for his significant contributions to technology and global health initiatives through the Bill & Melinda Gates Foundation.",
    title: "Co-Founder, Microsoft",
    img: "https://pbs.twimg.com/profile_images/1674815862879178752/nTGMV1Eo_400x400.jpg",
    company: {
      name: "Microsoft",
      img: "https://sinfo.ams3.cdn.digitaloceanspaces.com/static/25-sinfo/companies/microsoft.png",
    },
  },
  {
    id: "speaker_4",
    name: "David Miotke",
    description:
      "Dave Miotke is an experienced Producer who lives, breathes, and dreams Video Games; especially simulation! Working closely with multi-disciplinary, cross-functional teams to create something magical is where he always wants to be. For the last 15 years, he has been working as a developer at Maxis and on The Sims. Early in a project, he helps to pitch and refine ideas and concepts. If a pitch is green-lit, he helps to further clarify and prioritize features for the pack as well as communicate the intent and ongoing progress team-wide. Later in the project, he helps to evaluate the software and plan for iteration and/or additions to maintain a high-quality bar for the players.",
    title: "Producer, Maxis (The Sims)",
    img: "https://media.contentapi.ea.com/content/dam/www-thesims/2017/02/DaveMiotke_SGNinja.jpg.adapt.crop16x9.575p.jpg",
    company: {
      name: "Cloudflare",
      img: "https://static.sinfo.org/static%2F30-sinfo%2FcompanyLogos%2FCloudFlare-01.webp",
    },
  },
  {
    id: "speaker_5",
    name: "Manuel Sousa",
    description:
      "Experienced Information Security Engineer specializing in protecting data and systems for large-scale organizations. Skilled in cybersecurity strategy, threat analysis, and implementing secure protocols.",
    title: "Information Security Engineer @ Google",
    img: "https://media.licdn.com/dms/image/v2/D5603AQH5kR-KsoQnYA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1710492770943?e=1739404800&v=beta&t=04t380W5KVYBf6HGEoncTCO77XuzTQW-UFmqc3Ss95U",
    company: {
      name: "Google",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png",
    },
  },
];

export const MOCK_SPEAKER: Speaker = {
  id: "speaker_5",
  name: "Manuel Sousa",
  description:
    "Experienced Information Security Engineer specializing in protecting data and systems for large-scale organizations. Skilled in cybersecurity strategy, threat analysis, and implementing secure protocols.",
  title: "Information Security Engineer @ Google",
  img: "https://media.licdn.com/dms/image/v2/D5603AQH5kR-KsoQnYA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1710492770943?e=1739404800&v=beta&t=04t380W5KVYBf6HGEoncTCO77XuzTQW-UFmqc3Ss95U",
  company: {
    name: "Google",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png",
  },
  sessions: [
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
  ],
};
