"use client";

import { Image } from "next/dist/client/image-component";
import { webappLogo } from "@/assets/images";
import { HiMenu } from "react-icons/hi";
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Toolbar() {
  const { data: session } = useSession();
  const currPath = usePathname();

  async function handleExit() {
    await signOut();
  }

  return (
    <>
      <nav className="flex flex-row items-center py-5">
        <div className="w-1/6">
          <HiMenu size={40} className="mx-auto" />
        </div>
        <div className="flex-1">
          <Image
            className="w-40 mx-auto"
            src={webappLogo}
            alt="SINFO WebApp logo"
            quality={100}
          />
        </div>
        <div className="w-1/6">
          {/* potentially temporary until we have an alternative way to logout */}
          <HiArrowRightOnRectangle
            size={36}
            className="mx-auto"
            onClick={handleExit}
          />
        </div>
      </nav>
      {currPath === "/home" && session?.user?.name && (
        <div className="px-5 pb-4 text-lg">
          Welcome, <span className="font-semibold">{session.user.name}!</span>
        </div>
      )}
    </>
  );
}
