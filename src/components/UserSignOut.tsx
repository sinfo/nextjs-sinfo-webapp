"use client";

import { signOut } from "next-auth/react";

export default function UserSignOut() {
  signOut();
  return <></>;
}
