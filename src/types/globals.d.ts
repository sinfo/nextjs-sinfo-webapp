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
  shareLinks: boolean;
  company:
    | []
    | [
        {
          edition: string;
          company: string;
        },
      ];
  signatures:
    | []
    | [
        {
          day: string;
          edition: string;
          redeemed: boolean;
          signatures: { companyId: string; date: Date }[];
        },
      ];
  linkShared:
    | []
    | [
        {
          // edition: String,
          // links:[{
          //   id: String,
          // }]
          id: String;
        },
      ];
  mail?: string;
  bearer:
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
  registered: string;
  updated: string;
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
  members?: CompanyMember[];
  stands?: Stand[];
  standDetails?: StandDetails;
};

type CompanyMember = {
  id: string;
  name: string;
  img?: string;
  role?: string;
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
