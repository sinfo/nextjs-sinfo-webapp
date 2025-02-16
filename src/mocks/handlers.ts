import { http, HttpResponse } from "msw";
import {
  MOCK_USER,
  MOCK_COMPANY,
  MOCK_COMPANIES,
  MOCK_SESSIONS,
  MOCK_EVENT,
  MOCK_SPEAKERS,
  MOCK_SESSION,
  MOCK_SPEAKER,
  MOCK_USER_QR_CODE,
  MOCK_SESSION_STATUS,
  MOCK_ACHIEVEMENTS,
  MOCK_OTHER_USER,
} from "./data";

const BACKEND_URL = process.env.CANNON_URL;

export const handlers = [
  // get latest sinfo event
  http.get(`${BACKEND_URL}/event/latest`, () => {
    return HttpResponse.json(MOCK_EVENT);
  }),
  // get cannon_token for the user
  http.post(`${BACKEND_URL}/auth/*`, () => {
    return HttpResponse.json({
      token: "some_cannon_token",
    });
  }),
  // get logged in user
  http.get(`${BACKEND_URL}/users/me`, () => {
    return HttpResponse.json(MOCK_USER);
  }),
  // update logged in user
  http.put(`${BACKEND_URL}/users/me`, () => {
    return new Response(null, { status: 200 });
  }),
  // get logged in user connections
  http.get(`${BACKEND_URL}/users/me/connections`, () => {
    return HttpResponse.json([]);
  }),
  // get user QR-Code
  http.get(`${BACKEND_URL}/users/qr-code`, () => {
    return HttpResponse.json({ data: MOCK_USER_QR_CODE });
  }),
  // get a specific user
  http.get(`${BACKEND_URL}/users/*`, () => {
    return HttpResponse.json(MOCK_OTHER_USER);
  }),
  // get a specific company connections
  http.get(`${BACKEND_URL}/company/*/connections`, () => {
    return HttpResponse.json([
      MOCK_OTHER_USER,
      MOCK_OTHER_USER,
      MOCK_OTHER_USER,
      MOCK_OTHER_USER,
      MOCK_OTHER_USER,
    ]);
  }),
  // get a specific company
  http.get(`${BACKEND_URL}/company/*`, () => {
    return HttpResponse.json(MOCK_COMPANY);
  }),
  // get all companies for the edition
  http.get(`${BACKEND_URL}/company`, () => {
    return HttpResponse.json(MOCK_COMPANIES);
  }),
  // get a specific speaker
  http.get(`${BACKEND_URL}/speaker/*`, () => {
    return HttpResponse.json(MOCK_SPEAKER);
  }),
  // get all speakers for the edition
  http.get(`${BACKEND_URL}/speaker`, () => {
    return HttpResponse.json({
      eventId: MOCK_EVENT,
      speakers: MOCK_SPEAKERS,
      previousEdition: false,
    });
  }),
  // session check-in
  http.post(`${BACKEND_URL}/session/*/check-in`, () => {
    return HttpResponse.json(MOCK_SESSION_STATUS);
  }),
  // get a specific session
  http.get(`${BACKEND_URL}/session/*`, () => {
    return HttpResponse.json(MOCK_SESSION);
  }),
  // get all sessions for the edition
  http.get(`${BACKEND_URL}/session`, () => {
    return HttpResponse.json(MOCK_SESSIONS);
  }),
  // get all achievements for the edition
  http.get(`${BACKEND_URL}/achievements`, () => {
    return HttpResponse.json(MOCK_ACHIEVEMENTS);
  }),
];
