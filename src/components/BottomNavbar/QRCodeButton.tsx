"use client";

import { QrCode } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function QRCodeButton() {
  const currPath = usePathname();

  // Using ReactContexts might be better than this
  if (
    currPath === "/qr" ||
    currPath.endsWith("/check-in") ||
    currPath.endsWith("/promote") ||
    currPath.endsWith("/profile/edit") ||
    currPath.endsWith("/scan")
  )
    return <></>;

  return (
    <Link href="/qr">
      <div className="absolute -top-20 right-4">
        <div className="p-4 rounded-full bg-sinfo-primary relative overflow-hidden">
          <QrCode size={32} />
          <div className="shine-effect" />
        </div>
      </div>
    </Link>
  );
}
