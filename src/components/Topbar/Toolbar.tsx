import { Image } from "next/dist/client/image-component";
import { webappLogo } from "@/assets/images";
import { HiMenu } from "react-icons/hi";
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import { signOut } from "next-auth/react";

export default function Toolbar( { toggleBurgerMenu }: { toggleBurgerMenu: () => void }) {
  async function handleExit() {
    await signOut();
  }

  return (
    <nav className="flex flex-row items-center justify-between py-5">
      <div className="ml-5">
        <HiMenu size={40} onClick={toggleBurgerMenu} />
      </div>

      <div className="flex-1 flex justify-center">
        <Image
          className="w-40"
          src={webappLogo}
          alt="SINFO WebApp logo"
          quality={100}
        />
      </div>

      <div className="mr-5">
        <HiArrowRightOnRectangle
          size={36}
          onClick={handleExit}
        />
      </div>
    </nav>
  );
}