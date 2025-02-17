"use client";

import { UserMinus, UserPlus } from "lucide-react";
import { ProfileButtonProps } from ".";
import { UserService } from "@/services/UserService";

export default function ConnectButton({
  cannonToken,
  user,
  otherUser,
  connections,
}: ProfileButtonProps) {
  if (user.id === otherUser.id) return <></>;

  const connection = connections.find((c) => c.to === otherUser.id);

  async function handleConnect() {
    const connection = await UserService.connect(cannonToken, otherUser.id);
    if (!connection) {
      alert("Failed to connect");
    }
    window.location.reload();
  }

  async function handleRemoveConnection() {
    const connection = await UserService.removeConnection(
      cannonToken,
      otherUser.id,
    );
    if (!connection) {
      alert("Failed to connect");
    }
    window.location.reload();
  }

  if (connection) {
    return (
      <button
        className="button-secondary text-sm"
        onClick={handleRemoveConnection}
      >
        <UserMinus size={16} />
        Remove connection
      </button>
    );
  } else {
    return (
      <button className="button-primary text-sm" onClick={handleConnect}>
        <UserPlus size={16} />
        Connect
      </button>
    );
  }
}
