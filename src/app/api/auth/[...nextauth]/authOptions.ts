import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";

const CANNON_AUTH_ENDPOINT = process.env.CANNON_URL + "/auth";
const FENIX_AUTH_URL = process.env.FENIX_URL + "/oauth/userdialog";
const FENIX_TOKEN_URL = process.env.FENIX_URL + "/oauth/access_token";
const FENIX_PROFILE_URL = process.env.FENIX_URL + "/api/fenix/v1/person";
const FENIX_CALLBACK_URI = process.env.WEBAPP_URL + "/api/auth/callback/fenix";

export default {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID as string,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
      issuer: "https://www.linkedin.com/oauth",
      jwks_endpoint: "https://www.linkedin.com/oauth/openid/jwks",
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          firstname: profile.given_name,
          lastname: profile.family_name,
          email: profile.email,
        };
      },
    }),
    {
      id: "microsoft",
      name: "Microsoft",
      type: "oauth",
      idToken: true,
      wellKnown:
        "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration",
      authorization: {
        params: { scope: "openid email" },
      },
      async profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
        };
      },
      clientId: process.env.MICROSOFT_CLIENT_ID as string,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET as string,
    },
    {
      id: "fenix",
      name: "Fenix",
      type: "oauth",
      authorization: {
        url: FENIX_AUTH_URL,
        params: { scope: "" },
      },
      token: {
        async request({ params }) {
          if (params.code) {
            const url =
              FENIX_TOKEN_URL +
              "?" +
              new URLSearchParams({
                client_id: process.env.FENIX_CLIENT_ID as string,
                client_secret: process.env.FENIX_CLIENT_SECRET as string,
                redirect_uri: FENIX_CALLBACK_URI,
                grant_type: "authorization_code",
                code: params.code,
              });
            const resp = await fetch(url, {
              method: "POST",
            });
            if (resp.ok) {
              return { tokens: await resp.json() };
            }
          }
          return { tokens: {} };
        },
      },
      userinfo: FENIX_PROFILE_URL,
      async profile(profile) {
        return {
          id: profile.username,
          name: profile.name,
          email: profile.email,
          image: `https://fenix.tecnico.ulisboa.pt/user/photo/${profile.username}`,
        };
      },
      clientId: process.env.FENIX_CLIENT_ID as string,
      clientSecret: process.env.FENIX_CLIENT_SECRET as string,
    },
  ],
  callbacks: {
    async redirect() {
      return "/";
    },
    async jwt({ token, user, account }) {
      // The arguments user, account and profile are only passed the first time this callback is called
      // on a new session, after the user signs in. In subsequent calls, only token will be available.
      if (user) {
        const url = CANNON_AUTH_ENDPOINT + "/" + account?.provider;
        const resp = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ accessToken: account?.access_token }),
        });
        if (resp.ok) {
          token.cannonToken = (await resp.json()).token;
          token.loginWith = account?.provider ?? "";
        }
      }
      return token;
    },
    async session({ token, session }) {
      session.cannonToken = token.cannonToken;
      session.loginWith = token.loginWith;
      return session;
    },
  },
} as NextAuthOptions;
