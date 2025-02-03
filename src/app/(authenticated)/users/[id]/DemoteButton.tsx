"use client";

import { UserService } from "@/services/UserService";
import { ThumbsDown } from "lucide-react";
import { useRouter } from "next/navigation";

interface DemoteButtonProps {
  cannonToken: string;
  userId: string;
}

export default function DemoteButton({
  cannonToken,
  userId,
}: DemoteButtonProps) {
  const router = useRouter();

  async function handleDemote() {
    if (await UserService.demote(cannonToken, userId)) router.refresh();
    else alert("Failed to demote!");
  }

  return (
    <button
      className="button-primary !bg-sinfo-secondary text-sm w-full mt-2"
      onClick={handleDemote}
    >
      <ThumbsDown size={16} />
      Demote
    </button>
  );
}
