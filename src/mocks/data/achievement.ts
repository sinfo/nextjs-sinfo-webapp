import { MOCK_COMPANIES } from "./company";

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: "achievement_cv_1",
    name: "Upload your CV",
    img: "https://sinfo.ams3.cdn.digitaloceanspaces.com/static/27-sinfo/achievements/cv/cv.webp",
    value: 1000,
    kind: "cv",
    description: "Upload your CV to be shared with the companies.",
    users: ["mock_user_id", "other_user_id_1", "other_user_id_2"],
  },
  {
    id: "achievement_stand_1",
    name: "Visit Microsoft",
    img: "https://sinfo.ams3.cdn.digitaloceanspaces.com/static/27-sinfo/achievements/stands/stands_mercedes-benz_1.png",
    value: 50,
    kind: "stand",
    description: "Visit Microsoft.",
    company: MOCK_COMPANIES[3],
    users: ["other_user_id_1"],
  },
  {
    id: "achievement_stand_2",
    name: "Visit Google",
    img: "https://sinfo.ams3.cdn.digitaloceanspaces.com/static/27-sinfo/achievements/stands/stands_freiheit.com-technologies-gmbh_1.png",
    value: 50,
    kind: "stand",
    description: "Visit Google.",
    company: MOCK_COMPANIES[4],
    users: ["mock_user_id", "other_user_id_2"],
  },
  {
    id: "achievement_stand_3",
    name: "Visit Bliss Applications",
    img: "https://sinfo.ams3.cdn.digitaloceanspaces.com/static/27-sinfo/achievements/stands/stands_talkdesk_1.png",
    value: 50,
    kind: "stand",
    description: "Visit Bliss Applications.",
    company: MOCK_COMPANIES[6],
  },
  {
    id: "achievement_stand_4",
    name: "Visit Cloudflare",
    img: "https://sinfo.ams3.cdn.digitaloceanspaces.com/static/27-sinfo/achievements/stands/stands_deloitte_1.png",
    value: 50,
    kind: "stand",
    description: "Visit Cloudflare.",
    company: MOCK_COMPANIES[9],
    users: ["other_user_id_1", "other_user_id_2", "mock_user_id"],
  },
  {
    id: "achievement_presentation_1",
    name: "Syone presentation",
    img: "https://sinfo.ams3.cdn.digitaloceanspaces.com/static/27-sinfo/achievements/presentations/syone-software-solutions-27-sinfo.webp",
    value: 150,
    kind: "presentation",
    description: "Get to know Syone.",
  },
  {
    id: "achievement_presentation_2",
    name: "Diconium presentation",
    img: "https://sinfo.ams3.cdn.digitaloceanspaces.com/static/27-sinfo/achievements/presentations/diconium-vw-one-true-love-27-sinfo.webp",
    value: 150,
    kind: "presentation",
    description: "Get to know Diconium.",
    users: ["mock_user_id"],
  },
];
