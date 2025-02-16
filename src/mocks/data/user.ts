import { MOCK_ACHIEVEMENTS } from "./achievement";
import { MOCK_EVENT } from "./event";

export const MOCK_USER: User = {
  id: "mock_user_id",
  name: "Bill Gates",
  title: "CEO @ Microsoft",
  img: "https://media.licdn.com/dms/image/v2/D5603AQHv6LsdiUg1kw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1695167344576?e=1737590400&v=beta&t=U88-qdsyfBJ_2IjA08tPPNCpAAKXDQ9NbsI-rqoeiNo",
  contacts: {
    linkedin: "williamhgates",
    email: "gatesybill@gmail.com",
    github: "billgates",
  },
  role: "team",
  bearer: [],
  mail: "gatesybill@gmail.com",
  registered: "2024-07-21T23:02:19.167Z",
  updated: "2024-11-16T23:02:19.167Z",
  signatures: [
    {
      edition: MOCK_EVENT.id,
      day: new Date().toISOString(),
      redeemed: false,
      signatures: MOCK_ACHIEVEMENTS.filter(
        (a) => a.kind === "stand" && a.users?.includes("mock_user_id")
      ).map(
        (a, idx) =>
          ({
            companyId: a.company?.id ?? "",
            date: new Date(Date.now() - idx * 5 * 60 * 1000).toISOString(), // 5 minute difference
          }) as SINFOSignature
      ),
    },
  ],
  skills: ["Python", "Git", "Github", "React", "NodeJS"],
};

export const MOCK_OTHER_USER: User = {
  id: "other_user_id_1",
  name: "Zark Muckerberg",
  title: "CEO @ Meta",
  img: "https://s.yimg.com/ny/api/res/1.2/GLHIAcBCGu77FLFmPc8ObA--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTY0MA--/https://media.zenfs.com/en/nbc_today_217/1f5be50c0b4beae5c873e1c78bd0fd36",
  role: "user",
  bearer: [],
  mail: "mark@gmail.com",
  registered: "2024-05-21T23:02:19.167Z",
  updated: "2024-11-11T23:02:19.167Z",
  signatures: [
    {
      edition: MOCK_EVENT.id,
      day: new Date().toISOString(),
      redeemed: false,
      signatures: MOCK_ACHIEVEMENTS.filter(
        (a) => a.kind === "stand" && a.users?.includes("other_user_id_1")
      ).map(
        (a, idx) =>
          ({
            companyId: a.company?.id ?? "",
            date: new Date(Date.now() - idx * 5 * 60 * 1000).toISOString(), // 5 minute difference
          }) as SINFOSignature
      ),
    },
  ],
};

export const MOCK_USER_QR_CODE: string =
  "sinfo://eyJhbGciOiJIUzI1NiIsInR5cCI6IlNJTkZPIn0.eyJzdWIiOiJ1c2VyIiwidXNlciI6eyJpZCI6Im1vY2tfdXNlcl9pZCIsIm5hbWUiOiJKb2huIERvZSIsImltZyI6Imh0dHBzOi8vbWVkaWEubGljZG4uY29tL2Rtcy9pbWFnZS92Mi9ENTYwM0FRSHY2THNkaVVnMWt3L3Byb2ZpbGUtZGlzcGxheXBob3RvLXNocmlua180MDBfNDAwL3Byb2ZpbGUtZGlzcGxheXBob3RvLXNocmlua180MDBfNDAwLzAvMTY5NTE2NzM0NDU3Nj9lPTE3Mzc1OTA0MDAmdj1iZXRhJnQ9VTg4LXFkc3lmQkpfMklqQTA4dFBQTkNwQUFLWERROU5ic0ktcnFvZWlObyIsInJvbGUiOiJ1c2VyIn0sImV4cCI6IjQxMDI0NDQ4MDAifQ.U84gaw-yp7b3Aakt4lYC_REwvDGwvbL_Nn28RqbqyAA";
