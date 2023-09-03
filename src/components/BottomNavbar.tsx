import Link from "next/link";
import Image from "next/image";

import qrCodeIcon from "../assets/icons/qr-code.png";
import cameraIcon from "../assets/icons/camera.png";
import giftBoxIcon from "../assets/icons/gift-box.png";

export default function BottomNavbar() {
  return (
    <div className="fixed bottom-0 w-full bg-dark-blue flex justify-between items-center h-20 px-16">
      <Link href="/">
        <Image width={30} src={qrCodeIcon} alt="QR Code Icon" />
      </Link>
      <Link href="/">
        <Image width={35} src={cameraIcon} alt="Camera Icon" />
      </Link>
      <Link href="/">
        <Image width={25} src={giftBoxIcon} alt="Gift Box Icon" />
      </Link>
    </div>
  );
}
