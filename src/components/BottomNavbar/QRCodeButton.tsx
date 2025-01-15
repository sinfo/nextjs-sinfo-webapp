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
    currPath.endsWith("/promote")
  )
    return <></>;

  return (
    <Link
      href="/qr"
      className="absolute -top-20 right-4 p-4 rounded-full bg-sinfo-primary"
    >
      <QrCode size={32} />
    </Link>
  );
}
