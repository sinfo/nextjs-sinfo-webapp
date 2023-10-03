import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    cannonToken: string;
    loginWith: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    cannonToken: string;
    loginWith: string;
  }
}
