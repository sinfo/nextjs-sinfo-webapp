import { http, HttpResponse } from "msw";
import { MOCK_USER, MOCK_COMPANY } from "./data";

const BACKEND_URL = process.env.CANNON_URL;

export const handlers = [
  http.post(`${BACKEND_URL}/auth/*`, () => {
    return HttpResponse.json({
      token: "some_cannon_token",
    });
  }),
  http.get(`${BACKEND_URL}/users/me`, () => {
    return HttpResponse.json(MOCK_USER);
  }),
  http.put(`${BACKEND_URL}/users/me`, () => {
    return new Response(null, { status: 200 });
  }),
  http.get(`${BACKEND_URL}/company/*`, () => {
    return HttpResponse.json(MOCK_COMPANY);
  }),
];
