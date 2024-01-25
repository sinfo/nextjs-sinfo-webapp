import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { headers } from 'next/headers';

import UserSignOut from "@/components/UserSignOut";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserService } from "@/services/UserService";

import qrCodeIcon from "@/assets/icons/qr-code.png";
import cameraIconWhite from "@/assets/icons/camera.png";
import cameraIconBlue from "@/assets/icons/blueCamera.png";

import giftBoxIcon from "@/assets/icons/gift-box.png";
import attendeeLink from "@/assets/icons/link_card_attendee.png"
import companyLink from "@/assets/icons/link_card_company.png"

//TODO: add redirects

function RightIcon({ role } : { role: string}) {
  console.log(role)
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

export default async function BottomNavbar() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user: User = await UserService.getMe(session.cannonToken);
  if (!user) return <UserSignOut />;

  let headersList = headers();
  let fullUrl = headersList.get('referer') || "";
  let urlObject = new URL(fullUrl);
  let path = urlObject.pathname;
  console.log(path)
  
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
