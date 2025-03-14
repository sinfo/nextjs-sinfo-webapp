type UserRole = "Attendee" | "Company" | "Member" | "Admin"; // only in the webapp, roles in cannon are different

type User = {
  id: string;
  name: string;
  img: string;
  role: string;
  title?: string;
  nationality?: string;
  contacts?: {
    linkedin?: string;
    email?: string;
    github?: string;
  };
  signatures?: {
    edition: string;
    day: string;
    redeemed: boolean;
    signatures: SINFOSignature[];
  }[];
  company?: {
    edition: string;
    company: string;
  }[];
  skills?: string[];
  interestedIn?: string[];
  lookingFor?: string[];
  academicInformation?: {
    school: string;
    degree: string;
    field: string;
    grade?: string;
    start: string;
    end: string;
  }[];
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

type Connection = {
  from: string;
  to: string;
  edition: string;
  notes?: string;
  created?: string;
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
  users?: string[];
  unregisteredUsers?: number;
  updated?: string;
};

type DownloadLinks = {
  all?: string;
  companyConnections?: string;
};

type SINFOSignature = {
  companyId: string;
  date: string;
  _id: string;
};

type Company = {
  id: string;
  name: string;
  img: string;
  site?: string;
  advertisementLvl?: string; // TODO: This might not be a string
  sessions?: SINFOSession[];
  members?: User[];
  stands?: Stand[];
  standDetails?: StandDetails;
};

type Stand = {
  standId: string;
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
    name?: string;
    img?: string;
  };
  sessions?: SINFOSession[];
  updated?: string;
};

type SINFOSession = {
  id: string;
  name: string;
  description: string;
  kind: string;
  event: string;
  date: string;
  duration: int; // minutes
  place: string;
  img?: string;
  company?: Company;
  speakers?: Speaker[];
  updated?: string;
  tickets?: { needed?: boolean; start?: string; end?: string; max?: number };
  prize?: Prize;
  extraInformation?: {
    type: "info" | "warning" | "danger";
    title?: string;
    content?: string;
  }[];
  users?: string[];
  unregisteredUsers?: number;
};

type SINFOSessionStatus = {
  status: "success" | "already" | "failed";
  participants: string[];
  unregisteredParticipants: number;
};

type Prize = {
  id: string;
  edition: string;
  name: string;
  img: string;
  sessions?: string[];
  days?: string[];
  cv?: boolean;
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

type QRCodeKind = "user" | "achievement";

type QRCode = {
  kind: QRCodeKind;
};

type QRCode = {
  kind: "user";
  user: User;
};
