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
        }
      ];
  signatures:
    | []
    | [
        {
          day: string;
          edition: string;
          redeemed: boolean;
          signatures: {
            companyId: string;
            date: Date;
          }[];
        }
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
        }
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
        }
      ];
  facebook?: {
    id: string;
  };
  linkedin?: {
    id: string;
  };
  google?: {
    id: string;
  };
  fenix?: {
    id: string;
  };
  points?: number;
  registered: string;
  updated: string;
};

type Company = {
  id: string;
  name: string;
  advertisementLvl: string;
  img: string;
};

type Speaker = {
  id: string;
  description: string;
  name: string;
  title: string;
  img: string;
  companyImg: string;
  updated: string;
}

type Session = {
  id: string;
  name: string;
  kind: string;
  img: string;
  place: string;
  description: string;
  speakers: Array<Speaker>;
  companies: Array<Company>;
  date: string;
  duration: string;
  updated: string;
  event: string;
  tickets: {
    needed: boolean,
    start: string,
    end: string,
    max: number
  };
  surveyNeeded: boolean;
}