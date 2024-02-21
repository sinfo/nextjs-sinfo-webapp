'use client'

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import qrCodeIcon from "@/assets/icons/qr-code.png";
import cameraIconWhite from "@/assets/icons/camera.png";
import cameraIconBlue from "@/assets/icons/blueCamera.png";

import giftBoxIcon from "@/assets/icons/gift-box.png";
import attendeeLink from "@/assets/icons/link_card_attendee.png"
import companyLink from "@/assets/icons/link_card_company.png"

//TODO: add redirects

function RightIcon({ role } : { role: string}) {
  switch (role) {
    case "team":
    case "admin":
      return(
        <button className="flex gap-1">
        <Link href="/">
          <Image width={25} src={giftBoxIcon} alt="Gift Box Icon" />
        </Link>
      </button>
      );

    case "user":
      return(
        <button className="flex gap-1">
        <Link href="/">
          <Image width={30} src={attendeeLink} alt="Attendee Link Icon" />
        </Link>
      </button>
      );

    case "company":
      return(
        <button className="flex gap-1">
        <Link href="/">
          <Image width={30} src={companyLink} alt="Company Link Icon" />
        </Link>
      </button>
      );
  
    default:
      break;
  }
}

export default function ClientBottomNavbar({ user } : { user: any}) {
  const path = usePathname()
  return (
    <div className="flex flex-col items-center">
      <div className={`cameraIcon ${path == "/camera" ? "bg-white" : "bg-dark-blue"}`}>
          <Link className="flex gap-1" href="/camera">
            <Image width={35} src={path == "/camera" ? cameraIconBlue : cameraIconWhite} alt="Camera Icon" />
          </Link>
      </div>
      <div className="baseNav">
        <div className="baseNavIcons">
            <Link className={`flex gap-1 ${
              path == "/" 
              ? "" 
              : "border-dark-blue"
              } border-b-2 pb-1`} href="/">
              <Image width={30} src={qrCodeIcon} alt="QR Code Icon" />
            </Link>
          <RightIcon role={user.role}/>
        </div>
      </div>
    </div>
    
  );
}
