"use client";

import { UserPlus } from "lucide-react";
import { ProfileButtonProps } from ".";

export default function ConnectButton({
  cannonToken,
  user,
  otherUser,
}: ProfileButtonProps) {
  if (user.id === otherUser.id) return <></>;

  return (
    <button className="button-primary text-sm">
      <UserPlus size={16} />
      Connect
    </button>
  );
}
