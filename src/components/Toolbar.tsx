"use client";

import { Image } from "next/dist/client/image-component";
import { webappLogo } from "@/assets/images";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, LogOut, Menu } from "lucide-react";

export default function Toolbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const currPath = usePathname();

  const showMenu: boolean = currPath === "/home" || currPath === "/profile";

  async function handleExit() {
    await signOut();
  }

  return (
    <div className="container m-auto p-4">
      <nav className="flex flex-row items-center">
        <div className="w-1/6 flex justify-start items-center">
          {showMenu ? (
            <Menu size={32} />
          ) : (
            <ArrowLeft
              size={32}
              className="cursor-pointer"
              onClick={() => {
                router.back();
              }}
            />
          )}
        </div>
        <div className="flex-1">
          <Image
            className="w-32 mx-auto"
            src={webappLogo}
            alt="SINFO WebApp logo"
            quality={100}
          />
        </div>
        <div className="w-1/6 flex justify-end items-center">
          {/* potentially temporary until we have an alternative way to logout */}
          <LogOut size={32} onClick={handleExit} />
        </div>
      </nav>
      {currPath === "/home" && session?.user?.name && (
        <div className="mt-4 text-lg">
          Welcome, <span className="font-semibold">{session.user.name}!</span>
        </div>
      )}
    </div>
  );
}
