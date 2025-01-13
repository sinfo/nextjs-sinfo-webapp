type UserRole = "Attendee" | "Company" | "Member" | "Admin";

type User = {
  id: string;
  name: string;
  img: string;
  role: string;
  title?: string;
  contacts?: {
    linkedin?: string;
    email?: string;
    github?: string;
  };
  achievements?: Achievement[];
  connections?: User[];
  company?: Company;
  mail?: string;
  bearer?:
    | []
    | [
        {
          token: string;
          refreshToken: string;
          ttl: number;
          date: string;
        },
      ];
  facebook?: { id: string };
  linkedin?: { id: string };
  google?: { id: string };
  fenix?: { id: string };
  points?: number;
  registered?: string;
  updated?: string;
};

type AchievementKind =
  | "cv"
  | "stand"
  | "standDay"
  | "secret"
  | "session"
  | "presentation"
  | "workshop"
  | "keynote"
  | "other";

type Achievement = {
  id: string;
  name: string;
  description?: string;
  img: string;
  value: number;
  kind: AchievementKind;
  validity?: {
    from: string;
    to: string;
  };
  session?: Session;
  company?: Company;
  updated?: string;
};

type Company = {
  id: string;
  name: string;
  site?: string;
  advertisementLvl: string;
  img: string;
  contacts?: {
    linkedin?: string;
    email?: string;
    website?: string;
  };
  sessions?: SINFOSession[];
  members?: User[];
  stands?: Stand[];
  standDetails?: StandDetails;
};

type Stand = {
  id: string;
  date: string;
};

type StandDetails = {
  chairs: number;
  table: boolean;
  lettering: boolean;
};

type Speaker = {
  id: string;
  name: string;
  description: string;
  title: string;
  img: string;
  company?: {
    name: string;
    img?: string;
  };
  sessions?: SINFOSession[];
  updated?: string;
};

type SINFOSession = {
  id: string;
  name: string;
  kind: string;
  img?: string;
  place: string;
  description: string;
  company?: Company;
  speakers?: Speaker[];
  date: string;
  duration: int; // minutes
  updated?: string;
  event: string;
  tickets: { needed?: boolean; start?: string; end?: string; max?: number };
  prize?: Prize;
  breakfast?: bool;
  extraInformation?: {
    type: "info" | "warning" | "danger";
    title?: string;
    content?: string;
  }[];
  participants?: User[];
  unauthenticatedParticipants?: number;
};

type Prize = {
  name: string;
  img: string;
};

type SINFOEvent = {
  id: string;
  name: string;
  kind: string;
  date: string;
  updated?: string;
  duration?: string;
  begin?: string;
  end?: string;
  isOcurring?: boolean;
  calendarUrl: string;
};

type SINFOFileKind = "cv";

type SINFOFile = {
  id: string;
  kind: SINFOFileKind;
  user: string;
  name: string;
  extension: string;
  updated: string;
};
