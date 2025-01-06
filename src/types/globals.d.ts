type UserRole = "Attendee" | "Company" | "Member" | "Admin";

type User = {
  id: string;
  name: string;
  img: string;
  role: string;
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
  companyImg?: string;
  updated?: string;
};

type SINFOSession = {
  id: string;
  name: string;
  kind: string;
  img: string;
  place: string;
  description: string;
  presenters: (Speaker | Company)[];
  date: string;
  duration: int; // minutes
  updated?: string;
  event: string;
  tickets: { needed?: boolean; start?: string; end?: string; max?: number };
  surveyNeeded?: boolean;
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
