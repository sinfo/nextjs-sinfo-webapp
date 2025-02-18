"use client";

import { Trash } from "lucide-react";

interface RemoveUserProps {
  userName: string;
  userId: string;
  handleRemoveUser(userId: string): Promise<void>;
}

export default function RemoveUser({
  userName,
  userId,
  handleRemoveUser,
}: RemoveUserProps) {
  async function removeUser() {
    if (window.confirm(`Do you really want to remove ${userName}?`)) {
      await handleRemoveUser(userId);
      window.location.reload();
    }
  }

  return (
    <button
      onClick={removeUser}
      className="size-8 flex items-center justify-center rounded-full shadow-md bg-red-800 text-white"
    >
      <Trash size={16} />
    </button>
  );
}
