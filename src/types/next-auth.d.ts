import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
    loginWith: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    loginWith: string;
  }
}
