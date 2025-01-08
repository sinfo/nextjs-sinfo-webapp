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
} from "./data";

const BACKEND_URL = process.env.CANNON_URL;

export const handlers = [
  // get cannon_token for the user
  http.post(`${BACKEND_URL}/auth/*`, () => {
    return HttpResponse.json({
      token: "some_cannon_token",
    });
  }),
  // get a specific user
  http.get(`${BACKEND_URL}/users/*`, () => {
    return HttpResponse.json(MOCK_USER);
  }),
  // get logged in user
  http.get(`${BACKEND_URL}/users/me`, () => {
    return HttpResponse.json(MOCK_USER);
  }),
  // update logged in user
  http.put(`${BACKEND_URL}/users/me`, () => {
    return new Response(null, { status: 200 });
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
  // get a specific session
  http.get(`${BACKEND_URL}/session/*`, () => {
    return HttpResponse.json(MOCK_SESSION);
  }),
  // get all sessions for the edition
  http.get(`${BACKEND_URL}/session`, () => {
    return HttpResponse.json(MOCK_SESSIONS);
  }),
];
