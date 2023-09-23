"use client";

import { signOut, useSession } from "next-auth/react";
import { Image } from "next/dist/client/image-component";

import exitIcon from "@/assets/icons/exit.png";
import menuIcon from "@/assets/icons/menu.png";

export default function Navbar() {
  const { status } = useSession();

  async function handleExit() {
    await signOut();
  }

  return (
    <nav className="h-20 flex flex-row-reverse justify-between items-center px-5 font-bold text-lg">
      <button className="flex gap-1" onClick={handleExit}>
        Exit
        <Image src={exitIcon} alt="Exit Icon" className="w-6" />
      </button>
      {status === "authenticated" && (
        <Image src={menuIcon} alt="Menu Icon" className="w-12" />
      )}
    </nav>
  );
}
