"use client";

import { Image } from "next/dist/client/image-component";
import { sinfoLogo } from "@/assets/images";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, LogOut, Menu, RefreshCcw } from "lucide-react";
import { UserService } from "@/services/UserService";
import { convertToAppRole } from "@/utils/utils";
import BurgerBar from "@/components/BurgerBar";

export default function Toolbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const currPath = usePathname();
  const [showBurgerBar, setShowBurgerBar] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const showMenu: boolean = currPath === "/home" || currPath === "/profile";

  async function handleExit() {
    await signOut();
  }

  useEffect(() => {
    async function fetchUserRole() {
      if (session?.user) {
        const user = await UserService.getMe(session.cannonToken);
        if (user) {
          const role = convertToAppRole(user.role);
          setUserRole(role);
        }
      }
    }
    fetchUserRole();
  }, [session]);

  return (
    <div className="bg-sinfo-primary">
      <div className="container m-auto p-4">
        <nav className="flex flex-row items-center">
          <div className="w-1/6 flex justify-start items-center">
            {showMenu ? (
              <Menu size={32} className="cursor-pointer" onClick={() => setShowBurgerBar(true)} />
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
          <div className="w-1/6 flex justify-end items-center gap-x-2">
            {/* potentially temporary until we have an alternative way to logout */}
            <RefreshCcw size={32} onClick={() => window.location.reload()} />
            <LogOut size={32} onClick={handleExit} />
          </div>
        </nav>
        {currPath === "/home" && session?.user?.name && (
          <div className="mt-4 text-lg">
            Welcome, <span className="font-semibold">{session.user.name}!</span>
          </div>
        )}
      </div>
      {showBurgerBar && userRole && <BurgerBar userRole={userRole} onCloseAction={() => setShowBurgerBar(false)} />}
    </div>
  );
}
