"use client";

import { Image } from "next/dist/client/image-component";
import { sinfoLogo } from "@/assets/images";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Menu, RefreshCcw } from "lucide-react";
import { useState } from "react";
import Sidebar from "./Sidebar";

export default function Toolbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const currPath = usePathname();

  const [isExpanded, setIsExpanded] = useState(false);

  const showMenu: boolean = currPath === "/home" || currPath === "/profile";

  return (
    <>
      <Sidebar show={isExpanded} onClose={() => setIsExpanded(false)} />
      <div className="bg-sinfo-primary container m-auto p-4 pb-2 flex flex-col gap-4">
        <nav className="flex flex-row items-center">
          <div className="w-1/6 flex justify-start items-center">
            {showMenu ? (
              <Menu
                size={32}
                className="cursor-pointer"
                onClick={() => setIsExpanded(true)}
              />
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
              src={sinfoLogo}
              alt="SINFO logo"
              quality={100}
            />
          </div>
          <div className="w-1/6 flex justify-end items-center">
            <RefreshCcw size={28} onClick={() => window.location.reload()} />
          </div>
        </nav>
        {currPath === "/home" && session?.user?.name && (
          <div className="text-lg">
            Welcome, <span className="font-semibold">{session.user.name}!</span>
          </div>
        )}
      </div>
    </>
  );
}
