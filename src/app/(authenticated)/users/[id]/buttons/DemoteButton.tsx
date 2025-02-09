"use client";

import { UserService } from "@/services/UserService";
import { isCompany, isMember } from "@/utils/utils";
import { ArrowBigDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProfileButtonProps } from ".";

export default function DemoteButton({
  cannonToken,
  user,
  otherUser,
}: ProfileButtonProps) {
  const router = useRouter();

  if (
    user.id === otherUser.id ||
    !isMember(user.role) ||
    (!isCompany(otherUser.role) && !isMember(otherUser.role))
  )
    return <></>;

  async function handleDemote() {
    if (await UserService.demote(cannonToken, otherUser.id)) router.refresh();
    else alert("Failed to demote!");
  }

  return (
    <button className="button-secondary text-sm" onClick={handleDemote}>
      <ArrowBigDown size={20} />
      Demote
    </button>
  );
}
