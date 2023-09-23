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
      // authorization: { params: { scope: "openid profile email" } },
    }),
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
          const { userId } = await resp.json();
          token.userId = userId;
        }
      }
      token.loginWith = account?.provider ?? "";
      return token;
    },
    async session({ token, session }) {
      session.user.id = token.userId;
      session.loginWith = token.loginWith;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
