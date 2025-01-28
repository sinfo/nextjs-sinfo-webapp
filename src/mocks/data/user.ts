import { MOCK_ACHIEVEMENTS } from "./achievement";

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
  editionAchievements: [
    {
      achievement: MOCK_ACHIEVEMENTS[0],
      achieved: "2025-02-20T11:13:23.822Z",
    },
    {
      achievement: MOCK_ACHIEVEMENTS[1],
      achieved: "2025-02-20T13:27:23.822Z",
    },
    {
      achievement: MOCK_ACHIEVEMENTS[2],
      achieved: "2025-01-21T10:33:23.822Z",
    },
    {
      achievement: MOCK_ACHIEVEMENTS[3],
      achieved: "2025-01-21T10:56:23.822Z",
    },
    {
      achievement: MOCK_ACHIEVEMENTS[4],
      achieved: "2025-01-21T11:07:23.822Z",
    },
  ],
  connections: [],
  role: "user",
  bearer: [],
  mail: "gatesybill@gmail.com",
  registered: "2024-07-21T23:02:19.167Z",
  updated: "2024-11-16T23:02:19.167Z",
  lastSpin: "2025-01-21T10:41:09.822Z",
};

export const MOCK_USER_QR_CODE: string =
  "sinfo://eyJhbGciOiJIUzI1NiIsInR5cCI6IlNJTkZPIn0.eyJzdWIiOiJ1c2VyIiwidXNlciI6eyJpZCI6Im1vY2tfdXNlcl9pZCIsIm5hbWUiOiJKb2huIERvZSIsImltZyI6Imh0dHBzOi8vbWVkaWEubGljZG4uY29tL2Rtcy9pbWFnZS92Mi9ENTYwM0FRSHY2THNkaVVnMWt3L3Byb2ZpbGUtZGlzcGxheXBob3RvLXNocmlua180MDBfNDAwL3Byb2ZpbGUtZGlzcGxheXBob3RvLXNocmlua180MDBfNDAwLzAvMTY5NTE2NzM0NDU3Nj9lPTE3Mzc1OTA0MDAmdj1iZXRhJnQ9VTg4LXFkc3lmQkpfMklqQTA4dFBQTkNwQUFLWERROU5ic0ktcnFvZWlObyIsInJvbGUiOiJ1c2VyIn0sImV4cCI6IjQxMDI0NDQ4MDAifQ.U84gaw-yp7b3Aakt4lYC_REwvDGwvbL_Nn28RqbqyAA";
