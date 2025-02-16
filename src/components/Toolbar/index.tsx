"use client";

import { Image } from "next/dist/client/image-component";
import { sinfoLogo } from "@/assets/images";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Menu, RefreshCcw } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Sidebar from "./Sidebar";

export default function Toolbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const currPath = usePathname();

  const [isExpanded, setIsExpanded] = useState(false);

  const showMenu = ["/home", "/profile"].includes(currPath);

  return (
    <>
      <Sidebar show={isExpanded} onClose={() => setIsExpanded(false)} />
      <div className="sticky top-0 z-10 bg-sinfo-primary">
        <div className="container mx-auto p-4 flex flex-col gap-4">
          <nav className="flex flex-row items-center">
            <div className="w-1/6 flex justify-start items-center">
              {showMenu ? (
                <button onClick={() => setIsExpanded(true)}>
                  <Menu size={32} className="cursor-pointer" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (window.history.length > 2) {
                      router.back();
                    } else {
                      router.push("/home");
                    }
                  }}
                >
                  <ArrowLeft size={32} className="cursor-pointer" />
                </button>
              )}
            </div>
            <div className="flex-1">
              <Link href="/home">
                <Image
                  className="w-32 mx-auto"
                  src={sinfoLogo}
                  alt="SINFO logo"
                  quality={100}
                />
              </Link>
            </div>
            <div className="w-1/6 flex justify-end items-center">
              <button onClick={() => window.location.reload()}>
                <RefreshCcw size={28} />
              </button>
            </div>
          </nav>
          {currPath === "/home" && session?.user?.name && (
            <div className="text-lg">
              Welcome,{" "}
              <span className="font-semibold">{session.user.name}!</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
