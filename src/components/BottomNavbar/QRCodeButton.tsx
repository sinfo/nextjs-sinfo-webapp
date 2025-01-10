"use client";

import { QrCode } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function QRCodeButton() {
  const currPath = usePathname();

  if (currPath === "/qr") return <></>;

  return (
    <Link
      href="/qr"
      className="absolute -top-20 right-4 p-4 rounded-full bg-blue-dark"
    >
      <QrCode size={32} />
    </Link>
  );
}
