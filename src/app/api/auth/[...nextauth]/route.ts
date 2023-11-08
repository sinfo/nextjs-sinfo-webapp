import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";

const CANNON_AUTH_URL = process.env.CANNON_URL + "/auth";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID as string,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
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
      async profile(profile, token) {
        return {
          id: profile.sub,
          email: profile.email,
        };
      },
      clientId: process.env.MICROSOFT_CLIENT_ID as string,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET as string,
    },
    // {
    //   id: "fenix", 
    //   name: "Fenix", 
    //   type: "oauth", 
    //   authorization: {
    //     url: "https://fenix.tecnico.ulisboa.pt/oauth/userdialog",
    //     params: { scope: ""}
    //   },
    //   token: "https://fenix.tecnico.ulisboa.pt/oauth/access_token",
    //   userinfo: "https://fenix.tecnico.ulisboa.pt/api/fenix/v1/person",
    //   async profile(profile, tokens) {
    //     return {
    //       id: profile.username,
    //       name: profile.name,
    //       email: profile.email,
    //       image: `https://fenix.tecnico.ulisboa.pt/user/photo/${profile.username}`
    //     }
    //   },
    //   clientId: process.env.FENIX_CLIENT_ID as string,
    //   clientSecret: process.env.FENIX_CLIENT_SECRET as string,
    // }
  ],
  callbacks: {
    async redirect() {
      return "/";
    },
    async jwt({ token, user, account }) {
      // The arguments user, account and profile are only passed the first time this callback is called
      // on a new session, after the user signs in. In subsequent calls, only token will be available.
      if (user) {
        const authURL = CANNON_AUTH_URL + "/" + account?.provider;
        const resp = await fetch(authURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ accessToken: account?.access_token }),
        });
        if (resp.ok) {
          const cannonToken = (await resp.json()).token;
          token.cannonToken = cannonToken;
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
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
